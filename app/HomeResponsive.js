'use client'
import { useState, useEffect } from 'react'
import HomeClientDesktop from './HomeClientDesktop'
import HomeClientMobile  from './HomeClientMobile'

export default function HomeResponsive() {
  const [ready, setReady]   = useState(false)
  const [mobile, setMobile] = useState(false)

  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 1024)
    check()
    setReady(true)
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // Avant hydratation → rien (évite flash + conflit useScroll)
  if (!ready) return null

  return mobile ? <HomeClientMobile /> : <HomeClientDesktop />
}
