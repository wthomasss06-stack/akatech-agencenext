// app/api/assistant/end/route.js
// Remplace l'ancien /api/assistant/report (résumé IA + email). Le
// dashboard affichant déjà les conversations en direct, ce résumé par
// email faisait double emploi tout en consommant du quota Gemini/Groq
// pour rien. Cette route se contente de clôturer proprement la
// conversation en base — gratuit, instantané, aucune dépendance externe.
import { createRateLimiter, getClientIp } from '@/lib/ai-providers'
import { getOrCreateConversation, updateConversationStatus } from '@/lib/db'

export const runtime = 'nodejs'

const { isRateLimited, pruneOldEntries } = createRateLimiter(60_000, 10)

export async function POST(request) {
  pruneOldEntries()
  const ip = getClientIp(request)
  // 200 volontaire dans tous les cas : sendBeacon ignore la réponse,
  // et rater la clôture d'une conversation n'est jamais critique.
  if (isRateLimited(ip)) {
    return Response.json({ ok: false, reason: 'rate-limited' })
  }

  if (!process.env.DATABASE_URL) {
    return Response.json({ ok: false, reason: 'no-database' })
  }

  try {
    const body = await request.json()
    const sessionId = typeof body.sessionId === 'string' && body.sessionId.length <= 100 ? body.sessionId : null
    if (!sessionId) return Response.json({ ok: false, reason: 'invalid-session' })

    const conversation = await getOrCreateConversation(sessionId)
    if (conversation.status === 'ACTIVE') {
      await updateConversationStatus(conversation.id, 'ENDED')
    }
    return Response.json({ ok: true })
  } catch (error) {
    console.error('[Assistant/end] Erreur:', error?.message ?? error)
    return Response.json({ ok: false }, { status: 200 })
  }
}
