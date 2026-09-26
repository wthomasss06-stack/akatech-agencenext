'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, useInView, AnimatePresence, useReducedMotion } from 'framer-motion'
import Link from 'next/link'
import { cld } from '@/lib/cloudinary'
import {
  ArrowRight, Star, ExternalLink, ChevronDown,
  Globe, ShoppingCart, Cpu, Server, Palette, Wrench, Map, MapPin,
  Monitor, ShoppingBag, LayoutDashboard, Cog, Image,
  Calendar, Layers, Receipt, Calculator, MessageCircle, CreditCard,
  Zap, Timer, Check, HelpCircle, Send, Lock,
} from 'lucide-react'
import { useTheme } from '@/lib/theme'
import { useLanguage } from '@/lib/language'
import { GhostTitle, AnimatedCounter, LazyImg, GreenUnderline, HoverSlideText } from '@/components/ui/index'
import { trackAction } from '@/lib/track-action'
import TrustStacksMarquee from '@/components/ui/TrustStacksMarquee'
import ConversionMarquee from '@/components/ui/ConversionMarquee'
import { PROJECTS, TESTIMONIALS, FAQ_ITEMS, PRICING } from '@/lib/data'
import { AvatarGroup, Avatar, AvatarImage, AvatarFallback, AvatarGroupTooltip, AvatarGroupTooltipArrow } from '@/components/ui/AvatarGroup'

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
function CircularProjectsGallery({ items, draggable = false, cardW = 220, intervalMs = 2800 }) {
  const T = useTheme()
  // 6 projets les plus récents (Karnet, ProTech POS, Anyama Proxy,
  // R3NS3IGN3M3NT ajoutés — remplace l'ancienne sélection figée).
  const DEFAULT_ITEMS = PROJECTS.filter(p => p.id >= 19 && p.id <= 24)
  const GALLERY_ITEMS = items || DEFAULT_ITEMS
  const [active, setActive] = useState(0)
  const pausedRef = useRef(false)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    if (reduceMotion) return // pas de rotation auto si l'utilisateur préfère moins de mouvement
    const id = setInterval(() => {
      setActive(a => (a + 1) % GALLERY_ITEMS.length)
    }, intervalMs)
    return () => clearInterval(id)
  }, [GALLERY_ITEMS.length, intervalMs, reduceMotion])

  const order = GALLERY_ITEMS.map((_, i) => {
    let rel = i - active
    if (rel > GALLERY_ITEMS.length / 2) rel -= GALLERY_ITEMS.length
    if (rel < -GALLERY_ITEMS.length / 2) rel += GALLERY_ITEMS.length
    return rel
  })

  // Dimensions mobiles : cartes plus petites, ratio natif 1600×815
  const CARD_W = cardW
  const CARD_H = Math.round(CARD_W * (815 / 1600))
  const STEP   = CARD_W * 0.68

  // Glissement manuel (mobile) — une seule poignée invisible plutôt que
  // de rendre chaque carte draggable (elles ont déjà leur propre anim
  // x/rotate scriptée par `active`, les deux entreraient en conflit).
  // Relâchement : offset ou vitesse suffisants → avance/recule d'une carte,
  // sinon ça "rebondit" élastiquement (dragElastic) et reprend l'auto-scroll.
  const onDragEnd = (e, info) => {
    pausedRef.current = false
    const { offset, velocity } = info
    if (offset.x < -40 || velocity.x < -400) {
      setActive(a => (a + 1) % GALLERY_ITEMS.length)
    } else if (offset.x > 40 || velocity.x > 400) {
      setActive(a => (a - 1 + GALLERY_ITEMS.length) % GALLERY_ITEMS.length)
    }
  }

  return (
    <div style={{ position: 'relative', height: CARD_H + 48, width: '100%', maxWidth: '100vw', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', perspective: 900, marginTop: '1.2rem' }}>
      {draggable && (
        <motion.div
          drag="x"
          dragElastic={0.5}
          dragConstraints={{ left: 0, right: 0 }}
          onDragStart={() => { pausedRef.current = true }}
          onDragEnd={onDragEnd}
          style={{ position: 'absolute', inset: 0, zIndex: 20, touchAction: 'pan-y' }}
        />
      )}
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
            {draggable && isActive && p.url && (
              <a href={p.url} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()}
                style={{
                  position: 'absolute', top: '.5rem', right: '.5rem', zIndex: 21,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: 26, height: 26, borderRadius: '50%',
                  background: 'rgba(136,202,83,.92)', color: '#04140a',
                }}>
                <ExternalLink size={12} />
              </a>
            )}
          </motion.div>
        )
      })}
    </div>
  )
}

const getHeroSlogans = (t) => [
  { before: t('homeSlogan1'), highlight: t('homeHighlight1') },
  { before: t('homeSlogan2'), highlight: t('homeHighlight2') },
  { before: t('homeSlogan3'), highlight: t('homeHighlight3') },
]

// ── Slogan Hero — cycle auto entre 3 accroches, même traitement
// Neo-Brutalism (bloc vert + box-shadow blanc dur) sur le mot-clé ──
function HeroSloganCycle() {
  const { t } = useLanguage()
  const [index, setIndex] = useState(0)
  const HERO_SLOGANS = getHeroSlogans(t)
  useEffect(() => {
    const id = setInterval(() => setIndex(i => (i + 1) % HERO_SLOGANS.length), 3500)
    return () => clearInterval(id)
  }, [HERO_SLOGANS.length])
  const before = HERO_SLOGANS[index].before
  const highlight = HERO_SLOGANS[index].highlight

  return (
    <div style={{ marginBottom: '2.2rem', maxWidth: 800, marginLeft: 'auto', marginRight: 'auto', minHeight: 'clamp(4.5rem,11vw,7.6rem)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <AnimatePresence mode="wait">
        <motion.p key={index}
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
          transition={{ duration: .45, ease: 'easeOut' }}
          style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontStyle: 'italic', fontSize: 'clamp(1.9rem,4.4vw,3.2rem)', lineHeight: 1.18, letterSpacing: '-.02em', textTransform: 'uppercase', color: '#fff', textShadow: '4px 4px 0px rgba(0,0,0,.55)', textAlign: 'center', margin: 0 }}>
          {before}
          <span style={{ display: 'inline-block', background: 'linear-gradient(135deg, var(--pop-lime), var(--g1))', color: '#050505', padding: '.1em .35em', border: '3px solid #050505', borderRadius: '.18em', boxShadow: '5px 5px 0px #fff, 0 0 32px var(--pop-lime-glow)', textShadow: 'none', transform: 'rotate(-2deg)' }}>
            {highlight}
          </span>
        </motion.p>
      </AnimatePresence>
    </div>
  )
}

// ── HERO (identique au desktop — pin scroll 200vh + parallaxe souris) ──
function Hero() {
  const T = useTheme()
  const { t } = useLanguage()
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
    // Pendant le scroll, le Hero reste pinné (cf. wrapper 200dvh ci-dessous) :
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
        // visualViewport reflète la hauteur réelle visible (barre d'adresse
        // mobile qui show/hide) — plus stable que innerHeight seul, qui peut
        // désynchroniser le calcul du pin et faire "sauter" le scroll.
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
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => { window.removeEventListener('scroll', onScroll); if (raf) cancelAnimationFrame(raf) }
  }, [])

  return (
    <div ref={wrapRef} style={{ position: 'relative', height: '200dvh' }}>
    <section id="home-hero" style={{ height: '100dvh', maxHeight: '100dvh', width: '100%', position: 'sticky', top: 0, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#030806' }}>

      <div ref={layerBgRef} style={{ position: 'absolute', zIndex: 1, width: '115%', height: '115%', willChange: 'transform, filter', transition: 'transform .1s ease-out', pointerEvents: 'none' }}>
        <img src="/images/hero/home-mobile-bg.webp" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
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

        <motion.p
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .5, delay: .35 }}
          style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.92rem', color: 'rgba(255,255,255,.68)', maxWidth: 420, margin: '0 auto 1.4rem', lineHeight: 1.55 }}>
          {t('homeHeroText')}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .5, delay: .4 }}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '.7rem', marginBottom: '1.6rem' }}>
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
            <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontStyle: 'italic', fontWeight: 900, fontSize: '.78rem', color: '#fff', lineHeight: 1.15 }}>
              {t('heroTrust')}
            </div>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.63rem', color: '#88ca53' }}>
              {PROJECTS.length}+ {t('stats_projects_label')}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .5, delay: .45 }}
          style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '-1.6rem', justifyContent: 'center', position: 'relative', zIndex: 30 }}>
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

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .6, delay: .55 }} style={{ paddingTop: '2.8rem' }}>
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
        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.6rem', letterSpacing: '.18em', textTransform: 'uppercase', marginBottom: '.4rem', color: '#fff' }}>{t('pricing_scroll')}</span>
        <motion.div animate={{ scaleY: [1, 1.4, 1], opacity: [.5, 1, .5] }} transition={{ duration: 1.6, repeat: Infinity }}
          style={{ width: 1, height: 36, background: 'linear-gradient(to bottom, rgba(255,255,255,.8), transparent)' }} />
      </div>

    </section>
    </div>
  )
}

// ── DATA prestations — texte complet (remplace les visuels image) ──
const getServicesItems = (t) => [
  {
    n: '01', Icon: Globe, title: t('service_site_vitrine'),
    tagline: t('service_site_vitrine_tagline'),
    bullets: [
      { h: t('service_site_vitrine_b1'), d: t('service_site_vitrine_b1_d') },
      { h: t('service_site_vitrine_b2'), d: t('service_site_vitrine_b2_d') },
      { h: t('service_site_vitrine_b3'), d: t('service_site_vitrine_b3_d') },
      { h: t('service_site_vitrine_b4'), d: t('service_site_vitrine_b4_d') },
      { h: t('service_site_vitrine_b5'), d: t('service_site_vitrine_b5_d') },
      { h: t('service_site_vitrine_b6'), d: t('service_site_vitrine_b6_d') },
    ],
    price: t('pricing_from_150k'),
  },
  {
    n: '02', Icon: Map, title: t('service_cartes_dashboards'),
    tagline: t('service_cartes_dashboards_tagline'),
    bullets: [
      { h: t('service_dashboard_b1'), d: t('service_dashboard_b1_d') },
      { h: t('service_dashboard_b2'), d: t('service_dashboard_b2_d') },
      { h: t('service_dashboard_b3'), d: t('service_dashboard_b3_d') },
      { h: t('service_dashboard_b4'), d: t('service_dashboard_b4_d') },
      { h: t('service_dashboard_b5'), d: t('service_dashboard_b5_d') },
    ],
    price: t('pricing_quote'),
  },
  {
    n: '03', Icon: Wrench, title: t('service_maintenance'),
    tagline: t('service_maintenance_tagline'),
    bullets: [
      { h: t('service_maintenance_b1'), d: t('service_maintenance_b1_d') },
      { h: t('service_maintenance_b2'), d: t('service_maintenance_b2_d') },
      { h: t('service_maintenance_b3'), d: t('service_maintenance_b3_d') },
      { h: t('service_maintenance_b4'), d: t('service_maintenance_b4_d') },
      { h: t('service_maintenance_b5'), d: t('service_maintenance_b5_d') },
    ],
    price: t('pricing_from_20000_month'),
  },
  {
    n: '04', Icon: MapPin, title: t('service_google_my_business'),
    tagline: t('service_google_my_business_tagline'),
    bullets: [
      { h: t('service_gmb_b1'), d: t('service_gmb_b1_d') },
      { h: t('service_gmb_b2'), d: t('service_gmb_b2_d') },
      { h: t('service_gmb_b3'), d: t('service_gmb_b3_d') },
      { h: t('service_gmb_b4'), d: t('service_gmb_b4_d') },
      { h: t('service_gmb_b5'), d: t('service_gmb_b5_d') },
    ],
    price: t('pricing_from_10000_month'),
  },
  {
    n: '05', Icon: MessageCircle, title: t('service_chatbot_ia'),
    tagline: t('service_chatbot_ia_tagline'),
    bullets: [
      { h: t('service_chatbot_b1'), d: t('service_chatbot_b1_d') },
      { h: t('service_chatbot_b2'), d: t('service_chatbot_b2_d') },
      { h: t('service_chatbot_b3'), d: t('service_chatbot_b3_d') },
      { h: t('service_chatbot_b4'), d: t('service_chatbot_b4_d') },
      { h: t('service_chatbot_b5'), d: t('service_chatbot_b5_d') },
    ],
    price: t('pricing_quote'),
  },
  {
    n: '06', Icon: CreditCard, title: t('service_paiement_en_ligne'),
    tagline: t('service_paiement_en_ligne_tagline'),
    bullets: [
      { h: t('service_payment_b1'), d: t('service_payment_b1_d') },
      { h: t('service_payment_b2'), d: t('service_payment_b2_d') },
      { h: t('service_payment_b3'), d: t('service_payment_b3_d') },
      { h: t('service_payment_b4'), d: t('service_payment_b4_d') },
      { h: t('service_payment_b5'), d: t('service_payment_b5_d') },
    ],
    price: t('pricing_quote'),
  },
]

// ── DATA processus — texte complet (remplace les visuels image) ──
const getProcessItems = (t) => [
  { n: '01', title: t('process_brief'), badge: t('process_sub_brief'), desc: t('process_desc_brief') },
  { n: '02', title: t('process_devis'), badge: t('process_sub_devis'), desc: t('process_desc_devis') },
  { n: '03', title: t('process_acompte'), badge: t('process_sub_acompte'), desc: t('process_desc_acompte') },
  { n: '04', title: t('process_conception'), badge: t('process_sub_conception'), desc: t('process_desc_conception') },
  { n: '05', title: t('process_validation'), badge: t('process_sub_validation'), desc: t('process_desc_validation') },
  { n: '06', title: t('process_livraison'), badge: t('process_sub_livraison'), desc: t('process_desc_livraison') },
]

// ── STATS — chiffres géants éditoriaux (miroir desktop), responsive 2-col mobile ──
const getHomeStats = (t) => [
  { target: PROJECTS.length,  suffix: '',  label: 'stats_projects_label',      sub: t('stats_sub_concept') },
  { target: 99,  suffix: '%', label: 'stats_clients_label',  sub: t('stats_sub_delivery') },
  { target: 10,  suffix: '+', label: 'stats_support_label', sub: t('stats_sub_market') },
  { target: 3,   suffix: '+', label: 'stats_experience_label', sub: t('stats_sub_web') },
]

function StatsSection() {
  const T = useTheme()
  const { t } = useLanguage()
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
          {getHomeStats(t).map((s, i) => (
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
                {t(s.label)}
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

// ── ACCORDION générique — titre au clic, description en dépli ──
// Un seul panneau ouvert à la fois. `renderHeader` reçoit (item, isOpen)
// et doit remplir la ligne cliquable (le chevron est géré ici).
// `renderBody` reçoit (item) et remplit le contenu déplié.
function Accordion({ items, defaultOpen = 0, renderHeader, renderBody }) {
  const T = useTheme()
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div style={{ borderTop: `1px solid ${T.border}` }}>
      {items.map((item, i) => {
        const isOpen = open === i
        return (
          <div key={item.n || i} style={{ borderBottom: `1px solid ${T.border}` }}>
            <button
              onClick={() => setOpen(isOpen ? -1 : i)}
              aria-expanded={isOpen}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '.7rem',
                padding: '1.15rem 0',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                WebkitTapHighlightColor: 'transparent',
                color: 'inherit',
              }}
            >
              {renderHeader(item, isOpen)}
              <motion.span
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: .3, ease: [.22,1,.36,1] }}
                style={{ flexShrink: 0, display: 'flex', color: isOpen ? '#88ca53' : T.textMuted }}
              >
                <ChevronDown size={17} />
              </motion.span>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: .35, ease: [.22,1,.36,1] }}
                  style={{ overflow: 'hidden' }}
                >
                  <div style={{ paddingBottom: '1.4rem' }}>
                    {renderBody(item)}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}

// ── SERVICES PREVIEW — accordéon (icône/titre/tarif + détails au clic) ──
function ServicesPreview() {
  const T = useTheme()
  const { t } = useLanguage()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const ICON_BOX = 42

  return (
    <section ref={ref} style={{ padding: '7rem 5%', background: T.bg, position: 'relative' }}>
      <div className="grid-bg" style={{ position: 'absolute', inset: 0, opacity: .25 }} />
      <div style={{ maxWidth: 600, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 className="section-title-big" style={{ position: 'relative', textAlign: 'center', fontSize: 'clamp(2.3rem,8.5vw,3.6rem)', fontWeight: 900, fontStyle: 'italic', fontFamily: "'Barlow Condensed',sans-serif", color: T.textMain, letterSpacing: '-.03em', lineHeight: 1.15 }}>
            <GhostTitle text={t('homeServicesTitle')} />
            {t('homeServicesTitle').split(' ')[0]}<br />
            <GreenUnderline><span className="text-gradient">{t('homeServicesTitle').split(' ').slice(1).join(' ')}</span></GreenUnderline>
          </h2>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: .15 }}>
          <Accordion
            items={getServicesItems(t)}
            renderHeader={(s, isOpen) => {
              const SIcon = s.Icon
              return (
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '.85rem', minWidth: 0 }}>
                  <span style={{
                    width: ICON_BOX, height: ICON_BOX, flexShrink: 0, borderRadius: 10,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: isOpen ? 'rgba(136,202,83,.16)' : 'rgba(136,202,83,.08)',
                    border: `1px solid ${isOpen ? 'rgba(136,202,83,.45)' : 'rgba(136,202,83,.2)'}`,
                    color: '#88ca53', transition: 'background .25s, border-color .25s',
                  }}>
                    <SIcon size={18} />
                  </span>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '.5rem' }}>
                      <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.56rem', fontWeight: 700, color: 'rgba(136,202,83,.55)', letterSpacing: '.2em' }}>{s.n}</span>
                    </div>
                    <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontStyle: 'italic', fontSize: 'clamp(.82rem,3.4vw,.92rem)', color: T.textMain, letterSpacing: '-.01em', lineHeight: 1.25 }}>
                      {s.title}
                    </div>
                    <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.7rem', fontWeight: 700, color: '#88ca53', marginTop: '.15rem' }}>
                      {s.price}
                    </div>
                  </div>
                </div>
              )
            }}
            renderBody={s => (
              <div style={{ paddingLeft: ICON_BOX + 14, paddingRight: '.5rem' }}>
                <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.76rem', fontStyle: 'italic', color: T.textMuted, lineHeight: 1.6, marginBottom: '.9rem' }}>
                  {s.tagline}
                </p>
                <div style={{ marginBottom: '1.1rem' }}>
                  {s.bullets.map((b, bi) => (
                    <div key={bi} style={{ display: 'flex', gap: '.6rem', padding: '.55rem 0', borderTop: bi ? `1px solid ${T.border}` : 'none' }}>
                      <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#88ca53', marginTop: '.45rem', flexShrink: 0 }} />
                      <div>
                        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, fontSize: '.78rem', color: T.textMain, lineHeight: 1.4 }}>{b.h}</div>
                        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.7rem', color: T.textMuted, lineHeight: 1.5, marginTop: '.1rem' }}>{b.d}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <a href="https://wa.me/2250142507750" target="_blank" rel="noreferrer" className="btn-raised" style={{ fontSize: '.78rem', padding: '.7rem 1.3rem', width: '100%', justifyContent: 'center' }}>
                  <HoverSlideText text={t('service_cta')} /> <ArrowRight size={13} />
                </a>
              </div>
            )}
          />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: .35 }}
          style={{ textAlign: 'center', marginTop: '2.5rem' }}>
          <Link href="/services" className="btn-ghost" style={{ fontSize: '.9rem' }}>
            <HoverSlideText text={t('viewServices')} /> <ArrowRight size={14} />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

// ── PROCESS — accordéon (étape/titre/statut + détail au clic) ────
function Process() {
  const T = useTheme()
  const { t } = useLanguage()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section ref={ref} style={{ padding: '7rem 5%', background: T.bg }}>
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 className="section-title-big" style={{ position: 'relative', textAlign: 'center', fontSize: 'clamp(2.3rem,8.5vw,3.6rem)', fontWeight: 900, fontStyle: 'italic', fontFamily: "'Barlow Condensed',sans-serif", color: T.textMain, letterSpacing: '-.03em' }}>
            <GhostTitle text={t('processTitle').toUpperCase()} />
            {t('processTitle')}
          </h2>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: .15 }}>
          <Accordion
            items={getProcessItems(t)}
            renderHeader={(s, isOpen) => (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '.4rem', minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '.7rem' }}>
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.66rem', fontWeight: 700, color: isOpen ? '#88ca53' : 'rgba(136,202,83,.5)', letterSpacing: '.1em', flexShrink: 0 }}>
                    {s.n}
                  </span>
                  <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontStyle: 'italic', fontSize: 'clamp(.84rem,3.4vw,.94rem)', color: T.textMain, letterSpacing: '-.01em', lineHeight: 1.3 }}>
                    {s.title}
                  </span>
                </div>
                <span style={{
                  alignSelf: 'flex-start', padding: '.2rem .6rem', borderRadius: 100,
                  background: 'rgba(136,202,83,.1)', border: '1px solid rgba(136,202,83,.24)',
                  fontFamily: "'JetBrains Mono',monospace", fontSize: '.56rem', fontWeight: 700,
                  color: '#88ca53', letterSpacing: '.03em', whiteSpace: 'nowrap',
                }}>
                  {s.badge}
                </span>
              </div>
            )}
            renderBody={s => (
              <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.78rem', lineHeight: 1.75, color: T.textMuted, paddingLeft: '2.15rem', paddingRight: '.5rem' }}>
                {s.desc}
              </p>
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
  const { t } = useLanguage()
  const ref     = useRef(null)
  const inView  = useInView(ref, { once: true, margin: '-60px' })

  const ITEMS = PROJECTS.filter(p => p.id >= 18 && p.id <= 24)

  return (
    <section ref={ref} style={{ background: T.bg, position: 'relative', padding: '7rem 5% 5rem' }}>
      <div className="grid-bg" style={{ position: 'absolute', inset: 0, opacity: .18 }} />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
        <h2 className="section-title-big" style={{ position: 'relative', textAlign: 'center', fontSize: 'clamp(2.3rem,8.5vw,3.6rem)', fontWeight: 900, fontStyle: 'italic', fontFamily: "'Barlow Condensed',sans-serif", color: T.textMain, letterSpacing: '-.03em', marginBottom: '.6rem' }}>
          <GhostTitle text={t('homeProjectsUpper')} />
          {t('projects_latest_title').split(' ').slice(0, -1).join(' ')} <GreenUnderline><span className="text-gradient">{t('projects_latest_title').split(' ').slice(-1)[0]}</span></GreenUnderline>
        </h2>
        <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.75rem', color: T.textMuted, letterSpacing: '.04em' }}>
          {t('projects_hint')}
        </p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: .15 }} style={{ position: 'relative', zIndex: 1 }}>
        <CircularProjectsGallery items={ITEMS} draggable cardW={260} intervalMs={3400} />
      </motion.div>

      {/* CTA */}
      <div style={{ padding: '2.5rem 0 0', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: .3 }}>
          <Link href="/projects" className="btn-ghost" style={{ fontSize: '.88rem', padding: '.8rem 1.8rem' }}>
            <HoverSlideText text={t('viewAllProjects')} /> <ArrowRight size={13} />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

// ── TESTIMONIALS ─────────────────────────────────────────────
function Testimonials() {
  const T = useTheme()
  const { t } = useLanguage()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const [idx, setIdx] = useState(0)
  const testimonial = TESTIMONIALS[idx]

  useEffect(() => {
    const timer = setInterval(() => setIdx(i => (i + 1) % TESTIMONIALS.length), 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section ref={ref} style={{ padding: '7rem 5%', background: T.bgAlt, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle,rgba(136,202,83,.05),transparent 65%)', pointerEvents: 'none' }} />
      <div style={{ maxWidth: 900, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <h2 className="section-title-big" style={{ position: 'relative', textAlign: 'center', fontSize: 'clamp(2.3rem,8.5vw,3.6rem)', fontWeight: 900, fontStyle: 'italic', fontFamily: "'Barlow Condensed',sans-serif", color: T.textMain, letterSpacing: '-.03em' }}>
            <GhostTitle text={t('homeTestimonialsUpper')} />
            {t('testimonials_title').split(' ').slice(0, -1).join(' ')} <GreenUnderline><span className="text-gradient">{t('testimonials_title').split(' ').slice(-1)[0]}</span></GreenUnderline>
          </h2>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div key={idx} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: .4 }}
            className="sku-card" style={{ padding: '2.5rem', textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.2rem' }}>
              {[1,2,3,4,5].map(s => <Star key={s} size={18} fill="#88ca53" style={{ color: '#88ca53' }} />)}
            </div>
            <blockquote style={{ fontSize: '1.05rem', color: T.textMain, lineHeight: 1.75, fontStyle: 'italic', marginBottom: '2rem', maxWidth: 640, margin: '0 auto 2rem' }}>
              "{testimonial.text}"
            </blockquote>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
              <div style={{ width: 52, height: 52, borderRadius: '50%', overflow: 'hidden', border: '2px solid rgba(136,202,83,.35)' }}>
                <LazyImg src={testimonial.img} alt={testimonial.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  placeholder={<div style={{ width: 52, height: 52, background: 'rgba(136,202,83,.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#88ca53', fontFamily: "'JetBrains Mono',monospace", fontWeight: 700 }}>{testimonial.name[0]}</div>} />
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: 700, color: T.textMain, fontFamily: "'JetBrains Mono',monospace", fontSize: '.9rem' }}>{testimonial.name}</div>
                <div style={{ fontSize: '.72rem', color: T.textMuted, fontFamily: "'JetBrains Mono',monospace" }}>{testimonial.role}</div>
              </div>
              <span className="no-pill-mobile" style={{ marginLeft: 'auto', padding: '.3rem .8rem', borderRadius: 100, background: 'rgba(136,202,83,.12)', border: '1px solid rgba(136,202,83,.25)', color: '#88ca53', fontFamily: "'JetBrains Mono',monospace", fontSize: '.65rem', fontWeight: 600 }}>{testimonial.result}</span>
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

// ── PARAGRAPHE mot-à-mot (statique, remplace WordRevealP desktop — pas de scroll-tilt sur mobile) ──
function RevealParagraph({ text, greenWords = [], extraStyle = {}, inView }) {
  const green = new Set(greenWords)
  return (
    <motion.p initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: .1 }}
      style={{
        fontFamily: "'JetBrains Mono',monospace",
        fontSize: 'clamp(1.05rem,4vw,1.3rem)',
        fontWeight: 700,
        lineHeight: 1.42,
        margin: '.75rem 0 0',
        ...extraStyle,
      }}>
      {text.split(' ').map((word, i) => (
        <span key={i} style={{ color: green.has(word) ? '#88ca53' : 'inherit' }}>
          {word}{' '}
        </span>
      ))}
    </motion.p>
  )
}

// ── DOMAINES D'INTERVENTION — grille éditoriale statique (miroir desktop, sans hover-image souris) ──
const getDomaines = (t) => [
  { n: '01', Icon: Monitor,  title: t('domaines_site_vitrine'), tag: t('domaines_site_vitrine'), desc: t('domaines_site_vitrine_desc') },
  { n: '02', Icon: ShoppingBag, title: t('domaines_ecommerce'), tag: t('domaines_ecommerce'), desc: t('domaines_ecommerce_desc') },
  { n: '03', Icon: Calendar, title: t('domaines_reservation'), tag: t('domaines_reservation'), desc: t('domaines_reservation_desc') },
  { n: '04', Icon: Layers, title: t('domaines_plateforme'), tag: t('domaines_plateforme'), desc: t('domaines_plateforme_desc') },
  { n: '05', Icon: Receipt, title: t('domaines_facturation'), tag: t('domaines_facturation'), desc: t('domaines_facturation_desc') },
  { n: '06', Icon: Cog, title: t('domaines_applications'), tag: t('domaines_applications'), desc: t('domaines_applications_desc') },
  { n: '07', Icon: Calculator, title: t('domaines_pos'), tag: t('domaines_pos'), desc: t('domaines_pos_desc') },
]

function DomaineCard({ n, Icon, title, desc, tag, index, inView }) {
  const T = useTheme()
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: .5, delay: index * .07, ease: [.22,1,.36,1] }}
      style={{ background: T.card, padding: '1.5rem 1.4rem', position: 'relative' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '2rem', fontWeight: 900, color: T.light ? 'rgba(136,202,83,.18)' : 'rgba(136,202,83,.15)', lineHeight: 1, letterSpacing: '-.05em' }}>
          {n}
        </span>
        <span style={{ padding: '.2rem .65rem', borderRadius: 100, background: 'rgba(136,202,83,.08)', border: '1px solid rgba(136,202,83,.2)', fontFamily: "'JetBrains Mono',monospace", fontSize: '.56rem', fontWeight: 700, color: '#88ca53', letterSpacing: '.06em', textTransform: 'uppercase' }}>
          {tag}
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '.7rem', marginBottom: '.8rem' }}>
        <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(136,202,83,.1)', border: '1px solid rgba(136,202,83,.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Icon size={18} style={{ color: '#88ca53' }} />
        </div>
        <h3 style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 'clamp(.86rem,3.6vw,.95rem)', fontWeight: 800, color: T.textMain, lineHeight: 1.25, letterSpacing: '-.02em' }}>
          {title}
        </h3>
      </div>
      <p style={{ fontSize: '.8rem', color: T.textSub, lineHeight: 1.65 }}>
        {desc}
      </p>
    </motion.div>
  )
}

function DomainesSection() {
  const T = useTheme()
  const { t } = useLanguage()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  const DOMAINES = getDomaines(t)

  return (
    <section ref={ref} style={{ padding: '7rem 5%', background: T.bgAlt, position: 'relative', overflow: 'hidden' }}>
      <div style={{ maxWidth: 600, margin: '0 auto', position: 'relative', zIndex: 1 }}>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} style={{ marginBottom: '2rem' }}>
          <h2 className="section-title-big" style={{ position: 'relative', textAlign: 'center', fontSize: 'clamp(2.3rem,8.5vw,3.6rem)', fontWeight: 900, fontStyle: 'italic', fontFamily: "'Barlow Condensed',sans-serif", color: T.textMain, letterSpacing: '-.03em' }}>
            <GhostTitle text={t('domainesTitle').toUpperCase()} />
            {t('domainesTitle')}
          </h2>
          <RevealParagraph text={t('domainesIntro')} extraStyle={{ color: T.textSub }} inView={inView} />
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1px', background: T.border, borderRadius: 16, overflow: 'hidden', border: `1px solid ${T.border}` }}>
          {DOMAINES.map((domaine, i) => (
            <DomaineCard key={domaine.n} {...domaine} index={i} inView={inView} />
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: .3 }} style={{ textAlign: 'center', marginTop: '2rem' }}>
          <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.82rem', color: T.textMuted, marginBottom: '1rem' }}>
            {t('domainesCta')}
          </p>
          <a href="https://wa.me/2250142507750" target="_blank" rel="noreferrer" className="btn-raised" style={{ fontSize: '.85rem', padding: '.8rem 1.6rem' }}>
            <HoverSlideText text={t('discussProject')} /> <ArrowRight size={13} />
          </a>
        </motion.div>

      </div>
    </section>
  )
}

// ── CHOISISSEZ VOTRE FORMULE — pricing callout à onglets (miroir desktop) ──
function PricingCallout() {
  const T = useTheme()
  const { t } = useLanguage()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const [tab, setTab] = useState('vitrine')
  const d = PRICING[tab]

  return (
    <section id="pricing-section" ref={ref} style={{ padding: '7rem 5%', background: T.bg, position: 'relative', overflow: 'hidden' }}>
      <div style={{ maxWidth: 600, margin: '0 auto', position: 'relative', zIndex: 1 }}>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <h2 className="section-title-big" style={{ position: 'relative', textAlign: 'center', fontSize: 'clamp(2.3rem,8.5vw,3.6rem)', fontWeight: 900, fontStyle: 'italic', fontFamily: "'Barlow Condensed',sans-serif", color: T.textMain, letterSpacing: '-.03em' }}>
            <GhostTitle text={t('chooseSolution').toUpperCase()} />
            {t('chooseSolution')}
          </h2>
          <RevealParagraph text={t('pricingLead')} greenWords={[]} extraStyle={{ color: T.textSub }} inView={inView} />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: .1 }}
          style={{ display: 'flex', justifyContent: 'center', gap: '.5rem', marginBottom: '1.8rem', flexWrap: 'wrap' }}>
          {Object.entries(PRICING).map(([k, v]) => (
            <motion.button key={k} onClick={() => setTab(k)}
              whileTap={{ scale: 0.96 }}
              style={{ padding: '.5rem 1.2rem', borderRadius: 100, border: '1px solid', borderColor: tab === k ? T.green : T.border, background: tab === k ? 'linear-gradient(145deg,#8dd456,#5f9137)' : 'transparent', color: tab === k ? '#fff' : T.textSub, fontFamily: "'Barlow Condensed',sans-serif", fontStyle: 'italic', fontSize: '.78rem', fontWeight: 900, cursor: 'pointer', WebkitTapHighlightColor: 'transparent' }}>
              {v.label}
            </motion.button>
          ))}
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div key={tab}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: .3 }}
            className="pricing-grid">
            {d.plans.map((plan) => {
              const wa = encodeURIComponent(`Bonjour AKATech, je suis intéressé par l'offre ${plan.badge} à ${plan.price}`)
              return (
                <motion.div key={plan.badge}
                  style={{ position: 'relative', borderRadius: 18, overflow: 'hidden', background: plan.popular ? 'linear-gradient(145deg,rgba(136,202,83,.18),rgba(136,202,83,.06))' : T.light ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,.04)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: plan.popular ? '1px solid rgba(136,202,83,.5)' : `1px solid ${T.light ? 'rgba(0,0,0,.1)' : 'rgba(255,255,255,.1)'}`, boxShadow: plan.popular ? '0 8px 40px rgba(136,202,83,.2),inset 0 1px 0 rgba(255,255,255,.15)' : T.light ? '0 4px 24px rgba(0,0,0,.08)' : '0 8px 32px rgba(0,0,0,.4),inset 0 1px 0 rgba(255,255,255,.06)', padding: plan.popular ? '0 0 1.8rem' : '1.8rem' }}>
                  {plan.popular && (
                    <div style={{ padding: '.45rem', background: 'linear-gradient(90deg,#5f9137,#88ca53)', textAlign: 'center', fontFamily: "'JetBrains Mono',monospace", fontSize: '.58rem', fontWeight: 700, color: '#fff', letterSpacing: '.1em', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '.4rem' }}>
                      <Zap size={10} />{t('pricing_popular')}
                    </div>
                  )}
                  <div style={{ padding: plan.popular ? '1.6rem 1.8rem 0' : 0, position: 'relative' }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '50%', background: 'linear-gradient(180deg,rgba(255,255,255,.07) 0%,transparent 100%)', pointerEvents: 'none' }} />
                    <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.62rem', fontWeight: 600, color: plan.popular ? '#88ca53' : T.textMuted, textTransform: 'uppercase', marginBottom: '.5rem' }}>{plan.badge}</div>
                    <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 'clamp(1.3rem,6vw,1.6rem)', fontWeight: 900, color: T.textMain, marginBottom: '.2rem', letterSpacing: '-0.02em', lineHeight: 1.1 }}>{plan.price}</div>
                    <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.6rem', color: T.textMuted, marginBottom: '1.4rem', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Timer size={11} style={{ color: T.green }} />{plan.del}
                    </div>
                    <div style={{ height: 1, background: plan.popular ? 'rgba(136,202,83,.25)' : 'rgba(255,255,255,.08)', marginBottom: '1.2rem' }} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '.6rem', marginBottom: '1.6rem' }}>
                      {plan.features.map(f => (
                        <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '.55rem', fontSize: '.8rem', color: T.textSub, lineHeight: 1.5 }}>
                          <div style={{ width: 16, height: 16, borderRadius: '50%', flexShrink: 0, marginTop: 1, background: plan.popular ? 'rgba(136,202,83,.2)' : 'rgba(255,255,255,.06)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Check size={10} style={{ color: '#88ca53' }} />
                          </div>
                          {f}
                        </div>
                      ))}
                    </div>
                    {plan.popular
                      ? <a href={`https://wa.me/2250142507750?text=${wa}`} target="_blank" rel="noreferrer" className="btn-raised" style={{ width: '100%', justifyContent: 'center', display: 'flex' }}><HoverSlideText text={t('pricing_order')} /></a>
                      : <a href={`https://wa.me/2250142507750?text=${wa}`} target="_blank" rel="noreferrer" className="btn-ghost" style={{ width: '100%', justifyContent: 'center', display: 'flex' }}><HoverSlideText text={t('pricing_order')} /></a>
                    }
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </AnimatePresence>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: .25 }}
          style={{ marginTop: '2rem', padding: '1rem 1.2rem', borderRadius: 14, background: 'rgba(136,202,83,.04)', border: '1px solid rgba(136,202,83,.15)', display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: '.8rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '.6rem' }}>
            <div style={{ width: 9, height: 9, borderRadius: '50%', background: '#88ca53', boxShadow: '0 0 8px rgba(136,202,83,.8)', animation: 'dot-blink 1.4s ease-in-out infinite', flexShrink: 0 }} />
            <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.7rem', color: T.textSub, letterSpacing: '.03em', margin: 0 }}>
              <span style={{ color: '#b3ee85', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '.3rem' }}>
                <Timer size={11} /> {t('pricing_urgency')}
              </span>
              {' '}{t('pricing_urgency_text')}
            </p>
          </div>
          <a href="https://wa.me/2250142507750?text=Bonjour+AKATech,+je+veux+réserver+mon+projet+!" target="_blank" rel="noreferrer"
            className="btn-raised" style={{ padding: '.7rem 1.2rem', fontSize: '.8rem', justifyContent: 'center', display: 'flex' }}>
            <HoverSlideText text={t('pricing_order')} />
          </a>
        </motion.div>
      </div>
    </section>
  )
}

// ── OÙ INTERVENONS-NOUS — badges pays (miroir desktop) ──
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
    <div style={{ width: 34, height: 34, borderRadius: 9, overflow: 'hidden', flexShrink: 0, border: primary ? '1.5px solid rgba(136,202,83,.5)' : '1px solid rgba(255,255,255,.1)', display: 'flex', flexDirection: 'column', boxShadow: primary ? '0 0 10px rgba(136,202,83,.2)' : 'none' }}>
      <div style={{ flex: 1, background: c1 }} />
      <div style={{ flex: 1, background: c2 }} />
      <div style={{ flex: 1, background: c3 }} />
    </div>
  )
}

function GeoSectionHome() {
  const T = useTheme()
  const { t } = useLanguage()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section ref={ref} style={{ padding: '5rem 5%', background: T.bg, position: 'relative', overflow: 'hidden' }}>
      <div className="grid-bg" style={{ position: 'absolute', inset: 0, opacity: .18 }} />
      <div style={{ maxWidth: 600, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} style={{ marginBottom: '2rem' }}>
          <h2 className="section-title-big" style={{ position: 'relative', textAlign: 'center', fontSize: 'clamp(2.3rem,8.5vw,3.6rem)', fontWeight: 900, fontStyle: 'italic', fontFamily: "'Barlow Condensed',sans-serif", color: T.textMain, letterSpacing: '-.03em' }}>
            <GhostTitle text={t('geoUpper')} />
            {t('geoTitle')}
          </h2>
          <RevealParagraph
            text={t('geoLead')}
            greenWords={['Abidjan', 'remote', 'West Africa', 'diaspora', 'Abiyán', 'Afri', 'occidental', 'diáspora']}
            extraStyle={{ color: T.textSub }}
            inView={inView}
          />
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: '.7rem' }}>
          {GEO_PAYS.map(({ code, name, note, primary }, i) => (
            <motion.div key={name} initial={{ opacity: 0, y: 14 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: i * .06 }}
              style={{ padding: '.85rem 1rem', borderRadius: 13, background: primary ? 'linear-gradient(135deg,rgba(136,202,83,.12),rgba(136,202,83,.04))' : (T.light ? 'rgba(0,0,0,.03)' : 'rgba(255,255,255,.03)'), border: `1px solid ${primary ? 'rgba(136,202,83,.3)' : T.border}`, display: 'flex', alignItems: 'center', gap: '.65rem' }}>
              <FlagBadge code={code} primary={primary} />
              <div style={{ minWidth: 0 }}>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, fontSize: '.78rem', color: primary ? '#88ca53' : T.textMain }}>{name}</div>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.6rem', color: T.textMuted }}>{note}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── DÉCRIVEZ VOTRE PROJET — formulaire de contact (miroir desktop) ──
const FORM_PANEL_W = 420

function ProjectFormHome() {
  const T = useTheme()
  const { t } = useLanguage()
  const ref = useRef(null)
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
      trackAction('contact_submit')
      setSent(true)
    } catch (err) {
      setError(err.message || t('formErrorGeneric'))
    } finally { setSending(false) }
  }

  return (
    <section ref={ref} style={{ padding: 'clamp(2.5rem,7vw,3.5rem) 5% 5rem', background: T.bgAlt, overflowX: 'hidden' }}>
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} style={{ marginBottom: '1.6rem' }}>
          <h2 className="section-title-big" style={{ position: 'relative', textAlign: 'center', fontSize: 'clamp(2.3rem,8.5vw,3.6rem)', fontWeight: 900, fontStyle: 'italic', fontFamily: "'Barlow Condensed',sans-serif", color: T.textMain, letterSpacing: '-.03em' }}>
            <GhostTitle text={t('formUpper')} />
            {t('formTitle')}
          </h2>
          <RevealParagraph
            text={t('formLead')}
            greenWords={['form', 'email', '24h', 'free quote', 'formulario', '24 horas', 'presupuesto']}
            extraStyle={{ color: T.textSub }}
            inView={inView}
          />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: .15 }}
          style={{ maxWidth: FORM_PANEL_W, margin: '0 auto', background: T.card, border: `1px solid ${T.border}`, borderRadius: 20, padding: '1.5rem', boxSizing: 'border-box' }}>
          <AnimatePresence mode="wait">
            {sent ? (
              <motion.div key="success" initial={{ opacity: 0, scale: .9 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center', padding: '1.5rem .5rem' }}>
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 18 }} style={{ width: 58, height: 58, borderRadius: '50%', border: '1.5px solid rgba(136,202,83,.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.4rem' }}>
                  <Check size={26} style={{ color: '#88ca53' }} />
                </motion.div>
                <h3 style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, fontSize: '1.1rem', color: T.textMain, marginBottom: '.7rem' }}>{t('messageSent')}</h3>
                <p style={{ color: T.textSub, fontSize: '.85rem', lineHeight: 1.7 }}>{t('formSuccess')}</p>
                <button type="button" onClick={() => { setSent(false); setError(''); setForm({ name: '', email: '', phone: '', service: '', message: '' }) }} style={{ marginTop: '1.4rem', background: 'transparent', border: `1px solid ${T.border}`, borderRadius: 999, padding: '.5rem 1.2rem', color: T.textSub, fontFamily: "'JetBrains Mono',monospace", fontSize: '.76rem', cursor: 'pointer' }}>{t('sendAnother')}</button>
              </motion.div>
            ) : (
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h3 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontStyle: 'italic', fontWeight: 900, fontSize: '1.25rem', color: T.textMain, marginBottom: '1.2rem' }}>{t('writeUs')}</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.2rem', marginBottom: '1.2rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '.66rem', color: T.textMuted, marginBottom: '.4rem', fontFamily: "'JetBrains Mono',monospace", letterSpacing: '.1em', textTransform: 'uppercase' }}>{t('yourName')}</label>
                    <input style={inputStyle} placeholder="Elvis Aka" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} onFocus={focusOn} onBlur={focusOff} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '.66rem', color: T.textMuted, marginBottom: '.4rem', fontFamily: "'JetBrains Mono',monospace", letterSpacing: '.1em', textTransform: 'uppercase' }}>{t('emailLabel')}</label>
                    <input type="email" style={inputStyle} placeholder="vous@email.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} onFocus={focusOn} onBlur={focusOff} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '.66rem', color: T.textMuted, marginBottom: '.4rem', fontFamily: "'JetBrains Mono',monospace", letterSpacing: '.1em', textTransform: 'uppercase' }}>{t('formPhoneLabel')}</label>
                    <input style={inputStyle} placeholder="+225 07 XX XX XX" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} onFocus={focusOn} onBlur={focusOff} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '.66rem', color: T.textMuted, marginBottom: '.4rem', fontFamily: "'JetBrains Mono',monospace", letterSpacing: '.1em', textTransform: 'uppercase' }}>{t('formProjectTypeLabel')}</label>
                    <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.service} onChange={e => setForm(f => ({ ...f, service: e.target.value }))} onFocus={focusOn} onBlur={focusOff}>
                      <option value="">{t('chooseLabel')}</option>
                      <option value="site-vitrine">{t('service_site_vitrine')}</option>
                      <option value="e-commerce">E-commerce</option>
                      <option value="application-web">Application Web / SaaS</option>
                      <option value="cartes-dashboards">Cartes Interactives & Dashboards</option>
                      <option value="chatbot-ia">Intégration IA Chatbot</option>
                      <option value="paiement-en-ligne">Intégration de Paiement en Ligne</option>
                      <option value="google-my-business">Fiche Google My Business</option>
                      <option value="maintenance">Maintenance & Support</option>
                      <option value="autre">Autre</option>
                    </select>
                  </div>
                </div>
                <div style={{ marginBottom: '1.4rem' }}>
                  <label style={{ display: 'block', fontSize: '.66rem', color: T.textMuted, marginBottom: '.4rem', fontFamily: "'JetBrains Mono',monospace", letterSpacing: '.1em', textTransform: 'uppercase' }}>{t('formNeedLabel')}</label>
                  <input style={inputStyle} placeholder="Ex: Boutique en ligne avec paiement Mobile Money"
                    value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} onFocus={focusOn} onBlur={focusOff} />
                </div>
                {error && <p style={{ textAlign: 'left', fontSize: '.76rem', color: '#ff6b6b', marginBottom: '.8rem' }}>{error}</p>}
                <p style={{ textAlign: 'left', fontSize: '.7rem', color: T.textMuted, display: 'flex', alignItems: 'center', gap: '.35rem' }}>
                  <Lock size={11} style={{ color: T.textMuted, flexShrink: 0 }} /> {t('privacyNote')}
                </p>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={sending}
                  className="btn-raised"
                  style={{
                    marginTop: '1.2rem', width: '100%', cursor: sending ? 'default' : 'pointer',
                    justifyContent: 'center', opacity: sending ? .7 : 1,
                  }}
                >
                  {sending ? <span style={{ width: 15, height: 15, border: '2px solid rgba(5,5,5,.3)', borderTopColor: '#050505', borderRadius: '50%', animation: 'spin .6s linear infinite', display: 'inline-block' }} /> : <Send size={17} />}
                  <HoverSlideText text={t('receiveQuote')} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}

// ── QUESTIONS FRÉQUENTES — accordéon (réutilise Accordion générique) ──
function FAQSectionHome() {
  const T = useTheme()
  const { t } = useLanguage()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section ref={ref} style={{ padding: '7rem 5%', background: T.bg, position: 'relative' }}>
      <div className="grid-bg" style={{ position: 'absolute', inset: 0, opacity: .2 }} />
      <div style={{ maxWidth: 600, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 className="section-title-big" style={{ position: 'relative', textAlign: 'center', fontSize: 'clamp(2.3rem,8.5vw,3.6rem)', fontWeight: 900, fontStyle: 'italic', fontFamily: "'Barlow Condensed',sans-serif", color: T.textMain, letterSpacing: '-.03em' }}>
            <GhostTitle text={t('faqUpper')} />
            {t('faqTitle')}
          </h2>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: .15 }}>
          <Accordion
            items={FAQ_ITEMS.slice(0, 6)}
            renderHeader={(f, isOpen) => (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '.65rem', minWidth: 0 }}>
                <span style={{
                  width: 32, height: 32, flexShrink: 0, borderRadius: 9,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: isOpen ? 'rgba(136,202,83,.16)' : 'rgba(136,202,83,.08)',
                  border: `1px solid ${isOpen ? 'rgba(136,202,83,.45)' : 'rgba(136,202,83,.2)'}`,
                  color: '#88ca53', transition: 'background .25s, border-color .25s',
                }}>
                  <HelpCircle size={15} />
                </span>
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, fontSize: 'clamp(.8rem,3.4vw,.9rem)', color: T.textMain, lineHeight: 1.35 }}>
                  {f.q}
                </span>
              </div>
            )}
            renderBody={f => (
              <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.78rem', lineHeight: 1.7, color: T.textMuted, paddingLeft: 46, paddingRight: '.5rem' }}>
                {f.a}
              </p>
            )}
          />
        </motion.div>
      </div>
    </section>
  )
}

// ── HOME PAGE ────────────────────────────────────────────────
export default function HomePageMobile() {
  return (
    <div style={{ paddingTop: 0 }}>
      <Hero />
      <ProjectsSection />
      <StatsSection />
      <DomainesSection />
      <TrustStacksMarquee />
      <ServicesPreview />
      <PricingCallout />
      <Process />
      <FAQSectionHome />
      <ConversionMarquee />
      <Testimonials />
      <GeoSectionHome />
      <ProjectFormHome />
      <section style={{ position: 'relative', width: '100%', aspectRatio: '1 / 1', overflow: 'hidden' }}>
        <LazyImg
          src={cld('/images/cta-home-mobile.webp')}
          alt="Comme eux, donnez à votre activité la présence digitale qu'elle mérite."
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <motion.a
          href="https://wa.me/2250142507750" target="_blank" rel="noreferrer"
          aria-label="Rejoindre nos clients"
          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          transition={{ duration: .2, ease: [.22, 1, .36, 1] }}
          style={{
            position: 'absolute', left: '5.34%', top: '39.71%', width: '41.15%', height: '10.05%',
            borderRadius: 999, cursor: 'pointer',
          }}
        />
      </section>
    </div>
  )
}
