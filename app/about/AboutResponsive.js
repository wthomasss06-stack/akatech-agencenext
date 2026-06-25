'use client'
import { useState, useEffect } from 'react'
import AboutClient       from './AboutClient'
import AboutClientMobile from './AboutClientMobile'

export default function AboutResponsive() {
  const [ready, setReady]   = useState(false)
  const [mobile, setMobile] = useState(false)
  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 1024)
    check(); setReady(true)
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])
  if (!ready) return null
  return mobile ? <AboutClientMobile /> : <AboutClient />
}
