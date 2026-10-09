import { createHmac } from 'node:crypto'
import { prisma } from '@/lib/db'
import { emailButton, emailFields, emailStack, getFromAddress, getSiteUrl, renderEmailLayout } from '@/lib/email-layout'

const RESEND_EMAILS_URL = 'https://api.resend.com/emails'
// Même valeur de repli que app/api/assistant/route.js et le reste du site.
const DEFAULT_ADMIN_EMAIL = 'wthomasss06@gmail.com'

const MAX_ATTEMPTS = 5
const RETRY_DELAYS_MS = [60_000, 5 * 60_000, 15 * 60_000, 60 * 60_000]
const REQUEST_TIMEOUT_MS = 8_000
const STALE_PROCESSING_MS = 2 * 60_000
const MAX_BATCH_SIZE = 20
const RETENTION_DAYS = 30

// Plafond d'alertes créées par jour UTC et par type. Sans lui, un pic de
// trafic (ou un script) épuiserait le quota d'envoi Resend et bloquerait les
// courriels qui comptent vraiment (leads, devis). Au-delà, l'événement reste
// visible dans le dashboard, seul l'e-mail est ignoré.
const DAILY_LIMITS = { NEW_VISITOR: 40, CHAT_INTENT: 25 }

const EVENT_TITLES = {
  NEW_VISITOR: 'Nouvelle visite sur AKATech',
  CHAT_INTENT: 'Nouveau prospect intéressé par un devis',
}

function safeText(value, maxLength = 500) {
  return typeof value === 'string'
    ? value.replace(/[\u0000-\u001f\u007f]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, maxLength)
    : ''
}

function renderEmail(notification) {
  const title = EVENT_TITLES[notification.eventType] || 'Notification AKATech'
  const details = notification.details && typeof notification.details === 'object'
    ? notification.details
    : {}
  const rows = [
    ['Page', safeText(details.path, 200)],
    ['Appareil', safeText(details.device, 40)],
    ['Source', safeText(details.referrer, 120)],
    ['Projet', safeText(details.projectType, 100)],
  ].filter(([, value]) => value)
  const dashboardUrl = `${getSiteUrl()}/dashboard`
  const summary = safeText(notification.summary, 500)
  const text = [
    title,
    '',
    summary,
    ...rows.map(([label, value]) => `${label} : ${value}`),
    '',
    `Dashboard : ${dashboardUrl}`,
  ].join('\n')
  const html = renderEmailLayout({
    preheader: summary,
    eyebrow: notification.eventType === 'CHAT_INTENT' ? 'Alerte prospect' : 'Alerte visiteur',
    title,
    subtitle: summary,
    body: emailStack(emailFields(rows), emailButton('Ouvrir le dashboard', dashboardUrl)),
    footerNote: 'Aucune adresse IP ni transcription de conversation n’est incluse dans cette alerte.',
  })
  return { text, html, title }
}

/**
 * Construit une clé d’alerte de visite par adresse IP et jour sans conserver
 * l’adresse brute. Le secret dédié est préféré; la clé Resend sert de repli.
 */
export function createDailyVisitorAlertKey(visitorId, clientIp, now = new Date()) {
  const ip = safeText(clientIp, 100)
  const secret = process.env.VISITOR_ALERT_HASH_SECRET || process.env.RESEND_API_KEY
  const day = now.toISOString().slice(0, 10)
  if (!ip || ip === 'unknown' || !secret) return `visitor-browser:${visitorId}`

  const fingerprint = createHmac('sha256', secret)
    .update(`akatech:visitor-alert:v1:${day}:${ip}`)
    .digest('hex')
  return `visitor-ip:${day}:${fingerprint}`
}

async function sendWithResend(notification) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) throw new Error('RESEND_API_KEY is not configured')

  const { text, html } = renderEmail(notification)
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  try {
    const response = await fetch(RESEND_EMAILS_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Idempotency-Key': `akatech:${notification.eventKey}`.slice(0, 256),
      },
      body: JSON.stringify({
        from: getFromAddress(),
        to: process.env.ADMIN_EMAIL || DEFAULT_ADMIN_EMAIL,
        subject: EVENT_TITLES[notification.eventType] || 'Notification AKATech',
        text,
        html,
      }),
      signal: controller.signal,
    })
    const result = await response.json().catch(() => ({}))
    if (!response.ok) {
      throw new Error(safeText(result.message || result.name || `Resend HTTP ${response.status}`, 400))
    }
    return result
  } finally {
    clearTimeout(timeout)
  }
}

async function dispatchEmailNotification(id) {
  if (!process.env.RESEND_API_KEY) return 'pending'

  const now = new Date()
  const claim = await prisma.notificationOutbox.updateMany({
    where: {
      id,
      status: 'PENDING',
      nextAttemptAt: { lte: now },
      attempts: { lt: MAX_ATTEMPTS },
    },
    data: {
      status: 'PROCESSING',
      lockedAt: now,
      attempts: { increment: 1 },
    },
  })
  if (claim.count !== 1) return 'skipped'

  const notification = await prisma.notificationOutbox.findUnique({ where: { id } })
  if (!notification) return 'skipped'

  try {
    await sendWithResend(notification)
    await prisma.notificationOutbox.update({
      where: { id },
      data: { status: 'SENT', sentAt: new Date(), lockedAt: null, lastError: null },
    })
    return 'sent'
  } catch (error) {
    const attempts = notification.attempts
    const isTerminal = attempts >= MAX_ATTEMPTS
    const retryDelay = RETRY_DELAYS_MS[Math.min(attempts - 1, RETRY_DELAYS_MS.length - 1)]
    await prisma.notificationOutbox.update({
      where: { id },
      data: {
        status: isTerminal ? 'FAILED' : 'PENDING',
        nextAttemptAt: new Date(Date.now() + retryDelay),
        lockedAt: null,
        lastError: safeText(error?.message || 'Unknown Resend error', 500),
      },
    })
    console.error('[Email notification] Delivery failed:', error?.message || error)
    return isTerminal ? 'failed' : 'retry_scheduled'
  }
}

function startOfUtcDay(now = new Date()) {
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))
}

/**
 * Enregistre un événement une seule fois (clé unique) puis tente sa livraison.
 * `awaitDelivery: false` insère la ligne d'abord, puis envoie sans bloquer
 * l'appelant (chat) : en cas d'interruption, le Cron reprend la ligne.
 */
export async function enqueueEmailNotification(
  { eventKey, eventType, summary, details = {} },
  { awaitDelivery = true } = {},
) {
  const title = EVENT_TITLES[eventType]
  if (!title || typeof eventKey !== 'string' || !eventKey || eventKey.length > 200) {
    throw new Error('Invalid email notification event')
  }

  const createdToday = await prisma.notificationOutbox.count({
    where: { eventType, createdAt: { gte: startOfUtcDay() } },
  })
  if (createdToday >= DAILY_LIMITS[eventType]) {
    return { queued: false, duplicate: false, limited: true }
  }

  const inserted = await prisma.notificationOutbox.createMany({
    data: {
      eventKey,
      eventType,
      summary: safeText(summary, 500),
      details,
    },
    skipDuplicates: true,
  })
  if (inserted.count === 0) return { queued: false, duplicate: true, limited: false }

  const notification = await prisma.notificationOutbox.findUnique({
    where: { eventKey },
    select: { id: true },
  })
  if (notification) {
    const delivery = dispatchEmailNotification(notification.id)
    if (awaitDelivery) await delivery
    else delivery.catch((error) => console.error('[Email notification] Envoi en arrière-plan échoué:', error?.message || error))
  }
  return { queued: true, duplicate: false, limited: false }
}

/** Envoie les notifications échues; les verrous abandonnés sont libérés. */
export async function dispatchPendingEmailNotifications() {
  const now = new Date()
  const staleBefore = new Date(now.getTime() - STALE_PROCESSING_MS)

  await prisma.notificationOutbox.updateMany({
    where: { status: 'PROCESSING', lockedAt: { lt: staleBefore }, attempts: { lt: MAX_ATTEMPTS } },
    data: { status: 'PENDING', lockedAt: null, nextAttemptAt: now },
  })
  await prisma.notificationOutbox.updateMany({
    where: { status: 'PROCESSING', lockedAt: { lt: staleBefore }, attempts: { gte: MAX_ATTEMPTS } },
    data: { status: 'FAILED', lockedAt: null, lastError: 'Delivery worker timed out after the final attempt.' },
  })

  // Rétention : pas de conservation indéfinie (les clés de visite contiennent une
  // empreinte d'IP quotidienne). Les lignes PENDING/PROCESSING ne sont jamais purgées.
  const retentionCutoff = new Date(now.getTime() - RETENTION_DAYS * 24 * 60 * 60 * 1000)
  const purged = await prisma.notificationOutbox.deleteMany({
    where: { status: { in: ['SENT', 'FAILED'] }, createdAt: { lt: retentionCutoff } },
  })

  const dueNotifications = await prisma.notificationOutbox.findMany({
    where: { status: 'PENDING', nextAttemptAt: { lte: now }, attempts: { lt: MAX_ATTEMPTS } },
    orderBy: { createdAt: 'asc' },
    take: MAX_BATCH_SIZE,
    select: { id: true },
  })
  const outcomes = await Promise.all(dueNotifications.map(({ id }) => dispatchEmailNotification(id)))
  return {
    considered: dueNotifications.length,
    sent: outcomes.filter((outcome) => outcome === 'sent').length,
    retryScheduled: outcomes.filter((outcome) => outcome === 'retry_scheduled').length,
    failed: outcomes.filter((outcome) => outcome === 'failed').length,
    purged: purged.count,
  }
}
