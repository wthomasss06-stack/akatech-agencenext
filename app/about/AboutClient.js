'use client'
import { useRef, useState, useEffect } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Users, Monitor, Code, Check, Award, Heart, Globe, Zap, Star, Target, Rocket, MessageCircle, ExternalLink } from 'lucide-react'
import TrustStacksMarquee from '@/components/ui/TrustStacksMarquee'

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
import { GhostTitle, AnimatedCounter, LazyImg, GreenUnderline, PageCTA } from '@/components/ui/index'
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


/* ────────────────────────────────────────────────
   HERO
──────────────────────────────────────────────── */
function HeroAbout() {
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
    <section style={{ height: '100vh', minHeight: 640, position: 'relative', overflow: 'hidden', background: '#060e09' }}>
      <div ref={layerBgRef} style={{ position: 'absolute', inset: '-8%', zIndex: 1, willChange: 'transform, filter', transition: 'transform .1s ease-out' }}>
        <AuroraHero labels={[]} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 20%, rgba(6,14,9,.95) 100%)' }} />
      </div>

      {/* Titre géant bas-gauche + bloc texte centré verticalement à droite — gabarit hero "page title" (réf. Helious) */}
      <div ref={layerMidRef} className="hr-row" style={{ willChange: 'transform, opacity, filter', transition: 'transform .1s ease-out' }}>
        <motion.h1 className="hr-title" initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7, ease: 'easeOut' }}>
          <GhostTitle text="AKATECH" />
          AKATECH
          
        </motion.h1>

        <div className="hr-side">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .6, delay: .2 }}>
            <p className="hr-kicker">Votre croissance digitale</p>
            <p className="hr-desc"> c'est notre mission.</p>
          </motion.div>
        </div>
      </div>

      <div ref={layerForeRef} style={{ position: 'absolute', inset: 0, zIndex: 20, pointerEvents: 'none', willChange: 'transform, opacity', transition: 'transform .1s ease-out' }}>
        {[{left:'8%',top:'25%',s:4,op:.18,dur:3.8,dy:0},{left:'22%',top:'68%',s:3,op:.11,dur:5.1,dy:1.2},{left:'60%',top:'22%',s:4,op:.20,dur:4.4,dy:0.6},{left:'75%',top:'70%',s:3,op:.09,dur:6.2,dy:1.8},{left:'88%',top:'15%',s:4,op:.15,dur:3.2,dy:0.3}].map((p,i) => (
          <motion.div key={i} style={{ position:'absolute', width:p.s, height:p.s, borderRadius:'50%', background:'#88ca53', left:p.left, top:p.top, opacity:p.op }}
            animate={{ y:[0,-18,0] }} transition={{ duration:p.dur, repeat:Infinity, ease:'easeInOut', delay:p.dy }} />
        ))}
      </div>

      <style>{`
        .hr-row { position: relative; z-index: 10; height: 100%; }
        .hr-title {
          position: absolute; left: 8vw; bottom: 4.5rem; margin: 0;
          font-family: 'JetBrains Mono', monospace; font-weight: 800;
          font-size: clamp(4.5rem, 13vw, 15rem); line-height: .92; letter-spacing: -.04em;
          color: rgba(255,255,255,.95);
        }
        .hr-star {
          display: inline-block; position: relative; top: -.5em;
          margin-left: .15em; font-size: .3em; color: #88ca53;
        }
        .hr-side {
          position: absolute; right: 8vw; top: 0; bottom: 0;
          margin: auto 0; max-width: 360px; height: fit-content;
        }
        .hr-kicker {
          font-family: 'JetBrains Mono', monospace; font-size: .62rem; font-weight: 700;
          color: #88ca53; letter-spacing: .3em; text-transform: uppercase; margin: 0 0 .9rem;
        }
        .hr-desc { font-size: .95rem; color: rgba(255,255,255,.6); line-height: 1.7; margin: 0; }
      `}</style>
    </section>
  )
}


// ── ABOUT STATS SLIDE AUTO (miroir exact de App.jsx) ─────────
const ABOUT_STATS = [
  { target: 18,  suffix: '',  label: 'Projets',   sub: 'Livrés sur mesure, du concept au déploiement' },
  { target: 10,  suffix: '+', label: 'Clients',    sub: 'Particuliers, startups et PME accompagnés' },
  { target: 100, suffix: '%', label: 'Satisfaits', sub: 'Clients livrés dans les délais convenus' },
  { target: 12,  suffix: '',  label: 'En prod.',   sub: 'Applications actuellement en ligne' },
  { target: 3,   suffix: '+', label: 'Années',     sub: "D'expérience en développement web" },
  { target: 15,  suffix: '',  label: 'Outils',     sub: 'Technologies maîtrisées au quotidien' },
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
  const sectionRef = useRef(null)

  return (
    <section ref={sectionRef} style={{ padding: '7rem 5%', background: T.bgAlt, position: 'relative', overflow: 'hidden' }}>
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

        {/* h2 — au-dessus des 2 colonnes, aligné à gauche, même style que les autres sections */}
        <div style={{ maxWidth: 1200, margin: '0 auto 3rem', textAlign: 'left' }}>
          <BlurReveal delay={0.12}>
            <h2 className="section-title-big" style={{ position: 'relative', fontSize: 'clamp(2.8rem,5.5vw,4.4rem)', color: T.textMain }}>
              <GhostTitle text="MISSION & VISION" />
              Mission & <GreenUnderline><span className="text-gradient"><LetterReveal text="vision" stagger={0.05} /></span></GreenUnderline>
            </h2>
          </BlurReveal>
        </div>

      <div className="stats-founder-grid">

        {/* COLONNE GAUCHE — slide auto stats */}
        <BlurReveal direction="left">
          <AboutStatsSlide />
        </BlurReveal>

        {/* COLONNE DROITE — Fondateur (grande) */}
        <BlurReveal direction="right" delay={0.15}>
          <WordRevealP
            sectionRef={sectionRef}
            text="AKATech construit des solutions digitales pour les entrepreneurs et PME en Côte d'Ivoire qui veulent professionnaliser leur image, générer plus d'opportunités et automatiser leurs processus."
            greenWords={['AKATech', 'PME', "d'Ivoire", 'professionnaliser', 'automatiser']}
            extraStyle={{ color: T.textMain, marginBottom: '1rem', paddingLeft: 0, paddingRight: 0 }}
          />
          <WordRevealP
            sectionRef={sectionRef}
            text="Nous aidons les entreprises à transformer leur présence en ligne en véritable levier de croissance, avec des produits web clairs, performants et adaptés aux usages locaux."
            greenWords={['transformer', 'croissance', 'performants', 'locaux.']}
            extraStyle={{ color: T.textSub, marginBottom: '1rem', marginTop: '1rem', paddingLeft: 0, paddingRight: 0 }}
          />
          <WordRevealP
            sectionRef={sectionRef}
            text="Notre approche repose sur la fiabilité, la simplicité et l'impact concret."
            greenWords={['fiabilité,', 'simplicité', "l'impact", 'concret.']}
            extraStyle={{ color: T.textSub, marginBottom: '2rem', marginTop: '1rem', paddingLeft: 0, paddingRight: 0 }}
          />

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
                <ExternalLink size={11} /> Me contacter 
              </a>
            </div>
          </div>

          
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
      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* h2 — trait rouge, aligné à gauche */}
        <div style={{ textAlign: 'left', marginBottom: '4rem' }}>
          <BlurReveal delay={0.12}>
            <h2 className="section-title-big" style={{ position: 'relative', fontSize: 'clamp(2.8rem,5.5vw,4.4rem)', color: T.textMain }}>
              <GhostTitle text="L'ÉVOLUTION D'AKATECH" />
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
        {/* h2 — trait rouge, aligné à gauche */}
        <div style={{ textAlign: 'left', marginBottom: '4rem' }}>
          <BlurReveal delay={0.12}>
            <h2 className="section-title-big" style={{ position: 'relative', fontSize: 'clamp(2.8rem,5.5vw,4.4rem)', color: T.textMain }}>
              <GhostTitle text="CE QUI NOUS DISTINGUE" />
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
  const sectionRef = useRef(null)
  const inView = useInView(ref, { once: true })
  return (
    <section ref={el => { ref.current = el; sectionRef.current = el }} style={{ padding: '7rem 5%', background: T.bg, position: 'relative', overflow: 'hidden' }}>
      <div className="grid-bg" style={{ position: 'absolute', inset: 0, opacity: .2 }} />
      {/* h2 — au-dessus des 2 colonnes, aligné à gauche, même style que les autres sections */}
      <div style={{ maxWidth: 1200, margin: '0 auto 3rem', textAlign: 'left', position: 'relative', zIndex: 1 }}>
        <BlurReveal delay={0.12}>
          <h2 className="section-title-big" style={{ position: 'relative', fontSize: 'clamp(2.8rem,5.5vw,4.4rem)', color: T.textMain }}>
            <GhostTitle text="LES TECHNOLOGIES QUI FONT LA DIFFÉRENCE" />
            Les technologies qui font{' '}
            <GreenUnderline><span className="text-gradient"><LetterReveal text="la différence" stagger={0.035} /></span></GreenUnderline>
          </h2>
        </BlurReveal>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center', position: 'relative', zIndex: 1 }}>
        <BlurReveal direction="left">
          <WordRevealP
            sectionRef={sectionRef}
            text="J'utilise les meilleures technologies modernes — sélectionnées pour leur performance, leur fiabilité et leur adéquation avec vos besoins réels."
            greenWords={['meilleures', 'performance,', 'fiabilité', "besoins", 'réels.']}
            extraStyle={{ color: T.textSub, marginBottom: '2rem', paddingLeft: 0, paddingRight: 0 }}
          />
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
  const sectionRef = useRef(null)
  return (
    <section ref={sectionRef} style={{ padding: '7rem 5%', background: T.bgAlt, position: 'relative', overflow: 'hidden' }}>
      <div className="grid-bg" style={{ position: 'absolute', inset: 0, opacity: .18 }} />
      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'center' }}>
          <BlurReveal direction="left">
            <h2 className="section-title-big" style={{ position: 'relative', fontSize: 'clamp(2.8rem,5.5vw,4.4rem)', color: T.textMain, marginBottom: '1.2rem' }}>
              <GhostTitle text="OÙ INTERVENONS-NOUS ?" />
              Où intervenons-<GreenUnderline><span className="text-gradient">nous ?</span></GreenUnderline>
            </h2>
            <WordRevealP
              sectionRef={sectionRef}
              text="Basés à Abidjan, nous travaillons à distance avec des entrepreneurs à travers l'Afrique de l'Ouest et la diaspora. WhatsApp, Zoom, Notion — notre setup est fait pour ça."
              greenWords={['Abidjan,', "l'Afrique", "l'Ouest", 'diaspora.', 'WhatsApp,', 'Zoom,', 'Notion']}
              extraStyle={{ color: T.textSub, marginBottom: '2rem', paddingLeft: 0, paddingRight: 0 }}
            />
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
      <TrustStacksMarquee />
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