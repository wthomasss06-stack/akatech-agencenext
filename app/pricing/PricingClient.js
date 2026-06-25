'use client'
import { useRef, useState, useEffect } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Check, Zap, Timer, AlertTriangle, MessageCircle, HelpCircle, ChevronDown, Star, ArrowRight, FileText, Lock, Clock, GraduationCap, Wrench, Globe } from 'lucide-react'
import { useTheme } from '@/lib/theme'
import { SectionEye, GreenUnderline } from '@/components/ui/index'
import AuroraHero from '@/components/ui/AuroraHero'
import { TESTIMONIALS, FAQ_ITEMS } from '@/lib/data'

/* ─── BlurReveal ─────────────────────────────────────────── */
function BlurReveal({ children, delay = 0, direction = 'up', style = {}, once = true }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once, margin: '-60px' })
  const dirMap = { up: { y: 40, x: 0 }, right: { y: 0, x: 40 }, down: { y: -40, x: 0 }, left: { y: 0, x: -40 } }
  const off = dirMap[direction] || { y: 40, x: 0 }
  return (
    <motion.div ref={ref} style={style}
      initial={{ opacity: 0, filter: 'blur(12px)', ...off }}
      animate={inView ? { opacity: 1, filter: 'blur(0px)', x: 0, y: 0 } : {}}
      transition={{ duration: 0.85, ease: [0.2, 0.8, 0.2, 1], delay }}>
      {children}
    </motion.div>
  )
}

/* ─── LetterReveal ───────────────────────────────────────── */
function LetterReveal({ text, stagger = 0.028 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })
  return (
    <span ref={ref} style={{ display: 'inline' }}>
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

/* ─── StickyCTABlock ─────────────────────────────────────── */
function StickyCTABlock({ message, cta, href = 'https://wa.me/2250142507750', variant = 'default', zIndex = 2, rounded = false }) {
  const T = useTheme()
  const ref = useRef(null)
  const inView = useInView(ref, { once: false, margin: '-20%' })
  const isStrong = variant === 'strong'
  const bg = isStrong ? (T.light ? '#f0fdf4' : '#061a0a') : (T.light ? '#ffffff' : '#051208')
  return (
    <div ref={ref} style={{ position: 'sticky', top: 0, zIndex, background: bg, borderRadius: rounded ? '28px 28px 0 0' : 0, boxShadow: rounded ? '0 -24px 60px rgba(0,0,0,.28)' : 'none', overflow: 'hidden', minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '5rem 5%' }}>
      <div className="grid-bg" style={{ position: 'absolute', inset: 0, opacity: T.light ? .3 : .15 }} />
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 700, height: 400, borderRadius: '50%', background: isStrong ? 'radial-gradient(ellipse,rgba(136,202,83,.12),transparent 65%)' : 'radial-gradient(ellipse,rgba(136,202,83,.06),transparent 65%)', pointerEvents: 'none' }} />
      <motion.div initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }} animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}} transition={{ duration: .8, ease: [.22,1,.36,1] }}
        style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: 700 }}>
        {isStrong && (
          <motion.div initial={{ opacity: 0, scale: .9 }} animate={inView ? { opacity: 1, scale: 1 } : {}} transition={{ delay: .1 }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '.5rem', padding: '.3rem .9rem', borderRadius: 100, background: 'rgba(136,202,83,.1)', border: '1px solid rgba(136,202,83,.25)', marginBottom: '1.5rem', backdropFilter: 'blur(8px)' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#88ca53', animation: 'dot-blink 1.4s ease-in-out infinite' }} />
            <span style={{ fontFamily: "'Syne',sans-serif", fontSize: '.65rem', fontWeight: 700, color: '#88ca53', letterSpacing: '.1em', textTransform: 'uppercase' }}>Prêt à démarrer ?</span>
          </motion.div>
        )}
        <motion.p initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: .15 }}
          style={{ fontSize: isStrong ? 'clamp(1.5rem,3.2vw,2.4rem)' : 'clamp(1.2rem,2.5vw,1.8rem)', fontWeight: 800, fontFamily: "'Syne',sans-serif", color: T.textMain, letterSpacing: '-.03em', lineHeight: 1.3, marginBottom: '2rem' }}>
          {message}
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: .28 }}
          style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem' }}>
          <a href={href} target="_blank" rel="noreferrer" className="btn-raised" style={{ fontSize: '1rem', padding: '1rem 2.2rem' }}>
            {cta} <ArrowRight size={16} />
          </a>
        </motion.div>
      </motion.div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────
   PRICING — synchronisé depuis PRICING_TABS dans App.jsx
   Champs : badge, price, del (livraison), features, popular
───────────────────────────────────────────────────────── */
const PRICING = {
  portfolio: {
    label: 'Portfolio',
    plans: [
      {
        badge: 'STARTER', price: '100 000 FCFA', del: '3 à 5 jours',
        features: ['3 pages', 'Design responsive', 'Section projets', 'Formulaire contact',
          'Nom de domaine offert (1 an)', 'Hébergement inclus (1 an)'],
      },
      {
        badge: 'STANDARD', price: '175 000 FCFA', del: '5 à 7 jours', popular: true,
        features: ['5 pages', 'Animations modernes', 'Projets détaillés', 'SEO de base',
          'Nom de domaine offert (1 an)', 'Hébergement inclus (1 an)'],
      },
      {
        badge: 'PREMIUM', price: '275 000 FCFA', del: '7 à 10 jours',
        features: ['Design personnalisé', 'Animations avancées', 'Blog intégré',
          'Optimisation performance (SXO)', 'Nom de domaine offert (1 an)',
          'Hébergement inclus (1 an)', '1 mois support'],
      },
    ],
  },
  vitrine: {
    label: 'Site Vitrine',
    plans: [
      {
        badge: 'STARTER', price: '220 000 FCFA', del: '5 à 7 jours',
        features: ['5 pages', 'Design responsive', 'Formulaire contact', 'SEO de base',
          'Nom de domaine offert (1 an)', '1 mois support'],
      },
      {
        badge: 'PRO', price: '350 000 FCFA', del: '7 à 10 jours', popular: true,
        features: ['10 pages', 'Design premium', 'Blog intégré', 'SEO avancé (SEO + AEO)',
          'Nom de domaine offert (1 an)', 'Hébergement inclus (1 an)',
          '3 mois support', 'Formation 2h'],
      },
      {
        badge: 'ELITE', price: '550 000 FCFA', del: '10 à 14 jours',
        features: ['15 à 20 pages', 'Design sur mesure', 'CMS complet', 'SEO + AEO + GEO + Analytics',
          'Nom de domaine offert (1 an)', 'Hébergement inclus (1 an)',
          '6 mois support', 'Formation complète', 'Page supp. : 15 000 à 25 000 FCFA'],
      },
    ],
  },
  ecommerce: {
    label: 'E-commerce',
    plans: [
      {
        badge: 'STARTER', price: '450 000 FCFA', del: '14 jours',
        features: ["Jusqu'à 50 produits", 'Paiement Mobile Money', 'Gestion commandes',
          'Tableau de bord', 'Nom de domaine offert (1 an)',
          'Hébergement inclus (1 an)', '1 mois support'],
      },
      {
        badge: 'PRO', price: '750 000 FCFA', del: '21 jours', popular: true,
        features: ['200 à 500 produits', 'Multi-paiement', 'Gestion stock temps réel',
          'SEO produits + CRO + Analytics', 'Nom de domaine offert (1 an)', 'Hébergement inclus (1 an)',
          '3 mois support', 'Formation admin'],
      },
      {
        badge: 'ELITE', price: '1 200 000 FCFA', del: '30 jours',
        features: ['Produits illimités', 'API paiement personnalisée',
          'Optimisation IA (GEO)', 'Automatisations + Rapports avancés',
          'Nom de domaine offert (1 an)', 'Hébergement inclus (1 an)',
          '6 mois support', 'Formation équipe'],
      },
    ],
  },
  saas: {
    label: 'App Web / SaaS',
    plans: [
      {
        badge: 'SUR DEVIS', price: 'Étude personnalisée', del: 'Après diagnostic gratuit',
        features: ['Diagnostic gratuit de votre besoin', 'Authentification + rôles', 'API REST',
          'Dashboard sur mesure', 'Intégrations tierces (paiement, email…)', 'Multi-tenant (si besoin)',
          'Onboarding optimisé (CRO)', 'Déploiement cloud', 'Devis détaillé sous 48h',
          'Accompagnement post-lancement'],
      },
    ],
  },
  gbp: {
    label: 'Fiche Google',
    plans: [
      {
        badge: 'CRÉATION', price: '20 000 FCFA', del: '1 à 2 jours', popular: true,
        features: ['Création complète de zéro', 'Vérification infos (NAP)', 'Horaires + zone de service',
          'Catégorie + attributs', 'Lien vers le site web', 'Photos (logo, local, produits)',
          'Description optimisée SEO local', 'Mots-clés locaux ciblés', 'Intégration carte sur le site'],
      },
      {
        badge: 'OPTIMISATION', price: '12 000 FCFA', del: '1 jour',
        features: ['Correction fiche existante', 'Vérification infos (NAP)', 'Horaires + zone de service',
          'Catégorie + attributs', 'Photos (logo, local, produits)', 'Description optimisée SEO local',
          'Mots-clés locaux ciblés'],
      },
      {
        badge: 'SUIVI MENSUEL', price: '10 000 FCFA/mois', del: 'Continu',
        features: ['Réponse aux avis clients', 'Posts Google réguliers', 'Suivi statistiques de fiche'],
      },
    ],
  },
}



/* ── HERO ── */
function HeroPricing() {
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
      {/* Layer BG */}
      <div ref={layerBgRef} style={{ position: 'absolute', inset: '-8%', zIndex: 1, willChange: 'transform, filter', transition: 'transform .1s ease-out' }}>
        <AuroraHero labels={[]} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 20%, rgba(6,14,9,.95) 100%)' }} />
      </div>
      {/* Layer MID */}
      <div ref={layerMidRef} style={{ position: 'relative', zIndex: 10, maxWidth: 800, padding: '0 5%', textAlign: 'center', willChange: 'transform, opacity, filter', transition: 'transform .1s ease-out' }}>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .6 }}>
          <SectionEye label="// Tarifs" center />
          <h1 style={{ fontSize: 'clamp(2.4rem,5vw,3.8rem)', fontWeight: 800, fontFamily: "'Syne',sans-serif", color: 'rgba(255,255,255,.88)', letterSpacing: '-.04em', lineHeight: 1.1, marginBottom: '1rem' }}>
            Des offres claires,<br />
            <GreenUnderline><span className="text-gradient">pour chaque étape.</span></GreenUnderline>
          </h1>
          <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,.55)', lineHeight: 1.75, maxWidth: 540, margin: '0 auto 1.5rem' }}>
            Pas de frais cachés. Pas de jargon. Des prix honnêtes adaptés au marché africain, avec devis gratuit et sans engagement.
          </p>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '.6rem', padding: '.5rem 1.2rem', borderRadius: 100, background: 'rgba(136,202,83,.08)', border: '1px solid rgba(136,202,83,.2)' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#88ca53', animation: 'dot-blink 1.4s ease-in-out infinite' }} />
            <span style={{ fontFamily: "'Syne',sans-serif", fontSize: '.65rem', fontWeight: 600, color: T.green, letterSpacing: '.06em' }}>
              Paiement Mobile Money accepté
            </span>
          </div>
        </motion.div>
      </div>
      {/* Layer FORE — particules */}
      <div ref={layerForeRef} style={{ position: 'absolute', inset: 0, zIndex: 20, pointerEvents: 'none', willChange: 'transform, opacity', transition: 'transform .1s ease-out' }}>
        {[{left:'8%',top:'25%',s:4,op:.18,dur:3.8,dy:0},{left:'22%',top:'68%',s:3,op:.11,dur:5.1,dy:1.2},{left:'60%',top:'22%',s:4,op:.20,dur:4.4,dy:0.6},{left:'75%',top:'70%',s:3,op:.09,dur:6.2,dy:1.8},{left:'88%',top:'15%',s:4,op:.15,dur:3.2,dy:0.3}].map((p,i) => (
          <motion.div key={i} style={{ position:'absolute', width:p.s, height:p.s, borderRadius:'50%', background:'#88ca53', left:p.left, top:p.top, opacity:p.op }}
            animate={{ y:[0,-18,0] }} transition={{ duration:p.dur, repeat:Infinity, ease:'easeInOut', delay:p.dy }} />
        ))}
      </div>
    </section>
  )
}

/* ── GLASSMORPHISM PRICING TABS ── */
function PricingTabs() {
  const T = useTheme()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const [tab, setTab] = useState('vitrine')
  const d = PRICING[tab]

  return (
    <section ref={ref} style={{ padding: '2rem 5% 7rem', background: T.bg, position: 'relative', overflow: 'hidden' }}>
      <div aria-hidden style={{ position: 'absolute', top: '0', left: '50%', transform: 'translateX(-50%)', fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: 'clamp(80px,15vw,180px)', color: 'transparent', WebkitTextStroke: T.light ? '1px rgba(0,0,0,.06)' : '1px rgba(255,255,255,.04)', letterSpacing: '-0.05em', lineHeight: 1, pointerEvents: 'none', userSelect: 'none', whiteSpace: 'nowrap', zIndex: 0 }}>
        Pricing
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <BlurReveal>
            <SectionEye label="// Nos Offres" center />
          </BlurReveal>
          <BlurReveal delay={0.1}>
            <h2 style={{ fontSize: 'clamp(1.9rem,3.5vw,2.6rem)', fontWeight: 800, fontFamily: "'Syne',sans-serif", color: T.textMain, letterSpacing: '-.03em', marginBottom: '0.5rem' }}>
              Choisissez votre{' '}
              <GreenUnderline><span className="text-gradient"><LetterReveal text="formule idéale" stagger={0.035} /></span></GreenUnderline>
            </h2>
          </BlurReveal>
        </div>

        {/* Tabs */}
        <BlurReveal delay={0.15} style={{ display: 'flex', justifyContent: 'center', gap: '.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          {Object.entries(PRICING).map(([k, v]) => (
            <motion.button key={k} onClick={() => setTab(k)}
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              style={{ padding: '.55rem 1.4rem', borderRadius: 100, border: '1px solid', borderColor: tab === k ? T.green : T.border, background: tab === k ? 'linear-gradient(145deg,#8dd456,#5f9137)' : 'transparent', color: tab === k ? '#fff' : T.textSub, fontFamily: "'Syne',sans-serif", fontSize: '.82rem', fontWeight: 700, cursor: 'pointer', transition: 'all .22s' }}>
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
                      <div style={{ padding: '.5rem', background: 'linear-gradient(90deg,#5f9137,#88ca53)', textAlign: 'center', fontFamily: "'Syne',sans-serif", fontSize: '.6rem', fontWeight: 700, color: '#fff', letterSpacing: '.1em', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '.4rem', borderRadius: '19px 19px 0 0' }}>
                        <Zap size={10} />LE PLUS POPULAIRE
                      </div>
                    )}
                    <div style={{ padding: plan.popular ? '1.8rem 2rem 0' : 0, display: 'flex', flexDirection: 'column', flex: 1 }}>
                      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '50%', background: 'linear-gradient(180deg,rgba(255,255,255,.07) 0%,transparent 100%)', borderRadius: '20px 20px 0 0', pointerEvents: 'none' }} />
                      <div style={{ fontFamily: "'Syne',sans-serif", fontSize: '.65rem', fontWeight: 600, color: plan.popular ? '#88ca53' : T.textMuted, textTransform: 'uppercase', marginBottom: '.6rem' }}>{plan.badge}</div>
                      <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 'clamp(1.4rem,2.5vw,1.7rem)', fontWeight: 900, color: T.textMain, marginBottom: '.2rem', letterSpacing: '-0.02em', lineHeight: 1.1 }}>{plan.price}</div>
                      <div style={{ fontFamily: "'Syne',sans-serif", fontSize: '.62rem', color: T.textMuted, marginBottom: '1.6rem', display: 'flex', alignItems: 'center', gap: 4 }}>
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
              <p style={{ fontFamily: "'Syne',sans-serif", fontSize: '.72rem', color: T.textSub, letterSpacing: '.04em', margin: 0 }}>
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

/* ── ILS NOUS FONT CONFIANCE — carrousel infini ── */
// ═══════════════════════════════════════════════════════════════
// ── GARANTIES INCLUSES — strip de réassurance ────────────────
// ═══════════════════════════════════════════════════════════════
const GARANTIES = [
  { icon: FileText,      title: 'Devis 100% gratuit',      desc: 'Sans engagement, sous 24h'            },
  { icon: Lock,          title: 'Paiement sécurisé',        desc: 'MTN, Orange Money, Wave, virement'    },
  { icon: Zap,           title: 'Délais respectés',          desc: 'Date convenue, ou remboursement'      },
  { icon: GraduationCap, title: 'Formation incluse',         desc: 'Vous restez autonome après livraison' },
  { icon: Wrench,        title: 'Support 48h',               desc: 'Corrections & évolutions post-livraison' },
  { icon: Globe,         title: 'Adapté marché africain',    desc: 'Mobile Money, faible débit, FCFA'     },
]

function GuaranteeStrip() {
  const T = useTheme()
  return (
    <section style={{ padding: '5rem 5%', background: T.bgAlt, position: 'relative', overflow: 'hidden' }}>
      <style>{`@media(max-width:768px){.guarantee-grid{grid-template-columns:1fr !important}}`}</style>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <BlurReveal>
            <SectionEye label="// Ce qui est toujours inclus" center />
          </BlurReveal>
          <BlurReveal delay={0.1}>
            <h2 style={{ fontSize: 'clamp(1.6rem,3vw,2.2rem)', fontWeight: 800, fontFamily: "'Syne',sans-serif", color: T.textMain, letterSpacing: '-.03em' }}>
              Zéro surprise, <GreenUnderline><span className="text-gradient">zéro jargon.</span></GreenUnderline>
            </h2>
          </BlurReveal>
        </div>

        <div className="guarantee-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem' }}>
          {GARANTIES.map(({ icon: Icon, title, desc }, i) => (
            <BlurReveal key={title} delay={i * .07}>
              <motion.div
                whileHover={{ y: -5, borderColor: 'rgba(136,202,83,.35)' }}
                style={{ padding: '1.5rem', borderRadius: 16, background: T.light ? 'rgba(255,255,255,.8)' : 'rgba(255,255,255,.03)', border: `1px solid ${T.border}`, display: 'flex', alignItems: 'flex-start', gap: '1rem', transition: 'border-color .2s' }}
              >
                <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(136,202,83,.1)', border: '1px solid rgba(136,202,83,.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={20} style={{ color: '#88ca53' }} />
                </div>
                <div>
                  <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: '.88rem', color: T.textMain, marginBottom: '.25rem' }}>{title}</div>
                  <div style={{ fontFamily: "'Syne',sans-serif", fontSize: '.72rem', color: T.textMuted, lineHeight: 1.5 }}>{desc}</div>
                </div>
              </motion.div>
            </BlurReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function TrustedBy() {
  const T = useTheme()
  const items = [...TESTIMONIALS, ...TESTIMONIALS]

  return (
    <section style={{ padding: '7rem 0', background: T.bgAlt, position: 'relative', overflow: 'hidden' }}>
      <style>{`
        @keyframes scroll-left {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .carousel-track {
          display: flex;
          gap: 1.2rem;
          width: max-content;
          animation: scroll-left 32s linear infinite;
        }
        .carousel-track:hover { animation-play-state: paused; }
        .carousel-wrap {
          overflow: hidden;
          -webkit-mask: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
          mask: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
        }
        .tcard {
          flex-shrink: 0;
          width: 320px;
          border-radius: 20px;
          overflow: hidden;
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          padding: 1.8rem;
          position: relative;
        }
      `}</style>

      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 600, height: 400, borderRadius: '50%', background: 'radial-gradient(circle,rgba(136,202,83,.05),transparent 65%)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: 1200, margin: '0 auto', paddingBottom: '3.5rem', paddingLeft: '5%', paddingRight: '5%' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <BlurReveal>
            <SectionEye label="// Ils nous font confiance" center />
          </BlurReveal>
          <BlurReveal delay={0.1}>
            <h2 style={{ fontSize: 'clamp(1.8rem,3vw,2.5rem)', fontWeight: 800, fontFamily: "'Syne',sans-serif", color: T.textMain, letterSpacing: '-.03em' }}>
              Ce qu'ils disent de{' '}
              <GreenUnderline><span className="text-gradient"><LetterReveal text="l'investissement" stagger={0.04} /></span></GreenUnderline>
            </h2>
          </BlurReveal>
          <BlurReveal delay={0.2}>
            <p style={{ fontSize: '.9rem', color: T.textSub, maxWidth: 480, margin: '.8rem auto 0', lineHeight: 1.7 }}>
              Des entrepreneurs ivoiriens qui ont transformé leur présence digitale avec AKATech.
            </p>
          </BlurReveal>
        </div>
      </div>

      {/* Carrousel */}
      <div className="carousel-wrap">
        <div className="carousel-track">
          {items.map((t, i) => (
            <div key={i} className="tcard"
              style={{
                background: T.light ? 'rgba(255,255,255,.8)' : 'rgba(255,255,255,.04)',
                border: `1px solid ${T.light ? 'rgba(0,0,0,.08)' : 'rgba(255,255,255,.08)'}`,
                boxShadow: T.light ? '0 4px 24px rgba(0,0,0,.07)' : '0 8px 32px rgba(0,0,0,.4), inset 0 1px 0 rgba(255,255,255,.06)',
              }}>
              {/* Glass shine */}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg,transparent,rgba(255,255,255,.2),transparent)', pointerEvents: 'none' }} />

              {/* Stars */}
              <div style={{ display: 'flex', gap: 3, marginBottom: '1rem' }}>
                {[1,2,3,4,5].map(s => <Star key={s} size={14} fill="#88ca53" style={{ color: '#88ca53' }} />)}
              </div>

              {/* Quote */}
              <p style={{ fontSize: '.85rem', color: T.textSub, lineHeight: 1.75, fontStyle: 'italic', marginBottom: '1.5rem' }}>
                "{t.text}"
              </p>

              {/* Result badge */}
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '.4rem', padding: '.28rem .85rem', borderRadius: 99, background: 'rgba(136,202,83,.1)', border: '1px solid rgba(136,202,83,.25)', marginBottom: '1.4rem' }}>
                <span style={{ fontFamily: "'Syne',sans-serif", fontSize: '.65rem', fontWeight: 600, color: '#88ca53', fontWeight: 700 }}>{t.result}</span>
              </div>

              {/* Author */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '.85rem' }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', overflow: 'hidden', border: '2px solid rgba(136,202,83,.3)', flexShrink: 0, position: 'relative' }}>
                  <img src={t.img} alt={t.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={e => {
                      e.target.style.display = 'none'
                      e.target.parentNode.style.background = 'linear-gradient(135deg,rgba(136,202,83,.2),rgba(136,202,83,.05))'
                    }} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: T.textMain, fontFamily: "'Syne',sans-serif", fontSize: '.9rem' }}>{t.name}</div>
                  <div style={{ fontSize: '.7rem', color: T.textMuted, fontFamily: "'Syne',sans-serif", marginTop: '.1rem' }}>{t.role}</div>
                </div>
                <div style={{ marginLeft: 'auto', padding: '.28rem .7rem', borderRadius: 8, background: T.light ? 'rgba(0,0,0,.05)' : 'rgba(255,255,255,.05)', border: `1px solid ${T.border}` }}>
                  <div style={{ fontFamily: "'Syne',sans-serif", fontSize: '.6rem', color: T.textMuted }}>{t.project}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── FAQ ── */
function FAQSection() {
  const T = useTheme()
  const [open, setOpen] = useState(null)

  return (
    <section style={{ padding: '7rem 5%', background: T.bg, position: 'relative', overflow: 'hidden' }}>
      <div className="grid-bg" style={{ position: 'absolute', inset: 0, opacity: .15 }} />
      <div style={{ maxWidth: 800, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <BlurReveal>
            <SectionEye label="// FAQ" center />
          </BlurReveal>
          <BlurReveal delay={0.1}>
            <h2 style={{ fontSize: 'clamp(1.9rem,3.5vw,2.6rem)', fontWeight: 800, fontFamily: "'Syne',sans-serif", color: T.textMain, letterSpacing: '-.03em' }}>
              Questions{' '}
              <GreenUnderline><span className="text-gradient"><LetterReveal text="fréquentes" stagger={0.05} /></span></GreenUnderline>
            </h2>
          </BlurReveal>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '.75rem' }}>
          {FAQ_ITEMS.map(({ q, a }, i) => (
            <BlurReveal key={q} delay={i * 0.06} direction={i % 2 === 0 ? 'left' : 'right'}>
              <motion.div className="sku-card"
                whileHover={{ borderColor: 'rgba(136,202,83,.25)' }}
                style={{ overflow: 'hidden' }}>
                <button onClick={() => setOpen(open === i ? null : i)}
                  style={{ width: '100%', padding: '1.2rem 1.5rem', background: 'none', border: 'none', color: T.textMain, fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: '.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', textAlign: 'left' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '.6rem' }}>
                    <HelpCircle size={14} style={{ color: T.green, flexShrink: 0 }} />{q}
                  </span>
                  <motion.div animate={{ rotate: open === i ? 180 : 0 }} transition={{ duration: .25 }}>
                    <ChevronDown size={16} style={{ color: open === i ? T.green : T.textMuted, flexShrink: 0 }} />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {open === i && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: .3 }}
                      style={{ overflow: 'hidden' }}>
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

export default function PricingPage() {
  return (
    <div>
      <HeroPricing />
      <PricingTabs />

      {/* Sticky CTA entre pricing et testimonials */}
      <div style={{ position: 'relative' }}>
        <StickyCTABlock
          message="Un projet en tête ? Obtenez votre devis gratuit en moins de 24h."
          cta="Discuter sur WhatsApp"
          variant="default"
          zIndex={2}
        />
        <div style={{ position: 'relative', zIndex: 3 }}>
          <GuaranteeStrip />
          <TrustedBy />
        </div>
      </div>

      <FAQSection />

      <StickyCTABlock
        message="Vous avez encore des questions ? On répond en moins de 2h sur WhatsApp."
        cta="Nous contacter →"
        variant="strong"
        zIndex={2}
        rounded={true}
      />
    </div>
  )
}