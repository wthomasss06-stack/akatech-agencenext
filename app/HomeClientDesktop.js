'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import {
  ArrowRight, Star, ExternalLink,
  Globe, ShoppingCart, Cpu, Server, Palette, Wrench, Map, MapPin,
  TrendingUp, Users, Clock, Award,
  MessageCircle, Target, Code, Rocket, Timer, ChevronLeft, ChevronRight,
  Monitor, ShoppingBag, LayoutDashboard, Cog, Image,
} from 'lucide-react'
import { useTheme } from '@/lib/theme'
import { GhostTitle, AnimatedCounter, LazyImg, PageCTA, GreenUnderline } from '@/components/ui/index'
import TrustStacksMarquee from '@/components/ui/TrustStacksMarquee'
import ConversionMarquee from '@/components/ui/ConversionMarquee'
import { SERVICES, PROJECTS, TESTIMONIALS } from '@/lib/data'

const ICON_MAP = { Globe, ShoppingCart, Cpu, Server, Palette, Wrench, Map, MapPin }

// ── TILT 3D CARD ──────────────────────────────────────────────
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

// ── HERO (inchangé) ───────────────────────────────────────────
// ── CIRCULAR PROJECTS GALLERY (inspiré Aeline/Catalis) ────────
function CircularProjectsGallery() {
  const T = useTheme()
  const GALLERY_ITEMS = [
    ...PROJECTS.filter(p => p.id === 15 || p.id === 18),
    ...PROJECTS.filter(p => p.id === 17 || p.id === 16),
    ...PROJECTS.filter(p => p.id === 12),
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

        

        <motion.p
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .45, delay: .12 }}
          style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 'clamp(1rem,1.3vw,1.15rem)', fontWeight: 500, letterSpacing: '.005em', color: 'rgba(255,255,255,.6)', marginBottom: '1.6rem', maxWidth: 600, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.7, textAlign: 'center' }}>
          Un site qui travaille pour vous 24h/24 — attirez des clients, gagnez en crédibilité et <span style={{ color: '#88ca53' }}>développez votre activité.</span>
        </motion.p>

        

        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .5, delay: .45 }}
          style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.8rem', justifyContent: 'center' }}>
          <a href="https://wa.me/2250142507750" target="_blank" rel="noreferrer" className="btn-raised" style={{ fontSize: '1rem', padding: '1rem 2.2rem' }}>
            Démarrer mon projet <ArrowRight size={16} />
          </a>
          <Link href="/contact" className="btn-ghost" style={{ fontSize: '1rem', padding: '1rem 2.2rem' }}>
             Prenez RDV
          </Link>
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
function LetterReveal({ text, style = {}, className = '', stagger = 0.028 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: false, margin: '-50px' })
  return (
    <span ref={ref} className={className} style={{ display: 'inline', ...style }}>
      {[...text].map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, filter: 'blur(4px)', y: 10 }}
          animate={inView
            ? { opacity: 1, filter: 'blur(0px)', y: 0 }
            : { opacity: 0, filter: 'blur(4px)', y: 10 }
          }
          transition={{ duration: 0.42, ease: 'easeOut', delay: i * stagger }}
          style={{ display: 'inline-block', whiteSpace: 'pre' }}
        >
          {char}
        </motion.span>
      ))}
    </span>
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
              fontFamily: "'JetBrains Mono',monospace", fontWeight: 800, flex: 1,
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
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
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
            <h2 className="section-title-big" style={{ position: 'relative', fontSize: 'clamp(2.8rem,5.5vw,4.4rem)', color: T.textMain }}>
              <GhostTitle text="NOS PRESTATIONS." />
              NOS{' '}
              <GreenUnderline>
                <span className="text-gradient">
                  <LetterReveal text="PRESTATIONS." stagger={0.03} />
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
          <h2 className="section-title-big" style={{ position: 'relative', fontSize: 'clamp(2.8rem,5.5vw,4.4rem)', color: T.textMain, marginBottom: '3rem' }}>
            <GhostTitle text="DE L'IDÉE À LA MISE EN LIGNE." />
            DE L'IDÉE À LA MISE{' '}
            <GreenUnderline><span className="text-gradient">EN LIGNE.</span></GreenUnderline>
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
            <h2 className="section-title-big" style={{ position: 'relative', fontSize: 'clamp(2.8rem,5.5vw,4.4rem)', color: T.textMain }}>
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

  // Scroll-reveal mot par mot + tilt — même mécanique que ScrollRevealText
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

// ═══════════════════════════════════════════════════════════════
// ── SCROLL REVEAL TEXT — effet entree.html (blur par mot + tilt) ─
// ═══════════════════════════════════════════════════════════════
function ScrollRevealText() {
  const T = useTheme()
  const containerRef = useRef(null)
  const textRef      = useRef(null)
  const wordsRef     = useRef([])

  const TEXT = "AKATech conçoit des sites et applications sur mesure pour les PME ambitieuses d'Abidjan et d'Afrique de l'Ouest. Design premium, performance optimisée et SEO pensé pour convertir : chaque projet est construit pour renforcer votre image et générer de nouvelles opportunités d'affaires."

  useEffect(() => {
    const container = containerRef.current
    const textEl    = textRef.current
    if (!container || !textEl) return

    const onScroll = () => {
      const rect        = container.getBoundingClientRect()
      const winH        = window.innerHeight
      const sectionH    = container.offsetHeight
      const totalTravel = winH + sectionH
      const traveled    = winH - rect.top
      const progress    = Math.max(0, Math.min(1, traveled / totalTravel))

      // Tilt : 3deg → 0deg, fini à progress 0.35
      const rotDeg = 3 * (1 - Math.min(progress / 0.35, 1))
      textEl.style.transform = `rotate(${rotDeg}deg)`
      textEl.style.opacity   = String(Math.min(1, 0.6 + progress * 0.8))

      // Mots : démarre à 0.10, tous révélés à 0.65 max
      const words  = wordsRef.current
      if (!words.length) return
      const wStart = 0.10
      const wEnd   = 0.65
      const wProg  = Math.max(0, Math.min(1, (progress - wStart) / (wEnd - wStart)))

      words.forEach((span, i) => {
        if (!span) return
        const threshold = i / (words.length - 1)
        const local     = Math.max(0, Math.min(1, (wProg - threshold * 0.82) / 0.22))
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
      ref={containerRef}
      style={{
        padding: '12rem 5%',
        minHeight: '120vh',
        display: 'flex',
        alignItems: 'center',
        background: T.bg,
        position: 'relative',
      }}
    >
      {/* Décoration lumineuse subtile */}
      <div style={{
        position: 'absolute',
        top: '50%', left: '50%',
        transform: 'translate(-50%,-50%)',
        width: '60vw', height: '60vw',
        maxWidth: 700, maxHeight: 700,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(136,202,83,.045) 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 1200, width: '100%', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Titre de section */}
        <h2 className="section-title-big" style={{
          position: 'relative',
          fontSize: 'clamp(2.8rem,5.5vw,4.4rem)',
          color: T.textMain,
          marginBottom: '2.5rem',
        }}>
          <GhostTitle text="À PROPOS DE AKATECH" />
          À propos de <GreenUnderline><span className="text-gradient">AKATech</span></GreenUnderline>
        </h2>

        {/* Texte principal avec effet blur-reveal */}
        <p
          ref={textRef}
          style={{
            fontFamily: "'JetBrains Mono',monospace",
            fontSize: 'clamp(1.6rem,3.2vw,2.6rem)',
            fontWeight: 700,
            lineHeight: 1.32,
            color: T.textMain,
            transformOrigin: '0% 50%',
            transition: 'transform .05s linear',
            margin: 0,
            paddingLeft: 'var(--body-indent)',
            paddingRight: 'var(--body-indent)',
          }}
        >
          {(() => {
          const greenWords = new Set(['PME', 'ambitieuses', 'premium,', 'optimisée', 'SEO', 'convertir', "d'affaires."])
          return TEXT.split(' ').map((word, i) => (
            <span
              key={i}
              ref={el => { wordsRef.current[i] = el }}
              style={{
                display: 'inline-block',
                marginRight: '0.28em',
                opacity: 0.08,
                filter: 'blur(9px)',
                willChange: 'opacity, filter',
                color: greenWords.has(word) ? '#88ca53' : 'inherit',
              }}
            >
              {word}
            </span>
          ))
        })()}
        </p>
      </div>
    </section>
  )
}

// ── TUNNEL ARCHIVE 3D (transition À propos → Stats) ───────────
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
  ]
  const DEPTHS = [0, -220, -60, -340, -120, -260]
  const SPANS  = [1, 1, 1, 1, 2, 1]

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
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h2 className="section-title-big" style={{ position: 'relative', fontSize: 'clamp(2.8rem,5.5vw,4.4rem)', color: T.textMain }}>
            <GhostTitle text="NOS DERNIÈRES RÉALISATIONS" />
            Nos dernières <GreenUnderline><span className="text-gradient">réalisations</span></GreenUnderline>
          </h2>
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
  { target: 18,  suffix: '',  label: 'Projets livrés',                  sub: 'Du concept au déploiement', col: 1, row: 1 },
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
export default function HomePageDesktop() {
  return (
    <div style={{ paddingTop: 0 }}>
      <Hero />
      <StatsSection />
      <ServicesPreview />
      <ArchiveTunnelSection />
      <TrustStacksMarquee />
      <DomainesSection />
      <WhyUs />
      <ConversionMarquee />
      <ScrollRevealText />
      <Testimonials />

      <PageCTA
        message="Comme eux, donnez à votre activité la présence digitale qu'elle mérite."
        cta="Rejoindre nos clients"
      />
    </div>
  )
}