import { NextResponse } from 'next/server'
import { generateGeminiContent, generateGroqContent } from '@/lib/ai-providers'
import { getQuestionnaireByToken, updateQuestionnaireState, upsertQuestionnaireQuote, saveQuestionnaireLead } from '@/lib/db'
import { buildClassificationPrompt, sanitizeClassification, tiersFor, CATEGORY_BY_TYPE } from '@/lib/quote-calc'
import { flattenFields } from '@/lib/questionnaires-schema'
import { buildPositioningPrompt, sanitizePitch } from '@/lib/market-positioning'
import { sendQuestionnaireEmail } from '@/lib/questionnaire-pdf'

export const runtime = 'nodejs'

function normalizeQuestionnaireType(type) {
  const map = {
    PORTFOLIO: 'portfolio',
    VITRINE_ECOMMERCE: 'vitrine_ecommerce',
    SAAS: 'saas',
  }
  return map[String(type)] || String(type || 'portfolio')
}

function isVisible(field, answers) {
  if (!field?.showIf) return true
  const value = answers[field.showIf.field]
  if (field.showIf.equals !== undefined) return value === field.showIf.equals
  if (field.showIf.includes !== undefined) return Array.isArray(value)
    ? value.includes(field.showIf.includes)
    : String(value ?? '').includes(String(field.showIf.includes))
  return true
}

function missingRequiredFields(type, answers) {
  return flattenFields(type)
    .filter((field) => field.required && isVisible(field, answers))
    .filter((field) => {
      const value = answers[field.id]
      return Array.isArray(value) ? value.length === 0 : String(value ?? '').trim() === ''
    })
    .map((field) => field.label)
}

// Aucune limite n'existait au-delà du plafond générique de la plateforme
// (~4,5 Mo sur les fonctions Vercel) : un payload abusif pouvait donc
// gonfler la base, le prompt de classification (coût Gemini) et le PDF.
// 100 Ko couvre largement 62 réponses en texte libre ; 5 000 caractères
// par champ dépasse largement la plus longue question du questionnaire.
const MAX_ANSWERS_BYTES = 100_000
const MAX_FIELD_LENGTH = 5_000

function validateAnswersSize(answers) {
  const serialized = JSON.stringify(answers)
  if (Buffer.byteLength(serialized, 'utf8') > MAX_ANSWERS_BYTES) {
    return 'Le formulaire envoyé est trop volumineux.'
  }
  for (const [key, value] of Object.entries(answers)) {
    const asString = Array.isArray(value) ? value.join(', ') : String(value ?? '')
    if (asString.length > MAX_FIELD_LENGTH) {
      return `Une réponse est trop longue (${key}).`
    }
  }
  return null
}

function extractGeminiText(response) {
  if (!response) return ''
  if (typeof response.text === 'string') return response.text
  const parts = response?.candidates?.[0]?.content?.parts || []
  const text = parts
    .map((part) => part?.text || '')
    .join('')
  return text || ''
}

async function classifyAnswers(type, answers) {
  const prompt = buildClassificationPrompt(type, answers)
  const fallbackCategory = (CATEGORY_BY_TYPE[type] || [])[0] || 'portfolio'
  const fallbackTier = tiersFor(fallbackCategory)[0] || 'STARTER'

  try {
    const hasGeminiKey = Boolean(process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY_2 || process.env.GEMINI_API_KEY_3 || process.env.GEMINI_API_KEY_4)
    if (!hasGeminiKey) {
      return sanitizeClassification(type, { category: fallbackCategory, tier: fallbackTier, rationale: 'Classification fallback sans clé Gemini active.' })
    }

    const answer = await generateGeminiContent({
      model: 'gemini-2.5-flash',
      contents: [{ role: 'user', parts: [{ text: prompt.userContent }] }],
      config: { systemInstruction: prompt.systemInstruction },
    })

    const raw = extractGeminiText(answer)
    const match = raw.match(/\{[\s\S]*\}/)
    if (!match) {
      throw new Error('JSON invalide dans la réponse Gemini')
    }

    const parsed = JSON.parse(match[0])
    return sanitizeClassification(type, parsed)
  } catch (error) {
    console.warn('[Questionnaire] Classification fallback:', error?.message || error)
    return sanitizeClassification(type, { category: fallbackCategory, tier: fallbackTier, rationale: 'Classification fallback à partir des réponses du formulaire.' })
  }
}

async function buildPitch(type, answers) {
  const prompt = buildPositioningPrompt(type, answers)
  if (!prompt) return null

  try {
    const hasGroqKey = Boolean(process.env.GROQ_API_KEY)
    if (!hasGroqKey) return null
    const content = await generateGroqContent([
      { role: 'system', content: prompt.systemInstruction },
      { role: 'user', content: prompt.userContent },
    ])
    return sanitizePitch(content)
  } catch (error) {
    console.warn('[Questionnaire] Pitch non généré:', error?.message || error)
    return null
  }
}

export async function GET(_request, { params }) {
  const questionnaire = await getQuestionnaireByToken(params.token)
  if (!questionnaire) {
    return NextResponse.json({ error: 'Questionnaire introuvable' }, { status: 404 })
  }

  return NextResponse.json({
    questionnaire: {
      id: questionnaire.id,
      token: questionnaire.token,
      type: normalizeQuestionnaireType(questionnaire.type),
      status: questionnaire.status,
      answers: questionnaire.answers || {},
      contactName: questionnaire.contactName,
      contactHandle: questionnaire.contactHandle,
      createdAt: questionnaire.createdAt,
      submittedAt: questionnaire.submittedAt,
      quote: questionnaire.quote || null,
    },
  })
}

export async function POST(request, { params }) {
  try {
    const questionnaire = await getQuestionnaireByToken(params.token)
    if (!questionnaire) {
      return NextResponse.json({ error: 'Questionnaire introuvable' }, { status: 404 })
    }
    if (['ACCEPTED', 'DECLINED'].includes(questionnaire.status)) {
      return NextResponse.json({ error: 'Ce devis a déjà fait l’objet d’une décision' }, { status: 409 })
    }

    const body = await request.json()
    const answers = typeof body.answers === 'object' && body.answers ? body.answers : {}
    const sizeError = validateAnswersSize(answers)
    if (sizeError) {
      return NextResponse.json({ error: sizeError }, { status: 413 })
    }
    const type = normalizeQuestionnaireType(questionnaire.type)
    const missingFields = missingRequiredFields(type, answers)
    if (missingFields.length > 0) {
      return NextResponse.json({ error: `Champs requis manquants : ${missingFields.slice(0, 6).join(', ')}` }, { status: 400 })
    }
    const contactName = typeof body.contactName === 'string' ? body.contactName : questionnaire.contactName || null
    const contactHandle = typeof body.contactHandle === 'string' ? body.contactHandle : questionnaire.contactHandle || answers.email || answers.whatsapp || answers.phone || null

    const updated = await updateQuestionnaireState(questionnaire.id, {
      answers,
      contactName,
      contactHandle,
      submittedAt: new Date(),
      status: 'SUBMITTED',
    })

    const classification = await classifyAnswers(type, answers)
    const pitch = await buildPitch(type, answers)

    const quote = await upsertQuestionnaireQuote(updated.id, {
      category: classification.category,
      tier: classification.tier,
      priceMinFCFA: classification.priceMinFCFA,
      priceMaxFCFA: classification.priceMaxFCFA,
      rationale: classification.rationale,
      matchedNeeds: classification.matchedNeeds,
      positioningPitch: pitch,
    })

    const finalQuestionnaire = {
      ...updated,
      type,
      answers,
      contactName,
      contactHandle,
      status: 'QUOTED',
      submittedAt: updated.submittedAt || new Date(),
    }

    await updateQuestionnaireState(updated.id, {
      status: 'QUOTED',
      submittedAt: updated.submittedAt || new Date(),
    })

    if (updated.conversationId) {
      await saveQuestionnaireLead(updated.conversationId, {
        name: contactName,
        contact: contactHandle,
        project_type: quote.category,
        budget_range: answers.budget_range || answers.budget_timeline || 'Non précisé',
        timeline: answers.launch_date || 'Non précisé',
        summary: classification.rationale || `Questionnaire ${type} soumis pour préparation d'un devis.`,
      })
    }

    try {
      await sendQuestionnaireEmail({
        questionnaire: finalQuestionnaire,
        quote: {
          category: quote.category,
          tier: quote.tier,
          priceMinFCFA: quote.priceMinFCFA,
          priceMaxFCFA: quote.priceMaxFCFA,
          rationale: quote.rationale,
        },
        mode: 'submitted',
      })
    } catch (error) {
      console.warn('[Questionnaire] Email de soumission non envoyé:', error?.message || error)
    }

    return NextResponse.json({
      success: true,
      questionnaire: {
        id: updated.id,
        token: updated.token,
        type,
        status: 'QUOTED',
      },
      quote: {
        id: quote.id,
        category: quote.category,
        tier: quote.tier,
        priceMinFCFA: quote.priceMinFCFA,
        priceMaxFCFA: quote.priceMaxFCFA,
        rationale: quote.rationale,
        matchedNeeds: quote.matchedNeeds || [],
        positioningPitch: quote.positioningPitch,
        priceLabel: `${quote.priceMinFCFA.toLocaleString('fr-FR')} FCFA${quote.priceMinFCFA !== quote.priceMaxFCFA ? ` – ${quote.priceMaxFCFA.toLocaleString('fr-FR')} FCFA` : ''}`,
      },
    })
  } catch (error) {
    console.error('[API Questionnaire POST] Erreur:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
