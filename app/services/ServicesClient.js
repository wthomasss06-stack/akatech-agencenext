'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import {
  ArrowRight, Star, ExternalLink,
  Globe, ShoppingCart, Cpu, Server, Palette, Wrench,
  TrendingUp, Users, Clock, Award,
  MessageCircle, Target, Code, Rocket, Timer, ChevronLeft, ChevronRight,
} from 'lucide-react'
import { useTheme } from '@/lib/theme'
import { GhostTitle, AnimatedCounter, LazyImg, MarqueeStrip, GreenUnderline } from '@/components/ui/index'
import AuroraHero from '@/components/ui/AuroraHero'
import { SERVICES, PROJECTS, TESTIMONIALS, STATS } from '@/lib/data'

/* ─── BlurReveal ─────────────────────────────────────────── */
function BlurReveal({ children, delay = 0, direction = 'up', style = {}, once = true }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once, margin: '-60px' })
  const dirMap = { up: { y: 40, x: 0 }, right: { y: 0, x: 40 }, down: { y: -40, x: 0 }, left: { y: 0, x: -40 } }
  const off = dirMap[direction] || { y: 40, x: 0 }
  return (
    <motion.div ref={ref} style={style}
      initial={{ opacity: 0, filter: 'blur(12px)', ...off }}
      animate={inView ? { opacity: 1, filter: 'blur(0px)', x: 0, y: 0 } : {}}
      transition={{ duration: 0.85, ease: [0.2, 0.8, 0.2, 1], delay }}>
      {children}
    </motion.div>
  )
}

/* ─── LetterReveal ───────────────────────────────────────── */
function LetterReveal({ text, style = {}, stagger = 0.028 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })
  return (
    <span ref={ref} style={{ display: 'inline', ...style }}>
      {[...text].map((char, i) => (
        <motion.span key={i}
          initial={{ opacity: 0, filter: 'blur(4px)', y: 10 }}
          animate={inView ? { opacity: 1, filter: 'blur(0px)', y: 0 } : {}}
          transition={{ duration: 0.42, ease: 'easeOut', delay: i * stagger }}
          style={{ display: 'inline-block', whiteSpace: 'pre' }}>
          {char}
        </motion.span>
      ))}
    </span>
  )
}

/* ─── AnimatedBeamGrid ───────────────────────────────────── */
function AnimatedBeamGrid({ containerRef, nodeIds, connections }) {
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
    const timer = setTimeout(draw, 80)
    window.addEventListener('resize', draw)
    return () => { clearTimeout(timer); window.removeEventListener('resize', draw) }
  }, [draw])
  return (
    <svg ref={svgRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1, overflow: 'visible' }}>
      <defs>
        {paths.map((p, i) => (
          <linearGradient key={i} id={`svc-bg-${i}`} gradientUnits="userSpaceOnUse"
            x1={p.d.split(' ')[1]} y1={p.d.split(' ')[2]}
            x2={p.d.split(' ')[p.d.split(' ').length - 2]} y2={p.d.split(' ')[p.d.split(' ').length - 1]}>
            <stop offset="0%" stopColor={p.color} stopOpacity="0" />
            <stop offset="40%" stopColor={p.color} stopOpacity="0.6" />
            <stop offset="100%" stopColor={p.color} stopOpacity="0" />
          </linearGradient>
        ))}
      </defs>
      {paths.map((p, i) => (
        <g key={i}>
          <path d={p.d} fill="none" stroke="rgba(136,202,83,0.08)" strokeWidth="1.5" />
          <path d={p.d} fill="none" stroke={`url(#svc-bg-${i})`} strokeWidth="2.5" strokeLinecap="round"
            strokeDasharray="50 300" style={{ animation: 'beamFlow 2.8s linear infinite', animationDelay: p.delay }} />
        </g>
      ))}
      <style>{`@keyframes beamFlow{from{stroke-dashoffset:350}to{stroke-dashoffset:0}}`}</style>
    </svg>
  )
}

/* ─── StickyCTABlock ─────────────────────────────────────── */
function StickyCTABlock({ message, cta, href = 'https://wa.me/2250142507750', variant = 'default', zIndex = 2, rounded = false }) {
  const T = useTheme()
  const ref = useRef(null)
  const inView = useInView(ref, { once: false, margin: '-20%' })
  const isStrong = variant === 'strong'
  const bg = isStrong ? (T.light ? '#f0fdf4' : '#061a0a') : (T.light ? '#ffffff' : '#051208')
  return (
    <div ref={ref} style={{ position: 'sticky', top: 0, zIndex, background: bg, borderRadius: rounded ? '28px 28px 0 0' : 0, boxShadow: rounded ? '0 -24px 60px rgba(0,0,0,.28)' : 'none', overflow: 'hidden', minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '5rem 5%' }}>
      <div className="grid-bg" style={{ position: 'absolute', inset: 0, opacity: T.light ? .3 : .15 }} />
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 700, height: 400, borderRadius: '50%', background: isStrong ? 'radial-gradient(ellipse,rgba(136,202,83,.12),transparent 65%)' : 'radial-gradient(ellipse,rgba(136,202,83,.06),transparent 65%)', pointerEvents: 'none' }} />
      <motion.div initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }} animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}} transition={{ duration: .8, ease: [.22,1,.36,1] }}
        style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: 700 }}>
        {isStrong && (
          <motion.div initial={{ opacity: 0, scale: .9 }} animate={inView ? { opacity: 1, scale: 1 } : {}} transition={{ delay: .1 }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '.5rem', padding: '.3rem .9rem', borderRadius: 100, background: 'rgba(136,202,83,.1)', border: '1px solid rgba(136,202,83,.25)', marginBottom: '1.5rem', backdropFilter: 'blur(8px)' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#88ca53', animation: 'dot-blink 1.4s ease-in-out infinite' }} />
            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.65rem', fontWeight: 700, color: '#88ca53', letterSpacing: '.1em', textTransform: 'uppercase' }}>Prêt à démarrer ?</span>
          </motion.div>
        )}
        <motion.p initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: .15 }}
          style={{ fontSize: isStrong ? 'clamp(1.5rem,3.2vw,2.4rem)' : 'clamp(1.2rem,2.5vw,1.8rem)', fontWeight: 800, fontFamily: "'JetBrains Mono',monospace", color: T.textMain, letterSpacing: '-.03em', lineHeight: 1.3, marginBottom: '2rem' }}>
          {message}
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: .28 }}
          style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem' }}>
          <a href={href} target="_blank" rel="noreferrer" className="btn-raised" style={{ fontSize: '1rem', padding: '1rem 2.2rem' }}>
            {cta} <ArrowRight size={16} />
          </a>
        </motion.div>
        {isStrong && (
          <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: .45 }}
            className="trust-badges" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '.5rem', marginTop: '1.8rem' }}>
            {['✓ Devis gratuit', '✓ Livraison garantie', '✓ Support 48h'].map((b) => (
              <span key={b} style={{ padding: '.25rem .75rem', borderRadius: 100, background: 'rgba(136,202,83,.07)', border: '1px solid rgba(136,202,83,.18)', fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, fontSize: '.78rem', color: '#b3ee85' }}>{b}</span>
            ))}
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
const ICON_MAP = { Globe, ShoppingCart, Cpu, Server, Palette, Wrench }

// ── HERO avec carrousel images auto ──────────────────────────
const HERO_SLIDES = [
  {
    tag: '// Site Vitrine',
    title: 'Votre présence digitale,',
    accent: 'professionnelle & rentable.',
    sub: "Un site qui travaille pour vous 24h/24 — attirez des clients, gagnez en crédibilité et développez votre activité.",
    img: '/images/hero-bg.jpg',
  },
  {
    tag: '// E-Commerce',
    title: 'Vendez en ligne,',
    accent: 'même quand vous dormez.',
    sub: "Boutique complète avec paiement Mobile Money, gestion stocks et tableau de bord admin. Livrée en 14 jours.",
    img: '/images/about-2.jpg',
  },
  {
    tag: '// Application SaaS',
    title: 'Automatisez vos tâches,',
    accent: 'scalez votre activité.',
    sub: "Des applications web sur-mesure pour digitaliser vos processus et économiser des heures de travail chaque semaine.",
    img: '/images/about-1.jpg',
  },
  {
    tag: '// Portfolio Créatif',
    title: 'Votre talent mérite',
    accent: 'une vitrine digitale.',
    sub: "Portfolios animés, modernes et percutants pour créatifs, graphistes et freelances qui veulent décrocher plus de clients.",
    img: '/images/about-4.jpg',
  },
]


// ── TILT 3D CARD — parallaxe souris native ──────────────────
function TiltCard({ children, style = {}, className = '', intensity = 14, perspective = 900 }) {
  const ref = useRef(null)
  const glowRef = useRef(null)
  const rafRef = useRef(null)

  const applyTilt = useCallback((mx, my) => {
    const el = ref.current; if (!el) return
    const rect = el.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const rx = ((my - cy) / (rect.height / 2)) * -intensity
    const ry = ((mx - cx) / (rect.width / 2)) * intensity
    const px = ((mx - rect.left) / rect.width) * 100
    const py = ((my - rect.top) / rect.height) * 100
    cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(() => {
      el.style.transform = `perspective(${perspective}px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.04,1.04,1.04)`
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
    const onTouchMove = e => {
      if (!e.touches?.[0]) return
      applyTilt(e.touches[0].clientX, e.touches[0].clientY)
    }
    const onTouchEnd = () => resetTilt()
    el.addEventListener('touchmove', onTouchMove, { passive: true })
    el.addEventListener('touchend', onTouchEnd, { passive: true })
    return () => {
      el.removeEventListener('touchmove', onTouchMove)
      el.removeEventListener('touchend', onTouchEnd)
    }
  }, [applyTilt, resetTilt])

  return (
    <div
      ref={ref}
      className={className}
      style={{ ...style, willChange: 'transform', transformStyle: 'preserve-3d', position: 'relative' }}
      onMouseMove={e => applyTilt(e.clientX, e.clientY)}
      onMouseLeave={resetTilt}
    >
      <div ref={glowRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, opacity: 0, transition: 'opacity .12s', borderRadius: 18 }} />
      <div style={{ position: 'relative', zIndex: 1, height: '100%' }}>{children}</div>
    </div>
  )
}

function Hero() {
  const T = useTheme()
  const [idx, setIdx] = useState(0)
  const [imgIdx, setImgIdx] = useState(0)
  const timerRef   = useRef(null)
  const layerBgRef  = useRef(null)
  const layerMidRef = useRef(null)
  const layerForeRef = useRef(null)

  const next = useCallback(() => {
    setIdx(i => (i + 1) % HERO_SLIDES.length)
    setImgIdx(i => (i + 1) % HERO_SLIDES.length)
  }, [])

  useEffect(() => {
    timerRef.current = setInterval(next, 5000)
    return () => clearInterval(timerRef.current)
  }, [next])

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
      if (layerBgRef.current)  { layerBgRef.current.style.transform  = `scale(${1 + s * 0.0005}) translateY(${s * 0.2}px)`;  layerBgRef.current.style.filter  = `blur(${Math.min(s / 60, 12)}px)` }
      if (layerMidRef.current) { layerMidRef.current.style.opacity   = Math.max(0, 1 - s / 700); layerMidRef.current.style.transform = `translateY(${s * 0.4}px)`; layerMidRef.current.style.filter = `blur(${s / 100}px)` }
      if (layerForeRef.current){ layerForeRef.current.style.transform = `translateY(${-s * 0.96}px)`; layerForeRef.current.style.opacity = Math.max(0, 1 - s / 400) }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const slide = HERO_SLIDES[idx]

  return (
    <section style={{ height: '100vh', width: '100%', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#030806' }}>

      {/* ── LAYER BG — Aurora */}
      <div ref={layerBgRef} style={{ position: 'absolute', inset: '-8%', zIndex: 1, willChange: 'transform, filter', transition: 'transform .1s ease-out' }}>
        <AuroraHero labels={[]} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 20%, rgba(3,8,6,.95) 100%)' }} />
      </div>

      {/* ── LAYER MID — contenu */}
      <div ref={layerMidRef} style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: 1200, padding: '0 5%', willChange: 'transform, opacity, filter', transition: 'transform .1s ease-out' }}>
        <div className="hero-content-grid" style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '4rem', alignItems: 'center', paddingTop: 80 }}>

          {/* Texte gauche */}
          <div style={{ maxWidth: 680 }}>
            <AnimatePresence mode="wait">
              <motion.div key={idx}
                initial={{ opacity: 0, y: 24, filter: 'blur(4px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -14, filter: 'blur(2px)' }}
                transition={{ duration: .6, ease: [.22,1,.36,1] }}>

                <motion.div
                  className="no-pill-mobile"
                  initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: .5, delay: .1 }}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '.5rem', padding: '.3rem .9rem', borderRadius: 100, background: 'rgba(136,202,83,.1)', border: '1px solid rgba(136,202,83,.25)', marginBottom: '1.8rem' }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#88ca53', animation: 'dot-blink 1.4s ease-in-out infinite' }} />
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.65rem', fontWeight: 600, color: '#88ca53' }}>{slide.tag}</span>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .55, delay: .15 }}
                  style={{ fontSize: 'clamp(2.4rem,5.5vw,4.4rem)', fontWeight: 800, fontFamily: "'JetBrains Mono',monospace", color: '#ffffff', letterSpacing: '-.04em', lineHeight: 1.08, marginBottom: '.3rem' }}>
                  {slide.title}
                </motion.h1>
                <motion.h1
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .55, delay: .22 }}
                  style={{ fontSize: 'clamp(2.4rem,5.5vw,4.4rem)', fontWeight: 800, fontFamily: "'Dancing Script',cursive", color: '#88ca53', letterSpacing: '-.02em', lineHeight: 1.08, marginBottom: '1.6rem' }}>
                  <GreenUnderline>{slide.accent}</GreenUnderline>
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .6, delay: .3 }}
                  style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,.75)', lineHeight: 1.75, marginBottom: '2.8rem', maxWidth: 520 }}>
                  {slide.sub}
                </motion.p>
              </motion.div>
            </AnimatePresence>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .5, delay: .45 }}
              style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '3rem' }}>
              <a href="https://wa.me/2250142507750" target="_blank" rel="noreferrer" className="btn-raised" style={{ fontSize: '1rem', padding: '1rem 2.2rem' }}>
                Démarrer mon projet <ArrowRight size={16} />
              </a>
              <Link href="/projects" className="btn-ghost" style={{ fontSize: '1rem', padding: '1rem 2.2rem' }}>
                Voir les réalisations
              </Link>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .6, delay: .6 }}
              className="trust-badges" style={{ display: 'flex', flexWrap: 'wrap', gap: '.6rem' }}>
              {['✓ Devis gratuit', '✓ Livraison garantie', '✓ Formation incluse', '✓ Support 48h'].map((b, bi) => (
                <motion.span key={b}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .65 + bi * .07 }}
                  style={{ padding: '.28rem .8rem', borderRadius: 100, background: 'rgba(136,202,83,.08)', border: '1px solid rgba(136,202,83,.18)', fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, fontSize: '.85rem', color: '#b3ee85' }}>
                  {b}
                </motion.span>
              ))}
            </motion.div>
          </div>

          {/* Stat cards droite */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-end' }} className="hide-mobile">
            <TiltCard intensity={13} perspective={800} style={{ borderRadius: 18 }}>
              <motion.div initial={{ opacity: 0, x: 28 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: .6, delay: .35 }}>
                <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                  className="sku-card"
                  style={{ padding: '.85rem 1.2rem', display: 'flex', alignItems: 'center', gap: '.7rem', background: T.light ? 'rgba(255,255,255,.92)' : 'rgba(11,26,16,.88)', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(120deg,transparent 30%,rgba(136,202,83,.07) 50%,transparent 70%)', backgroundSize: '200% 100%', animation: 'shimmer 3.2s ease-in-out infinite', pointerEvents: 'none' }} />
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(136,202,83,.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <TrendingUp size={18} style={{ color: '#88ca53' }} />
                  </div>
                  <div>
                    <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.9rem', fontWeight: 800, color: '#88ca53' }}>+10</div>
                    <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.52rem', color: T.textMuted, textTransform: 'uppercase', letterSpacing: '.06em' }}>Projets livrés</div>
                  </div>
                </motion.div>
              </motion.div>
            </TiltCard>

            <TiltCard intensity={10} perspective={800} style={{ borderRadius: 18 }}>
              <motion.div initial={{ opacity: 0, x: 28 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: .6, delay: .48 }}>
                <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                  className="sku-card"
                  style={{ padding: '.75rem 1rem', display: 'flex', alignItems: 'center', gap: '.6rem', background: T.light ? 'rgba(255,255,255,.92)' : 'rgba(11,26,16,.88)', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(120deg,transparent 30%,rgba(136,202,83,.07) 50%,transparent 70%)', backgroundSize: '200% 100%', animation: 'shimmer 4s ease-in-out infinite .9s', pointerEvents: 'none' }} />
                  <div style={{ display: 'flex' }}>
                    {[1,2,3,4,5].map(s => <Star key={s} size={12} style={{ color: '#88ca53' }} fill="#88ca53" />)}
                  </div>
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.75rem', fontWeight: 700, color: T.textMain }}>100% satisfaits</span>
                </motion.div>
              </motion.div>
            </TiltCard>

            {/* Slide dots */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .7 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '.4rem', paddingTop: '.5rem' }}>
              {HERO_SLIDES.map((_, i) => (
                <button key={i} onClick={() => { setIdx(i); setImgIdx(i); clearInterval(timerRef.current); timerRef.current = setInterval(next, 5000) }}
                  style={{ width: 4, height: i === idx ? 28 : 8, borderRadius: 2, background: i === idx ? '#88ca53' : 'rgba(136,202,83,.25)', border: 'none', cursor: 'pointer', transition: 'all .35s', display: 'block' }} />
              ))}
            </motion.div>
          </div>
        </div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .8, duration: .6 }}
          style={{ marginTop: '3.5rem' }}>
          <div className="stats-bar-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1px', background: 'rgba(136,202,83,.12)', borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(136,202,83,.12)' }}>
            {STATS.map(({ val, suffix, label }, si) => (
              <motion.div key={label}
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .9 + si * .08 }}
                whileHover={{ background: 'rgba(136,202,83,.07)', transition: { duration: .2 } }}
                style={{ padding: '1.5rem', background: 'rgba(3,8,6,.7)', textAlign: 'center', cursor: 'default' }}>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.9rem', fontWeight: 800, color: '#88ca53', lineHeight: 1 }}>
                  <AnimatedCounter target={val} suffix={suffix} />
                </div>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.6rem', color: 'rgba(255,255,255,.35)', textTransform: 'uppercase', letterSpacing: '.08em', marginTop: '.4rem' }}>{label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── LAYER FORE — particules */}
      <div ref={layerForeRef} style={{ position: 'absolute', inset: 0, zIndex: 20, pointerEvents: 'none', willChange: 'transform, opacity', transition: 'transform .1s ease-out' }}>
        {[{left:'8%',top:'25%',s:4,op:.18,dur:3.8,dy:0},{left:'22%',top:'68%',s:3,op:.11,dur:5.1,dy:1.2},{left:'60%',top:'22%',s:4,op:.20,dur:4.4,dy:0.6},{left:'75%',top:'70%',s:3,op:.09,dur:6.2,dy:1.8},{left:'88%',top:'15%',s:4,op:.15,dur:3.2,dy:0.3}].map((p,i) => (
          <motion.div key={i} style={{ position:'absolute', width:p.s, height:p.s, borderRadius:'50%', background:'#88ca53', left:p.left, top:p.top, opacity:p.op }}
            animate={{ y:[0,-18,0] }} transition={{ duration:p.dur, repeat:Infinity, ease:'easeInOut', delay:p.dy }} />
        ))}
      </div>

      {/* Scroll indicator */}
      <div style={{ position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: .28, zIndex: 15, pointerEvents: 'none' }}>
        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.6rem', letterSpacing: '.18em', textTransform: 'uppercase', marginBottom: '.4rem', color: '#fff' }}>Scroll</span>
        <motion.div animate={{ scaleY: [1, 1.4, 1], opacity: [.5, 1, .5] }} transition={{ duration: 1.6, repeat: Infinity }}
          style={{ width: 1, height: 36, background: 'linear-gradient(to bottom, rgba(255,255,255,.8), transparent)' }} />
      </div>

    </section>
  )
}

// ── SERVICES PREVIEW ─────────────────────────────────────────
function ServicesPreview() {
  const T = useTheme()
  const beamContainerRef = useRef(null)

  const serviceIcons = [
    { id: 'svc-b0', Icon: Globe,        label: 'Site Vitrine',  color: '#88ca53' },
    { id: 'svc-b1', Icon: ShoppingCart, label: 'E-Commerce',   color: '#4ade80' },
    { id: 'svc-b2', Icon: Cpu,          label: 'SaaS App',     color: '#88ca53' },
    { id: 'svc-b3', Icon: Server,       label: 'Back-end',     color: '#86efac' },
    { id: 'svc-b4', Icon: Palette,      label: 'UI/UX Design', color: '#4ade80' },
    { id: 'svc-b5', Icon: Wrench,       label: 'Maintenance',  color: '#88ca53' },
  ]
  const beamConnections = serviceIcons.map((s, i) => ({ id: s.id, color: s.color, cx: i < 3 ? 30 : -30, cy: i < 3 ? 20 : -20 }))

  return (
    <section style={{ padding: '7rem 5%', background: T.bg, position: 'relative', overflow: 'hidden' }}>
      <div className="grid-bg" style={{ position: 'absolute', inset: 0, opacity: .25 }} />
      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* Header avec BlurReveal + LetterReveal */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <BlurReveal delay={0.15}>
            <h2 style={{ position: 'relative', fontSize: 'clamp(1.9rem,3.5vw,2.8rem)', fontWeight: 800, fontFamily: "'JetBrains Mono',monospace", color: T.textMain, letterSpacing: '-.03em', lineHeight: 1.15 }}>
              <GhostTitle text="Des solutions qui travaillent pour vous, même quand vous dormez" />
              <LetterReveal text="Des solutions qui travaillent" stagger={0.022} />
              <br />
              <LetterReveal text="pour vous, " stagger={0.022} />
              <GreenUnderline><span className="text-gradient"><LetterReveal text="même quand vous dormez" stagger={0.022} /></span></GreenUnderline>
            </h2>
          </BlurReveal>
        </div>

        {/* AnimatedBeamGrid constellation */}
        <BlurReveal delay={0.2} style={{ marginBottom: '4rem' }}>
          <div ref={beamContainerRef} style={{ position: 'relative', padding: '2.5rem 1rem', borderRadius: 20, background: T.light ? 'rgba(136,202,83,.03)' : 'rgba(136,202,83,.025)', border: `1px solid ${T.border}`, overflow: 'visible' }}>
            <AnimatedBeamGrid containerRef={beamContainerRef} nodeIds={{ center: 'svc-beam-center-services' }} connections={beamConnections.map(c => ({ ...c, id: c.id }))} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr) auto repeat(3,1fr)', alignItems: 'center', gap: '1rem', position: 'relative', zIndex: 2 }}>
              {serviceIcons.slice(0, 3).map((s) => {
                const Icon = s.Icon
                return (
                  <div key={s.id} id={s.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '.5rem', padding: '.8rem', borderRadius: 14, background: T.light ? 'rgba(255,255,255,.9)' : 'rgba(11,26,16,.8)', border: `1px solid ${T.border}`, backdropFilter: 'blur(8px)', justifySelf: 'center' }}>
                    <div style={{ width: 42, height: 42, borderRadius: 12, background: 'rgba(136,202,83,.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={20} style={{ color: T.green }} />
                    </div>
                    <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.6rem', fontWeight: 600, color: T.textMuted, whiteSpace: 'nowrap' }}>{s.label}</span>
                  </div>
                )
              })}
              <div id="svc-beam-center-services" style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg,rgba(136,202,83,.25),rgba(136,202,83,.08))', border: '2px solid rgba(136,202,83,.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(12px)', justifySelf: 'center', boxShadow: '0 0 40px rgba(136,202,83,.2)', flexShrink: 0 }}>
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.75rem', fontWeight: 900, color: '#88ca53', textAlign: 'center', letterSpacing: '-.03em' }}>AKA<br/>TECH</span>
              </div>
              {serviceIcons.slice(3).map((s) => {
                const Icon = s.Icon
                return (
                  <div key={s.id} id={s.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '.5rem', padding: '.8rem', borderRadius: 14, background: T.light ? 'rgba(255,255,255,.9)' : 'rgba(11,26,16,.8)', border: `1px solid ${T.border}`, backdropFilter: 'blur(8px)', justifySelf: 'center' }}>
                    <div style={{ width: 42, height: 42, borderRadius: 12, background: 'rgba(136,202,83,.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={20} style={{ color: T.green }} />
                    </div>
                    <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.6rem', fontWeight: 600, color: T.textMuted, whiteSpace: 'nowrap' }}>{s.label}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </BlurReveal>

        {/* Service cards avec BlurReveal alternés */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: '1.2rem' }}>
          {SERVICES.map(({ icon, n, title, desc, price, del }, i) => {
            const Icon = ICON_MAP[icon] || Globe
            const directions = ['up', 'right', 'up', 'left', 'up', 'right']
            return (
              <BlurReveal key={title} delay={i * 0.08} direction={directions[i % directions.length]}>
                <motion.div className="sku-card"
                  whileHover={{ y: -5 }}
                  style={{ padding: '1.8rem', position: 'relative', overflow: 'hidden', height: '100%' }}>
                  <div style={{ position: 'absolute', top: 0, right: 0, width: 80, height: 80, background: 'radial-gradient(circle at 100% 0%,rgba(136,202,83,.08),transparent 70%)', pointerEvents: 'none' }} />
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.2rem' }}>
                    <div style={{ width: 50, height: 50, borderRadius: 12, background: 'rgba(136,202,83,.1)', border: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={22} style={{ color: T.green }} />
                    </div>
                    <div>
                      <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.65rem', fontWeight: 600, color: T.greenSub, letterSpacing: '.1em', marginBottom: '.2rem' }}>{n}</div>
                      <h3 style={{ fontSize: '1rem', fontWeight: 700, color: T.textMain, fontFamily: "'JetBrains Mono',monospace" }}>{title}</h3>
                    </div>
                  </div>
                  <p style={{ fontSize: '.83rem', color: T.textSub, lineHeight: 1.7, marginBottom: '1.2rem' }}>{desc}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '.9rem', borderTop: `1px solid ${T.border}` }}>
                    <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.9rem', fontWeight: 800, color: T.green }}>{price}</span>
                    <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.62rem', color: T.textMuted, display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                      <Timer size={11} style={{ color: T.green }} />{del}
                    </span>
                  </div>
                </motion.div>
              </BlurReveal>
            )
          })}
        </div>

        <BlurReveal delay={0.5} style={{ textAlign: 'center', marginTop: '3rem' }}>
          <Link href="/services" className="btn-ghost" style={{ fontSize: '.9rem' }}>
            Voir tous les services <ArrowRight size={14} />
          </Link>
        </BlurReveal>
      </div>
    </section>
  )
}

// ── WHY US ───────────────────────────────────────────────────
function WhyUs() {
  const T = useTheme()
  const items = [
    { n: '01', title: 'Livraison dans les délais', desc: "Pas de mauvaises surprises. Chaque projet est livré à la date convenue, avec un suivi régulier jusqu'à la mise en ligne." },
    { n: '02', title: 'Design 100% sur mesure', desc: "Votre site est unique, pensé pour votre activité. Zéro template, zéro copier-coller — une identité visuelle qui vous ressemble." },
    { n: '03', title: 'Support & Formation inclus', desc: "Vous repartez autonome. Une formation est incluse pour gérer votre site facilement, sans dépendre d'un technicien." },
    { n: '04', title: 'SEO & Performance optimisés', desc: "Un site rapide, visible sur Google. Vos clients vous trouvent plus facilement — et votre crédibilité monte instantanément." },
  ]
  const dirs = ['right', 'up', 'left', 'up']
  return (
    <section style={{ padding: '7rem 5%', background: T.bgAlt, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', right: '-2%', top: '50%', transform: 'translateY(-50%)', fontFamily: "'JetBrains Mono',monospace", fontSize: 'clamp(12rem,22vw,20rem)', fontWeight: 900, color: T.light ? 'rgba(136,202,83,.04)' : 'rgba(136,202,83,.03)', lineHeight: 1, pointerEvents: 'none', userSelect: 'none', letterSpacing: '-.05em' }}>
        TRUST
      </div>
      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <BlurReveal delay={0.12}>
            <h2 style={{ position: 'relative', fontSize: 'clamp(1.9rem,3vw,2.6rem)', fontWeight: 800, fontFamily: "'JetBrains Mono',monospace", color: T.textMain, letterSpacing: '-.03em' }}>
              <GhostTitle text="Pourquoi les entrepreneurs choisissent AKATech." />
              Pourquoi les entrepreneurs{' '}
              <GreenUnderline><span className="text-gradient"><LetterReveal text="choisissent AKATech." stagger={0.03} /></span></GreenUnderline>
            </h2>
          </BlurReveal>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: '1rem' }}>
          {items.map(({ n, title, desc }, i) => (
            <BlurReveal key={n} delay={i * 0.1} direction={dirs[i]}>
              <motion.div className="sku-card" whileHover={{ y: -4 }}
                style={{ padding: '1.8rem', height: '100%', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, right: 0, width: 80, height: 80, background: 'radial-gradient(circle at 100% 0%,rgba(136,202,83,.1),transparent 70%)', pointerEvents: 'none' }} />
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.9rem', fontWeight: 800, color: T.green, opacity: .3, lineHeight: 1, marginBottom: '.8rem' }}>{n}</div>
                <h3 style={{ fontSize: '.95rem', fontWeight: 700, color: T.textMain, fontFamily: "'JetBrains Mono',monospace", marginBottom: '.4rem' }}>
                  <LetterReveal text={title} stagger={0.025} />
                </h3>
                <p style={{ fontSize: '.8rem', color: T.textSub, lineHeight: 1.6 }}>{desc}</p>
              </motion.div>
            </BlurReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── PROJECTS 3D CAROUSEL ─────────────────────────────────────
function ProjectsCarousel() {
  const T = useTheme()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [center, setCenter] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const autoRef = useRef(null)
  const CARDS = [
    ...PROJECTS.filter(p => p.id === 12 || p.id === 11),
    ...PROJECTS.filter(p => p.id !== 12 && p.id !== 11).slice(0, 4),
  ]
  const N = CARDS.length

  const advance = useCallback(() => setCenter(c => (c + 1) % N), [N])

  useEffect(() => {
    if (!inView || isHovered) return
    autoRef.current = setInterval(advance, 3200)
    return () => clearInterval(autoRef.current)
  }, [inView, isHovered, advance])

  const getCardStyle = (i) => {
    // Position relative to center
    let offset = i - center
    // Wrap around
    if (offset > N / 2) offset -= N
    if (offset < -N / 2) offset += N

    const abs = Math.abs(offset)
    if (abs > 2) return null // don't render far cards

    const xMap  = [0, 310, 580, -310, -580]
    const zMap  = [0, -80, -200, -80, -200]
    const scaleMap = [1, .82, .66, .82, .66]
    const opacMap  = [1, .85, .45, .85, .45]
    const rotMap   = [0, 12, 20, -12, -20]
    const zIdxMap  = [10, 8, 4, 8, 4]

    const idx = ((offset % N) + N) % N
    const clampIdx = Math.min(idx, 4)

    return {
      x: offset >= 0 ? xMap[Math.min(offset, 2)] : -xMap[Math.min(-offset, 2)],
      z: zMap[Math.min(abs, 2)],
      scale: scaleMap[Math.min(abs, 2)],
      opacity: opacMap[Math.min(abs, 2)],
      rotateY: offset >= 0 ? rotMap[Math.min(offset, 2)] : -rotMap[Math.min(-offset, 2)],
      zIndex: zIdxMap[Math.min(abs, 2)],
    }
  }

  return (
    <section ref={ref} style={{ padding: '7rem 5%', background: T.bg, position: 'relative', overflow: 'hidden' }}>
      <div className="grid-bg" style={{ position: 'absolute', inset: 0, opacity: .2 }} />
      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '4rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <BlurReveal delay={0.1} direction="left">
              <h2 style={{ position: 'relative', fontSize: 'clamp(1.9rem,3.5vw,2.8rem)', fontWeight: 800, fontFamily: "'JetBrains Mono',monospace", color: T.textMain, letterSpacing: '-.03em' }}>
                <GhostTitle text="Nos dernières réalisations livrées" />
                Nos dernières{' '}
                <GreenUnderline><span className="text-gradient"><LetterReveal text="réalisations livrées" stagger={0.03} /></span></GreenUnderline>
              </h2>
            </BlurReveal>
          </div>
          <BlurReveal direction="right">
            <Link href="/projects" className="btn-ghost" style={{ padding: '.65rem 1.4rem', fontSize: '.82rem' }}>
              Toutes les réalisations <ArrowRight size={13} />
            </Link>
          </BlurReveal>
        </div>

        {/* 3D stage */}
        <div
          style={{ perspective: '1200px', height: 420, position: 'relative', marginBottom: '2.5rem' }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', transformStyle: 'preserve-3d' }}>
            {CARDS.map((project, i) => {
              const cs = getCardStyle(i)
              if (!cs) return null
              const isCenter = i === center
              return (
                <motion.div
                  key={project.title}
                  animate={{ x: cs.x, z: cs.z, scale: cs.scale, opacity: cs.opacity, rotateY: cs.rotateY }}
                  transition={{ type: 'spring', stiffness: 220, damping: 28 }}
                  style={{ position: 'absolute', width: 300, zIndex: cs.zIndex, cursor: isCenter ? 'default' : 'pointer', transformStyle: 'preserve-3d' }}
                  onClick={() => !isCenter && setCenter(i)}
                >
                  <div className="sku-card" style={{ overflow: 'hidden', border: isCenter ? '1px solid rgba(136,202,83,.45)' : `1px solid ${T.border}`, boxShadow: isCenter ? '0 0 40px rgba(136,202,83,.2), 12px 12px 40px rgba(0,0,0,.6)' : undefined, transition: 'border-color .3s, box-shadow .3s' }}>

                    {/* Image */}
                    <div style={{ height: 200, position: 'relative', overflow: 'hidden' }}>
                      <img src={project.img} alt={project.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform .5s', transform: isCenter ? 'scale(1.04)' : 'scale(1)' }} />
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(6,14,9,.95) 0%,rgba(6,14,9,.3) 50%,transparent)' }} />

                      {/* Type badge */}
                      <div className="no-pill-mobile" style={{ position: 'absolute', top: '.8rem', left: '.8rem', padding: '.25rem .7rem', borderRadius: 100, background: 'rgba(136,202,83,.15)', backdropFilter: 'blur(8px)', border: '1px solid rgba(136,202,83,.3)', fontFamily: "'JetBrains Mono',monospace", fontSize: '.65rem', fontWeight: 600, color: '#88ca53' }}>
                        {project.type}
                      </div>

                      {/* Live badge */}
                      {project.live && (
                        <div className="no-pill-mobile" style={{ position: 'absolute', top: '.8rem', right: '.8rem', display: 'flex', alignItems: 'center', gap: '.3rem', padding: '.22rem .6rem', borderRadius: 100, background: 'rgba(136,202,83,.88)', fontFamily: "'JetBrains Mono',monospace", fontSize: '.54rem', color: '#fff', fontWeight: 700 }}>
                          <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#fff', display: 'inline-block', animation: 'dot-blink 1.4s ease-in-out infinite' }} />
                          LIVE
                        </div>
                      )}

                      {/* Result */}
                      <div className="no-pill-mobile" style={{ position: 'absolute', bottom: '.8rem', right: '.8rem', padding: '.25rem .7rem', borderRadius: 100, background: 'rgba(0,0,0,.6)', backdropFilter: 'blur(6px)', border: '1px solid rgba(136,202,83,.3)', fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, fontSize: '1rem', color: '#88ca53' }}>
                        {project.result}
                      </div>
                    </div>

                    {/* Content */}
                    <div style={{ padding: '1.2rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '.35rem', gap: '.6rem' }}>
                        <h3 style={{ fontSize: '.98rem', fontWeight: 700, color: T.textMain, fontFamily: "'JetBrains Mono',monospace" }}>{project.title}</h3>
                        {project.url && (
                          <a href={project.url} target="_blank" rel="noreferrer"
                            onClick={e => e.stopPropagation()}
                            style={{ display: 'flex', alignItems: 'center', gap: '.25rem', fontFamily: "'JetBrains Mono',monospace", fontSize: '.65rem', fontWeight: 600, color: T.green, textDecoration: 'none', flexShrink: 0, padding: '.22rem .6rem', borderRadius: 100, border: `1px solid ${T.border}`, background: 'rgba(136,202,83,.06)', transition: 'all .2s' }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(136,202,83,.18)'; e.currentTarget.style.borderColor = '#88ca53' }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(136,202,83,.06)'; e.currentTarget.style.borderColor = T.border }}>
                            <ExternalLink size={9} /> Voir
                          </a>
                        )}
                      </div>
                      <p style={{ fontSize: '.75rem', color: T.textSub, lineHeight: 1.55, marginBottom: '.9rem' }}>{project.desc.slice(0, 90)}…</p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.3rem' }}>
                        {project.tech.slice(0, 3).map(t => (
                          <span key={t} style={{ padding: '.18rem .55rem', borderRadius: 100, background: 'rgba(136,202,83,.07)', border: `1px solid ${T.border}`, fontFamily: "'JetBrains Mono',monospace", fontSize: '.65rem', fontWeight: 600, color: T.green }}>{t}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Dot indicators */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '.45rem' }}>
          {CARDS.map((_, i) => (
            <button key={i} onClick={() => setCenter(i)}
              style={{ width: i === center ? 24 : 8, height: 8, borderRadius: 4, background: i === center ? '#88ca53' : 'rgba(136,202,83,.2)', border: 'none', cursor: 'pointer', transition: 'all .3s' }} />
          ))}
        </div>
      </div>
    </section>
  )
}

// ── TESTIMONIALS ─────────────────────────────────────────────
function Testimonials() {
  const T = useTheme()
  const [idx, setIdx] = useState(0)
  const t = TESTIMONIALS[idx]

  useEffect(() => {
    const timer = setInterval(() => setIdx(i => (i + 1) % TESTIMONIALS.length), 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section style={{ padding: '7rem 5%', background: T.bgAlt, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle,rgba(136,202,83,.05),transparent 65%)', pointerEvents: 'none' }} />
      <div style={{ maxWidth: 900, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <BlurReveal delay={0.1}>
            <h2 style={{ position: 'relative', fontSize: 'clamp(1.9rem,3.5vw,2.6rem)', fontWeight: 800, fontFamily: "'JetBrains Mono',monospace", color: T.textMain, letterSpacing: '-.03em' }}>
              <GhostTitle text="Ce que disent nos clients" />
              Ce que disent nos <GreenUnderline><span className="text-gradient">clients</span></GreenUnderline>
            </h2>
          </BlurReveal>
        </div>

        <BlurReveal delay={0.2}>
          <AnimatePresence mode="wait">
            <motion.div key={idx} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: .4 }}
              className="sku-card" style={{ padding: '2.5rem', textAlign: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.2rem' }}>
                {[1,2,3,4,5].map(s => <Star key={s} size={18} fill="#88ca53" style={{ color: '#88ca53' }} />)}
              </div>
              <blockquote style={{ fontSize: '1.05rem', color: T.textMain, lineHeight: 1.75, fontStyle: 'italic', marginBottom: '2rem', maxWidth: 640, margin: '0 auto 2rem' }}>
                "{t.text}"
              </blockquote>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
                <div style={{ width: 52, height: 52, borderRadius: '50%', overflow: 'hidden', border: '2px solid rgba(136,202,83,.35)' }}>
                  <LazyImg src={t.img} alt={t.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    placeholder={<div style={{ width: 52, height: 52, background: 'rgba(136,202,83,.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#88ca53', fontFamily: "'JetBrains Mono',monospace", fontWeight: 700 }}>{t.name[0]}</div>} />
                </div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: 700, color: T.textMain, fontFamily: "'JetBrains Mono',monospace", fontSize: '.9rem' }}>{t.name}</div>
                  <div style={{ fontSize: '.72rem', color: T.textMuted, fontFamily: "'JetBrains Mono',monospace" }}>{t.role}</div>
                </div>
                <span className="no-pill-mobile" style={{ marginLeft: 'auto', padding: '.3rem .8rem', borderRadius: 100, background: 'rgba(136,202,83,.12)', border: '1px solid rgba(136,202,83,.25)', color: '#88ca53', fontFamily: "'JetBrains Mono',monospace", fontSize: '.65rem', fontWeight: 600 }}>{t.result}</span>
              </div>
            </motion.div>
          </AnimatePresence>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '.5rem', marginTop: '1.5rem' }}>
            {TESTIMONIALS.map((_, i) => (
              <button key={i} onClick={() => setIdx(i)}
                style={{ width: i === idx ? 24 : 8, height: 8, borderRadius: 4, background: i === idx ? '#88ca53' : 'rgba(136,202,83,.2)', border: 'none', cursor: 'pointer', transition: 'all .3s' }} />
            ))}
          </div>
        </BlurReveal>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════
// ── DOMAINES D'INTERVENTION — numérotés 01→06, V-labs style ─
// ═══════════════════════════════════════════════════════════════
const DOMAINES_SVC = [
  { n: '01', Icon: Globe,        title: 'Sites Vitrine & Landing Pages',   desc: "Une présence pro optimisée pour convertir. Design sur mesure, SEO intégré, livraison en 7–14 jours.", tag: 'Vitrine'       },
  { n: '02', Icon: ShoppingCart, title: 'E-Commerce & Boutiques en ligne',  desc: "Paiement Mobile Money, gestion stock, tableau de bord admin. Votre boutique opérationnelle en 2 semaines.", tag: 'E-Commerce'   },
  { n: '03', Icon: Cpu,          title: 'Applications SaaS & Métier',       desc: "Automatisez vos processus internes. Multi-rôles, dashboard temps réel, API REST robuste.", tag: 'SaaS'         },
  { n: '04', Icon: Server,       title: 'Back-end & API',                   desc: "Architecture solide, sécurisée et scalable. Django, NestJS, PostgreSQL — prêt pour la production.", tag: 'Back-end'     },
  { n: '05', Icon: Palette,      title: 'Portfolios & Identités créatives', desc: "Des vitrines animées et percutantes pour créatifs, graphistes et freelances qui veulent plus de clients.", tag: 'Portfolio'   },
  { n: '06', Icon: Wrench,       title: 'Maintenance & Évolutions',         desc: "Votre investissement protégé sur la durée. Mises à jour, nouvelles fonctionnalités, support sous 48h.", tag: 'Support'     },
]

function DomainesIntervention() {
  const T = useTheme()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section ref={ref} style={{ padding: '7rem 5%', background: T.bgAlt, position: 'relative', overflow: 'hidden' }}>
      {/* Big déco text */}
      <div aria-hidden style={{ position: 'absolute', left: '-1%', top: '50%', transform: 'translateY(-50%)', fontFamily: "'JetBrains Mono',monospace", fontSize: 'clamp(8rem,16vw,16rem)', fontWeight: 900, color: T.light ? 'rgba(136,202,83,.04)' : 'rgba(136,202,83,.03)', lineHeight: 1, pointerEvents: 'none', userSelect: 'none', letterSpacing: '-.05em' }}>DOM</div>

      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <BlurReveal delay={0.12}>
            <h2 style={{ position: 'relative', fontSize: 'clamp(1.9rem,3.5vw,2.8rem)', fontWeight: 800, fontFamily: "'JetBrains Mono',monospace", color: T.textMain, letterSpacing: '-.03em', lineHeight: 1.15 }}>
              <GhostTitle text="Dans quel axe de création s'inscrit votre projet ?" />
              Dans quel axe de création{' '}
              <GreenUnderline><span className="text-gradient">s'inscrit votre projet ?</span></GreenUnderline>
            </h2>
          </BlurReveal>
          <BlurReveal delay={0.2}>
            <p style={{ fontSize: '1rem', color: T.textSub, lineHeight: 1.75, maxWidth: 540, margin: '1rem auto 0' }}>
              De la vitrine au SaaS, de la boutique au portfolio — AKATech intervient sur l'ensemble de la chaîne digitale.
            </p>
          </BlurReveal>
        </div>

        {/* Grille */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))', gap: '1px', background: T.border, borderRadius: 20, overflow: 'hidden', border: `1px solid ${T.border}` }}>
          {DOMAINES_SVC.map(({ n, Icon, title, desc, tag }, i) => (
            <motion.div
              key={n}
              initial={{ opacity: 0, y: 22 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: .52, delay: i * .07, ease: [.22,1,.36,1] }}
              whileHover="hov"
              style={{ background: T.bgAlt, padding: '2.2rem', position: 'relative', overflow: 'hidden' }}
            >
              <motion.div variants={{ hov: { opacity: 1 } }} initial={{ opacity: 0 }} transition={{ duration: .2 }}
                style={{ position: 'absolute', inset: 0, background: 'radial-gradient(400px circle at 30% 30%, rgba(136,202,83,.07), transparent 65%)', pointerEvents: 'none' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.4rem' }}>
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '2.8rem', fontWeight: 900, color: T.light ? 'rgba(136,202,83,.16)' : 'rgba(136,202,83,.13)', lineHeight: 1, letterSpacing: '-.05em' }}>{n}</span>
                <span style={{ padding: '.22rem .72rem', borderRadius: 100, background: 'rgba(136,202,83,.08)', border: '1px solid rgba(136,202,83,.2)', fontFamily: "'JetBrains Mono',monospace", fontSize: '.6rem', fontWeight: 700, color: '#88ca53', letterSpacing: '.06em', textTransform: 'uppercase' }}>{tag}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem', marginBottom: '.9rem' }}>
                <motion.div variants={{ hov: { background: 'rgba(136,202,83,.2)' } }}
                  style={{ width: 42, height: 42, borderRadius: 11, background: 'rgba(136,202,83,.1)', border: '1px solid rgba(136,202,83,.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background .2s' }}>
                  <Icon size={20} style={{ color: '#88ca53' }} />
                </motion.div>
                <h3 style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.97rem', fontWeight: 800, color: T.textMain, lineHeight: 1.25, letterSpacing: '-.02em' }}>{title}</h3>
              </div>
              <p style={{ fontSize: '.83rem', color: T.textSub, lineHeight: 1.7 }}>{desc}</p>

              <motion.div variants={{ hov: { scaleX: 1 } }} initial={{ scaleX: 0 }}
                style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, transparent, #88ca53, transparent)', transformOrigin: 'left' }} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════
// ── STACK TECH — technologies maîtrisées ─────────────────────
// ═══════════════════════════════════════════════════════════════
const STACK_ROWS = [
  { label: 'Front-end',  items: ['React', 'Next.js', 'TypeScript', 'Framer Motion', 'Tailwind CSS', 'Vite'] },
  { label: 'Back-end',   items: ['Django', 'Flask', 'NestJS', 'Node.js', 'REST API', 'GraphQL'] },
  { label: 'Base de données', items: ['PostgreSQL', 'MySQL', 'MongoDB', 'Prisma', 'Redis'] },
  { label: 'DevOps & Cloud',  items: ['Vercel', 'AWS', 'Docker', 'Nginx', 'GitHub Actions', 'Cloudflare'] },
  { label: 'Paiement',        items: ['Orange Money API', 'Wave', 'MTN MoMo', 'Stripe', 'PayDunya'] },
]

function StackTech() {
  const T = useTheme()
  return (
    <section style={{ padding: '6rem 5%', background: T.bg, position: 'relative', overflow: 'hidden' }}>
      <div className="grid-bg" style={{ position: 'absolute', inset: 0, opacity: .18 }} />
      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <BlurReveal delay={0.1}>
            <h2 style={{ position: 'relative', fontSize: 'clamp(1.9rem,3.5vw,2.6rem)', fontWeight: 800, fontFamily: "'JetBrains Mono',monospace", color: T.textMain, letterSpacing: '-.03em' }}>
              <GhostTitle text="Les outils qui font la différence" />
              Les outils qui font{' '}
              <GreenUnderline><span className="text-gradient">la différence</span></GreenUnderline>
            </h2>
          </BlurReveal>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          {STACK_ROWS.map(({ label, items }, ri) => (
            <BlurReveal key={label} delay={ri * 0.08}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.65rem', fontWeight: 700, color: T.textMuted, textTransform: 'uppercase', letterSpacing: '.1em', flexShrink: 0, width: 120, textAlign: 'right' }}>
                  {label}
                </span>
                <div style={{ height: 1, width: 20, background: T.border, flexShrink: 0 }} />
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.5rem' }}>
                  {items.map((s, si) => (
                    <motion.span
                      key={s}
                      initial={{ opacity: 0, scale: .9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: ri * .06 + si * .04 }}
                      whileHover={{ y: -2, background: 'rgba(136,202,83,.15)', borderColor: 'rgba(136,202,83,.4)' }}
                      style={{ padding: '.32rem .85rem', background: 'rgba(136,202,83,.06)', border: `1px solid ${T.border}`, borderRadius: 100, fontFamily: "'JetBrains Mono',monospace", fontSize: '.7rem', fontWeight: 600, color: T.green, cursor: 'default', transition: 'all .2s' }}>
                      {s}
                    </motion.span>
                  ))}
                </div>
              </div>
            </BlurReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── PROCESS — Sticky stacking (comme home) ────────────────────
function Process() {
  const T = useTheme()
  const steps = [
    { n: '01', icon: MessageCircle, title: "On vous écoute", desc: "Vous décrivez votre projet, vos objectifs et votre budget. Devis gratuit et personnalisé, sans engagement.", bg: T.light ? '#f4faf5' : '#030c06', shadow: false },
    { n: '02', icon: Target, title: "On planifie", desc: "On définit ensemble la meilleure solution : technologies, design, délais et fonctionnalités.", bg: T.light ? '#ffffff' : '#051208', shadow: true },
    { n: '03', icon: Code, title: "On développe", desc: "Votre solution prend vie avec un code propre et un design soigné. Vous suivez l'avancement à chaque étape.", bg: T.light ? '#f4faf5' : '#030c06', shadow: true },
    { n: '04', icon: Rocket, title: "On livre & on forme", desc: "Mise en ligne, tests, formation et support inclus. Vous repartez avec un outil prêt à attirer des clients.", bg: T.light ? '#e8f8ec' : '#061a0a', shadow: true },
  ]
  return (
    <section style={{ position: 'relative' }}>
      <div style={{ position: 'sticky', top: 0, zIndex: 50, textAlign: 'center', padding: '2.5rem 5% 1.5rem', background: steps[0].bg, borderBottom: `1px solid ${T.border}` }}>
        <BlurReveal delay={0.1}>
          <h2 style={{ position: 'relative', fontSize: 'clamp(1.9rem,3.5vw,2.8rem)', fontWeight: 800, fontFamily: "'JetBrains Mono',monospace", color: T.textMain, letterSpacing: '-.03em', margin: 0 }}>
            <GhostTitle text="De l'idée à la mise en ligne" />
            De l'idée à la{' '}
            <GreenUnderline><span className="text-gradient"><LetterReveal text="mise en ligne" stagger={0.04} /></span></GreenUnderline>
          </h2>
        </BlurReveal>
      </div>

      {steps.map(({ n, icon: Icon, title, desc, bg, shadow }, i) => (
        <div key={n} style={{ position: 'sticky', top: 96, zIndex: i + 1, minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: bg, borderRadius: i > 0 ? '28px 28px 0 0' : 0, boxShadow: shadow ? '0 -24px 60px rgba(0,0,0,.22)' : 'none', padding: '4rem 5%' }}>
          <BlurReveal delay={0.05}>
            <div style={{ maxWidth: 720, width: '100%', display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '3rem', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: 80, height: 80, borderRadius: 24, background: 'rgba(136,202,83,.12)', border: '1px solid rgba(136,202,83,.28)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={32} style={{ color: '#88ca53' }} />
                </div>
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '3.5rem', fontWeight: 900, color: 'rgba(136,202,83,.12)', lineHeight: 1, letterSpacing: '-.04em' }}>{n}</span>
              </div>
              <div>
                <h3 style={{ fontSize: 'clamp(1.5rem,3vw,2.2rem)', fontWeight: 800, fontFamily: "'JetBrains Mono',monospace", color: T.textMain, letterSpacing: '-.03em', marginBottom: '1rem' }}>
                  <LetterReveal text={title} stagger={0.035} />
                </h3>
                <p style={{ fontSize: '1.05rem', color: T.textSub, lineHeight: 1.8, maxWidth: 480 }}>{desc}</p>
                <div style={{ marginTop: '1.5rem', display: 'flex', gap: '.4rem' }}>
                  {steps.map((_, si) => (
                    <div key={si} style={{ height: 3, borderRadius: 2, flex: si <= i ? 2 : 1, background: si <= i ? '#88ca53' : T.border, transition: 'all .4s' }} />
                  ))}
                </div>
              </div>
            </div>
          </BlurReveal>
        </div>
      ))}
      <div style={{ height: '5vh', background: steps[steps.length - 1].bg }} />
    </section>
  )
}

// ── PAGE EXPORT ────────────────────────────────────────────────
export default function HomePage() {
  return (
    <div style={{ paddingTop: 0 }}>
      <Hero />
      <MarqueeStrip />
      <ServicesPreview />

      <div style={{ position: 'relative' }}>
        <StickyCTABlock
          message="Vous avez une idée de projet ? On en parle — c'est gratuit et sans engagement."
          cta="Discuter sur WhatsApp"
          variant="default"
          zIndex={2}
        />
        <div style={{ position: 'relative', zIndex: 3 }}>
          <WhyUs />
        </div>
      </div>

      <StackTech />
      <Process />
      <MarqueeStrip />
      <ProjectsCarousel />

      <div style={{ position: 'relative' }}>
        <StickyCTABlock
          message="Ces projets ont été livrés dans les délais, avec formation incluse. Le vôtre peut l'être aussi."
          cta="Démarrer mon projet"
          variant="strong"
          zIndex={2}
        />
        <div style={{ position: 'relative', zIndex: 3 }}>
          <Testimonials />
        </div>
      </div>

      <StickyCTABlock
        message="Comme eux, donnez à votre activité la présence digitale qu'elle mérite."
        cta="Rejoindre nos clients →"
        variant="dark"
        zIndex={2}
        rounded={true}
      />
    </div>
  )
}