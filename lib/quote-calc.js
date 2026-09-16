// lib/quote-calc.js
// ── MOTEUR DE DEVIS ──────────────────────────────────────────────────
// Même principe que lib/invoice-calc.js pour les factures : le montant
// affiché n'est JAMAIS un nombre renvoyé par le LLM ou par le
// navigateur. Le LLM (Gemini) sert uniquement à CLASSIFIER les réponses
// d'un questionnaire sur un (catégorie, tier) réellement défini dans
// PRICING (lib/data.js) ; sanitizeClassification() revérifie ensuite
// que ce choix existe bel et bien avant tout calcul, et le prix est
// systématiquement relu depuis PRICING — jamais fait confiance à ce que
// le modèle a écrit dans le champ prix.
//
// Fonctions pures (aucun import Prisma / réseau) : appelées depuis
// l'API POST /api/questionnaire/[token]/submit, qui elle gère l'appel
// Gemini réel et l'enregistrement en base.

import { PRICING } from './data'
import { getQuestionnaire, flattenFields } from './questionnaires-schema'

// Catégories PRICING valides pour chaque type de questionnaire.
// 'vitrine_ecommerce' est le seul cas à choix multiple : le
// questionnaire est commun, mais la réponse à wants_online_order fait
// basculer vers la grille "vitrine" ou "ecommerce".
export const CATEGORY_BY_TYPE = {
  // Le questionnaire "portfolio" reste distinct (questions différentes :
  // CV, projets, témoignages) mais son devis pioche désormais dans la
  // grille "vitrine" — PRICING.portfolio n'existe plus depuis la fusion
  // décidée après étude de marché (sept. 2026) : "les familles expliquent
  // les projets, les offres expliquent les prix" (voir WHAT_WE_BUILD).
  portfolio: ['vitrine'],
  vitrine_ecommerce: ['vitrine', 'ecommerce'],
  saas: ['saas'],
}

// Tiers (badges) réellement proposés pour une catégorie PRICING donnée,
// dans l'ordre de la grille — dérivés de PRICING pour ne jamais se
// désynchroniser si la grille tarifaire change dans lib/data.js.
export function tiersFor(category) {
  return (PRICING[category]?.plans || []).map((p) => p.badge)
}

// "175 000 FCFA" → {min:175000,max:175000}
// "600 000 – 1 000 000 FCFA" → {min:600000,max:1000000}
// Insensible au séparateur entre les deux bornes (–, -, à, /mois...) :
// on extrait tous les nombres groupés par 3 chiffres présents dans la
// chaîne, peu importe ce qui les sépare.
export function parsePriceRange(priceLabel = '') {
  const normalized = String(priceLabel).replace(/\u00a0/g, ' ')
  const matches = normalized.match(/\d{1,3}(?:[ ]\d{3})+|\d+/g) || []
  const clean = matches.map((n) => parseInt(n.replace(/\s/g, ''), 10)).filter((n) => !Number.isNaN(n))
  if (clean.length === 0) return { min: 0, max: 0 }
  return { min: Math.min(...clean), max: Math.max(...clean) }
}

// Lecture déterministe du prix pour (catégorie, tier) — retourne null
// si le couple n'existe pas réellement dans PRICING (jamais d'invention).
export function lookupPrice(category, tier) {
  const plan = (PRICING[category]?.plans || []).find((p) => p.badge === tier)
  if (!plan) return null
  const { min, max } = parsePriceRange(plan.price)
  return { min, max, label: plan.price, del: plan.del, features: plan.features }
}

export function formatQuotePrice(min, max) {
  const fmt = (n) => Number(n || 0).toLocaleString('fr-FR')
  if (!min && !max) return 'Sur devis'
  return min === max ? `${fmt(min)} FCFA` : `${fmt(min)} – ${fmt(max)} FCFA`
}

// Construit le prompt de classification envoyé à Gemini (generateContent,
// hors streaming, hors conversation publique — un appel serveur dédié,
// séparé du chat visiteur). Le modèle DOIT choisir dans une liste
// fermée ; sanitizeClassification() ci-dessous revérifie sa réponse.
export function buildClassificationPrompt(type, answers = {}) {
  const q = getQuestionnaire(type)
  const categories = CATEGORY_BY_TYPE[type] || []
  const fields = flattenFields(type)

  const answersText = fields
    .map((f) => {
      const val = answers[f.id]
      if (val === undefined || val === null || val === '') return null
      const displayVal = Array.isArray(val) ? val.join(', ') : String(val)
      return `- ${f.label} → ${displayVal}`
    })
    .filter(Boolean)
    .join('\n')

  const gridText = categories
    .map((cat) => {
      const plans = (PRICING[cat]?.plans || [])
        .map((p) => `  · ${p.badge} (${p.price}, délai ${p.del}) : ${p.features.join(', ')}`)
        .join('\n')
      return `Catégorie "${cat}" — ${PRICING[cat]?.label} :\n${plans}`
    })
    .join('\n\n')

  const validTiers = [...new Set(categories.flatMap((cat) => tiersFor(cat)))]

  return {
    systemInstruction: `Tu es un classificateur commercial pour AKATech Studio (agence web basée à Abidjan). Ta seule tâche : choisir la catégorie et le tier AKATech les plus proches des réponses d'un questionnaire client, EXCLUSIVEMENT parmi la grille fournie ci-dessous. Tu ne dois JAMAIS inventer un prix, un tier ou une catégorie absente de cette grille — le prix affiché au client sera de toute façon relu directement dans la grille, pas dans ta réponse. Si le besoin dépasse largement tous les tiers d'une catégorie, choisis quand même le tier le plus proche et signale l'écart dans "rationale" : Aka tranchera manuellement. Réponds UNIQUEMENT avec un objet JSON valide, sans texte avant ni après, au format exact : {"category": "...", "tier": "...", "rationale": "2 à 3 phrases en français, concrètes, qui citent les besoins précis du client justifiant ce choix", "matchedNeeds": ["besoin détecté 1", "besoin détecté 2"]}`,
    userContent: `Type de projet : ${q?.label || type}\n\nGrille tarifaire disponible (choisir uniquement dans cette liste) :\n${gridText}\n\nCatégories valides : ${categories.join(', ')}\nTiers valides : ${validTiers.join(', ')}\n\nRéponses du client au questionnaire :\n${answersText || '(aucune réponse exploitable)'}`,
    validCategories: categories,
    validTiers,
  }
}

// Revérifie la sortie du LLM avant tout enregistrement : si category/tier
// ne correspondent pas EXACTEMENT à un plan réel de PRICING, on retombe
// sur le premier tier de la première catégorie valide pour ce type,
// plutôt que de faire confiance à une hallucination ou à un JSON mal
// formé. Le prix retourné vient toujours de lookupPrice(), jamais de
// llmOutput lui-même (llmOutput n'a d'ailleurs pas de champ prix).
export function sanitizeClassification(type, llmOutput) {
  const categories = CATEGORY_BY_TYPE[type] || []
  const category = categories.includes(llmOutput?.category) ? llmOutput.category : categories[0]
  const validTiersForCategory = tiersFor(category)
  const tier = validTiersForCategory.includes(llmOutput?.tier) ? llmOutput.tier : validTiersForCategory[0]
  const price = lookupPrice(category, tier)

  return {
    category,
    tier,
    priceMinFCFA: price?.min ?? 0,
    priceMaxFCFA: price?.max ?? 0,
    priceLabel: formatQuotePrice(price?.min ?? 0, price?.max ?? 0),
    del: price?.del || '',
    rationale: typeof llmOutput?.rationale === 'string' && llmOutput.rationale.trim()
      ? llmOutput.rationale.trim().slice(0, 1000)
      : 'Correspondance déterminée automatiquement à partir des réponses du questionnaire.',
    matchedNeeds: Array.isArray(llmOutput?.matchedNeeds)
      ? llmOutput.matchedNeeds.slice(0, 12).map((n) => String(n).slice(0, 200))
      : [],
  }
}
