// lib/ai-providers.js
// Logique partagée entre app/api/assistant/route.js (chat) et
// app/api/assistant/end/route.js (clôture) : lazy singletons,
// cascade de modèles Gemini avec repli automatique, rate-limiting,
// validation des messages. Centralisé ici pour ne pas dupliquer
// cette logique dans les deux routes.

import { GoogleGenAI } from '@google/genai'
import { Resend } from 'resend'
import Groq from 'groq-sdk'

/* ═══════════════════════════════════════════════════════════════
   LAZY SINGLETONS — 4 clés Gemini + Groq + Resend
   ═══════════════════════════════════════════════════════════════ */

const GEMINI_KEYS = [
  { key: process.env.GEMINI_API_KEY,           name: 'principale' },
  { key: process.env.GEMINI_API_KEY_2,         name: 'backup-2'   },
  { key: process.env.GEMINI_API_KEY_3,         name: 'backup-3'   },
  { key: process.env.GEMINI_API_KEY_4,         name: 'backup-4'   },
].filter(k => k.key && k.key !== 'placeholder')

const clients = new Map()

function getGeminiClient(keyObj) {
  if (!clients.has(keyObj.name)) {
    clients.set(keyObj.name, new GoogleGenAI({ apiKey: keyObj.key }))
  }
  return clients.get(keyObj.name)
}

/* ── Export getGenAI (pour compatibilité avec l'ancien code) ── */
export function getGenAI() {
  if (GEMINI_KEYS.length === 0) {
    return new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || 'placeholder' })
  }
  return getGeminiClient(GEMINI_KEYS[0])
}

let _groq = null
export function getGroq() {
  if (!_groq) _groq = new Groq({ apiKey: process.env.GROQ_API_KEY || 'placeholder' })
  return _groq
}

let _resend = null
export function getResend() {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder')
  return _resend
}

/* ═══════════════════════════════════════════════════════════════
   MODÈLES — Gemini 3.8 Flash en tête, puis cascade
   ═══════════════════════════════════════════════════════════════
   Statut vérifié sur ai.google.dev/gemini-api/docs/deprecations (oct. 2026) :
   - gemini-3.8-flash : dernier Flash (2 sept. 2026), même prix que 3.6.
   - gemini-3.6-flash : génération précédente ; Google y redirige 3.5 Flash.
   - gemini-3.5-flash-lite : remplaçant officiel de 3.1 Flash-Lite, moins cher.
   - gemini-3.1-flash-lite : arrêt annoncé au plus tôt le 7 mai 2027.
   Retirés de la liste : gemini-3.5-flash (obsolète, redirigé vers 3.6 : il
   doublonnerait 3.6) et gemini-1.5-flash (arrêté, chaque appel finissait en 404).
   Un changement de modèle ne touche jamais aux clés API : la clé identifie le
   projet Google, le modèle n'est qu'un paramètre de chaque requête. */

export const GEMINI_MODELS = [
  'gemini-3.8-flash',
  'gemini-3.6-flash',
  'gemini-3.5-flash-lite',
  'gemini-3.1-flash-lite',
]

// Groq a arrêté llama-3.1-8b-instant le 16 août 2026 (remplaçant officiel :
// openai/gpt-oss-20b, console.groq.com/docs/deprecations). gpt-oss est un modèle
// à raisonnement : `reasoning_effort: 'low'` limite les jetons de réflexion et
// `max_completion_tokens` les compte — d'où une marge au-dessus de MAX_TOKENS.
// Offre gratuite : 8 000 jetons/min et 1 000 requêtes/jour (le prompt système
// de l'assistant pèse environ 6 000 jetons : le secours tient pour des
// conversations courtes, pas pour plusieurs visiteurs simultanés).
export const GROQ_MODEL = 'openai/gpt-oss-20b'
export const MAX_TOKENS = 1024
export const GROQ_MAX_TOKENS = 1280

export const GROQ_REQUEST_DEFAULTS = Object.freeze({
  model: GROQ_MODEL,
  temperature: 0.7,
  max_completion_tokens: GROQ_MAX_TOKENS,
  reasoning_effort: 'low',
})

let _workingCombo = null  // { model, keyName }

// Utilisé par app/api/assistant/route.js pour savoir quel modèle a
// effectivement répondu (Gemini x4 ou Groq) et l'enregistrer comme
// Message.modelUsed — nécessaire pour que "Usage IA aujourd'hui" reflète
// la réalité plutôt que de rester à 0.
export function getWorkingCombo() {
  return _workingCombo
}

function isModelUnavailableError(err) {
  const msg = String(err?.message ?? err ?? '')
  return (
    /"code"\s*:\s*404/.test(msg) ||
    /not found|no longer available/i.test(msg) ||
    /"code"\s*:\s*429/.test(msg) ||
    /quota|rate limit|too many requests/i.test(msg) ||
    /invalid.*api.*key|unauthorized|authentication/i.test(msg)
  )
}

function getModelOrder() {
  if (!_workingCombo) return GEMINI_MODELS
  const others = GEMINI_MODELS.filter(m => m !== _workingCombo.model)
  return [_workingCombo.model, ...others]
}

/* ═══════════════════════════════════════════════════════════════
   CASCADE STREAMING — essaie chaque clé × chaque modèle
   ═══════════════════════════════════════════════════════════════ */

export async function generateGeminiStream(params) {
  let lastErr
  const modelOrder = getModelOrder()

  for (const keyObj of GEMINI_KEYS) {
    const client = getGeminiClient(keyObj)

    for (const model of modelOrder) {
      try {
        console.log(`[Gemini] 🚀 ${model} via clé ${keyObj.name}...`)
        const stream = await client.models.generateContentStream({ ...params, model })
        _workingCombo = { model, keyName: keyObj.name }
        console.log(`[Gemini] ✅ Succès : ${model} + clé ${keyObj.name}`)
        return stream
      } catch (err) {
        lastErr = err
        if (!isModelUnavailableError(err)) throw err
        console.warn(`[Gemini] ❌ ${model} + clé ${keyObj.name} : ${err.message?.slice(0, 80)}`)
      }
    }
  }

  throw lastErr
}

/* ═══════════════════════════════════════════════════════════════
   CASCADE NON-STREAMING (pour rapports, résumés)
   ═══════════════════════════════════════════════════════════════ */

export async function generateGeminiContent(params) {
  let lastErr
  const modelOrder = getModelOrder()

  for (const keyObj of GEMINI_KEYS) {
    const client = getGeminiClient(keyObj)

    for (const model of modelOrder) {
      try {
        console.log(`[Gemini] 📝 ${model} via clé ${keyObj.name}...`)
        const response = await client.models.generateContent({ ...params, model })
        _workingCombo = { model, keyName: keyObj.name }
        console.log(`[Gemini] ✅ Succès : ${model} + clé ${keyObj.name}`)
        return response
      } catch (err) {
        lastErr = err
        if (!isModelUnavailableError(err)) throw err
        console.warn(`[Gemini] ❌ ${model} + clé ${keyObj.name} : ${err.message?.slice(0, 80)}`)
      }
    }
  }

  throw lastErr
}

/* ═══════════════════════════════════════════════════════════════
   GROQ FALLBACK — quand TOUTES les clés Gemini sont mortes
   ═══════════════════════════════════════════════════════════════ */

export async function generateGroqStream(messages) {
  const groq = getGroq()
  return groq.chat.completions.create({
    ...GROQ_REQUEST_DEFAULTS,
    messages,
    stream: true,
  })
}

export async function generateGroqContent(messages) {
  const groq = getGroq()
  const response = await groq.chat.completions.create({
    ...GROQ_REQUEST_DEFAULTS,
    messages,
  })
  return response.choices[0]?.message?.content || ''
}

/* ═══════════════════════════════════════════════════════════════
   RATE LIMITING — un limiteur par route
   ═══════════════════════════════════════════════════════════════ */

export function createRateLimiter(windowMs, max) {
  const hits = new Map()

  function isRateLimited(ip) {
    const now = Date.now()
    const entry = hits.get(ip)
    if (!entry || now - entry.start > windowMs) {
      hits.set(ip, { start: now, count: 1 })
      return false
    }
    entry.count += 1
    return entry.count > max
  }

  function pruneOldEntries() {
    const now = Date.now()
    for (const [ip, entry] of hits) {
      if (now - entry.start > windowMs) hits.delete(ip)
    }
  }

  return { isRateLimited, pruneOldEntries }
}

export function getClientIp(request) {
  const fwd = request.headers.get('x-forwarded-for')
  if (fwd) return fwd.split(',')[0].trim()
  return request.headers.get('x-real-ip') || 'unknown'
}

/* ═══════════════════════════════════════════════════════════════
   VALIDATION & NETTOYAGE
   ═══════════════════════════════════════════════════════════════ */

export const MAX_MESSAGES = 40
export const MAX_MESSAGE_LENGTH = 4000

export function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export function sanitizeMessages(input) {
  if (!Array.isArray(input)) return null
  if (input.length === 0 || input.length > MAX_MESSAGES) return null

  const cleaned = []
  for (const m of input) {
    if (!m || (m.role !== 'user' && m.role !== 'assistant')) return null
    if (typeof m.content !== 'string') return null
    const text = m.content.trim()
    // The UI keeps an empty assistant placeholder while a response streams.
    // Ignore that transient entry if a later request is sent after an error.
    if (!text && m.role === 'assistant') continue
    if (!text || text.length > MAX_MESSAGE_LENGTH) return null
    cleaned.push({ role: m.role, content: text })
  }
  return cleaned.length > 0 ? cleaned : null
}

export function toGeminiContents(messages) {
  return messages.map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }))
}

export function toGroqMessages(messages) {
  return messages.map(m => ({
    role: m.role === 'assistant' ? 'assistant' : 'user',
    content: m.content,
  }))
}

/* ═══════════════════════════════════════════════════════════════
   UTILITAIRE : statut des clés (pour debug / health check)
   ═══════════════════════════════════════════════════════════════ */

export function getKeyStatus() {
  return {
    totalKeys: GEMINI_KEYS.length,
    keys: GEMINI_KEYS.map(k => ({
      name: k.name,
      available: !!k.key && k.key.key.length > 10,
    })),
    workingCombo: _workingCombo,
    models: GEMINI_MODELS,
  }
}