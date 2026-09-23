'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, useInView, AnimatePresence, useReducedMotion } from 'framer-motion'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { cld } from '@/lib/cloudinary'

import {
  ArrowRight, Star, ExternalLink,
  Globe, ShoppingCart, Cpu, Server, Palette, Wrench, Map, MapPin,
  TrendingUp, Users, Clock, Award,
  MessageCircle, Target, Code, Timer, ChevronLeft, ChevronRight,
  Monitor, ShoppingBag, LayoutDashboard, Cog, Image,
  Calendar, Layers, Receipt, Calculator, CreditCard,
  Send, Zap, Lock, Mail, Phone, Check, HelpCircle, ChevronDown
} from 'lucide-react'
import { useTheme } from '@/lib/theme'
import { useLanguage } from '@/lib/language'
import { GhostTitle, AnimatedCounter, LazyImg, GreenUnderline, HoverSlideText } from '@/components/ui/index'
import TrustStacksMarquee from '@/components/ui/TrustStacksMarquee'
import ConversionMarquee from '@/components/ui/ConversionMarquee'
import { SERVICES, PROJECTS, TESTIMONIALS, FAQ_ITEMS, PRICING, getLocalizedData } from '@/lib/data'
import { AvatarGroup, Avatar, AvatarImage, AvatarFallback, AvatarGroupTooltip, AvatarGroupTooltipArrow } from '@/components/ui/AvatarGroup'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const ICON_MAP = { Globe, ShoppingCart, Cpu, Server, Palette, Wrench, Map, MapPin }

// ── HERO (inchangé) ───────────────────────────────────────────
// ── CIRCULAR PROJECTS GALLERY (inspiré Aeline/Catalis) ────────
function CircularProjectsGallery() {
  const T = useTheme()
  // 6 projets les plus récents (Karnet, ProTech POS, Anyama Proxy,
  // R3NS3IGN3M3NT ajoutés — remplace l'ancienne sélection figée).
  const GALLERY_ITEMS = PROJECTS.filter(p => p.id >= 19 && p.id <= 24)
  const [active, setActive] = useState(0)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    if (reduceMotion) return // pas de rotation auto si l'utilisateur préfère moins de mouvement
    const id = setInterval(() => setActive(a => (a + 1) % GALLERY_ITEMS.length), 2800)
    return () => clearInterval(id)
  }, [GALLERY_ITEMS.length, reduceMotion])

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
    <div style={{ position: 'relative', height: CARD_H + 60, width: '100%', maxWidth: '100vw', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', perspective: 1200 }}>
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
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.8rem', fontWeight: 700, color: '#fff', letterSpacing: '-.01em', lineHeight: 1.2 }}><HoverSlideText text={p.title} /></div>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.65rem', color: 'rgba(136,202,83,.9)', marginTop: '.1rem' }}>{p.type}</div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

// Hauteur du Hero en dvh — volontairement < 100 pour laisser apparaître
// un aperçu de la CIRCULAR PROJECTS GALLERY en bas de viewport sur desktop.
const HERO_VH = 92

function HeroSlogan() {
  const { t } = useLanguage()
  return (
    <div style={{ marginBottom: '1.8rem', maxWidth: 800, marginLeft: 'auto', marginRight: 'auto', minHeight: 'clamp(3.8rem,9vw,6.4rem)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <motion.p
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: .45, ease: 'easeOut' }}
        style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontStyle: 'italic', fontSize: 'clamp(1.8rem,4vw,3rem)', lineHeight: 1.18, letterSpacing: '-.02em', textTransform: 'uppercase', color: '#fff', textShadow: '4px 4px 0px rgba(0,0,0,.55)', textAlign: 'center', margin: 0 }}>
        {t('hero_copy_intro')}{' '}
        <span style={{ display: 'inline-block', background: 'linear-gradient(135deg, var(--pop-lime), var(--g1))', color: '#050505', padding: '.1em .35em', border: '3px solid #050505', borderRadius: '.18em', boxShadow: '5px 5px 0px #fff, 0 0 32px var(--pop-lime-glow)', textShadow: 'none', transform: 'rotate(-2deg)' }}>
          {t('hero_copy_goal')}
        </span>
      </motion.p>
    </div>
  )
}

const HERO_SLOGANS = [
  { beforeKey: 'homeSlogan1', highlightKey: 'homeHighlight1' },
  { beforeKey: 'homeSlogan2', highlightKey: 'homeHighlight2' },
  { beforeKey: 'homeSlogan3', highlightKey: 'homeHighlight3' },
]

function HeroSloganCycle() {
  const { t } = useLanguage()
  const [index, setIndex] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setIndex(i => (i + 1) % HERO_SLOGANS.length), 3500)
    return () => clearInterval(id)
  }, [])
  const before = t(HERO_SLOGANS[index].beforeKey)
  const highlight = t(HERO_SLOGANS[index].highlightKey)

  return (
    <div style={{ marginBottom: '1.8rem', maxWidth: 800, marginLeft: 'auto', marginRight: 'auto', minHeight: 'clamp(3.8rem,9vw,6.4rem)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <AnimatePresence mode="wait">
        <motion.p key={index}
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
          transition={{ duration: .45, ease: 'easeOut' }}
          style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontStyle: 'italic', fontSize: 'clamp(1.8rem,4vw,3rem)', lineHeight: 1.18, letterSpacing: '-.02em', textTransform: 'uppercase', color: '#fff', textShadow: '4px 4px 0px rgba(0,0,0,.55)', textAlign: 'center', margin: 0 }}>
          {before}
          <span style={{ display: 'inline-block', background: 'linear-gradient(135deg, var(--pop-lime), var(--g1))', color: '#050505', padding: '.1em .35em', border: '3px solid #050505', borderRadius: '.18em', boxShadow: '5px 5px 0px #fff, 0 0 32px var(--pop-lime-glow)', textShadow: 'none', transform: 'rotate(-2deg)' }}>
            {highlight}
          </span>
        </motion.p>
      </AnimatePresence>
    </div>
  )
}

function Hero() {
  const T = useTheme()
  const { t } = useLanguage()
  const wrapRef     = useRef(null)
  const layerBgRef  = useRef(null)
  const layerMidRef = useRef(null)
  const layerForeRef = useRef(null)
  const galleryRef  = useRef(null)

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
      apply(galleryRef.current,   0.5, true)
      apply(layerForeRef.current, 0.8)
    }
    window.addEventListener('mousemove', onMouse)
    return () => window.removeEventListener('mousemove', onMouse)
  }, [])

  useEffect(() => {
    // Pendant le scroll, le Hero reste pinné (cf. wrapper HERO_VH+100dvh ci-dessous) :
    // on calcule une progression 0→1 sur la distance pinnée, et on l'utilise
    // pour zoomer + flouter + faire disparaître le Hero, comme la section
    // pinnée "zoom-title" de 1.html — pour laisser émerger la suite de la page.
    let raf = null
    let lastProgress = null
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = null
        const wrap = wrapRef.current
        const winH = window.visualViewport?.height || window.innerHeight
        let progress = 0
        if (wrap) {
          const top = wrap.getBoundingClientRect().top
          const pinDistance = wrap.offsetHeight - winH
          progress = pinDistance > 0 ? Math.min(1, Math.max(0, -top / pinDistance)) : 0
        }
        if (progress === lastProgress) return
        lastProgress = progress

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
        if (galleryRef.current) {
          galleryRef.current.style.opacity = String(Math.max(0, 1 - progress * 1.25))
        }
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => { window.removeEventListener('scroll', onScroll); if (raf) cancelAnimationFrame(raf) }
  }, [])

  return (
    <div ref={wrapRef} style={{ position: 'relative', height: `${HERO_VH + 200}dvh` }}>
    <section id="home-hero" style={{ height: `${HERO_VH}dvh`, maxHeight: `${HERO_VH}dvh`, width: '100%', position: 'sticky', top: 0, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#030806', paddingBottom: 'clamp(140px, 15vh, 180px)' }}>

      <div ref={layerBgRef} style={{ position: 'absolute', zIndex: 1, width: '115%', height: '115%', willChange: 'transform, filter', transition: 'transform .1s ease-out', pointerEvents: 'none' }}>
        <img src={cld('/images/hero-bg.webp')} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
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

      {/* Décor maximalisme pop vitaminé — texture demi-teinte, purement
          décorative (pointer-events none), au-dessus du fond photo mais
          sous le bloc de contenu (z-index 10). */}
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, zIndex: 3, pointerEvents: 'none', overflow: 'hidden' }}>
        <div className="halftone-bg" style={{ position: 'absolute', top: 0, right: 0, width: '45%', height: '55%', opacity: .14, WebkitMaskImage: 'radial-gradient(circle at 100% 0%, black, transparent 70%)', maskImage: 'radial-gradient(circle at 100% 0%, black, transparent 70%)' }} />
      </div>

      <div ref={layerMidRef} style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: 1100, padding: '3rem 5% 0', willChange: 'transform, opacity, filter', transition: 'transform .1s ease-out', textAlign: 'center' }}>

        

        <HeroSloganCycle />

        <motion.p
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .5, delay: .35 }}
          style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '1.02rem', color: 'rgba(255,255,255,.68)', maxWidth: 560, margin: '0 auto 1.7rem', lineHeight: 1.55 }}>
          {t('homeHeroText')}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .5, delay: .4 }}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '.85rem', marginBottom: '1.9rem' }}>
          <AvatarGroup spacing={-11}>
            {TESTIMONIALS.map(c => (
              <Avatar key={c.name}>
                <AvatarImage src={c.img} alt={c.name} />
                <AvatarFallback>{c.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                <AvatarGroupTooltip>{c.name} — {c.role}<AvatarGroupTooltipArrow /></AvatarGroupTooltip>
              </Avatar>
            ))}
          </AvatarGroup>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontStyle: 'italic', fontWeight: 900, fontSize: '.85rem', color: '#fff', lineHeight: 1.15 }}>
              {t('heroTrust')}
            </div>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.68rem', color: '#88ca53' }}>
              {PROJECTS.length}+ {t('stats_projects_label')}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .5, delay: .45 }}
          style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', justifyContent: 'center', position: 'relative', zIndex: 30 }}>
          <motion.a href="https://wa.me/2250142507750" target="_blank" rel="noreferrer"
            initial={{ boxShadow: '5px 5px 0px #050505' }}
            whileHover={{ x: -3, y: -6, rotate: -1.5, scale: 1.04, boxShadow: '8px 11px 0px #050505, 0 0 32px rgba(198,255,61,.45)' }}
            whileTap={{ x: 1, y: 1, rotate: 0, scale: .97, boxShadow: '2px 2px 0px #050505' }}
            transition={{ type: 'spring', stiffness: 400, damping: 18 }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontStyle: 'italic', fontSize: '1.05rem', textTransform: 'uppercase', letterSpacing: '-.01em', color: '#050505', background: 'linear-gradient(135deg, #c6ff3d, #88ca53)', padding: '1rem 2.1rem', borderRadius: 999, border: '3px solid #fff' }}>
            <HoverSlideText text={t('heroStartProject')} /> <ArrowRight size={16} />
          </motion.a>
          <motion.a
            href="https://wa.me/2250142507750"
            target="_blank"
            rel="noreferrer"
            initial={{ boxShadow: '5px 5px 0px #050505' }}
            whileHover={{ x: -3, y: -6, rotate: 1.5, scale: 1.04, boxShadow: '8px 11px 0px #050505, 0 0 32px rgba(198,255,61,.45)' }}
            whileTap={{ x: 1, y: 1, rotate: 0, scale: .97, boxShadow: '2px 2px 0px #050505' }}
            transition={{ type: 'spring', stiffness: 400, damping: 18 }}
            style={{ display: 'inline-flex', alignItems: 'center', fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontStyle: 'italic', fontSize: '1.05rem', textTransform: 'uppercase', letterSpacing: '-.01em', color: '#c6ff3d', background: 'transparent', border: '3px solid #c6ff3d', borderRadius: 999, padding: 'calc(1rem - 3px) calc(2.1rem - 3px)' }}>
            <HoverSlideText text={t('heroBookCall')} />
          </motion.a>
        </motion.div>

        
      </div>

      {/* Aperçu de la CIRCULAR PROJECTS GALLERY — ancrée au bas du Hero,
          indépendante du centrage du bloc titre/sous-titre/avatars/CTA
          ci-dessus : reste toujours visible en partie quelle que soit
          la hauteur de ce bloc ou du viewport. Div simple (comme
          layerMidRef) pour porter les mutations impératives parallax/
          scroll sans entrer en conflit avec l'anim Framer d'entrée,
          isolée sur le motion.div enfant. */}
      <div ref={galleryRef} style={{ position: 'absolute', left: 0, right: 0, bottom: '-78px', zIndex: 11, willChange: 'transform, opacity', transition: 'transform .1s ease-out' }}>
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .5, delay: .45 }}>
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

      <div style={{ position: 'absolute', bottom: '140px', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: .28, zIndex: 15, pointerEvents: 'none' }}>
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
const getServicesSkew = (t) => [
  { n: '01', Icon: Globe,        title: t('service_site_vitrine'),            desc: t('service_site_vitrine_desc'), price: t('pricing_from_150k'), del: '5-7 jours', img: '/images/service/creation%20de%20site%20web.webp', slug: 'site-vitrine' },
  { n: '02', Icon: Map,          title: t('service_cartes_dashboards'),        desc: t('service_cartes_dashboards_desc'), price: t('pricing_quote'), del: '7-14 jours', img: '/images/service/dasbord.webp', slug: 'cartes-dashboards' },
  { n: '03', Icon: Wrench,       title: t('service_maintenance'),              desc: t('service_maintenance_desc'), price: t('pricing_from_20000_month'), del: 'Contrat mensuel', img: '/images/service/maintenence.webp', slug: 'maintenance' },
  { n: '04', Icon: MapPin,       title: t('service_google_my_business'),       desc: t('service_google_my_business_desc'), price: t('pricing_from_10000_month'), del: '1-2 jours', img: '/images/service/fiche-google.webp', slug: 'google-my-business' },
  { n: '05', Icon: MessageCircle, title: t('service_chatbot_ia'),               desc: t('service_chatbot_ia_desc'), price: t('pricing_quote'), del: '7-14 jours', img: '/images/service/ia.webp', slug: 'chatbot-ia' },
  { n: '06', Icon: CreditCard,    title: t('service_paiement_en_ligne'),        desc: t('service_paiement_en_ligne_desc'), price: t('pricing_quote'), del: '5-10 jours', img: '/images/service/peiement.webp', slug: 'paiement-en-ligne' },
]

// ── GHOST SCROLL SHOWCASE — parallax + texte fantôme horizontal ──
// Port du pattern gemini-code-1785847388601.html (GSAP + ScrollTrigger) :
// chaque item devient un panneau plein écran avec une image de fond en
// parallax vertical (scrub) et un très grand titre en contour ("ghost",
// même traitement que les H2 du site) qui glisse à l'horizontale au
// scroll, sens alterné pair/impair. Légende en bas à gauche (numéro,
// titre lisible, tag, description, lien) pour garder l'information
// exploitable — remplace HoverImageReveal pour Prestations et Processus.
function GhostScrollShowcase({ items }) {
  const { t } = useLanguage()
  const containerRef = useRef(null)
  const panelRefs = useRef([])
  const bgRefs = useRef([])
  const ghostRefs = useRef([])
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    panelRefs.current = panelRefs.current.slice(0, items.length)
    bgRefs.current = bgRefs.current.slice(0, items.length)
    ghostRefs.current = ghostRefs.current.slice(0, items.length)

    // Chargement paresseux des images de fond : on n'assigne
    // backgroundImage qu'à l'approche du viewport (perf sur 5-7
    // panneaux plein écran d'un coup). Fichiers locaux directs (public/images/service,
    // public/images/process) — plus de tentative Cloudinary sur ces images.
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target
          const url = el.dataset.bg
          if (url) el.style.backgroundImage = `url(${url})`
          io.unobserve(el)
        }
      })
    }, { rootMargin: '600px 0px' })
    bgRefs.current.forEach((el) => el && io.observe(el))

    if (reduceMotion) return () => io.disconnect()

    const timer = setTimeout(() => ScrollTrigger.refresh(), 100)

    const ctx = gsap.context(() => {
      const panels = panelRefs.current.filter(Boolean)
      const lastIndex = panels.length - 1

      panels.forEach((panel, i) => {
        const bg = bgRefs.current[i]
        const ghost = ghostRefs.current[i]
        if (!bg || !ghost) return

        gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: panel,
            start: i === 0 ? 'top top' : 'top bottom',
            end: i === lastIndex ? 'top top' : 'bottom top',
            scrub: 0.75,
          },
        })
          .fromTo(ghost,
            { xPercent: i % 2 === 0 ? 30 : -50 },
            { xPercent: i % 2 === 0 ? -50 : 30 }, 0)
          .fromTo(bg,
            { yPercent: i === 0 ? -25 : 0 },
            { yPercent: i === lastIndex ? -25 : -50 }, 0)
      })
    }, containerRef)

    return () => {
      clearTimeout(timer)
      io.disconnect()
      ctx.revert()
    }
  }, [items, reduceMotion])

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      {items.map((item, i) => {
        const title = item.title.replace(/\n/g, ' ')
        const ghostText = (item.tag || item.title).replace(/\n/g, ' ')
        const Tag = item.href ? Link : 'div'
        const tagProps = item.href ? { href: item.href } : {}
        return (
          <Tag
            key={item.n}
            {...tagProps}
            ref={(el) => { panelRefs.current[i] = el }}
            className={item.href ? 'ghost-scroll-panel is-link' : 'ghost-scroll-panel'}
            style={{
              position: 'relative', display: 'block',
              height: '100vh', minHeight: 560, maxHeight: 1000,
              overflow: 'hidden', textDecoration: 'none',
            }}
          >
            <div
              ref={(el) => { bgRefs.current[i] = el }}
              data-bg={item.img}
              aria-hidden="true"
              className="ghost-scroll-bg"
              style={{
                position: 'absolute', top: 0, left: 0, width: '100%', height: '200%',
                backgroundSize: 'cover', backgroundPosition: 'center 18%', backgroundRepeat: 'no-repeat',
                filter: 'brightness(.38) saturate(1.1)',
                willChange: 'transform',
              }}
            />
            <div aria-hidden="true" style={{
              position: 'absolute', inset: 0, pointerEvents: 'none',
              background: 'linear-gradient(180deg, rgba(6,14,9,.2) 0%, rgba(6,14,9,.16) 42%, rgba(6,14,9,.93) 100%)',
            }} />
            <div
              ref={(el) => { ghostRefs.current[i] = el }}
              aria-hidden="true"
              style={{
                position: 'absolute', top: '26%', left: 0, zIndex: 1,
                fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontStyle: 'italic',
                textTransform: 'uppercase', whiteSpace: 'nowrap', lineHeight: 1,
                fontSize: 'clamp(4.5rem, 13vw, 11.5rem)',
                color: 'transparent', WebkitTextStroke: '1.5px rgba(198,255,61,.4)',
                willChange: 'transform', userSelect: 'none', pointerEvents: 'none',
              }}
            >
              {ghostText}
            </div>

            <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: '3.2rem 5%', zIndex: 2, pointerEvents: 'none' }}>
              <div style={{ maxWidth: 680 }}>
                <div style={{ marginBottom: '.9rem' }}>
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.78rem', fontWeight: 700, color: '#88ca53', letterSpacing: '.25em' }}>
                    {item.n} / {String(items.length).padStart(2, '0')}
                  </span>
                </div>
                <h3 style={{
                  fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontStyle: 'italic',
                  textTransform: 'uppercase', letterSpacing: '-.01em', lineHeight: .96,
                  fontSize: 'clamp(2rem, 4vw, 3.2rem)', color: '#fff', margin: '0 0 .7rem',
                }}>
                  {title}
                </h3>
                {item.desc && (
                  <p style={{
                    fontFamily: "'JetBrains Mono',monospace", fontSize: '.9rem', lineHeight: 1.65,
                    color: 'rgba(255,255,255,.66)', margin: 0, maxWidth: 520,
                  }}>
                    {item.desc}
                  </p>
                )}
                {item.href && (
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: '.5rem', marginTop: '1.3rem',
                    fontFamily: "'JetBrains Mono',monospace", fontSize: '.78rem', fontWeight: 700, color: '#88ca53',
                  }}>
                    {t('viewService')}
                    <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                      <path d="M2 12L12 2M12 2H5M12 2V9" stroke="#88ca53" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                )}
              </div>
            </div>
          </Tag>
        )
      })}
    </div>
  )
}

function ServicesPreview() {
  const T = useTheme()
  const { t } = useLanguage()
  const ref = useRef(null)
  const SERVICES_SKEW = getServicesSkew(t)

  // Tous les services — showcase scroll plein écran, chaque panneau pointe vers son service sur /services
  const GHOST_ITEMS = SERVICES_SKEW.map(s => ({
    n: s.n, title: s.title, img: s.img, tag: s.del, desc: s.desc, href: `/services#${s.slug}`,
  }))

  return (
    <section ref={ref} style={{ padding: '7rem 5%', background: T.bg, borderTop: `1px solid ${T.border}`, position: 'relative', overflow: 'hidden' }}>
      <div className="grid-bg" style={{ position: 'absolute', inset: 0, opacity: .2 }} />
      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* Header — titre sur trait rouge, contenu sur trait jaune */}
        <div style={{ marginBottom: '3rem' }}>
          <BlurReveal delay={0.1} direction="left">
            <h2 className="section-title-big" style={{ position: 'relative', textAlign: 'center', fontSize: 'clamp(3.4rem,6.5vw,5.6rem)', fontWeight: 900, fontStyle: 'italic', fontFamily: "'Barlow Condensed',sans-serif", color: T.textMain }}>
              <GhostTitle text={t('homeServicesTitle')} />
              {t('homeServicesTitle').split(' ')[0]}{' '}
              <GreenUnderline>
                <span className="text-gradient">
                  {t('homeServicesTitle').split(' ').slice(1).join(' ')}
                </span>
              </GreenUnderline>
            </h2>
          </BlurReveal>
        </div>

        {/* ── Ghost Scroll Showcase — tous les services, plein écran ── */}
        <div style={{ width: '100vw', marginLeft: 'calc(-50vw + 50%)' }}>
          <GhostScrollShowcase items={GHOST_ITEMS} />
        </div>

      </div>
    </section>
  )
}

const getWhyPanels = (t) => [
  { n: '01', title: t('process_brief'),             sub: t('process_sub_brief'),       desc: t('process_desc_brief'), img: cld('/images/process/process_akatech_01_brief.webp') },
  { n: '02', title: t('process_devis'),             sub: t('process_sub_devis'),       desc: t('process_desc_devis'), img: cld('/images/process/process_akatech_02_devis.webp') },
  { n: '03', title: t('process_acompte'),          sub: t('process_sub_acompte'),     desc: t('process_desc_acompte'), img: cld('/images/process/process_akatech_03_acompte.webp') },
  { n: '04', title: t('process_conception'),       sub: t('process_sub_conception'),  desc: t('process_desc_conception'), img: cld('/images/process/process_akatech_04_conception.webp') },
  { n: '05', title: t('process_validation'),       sub: t('process_sub_validation'),  desc: t('process_desc_validation'), img: cld('/images/process/process_akatech_05_validation.webp') },
  { n: '06', title: t('process_livraison'),        sub: t('process_sub_livraison'),   desc: t('process_desc_livraison'), img: cld('/images/process/process_akatech_06_livraison.webp') },
]

function WhyUs() {
  const T = useTheme()
  const { t } = useLanguage()
  const WHY_PANELS = getWhyPanels(t)

  const PROCESS_GHOST_ITEMS = WHY_PANELS.map(p => ({
    n: p.n,
    title: p.title.replace('\n', ' '),
    img: p.img,
    tag: p.sub,
    desc: p.desc,
  }))

  return (
    <section style={{ padding: '7rem 5%', background: T.bg, borderTop: `1px solid ${T.border}`, position: 'relative', overflow: 'hidden' }}>
      <div className="grid-bg" style={{ position: 'absolute', inset: 0, opacity: .2 }} />
      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ marginBottom: '3rem' }}>
          <BlurReveal delay={0.1}>
            <h2 className="section-title-big" style={{ position: 'relative', textAlign: 'center', fontSize: 'clamp(3.4rem,6.5vw,5.6rem)', fontWeight: 900, fontStyle: 'italic', fontFamily: "'Barlow Condensed',sans-serif", color: T.textMain }}>
              <GhostTitle text={t('processTitle').toUpperCase()} />
              {t('processTitle')}
            </h2>
          </BlurReveal>
          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.75rem', fontWeight: 700, color: '#88ca53', letterSpacing: '.35em', textTransform: 'uppercase' }}>
              {t('processLabel')}
            </span>
          </div>
        </div>

        <div style={{ width: '100vw', marginLeft: 'calc(-50vw + 50%)' }}>
          <GhostScrollShowcase items={PROCESS_GHOST_ITEMS} />
        </div>
      </div>
    </section>
  )
}

// ── TESTIMONIALS (inchangé) ───────────────────────────────────
function Testimonials() {
  const T = useTheme()
  const { t } = useLanguage()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const [idx, setIdx] = useState(0)
  const currentTestimonial = TESTIMONIALS[idx]

  useEffect(() => {
    const timer = setInterval(() => setIdx(i => (i + 1) % TESTIMONIALS.length), 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section ref={ref} style={{ padding: '7rem 5%', background: T.bgAlt, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle,rgba(136,202,83,.05),transparent 65%)', pointerEvents: 'none' }} />

      {/* Titre — colonne gauche alignée avec tous les autres titres (maxWidth 1200) */}
      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <BlurReveal delay={0.1}>
            <h2 className="section-title-big" style={{ position: 'relative', textAlign: 'center', fontSize: 'clamp(3.4rem,6.5vw,5.6rem)', fontWeight: 900, fontStyle: 'italic', fontFamily: "'Barlow Condensed',sans-serif", color: T.textMain }}>
              <GhostTitle text={t('homeTestimonialsUpper')} />
              {t('testimonials_title').split(' ').slice(0, -1).join(' ')} <GreenUnderline><span className="text-gradient">{t('testimonials_title').split(' ').slice(-1)[0]}</span></GreenUnderline>
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
              "{currentTestimonial.text}"
            </blockquote>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
              <div style={{ width: 52, height: 52, borderRadius: '50%', overflow: 'hidden', border: '2px solid rgba(136,202,83,.35)' }}>
                <LazyImg src={currentTestimonial.img} alt={currentTestimonial.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  placeholder={<div style={{ width: 52, height: 52, background: 'rgba(136,202,83,.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#88ca53', fontFamily: "'JetBrains Mono',monospace", fontWeight: 700 }}>{currentTestimonial.name[0]}</div>} />
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: 700, color: T.textMain, fontFamily: "'JetBrains Mono',monospace", fontSize: '.9rem' }}>{currentTestimonial.name}</div>
                <div style={{ color: T.textSub, fontSize: '.78rem', fontFamily: "'JetBrains Mono',monospace" }}>{currentTestimonial.role}</div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
        </BlurReveal>
      </div>
    </section>
  )
}

const getDomaines = (t) => [
  {
    n: '01', Icon: Monitor,
    title: t('domaines_site_vitrine'),
    desc:  t('domaines_site_vitrine_desc'),
    tag:   'Site Vitrine',
    img:   '/images/ce%20que%20nous%20concevons/types_sites_01_creation.webp',
  },
  {
    n: '02', Icon: ShoppingBag,
    title: t('domaines_ecommerce'),
    desc:  t('domaines_ecommerce_desc'),
    tag:   'E-Commerce',
    img:   '/images/ce%20que%20nous%20concevons/types_sites_02_ecommerce.webp',
  },
  {
    n: '03', Icon: Calendar,
    title: t('domaines_reservation'),
    desc:  t('domaines_reservation_desc'),
    tag:   'Réservation',
    img:   '/images/ce%20que%20nous%20concevons/types_sites_03_reservation.webp',
  },
  {
    n: '04', Icon: Layers,
    title: t('domaines_plateforme'),
    desc:  t('domaines_plateforme_desc'),
    tag:   'Plateforme',
    img:   '/images/ce%20que%20nous%20concevons/types_sites_04_plateformes.webp',
  },
  {
    n: '05', Icon: Receipt,
    title: t('domaines_facturation'),
    desc:  t('domaines_facturation_desc'),
    tag:   'Facturation',
    img:   '/images/ce%20que%20nous%20concevons/types_sites_05_gestion.webp',
  },
  {
    n: '06', Icon: Cog,
    title: t('domaines_applications'),
    desc:  t('domaines_applications_desc'),
    tag:   'Outil métier',
    img:   '/images/ce%20que%20nous%20concevons/types_sites_06_applications.webp',
  },
  {
    n: '07', Icon: Calculator,
    title: t('domaines_pos'),
    desc:  t('domaines_pos_desc'),
    tag:   'Bientôt',
    img:   '/images/ce%20que%20nous%20concevons/types_sites_07_pos.webp',
  },
]

// Bascule Cloudinary — DOMAINES uniquement ici : SERVICES_SKEW et WHY_PANELS
// gèrent leur propre conversion dans GhostScrollShowcase (avec repli sur le
// fichier local si Cloudinary ne répond pas), donc on ne les mute plus en
// place ici pour ne pas perdre l'accès au chemin local d'origine.
const DOMAINES_CLOUD = [
  { img: '/images/ce%20que%20nous%20concevons/types_sites_01_creation.webp' },
  { img: '/images/ce%20que%20nous%20concevons/types_sites_02_ecommerce.webp' },
  { img: '/images/ce%20que%20nous%20concevons/types_sites_03_reservation.webp' },
  { img: '/images/ce%20que%20nous%20concevons/types_sites_04_plateformes.webp' },
  { img: '/images/ce%20que%20nous%20concevons/types_sites_05_gestion.webp' },
  { img: '/images/ce%20que%20nous%20concevons/types_sites_06_applications.webp' },
  { img: '/images/ce%20que%20nous%20concevons/types_sites_07_pos.webp' },
]
for (const item of DOMAINES_CLOUD) {
  if (item.img && typeof item.img === 'string' && item.img.startsWith('/images/')) {
    item.img = cld(item.img)
  }
}

function DomainesSection() {
  const T = useTheme()
  const { t } = useLanguage()
  const DOMAINES = getDomaines(t)

  const DOMAINES_GHOST_ITEMS = DOMAINES.map(d => ({
    n: d.n,
    title: d.title,
    img: d.img,
    tag: d.tag,
    desc: d.desc,
  }))

  return (
    <section style={{ padding: '7rem 5%', background: T.bgAlt, borderTop: `1px solid ${T.border}`, position: 'relative', overflow: 'hidden' }}>
      <div className="grid-bg" style={{ position: 'absolute', inset: 0, opacity: .2 }} />
      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ marginBottom: '3rem' }}>
          <BlurReveal delay={0.12}>
            <h2 className="section-title-big" style={{ position: 'relative', textAlign: 'center', fontSize: 'clamp(3.4rem,6.5vw,5.6rem)', fontWeight: 900, fontStyle: 'italic', fontFamily: "'Barlow Condensed',sans-serif", color: T.textMain }}>
              <GhostTitle text={t('domainesTitle').toUpperCase()} />
              {t('domainesTitle')}
            </h2>
          </BlurReveal>
          <p style={{ maxWidth: 680, margin: '1.2rem auto 0', color: T.textSub, fontFamily: "'JetBrains Mono',monospace", fontSize: '.95rem', lineHeight: 1.7, textAlign: 'center' }}>
            {t('domainesIntro')}
          </p>
        </div>

        <div style={{ width: '100vw', marginLeft: 'calc(-50vw + 50%)' }}>
          <GhostScrollShowcase items={DOMAINES_GHOST_ITEMS} />
        </div>

        <div style={{ marginTop: '4rem', textAlign: 'center' }}>
          <p style={{ marginBottom: '1.2rem', color: T.textMuted, fontFamily: "'JetBrains Mono',monospace", fontSize: '.88rem' }}>
            {t('domainesCta')}
          </p>
          <a href="https://wa.me/2250142507750" target="_blank" rel="noreferrer" className="btn-raised">
            <HoverSlideText text={t('discussProject')} /> <ArrowRight size={14} />
          </a>
        </div>
      </div>
    </section>
  )
}

// ── NOS DERNIÈRES RÉALISATIONS — galerie horizontale auto-scroll ──
function ArchiveTunnelSection() {
  const T = useTheme()
  const { t } = useLanguage()
  const [hoveredId, setHoveredId] = useState(null)
  // 7 projets les plus récents (Karnet, ProTech POS, Anyama Proxy,
  // R3NS3IGN3M3NT ajoutés — remplace l'ancienne sélection figée).
  const TUNNEL_ITEMS = PROJECTS.filter(p => p.id >= 18 && p.id <= 24)
  const LOOP_ITEMS = [...TUNNEL_ITEMS, ...TUNNEL_ITEMS]

  // Défilement — même mécanique que RecentProjects dans Appdesktop.jsx
  // (portfolio perso) : scroll réel (scrollLeft + rAF sur piste dupliquée
  // x2), pas une animation CSS — ça permet les boutons prev/next ci-dessous
  // et une vraie pause au survol/clic, au lieu d'un défilement figé.
  const trackWrapRef = useRef(null)
  const pausedRef = useRef(false)
  const nudgeTimerRef = useRef(null)

  useEffect(() => {
    const wrap = trackWrapRef.current
    if (!wrap) return
    const SPEED = 1.2 // px / frame (~72px/s à 60fps)
    let raf
    const step = () => {
      if (!pausedRef.current) {
        wrap.scrollLeft += SPEED
        const half = wrap.scrollWidth / 2
        if (wrap.scrollLeft >= half) wrap.scrollLeft -= half
      }
      raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [])

  const pause = () => { pausedRef.current = true }
  const resume = () => { pausedRef.current = false }
  const nudge = (dir) => {
    const wrap = trackWrapRef.current
    if (!wrap) return
    pause()
    wrap.scrollBy({ left: dir * wrap.clientWidth * 0.7, behavior: 'smooth' })
    window.clearTimeout(nudgeTimerRef.current)
    nudgeTimerRef.current = window.setTimeout(resume, 2200)
  }

  return (
    <section style={{ padding: '5rem 0 6rem', background: T.bg }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 5%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.4rem', textAlign: 'center' }}>
        <h2 className="section-title-big" style={{ position: 'relative', textAlign: 'center', fontSize: 'clamp(3.4rem,6.5vw,5.6rem)', fontWeight: 900, fontStyle: 'italic', fontFamily: "'Barlow Condensed',sans-serif", color: T.textMain, margin: 0 }}>
          <GhostTitle text={t('projectsTitle').toUpperCase()} />
          {t('projectsTitle')}
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link href="/projects" className="btn-ghost" style={{ flexShrink: 0, display: 'inline-flex', alignItems: 'center', gap: '.4rem' }}>
            <HoverSlideText text={t('viewAllProjects')} /> <ArrowRight size={15} />
          </Link>
          <div style={{ display: 'flex', gap: '.6rem' }}>
            <button type="button" onClick={() => nudge(-1)} aria-label="Précédent"
              style={{ width: 42, height: 42, borderRadius: '50%', border: `1px solid ${T.border}`, background: T.surface, color: T.textMain, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <ChevronLeft size={18} />
            </button>
            <button type="button" onClick={() => nudge(1)} aria-label="Suivant"
              style={{ width: 42, height: 42, borderRadius: '50%', border: `1px solid ${T.border}`, background: T.surface, color: T.textMain, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      <div
        ref={trackWrapRef}
        className="archive-track-wrap"
        style={{ marginTop: '3rem', overflowX: 'auto', overflowY: 'hidden', padding: '1rem 5%', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <style jsx>{`
          .archive-track-wrap::-webkit-scrollbar { display: none; }
        `}</style>
        <div style={{ display: 'flex', gap: '1.5rem', width: 'max-content', paddingBottom: '1rem' }}>
          {LOOP_ITEMS.map((p, i) => (
            <div key={`${p.id}-${i}`}
              onMouseEnter={() => setHoveredId(p.id)}
              onMouseLeave={() => setHoveredId(null)}
              style={{
                minWidth: 420,
                minHeight: 560,
                borderRadius: 24,
                overflow: 'hidden',
                border: '1px solid rgba(136,202,83,.25)',
                boxShadow: '0 28px 70px rgba(0,0,0,.22)',
                background: T.surface,
                position: 'relative',
                flexShrink: 0,
              }}
            >
              <div style={{ position: 'relative', width: '100%', height: 420, overflow: 'hidden' }}>
                <LazyImg src={p.img} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.28)', opacity: hoveredId === p.id ? 1 : 0, transition: 'opacity .25s ease' }} />
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: hoveredId === p.id ? 'translate(-50%, -50%)' : 'translate(-50%, -30%)', opacity: hoveredId === p.id ? 1 : 0, transition: 'opacity .25s ease, transform .25s ease', width: 'calc(100% - 40px)', display: 'flex', justifyContent: 'center' }}>
                  {p.url ? (
                    <a href={p.url} target="_blank" rel="noreferrer" className="btn-raised" style={{ width: '100%', maxWidth: 260, justifyContent: 'center' }}>
                      <HoverSlideText text={t('project_view')} />
                      <ArrowRight size={16} />
                    </a>
                  ) : (
                    <div style={{ width: '100%', maxWidth: 260, textAlign: 'center', padding: '.95rem 1rem', borderRadius: 999, border: '2px solid #050505', boxShadow: '4px 4px 0px #050505', background: 'rgba(255,255,255,.12)', color: '#fff', fontFamily: "'JetBrains Mono',monospace", fontSize: '.79rem' }}>
                      {t('comingSoon')}
                    </div>
                  )}
                </div>
              </div>
              <div style={{ padding: '1rem 1.1rem 1.2rem', display: 'flex', flexDirection: 'column', gap: '.25rem', background: T.surface }}>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.78rem', fontWeight: 700, color: T.textMain, letterSpacing: '-.01em' }}>
                  {p.title}
                </div>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.62rem', color: '#88ca53', textTransform: 'uppercase', letterSpacing: '.08em' }}>
                  {p.type}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── STATS — chiffres géants éditoriaux, quinconce (ref web_design_result) ──
const HOME_STATS = [
  { target: PROJECTS.length,  suffix: '',  label: 'stats_projects_label',                  sub: 'stats_sub_concept', col: 1, row: 1 },
  { target: 99,  suffix: '%', label: 'stats_clients_label',              sub: 'stats_sub_delivery',    col: 3, row: 1 },
  { target: 10,  suffix: '+', label: 'stats_support_label',             sub: 'stats_sub_market',   col: 5, row: 1 },
  { target: 3,   suffix: '+', label: 'stats_experience_label',             sub: 'stats_sub_web',      col: 2, row: 2 },
]

function StatsSection() {
  const T = useTheme()
  const { t } = useLanguage()
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
                {t(s.label)}
              </div>

              {/* Sous-label */}
              <div style={{
                fontFamily: "'JetBrains Mono',monospace",
                fontSize: '.7rem',
                color: T.textMuted,
                letterSpacing: '.02em',
              }}>
                {t(s.sub)}
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
  const { t, language } = useLanguage()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const [tab, setTab] = useState('vitrine')
  const localized = getLocalizedData(language)
  const d = localized.PRICING[tab]
  const PRICING_LEAD_GREEN = new Set(['claires,', 'structures', 'freelances', 'choisissez.'])

  return (
    <section id="pricing-section" ref={ref} style={{ padding: '6rem 5% 7rem', background: T.bg, position: 'relative', overflow: 'hidden' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <BlurReveal>
            <h2 className="section-title-big" style={{ position: 'relative', textAlign: 'center', fontSize: 'clamp(3.4rem,6.5vw,5.6rem)', fontWeight: 900, fontStyle: 'italic', fontFamily: "'Barlow Condensed',sans-serif", marginBottom: '.6rem', color: T.textMain }}>
              <GhostTitle text={t('chooseSolution').toUpperCase()} />
              {t('chooseSolution')}
            </h2>
          </BlurReveal>
          <BlurReveal delay={0.12}>
            <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 'clamp(1.6rem,3.2vw,2.6rem)', fontWeight: 700, lineHeight: 1.32, color: T.textSub, paddingLeft: 'var(--body-indent)', paddingRight: 'var(--body-indent)' }}>
              {t('pricingLead').split(' ').map((word, i) => (
                <span key={i} style={{ color: PRICING_LEAD_GREEN.has(word) ? '#88ca53' : 'inherit' }}>
                  {word}{' '}
                </span>
              ))}
            </p>
          </BlurReveal>
        </div>

        {/* Tabs */}
        <BlurReveal delay={0.15} style={{ display: 'flex', justifyContent: 'center', gap: '.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          {Object.entries(localized.PRICING).map(([k, v]) => (
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
                        <Zap size={10} />{t('pricing_popular')}
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
                        ? <a href={`https://wa.me/2250142507750?text=${wa}`} target="_blank" rel="noreferrer" className="btn-raised" style={{ width: '100%', justifyContent: 'center', display: 'flex', marginTop: 'auto' }}><HoverSlideText text={t('pricing_order')} /></a>
                        : <a href={`https://wa.me/2250142507750?text=${wa}`} target="_blank" rel="noreferrer" className="btn-ghost" style={{ width: '100%', justifyContent: 'center', display: 'flex', marginTop: 'auto' }}><HoverSlideText text={t('pricing_order')} /></a>
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
                  <Clock size={12} /> {t('pricing_urgency')}
                </span>
                {' '}{t('pricing_urgency_text')}
              </p>
            </div>
            <a href="https://wa.me/2250142507750?text=Bonjour+AKATech,+je+veux+réserver+mon+projet+!" target="_blank" rel="noreferrer"
              className="btn-raised" style={{ padding: '.55rem 1.2rem', fontSize: '.78rem', flexShrink: 0, whiteSpace: 'nowrap' }}>
              <HoverSlideText text={t('pricing_order')} />
            </a>
          </div>
        </BlurReveal>
      </div>
    </section>
  )
}

function FAQSectionHome() {
  const T = useTheme()
  const { t, language } = useLanguage()
  const localized = getLocalizedData(language)
  const [open, setOpen] = useState(null)
  return (
    <section style={{ padding: '7rem 5%', background: T.bg, position: 'relative', overflow: 'hidden' }}>
      <div className="grid-bg" style={{ position: 'absolute', inset: 0, opacity: .15 }} />
      <div style={{ maxWidth: 1200, margin: '0 auto 3.5rem', position: 'relative', zIndex: 1 }}>
        <BlurReveal delay={0.1}>
          <h2 className="section-title-big" style={{ position: 'relative', textAlign: 'center', fontSize: 'clamp(3.4rem,6.5vw,5.6rem)', fontWeight: 900, fontStyle: 'italic', fontFamily: "'Barlow Condensed',sans-serif", color: T.textMain, letterSpacing: '-.03em' }}>
            <GhostTitle text={t('faqUpper')} />
            {t('faqTitle')}
          </h2>
        </BlurReveal>
      </div>
      <div style={{ maxWidth: 800, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '.75rem' }}>
          {localized.FAQ_ITEMS.slice(0, 6).map(({ q, a }, i) => (
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
  const { t } = useLanguage()
  const sectionRef = useRef(null)
  return (
    <section ref={sectionRef} style={{ padding: '5rem 5%', background: T.bg, position: 'relative', overflow: 'hidden' }}>
      <div className="grid-bg" style={{ position: 'absolute', inset: 0, opacity: .16 }} />
      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ marginBottom: '2.5rem' }}>
          <BlurReveal>
            <h2 className="section-title-big" style={{ position: 'relative', textAlign: 'center', fontSize: 'clamp(3.4rem,6.5vw,5.6rem)', fontWeight: 900, fontStyle: 'italic', fontFamily: "'Barlow Condensed',sans-serif", color: T.textMain, letterSpacing: '-.03em' }}>
              <GhostTitle text={t('geoUpper')} />
              {t('geoTitle')}
            </h2>
          </BlurReveal>
          <WordRevealP
            sectionRef={sectionRef}
            text={t('geoLead')}
            greenWords={['Abidjan', 'remote', 'West Africa', 'diaspora', 'Abiyán', 'Afri', 'occidental', 'diáspora']}
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

const FORM_PANEL_W = 680

function ProjectFormHome() {
  const T = useTheme()
  const { t } = useLanguage()
  const ref = useRef(null)
  const sectionRef = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const [form, setForm] = useState({ name: '', email: '', phone: '', service: '', message: '' })
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const inputStyle = { width: '100%', padding: '.6rem 0', background: T.light ? 'transparent' : 'rgba(10,16,12,0.92)', border: 'none', borderBottom: `1px solid ${T.border}`, borderRadius: 0, color: T.textMain, fontFamily: "'JetBrains Mono',monospace", fontSize: '1rem', outline: 'none', transition: 'border-color .25s', boxSizing: 'border-box', colorScheme: T.light ? 'light' : 'dark', WebkitAppearance: 'none', appearance: 'none' }
  const focusOn = e => { e.target.style.borderBottomColor = '#88ca53' }
  const focusOff = e => { e.target.style.borderBottomColor = T.border }

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.message) { setError(t('formRequired')); return }
    setSending(true)
    setError('')
    try {
      const res = await fetch('/api/contact/', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, projectType: form.service }) })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || t('formErrorGeneric'))
      setSent(true)
    } catch (err) {
      setError(err.message || t('formErrorGeneric'))
    } finally { setSending(false) }
  }

  return (
    <section ref={el => { ref.current = el; sectionRef.current = el }} style={{ padding: 'clamp(2rem,4vw,3rem) 5% clamp(3rem,7vw,6rem)', background: T.bgAlt }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <BlurReveal style={{ marginBottom: '2rem' }}>
          <h2 className="section-title-big" style={{ position: 'relative', textAlign: 'center', fontSize: 'clamp(3.4rem,6.5vw,5.6rem)', fontWeight: 900, fontStyle: 'italic', fontFamily: "'Barlow Condensed',sans-serif", color: T.textMain, letterSpacing: '-.03em', marginBottom: '.5rem' }}>
            <GhostTitle text={t('formUpper')} />
            {t('formTitle')}
          </h2>
        </BlurReveal>
        <WordRevealP sectionRef={sectionRef} text={t('formLead')} greenWords={['form', 'email', '24h', 'free quote', 'formulario', '24 horas', 'presupuesto'] } extraStyle={{ color: T.textSub, marginBottom: '2.5rem' }} />

        <BlurReveal delay={0.15}>
          <div style={{ maxWidth: FORM_PANEL_W, margin: '0 auto', background: T.card, border: `1px solid ${T.border}`, borderRadius: 22, padding: '2rem', boxSizing: 'border-box' }}>
            <AnimatePresence mode="wait">
              {sent ? (
                <motion.div key="success" initial={{ opacity: 0, scale: .9 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 18 }} style={{ width: 64, height: 64, borderRadius: '50%', border: '1.5px solid rgba(136,202,83,.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                    <Check size={30} style={{ color: '#88ca53' }} />
                  </motion.div>
                  <h3 style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, fontSize: '1.3rem', color: T.textMain, marginBottom: '.8rem' }}>{t('messageSent')}</h3>
                  <p style={{ color: T.textSub, fontSize: '.88rem', lineHeight: 1.7 }}>{t('formSuccess')}</p>
                  <button type="button" onClick={() => { setSent(false); setError(''); setForm({ name: '', email: '', phone: '', service: '', message: '' }) }} style={{ marginTop: '1.6rem', background: 'transparent', border: `1px solid ${T.border}`, borderRadius: 999, padding: '.55rem 1.3rem', color: T.textSub, fontFamily: "'JetBrains Mono',monospace", fontSize: '.78rem', cursor: 'pointer' }}>{t('sendAnother')}</button>
                </motion.div>
              ) : (
                <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <h3 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontStyle: 'italic', fontWeight: 900, fontSize: '1.4rem', color: T.textMain, marginBottom: '1.4rem' }}>{t('writeUs')}</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(220px,100%),1fr))', gap: '1.4rem', marginBottom: '1.4rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '.68rem', color: T.textMuted, marginBottom: '.5rem', fontFamily: "'JetBrains Mono',monospace", letterSpacing: '.1em', textTransform: 'uppercase' }}>{t('yourName')}</label>
                      <input style={inputStyle} placeholder="Elvis Aka" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} onFocus={focusOn} onBlur={focusOff} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '.68rem', color: T.textMuted, marginBottom: '.5rem', fontFamily: "'JetBrains Mono',monospace", letterSpacing: '.1em', textTransform: 'uppercase' }}>{t('emailLabel')}</label>
                      <input type="email" style={inputStyle} placeholder="vous@email.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} onFocus={focusOn} onBlur={focusOff} />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(220px,100%),1fr))', gap: '1.4rem', marginBottom: '1.4rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '.68rem', color: T.textMuted, marginBottom: '.5rem', fontFamily: "'JetBrains Mono',monospace", letterSpacing: '.1em', textTransform: 'uppercase' }}>{t('formPhoneLabel')}</label>
                      <input style={inputStyle} placeholder="+225 07 XX XX XX" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} onFocus={focusOn} onBlur={focusOff} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '.68rem', color: T.textMuted, marginBottom: '.5rem', fontFamily: "'JetBrains Mono',monospace", letterSpacing: '.1em', textTransform: 'uppercase' }}>{t('formProjectTypeLabel')}</label>
                      <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.service} onChange={e => setForm(f => ({ ...f, service: e.target.value }))} onFocus={focusOn} onBlur={focusOff}>
                        <option value="">{t('chooseLabel')}</option>
                        <option value="site-vitrine">{t('service_site_vitrine')}</option>
                        <option value="e-commerce">{t('service_ecommerce')}</option>
                        <option value="application-web">{t('service_application_web')}</option>
                        <option value="cartes-dashboards">{t('service_cartes_dashboards')}</option>
                        <option value="chatbot-ia">{t('service_chatbot_ia')}</option>
                        <option value="paiement-en-ligne">{t('service_paiement_en_ligne')}</option>
                        <option value="google-my-business">{t('service_google_my_business')}</option>
                        <option value="maintenance">{t('service_maintenance')}</option>
                        <option value="autre">{t('service_other')}</option>
                      </select>
                    </div>
                  </div>
                  <div style={{ marginBottom: '1.6rem' }}>
                    <label style={{ display: 'block', fontSize: '.68rem', color: T.textMuted, marginBottom: '.5rem', fontFamily: "'JetBrains Mono',monospace", letterSpacing: '.1em', textTransform: 'uppercase' }}>{t('formNeedLabel')}</label>
                    <input style={inputStyle} placeholder="Ex: Boutique en ligne avec paiement Mobile Money"
                      value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} onFocus={focusOn} onBlur={focusOff} />
                  </div>
                  {error && <p style={{ textAlign: 'left', fontSize: '.78rem', color: '#ff6b6b', marginBottom: '.8rem' }}>{error}</p>}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                    <p style={{ textAlign: 'left', fontSize: '.72rem', color: T.textMuted, display: 'flex', alignItems: 'center', gap: '.35rem', margin: 0 }}>
                      <Lock size={11} style={{ color: T.textMuted, flexShrink: 0 }} /> Vos données restent confidentielles. Aucun spam.
                    </p>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={sending}
                      className="btn-raised"
                      style={{
                        cursor: sending ? 'default' : 'pointer',
                        whiteSpace: 'nowrap', flexShrink: 0, opacity: sending ? .7 : 1,
                      }}
                    >
                      {sending ? <span style={{ width: 16, height: 16, border: '2px solid rgba(5,5,5,.3)', borderTopColor: '#050505', borderRadius: '50%', animation: 'spin .6s linear infinite', display: 'inline-block' }} /> : <Send size={16} />}
                      <HoverSlideText text={t('receiveQuote')} />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </BlurReveal>
      </div>
    </section>
  )
}

export default function HomePageDesktop() {
  return (
    <div style={{ paddingTop: 0 }}>
      <Hero />
      <ArchiveTunnelSection />
      <StatsSection />
      <DomainesSection />
      <TrustStacksMarquee />
      <ServicesPreview />
      <PricingCallout />
      <WhyUs />

      <FAQSectionHome />
      <ConversionMarquee />
      <Testimonials />

      <GeoSectionHome />
      <ProjectFormHome />

      <section style={{ position: 'relative', width: '100%', aspectRatio: '2048 / 768', overflow: 'hidden' }}>
        <LazyImg
          src={cld('/images/cta-home-desktop.webp')}
          alt="Comme eux, donnez à votre activité la présence digitale qu'elle mérite."
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <motion.a
          href="https://wa.me/2250142507750" target="_blank" rel="noreferrer"
          aria-label="Rejoindre nos clients"
          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          transition={{ duration: .2, ease: [.22, 1, .36, 1] }}
          style={{
            position: 'absolute', left: '10.01%', top: '61.98%', width: '26.42%', height: '16.41%',
            borderRadius: 999, cursor: 'pointer',
          }}
        />
      </section>
    </div>
  )
}
