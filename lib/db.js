// lib/db.js
import { PrismaClient } from '@prisma/client'

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

export async function getOrCreateVisitSession(sessionId, visitorRowId, meta = {}) {
  let session = await prisma.visitSession.findUnique({ where: { sessionId } })
  if (!session) {
    session = await prisma.visitSession.create({
      data: {
        sessionId,
        visitorId: visitorRowId,
        device: meta.device ?? null,
        referrer: meta.referrer ?? null,
        userAgent: meta.userAgent ?? null,
      },
    })
  } else {
    session = await prisma.visitSession.update({
      where: { sessionId },
      data: { lastActivityAt: new Date() },
    })
  }
  return session
}

export async function recordPageView(sessionRowId, path) {
  return prisma.pageView.create({ data: { sessionId: sessionRowId, path } })
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

  const [totalVisitors, newVisitors, sessions, pageViews] = await Promise.all([
    prisma.visitor.count(),
    prisma.visitor.count({ where: { firstSeenAt: { gte: since } } }),
    prisma.visitSession.findMany({
      where: { startedAt: { gte: since } },
      select: { id: true, device: true, referrer: true, startedAt: true, lastActivityAt: true, _count: { select: { pageViews: true } } },
    }),
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
