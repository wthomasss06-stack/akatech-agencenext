'use client'
import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Check, Zap, Timer, AlertTriangle, MessageCircle, HelpCircle, ChevronDown, ChevronUp, Star } from 'lucide-react'
import { useTheme } from '@/lib/theme'
import { SectionEye, SectionCTA, LaserBeam } from '@/components/ui/index'
import { PRICING, TESTIMONIALS } from '@/lib/data'

const FAQ_ITEMS = [
  { q: "Puis-je payer en Mobile Money ?", a: "Oui ! Nous acceptons MTN Mobile Money, Orange Money et Wave. Le paiement se fait en 2 fois : 50% à la commande, 50% à la livraison." },
  { q: "Combien de temps prend la livraison ?", a: "Un site vitrine est livré en 5-7 jours. Un e-commerce en 10-14 jours. Une application SaaS en 3 à 6 semaines selon la complexité." },
  { q: "Y a-t-il des frais d'hébergement supplémentaires ?", a: "Non ! Pour les offres PRO et ELITE, l'hébergement est offert pendant 1 an. Après, c'est environ 15 000 FCFA/an selon la solution." },
  { q: "Et si je ne suis pas satisfait ?", a: "On s'engage à ne pas clôturer le projet tant que vous n'êtes pas 100% satisfait. On fait les retouches nécessaires sans supplément dans la limite du cahier des charges." },
  { q: "Puis-je modifier le site moi-même après livraison ?", a: "Oui ! La formation incluse dans toutes les offres vous permet de modifier vos textes, images et prix facilement sans toucher au code." },
  { q: "Travaillez-vous avec des clients hors Côte d'Ivoire ?", a: "Absolument. Nos clients sont basés en Côte d'Ivoire, mais aussi au Sénégal, au Cameroun et en France. On travaille à distance via WhatsApp et Zoom." },
]

/* ── HERO ── */
function HeroPricing() {
  const T = useTheme()
  return (
    <section style={{ padding: '9rem 5% 5rem', background: T.bg, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 700, height: 700, borderRadius: '50%', background: 'radial-gradient(circle,rgba(34,200,100,.05),transparent 65%)', pointerEvents: 'none' }} />
      <div className="grid-bg" style={{ position: 'absolute', inset: 0, opacity: .25 }} />
      <LaserBeam position="right" intensity="medium" />
      <LaserBeam position="left"  intensity="medium" style={{ animationDelay: '1.1s' }} />
      <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .6 }}>
          <SectionEye label="// Tarifs" center />
          <h1 style={{ fontSize: 'clamp(2.4rem,5vw,3.8rem)', fontWeight: 800, fontFamily: "'Syne',sans-serif", color: T.textMain, letterSpacing: '-.04em', lineHeight: 1.1, marginBottom: '1rem' }}>
            Des offres claires,<br />
            <span className="text-gradient">pour chaque étape.</span>
          </h1>
          <p style={{ fontSize: '1rem', color: T.textSub, lineHeight: 1.75, maxWidth: 540, margin: '0 auto 1.5rem' }}>
            Pas de frais cachés. Pas de jargon. Des prix honnêtes adaptés au marché africain, avec devis gratuit et sans engagement.
          </p>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '.6rem', padding: '.5rem 1.2rem', borderRadius: 100, background: 'rgba(34,200,100,.08)', border: '1px solid rgba(34,200,100,.2)' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c864', animation: 'dot-blink 1.4s ease-in-out infinite' }} />
            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.68rem', color: T.green, letterSpacing: '.06em' }}>
              Paiement Mobile Money accepté
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

/* ── GLASSMORPHISM PRICING TABS ── */
function PricingTabs() {
  const T = useTheme()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const [tab, setTab] = useState('vitrine')
  const [yearly, setYearly] = useState(false)
  const d = PRICING[tab]

  return (
    <section ref={ref} style={{ padding: '2rem 5% 7rem', background: T.bg, position: 'relative', overflow: 'hidden' }}>
      {/* Giant background text */}
      <div aria-hidden style={{
        position: 'absolute', top: '0', left: '50%', transform: 'translateX(-50%)',
        fontFamily: "'Syne',sans-serif", fontWeight: 900,
        fontSize: 'clamp(80px,15vw,180px)',
        color: 'transparent',
        WebkitTextStroke: T.light ? '1px rgba(0,0,0,.06)' : '1px rgba(255,255,255,.04)',
        letterSpacing: '-0.05em', lineHeight: 1,
        pointerEvents: 'none', userSelect: 'none', whiteSpace: 'nowrap',
        zIndex: 0,
      }}>
        Pricing
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* Tabs */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          style={{ display: 'flex', justifyContent: 'center', gap: '.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          {Object.entries(PRICING).map(([k, v]) => (
            <button key={k} onClick={() => setTab(k)} style={{
              padding: '.55rem 1.4rem', borderRadius: 100, border: '1px solid',
              borderColor: tab === k ? T.green : T.border,
              background: tab === k ? 'linear-gradient(145deg,#27d570,#1aa355)' : 'transparent',
              color: tab === k ? '#fff' : T.textSub,
              fontFamily: "'Syne',sans-serif", fontSize: '.82rem', fontWeight: 700,
              cursor: 'pointer', transition: 'all .22s',
            }}>
              {v.label}
            </button>
          ))}
        </motion.div>

        {/* Yearly toggle */}
        <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '.8rem', marginBottom: '3rem' }}>
          <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.7rem', color: yearly ? T.textMuted : T.green, letterSpacing: '.06em' }}>Mensuel</span>
          <div onClick={() => setYearly(y => !y)} style={{
            width: 44, height: 24, borderRadius: 12, cursor: 'pointer', position: 'relative',
            background: yearly ? '#22c864' : 'rgba(255,255,255,.1)',
            border: '1px solid rgba(34,200,100,.3)', transition: 'background .3s',
          }}>
            <div style={{
              position: 'absolute', top: 3, left: yearly ? 23 : 3,
              width: 16, height: 16, borderRadius: '50%', background: '#fff',
              transition: 'left .3s', boxShadow: '0 1px 4px rgba(0,0,0,.3)',
            }} />
          </div>
          <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.7rem', color: yearly ? T.green : T.textMuted, letterSpacing: '.06em' }}>
            Annuel <span style={{ color: '#22c864', background: 'rgba(34,200,100,.12)', padding: '1px 7px', borderRadius: 99, marginLeft: 4 }}>-20%</span>
          </span>
        </motion.div>

        {/* Glass Cards */}
        <AnimatePresence mode="wait">
          <motion.div key={tab}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: .3 }}
            className="pricing-grid">
            {d.plans.map((plan, i) => {
              const wa = encodeURIComponent(`Bonjour AKATech, je suis intéressé par l'offre ${plan.badge} à ${plan.price}`)
              return (
                <motion.div key={plan.badge}
                  initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * .1 }}
                  whileHover={{ y: -8, transition: { duration: .25 } }}
                  style={{
                    position: 'relative', borderRadius: 20, overflow: 'hidden',
                    background: plan.popular
                      ? 'linear-gradient(145deg,rgba(34,200,100,.18),rgba(34,200,100,.06))'
                      : T.light ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,.04)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: plan.popular ? '1px solid rgba(34,200,100,.5)' : `1px solid ${T.light ? 'rgba(0,0,0,.1)' : 'rgba(255,255,255,.1)'}`,
                    boxShadow: plan.popular
                      ? '0 8px 40px rgba(34,200,100,.2), inset 0 1px 0 rgba(255,255,255,.15)'
                      : T.light ? '0 4px 24px rgba(0,0,0,.08)' : '0 8px 32px rgba(0,0,0,.4), inset 0 1px 0 rgba(255,255,255,.06)',
                    padding: plan.popular ? '0 0 2rem' : '2rem',
                  }}>

                  {/* Popular badge */}
                  {plan.popular && (
                    <div style={{
                      padding: '.5rem', background: 'linear-gradient(90deg,#17a354,#22c864)',
                      textAlign: 'center', fontFamily: "'JetBrains Mono',monospace",
                      fontSize: '.6rem', fontWeight: 700, color: '#fff', letterSpacing: '.1em',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '.4rem',
                      borderRadius: '19px 19px 0 0',
                    }}>
                      <Zap size={10} />LE PLUS POPULAIRE
                    </div>
                  )}

                  <div style={{ padding: plan.popular ? '1.8rem 2rem 0' : 0 }}>
                    {/* Glass shine */}
                    <div style={{
                      position: 'absolute', top: 0, left: 0, right: 0, height: '50%',
                      background: 'linear-gradient(180deg, rgba(255,255,255,.07) 0%, transparent 100%)',
                      borderRadius: '20px 20px 0 0', pointerEvents: 'none',
                    }} />

                    <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.6rem', letterSpacing: '.14em', color: plan.popular ? '#22c864' : T.textMuted, textTransform: 'uppercase', marginBottom: '.6rem' }}>{plan.badge}</div>
                    <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 'clamp(1.4rem,2.5vw,1.7rem)', fontWeight: 900, color: T.textMain, marginBottom: '.2rem', letterSpacing: '-0.02em', lineHeight: 1.1 }}>{plan.price}</div>
                    <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.62rem', color: T.textMuted, marginBottom: '1.6rem', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Timer size={11} style={{ color: T.green }} />{plan.del}
                    </div>

                    {/* Divider */}
                    <div style={{ height: 1, background: plan.popular ? 'rgba(34,200,100,.25)' : 'rgba(255,255,255,.08)', marginBottom: '1.4rem' }} />

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '.65rem', marginBottom: '1.8rem' }}>
                      {plan.features.map(f => (
                        <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '.6rem', fontSize: '.83rem', color: T.textSub, lineHeight: 1.5 }}>
                          <div style={{
                            width: 18, height: 18, borderRadius: '50%', flexShrink: 0, marginTop: 1,
                            background: plan.popular ? 'rgba(34,200,100,.2)' : 'rgba(255,255,255,.06)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}>
                            <Check size={11} style={{ color: '#22c864' }} />
                          </div>
                          {f}
                        </div>
                      ))}
                    </div>

                    {plan.popular
                      ? <a href={`https://wa.me/2250142507750?text=${wa}`} target="_blank" rel="noreferrer" className="btn-raised" style={{ width: '100%', justifyContent: 'center', display: 'flex' }}>Commander →</a>
                      : <a href={`https://wa.me/2250142507750?text=${wa}`} target="_blank" rel="noreferrer" className="btn-ghost" style={{ width: '100%', justifyContent: 'center', display: 'flex' }}>Commander →</a>
                    }
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </AnimatePresence>

        {/* Urgency bar */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: .5 }}
          style={{ marginTop: '2.5rem', padding: '1rem 1.6rem', borderRadius: 14, background: 'rgba(34,200,100,.04)', border: '1px solid rgba(34,200,100,.15)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#22c864', boxShadow: '0 0 8px rgba(34,200,100,.8)', animation: 'dot-blink 1.4s ease-in-out infinite', flexShrink: 0 }} />
            <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.72rem', color: T.textSub, letterSpacing: '.04em', margin: 0 }}>
              <span style={{ color: '#66ffaa', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '.3rem' }}>
                <AlertTriangle size={12} /> 2 créneaux disponibles
              </span>
              {' '}ce mois-ci — les projets sont traités dans l'ordre d'arrivée.
            </p>
          </div>
          <a href="https://wa.me/2250142507750?text=Bonjour+AKATech,+je+veux+réserver+mon+projet+!" target="_blank" rel="noreferrer"
            className="btn-raised" style={{ padding: '.55rem 1.2rem', fontSize: '.78rem', flexShrink: 0, whiteSpace: 'nowrap' }}>
            Réserver ma place →
          </a>
        </motion.div>
      </div>
    </section>
  )
}

/* ── ILS NOUS FONT CONFIANCE ── */
function TrustedBy() {
  const T = useTheme()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  return (
    <section ref={ref} style={{ padding: '7rem 5%', background: T.bgAlt, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 600, height: 400, borderRadius: '50%', background: 'radial-gradient(circle,rgba(34,200,100,.05),transparent 65%)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <SectionEye label="// Ils nous font confiance" center />
          <h2 style={{ fontSize: 'clamp(1.8rem,3vw,2.5rem)', fontWeight: 800, fontFamily: "'Syne',sans-serif", color: T.textMain, letterSpacing: '-.03em' }}>
            Ce qu'ils disent de <span className="text-gradient">l'investissement</span>
          </h2>
          <p style={{ fontSize: '.9rem', color: T.textSub, maxWidth: 480, margin: '.8rem auto 0', lineHeight: 1.7 }}>
            Des entrepreneurs ivoiriens qui ont transformé leur présence digitale avec AKATech.
          </p>
        </motion.div>

        <div className="trusted-grid">
          {TESTIMONIALS.map((t, i) => (
            <motion.div key={t.name}
              initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: i * .12 }}
              whileHover={{ y: -6 }}
              style={{
                borderRadius: 20, overflow: 'hidden',
                background: T.light ? 'rgba(255,255,255,.8)' : 'rgba(255,255,255,.04)',
                backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
                border: `1px solid ${T.light ? 'rgba(0,0,0,.08)' : 'rgba(255,255,255,.08)'}`,
                boxShadow: T.light ? '0 4px 24px rgba(0,0,0,.07)' : '0 8px 32px rgba(0,0,0,.4), inset 0 1px 0 rgba(255,255,255,.06)',
                padding: '1.8rem',
                position: 'relative',
              }}>
              {/* Glass shine */}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg,transparent,rgba(255,255,255,.2),transparent)', pointerEvents: 'none' }} />

              {/* Stars */}
              <div style={{ display: 'flex', gap: 3, marginBottom: '1rem' }}>
                {[1,2,3,4,5].map(s => <Star key={s} size={14} fill="#22c864" style={{ color: '#22c864' }} />)}
              </div>

              {/* Quote */}
              <p style={{ fontSize: '.85rem', color: T.textSub, lineHeight: 1.75, fontStyle: 'italic', marginBottom: '1.5rem' }}>
                "{t.text}"
              </p>

              {/* Result badge */}
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '.4rem', padding: '.28rem .85rem', borderRadius: 99, background: 'rgba(34,200,100,.1)', border: '1px solid rgba(34,200,100,.25)', marginBottom: '1.4rem' }}>
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.62rem', color: '#22c864', fontWeight: 700 }}>{t.result}</span>
              </div>

              {/* Author */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '.85rem' }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', overflow: 'hidden', border: '2px solid rgba(34,200,100,.3)', flexShrink: 0, position: 'relative' }}>
                  <img
                    src={t.img}
                    alt={t.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={e => {
                      e.target.style.display = 'none'
                      e.target.parentNode.style.background = 'linear-gradient(135deg,rgba(34,200,100,.2),rgba(34,200,100,.05))'
                      e.target.parentNode.style.display = 'flex'
                      e.target.parentNode.style.alignItems = 'center'
                      e.target.parentNode.style.justifyContent = 'center'
                    }}
                  />
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: T.textMain, fontFamily: "'Syne',sans-serif", fontSize: '.9rem' }}>{t.name}</div>
                  <div style={{ fontSize: '.7rem', color: T.textMuted, fontFamily: "'JetBrains Mono',monospace", marginTop: '.1rem' }}>{t.role}</div>
                </div>
                <div style={{ marginLeft: 'auto', padding: '.28rem .7rem', borderRadius: 8, background: T.light ? 'rgba(0,0,0,.05)' : 'rgba(255,255,255,.05)', border: `1px solid ${T.border}` }}>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.6rem', color: T.textMuted }}>{t.project}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── FAQ ── */
function FAQSection() {
  const T = useTheme()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const [open, setOpen] = useState(null)

  return (
    <section ref={ref} style={{ padding: '7rem 5%', background: T.bg }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <SectionEye label="// FAQ" center />
          <h2 style={{ fontSize: 'clamp(1.9rem,3.5vw,2.6rem)', fontWeight: 800, fontFamily: "'Syne',sans-serif", color: T.textMain, letterSpacing: '-.03em' }}>
            Questions <span className="text-gradient">fréquentes</span>
          </h2>
        </motion.div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '.75rem' }}>
          {FAQ_ITEMS.map(({ q, a }, i) => (
            <motion.div key={q} className="sku-card"
              initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: i * .07 }}
              style={{ overflow: 'hidden' }}>
              <button onClick={() => setOpen(open === i ? null : i)}
                style={{ width: '100%', padding: '1.2rem 1.5rem', background: 'none', border: 'none', color: T.textMain, fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: '.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', textAlign: 'left' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '.6rem' }}>
                  <HelpCircle size={14} style={{ color: T.green, flexShrink: 0 }} />{q}
                </span>
                {open === i ? <ChevronUp size={16} style={{ color: T.green, flexShrink: 0 }} /> : <ChevronDown size={16} style={{ color: T.textMuted, flexShrink: 0 }} />}
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
      <TrustedBy />
      <FAQSection />
      <SectionCTA variant="strong" message="Vous avez encore des questions ? On répond en moins de 2h sur WhatsApp." cta="Nous contacter →" />
    </div>
  )
}
