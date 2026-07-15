// app/api/assistant/route.js
import { GoogleGenAI } from '@google/genai'
import { Resend } from 'resend'
import Groq from 'groq-sdk'
import { buildSystemPrompt, ASSISTANT_TOOLS, WHATSAPP_LINK } from '@/lib/assistant'
import { PROJECT_TYPE_LABELS } from '@/lib/data'

export const runtime = 'nodejs'

/* ── Lazy Singletons — évite les crashes au build/chargement si les clés manquent ── */
let _genAI = null
function getGenAI() {
  if (!_genAI) _genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || 'placeholder' })
  return _genAI
}

let _groq = null
function getGroq() {
  if (!_groq) _groq = new Groq({ apiKey: process.env.GROQ_API_KEY || 'placeholder' })
  return _groq
}

let _resend = null
function getResend() {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder')
  return _resend
}

/* Modèles Gemini candidats et modèle Groq de rechange */
const GEMINI_MODELS = ['gemini-3.5-flash', 'gemini-3.1-flash-lite', 'gemini-1.5-flash']
const GROQ_MODEL = 'llama-3.1-8b-instant'
const MAX_TOKENS = 1024

let _workingGeminiModel = null

function isModelUnavailableError(err) {
  const msg = String(err?.message ?? err ?? '')
  return (
    /"code"\s*:\s*404/.test(msg) || 
    /not found|no longer available/i.test(msg) ||
    /"code"\s*:\s*429/.test(msg) ||
    /quota/i.test(msg)
  );
}

/* Génération de contenu Gemini avec gestion de repli intelligente */
async function generateGeminiStream(client, params) {
  const order = _workingGeminiModel
    ? [_workingGeminiModel, ...GEMINI_MODELS.filter((m) => m !== _workingGeminiModel)]
    : GEMINI_MODELS

  let lastErr
  for (const model of order) {
    try {
      console.log(`[Assistant] Tentative avec Gemini (${model})...`)
      const stream = await client.models.generateContentStream({ ...params, model })
      _workingGeminiModel = model
      return stream
    } catch (err) {
      lastErr = err
      if (!isModelUnavailableError(err)) throw err 
      console.warn(`[Assistant] Modèle ${model} indisponible ou quota épuisé, tentative suivante...`)
    }
  }
  throw lastErr
}

/* ── Rate Limiting en mémoire ── */
const RATE_LIMIT_WINDOW_MS = 60_000
const RATE_LIMIT_MAX = 15 
const hits = new Map()

function isRateLimited(ip) {
  const now = Date.now()
  const entry = hits.get(ip)
  if (!entry || now - entry.start > RATE_LIMIT_WINDOW_MS) {
    hits.set(ip, { start: now, count: 1 })
    return false
  }
  entry.count += 1
  return entry.count > RATE_LIMIT_MAX
}

function pruneOldEntries() {
  const now = Date.now()
  for (const [ip, entry] of hits) {
    if (now - entry.start > RATE_LIMIT_WINDOW_MS) hits.delete(ip)
  }
}

function getClientIp(request) {
  const fwd = request.headers.get('x-forwarded-for')
  if (fwd) return fwd.split(',')[0].trim()
  return request.headers.get('x-real-ip') || 'unknown'
}

/* ── Validation & Nettoyage ── */
const MAX_MESSAGES = 40
const MAX_MESSAGE_LENGTH = 4000

function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function sanitizeMessages(input) {
  if (!Array.isArray(input)) return null
  if (input.length === 0 || input.length > MAX_MESSAGES) return null

  const cleaned = []
  for (const m of input) {
    if (!m || (m.role !== 'user' && m.role !== 'assistant')) return null
    if (typeof m.content !== 'string') return null
    const text = m.content.trim()
    if (!text || text.length > MAX_MESSAGE_LENGTH) return null
    cleaned.push({ role: m.role, content: text })
  }
  return cleaned
}

function toGeminiContents(messages) {
  return messages.map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }))
}

function toGroqMessages(messages) {
  return messages.map(m => ({
    role: m.role === 'assistant' ? 'assistant' : 'user',
    content: m.content,
  }))
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

/* ── Moteur d'exécution principal de l'Assistant ── */
async function runAssistant(messages, controller, encoder) {
  const write = (text) => controller.enqueue(encoder.encode(text))
  const systemInstruction = buildSystemPrompt()

  // 1. TENTATIVE NATIVE GEMINI
  if (process.env.GEMINI_API_KEY) {
    try {
      const client = getGenAI()

      async function turn(contents, depth = 0) {
        const stream = await generateGeminiStream(client, {
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
      }

      await turn(toGeminiContents(messages))
      return // Fin de l'exécution avec succès sur Gemini
    } catch (geminiGlobalError) {
      console.warn('[Assistant] Gemini totalement hors service ou quotas vides. Bascule de secours vers Groq...', geminiGlobalError?.message ?? geminiGlobalError)
    }
  }

  // 2. FALLBACK DE SECOURS : GROQ (Llama 3.1 8B)
  if (process.env.GROQ_API_KEY) {
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
      return
    } catch (groqError) {
      console.error('[Assistant] Échec critique absolu de Groq :', groqError?.message ?? groqError)
    }
  }

  // Si tout a échoué
  throw new Error("Tous les fournisseurs d'intelligence artificielle (Gemini + Groq) sont saturés.")
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

  const encoder = new TextEncoder()

  const readable = new ReadableStream({
    async start(controller) {
      try {
        await runAssistant(messages, controller, encoder)
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