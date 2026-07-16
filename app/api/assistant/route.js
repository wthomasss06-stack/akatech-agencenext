// app/api/assistant/route.js
import { createHash } from 'crypto'
import { buildSystemPrompt, ASSISTANT_TOOLS, WHATSAPP_LINK } from '@/lib/assistant'
import { PROJECT_TYPE_LABELS } from '@/lib/data'
import {
  getGenAI, getGroq, getResend, generateGeminiStream,
  GROQ_MODEL, MAX_TOKENS, createRateLimiter, getClientIp,
  sanitizeMessages, toGeminiContents, toGroqMessages, escapeHtml,
} from '@/lib/ai-providers'
import { getOrCreateConversation, saveMessage, saveLead } from '@/lib/db'

export const runtime = 'nodejs'

const { isRateLimited, pruneOldEntries } = createRateLimiter(60_000, 15)

function hashIp(ip) {
  return createHash('sha256').update(ip).digest('hex').slice(0, 32)
}

/* ── Envoi de l'email de lead (Resend) ── */
async function sendLeadEmail(lead) {
  const safeName = escapeHtml(lead.name)
  const safeContact = escapeHtml(lead.contact)
  const safeSummary = escapeHtml(lead.summary).replace(/\n/g, '<br/>')
  const projectLabel = escapeHtml(PROJECT_TYPE_LABELS[lead.project_type] || lead.project_type || 'Non précisé')
  const safeBudget = escapeHtml(lead.budget_range || 'Non précisé')
  const safeTimeline = escapeHtml(lead.timeline || 'Non précisé')

  await getResend().emails.send({
    from: process.env.FROM_EMAIL ?? 'onboarding@resend.dev',
    to: process.env.ADMIN_EMAIL ?? 'wthomasss06@gmail.com',
    subject: `🤖 Lead assistant IA — ${safeName} (${projectLabel})`,
    html: `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:600px;margin:0 auto;background:#0a120c;">
        <div style="padding:28px 32px;background:linear-gradient(135deg,#0d1a11 0%,#0a120c 100%);border-bottom:1px solid rgba(136,202,83,.25);">
          <div style="font-family:'JetBrains Mono',monospace;font-size:13px;font-weight:700;letter-spacing:.1em;color:#88ca53;text-transform:uppercase;">
            AKATech · Assistant IA
          </div>
          <div style="margin-top:4px;font-size:11px;color:rgba(255,255,255,.4);">
            Nouveau prospect qualifié par l'assistant du site
          </div>
        </div>
        <div style="padding:32px;">
          <h2 style="margin:0 0 6px;color:#f2ede8;font-size:20px;font-weight:800;">${safeName}</h2>
          <div style="display:inline-block;padding:5px 12px;border-radius:100px;background:rgba(136,202,83,.12);border:1px solid rgba(136,202,83,.3);font-size:12px;font-weight:700;color:#b3ee85;margin-bottom:24px;">
            ${projectLabel}
          </div>
          <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
            <tr>
              <td style="padding:14px 16px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);border-radius:10px 0 0 10px;border-right:none;">
                <div style="font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:rgba(255,255,255,.35);margin-bottom:5px;">Contact</div>
                <span style="font-size:13px;color:#88ca53;font-weight:600;">${safeContact}</span>
              </td>
              <td style="padding:14px 16px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);border-radius:0 10px 10px 0;">
                <div style="font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:rgba(255,255,255,.35);margin-bottom:5px;">Budget</div>
                <span style="font-size:13px;color:#f2ede8;font-weight:600;">${safeBudget}</span>
              </td>
            </tr>
          </table>
          <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
            <tr>
              <td style="padding:14px 16px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);border-radius:10px;">
                <div style="font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:rgba(255,255,255,.35);margin-bottom:5px;">Délai souhaité</div>
                <span style="font-size:13px;color:#f2ede8;font-weight:600;">${safeTimeline}</span>
              </td>
            </tr>
          </table>
          <div style="font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:rgba(255,255,255,.35);margin-bottom:10px;">
            Résumé du besoin
          </div>
          <p style="color:#e8e4df;line-height:1.7;font-size:14px;background:rgba(136,202,83,.05);padding:18px;border-radius:10px;border-left:3px solid #88ca53;margin:0 0 8px;">
            ${safeSummary}
          </p>
        </div>
        <div style="padding:18px 32px;border-top:1px solid rgba(255,255,255,.06);">
          <p style="margin:0;font-size:11px;color:rgba(255,255,255,.3);">
            Capturé par l'assistant IA · akatech-nextjs · ${new Date().toLocaleString('fr-FR', { timeZone: 'Africa/Abidjan' })}
          </p>
        </div>
      </div>
    `,
  })
}

/* ── Moteur d'exécution : Gemini (cascade) → Groq (secours) ──
   Accumule aussi le texte complet de la réponse pour pouvoir la
   sauvegarder en base une fois le flux terminé (le stream n'écrit
   que vers le client, il ne conserve rien par défaut). */
async function runAssistant(messages, conversationDbId, controller, encoder) {
  const write = (text) => controller.enqueue(encoder.encode(text))
  const systemInstruction = buildSystemPrompt()
  let fullText = ''
  let modelUsed = null

  async function persistAssistantReply() {
    if (conversationDbId && fullText.trim()) {
      await saveMessage(conversationDbId, 'ASSISTANT', fullText, modelUsed).catch((err) =>
        console.error('[Assistant] Échec sauvegarde message assistant:', err?.message ?? err)
      )
    }
  }

  // 1. GEMINI (cascade de modèles)
  if (process.env.GEMINI_API_KEY) {
    try {
      const client = getGenAI()

      async function turn(contents, depth = 0) {
        const stream = await generateGeminiStream(client, {
          contents,
          config: { systemInstruction, tools: ASSISTANT_TOOLS, maxOutputTokens: MAX_TOKENS },
        })

        let functionCallPart = null
        for await (const chunk of stream) {
          if (chunk.text) { write(chunk.text); fullText += chunk.text }
          const part = chunk.candidates?.[0]?.content?.parts?.find((p) => p.functionCall)
          if (part) functionCallPart = part
        }
        modelUsed = 'gemini'

        const functionCall = functionCallPart?.functionCall
        if (functionCall?.name === 'capture_lead' && depth === 0) {
          let toolResultText = 'Lead enregistré et email envoyé.'
          try {
            if (conversationDbId) await saveLead(conversationDbId, functionCall.args)
            await sendLeadEmail(functionCall.args)
          } catch (err) {
            console.error('[Assistant] Échec traitement lead:', err?.message ?? err)
            toolResultText = "Le lead n'a pas pu être enregistré automatiquement, mais informe quand même le visiteur que sa demande est notée."
          }

          const nextContents = [
            ...contents,
            { role: 'model', parts: [functionCallPart] },
            { role: 'user', parts: [{ functionResponse: { name: functionCall.name, id: functionCall.id, response: { result: toolResultText } } }] },
          ]
          await turn(nextContents, depth + 1)
        }
      }

      await turn(toGeminiContents(messages))
      await persistAssistantReply()
      return
    } catch (geminiGlobalError) {
      console.warn('[Assistant] Gemini hors service, bascule vers Groq...', geminiGlobalError?.message ?? geminiGlobalError)
    }
  }

  // 2. GROQ (secours)
  if (process.env.GROQ_API_KEY) {
    try {
      const groqClient = getGroq()
      const groqMessages = [{ role: 'system', content: systemInstruction }, ...toGroqMessages(messages)]

      const responseStream = await groqClient.chat.completions.create({
        model: GROQ_MODEL, messages: groqMessages, temperature: 0.7, max_tokens: MAX_TOKENS, stream: true,
      })

      for await (const chunk of responseStream) {
        const content = chunk.choices[0]?.delta?.content || ''
        if (content) { write(content); fullText += content }
      }
      modelUsed = 'groq'
      await persistAssistantReply()
      return
    } catch (groqError) {
      console.error('[Assistant] Échec critique de Groq :', groqError?.message ?? groqError)
    }
  }

  throw new Error("Tous les fournisseurs d'IA (Gemini + Groq) sont indisponibles.")
}

export async function POST(request) {
  let body = {}
  try {
    body = await request.json()
  } catch {
    body = {}
  }

  pruneOldEntries()
  const ip = getClientIp(request)
  if (isRateLimited(ip)) {
    return Response.json({ error: 'Trop de messages envoyés. Réessayez dans une minute.' }, { status: 429 })
  }

  const messages = sanitizeMessages(body.messages)
  if (!messages) {
    return Response.json({ error: 'Requête invalide.' }, { status: 400 })
  }

  const sessionId = typeof body.sessionId === 'string' && body.sessionId.length <= 100 ? body.sessionId : null

  const encoder = new TextEncoder()

  const readable = new ReadableStream({
    async start(controller) {
      try {
        // La persistance DB est facultative : si DATABASE_URL n'est pas
        // encore configurée, le chat continue de fonctionner (juste sans
        // historique ni dashboard) plutôt que de planter.
        let conversationDbId = null
        if (sessionId && process.env.DATABASE_URL) {
          try {
            const conversation = await getOrCreateConversation(sessionId, hashIp(ip))
            conversationDbId = conversation.id
            const lastUserMessage = messages[messages.length - 1]
            if (lastUserMessage?.role === 'user') {
              await saveMessage(conversationDbId, 'USER', lastUserMessage.content)
            }
          } catch (dbErr) {
            console.error('[Assistant] DB indisponible, poursuite sans persistance:', dbErr?.message ?? dbErr)
          }
        }

        await runAssistant(messages, conversationDbId, controller, encoder)
      } catch (err) {
        console.error('[Assistant] Erreur:', err?.message ?? err)
        controller.enqueue(encoder.encode(
          `Désolé, les serveurs d'IA sont surchargés pour le moment. Vous pouvez réessayer, ou m'écrire directement sur WhatsApp : ${WHATSAPP_LINK}`
        ))
      } finally {
        controller.close()
      }
    },
  })

  return new Response(readable, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-cache, no-transform' },
  })
}
