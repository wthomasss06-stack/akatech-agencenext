'use client'
import { useRef, useState } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Users, Monitor, Code, Check, Award, Heart, Globe, Zap, Star, Target, Rocket, MessageCircle, ExternalLink } from 'lucide-react'
import { useTheme } from '@/lib/theme'
import { SectionEye, AnimatedCounter, LazyImg, MarqueeStrip, SectionCTA, GreenUnderline } from '@/components/ui/index'
import { STATS, TESTIMONIALS } from '@/lib/data'

const SKILLS = ['React','Next.js','Django','Python','Node.js','PostgreSQL','MySQL','Tailwind CSS','Framer Motion','Vercel','AWS','Docker','REST API','GraphQL','Mobile Money API']

const VALUES = [
  { icon: Target, title: 'Résultats concrets', desc: "Chaque solution est conçue pour générer des résultats mesurables : plus de clients, plus de revenus, moins de tâches manuelles." },
  { icon: Heart, title: 'Adapté au marché africain', desc: "Je comprends les réalités locales — Mobile Money, coupures internet, faible débit. Vos solutions fonctionnent dans votre contexte." },
  { icon: Zap, title: 'Livraison rapide', desc: "Pas d'attente de 3 mois. Les projets sont livrés en 5 à 21 jours selon la complexité, avec des jalons clairs à chaque étape." },
  { icon: Star, title: 'Qualité premium', desc: "Code propre, design sur-mesure, animations soignées. Chaque détail compte pour que votre solution se démarque." },
]

const TIMELINE = [
  { year: '2022', title: 'Les débuts', desc: "Premier projet freelance livré : un site vitrine pour un commerçant abidjanais. Le début d'une aventure." },
  { year: '2023', title: 'Première app SaaS', desc: "Développement de TechFlow, une application de gestion de projets pour PME. 100+ utilisateurs dès le lancement." },
  { year: '2024', title: 'AKATech Agence', desc: "Transformation en agence officielle. Lancement de services structurés et premiers clients récurrents." },
  { year: '2025', title: "Aujourd'hui", desc: "+10 projets livrés, 100% de clients satisfaits. L'agence continue de grandir et d'innover." },
]

function HeroAbout() {
  const T = useTheme()
  return (
    <section style={{ padding: '9rem 5% 6rem', background: T.bg, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle,rgba(34,200,100,.07),transparent 65%)', pointerEvents: 'none' }} />
      <div className="grid-bg" style={{ position: 'absolute', inset: 0, opacity: .25 }} />

      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
        {/* Left */}
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: .7, ease: [.22,1,.36,1] }}>
          <SectionEye label="// Qui sommes-nous" />
          <h1 style={{ fontSize: 'clamp(2.2rem,4.5vw,3.5rem)', fontWeight: 800, fontFamily: "'Syne',sans-serif", color: T.textMain, letterSpacing: '-.04em', lineHeight: 1.1, marginBottom: '1rem' }}>
            Votre croissance digitale,<br />
            <GreenUnderline><span className="text-gradient">c'est notre mission.</span></GreenUnderline>
          </h1>
          <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: .8, delay: .3 }}
            style={{ height: 2, background: 'linear-gradient(90deg,#22c864,rgba(34,200,100,.1))', borderRadius: 2, marginBottom: '1.5rem', transformOrigin: 'left' }} />
          <p style={{ fontSize: '.95rem', color: T.textSub, lineHeight: 1.85, marginBottom: '.9rem' }}>
            <strong style={{ color: T.textMain }}>AKATech</strong> accompagne les entrepreneurs et PME en Côte d'Ivoire qui veulent une présence digitale sérieuse — pour gagner en crédibilité, attirer des clients et automatiser leur activité.
          </p>
          <p style={{ fontSize: '.95rem', color: T.textSub, lineHeight: 1.85, marginBottom: '2rem' }}>
            Je suis <strong style={{ color: T.textMain }}>M'Bollo Aka Elvis</strong>, développeur full-stack basé à Abidjan. Avec 3 ans d'expérience et +10 projets livrés, je conçois des solutions web qui répondent aux réalités du marché africain.
          </p>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <a href="https://wa.me/2250142507750" target="_blank" rel="noreferrer" className="btn-raised">
              Me contacter <MessageCircle size={16} />
            </a>
            <a href="https://akafolio160502.vercel.app/" target="_blank" rel="noreferrer" className="btn-ghost">
              Mon portfolio <ExternalLink size={14} />
            </a>
          </div>
        </motion.div>

        {/* Right — photo grid */}
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: .7, delay: .2 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '280px 200px', gap: '1rem' }}>
            <motion.div whileHover={{ scale: 1.02 }} style={{ gridRow: '1 / 3', borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(34,200,100,.2)', boxShadow: '8px 8px 32px rgba(0,0,0,.3)' }}>
              <LazyImg src="/images/about-1.jpg" alt="AKATech Team" style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                placeholder={<div style={{ height: '100%', background: 'linear-gradient(135deg,#0a1a0e,#060e09)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Users size={32} style={{ color: 'rgba(34,200,100,.3)' }} /></div>} />
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }} style={{ borderRadius: 14, overflow: 'hidden', border: '1px solid rgba(34,200,100,.15)', boxShadow: '6px 6px 24px rgba(0,0,0,.2)' }}>
              <LazyImg src="/images/about-2.jpg" alt="Bureau" style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                placeholder={<div style={{ height: '100%', background: 'linear-gradient(135deg,#0a1a0e,#060e09)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Monitor size={28} style={{ color: 'rgba(34,200,100,.3)' }} /></div>} />
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }} style={{ borderRadius: 14, overflow: 'hidden', border: '1px solid rgba(34,200,100,.15)', boxShadow: '6px 6px 24px rgba(0,0,0,.2)', position: 'relative' }}>
              <LazyImg src="/images/about-3.jpg" alt="Développement" style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                placeholder={<div style={{ height: '100%', background: 'linear-gradient(135deg,#0a1a0e,#060e09)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Code size={28} style={{ color: 'rgba(34,200,100,.3)' }} /></div>} />
              <motion.div initial={{ opacity: 0, scale: .6 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: .8, type: 'spring', stiffness: 280 }}
                style={{ position: 'absolute', top: -14, right: -10, width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(145deg,#27d570,#1aa355)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: '4px 4px 16px rgba(0,0,0,.4)' }}>
                <span style={{ fontFamily: "'Orbitron',sans-serif", fontSize: '.9rem', fontWeight: 900, color: '#fff', lineHeight: 1 }}>3+</span>
                <span style={{ fontFamily: "'Syne',sans-serif", fontSize: '.4rem', color: 'rgba(255,255,255,.8)', letterSpacing: '.06em', textTransform: 'uppercase' }}>Années</span>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function StatsSection() {
  const T = useTheme()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  return (
    <section ref={ref} style={{ padding: '5rem 5%', background: T.bgAlt }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: '1rem' }}>
        {STATS.map(({ val, suffix, label }, i) => (
          <motion.div key={label} className="sku-card"
            initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: i * .1 }}
            style={{ padding: '2rem', textAlign: 'center' }}>
            <div style={{ fontFamily: "'Syne',sans-serif", fontSize: '.9rem', fontWeight: 800, color: T.green, lineHeight: 1 }}>
              <AnimatedCounter target={val} suffix={suffix} />
            </div>
            <div style={{ fontFamily: "'Syne',sans-serif", fontSize: '.6rem', color: T.textMuted, textTransform: 'uppercase', letterSpacing: '.08em', marginTop: '.5rem' }}>{label}</div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

function SkillsSection() {
  const T = useTheme()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  return (
    <section ref={ref} style={{ padding: '7rem 5%', background: T.bg }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
        <motion.div initial={{ opacity: 0, x: -30 }} animate={inView ? { opacity: 1, x: 0 } : {}}>
          <SectionEye label="// Stack Technique" />
          <h2 style={{ fontSize: 'clamp(1.8rem,3vw,2.4rem)', fontWeight: 800, fontFamily: "'Syne',sans-serif", color: T.textMain, letterSpacing: '-.03em', marginBottom: '1.2rem' }}>
            Les technologies qui font <GreenUnderline><span className="text-gradient">la différence</span></GreenUnderline>
          </h2>
          <p style={{ fontSize: '.9rem', color: T.textSub, lineHeight: 1.8, marginBottom: '2rem' }}>
            J'utilise les meilleures technologies modernes — sélectionnées pour leur performance, leur fiabilité et leur adéquation avec vos besoins réels.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.5rem' }}>
            {SKILLS.map((s, i) => (
              <motion.span key={s} initial={{ opacity: 0, y: 8 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: .3 + i * .04 }}
                style={{ padding: '.35rem .85rem', background: 'rgba(34,200,100,.07)', border: `1px solid ${T.border}`, borderRadius: 100, fontFamily: "'Syne',sans-serif", fontSize: '.65rem', fontWeight: 600, color: T.green, letterSpacing: '.06em' }}>
                {s}
              </motion.span>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 30 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ delay: .2 }}
          style={{ borderRadius: 16, overflow: 'hidden', border: `1px solid ${T.border}`, boxShadow: '8px 8px 32px rgba(0,0,0,.3)', height: 400 }}>
          <LazyImg src="/images/about-4.jpg" alt="Développeur" style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            placeholder={<div style={{ height: '100%', background: 'linear-gradient(135deg,#0a1a0e,#060e09)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Code size={48} style={{ color: 'rgba(34,200,100,.3)' }} /></div>} />
        </motion.div>
      </div>
    </section>
  )
}

function ValuesSection() {
  const T = useTheme()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  return (
    <section ref={ref} style={{ padding: '7rem 5%', background: T.bgAlt }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <SectionEye label="// Nos Valeurs" center />
          <h2 style={{ fontSize: 'clamp(1.9rem,3.5vw,2.6rem)', fontWeight: 800, fontFamily: "'Syne',sans-serif", color: T.textMain, letterSpacing: '-.03em' }}>
            Ce qui nous <GreenUnderline><span className="text-gradient">distingue</span></GreenUnderline>
          </h2>
        </motion.div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: '1.2rem' }}>
          {VALUES.map(({ icon: Icon, title, desc }, i) => (
            <motion.div key={title} className="sku-card"
              initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: i * .1 }}
              style={{ padding: '2rem' }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: 'rgba(34,200,100,.1)', border: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.2rem' }}>
                <Icon size={24} style={{ color: T.green }} />
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: T.textMain, fontFamily: "'Syne',sans-serif", marginBottom: '.5rem' }}>{title}</h3>
              <p style={{ fontSize: '.82rem', color: T.textSub, lineHeight: 1.65 }}>{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function TimelineSection() {
  const T = useTheme()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  return (
    <section ref={ref} style={{ padding: '7rem 5%', background: T.bg, position: 'relative' }}>
      <div className="grid-bg" style={{ position: 'absolute', inset: 0, opacity: .2 }} />
      <div style={{ maxWidth: 900, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <SectionEye label="// Notre Histoire" center />
          <h2 style={{ fontSize: 'clamp(1.9rem,3.5vw,2.6rem)', fontWeight: 800, fontFamily: "'Syne',sans-serif", color: T.textMain, letterSpacing: '-.03em' }}>
            L'évolution d'<GreenUnderline><span className="text-gradient">AKATech</span></GreenUnderline>
          </h2>
        </motion.div>

        <div style={{ position: 'relative' }}>
          {/* Vertical line */}
          <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, background: `linear-gradient(to bottom, transparent, ${T.green}, transparent)`, transform: 'translateX(-50%)' }} />

          {TIMELINE.map(({ year, title, desc }, i) => (
            <motion.div key={year}
              initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: i * .15 }}
              style={{ display: 'flex', justifyContent: i % 2 === 0 ? 'flex-start' : 'flex-end', marginBottom: '3rem', position: 'relative' }}>
              {/* Dot */}
              <div style={{ position: 'absolute', left: '50%', top: '1.2rem', transform: 'translateX(-50%)', width: 14, height: 14, borderRadius: '50%', background: '#22c864', border: '3px solid rgba(34,200,100,.3)', boxShadow: '0 0 16px rgba(34,200,100,.4)', zIndex: 1 }} />

              <div className="sku-card" style={{ width: '44%', padding: '1.5rem' }}>
                <div style={{ fontFamily: "'Syne',sans-serif", fontSize: '.9rem', fontWeight: 800, color: T.green, letterSpacing: '.08em', marginBottom: '.5rem' }}>{year}</div>
                <h3 style={{ fontSize: '.95rem', fontWeight: 700, color: T.textMain, fontFamily: "'Syne',sans-serif", marginBottom: '.4rem' }}>{title}</h3>
                <p style={{ fontSize: '.8rem', color: T.textSub, lineHeight: 1.6 }}>{desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function AboutPage() {
  const T = useTheme()
  return (
    <div>
      <HeroAbout />
      <StatsSection />
      <MarqueeStrip />
      <SkillsSection />
      <ValuesSection />
      <TimelineSection />
      <SectionCTA variant="strong" message="Prêt à collaborer avec AKATech ? Discutons de votre projet." cta="Démarrer un projet" />
    </div>
  )
}
