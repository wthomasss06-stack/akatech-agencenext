'use client'
import { useEffect } from 'react'

export default function RegisterSW() {
  useEffect(() => {
    // En dev Next.js, le SW n'est pas servi — on ignore silencieusement
    // En prod (next build + export statique), le SW sera dans /out/sw.js
    if (typeof window === 'undefined') return
    if (!('serviceWorker' in navigator)) return

    // Délai court pour laisser la page se stabiliser
    const t = setTimeout(() => {
      navigator.serviceWorker
        .register('/sw.js', { scope: '/' })
        .then((reg) => {
          if (process.env.NODE_ENV === 'development') return
          console.log('[AKATech PWA] SW actif:', reg.scope)
        })
        .catch(() => {
          // Silencieux en dev — normal que le SW ne soit pas dispo
        })
    }, 1000)

    return () => clearTimeout(t)
  }, [])

  return null
}
