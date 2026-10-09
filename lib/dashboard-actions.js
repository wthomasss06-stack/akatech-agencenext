// lib/dashboard-actions.js
// « Actions à faire » de la Vue d'ensemble du dashboard : ce qui demande une
// décision aujourd'hui, calculé côté serveur à partir des données existantes.
//
//   INVOICE_OVERDUE  facture ENVOYEE dont l'échéance est dépassée
//   QUOTE_ACCEPTED   prospect qui a accepté son devis (7 derniers jours)
//   FOLLOW_UP_DUE    relance planifiée (Lead.followUpAt) arrivée à échéance
//   LEAD_QUALIFIED   lead QUALIFIED (score ≥ 60 ou passé à la main) sans relance planifiée
//   QUOTE_PENDING    devis envoyé (QUOTED) sans réponse depuis 5 jours
//
// Aucune règle métier nouvelle : « qualifié » reprend le seuil déjà utilisé par
// lib/db.js (score ≥ 60). Les deux délais ci-dessous sont des repères de suivi
// internes, jamais montrés au client.
import { prisma } from '@/lib/db'

export const QUOTE_PENDING_DAYS = 5
export const ACCEPTED_QUOTE_WINDOW_DAYS = 7
export const MAX_PER_KIND = 10

const DAY_MS = 24 * 60 * 60 * 1000

// Ordre d'affichage : le plus urgent d'abord.
export const ACTION_KINDS = [
  { kind: 'INVOICE_OVERDUE', severity: 'high', tab: 'invoices' },
  { kind: 'QUOTE_ACCEPTED', severity: 'high', tab: 'prospects' },
  { kind: 'FOLLOW_UP_DUE', severity: 'high', tab: 'leads' },
  { kind: 'LEAD_QUALIFIED', severity: 'medium', tab: 'leads' },
  { kind: 'QUOTE_PENDING', severity: 'low', tab: 'prospects' },
]

const QUESTIONNAIRE_TYPE_LABELS = {
  PORTFOLIO: 'Portfolio',
  VITRINE_ECOMMERCE: 'Site vitrine / e-commerce',
  SAAS: 'SaaS',
}

/** Début du jour UTC (Abidjan est en UTC+0). */
export function startOfUtcDay(date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()))
}

/** Nombre de jours entiers écoulés entre deux dates (jamais négatif). */
export function wholeDaysBetween(from, to) {
  return Math.max(0, Math.floor((to.getTime() - from.getTime()) / DAY_MS))
}

const plural = (n, one, many) => (n > 1 ? many : one)
const formatNumber = (value) => new Intl.NumberFormat('fr-FR').format(Math.round(Number(value) || 0))
const formatDateFr = (date) => date.toLocaleDateString('fr-FR', { timeZone: 'UTC', day: '2-digit', month: '2-digit', year: 'numeric' })
const clean = (value, fallback = '') => (typeof value === 'string' && value.trim() ? value.trim() : fallback)

function priceLabel(quote) {
  if (!quote) return ''
  const min = Number(quote.priceMinFCFA)
  const max = Number(quote.priceMaxFCFA)
  if (!Number.isFinite(min)) return ''
  return min !== max && Number.isFinite(max)
    ? `${formatNumber(min)} – ${formatNumber(max)} FCFA`
    : `${formatNumber(min)} FCFA`
}

/**
 * Transforme les lignes brutes en actions prêtes à afficher. Fonction pure :
 * aucune lecture en base, testable avec des données fictives.
 */
export function buildActions({
  now = new Date(),
  overdueInvoices = [],
  acceptedQuotes = [],
  dueFollowUps = [],
  qualifiedLeads = [],
  pendingQuotes = [],
}) {
  const today = startOfUtcDay(now)
  const items = []

  for (const invoice of overdueInvoices) {
    const days = wholeDaysBetween(invoice.dueDate, today)
    const balance = Number(invoice.balance) > 0 ? invoice.balance : invoice.total
    items.push({
      kind: 'INVOICE_OVERDUE',
      entityId: invoice.id,
      title: `Facture ${invoice.number} en retard`,
      detail: [
        clean(invoice.clientName),
        `${formatNumber(balance)} ${clean(invoice.currency, 'FCFA')}`,
        `${days} ${plural(days, 'jour', 'jours')} de retard`,
      ].filter(Boolean).join(' · '),
      since: invoice.dueDate,
    })
  }

  for (const row of acceptedQuotes) {
    const type = QUESTIONNAIRE_TYPE_LABELS[row.type] || ''
    const tier = clean(row.quote?.tier)
    items.push({
      kind: 'QUOTE_ACCEPTED',
      entityId: row.id,
      title: `Devis accepté — ${clean(row.contactName, 'prospect')}`,
      detail: [type, tier, priceLabel(row.quote), clean(row.contactHandle)].filter(Boolean).join(' · '),
      since: row.decidedAt || row.submittedAt || row.createdAt,
    })
  }

  for (const lead of dueFollowUps) {
    const days = wholeDaysBetween(lead.followUpAt, today)
    items.push({
      kind: 'FOLLOW_UP_DUE',
      entityId: lead.id,
      title: `Relancer ${clean(lead.name, 'ce lead')}`,
      detail: [
        clean(lead.contact),
        days > 0 ? `relance prévue il y a ${days} ${plural(days, 'jour', 'jours')}` : `relance prévue le ${formatDateFr(lead.followUpAt)}`,
      ].filter(Boolean).join(' · '),
      since: lead.followUpAt,
    })
  }

  for (const lead of qualifiedLeads) {
    items.push({
      kind: 'LEAD_QUALIFIED',
      entityId: lead.id,
      title: `Lead qualifié à contacter — ${clean(lead.name, 'sans nom')}`,
      detail: [
        `${lead.score}/100`,
        clean(lead.projectType),
        clean(lead.budgetRange),
        clean(lead.contact),
      ].filter(Boolean).join(' · '),
      since: lead.createdAt,
    })
  }

  for (const row of pendingQuotes) {
    const sentAt = row.quote?.createdAt || row.submittedAt || row.createdAt
    const days = wholeDaysBetween(sentAt, now)
    items.push({
      kind: 'QUOTE_PENDING',
      entityId: row.id,
      title: `Devis sans réponse depuis ${days} ${plural(days, 'jour', 'jours')}`,
      detail: [clean(row.contactName, 'prospect'), clean(row.quote?.tier), priceLabel(row.quote)].filter(Boolean).join(' · '),
      since: sentAt,
    })
  }

  const meta = Object.fromEntries(ACTION_KINDS.map((definition) => [definition.kind, definition]))
  const ordered = ACTION_KINDS.flatMap(({ kind }) => items.filter((item) => item.kind === kind))
  const counts = Object.fromEntries(ACTION_KINDS.map(({ kind }) => [kind, items.filter((item) => item.kind === kind).length]))

  return {
    items: ordered.map((item) => ({
      id: `${item.kind}:${item.entityId}`,
      kind: item.kind,
      severity: meta[item.kind].severity,
      tab: meta[item.kind].tab,
      title: item.title,
      detail: item.detail,
      since: item.since instanceof Date ? item.since.toISOString() : null,
    })),
    counts,
    total: ordered.length,
  }
}

/** Lit la base et renvoie les actions du moment. Chaque famille est plafonnée à MAX_PER_KIND. */
export async function getDashboardActions(now = new Date()) {
  const today = startOfUtcDay(now)
  const acceptedSince = new Date(now.getTime() - ACCEPTED_QUOTE_WINDOW_DAYS * DAY_MS)
  const pendingBefore = new Date(now.getTime() - QUOTE_PENDING_DAYS * DAY_MS)
  const take = MAX_PER_KIND + 1 // une ligne de plus que l'affichage, pour savoir s'il y en a d'autres

  const [overdueInvoices, acceptedQuotes, dueFollowUps, qualifiedLeads, pendingQuotes] = await Promise.all([
    prisma.invoice.findMany({
      where: { status: 'ENVOYEE', dueDate: { lt: today } },
      select: { id: true, number: true, clientName: true, currency: true, total: true, balance: true, dueDate: true },
      orderBy: { dueDate: 'asc' },
      take,
    }),
    prisma.questionnaire.findMany({
      where: { status: 'ACCEPTED', decidedAt: { gte: acceptedSince } },
      select: {
        id: true, type: true, contactName: true, contactHandle: true, decidedAt: true, submittedAt: true, createdAt: true,
        quote: { select: { tier: true, priceMinFCFA: true, priceMaxFCFA: true } },
      },
      orderBy: { decidedAt: 'desc' },
      take,
    }),
    prisma.lead.findMany({
      where: { status: { in: ['NEW', 'QUALIFIED', 'CONTACTED'] }, followUpAt: { lte: now } },
      select: { id: true, name: true, contact: true, followUpAt: true },
      orderBy: { followUpAt: 'asc' },
      take,
    }),
    prisma.lead.findMany({
      where: { status: 'QUALIFIED', followUpAt: null },
      select: { id: true, name: true, contact: true, score: true, projectType: true, budgetRange: true, createdAt: true },
      orderBy: [{ score: 'desc' }, { createdAt: 'asc' }],
      take,
    }),
    prisma.questionnaire.findMany({
      where: { status: 'QUOTED', quote: { is: { createdAt: { lte: pendingBefore } } } },
      select: {
        id: true, contactName: true, submittedAt: true, createdAt: true,
        quote: { select: { tier: true, priceMinFCFA: true, priceMaxFCFA: true, createdAt: true } },
      },
      orderBy: { createdAt: 'asc' },
      take,
    }),
  ])

  const more = {
    INVOICE_OVERDUE: overdueInvoices.length > MAX_PER_KIND,
    QUOTE_ACCEPTED: acceptedQuotes.length > MAX_PER_KIND,
    FOLLOW_UP_DUE: dueFollowUps.length > MAX_PER_KIND,
    LEAD_QUALIFIED: qualifiedLeads.length > MAX_PER_KIND,
    QUOTE_PENDING: pendingQuotes.length > MAX_PER_KIND,
  }
  const cap = (rows) => rows.slice(0, MAX_PER_KIND)

  const result = buildActions({
    now,
    overdueInvoices: cap(overdueInvoices),
    acceptedQuotes: cap(acceptedQuotes),
    dueFollowUps: cap(dueFollowUps),
    qualifiedLeads: cap(qualifiedLeads),
    pendingQuotes: cap(pendingQuotes),
  })
  return { ...result, more }
}

/**
 * Valide la date de relance reçue du dashboard : 'AAAA-MM-JJ' (jour choisi) ou
 * null/'' pour l'effacer. Renvoie { ok, date } — `date` vaut null pour effacer.
 */
export function parseFollowUpInput(value) {
  if (value === null || value === '') return { ok: true, date: null }
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return { ok: false, date: null }
  const date = new Date(`${value}T00:00:00.000Z`)
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value) return { ok: false, date: null }
  return { ok: true, date }
}
