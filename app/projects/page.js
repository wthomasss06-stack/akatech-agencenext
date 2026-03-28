'use client'
import { useRef } from 'react'
import {
  motion,
  useScroll,
  useTransform,
  useMotionTemplate,
  AnimatePresence,
} from 'framer-motion'
import { ArrowRight, Code, ExternalLink } from 'lucide-react'
import { useTheme } from '@/lib/theme'
import { SectionEye, LazyImg, SectionCTA, LaserBeam } from '@/components/ui/index'
import { PROJECTS } from '@/lib/data'

/* ────────────────────────────────────────────────
   HERO
──────────────────────────────────────────────── */
function HeroRealisations() {
  const T = useTheme()
  return (
    <section style={{ padding: '9rem 5% 5rem', background: T.bg, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '-15%', left: '-5%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle,rgba(34,200,100,.06),transparent 65%)' }} />
      <div className="grid-bg" style={{ position: 'absolute', inset: 0, opacity: .25 }} />
      <LaserBeam position="left"   intensity="medium" />
      <LaserBeam position="center" intensity="subtle" style={{ height: '50%', top: '10%' }} />
      <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .6 }}>
          <SectionEye label="// Nos Réalisations" center />
          <h1 style={{
            fontSize: 'clamp(2.4rem,5vw,3.8rem)', fontWeight: 800,
            fontFamily: "'Syne',sans-serif", color: T.textMain,
            letterSpacing: '-.04em', lineHeight: 1.1, marginBottom: '1.2rem',
          }}>
            +10 réalisations livrées,<br /><span className="text-gradient">100% satisfaits.</span>
          </h1>
          <p style={{ fontSize: '1rem', color: T.textSub, lineHeight: 1.75, maxWidth: 560, margin: '0 auto 2.5rem' }}>
            Sites vitrines, e-commerces, SaaS, portfolios… Chaque réalisation est une histoire de transformation digitale réussie.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.7rem', justifyContent: 'center' }}>
            {[{ label: '+10', sub: 'Réalisations' }, { label: '100%', sub: 'Satisfaits' }, { label: '3+', sub: 'Années' }, { label: '48h', sub: 'Support max' }].map(({ label, sub }) => (
              <div key={sub} style={{ padding: '.5rem 1.2rem', borderRadius: 100, background: 'rgba(34,200,100,.08)', border: '1px solid rgba(34,200,100,.2)', display: 'flex', gap: '.4rem', alignItems: 'center' }}>
                <span style={{ fontFamily: "'Orbitron',sans-serif", fontWeight: 900, color: '#22c864', fontSize: '.85rem' }}>{label}</span>
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.6rem', color: T.textMuted, letterSpacing: '.06em' }}>{sub}</span>
              </div>
            ))}
          </div>
        </motion.div>
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
            border: '1px solid rgba(34,200,100,.25)',
            boxShadow: `
              0 0 0 1px rgba(34,200,100,.08),
              0 20px 60px rgba(0,0,0,.45),
              0 4px 12px rgba(0,0,0,.3)
            `,
          }}
        >
          {/* Numéro de réalisation */}
          <div style={{
            position: 'absolute', top: '1.2rem', left: '1.2rem',
            fontFamily: "'Orbitron',sans-serif", fontWeight: 900,
            fontSize: '.65rem', color: 'rgba(34,200,100,.55)',
            letterSpacing: '.12em', zIndex: 2,
            background: 'rgba(3,8,6,.55)', backdropFilter: 'blur(6px)',
            padding: '.2rem .7rem', borderRadius: 100,
            border: '1px solid rgba(34,200,100,.2)',
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
                    <Code size={40} style={{ color: 'rgba(34,200,100,.2)' }} />
                  </div>
                }
              />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(3,8,6,.95) 0%,rgba(3,8,6,.2) 50%,transparent)' }} />

              {/* Badges */}
              <div style={{ position: 'absolute', top: '1rem', right: '1rem', display: 'flex', gap: '.5rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                <div style={{ padding: '.28rem .8rem', borderRadius: 100, background: 'rgba(34,200,100,.15)', backdropFilter: 'blur(8px)', border: '1px solid rgba(34,200,100,.3)', fontFamily: "'JetBrains Mono',monospace", fontSize: '.58rem', color: '#22c864', letterSpacing: '.08em' }}>
                  {project.type}
                </div>
                {project.live && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '.35rem', padding: '.28rem .8rem', borderRadius: 100, background: 'rgba(34,200,100,.88)', fontFamily: "'JetBrains Mono',monospace", fontSize: '.58rem', color: '#fff', fontWeight: 700, letterSpacing: '.06em' }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff', animation: 'dot-blink 1.4s ease-in-out infinite' }} />
                    EN LIGNE
                  </div>
                )}
              </div>

              {/* Résultat */}
              <div style={{ position: 'absolute', bottom: '1rem', right: '1rem', padding: '.3rem .9rem', borderRadius: 100, background: 'rgba(0,0,0,.65)', backdropFilter: 'blur(8px)', border: '1px solid rgba(34,200,100,.3)', fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: '.68rem', color: '#22c864' }}>
                {project.result}
              </div>
            </div>

            {/* Contenu */}
            <div style={{ padding: '1.8rem 2rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1.2rem', marginBottom: '.6rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: T.textMain, fontFamily: "'Syne',sans-serif", letterSpacing: '-.02em', lineHeight: 1.2 }}>
                  {project.title}
                </h3>
                {project.url ? (
                  <a href={project.url} target="_blank" rel="noreferrer"
                    style={{ display: 'flex', alignItems: 'center', gap: '.35rem', fontFamily: "'JetBrains Mono',monospace", fontSize: '.65rem', color: '#22c864', textDecoration: 'none', flexShrink: 0, padding: '.32rem .85rem', borderRadius: 100, border: '1px solid rgba(34,200,100,.3)', background: 'rgba(34,200,100,.08)', transition: 'all .2s', whiteSpace: 'nowrap' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(34,200,100,.2)'; e.currentTarget.style.borderColor = '#22c864' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(34,200,100,.08)'; e.currentTarget.style.borderColor = 'rgba(34,200,100,.3)' }}>
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
                {project.tech.map(t => (
                  <span key={t} style={{ padding: '.22rem .65rem', borderRadius: 100, background: 'rgba(34,200,100,.07)', border: `1px solid ${T.border}`, fontFamily: "'JetBrains Mono',monospace", fontSize: '.6rem', color: '#22c864' }}>
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
            <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.7rem', color: '#22c864', letterSpacing: '.1em', marginBottom: '.4rem' }}>
              // SCROLL POUR PARCOURIR
            </p>
            <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: 'clamp(1.5rem,3vw,2.2rem)', fontWeight: 800, color: T.textMain, letterSpacing: '-.03em', margin: 0 }}>
              {PROJECTS.length} réalisations, <span className="text-gradient">un par un.</span>
            </h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '.4rem', padding: '.5rem 1rem', borderRadius: 100, background: 'rgba(34,200,100,.07)', border: '1px solid rgba(34,200,100,.2)' }}>
            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.62rem', color: '#22c864', letterSpacing: '.06em' }}>
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
function StartRealisation() {
  const T = useTheme()
  return (
    <section style={{ padding: '7rem 5%', background: T.bgAlt }}>
      <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <SectionEye label="// Votre Projet" center />
          <h2 style={{ fontSize: 'clamp(1.9rem,3.5vw,2.6rem)', fontWeight: 800, fontFamily: "'Syne',sans-serif", color: T.textMain, letterSpacing: '-.03em', marginBottom: '1rem' }}>
            Votre réalisation peut être<br />
            <span className="text-gradient">la prochaine ici.</span>
          </h2>
          <p style={{ fontSize: '.9rem', color: T.textSub, lineHeight: 1.75, maxWidth: 520, margin: '0 auto 2.5rem' }}>
            Partagez votre idée. On l'écoute, on la chiffre gratuitement et on la réalise dans les délais. Aucun engagement pour commencer.
          </p>
          <a
            href="https://wa.me/2250142507750?text=Bonjour AKATech, j'ai un projet web à vous soumettre."
            target="_blank" rel="noreferrer"
            className="btn-raised"
            style={{ fontSize: '1rem', padding: '1rem 2.5rem' }}>
            Démarrer ma réalisation <ArrowRight size={16} />
          </a>
        </motion.div>
      </div>
    </section>
  )
}

/* ────────────────────────────────────────────────
   PAGE EXPORT
──────────────────────────────────────────────── */
export default function RealisationsPage() {
  return (
    <div>
      <HeroRealisations />
      <StackedRealisations />
      <StartRealisation />
    </div>
  )
}