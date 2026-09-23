'use client'
import { useState, useEffect } from 'react'
import HomeClientDesktop from './HomeClientDesktop'
import HomeClientMobile  from './HomeClientMobile'

export default function HomeResponsive() {
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

  // Avant hydratation → rien (évite flash + conflit useScroll)
  if (!ready) return null

  return mobile ? <HomeClientMobile /> : <HomeClientDesktop />
}
