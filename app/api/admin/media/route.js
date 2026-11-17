// app/api/admin/media/route.js
// Envoi d'une image depuis le dashboard (photo de couverture du blog) → Cloudinary.
// Accès contrôlé ici même (lib/admin-auth.js), en plus du middleware.
//
// Variables à définir (en local dans .env.local, et sur Vercel → Settings → Environment Variables) :
//   CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, et CLOUDINARY_CLOUD_NAME
//   (ou, à défaut, NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, déjà utilisée par lib/cloudinary.js).
//
// Les anciennes images enregistrées en base (/api/media/<id>) restent lisibles : la route de
// lecture n'a pas changé. Seuls les NOUVEAUX envois partent vers Cloudinary.
import { createHash } from 'node:crypto'
import { v2 as cloudinary } from 'cloudinary'
import { isAdminRequest, unauthorizedResponse } from '@/lib/admin-auth'
import { MEDIA_MAX_BYTES, sniffImageMime } from '@/lib/media'

export const runtime = 'nodejs'

const FOLDER = 'akatech/blog'

const json = (body, status = 200) =>
  Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } })

function configureCloudinary() {
  const cloud_name = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  const api_key = process.env.CLOUDINARY_API_KEY
  const api_secret = process.env.CLOUDINARY_API_SECRET
  if (!cloud_name || !api_key || !api_secret) return false
  cloudinary.config({ cloud_name, api_key, api_secret, secure: true })
  return true
}

const uploadBuffer = (bytes, options) =>
  new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(options, (error, result) => (error ? reject(error) : resolve(result))).end(bytes)
  })

export async function POST(request) {
  if (!isAdminRequest(request)) return unauthorizedResponse()

  if (!configureCloudinary()) {
    console.error('[Media] Cloudinary non configuré : CLOUDINARY_API_KEY / CLOUDINARY_API_SECRET / nom du compte manquants.')
    return json({ error: "Cloudinary n'est pas encore configuré sur le serveur (clés manquantes)." }, 503)
  }

  try {
    // Refus avant lecture du corps quand la taille annoncée dépasse déjà la limite.
    const announced = Number(request.headers.get('content-length') || 0)
    if (announced > MEDIA_MAX_BYTES + 64 * 1024) return json({ error: 'Image trop lourde (2 Mo maximum).' }, 413)

    const form = await request.formData()
    const file = form.get('file')
    if (!file || typeof file === 'string' || typeof file.arrayBuffer !== 'function') {
      return json({ error: 'Aucune image reçue.' }, 400)
    }
    if (file.size > MEDIA_MAX_BYTES) return json({ error: 'Image trop lourde (2 Mo maximum).' }, 413)

    const bytes = Buffer.from(await file.arrayBuffer())
    if (bytes.length > MEDIA_MAX_BYTES) return json({ error: 'Image trop lourde (2 Mo maximum).' }, 413)

    const mime = sniffImageMime(bytes)
    if (!mime) return json({ error: 'Format non pris en charge (JPG, PNG ou WebP).' }, 415)

    // Le même fichier envoyé deux fois garde le même identifiant : pas de doublon sur Cloudinary.
    const sha256 = createHash('sha256').update(bytes).digest('hex')
    const result = await uploadBuffer(bytes, {
      folder: FOLDER,
      public_id: sha256.slice(0, 24),
      overwrite: false,
      resource_type: 'image',
    })

    // f_auto + q_auto : Cloudinary sert le format et le poids les plus légers pour chaque visiteur.
    const url = String(result.secure_url).replace('/upload/', '/upload/f_auto,q_auto/')
    return json({ id: result.public_id, url, mime, size: bytes.length })
  } catch (error) {
    // Détail dans les logs seulement (jamais de clé ni de message brut renvoyé au navigateur).
    console.error('[Media] Envoi vers Cloudinary échoué :', error?.message ?? error)
    return json({ error: 'Envoi impossible pour le moment.' }, 500)
  }
}
