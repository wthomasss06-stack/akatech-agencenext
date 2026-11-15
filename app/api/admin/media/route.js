// app/api/admin/media/route.js
// Envoi d'une image depuis le dashboard (photo de couverture du blog) → table MediaAsset.
// Accès contrôlé ici même (lib/admin-auth.js), en plus du middleware.
import { createHash } from 'node:crypto'
import { prisma } from '@/lib/db'
import { isAdminRequest, unauthorizedResponse } from '@/lib/admin-auth'
import { MEDIA_MAX_BYTES, MEDIA_KINDS, sniffImageMime, mediaUrl } from '@/lib/media'

export const runtime = 'nodejs'

const json = (body, status = 200) =>
  Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } })

export async function POST(request) {
  if (!isAdminRequest(request)) return unauthorizedResponse()

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

    const requestedKind = form.get('kind')
    const kind = typeof requestedKind === 'string' && MEDIA_KINDS.has(requestedKind) ? requestedKind : 'blog-cover'

    // Le même fichier envoyé deux fois garde le même identifiant (pas de doublon en base).
    const sha256 = createHash('sha256').update(bytes).digest('hex')
    let asset = await prisma.mediaAsset.findUnique({ where: { sha256 }, select: { id: true } })
    if (!asset) {
      try {
        asset = await prisma.mediaAsset.create({
          data: { kind, mime, size: bytes.length, sha256, data: bytes },
          select: { id: true },
        })
      } catch (error) {
        // Deux envois simultanés du même fichier : l'autre a gagné, on relit.
        asset = await prisma.mediaAsset.findUnique({ where: { sha256 }, select: { id: true } })
        if (!asset) throw error
      }
    }

    return json({ id: asset.id, url: mediaUrl(asset.id), mime, size: bytes.length })
  } catch (error) {
    // Cause probable en local : table absente (npx prisma db push à lancer). Détail dans les logs seulement.
    console.error('[Media] Envoi échoué :', error?.message ?? error)
    return json({ error: 'Envoi impossible pour le moment.' }, 500)
  }
}
