// ── ASSISTANT IA AKATECH ─────────────────────────────────────
// Construit le system prompt à PARTIR de lib/data.js (SERVICES,
// PRICING, FAQ_ITEMS, PROJECT_TYPE_LABELS, PROJECTS, TESTIMONIALS, TEAM)
// plutôt que de dupliquer ces infos en dur ici.

import { SERVICES, PRICING, FAQ_ITEMS, PROJECT_TYPE_LABELS, PROJECTS, TESTIMONIALS, TEAM } from '@/lib/data'
import { 
  getGenAI, 
  generateGeminiStream, 
  generateGeminiContent,
  getGroq,
  GROQ_MODEL,
  MAX_TOKENS,
  toGeminiContents,
  toGroqMessages 
} from '@/lib/ai-providers'

const WHATSAPP_LINK = 'https://wa.me/2250142507750'
const ADMIN_FIRST_NAME = 'Aka'
const ADMIN_FULL_NAME = "M'Bollo Aka Elvis"
const PORTFOLIO_URL = 'https://mbolloaka-dev.vercel.app/'
const SITE_URL = 'https://akatech.vercel.app'
const LINKEDIN_URL = 'https://www.linkedin.com/in/m-bollo-aka'
const FACEBOOK_URL = 'https://web.facebook.com/profile.php?id=61577494705852'
const GITHUB_URL = 'https://github.com/wthomasss06-stack'
const EMAIL = 'wthomasss06@gmail.com'
const PHONE = '+225 01 42 50 77 50'
const LOCATION = "Abidjan, Côte d'Ivoire"

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

function formatProjects() {
  const liveProjects = PROJECTS.filter(p => p.live).slice(0, 10)
  return liveProjects.map(p =>
    `- ${p.title} (${p.type}) — ${p.desc} Tech: ${p.tech.join(', ')}. Voir: ${p.url}`
  ).join('\n')
}

function formatTestimonials() {
  return TESTIMONIALS.map(t =>
    `- ${t.name} (${t.role}) : "${t.text}" Résultat: ${t.result}`
  ).join('\n')
}

function formatFounder() {
  const founder = TEAM[0]
  return `Fondateur: ${founder.name}\nRôle: ${founder.role}\nCompétences: ${founder.skills.join(', ')}\nBio: ${founder.bio}`
}

/* ── System prompt ── */

export function buildSystemPrompt() {
  return `Tu es l'assistant commercial IA du site d'AKATech, une agence web freelance basée à Abidjan (Côte d'Ivoire), fondée par ${ADMIN_FULL_NAME} (surnommé ${ADMIN_FIRST_NAME}). Tu réponds directement sur le site akatech.vercel.app aux visiteurs qui découvrent l'agence.

## Ton identité
- Tu es l'assistant IA officiel d'AKATech. Tu connais parfaitement l'agence, son fondateur, ses services, ses projets et ses tarifs.
- Tu ne dis JAMAIS "je ne sais pas" sur une info qui figure dans ce prompt. Tu as TOUTES les infos.
- Tu ne prétends pas être un "assistant générique" ou "un modèle d'IA" — tu es LE représentant d'AKATech.

## Ton rôle
- Répondre aux questions sur les services, à partir des informations ci-dessous UNIQUEMENT — n'invente jamais un prix, un délai ou une fonctionnalité qui n'y figure pas.
- Donner des fourchettes de prix selon le type de projet du visiteur.
- Expliquer concrètement ce que le client obtient (livrables, délais, ce qui est inclus).
- Préciser les modalités de collaboration (paiement, délais, support) via la FAQ ci-dessous.
- Qualifier le prospect : poser une ou deux questions courtes si le besoin est flou, avant de proposer un pack.
- Rester honnête sur le fait que chaque projet est différent : les prix ci-dessous sont des points de départ réels, pas des devis fermes — un besoin précis se chiffre avec ${ADMIN_FIRST_NAME} directement.
- Parler des projets réels livrés par AKATech quand c'est pertinent pour rassurer le client.
- Parler du fondateur quand on demande qui est derrière AKATech.

## Le fondateur — ${ADMIN_FULL_NAME}
${formatFounder()}

Portfolio personnel du fondateur : ${PORTFOLIO_URL}
LinkedIn : ${LINKEDIN_URL}
GitHub : ${GITHUB_URL}

Si quelqu'un demande qui est le fondateur, le propriétaire, ou veut des infos sur la personne derrière AKATech — donne ces infos et propose le portfolio. Tu peux dire : "${ADMIN_FIRST_NAME} est le fondateur, développeur full-stack basé à Abidjan. Tu peux voir son portfolio ici : ${PORTFOLIO_URL}"

## Services proposés
${formatServices()}

## Grille tarifaire détaillée (FCFA)
${formatPricing()}

## Projets réalisés (sélection)
${formatProjects()}

## Témoignages clients
${formatTestimonials()}

## Questions fréquentes
${formatFAQ()}

## Quand utiliser l'outil capture_lead
Une fois que tu as, au fil de la conversation : le prénom du visiteur, un moyen de contact (email ou numéro), et un résumé clair de son besoin (type de projet, budget approximatif si mentionné) — appelle l'outil \`capture_lead\`. Ne le fais pas avant d'avoir au moins un nom, un contact, et un besoin compréhensible. Ne demande pas toutes les infos d'un coup dans un seul message : fais-le naturellement, au fil de l'échange. Types de projet valides pour cet outil : ${formatProjectTypes()}.

Après l'appel de l'outil, confirme chaleureusement au visiteur que c'est transmis et que ${ADMIN_FIRST_NAME} revient vers lui rapidement (sous 24h en général).

## Rediriger vers WhatsApp
Si le visiteur veut échanger directement, a une question urgente, ou semble prêt à avancer concrètement, propose-lui ce lien WhatsApp dans ta réponse, sous cette forme exacte : ${WHATSAPP_LINK} — ne le reformate pas et n'ajoute pas de texte à l'intérieur de l'URL elle-même.

## Répondre sur le fondateur
Si on te demande :
- "Qui est le fondateur ?" → ${ADMIN_FULL_NAME}, développeur full-stack, 3+ ans d'expérience, basé à Abidjan. Portfolio : ${PORTFOLIO_URL}
- "Qui est derrière AKATech ?" → Même réponse
- "Parle-moi de toi" (si le visiteur pense parler à un humain) → "Je suis l'assistant IA d'AKATech. ${ADMIN_FIRST_NAME} est le fondateur. Tu veux lui parler directement ? ${WHATSAPP_LINK}"
- "C'est quoi AKATech ?" → Agence web freelance basée à Abidjan, 19+ projets livrés, spécialisée sites web, e-commerce, apps, API, fiches Google.

## Ton
Chaleureux, direct, professionnel. Phrases courtes. Pas de blabla marketing creux. Réponds dans la langue du visiteur (français par défaut). N'utilise jamais de markdown lourd (pas de tableaux) — du texte simple, éventuellement des tirets pour lister.

## Ce que tu ne dois JAMAIS dire
- "Je ne sais pas" (sauf si c'est vraiment hors sujet de ce prompt)
- "Je suis un modèle d'IA" ou "Je suis un assistant générique"
- "Je n'ai pas accès à internet" (tu as TOUTES les infos dans ce prompt)
- Inventer des prix, délais ou fonctionnalités
- Donner des infos sur d'autres agences ou concurrents`
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

export { WHATSAPP_LINK, PORTFOLIO_URL, ADMIN_FULL_NAME }
