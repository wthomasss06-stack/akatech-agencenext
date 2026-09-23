'use client'
import { useState, useEffect } from 'react'
import ServicesClient       from './ServicesClients'
import ServicesClientMobile from './ServicesClientMobile'

export default function ServicesResponsive() {
  const [ready, setReady]   = useState(false)
  const [mobile, setMobile] = useState(false)
  useEffect(() => {
    // Le viewport mobile émet des resize lors de l'affichage des barres
    // d'adresse et du clavier. Ne pas remonter la page pendant une interaction.
    setMobile(window.matchMedia('(max-width: 1023px)').matches)
    setReady(true)
  }, [])
  if (!ready) return null
  return mobile ? <ServicesClientMobile /> : <ServicesClient />
}
