// lib/project-media.js
// Médias d'une réalisation pour les maquettes d'appareils (portable + téléphone).
//
//  • PC       → vidéo .webm si elle existe pour ce projet, sinon l'aperçu .webp
//  • Mobile   → jamais de vidéo : image `-responsive` (project.imgMobile), à
//               défaut l'aperçu .webp
//
// Les .webm sont lus depuis Cloudinary, comme les images : même arborescence
// (akatech/images/projects/<nom>-preview.webm), uploadés par
// `npm run upload-images` depuis public/images/projects/. Pour ajouter une
// vidéo : l'uploader à côté de `<nom>-preview.webp`, puis ajouter `<nom>-preview`
// à WEBM_AVAILABLE ci-dessous. Si la vidéo ne charge pas, l'aperçu .webp prend le relais.

import { cld } from './cloudinary'

/** Noms de fichier (sans extension) pour lesquels un .webm est uploadé sur Cloudinary. */
export const WEBM_AVAILABLE = new Set([
  'kokoeat-preview',
  'linkedin-banner-preview',
  'terrasafe-preview',
  'techflow-preview',
  'jean-edy-preview',
  'laverie-preview',
  'tati-preview',
  'newhorizon-preview',
  'universitelesanges-preview',
  'mk-preview',
  'nexura-preview',
  'livreurtrack-preview',
  'moncashjour-preview',
  'elvismarket-preview',
  'monmarket-preview',
])

/** « …/projects/karnet-preview.webp?x » → « karnet-preview » */
function baseName(url) {
  const m = /\/projects\/([^/?#]+?)\.(?:webp|png|jpe?g)(?:[?#].*)?$/i.exec(url || '')
  return m ? m[1] : null
}

/**
 * @returns {{ video: string|null, desktopImg: string, mobileImg: string }}
 */
export function getProjectMedia(project) {
  const desktopImg = project?.img || ''
  const base = baseName(desktopImg)
  const video = base && WEBM_AVAILABLE.has(base) ? cld(`/images/projects/${base}.webm`) : null
  const mobileImg = project?.imgMobile || desktopImg
  return { video, desktopImg, mobileImg }
}

/** Images utilisées par le bandeau défilant (aperçus PC / images mobile). */
export function getMarqueeImages(projects, { mobile = false, limit = 8 } = {}) {
  return projects
    .map((p) => (mobile ? p.imgMobile || p.img : p.img))
    .filter(Boolean)
    .slice(0, limit)
}
