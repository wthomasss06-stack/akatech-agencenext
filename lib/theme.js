'use client'
import { createContext, useContext, useState, useEffect } from 'react'
import { flushSync } from 'react-dom'

const ThemeCtx = createContext({ light: false, toggle: () => {} })

export function ThemeProvider({ children }) {
  const [light, setLight] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('akatech-theme')
    if (saved === 'light') { setLight(true); document.body.classList.add('light-mode') }
  }, [])

  const applyTheme = () => {
    setLight(l => {
      const next = !l
      if (next) document.body.classList.add('light-mode')
      else document.body.classList.remove('light-mode')
      localStorage.setItem('akatech-theme', next ? 'light' : 'dark')
      return next
    })
  }

  // Bascule clair/sombre avec un cercle qui se révèle depuis le bouton cliqué
  // (View Transitions API). Si le navigateur ne supporte pas l'API
  // (Firefox notamment), on retombe simplement sur le switch instantané.
  const toggle = (e) => {
    const supported = typeof document !== 'undefined' && document.startViewTransition

    if (!supported) {
      applyTheme()
      return
    }

    const x = e?.clientX ?? window.innerWidth / 2
    const y = e?.clientY ?? window.innerHeight / 2
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    )

    document.documentElement.style.setProperty('--theme-x', `${x}px`)
    document.documentElement.style.setProperty('--theme-y', `${y}px`)
    document.documentElement.style.setProperty('--theme-radius', `${endRadius}px`)

    document.startViewTransition(() => {
      flushSync(() => applyTheme())
    })
  }

  const T = {
    light,
    bg: light ? 'var(--bg-light)' : 'var(--bg-dark)',
    bgAlt: light ? 'var(--bg-light-card)' : 'var(--bg-dark-card)',
    card: light ? 'var(--bg-light-card)' : 'var(--bg-dark-card)',
    textMain: light ? '#111111' : 'rgba(255,255,255,.85)',
    textSub: light ? '#444444' : 'rgba(255,255,255,.5)',
    textMuted: light ? '#888888' : 'rgba(255,255,255,.3)',
    green: light ? '#5f9137' : '#88ca53',
    greenSub: light ? '#15803d' : 'rgba(136,202,83,.6)',
    border: light ? 'rgba(0,0,0,.08)' : 'rgba(136,202,83,.14)',
    border2: light ? 'rgba(22,163,74,.25)' : 'rgba(136,202,83,.28)',
  }

  return <ThemeCtx.Provider value={{ ...T, toggle }}>{children}</ThemeCtx.Provider>
}

export const useTheme = () => useContext(ThemeCtx)
