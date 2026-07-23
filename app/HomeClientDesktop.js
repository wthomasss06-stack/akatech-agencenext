'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import {
  ArrowRight, Star, ExternalLink,
  Globe, ShoppingCart, Cpu, Server, Palette, Wrench, Map, MapPin,
  TrendingUp, Users, Clock, Award,
  MessageCircle, Target, Code, Timer, ChevronLeft, ChevronRight,
  Monitor, ShoppingBag, LayoutDashboard, Cog, Image,
  Send, Zap, Lock, Mail, Phone, Check, HelpCircle, ChevronDown, AlertTriangle
} from 'lucide-react'
import { useTheme } from '@/lib/theme'
import { GhostTitle, AnimatedCounter, LazyImg, PageCTA, GreenUnderline } from '@/components/ui/index'
import TrustStacksMarquee from '@/components/ui/TrustStacksMarquee'
import ConversionMarquee from '@/components/ui/ConversionMarquee'
import { SERVICES, PROJECTS, TESTIMONIALS, FAQ_ITEMS, PRICING } from '@/lib/data'

const ICON_MAP = { Globe, ShoppingCart, Cpu, Server, Palette, Wrench, Map, MapPin }

// ── HERO (inchangé) ───────────────────────────────────────────
// ── CIRCULAR PROJECTS GALLERY (inspiré Aeline/Catalis) ────────
function CircularProjectsGallery() {
  const T = useTheme()
  const GALLERY_ITEMS = [
    ...PROJECTS.filter(p => p.id === 15 || p.id === 18),
    ...PROJECTS.filter(p => p.id === 17 || p.id === 16),
    ...PROJECTS.filter(p => p.id === 12),
    ...PROJECTS.filter(p => p.id === 19),
  ]
  const [active, setActive] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setActive(a => (a + 1) % GALLERY_ITEMS.length), 2800)
    return () => clearInterval(id)
  }, [GALLERY_ITEMS.length])

  // Position relative de chaque carte par rapport à `active` (-2..-1..0..1..2)
  const order = GALLERY_ITEMS.map((_, i) => {
    let rel = i - active
    if (rel > GALLERY_ITEMS.length / 2) rel -= GALLERY_ITEMS.length
    if (rel < -GALLERY_ITEMS.length / 2) rel += GALLERY_ITEMS.length
    return rel
  })

  // Ratio natif 1600×815 ≈ 1.96:1
  const CARD_W = 340
  const CARD_H = Math.round(340 * (815 / 1600))  // ≈ 173px
  const STEP   = CARD_W * 0.72                    // espacement entre centres

  return (
    <div style={{ position: 'relative', height: CARD_H + 60, display: 'flex', alignItems: 'center', justifyContent: 'center', perspective: 1200 }}>
      {GALLERY_ITEMS.map((p, i) => {
        const rel    = order[i]
        const abs    = Math.abs(rel)
        const x      = rel * STEP
        const y      = abs * 14
        const rot    = rel * 8
        const scale  = 1 - abs * 0.13
        const opacity = abs > 2 ? 0 : 1 - abs * 0.18
        const isActive = rel === 0

        return (
          <motion.div key={p.id}
            animate={{ x, y, rotate: rot, scale, opacity }}
            transition={{ duration: .9, ease: [.22,1,.36,1] }}
            onClick={() => setActive(i)}
            style={{
              position: 'absolute',
              width: CARD_W,
              height: CARD_H,
              borderRadius: 10,
              overflow: 'hidden',
              zIndex: 10 - abs,
              cursor: 'pointer',
              border: isActive
                ? '1.5px solid rgba(136,202,83,.6)'
                : '1px solid rgba(255,255,255,.1)',
              boxShadow: isActive
                ? '0 0 0 3px rgba(136,202,83,.15), 0 12px 36px rgba(0,0,0,.6)'
                : '0 6px 20px rgba(0,0,0,.4)',
              transformStyle: 'preserve-3d',
            }}>
            <LazyImg
              src={p.img}
              alt={p.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 50%' }}
            />
            <div style={{
              position: 'absolute', inset: 0,
              background: isActive
                ? 'linear-gradient(to bottom, transparent 45%, rgba(0,0,0,.8) 100%)'
                : 'linear-gradient(to bottom, rgba(0,0,0,.1) 0%, rgba(0,0,0,.65) 100%)',
            }} />
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '.7rem 1rem' }}>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.8rem', fontWeight: 700, color: '#fff', letterSpacing: '-.01em', lineHeight: 1.2 }}>{p.title}</div>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.65rem', color: 'rgba(136,202,83,.9)', marginTop: '.1rem' }}>{p.type}</div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

const HERO_SLOGANS = [
  { before: 'Un site qui travaille pour vous ', highlight: '24h/24' },
  { before: 'Attirez des clients, gagnez en ', highlight: 'crédibilité' },
  { before: 'Développez votre activité ', highlight: 'sereinement' },
]

// ── Slogan Hero — cycle auto entre 3 accroches, même traitement
// Neo-Brutalism (bloc vert + box-shadow blanc dur) sur le mot-clé ──
function HeroSloganCycle() {
  const [index, setIndex] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setIndex(i => (i + 1) % HERO_SLOGANS.length), 3500)
    return () => clearInterval(id)
  }, [])
  const { before, highlight } = HERO_SLOGANS[index]

  return (
    <div style={{ marginBottom: '2.2rem', maxWidth: 800, marginLeft: 'auto', marginRight: 'auto', minHeight: 'clamp(4.5rem,11vw,7.6rem)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <AnimatePresence mode="wait">
        <motion.p key={index}
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
          transition={{ duration: .45, ease: 'easeOut' }}
          style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontStyle: 'italic', fontSize: 'clamp(1.9rem,4.4vw,3.2rem)', lineHeight: 1.18, letterSpacing: '-.02em', textTransform: 'uppercase', color: '#fff', textShadow: '4px 4px 0px rgba(0,0,0,.55)', textAlign: 'center', margin: 0 }}>
          {before}
          <span style={{ display: 'inline-block', background: '#88ca53', color: '#08130a', padding: '.1em .3em', boxShadow: '6px 6px 0px #fff', textShadow: 'none' }}>
            {highlight}
          </span>
        </motion.p>
      </AnimatePresence>
    </div>
  )
}

function Hero() {
  const T = useTheme()
  const wrapRef     = useRef(null)
  const layerBgRef  = useRef(null)
  const layerMidRef = useRef(null)
  const layerForeRef = useRef(null)

  useEffect(() => {
    const onMouse = (e) => {
      const x = (e.clientX - window.innerWidth  / 2) / (window.innerWidth  / 2)
      const y = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2)
      const rotX = y * -5
      const rotY = x *  5
      const apply = (el, speed, noRotate = false) => {
        if (!el) return
        const mx = x * 50 * speed
        const my = y * 50 * speed
        if (noRotate) {
          el.style.transform = `translate3d(${mx}px,${my}px,0)`
        } else {
          el.style.transform = `translate3d(${mx}px,${my}px,0) rotateX(${rotX}deg) rotateY(${rotY}deg)`
        }
      }
      apply(layerBgRef.current,   0.2)
      apply(layerMidRef.current,  0.5, true)
      apply(layerForeRef.current, 0.8)
    }
    window.addEventListener('mousemove', onMouse)
    return () => window.removeEventListener('mousemove', onMouse)
  }, [])

  useEffect(() => {
    // Pendant le scroll, le Hero reste pinné (cf. wrapper 200vh ci-dessous) :
    // on calcule une progression 0→1 sur la distance pinnée, et on l'utilise
    // pour zoomer + flouter + faire disparaître le Hero, comme la section
    // pinnée "zoom-title" de 1.html — pour laisser émerger la suite de la page.
    const onScroll = () => {
      const wrap = wrapRef.current
      const winH = window.innerHeight
      let progress = 0
      if (wrap) {
        const top = wrap.getBoundingClientRect().top
        const pinDistance = wrap.offsetHeight - winH
        progress = pinDistance > 0 ? Math.min(1, Math.max(0, -top / pinDistance)) : 0
      }

      if (layerBgRef.current) {
        const zoom = 1 + progress * 0.4
        layerBgRef.current.style.transform = `scale(${zoom})`
        layerBgRef.current.style.filter = `blur(${progress * 16}px)`
      }
      if (layerMidRef.current) {
        const scale = 1 + progress * 1.7
        layerMidRef.current.style.opacity  = String(Math.max(0, 1 - progress * 1.25))
        layerMidRef.current.style.transform = `scale(${scale})`
        layerMidRef.current.style.filter   = `blur(${progress * 7}px)`
      }
      if (layerForeRef.current) {
        layerForeRef.current.style.opacity = String(Math.max(0, 1 - progress * 2.2))
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div ref={wrapRef} style={{ position: 'relative', height: '200vh' }}>
    <section id="home-hero" style={{ height: '100vh', maxHeight: '100vh', width: '100%', position: 'sticky', top: 0, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#030806' }}>

      <div ref={layerBgRef} style={{ position: 'absolute', zIndex: 1, width: '115%', height: '115%', willChange: 'transform, filter', transition: 'transform .1s ease-out', pointerEvents: 'none' }}>
        <img src="/images/hero-bg.webp" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(105deg, rgba(3,8,6,.95) 0%, rgba(3,8,6,.78) 45%, rgba(3,8,6,.28) 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 15%, rgba(3,8,6,.92) 100%)' }} />
        <motion.div
          style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
          animate={{ background: [
            'radial-gradient(700px circle at 25% 38%, rgba(136,202,83,.055) 0%, transparent 62%)',
            'radial-gradient(700px circle at 72% 58%, rgba(136,202,83,.075) 0%, transparent 62%)',
            'radial-gradient(700px circle at 25% 38%, rgba(136,202,83,.055) 0%, transparent 62%)',
          ]}}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="grid-bg" style={{ position: 'absolute', inset: 0, opacity: .13, pointerEvents: 'none' }} />

      </div>

      <div ref={layerMidRef} style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: 1100, padding: '4rem 5% 0', willChange: 'transform, opacity, filter', transition: 'transform .1s ease-out', textAlign: 'center' }}>

        

        <HeroSloganCycle />

        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .5, delay: .45 }}
          style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '1.8rem', justifyContent: 'center' }}>
          <motion.a href="https://wa.me/2250142507750" target="_blank" rel="noreferrer"
            initial={{ boxShadow: '6px 6px 0px #fff' }}
            whileHover={{ x: -4, y: -4, boxShadow: '10px 10px 0px #fff' }}
            whileTap={{ x: 2, y: 2, boxShadow: '2px 2px 0px #fff' }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontStyle: 'italic', fontSize: '1.05rem', textTransform: 'uppercase', letterSpacing: '-.01em', color: '#08130a', background: '#88ca53', padding: '1rem 2.1rem', borderRadius: 999 }}>
            Démarrer mon projet <ArrowRight size={16} />
          </motion.a>
          <motion.div
            initial={{ boxShadow: '6px 6px 0px #fff' }}
            whileHover={{ x: -4, y: -4, boxShadow: '10px 10px 0px #fff' }}
            whileTap={{ x: 2, y: 2, boxShadow: '2px 2px 0px #fff' }}
            style={{ display: 'inline-block', borderRadius: 999 }}>
            <Link href="/contact" style={{ display: 'inline-flex', alignItems: 'center', fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontStyle: 'italic', fontSize: '1.05rem', textTransform: 'uppercase', letterSpacing: '-.01em', color: '#fff', background: 'transparent', border: '2px solid #fff', borderRadius: 999, padding: 'calc(1rem - 2px) calc(2.1rem - 2px)' }}>
              Prenez RDV
            </Link>
          </motion.div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .6, delay: .55 }}>
          <CircularProjectsGallery />
        </motion.div>

        
      </div>

      <div ref={layerForeRef} style={{ position: 'absolute', inset: 0, zIndex: 20, pointerEvents: 'none', willChange: 'transform, opacity', transition: 'transform .1s ease-out' }}>
        {[
          { left: '12%', top: '22%', s: 4, op: .22, dur: 3.8, dy: 0 },
          { left: '28%', top: '65%', s: 3, op: .12, dur: 5.1, dy: 1.2 },
          { left: '55%', top: '28%', s: 4, op: .26, dur: 4.4, dy: 0.6 },
          { left: '70%', top: '72%', s: 3, op: .10, dur: 6.2, dy: 1.8 },
          { left: '83%', top: '18%', s: 4, op: .18, dur: 3.2, dy: 0.3 },
          { left: '92%', top: '52%', s: 3, op: .14, dur: 4.9, dy: 2.1 },
        ].map((p, i) => (
          <motion.div key={i}
            style={{ position: 'absolute', width: p.s, height: p.s, borderRadius: '50%', background: '#88ca53', left: p.left, top: p.top, opacity: p.op }}
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: p.dur, repeat: Infinity, ease: 'easeInOut', delay: p.dy }}
          />
        ))}
      </div>

      <div style={{ position: 'absolute', bottom: '1.5rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: .28, zIndex: 15, pointerEvents: 'none' }}>
        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.6rem', letterSpacing: '.18em', textTransform: 'uppercase', marginBottom: '.4rem', color: '#fff' }}>Scroll</span>
        <motion.div animate={{ scaleY: [1, 1.4, 1], opacity: [.5, 1, .5] }} transition={{ duration: 1.6, repeat: Infinity }}
          style={{ width: 1, height: 36, background: 'linear-gradient(to bottom, rgba(255,255,255,.8), transparent)' }} />
      </div>

    </section>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// ── UTILITAIRES EFFETS ────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════

// Blur + slide reveal (hentat.html)
function BlurReveal({ children, delay = 0, direction = 'up', style = {}, className = '', once = true }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once, margin: '-60px' })
  const dirMap = { up: { y: 40, x: 0 }, right: { y: 0, x: 40 }, down: { y: -40, x: 0 }, left: { y: 0, x: -40 } }
  const off = dirMap[direction] || { y: 40, x: 0 }
  return (
    <motion.div
      ref={ref}
      style={style}
      className={className}
      initial={{ opacity: 0, filter: 'blur(12px)', ...off }}
      animate={inView ? { opacity: 1, filter: 'blur(0px)', x: 0, y: 0 } : {}}
      transition={{ duration: 0.85, ease: [0.2, 0.8, 0.2, 1], delay }}
    >
      {children}
    </motion.div>
  )
}

// Letter-by-letter reveal (hentat.html)
// once: false → rejoue dans les deux sens (scroll down ET scroll up)

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
      textEl.style.opacity   = String(Math.min(1, 0.35 + progress * 1.4))
      const words = wordsRef.current
      if (!words.length) return
      const wProg = Math.max(0, Math.min(1, (progress - 0.05) / (0.50 - 0.05)))
      words.forEach((span, i) => {
        if (!span) return
        const local = Math.max(0, Math.min(1, (wProg - (i / (words.length - 1)) * 0.76) / 0.26))
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

// ── ANIMATED BEAM (une vrai co.html) ─────────────────────────
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
    const ty = mRect.top  - cRect.top  + mRect.height / 2

    const built = connections.map((conn, idx) => {
      const fromEl = document.getElementById(conn.id)
      if (!fromEl) return null
      const r = fromEl.getBoundingClientRect()
      const sx = r.left - cRect.left + r.width / 2
      const sy = r.top  - cRect.top  + r.height / 2
      // Quadratic bezier control point
      const cx = (sx + tx) / 2 + (conn.cx || 0)
      const cy = (sy + ty) / 2 + (conn.cy || 0)
      return { d: `M ${sx} ${sy} Q ${cx} ${cy} ${tx} ${ty}`, color: conn.color, delay: `${idx * 0.4}s`, id: conn.id }
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
          <linearGradient key={i} id={`bg-${i}`} gradientUnits="userSpaceOnUse"
            x1={p.d.split(' ')[1]} y1={p.d.split(' ')[2]}
            x2={p.d.split(' ')[p.d.split(' ').length - 2]}
            y2={p.d.split(' ')[p.d.split(' ').length - 1]}>
            <stop offset="0%" stopColor={p.color} stopOpacity="0" />
            <stop offset="40%" stopColor={p.color} stopOpacity="0.6" />
            <stop offset="100%" stopColor={p.color} stopOpacity="0" />
          </linearGradient>
        ))}
      </defs>
      {paths.map((p, i) => (
        <g key={i}>
          {/* Base line */}
          <path d={p.d} fill="none" stroke="rgba(136,202,83,0.08)" strokeWidth="1.5" />
          {/* Animated glow dash */}
          <path
            d={p.d}
            fill="none"
            stroke={`url(#bg-${i})`}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="50 300"
            style={{ animation: 'beamFlow 2.8s linear infinite', animationDelay: p.delay }}
          />
        </g>
      ))}
      <style>{`
        @keyframes beamFlow {
          from { stroke-dashoffset: 350; }
          to   { stroke-dashoffset: 0; }
        }
      `}</style>
    </svg>
  )
}

// ═══════════════════════════════════════════════════════════════
// ── NOS SERVICES — avec AnimatedBeam + BlurReveal ────────────
// ═══════════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════════
// ── SERVICES — Two-Column Skewed Images (HTML skew-section) ──
// ═══════════════════════════════════════════════════════════════
const SERVICES_SKEW = [
  { n: '01', Icon: Globe,    title: 'Conception de Site Web',          desc: "Création de sites web modernes, responsive et optimisés pour convertir vos visiteurs en clients. Du portfolio à la plateforme e-commerce.", price: 'À partir de 100 000 FCFA', del: '5-7 jours', img: '/images/service/creation%20de%20site%20web.webp', slug: 'site-vitrine' },
  { n: '02', Icon: Map,      title: 'Cartes Interactives & Dashboards', desc: "Intégration de cartes Mapbox / Leaflet et de dashboards de visualisation de données. Vos données brutes deviennent des interfaces actionnables.", price: 'Sur devis', del: '7-14 jours', img: '/images/service/dasbord.webp', slug: 'cartes-dashboards' },
  { n: '03', Icon: Server,   title: 'API & Backend Robustes',           desc: "Conception d'API RESTful sécurisées avec Django ou Flask. Authentification JWT, gestion des rôles, intégration Mobile Money.", price: 'À partir de 200 000 FCFA', del: '7-14 jours', img: '/images/service/api.webp', slug: 'api-backend' },
  { n: '04', Icon: Wrench,   title: 'Maintenance & Support',            desc: "Suivi technique, corrections de bugs, mises à jour de sécurité et améliorations continues. Vous vous concentrez sur votre métier.", price: 'À partir de 20 000 FCFA/mois', del: 'Contrat mensuel', img: '/images/service/maintenence.webp', slug: 'maintenance' },
  { n: '05', Icon: MapPin,   title: 'Fiche Google My Business',         desc: "Création ou optimisation de votre fiche Google (NAP, photos, SEO local) et suivi mensuel : avis, publications et statistiques.", price: 'À partir de 10 000 FCFA/mois', del: '1-2 jours', img: '/images/service/fiche-google.webp', slug: 'google-my-business' },
]

// ── HOVER IMAGE REVEAL — style identity_branding ─────────────
// Flèche ↗ pivote 45° au hover + titre large + séparateur + image curseur 1:1
function HoverImageReveal({ items }) {
  const [hovered, setHovered] = useState(null)
  const [pos, setPos]         = useState({ x: 0, y: 0 })
  const [rot, setRot]         = useState(0)
  const containerRef          = useRef(null)
  const rafRef                = useRef(null)
  const T = useTheme()

  const onMouseMove = (e) => {
    cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(() => {
      const rect = containerRef.current?.getBoundingClientRect()
      if (!rect) return
      setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
    })
  }

  const onEnter = (i) => { setHovered(i); setRot((Math.random() - 0.5) * 10) }
  const onLeave = () => setHovered(null)

  return (
    <div ref={containerRef} onMouseMove={onMouseMove} style={{ position: 'relative', userSelect: 'none' }}>

      {/* ── Rows + séparateurs ── */}
      {items.map((item, i) => {
        const RowTag = item.href ? Link : 'div'
        const rowProps = item.href ? { href: item.href } : {}
        return (
        <div key={i}>
          <RowTag
            {...rowProps}
            onMouseEnter={() => onEnter(i)}
            onMouseLeave={onLeave}
            style={{
              display: 'flex', alignItems: 'center', gap: '1.4rem',
              padding: '1.1rem 0',
              paddingLeft: hovered === i ? '.5rem' : '0',
              cursor: item.href ? 'pointer' : 'default',
              textDecoration: 'none',
              transition: 'padding-left .25s ease',
            }}
          >
            {/* Flèche ↗ — pivote à 45° au hover, sans contours */}
            <div style={{
              width: 38, height: 38, flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transform: hovered === i ? 'rotate(50deg)' : 'rotate(25deg)',
              transition: 'transform .25s cubic-bezier(.22,1,.36,1)',
            }}>
              <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
                <path d="M2 12L12 2M12 2H5M12 2V9"
                  stroke="#88ca53" strokeWidth="1.8"
                  strokeLinecap="round" strokeLinejoin="round"
                  style={{ opacity: hovered === i ? 1 : 0.38, transition: 'opacity .22s' }}
                />
              </svg>
            </div>

            {/* Numéro */}
            <span style={{
              fontFamily: "'JetBrains Mono',monospace", fontSize: '.58rem', fontWeight: 700,
              minWidth: '2rem', letterSpacing: '.3em', transition: 'color .22s',
              color: hovered === i ? '#88ca53' : 'rgba(136,202,83,.32)',
            }}>
              {item.n}
            </span>

            {/* Titre */}
            <span style={{
              fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontStyle: 'italic', flex: 1,
              fontSize: 'clamp(1.5rem,2.8vw,2.4rem)', letterSpacing: '-.03em', lineHeight: 1,
              color: hovered === i ? T.textMain : T.textMuted,
              transition: 'color .25s ease',
            }}>
              {item.label}
            </span>

            {/* Tag slide-in */}
            {item.tag && (
              <span style={{
                padding: '.22rem .75rem', borderRadius: 100,
                background: 'rgba(136,202,83,.08)', border: '1px solid rgba(136,202,83,.22)',
                fontFamily: "'JetBrains Mono',monospace", fontSize: '.58rem', fontWeight: 700,
                color: '#88ca53', whiteSpace: 'nowrap',
                opacity: hovered === i ? 1 : 0,
                transform: hovered === i ? 'translateX(0)' : 'translateX(10px)',
                transition: 'opacity .22s ease, transform .22s ease',
              }}>
                {item.tag}
              </span>
            )}
          </RowTag>

          {/* Séparateur horizontal */}
          <div style={{
            height: 1,
            background: hovered === i
              ? 'linear-gradient(90deg,rgba(136,202,83,.55) 0%,rgba(136,202,83,.06) 100%)'
              : T.border,
            transition: 'background .28s ease',
          }} />
        </div>
        )
      })}

      {/* ── Image curseur 1:1 — 260×260 ── */}
      <div style={{
        position: 'absolute', top: 0, left: 0,
        width: 260, height: 260,
        borderRadius: 16, overflow: 'hidden',
        pointerEvents: 'none', zIndex: 20,
        transform: `translate(${pos.x + 24}px,${pos.y - 130}px) rotate(${rot}deg) scale(${hovered !== null ? 1 : 0.75})`,
        opacity: hovered !== null ? 1 : 0,
        transition: 'opacity .22s ease, transform .16s cubic-bezier(.22,1,.36,1)',
        boxShadow: '0 24px 70px rgba(0,0,0,.55)',
        border: '1.5px solid rgba(136,202,83,.35)',
        willChange: 'transform, opacity',
      }}>
        {hovered !== null && items[hovered]?.img && (
          <img src={items[hovered].img} alt={items[hovered].label}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', filter: 'brightness(.92)' }} />
        )}
      </div>
    </div>
  )
}

function ServicesPreview() {
  const T = useTheme()
  const ref = useRef(null)

  // Tous les services — hover image reveal, chaque ligne pointe vers son service sur /services
  const HOVER_ITEMS = SERVICES_SKEW.map(s => ({
    n: s.n, label: s.title, img: s.img, tag: s.del, href: `/services#${s.slug}`,
  }))

  return (
    <section ref={ref} style={{ padding: '7rem 5%', background: T.bg, borderTop: `1px solid ${T.border}`, position: 'relative', overflow: 'hidden' }}>
      <div className="grid-bg" style={{ position: 'absolute', inset: 0, opacity: .2 }} />
      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* Header — titre sur trait rouge, contenu sur trait jaune */}
        <div style={{ marginBottom: '3rem' }}>
          <BlurReveal delay={0.1} direction="left">
            <h2 className="section-title-big" style={{ position: 'relative', fontSize: 'clamp(2.8rem,5.5vw,4.4rem)', fontWeight: 900, fontStyle: 'italic', fontFamily: "'Barlow Condensed',sans-serif", color: T.textMain }}>
              <GhostTitle text="NOS prestations." />
              NOS{' '}
              <GreenUnderline>
                <span className="text-gradient">
                  prestations.
                </span>
              </GreenUnderline>
            </h2>
          </BlurReveal>
        </div>

        {/* Bouton + liste — centrés */}
        <div style={{ paddingLeft: 'var(--body-indent)', paddingRight: 'var(--body-indent)' }}>
          

          {/* ── Hover Image Reveal — tous les services ── */}
          <BlurReveal delay={0.15}>
            <div style={{ borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}`, padding: '.5rem 0' }}>
              <HoverImageReveal items={HOVER_ITEMS} />
            </div>
          </BlurReveal>
        </div>

      </div>
    </section>
  )
}


// ═══════════════════════════════════════════════════════════════
// ── BUILT ON TRUST — 3D Showcase (HTML showcase-section) ─────
// ═══════════════════════════════════════════════════════════════
const WHY_PANELS = [
  { n: '01', title: 'Prise de\ncontact',          sub: 'On vous écoute',              desc: "Vous décrivez votre projet, vos objectifs et votre budget. Premier échange gratuit et sans engagement.", img: '/images/process/prise%20de%20contact.webp' },
  { n: '02', title: 'Devis &\nconditions',         sub: 'Proposition détaillée',        desc: "Planning, technologies, tarif : tout est posé noir sur blanc avant de démarrer le moindre développement.", img: '/images/process/devis%20et%20condition.webp' },
  { n: '03', title: 'Acompte\nde démarrage',       sub: '50% pour lancer le projet',    desc: "L'acompte confirme votre commande et permet de démarrer le développement immédiatement.", img: '/images/process/acompte.webp' },
  { n: '04', title: 'Création\ndu site',           sub: 'Design 100% sur mesure',       desc: "Zéro template, zéro copier-coller — une identité visuelle unique, pensée pour votre activité.", img: '/images/process/creation%20du%20site.webp' },
  { n: '05', title: 'Livraison\npour validation',  sub: 'Vous testez avant de payer',   desc: "Un lien de prévisualisation vous est partagé pour valider le design et le contenu avant tout paiement final.", img: '/images/process/livraison.webp' },
  { n: '06', title: 'Solde &\nfacturation',        sub: 'Paiement final',               desc: "Une fois le site validé, le solde est réglé et tous les accès vous sont transmis avec une formation.", img: '/images/process/solde.webp' },
  { n: '07', title: 'Mise en\nligne',              sub: 'Votre site est officiel',      desc: "Le site est publié en ligne, entre vos mains — avec un support disponible pour les premières semaines.", img: '/images/process/mise%20en%20ligne.webp' },
]

function WhyUs() {
  const T = useTheme()
  const ref = useRef(null)

  // Étapes du processus — hover image reveal (même pattern que ServicesPreview)
  const HOVER_ITEMS = WHY_PANELS.map(p => ({
    n: p.n, label: p.title.replace('\n', ' '), img: p.img, tag: p.sub,
  }))

  return (
    <section ref={ref} style={{ padding: '7rem 5%', background: T.bg, borderTop: `1px solid ${T.border}`, position: 'relative', overflow: 'hidden' }}>
      <div className="grid-bg" style={{ position: 'absolute', inset: 0, opacity: .15 }} />
      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* Header — titre sur trait rouge */}
        <BlurReveal delay={0.1} direction="left">
          <h2 className="section-title-big" style={{ position: 'relative', fontSize: 'clamp(2.8rem,5.5vw,4.4rem)', fontWeight: 900, fontStyle: 'italic', fontFamily: "'Barlow Condensed',sans-serif", color: T.textMain, marginBottom: '3rem' }}>
            <GhostTitle text="DE L'IDÉE À LA MISE en ligne." />
            DE L'IDÉE À LA MISE{' '}
            <GreenUnderline><span className="text-gradient">en ligne.</span></GreenUnderline>
          </h2>
        </BlurReveal>

        {/* Label + liste — centrés */}
        <div style={{ paddingLeft: 'var(--body-indent)', paddingRight: 'var(--body-indent)' }}>
          <BlurReveal delay={0.05}>
            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.6rem', letterSpacing: '.42em', textTransform: 'uppercase', color: '#88ca53', display: 'block', marginBottom: '1.5rem' }}>
              Notre processus
            </span>
          </BlurReveal>

          {/* ── Hover Image Reveal — toutes les étapes du processus ── */}
          <BlurReveal delay={0.15}>
            <div style={{ borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}`, padding: '.5rem 0' }}>
              <HoverImageReveal items={HOVER_ITEMS} />
            </div>
          </BlurReveal>
        </div>

      </div>
    </section>
  )
}
// ── TESTIMONIALS (inchangé) ───────────────────────────────────
function Testimonials() {
  const T = useTheme()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const [idx, setIdx] = useState(0)
  const t = TESTIMONIALS[idx]

  useEffect(() => {
    const timer = setInterval(() => setIdx(i => (i + 1) % TESTIMONIALS.length), 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section ref={ref} style={{ padding: '7rem 5%', background: T.bgAlt, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle,rgba(136,202,83,.05),transparent 65%)', pointerEvents: 'none' }} />

      {/* Titre — colonne gauche alignée avec tous les autres titres (maxWidth 1200) */}
      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'left', marginBottom: '3.5rem' }}>
          <BlurReveal delay={0.1}>
            <h2 className="section-title-big" style={{ position: 'relative', fontSize: 'clamp(2.8rem,5.5vw,4.4rem)', fontWeight: 900, fontStyle: 'italic', fontFamily: "'Barlow Condensed',sans-serif", color: T.textMain }}>
              <GhostTitle text="CE QUE DISENT NOS CLIENTS" />
              Ce que disent nos <GreenUnderline><span className="text-gradient">clients</span></GreenUnderline>
            </h2>
          </BlurReveal>
        </div>
      </div>

      {/* Carrousel — reste centré dans sa propre colonne (maxWidth 900) */}
      <div style={{ maxWidth: 900, margin: '0 auto', position: 'relative', zIndex: 1 }}>
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
// ── DOMAINES D'INTERVENTION — inspiré V-labs ─────────────────
// ═══════════════════════════════════════════════════════════════
const DOMAINES = [
  {
    n: '01', Icon: Monitor,
    title: 'Sites Vitrine & Landing Pages',
    desc:  "Votre présence digitale professionnelle, optimisée pour convertir vos visiteurs en clients. Design sur mesure, SEO intégré, livré en 7 à 14 jours.",
    tag:   'Site Vitrine',
    img:   '/images/projects/techflow-preview.webp',        // TechFlow — site vitrine
  },
  {
    n: '02', Icon: ShoppingBag,
    title: 'E-Commerce & Boutiques en ligne',
    desc:  "Boutiques complètes avec paiement Mobile Money (Orange Money, Wave), gestion des stocks, tableau de bord admin et notifications commandes.",
    tag:   'E-Commerce',
    img:   '/images/projects/shopci-preview.webp',          // ShopCI — marketplace e-commerce
  },
  {
    n: '03', Icon: LayoutDashboard,
    title: 'Applications SaaS & Métier',
    desc:  "Des outils web sur mesure pour automatiser vos processus, gérer vos équipes et économiser des heures de travail chaque semaine.",
    tag:   'SaaS',
    img:   '/images/projects/nexura-preview.webp',          // Nexura — app métier full-stack
  },
  {
    n: '04', Icon: Cog,
    title: 'Digitalisation de processus',
    desc:  "Remplacez vos fichiers Excel et WhatsApp par des applications robustes. Suivi en temps réel, rôles utilisateurs, reporting intégré.",
    tag:   'Digitalisation',
    img:   '/images/projects/moncashjour-preview.webp',     // MonCashJour — dashboard gestion ventes
  },
  {
    n: '05', Icon: Image,
    title: 'Portfolios & Identités créatives',
    desc:  "Des vitrines animées et percutantes pour créatifs, photographes, graphistes et freelances qui veulent décrocher plus de clients.",
    tag:   'Portfolio',
    img:   '/images/projects/jean-edy-preview.webp',        // Jean Edy — portfolio React avancé
  },
  {
    n: '06', Icon: Wrench,
    title: 'Maintenance & Évolutions',
    desc:  "Votre investissement sur la durée. Mises à jour, nouvelles fonctionnalités, corrections et support technique réactif sous 48h.",
    tag:   'Support',
    img:   '/images/service/maintenence.webp',              // Service maintenance AKATech
  },
]

// ── DOMAINE CARD — gère son propre hover + image curseur rectangulaire ──
function DomaineCard({ n, Icon, title, desc, tag, img, index, inView }) {
  const T = useTheme()
  const [isHovered, setIsHovered] = useState(false)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [rot, setRot] = useState(0)
  const cardRef = useRef(null)
  const rafRef  = useRef(null)

  const onMouseMove = (e) => {
    cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(() => {
      const rect = cardRef.current?.getBoundingClientRect()
      if (!rect) return
      setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
    })
  }

  const onEnter = () => { setIsHovered(true); setRot((Math.random() - 0.5) * 8) }
  const onLeave = () => setIsHovered(false)

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: index * 0.07, ease: [.22,1,.36,1] }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onMouseMove={onMouseMove}
      style={{ background: T.card, padding: '2.2rem', position: 'relative', overflow: 'visible', cursor: 'default' }}
    >
      {/* Glow hover */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(400px circle at 30% 30%, rgba(136,202,83,.07), transparent 65%)',
        opacity: isHovered ? 1 : 0, transition: 'opacity .25s',
      }} />

      {/* Numéro + Tag */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.4rem', position: 'relative', zIndex: 1 }}>
        <span style={{
          fontFamily: "'JetBrains Mono',monospace", fontSize: '2.8rem', fontWeight: 900,
          color: T.light ? 'rgba(136,202,83,.18)' : 'rgba(136,202,83,.15)',
          lineHeight: 1, letterSpacing: '-.05em',
        }}>
          {n}
        </span>
        <span style={{
          padding: '.22rem .72rem', borderRadius: 100,
          background: 'rgba(136,202,83,.08)', border: '1px solid rgba(136,202,83,.2)',
          fontFamily: "'JetBrains Mono',monospace", fontSize: '.6rem', fontWeight: 700,
          color: '#88ca53', letterSpacing: '.06em', textTransform: 'uppercase',
        }}>
          {tag}
        </span>
      </div>

      {/* Icône + Titre */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem', marginBottom: '.9rem', position: 'relative', zIndex: 1 }}>
        <div style={{
          width: 42, height: 42, borderRadius: 11,
          background: 'rgba(136,202,83,.1)', border: '1px solid rgba(136,202,83,.18)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <Icon size={20} style={{ color: '#88ca53' }} />
        </div>
        <h3 style={{
          fontFamily: "'JetBrains Mono',monospace", fontSize: '.97rem', fontWeight: 800,
          color: T.textMain, lineHeight: 1.25, letterSpacing: '-.02em',
        }}>
          {title}
        </h3>
      </div>

      {/* Description */}
      <p style={{ fontSize: '.83rem', color: T.textSub, lineHeight: 1.7, position: 'relative', zIndex: 1 }}>
        {desc}
      </p>

      {/* Barre verte bas au hover */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 2,
        background: 'linear-gradient(90deg, transparent, #88ca53, transparent)',
        transformOrigin: 'left',
        transform: isHovered ? 'scaleX(1)' : 'scaleX(0)',
        transition: 'transform .3s ease',
      }} />

      {/* ── Image capture d'écran qui suit le curseur — rectangulaire, propre à cette card ── */}
      {img && (
        <div style={{
          position: 'absolute', top: 0, left: 0,
          width: 280, height: 178,                 // ratio ~16:10, format capture d'écran PC
          borderRadius: 12, overflow: 'hidden',
          pointerEvents: 'none', zIndex: 30,
          transform: `translate(${pos.x - 140}px, ${pos.y - 215}px) rotate(${rot}deg) scale(${isHovered ? 1 : 0.7})`,
          opacity: isHovered ? 1 : 0,
          transition: 'opacity .22s ease, transform .18s cubic-bezier(.22,1,.36,1)',
          boxShadow: '0 24px 70px rgba(0,0,0,.55)',
          border: '1.5px solid rgba(136,202,83,.35)',
          willChange: 'transform, opacity',
        }}>
          <img
            src={img}
            alt={title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        </div>
      )}
    </motion.div>
  )
}

function DomainesSection() {
  const T   = useTheme()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  // Scroll-reveal mot par mot + tilt — même mécanique que WordRevealP
  const sectionRef  = useRef(null)
  const domTextRef  = useRef(null)
  const domWordsRef = useRef([])
  const DOM_TEXT = "De la vitrine au SaaS, de la boutique au portfolio — nous intervenons sur l'ensemble de la chaîne digitale pour concrétiser votre vision."
  const DOM_GREEN = new Set(['SaaS,', 'portfolio', 'chaîne', 'digitale', 'concrétiser', 'vision.'])

  useEffect(() => {
    const container = sectionRef.current
    const textEl    = domTextRef.current
    if (!container || !textEl) return
    const onScroll = () => {
      const rect     = container.getBoundingClientRect()
      const winH     = window.innerHeight
      const total    = winH + container.offsetHeight
      const traveled = winH - rect.top
      const progress = Math.max(0, Math.min(1, traveled / total))
      // tilt
      textEl.style.transform = `rotate(${3 * (1 - Math.min(progress / 0.20, 1))}deg)`
      textEl.style.opacity   = String(Math.min(1, 0.4 + progress * 1.2))
      // mots
      const words = domWordsRef.current
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

  return (
    <section
      ref={el => { ref.current = el; sectionRef.current = el }}
      style={{ padding: '7rem 5%', background: T.bgAlt, position: 'relative', overflow: 'hidden' }}
    >
      {/* Décoration big text */}
      <div style={{
        position: 'absolute', left: '-1%', top: '50%', transform: 'translateY(-50%)',
        fontFamily: "'JetBrains Mono',monospace", fontSize: 'clamp(10rem,18vw,18rem)', fontWeight: 900,
        color: T.light ? 'rgba(136,202,83,.04)' : 'rgba(136,202,83,.03)',
        lineHeight: 1, pointerEvents: 'none', userSelect: 'none', letterSpacing: '-.05em',
      }}>
        DOM
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <div style={{ textAlign: 'left', marginBottom: '4rem' }}>
          <BlurReveal delay={0.12}>
            <h2 className="section-title-big" style={{
              position: 'relative',
              fontSize: 'clamp(2.6rem,5vw,4rem)',
              color: T.textMain,
              lineHeight: 1,
            }}>
              <GhostTitle text="DANS QUEL AXE DE CRÉATION S'INSCRIT VOTRE PROJET ?" />
              Dans quel axe de création{' '}
              <GreenUnderline><span className="text-gradient">s'inscrit votre projet ?</span></GreenUnderline>
            </h2>
          </BlurReveal>
          <p
            ref={domTextRef}
            style={{
              fontFamily: "'JetBrains Mono',monospace",
              fontSize: 'clamp(1.6rem,3.2vw,2.6rem)',
              fontWeight: 700,
              lineHeight: 1.32,
              color: T.textSub,
              margin: '1rem 0 0',
              paddingLeft: 'var(--body-indent)',
              paddingRight: 'var(--body-indent)',
              transformOrigin: '0% 50%',
              transition: 'transform .05s linear',
            }}
          >
            {DOM_TEXT.split(' ').map((word, i) => (
              <span
                key={i}
                ref={el => { domWordsRef.current[i] = el }}
                style={{
                  display: 'inline-block',
                  marginRight: '0.28em',
                  opacity: 0.08,
                  filter: 'blur(9px)',
                  willChange: 'opacity, filter',
                  color: DOM_GREEN.has(word) ? '#88ca53' : 'inherit',
                }}
              >
                {word}
              </span>
            ))}
          </p>
        </div>

        {/* Grille — chaque card gère son propre hover + image curseur */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1px', background: T.border, borderRadius: 20, overflow: 'visible',
          border: `1px solid ${T.border}`,
        }}>
          {DOMAINES.map((domaine, i) => (
            <DomaineCard key={domaine.n} {...domaine} index={i} inView={inView} />
          ))}
        </div>

        {/* CTA bas */}
        <BlurReveal delay={0.4} style={{ textAlign: 'center', marginTop: '3rem' }}>
          <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.88rem', color: T.textMuted, marginBottom: '1.2rem' }}>
            Votre projet ne rentre dans aucune case ? On s'adapte.
          </p>
          <a
            href="https://wa.me/2250142507750"
            target="_blank" rel="noreferrer"
            className="btn-raised"
            style={{ fontSize: '.9rem', padding: '.85rem 2rem' }}
          >
            Discuter de mon projet <ArrowRight size={14} />
          </a>
        </BlurReveal>
      </div>
    </section>
  )
}

// ── TUNNEL ARCHIVE 3D ──────────────────────────────────────────
// Port de l'effet "15 / LE TUNNEL ARCHIVE 3D" (5haut_niveay.html) :
// grille pinnée en perspective 3D, qui avance vers la caméra au scroll.
function ArchiveTunnelSection() {
  const T = useTheme()
  const wrapRef = useRef(null)
  const gridRef = useRef(null)
  const TUNNEL_ITEMS = [
    ...PROJECTS.filter(p => p.id === 15 || p.id === 18),
    ...PROJECTS.filter(p => p.id === 17 || p.id === 16),
    ...PROJECTS.filter(p => p.id === 12 || p.id === 11),
    ...PROJECTS.filter(p => p.id === 19),
  ]
  const DEPTHS = [0, -220, -60, -340, -120, -260, -180]
  const SPANS  = [1, 1, 1, 1, 2, 1, 1]

  useEffect(() => {
    const onScroll = () => {
      const wrap = wrapRef.current
      const grid = gridRef.current
      if (!wrap || !grid) return
      const winH = window.innerHeight
      const top = wrap.getBoundingClientRect().top
      const pinDistance = wrap.offsetHeight - winH
      const progress = pinDistance > 0 ? Math.min(1, Math.max(0, -top / pinDistance)) : 0

      grid.style.transform = `translateZ(${progress * 1000}px) rotateX(${progress * 15}deg)`
      grid.style.opacity   = String(progress > 0.9 ? Math.max(0, 1 - (progress - 0.9) / 0.1) : 1)

      const sat = Math.min(1, progress * 1.4)
      grid.querySelectorAll('.tunnel-cell').forEach(cell => {
        cell.style.filter = `grayscale(${1 - sat}) contrast(1.05)`
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div ref={wrapRef} style={{ position: 'relative', height: '250vh', background: T.bg }}>

      {/* Titre de section — statique, même système d'alignement que les autres titres (maxWidth 1200) */}
      <div style={{ padding: '5rem 5% 0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <h2 className="section-title-big" style={{ position: 'relative', fontSize: 'clamp(2.8rem,5.5vw,4.4rem)', fontWeight: 900, fontStyle: 'italic', fontFamily: "'Barlow Condensed',sans-serif", color: T.textMain, margin: 0 }}>
            <GhostTitle text="NOS DERNIÈRES RÉALISATIONS" />
            Nos dernières <GreenUnderline><span className="text-gradient">réalisations</span></GreenUnderline>
          </h2>
          <Link href="/projects" className="btn-ghost" style={{ flexShrink: 0, display: 'inline-flex', alignItems: 'center', gap: '.4rem' }}>
            Voir tous les projets <ArrowRight size={15} />
          </Link>
        </div>
      </div>

      <section style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden', perspective: '1200px', display: 'flex', alignItems: 'center' }}>

        <div
          ref={gridRef}
          style={{
            width: '100%', height: '100%',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '2vw',
            padding: '15vh 8vw',
            transformStyle: 'preserve-3d',
            willChange: 'transform',
          }}
        >
          {TUNNEL_ITEMS.map((p, i) => (
            <div
              key={p.id}
              className="tunnel-cell"
              style={{
                gridColumn: SPANS[i] === 2 ? 'span 2' : 'auto',
                position: 'relative',
                minHeight: 180,
                borderRadius: 10,
                overflow: 'hidden',
                border: '1px solid rgba(136,202,83,.4)',
                transform: `translateZ(${DEPTHS[i] || 0}px)`,
                filter: 'grayscale(1) contrast(1.05)',
                transition: 'filter .15s linear',
              }}
            >
              <LazyImg src={p.img} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 55%, rgba(0,0,0,.78) 100%)' }} />
              <div style={{ position: 'absolute', bottom: '.6rem', left: '.7rem', right: '.7rem' }}>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.7rem', fontWeight: 700, color: '#fff' }}>{p.title}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

// ── STATS — chiffres géants éditoriaux, quinconce (ref web_design_result) ──
const HOME_STATS = [
  { target: PROJECTS.length,  suffix: '',  label: 'Projets livrés',                  sub: 'Du concept au déploiement', col: 1, row: 1 },
  { target: 99,  suffix: '%', label: 'Clients satisfaits',              sub: 'Livrés dans les délais',    col: 3, row: 1 },
  { target: 10,  suffix: '+', label: 'Clients accompagnés',             sub: 'Startups, PME, créatifs',   col: 5, row: 1 },
  { target: 3,   suffix: '+', label: "Années d'expérience",             sub: 'En développement web',      col: 2, row: 2 },
]

function StatsSection() {
  const T = useTheme()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  // Positons quinconce : ligne 1 → col 1, 3, 5 ; ligne 2 → col 2, 4
  // Sur une grille de 6 colonnes égales
  const POSITIONS = [
    { gridColumn: '1 / 3', gridRow: 1 },   // 18  — gauche
    { gridColumn: '3 / 5', gridRow: 1 },   // 99% — centre
    { gridColumn: '5 / 7', gridRow: 1 },   // 10+ — droite
    { gridColumn: '2 / 4', gridRow: 2 },   // 3+  — décalé gauche
  ]

  return (
    <section ref={ref} style={{ padding: '7rem 5% 8rem', background: T.bg, position: 'relative', overflow: 'hidden' }}>

      {/* Halo subtil */}
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 800, height: 500, borderRadius: '50%', background: 'radial-gradient(ellipse,rgba(136,202,83,.04),transparent 65%)', pointerEvents: 'none' }} />

      {/* Séparateur haut */}
      <div style={{ position: 'absolute', top: 0, left: '5%', right: '5%', height: 1, background: T.border }} />

      <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <style>{`
          .stats-quinconce {
            display: grid;
            grid-template-columns: repeat(6, 1fr);
            grid-template-rows: auto auto;
            row-gap: 1rem;
            column-gap: 0;
          }
          @media (max-width: 760px) {
            .stats-quinconce {
              grid-template-columns: 1fr 1fr;
              grid-template-rows: unset;
            }
            .stats-quinconce > div {
              grid-column: span 1 !important;
              grid-row: unset !important;
            }
          }
        `}</style>

        <div className="stats-quinconce">
          {HOME_STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 32 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: .7, delay: i * .12, ease: [.22,1,.36,1] }}
              style={{
                gridColumn: POSITIONS[i].gridColumn,
                gridRow: POSITIONS[i].gridRow,
                padding: '2.5rem 1rem 2.5rem 0',
                borderLeft: `1px solid ${T.border}`,
                paddingLeft: '1.8rem',
              }}>

              {/* Chiffre géant */}
              <div style={{
                fontFamily: "'JetBrains Mono',monospace",
                fontWeight: 900,
                fontSize: 'clamp(4rem,8vw,7rem)',
                lineHeight: 1,
                color: T.light ? '#111' : 'rgba(255,255,255,.92)',
                letterSpacing: '-.04em',
                marginBottom: '.5rem',
              }}>
                <AnimatedCounter target={s.target} suffix={s.suffix} />
              </div>

              {/* Label principal */}
              <div style={{
                fontFamily: "'JetBrains Mono',monospace",
                fontSize: '.82rem',
                fontWeight: 700,
                color: T.light ? '#5f9137' : '#88ca53',
                letterSpacing: '.02em',
                marginBottom: '.2rem',
              }}>
                {s.label}
              </div>

              {/* Sous-label */}
              <div style={{
                fontFamily: "'JetBrains Mono',monospace",
                fontSize: '.7rem',
                color: T.textMuted,
                letterSpacing: '.02em',
              }}>
                {s.sub}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Séparateur bas */}
      <div style={{ position: 'absolute', bottom: 0, left: '5%', right: '5%', height: 1, background: T.border }} />
    </section>
  )
}

// ── HOME PAGE ────────────────────────────────────────────────

// --- Sections moved from Contact + FAQ / Pricing callout ---
const GEO_PAYS = [
  { code: 'CI', name: "Côte d'Ivoire", note: 'Siège — Abidjan', primary: true },
  { code: 'SN', name: 'Sénégal', note: 'WhatsApp & Zoom' },
  { code: 'CM', name: 'Cameroun', note: 'WhatsApp & Zoom' },
  { code: 'BJ', name: 'Bénin', note: 'WhatsApp & Zoom' },
  { code: 'BF', name: 'Burkina Faso', note: 'WhatsApp & Zoom' },
  { code: 'FR', name: 'France', note: 'Diaspora africaine' },
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

function PricingCallout() {
  const T = useTheme()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const [tab, setTab] = useState('vitrine')
  const d = PRICING[tab]
  const PRICING_LEAD_GREEN = new Set(['claires,', 'structures', 'freelances', 'choisissez.'])

  return (
    <section ref={ref} style={{ padding: '6rem 5% 7rem', background: T.bg, position: 'relative', overflow: 'hidden' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* Section Header */}
        <div style={{ textAlign: 'left', marginBottom: '1.5rem' }}>
          <BlurReveal>
            <h2 className="section-title-big" style={{ position: 'relative', fontSize: 'clamp(2.8rem,5.5vw,4.4rem)', fontWeight: 900, fontStyle: 'italic', fontFamily: "'Barlow Condensed',sans-serif", marginBottom: '.6rem', color: T.textMain }}>
              <GhostTitle text="CHOISISSEZ VOTRE FORMULE IDÉALE" />
              Choisissez votre <GreenUnderline><span className="text-gradient">formule idéale</span></GreenUnderline>
            </h2>
          </BlurReveal>
          <BlurReveal delay={0.12}>
            <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 'clamp(1.6rem,3.2vw,2.6rem)', fontWeight: 700, lineHeight: 1.32, color: T.textSub, paddingLeft: 'var(--body-indent)', paddingRight: 'var(--body-indent)' }}>
              {"Des formules claires, adaptées aux besoins des petites structures et freelances — comparez et choisissez.".split(' ').map((word, i) => (
                <span key={i} style={{ color: PRICING_LEAD_GREEN.has(word) ? '#88ca53' : 'inherit' }}>
                  {word}{' '}
                </span>
              ))}
            </p>
          </BlurReveal>
        </div>

        {/* Tabs */}
        <BlurReveal delay={0.15} style={{ display: 'flex', justifyContent: 'center', gap: '.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          {Object.entries(PRICING).map(([k, v]) => (
            <motion.button key={k} onClick={() => setTab(k)}
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              style={{ padding: '.55rem 1.4rem', borderRadius: 100, border: '1px solid', borderColor: tab === k ? T.green : T.border, background: tab === k ? 'linear-gradient(145deg,#8dd456,#5f9137)' : 'transparent', color: tab === k ? '#fff' : T.textSub, fontFamily: "'Barlow Condensed',sans-serif", fontStyle: 'italic', fontSize: '.82rem', fontWeight: 900, cursor: 'pointer', transition: 'all .22s' }}>
              {v.label}
            </motion.button>
          ))}
        </BlurReveal>

        {/* Glass Cards */}
        <AnimatePresence mode="wait">
          <motion.div key={tab}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: .3 }}
            className="pricing-grid">
            {d.plans.map((plan, i) => {
              const wa = encodeURIComponent(`Bonjour AKATech, je suis intéressé par l'offre ${plan.badge} à ${plan.price}`)
              return (
                <BlurReveal key={plan.badge} delay={i * 0.1} direction={['left', 'up', 'right'][i] || 'up'}>
                  <motion.div
                    whileHover={{ y: -8, transition: { duration: .25 } }}
                    style={{ position: 'relative', borderRadius: 20, overflow: 'hidden', background: plan.popular ? 'linear-gradient(145deg,rgba(136,202,83,.18),rgba(136,202,83,.06))' : T.light ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,.04)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: plan.popular ? '1px solid rgba(136,202,83,.5)' : `1px solid ${T.light ? 'rgba(0,0,0,.1)' : 'rgba(255,255,255,.1)'}`, boxShadow: plan.popular ? '0 8px 40px rgba(136,202,83,.2),inset 0 1px 0 rgba(255,255,255,.15)' : T.light ? '0 4px 24px rgba(0,0,0,.08)' : '0 8px 32px rgba(0,0,0,.4),inset 0 1px 0 rgba(255,255,255,.06)', padding: plan.popular ? '0 0 2rem' : '2rem', height: '100%', display: 'flex', flexDirection: 'column' }}>
                    {plan.popular && (
                      <div style={{ padding: '.5rem', background: 'linear-gradient(90deg,#5f9137,#88ca53)', textAlign: 'center', fontFamily: "'JetBrains Mono',monospace", fontSize: '.6rem', fontWeight: 700, color: '#fff', letterSpacing: '.1em', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '.4rem', borderRadius: '19px 19px 0 0' }}>
                        <Zap size={10} />LE PLUS POPULAIRE
                      </div>
                    )}
                    <div style={{ padding: plan.popular ? '1.8rem 2rem 0' : 0, display: 'flex', flexDirection: 'column', flex: 1 }}>
                      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '50%', background: 'linear-gradient(180deg,rgba(255,255,255,.07) 0%,transparent 100%)', borderRadius: '20px 20px 0 0', pointerEvents: 'none' }} />
                      <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.65rem', fontWeight: 600, color: plan.popular ? '#88ca53' : T.textMuted, textTransform: 'uppercase', marginBottom: '.6rem' }}>{plan.badge}</div>
                      <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 'clamp(1.4rem,2.5vw,1.7rem)', fontWeight: 900, color: T.textMain, marginBottom: '.2rem', letterSpacing: '-0.02em', lineHeight: 1.1 }}>{plan.price}</div>
                      <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.62rem', color: T.textMuted, marginBottom: '1.6rem', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Timer size={11} style={{ color: T.green }} />{plan.del}
                      </div>
                      <div style={{ height: 1, background: plan.popular ? 'rgba(136,202,83,.25)' : 'rgba(255,255,255,.08)', marginBottom: '1.4rem' }} />
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '.65rem', marginBottom: '1.8rem', flex: 1 }}>
                        {plan.features.map(f => (
                          <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '.6rem', fontSize: '.83rem', color: T.textSub, lineHeight: 1.5 }}>
                            <div style={{ width: 18, height: 18, borderRadius: '50%', flexShrink: 0, marginTop: 1, background: plan.popular ? 'rgba(136,202,83,.2)' : 'rgba(255,255,255,.06)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <Check size={11} style={{ color: '#88ca53' }} />
                            </div>
                            {f}
                          </div>
                        ))}
                      </div>
                      {plan.popular
                        ? <a href={`https://wa.me/2250142507750?text=${wa}`} target="_blank" rel="noreferrer" className="btn-raised" style={{ width: '100%', justifyContent: 'center', display: 'flex', marginTop: 'auto' }}>Commander →</a>
                        : <a href={`https://wa.me/2250142507750?text=${wa}`} target="_blank" rel="noreferrer" className="btn-ghost" style={{ width: '100%', justifyContent: 'center', display: 'flex', marginTop: 'auto' }}>Commander →</a>
                      }
                    </div>
                  </motion.div>
                </BlurReveal>
              )
            })}
          </motion.div>
        </AnimatePresence>

        {/* Urgency bar */}
        <BlurReveal delay={0.5}>
          <div style={{ marginTop: '2.5rem', padding: '1rem 1.6rem', borderRadius: 14, background: 'rgba(136,202,83,.04)', border: '1px solid rgba(136,202,83,.15)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#88ca53', boxShadow: '0 0 8px rgba(136,202,83,.8)', animation: 'dot-blink 1.4s ease-in-out infinite', flexShrink: 0 }} />
              <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.72rem', color: T.textSub, letterSpacing: '.04em', margin: 0 }}>
                <span style={{ color: '#b3ee85', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '.3rem' }}>
                  <AlertTriangle size={12} /> 2 créneaux disponibles
                </span>
                {' '}ce mois-ci — les projets sont traités dans l'ordre d'arrivée.
              </p>
            </div>
            <a href="https://wa.me/2250142507750?text=Bonjour+AKATech,+je+veux+réserver+mon+projet+!" target="_blank" rel="noreferrer"
              className="btn-raised" style={{ padding: '.55rem 1.2rem', fontSize: '.78rem', flexShrink: 0, whiteSpace: 'nowrap' }}>
              Réserver ma place →
            </a>
          </div>
        </BlurReveal>
      </div>
    </section>
  )
}

function FAQSectionHome() {
  const T = useTheme()
  const [open, setOpen] = useState(null)
  return (
    <section style={{ padding: '7rem 5%', background: T.bg, position: 'relative', overflow: 'hidden' }}>
      <div className="grid-bg" style={{ position: 'absolute', inset: 0, opacity: .15 }} />
      <div style={{ maxWidth: 1200, margin: '0 auto 3.5rem', position: 'relative', zIndex: 1 }}>
        <BlurReveal delay={0.1}>
          <h2 className="section-title-big" style={{ position: 'relative', fontSize: 'clamp(2.8rem,5.5vw,4.4rem)', fontWeight: 900, fontStyle: 'italic', fontFamily: "'Barlow Condensed',sans-serif", color: T.textMain, letterSpacing: '-.03em' }}>
            <GhostTitle text="QUESTIONS FRÉQUENTES" />
            Questions <GreenUnderline><span className="text-gradient">fréquentes</span></GreenUnderline>
          </h2>
        </BlurReveal>
      </div>
      <div style={{ maxWidth: 800, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '.75rem' }}>
          {FAQ_ITEMS.slice(0, 6).map(({ q, a }, i) => (
            <BlurReveal key={q} delay={i * 0.06} direction={i % 2 === 0 ? 'left' : 'right'}>
              <motion.div className="sku-card" whileHover={{ borderColor: 'rgba(136,202,83,.25)' }} style={{ overflow: 'hidden' }}>
                <button onClick={() => setOpen(open === i ? null : i)}
                  style={{ width: '100%', padding: '1.2rem 1.5rem', background: 'none', border: 'none', color: T.textMain, fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, fontSize: '.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', textAlign: 'left' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '.6rem' }}>
                    <HelpCircle size={14} style={{ color: T.green, flexShrink: 0 }} />{q}
                  </span>
                  <motion.div animate={{ rotate: open === i ? 180 : 0 }} transition={{ duration: .25 }}>
                    <ChevronDown size={16} style={{ color: open === i ? T.green : T.textMuted, flexShrink: 0 }} />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {open === i && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: .3 }} style={{ overflow: 'hidden' }}>
                      <div style={{ padding: '0 1.5rem 1.2rem', fontSize: '.85rem', color: T.textSub, lineHeight: 1.7, borderTop: `1px solid ${T.border}`, paddingTop: '1rem' }}>
                        {a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </BlurReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function GeoSectionHome() {
  const T = useTheme()
  const sectionRef = useRef(null)
  return (
    <section ref={sectionRef} style={{ padding: '5rem 5%', background: T.bg, position: 'relative', overflow: 'hidden' }}>
      <div className="grid-bg" style={{ position: 'absolute', inset: 0, opacity: .16 }} />
      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ marginBottom: '2.5rem' }}>
          <BlurReveal>
            <h2 className="section-title-big" style={{ position: 'relative', fontSize: 'clamp(2.8rem,5.5vw,4.4rem)', fontWeight: 900, fontStyle: 'italic', fontFamily: "'Barlow Condensed',sans-serif", color: T.textMain, letterSpacing: '-.03em' }}>
              <GhostTitle text="OÙ INTERVENONS-NOUS ?" />
              Où intervenons-<GreenUnderline><span className="text-gradient">nous ?</span></GreenUnderline>
            </h2>
          </BlurReveal>
          <WordRevealP
            sectionRef={sectionRef}
            text="Basés à Abidjan, on travaille 100% remote avec des clients partout en Afrique de l'Ouest et la diaspora."
            greenWords={['Abidjan,', 'remote', "l'Afrique", "l'Ouest", 'diaspora.']}
            extraStyle={{ color: T.textSub, marginTop: '.75rem' }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: '.85rem', marginBottom: '2rem' }}>
          {GEO_PAYS.map(({ code, name, note, primary }, i) => (
            <motion.div key={name} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * .06 }} whileHover={{ y: -4 }} style={{ padding: '1rem 1.2rem', borderRadius: 14, background: primary ? 'linear-gradient(135deg,rgba(136,202,83,.12),rgba(136,202,83,.04))' : (T.light ? 'rgba(0,0,0,.03)' : 'rgba(255,255,255,.03)'), border: `1px solid ${primary ? 'rgba(136,202,83,.3)' : T.border}`, display: 'flex', alignItems: 'center', gap: '.75rem' }}>
              <FlagBadge code={code} primary={primary} />
              <div>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, fontSize: '.82rem', color: primary ? '#88ca53' : T.textMain }}>{name}</div>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.62rem', color: T.textMuted }}>{note}</div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}

function ProjectFormHome() {
  const T = useTheme()
  const ref = useRef(null)
  const sectionRef = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const [form, setForm] = useState({ name: '', email: '', phone: '', service: '', message: '' })
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const inputStyle = { width: '100%', padding: '.6rem 0', background: 'transparent', border: 'none', borderBottom: `1px solid ${T.border}`, borderRadius: 0, color: T.textMain, fontFamily: "'JetBrains Mono',monospace", fontSize: '1rem', outline: 'none', transition: 'border-color .25s', boxSizing: 'border-box', colorScheme: T.light ? 'light' : 'dark' }
  const focusOn = e => { e.target.style.borderBottomColor = '#88ca53' }
  const focusOff = e => { e.target.style.borderBottomColor = T.border }
  const [error, setError] = useState('')
  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.message) return
    setSending(true)
    setError('')
    try {
      const res = await fetch('/api/contact/', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, projectType: form.service }) })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || "Erreur lors de l'envoi")
      setSent(true)
    } catch (err) {
      setError(err.message || "Une erreur est survenue. Réessayez ou contactez-nous sur WhatsApp.")
    } finally { setSending(false) }
  }

  return (
    <section ref={el => { ref.current = el; sectionRef.current = el }} style={{ padding: 'clamp(2rem,4vw,3rem) 5% clamp(3rem,7vw,6rem)', background: T.bgAlt }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <BlurReveal style={{ marginBottom: '2rem' }}>
          <h2 className="section-title-big" style={{ position: 'relative', fontSize: 'clamp(2.8rem,5.5vw,4.4rem)', fontWeight: 900, fontStyle: 'italic', fontFamily: "'Barlow Condensed',sans-serif", color: T.textMain, letterSpacing: '-.03em', marginBottom: '.5rem' }}>
            <GhostTitle text="DÉCRIVEZ VOTRE PROJET" />
            Décrivez votre <GreenUnderline><span className="text-gradient">projet</span></GreenUnderline>
          </h2>
        </BlurReveal>
        <WordRevealP sectionRef={sectionRef} text="Remplissez le formulaire — on vous recontacte par email sous 24h avec un devis gratuit." greenWords={['formulaire', 'email', '24h', 'gratuit.']} extraStyle={{ color: T.textSub, marginBottom: '2.5rem' }} />

        <BlurReveal delay={0.15}>
          <AnimatePresence mode="wait">
            {sent ? (
              <motion.div key="success" initial={{ opacity: 0, scale: .9 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center', padding: 'clamp(2rem,6vw,3rem) 1rem' }}>
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 18 }} style={{ width: 64, height: 64, borderRadius: '50%', border: '1.5px solid rgba(136,202,83,.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                  <Check size={30} style={{ color: '#88ca53' }} />
                </motion.div>
                <h3 style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, fontSize: 'clamp(1.1rem,3vw,1.4rem)', color: T.textMain, marginBottom: '.8rem' }}>Message envoyé !</h3>
                <p style={{ color: T.textSub, fontSize: '.88rem', lineHeight: 1.7 }}>Votre demande a bien été reçue. On répond en moins de 24h directement par email — à très vite !</p>
              </motion.div>
            ) : (
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(220px,100%),1fr))', gap: '1.6rem', marginBottom: '1.6rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '.68rem', color: T.textMuted, marginBottom: '.5rem', fontFamily: "'JetBrains Mono',monospace", letterSpacing: '.1em', textTransform: 'uppercase' }}>Votre nom</label>
                    <input style={inputStyle} placeholder="Elvis Aka" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} onFocus={focusOn} onBlur={focusOff} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '.68rem', color: T.textMuted, marginBottom: '.5rem', fontFamily: "'JetBrains Mono',monospace", letterSpacing: '.1em', textTransform: 'uppercase' }}>Email</label>
                    <input type="email" style={inputStyle} placeholder="vous@email.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} onFocus={focusOn} onBlur={focusOff} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(220px,100%),1fr))', gap: '1.6rem', marginBottom: '1.6rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '.68rem', color: T.textMuted, marginBottom: '.5rem', fontFamily: "'JetBrains Mono',monospace", letterSpacing: '.1em', textTransform: 'uppercase' }}>WhatsApp / Tél</label>
                    <input style={inputStyle} placeholder="+225 07 XX XX XX" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} onFocus={focusOn} onBlur={focusOff} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '.68rem', color: T.textMuted, marginBottom: '.5rem', fontFamily: "'JetBrains Mono',monospace", letterSpacing: '.1em', textTransform: 'uppercase' }}>Type de projet</label>
                    <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.service} onChange={e => setForm(f => ({ ...f, service: e.target.value }))} onFocus={focusOn} onBlur={focusOff}>
                      <option value="">Choisir...</option>
                      <option value="site-vitrine">Conception de Site Web</option>
                      <option value="e-commerce">E-commerce</option>
                      <option value="application-web">Application Web / SaaS</option>
                      <option value="cartes-dashboards">Cartes Interactives & Dashboards</option>
                      <option value="api-backend">API & Backend</option>
                      <option value="google-my-business">Fiche Google My Business</option>
                      <option value="maintenance">Maintenance & Support</option>
                      <option value="autre">Autre</option>
                    </select>
                  </div>
                </div>

                <div style={{ marginBottom: '2.4rem' }}>
                  <label style={{ display: 'block', fontSize: '.68rem', color: T.textMuted, marginBottom: '.5rem', fontFamily: "'JetBrains Mono',monospace", letterSpacing: '.1em', textTransform: 'uppercase' }}>Votre besoin en une phrase</label>
                  <input style={inputStyle} placeholder="Ex: Boutique en ligne avec paiement Mobile Money"
                    value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} onFocus={focusOn} onBlur={focusOff} />
                </div>

                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: .97 }} onClick={handleSubmit}
                  className="btn-raised" style={{ justifyContent: 'center', fontSize: '.95rem', opacity: sending ? .7 : 1 }}>
                  {sending ? (
                    <><span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin .6s linear infinite', display: 'inline-block' }} /> Envoi en cours...</>
                  ) : (
                    <><Send size={16} /> Recevoir mon devis en 24h</>
                  )}
                </motion.button>

                {error && (
                  <p style={{ textAlign: 'left', fontSize: '.78rem', color: '#ff6b6b', marginTop: '.8rem' }}>
                    {error}
                  </p>
                )}

                <p style={{ textAlign: 'left', fontSize: '.72rem', color: T.textMuted, marginTop: '.9rem', display: 'flex', alignItems: 'center', gap: '.35rem' }}>
                  <Lock size={11} style={{ color: T.textMuted, flexShrink: 0 }} /> Vos données restent confidentielles. Aucun spam.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </BlurReveal>
      </div>
    </section>
  )
}

export default function HomePageDesktop() {
  return (
    <div style={{ paddingTop: 0 }}>
      <Hero />
      <StatsSection />
      <TrustStacksMarquee />
      <ServicesPreview />
      <DomainesSection />
      <PricingCallout />
      <WhyUs />
      <ArchiveTunnelSection />
      <GeoSectionHome />

      <ProjectFormHome />
      <FAQSectionHome />
      <ConversionMarquee />
      <Testimonials />

      <PageCTA
        message="Comme eux, donnez à votre activité la présence digitale qu'elle mérite."
        cta="Rejoindre nos clients"
      />
    </div>
  )
}