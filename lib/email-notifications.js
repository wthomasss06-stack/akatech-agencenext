import { createHmac } from 'node:crypto'
import { prisma } from '@/lib/db'

const RESEND_EMAILS_URL = 'https://api.resend.com/emails'
const MAX_ATTEMPTS = 5
const RETRY_DELAYS_MS = [60_000, 5 * 60_000, 15 * 60_000, 60 * 60_000]
const REQUEST_TIMEOUT_MS = 8_000
const STALE_PROCESSING_MS = 2 * 60_000
const MAX_BATCH_SIZE = 20

const EVENT_TITLES = {
  NEW_VISITOR: 'Nouvelle visite sur AKATech',
  CHAT_INTENT: 'Nouveau prospect intéressé par un devis',
}

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
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
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://akatech.vercel.app').replace(/\/+$/, '')
  const dashboardUrl = `${baseUrl}/dashboard`
  const text = [
    title,
    '',
    safeText(notification.summary, 500),
    ...rows.map(([label, value]) => `${label} : ${value}`),
    '',
    `Dashboard : ${dashboardUrl}`,
  ].join('\n')
  const detailRows = rows.map(([label, value]) => `
    <tr>
      <td style="padding:8px 0;color:#777;font-size:13px">${escapeHtml(label)}</td>
      <td style="padding:8px 0;color:#172016;font-size:13px;font-weight:600;text-align:right">${escapeHtml(value)}</td>
    </tr>`).join('')
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#172016">
      <p style="color:#5f9137;font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase">AKATech · alerte automatique</p>
      <h1 style="font-size:22px;margin:18px 0 10px">${escapeHtml(title)}</h1>
      <p style="font-size:15px;line-height:1.6">${escapeHtml(safeText(notification.summary, 500))}</p>
      ${rows.length ? `<table style="width:100%;border-collapse:collapse;margin:18px 0">${detailRows}</table>` : ''}
      <p style="margin:24px 0"><a href="${escapeHtml(dashboardUrl)}" style="display:inline-block;padding:11px 18px;background:#88ca53;color:#10200c;text-decoration:none;border-radius:8px;font-weight:700">Ouvrir le dashboard</a></p>
      <p style="border-top:1px solid #eee;padding-top:14px;color:#888;font-size:11px">Aucune adresse IP ni transcription de conversation n’est incluse dans cette alerte.</p>
    </div>`
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
        from: process.env.FROM_EMAIL || 'onboarding@resend.dev',
        to: process.env.ADMIN_EMAIL || 'wthomasss06@gmail.com',
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

/** Enregistre un événement une seule fois puis tente immédiatement sa livraison. */
export async function enqueueEmailNotification({ eventKey, eventType, summary, details = {} }) {
  const title = EVENT_TITLES[eventType]
  if (!title || typeof eventKey !== 'string' || !eventKey || eventKey.length > 200) {
    throw new Error('Invalid email notification event')
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
  if (inserted.count === 0) return { queued: false, duplicate: true }

  const notification = await prisma.notificationOutbox.findUnique({
    where: { eventKey },
    select: { id: true },
  })
  if (notification) await dispatchEmailNotification(notification.id)
  return { queued: true, duplicate: false }
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
  }
}
