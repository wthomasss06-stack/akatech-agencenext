'use client'
import { useState, useEffect } from 'react'
import ContactClient       from './ContactClient'
import ContactClientMobile from './ContactClientMobile'

export default function ContactResponsive() {
  const [ready, setReady]   = useState(false)
  const [mobile, setMobile] = useState(false)
  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 1024)
    check(); setReady(true)
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])
  if (!ready) return null
  return mobile ? <ContactClientMobile /> : <ContactClient />
}
