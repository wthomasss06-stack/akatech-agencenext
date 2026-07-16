// app/api/assistant/report/route.js
import {
  getGenAI, getGroq, getResend, generateGeminiContent,
  GROQ_MODEL, createRateLimiter, getClientIp,
  sanitizeMessages, escapeHtml,
} from '@/lib/ai-providers'
import { getOrCreateConversation, saveReport, updateConversationStatus } from '@/lib/db'

export const runtime = 'nodejs'

const { isRateLimited, pruneOldEntries } = createRateLimiter(60_000, 5)

export async function POST(request) {
  pruneOldEntries()
  const ip = getClientIp(request)
  if (isRateLimited(ip)) {
    // 200 volontaire : sendBeacon ignore la réponse de toute façon.
    return Response.json({ message: 'Trop de rapports envoyés récemment.' })
  }

  let body = {}
  try {
    body = await request.json()
  } catch {
    body = {}
  }

  const messages = sanitizeMessages(body.messages)
  if (!messages || messages.length < 2) {
    return Response.json({ message: 'Pas assez de messages pour générer un rapport' })
  }

  const sessionId = typeof body.sessionId === 'string' && body.sessionId.length <= 100 ? body.sessionId : null

  if (!process.env.RESEND_API_KEY) {
    console.error('[Report] RESEND_API_KEY manquante')
    return Response.json({ error: 'Configuration de messagerie manquante sur le serveur' }, { status: 500 })
  }

  try {
    let summary = ''
    const promptInstructions = `Fais un résumé très court (3-4 phrases maximum) de cette conversation entre notre assistant IA et un visiteur de notre site internet. Indique les points clés abordés et l'intention du visiteur s'ils sont identifiables.\n\n` +
      messages.map(m => `${m.role === 'user' ? 'Visiteur' : 'Assistant'}: ${m.content}`).join('\n')

    if (process.env.GEMINI_API_KEY) {
      try {
        const response = await generateGeminiContent(getGenAI(), {
          contents: [{ role: 'user', parts: [{ text: promptInstructions }] }],
        })
        summary = response.text || ''
      } catch (geminiError) {
        console.warn('[Report] Gemini en échec, tentative Groq...', geminiError?.message ?? geminiError)
      }
    }

    if (!summary && process.env.GROQ_API_KEY) {
      try {
        const chatCompletion = await getGroq().chat.completions.create({
          model: GROQ_MODEL,
          messages: [{ role: 'user', content: promptInstructions }],
          temperature: 0.5,
        })
        summary = chatCompletion.choices[0]?.message?.content || ''
      } catch (groqError) {
        console.error('[Report] Échec total du résumé (Gemini + Groq) :', groqError?.message ?? groqError)
      }
    }

    if (!summary) {
      summary = 'Génération du résumé impossible (services IA temporairement hors ligne ou quota épuisé).'
    }

    // Persistance en base — facultative, comme pour le chat : si la DB
    // n'est pas configurée ou indisponible, l'email part quand même.
    if (sessionId && process.env.DATABASE_URL) {
      try {
        const conversation = await getOrCreateConversation(sessionId)
        await saveReport(conversation.id, summary, messages)
        if (conversation.status === 'ACTIVE') {
          await updateConversationStatus(conversation.id, 'ENDED')
        }
      } catch (dbErr) {
        console.error('[Report] Échec sauvegarde en base:', dbErr?.message ?? dbErr)
      }
    }

    const safeSummary = escapeHtml(summary).replace(/\n/g, '<br>')

    await getResend().emails.send({
      from: process.env.FROM_EMAIL ?? 'onboarding@resend.dev',
      to: process.env.ADMIN_EMAIL ?? 'wthomasss06@gmail.com',
      subject: `📝 Rapport de discussion — Assistant IA`,
      html: `
        <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:600px;margin:0 auto;background:#0a120c;">
          <div style="padding:28px 32px;background:linear-gradient(135deg,#0d1a11 0%,#0a120c 100%);border-bottom:1px solid rgba(136,202,83,.25);">
            <div style="font-family:'JetBrains Mono',monospace;font-size:13px;font-weight:700;letter-spacing:.1em;color:#88ca53;text-transform:uppercase;">
              AKATech · Rapport
            </div>
            <div style="margin-top:4px;font-size:11px;color:rgba(255,255,255,.4);">
              Résumé automatique de la session de chat
            </div>
          </div>

          <div style="padding:32px;">
            <div style="font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:rgba(255,255,255,.35);margin-bottom:10px;">
              Résumé de la conversation
            </div>
            <p style="color:#e8e4df;line-height:1.7;font-size:14px;background:rgba(136,202,83,.05);padding:18px;border-radius:10px;border-left:3px solid #88ca53;margin:0 0 28px;">
              ${safeSummary}
            </p>

            <div style="font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:rgba(255,255,255,.35);margin-bottom:10px;">
              Historique complet
            </div>
            <div style="background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:20px;max-height:400px;overflow-y:auto;">
              ${messages.map(m => `
                <div style="margin-bottom:16px; border-bottom: 1px solid rgba(255,255,255,.04); padding-bottom: 12px;">
                  <strong style="color: ${m.role === 'user' ? '#88ca53' : '#f2ede8'}; font-size:12px;">
                    ${m.role === 'user' ? '👤 Visiteur :' : '🤖 Assistant :'}
                  </strong>
                  <p style="margin:6px 0 0 0; color:rgba(255,255,255,.75); font-size:13px; line-height:1.5; white-space:pre-wrap;">${escapeHtml(m.content)}</p>
                </div>
              `).join('')}
            </div>
          </div>

          <div style="padding:18px 32px;border-top:1px solid rgba(255,255,255,.06);">
            <p style="margin:0;font-size:11px;color:rgba(255,255,255,.3);">
              Rapport généré par akatech-nextjs · ${new Date().toLocaleString('fr-FR', { timeZone: 'Africa/Abidjan' })}
            </p>
          </div>
        </div>
      `,
    })

    return Response.json({ success: true })
  } catch (error) {
    console.error('[Report] Erreur lors de la génération :', error?.message ?? error)
    return Response.json({ error: "Échec de l'envoi du rapport" }, { status: 500 })
  }
}
