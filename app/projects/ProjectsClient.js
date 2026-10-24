'use client'
import { useRef, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '@/lib/theme'
import { useLanguage } from '@/lib/language'
import ProjectScrollShowcase from '@/components/ui/ProjectScrollShowcase'
import { LazyImg, GreenUnderline, UnderlinedTitle } from '@/components/ui/index'
import AuroraHero from '@/components/ui/AuroraHero'
import { cld } from '@/lib/cloudinary'
import { PROJECTS, getLocalizedData } from '@/lib/data'


/* ────────────────────────────────────────────────
   HERO
──────────────────────────────────────────────── */
function HeroRealisations() {
  const T = useTheme()
  const { t } = useLanguage()
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
        <motion.h1 className="hr-title" initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7, ease: 'easeOut' }}>{t('projectsTitleUpper')}</motion.h1>

        <div className="hr-side">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .6, delay: .2 }}>
            <p className="hr-kicker">+{PROJECTS.length} {t('deliveredProjects')} · 99% {t('satisfied')}</p>
            <p className="hr-desc">{t('projectsHero')}</p>
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

/* ────────────────────────────────────────────────
   INTRO PROJECTS — Scroll reveal word by word (effet A propos de AKATech)
──────────────────────────────────────────────── */
function ProjectsIntro() {
  const T = useTheme()
  const { t } = useLanguage()
  const containerRef = useRef(null)
  const textRef      = useRef(null)
  const wordsRef     = useRef([])

  const TEXT = t('projectsIntro')

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
        padding: '12rem 5%',
        minHeight: '120vh',
        display: 'flex',
        alignItems: 'center',
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

      <div style={{ maxWidth: 1200, width: '100%', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Titre de section */}
        <h2 className="section-title-big" style={{
          position: 'relative',
          color: T.textMain,
          marginBottom: '2.5rem', }}>
          {t('projectsCtaLead')} <GreenUnderline>{t('projectsCtaHighlight')}</GreenUnderline>
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
            paddingLeft: 'var(--body-indent)',
            paddingRight: 'var(--body-indent)',
          }}
        >
          {(() => {
            const greenWords = new Set(['PME,', 'startups', 'créateurs.', 'problème', 'solution', 'quotidien.'])
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
                  color: greenWords.has(word.replace(/[().,;?!]/g, '')) || greenWords.has(word) ? '#88ca53' : 'inherit',
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

// ── Vitrine : le projet joue dans un portable + un téléphone ──
// Défilement parallaxe horizontal : le défilement vertical fait glisser les projets
// (voir ProjectScrollShowcase). PC : webm dans le portable (webp à défaut).
function ProjectsShowcaseSection() {
  const T = useTheme()
  const { t, language } = useLanguage()
  const items = useMemo(
    () => [...getLocalizedData(language).PROJECTS].sort((a, b) => b.id - a.id),
    [language]
  )
  return (
    <>
      <section style={{ padding: '5rem 5% 1rem', background: T.bg }}>
        <h2 className="section-title-big" style={{ position: 'relative', textAlign: 'center', color: T.textMain, margin: 0 }}>
          <UnderlinedTitle text={t('projectsPageTitle')} />
        </h2>
      </section>
      <ProjectScrollShowcase items={items} />
    </>
  )
}

/* ────────────────────────────────────────────────
   PAGE EXPORT
──────────────────────────────────────────────── */
export default function RealisationsPage() {
  const { t } = useLanguage()
  return (
    <div>
      <HeroRealisations />
      <ProjectsIntro />
      <ProjectsShowcaseSection />

      <section style={{ position: 'relative', width: '100%', aspectRatio: '2048 / 768', overflow: 'hidden' }}>
        <LazyImg
          src={cld('/images/cta-projects-desktop.webp')}
          alt={t('projectsCtaLead')}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <motion.a
          href="https://wa.me/2250142507750" target="_blank" rel="noreferrer"
          aria-label="Rejoindre nos clients"
          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          transition={{ duration: .2, ease: [.22, 1, .36, 1] }}
          style={{
            position: 'absolute', left: '6.84%', top: '68.23%', width: '27.64%', height: '17.06%',
            borderRadius: 999, cursor: 'pointer',
          }}
        />
      </section>
    </div>
  )
}
