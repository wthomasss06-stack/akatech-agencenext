'use client'
import { useEffect } from 'react'

export default function RegisterSW() {
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!('serviceWorker' in navigator)) return

    // ⚠️ Ne jamais enregistrer le SW en développement local
    if (process.env.NODE_ENV !== 'production') {
      // Désinscrire tout SW existant pour éviter le chargement infini
      navigator.serviceWorker.getRegistrations().then(regs => {
        regs.forEach(reg => reg.unregister())
      })
      return
    }

    const t = setTimeout(() => {
      navigator.serviceWorker
        .register('/sw.js', { scope: '/' })
        .then(reg => console.log('[AKATech PWA] SW actif:', reg.scope))
        .catch(() => {})
    }, 1000)

    return () => clearTimeout(t)
  }, [])

  return null
}
