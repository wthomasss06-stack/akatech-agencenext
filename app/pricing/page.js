'use client'
import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Check, Zap, Timer, AlertTriangle, MessageCircle, ArrowRight, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react'
import { useTheme } from '@/lib/theme'
import { SectionEye, SectionCTA } from '@/components/ui/index'
import { PRICING, TESTIMONIALS } from '@/lib/data'
import { Star } from 'lucide-react'

const FAQ_ITEMS = [
  { q: "Puis-je payer en Mobile Money ?", a: "Oui ! Nous acceptons MTN Mobile Money, Orange Money et Wave. Le paiement se fait en 2 fois : 50% à la commande, 50% à la livraison." },
  { q: "Combien de temps prend la livraison ?", a: "Un site vitrine est livré en 5-7 jours. Un e-commerce en 10-14 jours. Une application SaaS en 3 à 6 semaines selon la complexité." },
  { q: "Y a-t-il des frais d'hébergement supplémentaires ?", a: "Non ! Pour les offres PRO et ELITE, l'hébergement est offert pendant 1 an. Après, c'est environ 15 000 FCFA/an selon la solution." },
  { q: "Et si je ne suis pas satisfait ?", a: "On s'engage à ne pas clôturer le projet tant que vous n'êtes pas 100% satisfait. On fait les retouches nécessaires sans supplément dans la limite du cahier des charges." },
  { q: "Puis-je modifier le site moi-même après livraison ?", a: "Oui ! La formation incluse dans toutes les offres vous permet de modifier vos textes, images et prix facilement sans toucher au code." },
  { q: "Travaillez-vous avec des clients hors Côte d'Ivoire ?", a: "Absolument. Nos clients sont basés en Côte d'Ivoire, mais aussi au Sénégal, au Cameroun et en France. On travaille à distance via WhatsApp et Zoom." },
]

function HeroPricing() {
  const T = useTheme()
  return (
    <section style={{ padding: '9rem 5% 5rem', background: T.bg, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 700, height: 700, borderRadius: '50%', background: 'radial-gradient(circle,rgba(34,200,100,.05),transparent 65%)', pointerEvents: 'none' }} />
      <div className="grid-bg" style={{ position: 'absolute', inset: 0, opacity: .25 }} />
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

function PricingTabs() {
  const T = useTheme()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const [tab, setTab] = useState('vitrine')
  const d = PRICING[tab]

  return (
    <section ref={ref} style={{ padding: '4rem 5% 7rem', background: T.bg }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Tabs */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          style={{ display: 'flex', justifyContent: 'center', gap: '.5rem', marginBottom: '3.5rem', flexWrap: 'wrap' }}>
          {Object.entries(PRICING).map(([k, v]) => (
            <button key={k} onClick={() => setTab(k)}
              style={{ padding: '.6rem 1.6rem', borderRadius: 100, border: '1px solid', borderColor: tab === k ? T.green : T.border, background: tab === k ? 'linear-gradient(145deg,#27d570,#1aa355)' : 'transparent', color: tab === k ? '#fff' : T.textSub, fontFamily: "'Syne',sans-serif", fontSize: '.85rem', fontWeight: 700, cursor: 'pointer', transition: 'all .22s' }}>
              {v.label}
            </button>
          ))}
        </motion.div>

        {/* Plans */}
        <AnimatePresence mode="wait">
          <motion.div key={tab}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: .3 }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '1.5rem' }}>
            {d.plans.map((plan, i) => {
              const wa = encodeURIComponent(`Bonjour AKATech, je suis intéressé par l'offre ${plan.badge} à ${plan.price}`)
              return (
                <motion.div key={plan.badge}
                  initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * .1 }}
                  className="sku-card"
                  style={{ padding: '2rem', position: 'relative', overflow: 'hidden', border: plan.popular ? `1px solid ${T.green}` : `1px solid ${T.border}` }}
                  whileHover={{ y: -6 }}>
                  {plan.popular && (
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '.4rem', background: 'linear-gradient(90deg,#17a354,#22c864)', textAlign: 'center', fontFamily: "'JetBrains Mono',monospace", fontSize: '.6rem', fontWeight: 700, color: '#fff', letterSpacing: '.1em', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '.4rem', borderRadius: '17px 17px 0 0' }}>
                      <Zap size={10} />LE PLUS POPULAIRE
                    </div>
                  )}
                  <div style={{ marginTop: plan.popular ? '1.5rem' : 0 }}>
                    <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.62rem', letterSpacing: '.12em', color: T.greenSub, textTransform: 'uppercase', marginBottom: '.6rem' }}>{plan.badge}</div>
                    <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: '1.4rem', fontWeight: 900, color: T.textMain, marginBottom: '.25rem', lineHeight: 1.1 }}>{plan.price}</div>
                    <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.62rem', color: T.textMuted, marginBottom: '1.6rem', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Timer size={11} style={{ color: T.green }} />{plan.del}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '.6rem', marginBottom: '1.8rem' }}>
                      {plan.features.map(f => (
                        <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '.6rem', fontSize: '.82rem', color: T.textSub, lineHeight: 1.5 }}>
                          <Check size={13} style={{ color: T.green, marginTop: 2, flexShrink: 0 }} />{f}
                        </div>
                      ))}
                    </div>
                    {plan.popular
                      ? <a href={`https://wa.me/2250142507750?text=${wa}`} target="_blank" rel="noreferrer" className="btn-raised" style={{ width: '100%', justifyContent: 'center' }}>Commander →</a>
                      : <a href={`https://wa.me/2250142507750?text=${wa}`} target="_blank" rel="noreferrer" className="btn-ghost" style={{ width: '100%', justifyContent: 'center' }}>Commander →</a>
                    }
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </AnimatePresence>

        {/* Urgency */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: .5 }}
          style={{ marginTop: '2rem', padding: '1rem 1.6rem', borderRadius: 14, background: 'rgba(34,200,100,.04)', border: '1px solid rgba(34,200,100,.15)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#22c864', boxShadow: '0 0 8px rgba(34,200,100,.8)', animation: 'dot-blink 1.4s ease-in-out infinite' }} />
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

function FAQSection() {
  const T = useTheme()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const [open, setOpen] = useState(null)

  return (
    <section ref={ref} style={{ padding: '7rem 5%', background: T.bgAlt }}>
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
                    <div style={{ padding: '0 1.5rem 1.2rem', fontSize: '.85rem', color: T.textSub, lineHeight: 1.7, borderTop: `1px solid ${T.border}`, paddingTop: '1rem', marginTop: 0 }}>
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

function TestimonialsSmall() {
  const T = useTheme()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  return (
    <section ref={ref} style={{ padding: '7rem 5%', background: T.bg }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <SectionEye label="// Ils nous font confiance" center />
          <h2 style={{ fontSize: 'clamp(1.8rem,3vw,2.4rem)', fontWeight: 800, fontFamily: "'Syne',sans-serif", color: T.textMain, letterSpacing: '-.03em' }}>
            Ce qu'ils disent de <span className="text-gradient">l'investissement</span>
          </h2>
        </motion.div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '1.2rem' }}>
          {TESTIMONIALS.map((t, i) => (
            <motion.div key={t.name} className="sku-card"
              initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: i * .1 }}
              style={{ padding: '1.8rem' }}>
              <div style={{ display: 'flex', gap: 2, marginBottom: '1rem' }}>
                {[1,2,3,4,5].map(s => <Star key={s} size={14} fill="#22c864" style={{ color: '#22c864' }} />)}
              </div>
              <p style={{ fontSize: '.84rem', color: T.textSub, lineHeight: 1.7, fontStyle: 'italic', marginBottom: '1.2rem' }}>"{t.text}"</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '.7rem' }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(34,200,100,.15)', border: '2px solid rgba(34,200,100,.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Syne',sans-serif", fontWeight: 700, color: T.green, fontSize: '.85rem', flexShrink: 0 }}>
                  {t.name[0]}
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: T.textMain, fontFamily: "'Syne',sans-serif", fontSize: '.85rem' }}>{t.name}</div>
                  <div style={{ fontSize: '.68rem', color: T.textMuted, fontFamily: "'JetBrains Mono',monospace" }}>{t.role}</div>
                </div>
                <span style={{ marginLeft: 'auto', padding: '.2rem .6rem', borderRadius: 100, background: 'rgba(34,200,100,.12)', border: '1px solid rgba(34,200,100,.25)', color: '#22c864', fontFamily: "'JetBrains Mono',monospace", fontSize: '.58rem' }}>{t.result}</span>
              </div>
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
      <TestimonialsSmall />
      <FAQSection />
      <SectionCTA variant="strong" message="Vous avez encore des questions ? On répond en moins de 2h sur WhatsApp." cta="Nous contacter →" />
    </div>
  )
}
