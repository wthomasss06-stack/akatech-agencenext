// app/api/media/[id]/route.js
// Lecture publique d'une image du dashboard (photo de couverture des articles).
// Contenu immuable : l'identifiant change dès que le fichier change (dédoublonnage par sha256),
// donc cache d'un an côté navigateur et CDN.
import { prisma } from '@/lib/db'
import { isMediaId } from '@/lib/media'

export const runtime = 'nodejs'

export async function GET(request, { params }) {
  const { id } = await params
  if (!isMediaId(id)) return new Response('Not found', { status: 404 })

  try {
    const asset = await prisma.mediaAsset.findUnique({ where: { id }, select: { mime: true, sha256: true, data: true } })
    if (!asset) return new Response('Not found', { status: 404 })

    const etag = `"${asset.sha256}"`
    const headers = {
      'Content-Type': asset.mime,
      'Cache-Control': 'public, max-age=31536000, s-maxage=31536000, immutable',
      ETag: etag,
      'X-Content-Type-Options': 'nosniff',
      'Content-Security-Policy': "default-src 'none'; style-src 'unsafe-inline'",
      'Cross-Origin-Resource-Policy': 'cross-origin',
    }
    if (request.headers.get('if-none-match') === etag) return new Response(null, { status: 304, headers })

    const body = new Uint8Array(asset.data)
    return new Response(body, { headers: { ...headers, 'Content-Length': String(body.length) } })
  } catch (error) {
    console.error('[Media] Lecture échouée :', error?.message ?? error)
    return new Response('Unavailable', { status: 503 })
  }
}
