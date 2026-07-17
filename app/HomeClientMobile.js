'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import {
  ArrowRight, Star, ExternalLink, ChevronDown,
  Globe, ShoppingCart, Cpu, Server, Palette, Wrench, Map, MapPin,
  Monitor, ShoppingBag, LayoutDashboard, Cog, Image,
  Zap, Timer, Check, AlertTriangle, HelpCircle, Send, Lock,
} from 'lucide-react'
import { useTheme } from '@/lib/theme'
import { GhostTitle, AnimatedCounter, LazyImg, PageCTA, GreenUnderline } from '@/components/ui/index'
import TrustStacksMarquee from '@/components/ui/TrustStacksMarquee'
import ConversionMarquee from '@/components/ui/ConversionMarquee'
import { PROJECTS, TESTIMONIALS, FAQ_ITEMS, PRICING } from '@/lib/data'

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
    ...PROJECTS.filter(p => p.id === 19),
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
          style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 'clamp(1.9rem,4.4vw,3.2rem)', lineHeight: 1.18, letterSpacing: '-.02em', textTransform: 'uppercase', color: '#fff', textShadow: '4px 4px 0px rgba(0,0,0,.55)', textAlign: 'center', margin: 0 }}>
          {before}
          <span style={{ display: 'inline-block', background: '#88ca53', color: '#08130a', padding: '.1em .3em', boxShadow: '6px 6px 0px #fff', textShadow: 'none' }}>
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
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '1.05rem', textTransform: 'uppercase', letterSpacing: '-.01em', color: '#08130a', background: '#88ca53', padding: '1rem 2.1rem', borderRadius: 999 }}>
            Démarrer mon projet <ArrowRight size={16} />
          </motion.a>
          <motion.div
            initial={{ boxShadow: '6px 6px 0px #fff' }}
            whileHover={{ x: -4, y: -4, boxShadow: '10px 10px 0px #fff' }}
            whileTap={{ x: 2, y: 2, boxShadow: '2px 2px 0px #fff' }}
            style={{ display: 'inline-block', borderRadius: 999 }}>
            <Link href="/contact" style={{ display: 'inline-flex', alignItems: 'center', fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '1.05rem', textTransform: 'uppercase', letterSpacing: '-.01em', color: '#fff', background: 'transparent', border: '2px solid #fff', borderRadius: 999, padding: 'calc(1rem - 2px) calc(2.1rem - 2px)' }}>
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

// ── STATS — chiffres géants éditoriaux (miroir desktop), responsive 2-col mobile ──
const HOME_STATS = [
  { target: PROJECTS.length,  suffix: '',  label: 'Projets livrés',      sub: 'Du concept au déploiement' },
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
          <h2 className="section-title-big" style={{ position: 'relative', fontSize: 'clamp(1.9rem,7vw,2.8rem)', fontWeight: 800, fontFamily: "'JetBrains Mono',monospace", color: T.textMain, letterSpacing: '-.03em', lineHeight: 1.15 }}>
            <GhostTitle text="NOS prestations, " />
            NOS,<br />
            <GreenUnderline><span className="text-gradient">prestations</span></GreenUnderline>
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
          <h2 className="section-title-big" style={{ position: 'relative', fontSize: 'clamp(1.9rem,7vw,2.8rem)', fontWeight: 800, fontFamily: "'JetBrains Mono',monospace", color: T.textMain, letterSpacing: '-.03em' }}>
            <GhostTitle text="DE L'IDÉE À LA MISE en ligne" />
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
    ...PROJECTS.filter(p => p.id === 19),
  ]
  // Profondeurs par carte — même principe que ArchiveTunnelSection desktop, amplitude réduite pour mobile
  const DEPTHS = [0, -90, -30, -140, -60, -110, -75]

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
            <h2 className="section-title-big" style={{ position: 'relative', fontSize: 'clamp(1.9rem,7vw,2.8rem)', fontWeight: 800, fontFamily: "'JetBrains Mono',monospace", color: T.textMain, letterSpacing: '-.03em', marginBottom: '.6rem' }}>
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
          <h2 className="section-title-big" style={{ position: 'relative', fontSize: 'clamp(1.9rem,7vw,2.8rem)', fontWeight: 800, fontFamily: "'JetBrains Mono',monospace", color: T.textMain, letterSpacing: '-.03em' }}>
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
const DOMAINES = [
  { n: '01', Icon: Monitor,         title: 'Sites Vitrine & Landing Pages',    tag: 'Site Vitrine',   desc: "Votre présence digitale professionnelle, optimisée pour convertir vos visiteurs en clients. Design sur mesure, SEO intégré, livré en 7 à 14 jours." },
  { n: '02', Icon: ShoppingBag,     title: 'E-Commerce & Boutiques en ligne',  tag: 'E-Commerce',     desc: "Boutiques complètes avec paiement Mobile Money (Orange Money, Wave), gestion des stocks, tableau de bord admin et notifications commandes." },
  { n: '03', Icon: LayoutDashboard, title: 'Applications SaaS & Métier',       tag: 'SaaS',           desc: "Des outils web sur mesure pour automatiser vos processus, gérer vos équipes et économiser des heures de travail chaque semaine." },
  { n: '04', Icon: Cog,             title: 'Digitalisation de processus',      tag: 'Digitalisation', desc: "Remplacez vos fichiers Excel et WhatsApp par des applications robustes. Suivi en temps réel, rôles utilisateurs, reporting intégré." },
  { n: '05', Icon: Image,           title: 'Portfolios & Identités créatives', tag: 'Portfolio',      desc: "Des vitrines animées et percutantes pour créatifs, photographes, graphistes et freelances qui veulent décrocher plus de clients." },
  { n: '06', Icon: Wrench,          title: 'Maintenance & Évolutions',         tag: 'Support',        desc: "Votre investissement sur la durée. Mises à jour, nouvelles fonctionnalités, corrections et support technique réactif sous 48h." },
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
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  const DOM_TEXT = "De la vitrine au SaaS, de la boutique au portfolio — nous intervenons sur l'ensemble de la chaîne digitale pour concrétiser votre vision."
  const DOM_GREEN = ['SaaS,', 'portfolio', 'chaîne', 'digitale', 'concrétiser', 'vision.']

  return (
    <section ref={ref} style={{ padding: '7rem 5%', background: T.bgAlt, position: 'relative', overflow: 'hidden' }}>
      <div style={{ maxWidth: 600, margin: '0 auto', position: 'relative', zIndex: 1 }}>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} style={{ marginBottom: '2rem' }}>
          <h2 className="section-title-big" style={{ position: 'relative', fontSize: 'clamp(1.9rem,7vw,2.8rem)', fontWeight: 800, fontFamily: "'JetBrains Mono',monospace", color: T.textMain, letterSpacing: '-.03em' }}>
            <GhostTitle text="DANS QUEL AXE DE CRÉATION S'INSCRIT VOTRE PROJET ?" />
            Dans quel axe de création{' '}
            <GreenUnderline><span className="text-gradient">s'inscrit votre projet ?</span></GreenUnderline>
          </h2>
          <RevealParagraph text={DOM_TEXT} greenWords={DOM_GREEN} extraStyle={{ color: T.textSub }} inView={inView} />
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1px', background: T.border, borderRadius: 16, overflow: 'hidden', border: `1px solid ${T.border}` }}>
          {DOMAINES.map((domaine, i) => (
            <DomaineCard key={domaine.n} {...domaine} index={i} inView={inView} />
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: .3 }} style={{ textAlign: 'center', marginTop: '2rem' }}>
          <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.82rem', color: T.textMuted, marginBottom: '1rem' }}>
            Votre projet ne rentre dans aucune case ? On s'adapte.
          </p>
          <a href="https://wa.me/2250142507750" target="_blank" rel="noreferrer" className="btn-raised" style={{ fontSize: '.85rem', padding: '.8rem 1.6rem' }}>
            Discuter de mon projet <ArrowRight size={13} />
          </a>
        </motion.div>

      </div>
    </section>
  )
}

// ── CHOISISSEZ VOTRE FORMULE — pricing callout à onglets (miroir desktop) ──
function PricingCallout() {
  const T = useTheme()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const [tab, setTab] = useState('vitrine')
  const d = PRICING[tab]

  return (
    <section ref={ref} style={{ padding: '7rem 5%', background: T.bg, position: 'relative', overflow: 'hidden' }}>
      <div style={{ maxWidth: 600, margin: '0 auto', position: 'relative', zIndex: 1 }}>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <h2 className="section-title-big" style={{ position: 'relative', fontSize: 'clamp(1.9rem,7vw,2.8rem)', fontWeight: 800, fontFamily: "'JetBrains Mono',monospace", color: T.textMain, letterSpacing: '-.03em' }}>
            <GhostTitle text="CHOISISSEZ VOTRE FORMULE IDÉALE" />
            Choisissez votre <GreenUnderline><span className="text-gradient">formule idéale</span></GreenUnderline>
          </h2>
          <RevealParagraph text="Des formules claires, adaptées aux besoins des petites structures et freelances — comparez et choisissez." greenWords={['claires,', 'structures', 'freelances', 'choisissez.']} extraStyle={{ color: T.textSub }} inView={inView} />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: .1 }}
          style={{ display: 'flex', justifyContent: 'center', gap: '.5rem', marginBottom: '1.8rem', flexWrap: 'wrap' }}>
          {Object.entries(PRICING).map(([k, v]) => (
            <motion.button key={k} onClick={() => setTab(k)}
              whileTap={{ scale: 0.96 }}
              style={{ padding: '.5rem 1.2rem', borderRadius: 100, border: '1px solid', borderColor: tab === k ? T.green : T.border, background: tab === k ? 'linear-gradient(145deg,#8dd456,#5f9137)' : 'transparent', color: tab === k ? '#fff' : T.textSub, fontFamily: "'JetBrains Mono',monospace", fontSize: '.78rem', fontWeight: 700, cursor: 'pointer', WebkitTapHighlightColor: 'transparent' }}>
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
                      <Zap size={10} />LE PLUS POPULAIRE
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
                      ? <a href={`https://wa.me/2250142507750?text=${wa}`} target="_blank" rel="noreferrer" className="btn-raised" style={{ width: '100%', justifyContent: 'center', display: 'flex' }}>Commander →</a>
                      : <a href={`https://wa.me/2250142507750?text=${wa}`} target="_blank" rel="noreferrer" className="btn-ghost" style={{ width: '100%', justifyContent: 'center', display: 'flex' }}>Commander →</a>
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
                <AlertTriangle size={11} /> 2 créneaux disponibles
              </span>
              {' '}ce mois-ci — les projets sont traités dans l'ordre d'arrivée.
            </p>
          </div>
          <a href="https://wa.me/2250142507750?text=Bonjour+AKATech,+je+veux+réserver+mon+projet+!" target="_blank" rel="noreferrer"
            className="btn-raised" style={{ padding: '.7rem 1.2rem', fontSize: '.8rem', justifyContent: 'center', display: 'flex' }}>
            Réserver ma place →
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
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section ref={ref} style={{ padding: '5rem 5%', background: T.bg, position: 'relative', overflow: 'hidden' }}>
      <div className="grid-bg" style={{ position: 'absolute', inset: 0, opacity: .18 }} />
      <div style={{ maxWidth: 600, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} style={{ marginBottom: '2rem' }}>
          <h2 className="section-title-big" style={{ position: 'relative', fontSize: 'clamp(1.9rem,7vw,2.8rem)', fontWeight: 800, fontFamily: "'JetBrains Mono',monospace", color: T.textMain, letterSpacing: '-.03em' }}>
            <GhostTitle text="OÙ INTERVENONS-NOUS ?" />
            Où intervenons-<GreenUnderline><span className="text-gradient">nous ?</span></GreenUnderline>
          </h2>
          <RevealParagraph
            text="Basés à Abidjan, on travaille 100% remote avec des clients partout en Afrique de l'Ouest et la diaspora."
            greenWords={['Abidjan,', 'remote', "l'Afrique", "l'Ouest", 'diaspora.']}
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
function ProjectFormHome() {
  const T = useTheme()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const [form, setForm] = useState({ name: '', email: '', phone: '', service: '', message: '' })
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const inputStyle = { width: '100%', padding: '.6rem 0', background: 'transparent', border: 'none', borderBottom: `1px solid ${T.border}`, borderRadius: 0, color: T.textMain, fontFamily: "'JetBrains Mono',monospace", fontSize: '1rem', outline: 'none', transition: 'border-color .25s', boxSizing: 'border-box', colorScheme: T.light ? 'light' : 'dark' }
  const focusOn = e => { e.target.style.borderBottomColor = '#88ca53' }
  const focusOff = e => { e.target.style.borderBottomColor = T.border }

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
    <section ref={ref} style={{ padding: 'clamp(2.5rem,7vw,3.5rem) 5% 5rem', background: T.bgAlt }}>
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} style={{ marginBottom: '1.6rem' }}>
          <h2 className="section-title-big" style={{ position: 'relative', fontSize: 'clamp(1.9rem,7vw,2.8rem)', fontWeight: 800, fontFamily: "'JetBrains Mono',monospace", color: T.textMain, letterSpacing: '-.03em' }}>
            <GhostTitle text="DÉCRIVEZ VOTRE PROJET" />
            Décrivez votre <GreenUnderline><span className="text-gradient">projet</span></GreenUnderline>
          </h2>
          <RevealParagraph
            text="Remplissez le formulaire — on vous recontacte par email sous 24h avec un devis gratuit."
            greenWords={['formulaire', 'email', '24h', 'gratuit.']}
            extraStyle={{ color: T.textSub }}
            inView={inView}
          />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: .15 }}>
          <AnimatePresence mode="wait">
            {sent ? (
              <motion.div key="success" initial={{ opacity: 0, scale: .9 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 18 }} style={{ width: 58, height: 58, borderRadius: '50%', border: '1.5px solid rgba(136,202,83,.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.4rem' }}>
                  <Check size={26} style={{ color: '#88ca53' }} />
                </motion.div>
                <h3 style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, fontSize: '1.15rem', color: T.textMain, marginBottom: '.7rem' }}>Message envoyé !</h3>
                <p style={{ color: T.textSub, fontSize: '.85rem', lineHeight: 1.7 }}>Votre demande a bien été reçue. On répond en moins de 24h directement par email — à très vite !</p>
              </motion.div>
            ) : (
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.3rem', marginBottom: '1.3rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '.66rem', color: T.textMuted, marginBottom: '.4rem', fontFamily: "'JetBrains Mono',monospace", letterSpacing: '.1em', textTransform: 'uppercase' }}>Votre nom</label>
                    <input style={inputStyle} placeholder="Elvis Aka" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} onFocus={focusOn} onBlur={focusOff} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '.66rem', color: T.textMuted, marginBottom: '.4rem', fontFamily: "'JetBrains Mono',monospace", letterSpacing: '.1em', textTransform: 'uppercase' }}>Email</label>
                    <input type="email" style={inputStyle} placeholder="vous@email.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} onFocus={focusOn} onBlur={focusOff} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '.66rem', color: T.textMuted, marginBottom: '.4rem', fontFamily: "'JetBrains Mono',monospace", letterSpacing: '.1em', textTransform: 'uppercase' }}>WhatsApp / Tél</label>
                    <input style={inputStyle} placeholder="+225 07 XX XX XX" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} onFocus={focusOn} onBlur={focusOff} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '.66rem', color: T.textMuted, marginBottom: '.4rem', fontFamily: "'JetBrains Mono',monospace", letterSpacing: '.1em', textTransform: 'uppercase' }}>Type de projet</label>
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

                <div style={{ marginBottom: '2rem' }}>
                  <label style={{ display: 'block', fontSize: '.66rem', color: T.textMuted, marginBottom: '.4rem', fontFamily: "'JetBrains Mono',monospace", letterSpacing: '.1em', textTransform: 'uppercase' }}>Votre besoin en une phrase</label>
                  <input style={inputStyle} placeholder="Ex: Boutique en ligne avec paiement Mobile Money"
                    value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} onFocus={focusOn} onBlur={focusOff} />
                </div>

                <motion.button whileTap={{ scale: .97 }} onClick={handleSubmit}
                  className="btn-raised" style={{ width: '100%', justifyContent: 'center', fontSize: '.92rem', padding: '.95rem', opacity: sending ? .7 : 1 }}>
                  {sending ? (
                    <><span style={{ width: 15, height: 15, border: '2px solid rgba(255,255,255,.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin .6s linear infinite', display: 'inline-block' }} /> Envoi en cours...</>
                  ) : (
                    <><Send size={15} /> Recevoir mon devis en 24h</>
                  )}
                </motion.button>

                {error && (
                  <p style={{ textAlign: 'center', fontSize: '.76rem', color: '#ff6b6b', marginTop: '.8rem' }}>
                    {error}
                  </p>
                )}

                <p style={{ textAlign: 'center', fontSize: '.7rem', color: T.textMuted, marginTop: '.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '.35rem' }}>
                  <Lock size={11} style={{ color: T.textMuted, flexShrink: 0 }} /> Vos données restent confidentielles. Aucun spam.
                </p>
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
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section ref={ref} style={{ padding: '7rem 5%', background: T.bg, position: 'relative' }}>
      <div className="grid-bg" style={{ position: 'absolute', inset: 0, opacity: .2 }} />
      <div style={{ maxWidth: 600, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 className="section-title-big" style={{ position: 'relative', fontSize: 'clamp(1.9rem,7vw,2.8rem)', fontWeight: 800, fontFamily: "'JetBrains Mono',monospace", color: T.textMain, letterSpacing: '-.03em' }}>
            <GhostTitle text="QUESTIONS FRÉQUENTES" />
            Questions <GreenUnderline><span className="text-gradient">fréquentes</span></GreenUnderline>
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
      <StatsSection />
      <TrustStacksMarquee />
      <ServicesPreview />
      <DomainesSection />
      <PricingCallout />
      <Process />
      <ProjectsSection />
      <GeoSectionHome />
      <ProjectFormHome />
      <FAQSectionHome />
      <ConversionMarquee />
      <Testimonials />
      <PageCTA message="Comme eux, donnez à votre activité la présence digitale qu'elle mérite." cta="Rejoindre nos clients" />
    </div>
  )
}