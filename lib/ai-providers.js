// lib/ai-providers.js
// Logique partagée entre app/api/assistant/route.js (chat) et
// app/api/assistant/report/route.js (résumé) : lazy singletons,
// cascade de modèles Gemini avec repli automatique, rate-limiting,
// validation des messages. Centralisé ici pour ne pas dupliquer
// cette logique dans les deux routes.

import { GoogleGenAI } from '@google/genai'
import { Resend } from 'resend'
import Groq from 'groq-sdk'

/* ── Lazy Singletons — jamais instanciés au chargement du module ── */
let _genAI = null
export function getGenAI() {
  if (!_genAI) _genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || 'placeholder' })
  return _genAI
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

/* Modèles Gemini candidats (du plus récent au plus stable) et modèle
   Groq de secours. Si Google renomme encore ses modèles, changer
   uniquement cette liste — les deux routes en héritent. */
export const GEMINI_MODELS = ['gemini-3.5-flash', 'gemini-3.1-flash-lite', 'gemini-1.5-flash']
export const GROQ_MODEL = 'llama-3.1-8b-instant'
export const MAX_TOKENS = 1024

let _workingGeminiModel = null

function isModelUnavailableError(err) {
  const msg = String(err?.message ?? err ?? '')
  return (
    /"code"\s*:\s*404/.test(msg) ||
    /not found|no longer available/i.test(msg) ||
    /"code"\s*:\s*429/.test(msg) ||
    /quota/i.test(msg)
  )
}

function modelOrder() {
  return _workingGeminiModel
    ? [_workingGeminiModel, ...GEMINI_MODELS.filter((m) => m !== _workingGeminiModel)]
    : GEMINI_MODELS
}

/* Streaming (utilisé par le chat) — cascade sur GEMINI_MODELS jusqu'à
   trouver un modèle disponible, mémorise celui qui marche pour éviter
   de retester les autres à chaque requête suivante. */
export async function generateGeminiStream(client, params) {
  let lastErr
  for (const model of modelOrder()) {
    try {
      console.log(`[Gemini] Tentative stream avec ${model}...`)
      const stream = await client.models.generateContentStream({ ...params, model })
      _workingGeminiModel = model
      return stream
    } catch (err) {
      lastErr = err
      if (!isModelUnavailableError(err)) throw err
      console.warn(`[Gemini] Modèle ${model} indisponible ou quota épuisé, tentative suivante...`)
    }
  }
  throw lastErr
}

/* Non-streaming (utilisé par le rapport) — même cascade, même logique
   de repli, pour un appel generateContent() classique. */
export async function generateGeminiContent(client, params) {
  let lastErr
  for (const model of modelOrder()) {
    try {
      console.log(`[Gemini] Tentative resumé avec ${model}...`)
      const response = await client.models.generateContent({ ...params, model })
      _workingGeminiModel = model
      return response
    } catch (err) {
      lastErr = err
      if (!isModelUnavailableError(err)) throw err
      console.warn(`[Gemini] Modèle ${model} indisponible ou quota épuisé, tentative suivante...`)
    }
  }
  throw lastErr
}

/* ── Rate limiting en mémoire — un limiteur indépendant par route,
   avec ses propres seuils (le chat est appelé à chaque message,
   le rapport une fois par visite : les seuils n'ont pas à être identiques). ── */
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

/* ── Validation & nettoyage des messages reçus du widget ── */
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
    if (!text || text.length > MAX_MESSAGE_LENGTH) return null
    cleaned.push({ role: m.role, content: text })
  }
  return cleaned
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
