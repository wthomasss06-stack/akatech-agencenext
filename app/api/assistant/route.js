// app/api/assistant/route.js
import { 
  getGenAI, 
  generateGeminiStream, 
  getGroq,
  getWorkingCombo,
  createRateLimiter,
  getClientIp,
  sanitizeMessages,
  toGeminiContents,
  toGroqMessages,
  GROQ_MODEL,
  MAX_TOKENS 
} from '@/lib/ai-providers'
import { buildSystemPrompt, ASSISTANT_TOOLS, WHATSAPP_LINK, detectAssistantLanguage } from '@/lib/assistant'
import { PROJECT_TYPE_LABELS } from '@/lib/data'
import { getOrCreateConversation, saveMessage, saveLead, createQuestionnaire } from '@/lib/db'
import { enqueueEmailNotification } from '@/lib/email-notifications'
import { getFromAddress } from '@/lib/email-layout'
import { buildLeadEmail } from '@/lib/email-templates'

export const runtime = 'nodejs'

/* ── Rate limiting en mémoire ── */
const { isRateLimited, pruneOldEntries } = createRateLimiter(60_000, 15)

/* ── Validation & Nettoyage ── */
const MAX_MESSAGES = 40
const MAX_MESSAGE_LENGTH = 4000

/* ── Envoi de l'email de lead (Resend) ──
   Mise en page : lib/email-templates.js (valeurs brutes, échappées là-bas :
   les arguments viennent du modèle IA, donc d'un texte non fiable). */
async function sendLeadEmail(lead) {
  const { getResend } = await import('@/lib/ai-providers')
  const mail = buildLeadEmail(lead)

  await getResend().emails.send({
    from: getFromAddress(),
    to: process.env.ADMIN_EMAIL ?? 'wthomasss06@gmail.com',
    subject: mail.subject,
    html: mail.html,
    text: mail.text,
  })
}

/* ── Moteur d'exécution principal de l'Assistant ──
   conversationId est null si la DB est absente/non configurée ou si le
   sessionId manquait : dans ce cas persistAssistantReply()/saveLead()
   sont simplement no-op et le chat continue de fonctionner normalement
   (historique/dashboard restent facultatifs, comme prévu à l'origine). */
async function runAssistant(messages, controller, encoder, conversationId, language = 'fr') {
  let fullText = ''
  const write = (text) => {
    fullText += text
    controller.enqueue(encoder.encode(text))
  }

  const lastUserText = [...messages].reverse().find((msg) => msg?.role === 'user' && typeof msg?.content === 'string')?.content || ''
  const inferredLanguage = detectAssistantLanguage(lastUserText, language)
  const systemInstruction = buildSystemPrompt(inferredLanguage)

  async function persistAssistantReply(modelUsed) {
    if (!conversationId || !fullText) return
    try {
      await saveMessage(conversationId, 'ASSISTANT', fullText, modelUsed)
    } catch (err) {
      console.error('[Assistant] Échec sauvegarde message assistant:', err?.message ?? err)
    }
  }

  // 1. TENTATIVE NATIVE GEMINI (cascade 4 clés)
  try {
    const client = getGenAI()

    async function turn(contents, depth = 0) {
      const stream = await generateGeminiStream({
        contents,
        config: {
          systemInstruction,
          tools: ASSISTANT_TOOLS,
          maxOutputTokens: MAX_TOKENS,
        },
      })

      let functionCallPart = null
      for await (const chunk of stream) {
        if (chunk.text) write(chunk.text)
        const part = chunk.candidates?.[0]?.content?.parts?.find((p) => p.functionCall)
        if (part) functionCallPart = part
      }

      const functionCall = functionCallPart?.functionCall

      // Exécution de l'outil capture_lead si demandé
      if (functionCall?.name === 'capture_lead' && depth === 0) {
        let toolResultText = 'Lead enregistré et email envoyé.'
        try {
          await sendLeadEmail(functionCall.args)
        } catch (err) {
          console.error('[Assistant] Échec envoi email lead:', err?.message ?? err)
          toolResultText = "L'email n'a pas pu être envoyé automatiquement, mais informe quand même le visiteur que sa demande est notée."
        }

        // Indépendant de l'email : un échec Resend ne doit pas priver le
        // dashboard du lead, et inversement.
        if (conversationId) {
          try {
            await saveLead(conversationId, functionCall.args)
          } catch (err) {
            console.error('[Assistant] Échec sauvegarde lead en base:', err?.message ?? err)
          }
        }

        const nextContents = [
          ...contents,
          { role: 'model', parts: [functionCallPart] },
          {
            role: 'user',
            parts: [{
              functionResponse: {
                name: functionCall.name,
                id: functionCall.id,
                response: { result: toolResultText },
              },
            }],
          },
        ]
        await turn(nextContents, depth + 1)
      }

      if (functionCall?.name === 'start_questionnaire' && depth === 0) {
        const questionnaireType = String(functionCall.args?.type || 'portfolio')
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://akatech.vercel.app'
        const typeKey = ['portfolio', 'vitrine_ecommerce', 'saas'].includes(questionnaireType) ? questionnaireType : 'portfolio'

        let token = null
        let questionnaireId = null
        try {
          const q = await createQuestionnaire({
            type: typeKey,
            conversationId,
            contactName: functionCall.args?.name || null,
            contactHandle: functionCall.args?.contact || null,
          })
          token = q.token
          questionnaireId = q.id
        } catch (err) {
          console.error('[Assistant] Échec création questionnaire:', err?.message ?? err)
        }

        if (questionnaireId) {
          try {
            await enqueueEmailNotification({
              eventKey: `chat-intent:${conversationId || questionnaireId}`,
              eventType: 'CHAT_INTENT',
              summary: 'Le chatbot a préparé un questionnaire de devis après un échange avec un prospect.',
              details: { projectType: PROJECT_TYPE_LABELS[typeKey] || typeKey },
            }, { awaitDelivery: false })
          } catch (err) {
            console.error('[Assistant] Alerte d’intention non mise en file:', err?.message ?? err)
          }
        }

        const questionnaireUrl = token ? `${baseUrl}/devis/${typeKey}?t=${token}` : null
        const toolResultText = questionnaireUrl
          ? `Le formulaire de devis est prêt. Ouvre ce lien : ${questionnaireUrl}`
          : `Le formulaire n'a pas pu être préparé automatiquement. Invite le visiteur à écrire directement à Aka : ${WHATSAPP_LINK}`

        const nextContents = [
          ...contents,
          { role: 'model', parts: [functionCallPart] },
          {
            role: 'user',
            parts: [{
              functionResponse: {
                name: functionCall.name,
                id: functionCall.id,
                response: { result: toolResultText, url: questionnaireUrl, token, type: typeKey },
              },
            }],
          },
        ]
        await turn(nextContents, depth + 1)
      }
    }

    await turn(toGeminiContents(messages))
    await persistAssistantReply(getWorkingCombo()?.model ?? null)
    return // Fin de l'exécution avec succès sur Gemini
  } catch (geminiGlobalError) {
    console.warn('[Assistant] Toutes les clés Gemini épuisées. Bascule de secours vers Groq...', geminiGlobalError?.message ?? geminiGlobalError)
  }

  // 2. FALLBACK DE SECOURS : GROQ (Llama 3.1 8B)
  // On repart d'un texte vide : si Gemini avait déjà streamé un fragment
  // avant d'échouer, on ne veut pas le mélanger avec la réponse Groq dans
  // le message sauvegardé (le flux déjà envoyé au visiteur n'est pas
  // affecté, seul l'enregistrement en base repart propre).
  fullText = ''

  try {
    console.log('[Assistant] Génération de secours via Groq...')
    const groqClient = getGroq()

    const groqMessages = [
      { role: 'system', content: systemInstruction },
      ...toGroqMessages(messages)
    ]

    const responseStream = await groqClient.chat.completions.create({
      model: GROQ_MODEL,
      messages: groqMessages,
      temperature: 0.7,
      max_tokens: MAX_TOKENS,
      stream: true,
    })

    for await (const chunk of responseStream) {
      const content = chunk.choices[0]?.delta?.content || ''
      if (content) write(content)
    }
    await persistAssistantReply(GROQ_MODEL)
    return
  } catch (groqError) {
    console.error('[Assistant] Échec critique absolu de Groq :', groqError?.message ?? groqError)
  }

  // Si tout a échoué
  throw new Error("Tous les fournisseurs d'intelligence artificielle (Gemini x4 + Groq) sont saturés.")
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
    return Response.json(
      { error: 'Trop de messages envoyés. Réessayez dans une minute.' },
      { status: 429 }
    )
  }

  const messages = sanitizeMessages(body.messages)
  if (!messages) {
    return Response.json({ error: 'Requête invalide.' }, { status: 400 })
  }
  const language = ['fr', 'en', 'es'].includes(body.language) ? body.language : 'fr'

  const sessionId = typeof body.sessionId === 'string' && body.sessionId.length <= 100 ? body.sessionId : null

  // Historique/dashboard : facultatif (cf. .env.example — "le chat
  // fonctionne sans [DB], juste sans historique ni dashboard"), donc
  // toute erreur ici est loggée et avalée, jamais renvoyée au visiteur.
  let conversationId = null
  if (process.env.DATABASE_URL && sessionId) {
    try {
      const conversation = await getOrCreateConversation(sessionId)
      conversationId = conversation.id
      const lastUserMessage = messages[messages.length - 1]
      if (lastUserMessage?.role === 'user') {
        await saveMessage(conversationId, 'USER', lastUserMessage.content)
      }
    } catch (err) {
      console.error('[Assistant] Échec sauvegarde message utilisateur:', err?.message ?? err)
    }
  }

  const encoder = new TextEncoder()

  const readable = new ReadableStream({
    async start(controller) {
      try {
        await runAssistant(messages, controller, encoder, conversationId, language)
      } catch (err) {
        console.error('[Assistant Global POST] Erreur fatale de flux :', err?.message ?? err)
        controller.enqueue(encoder.encode(
          `Désolé, les serveurs d'IA sont surchargés pour le moment. Vous pouvez réessayer, ou m'écrire directement sur WhatsApp : ${WHATSAPP_LINK}`
        ))
      } finally {
        controller.close()
      }
    },
  })

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
    },
  })
}
