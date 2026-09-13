import { NextResponse } from 'next/server'
import { createQuestionnaire } from '@/lib/db'
import { QUESTIONNAIRES } from '@/lib/questionnaires-schema'

export const runtime = 'nodejs'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const token = searchParams.get('t')
  if (!token) {
    return NextResponse.json({ error: 'Token requis' }, { status: 400 })
  }

  const questionnaire = await getQuestionnaireByToken(token)
  if (!questionnaire) {
    return NextResponse.json({ error: 'Questionnaire introuvable' }, { status: 404 })
  }

  return NextResponse.json({ questionnaire: { id: questionnaire.id, type: questionnaire.type, status: questionnaire.status, answers: questionnaire.answers || {} } })
}

export async function POST(request) {
  try {
    const body = await request.json()
    const type = typeof body.type === 'string' ? body.type : 'portfolio'

    if (!QUESTIONNAIRES[type]) {
      return NextResponse.json({ error: 'Type de questionnaire invalide' }, { status: 400 })
    }

    const questionnaire = await createQuestionnaire({
      type,
      contactName: typeof body.contactName === 'string' ? body.contactName : null,
      contactHandle: typeof body.contactHandle === 'string' ? body.contactHandle : null,
      answers: body.answers || {},
    })

    return NextResponse.json({
      token: questionnaire.token,
      questionnaire: {
        id: questionnaire.id,
        type: questionnaire.type,
        status: questionnaire.status,
        token: questionnaire.token,
      },
    }, { status: 201 })
  } catch (error) {
    console.error('[API Questionnaire] Erreur création:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
