'use client'
/**
 * ExplorerClient — mode Explorer (tunnel des projets).
 * Réservé au desktop (le toggle du header n'apparaît que là) ;
 * sur mobile on affiche une carte de repli plutôt qu'un tunnel
 * WebGL peu adapté au tactile / aux petits écrans et GPU mobiles.
 */
import { useState, useEffect } from 'react'
import TransitionLink from '@/components/layout/TransitionLink'
import ProjectsTunnel from '@/components/explorer/ProjectsTunnel'
import '@/components/explorer/ProjectsTunnel.css'

export default function ExplorerClient() {
  const [ready, setReady] = useState(false)
  const [mobile, setMobile] = useState(false)

  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 1024)
    check()
    setReady(true)
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  if (!ready) return null

  if (mobile) {
    return (
      <div className="pt-mobile-fallback">
        <div className="pt-grid-overlay" />
        <div className="pt-glow" />
        <div className="pt-mobile-card">
          <h2>Mode Explorer</h2>
          <p>Le tunnel 3D des projets est conçu pour le grand écran. Sur mobile, découvrez nos réalisations dans la vue classique.</p>
          <TransitionLink href="/projects">Voir nos réalisations</TransitionLink>
        </div>
      </div>
    )
  }

  return <ProjectsTunnel />
}
