/* Images du dashboard (table MediaAsset) : limites et contrôles partagés par les routes
   /api/admin/media (envoi) et /api/media/[id] (lecture publique). */

export const MEDIA_MAX_BYTES = 2 * 1024 * 1024 // 2 Mo : le navigateur envoie déjà une image réduite (~300 Ko)
export const MEDIA_KINDS = new Set(['blog-cover'])

// Type réel d'après les premiers octets du fichier — jamais d'après l'extension, le nom ou le
// Content-Type annoncé par le client. SVG volontairement exclu (il peut contenir du script).
export function sniffImageMime(bytes) {
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return 'image/jpeg'
  if (bytes.length >= 8 && [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a].every((b, i) => bytes[i] === b)) return 'image/png'
  if (bytes.length >= 12 && bytes.toString('ascii', 0, 4) === 'RIFF' && bytes.toString('ascii', 8, 12) === 'WEBP') return 'image/webp'
  return null
}

export const mediaUrl = (id) => `/api/media/${id}`

// Les identifiants sont des cuid : lettres minuscules et chiffres.
export const isMediaId = (id) => typeof id === 'string' && /^[a-z0-9]{20,32}$/.test(id)
