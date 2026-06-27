'use client'
import { useRef, useEffect } from 'react'
import {
  motion,
  useScroll,
  useTransform,
  useMotionTemplate,
  AnimatePresence,
} from 'framer-motion'
import { Code, ExternalLink } from 'lucide-react'
import { useTheme } from '@/lib/theme'
import { GhostTitle, LazyImg, PageCTA, LaserBeam, GreenUnderline } from '@/components/ui/index'
import AuroraHero from '@/components/ui/AuroraHero'
import { PROJECTS } from '@/lib/data'



/* ────────────────────────────────────────────────
   HERO
──────────────────────────────────────────────── */
function HeroRealisations() {
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
      <div ref={layerMidRef} style={{ position: 'relative', zIndex: 10, maxWidth: 900, padding: '72px 5% 0', textAlign: 'center', willChange: 'transform, opacity, filter', transition: 'transform .1s ease-out' }}>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .6 }}>
          <h1 style={{ position: 'relative', fontSize: 'clamp(2.4rem,5vw,3.8rem)', fontWeight: 800, fontFamily: "'JetBrains Mono',monospace", color: 'rgba(255,255,255,.88)', letterSpacing: '-.04em', lineHeight: 1.1, marginBottom: '1.2rem' }}>
            <GhostTitle text="+18 réalisations livrées, 99% satisfaits." />
            +18 réalisations livrées,<br /><GreenUnderline><span className="text-gradient">99% satisfaits.</span></GreenUnderline>
          </h1>
          <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,.55)', lineHeight: 1.75, maxWidth: 560, margin: '0 auto 2.5rem' }}>
            Sites vitrines, e-commerces, SaaS, portfolios… Chaque réalisation est une histoire de transformation digitale réussie.
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
   CARTE INDIVIDUELLE (composant pour pouvoir
   utiliser les hooks useTransform)
──────────────────────────────────────────────── */
function StackedCard({ project, index, total, scrollYProgress, T }) {
  const segStart = index / total
  const segEnd   = Math.min((index + 1) / total, 1)

  // La carte s'aplatit / recule quand la suivante arrive
  const scale   = useTransform(scrollYProgress, [segStart, segEnd], [1, 0.86])
  const y       = useTransform(scrollYProgress, [segStart, segEnd], [0, -60])
  const opacity = useTransform(scrollYProgress, [segStart + (segEnd - segStart) * .65, segEnd], [1, 0.4])
  const blurVal = useTransform(scrollYProgress, [segStart + (segEnd - segStart) * .5, segEnd], [0, 5])
  const filter  = useMotionTemplate`blur(${blurVal}px)`

  // La carte entre depuis le bas (pour les cards 1+)
  const enterY  = useTransform(
    scrollYProgress,
    [Math.max(0, segStart - 1 / total), segStart],
    [80, 0],
  )

  // Offset vertical de départ pour montrer le stack (cartes légèrement décalées)
  const stackOffset = (total - 1 - index) * 6

  return (
    <div style={{
      position: 'sticky',
      top: `calc(10vh + ${stackOffset}px)`,
      height: 'auto',
      zIndex: index + 1,            // cartes du dessus ont z-index plus bas (elles reculent)
      display: 'flex',
      justifyContent: 'center',
      paddingBottom: '2rem',
    }}>
      <motion.div
        style={{
          scale,
          y: index === 0 ? y : enterY,
          opacity,
          filter,
          width: '100%',
          maxWidth: 780,
          transformOrigin: 'top center',
        }}
      >
        <div
          className="sku-card"
          style={{
            overflow: 'hidden',
            border: '1px solid rgba(136,202,83,.25)',
            boxShadow: `
              0 0 0 1px rgba(136,202,83,.08),
              0 20px 60px rgba(0,0,0,.45),
              0 4px 12px rgba(0,0,0,.3)
            `,
          }}
        >
          {/* Numéro de réalisation */}
          <div className="no-pill-mobile" style={{
            position: 'absolute', top: '1.2rem', left: '1.2rem',
            fontFamily: "'JetBrains Mono',monospace", fontWeight: 900,
            fontSize: '.65rem', color: 'rgba(136,202,83,.55)',
            letterSpacing: '.12em', zIndex: 2,
            background: 'rgba(3,8,6,.55)', backdropFilter: 'blur(6px)',
            padding: '.2rem .7rem', borderRadius: 100,
            border: '1px solid rgba(136,202,83,.2)',
          }}>
            {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>

            {/* Image */}
            <div style={{ height: 280, position: 'relative', overflow: 'hidden' }}>
              <LazyImg
                src={project.img}
                alt={project.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform .6s' }}
                placeholder={
                  <div style={{ height: '100%', background: 'linear-gradient(135deg,#0a1a0e,#060e09)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Code size={40} style={{ color: 'rgba(136,202,83,.2)' }} />
                  </div>
                }
              />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(3,8,6,.95) 0%,rgba(3,8,6,.2) 50%,transparent)' }} />

              {/* Badges */}
              <div className="no-pill-mobile" style={{ position: 'absolute', top: '1rem', right: '1rem', display: 'flex', gap: '.5rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                <div style={{ padding: '.28rem .8rem', borderRadius: 100, background: 'rgba(136,202,83,.15)', backdropFilter: 'blur(8px)', border: '1px solid rgba(136,202,83,.3)', fontFamily: "'JetBrains Mono',monospace", fontSize: '.65rem', fontWeight: 600, color: '#88ca53' }}>
                  {project.type}
                </div>
                {project.live && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '.35rem', padding: '.28rem .8rem', borderRadius: 100, background: 'rgba(136,202,83,.88)', fontFamily: "'JetBrains Mono',monospace", fontSize: '.58rem', color: '#fff', fontWeight: 700, letterSpacing: '.06em' }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff', animation: 'dot-blink 1.4s ease-in-out infinite' }} />
                    EN LIGNE
                  </div>
                )}
              </div>

              {/* Résultat */}
              <div className="no-pill-mobile" style={{ position: 'absolute', bottom: '1rem', right: '1rem', padding: '.3rem .9rem', borderRadius: 100, background: 'rgba(0,0,0,.65)', backdropFilter: 'blur(8px)', border: '1px solid rgba(136,202,83,.3)', fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, fontSize: '1rem', color: '#88ca53' }}>
                {project.result}
              </div>
            </div>

            {/* Contenu */}
            <div style={{ padding: '1.8rem 2rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1.2rem', marginBottom: '.6rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: T.textMain, fontFamily: "'JetBrains Mono',monospace", letterSpacing: '-.02em', lineHeight: 1.2 }}>
                  {project.title}
                </h3>
                {project.url ? (
                  <a href={project.url} target="_blank" rel="noreferrer"
                    style={{ display: 'flex', alignItems: 'center', gap: '.35rem', fontFamily: "'JetBrains Mono',monospace", fontSize: '.65rem', fontWeight: 600, color: '#88ca53', textDecoration: 'none', flexShrink: 0, padding: '.32rem .85rem', borderRadius: 100, border: '1px solid rgba(136,202,83,.3)', background: 'rgba(136,202,83,.08)', transition: 'all .2s', whiteSpace: 'nowrap' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(136,202,83,.2)'; e.currentTarget.style.borderColor = '#88ca53' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(136,202,83,.08)'; e.currentTarget.style.borderColor = 'rgba(136,202,83,.3)' }}>
                    <ExternalLink size={11} /> Voir le site
                  </a>
                ) : (
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.6rem', color: T.textMuted, padding: '.32rem .85rem', borderRadius: 100, border: `1px solid ${T.border}`, whiteSpace: 'nowrap' }}>
                    Démo locale
                  </span>
                )}
              </div>

              <p style={{ fontSize: '.9rem', color: T.textSub, lineHeight: 1.7, marginBottom: '1.2rem' }}>{project.desc}</p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.4rem' }}>
                {(project.tech || []).map(t => (
                  <span key={t} style={{ padding: '.22rem .65rem', borderRadius: 100, background: 'rgba(136,202,83,.07)', border: `1px solid ${T.border}`, fontFamily: "'JetBrains Mono',monospace", fontSize: '.65rem', fontWeight: 600, color: '#88ca53' }}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

/* ────────────────────────────────────────────────
   SECTION SCROLL STACK
──────────────────────────────────────────────── */
function StackedRealisations() {
  const T = useTheme()
  const containerRef = useRef(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  return (
    <section style={{ background: T.bg, paddingBottom: '6rem' }}>

      {/* En-tête section */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '4rem 5% 2rem' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}
        >
          <div>
            <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.65rem', fontWeight: 600, color: '#88ca53', marginBottom: '.4rem' }}>
              // SCROLL POUR PARCOURIR
            </p>
            <h2 style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 'clamp(1.5rem,3vw,2.2rem)', fontWeight: 800, color: T.textMain, letterSpacing: '-.03em', margin: 0 }}>
              {PROJECTS.length} réalisations, <GreenUnderline><span className="text-gradient">un par un.</span></GreenUnderline>
            </h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '.4rem', padding: '.5rem 1rem', borderRadius: 100, background: 'rgba(136,202,83,.07)', border: '1px solid rgba(136,202,83,.2)' }}>
            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.65rem', fontWeight: 600, color: '#88ca53' }}>
              ↓ Scroll pour découvrir
            </span>
          </div>
        </motion.div>
      </div>

      {/* Zone de scroll — hauteur = N cartes × 100vh */}
      <div
        ref={containerRef}
        style={{
          height: `${PROJECTS.length * 90 + 30}vh`,
          position: 'relative',
          padding: '0 5%',
        }}
      >
        {PROJECTS.map((project, i) => (
          <StackedCard
            key={project.title}
            project={project}
            index={i}
            total={PROJECTS.length}
            scrollYProgress={scrollYProgress}
            T={T}
          />
        ))}
      </div>
    </section>
  )
}

/* ────────────────────────────────────────────────
   CTA FINAL
──────────────────────────────────────────────── */
/* ────────────────────────────────────────────────
   PAGE EXPORT
──────────────────────────────────────────────── */
export default function RealisationsPage() {
  return (
    <div>
      <HeroRealisations />
      <StackedRealisations />

      <PageCTA
        message="Votre réalisation peut être la prochaine ici. Partagez votre idée — devis gratuit, sans engagement."
        cta="Démarrer ma réalisation"
      />
    </div>
  )
}