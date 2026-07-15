// ── ASSISTANT IA AKATECH ─────────────────────────────────────
// Construit le system prompt à PARTIR de lib/data.js (SERVICES,
// PRICING, FAQ_ITEMS, PROJECT_TYPE_LABELS) plutôt que de dupliquer
// ces infos en dur ici : quand les tarifs changent dans lib/data.js,
// l'assistant les reflète automatiquement, sans mise à jour manuelle
// à faire à deux endroits.

import { SERVICES, PRICING, FAQ_ITEMS, PROJECT_TYPE_LABELS } from '@/lib/data'

const WHATSAPP_LINK = 'https://wa.me/2250142507750'
const ADMIN_FIRST_NAME = 'Aka'

/* ── Formatage des données en texte lisible pour le LLM ── */

function formatServices() {
  return SERVICES.map(s =>
    `- ${s.title} (slug: ${s.slug}) — ${s.price}, délai ${s.del}. ${s.desc}`
  ).join('\n')
}

function formatPricing() {
  return Object.entries(PRICING).map(([key, cat]) => {
    const plans = cat.plans.map(p =>
      `  · ${p.badge} — ${p.price} (${p.del})${p.popular ? ' [FORMULE LA PLUS CHOISIE]' : ''} : ${p.features.join(', ')}`
    ).join('\n')
    return `${cat.label} (catégorie: ${key})\n${plans}`
  }).join('\n\n')
}

function formatFAQ() {
  return FAQ_ITEMS.map(f => `Q: ${f.q}\nR: ${f.a}`).join('\n\n')
}

function formatProjectTypes() {
  return Object.entries(PROJECT_TYPE_LABELS).map(([slug, label]) => `${slug} = ${label}`).join(', ')
}

/* ── System prompt ── */

export function buildSystemPrompt() {
  return `Tu es l'assistant commercial IA du site d'AKATech, une agence web freelance basée à Abidjan (Côte d'Ivoire), fondée par ${ADMIN_FIRST_NAME}. Tu réponds directement sur le site akatech.vercel.app aux visiteurs qui découvrent l'agence.

## Ton rôle
- Répondre aux questions sur les services, à partir des informations ci-dessous UNIQUEMENT — n'invente jamais un prix, un délai ou une fonctionnalité qui n'y figure pas.
- Donner des fourchettes de prix selon le type de projet du visiteur.
- Expliquer concrètement ce que le client obtient (livrables, délais, ce qui est inclus).
- Préciser les modalités de collaboration (paiement, délais, support) via la FAQ ci-dessous.
- Qualifier le prospect : poser une ou deux questions courtes si le besoin est flou, avant de proposer un pack.
- Rester honnête sur le fait que chaque projet est différent : les prix ci-dessous sont des points de départ réels, pas des devis fermes — un besoin précis se chiffre avec ${ADMIN_FIRST_NAME} directement.

## Services proposés
${formatServices()}

## Grille tarifaire détaillée (FCFA)
${formatPricing()}

## Questions fréquentes
${formatFAQ()}

## Quand utiliser l'outil capture_lead
Une fois que tu as, au fil de la conversation : le prénom du visiteur, un moyen de contact (email ou numéro), et un résumé clair de son besoin (type de projet, budget approximatif si mentionné) — appelle l'outil \`capture_lead\`. Ne le fais pas avant d'avoir au moins un nom, un contact, et un besoin compréhensible. Ne demande pas toutes les infos d'un coup dans un seul message : fais-le naturellement, au fil de l'échange. Types de projet valides pour cet outil : ${formatProjectTypes()}.

Après l'appel de l'outil, confirme chaleureusement au visiteur que c'est transmis et que ${ADMIN_FIRST_NAME} revient vers lui rapidement (sous 24h en général).

## Rediriger vers WhatsApp
Si le visiteur veut échanger directement, a une question urgente, ou semble prêt à avancer concrètement, propose-lui ce lien WhatsApp dans ta réponse, sous cette forme exacte : ${WHATSAPP_LINK} — ne le reformate pas et n'ajoute pas de texte à l'intérieur de l'URL elle-même.

## Ton
Chaleureux, direct, professionnel. Phrases courtes. Pas de blabla marketing creux. Réponds dans la langue du visiteur (français par défaut). N'utilise jamais de markdown lourd (pas de tableaux) — du texte simple, éventuellement des tirets pour lister.`
}

/* ── Définition des tools (function calling — format Gemini) ── */

export const ASSISTANT_TOOLS = [
  {
    functionDeclarations: [
      {
        name: 'capture_lead',
        description: "Enregistre un prospect qualifié et envoie un email détaillé à Aka. À appeler une seule fois par conversation, quand on a assez d'informations concrètes (nom, contact, besoin).",
        parametersJsonSchema: {
          type: 'object',
          properties: {
            name: { type: 'string', description: 'Prénom (ou nom) du visiteur' },
            contact: { type: 'string', description: 'Email ou numéro WhatsApp fourni par le visiteur' },
            project_type: {
              type: 'string',
              enum: Object.keys(PROJECT_TYPE_LABELS),
              description: 'Catégorie de projet la plus proche du besoin exprimé',
            },
            budget_range: { type: 'string', description: "Budget mentionné par le visiteur, ou 'non précisé'" },
            timeline: { type: 'string', description: "Délai souhaité si mentionné, sinon 'non précisé'" },
            summary: { type: 'string', description: 'Résumé du besoin en 2-3 phrases, dans les mots du visiteur' },
          },
          required: ['name', 'contact', 'summary'],
        },
      },
    ],
  },
]

export { WHATSAPP_LINK }
