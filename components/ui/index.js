'use client'
import { useRef, useEffect, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { useTheme } from '@/lib/theme'

// ── LASER BEAM ───────────────────────────────────────────────
// position: 'left' | 'center' | 'right'  (défaut 'right')
// intensity: 'subtle' | 'medium' | 'strong' (défaut 'medium')
export function LaserBeam({ position = 'right', intensity = 'medium', style = {} }) {
  const posMap = {
    left:   { left: '18%',  right: 'auto' },
    center: { left: '50%',  right: 'auto', transform: 'translateX(-50%)' },
    right:  { right: '22%', left:  'auto' },
  }
  const opacityMap = { subtle: .55, medium: .8, strong: 1 }
  const glowMap    = { subtle: 80,  medium: 130, strong: 200 }

  return (
    <div aria-hidden style={{
      position: 'absolute',
      top: '-40px',
      ...posMap[position],
      width: 2,
      height: '65%',
      zIndex: 2,
      pointerEvents: 'none',
      opacity: opacityMap[intensity],
      animation: 'laserPulse 3.2s ease-in-out infinite',
      ...style,
    }}>
      {/* beam core */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to bottom, transparent 0%, #22c864 20%, #aaffd4 45%, #22c864 70%, transparent 100%)',
        borderRadius: 2,
        filter: 'blur(0.4px)',
      }} />
      {/* outer glow */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: glowMap[intensity],
        height: '100%',
        background: 'linear-gradient(to bottom, transparent, rgba(34,200,100,.22) 30%, rgba(34,200,100,.22) 65%, transparent)',
        filter: 'blur(28px)',
        borderRadius: '50%',
      }} />
      {/* tip spark */}
      <div style={{
        position: 'absolute',
        top: '18%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 6,
        height: 6,
        borderRadius: '50%',
        background: '#aaffd4',
        boxShadow: '0 0 12px 4px rgba(34,200,100,.7), 0 0 28px 10px rgba(34,200,100,.3)',
        animation: 'laserSpark 3.2s ease-in-out infinite',
      }} />
    </div>
  )
}

// ── SECTION EYE ──────────────────────────────────────────────
export function SectionEye({ label, center }) {
  return (
    <div style={{ display: 'flex', justifyContent: center ? 'center' : 'flex-start', marginBottom: '.8rem' }}>
      <span className="s-eye">{label}</span>
    </div>
  )
}

// ── ANIMATED COUNTER ─────────────────────────────────────────
export function AnimatedCounter({ target, suffix = '', duration = 1800 }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView) return
    let start = 0
    const steps = 60
    const inc = target / steps
    const timer = setInterval(() => {
      start += inc
      if (start >= target) { setCount(target); clearInterval(timer) }
      else setCount(Math.floor(start))
    }, duration / steps)
    return () => clearInterval(timer)
  }, [inView, target, duration])

  return <span ref={ref}>{count}{suffix}</span>
}

// ── LAZY IMAGE ───────────────────────────────────────────────
export function LazyImg({ src, alt, style, className, placeholder }) {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', ...(!loaded && !error ? { background: 'linear-gradient(135deg,#0a1a0e,#060e09)' } : {}) }}>
      {!loaded && !error && (
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg,#0a1a0e 0%,#0e2416 40%,#0a1a0e 80%)', backgroundSize: '200% 100%', animation: 'shimmer 1.6s ease-in-out infinite' }} />
      )}
      {!error && (
        <img src={src} alt={alt || ''} loading="lazy" decoding="async" className={className}
          style={{ ...style, opacity: loaded ? 1 : 0, transition: 'opacity .4s ease' }}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
        />
      )}
      {error && placeholder}
    </div>
  )
}

// ── MICRO CURSOR ─────────────────────────────────────────────
export function MicroCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 })
  const [visible, setVisible] = useState(false)
  const [clicking, setClicking] = useState(false)
  const [hovering, setHovering] = useState(false)

  useEffect(() => {
    const move = (e) => { setPos({ x: e.clientX, y: e.clientY }); setVisible(true) }
    const leave = () => setVisible(false)
    const down = () => setClicking(true)
    const up = () => setClicking(false)

    const checkHover = (e) => {
      const el = e.target
      setHovering(el.closest('a,button,[role=button]') !== null)
    }

    document.addEventListener('mousemove', move)
    document.addEventListener('mousemove', checkHover)
    document.addEventListener('mouseleave', leave)
    document.addEventListener('mousedown', down)
    document.addEventListener('mouseup', up)
    return () => {
      document.removeEventListener('mousemove', move)
      document.removeEventListener('mousemove', checkHover)
      document.removeEventListener('mouseleave', leave)
      document.removeEventListener('mousedown', down)
      document.removeEventListener('mouseup', up)
    }
  }, [])

  return (
    <div
      style={{
        position: 'fixed',
        left: pos.x - (hovering ? 18 : 4),
        top: pos.y - (hovering ? 18 : 4),
        width: hovering ? 36 : 8,
        height: hovering ? 36 : 8,
        borderRadius: '50%',
        background: hovering ? 'transparent' : '#22c864',
        border: hovering ? '2px solid rgba(34,200,100,.6)' : 'none',
        boxShadow: hovering ? '0 0 14px rgba(34,200,100,.3)' : '0 0 8px rgba(34,200,100,.7)',
        pointerEvents: 'none',
        zIndex: 99999,
        transition: 'width .2s, height .2s, left .05s, top .05s, background .2s',
        opacity: visible ? (clicking ? .5 : 1) : 0,
        transform: clicking ? 'scale(.7)' : 'scale(1)',
      }}
    />
  )
}

// ── BACK TO TOP ──────────────────────────────────────────────
export function BackToTop() {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const fn = () => setVisible(window.scrollY > 400)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  if (!visible) return null
  return (
    <motion.button
      initial={{ opacity: 0, scale: .6, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: .6, y: 20 }}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      style={{
        position: 'fixed', bottom: '6.5rem', right: '2rem', zIndex: 8999,
        width: 46, height: 46, borderRadius: '50%',
        background: 'linear-gradient(145deg,#0e2416,#081208)',
        border: '1px solid rgba(34,200,100,.35)',
        boxShadow: '4px 4px 14px rgba(0,0,0,.7), 0 0 20px rgba(34,200,100,.15)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', color: '#22c864',
      }}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M8 13V3M3 8l5-5 5 5" stroke="#22c864" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </motion.button>
  )
}

// ── FLOATING WHATSAPP ─────────────────────────────────────────
export function FloatingWA() {
  const [hov, setHov] = useState(false)
  return (
    <motion.a
      href="https://wa.me/2250142507750?text=Bonjour+AKATech+!"
      target="_blank" rel="noreferrer"
      title="Démarrer sur WhatsApp"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 2, type: 'spring', stiffness: 260, damping: 20 }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 9000,
        width: 54, height: 54, borderRadius: '50%',
        background: 'linear-gradient(145deg,#25d366,#128c7e)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: hov ? '0 0 0 0 transparent, 6px 6px 20px rgba(0,0,0,.5)' : '4px 4px 14px rgba(0,0,0,.5)',
        transform: hov ? 'scale(1.1)' : 'scale(1)',
        transition: 'transform .2s, box-shadow .2s',
        textDecoration: 'none',
      }}
    >
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M14 2C7.373 2 2 7.373 2 14c0 2.14.56 4.145 1.54 5.877L2 26l4.267-1.494A11.93 11.93 0 0 0 14 26c6.627 0 12-5.373 12-12S20.627 2 14 2Z" fill="rgba(255,255,255,.15)" stroke="white" strokeWidth="1.5" />
        <path d="M10 8.5c-.4 0-.8.2-1.1.5-.6.6-1.4 1.8-1.4 3.1 0 2.8 2.1 5.5 3 6.4.9.9 3.6 3 6.4 3 1.3 0 2.5-.8 3.1-1.4.3-.3.5-.7.5-1.1v-1.6c0-.3-.2-.6-.5-.7l-2-.8c-.3-.1-.7 0-.9.2l-.7.8c-.2.2-.4.2-.6.1C14.6 16.7 11.3 13.4 11 12c-.1-.2 0-.4.1-.6l.8-.7c.2-.2.3-.6.2-.9l-.8-2c-.1-.3-.4-.5-.7-.5H10Z" fill="white" />
      </svg>
    </motion.a>
  )
}

// ── MARQUEE STRIP ─────────────────────────────────────────────
export function MarqueeStrip() {
  const T = useTheme()
  const items = ['React','Next.js','Django','Python','Node.js','PostgreSQL','Tailwind CSS','Framer Motion','Vercel','AWS','Mobile Money','REST API','Côte d\'Ivoire','Abidjan']
  return (
    <div style={{ overflow: 'hidden', padding: '1.2rem 0', background: T.bgAlt, borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}` }}>
      <div style={{ display: 'flex', animation: 'marquee 28s linear infinite', width: 'max-content', gap: '2rem' }}>
        {[...items, ...items].map((item, i) => (
          <span key={i} style={{ fontFamily: "'Syne',sans-serif", fontSize: '.65rem', fontWeight: 600, color: T.textMuted, letterSpacing: '.02em', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '.6rem' }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: T.green, display: 'inline-block', flexShrink: 0 }} />
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}

// ── SECTION CTA ───────────────────────────────────────────────
export function SectionCTA({ message, cta, href = 'https://wa.me/2250142507750', variant = 'subtle' }) {
  const T = useTheme()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  if (variant === 'strong') return (
    <motion.section ref={ref} initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
      style={{ padding: '5rem 5%', background: 'linear-gradient(135deg,#0a1a0e,#041008)', position: 'relative', overflow: 'hidden', textAlign: 'center' }}>
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle,rgba(34,200,100,.10),transparent 65%)', pointerEvents: 'none' }} />
      <div className="grid-bg" style={{ position: 'absolute', inset: 0, opacity: .18 }} />
      <div style={{ position: 'relative', zIndex: 1, maxWidth: 680, margin: '0 auto' }}>
        <motion.h2 initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: .1 }}
          style={{ fontSize: 'clamp(1.6rem,3vw,2.4rem)', fontWeight: 800, fontFamily: "'Syne',sans-serif", color: 'rgba(255,255,255,.92)', letterSpacing: '-.03em', marginBottom: '1.5rem', lineHeight: 1.2 }}>
          {message}
        </motion.h2>
        <motion.a href={href} target="_blank" rel="noreferrer" className="btn-raised"
          initial={{ opacity: 0, y: 12 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: .25 }}
          style={{ fontSize: '1rem', padding: '1rem 2.4rem' }}>
          {cta} →
        </motion.a>
      </div>
    </motion.section>
  )

  return (
    <motion.section ref={ref} initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
      style={{ padding: '3rem 5%', background: T.bgAlt, borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}` }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <p style={{ fontSize: '.92rem', color: T.textSub, maxWidth: 500, lineHeight: 1.6 }}>{message}</p>
        <a href={href} target="_blank" rel="noreferrer" className="btn-raised" style={{ flexShrink: 0 }}>{cta}</a>
      </div>
    </motion.section>
  )
}

// ── GREEN UNDERLINE — trait animé SVG vert ───────────────────
// Soulignement animé vert ondulé qui se dessine de gauche à droite
// puis pulse en boucle. S'adapte à la largeur du texte.
// Usage : <GreenUnderline>Votre texte vert</GreenUnderline>
export function GreenUnderline({ children, style = {}, color = '#22c864' }) {
  const uid = useRef(`gu${Math.random().toString(36).slice(2,6)}`).current
  const totalLen = 220 // longueur approximative du path

  return (
    <span style={{ position: 'relative', display: 'inline-block', paddingBottom: '10px', ...style }}>
      {children}
      <svg
        aria-hidden
        style={{
          position: 'absolute',
          bottom: '0px',
          left: '-2px',
          right: '-2px',
          width: 'calc(100% + 4px)',
          height: '10px',
          overflow: 'visible',
          pointerEvents: 'none',
        }}
        viewBox="0 0 200 10"
        preserveAspectRatio="none"
      >
        <defs>
          {/* Glow vert doux */}
          <filter id={`gf-${uid}`} x="-10%" y="-100%" width="120%" height="400%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1.2" result="b" />
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        {/* Trait fantôme fixe — base discrète */}
        <path
          d="M1,6 C30,2 70,9 100,5 C130,1 170,8 199,5"
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          strokeOpacity="0.15"
          strokeLinecap="round"
        />

        {/* Trait principal animé — se dessine puis pulse */}
        <path
          d="M1,6 C30,2 70,9 100,5 C130,1 170,8 199,5"
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter={`url(#gf-${uid})`}
          strokeDasharray={`${totalLen} ${totalLen}`}
          strokeDashoffset={totalLen}
        >
          {/* Phase 1 : dessin du trait (0 → 1.2s) */}
          <animate
            attributeName="stroke-dashoffset"
            values={`${totalLen};0;0;0`}
            dur="3.5s"
            repeatCount="indefinite"
            calcMode="spline"
            keyTimes="0;0.35;0.65;1"
            keySplines="0.4 0 0.2 1;0 0 1 1;0 0 1 1"
          />
          {/* Phase 2 : pulse opacité */}
          <animate
            attributeName="strokeOpacity"
            values="0;1;0.8;1;0.6;1;0"
            dur="3.5s"
            repeatCount="indefinite"
            keyTimes="0;0.35;0.5;0.6;0.75;0.85;1"
          />
        </path>

        {/* Point lumineux qui court sur le trait */}
        <circle r="2.5" fill={color} opacity="0" filter={`url(#gf-${uid})`}>
          <animateMotion
            dur="3.5s"
            repeatCount="indefinite"
            keyPoints="0;1;1;1"
            keyTimes="0;0.35;0.65;1"
            calcMode="spline"
            keySplines="0.4 0 0.2 1;0 0 1 1;0 0 1 1"
          >
            <mpath href={`#stroke-path-${uid}`} />
          </animateMotion>
          <animate
            attributeName="opacity"
            values="0;0.9;0.9;0"
            dur="3.5s"
            repeatCount="indefinite"
            keyTimes="0;0.05;0.32;0.38"
          />
        </circle>

        {/* Path dupliqué pour animateMotion mpath */}
        <path
          id={`stroke-path-${uid}`}
          d="M1,6 C30,2 70,9 100,5 C130,1 170,8 199,5"
          fill="none"
          stroke="none"
        />
      </svg>
    </span>
  )
}

// Alias rétrocompatible
export const TrainUnderline = GreenUnderline
