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
import { SectionEye, AnimatedCounter, LazyImg, MarqueeStrip, SectionCTA, GreenUnderline } from '@/components/ui/index'
import { SERVICES, PROJECTS, TESTIMONIALS, STATS } from '@/lib/data'

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
        glowRef.current.style.background = `radial-gradient(260px circle at ${px}% ${py}%, rgba(34,200,100,.13) 0%, transparent 65%)`
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
  const timerRef = useRef(null)

  // ── Layer refs (data-speed équivalent du HTML) ──
  const layerBgRef  = useRef(null)  // speed 0.2  — bouge peu, zoom au scroll
  const layerMidRef = useRef(null)  // speed 0.5  — fade + blur + translate au scroll
  const layerForeRef = useRef(null) // speed 0.8  — sort vite

  const next = useCallback(() => {
    setIdx(i => (i + 1) % HERO_SLIDES.length)
    setImgIdx(i => (i + 1) % HERO_SLIDES.length)
  }, [])

  useEffect(() => {
    timerRef.current = setInterval(next, 5000)
    return () => clearInterval(timerRef.current)
  }, [next])

  // ── SOURIS : translate3d par vitesse + rotateX/Y (copie exacte du HTML) ──
  useEffect(() => {
    const onMouse = (e) => {
      const x = (e.clientX - window.innerWidth  / 2) / (window.innerWidth  / 2)
      const y = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2)
      const rotX = y * -5
      const rotY = x *  5

      const apply = (el, speed) => {
        if (!el) return
        const mx = x * 50 * speed
        const my = y * 50 * speed
        el.style.transform = `translate3d(${mx}px,${my}px,0) rotateX(${rotX}deg) rotateY(${rotY}deg)`
      }
      apply(layerBgRef.current,   0.2)
      apply(layerMidRef.current,  0.5)
      apply(layerForeRef.current, 0.8)
    }
    window.addEventListener('mousemove', onMouse)
    return () => window.removeEventListener('mousemove', onMouse)
  }, [])

  // ── SCROLL : zoom bg + fade/blur mid + fore sort vite (copie exacte du HTML) ──
  useEffect(() => {
    const onScroll = () => {
      const s = window.pageYOffset

      // Layer BG — zoom + translateY
      if (layerBgRef.current) {
        const zoom = 1 + s * 0.0005
        layerBgRef.current.style.transform = `scale(${zoom}) translateY(${s * 0.2}px)`
        layerBgRef.current.style.filter = `blur(${Math.min(s / 60, 12)}px)`
      }
      // Layer MID — fade + blur cinématique + translateY
      if (layerMidRef.current) {
        layerMidRef.current.style.opacity  = Math.max(0, 1 - s / 700)
        layerMidRef.current.style.transform = `translateY(${s * 0.5 * 0.8}px)`
        layerMidRef.current.style.filter   = `blur(${s / 100}px)`
      }
      // Layer FORE — sort de l'écran plus vite
      if (layerForeRef.current) {
        layerForeRef.current.style.transform = `translateY(${s * 0.8 * 1.2}px)`
        layerForeRef.current.style.opacity = Math.max(0, 1 - s / 400)
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const slide = HERO_SLIDES[idx]

  return (
    <section style={{ height: '100vh', width: '100%', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#030806' }}>

      {/* ── LAYER BG — arrière-plan image carousel (lent, zoom+blur scroll) ── */}
      <div
        ref={layerBgRef}
        style={{ position: 'absolute', zIndex: 1, width: '115%', height: '115%', willChange: 'transform, filter', transition: 'transform .1s ease-out' }}
      >
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
        {/* Overlays */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(105deg, rgba(3,8,6,.95) 0%, rgba(3,8,6,.78) 45%, rgba(3,8,6,.28) 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 15%, rgba(3,8,6,.92) 100%)' }} />
        {/* Orbe vert */}
        <motion.div
          style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
          animate={{ background: [
            'radial-gradient(700px circle at 25% 38%, rgba(34,200,100,.055) 0%, transparent 62%)',
            'radial-gradient(700px circle at 72% 58%, rgba(34,200,100,.075) 0%, transparent 62%)',
            'radial-gradient(700px circle at 25% 38%, rgba(34,200,100,.055) 0%, transparent 62%)',
          ]}}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Grid bg */}
        <div className="grid-bg" style={{ position: 'absolute', inset: 0, opacity: .13, pointerEvents: 'none' }} />
        {/* Scan line */}
        <motion.div
          animate={{ top: ['-5%', '105%'] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'linear', repeatDelay: 2 }}
          style={{ position: 'absolute', left: 0, right: 0, height: 1, background: 'linear-gradient(90deg,transparent,rgba(34,200,100,.32),transparent)', pointerEvents: 'none' }}
        />
      </div>

      {/* ── LAYER MID — contenu texte (vitesse 0.5, fade+blur cinéma) ── */}
      <div
        ref={layerMidRef}
        style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: 1200, padding: '0 5%', willChange: 'transform, opacity, filter', transition: 'transform .1s ease-out' }}
      >
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
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '.5rem', padding: '.3rem .9rem', borderRadius: 100, background: 'rgba(34,200,100,.1)', border: '1px solid rgba(34,200,100,.25)', marginBottom: '1.8rem', backdropFilter: 'blur(8px)' }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c864', animation: 'dot-blink 1.4s ease-in-out infinite' }} />
                  <span style={{ fontFamily: "'Syne',sans-serif", fontSize: '.65rem', fontWeight: 600, color: '#22c864' }}>{slide.tag}</span>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .55, delay: .15 }}
                  style={{ fontSize: 'clamp(2.4rem,5.5vw,4.4rem)', fontWeight: 800, fontFamily: "'Syne',sans-serif", color: 'rgba(255,255,255,.92)', letterSpacing: '-.04em', lineHeight: 1.08, marginBottom: '.3rem' }}>
                  {slide.title}
                </motion.h1>
                <motion.h1
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .55, delay: .22 }}
                  style={{ fontSize: 'clamp(2.4rem,5.5vw,4.4rem)', fontWeight: 800, fontFamily: "'Dancing Script',cursive", color: '#22c864', letterSpacing: '-.02em', lineHeight: 1.08, marginBottom: '1.6rem' }}>
                  <GreenUnderline>{slide.accent}</GreenUnderline>
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .6, delay: .3 }}
                  style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,.6)', lineHeight: 1.75, marginBottom: '2.8rem', maxWidth: 520 }}>
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
                  style={{ padding: '.28rem .8rem', borderRadius: 100, background: 'rgba(34,200,100,.08)', border: '1px solid rgba(34,200,100,.18)', fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: '.85rem', color: '#66ffaa', backdropFilter: 'blur(6px)' }}>
                  {b}
                </motion.span>
              ))}
            </motion.div>
          </div>

          {/* Stat cards droite — font partie du layer-mid */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-end' }} className="hide-mobile">
            <TiltCard intensity={13} perspective={800} style={{ borderRadius: 18 }}>
              <motion.div initial={{ opacity: 0, x: 28 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: .6, delay: .35 }}>
                <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                  className="sku-card"
                  style={{ padding: '.85rem 1.2rem', display: 'flex', alignItems: 'center', gap: '.7rem', backdropFilter: 'blur(14px)', background: T.light ? 'rgba(255,255,255,.92)' : 'rgba(11,26,16,.88)', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(120deg,transparent 30%,rgba(34,200,100,.07) 50%,transparent 70%)', backgroundSize: '200% 100%', animation: 'shimmer 3.2s ease-in-out infinite', pointerEvents: 'none' }} />
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(34,200,100,.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <TrendingUp size={18} style={{ color: '#22c864' }} />
                  </div>
                  <div>
                    <div style={{ fontFamily: "'Syne',sans-serif", fontSize: '.9rem', fontWeight: 800, color: '#22c864' }}>+10</div>
                    <div style={{ fontFamily: "'Syne',sans-serif", fontSize: '.52rem', color: T.textMuted, textTransform: 'uppercase', letterSpacing: '.06em' }}>Projets livrés</div>
                  </div>
                </motion.div>
              </motion.div>
            </TiltCard>

            <TiltCard intensity={10} perspective={800} style={{ borderRadius: 18 }}>
              <motion.div initial={{ opacity: 0, x: 28 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: .6, delay: .48 }}>
                <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                  className="sku-card"
                  style={{ padding: '.75rem 1rem', display: 'flex', alignItems: 'center', gap: '.6rem', backdropFilter: 'blur(14px)', background: T.light ? 'rgba(255,255,255,.92)' : 'rgba(11,26,16,.88)', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(120deg,transparent 30%,rgba(34,200,100,.07) 50%,transparent 70%)', backgroundSize: '200% 100%', animation: 'shimmer 4s ease-in-out infinite .9s', pointerEvents: 'none' }} />
                  <div style={{ display: 'flex' }}>
                    {[1,2,3,4,5].map(s => <Star key={s} size={12} style={{ color: '#22c864' }} fill="#22c864" />)}
                  </div>
                  <span style={{ fontFamily: "'Syne',sans-serif", fontSize: '.75rem', fontWeight: 700, color: T.textMain }}>100% satisfaits</span>
                </motion.div>
              </motion.div>
            </TiltCard>

            {/* Slide dots */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .7 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '.4rem', paddingTop: '.5rem' }}>
              {HERO_SLIDES.map((_, i) => (
                <button key={i} onClick={() => { setIdx(i); setImgIdx(i); clearInterval(timerRef.current); timerRef.current = setInterval(next, 5000) }}
                  style={{ width: 4, height: i === idx ? 28 : 8, borderRadius: 2, background: i === idx ? '#22c864' : 'rgba(34,200,100,.25)', border: 'none', cursor: 'pointer', transition: 'all .35s', display: 'block' }} />
              ))}
            </motion.div>
          </div>
        </div>

        {/* Stats bar — dans le layer-mid, suit le fade */}
        <motion.div
          initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .8, duration: .6 }}
          style={{ marginTop: '3.5rem' }}>
          <div className="stats-bar-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1px', background: 'rgba(34,200,100,.12)', borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(34,200,100,.12)', backdropFilter: 'blur(12px)' }}>
            {STATS.map(({ val, suffix, label }, si) => (
              <motion.div key={label}
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .9 + si * .08 }}
                whileHover={{ background: 'rgba(34,200,100,.07)', transition: { duration: .2 } }}
                style={{ padding: '1.5rem', background: 'rgba(3,8,6,.7)', textAlign: 'center', cursor: 'default' }}>
                <div style={{ fontFamily: "'Syne',sans-serif", fontSize: '.9rem', fontWeight: 800, color: '#22c864', lineHeight: 1 }}>
                  <AnimatedCounter target={val} suffix={suffix} />
                </div>
                <div style={{ fontFamily: "'Syne',sans-serif", fontSize: '.6rem', color: 'rgba(255,255,255,.35)', textTransform: 'uppercase', letterSpacing: '.08em', marginTop: '.4rem' }}>{label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── LAYER FORE — cartes flottantes foreground (vitesse 0.8, sort plus vite) ── */}
      <div
        ref={layerForeRef}
        style={{ position: 'absolute', inset: 0, zIndex: 20, pointerEvents: 'none', willChange: 'transform, opacity', transition: 'transform .1s ease-out' }}
      >
        {/* Particules */}
        {[
          { left: '12%', top: '22%', s: 4, op: .22, dur: 3.8, dy: 0 },
          { left: '28%', top: '65%', s: 3, op: .12, dur: 5.1, dy: 1.2 },
          { left: '55%', top: '28%', s: 4, op: .26, dur: 4.4, dy: 0.6 },
          { left: '70%', top: '72%', s: 3, op: .10, dur: 6.2, dy: 1.8 },
          { left: '83%', top: '18%', s: 4, op: .18, dur: 3.2, dy: 0.3 },
          { left: '92%', top: '52%', s: 3, op: .14, dur: 4.9, dy: 2.1 },
        ].map((p, i) => (
          <motion.div key={i}
            style={{ position: 'absolute', width: p.s, height: p.s, borderRadius: '50%', background: '#22c864', left: p.left, top: p.top, opacity: p.op }}
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: p.dur, repeat: Infinity, ease: 'easeInOut', delay: p.dy }}
          />
        ))}
      </div>

      {/* Scroll indicator */}
      <div style={{ position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: .28, zIndex: 15, pointerEvents: 'none' }}>
        <span style={{ fontFamily: "'Syne',sans-serif", fontSize: '.6rem', letterSpacing: '.18em', textTransform: 'uppercase', marginBottom: '.4rem', color: '#fff' }}>Scroll</span>
        <motion.div animate={{ scaleY: [1, 1.4, 1], opacity: [.5, 1, .5] }} transition={{ duration: 1.6, repeat: Infinity }}
          style={{ width: 1, height: 36, background: 'linear-gradient(to bottom, rgba(255,255,255,.8), transparent)' }} />
      </div>

    </section>
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
      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <SectionEye label="// Nos Services" center />
          <h2 style={{ fontSize: 'clamp(1.9rem,3.5vw,2.8rem)', fontWeight: 800, fontFamily: "'Syne',sans-serif", color: T.textMain, letterSpacing: '-.03em', lineHeight: 1.15 }}>
            Des solutions qui travaillent pour vous,<br />
            <GreenUnderline><span className="text-gradient">même quand vous dormez</span></GreenUnderline>
          </h2>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: '1.2rem' }}>
          {SERVICES.map(({ icon, n, title, desc, price, del }, i) => {
            const Icon = ICON_MAP[icon] || Globe
            return (
              <motion.div key={title} className="sku-card"
                initial={{ opacity: 0, y: 32, scale: .97 }}
                animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ duration: .55, delay: (i % 3) * .1 }}
                whileHover={{ y: -5 }}
                style={{ padding: '1.8rem', position: 'relative', overflow: 'hidden' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.2rem' }}>
                  <div style={{ width: 50, height: 50, borderRadius: 12, background: 'rgba(34,200,100,.1)', border: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={22} style={{ color: T.green }} />
                  </div>
                  <div>
                    <div style={{ fontFamily: "'Syne',sans-serif", fontSize: '.65rem', fontWeight: 600, color: T.greenSub, letterSpacing: '.1em', marginBottom: '.2rem' }}>{n}</div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: T.textMain, fontFamily: "'Syne',sans-serif" }}>{title}</h3>
                  </div>
                </div>
                <p style={{ fontSize: '.83rem', color: T.textSub, lineHeight: 1.7, marginBottom: '1.2rem' }}>{desc}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '.9rem', borderTop: `1px solid ${T.border}` }}>
                  <span style={{ fontFamily: "'Syne',sans-serif", fontSize: '.9rem', fontWeight: 800, color: T.green }}>{price}</span>
                  <span style={{ fontFamily: "'Syne',sans-serif", fontSize: '.62rem', color: T.textMuted, display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                    <Timer size={11} style={{ color: T.green }} />{del}
                  </span>
                </div>
              </motion.div>
            )
          })}
        </div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: .6 }}
          style={{ textAlign: 'center', marginTop: '3rem' }}>
          <Link href="/services" className="btn-ghost" style={{ fontSize: '.9rem' }}>
            Voir tous les services <ArrowRight size={14} />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

// ── WHY US ───────────────────────────────────────────────────
function WhyUs() {
  const T = useTheme()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const items = [
    { n: '01', title: 'Livraison dans les délais', desc: "Pas de mauvaises surprises. Chaque projet est livré à la date convenue, avec un suivi régulier jusqu'à la mise en ligne." },
    { n: '02', title: 'Design 100% sur mesure', desc: "Votre site est unique, pensé pour votre activité. Zéro template, zéro copier-coller — une identité visuelle qui vous ressemble." },
    { n: '03', title: 'Support & Formation inclus', desc: "Vous repartez autonome. Une formation est incluse pour gérer votre site facilement, sans dépendre d'un technicien." },
    { n: '04', title: 'SEO & Performance optimisés', desc: "Un site rapide, visible sur Google. Vos clients vous trouvent plus facilement — et votre crédibilité monte instantanément." },
  ]
  return (
    <section ref={ref} style={{ padding: '7rem 5%', background: T.bgAlt, position: 'relative', overflow: 'hidden' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <SectionEye label="// Built on Trust" center />
          <h2 style={{ fontSize: 'clamp(1.9rem,3vw,2.6rem)', fontWeight: 800, fontFamily: "'Syne',sans-serif", color: T.textMain, letterSpacing: '-.03em' }}>
            Pourquoi les entrepreneurs{' '}<GreenUnderline><span className="text-gradient">choisissent AKATech.</span></GreenUnderline>
          </h2>
        </motion.div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: '1rem' }}>
          {items.map(({ n, title, desc }, i) => (
            <motion.div key={n} className="sku-card"
              initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: i * .08 }}
              whileHover={{ y: -4 }}
              style={{ padding: '1.8rem' }}>
              <div style={{ fontFamily: "'Syne',sans-serif", fontSize: '.9rem', fontWeight: 800, color: T.green, opacity: .3, lineHeight: 1, marginBottom: '.8rem' }}>{n}</div>
              <h3 style={{ fontSize: '.95rem', fontWeight: 700, color: T.textMain, fontFamily: "'Syne',sans-serif", marginBottom: '.4rem' }}>{title}</h3>
              <p style={{ fontSize: '.8rem', color: T.textSub, lineHeight: 1.6 }}>{desc}</p>
            </motion.div>
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

        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '4rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <SectionEye label="// Réalisations" />
            <h2 style={{ fontSize: 'clamp(1.9rem,3.5vw,2.8rem)', fontWeight: 800, fontFamily: "'Syne',sans-serif", color: T.textMain, letterSpacing: '-.03em' }}>
              Nos dernières <GreenUnderline><span className="text-gradient">réalisations livrées</span></GreenUnderline>
            </h2>
          </div>
          <Link href="/projects" className="btn-ghost" style={{ padding: '.65rem 1.4rem', fontSize: '.82rem' }}>
            Toutes les réalisations <ArrowRight size={13} />
          </Link>
        </motion.div>

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
                  <div className="sku-card" style={{ overflow: 'hidden', border: isCenter ? '1px solid rgba(34,200,100,.45)' : `1px solid ${T.border}`, boxShadow: isCenter ? '0 0 40px rgba(34,200,100,.2), 12px 12px 40px rgba(0,0,0,.6)' : undefined, transition: 'border-color .3s, box-shadow .3s' }}>

                    {/* Image */}
                    <div style={{ height: 200, position: 'relative', overflow: 'hidden' }}>
                      <img src={project.img} alt={project.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform .5s', transform: isCenter ? 'scale(1.04)' : 'scale(1)' }} />
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(6,14,9,.95) 0%,rgba(6,14,9,.3) 50%,transparent)' }} />

                      {/* Type badge */}
                      <div className="no-pill-mobile" style={{ position: 'absolute', top: '.8rem', left: '.8rem', padding: '.25rem .7rem', borderRadius: 100, background: 'rgba(34,200,100,.15)', backdropFilter: 'blur(8px)', border: '1px solid rgba(34,200,100,.3)', fontFamily: "'Syne',sans-serif", fontSize: '.65rem', fontWeight: 600, color: '#22c864' }}>
                        {project.type}
                      </div>

                      {/* Live badge */}
                      {project.live && (
                        <div className="no-pill-mobile" style={{ position: 'absolute', top: '.8rem', right: '.8rem', display: 'flex', alignItems: 'center', gap: '.3rem', padding: '.22rem .6rem', borderRadius: 100, background: 'rgba(34,200,100,.88)', fontFamily: "'Syne',sans-serif", fontSize: '.54rem', color: '#fff', fontWeight: 700 }}>
                          <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#fff', display: 'inline-block', animation: 'dot-blink 1.4s ease-in-out infinite' }} />
                          LIVE
                        </div>
                      )}

                      {/* Result */}
                      <div className="no-pill-mobile" style={{ position: 'absolute', bottom: '.8rem', right: '.8rem', padding: '.25rem .7rem', borderRadius: 100, background: 'rgba(0,0,0,.6)', backdropFilter: 'blur(6px)', border: '1px solid rgba(34,200,100,.3)', fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: '1rem', color: '#22c864' }}>
                        {project.result}
                      </div>
                    </div>

                    {/* Content */}
                    <div style={{ padding: '1.2rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '.35rem', gap: '.6rem' }}>
                        <h3 style={{ fontSize: '.98rem', fontWeight: 700, color: T.textMain, fontFamily: "'Syne',sans-serif" }}>{project.title}</h3>
                        {project.url && (
                          <a href={project.url} target="_blank" rel="noreferrer"
                            onClick={e => e.stopPropagation()}
                            style={{ display: 'flex', alignItems: 'center', gap: '.25rem', fontFamily: "'Syne',sans-serif", fontSize: '.65rem', fontWeight: 600, color: T.green, textDecoration: 'none', flexShrink: 0, padding: '.22rem .6rem', borderRadius: 100, border: `1px solid ${T.border}`, background: 'rgba(34,200,100,.06)', transition: 'all .2s' }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(34,200,100,.18)'; e.currentTarget.style.borderColor = '#22c864' }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(34,200,100,.06)'; e.currentTarget.style.borderColor = T.border }}>
                            <ExternalLink size={9} /> Voir
                          </a>
                        )}
                      </div>
                      <p style={{ fontSize: '.75rem', color: T.textSub, lineHeight: 1.55, marginBottom: '.9rem' }}>{project.desc.slice(0, 90)}…</p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.3rem' }}>
                        {project.tech.slice(0, 3).map(t => (
                          <span key={t} style={{ padding: '.18rem .55rem', borderRadius: 100, background: 'rgba(34,200,100,.07)', border: `1px solid ${T.border}`, fontFamily: "'Syne',sans-serif", fontSize: '.65rem', fontWeight: 600, color: T.green }}>{t}</span>
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
              style={{ width: i === center ? 24 : 8, height: 8, borderRadius: 4, background: i === center ? '#22c864' : 'rgba(34,200,100,.2)', border: 'none', cursor: 'pointer', transition: 'all .3s' }} />
          ))}
        </div>
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
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle,rgba(34,200,100,.05),transparent 65%)', pointerEvents: 'none' }} />
      <div style={{ maxWidth: 900, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <SectionEye label="// Témoignages" center />
          <h2 style={{ fontSize: 'clamp(1.9rem,3.5vw,2.6rem)', fontWeight: 800, fontFamily: "'Syne',sans-serif", color: T.textMain, letterSpacing: '-.03em' }}>
            Ce que disent nos <GreenUnderline><span className="text-gradient">clients</span></GreenUnderline>
          </h2>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div key={idx} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: .4 }}
            className="sku-card" style={{ padding: '2.5rem', textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.2rem' }}>
              {[1,2,3,4,5].map(s => <Star key={s} size={18} fill="#22c864" style={{ color: '#22c864' }} />)}
            </div>
            <blockquote style={{ fontSize: '1.05rem', color: T.textMain, lineHeight: 1.75, fontStyle: 'italic', marginBottom: '2rem', maxWidth: 640, margin: '0 auto 2rem' }}>
              "{t.text}"
            </blockquote>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
              <div style={{ width: 52, height: 52, borderRadius: '50%', overflow: 'hidden', border: '2px solid rgba(34,200,100,.35)' }}>
                <LazyImg src={t.img} alt={t.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  placeholder={<div style={{ width: 52, height: 52, background: 'rgba(34,200,100,.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#22c864', fontFamily: "'Syne',sans-serif", fontWeight: 700 }}>{t.name[0]}</div>} />
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: 700, color: T.textMain, fontFamily: "'Syne',sans-serif", fontSize: '.9rem' }}>{t.name}</div>
                <div style={{ fontSize: '.72rem', color: T.textMuted, fontFamily: "'Syne',sans-serif" }}>{t.role}</div>
              </div>
              <span className="no-pill-mobile" style={{ marginLeft: 'auto', padding: '.3rem .8rem', borderRadius: 100, background: 'rgba(34,200,100,.12)', border: '1px solid rgba(34,200,100,.25)', color: '#22c864', fontFamily: "'Syne',sans-serif", fontSize: '.65rem', fontWeight: 600 }}>{t.result}</span>
            </div>
          </motion.div>
        </AnimatePresence>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '.5rem', marginTop: '1.5rem' }}>
          {TESTIMONIALS.map((_, i) => (
            <button key={i} onClick={() => setIdx(i)}
              style={{ width: i === idx ? 24 : 8, height: 8, borderRadius: 4, background: i === idx ? '#22c864' : 'rgba(34,200,100,.2)', border: 'none', cursor: 'pointer', transition: 'all .3s' }} />
          ))}
        </div>
      </div>
    </section>
  )
}

// ── PROCESS ──────────────────────────────────────────────────
function Process() {
  const T = useTheme()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const [activeStep, setActiveStep] = useState(0)
  const steps = [
    { n: '01', icon: MessageCircle, title: "On vous écoute", desc: "Vous décrivez votre projet, vos objectifs et votre budget. Devis gratuit et personnalisé, sans engagement." },
    { n: '02', icon: Target, title: "On planifie", desc: "On définit ensemble la meilleure solution : technologies, design, délais et fonctionnalités." },
    { n: '03', icon: Code, title: "On développe", desc: "Votre solution prend vie avec un code propre et un design soigné. Vous suivez l'avancement à chaque étape." },
    { n: '04', icon: Rocket, title: "On livre & on forme", desc: "Mise en ligne, tests, formation et support inclus. Vous repartez avec un outil prêt à attirer des clients." },
  ]

  useEffect(() => {
    if (!inView) return
    const t = setInterval(() => setActiveStep(s => (s + 1) % steps.length), 2500)
    return () => clearInterval(t)
  }, [inView])

  return (
    <section ref={ref} style={{ padding: '7rem 5%', background: T.bg }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <SectionEye label="// Notre Processus" center />
          <h2 style={{ fontSize: 'clamp(1.9rem,3.5vw,2.8rem)', fontWeight: 800, fontFamily: "'Syne',sans-serif", color: T.textMain, letterSpacing: '-.03em' }}>
            De l'idée à la <GreenUnderline><span className="text-gradient">mise en ligne</span></GreenUnderline>
          </h2>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '1.5rem' }}>
          {steps.map(({ n, icon: Icon, title, desc }, i) => (
            <motion.div key={n}
              initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: i * .1 }}
              onClick={() => setActiveStep(i)}
              className="sku-card"
              style={{ padding: '2rem', cursor: 'pointer', border: activeStep === i ? '1px solid rgba(34,200,100,.4)' : `1px solid ${T.border}`, transition: 'all .3s', boxShadow: activeStep === i ? '0 0 30px rgba(34,200,100,.15)' : undefined }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '.8rem', marginBottom: '1.2rem' }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: activeStep === i ? 'rgba(34,200,100,.2)' : 'rgba(34,200,100,.08)', border: `1px solid ${activeStep === i ? 'rgba(34,200,100,.4)' : T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .3s' }}>
                  <Icon size={22} style={{ color: T.green }} />
                </div>
                <span style={{ fontFamily: "'Syne',sans-serif", fontSize: '.9rem', fontWeight: 800, color: T.green, opacity: .3 }}>{n}</span>
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: T.textMain, fontFamily: "'Syne',sans-serif", marginBottom: '.5rem' }}>{title}</h3>
              <p style={{ fontSize: '.82rem', color: T.textSub, lineHeight: 1.65 }}>{desc}</p>
              {activeStep === i && (
                <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} style={{ height: 2, background: 'linear-gradient(90deg,#22c864,rgba(34,200,100,.1))', borderRadius: 1, marginTop: '1.2rem', transformOrigin: 'left' }} />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── HOME PAGE ────────────────────────────────────────────────
export default function HomePage() {
  return (
    <div style={{ paddingTop: 0 }}>
      <Hero />
      <MarqueeStrip />
      <ServicesPreview />
      <SectionCTA message="Vous avez une idée de projet ? On en parle — c'est gratuit et sans engagement." cta="Discuter sur WhatsApp" />
      <WhyUs />
      <Process />
      <MarqueeStrip />
      <ProjectsCarousel />
      <SectionCTA variant="strong" message="Ces projets ont été livrés dans les délais, avec formation incluse. Le vôtre peut l'être aussi." cta="Démarrer mon projet" />
      <Testimonials />
      <SectionCTA message="Comme eux, donnez à votre activité la présence digitale qu'elle mérite." cta="Rejoindre nos clients →" />
    </div>
  )
}