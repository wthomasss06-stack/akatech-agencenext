'use client'
import { useEffect, useRef } from 'react'
import { useTheme } from '@/lib/theme'

export default function Logo({ size = 48, animate = true, onClick, showTag = true }) {
  const ptsRef = useRef(null)
  const T = useTheme()

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
      @keyframes akaGlowPulse { 0%,100%{filter:drop-shadow(0 0 6px rgba(34,200,100,.35))} 50%{filter:drop-shadow(0 0 18px rgba(34,200,100,.75))} }
      @keyframes akaTextIn { from{opacity:0;transform:translateX(-12px)} to{opacity:1;transform:translateX(0)} }
      @keyframes akaFadeSlide { from{opacity:0;transform:translateY(3px)} to{opacity:1;transform:translateY(0)} }
    `
    document.head.appendChild(style)
  }, [])

  const iconBg = T.light
    ? 'linear-gradient(145deg,#edf7ef,#d6edd9)'
    : 'linear-gradient(145deg,#0a1a0e,#0d2415)'
  const iconBorder = T.light ? 'rgba(22,163,74,.3)' : 'rgba(34,200,100,.28)'
  const nameColor = T.light ? '#0d1f0f' : 'rgba(255,255,255,.92)'
  const tagColor  = T.light ? '#16a34a' : 'rgba(34,200,100,.7)'

  return (
    <div
      onClick={onClick}
      onMouseEnter={animate ? spawn : undefined}
      style={{ display:'inline-flex', alignItems:'center', gap:'.55rem', cursor: onClick ? 'pointer' : 'default', position:'relative', userSelect:'none', textDecoration:'none' }}
    >
      <div ref={ptsRef} style={{ position:'absolute', inset:'-20px', pointerEvents:'none', zIndex:10 }} />

      {/* Icon */}
      <div style={{
        width: size, height: size,
        borderRadius: size * .25,
        background: iconBg,
        border: `1px solid ${iconBorder}`,
        boxShadow: T.light
          ? '0 2px 10px rgba(22,163,74,.18), inset 0 1px 0 rgba(255,255,255,.8)'
          : '4px 4px 14px rgba(0,0,0,.5), -2px -2px 6px rgba(34,200,100,.06)',
        display:'flex', alignItems:'center', justifyContent:'center',
        flexShrink: 0,
        animation: animate ? 'akaGlowPulse 3s ease-in-out infinite' : 'none',
        transition: 'background .35s, box-shadow .35s',
      }}>
        <svg width={size*.6} height={size*.6} viewBox="0 0 28 28" fill="none">
          <path d="M6 22 L14 6 L22 22" stroke="#22c864" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M9.5 17 L18.5 17" stroke="#22c864" strokeWidth="2" strokeLinecap="round"/>
          <circle cx="22" cy="8" r="3" fill="rgba(34,200,100,.2)" stroke="#22c864" strokeWidth="1.4"/>
          <circle cx="22" cy="8" r="1.3" fill="#22c864"/>
        </svg>
      </div>

      {/* Text */}
      <div>
        <div style={{ fontFamily:"'Orbitron',sans-serif", fontWeight:900, fontSize:size*.28, color:nameColor, letterSpacing:'.04em', lineHeight:1.1, animation:'akaTextIn .5s ease forwards', transition:'color .35s' }}>
          AKATech
        </div>
        {showTag && (
          <div style={{ fontFamily:"'Syne',sans-serif", fontSize:size*.145, color:tagColor, letterSpacing:'.1em', textTransform:'uppercase', marginTop:3, animation:'akaFadeSlide .6s .15s ease both', transition:'color .35s' }}>
            Agence · Abidjan
          </div>
        )}
      </div>
    </div>
  )
}
