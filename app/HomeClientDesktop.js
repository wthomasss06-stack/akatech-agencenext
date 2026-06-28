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
import { GhostTitle, AnimatedCounter, LazyImg, MarqueeStrip, PageCTA, GreenUnderline } from '@/components/ui/index'
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
  const GALLERY_ITEMS = PROJECTS.slice(0, 5)
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
        <motion.div
          animate={{ top: ['-5%', '105%'] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'linear', repeatDelay: 2 }}
          style={{ position: 'absolute', left: 0, right: 0, height: 1, background: 'linear-gradient(90deg,transparent,rgba(136,202,83,.32),transparent)', pointerEvents: 'none' }}
        />
      </div>

      <div ref={layerMidRef} style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: 1100, padding: '4rem 5% 0', willChange: 'transform, opacity, filter', transition: 'transform .1s ease-out', textAlign: 'center' }}>

        

        <motion.h1
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .55, delay: .15 }}
          style={{ position: 'relative', fontSize: 'clamp(2.4rem,5.5vw,4.4rem)', fontWeight: 800, fontFamily: "'JetBrains Mono',monospace", color: 'rgba(255,255,255,.92)', letterSpacing: '-.04em', lineHeight: 1.08, marginBottom: '.8rem', maxWidth: 880, marginLeft: 'auto', marginRight: 'auto' }}>
          <GhostTitle text="Digital, local,
 " />
          Digital, local,<br />
          <GreenUnderline><span className="text-gradient">rentable.</span></GreenUnderline>
        </motion.h1>

        

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
  { n: '01', Icon: Globe,    title: 'Conception de Site Web',          desc: "Création de sites web modernes, responsive et optimisés pour convertir vos visiteurs en clients. Du portfolio à la plateforme e-commerce.", price: 'À partir de 150 000 FCFA', del: '5-7 jours', img: '/images/service/creation%20de%20site%20web.webp' },
  { n: '02', Icon: Map,      title: 'Cartes Interactives & Dashboards', desc: "Intégration de cartes Mapbox / Leaflet et de dashboards de visualisation de données. Vos données brutes deviennent des interfaces actionnables.", price: 'Sur devis', del: '7-14 jours', img: '/images/service/dasbord.webp' },
  { n: '03', Icon: Server,   title: 'API & Backend Robustes',           desc: "Conception d'API RESTful sécurisées avec Django ou Flask. Authentification JWT, gestion des rôles, intégration Mobile Money.", price: 'À partir de 200 000 FCFA', del: '7-14 jours', img: '/images/service/api.webp' },
  { n: '04', Icon: Wrench,   title: 'Maintenance & Support',            desc: "Suivi technique, corrections de bugs, mises à jour de sécurité et améliorations continues. Vous vous concentrez sur votre métier.", price: 'À partir de 25 000 FCFA/mois', del: 'Contrat mensuel', img: '/images/service/maintenence.webp' },
  { n: '05', Icon: MapPin,   title: 'Fiche Google My Business',         desc: "Création ou optimisation de votre fiche Google (NAP, photos, SEO local) et suivi mensuel : avis, publications et statistiques.", price: 'À partir de 10 000 FCFA/mois', del: '1-2 jours', img: '/images/service/fiche-google.webp' },
]

function ServicesPreview() {
  const T = useTheme()

  return (
    <section style={{ background: T.bg, borderTop: `1px solid ${T.border}` }}>
      <style>{`
        .skew-section-grid { display: grid; grid-template-columns: 1fr 1fr; }
        .skew-sticky-col {
          position: sticky; top: 0; height: 100vh;
          display: flex; align-items: center; justify-content: center;
          padding: 3rem 4vw 3rem 5%;
        }
        .skew-right-col { display: grid; gap: 4rem; padding: 7rem 5% 7rem 3rem; }
        .skew-fig { display: flex; flex-direction: column; gap: 1.2rem; }
        .skew-fig:nth-child(odd)  .skew-fig-img { transform: skewX(-6deg); }
        .skew-fig:nth-child(even) .skew-fig-img { transform: skewX( 6deg); }
        .skew-fig-img {
          width: 100%; max-width: 420px; aspect-ratio: 1 / 1;
          object-fit: cover; border-radius: 18px;
          box-shadow: 0 40px 90px rgba(0,0,0,0.45);
          transition: transform 0.5s cubic-bezier(.22,1,.36,1), box-shadow 0.4s;
          display: block;
        }
        .skew-fig:hover .skew-fig-img { transform: skewX(0) scale(1.03) !important; box-shadow: 0 50px 100px rgba(0,0,0,0.55); }
        .skew-fig-body { padding: 0 .5rem; }
        @media (max-width: 900px) {
          .skew-section-grid { grid-template-columns: 1fr; }
          .skew-sticky-col { position: static; height: auto; padding: 4rem 5% 2rem; }
          .skew-right-col  { padding: 0 5% 5rem; gap: 3rem; }
          .skew-fig:nth-child(odd)  .skew-fig-img,
          .skew-fig:nth-child(even) .skew-fig-img { transform: none; }
        }
      `}</style>

      <div className="skew-section-grid">

        {/* ── GAUCHE sticky — titre ── */}
        <div className="skew-sticky-col">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: .7, ease: [.22,1,.36,1] }}
          >
            <h2 style={{ position: 'relative', fontFamily: "'JetBrains Mono',monospace", fontWeight: 800, fontSize: 'clamp(2.2rem,4.5vw,3.8rem)', lineHeight: 1.1, textAlign: 'left', letterSpacing: '-.03em', color: T.textMain }}>
              <GhostTitle text="Des solutions qui travaillent pour vous." />
              Des solutions<br />
              qui travaillent<br />
              pour <GreenUnderline><span className="text-gradient">vous.</span></GreenUnderline>
            </h2>
            <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.88rem', color: T.textSub, lineHeight: 1.75, marginTop: '1.4rem', maxWidth: 340 }}>
              Même quand vous dormez — chaque projet est livré dans les délais, avec le code le plus propre et le design le plus soigné.
            </p>
            <motion.div style={{ marginTop: '2rem' }}>
              <Link href="/services" className="btn-raised" style={{ fontSize: '.82rem', display: 'inline-flex', alignItems: 'center', gap: '.4rem' }}>
                Voir tous les services <ArrowRight size={13} />
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* ── DROITE — images skewées ── */}
        <div className="skew-right-col">
          {SERVICES_SKEW.map(({ n, Icon, title, desc, price, del, img }, i) => (
            <motion.figure
              key={n}
              className="skew-fig"
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: .6, ease: [.22,1,.36,1] }}
            >
              <img
                src={img}
                alt={title}
                className="skew-fig-img"
                loading="lazy"
              />
              <div className="skew-fig-body">
                {/* Numéro + badge */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem', marginBottom: '.6rem' }}>
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.6rem', fontWeight: 700, color: '#88ca53', letterSpacing: '.3em' }}>{n}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '.3rem', padding: '.2rem .65rem', borderRadius: 100, background: 'rgba(136,202,83,.08)', border: '1px solid rgba(136,202,83,.18)', fontFamily: "'JetBrains Mono',monospace", fontSize: '.58rem', fontWeight: 700, color: '#88ca53' }}>
                    <Icon size={10} /> {title}
                  </span>
                </div>
                <h3 style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 800, fontSize: '1.05rem', color: T.textMain, letterSpacing: '-.02em', marginBottom: '.5rem' }}>{title}</h3>
                <p style={{ fontSize: '.82rem', color: T.textSub, lineHeight: 1.7, marginBottom: '.9rem' }}>{desc}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.88rem', fontWeight: 800, color: '#88ca53' }}>{price}</span>
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.62rem', color: T.textMuted, display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                    <Timer size={10} style={{ color: '#88ca53' }} /> {del}
                  </span>
                </div>
              </div>
            </motion.figure>
          ))}
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
  const sectionRef = useRef(null)
  const panelsRef = useRef([])
  const imgsRef = useRef([])
  const total = WHY_PANELS.length

  /* ── Port fidèle du mécanisme ServicesSection (App.jsx) :
     scroll vertical dans la zone pin → crossfade synchronisé
     des panels de texte (gauche) et de la pile d'images (droite) ── */
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const panels = panelsRef.current
    const images = imgsRef.current

    images.forEach((img, i) => {
      if (!img) return
      img.style.opacity = i === 0 ? '1' : '0'
      img.style.transform = i === 0 ? 'translateY(0%) scale(1)' : 'translateY(110%) scale(.9)'
    })

    const update = () => {
      const rect = section.getBoundingClientRect()
      const scrollable = section.offsetHeight - window.innerHeight
      if (scrollable <= 0) return
      const progress = Math.max(0, Math.min(1, -rect.top / scrollable))
      const idx = Math.min(total - 1, Math.floor(progress * total))

      panels.forEach((p, i) => {
        if (!p) return
        const active = i === idx
        p.style.opacity = active ? '1' : '0'
        p.style.transform = active ? 'translateY(0)' : 'translateY(28px)'
        p.style.pointerEvents = active ? 'all' : 'none'
      })

      images.forEach((img, i) => {
        if (!img) return
        const active = i === idx
        img.style.opacity = active ? '1' : (i < idx ? '0' : '0')
        img.style.transform = active ? 'translateY(0%) scale(1)' : (i < idx ? 'translateY(-4%) scale(.93)' : 'translateY(110%) scale(.9)')
      })
    }

    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    update()
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [total])

  return (
    <section style={{ background: T.bg, position: 'relative', borderTop: `1px solid ${T.border}` }}>
      <style>{`
        .why-pin { position: relative; height: ${total * 100}vh; }
        .why-sticky { position: sticky; top: 0; height: 100vh; width: 100%; overflow: hidden; }
        .why-grid { height: 100%; display: grid; grid-template-columns: 1fr 1fr; overflow: hidden; }

        .why-text-col { position: relative; height: 100%; }
        .why-panel {
          position: absolute; inset: 0;
          display: flex; flex-direction: column;
          justify-content: center; align-items: center;
          text-align: center; padding: 0 6vw;
          transition: opacity .5s cubic-bezier(.25,1,.5,1), transform .5s cubic-bezier(.25,1,.5,1);
          will-change: opacity, transform;
        }

        .why-img-col {
          position: relative; height: 100%;
          display: flex; align-items: center; justify-content: center;
          border-left: 1px solid rgba(136,202,83,.08);
          background: radial-gradient(circle at center, rgba(136,202,83,.05) 0%, transparent 70%);
          overflow: hidden;
        }
        .why-stack { position: relative; width: min(560px, 70%); aspect-ratio: 1/1; max-height: 80vh; }
        .why-stack img {
          position: absolute; inset: 0; width: 100%; height: 100%;
          object-fit: cover; border-radius: 20px;
          border: 1.5px solid rgba(136,202,83,.22);
          box-shadow: 0 32px 80px rgba(0,0,0,.5);
          will-change: transform, opacity;
          transform-origin: top center;
          transition: opacity .5s cubic-bezier(.25,1,.5,1), transform .5s cubic-bezier(.25,1,.5,1);
        }

        @media (max-width: 900px) {
          .why-pin { height: auto !important; }
          .why-sticky { height: auto; position: static; }
          .why-grid { grid-template-columns: 1fr; height: auto; gap: 3rem; }
          .why-text-col { height: auto; min-height: 46vh; }
          .why-panel { position: relative; padding: 4rem 6vw 0; }
          .why-img-col { height: 46vh; border-left: none; border-top: 1px solid rgba(136,202,83,.08); }
          .why-stack { width: auto; height: 85%; max-width: 85%; }
        }
      `}</style>

      <div ref={sectionRef} className="why-pin">
        <div className="why-sticky">
          <div className="why-grid">

            {/* ── Gauche : panels texte, crossfade selon scroll ── */}
            <div className="why-text-col">
              {WHY_PANELS.map((s, i) => (
                <div
                  key={s.n}
                  ref={el => panelsRef.current[i] = el}
                  className="why-panel"
                  style={{ opacity: i === 0 ? 1 : 0, transform: i === 0 ? 'translateY(0)' : 'translateY(28px)', pointerEvents: i === 0 ? 'all' : 'none' }}
                >
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.6rem', letterSpacing: '.45em', textTransform: 'uppercase', color: '#88ca53', marginBottom: '1.4rem', display: 'block' }}>
                    {s.n} — Built on Trust
                  </span>
                  <h2 style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 800, fontSize: 'clamp(2.6rem,5.5vw,5rem)', lineHeight: .92, letterSpacing: '-.02em', color: T.textMain, marginBottom: '1rem', whiteSpace: 'pre-line' }}>
                    {s.title}
                  </h2>
                  <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.68rem', letterSpacing: '.12em', textTransform: 'uppercase', color: '#88ca53', opacity: .8, marginBottom: '1.4rem' }}>
                    {s.sub}
                  </p>
                  <p style={{ fontSize: 'clamp(.88rem,1.2vw,1.05rem)', lineHeight: 1.8, color: T.textSub, maxWidth: '38ch' }}>
                    {s.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* ── Droite : pile d'images, crossfade synchronisé ── */}
            <div className="why-img-col">
              <div className="why-stack">
                {WHY_PANELS.map((s, i) => (
                  <img
                    key={s.n}
                    ref={el => imgsRef.current[i] = el}
                    src={s.img}
                    alt={s.title.replace('\n', ' ')}
                    onError={e => { e.target.style.background = '#141414'; e.target.style.opacity = '.3' }}
                  />
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}
function ProjectsCarousel() {
  const T = useTheme()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  const CARDS = [
    ...PROJECTS.filter(p => p.id === 15 || p.id === 18),
    ...PROJECTS.filter(p => p.id === 17 || p.id === 16),
    ...PROJECTS.filter(p => p.id === 12 || p.id === 11),
  ]

  const [activeIdx, setActiveIdx] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const autoRef = useRef(null)

  useEffect(() => {
    if (!inView || isHovered) return
    autoRef.current = setInterval(() => {
      setActiveIdx(i => (i + 1) % CARDS.length)
    }, 3200)
    return () => clearInterval(autoRef.current)
  }, [inView, isHovered, CARDS.length])

  return (
    <section ref={ref} style={{ padding: '7rem 5%', background: T.bg, position: 'relative', overflow: 'hidden' }}>
      <div className="grid-bg" style={{ position: 'absolute', inset: 0, opacity: .2 }} />
      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <BlurReveal delay={0.1} direction="left">
              <h2 style={{ position: 'relative', fontSize: 'clamp(1.9rem,3.5vw,2.8rem)', fontWeight: 800, fontFamily: "'JetBrains Mono',monospace", color: T.textMain, letterSpacing: '-.03em' }}>
                <GhostTitle text="Nos dernières réalisations livrées" />
                Nos dernières{' '}
                <GreenUnderline>
                  <span className="text-gradient">
                    <LetterReveal text="réalisations livrées" stagger={0.03} />
                  </span>
                </GreenUnderline>
              </h2>
            </BlurReveal>
          </div>
          <BlurReveal direction="right">
            <Link href="/projects" className="btn-ghost" style={{ padding: '.65rem 1.4rem', fontSize: '.82rem' }}>
              Toutes les réalisations <ArrowRight size={13} />
            </Link>
          </BlurReveal>
        </div>

        {/* ── Expanding accordion gallery ── */}
        <BlurReveal delay={0.2}>
          <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{ display: 'flex', gap: 6, height: 480, borderRadius: 20, overflow: 'hidden', width: '100%', justifyContent: 'center' }}
          >
            {CARDS.map((project, i) => {
              const isActive = i === activeIdx
              return (
                <div
                  key={project.title}
                  onMouseEnter={() => setActiveIdx(i)}
                  onClick={() => setActiveIdx(i)}
                  style={{
                    position: 'relative',
                    height: '100%',
                    flex: isActive ? '5 0 0' : '1 0 0',
                    minWidth: isActive ? 0 : 52,
                    maxWidth: isActive ? 520 : 80,
                    borderRadius: 14,
                    overflow: 'hidden',
                    cursor: isActive ? 'default' : 'pointer',
                    transition: 'flex 0.55s cubic-bezier(0.25, 1, 0.5, 1), max-width 0.55s cubic-bezier(0.25, 1, 0.5, 1)',
                  }}
                >
                  {/* Background image */}
                  <img
                    src={project.img}
                    alt={project.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .6s ease', transform: isActive ? 'scale(1.04)' : 'scale(1.08)' }}
                  />

                  {/* Collapsed tint */}
                  {!isActive && (
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(3,8,6,.65)', backdropFilter: 'blur(1px)' }} />
                  )}

                  {/* Active gradient */}
                  {isActive && (
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(3,8,6,.95) 0%, rgba(3,8,6,.3) 50%, transparent 100%)' }} />
                  )}

                  {/* Collapsed index */}
                  {!isActive && (
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.6rem', fontWeight: 800, color: 'rgba(255,255,255,.4)', textTransform: 'uppercase', letterSpacing: '.12em', writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
                        {project.title.slice(0, 12)}
                      </span>
                    </div>
                  )}

                  {/* Active content */}
                  <div style={{ position: 'absolute', inset: 0, padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', opacity: isActive ? 1 : 0, transition: 'opacity .3s ease .15s', pointerEvents: isActive ? 'auto' : 'none' }}>
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={isActive ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
                      transition={{ duration: 0.55, delay: 0.1, ease: [.22,1,.36,1] }}
                    >
                      {/* Badges */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '.4rem', marginBottom: '.7rem', flexWrap: 'wrap' }}>
                        <span className="no-pill-mobile" style={{ padding: '.22rem .65rem', borderRadius: 100, background: 'rgba(136,202,83,.18)', border: '1px solid rgba(136,202,83,.4)', color: '#88ca53', fontFamily: "'JetBrains Mono',monospace", fontSize: '.6rem', fontWeight: 700 }}>{project.type}</span>
                        {project.live && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: 3, padding: '.2rem .55rem', borderRadius: 100, background: 'rgba(136,202,83,.88)', fontFamily: "'JetBrains Mono',monospace", fontSize: '.55rem', color: '#fff', fontWeight: 700 }}>
                            <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#fff', animation: 'dot-blink 1.4s ease-in-out infinite' }} />
                            LIVE
                          </span>
                        )}
                        <span style={{ marginLeft: 'auto', fontFamily: "'JetBrains Mono',monospace", fontWeight: 800, fontSize: '1rem', color: '#88ca53' }}>{project.result}</span>
                      </div>

                      {/* Title */}
                      <h3 style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '1.3rem', fontWeight: 800, color: '#fff', marginBottom: '.5rem', lineHeight: 1.2 }}>
                        {project.title}
                      </h3>
                      <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.82rem', color: 'rgba(255,255,255,.65)', lineHeight: 1.55, marginBottom: '1rem' }}>
                        {project.desc?.slice(0, 90)}…
                      </p>

                      {/* Tech pills */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.3rem', marginBottom: '1rem' }}>
                        {project.tech?.slice(0, 3).map(t => (
                          <span key={t} style={{ padding: '.18rem .55rem', borderRadius: 100, background: 'rgba(136,202,83,.07)', border: '1px solid rgba(136,202,83,.2)', fontFamily: "'JetBrains Mono',monospace", fontSize: '.6rem', fontWeight: 600, color: '#88ca53' }}>{t}</span>
                        ))}
                      </div>

                      {project.url && (
                        <a href={project.url} target="_blank" rel="noreferrer"
                          onClick={e => e.stopPropagation()}
                          style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: '#88ca53', fontSize: '.75rem', fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, textDecoration: 'none', padding: '.4rem .9rem', borderRadius: 100, border: '1px solid rgba(136,202,83,.3)', background: 'rgba(136,202,83,.08)', transition: 'all .2s' }}
                          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(136,202,83,.2)' }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(136,202,83,.08)' }}
                        >
                          Voir le projet <ExternalLink size={11} />
                        </a>
                      )}
                    </motion.div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Dot indicators */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '.45rem', marginTop: '1.8rem' }}>
            {CARDS.map((_, i) => (
              <button key={i} onClick={() => setActiveIdx(i)}
                style={{ width: i === activeIdx ? 28 : 8, height: 8, borderRadius: 4, background: i === activeIdx ? '#88ca53' : 'rgba(136,202,83,.2)', border: 'none', cursor: 'pointer', transition: 'all .35s' }} />
            ))}
          </div>
        </BlurReveal>
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
// ── DOMAINES D'INTERVENTION — inspiré V-labs ─────────────────
// ═══════════════════════════════════════════════════════════════
const DOMAINES = [
  {
    n: '01', Icon: Monitor,
    title: 'Sites Vitrine & Landing Pages',
    desc:  "Votre présence digitale professionnelle, optimisée pour convertir vos visiteurs en clients. Design sur mesure, SEO intégré, livré en 7 à 14 jours.",
    tag:   'Site Vitrine',
  },
  {
    n: '02', Icon: ShoppingBag,
    title: 'E-Commerce & Boutiques en ligne',
    desc:  "Boutiques complètes avec paiement Mobile Money (Orange Money, Wave), gestion des stocks, tableau de bord admin et notifications commandes.",
    tag:   'E-Commerce',
  },
  {
    n: '03', Icon: LayoutDashboard,
    title: 'Applications SaaS & Métier',
    desc:  "Des outils web sur mesure pour automatiser vos processus, gérer vos équipes et économiser des heures de travail chaque semaine.",
    tag:   'SaaS',
  },
  {
    n: '04', Icon: Cog,
    title: 'Digitalisation de processus',
    desc:  "Remplacez vos fichiers Excel et WhatsApp par des applications robustes. Suivi en temps réel, rôles utilisateurs, reporting intégré.",
    tag:   'Digitalisation',
  },
  {
    n: '05', Icon: Image,
    title: 'Portfolios & Identités créatives',
    desc:  "Des vitrines animées et percutantes pour créatifs, photographes, graphistes et freelances qui veulent décrocher plus de clients.",
    tag:   'Portfolio',
  },
  {
    n: '06', Icon: Wrench,
    title: 'Maintenance & Évolutions',
    desc:  "Votre investissement sur la durée. Mises à jour, nouvelles fonctionnalités, corrections et support technique réactif sous 48h.",
    tag:   'Support',
  },
]

function DomainesSection() {
  const T   = useTheme()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section
      ref={ref}
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
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <BlurReveal delay={0.12}>
            <h2 style={{
              position: 'relative',
              fontSize: 'clamp(1.9rem,3.5vw,2.8rem)', fontWeight: 800,
              fontFamily: "'JetBrains Mono',monospace", color: T.textMain,
              letterSpacing: '-.03em', lineHeight: 1.15,
            }}>
              <GhostTitle text="Dans quel axe de création s'inscrit votre projet ?" />
              Dans quel axe de création{' '}
              <GreenUnderline><span className="text-gradient">s'inscrit votre projet ?</span></GreenUnderline>
            </h2>
          </BlurReveal>
          <BlurReveal delay={0.2}>
            <p style={{ fontSize: '1rem', color: T.textSub, lineHeight: 1.75, maxWidth: 560, margin: '1rem auto 0' }}>
              De la vitrine au SaaS, de la boutique au portfolio — nous intervenons sur l'ensemble de la chaîne digitale pour concrétiser votre vision.
            </p>
          </BlurReveal>
        </div>

        {/* Grille */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1px', background: T.border, borderRadius: 20, overflow: 'hidden',
          border: `1px solid ${T.border}`,
        }}>
          {DOMAINES.map(({ n, Icon, title, desc, tag }, i) => (
            <motion.div
              key={n}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: i * 0.07, ease: [.22,1,.36,1] }}
              whileHover="hover"
              style={{ background: T.bgAlt, padding: '2.2rem', position: 'relative', overflow: 'hidden' }}
            >
              {/* Glow hover */}
              <motion.div
                variants={{ hover: { opacity: 1 } }}
                initial={{ opacity: 0 }}
                transition={{ duration: .25 }}
                style={{ position: 'absolute', inset: 0, background: 'radial-gradient(400px circle at 30% 30%, rgba(136,202,83,.07), transparent 65%)', pointerEvents: 'none' }}
              />

              {/* Numéro + Tag */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.4rem' }}>
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem', marginBottom: '.9rem' }}>
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
              <p style={{ fontSize: '.83rem', color: T.textSub, lineHeight: 1.7 }}>
                {desc}
              </p>

              {/* Barre verte bas au hover */}
              <motion.div
                variants={{ hover: { scaleX: 1 } }}
                initial={{ scaleX: 0 }}
                style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0, height: 2,
                  background: 'linear-gradient(90deg, transparent, #88ca53, transparent)',
                  transformOrigin: 'left',
                }}
              />
            </motion.div>
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
        padding: '18vh 8vw',
        minHeight: '120vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
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

      <div style={{ maxWidth: 940, width: '100%', position: 'relative', zIndex: 1 }}>
        {/* Titre de section */}
        <h2 style={{
          position: 'relative',
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 'clamp(1.5rem,2.6vw,2.1rem)', fontWeight: 800,
          color: T.textMain, letterSpacing: '-.03em',
          marginBottom: '2.5rem',
        }}>
          <GhostTitle text="À propos de AKATech" />
          À propos de <span className="text-gradient">AKATech</span>
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
  const wrapRef = useRef(null)
  const gridRef = useRef(null)
  const TUNNEL_ITEMS = PROJECTS.slice(0, 6)
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
    <div ref={wrapRef} style={{ position: 'relative', height: '250vh', background: '#040a07' }}>
      <section style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden', perspective: '1200px', display: 'flex', alignItems: 'center' }}>
        <div style={{ position: 'absolute', top: '2.2rem', left: '6%', zIndex: 5, fontFamily: "'JetBrains Mono',monospace", fontSize: '.7rem', letterSpacing: '.32em', color: '#88ca53', textTransform: 'uppercase' }}>
          Archive — Nos projets
        </div>

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

// ── STATS GRID (cartes dégradé gris, chiffres animés) ──────────
const HOME_STATS = [
  { tag: 'Expérience',  target: 18,  suffix: '',  label: 'Projets',      sub: 'Livrés sur mesure, du concept au déploiement' },
  { tag: 'Confiance',   target: 10,  suffix: '+', label: 'Clients',       sub: 'Particuliers, startups et PME accompagnés' },
  { tag: 'Satisfaction',target: 99, suffix: '%', label: 'Satisfaits',    sub: 'Clients livrés dans les délais convenus' },
  
  { tag: 'Parcours',    target: 3,   suffix: '+', label: 'Années',        sub: "D'expérience en développement web" },
  
]

function StatsSection() {
  const T = useTheme()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  // Spans bento (sur une grille 4 colonnes) — reproduit la mosaïque asymétrique :
  // Ligne 1 : [Projets][Clients][   Satisfaits (x2)   ]
  // Ligne 2 : [   En prod. (x2)   ][Années][Outils]
  const SPANS = ['span 1', 'span 1', 'span 2', 'span 2', 'span 1', 'span 1']

  return (
    <section ref={ref} style={{ padding: '5rem 5% 6rem', background: T.bg, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)', width: 700, height: 400, borderRadius: '50%', background: 'radial-gradient(ellipse,rgba(136,202,83,.05),transparent 65%)', pointerEvents: 'none' }} />
      <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <style>{`
          .stats-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 1.1rem;
          }
          @media (max-width: 760px) {
            .stats-grid { grid-template-columns: repeat(2, 1fr); }
            .stats-grid > div { grid-column: span 1 !important; }
          }
        `}</style>
        <div className="stats-grid">
          {HOME_STATS.map((s, i) => (
            <motion.div key={s.label}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: .55, delay: i * .08, ease: [.22,1,.36,1] }}
              style={{
                gridColumn: SPANS[i],
                padding: '1.8rem 1.6rem',
                minHeight: 190,
                borderRadius: 18,
                background: `linear-gradient(155deg, rgba(255,255,255,.05) 0%, rgba(255,255,255,.015) 55%, rgba(255,255,255,0) 100%)`,
                border: '1px solid rgba(255,255,255,.08)',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}>
              <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(120px circle at 85% 0%, rgba(136,202,83,.07), transparent 70%)', pointerEvents: 'none' }} />
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.85rem', fontWeight: 700, color: T.textMain, position: 'relative', zIndex: 1 }}>{s.tag}</div>
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.78rem', fontWeight: 600, color: T.textMuted, marginBottom: '.3rem' }}>{s.label}</div>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 800, fontSize: 'clamp(2.2rem,4vw,2.8rem)', lineHeight: 1, color: '#88ca53', letterSpacing: '-.02em', marginBottom: '.5rem' }}>
                  <AnimatedCounter target={s.target} suffix={s.suffix} />
                </div>
                <p style={{ fontSize: '.78rem', color: T.textMuted, lineHeight: 1.55, margin: 0 }}>{s.sub}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── HOME PAGE ────────────────────────────────────────────────
export default function HomePageDesktop() {
  return (
    <div style={{ paddingTop: 0 }}>
      <Hero />
      <ScrollRevealText />
      <ArchiveTunnelSection />
      <StatsSection />
      <MarqueeStrip />
      <ServicesPreview />
      <WhyUs />
      <DomainesSection />
      <MarqueeStrip />
      <ProjectsCarousel />
      <Testimonials />

      <PageCTA
        message="Comme eux, donnez à votre activité la présence digitale qu'elle mérite."
        cta="Rejoindre nos clients"
      />
    </div>
  )
}