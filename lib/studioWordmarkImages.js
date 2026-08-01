// lib/studioWordmarkImages.js
// Pools d'images PAR LETTRE pour le survol du wordmark géant « AKATECH STUDIO. »
// (components/layout/Footer.js, composant StudioWordmark). Même principe que
// CHEZ_FLORENCE_LETTER_IMAGES (lib/chezFlorenceLetters.ts) — une lettre survolée
// affiche une image de SA lettre — mais généralisé à PLUSIEURS variantes par
// lettre au lieu d'une seule fixe : le dossier fournit plusieurs images par
// lettre (ex. 9 pour A), une est tirée au hasard à chaque nouveau survol —
// wireHoverImageCharsByLetter (lib/hoverImageChars.js) gère ce tirage.
//
// Regroupement : chaque fichier dont le nom est une même lettre répétée (ex.
// 'AAAAAAA.webp', casse ignorée) rejoint le pool de cette lettre. Les 3 fichiers
// qui ne suivent pas ce schéma (CASQ.webp, ORDI.webp, PC.webp) sont réservés au
// point final de « STUDIO. » (clé '.') — comme demandé, pas mélangés aux pools
// C/O/P (« AKATECH STUDIO » ne contient d'ailleurs pas de P).
//
// Liste générée depuis le contenu réel de public/images/AKATECH STUDIO/, pas
// tapée à la main — 53 fichiers, tous casés (aucun fichier orphelin).
//
// Servies via Cloudinary (cld()), comme le reste des images du site — upload
// confirmé (npm run upload-images, 145/145, 0 échec).

import { cld } from './cloudinary'

const cloudPath = (name) => cld(`/images/AKATECH STUDIO/${name}`)

export const STUDIO_LETTER_IMAGE_POOLS = {
  A: [cloudPath('A.webp'), cloudPath('AA.webp'), cloudPath('AAAAA.webp'), cloudPath('AAAAAA.webp'), cloudPath('AAAAAAA.webp'), cloudPath('AAAAAAAAA.webp'), cloudPath('AAAAAAAAAA.webp'), cloudPath('AAAAAAAAAAAA.webp'), cloudPath('aaaaaaaa.webp')],
  C: [cloudPath('CC.webp'), cloudPath('CCC.webp'), cloudPath('CCCCC.webp'), cloudPath('CCCCCC.webp'), cloudPath('CCCCCCCCC.webp')],
  D: [cloudPath('D.webp'), cloudPath('DDDDDDD.webp')],
  E: [cloudPath('EEEE.webp'), cloudPath('EEEEEEEE.webp'), cloudPath('EEEEEEEEEE.webp')],
  H: [cloudPath('HHH.webp'), cloudPath('HHHH.webp'), cloudPath('HHHHH.webp'), cloudPath('HHHHHH.webp')],
  I: [cloudPath('I.webp'), cloudPath('III.webp'), cloudPath('IIIII.webp'), cloudPath('IIIIIIII.webp')],
  K: [cloudPath('KK.webp'), cloudPath('KKKKK.webp'), cloudPath('KKKKKK.webp'), cloudPath('KKKKKKK.webp'), cloudPath('KKKKKKKKKK.webp')],
  N: [cloudPath('NN.webp')],
  O: [cloudPath('OOO.webp'), cloudPath('OOOOOOO.webp'), cloudPath('OOOOOOOOOO.webp')],
  Q: [cloudPath('QQQ.webp')],
  S: [cloudPath('S.webp'), cloudPath('SSS.webp'), cloudPath('SSSS.webp'), cloudPath('SSSSSSS.webp')],
  T: [cloudPath('T.webp'), cloudPath('TT.webp'), cloudPath('TTT.webp'), cloudPath('TTTT.webp'), cloudPath('TTTTTTT.webp'), cloudPath('TTTTTTTTT.webp')],
  U: [cloudPath('U.webp'), cloudPath('UUUUUUU.webp')],
  Y: [cloudPath('YYYY.webp')],
  '.': [cloudPath('CASQ.webp'), cloudPath('ORDI.webp'), cloudPath('PC.webp')],
}
