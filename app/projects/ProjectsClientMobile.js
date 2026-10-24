'use client'
import { useRef, useEffect, useMemo } from 'react'
import { motion, useInView } from 'framer-motion'
import { useTheme } from '@/lib/theme'
import { useLanguage } from '@/lib/language'
import ProjectShowcase from '@/components/ui/ProjectShowcase'
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
    <section style={{ height: '100vh', minHeight: 640, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#060e09' }}>
      {/* Layer BG */}
      <div ref={layerBgRef} style={{ position: 'absolute', inset: '-8%', zIndex: 1, willChange: 'transform, filter', transition: 'transform .1s ease-out' }}>
        <AuroraHero labels={[]} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 20%, rgba(6,14,9,.95) 100%)' }} />
      </div>
      {/* Layer MID */}
      <div ref={layerMidRef} style={{ position: 'relative', zIndex: 10, maxWidth: 900, padding: '72px 5% 0', textAlign: 'center', willChange: 'transform, opacity, filter', transition: 'transform .1s ease-out' }}>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .6 }}>
          <h1 style={{ position: 'relative', fontSize: 'min(var(--title-size), 3.8rem)', fontWeight: 900, fontStyle: 'italic', fontFamily: "'Barlow Condensed',sans-serif", color: 'rgba(255,255,255,.88)', letterSpacing: 'var(--title-tracking)', lineHeight: 'var(--title-leading)', marginBottom: '1.2rem' }}>+{PROJECTS.length} {t('deliveredProjects')},<br /><GreenUnderline>99% {t('satisfied')}.</GreenUnderline></h1>
          <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,.55)', lineHeight: 1.75, maxWidth: 560, margin: '0 auto 2.5rem' }}>
            {t('projectsHero')}
          </p>
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

/* ────────────────────────────────────────────────
   CTA FINAL
──────────────────────────────────────────────── */
/* ────────────────────────────────────────────────
   INTRO PROJECTS MOBILE
──────────────────────────────────────────────── */
function ProjectsIntro() {
  const T = useTheme()
  const { t } = useLanguage()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  const TEXT = t('projectsIntro')
  const greenWords = new Set(['PME,', 'startups', 'créateurs.', 'problème', 'solution', 'quotidien.'])

  return (
    <section ref={ref} style={{ padding: '6rem 5% 4rem', background: T.bg, position: 'relative' }}>
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
            fontSize: 'clamp(2.3rem,8.5vw,3.6rem)', fontWeight: 800,
            color: T.textMain, letterSpacing: '-.03em',
            marginBottom: '1.5rem',
          }}>
          {t('projectsCtaLead')} <GreenUnderline>{t('projectsCtaHighlight')}</GreenUnderline>
        </motion.h2>

        <motion.p initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: .1 }}
          style={{
            fontFamily: "'JetBrains Mono',monospace",
            fontSize: 'clamp(1rem,3.6vw,1.2rem)',
            fontWeight: 700, lineHeight: 1.5,
            color: T.textMain, margin: 0,
          }}>
          {TEXT.split(' ').map((word, i) => (
            <span key={i} style={{ color: greenWords.has(word.replace(/[().,;?!]/g, '')) || greenWords.has(word) ? '#88ca53' : 'inherit' }}>
              {word}{' '}
            </span>
          ))}
        </motion.p>
      </div>
    </section>
  )
}

// ── Vitrine : le projet joue dans un portable + un téléphone ──
// PC : webm dans le portable (webp à défaut) ; mobile : téléphone seul, image `-responsive`.
function ProjectsShowcaseSection() {
  const T = useTheme()
  const { t, language } = useLanguage()
  const items = useMemo(
    () => [...getLocalizedData(language).PROJECTS].sort((a, b) => b.id - a.id),
    [language]
  )
  return (
    <section style={{ padding: '5rem 0 4rem', background: T.bg, overflow: 'hidden' }}>
      <h2 className="section-title-big" style={{ position: 'relative', textAlign: 'center', color: T.textMain, margin: '0 0 3rem', padding: '0 5%' }}>
        <UnderlinedTitle text={t('projectsPageTitle')} />
      </h2>
      <ProjectShowcase items={items} />
    </section>
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

      <section style={{ position: 'relative', width: '100%', aspectRatio: '1 / 1', overflow: 'hidden' }}>
        <LazyImg
          src={cld('/images/cta-projects-mobile.webp')}
          alt={t('projectsCtaLead')}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <motion.a
          href="https://wa.me/2250142507750" target="_blank" rel="noreferrer"
          aria-label="Rejoindre nos clients"
          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          transition={{ duration: .2, ease: [.22, 1, .36, 1] }}
          style={{
            position: 'absolute', left: '5.98%', top: '47.93%', width: '41.15%', height: '9.01%',
            borderRadius: 999, cursor: 'pointer',
          }}
        />
      </section>
    </div>
  )
}
