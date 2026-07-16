'use client'
import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

/* Signale chaque page vue à /api/track. Ne pose aucun cookie lui-même
   (déjà fait par middleware.js) — se contente de dire au serveur
   "cette page a été vue par ce visiteur/session". N'affiche rien. */
export default function VisitorTracker() {
  const pathname = usePathname()
  const lastSent = useRef(null)

  useEffect(() => {
    if (!pathname || lastSent.current === pathname) return
    lastSent.current = pathname

    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: pathname, referrer: document.referrer || null }),
      keepalive: true,
    }).catch(() => {
      // Le tracking est un bonus — un échec réseau ne doit jamais
      // remonter d'erreur visible au visiteur.
    })
  }, [pathname])

  return null
}
