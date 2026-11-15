/* Outils de géolocalisation approximative et de lecture du trafic.
   Fonctions pures, sans dépendance : utilisables côté serveur (/api/track,
   lib/db.js) comme dans le dashboard.

   La ville / le pays viennent des en-têtes que Vercel ajoute à chaque requête
   (x-vercel-ip-country, x-vercel-ip-country-region, x-vercel-ip-city). Aucune
   adresse IP n'est envoyée à un service tiers. La précision est celle d'une
   géolocalisation par IP : la ville du fournisseur d'accès, parfois voisine de
   la vraie, jamais une adresse. Hors Vercel (local), ces en-têtes n'existent pas :
   les champs restent vides. */

// ── Adresse IP du visiteur (Vercel remplace x-forwarded-for : non falsifiable) ──
const IPV4 = /^(?:\d{1,3}\.){3}\d{1,3}$/
const IPV6 = /^[0-9a-f:]+$/i

export function clientIp(headerList) {
  const raw = headerList.get('x-forwarded-for')?.split(',')[0]?.trim() || headerList.get('x-real-ip')?.trim() || ''
  const ip = raw.replace(/^\[|\]$/g, '').replace(/^::ffff:/i, '')
  if (!ip || ip.length > 45) return null
  return IPV4.test(ip) || (ip.includes(':') && IPV6.test(ip)) ? ip : null
}

// ── Pays / région / ville ──
function decode(value) {
  if (!value) return null
  try { return decodeURIComponent(value).trim().slice(0, 80) || null } catch { return null }
}

// Coordonnées du centre de la ville (x-vercel-ip-latitude / -longitude), arrondies à 2 décimales
// (~1 km) : assez pour une carte, jamais assez pour désigner un domicile.
function coordinate(value, limit) {
  const n = Number.parseFloat(value)
  return Number.isFinite(n) && Math.abs(n) <= limit ? Math.round(n * 100) / 100 : null
}

export function geoFromHeaders(headerList) {
  const country = (headerList.get('x-vercel-ip-country') || '').trim().toUpperCase()
  return {
    country: /^[A-Z]{2}$/.test(country) ? country : null,
    region: decode(headerList.get('x-vercel-ip-country-region'))?.slice(0, 10) || null,
    city: decode(headerList.get('x-vercel-ip-city')),
    latitude: coordinate(headerList.get('x-vercel-ip-latitude'), 90),
    longitude: coordinate(headerList.get('x-vercel-ip-longitude'), 180),
  }
}

// Drapeau emoji d'après le code pays (CI → 🇨🇮). Vide si le code est inconnu.
export function countryFlag(code) {
  if (!/^[A-Za-z]{2}$/.test(code || '')) return ''
  return String.fromCodePoint(...[...code.toUpperCase()].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65))
}

// Nom du pays en français (CI → Côte d'Ivoire).
export function countryName(code) {
  if (!/^[A-Za-z]{2}$/.test(code || '')) return null
  try { return new Intl.DisplayNames(['fr'], { type: 'region' }).of(code.toUpperCase()) || code.toUpperCase() } catch { return code.toUpperCase() }
}

// « 🇨🇮 Côte d'Ivoire » — ou « Pays inconnu ».
export function countryLabel(code) {
  const name = countryName(code)
  return name ? `${countryFlag(code)} ${name}`.trim() : 'Pays inconnu'
}

// ── Système et navigateur (à partir du user-agent) ──
export function parseUserAgent(ua = '') {
  let os = 'Autre'
  if (/android/i.test(ua)) os = 'Android'
  else if (/iphone|ipad|ipod/i.test(ua)) os = 'iOS'
  else if (/windows/i.test(ua)) os = 'Windows'
  else if (/mac os x|macintosh/i.test(ua)) os = 'macOS'
  else if (/cros/i.test(ua)) os = 'ChromeOS'
  else if (/linux|x11/i.test(ua)) os = 'Linux'
  if (!ua) os = null

  let browser = 'Autre'
  if (/FBAN|FBAV|FB_IAB/i.test(ua)) browser = 'Facebook (in-app)'
  else if (/Instagram/i.test(ua)) browser = 'Instagram (in-app)'
  else if (/LinkedInApp/i.test(ua)) browser = 'LinkedIn (in-app)'
  else if (/TikTok|musical_ly|BytedanceWebview/i.test(ua)) browser = 'TikTok (in-app)'
  else if (/EdgA?\/|Edg\//i.test(ua)) browser = 'Edge'
  else if (/OPR\/|Opera/i.test(ua)) browser = 'Opera'
  else if (/SamsungBrowser/i.test(ua)) browser = 'Samsung Internet'
  else if (/Firefox|FxiOS/i.test(ua)) browser = 'Firefox'
  else if (/Chrome|CriOS/i.test(ua)) browser = 'Chrome'
  else if (/Safari/i.test(ua)) browser = 'Safari'
  if (!ua) browser = null
  return { os, browser }
}

// ── Provenance lisible (Facebook, LinkedIn, Google, Direct…) ──
const SOURCES = [
  [/(^|\.)google\./i, 'Google'],
  [/(^|\.)bing\.com$/i, 'Bing'],
  [/duckduckgo\.com$/i, 'DuckDuckGo'],
  [/(^|\.)(facebook\.com|fb\.com|fb\.me|fbcdn\.net)$/i, 'Facebook'],
  [/(^|\.)instagram\.com$/i, 'Instagram'],
  [/(^|\.)(linkedin\.com|lnkd\.in)$/i, 'LinkedIn'],
  [/(^|\.)(twitter\.com|x\.com|t\.co)$/i, 'X (Twitter)'],
  [/(^|\.)(whatsapp\.com|wa\.me)$/i, 'WhatsApp'],
  [/(^|\.)(youtube\.com|youtu\.be)$/i, 'YouTube'],
  [/(^|\.)tiktok\.com$/i, 'TikTok'],
  [/(^|\.)github\.com$/i, 'GitHub'],
]

// Les navigateurs intégrés aux applications (Facebook, Instagram…) n'envoient
// souvent aucun referrer : on retombe alors sur l'application elle-même.
const IN_APP = [[/FBAN|FBAV|FB_IAB/i, 'Facebook'], [/Instagram/i, 'Instagram'], [/LinkedInApp/i, 'LinkedIn'], [/TikTok|musical_ly|BytedanceWebview/i, 'TikTok']]

// Un lien balisé (?utm_source=whatsapp) l'emporte sur le referrer et sur le navigateur intégré :
// c'est la seule provenance fiable pour un partage WhatsApp, qui n'envoie aucun referrer.
export function classifySource(referrer, userAgent = '', ownHostPattern = /akatech/i, utmSource = null) {
  const tagged = utmSourceLabel(utmSource)
  if (tagged) return tagged
  let host = null
  try { host = referrer ? new URL(referrer).hostname.replace(/^www\./, '') : null } catch { host = null }
  if (host && !ownHostPattern.test(host)) {
    const known = SOURCES.find(([re]) => re.test(host))
    return known ? known[1] : host
  }
  const app = IN_APP.find(([re]) => re.test(userAgent))
  return app ? app[1] : 'Direct'
}

// ── Liens balisés (UTM) ──
// Valeur normalisée : sans accents, minuscules, a-z 0-9 _ . - uniquement, 40 caractères max.
// Passe côté navigateur (VisitorTracker) comme côté serveur (/api/track) : jamais de HTML ni d'URL.
export function sanitizeUtmValue(value) {
  if (typeof value !== 'string') return null
  const clean = value
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .trim().toLowerCase()
    .replace(/[^a-z0-9_.]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40)
  return clean || null
}

// { source, medium, campaign } ou null : sans utm_source, le reste n'a aucun sens.
export function sanitizeUtm(input) {
  if (!input || typeof input !== 'object') return null
  const source = sanitizeUtmValue(input.source)
  if (!source) return null
  return { source, medium: sanitizeUtmValue(input.medium), campaign: sanitizeUtmValue(input.campaign) }
}

const UTM_LABELS = {
  whatsapp: 'WhatsApp', wa: 'WhatsApp', facebook: 'Facebook', fb: 'Facebook', instagram: 'Instagram', ig: 'Instagram',
  linkedin: 'LinkedIn', tiktok: 'TikTok', twitter: 'X (Twitter)', x: 'X (Twitter)', youtube: 'YouTube',
  telegram: 'Telegram', google: 'Google', email: 'E-mail', mail: 'E-mail', newsletter: 'E-mail', sms: 'SMS', qr: 'QR code',
}

export function utmSourceLabel(source) {
  const key = sanitizeUtmValue(source)
  if (!key) return null
  return UTM_LABELS[key] || key.charAt(0).toUpperCase() + key.slice(1)
}

// Robots et prévisualisations : exclus des chiffres géographiques et de la liste des visites.
export const BOT_PATTERN = /bot|crawler|spider|headless|preview|monitor|lighthouse|facebookexternalhit|slurp|python-requests|curl\/|wget|vercel-/i
export const isBot = (userAgent = '') => BOT_PATTERN.test(userAgent)
