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
  'site-vitrine': 'Conception de Site Web',
  'e-commerce': 'E-commerce',
  'application-web': 'Application Web / SaaS',
  'cartes-dashboards': 'Cartes Interactives & Dashboards',
  'api-backend': 'API & Backend',
  'google-my-business': 'Fiche Google My Business',
  'maintenance': 'Maintenance & Support',
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

  /* ── Échappement HTML avant injection dans le template email ──
     Empêche un visiteur malveillant d'injecter du HTML/JS dans
     l'email reçu via les champs name/email/message/projectType. */
  const safeName = escapeHtml(name)
  const safeEmail = escapeHtml(email)
  const safePhone = escapeHtml(phone)
  const safeBudget = escapeHtml(budget)
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
      subject: `🚀 Nouveau projet — ${safeName} (${projectLabel})`,
      html: `
        <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:600px;margin:0 auto;background:#0a120c;">

          <!-- Header marque -->
          <div style="padding:28px 32px;background:linear-gradient(135deg,#0d1a11 0%,#0a120c 100%);border-bottom:1px solid rgba(136,202,83,.25);">
            <div style="font-family:'JetBrains Mono',monospace;font-size:13px;font-weight:700;letter-spacing:.1em;color:#88ca53;text-transform:uppercase;">
              AKATech
            </div>
            <div style="margin-top:4px;font-size:11px;color:rgba(255,255,255,.4);">
              Nouvelle demande reçue via le formulaire de contact
            </div>
          </div>

          <div style="padding:32px;">

            <!-- Titre + badge type de projet -->
            <h2 style="margin:0 0 6px;color:#f2ede8;font-size:20px;font-weight:800;">
              ${safeName}
            </h2>
            <div style="display:inline-block;padding:5px 12px;border-radius:100px;background:rgba(136,202,83,.12);border:1px solid rgba(136,202,83,.3);font-size:12px;font-weight:700;color:#b3ee85;margin-bottom:24px;">
              ${projectLabel}
            </div>

            <!-- Infos contact en cards -->
            <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
              <tr>
                <td style="padding:14px 16px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);border-radius:10px 0 0 10px;border-right:none;">
                  <div style="font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:rgba(255,255,255,.35);margin-bottom:5px;">Email</div>
                  <a href="mailto:${safeEmail}" style="font-size:13px;color:#88ca53;text-decoration:none;font-weight:600;">${safeEmail}</a>
                </td>
                <td style="padding:14px 16px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);border-radius:0 10px 10px 0;">
                  <div style="font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:rgba(255,255,255,.35);margin-bottom:5px;">WhatsApp / Tél</div>
                  <span style="font-size:13px;color:#f2ede8;font-weight:600;">${safePhone || '—'}</span>
                </td>
              </tr>
            </table>

            <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
              <tr>
                <td style="padding:14px 16px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);border-radius:10px;">
                  <div style="font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:rgba(255,255,255,.35);margin-bottom:5px;">Budget estimé</div>
                  <span style="font-size:13px;color:#f2ede8;font-weight:600;">${safeBudget || 'Non précisé'}</span>
                </td>
              </tr>
            </table>

            <!-- Message -->
            <div style="font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:rgba(255,255,255,.35);margin-bottom:10px;">
              Description du projet
            </div>
            <p style="color:#e8e4df;line-height:1.7;font-size:14px;background:rgba(136,202,83,.05);padding:18px;border-radius:10px;border-left:3px solid #88ca53;margin:0 0 28px;">
              ${safeMessage}
            </p>

            <!-- CTA -->
            <a href="mailto:${safeEmail}" style="display:inline-block;padding:13px 26px;border-radius:100px;background:#88ca53;color:#0a120c;font-size:13px;font-weight:700;text-decoration:none;">
              Répondre à ${safeName.split(' ')[0]} →
            </a>

          </div>

          <div style="padding:18px 32px;border-top:1px solid rgba(255,255,255,.06);">
            <p style="margin:0;font-size:11px;color:rgba(255,255,255,.3);">
              Envoyé depuis akatech-nextjs · ${new Date().toLocaleString('fr-FR', { timeZone: 'Africa/Abidjan' })}
            </p>
          </div>
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
