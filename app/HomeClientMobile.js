'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import {
  ArrowRight, Star, ExternalLink, ChevronDown,
  Globe, ShoppingCart, Cpu, Server, Palette, Wrench, Map, MapPin,
  Monitor, ShoppingBag, LayoutDashboard, Cog, Image,
} from 'lucide-react'
import { useTheme } from '@/lib/theme'
import { GhostTitle, AnimatedCounter, LazyImg, PageCTA, GreenUnderline } from '@/components/ui/index'
import TrustStacksMarquee from '@/components/ui/TrustStacksMarquee'
import ConversionMarquee from '@/components/ui/ConversionMarquee'
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

// ── DATA prestations — texte complet (remplace les visuels image) ──
const SERVICES_ITEMS = [
  {
    n: '01', Icon: Globe, title: 'Création de Sites Web',
    tagline: 'Votre présence en ligne professionnelle.',
    bullets: [
      { h: 'Site vitrine moderne', d: 'Design attractif et performant.' },
      { h: 'Boutique e-commerce', d: 'Vendez vos produits en ligne.' },
      { h: 'Portfolio créatif', d: 'Mettez en valeur vos réalisations.' },
      { h: 'Application SaaS sur mesure', d: 'Solutions adaptées à vos besoins.' },
      { h: 'Design responsive', d: 'Parfait sur tous les écrans.' },
      { h: 'Optimisation SEO', d: 'Soyez visible, soyez choisi.' },
    ],
    price: 'À partir de 100 000 FCFA',
  },
  {
    n: '02', Icon: Map, title: 'Cartes Interactives & Dashboards',
    tagline: 'Visualisez vos données avec puissance.',
    bullets: [
      { h: 'Cartes Mapbox interactives', d: 'Explorez vos données en temps réel.' },
      { h: 'Géolocalisation avancée', d: 'Suivi précis et analyse spatiale.' },
      { h: 'Dashboards analytiques', d: 'Indicateurs clés et visualisations claires.' },
      { h: 'Données temps réel', d: 'Toujours à jour pour de meilleures décisions.' },
      { h: 'Rapports personnalisés', d: 'Sur mesure selon vos besoins.' },
    ],
    price: 'Sur devis',
  },
  {
    n: '03', Icon: Server, title: 'API & Backend Robustes',
    tagline: 'Connectez et automatisez vos systèmes.',
    bullets: [
      { h: 'API REST & GraphQL', d: 'Des interfaces modernes et performantes.' },
      { h: 'Architecture sécurisée', d: 'Protection des données et des accès.' },
      { h: 'Intégration de services tiers', d: 'Connectez vos outils et plateformes.' },
      { h: 'Automatisation des processus', d: 'Gagnez du temps, réduisez les tâches manuelles.' },
      { h: 'Performance et scalabilité', d: 'Des systèmes conçus pour grandir avec vous.' },
    ],
    price: 'Sur devis',
  },
  {
    n: '04', Icon: Wrench, title: 'Maintenance & Support',
    tagline: 'Votre projet sécurisé et toujours performant.',
    bullets: [
      { h: 'Sauvegardes automatiques', d: 'Vos données sont protégées en continu.' },
      { h: 'Mises à jour régulières', d: 'Plus de sécurité et de stabilité.' },
      { h: 'Surveillance 24h/24', d: 'Monitoring temps réel, incidents anticipés.' },
      { h: 'Support WhatsApp', d: 'Une assistance rapide et à portée de main.' },
      { h: 'Assistance rapide', d: 'Notre équipe réactive pour vos problèmes.' },
    ],
    price: 'À partir de 20 000 FCFA',
  },
  {
    n: '05', Icon: MapPin, title: 'Fiche Google My Business',
    tagline: 'Soyez visible sur Google Maps et la recherche locale.',
    bullets: [
      { h: 'Optimisation complète', d: 'NAP, catégories, description, photos et services.' },
      { h: 'Gestion des avis', d: 'Réponses rapides pour votre e-réputation.' },
      { h: 'Publications régulières', d: 'Actualités, offres et événements.' },
      { h: 'Suivi des performances', d: 'Statistiques claires pour mesurer vos résultats.' },
      { h: 'Plus de visibilité', d: 'Attirez plus de clients locaux chaque mois.' },
    ],
    price: 'À partir de 20 000 FCFA',
  },
]

// ── DATA processus — texte complet (remplace les visuels image) ──
const PROCESS_ITEMS = [
  { n: '01', title: 'Prise de contact & brief', badge: '1 à 2 jours', desc: "Vous me présentez votre projet et vos besoins. Nous échangeons sur vos références afin de définir le pack le plus adapté." },
  { n: '02', title: 'Devis & conditions', badge: '1 jour', desc: "Vous recevez un devis détaillé indiquant le montant total, l'acompte de 50%, le solde à la livraison, le délai et les prestations incluses." },
  { n: '03', title: 'Acompte reçu', badge: 'Feu vert', desc: "Dès réception de l'acompte, je récupère vos contenus — logo, textes, photos — et le développement démarre immédiatement." },
  { n: '04', title: 'Création du site', badge: 'Délai annoncé', desc: "Je développe votre site : pages, design responsive, animations, formulaire de contact, SEO de base — et je configure l'hébergement et le nom de domaine." },
  { n: '05', title: 'Livraison & validation', badge: '1 à 2 jours', desc: "Vous recevez un lien de prévisualisation pour tester le site et demander vos retours avant la mise en ligne définitive." },
  { n: '06', title: 'Solde payé', badge: 'Fichiers transmis', desc: "Une fois le solde réglé, je vous transmets les fichiers sources, les accès à l'hébergement et au nom de domaine, ainsi que le mot de passe d'administration." },
  { n: '07', title: 'Mise en ligne & support', badge: 'Projet livré', desc: "Votre site est en ligne. Selon le pack, vous bénéficiez d'un mois de support, et je vous accompagne pour le renouvellement après la première année." },
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
        <motion.h2 className="section-title-big" initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          style={{
            position: 'relative',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 'clamp(1.4rem,5vw,1.9rem)', fontWeight: 800,
            color: T.textMain, letterSpacing: '-.03em',
            marginBottom: '1.5rem',
          }}>
          <GhostTitle text="À PROPOS DE AKATECH" />
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
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const ICON_BOX = 42

  return (
    <section ref={ref} style={{ padding: '7rem 5%', background: T.bg, position: 'relative' }}>
      <div className="grid-bg" style={{ position: 'absolute', inset: 0, opacity: .25 }} />
      <div style={{ maxWidth: 600, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 className="section-title-big" style={{ position: 'relative', fontSize: 'clamp(1.9rem,3.5vw,2.8rem)', fontWeight: 800, fontFamily: "'JetBrains Mono',monospace", color: T.textMain, letterSpacing: '-.03em', lineHeight: 1.15 }}>
            <GhostTitle text="NOS PRESTATIONS, " />
            NOS,<br />
            <GreenUnderline><span className="text-gradient">PRESTATIONS</span></GreenUnderline>
          </h2>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: .15 }}>
          <Accordion
            items={SERVICES_ITEMS}
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
                    <div style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 800, fontSize: 'clamp(.82rem,3.4vw,.92rem)', color: T.textMain, letterSpacing: '-.01em', lineHeight: 1.25 }}>
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
                  Demander un devis <ArrowRight size={13} />
                </a>
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

// ── PROCESS — accordéon (étape/titre/statut + détail au clic) ────
function Process() {
  const T = useTheme()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section ref={ref} style={{ padding: '7rem 5%', background: T.bg }}>
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 className="section-title-big" style={{ position: 'relative', fontSize: 'clamp(1.9rem,3.5vw,2.8rem)', fontWeight: 800, fontFamily: "'JetBrains Mono',monospace", color: T.textMain, letterSpacing: '-.03em' }}>
            <GhostTitle text="DE L'IDÉE À LA MISE EN LIGNE" />
            De l'idée à la <GreenUnderline><span className="text-gradient">mise en ligne</span></GreenUnderline>
          </h2>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: .15 }}>
          <Accordion
            items={PROCESS_ITEMS}
            renderHeader={(s, isOpen) => (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '.4rem', minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '.7rem' }}>
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.66rem', fontWeight: 700, color: isOpen ? '#88ca53' : 'rgba(136,202,83,.5)', letterSpacing: '.1em', flexShrink: 0 }}>
                    {s.n}
                  </span>
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 800, fontSize: 'clamp(.84rem,3.4vw,.94rem)', color: T.textMain, letterSpacing: '-.01em', lineHeight: 1.3 }}>
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
  const ref     = useRef(null)
  const inView  = useInView(ref, { once: true, margin: '-60px' })
  const wrapRef = useRef(null)   // runway de scroll pour le pin
  const gridRef = useRef(null)   // grille — reçoit la profondeur 3D scroll-driven
  const cellRefs = useRef([])

  const ITEMS = [
    ...PROJECTS.filter(p => p.id === 15 || p.id === 18),
    ...PROJECTS.filter(p => p.id === 17 || p.id === 16),
    ...PROJECTS.filter(p => p.id === 12 || p.id === 11),
  ]
  // Profondeurs par carte — même principe que ArchiveTunnelSection desktop, amplitude réduite pour mobile
  const DEPTHS = [0, -90, -30, -140, -60, -110]

  // ── Pin + tunnel 3D + colorisation au scroll (miroir de ArchiveTunnelSection desktop) ──
  useEffect(() => {
    let raf = null
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = null
        const wrap = wrapRef.current
        const grid = gridRef.current
        if (!wrap || !grid) return
        const winH = window.innerHeight
        const top  = wrap.getBoundingClientRect().top
        const pinDistance = wrap.offsetHeight - winH
        const progress = pinDistance > 0 ? Math.min(1, Math.max(0, -top / pinDistance)) : 0

        grid.style.transform = `translateZ(${progress * 340}px) rotateX(${progress * 8}deg)`
        grid.style.opacity   = String(progress > 0.92 ? Math.max(0, 1 - (progress - 0.92) / 0.08) : 1)

        cellRefs.current.forEach((cell, i) => {
          if (!cell) return
          const start = i * 0.05
          const local = Math.max(0, Math.min(1, (progress - start) / 0.4))
          cell.style.filter = `grayscale(${(1 - local).toFixed(2)}) contrast(1.04)`
        })
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  // ── Tap pour dévoiler résultat + lien ──
  const [active, setActive] = useState(null)

  return (
    <section ref={ref} style={{ background: T.bg, position: 'relative' }}>
      <div className="grid-bg" style={{ position: 'absolute', inset: 0, opacity: .18 }} />

      {/* Runway de scroll pour le pin (hauteur réduite vs desktop : format mobile) */}
      <div ref={wrapRef} style={{ position: 'relative', height: '190vh' }}>

        {/* Titre — au-dessus du pin, défile normalement */}
        <div style={{ padding: '7rem 5% 0', position: 'relative', zIndex: 1 }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}>
            <h2 className="section-title-big" style={{ position: 'relative', fontSize: 'clamp(1.9rem,7vw,2.6rem)', fontWeight: 800, fontFamily: "'JetBrains Mono',monospace", color: T.textMain, letterSpacing: '-.03em', marginBottom: '.6rem' }}>
              <GhostTitle text="NOS DERNIÈRES RÉALISATIONS" />
              Nos dernières <GreenUnderline><span className="text-gradient">réalisations</span></GreenUnderline>
            </h2>
            <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.75rem', color: T.textMuted, letterSpacing: '.04em' }}>
              — scroll pour révéler en couleur
            </p>
          </motion.div>
        </div>

        {/* Zone pinnée — tunnel 3D */}
        <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden', perspective: 900, display: 'flex', alignItems: 'center', zIndex: 1 }}>
          <style>{`
            .archive-grid-mobile {
              display: grid;
              grid-template-columns: 1fr 1fr;
              grid-template-rows: repeat(4, 1fr);
              gap: clamp(.5rem, 2vw, .9rem);
            }
            /* La 5e carte prend 2 colonnes pour équilibrer */
            .archive-grid-mobile > div:nth-child(5) { grid-column: span 2; }
          `}</style>

          <div ref={gridRef} className="archive-grid-mobile" style={{ width: '100%', height: '80vh', padding: '0 6vw', transformStyle: 'preserve-3d', willChange: 'transform' }}>
            {ITEMS.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: .5, delay: i * .06, ease: [.22,1,.36,1] }}
                style={{ height: '100%' }}
              >
                <div
                  ref={el => { cellRefs.current[i] = el }}
                  onClick={() => setActive(active === i ? null : i)}
                  style={{
                    position: 'relative',
                    width: '100%', height: '100%',
                    borderRadius: 10,
                    overflow: 'hidden',
                    border: active === i ? '1.5px solid rgba(136,202,83,.6)' : '1px solid rgba(136,202,83,.25)',
                    boxShadow: active === i ? '0 0 0 3px rgba(136,202,83,.12)' : 'none',
                    filter: 'grayscale(1) contrast(1.04)',
                    transform: `translateZ(${DEPTHS[i] || 0}px)`,
                    transition: 'border-color .25s, box-shadow .25s, filter .12s linear',
                    cursor: 'pointer',
                    willChange: 'filter, transform',
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
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA — hors du pin, flow normal */}
      <div style={{ padding: '2.5rem 5% 7rem', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: .3 }}>
          <Link href="/projects" className="btn-ghost" style={{ fontSize: '.88rem', padding: '.8rem 1.8rem' }}>
            Toutes les réalisations <ArrowRight size={13} />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

// Domaines section removed for mobile (kept desktop-only)

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
          <h2 className="section-title-big" style={{ position: 'relative', fontSize: 'clamp(1.9rem,3.5vw,2.6rem)', fontWeight: 800, fontFamily: "'JetBrains Mono',monospace", color: T.textMain, letterSpacing: '-.03em' }}>
            <GhostTitle text="CE QUE DISENT NOS CLIENTS" />
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
      <StatsSection />
      <ServicesPreview />
      <ProjectsSection />
      <TrustStacksMarquee />
      <Process />
      <ConversionMarquee />
      <AboutSection />
      <Testimonials />
      <PageCTA message="Comme eux, donnez à votre activité la présence digitale qu'elle mérite." cta="Rejoindre nos clients" />
    </div>
  )
}