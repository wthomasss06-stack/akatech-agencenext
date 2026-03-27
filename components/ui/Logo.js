'use client'
import { useState, useRef, useEffect } from 'react'

export default function Logo({ size = 48, animate = true, onClick, showTag = true }) {
  const ptsRef = useRef(null)

  const spawn = () => {
    if (!ptsRef.current) return
    const el = ptsRef.current
    const p = document.createElement('div')
    p.style.cssText = `position:absolute;width:2px;height:2px;border-radius:50%;background:#44ffaa;opacity:0;left:${Math.random() * 100}%;top:${Math.random() * 100}%;--ptx:${((Math.random() - .5) * 56).toFixed(0)}px;--pty:${(-(Math.random() * 48 + 6)).toFixed(0)}px;animation:akaParticle 3s ease-in-out forwards;`
    el.appendChild(p)
    setTimeout(() => p.remove(), 3200)
  }

  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      @keyframes akaParticle { 0%{opacity:0;transform:translate(0,0) scale(.4)} 20%{opacity:.8} 80%{opacity:.35} 100%{opacity:0;transform:translate(var(--ptx),var(--pty)) scale(0)} }
      @keyframes akaGlowPulse { 0%,100%{filter:drop-shadow(0 0 7px rgba(34,200,100,.4))} 50%{filter:drop-shadow(0 0 18px rgba(34,200,100,.8))} }
      @keyframes akaTextIn { from{opacity:0;transform:translateX(-14px)} to{opacity:1;transform:translateX(0)} }
      @keyframes akaLineExpand { from{transform:scaleX(0);opacity:0} to{transform:scaleX(1);opacity:1} }
      @keyframes akaFadeSlide { from{opacity:0;transform:translateY(3px)} to{opacity:1;transform:translateY(0)} }
    `
    document.head.appendChild(style)
    return () => style.remove()
  }, [])

  return (
    <div
      onClick={onClick}
      onMouseEnter={animate ? () => setInterval(spawn, 500) : undefined}
      style={{ display: 'inline-flex', alignItems: 'center', gap: '.6rem', cursor: onClick ? 'pointer' : 'default', position: 'relative', userSelect: 'none' }}
    >
      <div ref={ptsRef} style={{ position: 'absolute', inset: '-20px', pointerEvents: 'none', zIndex: 10 }} />
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none" style={{ animation: animate ? 'akaGlowPulse 3s ease-in-out infinite' : 'none' }}>
        <rect width="48" height="48" rx="12" fill="url(#logoGrad)" />
        <defs>
          <linearGradient id="logoGrad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0a1a0e" />
            <stop offset="1" stopColor="#0d2415" />
          </linearGradient>
        </defs>
        <path d="M14 34 L24 14 L34 34" stroke="#22c864" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M18 28 L30 28" stroke="#22c864" strokeWidth="2.2" strokeLinecap="round" />
        <circle cx="36" cy="16" r="3.5" fill="rgba(34,200,100,.2)" stroke="#22c864" strokeWidth="1.5" />
        <circle cx="36" cy="16" r="1.5" fill="#22c864" />
      </svg>
      <div>
        <div style={{ fontFamily: "'Orbitron',sans-serif", fontWeight: 900, fontSize: size * .28, color: '#fff', letterSpacing: '.04em', lineHeight: 1, animation: 'akaTextIn .6s ease forwards' }}>
          AKATech
        </div>
        {showTag && (
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: size * .14, color: 'rgba(34,200,100,.7)', letterSpacing: '.1em', textTransform: 'uppercase', marginTop: 2, animation: 'akaFadeSlide .7s .2s ease both' }}>
            Agence · Abidjan
          </div>
        )}
      </div>
    </div>
  )
}
