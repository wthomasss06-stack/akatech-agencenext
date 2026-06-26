'use client'
import { useRef, useState, useEffect } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Users, Monitor, Code, Check, Award, Heart, Globe, Zap, Star, Target, Rocket, MessageCircle, ExternalLink } from 'lucide-react'

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
function LetterReveal({ text, style = {}, stagger = 0.028 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })
  return (
    <span ref={ref} style={{ display: 'inline', ...style }}>
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

/* ─── TiltCard ───────────────────────────────────────────── */
function TiltCard({ children, style = {}, intensity = 12, perspective = 900 }) {
  const ref = useRef(null)
  const glowRef = useRef(null)
  const rafRef = useRef(null)
  const apply = (mx, my) => {
    const el = ref.current; if (!el) return
    const r = el.getBoundingClientRect()
    const rx = ((my - r.top - r.height / 2) / (r.height / 2)) * -intensity
    const ry = ((mx - r.left - r.width / 2) / (r.width / 2)) * intensity
    const px = ((mx - r.left) / r.width) * 100
    const py = ((my - r.top) / r.height) * 100
    cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(() => {
      el.style.transform = `perspective(${perspective}px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.03,1.03,1.03)`
      el.style.transition = 'transform .07s linear'
      if (glowRef.current) { glowRef.current.style.background = `radial-gradient(240px circle at ${px}% ${py}%,rgba(136,202,83,.12),transparent 65%)`; glowRef.current.style.opacity = '1' }
    })
  }
  const reset = () => {
    const el = ref.current; if (!el) return
    cancelAnimationFrame(rafRef.current)
    el.style.transition = 'transform .45s cubic-bezier(.25,.46,.45,.94)'
    el.style.transform = `perspective(${perspective}px) rotateX(0) rotateY(0) scale3d(1,1,1)`
    if (glowRef.current) glowRef.current.style.opacity = '0'
  }
  return (
    <div ref={ref} style={{ ...style, willChange: 'transform', transformStyle: 'preserve-3d', position: 'relative' }}
      onMouseMove={e => apply(e.clientX, e.clientY)} onMouseLeave={reset}>
      <div ref={glowRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, opacity: 0, transition: 'opacity .12s', borderRadius: 18 }} />
      <div style={{ position: 'relative', zIndex: 1, height: '100%' }}>{children}</div>
    </div>
  )
}

import { useTheme } from '@/lib/theme'
import { GhostTitle, AnimatedCounter, LazyImg, MarqueeStrip, GreenUnderline, PageCTA } from '@/components/ui/index'
import AuroraHero from '@/components/ui/AuroraHero'
import { STATS } from '@/lib/data'

const SKILLS = ['React','Next.js','Django','Python','Node.js','PostgreSQL','MySQL','Tailwind CSS','Framer Motion','Vercel','AWS','Docker','REST API','GraphQL','Mobile Money API']

const VALUES = [
  { icon: Target, title: 'Résultats concrets', desc: "Chaque solution est conçue pour générer des résultats mesurables : plus de clients, plus de revenus, moins de tâches manuelles." },
  { icon: Heart, title: 'Adapté au marché africain', desc: "Je comprends les réalités locales — Mobile Money, coupures internet, faible débit. Vos solutions fonctionnent dans votre contexte." },
  { icon: Zap, title: 'Livraison rapide', desc: "Pas d'attente de 3 mois. Les projets sont livrés en 5 à 21 jours selon la complexité, avec des jalons clairs à chaque étape." },
  { icon: Star, title: 'Qualité premium', desc: "Code propre, design sur-mesure, animations soignées. Chaque détail compte pour que votre solution se démarque." },
]

const TIMELINE = [
  { year: '2022', title: 'Les débuts', desc: "Premier projet freelance livré : un site vitrine pour un commerçant abidjanais. Le début d'une aventure." },
  { year: '2023', title: 'Premières applications métier', desc: "Développement de LivreurTrack Pro et MonCashJour, des outils de gestion pensés pour les commerçants et livreurs locaux." },
  { year: '2024', title: 'AKATech Agence', desc: "Transformation en agence officielle. Lancement de services structurés et premiers clients récurrents." },
  { year: '2025', title: "Aujourd'hui", desc: "+18 projets livrés, 100% de clients satisfaits. L'agence continue de grandir et d'innover." },
]

// ── 1. HERO ──────────────────────────────────────────────────
function HeroAbout() {
  const T = useTheme()
  return (
    <section style={{ height: '100vh', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', background: T.bg }}>
      <style>{`
        .hero-about-grid {
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
          display: grid;
          grid-template-columns: 1fr 1fr;
          align-items: center;
        }
        .hero-title-block  { grid-column: 1; }
        .hero-photos-block { grid-column: 2; }
        @media (max-width: 768px) {
          .hero-about-grid { display: flex; flex-direction: column; gap: 2rem; }
          .hero-title-block  { order: 1; }
          .hero-photos-block { order: 2; }
          .hero-photo-grid   { grid-template-rows: 220px 160px !important; }
        }
      `}</style>
      <div style={{ position: 'absolute', inset: '-8%', zIndex: 1 }}>
        <AuroraHero labels={[]} />
        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to bottom, transparent 20%, ${T.bg} 100%)`, opacity: T.light ? 1 : .95 }} />
      </div>
      <div style={{ position: 'relative', zIndex: 10, width: '100%', padding: '9rem 5% 6rem' }}>
        <div className="hero-about-grid">
          <motion.div className="hero-title-block"
            initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: .7, ease: [.22,1,.36,1] }}>
            <h1 style={{ position: 'relative', fontSize: 'clamp(2.2rem,4.5vw,3.5rem)', fontWeight: 800, fontFamily: "'JetBrains Mono',monospace", color: T.textMain, letterSpacing: '-.04em', lineHeight: 1.1, marginBottom: '1rem' }}>
              <GhostTitle text="Votre croissance digitale, c'est notre mission." />
              Votre croissance digitale,<br />
              <GreenUnderline><span className="text-gradient">c'est notre mission.</span></GreenUnderline>
            </h1>
          </motion.div>
          <motion.div className="hero-photos-block"
            initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: .7, delay: .2 }}>
            <div className="hero-photo-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '280px 200px', gap: '1rem' }}>
              <motion.div whileHover={{ scale: 1.02 }} style={{ gridRow: '1 / 3', borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(136,202,83,.2)', boxShadow: '8px 8px 32px rgba(0,0,0,.3)' }}>
                <LazyImg src="/images/about-1.webp" alt="AKATech Team" style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  placeholder={<div style={{ height: '100%', background: 'linear-gradient(135deg,#0a1a0e,#060e09)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Users size={32} style={{ color: 'rgba(136,202,83,.3)' }} /></div>} />
              </motion.div>
              <motion.div whileHover={{ scale: 1.03 }} style={{ borderRadius: 14, overflow: 'hidden', border: '1px solid rgba(136,202,83,.15)', boxShadow: '6px 6px 24px rgba(0,0,0,.2)' }}>
                <LazyImg src="/images/about-2.webp" alt="Bureau" style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  placeholder={<div style={{ height: '100%', background: 'linear-gradient(135deg,#0a1a0e,#060e09)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Monitor size={28} style={{ color: 'rgba(136,202,83,.3)' }} /></div>} />
              </motion.div>
              <motion.div whileHover={{ scale: 1.03 }} style={{ borderRadius: 14, overflow: 'hidden', border: '1px solid rgba(136,202,83,.15)', boxShadow: '6px 6px 24px rgba(0,0,0,.2)' }}>
                <LazyImg src="/images/about-3.webp" alt="Développement" style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  placeholder={<div style={{ height: '100%', background: 'linear-gradient(135deg,#0a1a0e,#060e09)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Code size={28} style={{ color: 'rgba(136,202,83,.3)' }} /></div>} />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// ── ABOUT STATS SLIDE AUTO (miroir exact de App.jsx) ─────────
const ABOUT_STATS = [
  { target: 18, suffix: '',  label: 'Projets',  sub: 'Livrés sur mesure, du concept au déploiement' },
  { target: 3,  suffix: '+', label: 'Années',   sub: "D'expérience en développement web" },
  { target: 12, suffix: '',  label: 'En prod.', sub: 'Applications actuellement en ligne' },
  { target: 15, suffix: '',  label: 'Outils',   sub: 'Technologies maîtrisées au quotidien' },
  { target: 10, suffix: '+', label: 'Clients',  sub: 'Particuliers, startups et PME accompagnés' },
]
const SLIDE_MS = 4000

function AboutStatNumber({ target, suffix }) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    setVal(0)
    const dur = 900
    const start = performance.now()
    let raf
    const step = (now) => {
      const p = Math.min(1, (now - start) / dur)
      const eased = 1 - Math.pow(1 - p, 3)
      setVal(Math.round(eased * target))
      if (p < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [target])
  return <span>{val}{suffix}</span>
}

function AboutStatsSlide() {
  const T = useTheme()
  const [i, setI] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setI(v => (v + 1) % ABOUT_STATS.length), SLIDE_MS)
    return () => clearInterval(id)
  }, [])
  const cur = ABOUT_STATS[i]
  return (
    <div style={{
      position: 'sticky', top: '14vh',
      display: 'flex', flexDirection: 'column', gap: '1.4rem',
      paddingTop: '.4rem',
      borderTop: '1px solid rgba(136,202,83,.18)',
    }}>
      {/* compteur */}
      <div>
        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.65rem', letterSpacing: '.15em', color: T.textMuted, opacity: .6 }}>
          {String(i + 1).padStart(2, '0')}/{String(ABOUT_STATS.length).padStart(2, '0')}
        </span>
      </div>
      {/* chiffre */}
      <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '.3rem', minHeight: 92, animation: 'aboutStatIn .45s cubic-bezier(.22,1,.36,1)' }}>
        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 'clamp(2.6rem,4vw,3.4rem)', fontWeight: 800, lineHeight: 1, color: T.textMain, letterSpacing: '-.02em' }}>
          <AboutStatNumber target={cur.target} suffix={cur.suffix} />
        </span>
        <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.85rem', fontWeight: 700, letterSpacing: '.04em', color: T.textMain, margin: 0 }}>{cur.label}</p>
        <p style={{ fontSize: '.74rem', lineHeight: 1.5, color: T.textMuted, opacity: .75, margin: 0, maxWidth: 190 }}>{cur.sub}</p>
      </div>
      {/* barre de progression */}
      <div style={{ width: '100%', height: 2, borderRadius: 2, background: 'rgba(136,202,83,.16)', overflow: 'hidden', marginTop: '.4rem' }}>
        <span key={i} style={{
          display: 'block', height: '100%', width: '100%',
          background: '#88ca53',
          transformOrigin: 'left center',
          transform: 'scaleX(0)',
          animation: `aboutStatsProgress ${SLIDE_MS}ms linear forwards`,
        }} />
      </div>
      <style>{`
        @keyframes aboutStatIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        @keyframes aboutStatsProgress { from { transform:scaleX(0); } to { transform:scaleX(1); } }
      `}</style>
    </div>
  )
}

// ── 2. STATS + FONDATEUR (220px / 1fr) ───────────────────────
function StatsFounderSection() {
  const T = useTheme()

  return (
    <section style={{ padding: '7rem 5%', background: T.bgAlt, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 700, height: 400, borderRadius: '50%', background: 'radial-gradient(ellipse,rgba(136,202,83,.05),transparent 65%)', pointerEvents: 'none' }} />
      <style>{`
        .stats-founder-grid {
          display: grid;
          grid-template-columns: 220px 1fr;
          gap: clamp(2.5rem,6vw,5rem);
          align-items: start;
          max-width: 1200px;
          margin: 0 auto;
        }
        @media(max-width:900px) {
          .stats-founder-grid { grid-template-columns: 1fr; gap: 3rem; }
          .stats-founder-grid .about-stats-sticky { position: static !important; top: auto; }
        }
      `}</style>

      <div className="stats-founder-grid">

        {/* COLONNE GAUCHE — slide auto stats */}
        <BlurReveal direction="left">
          <AboutStatsSlide />
        </BlurReveal>

        {/* COLONNE DROITE — Fondateur (grande) */}
        <BlurReveal direction="right" delay={0.15}>
          <h2 style={{ position: 'relative', fontSize: 'clamp(1.8rem,3vw,2.6rem)', fontWeight: 800, fontFamily: "'JetBrains Mono',monospace", color: T.textMain, letterSpacing: '-.03em', marginBottom: '1.5rem' }}>
            <GhostTitle text="M'Bollo Aka Elvis" />
            M'Bollo Aka <GreenUnderline><span className="text-gradient"><LetterReveal text="Elvis" stagger={0.05} /></span></GreenUnderline>
          </h2>
          <p style={{ fontSize: '1.05rem', color: T.textMain, lineHeight: 1.85, marginBottom: '.9rem' }}>
            <strong style={{ color: T.textMain }}>AKATech</strong> construit des solutions digitales pour les entrepreneurs et PME en Côte d'Ivoire qui veulent professionnaliser leur image, générer plus d'opportunités et automatiser leurs processus.
          </p>
          <p style={{ fontSize: '1.05rem', color: T.textSub, lineHeight: 1.85, marginBottom: '.9rem' }}>
            Nous aidons les entreprises à transformer leur présence en ligne en véritable levier de croissance, avec des produits web clairs, performants et adaptés aux usages locaux.
          </p>
          <p style={{ fontSize: '1rem', color: T.textSub, lineHeight: 1.85, marginBottom: '2rem' }}>
            Notre approche repose sur la <strong style={{ color: T.textMain }}>fiabilité</strong>, la <strong style={{ color: T.textMain }}>simplicité</strong> et l'<strong style={{ color: T.textMain }}>impact concret</strong>.
          </p>

          {/* Photo + identité + portfolio */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', padding: '1.2rem 1.4rem', borderRadius: 16, background: 'rgba(136,202,83,.06)', border: '1px solid rgba(136,202,83,.2)', marginBottom: '1.8rem' }}>
            <div style={{ width: 60, height: 60, borderRadius: '50%', overflow: 'hidden', flexShrink: 0, border: '2px solid rgba(136,202,83,.5)', boxShadow: '0 0 16px rgba(136,202,83,.2)' }}>
              <LazyImg
                src="/images/founder.webp"
                alt="M'Bollo Aka Elvis"
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 10%' }}
                placeholder={<div style={{ width: 60, height: 60, background: 'rgba(136,202,83,.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#88ca53', fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, fontSize: '1.2rem' }}>E</div>}
              />
            </div>
            <div>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 800, fontSize: '.95rem', color: T.textMain, marginBottom: '.2rem' }}>M'Bollo Aka Elvis</div>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.62rem', color: T.textMuted, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: '.55rem' }}>Développeur Full-Stack · Fondateur, AKATech</div>
              <a href="https://mbolloaka-dev.vercel.app/" target="_blank" rel="noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '.35rem', fontFamily: "'JetBrains Mono',monospace", fontSize: '.7rem', fontWeight: 700, color: '#88ca53', textDecoration: 'none', padding: '.25rem .7rem', borderRadius: 100, background: 'rgba(136,202,83,.1)', border: '1px solid rgba(136,202,83,.3)', transition: 'all .2s' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(136,202,83,.2)'; e.currentTarget.style.borderColor = '#88ca53' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(136,202,83,.1)'; e.currentTarget.style.borderColor = 'rgba(136,202,83,.3)' }}>
                <ExternalLink size={11} /> Voir son portfolio
              </a>
            </div>
          </div>

          <a href="https://wa.me/2250142507750" target="_blank" rel="noreferrer" className="btn-raised">
            Me contacter <MessageCircle size={16} />
          </a>
        </BlurReveal>
      </div>
    </section>
  )
}

// ── 3. HISTOIRE ──────────────────────────────────────────────
function TimelineSection() {
  const T = useTheme()
  return (
    <section style={{ padding: '7rem 5%', background: T.bg, position: 'relative' }}>
      <div className="grid-bg" style={{ position: 'absolute', inset: 0, opacity: .2 }} />
      <div style={{ maxWidth: 900, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <BlurReveal delay={0.12}>
            <h2 style={{ position: 'relative', fontSize: 'clamp(1.9rem,3.5vw,2.6rem)', fontWeight: 800, fontFamily: "'JetBrains Mono',monospace", color: T.textMain, letterSpacing: '-.03em' }}>
              <GhostTitle text="L'évolution d'AKATech" />
              L'évolution d'<GreenUnderline><span className="text-gradient"><LetterReveal text="AKATech" stagger={0.05} /></span></GreenUnderline>
            </h2>
          </BlurReveal>
        </div>
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, background: `linear-gradient(to bottom, transparent, ${T.green}, transparent)`, transform: 'translateX(-50%)' }} />
          {TIMELINE.map(({ year, title, desc }, i) => (
            <BlurReveal key={year} delay={i * 0.15} direction={i % 2 === 0 ? 'left' : 'right'}>
              <div style={{ display: 'flex', justifyContent: i % 2 === 0 ? 'flex-start' : 'flex-end', marginBottom: '3rem', position: 'relative' }}>
                <div style={{ position: 'absolute', left: '50%', top: '1.2rem', transform: 'translateX(-50%)', width: 14, height: 14, borderRadius: '50%', background: '#88ca53', border: '3px solid rgba(136,202,83,.3)', boxShadow: '0 0 16px rgba(136,202,83,.4)', zIndex: 1 }} />
                <motion.div className="sku-card" whileHover={{ y: -4, scale: 1.01 }} style={{ width: '44%', padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: 0, right: 0, width: 60, height: 60, background: 'radial-gradient(circle at 100% 0%,rgba(136,202,83,.1),transparent 70%)', pointerEvents: 'none' }} />
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.9rem', fontWeight: 800, color: T.green, letterSpacing: '.08em', marginBottom: '.5rem' }}>{year}</div>
                  <h3 style={{ fontSize: '.95rem', fontWeight: 700, color: T.textMain, fontFamily: "'JetBrains Mono',monospace", marginBottom: '.4rem' }}><LetterReveal text={title} stagger={0.03} /></h3>
                  <p style={{ fontSize: '.8rem', color: T.textSub, lineHeight: 1.6 }}>{desc}</p>
                </motion.div>
              </div>
            </BlurReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── 4. VALEURS ───────────────────────────────────────────────
function ValuesSection() {
  const T = useTheme()
  const dirs = ['right', 'up', 'left', 'up']
  return (
    <section style={{ padding: '7rem 5%', background: T.bgAlt, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', right: '-2%', top: '50%', transform: 'translateY(-50%)', fontFamily: "'JetBrains Mono',monospace", fontSize: 'clamp(10rem,18vw,18rem)', fontWeight: 900, color: T.light ? 'rgba(136,202,83,.04)' : 'rgba(136,202,83,.03)', lineHeight: 1, pointerEvents: 'none', userSelect: 'none' }}>VALUES</div>
      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <BlurReveal delay={0.12}>
            <h2 style={{ position: 'relative', fontSize: 'clamp(1.9rem,3.5vw,2.6rem)', fontWeight: 800, fontFamily: "'JetBrains Mono',monospace", color: T.textMain, letterSpacing: '-.03em' }}>
              <GhostTitle text="Ce qui nous distingue" />
              Ce qui nous <GreenUnderline><span className="text-gradient"><LetterReveal text="distingue" stagger={0.04} /></span></GreenUnderline>
            </h2>
          </BlurReveal>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: '1.2rem' }}>
          {VALUES.map(({ icon: Icon, title, desc }, i) => (
            <BlurReveal key={title} delay={i * 0.1} direction={dirs[i % dirs.length]}>
              <motion.div className="sku-card" whileHover={{ y: -5 }} style={{ padding: '2rem', height: '100%', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, right: 0, width: 80, height: 80, background: 'radial-gradient(circle at 100% 0%,rgba(136,202,83,.1),transparent 70%)', pointerEvents: 'none' }} />
                <div style={{ width: 52, height: 52, borderRadius: 14, background: 'rgba(136,202,83,.1)', border: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.2rem' }}>
                  <Icon size={24} style={{ color: T.green }} />
                </div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: T.textMain, fontFamily: "'JetBrains Mono',monospace", marginBottom: '.5rem' }}><LetterReveal text={title} stagger={0.025} /></h3>
                <p style={{ fontSize: '.82rem', color: T.textSub, lineHeight: 1.65 }}>{desc}</p>
              </motion.div>
            </BlurReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── 5. STACK TECHNIQUE ───────────────────────────────────────
function SkillsSection() {
  const T = useTheme()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  return (
    <section ref={ref} style={{ padding: '7rem 5%', background: T.bg, position: 'relative', overflow: 'hidden' }}>
      <div className="grid-bg" style={{ position: 'absolute', inset: 0, opacity: .2 }} />
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center', position: 'relative', zIndex: 1 }}>
        <BlurReveal direction="left">
          <h2 style={{ position: 'relative', fontSize: 'clamp(1.8rem,3vw,2.4rem)', fontWeight: 800, fontFamily: "'JetBrains Mono',monospace", color: T.textMain, letterSpacing: '-.03em', marginBottom: '1.2rem' }}>
            <GhostTitle text="Les technologies qui font la différence" />
            Les technologies qui font{' '}
            <GreenUnderline><span className="text-gradient"><LetterReveal text="la différence" stagger={0.035} /></span></GreenUnderline>
          </h2>
          <p style={{ fontSize: '.9rem', color: T.textSub, lineHeight: 1.8, marginBottom: '2rem' }}>
            J'utilise les meilleures technologies modernes — sélectionnées pour leur performance, leur fiabilité et leur adéquation avec vos besoins réels.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.5rem' }}>
            {SKILLS.map((s, i) => (
              <motion.span key={s} initial={{ opacity: 0, y: 8 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: .3 + i * .04 }}
                whileHover={{ y: -2, background: 'rgba(136,202,83,.15)' }}
                style={{ padding: '.35rem .85rem', background: 'rgba(136,202,83,.07)', border: `1px solid ${T.border}`, borderRadius: 100, fontFamily: "'JetBrains Mono',monospace", fontSize: '.65rem', fontWeight: 600, color: T.green, letterSpacing: '.06em', cursor: 'default', transition: 'all .2s' }}>
                {s}
              </motion.span>
            ))}
          </div>
        </BlurReveal>
        <BlurReveal direction="right" delay={0.2}>
          <TiltCard intensity={10} style={{ borderRadius: 16 }}>
            <div style={{ borderRadius: 16, overflow: 'hidden', border: `1px solid ${T.border}`, boxShadow: '8px 8px 32px rgba(0,0,0,.3)', height: 400 }}>
              <LazyImg src="/images/about-4.webp" alt="Développeur" style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                placeholder={<div style={{ height: '100%', background: 'linear-gradient(135deg,#0a1a0e,#060e09)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Code size={48} style={{ color: 'rgba(136,202,83,.3)' }} /></div>} />
            </div>
          </TiltCard>
        </BlurReveal>
      </div>
    </section>
  )
}

// ── 6. RAYON D'ACTION ────────────────────────────────────────
const PAYS = [
  { code: 'CI', name: "Côte d'Ivoire", note: 'Siège — Abidjan', primary: true  },
  { code: 'SN', name: 'Sénégal',       note: 'Clients actifs'                   },
  { code: 'CM', name: 'Cameroun',      note: 'Clients actifs'                   },
  { code: 'BJ', name: 'Bénin',         note: 'Projets livrés'                   },
  { code: 'BF', name: 'Burkina Faso',  note: 'Projets livrés'                   },
  { code: 'FR', name: 'France',        note: 'Diaspora africaine'               },
]

function FlagBadge({ code, primary }) {
  const colors = {
    CI: ['#f77f00', '#fff',     '#009a44'],
    SN: ['#00853f', '#fdef42',  '#e31b23'],
    CM: ['#007a5e', '#ce1126',  '#fcd116'],
    BJ: ['#008751', '#fcd116',  '#e8112d'],
    BF: ['#ef2b2d', '#009a44',  '#fcd116'],
    FR: ['#002395', '#fff',     '#ed2939'],
  }
  const [c1, c2, c3] = colors[code] || ['#88ca53', '#fff', '#88ca53']
  return (
    <div style={{ width: 36, height: 36, borderRadius: 10, overflow: 'hidden', flexShrink: 0, border: primary ? '1.5px solid rgba(136,202,83,.5)' : '1px solid rgba(255,255,255,.12)', display: 'flex', flexDirection: 'column', boxShadow: primary ? '0 0 10px rgba(136,202,83,.2)' : '0 2px 8px rgba(0,0,0,.2)' }}>
      <div style={{ flex: 1, background: c1 }} />
      <div style={{ flex: 1, background: c2 }} />
      <div style={{ flex: 1, background: c3 }} />
    </div>
  )
}

function RayonSection() {
  const T = useTheme()
  return (
    <section style={{ padding: '7rem 5%', background: T.bgAlt, position: 'relative', overflow: 'hidden' }}>
      <div className="grid-bg" style={{ position: 'absolute', inset: 0, opacity: .18 }} />
      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'center' }}>
          <BlurReveal direction="left">
            <h2 style={{ position: 'relative', fontSize: 'clamp(1.9rem,3.5vw,2.6rem)', fontWeight: 800, fontFamily: "'JetBrains Mono',monospace", color: T.textMain, letterSpacing: '-.03em', lineHeight: 1.2, marginBottom: '1.2rem' }}>
              <GhostTitle text="Où intervenons-nous ?" />
              Où intervenons-<GreenUnderline><span className="text-gradient">nous ?</span></GreenUnderline>
            </h2>
            <p style={{ fontSize: '.9rem', color: T.textSub, lineHeight: 1.8, marginBottom: '2rem' }}>
              Basés à <strong style={{ color: T.textMain }}>Abidjan</strong>, nous travaillons à distance avec des entrepreneurs à travers l'Afrique de l'Ouest et la diaspora. WhatsApp, Zoom, Notion — notre setup est fait pour ça.
            </p>
            <div style={{ display: 'flex', gap: '.75rem', flexWrap: 'wrap' }}>
              {['100% remote', 'WhatsApp & Zoom', 'Suivi en temps réel', 'FCFA & EUR'].map(b => (
                <span key={b} style={{ padding: '.3rem .85rem', borderRadius: 100, background: 'rgba(136,202,83,.08)', border: '1px solid rgba(136,202,83,.2)', fontFamily: "'JetBrains Mono',monospace", fontSize: '.7rem', fontWeight: 600, color: '#88ca53' }}>{b}</span>
              ))}
            </div>
          </BlurReveal>
          <BlurReveal direction="right" delay={0.15}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.85rem' }}>
              {PAYS.map(({ code, name, note, primary }, i) => (
                <motion.div key={name}
                  initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  transition={{ delay: i * .06, duration: .45, ease: [.22,1,.36,1] }}
                  whileHover={{ y: -4 }}
                  style={{ padding: '1.1rem 1.2rem', borderRadius: 14, background: primary ? 'linear-gradient(135deg, rgba(136,202,83,.14), rgba(136,202,83,.05))' : (T.light ? 'rgba(0,0,0,.03)' : 'rgba(255,255,255,.03)'), border: `1px solid ${primary ? 'rgba(136,202,83,.35)' : T.border}`, display: 'flex', alignItems: 'center', gap: '.8rem', position: 'relative', overflow: 'hidden' }}>
                  {primary && <div style={{ position: 'absolute', top: 0, right: 0, width: 60, height: 60, background: 'radial-gradient(circle at 100% 0%,rgba(136,202,83,.12),transparent 70%)', pointerEvents: 'none' }} />}
                  <FlagBadge code={code} primary={primary} />
                  <div>
                    <div style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, fontSize: '.82rem', color: primary ? '#88ca53' : T.textMain }}>{name}</div>
                    <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.62rem', color: T.textMuted }}>{note}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </BlurReveal>
        </div>
      </div>
      <style>{`@media(max-width:768px){.rayon-grid{grid-template-columns:1fr !important;gap:2rem !important}}`}</style>
    </section>
  )
}

// ── PAGE ─────────────────────────────────────────────────────
export default function AboutPage() {
  return (
    <div>
      {/* 1 */ }<HeroAbout />
      {/* 2 */}<StatsFounderSection />
      {/* 3 */}<TimelineSection />
      <MarqueeStrip />
      {/* 4 */}<ValuesSection />
      {/* 5 */}<SkillsSection />
      {/* 6 */}<RayonSection />

      <PageCTA
        message="Prêt à collaborer avec AKATech ? Discutons de votre projet dès maintenant."
        cta="Démarrer un projet"
      />
    </div>
  )
}
