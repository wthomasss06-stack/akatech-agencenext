'use client'
/**
 * ExplorerClient — mode Explorer (tunnel des projets).
 * Réservé au desktop (le toggle du header n'apparaît que là) ;
 * sur mobile on affiche une carte de repli plutôt qu'un tunnel
 * WebGL peu adapté au tactile / aux petits écrans et GPU mobiles.
 * Même repli si l'utilisateur a activé "réduire les animations"
 * (prefers-reduced-motion) : le tunnel est un défilement 3D piloté
 * par le scroll, exactement le type d'effet que ce réglage cible.
 */
import { useState, useEffect } from 'react'
import TransitionLink from '@/components/layout/TransitionLink'
import ProjectsTunnel from '@/components/explorer/ProjectsTunnel'
import '@/components/explorer/ProjectsTunnel.css'

export default function ExplorerClient() {
  const [ready, setReady] = useState(false)
  const [mobile, setMobile] = useState(false)
  const [reduceMotion, setReduceMotion] = useState(false)

  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 1024)
    check()
    window.addEventListener('resize', check)

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduceMotion(mq.matches)
    const onChange = (e) => setReduceMotion(e.matches)
    mq.addEventListener('change', onChange)

    setReady(true)
    return () => {
      window.removeEventListener('resize', check)
      mq.removeEventListener('change', onChange)
    }
  }, [])

  if (!ready) return null

  if (mobile || reduceMotion) {
    return (
      <div className="pt-mobile-fallback">
        <div className="pt-grid-overlay" />
        <div className="pt-glow" />
        <div className="pt-mobile-card">
          <h2>Mode Explorer</h2>
          <p>
            {!mobile && reduceMotion
              ? "Le tunnel 3D utilise un défilement immersif que ton système est réglé pour limiter. Découvre nos réalisations dans la vue classique."
              : "Le tunnel 3D des projets est conçu pour le grand écran. Sur mobile, découvrez nos réalisations dans la vue classique."}
          </p>
          <TransitionLink href="/projects">Voir nos réalisations</TransitionLink>
        </div>
      </div>
    )
  }

  return <ProjectsTunnel />
}

