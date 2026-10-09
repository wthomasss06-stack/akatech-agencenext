import { Resend } from 'resend'
import { getFromAddress } from '@/lib/email-layout'
import { buildContactEmail } from '@/lib/email-templates'

let _resend = null
function getResend() {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder')
  return _resend
}

/* ════════════════════════════════════════════
   Anti-spam — limite naïve en mémoire
   (best-effort : se réinitialise si la fonction
   serverless redémarre / scale sur une autre
   instance ; ne remplace pas un vrai service de
   rate-limiting comme Upstash/Vercel KV en prod
   à fort trafic, mais bloque déjà 95% des bots
   basiques sans dépendance supplémentaire).
   ════════════════════════════════════════════ */
const RATE_LIMIT_WINDOW_MS = 60_000  // 1 minute
const RATE_LIMIT_MAX = 3              // 3 messages / IP / minute
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

/* Nettoyage périodique pour ne pas faire grossir la Map indéfiniment */
function pruneOldEntries() {
  const now = Date.now()
  for (const [ip, entry] of hits) {
    if (now - entry.start > RATE_LIMIT_WINDOW_MS) hits.delete(ip)
  }
}

/* ── Helpers ── */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function getClientIp(request) {
  const fwd = request.headers.get('x-forwarded-for')
  if (fwd) return fwd.split(',')[0].trim()
  return request.headers.get('x-real-ip') || 'unknown'
}

/* ── CORS preflight ── */
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}

export async function POST(request) {
  const corsHeaders = { 'Access-Control-Allow-Origin': '*' }

  /* ── Parsing body ── */
  let body = {}
  try {
    body = await request.json()
  } catch {
    body = {}
  }

  /* ── Anti-spam : honeypot ──
     Champ caché côté frontend (name="company" par ex.), invisible
     pour un humain mais souvent rempli par les bots de soumission
     automatique. S'il est rempli → on répond 200 "faux succès"
     pour ne pas indiquer au bot que la requête a été repérée. */
  if (body?.company) {
    return Response.json({ success: true }, { status: 200, headers: corsHeaders })
  }

  /* ── Anti-spam : rate-limit par IP ── */
  pruneOldEntries()
  const ip = getClientIp(request)
  if (isRateLimited(ip)) {
    return Response.json(
      { error: 'Trop de messages envoyés. Réessayez dans une minute.' },
      { status: 429, headers: corsHeaders }
    )
  }

  /* ── Validation ── */
  const name = typeof body.name === 'string' ? body.name.trim() : ''
  const email = typeof body.email === 'string' ? body.email.trim() : ''
  const phone = typeof body.phone === 'string' ? body.phone.trim() : ''
  const projectType = typeof body.projectType === 'string' ? body.projectType.trim() : ''
  const budget = typeof body.budget === 'string' ? body.budget.trim() : ''
  const message = typeof body.message === 'string' ? body.message.trim() : ''

  const fieldErrors = {}
  if (!name) fieldErrors.name = 'Le nom est requis.'
  else if (name.length > 100) fieldErrors.name = 'Le nom est trop long (100 caractères max).'

  if (!email) fieldErrors.email = "L'email est requis."
  else if (!EMAIL_RE.test(email)) fieldErrors.email = 'Adresse email invalide.'

  if (!message) fieldErrors.message = 'Le message est requis.'
  else if (message.length < 10) fieldErrors.message = 'Le message est trop court (10 caractères min).'
  else if (message.length > 5000) fieldErrors.message = 'Le message est trop long (5000 caractères max).'

  if (Object.keys(fieldErrors).length > 0) {
    return Response.json(
      { error: 'Champs invalides', fieldErrors },
      { status: 400, headers: corsHeaders }
    )
  }

  /* ── Vérification env vars ── */
  if (!process.env.RESEND_API_KEY) {
    console.error('[Contact] RESEND_API_KEY manquante')
    return Response.json(
      { error: 'Configuration serveur incorrecte' },
      { status: 500, headers: corsHeaders }
    )
  }

  /* ── Mise en page : lib/email-templates.js reçoit les champs bruts et
     échappe tout (un visiteur malveillant ne peut pas injecter de HTML
     via name/email/message/projectType). ── */
  const mail = buildContactEmail({ name, email, phone, projectType, budget, message })

  try {
    const result = await getResend().emails.send({
      /* Resend impose un domaine vérifié en from.
         Si ton domaine n'est pas vérifié, garde onboarding@resend.dev
         pour les tests, puis passe à noreply@tondomaine.com en prod. */
      from: getFromAddress(),
      to: process.env.ADMIN_EMAIL ?? 'wthomasss06@gmail.com',
      /* Le SDK Resend lit `replyTo` (camelCase) : l'ancien `reply_to` était
         ignoré, donc « Répondre » écrivait à l'expéditeur Resend. */
      replyTo: email,
      subject: mail.subject,
      html: mail.html,
      text: mail.text,
    })

    console.log('[Contact] Email envoyé :', result?.data?.id ?? result)
    return Response.json({ success: true }, { status: 200, headers: corsHeaders })

  } catch (error) {
    console.error('[Contact] Erreur Resend :', error?.message ?? error)
    return Response.json(
      {
        error: "Erreur lors de l'envoi. Réessayez ou contactez-moi directement.",
        detail: error?.message ?? 'Inconnue',
      },
      { status: 500, headers: corsHeaders }
    )
  }
}
