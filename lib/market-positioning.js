// lib/market-positioning.js
// ── PITCH DE POSITIONNEMENT — version allégée des Étapes 02 + 04 ────
// du skill akatech-project-orchestrator.
//
// Le skill complet (11 étapes, Decision Gates, recherche web
// obligatoire avec minimum 3 concurrents directs + 2 indirects,
// TAM/SAM/SOM, Risk Register...) est pensé pour cadrer un projet
// client de bout en bout — beaucoup trop lourd pour une réponse en
// direct sur le site public. Ici, on garde seulement l'ESPRIT de deux
// étapes, condensé en UN appel LLM rapide, sans recherche web :
//
//   - Étape 02 (Market & Competitive Intelligence) → repérer UNE
//     opportunité concrète pour ce business précis, à partir de ce
//     qu'il a déjà écrit dans le questionnaire (pas de recherche
//     concurrents en direct, pas de TAM/SAM/SOM)
//   - Étape 04 (Product Differentiation / Positionnement) → formuler
//     cette opportunité comme une accroche courte et vendeuse, dans
//     l'esprit d'un Positioning Statement, mais en 3-4 phrases grand
//     public plutôt qu'un livrable formel avec Decision Gate
//
// CHOIX DE MODÈLE — volontairement Groq (llama-3.1-8b-instant), PAS
// Gemini : cet appel est un bonus expérimental, pas encore une
// décision ferme. Il ne doit consommer AUCUN quota de la cascade
// Gemini (lib/ai-providers.js) utilisée par le chat principal ET par
// la classification du devis (lib/quote-calc.js) — Groq est un pool de
// quota totalement séparé. Il ne se déclenche qu'une fois par
// questionnaire SOUMIS, pas par message de chat : un événement
// naturellement rare (quelqu'un qui finit un formulaire de 26 à 62
// questions), pas à chaque visiteur.
//
// Doit échouer EN SILENCE : si Groq est indisponible, en quota
// dépassé, ou renvoie une réponse jugée risquée, le devis et la
// soumission continuent normalement sans ce texte bonus — jamais un
// blocage. Voir sanitizePitch() : elle renvoie null dans ce cas, à
// traiter comme "pas de pitch cette fois", pas comme une erreur.
//
// Fonctions pures ici aussi (comme lib/quote-calc.js) : la route API
// (Phase 2) importe buildPositioningPrompt(), appelle elle-même
// generateGroqContent() (déjà dans lib/ai-providers.js), puis passe le
// résultat à sanitizePitch() avant tout enregistrement/affichage.

import { getQuestionnaire } from './questionnaires-schema'

// Champs "à signal fort" pour le positionnement — volontairement plus
// courts que la liste complète utilisée pour le PDF/la classification
// du devis (lib/quote-calc.js) : moins de texte envoyé = prompt plus
// court = appel plus rapide et moins coûteux, même sur Groq. Aucune
// coordonnée (téléphone, budget, date) n'est incluse : pas utile pour
// cette tâche, pas la peine de l'exposer au LLM.
const POSITIONING_SIGNAL_FIELDS = {
  portfolio: ['main_goal', 'bio', 'skills', 'testimonials', 'credibility_numbers', 'completion_goal'],
  vitrine_ecommerce: ['activity_description', 'services_offered', 'why_now', 'current_problem', 'wished_capability', 'priority_cta', 'completion_goal'],
  saas: ['description', 'problem_solved', 'differentiation', 'competitors', 'why_now'],
}

const MAX_PITCH_LENGTH = 600 // ~4 phrases généreuses ; au-delà on tronque plutôt que d'afficher un pavé

// Construit le prompt. Renvoie null si le questionnaire n'a rien
// d'exploitable pour cette tâche précise (pas la peine de dépenser un
// appel LLM sur des réponses vides).
export function buildPositioningPrompt(type, answers = {}) {
  const q = getQuestionnaire(type)
  const fieldIds = POSITIONING_SIGNAL_FIELDS[type] || []
  const fields = (q?.sections || []).flatMap((s) => s.fields).filter((f) => fieldIds.includes(f.id))

  const signalText = fields
    .map((f) => {
      const val = answers[f.id]
      if (val === undefined || val === null || val === '') return null
      return `- ${f.label} → ${Array.isArray(val) ? val.join(', ') : val}`
    })
    .filter(Boolean)
    .join('\n')

  if (!signalText) return null

  return {
    systemInstruction: `Tu es un consultant en positionnement pour AKATech Studio, agence web à Abidjan. À partir de ce qu'un prospect a écrit sur son activité, repère UNE opportunité concrète qu'un site professionnel peut lui apporter, puis rédige un message de 3 à 4 phrases MAXIMUM qui : (1) montre que tu as compris son activité précise, pas un texte générique, (2) met en avant 1 à 2 forces réelles déjà mentionnées par le prospect, (3) explique concrètement ce qu'AKATech va lui apporter au-delà d'un simple site — quelque chose de précis lié à ce qu'il a décrit (ex : automatiser une tâche qu'il a citée, résoudre le problème qu'il a nommé), pas une promesse vague. Règles strictes : n'invente AUCUN chiffre, pourcentage, délai de retour sur investissement, statistique de marché ou nom de concurrent. Reste ancré uniquement dans ce que le prospect a écrit. Pas de titre, pas de liste à puces : uniquement le texte du message, ton chaleureux et direct.`,
    userContent: `Type de projet : ${q?.label || type}\n\nCe que le prospect a écrit :\n${signalText}`,
  }
}

// Filtre les tournures à risque qu'une consigne peut occasionnellement
// ne pas empêcher (chiffres de croissance/ROI, "leader du marché"...).
// Sans le flag "g" : on veut juste tester une présence, pas itérer —
// un regex global gardé en mémoire fausserait les appels suivants
// (lastIndex persistant entre deux sanitizePitch() successifs).
const RISKY_PATTERNS = [
  /\d+\s?%/,
  /retour sur investissement/i,
  /leader (du|sur le) marché/i,
  /\d[\d\s]*\s?(FCFA|millions?|milliers?)\b.{0,25}(croissance|chiffre d'affaires|revenus?)/i,
]

// Revérifie la sortie Groq avant tout enregistrement/affichage. Renvoie
// null si le texte est vide, ou contient une tournure à risque — dans
// ce cas, le devis s'affiche simplement sans texte de positionnement,
// jamais une erreur bloquante.
export function sanitizePitch(rawText) {
  if (!rawText || typeof rawText !== 'string') return null
  let text = rawText.trim()
  if (!text) return null
  for (const pattern of RISKY_PATTERNS) {
    if (pattern.test(text)) return null
  }
  if (text.length > MAX_PITCH_LENGTH) {
    text = text.slice(0, MAX_PITCH_LENGTH).replace(/\s+\S*$/, '') + '…'
  }
  return text
}
