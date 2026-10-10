// lib/dashboard-view.js
// Aides d'affichage du dashboard : fonctions pures, sans base de données ni React,
// importables côté navigateur (page.js) et testables seules.

/* ── Visiteurs récurrents : tri et filtres ───────────────── */

export const VISITOR_SORTS = [
  { value: 'lastSeen:desc', label: 'Dernière visite · récente d’abord' },
  { value: 'lastSeen:asc', label: 'Dernière visite · ancienne d’abord' },
  { value: 'firstSeen:desc', label: 'Première visite · récente d’abord' },
  { value: 'firstSeen:asc', label: 'Première visite · ancienne d’abord' },
  { value: 'visits:desc', label: 'Nombre de visites' },
  { value: 'pageViews:desc', label: 'Pages vues' },
  { value: 'actions:desc', label: 'Clics' },
]

export const VISITOR_PERIODS = [
  { value: 'all', label: 'Tout (30 jours)' },
  { value: '24h', label: 'Dernières 24 h' },
  { value: '7d', label: '7 derniers jours' },
  { value: '14d', label: '14 derniers jours' },
]

export const VISITOR_MIN_VISITS = [
  { value: 1, label: 'Toutes' },
  { value: 2, label: '2 visites et +' },
  { value: 3, label: '3 visites et +' },
  { value: 5, label: '5 visites et +' },
]

export const VISITOR_ENGAGEMENT = [
  { value: 'all', label: 'Tous' },
  { value: 'clicks', label: 'Avec clics' },
  { value: 'noclicks', label: 'Sans clic' },
]

/** Valeur du filtre « appareil » pour les visiteurs dont l'appareil est inconnu. */
export const NO_DEVICE = '__none__'

export const DEFAULT_VISITOR_VIEW = Object.freeze({
  sort: 'lastSeen:desc',
  period: 'all',
  minVisits: 1,
  device: '',
  engagement: 'all',
  query: '',
})

const DAY_MS = 24 * 60 * 60 * 1000
const PERIOD_MS = { '24h': DAY_MS, '7d': 7 * DAY_MS, '14d': 14 * DAY_MS }

function timeOf(value) {
  if (value instanceof Date) return value.getTime() || 0
  const parsed = Date.parse(String(value ?? ''))
  return Number.isNaN(parsed) ? 0 : parsed
}
const numberOf = (value) => (Number.isFinite(Number(value)) ? Number(value) : 0)

const SORT_GETTERS = {
  lastSeen: (row) => timeOf(row.lastSeenAt),
  firstSeen: (row) => timeOf(row.firstSeenAt),
  visits: (row) => numberOf(row.visits),
  pageViews: (row) => numberOf(row.pageViews),
  actions: (row) => numberOf(row.actions),
}

/**
 * Applique filtres puis tri à la liste de visiteurs. Ne modifie jamais le tableau reçu.
 * Une valeur de `view` inconnue retombe sur la valeur par défaut (jamais d'exception).
 */
export function filterAndSortVisitors(visitors, view = {}, now = new Date()) {
  const current = { ...DEFAULT_VISITOR_VIEW, ...view }
  const sortKey = VISITOR_SORTS.some((option) => option.value === current.sort) ? current.sort : DEFAULT_VISITOR_VIEW.sort
  const [field, direction] = sortKey.split(':')
  const cutoff = PERIOD_MS[current.period] ? now.getTime() - PERIOD_MS[current.period] : null
  const minVisits = Math.max(1, numberOf(current.minVisits) || 1)
  const query = String(current.query ?? '').trim().toLowerCase()
  const device = String(current.device ?? '').toLowerCase()

  const rows = (Array.isArray(visitors) ? visitors : []).filter((row) => {
    if (!row) return false
    if (cutoff !== null && timeOf(row.lastSeenAt) < cutoff) return false
    if (numberOf(row.visits) < minVisits) return false
    if (device) {
      const rowDevice = String(row.lastDevice ?? '').toLowerCase()
      if (device === NO_DEVICE ? rowDevice !== '' : rowDevice !== device) return false
    }
    if (current.engagement === 'clicks' && numberOf(row.actions) <= 0) return false
    if (current.engagement === 'noclicks' && numberOf(row.actions) > 0) return false
    if (query && !String(row.shortId ?? '').toLowerCase().includes(query)) return false
    return true
  })

  const get = SORT_GETTERS[field]
  const sign = direction === 'asc' ? 1 : -1
  return rows.sort((a, b) => {
    const diff = get(a) - get(b)
    if (diff) return diff * sign
    // Égalité : dernière visite récente, puis plus de visites, puis identifiant — ordre stable et prévisible.
    return (
      SORT_GETTERS.lastSeen(b) - SORT_GETTERS.lastSeen(a)
      || numberOf(b.visits) - numberOf(a.visits)
      || String(a.shortId ?? '').localeCompare(String(b.shortId ?? ''))
    )
  })
}

/** Appareils présents dans la liste (pour alimenter le filtre) et présence d'appareils inconnus. */
export function listVisitorDevices(visitors) {
  const devices = new Set()
  let hasUnknown = false
  for (const row of Array.isArray(visitors) ? visitors : []) {
    const device = String(row?.lastDevice ?? '').trim().toLowerCase()
    if (device) devices.add(device)
    else hasUnknown = true
  }
  return { devices: [...devices].sort(), hasUnknown }
}

/** Nombre de filtres actifs (le tri n'en fait pas partie). */
export function countActiveVisitorFilters(view = {}) {
  const current = { ...DEFAULT_VISITOR_VIEW, ...view }
  return [
    current.period !== DEFAULT_VISITOR_VIEW.period,
    numberOf(current.minVisits) > 1,
    Boolean(current.device),
    current.engagement !== DEFAULT_VISITOR_VIEW.engagement,
    Boolean(String(current.query ?? '').trim()),
  ].filter(Boolean).length
}

/* ── Actions à faire : résumé quand le panneau est replié ── */

const ACTION_LABELS = [
  ['INVOICE_OVERDUE', 'facture en retard', 'factures en retard'],
  ['QUOTE_ACCEPTED', 'devis accepté', 'devis acceptés'],
  ['FOLLOW_UP_DUE', 'relance', 'relances'],
  ['LEAD_QUALIFIED', 'lead qualifié', 'leads qualifiés'],
  ['QUOTE_PENDING', 'devis sans réponse', 'devis sans réponse'],
]

/** « 2 factures en retard · 1 relance » — familles vides ignorées, même ordre que le panneau. */
export function summarizeActionCounts(counts) {
  return ACTION_LABELS
    .map(([kind, one, many]) => {
      const count = numberOf(counts?.[kind])
      return count > 0 ? `${count} ${count > 1 ? many : one}` : ''
    })
    .filter(Boolean)
    .join(' · ')
}
