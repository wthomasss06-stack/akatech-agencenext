import { NextResponse } from 'next/server'
import { getQuestionnaireByToken, updateQuestionnaireDecision } from '@/lib/db'
import { sendQuestionnaireEmail } from '@/lib/questionnaire-pdf'

export const runtime = 'nodejs'

export async function POST(request, { params }) {
  try {
    const questionnaire = await getQuestionnaireByToken(params.token)
    if (!questionnaire) {
      return NextResponse.json({ error: 'Questionnaire introuvable' }, { status: 404 })
    }

    const body = await request.json()
    const decision = typeof body.decision === 'string' ? body.decision.toLowerCase() : ''
    if (!['accepted', 'declined'].includes(decision)) {
      return NextResponse.json({ error: 'Decision invalide' }, { status: 400 })
    }

    if (questionnaire.status !== 'QUOTED') {
      return NextResponse.json({ error: 'Le devis doit être généré avant cette décision' }, { status: 409 })
    }

    const updated = await updateQuestionnaireDecision(questionnaire.id, decision)

    if (decision === 'accepted') {
      try {
        await sendQuestionnaireEmail({
          questionnaire: { ...questionnaire, ...updated, answers: questionnaire.answers || {}, status: updated.status },
          quote: questionnaire.quote || null,
          mode: 'accepted',
        })
      } catch (error) {
        console.warn('[Questionnaire Decision] Email d’acceptation non envoyé:', error?.message || error)
      }
    }

    return NextResponse.json({
      success: true,
      questionnaire: {
        id: updated.id,
        status: updated.status,
        decidedAt: updated.decidedAt,
      },
    })
  } catch (error) {
    console.error('[API Questionnaire Decision] Erreur:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
