'use client'
import { useState, useEffect } from 'react'
import AboutClient       from './AboutClient'
import AboutClientMobile from './AboutClientMobile'

export default function AboutResponsive() {
  const [ready, setReady]   = useState(false)
  const [mobile, setMobile] = useState(false)
  useEffect(() => {
    // Le viewport mobile émet des resize lors de l'affichage des barres
    // d'adresse et du clavier. Ne pas remonter la page pendant une interaction.
    const isMobile = typeof window.matchMedia === 'function'
      ? window.matchMedia('(max-width: 1023px)').matches
      : window.innerWidth < 1024
    setMobile(isMobile)
    setReady(true)
  }, [])
  if (!ready) return null
  return mobile ? <AboutClientMobile /> : <AboutClient />
}
