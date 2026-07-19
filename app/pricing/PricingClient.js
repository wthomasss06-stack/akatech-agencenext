'use client'
import { useRef, useState, useEffect } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Check, Zap, Timer, AlertTriangle, MessageCircle, HelpCircle, ChevronDown, Star, FileText, Lock, Clock, GraduationCap, Wrench, Globe } from 'lucide-react'
import { useTheme } from '@/lib/theme'
import { GhostTitle, GreenUnderline, PageCTA } from '@/components/ui/index'
import AuroraHero from '@/components/ui/AuroraHero'
import { TESTIMONIALS, FAQ_ITEMS, PRICING } from '@/lib/data'

/* ─── BlurReveal ─────────────────────────────────────────── */
function BlurReveal({ children, delay = 0, direction = 'up', style = {}, once = true }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once, margin: '-60px' })
  const dirMap = { up: { y: 40, x: 0 }, right: { y: 0, x: 40 }, down: { y: -40, x: 0 }, left: { y: 0, x: -40 } }
  const off = dirMap[direction] || { y: 40, x: 0 }
  return (
    <motion.div ref={ref} style={style}
      initial={{ opacity: 0, filter: 'blur(12px)', ...off }}
      animate={inView ? { opacity: 1, filter: 'blur(0px)', x: 0, y: 0 } : {}}
      transition={{ duration: 0.85, ease: [0.2, 0.8, 0.2, 1], delay }}>
      {children}
    </motion.div>
  )
}


/* ─────────────────────────────────────────────────────────
   PRICING — synchronisé depuis PRICING_TABS dans App.jsx
   Champs : badge, price, del (livraison), features, popular
───────────────────────────────────────────────────────── */
/* PRICING importé depuis @/lib/data (source unique, partagée avec la home) */


/* ────────────────────────────────────────────────
   HERO
──────────────────────────────────────────────── */
function HeroPricing() {
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
          <GhostTitle text="TARIF" />
          TARIF
          
        </motion.h1>

        <div className="hr-side">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .6, delay: .2 }}>
            <p className="hr-kicker">Pas de frais cachés. Pas de jargon.</p>
            <p className="hr-desc"> Des prix honnêtes adaptés au marché africain, avec devis gratuit et sans engagement.</p>
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


/* ── GLASSMORPHISM PRICING TABS ── */
function PricingTabs() {
  const T = useTheme()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const [tab, setTab] = useState('vitrine')
  const d = PRICING[tab]

  return (
    <section ref={ref} style={{ padding: '2rem 5% 7rem', background: T.bg, position: 'relative', overflow: 'hidden' }}>
      <div aria-hidden style={{ position: 'absolute', top: '0', left: '50%', transform: 'translateX(-50%)', fontFamily: "'JetBrains Mono',monospace", fontWeight: 900, fontSize: 'clamp(80px,15vw,180px)', color: 'transparent', WebkitTextStroke: T.light ? '1px rgba(0,0,0,.06)' : '1px rgba(255,255,255,.04)', letterSpacing: '-0.05em', lineHeight: 1, pointerEvents: 'none', userSelect: 'none', whiteSpace: 'nowrap', zIndex: 0 }}>
        Pricing
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* Section Header */}
        <div style={{ textAlign: 'left', marginBottom: '1.5rem' }}>
          <BlurReveal delay={0.1}>
            <h2 className="section-title-big" style={{ position: 'relative', fontSize: 'clamp(2.8rem,5.5vw,4.4rem)', fontWeight: 900, fontStyle: 'italic', fontFamily: "'Barlow Condensed',sans-serif", color: T.textMain, letterSpacing: '-.03em', marginBottom: '0.5rem' }}>
              <GhostTitle text="CHOISISSEZ VOTRE FORMULE IDÉALE" />
              Choisissez votre{' '}
              <GreenUnderline><span className="text-gradient">formule idéale</span></GreenUnderline>
            </h2>
          </BlurReveal>
        </div>

        {/* Tabs */}
        <BlurReveal delay={0.15} style={{ display: 'flex', justifyContent: 'center', gap: '.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          {Object.entries(PRICING).map(([k, v]) => (
            <motion.button key={k} onClick={() => setTab(k)}
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              style={{ padding: '.55rem 1.4rem', borderRadius: 100, border: '1px solid', borderColor: tab === k ? T.green : T.border, background: tab === k ? 'linear-gradient(145deg,#8dd456,#5f9137)' : 'transparent', color: tab === k ? '#fff' : T.textSub, fontFamily: "'JetBrains Mono',monospace", fontSize: '.82rem', fontWeight: 700, cursor: 'pointer', transition: 'all .22s' }}>
              {v.label}
            </motion.button>
          ))}
        </BlurReveal>

        {/* Glass Cards */}
        <AnimatePresence mode="wait">
          <motion.div key={tab}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: .3 }}
            className="pricing-grid">
            {d.plans.map((plan, i) => {
              const wa = encodeURIComponent(`Bonjour AKATech, je suis intéressé par l'offre ${plan.badge} à ${plan.price}`)
              return (
                <BlurReveal key={plan.badge} delay={i * 0.1} direction={['left', 'up', 'right'][i] || 'up'}>
                  <motion.div
                    whileHover={{ y: -8, transition: { duration: .25 } }}
                    style={{ position: 'relative', borderRadius: 20, overflow: 'hidden', background: plan.popular ? 'linear-gradient(145deg,rgba(136,202,83,.18),rgba(136,202,83,.06))' : T.light ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,.04)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: plan.popular ? '1px solid rgba(136,202,83,.5)' : `1px solid ${T.light ? 'rgba(0,0,0,.1)' : 'rgba(255,255,255,.1)'}`, boxShadow: plan.popular ? '0 8px 40px rgba(136,202,83,.2),inset 0 1px 0 rgba(255,255,255,.15)' : T.light ? '0 4px 24px rgba(0,0,0,.08)' : '0 8px 32px rgba(0,0,0,.4),inset 0 1px 0 rgba(255,255,255,.06)', padding: plan.popular ? '0 0 2rem' : '2rem', height: '100%', display: 'flex', flexDirection: 'column' }}>
                    {plan.popular && (
                      <div style={{ padding: '.5rem', background: 'linear-gradient(90deg,#5f9137,#88ca53)', textAlign: 'center', fontFamily: "'JetBrains Mono',monospace", fontSize: '.6rem', fontWeight: 700, color: '#fff', letterSpacing: '.1em', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '.4rem', borderRadius: '19px 19px 0 0' }}>
                        <Zap size={10} />LE PLUS POPULAIRE
                      </div>
                    )}
                    <div style={{ padding: plan.popular ? '1.8rem 2rem 0' : 0, display: 'flex', flexDirection: 'column', flex: 1 }}>
                      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '50%', background: 'linear-gradient(180deg,rgba(255,255,255,.07) 0%,transparent 100%)', borderRadius: '20px 20px 0 0', pointerEvents: 'none' }} />
                      <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.65rem', fontWeight: 600, color: plan.popular ? '#88ca53' : T.textMuted, textTransform: 'uppercase', marginBottom: '.6rem' }}>{plan.badge}</div>
                      <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 'clamp(1.4rem,2.5vw,1.7rem)', fontWeight: 900, color: T.textMain, marginBottom: '.2rem', letterSpacing: '-0.02em', lineHeight: 1.1 }}>{plan.price}</div>
                      <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.62rem', color: T.textMuted, marginBottom: '1.6rem', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Timer size={11} style={{ color: T.green }} />{plan.del}
                      </div>
                      <div style={{ height: 1, background: plan.popular ? 'rgba(136,202,83,.25)' : 'rgba(255,255,255,.08)', marginBottom: '1.4rem' }} />
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '.65rem', marginBottom: '1.8rem', flex: 1 }}>
                        {plan.features.map(f => (
                          <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '.6rem', fontSize: '.83rem', color: T.textSub, lineHeight: 1.5 }}>
                            <div style={{ width: 18, height: 18, borderRadius: '50%', flexShrink: 0, marginTop: 1, background: plan.popular ? 'rgba(136,202,83,.2)' : 'rgba(255,255,255,.06)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <Check size={11} style={{ color: '#88ca53' }} />
                            </div>
                            {f}
                          </div>
                        ))}
                      </div>
                      {plan.popular
                        ? <a href={`https://wa.me/2250142507750?text=${wa}`} target="_blank" rel="noreferrer" className="btn-raised" style={{ width: '100%', justifyContent: 'center', display: 'flex', marginTop: 'auto' }}>Commander →</a>
                        : <a href={`https://wa.me/2250142507750?text=${wa}`} target="_blank" rel="noreferrer" className="btn-ghost" style={{ width: '100%', justifyContent: 'center', display: 'flex', marginTop: 'auto' }}>Commander →</a>
                      }
                    </div>
                  </motion.div>
                </BlurReveal>
              )
            })}
          </motion.div>
        </AnimatePresence>

        {/* Urgency bar */}
        <BlurReveal delay={0.5}>
          <div style={{ marginTop: '2.5rem', padding: '1rem 1.6rem', borderRadius: 14, background: 'rgba(136,202,83,.04)', border: '1px solid rgba(136,202,83,.15)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#88ca53', boxShadow: '0 0 8px rgba(136,202,83,.8)', animation: 'dot-blink 1.4s ease-in-out infinite', flexShrink: 0 }} />
              <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.72rem', color: T.textSub, letterSpacing: '.04em', margin: 0 }}>
                <span style={{ color: '#b3ee85', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '.3rem' }}>
                  <AlertTriangle size={12} /> 2 créneaux disponibles
                </span>
                {' '}ce mois-ci — les projets sont traités dans l'ordre d'arrivée.
              </p>
            </div>
            <a href="https://wa.me/2250142507750?text=Bonjour+AKATech,+je+veux+réserver+mon+projet+!" target="_blank" rel="noreferrer"
              className="btn-raised" style={{ padding: '.55rem 1.2rem', fontSize: '.78rem', flexShrink: 0, whiteSpace: 'nowrap' }}>
              Réserver ma place →
            </a>
          </div>
        </BlurReveal>
      </div>
    </section>
  )
}

/* ── ILS NOUS FONT CONFIANCE — carrousel infini ── */
// ═══════════════════════════════════════════════════════════════
// ── GARANTIES INCLUSES — strip de réassurance ────────────────
// ═══════════════════════════════════════════════════════════════
const GARANTIES = [
  { icon: FileText,      title: 'Devis 100% gratuit',      desc: 'Sans engagement, sous 24h'            },
  { icon: Lock,          title: 'Paiement sécurisé',        desc: 'MTN, Orange Money, Wave, virement'    },
  { icon: Zap,           title: 'Délais respectés',          desc: 'Date convenue, ou remboursement'      },
  { icon: GraduationCap, title: 'Formation incluse',         desc: 'Vous restez autonome après livraison' },
  { icon: Wrench,        title: 'Support 48h',               desc: 'Corrections & évolutions post-livraison' },
  { icon: Globe,         title: 'Adapté marché africain',    desc: 'Mobile Money, faible débit, FCFA'     },
]

function GuaranteeStrip() {
  const T = useTheme()
  return (
    <section style={{ padding: '5rem 5%', background: T.bgAlt, position: 'relative', overflow: 'hidden' }}>
      <style>{`@media(max-width:768px){.guarantee-grid{grid-template-columns:1fr !important}}`}</style>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'left', marginBottom: '3rem' }}>
          <BlurReveal delay={0.1}>
            <h2 className="section-title-big" style={{ position: 'relative', fontSize: 'clamp(2.8rem,5.5vw,4.4rem)', fontWeight: 900, fontStyle: 'italic', fontFamily: "'Barlow Condensed',sans-serif", color: T.textMain, letterSpacing: '-.03em' }}>
              <GhostTitle text="ZÉRO SURPRISE, ZÉRO JARGON." />
              Zéro surprise, <GreenUnderline><span className="text-gradient">zéro jargon.</span></GreenUnderline>
            </h2>
          </BlurReveal>
        </div>

        <div className="guarantee-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem' }}>
          {GARANTIES.map(({ icon: Icon, title, desc }, i) => (
            <BlurReveal key={title} delay={i * .07}>
              <motion.div
                whileHover={{ y: -5, borderColor: 'rgba(136,202,83,.35)' }}
                style={{ padding: '1.5rem', borderRadius: 16, background: T.light ? 'rgba(255,255,255,.8)' : 'rgba(255,255,255,.03)', border: `1px solid ${T.border}`, display: 'flex', alignItems: 'flex-start', gap: '1rem', transition: 'border-color .2s' }}
              >
                <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(136,202,83,.1)', border: '1px solid rgba(136,202,83,.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={20} style={{ color: '#88ca53' }} />
                </div>
                <div>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, fontSize: '.88rem', color: T.textMain, marginBottom: '.25rem' }}>{title}</div>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.72rem', color: T.textMuted, lineHeight: 1.5 }}>{desc}</div>
                </div>
              </motion.div>
            </BlurReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function TrustedBy() {
  const T = useTheme()
  const items = [...TESTIMONIALS, ...TESTIMONIALS]

  // Scroll-reveal mot par mot + tilt
  const sectionRef  = useRef(null)
  const trustTextRef  = useRef(null)
  const trustWordsRef = useRef([])
  const TRUST_TEXT  = "Des entrepreneurs ivoiriens qui ont transformé leur présence digitale avec AKATech."
  const TRUST_GREEN = new Set(['ivoiriens', 'transformé', 'présence', 'digitale', 'AKATech.'])

  useEffect(() => {
    const container = sectionRef.current
    const textEl    = trustTextRef.current
    if (!container || !textEl) return
    const onScroll = () => {
      const rect     = container.getBoundingClientRect()
      const winH     = window.innerHeight
      const total    = winH + container.offsetHeight
      const traveled = winH - rect.top
      const progress = Math.max(0, Math.min(1, traveled / total))
      // tilt
      textEl.style.transform = `rotate(${3 * (1 - Math.min(progress / 0.20, 1))}deg)`
      textEl.style.opacity   = String(Math.min(1, 0.4 + progress * 1.2))
      // mots
      const words = trustWordsRef.current
      if (!words.length) return
      const wProg = Math.max(0, Math.min(1, progress / 0.40))
      words.forEach((span, i) => {
        if (!span) return
        const local = Math.max(0, Math.min(1, (wProg - (i / (words.length - 1)) * 0.75) / 0.28))
        span.style.opacity = String(0.08 + local * 0.92)
        span.style.filter  = `blur(${((1 - local) * 9).toFixed(1)}px)`
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section ref={sectionRef} style={{ padding: '7rem 0', background: T.bgAlt, position: 'relative', overflow: 'hidden' }}>
      <style>{`
        @keyframes scroll-left {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .carousel-track {
          display: flex;
          gap: 1.2rem;
          width: max-content;
          animation: scroll-left 32s linear infinite;
        }
        .carousel-track:hover { animation-play-state: paused; }
        .carousel-wrap {
          overflow: hidden;
          -webkit-mask: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
          mask: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
        }
        .tcard {
          flex-shrink: 0;
          width: 320px;
          border-radius: 20px;
          overflow: hidden;
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          padding: 1.8rem;
          position: relative;
        }
      `}</style>

      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 600, height: 400, borderRadius: '50%', background: 'radial-gradient(circle,rgba(136,202,83,.05),transparent 65%)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: 1200, margin: '0 auto', paddingBottom: '3.5rem', paddingLeft: '5%', paddingRight: '5%' }}>
        <div style={{ textAlign: 'left', marginBottom: '3.5rem' }}>
          <BlurReveal delay={0.1}>
            <h2 className="section-title-big" style={{ position: 'relative', fontSize: 'clamp(2.8rem,5.5vw,4.4rem)', fontWeight: 900, fontStyle: 'italic', fontFamily: "'Barlow Condensed',sans-serif", color: T.textMain, letterSpacing: '-.03em' }}>
              <GhostTitle text="CE QU'ILS DISENT DE L'INVESTISSEMENT" />
              Ce qu'ils disent de{' '}
              <GreenUnderline><span className="text-gradient">l'investissement</span></GreenUnderline>
            </h2>
          </BlurReveal>
          <BlurReveal delay={0.2}>
            <p
              ref={trustTextRef}
              style={{
                fontFamily: "'JetBrains Mono',monospace",
                fontSize: 'clamp(1.6rem,3.2vw,2.6rem)',
                fontWeight: 700,
                color: T.textSub,
                lineHeight: 1.32,
                marginTop: '.8rem',
                paddingLeft: 'var(--body-indent)',
                paddingRight: 'var(--body-indent)',
                transformOrigin: '0% 50%',
                transition: 'transform .05s linear',
              }}
            >
              {TRUST_TEXT.split(' ').map((word, i) => (
                <span
                  key={i}
                  ref={el => { trustWordsRef.current[i] = el }}
                  style={{
                    display: 'inline-block',
                    marginRight: '0.28em',
                    opacity: 0.08,
                    filter: 'blur(9px)',
                    willChange: 'opacity, filter',
                    color: TRUST_GREEN.has(word) ? '#88ca53' : 'inherit',
                  }}
                >
                  {word}
                </span>
              ))}
            </p>
          </BlurReveal>
        </div>
      </div>

      {/* Carrousel */}
      <div className="carousel-wrap">
        <div className="carousel-track">
          {items.map((t, i) => (
            <div key={i} className="tcard"
              style={{
                background: T.light ? 'rgba(255,255,255,.8)' : 'rgba(255,255,255,.04)',
                border: `1px solid ${T.light ? 'rgba(0,0,0,.08)' : 'rgba(255,255,255,.08)'}`,
                boxShadow: T.light ? '0 4px 24px rgba(0,0,0,.07)' : '0 8px 32px rgba(0,0,0,.4), inset 0 1px 0 rgba(255,255,255,.06)',
              }}>
              {/* Glass shine */}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg,transparent,rgba(255,255,255,.2),transparent)', pointerEvents: 'none' }} />

              {/* Stars */}
              <div style={{ display: 'flex', gap: 3, marginBottom: '1rem' }}>
                {[1,2,3,4,5].map(s => <Star key={s} size={14} fill="#88ca53" style={{ color: '#88ca53' }} />)}
              </div>

              {/* Quote */}
              <p style={{ fontSize: '.85rem', color: T.textSub, lineHeight: 1.75, fontStyle: 'italic', marginBottom: '1.5rem' }}>
                "{t.text}"
              </p>

              {/* Result badge */}
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '.4rem', padding: '.28rem .85rem', borderRadius: 99, background: 'rgba(136,202,83,.1)', border: '1px solid rgba(136,202,83,.25)', marginBottom: '1.4rem' }}>
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.65rem', fontWeight: 600, color: '#88ca53', fontWeight: 700 }}>{t.result}</span>
              </div>

              {/* Author */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '.85rem' }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', overflow: 'hidden', border: '2px solid rgba(136,202,83,.3)', flexShrink: 0, position: 'relative' }}>
                  <img src={t.img} alt={t.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={e => {
                      e.target.style.display = 'none'
                      e.target.parentNode.style.background = 'linear-gradient(135deg,rgba(136,202,83,.2),rgba(136,202,83,.05))'
                    }} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: T.textMain, fontFamily: "'JetBrains Mono',monospace", fontSize: '.9rem' }}>{t.name}</div>
                  <div style={{ fontSize: '.7rem', color: T.textMuted, fontFamily: "'JetBrains Mono',monospace", marginTop: '.1rem' }}>{t.role}</div>
                </div>
                <div style={{ marginLeft: 'auto', padding: '.28rem .7rem', borderRadius: 8, background: T.light ? 'rgba(0,0,0,.05)' : 'rgba(255,255,255,.05)', border: `1px solid ${T.border}` }}>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.6rem', color: T.textMuted }}>{t.project}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── FAQ ── */
function FAQSection() {
  const T = useTheme()
  const [open, setOpen] = useState(null)

  return (
    <section style={{ padding: '7rem 5%', background: T.bg, position: 'relative', overflow: 'hidden' }}>
      <div className="grid-bg" style={{ position: 'absolute', inset: 0, opacity: .15 }} />
      <div style={{ maxWidth: 1200, margin: '0 auto 3.5rem', position: 'relative', zIndex: 1 }}>
        <BlurReveal delay={0.1}>
          <h2 className="section-title-big" style={{ position: 'relative', fontSize: 'clamp(2.8rem,5.5vw,4.4rem)', fontWeight: 900, fontStyle: 'italic', fontFamily: "'Barlow Condensed',sans-serif", color: T.textMain, letterSpacing: '-.03em' }}>
            <GhostTitle text="QUESTIONS FRÉQUENTES" />
            Questions{' '}
            <GreenUnderline><span className="text-gradient">fréquentes</span></GreenUnderline>
          </h2>
        </BlurReveal>
      </div>
      <div style={{ maxWidth: 800, margin: '0 auto', position: 'relative', zIndex: 1 }}>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '.75rem' }}>
          {FAQ_ITEMS.map(({ q, a }, i) => (
            <BlurReveal key={q} delay={i * 0.06} direction={i % 2 === 0 ? 'left' : 'right'}>
              <motion.div className="sku-card"
                whileHover={{ borderColor: 'rgba(136,202,83,.25)' }}
                style={{ overflow: 'hidden' }}>
                <button onClick={() => setOpen(open === i ? null : i)}
                  style={{ width: '100%', padding: '1.2rem 1.5rem', background: 'none', border: 'none', color: T.textMain, fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, fontSize: '.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', textAlign: 'left' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '.6rem' }}>
                    <HelpCircle size={14} style={{ color: T.green, flexShrink: 0 }} />{q}
                  </span>
                  <motion.div animate={{ rotate: open === i ? 180 : 0 }} transition={{ duration: .25 }}>
                    <ChevronDown size={16} style={{ color: open === i ? T.green : T.textMuted, flexShrink: 0 }} />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {open === i && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: .3 }}
                      style={{ overflow: 'hidden' }}>
                      <div style={{ padding: '0 1.5rem 1.2rem', fontSize: '.85rem', color: T.textSub, lineHeight: 1.7, borderTop: `1px solid ${T.border}`, paddingTop: '1rem' }}>
                        {a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </BlurReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function PricingPage() {
  return (
    <div>
      <HeroPricing />
      <PricingTabs />
      <GuaranteeStrip />
      <TrustedBy />
      <FAQSection />

      <PageCTA
        message="Un projet en tête ? Obtenez votre devis gratuit en moins de 24h."
        cta="Discuter sur WhatsApp"
      />
    </div>
  )
}