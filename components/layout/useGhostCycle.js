'use client'
import { useCallback, useRef, useState } from 'react'
import { gsap } from 'gsap'

/* ═══════════════════════════════════════════════
   useGhostCycle — texte qui scramble puis se résout,
   joué dans une pile de lignes (overflow:hidden) qui
   glisse en yPercent jusqu'à atterrir sur le texte réel.
   Mécanique partagée entre StaggeredMenu (mobile) et
   CardNav (desktop) pour un effet de survol identique
   sur toute la navigation du site.
   ═══════════════════════════════════════════════ */

const GHOST_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#+*/=<>'

function ghostScramble(text) {
  return text.split('').map(ch =>
    /[a-zA-Z0-9]/.test(ch)
      ? GHOST_CHARS[Math.floor(Math.random() * GHOST_CHARS.length)]
      : ch
  ).join('')
}

export function buildGhostSeq(text, cycles = 3) {
  const seq = [ghostScramble(text)]
  for (let i = 0; i < cycles; i++) seq.push(ghostScramble(text))
  seq.push(text, text)
  return seq
}

export function useGhostCycle(text) {
  const innerRef = useRef(null)
  const tweenRef = useRef(null)
  const [lines, setLines] = useState([text])

  const play = useCallback(() => {
    if (!text) return
    tweenRef.current?.kill()
    const seq = buildGhostSeq(text, 3)
    setLines(seq)
    requestAnimationFrame(() => {
      const inner = innerRef.current
      if (!inner) return
      gsap.set(inner, { yPercent: 0 })
      const finalShift = ((seq.length - 1) / seq.length) * 100
      tweenRef.current = gsap.to(inner, {
        yPercent: -finalShift,
        duration: 0.42 + seq.length * 0.055,
        ease: 'power4.out',
        overwrite: 'auto',
      })
    })
  }, [text])

  return { innerRef, lines, play }
}
