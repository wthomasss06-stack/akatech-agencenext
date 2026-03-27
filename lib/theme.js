'use client'
import { createContext, useContext, useState, useEffect } from 'react'

const ThemeCtx = createContext({ light: false, toggle: () => {} })

export function ThemeProvider({ children }) {
  const [light, setLight] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('akatech-theme')
    if (saved === 'light') { setLight(true); document.body.classList.add('light-mode') }
  }, [])

  const toggle = () => {
    setLight(l => {
      const next = !l
      if (next) document.body.classList.add('light-mode')
      else document.body.classList.remove('light-mode')
      localStorage.setItem('akatech-theme', next ? 'light' : 'dark')
      return next
    })
  }

  const T = {
    light,
    bg: light ? '#f8f8f8' : '#060e09',
    bgAlt: light ? '#ffffff' : '#030806',
    card: light ? '#ffffff' : 'linear-gradient(145deg,#0e2016,#0b1a10)',
    textMain: light ? '#111111' : 'rgba(255,255,255,.85)',
    textSub: light ? '#444444' : 'rgba(255,255,255,.5)',
    textMuted: light ? '#888888' : 'rgba(255,255,255,.3)',
    green: light ? '#16a34a' : '#22c864',
    greenSub: light ? '#15803d' : 'rgba(34,200,100,.6)',
    border: light ? 'rgba(0,0,0,.08)' : 'rgba(34,200,100,.14)',
    border2: light ? 'rgba(22,163,74,.25)' : 'rgba(34,200,100,.28)',
  }

  return <ThemeCtx.Provider value={{ ...T, toggle }}>{children}</ThemeCtx.Provider>
}

export const useTheme = () => useContext(ThemeCtx)
