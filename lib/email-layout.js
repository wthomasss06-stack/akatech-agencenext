/**
 * Mise en page commune des e-mails HTML AKATech (Resend).
 *
 * Contraintes des clients mail (Gmail, Outlook, Apple Mail) : tables plutôt que
 * flexbox/grid, styles en ligne, couleurs hexadécimales opaques (pas de rgba ni
 * de dégradé comme seule source de contraste), police système. Le mode sombre
 * et le responsive sont des améliorations progressives via <style> : un client
 * qui les ignore affiche simplement la version claire à 600 px.
 *
 * Toutes les valeurs dynamiques sont échappées ICI : les appelants passent des
 * valeurs brutes (jamais déjà échappées, sinon double échappement).
 */

export const DEFAULT_FROM_EMAIL = 'onboarding@resend.dev'
export const DEFAULT_SITE_URL = 'https://akatech.vercel.app'

const BRAND = {
  forest: '#0a2410',
  lime: '#c6ff3d',
  green: '#88ca53',
  greenDark: '#3f7a1f',
  ink: '#0d1a11',
  text: '#1c2a18',
  muted: '#5d6b57',
  line: '#e3eadc',
  page: '#eef2ea',
  card: '#ffffff',
  tint: '#f3f8ee',
}
// Mêmes polices que le site (app/globals.css) : JetBrains Mono pour le texte,
// Barlow Condensed italique pour les titres. Apple Mail, iOS Mail, Samsung Mail
// et Thunderbird les chargent depuis Google Fonts. Gmail et Outlook ne chargent
// aucune police externe : ils retombent sur la première police de la liste
// disponible sur l'appareil (monospace pour le texte, condensée pour les titres).
const FONT = "'JetBrains Mono',ui-monospace,SFMono-Regular,Menlo,Consolas,'Roboto Mono','Courier New',monospace"
const DISPLAY = "'Barlow Condensed','Roboto Condensed','sans-serif-condensed','Arial Narrow','Helvetica Neue',Arial,sans-serif"
const FONTS_URL = 'https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@1,800;1,900&family=JetBrains+Mono:wght@400;500;700&display=swap'
const LOGO_PATH = '/email/akatech-logo.png' // fichier : public/email/akatech-logo.png
const SAFE_PROTOCOLS = ['https:', 'http:', 'mailto:', 'tel:']

export function escapeHtml(value = '') {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/** Seuls texte, nombre et booléen deviennent du texte : un objet ou un tableau (ex. argument d'outil IA) donne ''. */
export function asText(value) {
  if (typeof value === 'string') return value
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  return ''
}

/** Texte brut d'une ligne (sujet, aperçu) : sans retours à la ligne ni caractères de contrôle. */
export function cleanLine(value, maxLength = 160) {
  return asText(value)
    .replace(/[\u0000-\u001f\u007f]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLength)
}

/** Texte multiligne échappé, retours à la ligne conservés. */
function multiline(value, maxLength = 4000) {
  return escapeHtml(asText(value).slice(0, maxLength)).replace(/\r?\n/g, '<br>')
}

/** N'accepte que https/http/mailto/tel, sans espace ni guillemet. */
export function safeHref(value) {
  if (typeof value !== 'string') return ''
  const href = value.trim()
  if (!href || /[\s"'<>]/.test(href)) return ''
  try {
    return SAFE_PROTOCOLS.includes(new URL(href).protocol) ? href : ''
  } catch {
    return ''
  }
}

export function getSiteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL).replace(/\/+$/, '')
}

/** Expéditeur avec nom affiché ("AKATech <adresse>") sauf si FROM_EMAIL en fournit déjà un. */
export function getFromAddress() {
  const raw = (process.env.FROM_EMAIL || DEFAULT_FROM_EMAIL).trim()
  return raw.includes('<') ? raw : `AKATech <${raw}>`
}

export function formatAbidjanDate(date = new Date()) {
  return date.toLocaleString('fr-FR', { timeZone: 'Africa/Abidjan' })
}

/* ── Briques ─────────────────────────────────────────────── */

export function emailBadge(text) {
  const label = cleanLine(text, 80)
  if (!label) return ''
  return `<span class="em-badge" style="display:inline-block;padding:5px 13px;font-family:${FONT};border-radius:999px;background:#eaf6dd;border:1px solid #cfe7b5;color:${BRAND.greenDark};font-size:11px;font-weight:700;line-height:18px;">${escapeHtml(label)}</span>`
}

/** rows : [[libellé, valeur, { href }?]] — les valeurs vides sont ignorées. */
export function emailFields(rows) {
  const items = (rows || []).filter(([, value]) => cleanLine(value, 400) !== '')
  if (!items.length) return ''
  const cells = items.map(([label, value, options], index) => {
    const href = safeHref(options?.href)
    const text = escapeHtml(cleanLine(value, 400))
    const content = href
      ? `<a class="em-link" href="${escapeHtml(href)}" style="color:${BRAND.greenDark};text-decoration:none;">${text}</a>`
      : text
    const border = index === items.length - 1 ? 'none' : `1px solid ${BRAND.line}`
    return `<tr>
      <td class="em-label em-line" valign="top" width="38%" style="padding:12px 12px 12px 0;border-bottom:${border};font-family:${FONT};font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:${BRAND.muted};">${escapeHtml(cleanLine(label, 60))}</td>
      <td class="em-value em-line" valign="top" align="right" style="padding:12px 0;border-bottom:${border};font-family:${FONT};font-size:13px;font-weight:700;line-height:20px;color:${BRAND.ink};text-align:right;word-break:break-word;overflow-wrap:anywhere;">${content}</td>
    </tr>`
  }).join('')
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;border-top:1px solid ${BRAND.line};" class="em-line">${cells}</table>`
}

/** Bloc de texte libre (résumé, description) avec filet vert à gauche. */
export function emailQuote(label, text) {
  const body = asText(text).trim()
  if (!body) return ''
  return `<div class="em-muted" style="font-family:${FONT};font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:${BRAND.muted};padding-bottom:8px;">${escapeHtml(cleanLine(label, 60))}</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
      <td class="em-quote" style="background:${BRAND.tint};border-left:4px solid ${BRAND.green};border-radius:0 10px 10px 0;padding:16px 18px;font-family:${FONT};font-size:13px;line-height:22px;color:${BRAND.text};">${multiline(body)}</td>
    </tr></table>`
}

/** Encart sombre mis en avant (ex. estimation de devis). */
export function emailHighlight({ label, title, value }) {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
    <td bgcolor="${BRAND.forest}" style="background:${BRAND.forest};border-radius:12px;padding:20px 22px;">
      <div style="font-family:${FONT};font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:${BRAND.green};padding-bottom:8px;">${escapeHtml(cleanLine(label, 60))}</div>
      <div style="font-family:${FONT};font-size:15px;font-weight:700;line-height:22px;color:#ffffff;">${escapeHtml(cleanLine(title, 120))}</div>
      ${value ? `<div style="font-family:${DISPLAY};font-size:30px;font-style:italic;font-weight:900;line-height:34px;color:${BRAND.lime};padding-top:6px;">${escapeHtml(cleanLine(value, 120))}</div>` : ''}
    </td></tr></table>`
}

/** Bouton "à toute épreuve" (cellule colorée + lien), refusé si l'URL n'est pas sûre. */
export function emailButton(label, href) {
  const url = safeHref(href)
  if (!url) return ''
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
    <td align="center" bgcolor="${BRAND.green}" style="background:${BRAND.green};border-radius:10px;mso-padding-alt:14px 28px;">
      <a href="${escapeHtml(url)}" target="_blank" rel="noopener" style="display:inline-block;padding:14px 28px;font-family:${FONT};font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;line-height:20px;color:${BRAND.forest};text-decoration:none;border-radius:10px;">${escapeHtml(cleanLine(label, 60))}</a>
    </td></tr></table>`
}

const SPACER = '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td height="24" style="height:24px;line-height:24px;font-size:0;">&nbsp;</td></tr></table>'

/** Assemble des blocs avec un espacement homogène (les blocs vides sont ignorés). */
export function emailStack(...blocks) {
  return blocks.filter(Boolean).join(SPACER)
}

/* ── Gabarit complet ─────────────────────────────────────── */

/**
 * @param {object} p
 * @param {string} p.preheader  Aperçu affiché dans la liste de la boîte de réception.
 * @param {string} p.eyebrow    Court libellé à droite du logotype (ex. « Alerte visiteur »).
 * @param {string} p.title      Titre principal.
 * @param {string} [p.subtitle] Phrase d'introduction sous le titre.
 * @param {string} [p.badge]    Pastille sous le titre (ex. type de projet).
 * @param {string} p.body       HTML déjà composé avec les briques ci-dessus.
 * @param {string} [p.footerNote]
 */
export function renderEmailLayout({ preheader = '', eyebrow = '', title, subtitle = '', badge = '', body = '', footerNote = '' }) {
  const safeTitle = cleanLine(title, 140) || 'Notification AKATech'
  const siteUrl = getSiteUrl()
  const logoUrl = safeHref(`${siteUrl}${LOGO_PATH}`)
  const homeUrl = safeHref(siteUrl)
  // Logo AKATech (PNG hébergé sur le site). Si les images sont bloquées, le texte alt
  // « AKATech » s'affiche à la place ; si l'URL du site est inutilisable, repli sur du texte.
  const logoImage = logoUrl
    ? `<img src="${escapeHtml(logoUrl)}" width="44" height="46" alt="AKATech" style="display:block;width:44px;height:46px;border:0;outline:none;text-decoration:none;font-family:${FONT};font-size:16px;font-weight:700;letter-spacing:.14em;color:${BRAND.lime};">`
    : `<span style="font-family:${FONT};font-size:16px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:${BRAND.lime};">AKATech</span>`
  const logo = homeUrl
    ? `<a href="${escapeHtml(homeUrl)}" target="_blank" rel="noopener" style="text-decoration:none;">${logoImage}</a>`
    : logoImage
  const hiddenPreheader = escapeHtml(cleanLine(preheader, 140)) + '&#8199;&zwnj;'.repeat(40)

  return `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light dark">
<meta name="supported-color-schemes" content="light dark">
<title>${escapeHtml(safeTitle)}</title>
<!--[if !mso]><!-->
<link href="${escapeHtml(FONTS_URL)}" rel="stylesheet" type="text/css">
<style>@import url('${FONTS_URL}');</style>
<!--<![endif]-->
<style>
  @media (max-width:620px){
    .em-wrap{width:100%!important}
    .em-pad{padding-left:22px!important;padding-right:22px!important}
    .em-title{font-size:28px!important;line-height:30px!important}
  }
  @media (prefers-color-scheme:dark){
    .em-page{background:#060e09!important}
    .em-card{background:#0d1a11!important;border-color:#1f3a26!important}
    .em-title,.em-value{color:#f2f7ee!important}
    .em-subtitle{color:#c3d1bb!important}
    .em-label,.em-muted,.em-footer{color:#9fb597!important}
    .em-line{border-color:#1f3a26!important}
    .em-quote{background:#12261a!important;color:#e6efe0!important}
    .em-badge{background:#16301c!important;border-color:#2a5a2e!important;color:#b3ee85!important}
    .em-link{color:#b3ee85!important}
  }
</style>
</head>
<body class="em-page" style="margin:0;padding:0;background:${BRAND.page};font-family:${FONT};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;mso-hide:all;">${hiddenPreheader}</div>
<table role="presentation" class="em-page" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${BRAND.page}" style="background:${BRAND.page};">
<tr><td align="center" style="padding:28px 12px;">
  <table role="presentation" class="em-wrap" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;">
    <tr><td class="em-card" bgcolor="${BRAND.card}" style="background:${BRAND.card};border:1px solid ${BRAND.line};border-radius:16px;overflow:hidden;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr><td class="em-pad" bgcolor="${BRAND.forest}" style="background:${BRAND.forest};border-top:4px solid ${BRAND.green};padding:20px 32px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
            <td valign="middle">${logo}</td>
            <td align="right" valign="middle" style="font-family:${FONT};font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:${BRAND.green};">${escapeHtml(cleanLine(eyebrow, 40))}</td>
          </tr></table>
        </td></tr>
        <tr><td class="em-pad" style="padding:32px;">
          <h1 class="em-title" style="margin:0;font-family:${DISPLAY};font-size:34px;line-height:36px;font-style:italic;font-weight:900;text-transform:uppercase;letter-spacing:-.01em;color:${BRAND.ink};">${escapeHtml(safeTitle)}</h1>
          ${badge ? `<div style="padding-top:12px;">${emailBadge(badge)}</div>` : ''}
          ${subtitle ? `<p class="em-subtitle" style="margin:14px 0 0;font-family:${FONT};font-size:13px;line-height:22px;color:#38472f;">${escapeHtml(cleanLine(subtitle, 500))}</p>` : ''}
          <div style="padding-top:26px;">${body}</div>
        </td></tr>
      </table>
    </td></tr>
    <tr><td class="em-footer" align="center" style="padding:18px 12px 4px;font-family:${FONT};font-size:10px;line-height:17px;color:${BRAND.muted};">
      ${footerNote ? `${escapeHtml(cleanLine(footerNote, 200))}<br>` : ''}AKATech · Abidjan, Côte d’Ivoire · ${escapeHtml(formatAbidjanDate())}
    </td></tr>
  </table>
</td></tr>
</table>
</body>
</html>`
}
