/* Vérification de l'accès administrateur, côté serveur, pour les routes qui écrivent en base.

   middleware.js protège déjà le dashboard et les API admin par Basic Auth. Cette fonction refait
   le contrôle DANS la route d'envoi d'images : une route d'upload ne doit jamais dépendre
   uniquement d'une liste de chemins protégés ailleurs (un oubli dans le matcher et n'importe qui
   pourrait remplir la base). Mêmes variables que le middleware : ADMIN_USER / ADMIN_PASSWORD.
   Fermé par défaut : sans ces variables, personne n'est autorisé. */

import { createHash, timingSafeEqual } from 'node:crypto'

const digest = (value) => createHash('sha256').update(String(value)).digest()

export function isAdminRequest(request) {
  const user = process.env.ADMIN_USER
  const password = process.env.ADMIN_PASSWORD
  if (!user || !password) return false

  const header = request.headers.get('authorization') || ''
  if (!header.startsWith('Basic ')) return false

  let decoded = ''
  try {
    decoded = Buffer.from(header.slice(6), 'base64').toString('utf8')
  } catch {
    return false
  }
  const separator = decoded.indexOf(':')
  if (separator < 0) return false

  // Comparaison à temps constant (empreintes de même taille), les deux champs toujours évalués.
  const userOk = timingSafeEqual(digest(decoded.slice(0, separator)), digest(user))
  const passwordOk = timingSafeEqual(digest(decoded.slice(separator + 1)), digest(password))
  return userOk && passwordOk
}

export function unauthorizedResponse() {
  return new Response(JSON.stringify({ error: 'Accès refusé.' }), {
    status: 401,
    headers: {
      'Content-Type': 'application/json',
      'WWW-Authenticate': 'Basic realm="AKATech Dashboard"',
      'Cache-Control': 'no-store',
    },
  })
}
