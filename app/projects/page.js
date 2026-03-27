'use client'
import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { ArrowRight, Code, ExternalLink, Filter } from 'lucide-react'
import { useTheme } from '@/lib/theme'
import { SectionEye, LazyImg, SectionCTA } from '@/components/ui/index'
import { PROJECTS } from '@/lib/data'

const ALL_TYPES = ['Tous', ...Array.from(new Set(PROJECTS.map(p => p.type)))]

function HeroProjects() {
  const T = useTheme()
  return (
    <section style={{ padding: '9rem 5% 5rem', background: T.bg, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '-15%', left: '-5%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle,rgba(34,200,100,.06),transparent 65%)' }} />
      <div className="grid-bg" style={{ position: 'absolute', inset: 0, opacity: .25 }} />
      <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .6 }}>
          <SectionEye label="// Nos Réalisations" center />
          <h1 style={{ fontSize: 'clamp(2.4rem,5vw,3.8rem)', fontWeight: 800, fontFamily: "'Syne',sans-serif", color: T.textMain, letterSpacing: '-.04em', lineHeight: 1.1, marginBottom: '1.2rem' }}>
            +10 projets livrés,<br /><span className="text-gradient">100% satisfaits.</span>
          </h1>
          <p style={{ fontSize: '1rem', color: T.textSub, lineHeight: 1.75, maxWidth: 560, margin: '0 auto 2.5rem' }}>
            Sites vitrines, e-commerces, SaaS, portfolios… Chaque projet est une histoire de transformation digitale réussie.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.7rem', justifyContent: 'center' }}>
            {[{ label: '+10', sub: 'Projets' }, { label: '100%', sub: 'Satisfaits' }, { label: '3+', sub: 'Années' }, { label: '48h', sub: 'Support max' }].map(({ label, sub }) => (
              <div key={sub} style={{ padding: '.5rem 1.2rem', borderRadius: 100, background: 'rgba(34,200,100,.08)', border: '1px solid rgba(34,200,100,.2)', display: 'flex', gap: '.4rem', alignItems: 'center' }}>
                <span style={{ fontFamily: "'Orbitron',sans-serif", fontWeight: 900, color: T.green, fontSize: '.85rem' }}>{label}</span>
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.6rem', color: T.textMuted, letterSpacing: '.06em' }}>{sub}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function ProjectsGrid() {
  const T = useTheme()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const [filter, setFilter] = useState('Tous')
  const [hovered, setHovered] = useState(null)

  const filtered = filter === 'Tous' ? PROJECTS : PROJECTS.filter(p => p.type === filter)

  return (
    <section ref={ref} style={{ padding: '4rem 5% 7rem', background: T.bg }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Filters */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          style={{ display: 'flex', flexWrap: 'wrap', gap: '.5rem', marginBottom: '3rem', alignItems: 'center' }}>
          <Filter size={14} style={{ color: T.textMuted, marginRight: '.3rem' }} />
          {ALL_TYPES.map(type => (
            <button key={type} onClick={() => setFilter(type)}
              style={{ padding: '.4rem 1rem', borderRadius: 100, border: '1px solid', borderColor: filter === type ? T.green : T.border, background: filter === type ? 'rgba(34,200,100,.15)' : 'transparent', color: filter === type ? T.green : T.textSub, fontFamily: "'Syne',sans-serif", fontSize: '.8rem', fontWeight: 600, cursor: 'pointer', transition: 'all .22s' }}>
              {type}
            </button>
          ))}
        </motion.div>

        {/* Grid */}
        <AnimatePresence mode="popLayout">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(340px,1fr))', gap: '1.5rem' }}>
            {filtered.map((project, i) => (
              <motion.div key={project.title}
                layout
                initial={{ opacity: 0, scale: .95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: .9 }}
                transition={{ duration: .4, delay: i * .05 }}
                onHoverStart={() => setHovered(project.title)}
                onHoverEnd={() => setHovered(null)}
                className="sku-card"
                style={{ overflow: 'hidden', cursor: 'pointer' }}>
                {/* Image */}
                <div style={{ height: 220, position: 'relative', overflow: 'hidden' }}>
                  <motion.div animate={{ scale: hovered === project.title ? 1.06 : 1 }} transition={{ duration: .5 }}
                    style={{ width: '100%', height: '100%' }}>
                    <LazyImg src={project.img} alt={project.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      placeholder={<div style={{ height: '100%', background: 'linear-gradient(135deg,#0a1a0e,#060e09)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Code size={32} style={{ color: 'rgba(34,200,100,.3)' }} /></div>} />
                  </motion.div>
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(3,8,6,.95) 0%,rgba(3,8,6,.3) 50%,transparent)' }} />

                  {/* Type badge */}
                  <div style={{ position: 'absolute', top: '1rem', left: '1rem', padding: '.25rem .75rem', borderRadius: 100, background: 'rgba(34,200,100,.15)', backdropFilter: 'blur(8px)', border: '1px solid rgba(34,200,100,.3)', fontFamily: "'JetBrains Mono',monospace", fontSize: '.58rem', color: '#22c864', letterSpacing: '.08em' }}>
                    {project.type}
                  </div>

                  {/* Result badge */}
                  <div style={{ position: 'absolute', bottom: '1rem', right: '1rem', padding: '.3rem .8rem', borderRadius: 100, background: 'rgba(34,200,100,.9)', fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: '.65rem', color: '#fff' }}>
                    {project.result}
                  </div>

                  {/* Hover overlay */}
                  <AnimatePresence>
                    {hovered === project.title && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        style={{ position: 'absolute', inset: 0, background: 'rgba(34,200,100,.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(34,200,100,.9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <ExternalLink size={20} style={{ color: '#fff' }} />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Content */}
                <div style={{ padding: '1.4rem' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: T.textMain, fontFamily: "'Syne',sans-serif", marginBottom: '.4rem' }}>{project.title}</h3>
                  <p style={{ fontSize: '.82rem', color: T.textSub, lineHeight: 1.65, marginBottom: '1rem' }}>{project.desc}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.35rem' }}>
                    {project.tech.map(t => (
                      <span key={t} style={{ padding: '.2rem .6rem', borderRadius: 100, background: 'rgba(34,200,100,.07)', border: `1px solid ${T.border}`, fontFamily: "'JetBrains Mono',monospace", fontSize: '.58rem', color: T.green }}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      </div>
    </section>
  )
}

function StartProject() {
  const T = useTheme()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  return (
    <section ref={ref} style={{ padding: '7rem 5%', background: T.bgAlt }}>
      <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}}>
          <SectionEye label="// Votre Projet" center />
          <h2 style={{ fontSize: 'clamp(1.9rem,3.5vw,2.6rem)', fontWeight: 800, fontFamily: "'Syne',sans-serif", color: T.textMain, letterSpacing: '-.03em', marginBottom: '1rem' }}>
            Votre projet peut être<br />
            <span className="text-gradient">le prochain ici.</span>
          </h2>
          <p style={{ fontSize: '.9rem', color: T.textSub, lineHeight: 1.75, maxWidth: 520, margin: '0 auto 2.5rem' }}>
            Partagez votre idée. On l'écoute, on la chiffre gratuitement et on la réalise dans les délais. Aucun engagement pour commencer.
          </p>
          <a href="https://wa.me/2250142507750?text=Bonjour AKATech, j'ai un projet web à vous soumettre." target="_blank" rel="noreferrer"
            className="btn-raised" style={{ fontSize: '1rem', padding: '1rem 2.5rem' }}>
            Démarrer mon projet <ArrowRight size={16} />
          </a>
        </motion.div>
      </div>
    </section>
  )
}

export default function ProjectsPage() {
  return (
    <div>
      <HeroProjects />
      <ProjectsGrid />
      <StartProject />
    </div>
  )
}
