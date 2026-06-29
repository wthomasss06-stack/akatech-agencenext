'use client'
import { useRef, useState, useEffect, useCallback } from 'react'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'
import {
  Clock, ArrowRight, Tag, Search, BookOpen,
  TrendingUp, Globe, ShoppingCart, Code, Zap,
  Target, Rocket, PenTool,
} from 'lucide-react'
import Image from 'next/image'
import { useTheme } from '@/lib/theme'
import { GhostTitle, GreenUnderline, PageCTA } from '@/components/ui/index'
import AuroraHero from '@/components/ui/AuroraHero'
import { BLOG_POSTS } from '@/lib/data'

const CATEGORIES = ['Tous', 'Stratégie Digitale', 'E-Commerce', 'Développement Web', 'SEO']
const CAT_ICONS = { 'Stratégie Digitale': TrendingUp, 'E-Commerce': ShoppingCart, 'Développement Web': Code, 'SEO': Globe }

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
      const wProg = Math.max(0, Math.min(1, (progress - 0.15) / (0.65 - 0.15)))
      words.forEach((span, i) => {
        if (!span) return
        const local = Math.max(0, Math.min(1, (wProg - (i / (words.length - 1)) * 0.78) / 0.24))
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
// ── HERO ─────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════
function HeroBlog() {
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
    <section style={{ height: '100vh', minHeight: 640, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#060e09' }}>
      <div ref={layerBgRef} style={{ position: 'absolute', inset: '-8%', zIndex: 1, willChange: 'transform, filter', transition: 'transform .1s ease-out' }}>
        <AuroraHero labels={[]} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 20%, rgba(6,14,9,.95) 100%)' }} />
      </div>
      <div ref={layerMidRef} style={{ position: 'relative', zIndex: 10, maxWidth: 800, padding: '0 5%', textAlign: 'center', willChange: 'transform, opacity, filter', transition: 'transform .1s ease-out' }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7, ease: [.22,1,.36,1] }}>
          <h1 style={{ position: 'relative', fontSize: 'clamp(2.2rem,5vw,3.8rem)', fontWeight: 800, fontFamily: "'JetBrains Mono',monospace", color: 'rgba(255,255,255,.88)', letterSpacing: '-.04em', lineHeight: 1.1, marginBottom: '1.2rem' }}>
            <GhostTitle text="Insights & conseils pour votre business digital" />
            Insights & conseils<br />
            <GreenUnderline><span className="text-gradient">pour votre business digital</span></GreenUnderline>
          </h1>
          <p style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,.55)', lineHeight: 1.75, maxWidth: 520, margin: '0 auto' }}>
            Stratégie digitale, développement web, SEO et e-commerce — des contenus concrets pour les entrepreneurs ivoiriens.
          </p>
        </motion.div>
      </div>
      <div ref={layerForeRef} style={{ position: 'absolute', inset: 0, zIndex: 20, pointerEvents: 'none', willChange: 'transform, opacity', transition: 'transform .1s ease-out' }}>
        {[{left:'8%',top:'25%',s:4,op:.18,dur:3.8,dy:0},{left:'22%',top:'68%',s:3,op:.11,dur:5.1,dy:1.2},{left:'60%',top:'22%',s:4,op:.20,dur:4.4,dy:0.6},{left:'75%',top:'70%',s:3,op:.09,dur:6.2,dy:1.8},{left:'88%',top:'15%',s:4,op:.15,dur:3.2,dy:0.3}].map((p,i) => (
          <motion.div key={i} style={{ position:'absolute', width:p.s, height:p.s, borderRadius:'50%', background:'#88ca53', left:p.left, top:p.top, opacity:p.op }}
            animate={{ y:[0,-18,0] }} transition={{ duration:p.dur, repeat:Infinity, ease:'easeInOut', delay:p.dy }} />
        ))}
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════
// ── FEATURED POST — BlurReveal + TiltCard + LetterReveal ─────
// ═══════════════════════════════════════════════════════════════
function FeaturedPost() {
  const T = useTheme()
  const post = BLOG_POSTS[0]
  const ref  = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section ref={ref} style={{ padding: '3rem 5% 0', background: T.bgAlt }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        {/* ── CARTE VEDETTE ── */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: .6, ease: [.22, 1, .36, 1] }}
          style={{
            borderRadius: 22,
            overflow: 'hidden',
            border: `1px solid ${T.border}`,
            background: T.bg,
            display: 'grid',
            gridTemplateColumns: '52% 48%',
            minHeight: 380,
            position: 'relative',
            boxShadow: T.light
              ? '0 8px 40px rgba(0,0,0,.08)'
              : '0 8px 40px rgba(0,0,0,.4)',
          }}
        >
          {/* ── IMAGE ── */}
          <div style={{ position: 'relative', overflow: 'hidden' }}>
            <motion.img
              src={post.img}
              alt={post.title}
              initial={{ scale: 1.08 }}
              animate={inView ? { scale: 1 } : {}}
              transition={{ duration: 1.2, ease: [.22, 1, .36, 1] }}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
            {/* Gradient overlay droite */}
            <div style={{
              position: 'absolute', inset: 0,
              background: T.light
                ? 'linear-gradient(90deg,transparent 55%,rgba(255,255,255,.7) 100%)'
                : 'linear-gradient(90deg,transparent 50%,rgba(3,10,6,.85) 100%)',
              pointerEvents: 'none',
            }} />
            {/* Gradient overlay bas */}
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,transparent 60%,rgba(0,0,0,.35) 100%)', pointerEvents: 'none' }} />

            {/* Badge vedette */}
            <div style={{
              position: 'absolute', top: '1.2rem', left: '1.2rem',
              padding: '.3rem .9rem', borderRadius: 100,
              background: 'rgba(136,202,83,.18)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(136,202,83,.4)',
              fontFamily: "'JetBrains Mono',monospace", fontSize: '.6rem', fontWeight: 700,
              color: '#88ca53', letterSpacing: '.06em', textTransform: 'uppercase',
            }}>
              ⭐ Article vedette
            </div>

            {/* Date bas gauche */}
            <div style={{
              position: 'absolute', bottom: '1.2rem', left: '1.2rem',
              fontFamily: "'JetBrains Mono',monospace", fontSize: '.65rem', fontWeight: 600,
              color: 'rgba(255,255,255,.7)',
            }}>
              {post.date}
            </div>
          </div>

          {/* ── CONTENU ── */}
          <div style={{
            padding: '2.8rem 2.8rem 2.8rem 2.4rem',
            display: 'flex', flexDirection: 'column', justifyContent: 'center',
            position: 'relative',
          }}>
            {/* Barre verte gauche */}
            <motion.div
              initial={{ scaleY: 0 }}
              animate={inView ? { scaleY: 1 } : {}}
              transition={{ delay: .4, duration: .6, ease: [.22,1,.36,1] }}
              style={{
                position: 'absolute', left: 0, top: '2.5rem', bottom: '2.5rem',
                width: 3, borderRadius: 2,
                background: 'linear-gradient(180deg,#88ca53,rgba(136,202,83,.2))',
                transformOrigin: 'top',
              }}
            />

            {/* Meta : catégorie + temps */}
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: .2, duration: .45 }}
              style={{ display: 'flex', alignItems: 'center', gap: '.7rem', marginBottom: '1rem' }}
            >
              <span style={{
                padding: '.28rem .85rem', borderRadius: 100,
                background: 'rgba(136,202,83,.1)', border: '1px solid rgba(136,202,83,.25)',
                fontFamily: "'JetBrains Mono',monospace", fontSize: '.65rem', fontWeight: 700,
                color: '#88ca53', letterSpacing: '.06em',
              }}>
                {post.category}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '.3rem', fontSize: '.72rem', color: T.textMuted, fontFamily: "'JetBrains Mono',monospace" }}>
                <Clock size={11} /> {post.readTime}
              </span>
            </motion.div>

            {/* Titre — NO LetterReveal pour éviter le découpage de mots */}
            <motion.h2
              initial={{ opacity: 0, x: 20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: .28, duration: .5, ease: [.22,1,.36,1] }}
              style={{
                fontFamily: "'JetBrains Mono',monospace",
                fontWeight: 800,
                fontSize: 'clamp(1.25rem, 2vw, 1.55rem)',
                color: T.textMain,
                letterSpacing: '-.03em',
                lineHeight: 1.3,
                marginBottom: '1rem',
                /* ── FIX word-break ── */
                wordBreak: 'normal',
                overflowWrap: 'break-word',
                hyphens: 'none',
                WebkitHyphens: 'none',
              }}
            >
              {post.title}
            </motion.h2>

            {/* Extrait */}
            <motion.p
              initial={{ opacity: 0, x: 16 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: .35, duration: .45 }}
              style={{ fontSize: '.83rem', color: T.textSub, lineHeight: 1.75, marginBottom: '1.6rem' }}
            >
              {post.excerpt}
            </motion.p>

            {/* Hashtags */}
            {post.tags && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ delay: .42 }}
                style={{ display: 'flex', flexWrap: 'wrap', gap: '.4rem', marginBottom: '1.6rem' }}
              >
                {post.tags.slice(0, 3).map(tag => (
                  <span key={tag} style={{ padding: '.18rem .65rem', borderRadius: 100, background: 'rgba(136,202,83,.06)', border: `1px solid ${T.border}`, fontFamily: "'JetBrains Mono',monospace", fontSize: '.62rem', fontWeight: 600, color: T.textMuted }}>
                    #{tag}
                  </span>
                ))}
              </motion.div>
            )}

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: .48, duration: .4 }}
            >
              <Link
                href={`/blog/${post.slug}`}
                className="btn-raised"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '.5rem', padding: '.7rem 1.5rem', fontSize: '.82rem', width: 'fit-content' }}
              >
                Lire l'article <ArrowRight size={13} />
              </Link>
            </motion.div>
          </div>

          {/* Responsive */}
          <style>{`
            @media (max-width: 720px) {
              .featured-card { grid-template-columns: 1fr !important; }
              .featured-card > div:first-child { min-height: 220px; }
            }
          `}</style>
        </motion.div>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════
// ── BLOG GRID — AnimatedBeamGrid + TiltCard + BlurReveal ─────
// ═══════════════════════════════════════════════════════════════
const BLOG_NODES = [
  { id: 'blog-n-0', Icon: TrendingUp,  label: 'Stratégie',  color: '#88ca53' },
  { id: 'blog-n-1', Icon: ShoppingCart,label: 'E-Commerce', color: '#4ade80' },
  { id: 'blog-n-2', Icon: Code,        label: 'Dev Web',    color: '#88ca53' },
  { id: 'blog-n-3', Icon: Globe,       label: 'SEO',        color: '#86efac' },
  { id: 'blog-n-4', Icon: Zap,         label: 'Growth',     color: '#4ade80' },
  { id: 'blog-n-5', Icon: BookOpen,    label: 'Ressources', color: '#88ca53' },
]

// ═══════════════════════════════════════════════════════════════
// ── HASHTAG CLOUD — V-labs blog hashtag style ────────────────
// ═══════════════════════════════════════════════════════════════
const HASHTAGS = [
  '#stratégiedigitale','#seo','#ecommerce','#mobilemoney','#reactjs','#nextjs',
  '#django','#uxdesign','#pme','#abidjan','#webdev','#saas','#startup',
  '#cotedivoire','#digitalisation','#portfolio','#freelance','#africantech',
]

function HashtagCloud() {
  const T = useTheme()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <section ref={ref} style={{ padding: '3rem 5%', background: T.bgAlt, borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}` }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
          <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.65rem', fontWeight: 700, color: T.textMuted, textTransform: 'uppercase', letterSpacing: '.1em', flexShrink: 0 }}>Sujets</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.5rem' }}>
            {HASHTAGS.map((tag, i) => (
              <motion.span
                key={tag}
                initial={{ opacity: 0, scale: .85 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: i * .035, duration: .35 }}
                whileHover={{ y: -2, background: 'rgba(136,202,83,.14)', borderColor: 'rgba(136,202,83,.4)', color: '#88ca53' }}
                style={{ padding: '.28rem .75rem', borderRadius: 100, background: 'rgba(136,202,83,.06)', border: `1px solid ${T.border}`, fontFamily: "'JetBrains Mono',monospace", fontSize: '.7rem', fontWeight: 600, color: T.textSub, cursor: 'pointer', transition: 'all .2s' }}
              >
                {tag}
              </motion.span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function BlogGrid() {
  const T = useTheme()
  const ref = useRef(null)
  const beamContainerRef = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const [activeCategory, setActiveCategory] = useState('Tous')
  const [searchQuery, setSearchQuery] = useState('')

  const beamConnections = BLOG_NODES.map((n, i) => ({
    id: n.id, color: n.color,
    cx: i < 3 ? 30 : -30,
    cy: i < 3 ? 20 : -20,
  }))

  const filtered = BLOG_POSTS.filter(p => {
    const matchCat = activeCategory === 'Tous' || p.category === activeCategory
    const matchSearch = !searchQuery || p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    return matchCat && matchSearch
  })

  return (
    <section ref={ref} style={{ padding: '4rem 5%', background: T.bg, position: 'relative', overflow: 'hidden' }}>
      <div className="grid-bg" style={{ position: 'absolute', inset: 0, opacity: .2 }} />
      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* ── Section header ── */}
        <div style={{ textAlign: 'left', marginBottom: '3rem' }}>
          <BlurReveal delay={0.12}>
            <h2 className="section-title-big" style={{ position: 'relative', fontSize: 'clamp(2.8rem,5.5vw,4.4rem)', fontWeight: 800, fontFamily: "'JetBrains Mono',monospace", color: T.textMain, letterSpacing: '-.03em', lineHeight: 1.2 }}>
              <GhostTitle text="Explorez nos ressources digitales" />
              Explorez nos <GreenUnderline>
                <span className="text-gradient"><LetterReveal text="ressources digitales" stagger={0.025} /></span>
              </GreenUnderline>
            </h2>
          </BlurReveal>
        </div>

        {/* ── Beam constellation ── */}
        <BlurReveal delay={0.18} style={{ marginBottom: '3rem' }}>
          <div ref={beamContainerRef} style={{ position: 'relative', padding: '2rem 1rem', borderRadius: 20, background: T.light ? 'rgba(136,202,83,.03)' : 'rgba(136,202,83,.025)', border: `1px solid ${T.border}`, overflow: 'visible' }}>
            <AnimatedBeamGrid
              containerRef={beamContainerRef}
              nodeIds={{ center: 'blog-center' }}
              connections={beamConnections}
              animKey="blog"
            />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr) auto repeat(3,1fr)', alignItems: 'center', gap: '1rem', position: 'relative', zIndex: 2 }}>
              {/* Left 3 */}
              {BLOG_NODES.slice(0, 3).map(({ id, Icon, label }) => (
                <div key={id} id={id}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '.45rem', padding: '.75rem', borderRadius: 14, background: T.light ? 'rgba(255,255,255,.9)' : 'rgba(11,26,16,.8)', border: `1px solid ${T.border}`, backdropFilter: 'blur(8px)', justifySelf: 'center' }}>
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(136,202,83,.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={18} style={{ color: T.green }} />
                  </div>
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.58rem', fontWeight: 600, color: T.textMuted, whiteSpace: 'nowrap' }}>{label}</span>
                </div>
              ))}
              {/* Center */}
              <div id="blog-center"
                style={{ width: 76, height: 76, borderRadius: '50%', background: 'linear-gradient(135deg, rgba(136,202,83,.25), rgba(136,202,83,.08))', border: '2px solid rgba(136,202,83,.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(12px)', justifySelf: 'center', boxShadow: '0 0 40px rgba(136,202,83,.2)', flexShrink: 0 }}>
                <Image src="/images/logo.webp" alt="AKATech" width={52} height={52} style={{ objectFit: 'contain', filter: 'drop-shadow(0 0 6px rgba(136,202,83,.5))' }} />
              </div>
              {/* Right 3 */}
              {BLOG_NODES.slice(3).map(({ id, Icon, label }) => (
                <div key={id} id={id}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '.45rem', padding: '.75rem', borderRadius: 14, background: T.light ? 'rgba(255,255,255,.9)' : 'rgba(11,26,16,.8)', border: `1px solid ${T.border}`, backdropFilter: 'blur(8px)', justifySelf: 'center' }}>
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(136,202,83,.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={18} style={{ color: T.green }} />
                  </div>
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.58rem', fontWeight: 600, color: T.textMuted, whiteSpace: 'nowrap' }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </BlurReveal>

        {/* ── Filters ── */}
        <BlurReveal delay={0.08}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', marginBottom: '2rem', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap' }}>
              {CATEGORIES.map(cat => (
                <button key={cat} onClick={() => setActiveCategory(cat)}
                  style={{ padding: '.45rem 1.1rem', borderRadius: 100, border: '1px solid', cursor: 'pointer', fontFamily: "'JetBrains Mono',monospace", fontSize: '.8rem', fontWeight: 600, transition: 'all .2s', borderColor: activeCategory === cat ? T.green : T.border, background: activeCategory === cat ? 'linear-gradient(145deg,#8dd456,#5f9137)' : 'transparent', color: activeCategory === cat ? '#fff' : T.textSub }}>
                  {cat}
                </button>
              ))}
            </div>
            <div style={{ position: 'relative' }}>
              <Search size={14} style={{ position: 'absolute', left: '.9rem', top: '50%', transform: 'translateY(-50%)', color: T.textMuted, pointerEvents: 'none' }} />
              <input
                style={{ padding: '.6rem 1rem .6rem 2.4rem', borderRadius: 100, border: `1px solid ${T.border}`, background: T.light ? '#f5f5f5' : 'rgba(136,202,83,.04)', color: T.textMain, fontFamily: "'JetBrains Mono',monospace", fontSize: '.82rem', outline: 'none', width: 220 }}
                placeholder="Rechercher..."
                value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                onFocus={e => e.target.style.borderColor = '#88ca53'}
                onBlur={e => e.target.style.borderColor = T.border}
              />
            </div>
          </div>
        </BlurReveal>

        {/* ── Grid ── */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: T.textMuted }}>
            <BookOpen size={40} style={{ margin: '0 auto 1rem', opacity: .3 }} />
            <p>Aucun article trouvé pour cette recherche.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))', gap: '1.5rem' }}>
            {filtered.map((post, i) => {
              const CatIcon = CAT_ICONS[post.category] || Tag
              return (
                <BlurReveal key={post.slug} delay={i * 0.07} direction={['up','right','up','left','up','right'][i % 6]}>
                  <TiltCard className="sku-card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%' }}>
                    {/* Image */}
                    <div style={{ height: 200, position: 'relative', overflow: 'hidden' }}>
                      <img src={post.img} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .4s ease', display: 'block' }}
                        onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
                        onMouseLeave={e => e.target.style.transform = 'scale(1)'} />
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(6,14,9,.6),transparent)' }} />
                    </div>
                    {/* Content */}
                    <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '.7rem', marginBottom: '.9rem' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '.35rem', padding: '.22rem .75rem', borderRadius: 100, background: T.light ? 'rgba(22,163,74,.07)' : 'rgba(136,202,83,.07)', border: `1px solid ${T.border}`, fontFamily: "'JetBrains Mono',monospace", fontSize: '.65rem', fontWeight: 600, color: T.green, letterSpacing: '.06em' }}>
                          <CatIcon size={10} />{post.category}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '.3rem', fontSize: '.7rem', color: T.textMuted }}>
                          <Clock size={10} />{post.readTime}
                        </span>
                      </div>
                      <h3 style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, fontSize: '.98rem', color: T.textMain, letterSpacing: '-.02em', lineHeight: 1.4, marginBottom: '.7rem' }}>
                        {post.title}
                      </h3>
                      <p style={{ fontSize: '.8rem', color: T.textSub, lineHeight: 1.65, flex: 1, marginBottom: '1.4rem' }}>
                        {post.excerpt.length > 120 ? post.excerpt.slice(0, 120) + '…' : post.excerpt}
                      </p>
                      <Link href={`/blog/${post.slug}`}
                        style={{ display: 'flex', alignItems: 'center', gap: '.4rem', fontFamily: "'JetBrains Mono',monospace", fontSize: '.65rem', fontWeight: 600, color: T.green, textDecoration: 'none', transition: 'gap .2s' }}
                        onMouseEnter={e => e.currentTarget.style.gap = '.7rem'}
                        onMouseLeave={e => e.currentTarget.style.gap = '.4rem'}>
                        Lire l'article <ArrowRight size={13} />
                      </Link>
                    </div>
                  </TiltCard>
                </BlurReveal>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════
// ── NEWSLETTER — BlurReveal + LetterReveal ───────────────────
// ═══════════════════════════════════════════════════════════════
function Newsletter() {
  const T = useTheme()
  const sectionRef = useRef(null)
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)

  return (
    <section ref={sectionRef} style={{ padding: '5rem 5%', background: T.bgAlt }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <BlurReveal>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(136,202,83,.12)', border: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <Zap size={24} style={{ color: T.green }} />
          </div>
          <h2 className="section-title-big" style={{ position: 'relative', fontSize: 'clamp(2.8rem,5.5vw,4.4rem)', fontWeight: 800, fontFamily: "'JetBrains Mono',monospace", color: T.textMain, letterSpacing: '-.03em', marginBottom: '.7rem', textAlign: 'left' }}>
            <GhostTitle text="Restez informé des dernières tendances" />
            Restez informé des <GreenUnderline><span className="text-gradient"><LetterReveal text="dernières tendances" stagger={0.02} /></span></GreenUnderline>
          </h2>
        </BlurReveal>
        <WordRevealP
          sectionRef={sectionRef}
          text="Conseils digitaux, nouvelles technologies et ressources pour entrepreneurs ivoiriens — directement dans votre boîte mail."
          greenWords={['digitaux,', 'technologies', 'ivoiriens', 'mail.']}
          extraStyle={{ color: T.textSub, marginBottom: '2rem' }}
        />
          {done ? (
            <motion.div initial={{ scale: .8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              style={{ padding: '1.2rem 2rem', borderRadius: 14, background: 'rgba(136,202,83,.08)', border: `1px solid ${T.border}`, color: T.green, fontFamily: "'JetBrains Mono',monospace", fontWeight: 700 }}>
              ✅ Merci ! Vous êtes abonné.
            </motion.div>
          ) : (
            <div style={{ display: 'flex', gap: '.8rem', maxWidth: 520, margin: '0 auto' }}>
              <input type="email" placeholder="votre@email.com" value={email} onChange={e => setEmail(e.target.value)}
                style={{ flex: 1, padding: '.85rem 1rem', borderRadius: 10, border: `1px solid ${T.border}`, background: T.light ? '#f5f5f5' : 'rgba(136,202,83,.04)', color: T.textMain, fontFamily: "'JetBrains Mono',monospace", fontSize: '.88rem', outline: 'none' }}
                onFocus={e => e.target.style.borderColor = '#88ca53'}
                onBlur={e => e.target.style.borderColor = T.border}
              />
              <button className="btn-raised" onClick={() => email && setDone(true)} style={{ flexShrink: 0, padding: '.85rem 1.4rem', fontSize: '.84rem' }}>
                S'abonner
              </button>
            </div>
          )}
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════
// ── PROCESS — Sticky stacking "Votre roadmap digitale" ───────
// ═══════════════════════════════════════════════════════════════
function ProcessBlog() {
  const T = useTheme()

  const steps = [
    {
      n: '01', icon: BookOpen,
      title: 'Vous lisez',
      desc: "Explorez nos articles concrets sur la stratégie digitale, le SEO et l'e-commerce — pensés pour le marché ivoirien.",
      bg: T.light ? '#f4faf5' : '#030c06',
      shadow: false,
    },
    {
      n: '02', icon: Zap,
      title: 'Vous apprenez',
      desc: "Chaque ressource est taillée pour les entrepreneurs qui veulent passer à l'action — pas de jargon, du concret.",
      bg: T.light ? '#ffffff' : '#051208',
      shadow: true,
    },
    {
      n: '03', icon: Target,
      title: 'Vous testez',
      desc: "Appliquez les conseils à votre business dès aujourd'hui. Pas besoin d'être un expert — juste de la méthode.",
      bg: T.light ? '#f4faf5' : '#030c06',
      shadow: true,
    },
    {
      n: '04', icon: Rocket,
      title: 'On construit ensemble',
      desc: "Vous avez un projet ? On le transforme en réalité digitale. Devis gratuit, réponse en moins de 24h.",
      bg: T.light ? '#e8f8ec' : '#061a0a',
      shadow: true,
    },
  ]

  return (
    <section style={{ position: 'relative' }}>
      {/* Sticky header */}
      <div style={{ position: 'sticky', top: 0, zIndex: 50, textAlign: 'left', padding: '2.5rem 5% 1.5rem', background: steps[0].bg, borderBottom: `1px solid ${T.border}` }}>
        <BlurReveal delay={0.1}>
          <h2 className="section-title-big" style={{ position: 'relative', fontSize: 'clamp(2.8rem,5.5vw,4.4rem)', fontWeight: 800, fontFamily: "'JetBrains Mono',monospace", color: T.textMain, letterSpacing: '-.03em', margin: 0 }}>
            <GhostTitle text="Du blog au projet concret" />
            Du blog au{' '}
            <GreenUnderline>
              <span className="text-gradient">
                <LetterReveal text="projet concret" stagger={0.04} />
              </span>
            </GreenUnderline>
          </h2>
        </BlurReveal>
      </div>

      {/* Stacking steps */}
      {steps.map(({ n, icon: Icon, title, desc, bg, shadow }, i) => (
        <div key={n} style={{
          position: 'sticky',
          top: 96,
          zIndex: i + 1,
          minHeight: '70vh',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: bg,
          borderRadius: i > 0 ? '28px 28px 0 0' : 0,
          boxShadow: shadow ? '0 -24px 60px rgba(0,0,0,0.22)' : 'none',
          padding: '4rem 5%',
        }}>
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

// ═══════════════════════════════════════════════════════════════
// ── PAGE ─────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════
export default function BlogPage() {
  return (
    <div>
      <HeroBlog />
      <FeaturedPost />
      <HashtagCloud />
      <BlogGrid />
      <Newsletter />
      <ProcessBlog />

      <PageCTA
        message="Vous avez un projet web ? Discutons-en — consultation gratuite et sans engagement."
        cta="Démarrer un projet"
      />
    </div>
  )
}