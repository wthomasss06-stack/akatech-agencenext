// lib/lenis-instance.js
// Référence partagée à l'instance Lenis active (créée par components/ui/SmoothScroll.js,
// uniquement sur la page d'accueil). Permet aux autres composants de défiler « avec »
// Lenis quand il est actif, et normalement sinon.

let instance = null

export function setLenis(lenis) {
  instance = lenis || null
}

export function getLenis() {
  return instance
}

/** Remonte en haut de page : via Lenis s'il est actif, sinon défilement natif fluide. */
export function scrollToTop() {
  if (instance) {
    instance.scrollTo(0, { duration: 1.2 })
  } else if (typeof window !== 'undefined') {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}
