'use client'
// Défilement fluide Lenis — monté uniquement sur la page d'accueil (app/HomeResponsive.js),
// version desktop ET mobile. Les autres pages gardent le défilement natif.
import { useEffect } from 'react'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { setLenis } from '@/lib/lenis-instance'

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger)

// Mettre à false pour retrouver le défilement tactile natif sur mobile (Lenis resterait
// actif sur ordinateur). Utile si le rendu sur un téléphone précis ne convient pas.
export const SMOOTH_TOUCH = true

/** Réglages Lenis : molette lissée partout ; sur écran tactile, le geste est lui aussi lissé. */
export function buildLenisOptions({ touch = false, smoothTouch = SMOOTH_TOUCH } = {}) {
  return {
    lerp: 0.1,
    smoothWheel: true,
    wheelMultiplier: 1,
    autoRaf: false, // c'est le ticker GSAP qui pilote Lenis (voir plus bas)
    ...(touch && smoothTouch ? { syncTouch: true, syncTouchLerp: 0.075, touchInertiaExponent: 1.7, touchMultiplier: 1 } : {}),
  }
}

// Menu plein écran, modales… verrouillent le défilement avec `overflow: hidden` posé sur
// <body> ou <html>. Lenis, lui, défile par script : sans cette synchronisation, la page
// continuerait de bouger derrière le menu ouvert.
const isScrollLocked = () => {
  const locked = (el) => ['hidden', 'clip'].includes(el?.style?.overflow) || ['hidden', 'clip'].includes(el?.style?.overflowY)
  return locked(document.body) || locked(document.documentElement)
}

export default function SmoothScroll() {
  useEffect(() => {
    // Personnes qui demandent moins d'animations : défilement natif, sans Lenis.
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return undefined

    const touch = Boolean(window.matchMedia?.('(pointer: coarse)').matches)
    const lenis = new Lenis(buildLenisOptions({ touch }))
    setLenis(lenis)

    // Intégration officielle GSAP ↔ Lenis : les ScrollTrigger (scrub du hero, parallaxes)
    // lisent la position lissée, et Lenis avance au rythme du ticker GSAP.
    lenis.on('scroll', ScrollTrigger.update)
    const raf = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)

    const syncLock = () => (isScrollLocked() ? lenis.stop() : lenis.start())
    syncLock()
    const observer = new MutationObserver(syncLock)
    observer.observe(document.body, { attributes: true, attributeFilter: ['style'] })
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['style'] })

    return () => {
      observer.disconnect()
      gsap.ticker.remove(raf)
      gsap.ticker.lagSmoothing(500, 33) // valeurs par défaut de GSAP, pour les autres pages
      lenis.off('scroll', ScrollTrigger.update)
      lenis.destroy()
      setLenis(null)
    }
  }, [])

  return null
}
