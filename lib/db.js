// lib/db.js
import { PrismaClient } from '@prisma/client'
import { computeInvoiceTotals } from './invoice-calc'

const globalForPrisma = globalThis

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Repère de sécurité pour la séparation dev/prod : affiche juste l'hôte
// Neon connecté (jamais le user/mot de passe) au démarrage en local, pour
// vérifier d'un coup d'œil qu'on n'est pas branché sur la prod par erreur.
if (process.env.NODE_ENV !== 'production' && process.env.DATABASE_URL) {
  try {
    console.log(`[DB] Connecté à : ${new URL(process.env.DATABASE_URL).hostname}`)
  } catch {
    // DATABASE_URL mal formée — pas bloquant ici, Prisma le signalera de toute façon.
  }
}

// ══════════════════════════════════════════
// SCORING DE LEAD
// ══════════════════════════════════════════

export function calculateLeadScore(messages, leadData = null) {
  let score = 0
  const userMessages = messages.filter(m => m.role === 'USER')
  const allText = userMessages.map(m => m.content.toLowerCase()).join(' ')

  if (allText.match(/(budget|fcfa|cfa|€|\$|euro|million|millier)/i)) score += 20
  if (allText.match(/(délai|deadline|semaine|mois|jour|urgent|vite|rapidement)/i)) score += 20
  if (allText.match(/[\w.-]+@[\w.-]+\.\w{2,}/) || allText.match(/(\+?225|0)[\s\d]{8,}/)) score += 15

  const projectKeywords = ['site web', 'application', 'mobile', 'e-commerce', 'saas', 'landing page', 'vitrine', 'blog', 'dashboard']
  if (projectKeywords.some(kw => allText.includes(kw))) score += 15
  if (userMessages.length >= 3) score += 15
  if (allText.match(/(devis|commander|commencer|lancer|projet|besoin|veux|voudrais|souhaite)/i)) score += 15

  if (leadData) {
    if (leadData.budgetRange && leadData.budgetRange !== 'Non précisé') score += 5
    if (leadData.timeline && leadData.timeline !== 'Non précisé') score += 5
  }

  return Math.min(score, 100)
}

// ══════════════════════════════════════════
// CONVERSATIONS / MESSAGES / LEADS / RAPPORTS
// ══════════════════════════════════════════

export async function getOrCreateConversation(sessionId, ipHash = null) {
  // upsert() plutôt que findUnique() + create() : deux requêtes qui se
  // chevauchent (ex: sendBeacon qui refire, ou /assistant et /assistant/end
  // qui arrivent presque en même temps) pouvaient toutes les deux constater
  // "n'existe pas" puis tenter un create() → Unique constraint failed sur
  // sessionId (vu dans les logs). upsert() est atomique côté DB, donc plus
  // de fenêtre de course possible.
  return prisma.conversation.upsert({
    where: { sessionId },
    update: {},
    create: { sessionId, ipHash, status: 'ACTIVE' },
    include: { messages: { orderBy: { createdAt: 'asc' } } },
  })
}

export async function saveMessage(conversationId, role, content, modelUsed = null) {
  const [message] = await prisma.$transaction([
    prisma.message.create({ data: { conversationId, role, content, modelUsed } }),
    // messageCount était référencé par la route /api/stats mais jamais
    // incrémenté nulle part — corrigé ici, dans la même transaction.
    prisma.conversation.update({
      where: { id: conversationId },
      data: { messageCount: { increment: 1 } },
    }),
  ])
  return message
}

export async function updateConversationStatus(conversationId, status) {
  const updates = { status }
  if (status === 'ENDED' || status === 'CONVERTED') updates.endedAt = new Date()

  return prisma.conversation.update({
    where: { id: conversationId },
    data: updates,
  })
}

export async function saveLead(conversationId, leadData) {
  const messages = await prisma.message.findMany({ where: { conversationId } })
  const score = calculateLeadScore(messages, leadData)

  const lead = await prisma.lead.create({
    data: {
      conversationId,
      name: leadData.name,
      contact: leadData.contact,
      projectType: leadData.project_type || null,
      budgetRange: leadData.budget_range || null,
      timeline: leadData.timeline || null,
      summary: leadData.summary,
      score,
      status: score >= 60 ? 'QUALIFIED' : 'NEW',
    },
  })

  await prisma.conversation.update({
    where: { id: conversationId },
    data: { leadScore: score, status: 'CONVERTED' },
  })

  return lead
}

// ══════════════════════════════════════════
// TRACKING VISITEURS (posé par middleware.js)
// ══════════════════════════════════════════

export async function upsertVisitor(visitorId) {
  return prisma.visitor.upsert({
    where: { visitorId },
    create: { visitorId },
    update: { visitCount: { increment: 1 } },
  })
}

// Champs de base, sans `consent` : évite que Prisma tente de lire/renvoyer
// une colonne qui n'existe pas encore tant que la migration (npx prisma db
// push) n'a pas été appliquée sur la base. Sans ça, TOUT le tracking (pas
// seulement le consentement) plante dès le premier appel — vécu en prod.
const SESSION_BASE_SELECT = {
  id: true, sessionId: true, visitorId: true,
  startedAt: true, lastActivityAt: true,
  device: true, referrer: true, userAgent: true,
}

export async function getOrCreateVisitSession(sessionId, visitorRowId, meta = {}) {
  let session = await prisma.visitSession.findUnique({ where: { sessionId }, select: SESSION_BASE_SELECT })
  if (!session) {
    session = await prisma.visitSession.create({
      data: {
        sessionId,
        visitorId: visitorRowId,
        device: meta.device ?? null,
        referrer: meta.referrer ?? null,
        userAgent: meta.userAgent ?? null,
      },
      select: SESSION_BASE_SELECT,
    })
  } else {
    session = await prisma.visitSession.update({
      where: { sessionId },
      data: { lastActivityAt: new Date() },
      select: SESSION_BASE_SELECT,
    })
  }
  return session
}

// Choix cookies (bannière de consentement) — posé une fois la décision
// prise, indépendamment du chargement de page qui a déjà créé la session.
// Nécessite la colonne consent (migration à jour) ; échoue sans casser le
// reste du tracking grâce au try/catch de la route qui l'appelle.
export async function updateSessionConsent(sessionRowId, consent) {
  if (consent !== 'accepted' && consent !== 'rejected') return null
  return prisma.visitSession.update({
    where: { id: sessionRowId },
    data: { consent },
    select: { id: true },
  })
}

export async function recordPageView(sessionRowId, path) {
  return prisma.pageView.create({ data: { sessionId: sessionRowId, path }, select: { id: true } })
}

// ══════════════════════════════════════════
// AGRÉGATIONS POUR /api/stats
// ══════════════════════════════════════════

/* Regrouper par jour calendaire en JS plutôt qu'un groupBy Prisma sur
   createdAt : grouper par un DateTime précis (à la milliseconde) ne
   regroupe quasiment jamais rien — chaque ligne a son propre horodatage
   unique. Pour un volume de trafic d'agence qui démarre, agréger côté
   JS après un simple findMany() est largement suffisant. */
function bucketByDay(rows, dateField = 'createdAt') {
  const buckets = new Map()
  for (const row of rows) {
    const day = row[dateField].toISOString().split('T')[0]
    buckets.set(day, (buckets.get(day) || 0) + 1)
  }
  return Array.from(buckets.entries())
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date))
}

export async function getConversationActivity(days = 30) {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
  const rows = await prisma.conversation.findMany({
    where: { createdAt: { gte: since } },
    select: { createdAt: true },
  })
  return bucketByDay(rows)
}

export async function getVisitorStats(days = 30) {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000)

  // Requête isolée avec repli : si la migration ajoutant `consent` n'a pas
  // encore été appliquée (npx prisma db push), on retombe sur une sélection
  // sans cette colonne plutôt que de faire échouer tout le dashboard.
  let sessions
  let consentAvailable = true
  try {
    sessions = await prisma.visitSession.findMany({
      where: { startedAt: { gte: since } },
      select: { id: true, device: true, referrer: true, consent: true, startedAt: true, lastActivityAt: true, _count: { select: { pageViews: true } } },
    })
  } catch (err) {
    console.error('[Stats] Colonne consent indisponible (migration à lancer ?) :', err?.message ?? err)
    consentAvailable = false
    sessions = await prisma.visitSession.findMany({
      where: { startedAt: { gte: since } },
      select: { id: true, device: true, referrer: true, startedAt: true, lastActivityAt: true, _count: { select: { pageViews: true } } },
    })
  }

  const [totalVisitors, newVisitors, pageViews] = await Promise.all([
    prisma.visitor.count(),
    prisma.visitor.count({ where: { firstSeenAt: { gte: since } } }),
    prisma.pageView.findMany({
      where: { viewedAt: { gte: since } },
      select: { path: true, viewedAt: true },
    }),
  ])

  const totalSessions = sessions.length
  const bounced = sessions.filter(s => s._count.pageViews <= 1).length
  const bounceRate = totalSessions > 0 ? Math.round((bounced / totalSessions) * 1000) / 10 : 0

  const avgDurationMs = totalSessions > 0
    ? sessions.reduce((sum, s) => sum + (new Date(s.lastActivityAt) - new Date(s.startedAt)), 0) / totalSessions
    : 0

  const devices = {}
  for (const s of sessions) {
    const d = s.device || 'inconnu'
    devices[d] = (devices[d] || 0) + 1
  }

  const sources = {}
  for (const s of sessions) {
    const ref = s.referrer ? new URL(s.referrer).hostname : 'direct'
    sources[ref] = (sources[ref] || 0) + 1
  }

  // Bannière cookies : accepté / refusé / pas encore décidé (session
  // trop récente, JS bloqué, ou choix pas encore fait par le visiteur).
  const consent = { accepted: 0, rejected: 0, pending: 0 }
  for (const s of sessions) {
    if (s.consent === 'accepted') consent.accepted++
    else if (s.consent === 'rejected') consent.rejected++
    else consent.pending++
  }

  const topPagesMap = {}
  const activeHoursMap = {}
  for (const pv of pageViews) {
    topPagesMap[pv.path] = (topPagesMap[pv.path] || 0) + 1
    const hour = new Date(pv.viewedAt).getHours()
    activeHoursMap[hour] = (activeHoursMap[hour] || 0) + 1
  }

  return {
    totalVisitors,
    newVisitors,
    returningVisitors: Math.max(totalVisitors - newVisitors, 0),
    totalSessions,
    totalPageViews: pageViews.length,
    bounceRate,
    avgSessionDurationSeconds: Math.round(avgDurationMs / 1000),
    devices: Object.entries(devices).map(([device, count]) => ({ device, count })),
    consent,
    sources: Object.entries(sources).map(([source, count]) => ({ source, count })).sort((a, b) => b.count - a.count).slice(0, 10),
    topPages: Object.entries(topPagesMap).map(([path, count]) => ({ path, count })).sort((a, b) => b.count - a.count).slice(0, 10),
    activeHours: Array.from({ length: 24 }, (_, h) => ({ hour: h, count: activeHoursMap[h] || 0 })),
  }
}

// ══════════════════════════════════════════
// USAGE IA DU JOUR (Gemini / Groq)
// ══════════════════════════════════════════
// Dérivé de Message.modelUsed, déjà enregistré à chaque réponse — pas
// de nouvelle table nécessaire. Gemini n'expose pas de quota restant
// dans ses réponses (contrairement à Groq, qui renvoie des en-têtes
// x-ratelimit-*), donc on compte nos propres appels plutôt que de
// dépendre d'une info que l'un des deux fournisseurs ne donne pas.
// Les limites ci-dessous sont indicatives (documentation publique des
// fournisseurs, sujettes à changement) — à prendre comme repère, pas
// comme un compteur exact de ce qu'il te reste.
export const INDICATIVE_DAILY_LIMITS = {
  gemini: { label: 'Gemini (gratuit)', approxLimit: 250 },
  groq: { label: 'Groq · Llama 3.1 8B (gratuit)', approxLimit: 14400 },
}

export async function getTodayAiUsage() {
  const startOfDay = new Date()
  startOfDay.setHours(0, 0, 0, 0)

  const rows = await prisma.message.groupBy({
    by: ['modelUsed'],
    where: { role: 'ASSISTANT', createdAt: { gte: startOfDay }, modelUsed: { not: null } },
    _count: { id: true },
  })

  // Bug corrigé : modelUsed contient le vrai nom de modèle enregistré à
  // chaque réponse (ex: "gemini-3.6-flash", "llama-3.1-8b-instant"),
  // jamais le mot littéral "gemini"/"groq" — la comparaison exacte
  // d'avant ne matchait donc jamais rien et le widget affichait 0/250
  // en permanence. On regroupe maintenant par préfixe de famille.
  const usage = { gemini: 0, groq: 0 }
  for (const row of rows) {
    if (!row.modelUsed) continue
    if (row.modelUsed.startsWith('gemini')) usage.gemini += row._count.id
    else if (row.modelUsed.startsWith('llama')) usage.groq += row._count.id
  }

  return {
    gemini: { count: usage.gemini, approxLimit: INDICATIVE_DAILY_LIMITS.gemini.approxLimit },
    groq: { count: usage.groq, approxLimit: INDICATIVE_DAILY_LIMITS.groq.approxLimit },
  }
}

// ══════════════════════════════════════════
// FACTURES — dashboard admin (onglet Factures)
// ══════════════════════════════════════════

// Numérotation par simple comptage plutôt qu'un compteur dédié : usage
// mono-admin (une seule personne crée des factures, jamais en parallèle
// sur deux appareils à la même seconde), donc le risque de collision
// est nul en pratique. Le numéro reste éditable à la main dans le
// formulaire si besoin (ex. forcer un numéro après une facture annulée).
export async function getNextInvoiceNumber(year = new Date().getFullYear()) {
  const count = await prisma.invoice.count({ where: { number: { startsWith: `F-${year}-` } } })
  return `F-${year}-${String(count + 1).padStart(3, '0')}`
}

export async function listInvoices({ page = 1, limit = 15, search = '', status = '' } = {}) {
  const skip = (page - 1) * limit
  const where = {}
  if (status) where.status = status
  if (search) {
    where.OR = [
      { number: { contains: search, mode: 'insensitive' } },
      { clientName: { contains: search, mode: 'insensitive' } },
      { clientEmail: { contains: search, mode: 'insensitive' } },
    ]
  }

  const [invoices, total] = await Promise.all([
    prisma.invoice.findMany({ where, orderBy: { issueDate: 'desc' }, skip, take: limit }),
    prisma.invoice.count({ where }),
  ])

  return { invoices, pagination: { page, limit, total, pages: Math.ceil(total / limit) } }
}

export async function getInvoiceById(id) {
  return prisma.invoice.findUnique({ where: { id } })
}

export async function createInvoice(data) {
  const totals = computeInvoiceTotals(data)
  const number = data.number?.trim() || (await getNextInvoiceNumber(new Date(data.issueDate).getFullYear()))

  return prisma.invoice.create({
    data: {
      number,
      contractRef: data.contractRef || null,
      issueDate: new Date(data.issueDate),
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
      clientName: data.clientName,
      clientAddress: data.clientAddress || null,
      clientPhone: data.clientPhone || null,
      clientEmail: data.clientEmail || null,
      clientRccm: data.clientRccm || null,
      currency: data.currency || 'FCFA',
      lines: data.lines,
      applyTva: !!data.applyTva,
      applyTimbre: !!data.applyTimbre,
      deposit: Number(data.deposit) || 0,
      notes: data.notes || null,
      status: data.status || 'ENVOYEE',
      ...totals,
    },
  })
}

// Mise à jour partielle (ex: changer juste le statut depuis la liste)
// vs mise à jour complète (depuis le formulaire, avec recalcul des
// totaux) : on ne recalcule les totaux que si des lignes sont fournies,
// pour permettre un simple "marquer comme payée" sans renvoyer toute
// la facture.
export async function updateInvoice(id, data) {
  const patch = {}
  if (data.number !== undefined) patch.number = data.number
  if (data.contractRef !== undefined) patch.contractRef = data.contractRef || null
  if (data.issueDate !== undefined) patch.issueDate = new Date(data.issueDate)
  if (data.dueDate !== undefined) patch.dueDate = data.dueDate ? new Date(data.dueDate) : null
  if (data.clientName !== undefined) patch.clientName = data.clientName
  if (data.clientAddress !== undefined) patch.clientAddress = data.clientAddress || null
  if (data.clientPhone !== undefined) patch.clientPhone = data.clientPhone || null
  if (data.clientEmail !== undefined) patch.clientEmail = data.clientEmail || null
  if (data.clientRccm !== undefined) patch.clientRccm = data.clientRccm || null
  if (data.currency !== undefined) patch.currency = data.currency
  if (data.notes !== undefined) patch.notes = data.notes || null
  if (data.status !== undefined) patch.status = data.status

  if (data.lines !== undefined) {
    patch.lines = data.lines
    patch.applyTva = !!data.applyTva
    patch.applyTimbre = !!data.applyTimbre
    patch.deposit = Number(data.deposit) || 0
    Object.assign(patch, computeInvoiceTotals(data))
  }

  return prisma.invoice.update({ where: { id }, data: patch })
}

export async function deleteInvoice(id) {
  return prisma.invoice.delete({ where: { id } })
}
