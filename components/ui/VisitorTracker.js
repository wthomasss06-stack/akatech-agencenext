'use client'
import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { readConsent } from '@/lib/cookie-consent'
import { sanitizeUtmValue } from '@/lib/geo'

// Balise d'un lien partagé (?utm_source=whatsapp&utm_medium=social&utm_campaign=…). Un partage
// WhatsApp n'envoie aucun referrer : c'est la seule façon de savoir d'où vient la visite.
// Valeurs normalisées ici et revérifiées par le serveur ; sans utm_source, rien n'est envoyé.
function readUtm() {
  try {
    const params = new URLSearchParams(window.location.search)
    const source = sanitizeUtmValue(params.get('utm_source'))
    if (!source) return null
    return {
      source,
      medium: sanitizeUtmValue(params.get('utm_medium')),
      campaign: sanitizeUtmValue(params.get('utm_campaign')),
    }
  } catch {
    return null
  }
}

/* Signale chaque page vue à /api/track. Ne pose aucun cookie lui-même
   (déjà fait par middleware.js) — se contente de dire au serveur
   "cette page a été vue par ce visiteur/session". N'affiche rien. */
export default function VisitorTracker() {
  const pathname = usePathname()
  const lastSent = useRef(null)

  useEffect(() => {
    if (!pathname || lastSent.current === pathname) return
    lastSent.current = pathname
    const consent = readConsent()?.status
    const utm = readUtm()

    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // Le choix de cookies déjà enregistré (localStorage) accompagne chaque page vue :
      // un visiteur qui a accepté une fois est reconnu à chaque nouvelle session,
      // sans que la bannière réapparaisse. Rien n'est envoyé s'il n'a pas encore choisi.
      body: JSON.stringify({
        path: pathname,
        referrer: document.referrer || null,
        ...(consent ? { consent } : {}),
        ...(utm ? { utm } : {}),
      }),
      keepalive: true,
    }).catch(() => {
      // Le tracking est un bonus — un échec réseau ne doit jamais
      // remonter d'erreur visible au visiteur.
    })
  }, [pathname])

  return null
}
