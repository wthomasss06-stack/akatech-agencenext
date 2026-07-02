'use client'

import { useEffect } from 'react'

export default function RegisterSW() {
  useEffect(() => {
    if ('serviceWorker' in navigator && window.location.protocol !== 'file:') {
      const onLoad = () => {
        navigator.serviceWorker.register('/sw.js')
          .then(() => console.log('Service Worker registered'))
          .catch((error) => console.error('Service Worker registration failed:', error))
      }

      window.addEventListener('load', onLoad)
      return () => window.removeEventListener('load', onLoad)
    }
    return undefined
  }, [])

  return null
}
