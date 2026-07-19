'use client'
import { useRef, useState, useEffect } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Check, Globe, ShoppingCart, Cpu, Server, Palette, Wrench, Zap, Timer, MessageCircle, Map, MapPin } from 'lucide-react'
import { useTheme } from '@/lib/theme'
import { GhostTitle, LazyImg, PageCTA, LaserBeam, GreenUnderline } from '@/components/ui/index'
import ConversionMarquee from '@/components/ui/ConversionMarquee'
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

/* ────────────────────────────────────────────────
   HERO
──────────────────────────────────────────────── */
function HeroServices() {
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
          <GhostTitle text="SERVICES" />
          SERVICES
          
        </motion.h1>

        <div className="hr-side">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .6, delay: .2 }}>
            <p className="hr-kicker">De la consultation au déploiement</p>
            <p className="hr-desc">,chaque service est conçu pour répondre aux réalités du marché ivoirien — rapide, efficace, rentable.</p>
          </motion.div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
            
            
          </div>
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
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} style={{ textAlign: 'left', marginBottom: '3rem' }}>
          <h2 className="section-title-big" style={{ position: 'relative', fontSize: 'clamp(2.8rem,5.5vw,4.4rem)', fontWeight: 900, fontStyle: 'italic', fontFamily: "'Barlow Condensed',sans-serif", color: T.textMain, letterSpacing: '-.04em', lineHeight: 1.08 }}>
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
            .svc-detail-img  { order: 1; width: 100%; height: auto !important; }
            .svc-detail-body { order: 2; width: 100%; }
          }
        `}</style>

        {/* Service Detail */}
        <AnimatePresence mode="wait">
          <motion.div key={active}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: .35 }}
            className="svc-detail-grid">
            {/* Image */}
            <div className="svc-detail-img" style={{ borderRadius: 20, overflow: 'hidden', border: `1px solid ${T.border}`, boxShadow: '8px 8px 40px rgba(0,0,0,.3)', aspectRatio: '1 / 1', height: 'auto' }}>
              <LazyImg src={svc.img} alt={svc.title} style={{ width: '100%', height: '100%', objectFit: 'cover', aspectRatio: '1 / 1' }}
                placeholder={<div style={{ aspectRatio: '1 / 1', background: 'linear-gradient(135deg,#0a1a0e,#060e09)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon size={48} style={{ color: 'rgba(136,202,83,.3)' }} /></div>} />
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

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.2rem', borderRadius: 12, background: T.light ? 'rgba(95,145,55,.05)' : 'rgba(136,202,83,.06)', border: `1px solid ${T.border}`, marginBottom: '1.5rem' }}>
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
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} style={{ textAlign: 'left', marginBottom: '3.5rem' }}>
          <h2 className="section-title-big" style={{ position: 'relative', fontSize: 'clamp(2.8rem,5.5vw,4.4rem)', fontWeight: 900, fontStyle: 'italic', fontFamily: "'Barlow Condensed',sans-serif", color: T.textMain, letterSpacing: '-.04em', lineHeight: 1.08 }}>
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
      <ConversionMarquee />
      <TechSection />
      <PageCTA message="Prêt à lancer votre projet ? Obtenez un devis gratuit en 24h." cta="Obtenir mon devis" />
    </div>
  )
}