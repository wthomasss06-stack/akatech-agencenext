'use client'
import { useState, useEffect } from 'react'
import ProjectsClient       from './ProjectsClient'
import ProjectsClientMobile from './ProjectsClientMobile'

export default function ProjectsResponsive() {
  const [ready, setReady]   = useState(false)
  const [mobile, setMobile] = useState(false)
  useEffect(() => {
    // Le viewport mobile émet des resize lors de l'affichage des barres
    // d'adresse et du clavier. Ne pas remonter la page pendant une interaction.
    setMobile(window.matchMedia('(max-width: 1023px)').matches)
    setReady(true)
  }, [])
  if (!ready) return null
  return mobile ? <ProjectsClientMobile /> : <ProjectsClient />
}
