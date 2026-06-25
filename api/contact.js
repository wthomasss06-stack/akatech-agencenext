import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

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

function getClientIp(req) {
  const fwd = req.headers['x-forwarded-for']
  if (fwd) return fwd.split(',')[0].trim()
  return req.socket?.remoteAddress || 'unknown'
}

const SERVICE_LABELS = {
  'site-vitrine': 'Site Vitrine',
  'e-commerce': 'E-commerce',
  'application-web': 'Application Web / SaaS',
  'api': 'API / Backend',
  'dashboard': 'Dashboard / Data',
  'maintenance': 'Maintenance / Support',
  'cartes-dashboards': 'Cartes Interactives & Dashboards',
  'google-business': 'Fiche Google My Business',
  'autre': 'Autre',
}

export default async function handler(req, res) {
  /* ── CORS preflight ── */
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' })
  }

  /* ── Anti-spam : honeypot ──
     Champ caché côté frontend (name="company" par ex.), invisible
     pour un humain mais souvent rempli par les bots de soumission
     automatique. S'il est rempli → on répond 200 "faux succès"
     pour ne pas indiquer au bot que la requête a été repérée. */
  if (req.body?.company) {
    return res.status(200).json({ success: true })
  }

  /* ── Anti-spam : rate-limit par IP ── */
  pruneOldEntries()
  const ip = getClientIp(req)
  if (isRateLimited(ip)) {
    return res.status(429).json({ error: 'Trop de messages envoyés. Réessayez dans une minute.' })
  }

  /* ── Validation ── */
  const body = req.body ?? {}
  const name = typeof body.name === 'string' ? body.name.trim() : ''
  const email = typeof body.email === 'string' ? body.email.trim() : ''
  const phone = typeof body.phone === 'string' ? body.phone.trim() : ''
  const service = typeof body.service === 'string' ? body.service.trim() : ''
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
    return res.status(400).json({
      error: 'Champs invalides',
      fieldErrors,
    })
  }

  /* ── Vérification env vars ── */
  if (!process.env.RESEND_API_KEY) {
    console.error('[Contact] RESEND_API_KEY manquante')
    return res.status(500).json({ error: 'Configuration serveur incorrecte' })
  }

  /* ── Échappement HTML avant injection dans le template email ──
     Empêche un visiteur malveillant d'injecter du HTML/JS dans
     l'email reçu via les champs name/email/phone/message/service. */
  const safeName = escapeHtml(name)
  const safeEmail = escapeHtml(email)
  const safePhone = escapeHtml(phone)
  const safeMessage = escapeHtml(message).replace(/\n/g, '<br/>')
  const serviceLabel = escapeHtml(SERVICE_LABELS[service] || service || '—')
  const budgetLabel = escapeHtml(budget || '—')

  try {
    const result = await resend.emails.send({
      /* Resend impose un domaine vérifié en from.
         Si le domaine n'est pas vérifié, garder onboarding@resend.dev
         pour les tests, puis passer à noreply@akatech-agence.vercel.app (ou
         domaine custom) en prod une fois vérifié sur resend.com/domains. */
      from: process.env.FROM_EMAIL ?? 'onboarding@resend.dev',
      to:   process.env.ADMIN_EMAIL ?? 'wthomasss06@gmail.com',
      reply_to: email,
      subject: `🚀 NOUVEAU PROJET — ${safeName}`,
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px;
                    background:#030806;border-radius:12px;
                    border:1px solid rgba(136,202,83,0.2);">
          <h2 style="color:#88ca53;margin-bottom:24px;">
            📬 Nouveau message via le site AKATech
          </h2>
          <table style="width:100%;border-collapse:collapse;">
            <tr>
              <td style="padding:8px 0;font-weight:700;color:#aaa;width:140px;">Nom</td>
              <td style="padding:8px 0;color:#f2ede8;">${safeName}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;font-weight:700;color:#aaa;">Email</td>
              <td style="padding:8px 0;color:#f2ede8;">
                <a href="mailto:${safeEmail}" style="color:#88ca53;">${safeEmail}</a>
              </td>
            </tr>
            ${phone ? `
            <tr>
              <td style="padding:8px 0;font-weight:700;color:#aaa;">Téléphone</td>
              <td style="padding:8px 0;color:#f2ede8;">${safePhone}</td>
            </tr>` : ''}
            <tr>
              <td style="padding:8px 0;font-weight:700;color:#aaa;">Type de projet</td>
              <td style="padding:8px 0;color:#f2ede8;">${serviceLabel}</td>
            </tr>
            ${budget ? `
            <tr>
              <td style="padding:8px 0;font-weight:700;color:#aaa;">Budget estimé</td>
              <td style="padding:8px 0;color:#f2ede8;">${budgetLabel}</td>
            </tr>` : ''}
          </table>
          <hr style="border:none;border-top:1px solid rgba(136,202,83,0.2);margin:20px 0;" />
          <p style="font-weight:700;color:#aaa;margin-bottom:8px;">Message :</p>
          <p style="color:#f2ede8;line-height:1.7;
                    background:rgba(136,202,83,0.06);padding:16px;
                    border-radius:8px;border-left:4px solid #88ca53;">
            ${safeMessage}
          </p>
          <p style="margin-top:24px;font-size:12px;color:#555;">
            Envoyé depuis akatech-agence.vercel.app · ${new Date().toLocaleString('fr-FR', { timeZone: 'Africa/Abidjan' })}
          </p>
        </div>
      `,
    })

    console.log('[Contact] Email envoyé :', result?.data?.id ?? result)
    return res.status(200).json({ success: true })

  } catch (error) {
    console.error('[Contact] Erreur Resend :', error?.message ?? error)
    return res.status(500).json({
      error: "Erreur lors de l'envoi. Réessayez ou contactez AKATech directement sur WhatsApp.",
      detail: error?.message ?? 'Inconnue',
    })
  }
}
