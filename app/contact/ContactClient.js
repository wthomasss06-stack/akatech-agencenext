'use client'
import { useRef, useState, useEffect, useCallback } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import {
  Phone, Mail, MapPin, MessageCircle, Send, Clock,
  CheckCircle, Zap, Globe, Share2,
  ArrowRight, Shield, Rocket, Calendar, Lock,
} from 'lucide-react'
import Image from 'next/image'
import { useTheme } from '@/lib/theme'
import { GhostTitle, GreenUnderline, PageCTA } from '@/components/ui/index'
import ConversionMarquee from '@/components/ui/ConversionMarquee'
import AuroraHero from '@/components/ui/AuroraHero'

// ═══════════════════════════════════════════════════════════════
// ── ANIMATION COMPONENTS ─────────────────────────────────────
// ═══════════════════════════════════════════════════════════════

function BlurReveal({ children, delay = 0, direction = 'up', style = {}, className = '', once = true }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once, margin: '-60px' })
  const off = { up: { y: 40, x: 0 }, right: { y: 0, x: 40 }, down: { y: -40, x: 0 }, left: { y: 0, x: -40 } }[direction] || { y: 40, x: 0 }
  return (
    <motion.div ref={ref} style={style} className={className}
      initial={{ opacity: 0, filter: 'blur(12px)', ...off }}
      animate={inView ? { opacity: 1, filter: 'blur(0px)', x: 0, y: 0 } : {}}
      transition={{ duration: 0.85, ease: [0.2, 0.8, 0.2, 1], delay }}>
      {children}
    </motion.div>
  )
}


/* ─── WordRevealP — scroll-reveal mot par mot + tilt ────── */
function useWordReveal(sectionRef, textRef, wordsRef) {
  useEffect(() => {
    const container = sectionRef.current
    const textEl    = textRef.current
    if (!container || !textEl) return
    const onScroll = () => {
      const rect     = container.getBoundingClientRect()
      const winH     = window.innerHeight
      const progress = Math.max(0, Math.min(1, (winH - rect.top) / (winH + container.offsetHeight)))
      textEl.style.transform = `rotate(${3 * (1 - Math.min(progress / 0.20, 1))}deg)`
      textEl.style.opacity   = String(Math.min(1, 0.4 + progress * 1.2))
      const words = wordsRef.current
      if (!words.length) return
      const wProg = Math.max(0, Math.min(1, progress / 0.40))
      words.forEach((span, i) => {
        if (!span) return
        const local = Math.max(0, Math.min(1, (wProg - (i / (words.length - 1)) * 0.75) / 0.28))
        span.style.opacity = String(0.08 + local * 0.92)
        span.style.filter  = `blur(${((1 - local) * 9).toFixed(1)}px)`
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
}

function WordRevealP({ text, greenWords = [], sectionRef, extraStyle = {} }) {
  const textRef  = useRef(null)
  const wordsRef = useRef([])
  const green    = new Set(greenWords)
  useWordReveal(sectionRef, textRef, wordsRef)
  return (
    <p ref={textRef} style={{
      fontFamily: "'JetBrains Mono',monospace",
      fontSize: 'clamp(1.6rem,3.2vw,2.6rem)',
      fontWeight: 700,
      lineHeight: 1.32,
      paddingLeft: 'var(--body-indent)',
      paddingRight: 'var(--body-indent)',
      transformOrigin: '0% 50%',
      transition: 'transform .05s linear',
      margin: 0,
      ...extraStyle,
    }}>
      {text.split(' ').map((word, i) => (
        <span key={i} ref={el => { wordsRef.current[i] = el }}
          style={{ display: 'inline-block', marginRight: '0.28em', opacity: 0.08,
            filter: 'blur(9px)', willChange: 'opacity, filter',
            color: green.has(word) ? '#88ca53' : 'inherit' }}>
          {word}
        </span>
      ))}
    </p>
  )
}

function TiltCard({ children, style = {}, className = '', intensity = 12, perspective = 900 }) {
  const ref = useRef(null)
  const glowRef = useRef(null)
  const rafRef = useRef(null)
  const applyTilt = useCallback((mx, my) => {
    const el = ref.current; if (!el) return
    const rect = el.getBoundingClientRect()
    const rx = ((my - rect.top - rect.height / 2) / (rect.height / 2)) * -intensity
    const ry = ((mx - rect.left - rect.width / 2) / (rect.width / 2)) * intensity
    const px = ((mx - rect.left) / rect.width) * 100
    const py = ((my - rect.top) / rect.height) * 100
    cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(() => {
      el.style.transform = `perspective(${perspective}px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.03,1.03,1.03)`
      el.style.transition = 'transform .07s linear'
      if (glowRef.current) {
        glowRef.current.style.background = `radial-gradient(260px circle at ${px}% ${py}%, rgba(136,202,83,.13) 0%, transparent 65%)`
        glowRef.current.style.opacity = '1'
      }
    })
  }, [intensity, perspective])
  const resetTilt = useCallback(() => {
    const el = ref.current; if (!el) return
    cancelAnimationFrame(rafRef.current)
    el.style.transition = 'transform .45s cubic-bezier(.25,.46,.45,.94)'
    el.style.transform = `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)`
    if (glowRef.current) glowRef.current.style.opacity = '0'
  }, [perspective])
  useEffect(() => {
    const el = ref.current; if (!el) return
    const onTouchMove = e => { if (e.touches?.[0]) applyTilt(e.touches[0].clientX, e.touches[0].clientY) }
    el.addEventListener('touchmove', onTouchMove, { passive: true })
    el.addEventListener('touchend', resetTilt, { passive: true })
    return () => { el.removeEventListener('touchmove', onTouchMove); el.removeEventListener('touchend', resetTilt) }
  }, [applyTilt, resetTilt])
  return (
    <div ref={ref} className={className}
      style={{ ...style, willChange: 'transform', transformStyle: 'preserve-3d', position: 'relative' }}
      onMouseMove={e => applyTilt(e.clientX, e.clientY)} onMouseLeave={resetTilt}>
      <div ref={glowRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, opacity: 0, transition: 'opacity .12s', borderRadius: 18 }} />
      <div style={{ position: 'relative', zIndex: 1, height: '100%' }}>{children}</div>
    </div>
  )
}

function AnimatedBeamGrid({ containerRef, nodeIds, connections, animKey = 'beam' }) {
  const svgRef = useRef(null)
  const [paths, setPaths] = useState([])
  const draw = useCallback(() => {
    if (!svgRef.current || !containerRef?.current) return
    const cRect = containerRef.current.getBoundingClientRect()
    const mainEl = document.getElementById(nodeIds.center)
    if (!mainEl) return
    const mRect = mainEl.getBoundingClientRect()
    const tx = mRect.left - cRect.left + mRect.width / 2
    const ty = mRect.top - cRect.top + mRect.height / 2
    const built = connections.map((conn, idx) => {
      const fromEl = document.getElementById(conn.id)
      if (!fromEl) return null
      const r = fromEl.getBoundingClientRect()
      const sx = r.left - cRect.left + r.width / 2
      const sy = r.top - cRect.top + r.height / 2
      const cx = (sx + tx) / 2 + (conn.cx || 0)
      const cy = (sy + ty) / 2 + (conn.cy || 0)
      return { d: `M ${sx} ${sy} Q ${cx} ${cy} ${tx} ${ty}`, color: conn.color, delay: `${idx * 0.4}s` }
    }).filter(Boolean)
    setPaths(built)
  }, [containerRef, connections, nodeIds])
  useEffect(() => {
    const t = setTimeout(draw, 80)
    window.addEventListener('resize', draw)
    return () => { clearTimeout(t); window.removeEventListener('resize', draw) }
  }, [draw])
  const kf = `${animKey}Flow`
  return (
    <svg ref={svgRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1, overflow: 'visible' }}>
      <defs>
        {paths.map((p, i) => {
          const pts = p.d.split(' ')
          return (
            <linearGradient key={i} id={`${animKey}-g-${i}`} gradientUnits="userSpaceOnUse"
              x1={pts[1]} y1={pts[2]} x2={pts[pts.length - 2]} y2={pts[pts.length - 1]}>
              <stop offset="0%" stopColor={p.color} stopOpacity="0" />
              <stop offset="40%" stopColor={p.color} stopOpacity="0.6" />
              <stop offset="100%" stopColor={p.color} stopOpacity="0" />
            </linearGradient>
          )
        })}
      </defs>
      {paths.map((p, i) => (
        <g key={i}>
          <path d={p.d} fill="none" stroke="rgba(136,202,83,0.08)" strokeWidth="1.5" />
          <path d={p.d} fill="none" stroke={`url(#${animKey}-g-${i})`} strokeWidth="2.5"
            strokeLinecap="round" strokeDasharray="50 300"
            style={{ animation: `${kf} 2.8s linear infinite`, animationDelay: p.delay }} />
        </g>
      ))}
      <style>{`@keyframes ${kf} { from { stroke-dashoffset: 350; } to { stroke-dashoffset: 0; } }`}</style>
    </svg>
  )
}

// ═══════════════════════════════════════════════════════════════
// ── SVG ICONS ────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════
function FacebookIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.885v2.27h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
    </svg>
  )
}
function WhatsAppIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  )
}


/* ────────────────────────────────────────────────
   HERO
──────────────────────────────────────────────── */
function HeroContact() {
  const T = useTheme()
  const layerBgRef   = useRef(null)
  const layerMidRef  = useRef(null)
  const layerForeRef = useRef(null)

  useEffect(() => {
    const onMouse = (e) => {
      const x = (e.clientX - window.innerWidth  / 2) / (window.innerWidth  / 2)
      const y = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2)
      const rX = y * -5, rY = x * 5
      const apply = (el, sp) => { if (el) el.style.transform = `translate3d(${x*50*sp}px,${y*50*sp}px,0) rotateX(${rX}deg) rotateY(${rY}deg)` }
      apply(layerBgRef.current, 0.2); apply(layerMidRef.current, 0.5); apply(layerForeRef.current, 0.8)
    }
    window.addEventListener('mousemove', onMouse)
    return () => window.removeEventListener('mousemove', onMouse)
  }, [])

  useEffect(() => {
    const onScroll = () => {
      const s = window.pageYOffset
      if (layerBgRef.current) { layerBgRef.current.style.transform = `scale(${1 + s * 0.0005}) translateY(${s * 0.2}px)`; layerBgRef.current.style.filter = `blur(${Math.min(s / 60, 12)}px)` }
      if (layerMidRef.current) { layerMidRef.current.style.opacity = Math.max(0, 1 - s / 700); layerMidRef.current.style.transform = `translateY(${s * 0.4}px)`; layerMidRef.current.style.filter = `blur(${s / 100}px)` }
      if (layerForeRef.current) { layerForeRef.current.style.transform = `translateY(${-s * 0.96}px)`; layerForeRef.current.style.opacity = Math.max(0, 1 - s / 400) }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section style={{ height: '100vh', minHeight: 640, position: 'relative', overflow: 'hidden', background: '#060e09' }}>
      <div ref={layerBgRef} style={{ position: 'absolute', inset: '-8%', zIndex: 1, willChange: 'transform, filter', transition: 'transform .1s ease-out' }}>
        <AuroraHero labels={[]} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 20%, rgba(6,14,9,.95) 100%)' }} />
      </div>

      {/* Titre géant bas-gauche + bloc texte centré verticalement à droite — gabarit hero "page title" (réf. Helious) */}
      <div ref={layerMidRef} className="hr-row" style={{ willChange: 'transform, opacity, filter', transition: 'transform .1s ease-out' }}>
        <motion.h1 className="hr-title" initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7, ease: 'easeOut' }}>
          <GhostTitle text="CONTACT" />
          CONTACT
          
        </motion.h1>

        <div className="hr-side">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .6, delay: .2 }}>
            <p className="hr-kicker">Devis gratuit en moins de 24h.</p>
            <p className="hr-desc"> Pas d'engagement, pas de jargon technique — juste une conversation pour comprendre votre besoin.</p>
          </motion.div>
        </div>
      </div>

      <div ref={layerForeRef} style={{ position: 'absolute', inset: 0, zIndex: 20, pointerEvents: 'none', willChange: 'transform, opacity', transition: 'transform .1s ease-out' }}>
        {[{left:'8%',top:'25%',s:4,op:.18,dur:3.8,dy:0},{left:'22%',top:'68%',s:3,op:.11,dur:5.1,dy:1.2},{left:'60%',top:'22%',s:4,op:.20,dur:4.4,dy:0.6},{left:'75%',top:'70%',s:3,op:.09,dur:6.2,dy:1.8},{left:'88%',top:'15%',s:4,op:.15,dur:3.2,dy:0.3}].map((p,i) => (
          <motion.div key={i} style={{ position:'absolute', width:p.s, height:p.s, borderRadius:'50%', background:'#88ca53', left:p.left, top:p.top, opacity:p.op }}
            animate={{ y:[0,-18,0] }} transition={{ duration:p.dur, repeat:Infinity, ease:'easeInOut', delay:p.dy }} />
        ))}
      </div>

      <style>{`
        .hr-row { position: relative; z-index: 10; height: 100%; }
        .hr-title {
          position: absolute; left: 8vw; bottom: 4.5rem; margin: 0;
          font-family: 'JetBrains Mono', monospace; font-weight: 800;
          font-size: clamp(4.5rem, 13vw, 15rem); line-height: .92; letter-spacing: -.04em;
          color: rgba(255,255,255,.95);
        }
        .hr-star {
          display: inline-block; position: relative; top: -.5em;
          margin-left: .15em; font-size: .3em; color: #88ca53;
        }
        .hr-side {
          position: absolute; right: 8vw; top: 0; bottom: 0;
          margin: auto 0; max-width: 360px; height: fit-content;
        }
        .hr-kicker {
          font-family: 'JetBrains Mono', monospace; font-size: .62rem; font-weight: 700;
          color: #88ca53; letter-spacing: .3em; text-transform: uppercase; margin: 0 0 .9rem;
        }
        .hr-desc { font-size: .95rem; color: rgba(255,255,255,.6); line-height: 1.7; margin: 0; }
      `}</style>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════
// ── CONTACT CHANNELS — AnimatedBeamGrid + TiltCard ───────────
// ═══════════════════════════════════════════════════════════════
const CHANNELS = [
  { id: 'cnt-n-0', icon: MessageCircle, label: 'WhatsApp', val: '+225 01 42 50 77 50', href: 'https://wa.me/2250142507750', color: '#25d366', desc: 'Réponse en moins de 2h' },
  { id: 'cnt-n-1', icon: Mail,          label: 'Email',    val: 'wthomasss06@gmail.com', href: 'mailto:wthomasss06@gmail.com', color: '#88ca53', desc: 'Réponse sous 24h' },
  { id: 'cnt-n-2', icon: Phone,         label: 'Téléphone',val: '+225 01 42 50 77 50', href: 'tel:+2250142507750', color: '#88ca53', desc: 'Lun–Ven, 8h–18h' },
  { id: 'cnt-n-3', icon: MapPin,        label: 'Localisation', val: "Abidjan, Côte d'Ivoire", href: null, color: '#88ca53', desc: 'Déplacements possibles' },
]

function ChannelIcon({ Icon, color, T }) {
  return (
    <div style={{ width: 42, height: 42, borderRadius: 12, background: 'rgba(136,202,83,.1)', border: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <Icon size={19} style={{ color }} />
    </div>
  )
}
function ChannelInfo({ label, val, desc, T }) {
  return (
    <div style={{ minWidth: 0 }}>
      <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.65rem', fontWeight: 600, color: T.green, letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: '.2rem' }}>{label}</div>
      <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.82rem', fontWeight: 600, color: T.textMain, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{val}</div>
      <div style={{ fontSize: '.7rem', color: T.textMuted }}>{desc}</div>
    </div>
  )
}

function ContactChannels() {
  const T = useTheme()
  const sectionRef = useRef(null)
  const beamContainerRef = useRef(null)

  const beamConnections = [
    { id: 'cnt-n-0', color: '#25d366', cx: 30,  cy: 20  },
    { id: 'cnt-n-1', color: '#88ca53', cx: 30,  cy: -20 },
    { id: 'cnt-n-2', color: '#88ca53', cx: -30, cy: 20  },
    { id: 'cnt-n-3', color: '#86efac', cx: -30, cy: -20 },
  ]

  return (
    <section ref={sectionRef} style={{ padding: 'clamp(3rem,6vw,5rem) 5% clamp(2rem,4vw,3rem)', background: T.bgAlt }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        {/* ── Header ── */}
        <div style={{ marginBottom: '2.5rem' }}>
          <BlurReveal delay={0.12}>
            <h2 className="section-title-big" style={{ position: 'relative', fontSize: 'clamp(2.8rem,5.5vw,4.4rem)', fontWeight: 900, fontStyle: 'italic', fontFamily: "'Barlow Condensed',sans-serif", color: T.textMain, letterSpacing: '-.03em', marginBottom: '.5rem' }}>
              <GhostTitle text="COMMENT NOUS CONTACTER" />
              Comment nous <GreenUnderline><span className="text-gradient">contacter</span></GreenUnderline>
            </h2>
          </BlurReveal>
          <WordRevealP
            sectionRef={sectionRef}
            text="Choisissez le canal qui vous convient. WhatsApp est le plus rapide — on répond en moins de 2h."
            greenWords={['WhatsApp', 'rapide', '2h.']}
            extraStyle={{ color: T.textSub }}
          />
        </div>

        {/* ── Beam constellation ── */}
        <BlurReveal delay={0.22} style={{ marginBottom: '2.5rem' }}>
          <div ref={beamContainerRef} style={{ position: 'relative', padding: '2rem 1rem', borderRadius: 20, background: T.light ? 'rgba(136,202,83,.03)' : 'rgba(136,202,83,.025)', border: `1px solid ${T.border}`, overflow: 'visible' }}>
            <AnimatedBeamGrid
              containerRef={beamContainerRef}
              nodeIds={{ center: 'cnt-center' }}
              connections={beamConnections}
              animKey="cnt"
            />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr) auto repeat(2,1fr)', alignItems: 'center', gap: '1rem', position: 'relative', zIndex: 2 }}>
              {/* Left 2 */}
              {CHANNELS.slice(0, 2).map(({ id, icon: Icon, label, color }) => (
                <div key={id} id={id}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '.45rem', padding: '.85rem', borderRadius: 14, background: T.light ? 'rgba(255,255,255,.9)' : 'rgba(11,26,16,.8)', border: `1px solid ${T.border}`, backdropFilter: 'blur(8px)', justifySelf: 'center' }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(136,202,83,.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={18} style={{ color }} />
                  </div>
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.6rem', fontWeight: 600, color: T.textMuted, whiteSpace: 'nowrap' }}>{label}</span>
                </div>
              ))}
              {/* Center */}
              <div id="cnt-center"
                style={{ width: 76, height: 76, borderRadius: '50%', background: 'linear-gradient(135deg, rgba(136,202,83,.25), rgba(136,202,83,.08))', border: '2px solid rgba(136,202,83,.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(12px)', justifySelf: 'center', boxShadow: '0 0 40px rgba(136,202,83,.2)', flexShrink: 0 }}>
                <Image src="/images/logo.webp" alt="AKATech" width={52} height={52} style={{ objectFit: 'contain', filter: 'drop-shadow(0 0 6px rgba(136,202,83,.5))' }} />
              </div>
              {/* Right 2 */}
              {CHANNELS.slice(2).map(({ id, icon: Icon, label, color }) => (
                <div key={id} id={id}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '.45rem', padding: '.85rem', borderRadius: 14, background: T.light ? 'rgba(255,255,255,.9)' : 'rgba(11,26,16,.8)', border: `1px solid ${T.border}`, backdropFilter: 'blur(8px)', justifySelf: 'center' }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(136,202,83,.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={18} style={{ color }} />
                  </div>
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.6rem', fontWeight: 600, color: T.textMuted, whiteSpace: 'nowrap' }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </BlurReveal>

        {/* ── Channel cards — TiltCard ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(220px,100%),1fr))', gap: '1rem' }}>
          {CHANNELS.map(({ id, icon: Icon, label, val, href, color, desc }, i) => (
            <BlurReveal key={label} delay={i * 0.08} direction={['right','up','left','up'][i]}>
              <TiltCard style={{
                borderRadius: 16, overflow: 'hidden',
                background: T.light ? 'rgba(255,255,255,.8)' : 'rgba(255,255,255,.04)',
                backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
                border: `1px solid ${T.light ? 'rgba(0,0,0,.08)' : 'rgba(255,255,255,.08)'}`,
                boxShadow: T.light ? '0 4px 20px rgba(0,0,0,.06)' : '0 4px 20px rgba(0,0,0,.3), inset 0 1px 0 rgba(255,255,255,.05)',
                padding: '1.1rem 1.3rem',
                cursor: href ? 'pointer' : 'default',
                height: '100%',
              }}>
                {href ? (
                  <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer"
                    style={{ display: 'flex', alignItems: 'center', gap: '.9rem', textDecoration: 'none' }}>
                    <ChannelIcon Icon={Icon} color={color} T={T} />
                    <ChannelInfo label={label} val={val} desc={desc} T={T} />
                    <ArrowRight size={14} style={{ color: T.green, marginLeft: 'auto', flexShrink: 0 }} />
                  </a>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '.9rem' }}>
                    <ChannelIcon Icon={Icon} color={color} T={T} />
                    <ChannelInfo label={label} val={val} desc={desc} T={T} />
                  </div>
                )}
              </TiltCard>
            </BlurReveal>
          ))}
        </div>

        {/* Social row */}
        <BlurReveal delay={0.5}>
          <div style={{ marginTop: '1.5rem', padding: '1rem 1.3rem', borderRadius: 14, background: 'rgba(136,202,83,.04)', border: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.78rem', fontWeight: 600, color: T.textMuted }}>Réseaux sociaux</span>
            <div style={{ display: 'flex', gap: '.6rem' }}>
              {[
                { Icon: FacebookIcon, href: 'https://web.facebook.com/profile.php?id=61577494705852', label: 'Facebook', color: '#1877f2' },
                { Icon: WhatsAppIcon, href: 'https://wa.me/2250142507750', label: 'WhatsApp', color: '#25d366' },
                { Icon: Globe, href: 'https://mbolloaka-dev.vercel.app/', label: 'Portfolio', color: '#88ca53' },
              ].map(({ Icon, href, label, color }) => (
                <a key={label} href={href} target="_blank" rel="noreferrer" title={label}
                  style={{ width: 36, height: 36, borderRadius: 10, background: T.light ? 'rgba(0,0,0,.05)' : 'rgba(136,202,83,.06)', border: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.textSub, transition: 'all .2s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = color; e.currentTarget.style.borderColor = color; e.currentTarget.style.color = '#fff'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = T.light ? 'rgba(0,0,0,.05)' : 'rgba(136,202,83,.06)'; e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.textSub; e.currentTarget.style.transform = 'none' }}>
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>
        </BlurReveal>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════
// ── PROCESS — "Votre devis en 4 étapes" ──────────────────────
// ═══════════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════════
// ── OÙ INTERVENONS-NOUS — V-labs "Rayon d'action" ────────────
// ═══════════════════════════════════════════════════════════════
const GEO_PAYS = [
  { code: 'CI', name: "Côte d'Ivoire", note: 'Siège — Abidjan', primary: true },
  { code: 'SN', name: 'Sénégal',       note: 'WhatsApp & Zoom'              },
  { code: 'CM', name: 'Cameroun',      note: 'WhatsApp & Zoom'              },
  { code: 'BJ', name: 'Bénin',         note: 'WhatsApp & Zoom'              },
  { code: 'BF', name: 'Burkina Faso',  note: 'WhatsApp & Zoom'              },
  { code: 'FR', name: 'France',        note: 'Diaspora africaine'           },
]

function FlagBadge({ code, primary }) {
  const colors = {
    CI: ['#f77f00','#fff','#009a44'],
    SN: ['#00853f','#fdef42','#e31b23'],
    CM: ['#007a5e','#ce1126','#fcd116'],
    BJ: ['#008751','#fcd116','#e8112d'],
    BF: ['#ef2b2d','#009a44','#fcd116'],
    FR: ['#002395','#fff','#ed2939'],
  }
  const [c1, c2, c3] = colors[code] || ['#88ca53','#fff','#88ca53']
  return (
    <div style={{ width: 36, height: 36, borderRadius: 10, overflow: 'hidden', flexShrink: 0, border: primary ? '1.5px solid rgba(136,202,83,.5)' : '1px solid rgba(255,255,255,.1)', display: 'flex', flexDirection: 'column', boxShadow: primary ? '0 0 10px rgba(136,202,83,.2)' : 'none' }}>
      <div style={{ flex: 1, background: c1 }} />
      <div style={{ flex: 1, background: c2 }} />
      <div style={{ flex: 1, background: c3 }} />
    </div>
  )
}

// GeoSection moved to HomeClientDesktop.js

// ProcessContact and ProjectForm moved to HomeClientDesktop.js

// ═══════════════════════════════════════════════════════════════
// ── PAGE ─────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════
export default function ContactPage() {
  return (
    <div>
      <HeroContact />
      <ContactChannels />
      <ConversionMarquee />

      <PageCTA
        message="Prêt à transformer votre idée en réalité digitale ? Parlons-en maintenant."
        cta="Démarrer sur WhatsApp"
      />
    </div>
  )
}