'use client'
import { useEffect, useRef } from 'react'
import Image from 'next/image'

export default function Logo({ size = 48, animate = true, onClick, showTag = true }) {
  const ptsRef = useRef(null)

  const spawn = () => {
    if (!ptsRef.current) return
    const el = ptsRef.current
    const p = document.createElement('div')
    p.style.cssText = `position:absolute;width:2px;height:2px;border-radius:50%;background:#44ffaa;opacity:0;left:${Math.random()*100}%;top:${Math.random()*100}%;--ptx:${((Math.random()-.5)*56).toFixed(0)}px;--pty:${(-(Math.random()*48+6)).toFixed(0)}px;animation:akaParticle 3s ease-in-out forwards;pointer-events:none;`
    el.appendChild(p)
    setTimeout(() => p.remove(), 3200)
  }

  useEffect(() => {
    if (document.getElementById('logo-kf')) return
    const style = document.createElement('style')
    style.id = 'logo-kf'
    style.textContent = `
      @keyframes akaParticle { 0%{opacity:0;transform:translate(0,0) scale(.4)} 20%{opacity:.8} 80%{opacity:.35} 100%{opacity:0;transform:translate(var(--ptx),var(--pty)) scale(0)} }
      @keyframes akaGlowPulse { 0%,100%{filter:drop-shadow(0 0 10px rgba(136,202,83,.5)) brightness(1)} 50%{filter:drop-shadow(0 0 28px rgba(136,202,83,.95)) brightness(1.05)} }
    `
    document.head.appendChild(style)
  }, [])

  // Affichage 2.5× plus grand que le size logique — le logo PNG recadré est carré
  const displaySize = Math.round(size * 2.5)

  return (
    <div
      onClick={onClick}
      onMouseEnter={animate ? spawn : undefined}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        cursor: onClick ? 'pointer' : 'default',
        position: 'relative',
        userSelect: 'none',
        textDecoration: 'none',
      }}
    >
      <div ref={ptsRef} style={{ position: 'absolute', inset: '-20px', pointerEvents: 'none', zIndex: 10 }} />

      {/* Logo — fond transparent natif */}
      <div style={{
        width: displaySize,
        height: displaySize,
        flexShrink: 0,
        position: 'relative',
        animation: animate ? 'akaGlowPulse 3s ease-in-out infinite' : 'none',
      }}>
        <Image
          src="/images/logo.webp"
          alt="AKATech Logo"
          width={displaySize}
          height={displaySize}
          style={{
            objectFit: 'contain',
            width: '100%',
            height: '100%',
          }}
          priority
        />
      </div>
    </div>
  )
}
