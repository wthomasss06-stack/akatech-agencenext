'use client'
import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Check, Globe, ShoppingCart, Cpu, Server, Palette, Wrench, Zap, Timer, MessageCircle } from 'lucide-react'
import { useTheme } from '@/lib/theme'
import { SectionEye, LazyImg, MarqueeStrip, SectionCTA, GreenUnderline } from '@/components/ui/index'
import { SERVICES } from '@/lib/data'

const ICON_MAP = { Globe, ShoppingCart, Cpu, Server, Palette, Wrench }

const PROCESS_STEPS = [
  { n: '01', title: 'Consultation gratuite', desc: 'Échange de 30 min pour comprendre votre projet, vos objectifs et votre budget. Aucun engagement.' },
  { n: '02', title: 'Devis personnalisé', desc: 'Proposition détaillée avec planning, technologies et tarif. Validé ensemble avant de commencer.' },
  { n: '03', title: 'Développement agile', desc: 'Jalons hebdomadaires, preview en ligne, retours pris en compte en temps réel.' },
  { n: '04', title: 'Livraison + Formation', desc: 'Mise en ligne, tests, documentation et formation 2h pour gérer votre solution en autonomie.' },
]

const TECH_STACK = [
  { cat: 'Frontend', items: ['React', 'Next.js', 'Framer Motion', 'Tailwind CSS'] },
  { cat: 'Backend', items: ['Django', 'Python', 'Node.js', 'Express'] },
  { cat: 'Base de données', items: ['PostgreSQL', 'MySQL', 'Redis', 'MongoDB'] },
  { cat: 'Déploiement', items: ['Vercel', 'AWS', 'Nginx', 'Docker'] },
  { cat: 'Paiements', items: ['MTN MoMo', 'Orange Money', 'Wave', 'Stripe'] },
  { cat: 'Outils', items: ['Git', 'VS Code', 'Figma', 'Postman'] },
]

function HeroServices() {
  const T = useTheme()
  return (
    <section style={{ padding: '9rem 5% 6rem', background: T.bg, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '-15%', right: '-10%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle,rgba(34,200,100,.07),transparent 65%)', pointerEvents: 'none' }} />
      <div className="grid-bg" style={{ position: 'absolute', inset: 0, opacity: .25 }} />
      <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .6 }}>
          <SectionEye label="// Nos Services" center />
          <h1 style={{ fontSize: 'clamp(2.4rem,5vw,3.8rem)', fontWeight: 800, fontFamily: "'Syne',sans-serif", color: T.textMain, letterSpacing: '-.04em', lineHeight: 1.1, marginBottom: '1.2rem' }}>
            Des solutions web qui{' '}
            <GreenUnderline><span className="text-gradient">travaillent pour vous</span></GreenUnderline>
          </h1>
          <p style={{ fontSize: '1rem', color: T.textSub, lineHeight: 1.75, maxWidth: 620, margin: '0 auto 2.5rem' }}>
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
          <SectionEye label="// Catalogue de Services" center />
          <h2 style={{ fontSize: 'clamp(1.9rem,3.5vw,2.6rem)', fontWeight: 800, fontFamily: "'Syne',sans-serif", color: T.textMain, letterSpacing: '-.03em' }}>
            Choisissez votre <GreenUnderline><span className="text-gradient">solution</span></GreenUnderline>
          </h2>
        </motion.div>

        {/* Tabs */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.5rem', justifyContent: 'center', marginBottom: '3rem' }}>
          {SERVICES.map((s, i) => {
            const Ic = ICON_MAP[s.icon] || Globe
            return (
              <button key={s.title} onClick={() => setActive(i)}
                style={{ display: 'flex', alignItems: 'center', gap: '.4rem', padding: '.5rem 1.1rem', borderRadius: 100, border: '1px solid', borderColor: active === i ? T.green : T.border, background: active === i ? 'linear-gradient(145deg,#27d570,#1aa355)' : 'transparent', color: active === i ? '#fff' : T.textSub, fontFamily: "'Syne',sans-serif", fontSize: '.82rem', fontWeight: 600, cursor: 'pointer', transition: 'all .22s' }}>
                <Ic size={14} />{s.title}
              </button>
            )
          })}
        </div>

        {/* Service Detail */}
        <AnimatePresence mode="wait">
          <motion.div key={active}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: .35 }}
            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem', alignItems: 'center' }}>
            {/* Image */}
            <div style={{ borderRadius: 20, overflow: 'hidden', border: `1px solid ${T.border}`, boxShadow: '8px 8px 40px rgba(0,0,0,.3)', height: 380 }}>
              <LazyImg src={svc.img} alt={svc.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                placeholder={<div style={{ height: '100%', background: 'linear-gradient(135deg,#0a1a0e,#060e09)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon size={48} style={{ color: 'rgba(34,200,100,.3)' }} /></div>} />
            </div>

            {/* Content */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.2rem' }}>
                <div style={{ width: 54, height: 54, borderRadius: 14, background: 'rgba(34,200,100,.12)', border: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={24} style={{ color: T.green }} />
                </div>
                <div>
                  <div style={{ fontFamily: "'Syne',sans-serif", fontSize: '.65rem', fontWeight: 600, color: T.greenSub, letterSpacing: '.1em' }}>{svc.n}</div>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: T.textMain, fontFamily: "'Syne',sans-serif" }}>{svc.title}</h3>
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

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.2rem', borderRadius: 12, background: T.light ? 'rgba(22,163,74,.05)' : 'rgba(34,200,100,.06)', border: `1px solid ${T.border}`, marginBottom: '1.5rem' }}>
                <div>
                  <div style={{ fontFamily: "'Syne',sans-serif", fontSize: '.9rem', fontWeight: 800, color: T.green }}>{svc.price}</div>
                  <div style={{ fontFamily: "'Syne',sans-serif", fontSize: '.6rem', color: T.textMuted, display: 'flex', alignItems: 'center', gap: 4 }}>
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

function AllServices() {
  const T = useTheme()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  return (
    <section ref={ref} style={{ padding: '5rem 5%', background: T.bg }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: '1.2rem' }}>
          {SERVICES.map(({ icon, n, title, desc, price, del }, i) => {
            const Icon = ICON_MAP[icon] || Globe
            return (
              <motion.div key={title} className="sku-card"
                initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: i * .08 }}
                style={{ padding: '1.8rem' }}
                whileHover={{ y: -4 }}>
                <div style={{ width: 50, height: 50, borderRadius: 12, background: 'rgba(34,200,100,.1)', border: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                  <Icon size={22} style={{ color: T.green }} />
                </div>
                <div style={{ fontFamily: "'Syne',sans-serif", fontSize: '.65rem', fontWeight: 600, color: T.greenSub, letterSpacing: '.1em', marginBottom: '.3rem' }}>{n}</div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: T.textMain, fontFamily: "'Syne',sans-serif", marginBottom: '.5rem' }}>{title}</h3>
                <p style={{ fontSize: '.83rem', color: T.textSub, lineHeight: 1.7, marginBottom: '1.2rem' }}>{desc}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '.9rem', borderTop: `1px solid ${T.border}` }}>
                  <span style={{ fontFamily: "'Syne',sans-serif", fontSize: '.9rem', fontWeight: 800, color: T.green }}>{price}</span>
                  <a href={`https://wa.me/2250142507750?text=Bonjour, je suis intéressé par ${title}`} target="_blank" rel="noreferrer"
                    style={{ fontFamily: "'Syne',sans-serif", fontSize: '.65rem', fontWeight: 600, color: T.green, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4, transition: 'gap .2s' }}
                    onMouseEnter={e => e.currentTarget.style.gap = '8px'}
                    onMouseLeave={e => e.currentTarget.style.gap = '4px'}>
                    Devis <ArrowRight size={12} />
                  </a>
                </div>
              </motion.div>
            )
          })}
        </div>
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
          <SectionEye label="// Stack Technique" center />
          <h2 style={{ fontSize: 'clamp(1.9rem,3.5vw,2.6rem)', fontWeight: 800, fontFamily: "'Syne',sans-serif", color: T.textMain, letterSpacing: '-.03em' }}>
            Des technologies <GreenUnderline><span className="text-gradient">éprouvées</span></GreenUnderline>
          </h2>
        </motion.div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: '1rem' }}>
          {TECH_STACK.map(({ cat, items }, i) => (
            <motion.div key={cat} className="sku-card"
              initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: i * .08 }}
              style={{ padding: '1.4rem' }}>
              <div style={{ fontFamily: "'Syne',sans-serif", fontSize: '.65rem', fontWeight: 600, color: T.green, letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: '1rem', borderBottom: `1px solid ${T.border}`, paddingBottom: '.6rem' }}>{cat}</div>
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
      <AllServices />
      <MarqueeStrip />
      <TechSection />
      <SectionCTA variant="strong" message="Prêt à lancer votre projet ? Obtenez un devis gratuit en 24h." cta="Obtenir mon devis →" />
    </div>
  )
}
