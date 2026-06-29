'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import {
  ArrowRight, Star, ExternalLink,
  Globe, ShoppingCart, Cpu, Server, Palette, Wrench, Map, MapPin,
  Monitor, ShoppingBag, LayoutDashboard, Cog, Image,
} from 'lucide-react'
import { useTheme } from '@/lib/theme'
import { GhostTitle, AnimatedCounter, LazyImg, MarqueeStrip, PageCTA, GreenUnderline } from '@/components/ui/index'
import { PROJECTS, TESTIMONIALS } from '@/lib/data'

// ── HERO avec carrousel images auto ──────────────────────────
const HERO_SLIDES = [
  {
    tag: '// Site Vitrine',
    title: 'Votre présence digitale,',
    accent: 'professionnelle & rentable.',
    sub: "Un site qui travaille pour vous 24h/24 — attirez des clients, gagnez en crédibilité et développez votre activité.",
    img: '/images/hero-bg.webp',
  },
  {
    tag: '// E-Commerce',
    title: 'Vendez en ligne,',
    accent: 'même quand vous dormez.',
    sub: "Boutique complète avec paiement Mobile Money, gestion stocks et tableau de bord admin. Livrée en 14 jours.",
    img: '/images/about-2.webp',
  },
  {
    tag: '// Application SaaS',
    title: 'Automatisez vos tâches,',
    accent: 'scalez votre activité.',
    sub: "Des applications web sur-mesure pour digitaliser vos processus et économiser des heures de travail chaque semaine.",
    img: '/images/about-1.webp',
  },
  {
    tag: '// Portfolio Créatif',
    title: 'Votre talent mérite',
    accent: 'une vitrine digitale.',
    sub: "Portfolios animés, modernes et percutants pour créatifs, graphistes et freelances qui veulent décrocher plus de clients.",
    img: '/images/about-4.webp',
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

// ── CIRCULAR PROJECTS GALLERY — adapté mobile (ratio 16:9, largeur réduite) ──
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

  const order = GALLERY_ITEMS.map((_, i) => {
    let rel = i - active
    if (rel > GALLERY_ITEMS.length / 2) rel -= GALLERY_ITEMS.length
    if (rel < -GALLERY_ITEMS.length / 2) rel += GALLERY_ITEMS.length
    return rel
  })

  // Dimensions mobiles : cartes plus petites, ratio natif 1600×815
  const CARD_W = 220
  const CARD_H = Math.round(220 * (815 / 1600))  // ≈ 112px
  const STEP   = CARD_W * 0.68

  return (
    <div style={{ position: 'relative', height: CARD_H + 48, display: 'flex', alignItems: 'center', justifyContent: 'center', perspective: 900, marginTop: '1.2rem' }}>
      {GALLERY_ITEMS.map((p, i) => {
        const rel    = order[i]
        const abs    = Math.abs(rel)
        const x      = rel * STEP
        const y      = abs * 10
        const rot    = rel * 7
        const scale  = 1 - abs * 0.13
        const opacity = abs > 2 ? 0 : 1 - abs * 0.20
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
              borderRadius: 8,
              overflow: 'hidden',
              zIndex: 10 - abs,
              cursor: 'pointer',
              border: isActive ? '1.5px solid rgba(136,202,83,.6)' : '1px solid rgba(255,255,255,.1)',
              boxShadow: isActive ? '0 0 0 3px rgba(136,202,83,.15), 0 8px 24px rgba(0,0,0,.6)' : '0 4px 14px rgba(0,0,0,.4)',
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
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '.45rem .7rem' }}>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.65rem', fontWeight: 700, color: '#fff', letterSpacing: '-.01em', lineHeight: 1.2 }}>{p.title}</div>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.55rem', color: 'rgba(136,202,83,.9)', marginTop: '.05rem' }}>{p.type}</div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

function Hero() {
  const T = useTheme()
  const [idx, setIdx] = useState(0)
  const [imgIdx, setImgIdx] = useState(0)
  const timerRef = useRef(null)
  const layerBgRef   = useRef(null)
  const layerMidRef  = useRef(null)
  const layerForeRef = useRef(null)

  const next = useCallback(() => {
    setIdx(i => (i + 1) % HERO_SLIDES.length)
    setImgIdx(i => (i + 1) % HERO_SLIDES.length)
  }, [])

  useEffect(() => {
    timerRef.current = setInterval(next, 5000)
    return () => clearInterval(timerRef.current)
  }, [next])

  // ── SCROLL : zoom bg + fade mid + fore (adapté mobile — pas de sticky) ──
  useEffect(() => {
    const onScroll = () => {
      const s = window.pageYOffset
      if (layerBgRef.current) {
        const zoom = 1 + s * 0.0005
        layerBgRef.current.style.transform = `scale(${zoom}) translateY(${s * 0.18}px)`
        layerBgRef.current.style.filter = `blur(${Math.min(s / 65, 10)}px)`
      }
      if (layerMidRef.current) {
        layerMidRef.current.style.opacity  = Math.max(0, 1 - s / 650)
        layerMidRef.current.style.transform = `translateY(${s * 0.38}px)`
        layerMidRef.current.style.filter   = `blur(${s / 110}px)`
      }
      if (layerForeRef.current) {
        layerForeRef.current.style.transform = `translateY(${s * 0.9}px)`
        layerForeRef.current.style.opacity = Math.max(0, 1 - s / 380)
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const slide = HERO_SLIDES[idx]

  return (
    <section id="home-hero" style={{ minHeight: '100svh', width: '100%', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', background: '#030806' }}>

      {/* ── LAYER BG ── */}
      <div ref={layerBgRef} style={{ position: 'absolute', zIndex: 1, width: '115%', height: '115%', willChange: 'transform, filter', transition: 'transform .1s ease-out', pointerEvents: 'none' }}>
        <AnimatePresence mode="sync">
          <motion.div key={imgIdx}
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: [.4,0,.2,1] }}
            style={{ position: 'absolute', inset: 0 }}>
            <img src={HERO_SLIDES[imgIdx].img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          </motion.div>
        </AnimatePresence>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(170deg, rgba(3,8,6,.97) 0%, rgba(3,8,6,.82) 50%, rgba(3,8,6,.55) 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 20%, rgba(3,8,6,.96) 100%)' }} />
        <motion.div
          style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
          animate={{ background: [
            'radial-gradient(500px circle at 20% 40%, rgba(136,202,83,.055) 0%, transparent 62%)',
            'radial-gradient(500px circle at 75% 55%, rgba(136,202,83,.075) 0%, transparent 62%)',
            'radial-gradient(500px circle at 20% 40%, rgba(136,202,83,.055) 0%, transparent 62%)',
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

      {/* ── LAYER MID — contenu ── */}
      <div
        ref={layerMidRef}
        style={{ position: 'relative', zIndex: 10, width: '100%', padding: '0 5%', paddingTop: 'calc(env(safe-area-inset-top, 0px) + 80px)', paddingBottom: '5rem', willChange: 'transform, opacity, filter', transition: 'transform .1s ease-out', textAlign: 'center' }}
      >
        {/* Tag + titre + accent + sub */}
        <AnimatePresence mode="wait">
          <motion.div key={`slide-${idx}`}
            initial={{ opacity: 0, y: 16, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -10, filter: 'blur(2px)' }}
            transition={{ duration: .5, ease: [.22,1,.36,1] }}>

            {/* Tag */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '.5rem', padding: '.3rem .9rem', borderRadius: 100, background: 'rgba(136,202,83,.1)', border: '1px solid rgba(136,202,83,.25)', marginBottom: '1.4rem', backdropFilter: 'blur(8px)' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#88ca53', animation: 'dot-blink 1.4s ease-in-out infinite' }} />
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.62rem', fontWeight: 600, color: '#88ca53' }}>{slide.tag}</span>
            </div>

            {/* H1 + accent cursif */}
            <h1 style={{ fontSize: 'clamp(2rem,9vw,3.2rem)', fontWeight: 800, fontFamily: "'JetBrains Mono',monospace", color: 'rgba(255,255,255,.92)', letterSpacing: '-.04em', lineHeight: 1.08, marginBottom: '.4rem' }}>
              {slide.title}
              <span style={{ display: 'block', fontFamily: "'Dancing Script',cursive", color: '#88ca53', letterSpacing: '-.02em', marginTop: '.1em', marginBottom: '1.2rem' }}>
                <GreenUnderline>{slide.accent}</GreenUnderline>
              </span>
            </h1>

            {/* Sub */}
            <p style={{ fontSize: 'clamp(.85rem,3.5vw,.97rem)', color: 'rgba(255,255,255,.58)', lineHeight: 1.7, maxWidth: 480, margin: '0 auto 2rem' }}>
              {slide.sub}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .5, delay: .45 }}
          style={{ display: 'flex', flexDirection: 'column', gap: '.75rem', alignItems: 'center', marginBottom: '1.8rem' }}>
          <a href="https://wa.me/2250142507750" target="_blank" rel="noreferrer" className="btn-raised" style={{ fontSize: '.95rem', padding: '.95rem 2rem', width: '100%', maxWidth: 340, justifyContent: 'center' }}>
            Démarrer mon projet <ArrowRight size={15} />
          </a>
          <Link href="/projects" className="btn-ghost" style={{ fontSize: '.9rem', padding: '.9rem 2rem', width: '100%', maxWidth: 340, justifyContent: 'center' }}>
            Voir les réalisations
          </Link>
        </motion.div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .6, delay: .6 }}
          style={{ display: 'flex', flexWrap: 'wrap', gap: '.45rem', justifyContent: 'center', marginBottom: '1.8rem' }}>
          {['✓ Devis gratuit', '✓ Livraison garantie', '✓ Support 48h'].map((b, bi) => (
            <motion.span key={b}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .65 + bi * .07 }}
              style={{ padding: '.25rem .7rem', borderRadius: 100, background: 'rgba(136,202,83,.08)', border: '1px solid rgba(136,202,83,.18)', fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, fontSize: '.72rem', color: '#b3ee85', backdropFilter: 'blur(6px)' }}>
              {b}
            </motion.span>
          ))}
        </motion.div>

        {/* Galerie circulaire projets — hero desktop signature */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .6, delay: .55 }}>
          <CircularProjectsGallery />
        </motion.div>

        {/* Dots de slide */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .75 }}
          style={{ display: 'flex', justifyContent: 'center', gap: '.45rem', marginTop: '1.4rem' }}>
          {HERO_SLIDES.map((_, i) => (
            <button key={i} onClick={() => { setIdx(i); setImgIdx(i); clearInterval(timerRef.current); timerRef.current = setInterval(next, 5000) }}
              style={{ width: i === idx ? 24 : 8, height: 8, borderRadius: 4, background: i === idx ? '#88ca53' : 'rgba(136,202,83,.25)', border: 'none', cursor: 'pointer', transition: 'all .35s', padding: 0 }} />
          ))}
        </motion.div>
      </div>

      {/* ── LAYER FORE — particules ── */}
      <div ref={layerForeRef} style={{ position: 'absolute', inset: 0, zIndex: 20, pointerEvents: 'none', willChange: 'transform, opacity', transition: 'transform .1s ease-out' }}>
        {[
          { left: '8%',  top: '18%', s: 3, op: .18, dur: 3.8, dy: 0 },
          { left: '88%', top: '28%', s: 4, op: .22, dur: 4.4, dy: .6 },
          { left: '15%', top: '72%', s: 3, op: .12, dur: 5.1, dy: 1.2 },
          { left: '80%', top: '68%', s: 3, op: .10, dur: 6.2, dy: 1.8 },
          { left: '50%', top: '14%', s: 4, op: .14, dur: 3.2, dy: .3 },
        ].map((p, i) => (
          <motion.div key={i}
            style={{ position: 'absolute', width: p.s, height: p.s, borderRadius: '50%', background: '#88ca53', left: p.left, top: p.top, opacity: p.op }}
            animate={{ y: [0, -18, 0] }}
            transition={{ duration: p.dur, repeat: Infinity, ease: 'easeInOut', delay: p.dy }}
          />
        ))}
      </div>

      {/* Scroll indicator */}
      <div style={{ position: 'absolute', bottom: '1.4rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: .24, zIndex: 15, pointerEvents: 'none' }}>
        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.55rem', letterSpacing: '.18em', textTransform: 'uppercase', marginBottom: '.35rem', color: '#fff' }}>Scroll</span>
        <motion.div animate={{ scaleY: [1, 1.4, 1], opacity: [.5, 1, .5] }} transition={{ duration: 1.6, repeat: Infinity }}
          style={{ width: 1, height: 30, background: 'linear-gradient(to bottom, rgba(255,255,255,.8), transparent)' }} />
      </div>

    </section>
  )
}

// ── DATA images services (miroir de SERVICES_SKEW du desktop) ──
const SERVICES_SLIDES = [
  {  title: 'Conception de Site Web',                img: '/images/service/creation%20de%20site%20web.webp' },
  {  title: 'Cartes Interactives & Dashboards',                        img: '/images/service/dasbord.webp' },
  {  title: 'API & Backend Robustes',                 img: '/images/service/api.webp' },
  {  title: 'Maintenance & Support',                 img: '/images/service/maintenence.webp' },
  {  title: 'Fiche Google My Business',           img: '/images/service/fiche-google.webp' },
]

// ── DATA images processus (miroir de WHY_PANELS du desktop) ──
const PROCESS_SLIDES = [
  { n: '01', title: 'Prise de contact',        sub: 'On vous écoute',           img: '/images/process/prise%20de%20contact.webp' },
  { n: '02', title: 'Devis & conditions',      sub: 'Proposition détaillée',    img: '/images/process/devis%20et%20condition.webp' },
  { n: '03', title: 'Acompte de démarrage',    sub: '50% pour lancer',          img: '/images/process/acompte.webp' },
  { n: '04', title: 'Création du site',        sub: 'Design 100% sur mesure',   img: '/images/process/creation%20du%20site.webp' },
  { n: '05', title: 'Livraison pour validation', sub: 'Vous testez en premier', img: '/images/process/livraison.webp' },
  { n: '06', title: 'Solde & facturation',     sub: 'Paiement final',           img: '/images/process/solde.webp' },
  { n: '07', title: 'Mise en ligne',           sub: 'Votre site est officiel',  img: '/images/process/mise%20en%20ligne.webp' },
]

// ── À PROPOS ──────────────────────────────────────────────────
function AboutSection() {
  const T = useTheme()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  const TEXT = "AKATech conçoit des sites et applications sur mesure pour les PME ambitieuses d'Abidjan et d'Afrique de l'Ouest. Design premium, performance optimisée et SEO pensé pour convertir : chaque projet est construit pour renforcer votre image et générer de nouvelles opportunités d'affaires."
  const greenWords = new Set(['PME', 'ambitieuses', 'premium,', 'optimisée', 'SEO', 'convertir', "d'affaires."])

  return (
    <section ref={ref} style={{ padding: '4rem 5%', background: T.bg, position: 'relative' }}>
      <div style={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
        width: '80vw', height: '80vw', maxWidth: 500, maxHeight: 500, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(136,202,83,.045) 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <motion.h2 initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          style={{
            position: 'relative',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 'clamp(1.4rem,5vw,1.9rem)', fontWeight: 800,
            color: T.textMain, letterSpacing: '-.03em',
            marginBottom: '1.5rem',
          }}>
          <GhostTitle text="À propos de AKATech" />
          À propos de <span className="text-gradient">AKATech</span>
        </motion.h2>

        <motion.p initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: .1 }}
          style={{
            fontFamily: "'JetBrains Mono',monospace",
            fontSize: 'clamp(1rem,3.6vw,1.2rem)',
            fontWeight: 700, lineHeight: 1.5,
            color: T.textMain, margin: 0,
          }}>
          {TEXT.split(' ').map((word, i) => (
            <span key={i} style={{ color: greenWords.has(word) ? '#88ca53' : 'inherit' }}>
              {word}{' '}
            </span>
          ))}
        </motion.p>
      </div>
    </section>
  )
}

// ── STATS — chiffres géants éditoriaux (miroir desktop), responsive 2-col mobile ──
const HOME_STATS = [
  { target: 18,  suffix: '',  label: 'Projets livrés',      sub: 'Du concept au déploiement' },
  { target: 99,  suffix: '%', label: 'Clients satisfaits',  sub: 'Livrés dans les délais'    },
  { target: 10,  suffix: '+', label: 'Clients accompagnés', sub: 'Startups, PME, créatifs'   },
  { target: 3,   suffix: '+', label: "Années d'expérience", sub: 'En développement web'       },
]

function StatsSection() {
  const T = useTheme()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section ref={ref} style={{ padding: '5rem 5% 6rem', background: T.bg, position: 'relative', overflow: 'hidden' }}>

      {/* Halo */}
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 500, height: 320, borderRadius: '50%', background: 'radial-gradient(ellipse,rgba(136,202,83,.04),transparent 65%)', pointerEvents: 'none' }} />

      {/* Séparateur haut */}
      <div style={{ position: 'absolute', top: 0, left: '5%', right: '5%', height: 1, background: T.border }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <style>{`
          .stats-editorial-mobile {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 0;
          }
        `}</style>
        <div className="stats-editorial-mobile">
          {HOME_STATS.map((s, i) => (
            <motion.div key={s.label}
              initial={{ opacity: 0, y: 32 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: .7, delay: i * .1, ease: [.22,1,.36,1] }}
              style={{
                padding: 'clamp(1.4rem,4vw,2rem) clamp(.9rem,3vw,1.6rem)',
                borderLeft: `1px solid ${T.border}`,
                borderBottom: i < 2 ? `1px solid ${T.border}` : 'none',
              }}>

              {/* Chiffre géant */}
              <div style={{
                fontFamily: "'JetBrains Mono',monospace",
                fontWeight: 900,
                fontSize: 'clamp(3rem,12vw,5rem)',
                lineHeight: 1,
                color: T.light ? '#111' : 'rgba(255,255,255,.92)',
                letterSpacing: '-.04em',
                marginBottom: '.4rem',
              }}>
                <AnimatedCounter target={s.target} suffix={s.suffix} />
              </div>

              {/* Label principal */}
              <div style={{
                fontFamily: "'JetBrains Mono',monospace",
                fontSize: 'clamp(.65rem,2.5vw,.78rem)',
                fontWeight: 700,
                color: T.light ? '#5f9137' : '#88ca53',
                letterSpacing: '.02em',
                marginBottom: '.15rem',
              }}>
                {s.label}
              </div>

              {/* Sous-label */}
              <div style={{
                fontFamily: "'JetBrains Mono',monospace",
                fontSize: 'clamp(.58rem,2.2vw,.68rem)',
                color: T.textMuted,
                letterSpacing: '.02em',
                lineHeight: 1.4,
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

// ── SLIDE AUTO générique ─────────────────────────────────────
function AutoSlider({ slides, renderCaption }) {
  const [idx, setIdx] = useState(0)
  const timerRef = useRef(null)

  const go = useCallback((next) => {
    const n = ((next % slides.length) + slides.length) % slides.length
    setIdx(n)
    clearInterval(timerRef.current)
    timerRef.current = setInterval(() => setIdx(i => (i + 1) % slides.length), 3500)
  }, [slides.length])

  useEffect(() => {
    timerRef.current = setInterval(() => setIdx(i => (i + 1) % slides.length), 3500)
    return () => clearInterval(timerRef.current)
  }, [slides.length])

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      {/* Image principale — carrée */}
      <div style={{ position: 'relative', width: '100%', aspectRatio: '1/1', borderRadius: 20, overflow: 'hidden', boxShadow: '0 24px 60px rgba(0,0,0,0.35)' }}>
        <AnimatePresence mode="sync">
          <motion.img
            key={idx}
            src={slides[idx].img}
            alt={slides[idx].title}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: .7, ease: [.4,0,.2,1] }}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        </AnimatePresence>
        {/* Overlay bas */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(3,8,6,.75) 0%, transparent 55%)', pointerEvents: 'none' }} />
        {/* Caption */}
        <AnimatePresence mode="wait">
          <motion.div key={idx}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            transition={{ duration: .35 }}
            style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1.2rem 1.4rem' }}>
            {renderCaption(slides[idx])}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dots centrés */}
      <div style={{ display: 'flex', gap: '.35rem', alignItems: 'center', justifyContent: 'center', marginTop: '.85rem' }}>
        {slides.map((_, i) => (
          <button key={i} onClick={() => go(i)}
            style={{ width: i === idx ? 20 : 6, height: 6, borderRadius: 3, background: i === idx ? '#88ca53' : 'rgba(136,202,83,.25)', border: 'none', cursor: 'pointer', transition: 'all .3s', padding: 0 }} />
        ))}
      </div>
    </div>
  )
}

// ── SERVICES PREVIEW ─────────────────────────────────────────
function ServicesPreview() {
  const T = useTheme()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section ref={ref} style={{ padding: '7rem 5%', background: T.bg, position: 'relative' }}>
      <div className="grid-bg" style={{ position: 'absolute', inset: 0, opacity: .25 }} />
      <div style={{ maxWidth: 600, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{ position: 'relative', fontSize: 'clamp(1.9rem,3.5vw,2.8rem)', fontWeight: 800, fontFamily: "'JetBrains Mono',monospace", color: T.textMain, letterSpacing: '-.03em', lineHeight: 1.15 }}>
            <GhostTitle text="Des solutions qui travaillent pour vous, même quand vous dormez" />
            Des solutions qui travaillent pour vous,<br />
            <GreenUnderline><span className="text-gradient">même quand vous dormez</span></GreenUnderline>
          </h2>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: .15 }}>
          <AutoSlider
            slides={SERVICES_SLIDES}
            renderCaption={s => (
              <div>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.58rem', fontWeight: 700, color: '#88ca53', letterSpacing: '.3em', marginBottom: '.3rem' }}>{s.n}</div>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 800, fontSize: '1rem', color: '#fff', marginBottom: '.25rem' }}>{s.title}</div>
                <div style={{ display: 'flex', gap: '.7rem', alignItems: 'center' }}>
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.75rem', fontWeight: 700, color: '#88ca53' }}>{s.price}</span>
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.6rem', color: 'rgba(255,255,255,.5)' }}>· {s.del}</span>
                </div>
              </div>
            )}
          />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: .35 }}
          style={{ textAlign: 'center', marginTop: '2.5rem' }}>
          <Link href="/services" className="btn-ghost" style={{ fontSize: '.9rem' }}>
            Voir tous les services <ArrowRight size={14} />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

// ── PROCESS — slide auto avec images ─────────────────────────
function Process() {
  const T = useTheme()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section ref={ref} style={{ padding: '7rem 5%', background: T.bg }}>
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{ position: 'relative', fontSize: 'clamp(1.9rem,3.5vw,2.8rem)', fontWeight: 800, fontFamily: "'JetBrains Mono',monospace", color: T.textMain, letterSpacing: '-.03em' }}>
            <GhostTitle text="De l'idée à la mise en ligne" />
            De l'idée à la <GreenUnderline><span className="text-gradient">mise en ligne</span></GreenUnderline>
          </h2>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: .15 }}>
          <AutoSlider
            slides={PROCESS_SLIDES}
            renderCaption={s => (
              <div>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.58rem', fontWeight: 700, color: '#88ca53', letterSpacing: '.3em', marginBottom: '.3rem' }}>{s.n}</div>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 800, fontSize: '1rem', color: '#fff', marginBottom: '.2rem' }}>{s.title}</div>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.72rem', color: 'rgba(255,255,255,.55)', fontStyle: 'italic' }}>{s.sub}</div>
              </div>
            )}
          />
        </motion.div>
      </div>
    </section>
  )
}
// ── DERNIÈRES RÉALISATIONS — grille éditoriale (miroir ArchiveTunnel desktop) ──
// Grille 2-col sur mobile, colorisation scroll grayscale→couleur,
// swipe tactile, cartes avec badges type / live / result
function ProjectsSection() {
  const T = useTheme()
  const ref      = useRef(null)
  const inView   = useInView(ref, { once: true, margin: '-60px' })
  const sectionRef = useRef(null)
  const cellRefs   = useRef([])

  const ITEMS = [
    ...PROJECTS.filter(p => p.id === 15 || p.id === 18),
    ...PROJECTS.filter(p => p.id === 17 || p.id === 16),
    ...PROJECTS.filter(p => p.id === 12 || p.id === 11),
  ]

  // ── Colorisation au scroll : grayscale(1) → grayscale(0) ──
  useEffect(() => {
    const onScroll = () => {
      const section = sectionRef.current
      if (!section) return
      const rect    = section.getBoundingClientRect()
      const winH    = window.innerHeight
      const total   = winH + section.offsetHeight
      const traveled = winH - rect.top
      const progress = Math.max(0, Math.min(1, traveled / total))

      cellRefs.current.forEach((cell, i) => {
        if (!cell) return
        // chaque cellule se colorie avec un décalage d'entrée
        const start = i * 0.06
        const local = Math.max(0, Math.min(1, (progress - start) / 0.35))
        const grey  = 1 - local
        cell.style.filter = `grayscale(${grey.toFixed(2)}) contrast(1.04)`
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // ── Swipe tactile horizontal sur la ligne de 3 cartes optionnel ──
  const [active, setActive] = useState(null) // card en plein focus au tap

  return (
    <section
      ref={el => { ref.current = el; sectionRef.current = el }}
      style={{ padding: '7rem 5%', background: T.bg, position: 'relative', overflow: 'hidden' }}
    >
      <div className="grid-bg" style={{ position: 'absolute', inset: 0, opacity: .18 }} />

      <div style={{ position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ position: 'relative', fontSize: 'clamp(1.9rem,7vw,2.6rem)', fontWeight: 800, fontFamily: "'JetBrains Mono',monospace", color: T.textMain, letterSpacing: '-.03em', marginBottom: '.6rem' }}>
            <GhostTitle text="Nos dernières réalisations" />
            Nos dernières <GreenUnderline><span className="text-gradient">réalisations</span></GreenUnderline>
          </h2>
          <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.75rem', color: T.textMuted, letterSpacing: '.04em' }}>
            — scroll pour révéler en couleur
          </p>
        </motion.div>

        {/* Grille 2 colonnes */}
        <style>{`
          .archive-grid-mobile {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: clamp(.5rem, 2vw, .9rem);
          }
          /* La 5e carte prend 2 colonnes pour équilibrer */
          .archive-grid-mobile > div:nth-child(5) { grid-column: span 2; }
        `}</style>

        <div className="archive-grid-mobile">
          {ITEMS.map((p, i) => (
            <motion.div
              key={p.id}
              ref={el => { cellRefs.current[i] = el }}
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: .55, delay: i * .07, ease: [.22,1,.36,1] }}
              onClick={() => setActive(active === i ? null : i)}
              style={{
                position: 'relative',
                borderRadius: 10,
                overflow: 'hidden',
                border: active === i ? '1.5px solid rgba(136,202,83,.6)' : '1px solid rgba(136,202,83,.25)',
                boxShadow: active === i ? '0 0 0 3px rgba(136,202,83,.12)' : 'none',
                filter: 'grayscale(1) contrast(1.04)',
                transition: 'border-color .25s, box-shadow .25s',
                cursor: 'pointer',
                willChange: 'filter',
                aspectRatio: i === 4 ? '16/6' : '4/3',
              }}
            >
              <LazyImg
                src={p.img}
                alt={p.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform .5s', transform: active === i ? 'scale(1.04)' : 'scale(1)' }}
              />

              {/* Overlay gradient bas */}
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,.82) 100%)' }} />

              {/* Type badge */}
              <div style={{
                position: 'absolute', top: '.55rem', left: '.55rem',
                padding: '.18rem .55rem', borderRadius: 100,
                background: 'rgba(136,202,83,.15)', backdropFilter: 'blur(8px)',
                border: '1px solid rgba(136,202,83,.3)',
                fontFamily: "'JetBrains Mono',monospace", fontSize: '.54rem', fontWeight: 700, color: '#88ca53',
              }}>
                {p.type}
              </div>

              {/* Live badge */}
              {p.live && (
                <div style={{
                  position: 'absolute', top: '.55rem', right: '.55rem',
                  display: 'flex', alignItems: 'center', gap: '.25rem',
                  padding: '.16rem .5rem', borderRadius: 100,
                  background: 'rgba(136,202,83,.88)',
                  fontFamily: "'JetBrains Mono',monospace", fontSize: '.48rem', color: '#fff', fontWeight: 700,
                }}>
                  <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#fff', display: 'inline-block', animation: 'dot-blink 1.4s ease-in-out infinite' }} />
                  LIVE
                </div>
              )}

              {/* Info bas */}
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '.65rem .75rem' }}>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 'clamp(.62rem,2.5vw,.75rem)', fontWeight: 700, color: '#fff', lineHeight: 1.2, marginBottom: '.2rem' }}>
                  {p.title}
                </div>

                {/* Result + lien — visibles au tap */}
                <AnimatePresence>
                  {active === i && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }}
                      transition={{ duration: .2 }}
                      style={{ display: 'flex', alignItems: 'center', gap: '.4rem', marginTop: '.2rem', flexWrap: 'wrap' }}
                    >
                      {p.result && (
                        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.6rem', fontWeight: 700, color: '#88ca53' }}>
                          {p.result}
                        </span>
                      )}
                      {p.url && (
                        <a href={p.url} target="_blank" rel="noreferrer"
                          onClick={e => e.stopPropagation()}
                          style={{ display: 'flex', alignItems: 'center', gap: '.2rem', fontFamily: "'JetBrains Mono',monospace", fontSize: '.58rem', fontWeight: 600, color: '#fff', textDecoration: 'none', padding: '.14rem .45rem', borderRadius: 100, border: '1px solid rgba(136,202,83,.4)', background: 'rgba(136,202,83,.14)' }}>
                          <ExternalLink size={8} /> Voir
                        </a>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA bas */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: .5 }}
          style={{ textAlign: 'center', marginTop: '2.5rem' }}>
          <Link href="/projects" className="btn-ghost" style={{ fontSize: '.88rem', padding: '.8rem 1.8rem' }}>
            Toutes les réalisations <ArrowRight size={13} />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

// ── TESTIMONIALS ─────────────────────────────────────────────
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
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <h2 style={{ position: 'relative', fontSize: 'clamp(1.9rem,3.5vw,2.6rem)', fontWeight: 800, fontFamily: "'JetBrains Mono',monospace", color: T.textMain, letterSpacing: '-.03em' }}>
            <GhostTitle text="Ce que disent nos clients" />
            Ce que disent nos <GreenUnderline><span className="text-gradient">clients</span></GreenUnderline>
          </h2>
        </motion.div>

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
      </div>
    </section>
  )
}

// ── HOME PAGE ────────────────────────────────────────────────
export default function HomePageMobile() {
  return (
    <div style={{ paddingTop: 0 }}>
      <Hero />
      <AboutSection />
      <StatsSection />
      <MarqueeStrip />
      <ServicesPreview />
      <Process />
      <MarqueeStrip />
      <ProjectsSection />
      <Testimonials />
      <PageCTA message="Comme eux, donnez à votre activité la présence digitale qu'elle mérite." cta="Rejoindre nos clients" />
    </div>
  )
}