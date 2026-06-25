'use client'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

/**
 * ScrollToTop — remonte en haut de page à chaque changement de route.
 * À placer une seule fois dans RootLayout, à l'intérieur de <body>.
 * Ne rend rien visuellement.
 */
export default function ScrollToTop() {
  const pathname = usePathname()

  useEffect(() => {
    // instant — pas de smooth pour éviter le conflit avec
    // les animations d'entrée de page (hero, AuroraHero, etc.)
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname])

  return null
}
