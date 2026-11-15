// lib/db.js
import { PrismaClient } from '@prisma/client'
import { computeInvoiceTotals } from './invoice-calc'
import { classifySource, isBot } from './geo'
import { lookupCityCoords } from './city-coords'

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

export async function saveQuestionnaireLead(conversationId, leadData) {
  if (!conversationId || !leadData?.name || !leadData?.contact) return null
  const existing = await prisma.lead.findUnique({ where: { conversationId } })
  if (existing) return existing
  return saveLead(conversationId, leadData)
}

// ══════════════════════════════════════════
// TRACKING VISITEURS (posé par middleware.js)
// ══════════════════════════════════════════

// L'insertion avec ignoreDuplicates donne un signal fiable de première
// identité visiteur, sans dépendre d'un marqueur-cookie persistant côté Edge.
export async function upsertVisitor(visitorId) {
  const inserted = await prisma.visitor.createMany({
    data: { visitorId, visitCount: 0 },
    skipDuplicates: true,
  })
  const isNewVisitor = inserted.count === 1
  const visitor = isNewVisitor
    ? await prisma.visitor.findUnique({ where: { visitorId } })
    : await prisma.visitor.update({ where: { visitorId }, data: { lastSeenAt: new Date() } })

  if (!visitor) throw new Error('Visitor could not be loaded after upsert')
  return { visitor, isNewVisitor }
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
  // createMany + skipDuplicates (ON CONFLICT DO NOTHING) : si deux requêtes
  // arrivent en même temps avec le même cookie de session, une seule obtient
  // count === 1 — et c'est elle seule qui compte la visite.
  const inserted = await prisma.visitSession.createMany({
    data: {
      sessionId,
      visitorId: visitorRowId,
      device: meta.device ?? null,
      referrer: meta.referrer ?? null,
      userAgent: meta.userAgent ?? null,
    },
    skipDuplicates: true,
  })

  if (inserted.count === 1) {
    // Volontairement hors transaction interactive : sur Neon (compute qui se
    // réveille), le délai d'attente par défaut d'une transaction interactive
    // (2 s d'attente / 5 s d'exécution) peut faire échouer tout le tracking.
    // Pire cas ici : un incrément de visite perdu, jamais une page en erreur.
    await prisma.visitor.update({
      where: { id: visitorRowId },
      data: { visitCount: { increment: 1 }, lastSeenAt: new Date() },
    })
    return prisma.visitSession.findUnique({ where: { sessionId }, select: SESSION_BASE_SELECT })
  }

  return prisma.visitSession.update({
    where: { sessionId },
    data: { lastActivityAt: new Date() },
    select: SESSION_BASE_SELECT,
  })
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

// ── Géolocalisation approximative + appareil (voir lib/geo.js) ──
// Écriture « best effort », séparée de la création de session : si la migration
// (npx prisma db push) n'a pas encore ajouté les colonnes, l'appelant attrape
// l'erreur et le suivi continue de fonctionner. `undefined` = ne rien changer,
// `null` = effacer (ex. refus des cookies).
const GEO_FIELDS = ['country', 'region', 'city', 'ip', 'os', 'browser']
const GEO_COORDS = ['latitude', 'longitude']

// Colonnes ajoutées après coup (latitude, longitude…) : tant que `npx prisma db push` n'a pas
// été lancé, l'écriture est retentée sans elles plutôt que de perdre tout le reste (pays,
// système, navigateur…). Sans colonne manquante, c'est un appel Prisma ordinaire.
async function writeWithOptionalColumns(run, data, optionalKeys) {
  try {
    return await run(data)
  } catch (error) {
    const base = { ...data }
    let stripped = false
    for (const key of optionalKeys) {
      if (key in base) { delete base[key]; stripped = true }
    }
    if (!stripped || !Object.keys(base).length) throw error
    return run(base)
  }
}

export async function updateSessionGeo(sessionRowId, values = {}) {
  const data = {}
  for (const key of GEO_FIELDS) {
    if (values[key] === undefined) continue
    data[key] = values[key] === null ? null : String(values[key]).slice(0, key === 'ip' ? 45 : 80)
  }
  for (const key of GEO_COORDS) {
    if (values[key] === undefined) continue
    data[key] = Number.isFinite(values[key]) ? values[key] : null
  }
  if (!Object.keys(data).length) return null
  return writeWithOptionalColumns(
    (payload) => prisma.visitSession.update({ where: { id: sessionRowId }, data: payload, select: { id: true } }),
    data,
    GEO_COORDS,
  )
}

// Provenance balisée (?utm_source=…) : première balise de la session, jamais écrasée ensuite.
// Échoue tant que les colonnes n'existent pas (migration) : l'appelant attrape l'erreur.
export async function updateSessionUtm(sessionRowId, utm) {
  if (!utm?.source) return null
  return prisma.visitSession.updateMany({
    where: { id: sessionRowId, utmSource: null },
    data: { utmSource: utm.source, utmMedium: utm.medium ?? null, utmCampaign: utm.campaign ?? null },
  })
}

// Retrait du consentement : efface IP, ville, région et position de TOUTES les sessions de
// ce navigateur (pas seulement de la visite en cours). Le pays, l'appareil et les pages vues
// restent (agrégats anonymes).
export async function eraseVisitorLocations(visitorRowId) {
  return writeWithOptionalColumns(
    (data) => prisma.visitSession.updateMany({ where: { visitorId: visitorRowId }, data }),
    { ip: null, city: null, region: null, latitude: null, longitude: null },
    GEO_COORDS,
  )
}

// L'IP, la ville et la région ne sont gardées que ANALYTICS_IP_RETENTION_DAYS jours
// (90 par défaut). Le pays, l'appareil et les pages vues restent (agrégats anonymes).
export const IP_RETENTION_DAYS = Math.max(1, Number(process.env.ANALYTICS_IP_RETENTION_DAYS) || 90)
export async function purgeOldVisitorLocations(days = IP_RETENTION_DAYS) {
  const cutoff = new Date(Date.now() - days * 86400000)
  const result = await writeWithOptionalColumns(
    (data) => prisma.visitSession.updateMany({
      where: { startedAt: { lt: cutoff }, OR: [{ ip: { not: null } }, { city: { not: null } }, { region: { not: null } }] },
      data,
    }),
    { ip: null, city: null, region: null, latitude: null, longitude: null },
    GEO_COORDS,
  )
  return result.count
}

export async function recordPageView(sessionRowId, path) {
  return prisma.pageView.create({ data: { sessionId: sessionRowId, path }, select: { id: true } })
}

// Clics d'action (whitelist stricte — voir schema.prisma/VisitorAction).
// Le navigateur ne peut jamais faire enregistrer un type ou un contenu
// arbitraire : /api/track vérifie ACTION_TYPES avant d'appeler ceci.
export const ACTION_TYPES = new Set([
  'whatsapp_click',   // badge flottant, PageCTA/SectionCTA, footer
  'phone_click',      // lien tel: (footer, pages contact)
  'chat_open',        // ouverture du widget AIAssistant
  'contact_submit',   // formulaire de contact envoyé avec succès
  'cta_click',        // autre bouton d'action suivi au cas par cas
])

export async function recordAction(sessionRowId, type, path) {
  if (!ACTION_TYPES.has(type)) return null
  return prisma.visitorAction.create({
    data: { sessionId: sessionRowId, type, path: path ?? null },
    select: { id: true },
  })
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
      select: { path: true, viewedAt: true, session: { select: { visitorId: true } } },
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
  const visitorsByDayMap = new Map() // 'YYYY-MM-DD' -> Set(visitorId interne)
  for (const pv of pageViews) {
    topPagesMap[pv.path] = (topPagesMap[pv.path] || 0) + 1
    const hour = new Date(pv.viewedAt).getHours()
    activeHoursMap[hour] = (activeHoursMap[hour] || 0) + 1

    const day = pv.viewedAt.toISOString().split('T')[0]
    if (!visitorsByDayMap.has(day)) visitorsByDayMap.set(day, new Set())
    visitorsByDayMap.get(day).add(pv.session.visitorId)
  }

  // Visiteurs distincts par jour — un même visitorId qui recharge la même
  // page ou revient plusieurs fois dans la journée ne compte qu'une fois
  // ce jour-là (cf. recharts courbe demandée pour le dashboard).
  const visitorsByDay = Array.from(visitorsByDayMap.entries())
    .map(([date, set]) => ({ date, count: set.size }))
    .sort((a, b) => a.date.localeCompare(b.date))

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
    visitorsByDay,
  }
}

// ══════════════════════════════════════════
// ACTIONS (clics) + VISITEURS RÉCURRENTS + PARCOURS
// ══════════════════════════════════════════

const ACTION_LABELS = {
  whatsapp_click: 'Clic WhatsApp',
  phone_click: 'Clic téléphone',
  chat_open: 'Ouverture chat IA',
  contact_submit: 'Formulaire envoyé',
  cta_click: 'Autre clic CTA',
}

export async function getActionStats(days = 30) {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
  try {
    const rows = await prisma.visitorAction.groupBy({
      by: ['type'],
      where: { createdAt: { gte: since } },
      _count: { id: true },
    })
    return rows
      .map((r) => ({ type: r.type, label: ACTION_LABELS[r.type] || r.type, count: r._count.id }))
      .sort((a, b) => b.count - a.count)
  } catch (err) {
    // Table VisitorAction pas encore migrée (npx prisma db push) — ne
    // fait pas planter le reste du dashboard.
    console.error('[Stats] VisitorAction indisponible (migration à lancer ?) :', err?.message ?? err)
    return []
  }
}

// Visiteurs qui reviennent le plus souvent, sur la fenêtre demandée —
// "nombre de fois il est venu" = nombre de sessions distinctes (pas de
// pages vues) dans cette fenêtre. Le visitorId (cookie) n'est jamais
// exposé en clair : seul un préfixe court (shortId) sert à distinguer
// les lignes dans le dashboard.
export async function getVisitorList(days = 30, limit = 500) {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
  let visitors
  try {
    visitors = await prisma.visitor.findMany({
      where: { sessions: { some: { startedAt: { gte: since } } } },
      select: {
        id: true,
        visitorId: true,
        firstSeenAt: true,
        lastSeenAt: true,
        sessions: {
          where: { startedAt: { gte: since } },
          orderBy: { startedAt: 'asc' },
          select: {
            device: true,
            _count: { select: { pageViews: true, actions: true } },
          },
        },
      },
    })
  } catch (err) {
    console.error('[Stats] getVisitorList indisponible :', err?.message ?? err)
    return { items: [], total: 0 }
  }

  const items = visitors
    .map((v) => ({
      id: v.id,
      shortId: v.visitorId.slice(0, 8),
      firstSeenAt: v.firstSeenAt,
      lastSeenAt: v.lastSeenAt,
      visits: v.sessions.length,
      pageViews: v.sessions.reduce((sum, s) => sum + s._count.pageViews, 0),
      actions: v.sessions.reduce((sum, s) => sum + s._count.actions, 0),
      lastDevice: v.sessions.at(-1)?.device || null,
    }))
    .sort((a, b) => b.visits - a.visits || b.pageViews - a.pageViews)

  // `total` = tous les visiteurs de la fenêtre ; `items` = les `limit` plus actifs.
  // Le dashboard filtre et trie ces `items` côté navigateur et affiche `total`
  // pour signaler quand la liste est tronquée.
  return { items: items.slice(0, limit), total: items.length }
}

export async function getTopVisitors(days = 30, limit = 15) {
  return (await getVisitorList(days, limit)).items
}

// ══════════════════════════════════════════
// GÉOGRAPHIE, APPAREILS, PROVENANCE, VISITES RÉCENTES
// ══════════════════════════════════════════
// Requêtes isolées dans leur propre try/catch : tant que la migration n'est pas
// appliquée (colonnes country/city/ip… absentes), elles renvoient null / [] et le
// reste du dashboard s'affiche normalement.
const topN = (map, n = 12) => [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, n)

// Lecture avec colonnes récentes (position, balise UTM) : si elles n'existent pas encore, on
// relit sans elles — la carte « Villes » et le reste continuent de s'afficher.
async function findSessionsWithExtras(args, extraSelect) {
  try {
    return await prisma.visitSession.findMany({ ...args, select: { ...args.select, ...extraSelect } })
  } catch (error) {
    console.warn('[db] Colonnes récentes absentes (npx prisma db push à appliquer ?) :', error?.message ?? error)
    return prisma.visitSession.findMany(args)
  }
}

export async function getGeoStats(days = 30) {
  const since = new Date(Date.now() - days * 86400000)
  try {
    const rows = await findSessionsWithExtras({
      where: { startedAt: { gte: since } },
      orderBy: { startedAt: 'desc' },
      take: 5000,
      select: { country: true, city: true, os: true, browser: true, referrer: true, userAgent: true },
    }, { latitude: true, longitude: true, utmSource: true })
    const sessions = rows.filter((r) => !isBot(r.userAgent))
    const countries = new Map(), cities = new Map(), systems = new Map(), browsers = new Map(), channels = new Map()
    const cityAgg = new Map()
    let withCity = 0
    for (const r of sessions) {
      if (r.country) countries.set(r.country, (countries.get(r.country) || 0) + 1)
      if (r.city) {
        withCity += 1
        const key = `${r.city}|${r.country || ''}`
        cities.set(key, (cities.get(key) || 0) + 1)
        const agg = cityAgg.get(key) || { city: r.city, country: r.country || null, count: 0, lat: 0, lng: 0, located: 0 }
        agg.count += 1
        if (Number.isFinite(r.latitude) && Number.isFinite(r.longitude)) {
          agg.lat += r.latitude
          agg.lng += r.longitude
          agg.located += 1
        }
        cityAgg.set(key, agg)
      }
      if (r.os) systems.set(r.os, (systems.get(r.os) || 0) + 1)
      if (r.browser) browsers.set(r.browser, (browsers.get(r.browser) || 0) + 1)
      const source = classifySource(r.referrer, r.userAgent, undefined, r.utmSource)
      channels.set(source, (channels.get(source) || 0) + 1)
    }

    // Carte : une pastille par ville. Position moyenne des visites enregistrées ; à défaut (visites
    // antérieures à l'ajout des coordonnées), repli sur la table de villes connues (lib/city-coords.js).
    const cityPoints = []
    let unlocatedSessions = 0
    for (const agg of cityAgg.values()) {
      const point = agg.located ? { lat: agg.lat / agg.located, lng: agg.lng / agg.located } : lookupCityCoords(agg.city, agg.country)
      if (!point) { unlocatedSessions += agg.count; continue }
      cityPoints.push({
        city: agg.city, country: agg.country, count: agg.count,
        lat: Math.round(point.lat * 100) / 100, lng: Math.round(point.lng * 100) / 100,
      })
    }
    cityPoints.sort((a, b) => b.count - a.count)

    return {
      totalSessions: sessions.length,
      withCountry: sessions.filter((r) => r.country).length,
      withCity,
      countries: topN(countries).map(([code, count]) => ({ code, count })),
      cities: topN(cities).map(([key, count]) => { const [city, country] = key.split('|'); return { city, country: country || null, count } }),
      cityPoints: cityPoints.slice(0, 300),
      unlocatedSessions,
      os: topN(systems, 8).map(([name, count]) => ({ name, count })),
      browsers: topN(browsers, 8).map(([name, count]) => ({ name, count })),
      channels: topN(channels, 10).map(([name, count]) => ({ name, count })),
    }
  } catch (err) {
    console.warn('[db] Statistiques géographiques indisponibles (npx prisma db push à appliquer ?) :', err.message)
    return null
  }
}

// Dernières sessions, une ligne par visite : où, depuis quoi, sur quoi, combien de temps.
// `ip`, `city` et `region` ne sont renseignées que pour les visiteurs ayant accepté
// les cookies analytiques (voir /api/track).
export async function getRecentVisits(days = 30, limit = 60) {
  const since = new Date(Date.now() - days * 86400000)
  try {
    const rows = await findSessionsWithExtras({
      where: { startedAt: { gte: since } },
      orderBy: { startedAt: 'desc' },
      take: limit * 2,
      select: {
        id: true, startedAt: true, lastActivityAt: true, device: true, referrer: true, userAgent: true, consent: true,
        country: true, region: true, city: true, ip: true, os: true, browser: true,
        visitor: { select: { visitorId: true, visitCount: true } },
        pageViews: { orderBy: { viewedAt: 'asc' }, select: { path: true } },
      },
    }, { utmSource: true, utmCampaign: true })
    return rows
      .filter((r) => !isBot(r.userAgent))
      .slice(0, limit)
      .map((r) => ({
        id: r.id,
        shortId: r.visitor.visitorId.slice(0, 8),
        at: r.startedAt,
        durationSeconds: Math.max(0, Math.round((new Date(r.lastActivityAt) - new Date(r.startedAt)) / 1000)),
        country: r.country, region: r.region, city: r.city, ip: r.ip,
        device: r.device, os: r.os, browser: r.browser,
        source: classifySource(r.referrer, r.userAgent, undefined, r.utmSource),
        campaign: r.utmCampaign ?? null,
        entryPath: r.pageViews[0]?.path || null,
        pages: r.pageViews.length,
        consent: r.consent,
        returning: r.visitor.visitCount > 1,
      }))
  } catch (err) {
    console.warn('[db] Visites récentes indisponibles (npx prisma db push à appliquer ?) :', err.message)
    return []
  }
}

// Parcours détaillé d'un visiteur : ses dernières sessions, chacune avec
// ses pages vues et actions fusionnées et triées chronologiquement.
// Accepte soit l'id interne (cuid), soit le shortId affiché dans le
// dashboard (préfixe du cookie visitorId).
const JOURNEY_GEO_FIELDS = { country: true, region: true, city: true, ip: true, os: true, browser: true }

function findJourneyVisitor(idOrShortId, sessionsLimit, withGeo) {
  return prisma.visitor.findFirst({
    where: { OR: [{ id: idOrShortId }, { visitorId: { startsWith: idOrShortId } }] },
    select: {
      id: true,
      visitorId: true,
      firstSeenAt: true,
      lastSeenAt: true,
      sessions: {
        orderBy: { startedAt: 'desc' },
        take: sessionsLimit,
        select: {
          id: true,
          startedAt: true,
          device: true,
          consent: true,
          referrer: true,
          userAgent: true,
          ...(withGeo ? JOURNEY_GEO_FIELDS : {}),
          pageViews: { orderBy: { viewedAt: 'asc' }, select: { path: true, viewedAt: true } },
          actions: { orderBy: { createdAt: 'asc' }, select: { type: true, path: true, createdAt: true } },
        },
      },
    },
  })
}

export async function getVisitorJourney(idOrShortId, sessionsLimit = 10) {
  let visitor
  try {
    visitor = await findJourneyVisitor(idOrShortId, sessionsLimit, true)
  } catch (err) {
    // Colonnes de géolocalisation pas encore migrées : on affiche le parcours sans elles.
    console.warn('[db] Parcours sans localisation (npx prisma db push à appliquer ?) :', err.message)
    visitor = await findJourneyVisitor(idOrShortId, sessionsLimit, false)
  }
  if (!visitor) return null

  const sessions = visitor.sessions.map((s) => {
    const events = [
      ...s.pageViews.map((pv) => ({ kind: 'page', label: pv.path, at: pv.viewedAt })),
      ...s.actions.map((a) => ({ kind: 'action', label: ACTION_LABELS[a.type] || a.type, path: a.path, at: a.createdAt })),
    ].sort((a, b) => new Date(a.at) - new Date(b.at))
    return {
      id: s.id,
      startedAt: s.startedAt,
      device: s.device,
      consent: s.consent,
      source: classifySource(s.referrer, s.userAgent),
      location: { country: s.country ?? null, region: s.region ?? null, city: s.city ?? null, ip: s.ip ?? null, os: s.os ?? null, browser: s.browser ?? null },
      events,
    }
  })

  return { shortId: visitor.visitorId.slice(0, 8), firstSeenAt: visitor.firstSeenAt, lastSeenAt: visitor.lastSeenAt, sessions }
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
  // Offre gratuite Groq pour openai/gpt-oss-20b : 1 000 requêtes/jour (console.groq.com/docs/rate-limits).
  groq: { label: 'Groq · GPT-OSS 20B (gratuit)', approxLimit: 1000 },
}

// Famille de fournisseur d'après le nom de modèle enregistré dans Message.modelUsed.
// Les anciens messages (llama-3.1-8b-instant) restent comptés côté Groq.
export function aiProviderOfModel(modelUsed) {
  const name = String(modelUsed ?? '').trim().toLowerCase()
  if (!name) return null
  if (name.startsWith('gemini')) return 'gemini'
  if (name.startsWith('llama') || name.startsWith('openai/') || name.includes('gpt-oss')) return 'groq'
  return null
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
  // chaque réponse (ex: "gemini-3.8-flash", "openai/gpt-oss-20b"),
  // jamais le mot littéral "gemini"/"groq" — la comparaison exacte
  // d'avant ne matchait donc jamais rien et le widget affichait 0/250
  // en permanence. On regroupe maintenant par préfixe de famille.
  const usage = { gemini: 0, groq: 0 }
  for (const row of rows) {
    const provider = aiProviderOfModel(row.modelUsed)
    if (provider) usage[provider] += row._count.id
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
  const count = await prisma.invoice.count({ where: { number: { startsWith: `AKT-${year}-` } } })
  return `AKT-${year}-${String(count + 1).padStart(3, '0')}`
}

// Même logique que getNextInvoiceNumber ci-dessus (comptage simple,
// suggestion éditable à la main) — préfixe distinct (CTR) pour ne
// jamais confondre une réf. contrat avec un numéro de facture.
export async function getNextContractRef(year = new Date().getFullYear()) {
  const count = await prisma.invoice.count({ where: { contractRef: { startsWith: `AKT-CTR-${year}-` } } })
  return `AKT-CTR-${year}-${String(count + 1).padStart(3, '0')}`
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

export async function createQuestionnaire({ type, conversationId = null, contactName = null, contactHandle = null, answers = {} } = {}) {
  const typeMap = {
    portfolio: 'PORTFOLIO',
    vitrine_ecommerce: 'VITRINE_ECOMMERCE',
    saas: 'SAAS',
  }

  const token = globalThis.crypto?.randomUUID ? globalThis.crypto.randomUUID().replace(/-/g, '') : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`

  return prisma.questionnaire.create({
    data: {
      token,
      type: typeMap[String(type)] || 'PORTFOLIO',
      conversationId: conversationId || null,
      contactName: contactName || null,
      contactHandle: contactHandle || null,
      answers: answers || {},
      status: 'STARTED',
    },
  })
}

export async function getQuestionnaireByToken(token) {
  if (!token) return null
  return prisma.questionnaire.findUnique({
    where: { token },
    include: { quote: true },
  })
}

export async function updateQuestionnaireState(id, data) {
  return prisma.questionnaire.update({
    where: { id },
    data,
  })
}

export async function updateQuestionnaireDecision(id, decision) {
  const statusMap = { accepted: 'ACCEPTED', declined: 'DECLINED' }
  return prisma.questionnaire.update({
    where: { id },
    data: {
      status: statusMap[String(decision)] || 'STARTED',
      decidedAt: new Date(),
    },
  })
}

export async function upsertQuestionnaireQuote(questionnaireId, data) {
  return prisma.quote.upsert({
    where: { questionnaireId },
    update: {
      category: data.category,
      tier: data.tier,
      priceMinFCFA: data.priceMinFCFA ?? 0,
      priceMaxFCFA: data.priceMaxFCFA ?? 0,
      rationale: data.rationale || '',
      matchedNeeds: data.matchedNeeds || [],
      positioningPitch: data.positioningPitch || null,
    },
    create: {
      questionnaireId,
      category: data.category,
      tier: data.tier,
      priceMinFCFA: data.priceMinFCFA ?? 0,
      priceMaxFCFA: data.priceMaxFCFA ?? 0,
      rationale: data.rationale || '',
      matchedNeeds: data.matchedNeeds || [],
      positioningPitch: data.positioningPitch || null,
    },
  })
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
