'use client'
import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Check, Globe, ShoppingCart, Cpu, Server, Palette, Wrench, Zap, Timer, MessageCircle, Map, MapPin } from 'lucide-react'
import { useTheme } from '@/lib/theme'
import { GhostTitle, LazyImg, MarqueeStrip, PageCTA, LaserBeam, GreenUnderline } from '@/components/ui/index'
import AuroraHero from '@/components/ui/AuroraHero'
import { SERVICES } from '@/lib/data'



const ICON_MAP = { Globe, ShoppingCart, Cpu, Server, Palette, Wrench, Map, MapPin }

const PROCESS_STEPS = [
  { n: '01', title: 'Consultation gratuite', desc: 'Échange de 30 min pour comprendre votre projet, vos objectifs et votre budget. Aucun engagement.' },
  { n: '02', title: 'Devis personnalisé', desc: 'Proposition détaillée avec planning, technologies et tarif. Validé ensemble avant de commencer.' },
  { n: '03', title: 'Développement agile', desc: 'Jalons hebdomadaires, preview en ligne, retours pris en compte en temps réel.' },
  { n: '04', title: 'Livraison + Formation', desc: 'Mise en ligne, tests, documentation et formation 2h pour gérer votre solution en autonomie.' },
]

const TECH_STACK = [
  { cat: 'Frontend', items: ['React', 'Next.js', 'Framer Motion', 'Tailwind CSS'] },
  { cat: 'Backend', items: ['Django', 'Python', 'Node.js', 'Express'] },
  { cat: 'Base de données', items: ['MySQL', 'Redis'] },
  { cat: 'Outils', items: ['Git', 'VS Code','Vercel'] },
]

function HeroServices() {
  const T = useTheme()
  return (
    <section style={{ height: '100vh', minHeight: 600, width: '100%', background: '#060e09', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
      <AuroraHero labels={[]} />
      <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1, padding: '72px 5% 0' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .6 }}>
          <h1 style={{ position: 'relative', fontSize: 'clamp(2.4rem,5vw,3.8rem)', fontWeight: 800, fontFamily: "'JetBrains Mono',monospace", color: 'rgba(255,255,255,.88)', letterSpacing: '-.04em', lineHeight: 1.1, marginBottom: '1.2rem' }}>
            <GhostTitle text="NOS PRESTATIONS" />
            NOS{' '}
            <GreenUnderline><span className="text-gradient">PRESTATIONS</span></GreenUnderline>
          </h1>
          <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,.55)', lineHeight: 1.75, maxWidth: 620, margin: '0 auto 2.5rem' }}>
            De la consultation au déploiement, chaque service est conçu pour répondre aux réalités du marché ivoirien — rapide, efficace, rentable.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
            <a href="https://wa.me/2250142507750" target="_blank" rel="noreferrer" className="btn-raised" style={{ fontSize: '1rem' }}>
              Devis gratuit <MessageCircle size={16} />
            </a>
            <a href="#services-list" className="btn-ghost" style={{ fontSize: '1rem' }}>
              Voir les services
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function ServicesList() {
  const T = useTheme()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const [active, setActive] = useState(0)
  const svc = SERVICES[active]
  const Icon = ICON_MAP[svc.icon] || Globe

  return (
    <section id="services-list" ref={ref} style={{ padding: '7rem 5%', background: T.bgAlt }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 className="section-title-big" style={{ position: 'relative', fontSize: 'clamp(1.9rem,7vw,2.8rem)', fontWeight: 800, fontFamily: "'JetBrains Mono',monospace", color: T.textMain, letterSpacing: '-.03em' }}>
            <GhostTitle text="CHOISISSEZ VOTRE SOLUTION" />
            Choisissez votre <GreenUnderline><span className="text-gradient">solution</span></GreenUnderline>
          </h2>
        </motion.div>

        {/* Tabs */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.5rem', justifyContent: 'center', marginBottom: '3rem' }}>
          {SERVICES.map((s, i) => {
            const Ic = ICON_MAP[s.icon] || Globe
            return (
              <button key={s.title} onClick={() => setActive(i)}
                style={{ display: 'flex', alignItems: 'center', gap: '.4rem', padding: '.5rem 1.1rem', borderRadius: 100, border: '1px solid', borderColor: active === i ? T.green : T.border, background: active === i ? 'linear-gradient(145deg,#8dd456,#5f9137)' : 'transparent', color: active === i ? '#fff' : T.textSub, fontFamily: "'JetBrains Mono',monospace", fontSize: '.82rem', fontWeight: 600, cursor: 'pointer', transition: 'all .22s' }}>
                <Ic size={14} />{s.title}
              </button>
            )
          })}
        </div>

        <style>{`
          .svc-detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2.5rem; align-items: center; }
          @media (max-width: 768px) {
            .svc-detail-grid { display: flex; flex-direction: column; gap: 1.5rem; }
            .svc-detail-img  { order: 1; }
            .svc-detail-body { order: 2; width: 100%; }
          }
        `}</style>

        {/* Service Detail */}
        <AnimatePresence mode="wait">
          <motion.div key={active}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: .35 }}
            className="svc-detail-grid">
            {/* Image */}
            <div className="svc-detail-img" style={{ borderRadius: 20, overflow: 'hidden', border: `1px solid ${T.border}`, boxShadow: '8px 8px 40px rgba(0,0,0,.3)', aspectRatio: '1 / 1', width: '100%', maxWidth: 380, margin: '0 auto' }}>
              <LazyImg src={svc.img} alt={svc.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                placeholder={<div style={{ height: '100%', background: 'linear-gradient(135deg,#0a1a0e,#060e09)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon size={48} style={{ color: 'rgba(136,202,83,.3)' }} /></div>} />
            </div>

            {/* Content */}
            <div className="svc-detail-body">
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.2rem' }}>
                <div style={{ width: 54, height: 54, borderRadius: 14, background: 'rgba(136,202,83,.12)', border: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={24} style={{ color: T.green }} />
                </div>
                <div>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.65rem', fontWeight: 600, color: T.greenSub, letterSpacing: '.1em' }}>{svc.n}</div>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: T.textMain, fontFamily: "'JetBrains Mono',monospace" }}>{svc.title}</h3>
                </div>
              </div>

              <p style={{ fontSize: '.9rem', color: T.textSub, lineHeight: 1.75, marginBottom: '1.5rem' }}>{svc.desc}</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '.5rem', marginBottom: '1.8rem' }}>
                {svc.features.map(f => (
                  <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '.6rem', fontSize: '.85rem', color: T.textSub }}>
                    <Check size={14} style={{ color: T.green, flexShrink: 0 }} />{f}
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.2rem', borderRadius: 12, background: T.light ? 'rgba(22,163,74,.05)' : 'rgba(136,202,83,.06)', border: `1px solid ${T.border}`, marginBottom: '1.5rem' }}>
                <div>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.9rem', fontWeight: 800, color: T.green }}>{svc.price}</div>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.6rem', color: T.textMuted, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Timer size={10} style={{ color: T.green }} />Délai : {svc.del}
                  </div>
                </div>
                <a href={`https://wa.me/2250142507750?text=Bonjour AKATech, je suis intéressé par ${svc.title}`} target="_blank" rel="noreferrer" className="btn-raised">
                  Demander un devis <ArrowRight size={14} />
                </a>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}

function TechSection() {
  const T = useTheme()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  return (
    <section ref={ref} style={{ padding: '7rem 5%', background: T.bgAlt }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <h2 className="section-title-big" style={{ position: 'relative', fontSize: 'clamp(1.9rem,7vw,2.8rem)', fontWeight: 800, fontFamily: "'JetBrains Mono',monospace", color: T.textMain, letterSpacing: '-.03em' }}>
            <GhostTitle text="DES TECHNOLOGIES ÉPROUVÉES" />
            Des technologies <GreenUnderline><span className="text-gradient">éprouvées</span></GreenUnderline>
          </h2>
        </motion.div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: '1rem' }}>
          {TECH_STACK.map(({ cat, items }, i) => (
            <motion.div key={cat} className="sku-card"
              initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: i * .08 }}
              style={{ padding: '1.4rem' }}>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.65rem', fontWeight: 600, color: T.green, letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: '1rem', borderBottom: `1px solid ${T.border}`, paddingBottom: '.6rem' }}>{cat}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '.4rem' }}>
                {items.map(item => (
                  <span key={item} style={{ fontSize: '.82rem', color: T.textSub, display: 'flex', alignItems: 'center', gap: '.4rem' }}>
                    <span style={{ width: 4, height: 4, borderRadius: '50%', background: T.green, flexShrink: 0 }} />{item}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function ServicesPage() {
  return (
    <div>
      <HeroServices />
      <ServicesList />
      <MarqueeStrip />
      <TechSection />
      <PageCTA message="Prêt à lancer votre projet ? Obtenez un devis gratuit en 24h." cta="Obtenir mon devis" />
    </div>
  )
}