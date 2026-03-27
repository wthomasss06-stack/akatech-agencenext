'use client'
import { useState, useEffect, useRef } from 'react'
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import {
  ArrowRight, Star, Check, ChevronRight, Zap,
  Globe, ShoppingCart, Cpu, Server, Palette, Wrench,
  TrendingUp, Users, Clock, Award,
  MessageCircle, Phone, Mail, MapPin,
  Target, Code, Rocket, Timer, AlertTriangle,
} from 'lucide-react'
import { useTheme } from '@/lib/theme'
import { SectionEye, AnimatedCounter, LazyImg, MarqueeStrip, SectionCTA } from '@/components/ui/index'
import { SERVICES, PROJECTS, TESTIMONIALS, STATS } from '@/lib/data'

const ICON_MAP = { Globe, ShoppingCart, Cpu, Server, Palette, Wrench }

// ── HERO ─────────────────────────────────────────────────────
function Hero() {
  const T = useTheme()
  const [idx, setIdx] = useState(0)
  const slides = [
    { tag: '// Site Vitrine', title: 'Votre présence digitale,', accent: 'professionnelle & rentable.', sub: "Un site qui travaille pour vous 24h/24 — attirez des clients, gagnez en crédibilité et développez votre activité." },
    { tag: '// E-Commerce', title: 'Vendez en ligne,', accent: 'même quand vous dormez.', sub: "Boutique complète avec paiement Mobile Money, gestion stocks et tableau de bord admin. Livrée en 14 jours." },
    { tag: '// Application SaaS', title: 'Automatisez vos tâches,', accent: 'scalez votre activité.', sub: "Des applications web sur-mesure pour digitaliser vos processus et économiser des heures de travail chaque semaine." },
  ]

  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % slides.length), 5000)
    return () => clearInterval(t)
  }, [])

  return (
    <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', overflow: 'hidden', background: T.bg, paddingTop: 100 }}>
      {/* BG */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: 700, height: 700, borderRadius: '50%', background: 'radial-gradient(circle,rgba(34,200,100,.07),transparent 65%)' }} />
        <div style={{ position: 'absolute', bottom: '0', left: '-10%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle,rgba(34,200,100,.04),transparent 65%)' }} />
        <div className="grid-bg" style={{ position: 'absolute', inset: 0, opacity: .3 }} />
        {/* Scan line */}
        <motion.div animate={{ top: ['−10%', '110%'] }} transition={{ duration: 6, repeat: Infinity, ease: 'linear', repeatDelay: 3 }}
          style={{ position: 'absolute', left: 0, right: 0, height: 1, background: 'linear-gradient(90deg,transparent,rgba(34,200,100,.3),transparent)', pointerEvents: 'none' }} />
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 5%', position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
        {/* Left */}
        <div>
          <AnimatePresence mode="wait">
            <motion.div key={idx} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: .5 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '.5rem', padding: '.3rem .9rem', borderRadius: 100, background: 'rgba(34,200,100,.08)', border: '1px solid rgba(34,200,100,.2)', marginBottom: '1.5rem' }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c864', animation: 'dot-blink 1.4s ease-in-out infinite' }} />
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.62rem', color: '#22c864', letterSpacing: '.1em' }}>{slides[idx].tag}</span>
              </div>

              <h1 style={{ fontSize: 'clamp(2.2rem,5vw,4rem)', fontWeight: 800, fontFamily: "'Syne',sans-serif", color: T.textMain, letterSpacing: '-.04em', lineHeight: 1.1, marginBottom: '.4rem' }}>
                {slides[idx].title}
              </h1>
              <h1 style={{ fontSize: 'clamp(2.2rem,5vw,4rem)', fontWeight: 800, fontFamily: "'Syne',sans-serif", letterSpacing: '-.04em', lineHeight: 1.1, marginBottom: '1.5rem' }}
                className="text-gradient">
                {slides[idx].accent}
              </h1>
              <p style={{ fontSize: '1rem', color: T.textSub, lineHeight: 1.75, marginBottom: '2.5rem', maxWidth: 480 }}>
                {slides[idx].sub}
              </p>
            </motion.div>
          </AnimatePresence>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '3rem' }}>
            <a href="https://wa.me/2250142507750" target="_blank" rel="noreferrer" className="btn-raised" style={{ fontSize: '1rem', padding: '1rem 2.2rem' }}>
              Démarrer mon projet <ArrowRight size={16} />
            </a>
            <Link href="/projects" className="btn-ghost" style={{ fontSize: '1rem', padding: '1rem 2.2rem' }}>
              Voir les réalisations
            </Link>
          </div>

          {/* Trust badges */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.7rem' }}>
            {['✓ Devis gratuit', '✓ Livraison garantie', '✓ Formation incluse', '✓ Support 48h'].map(b => (
              <span key={b} style={{ padding: '.25rem .7rem', borderRadius: 100, background: 'rgba(34,200,100,.07)', border: '1px solid rgba(34,200,100,.15)', fontFamily: "'JetBrains Mono',monospace", fontSize: '.6rem', color: T.green, letterSpacing: '.06em' }}>
                {b}
              </span>
            ))}
          </div>
        </div>

        {/* Right — hero image + floating cards */}
        <div style={{ position: 'relative' }} className="hide-mobile">
          <motion.div animate={{ y: [0, -12, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            style={{ borderRadius: 24, overflow: 'hidden', border: '1px solid rgba(34,200,100,.2)', boxShadow: '0 0 60px rgba(34,200,100,.12), 20px 20px 60px rgba(0,0,0,.5)', height: 420 }}>
            <LazyImg src="/images/hero-bg.jpg" alt="AKATech Hero"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              placeholder={<div style={{ height: '100%', background: 'linear-gradient(135deg,#0a1a0e,#060e09)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Code size={48} style={{ color: 'rgba(34,200,100,.3)' }} /></div>}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(6,14,9,.8),transparent 50%)' }} />
          </motion.div>

          {/* Floating card 1 */}
          <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: .5 }}
            className="sku-card"
            style={{ position: 'absolute', bottom: '1rem', left: '-1.5rem', padding: '.85rem 1.2rem', display: 'flex', alignItems: 'center', gap: '.7rem' }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(34,200,100,.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingUp size={18} style={{ color: '#22c864' }} />
            </div>
            <div>
              <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: '.9rem', fontWeight: 900, color: '#22c864' }}>+10</div>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.55rem', color: T.textMuted, textTransform: 'uppercase', letterSpacing: '.06em' }}>Projets livrés</div>
            </div>
          </motion.div>

          {/* Floating card 2 */}
          <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            className="sku-card"
            style={{ position: 'absolute', top: '1rem', right: '-1.5rem', padding: '.75rem 1rem', display: 'flex', alignItems: 'center', gap: '.6rem' }}>
            <div style={{ display: 'flex' }}>
              {[1,2,3,4,5].map(s => <Star key={s} size={12} style={{ color: '#22c864' }} fill="#22c864" />)}
            </div>
            <span style={{ fontFamily: "'Syne',sans-serif", fontSize: '.75rem', fontWeight: 700, color: T.textMain }}>100% satisfaits</span>
          </motion.div>

          {/* Slide dots */}
          <div style={{ position: 'absolute', bottom: '3.5rem', right: '1rem', display: 'flex', gap: '.4rem' }}>
            {slides.map((_, i) => (
              <button key={i} onClick={() => setIdx(i)}
                style={{ width: i === idx ? 20 : 6, height: 6, borderRadius: 3, background: i === idx ? '#22c864' : 'rgba(34,200,100,.25)', border: 'none', cursor: 'pointer', transition: 'all .3s' }} />
            ))}
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .8 }}
        style={{ maxWidth: 1200, margin: '4rem auto 0', padding: '0 5%', width: '100%', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1px', background: T.border, borderRadius: 16, overflow: 'hidden', border: `1px solid ${T.border}` }}>
          {STATS.map(({ val, suffix, label }) => (
            <div key={label} style={{ padding: '1.5rem', background: T.bgAlt, textAlign: 'center' }}>
              <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: '1.8rem', fontWeight: 900, color: '#22c864', lineHeight: 1 }}>
                <AnimatedCounter target={val} suffix={suffix} />
              </div>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.6rem', color: T.textMuted, textTransform: 'uppercase', letterSpacing: '.08em', marginTop: '.4rem' }}>{label}</div>
            </div>
          ))}
        </div>
      </motion.div>

      <div style={{ paddingBottom: '5rem' }} />
    </section>
  )
}

// ── SERVICES PREVIEW ─────────────────────────────────────────
function ServicesPreview() {
  const T = useTheme()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section ref={ref} style={{ padding: '7rem 5%', background: T.bg, position: 'relative' }}>
      <div className="grid-bg" style={{ position: 'absolute', inset: 0, opacity: .25 }} />
      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <SectionEye label="// Nos Services" center />
          <h2 style={{ fontSize: 'clamp(1.9rem,3.5vw,2.8rem)', fontWeight: 800, fontFamily: "'Syne',sans-serif", color: T.textMain, letterSpacing: '-.03em', lineHeight: 1.15 }}>
            Des solutions qui travaillent pour vous,<br />
            <span className="text-gradient">même quand vous dormez</span>
          </h2>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: '1.2rem' }}>
          {SERVICES.map(({ icon, n, title, desc, price, del }, i) => {
            const Icon = ICON_MAP[icon] || Globe
            return (
              <motion.div key={title} className="sku-card"
                initial={{ opacity: 0, y: 32, scale: .97 }}
                animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ duration: .55, delay: (i % 3) * .1 }}
                style={{ padding: '1.8rem', position: 'relative', overflow: 'hidden' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.2rem' }}>
                  <div style={{ width: 50, height: 50, borderRadius: 12, background: 'rgba(34,200,100,.1)', border: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={22} style={{ color: T.green }} />
                  </div>
                  <div>
                    <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.58rem', color: T.greenSub, letterSpacing: '.1em', marginBottom: '.2rem' }}>{n}</div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: T.textMain, fontFamily: "'Syne',sans-serif" }}>{title}</h3>
                  </div>
                </div>
                <p style={{ fontSize: '.83rem', color: T.textSub, lineHeight: 1.7, marginBottom: '1.2rem' }}>{desc}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '.9rem', borderTop: `1px solid ${T.border}` }}>
                  <span style={{ fontFamily: "'Orbitron',sans-serif", fontSize: '.78rem', fontWeight: 700, color: T.green }}>{price}</span>
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.62rem', color: T.textMuted, display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                    <Timer size={11} style={{ color: T.green }} />{del}
                  </span>
                </div>
              </motion.div>
            )
          })}
        </div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: .6 }}
          style={{ textAlign: 'center', marginTop: '3rem' }}>
          <Link href="/services" className="btn-ghost" style={{ fontSize: '.9rem' }}>
            Voir tous les services <ArrowRight size={14} />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

// ── WHY US ───────────────────────────────────────────────────
function WhyUs() {
  const T = useTheme()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const items = [
    { n: '01', title: 'Livraison dans les délais', desc: "Pas de mauvaises surprises. Chaque projet est livré à la date convenue, avec un suivi régulier jusqu'à la mise en ligne." },
    { n: '02', title: 'Design 100% sur mesure', desc: "Votre site est unique, pensé pour votre activité. Zéro template, zéro copier-coller — une identité visuelle qui vous ressemble." },
    { n: '03', title: 'Support & Formation inclus', desc: "Vous repartez autonome. Une formation est incluse pour gérer votre site facilement, sans dépendre d'un technicien." },
    { n: '04', title: 'SEO & Performance optimisés', desc: "Un site rapide, visible sur Google. Vos clients vous trouvent plus facilement — et votre crédibilité monte instantanément." },
  ]
  return (
    <section ref={ref} style={{ padding: '7rem 5%', background: T.bgAlt, position: 'relative', overflow: 'hidden' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <SectionEye label="// Built on Trust" center />
          <h2 style={{ fontSize: 'clamp(1.9rem,3vw,2.6rem)', fontWeight: 800, fontFamily: "'Syne',sans-serif", color: T.textMain, letterSpacing: '-.03em' }}>
            Pourquoi les entrepreneurs{' '}<span className="text-gradient">choisissent AKATech.</span>
          </h2>
        </motion.div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: '1rem' }}>
          {items.map(({ n, title, desc }, i) => (
            <motion.div key={n} className="sku-card"
              initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: i * .08 }}
              style={{ padding: '1.8rem' }}>
              <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: '1.8rem', fontWeight: 900, color: T.green, opacity: .3, lineHeight: 1, marginBottom: '.8rem' }}>{n}</div>
              <h3 style={{ fontSize: '.95rem', fontWeight: 700, color: T.textMain, fontFamily: "'Syne',sans-serif", marginBottom: '.4rem' }}>{title}</h3>
              <p style={{ fontSize: '.8rem', color: T.textSub, lineHeight: 1.6 }}>{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── PROJECTS PREVIEW ─────────────────────────────────────────
function ProjectsPreview() {
  const T = useTheme()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section ref={ref} style={{ padding: '7rem 5%', background: T.bg, position: 'relative' }}>
      <div className="grid-bg" style={{ position: 'absolute', inset: 0, opacity: .2 }} />
      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <SectionEye label="// Réalisations" />
            <h2 style={{ fontSize: 'clamp(1.9rem,3.5vw,2.8rem)', fontWeight: 800, fontFamily: "'Syne',sans-serif", color: T.textMain, letterSpacing: '-.03em' }}>
              Nos derniers <span className="text-gradient">projets livrés</span>
            </h2>
          </div>
          <Link href="/projects" className="btn-ghost" style={{ padding: '.65rem 1.4rem', fontSize: '.82rem' }}>
            Tous les projets <ArrowRight size={13} />
          </Link>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: '1.2rem' }}>
          {PROJECTS.slice(0, 6).map(({ title, type, desc, img, tech, result }, i) => (
            <motion.div key={title} className="sku-card"
              initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: i * .08 }}
              style={{ overflow: 'hidden' }}
              whileHover={{ y: -6 }}>
              <div style={{ height: 200, position: 'relative', overflow: 'hidden' }}>
                <LazyImg src={img} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .5s' }}
                  placeholder={<div style={{ height: '100%', background: 'linear-gradient(135deg,#0a1a0e,#060e09)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Code size={32} style={{ color: 'rgba(34,200,100,.3)' }} /></div>} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(6,14,9,.9),transparent 50%)' }} />
                <div style={{ position: 'absolute', top: '.8rem', left: '.8rem', padding: '.25rem .7rem', borderRadius: 100, background: 'rgba(34,200,100,.15)', backdropFilter: 'blur(8px)', border: '1px solid rgba(34,200,100,.3)', fontFamily: "'JetBrains Mono',monospace", fontSize: '.58rem', color: '#22c864', letterSpacing: '.08em' }}>{type}</div>
                <div style={{ position: 'absolute', bottom: '.8rem', right: '.8rem', padding: '.25rem .7rem', borderRadius: 100, background: 'rgba(34,200,100,.9)', fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: '.65rem', color: '#fff' }}>{result}</div>
              </div>
              <div style={{ padding: '1.4rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: T.textMain, fontFamily: "'Syne',sans-serif", marginBottom: '.4rem' }}>{title}</h3>
                <p style={{ fontSize: '.8rem', color: T.textSub, lineHeight: 1.6, marginBottom: '1rem' }}>{desc}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.35rem' }}>
                  {tech.map(t => (
                    <span key={t} style={{ padding: '.2rem .6rem', borderRadius: 100, background: 'rgba(34,200,100,.07)', border: `1px solid ${T.border}`, fontFamily: "'JetBrains Mono',monospace", fontSize: '.58rem', color: T.green }}>{t}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── TESTIMONIALS ─────────────────────────────────────────────
function Testimonials() {
  const T = useTheme()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const [idx, setIdx] = useState(0)
  const t = TESTIMONIALS[idx]

  return (
    <section ref={ref} style={{ padding: '7rem 5%', background: T.bgAlt, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle,rgba(34,200,100,.05),transparent 65%)', pointerEvents: 'none' }} />
      <div style={{ maxWidth: 900, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <SectionEye label="// Témoignages" center />
          <h2 style={{ fontSize: 'clamp(1.9rem,3.5vw,2.6rem)', fontWeight: 800, fontFamily: "'Syne',sans-serif", color: T.textMain, letterSpacing: '-.03em' }}>
            Ce que disent nos <span className="text-gradient">clients</span>
          </h2>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div key={idx} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: .4 }}
            className="sku-card" style={{ padding: '2.5rem', textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.2rem' }}>
              {[1,2,3,4,5].map(s => <Star key={s} size={18} fill="#22c864" style={{ color: '#22c864' }} />)}
            </div>
            <blockquote style={{ fontSize: '1.05rem', color: T.textMain, lineHeight: 1.75, fontStyle: 'italic', marginBottom: '2rem', maxWidth: 640, margin: '0 auto 2rem' }}>
              "{t.text}"
            </blockquote>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
              <div style={{ width: 52, height: 52, borderRadius: '50%', overflow: 'hidden', border: '2px solid rgba(34,200,100,.35)' }}>
                <LazyImg src={t.img} alt={t.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  placeholder={<div style={{ width: 52, height: 52, background: 'rgba(34,200,100,.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#22c864', fontFamily: "'Syne',sans-serif", fontWeight: 700 }}>{t.name[0]}</div>} />
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: 700, color: T.textMain, fontFamily: "'Syne',sans-serif", fontSize: '.9rem' }}>{t.name}</div>
                <div style={{ fontSize: '.72rem', color: T.textMuted, fontFamily: "'JetBrains Mono',monospace" }}>{t.role}</div>
              </div>
              <span style={{ marginLeft: 'auto', padding: '.3rem .8rem', borderRadius: 100, background: 'rgba(34,200,100,.12)', border: '1px solid rgba(34,200,100,.25)', color: '#22c864', fontFamily: "'JetBrains Mono',monospace", fontSize: '.62rem', fontWeight: 700 }}>{t.result}</span>
            </div>
          </motion.div>
        </AnimatePresence>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '.5rem', marginTop: '1.5rem' }}>
          {TESTIMONIALS.map((_, i) => (
            <button key={i} onClick={() => setIdx(i)}
              style={{ width: i === idx ? 24 : 8, height: 8, borderRadius: 4, background: i === idx ? '#22c864' : 'rgba(34,200,100,.2)', border: 'none', cursor: 'pointer', transition: 'all .3s' }} />
          ))}
        </div>
      </div>
    </section>
  )
}

// ── PROCESS ──────────────────────────────────────────────────
function Process() {
  const T = useTheme()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const [activeStep, setActiveStep] = useState(0)
  const steps = [
    { n: '01', icon: MessageCircle, title: "On vous écoute", desc: "Vous décrivez votre projet, vos objectifs et votre budget. Devis gratuit et personnalisé, sans engagement." },
    { n: '02', icon: Target, title: "On planifie", desc: "On définit ensemble la meilleure solution : technologies, design, délais et fonctionnalités." },
    { n: '03', icon: Code, title: "On développe", desc: "Votre solution prend vie avec un code propre et un design soigné. Vous suivez l'avancement à chaque étape." },
    { n: '04', icon: Rocket, title: "On livre & on forme", desc: "Mise en ligne, tests, formation et support inclus. Vous repartez avec un outil prêt à attirer des clients." },
  ]

  useEffect(() => {
    if (!inView) return
    const t = setInterval(() => setActiveStep(s => (s + 1) % steps.length), 2500)
    return () => clearInterval(t)
  }, [inView])

  return (
    <section ref={ref} style={{ padding: '7rem 5%', background: T.bg }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <SectionEye label="// Notre Processus" center />
          <h2 style={{ fontSize: 'clamp(1.9rem,3.5vw,2.8rem)', fontWeight: 800, fontFamily: "'Syne',sans-serif", color: T.textMain, letterSpacing: '-.03em' }}>
            De l'idée à la <span className="text-gradient">mise en ligne</span>
          </h2>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '1.5rem' }}>
          {steps.map(({ n, icon: Icon, title, desc }, i) => (
            <motion.div key={n}
              initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: i * .1 }}
              onClick={() => setActiveStep(i)}
              className="sku-card"
              style={{ padding: '2rem', cursor: 'pointer', border: activeStep === i ? '1px solid rgba(34,200,100,.4)' : `1px solid ${T.border}`, transition: 'all .3s', boxShadow: activeStep === i ? '0 0 30px rgba(34,200,100,.15)' : undefined }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '.8rem', marginBottom: '1.2rem' }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: activeStep === i ? 'rgba(34,200,100,.2)' : 'rgba(34,200,100,.08)', border: `1px solid ${activeStep === i ? 'rgba(34,200,100,.4)' : T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .3s' }}>
                  <Icon size={22} style={{ color: T.green }} />
                </div>
                <span style={{ fontFamily: "'Orbitron',sans-serif", fontSize: '1.4rem', fontWeight: 900, color: T.green, opacity: .3 }}>{n}</span>
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: T.textMain, fontFamily: "'Syne',sans-serif", marginBottom: '.5rem' }}>{title}</h3>
              <p style={{ fontSize: '.82rem', color: T.textSub, lineHeight: 1.65 }}>{desc}</p>
              {activeStep === i && (
                <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} style={{ height: 2, background: 'linear-gradient(90deg,#22c864,rgba(34,200,100,.1))', borderRadius: 1, marginTop: '1.2rem', transformOrigin: 'left' }} />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── HOME PAGE ────────────────────────────────────────────────
export default function HomePage() {
  return (
    <div style={{ paddingTop: 0 }}>
      <Hero />
      <MarqueeStrip />
      <ServicesPreview />
      <SectionCTA message="Vous avez une idée de projet ? On en parle — c'est gratuit et sans engagement." cta="Discuter sur WhatsApp" />
      <WhyUs />
      <Process />
      <MarqueeStrip />
      <ProjectsPreview />
      <SectionCTA variant="strong" message="Ces projets ont été livrés dans les délais, avec formation incluse. Le vôtre peut l'être aussi." cta="Démarrer mon projet" />
      <Testimonials />
      <SectionCTA message="Comme eux, donnez à votre activité la présence digitale qu'elle mérite." cta="Rejoindre nos clients →" />
    </div>
  )
}
