'use client'
import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'

/**
 * Charge UNIQUEMENT le bon composant selon la largeur d'écran.
 * Aucun conflit webpack — un seul chunk chargé à la fois.
 */
export default function ResponsiveLoader({ desktopPath, mobilePath }) {
  const [comp, setComp] = useState(null)

  useEffect(() => {
    const load = async () => {
      const isMobile = window.innerWidth < 1024
      const mod = await import(/* webpackIgnore: true */ isMobile ? mobilePath : desktopPath)
      setComp(() => mod.default)
    }
    load()

    const handler = () => {
      const isMobile = window.innerWidth < 1024
      import(/* webpackIgnore: true */ isMobile ? mobilePath : desktopPath)
        .then(mod => setComp(() => mod.default))
    }
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [desktopPath, mobilePath])

  if (!comp) return null
  const Comp = comp
  return <Comp />
}
