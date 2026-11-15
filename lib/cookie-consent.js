/* Persistance du choix de cookies.

   Source de vérité : localStorage. Le cookie `akatech_cookie_consent` n'en est
   qu'un miroir de secours (il est relu si localStorage est vide ou corrompu),
   et sessionStorage / la mémoire de l'onglet évitent que la bannière revienne
   à chaque page quand le navigateur refuse d'écrire (navigation privée, etc.).

   Ordre de lecture : localStorage → cookie → sessionStorage → mémoire.
   Dès qu'un choix valide est trouvé, il est ré-écrit partout (le stockage
   manquant est restauré et la durée de vie du cookie est renouvelée).

   Le choix expire 12 mois après la décision (CONSENT_TTL_MS) : la bannière
   ne revient donc qu'une fois par an, ou si le visiteur vide les données du site. */

export const CONSENT_KEY = 'akatech_cookie_consent'
export const CONSENT_VERSION = 1
export const CONSENT_TTL_MS = 365 * 24 * 60 * 60 * 1000 // 12 mois
// Évènement émis dans l'onglet quand le choix change (bannière ou page /cookies) : la bannière
// se masque aussitôt si elle était encore affichée. L'évènement `storage`, lui, ne couvre que les autres onglets.
export const CONSENT_CHANGE_EVENT = 'akatech:consent-changed'
const COOKIE_MAX_AGE_S = 365 * 24 * 60 * 60

// Dernier recours quand aucun stockage n'est accessible : tient pour tout
// l'onglet (navigation entre pages), pas au-delà.
let memoryConsent = null

const hasWindow = () => typeof window !== 'undefined'

// Renvoie le storage s'il est réellement utilisable (Safari privé / quota /
// cookies bloqués → l'accès lève une exception), sinon null.
function usableStorage(kind) {
  if (!hasWindow()) return null
  try {
    const s = window[kind]
    if (!s) return null
    const probe = '__akatech_probe__'
    s.setItem(probe, '1')
    s.removeItem(probe)
    return s
  } catch {
    return null
  }
}

/* Valide un choix brut (chaîne JSON ou objet). Retourne l'objet normalisé,
   ou null s'il est absent, illisible, inconnu ou expiré. Les anciens
   enregistrements sans `v` restent acceptés. */
export function parseConsent(raw, now = Date.now()) {
  if (!raw) return null
  try {
    const c = typeof raw === 'string' ? JSON.parse(raw) : raw
    if (!c || !['accepted', 'rejected'].includes(c.status)) return null
    const ts = Number.isFinite(c.ts) ? c.ts : now
    if (now - ts > CONSENT_TTL_MS) return null
    return {
      v: CONSENT_VERSION,
      status: c.status,
      analytics: typeof c.analytics === 'boolean' ? c.analytics : c.status === 'accepted',
      ts,
    }
  } catch {
    return null
  }
}

function readCookie() {
  if (!hasWindow()) return null
  try {
    const prefix = `${CONSENT_KEY}=`
    const item = document.cookie.split('; ').find((c) => c.startsWith(prefix))
    return item ? decodeURIComponent(item.slice(prefix.length)) : null
  } catch {
    return null
  }
}

/* Lit le choix enregistré (ou null s'il faut afficher la bannière). */
export function readConsent(now = Date.now()) {
  const sources = [
    () => usableStorage('localStorage')?.getItem(CONSENT_KEY),
    () => readCookie(),
    () => usableStorage('sessionStorage')?.getItem(CONSENT_KEY),
    () => memoryConsent,
  ]
  for (const read of sources) {
    let raw = null
    try { raw = read() } catch { /* source indisponible : on passe à la suivante */ }
    const consent = parseConsent(raw, now)
    if (consent) return consent
  }
  return null
}

/* Écrit le choix partout où c'est possible. Retourne true si au moins un
   stockage durable (localStorage ou cookie) l'a accepté. */
export function writeConsent(consent) {
  const clean = parseConsent(consent)
  if (!clean) return false
  memoryConsent = clean
  if (!hasWindow()) return false

  const json = JSON.stringify(clean)
  let durable = false

  try {
    const ls = usableStorage('localStorage')
    if (ls) { ls.setItem(CONSENT_KEY, json); durable = true }
  } catch { /* quota / mode privé */ }

  try {
    const secure = window.location.protocol === 'https:' ? '; Secure' : ''
    document.cookie = `${CONSENT_KEY}=${encodeURIComponent(json)}; Max-Age=${COOKIE_MAX_AGE_S}; Path=/; SameSite=Lax${secure}`
    if (readCookie()) durable = true
  } catch { /* cookies bloqués */ }

  try {
    usableStorage('sessionStorage')?.setItem(CONSENT_KEY, json)
  } catch { /* ignoré */ }

  try {
    window.dispatchEvent(new CustomEvent(CONSENT_CHANGE_EVENT, { detail: clean }))
  } catch { /* ignoré */ }

  return durable
}

/* Signale le choix à /api/track (même endpoint que VisitorTracker). Les cookies akatech_visitor /
   akatech_session, posés par middleware.js, rattachent la décision à la session en cours : pas
   besoin de transmettre un identifiant. Sans page vue dans l'appel, le serveur le traite comme
   une décision explicite : un refus efface IP, ville et position déjà enregistrées, une
   acceptation peut déclencher l'alerte de première visite. Best-effort comme tout le suivi :
   un échec réseau ne doit jamais gêner le visiteur. */
export function reportConsent(status) {
  if (!hasWindow()) return
  fetch('/api/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ consent: status }),
    keepalive: true,
  }).catch(() => {})
}

/* Prévient quand le choix change — dans un autre onglet (évènement `storage`) ou dans celui-ci
   (page /cookies) — pour masquer aussitôt la bannière. Retourne la fonction de désabonnement. */
export function subscribeConsent(callback) {
  if (!hasWindow()) return () => {}
  const onStorage = (e) => {
    if (e.key !== CONSENT_KEY) return
    const consent = parseConsent(e.newValue)
    if (consent) callback(consent)
  }
  const onLocalChange = (e) => {
    const consent = parseConsent(e.detail)
    if (consent) callback(consent)
  }
  window.addEventListener('storage', onStorage)
  window.addEventListener(CONSENT_CHANGE_EVENT, onLocalChange)
  return () => {
    window.removeEventListener('storage', onStorage)
    window.removeEventListener(CONSENT_CHANGE_EVENT, onLocalChange)
  }
}
