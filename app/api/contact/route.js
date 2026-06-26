import { Resend } from 'resend'

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

function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function getClientIp(request) {
  const fwd = request.headers.get('x-forwarded-for')
  if (fwd) return fwd.split(',')[0].trim()
  return request.headers.get('x-real-ip') || 'unknown'
}

const PROJECT_TYPE_LABELS = {
  'site-vitrine': 'Site Vitrine',
  'e-commerce': 'E-commerce',
  'application-web': 'Application Web / SaaS',
  'api': 'API / Backend',
  'dashboard': 'Dashboard / Data',
  'maintenance': 'Maintenance / Support',
  'recrutement': 'Candidature spontanée',
  'autre': 'Autre',
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
  const projectType = typeof body.projectType === 'string' ? body.projectType.trim() : ''
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

  /* ── Échappement HTML avant injection dans le template email ──
     Empêche un visiteur malveillant d'injecter du HTML/JS dans
     l'email reçu via les champs name/email/message/projectType. */
  const safeName = escapeHtml(name)
  const safeEmail = escapeHtml(email)
  const safeMessage = escapeHtml(message).replace(/\n/g, '<br/>')
  const projectLabel = escapeHtml(PROJECT_TYPE_LABELS[projectType] || projectType || '—')

  try {
    const result = await getResend().emails.send({
      /* Resend impose un domaine vérifié en from.
         Si ton domaine n'est pas vérifié, garde onboarding@resend.dev
         pour les tests, puis passe à noreply@tondomaine.com en prod. */
      from: process.env.FROM_EMAIL ?? 'onboarding@resend.dev',
      to: process.env.ADMIN_EMAIL ?? 'wthomasss06@gmail.com',
      reply_to: email,
      subject: `🚀 NOUVEAU MESSAGE — ${safeName}`,
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px;
                    background:#0d0d0d;border-radius:12px;
                    border:1px solid rgba(255,85,0,0.2);">
          <h2 style="color:#FF5500;margin-bottom:24px;">
            📬 Nouveau message via AKATech
          </h2>
          <table style="width:100%;border-collapse:collapse;">
            <tr>
              <td style="padding:8px 0;font-weight:700;color:#aaa;width:140px;">Nom</td>
              <td style="padding:8px 0;color:#f2ede8;">${safeName}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;font-weight:700;color:#aaa;">Email</td>
              <td style="padding:8px 0;color:#f2ede8;">
                <a href="mailto:${safeEmail}" style="color:#FF5500;">${safeEmail}</a>
              </td>
            </tr>
            <tr>
              <td style="padding:8px 0;font-weight:700;color:#aaa;">Type projet</td>
              <td style="padding:8px 0;color:#f2ede8;">${projectLabel}</td>
            </tr>
          </table>
          <hr style="border:none;border-top:1px solid rgba(255,85,0,0.2);margin:20px 0;" />
          <p style="font-weight:700;color:#aaa;margin-bottom:8px;">Message :</p>
          <p style="color:#f2ede8;line-height:1.7;
                    background:rgba(255,85,0,0.06);padding:16px;
                    border-radius:8px;border-left:4px solid #FF5500;">
            ${safeMessage}
          </p>
          <p style="margin-top:24px;font-size:12px;color:#555;">
            Envoyé depuis akatech-nextjs · ${new Date().toLocaleString('fr-FR', { timeZone: 'Africa/Abidjan' })}
          </p>
        </div>
      `,
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
