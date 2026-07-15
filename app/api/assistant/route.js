import { GoogleGenAI } from '@google/genai'
import { Resend } from 'resend'
import { buildSystemPrompt, ASSISTANT_TOOLS, WHATSAPP_LINK } from '@/lib/assistant'
import { PROJECT_TYPE_LABELS } from '@/lib/data'

export const runtime = 'nodejs'

/* Lazy singletons — jamais instanciés au chargement du module,
   seulement à la première requête (évite un crash au build si
   les clés ne sont pas encore configurées en local). */
let _genAI = null
function getGenAI() {
  if (!_genAI) _genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || 'placeholder' })
  return _genAI
}

let _resend = null
function getResend() {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder')
  return _resend
}

/* gemini-2.5-flash a été coupé pour les nouvelles clés API (juil. 2026 —
   Google pousse vers la gen 3.x, cf. aistudio.google.com/app/apikey pour
   l'état du palier gratuit). Vu que c'est la 2e fois que Google tue le
   modèle pin­né ici (2.0 → 2.5 en juin, 2.5 → 3.x maintenant), on essaie
   une liste dans l'ordre plutôt qu'un seul nom : si le premier tombe,
   l'assistant bascule sur le suivant au lieu de rester mort en prod. */
const MODEL_CANDIDATES = ['gemini-3.5-flash', 'gemini-3.1-flash-lite']
const MAX_TOKENS = 1024

/* Une fois qu'un modèle a répondu avec succès, on le retient pour la
   durée de vie de l'instance serveur (évite de re-tester les modèles
   morts à chaque requête). S'il retombe en panne plus tard, on retente
   quand même toute la liste avant d'abandonner. */
let _workingModel = null

function isModelUnavailableError(err) {
  const msg = String(err?.message ?? err ?? '')
  return /"code"\s*:\s*404/.test(msg) || /not found|no longer available/i.test(msg)
}

async function generateWithFallback(client, params) {
  const order = _workingModel
    ? [_workingModel, ...MODEL_CANDIDATES.filter((m) => m !== _workingModel)]
    : MODEL_CANDIDATES

  let lastErr
  for (const model of order) {
    try {
      const stream = await client.models.generateContentStream({ ...params, model })
      _workingModel = model
      return stream
    } catch (err) {
      lastErr = err
      if (!isModelUnavailableError(err)) throw err // autre erreur (quota, réseau...) : on ne masque pas
      console.error(`[Assistant] Modèle ${model} indisponible, tentative suivante...`, err?.message ?? err)
    }
  }
  throw lastErr
}

/* ════════════════════════════════════════════
   Anti-spam / anti-abus — même approche que /api/contact
   (best-effort en mémoire ; suffisant pour un trafic normal
   d'agence, pas conçu pour encaisser un DDoS volontaire).
   ════════════════════════════════════════════ */
const RATE_LIMIT_WINDOW_MS = 60_000
const RATE_LIMIT_MAX = 15 // plus permissif que /contact : une conversation = plusieurs requêtes
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

/* ── Limites de payload — évite qu'une requête énorme fasse
   exploser le coût d'un appel ou serve de vecteur d'abus. ── */
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

/* ── Validation + normalisation des messages reçus du widget ── */
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

/* Convertit le format {role:'user'|'assistant', content} du widget
   vers le format Gemini {role:'user'|'model', parts:[{text}]}. */
function toGeminiContents(messages) {
  return messages.map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }))
}

/* ── Envoi de l'email de lead via Resend (même style que /api/contact) ── */
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

/* ── Boucle d'appel au modèle avec gestion du tool use, écrite
   directement dans le ReadableStream renvoyé au client. ── */
function runAssistant(messages, controller, encoder) {
  const client = getGenAI()
  const systemInstruction = buildSystemPrompt()
  const write = (text) => controller.enqueue(encoder.encode(text))

  async function turn(contents, depth = 0) {
    const stream = await generateWithFallback(client, {
      contents,
      config: {
        systemInstruction,
        tools: ASSISTANT_TOOLS,
        maxOutputTokens: MAX_TOKENS,
      },
    })

    /* On garde le PART brut {functionCall, thoughtSignature?} tel que renvoyé
       par le modèle, jamais un {name, args} reconstruit à la main : Gemini 3
       attache un thoughtSignature à côté de functionCall (obligatoire à
       repasser tel quel, cf. ai.google.dev/gemini-api/docs/thought-signatures),
       et .functionCalls (le getter pratique du SDK) ne le préserve pas. */
    let functionCallPart = null
    for await (const chunk of stream) {
      if (chunk.text) write(chunk.text)
      const part = chunk.candidates?.[0]?.content?.parts?.find((p) => p.functionCall)
      if (part) functionCallPart = part
    }

    const functionCall = functionCallPart?.functionCall

    if (functionCall?.name === 'capture_lead' && depth === 0) {
      let toolResultText = 'Lead enregistré et email envoyé.'
      try {
        await sendLeadEmail(functionCall.args)
      } catch (err) {
        console.error('[Assistant] Échec envoi email lead:', err?.message ?? err)
        toolResultText = "L'email n'a pas pu être envoyé automatiquement, mais informe quand même le visiteur que sa demande est notée et qu'il peut aussi écrire directement sur WhatsApp."
      }

      const nextContents = [
        ...contents,
        { role: 'model', parts: [functionCallPart] }, // part brut, signature incluse si présente
        {
          role: 'user',
          parts: [{
            functionResponse: {
              name: functionCall.name,
              id: functionCall.id, // requis par Gemini 3 pour mapper la réponse au bon appel
              response: { result: toolResultText },
            },
          }],
        },
      ]
      // Un seul aller-retour d'outil par tour de conversation (depth=1 empêche une boucle).
      await turn(nextContents, depth + 1)
    }
  }

  return turn(toGeminiContents(messages))
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

  if (!process.env.GEMINI_API_KEY) {
    console.error('[Assistant] GEMINI_API_KEY manquante')
    return Response.json({ error: 'Configuration serveur incorrecte' }, { status: 500 })
  }

  const encoder = new TextEncoder()

  const readable = new ReadableStream({
    async start(controller) {
      try {
        await runAssistant(messages, controller, encoder)
      } catch (err) {
        console.error('[Assistant] Erreur:', err?.message ?? err)
        // Message de repli lisible plutôt qu'un flux coupé sans explication.
        controller.enqueue(encoder.encode(
          `Désolé, une erreur est survenue de mon côté. Vous pouvez réessayer, ou écrire directement sur WhatsApp : ${WHATSAPP_LINK}`
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