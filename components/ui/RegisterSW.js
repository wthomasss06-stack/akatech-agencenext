'use client'
import { useEffect, useState } from 'react'
import { Download, X } from 'lucide-react'

/* ═══════════════════════════════════════════════════════
   RegisterSW — Service Worker + Auto-install PWA
   - Enregistre le SW en production
   - Capture beforeinstallprompt et installe automatiquement
   - Affiche un toast discret si l'install est disponible
   ═══════════════════════════════════════════════════════ */

let deferredPrompt = null

export function triggerPWAInstall() {
  if (deferredPrompt) {
    deferredPrompt.prompt()
    deferredPrompt.userChoice.then(() => { deferredPrompt = null })
    return true
  }
  return false
}

export default function RegisterSW() {
  const [showToast, setShowToast] = useState(false)
  const [installed, setInstalled] = useState(false)

  useEffect(() => {
    // ── Service Worker ──
    if ('serviceWorker' in navigator) {
      if (process.env.NODE_ENV !== 'production') {
        navigator.serviceWorker.getRegistrations().then(regs => {
          regs.forEach(reg => reg.unregister())
        })
      } else {
        setTimeout(() => {
          navigator.serviceWorker
            .register('/sw.js', { scope: '/' })
            .catch(() => {})
        }, 1000)
      }
    }

    // ── Déjà installée ? ──
    if (window.matchMedia('(display-mode: standalone)').matches) return
    if (window.navigator.standalone === true) return

    // ── Capture beforeinstallprompt ──
    const onPrompt = (e) => {
      e.preventDefault()
      deferredPrompt = e

      // Tentative d'install automatique après 3s de navigation
      const autoTimer = setTimeout(async () => {
        if (!deferredPrompt) return
        try {
          deferredPrompt.prompt()
          const { outcome } = await deferredPrompt.userChoice
          if (outcome === 'accepted') {
            setInstalled(true)
          } else {
            // Si refusé, montrer le toast discret
            setShowToast(true)
          }
          deferredPrompt = null
        } catch {
          // Si l'auto-prompt échoue (iOS, restrictions), montrer le toast
          setShowToast(true)
        }
      }, 3000)

      return () => clearTimeout(autoTimer)
    }

    // ── App installée ──
    const onInstalled = () => {
      setInstalled(true)
      setShowToast(false)
      deferredPrompt = null
    }

    window.addEventListener('beforeinstallprompt', onPrompt)
    window.addEventListener('appinstalled', onInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  if (installed || !showToast) return null

  return (
    <div
      style={{
        position: 'fixed', bottom: '5rem', right: '1.2rem', zIndex: 9999,
        display: 'flex', alignItems: 'center', gap: '.7rem',
        padding: '.7rem 1rem',
        borderRadius: 14,
        background: 'rgba(6,14,9,.95)',
        border: '1px solid rgba(34,200,100,.35)',
        backdropFilter: 'blur(14px)',
        boxShadow: '0 0 30px rgba(34,200,100,.15), 0 8px 32px rgba(0,0,0,.5)',
        animation: 'fadeUp .4s ease forwards',
        maxWidth: 280,
      }}
    >
      <div style={{
        width: 34, height: 34, borderRadius: 10, flexShrink: 0,
        background: 'rgba(34,200,100,.15)', border: '1px solid rgba(34,200,100,.3)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Download size={16} style={{ color: '#22c864' }} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: "'Syne',sans-serif", fontSize: '.72rem', fontWeight: 700, color: 'rgba(255,255,255,.9)', marginBottom: '.1rem' }}>
          Installer AKATech
        </div>
        <div style={{ fontFamily: "'Syne',sans-serif", fontSize: '.6rem', color: 'rgba(255,255,255,.45)' }}>
          Accès rapide depuis votre écran
        </div>
      </div>
      <button
        onClick={() => { triggerPWAInstall(); setShowToast(false) }}
        style={{
          padding: '.35rem .75rem', borderRadius: 8, border: 'none',
          background: 'linear-gradient(145deg,#27d570,#1aa355)',
          color: '#fff', fontFamily: "'Syne',sans-serif",
          fontSize: '.65rem', fontWeight: 700, cursor: 'pointer',
          flexShrink: 0,
        }}
      >
        Installer
      </button>
      <button
        onClick={() => setShowToast(false)}
        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '.2rem', flexShrink: 0, color: 'rgba(255,255,255,.3)' }}
      >
        <X size={14} />
      </button>
    </div>
  )
}
