'use client'
import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import {
  Phone, Mail, MapPin, MessageCircle, Send, Clock,
  CheckCircle, Zap, Globe, Share2, Linkedin,
  ChevronRight, ArrowRight, Shield, Users
} from 'lucide-react'
import { useTheme } from '@/lib/theme'
import { SectionEye, MarqueeStrip, SectionCTA } from '@/components/ui/index'

// ── HERO ──────────────────────────────────────────────────────
function HeroContact() {
  const T = useTheme()
  return (
    <section style={{ padding: '9rem 5% 5rem', background: T.bg, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '-10%', left: '-5%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle,rgba(34,200,100,.07),transparent 65%)', pointerEvents: 'none' }} />
      <div className="grid-bg" style={{ position: 'absolute', inset: 0, opacity: .3 }} />
      <div style={{ maxWidth: 1000, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7, ease: [.22,1,.36,1] }}>
          <SectionEye label="// Contactez-nous" center />
          <h1 style={{ fontSize: 'clamp(2.2rem,5vw,3.8rem)', fontWeight: 800, fontFamily: "'Syne',sans-serif", color: T.textMain, letterSpacing: '-.04em', lineHeight: 1.1, marginBottom: '1.2rem' }}>
            Parlons de votre{' '}
            <span className="text-gradient">projet</span>
          </h1>
          <p style={{ fontSize: '1.05rem', color: T.textSub, lineHeight: 1.75, maxWidth: 560, margin: '0 auto 2.5rem' }}>
            Devis gratuit en moins de 24h. Pas d'engagement, pas de jargon technique — juste une conversation pour comprendre votre besoin.
          </p>
          {/* Response time badges */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            {[
              { icon: Zap, label: 'Réponse en < 2h', color: '#22c864' },
              { icon: Clock, label: 'Devis sous 24h', color: '#22c864' },
              { icon: Shield, label: 'Sans engagement', color: '#22c864' },
            ].map(({ icon: Icon, label, color }, i) => (
              <motion.div key={label} initial={{ opacity: 0, scale: .8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: .3 + i * .1 }}
                style={{ display: 'flex', alignItems: 'center', gap: '.5rem', padding: '.45rem 1rem', borderRadius: 100, background: T.light ? 'rgba(22,163,74,.06)' : 'rgba(34,200,100,.06)', border: `1px solid ${T.border}` }}>
                <Icon size={13} style={{ color }} />
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.68rem', color: T.textSub, letterSpacing: '.06em' }}>{label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// ── CONTACT GRID ─────────────────────────────────────────────
function ContactGrid() {
  const T = useTheme()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const [form, setForm] = useState({ name: '', email: '', phone: '', service: '', budget: '', message: '' })
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)

  const inputStyle = {
    width: '100%', padding: '.85rem 1rem', borderRadius: 10,
    background: T.light ? '#ffffff' : 'rgba(34,200,100,.04)',
    border: `1px solid ${T.light ? 'rgba(0,0,0,.15)' : T.border}`,
    color: T.light ? '#111111' : 'rgba(255,255,255,.85)',
    fontFamily: "'Syne',sans-serif", fontSize: '.88rem',
    outline: 'none', transition: 'border-color .2s, box-shadow .2s',
    boxSizing: 'border-box',
    colorScheme: T.light ? 'light' : 'dark',
  }

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.message) return
    setSending(true)
    await new Promise(r => setTimeout(r, 1400))
    const msg = encodeURIComponent(
      `Bonjour AKATech!\n\nNom: ${form.name}\nEmail: ${form.email}\nTéléphone: ${form.phone}\nService: ${form.service}\nBudget: ${form.budget}\n\nMessage:\n${form.message}`
    )
    window.open(`https://wa.me/2250142507750?text=${msg}`, '_blank')
    setSent(true)
    setSending(false)
  }

  const CHANNELS = [
    { icon: MessageCircle, label: 'WhatsApp', val: '+225 01 42 50 77 50', href: 'https://wa.me/2250142507750', color: '#25d366', desc: 'Réponse en moins de 2h' },
    { icon: Mail, label: 'Email', val: 'wthomasss06@gmail.com', href: 'mailto:wthomasss06@gmail.com', color: '#22c864', desc: 'Réponse sous 24h' },
    { icon: Phone, label: 'Téléphone', val: '+225 01 42 50 77 50', href: 'tel:+2250142507750', color: '#22c864', desc: 'Lun–Ven, 8h–18h' },
    { icon: MapPin, label: 'Localisation', val: 'Abidjan, Côte d\'Ivoire', href: null, color: '#22c864', desc: 'Déplacements possibles' },
  ]

  return (
    <section ref={ref} style={{ padding: '5rem 5%', background: T.bgAlt }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: '3rem', alignItems: 'start' }}>

        {/* LEFT — Channels */}
        <motion.div initial={{ opacity: 0, x: -30 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: .6 }}>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, fontFamily: "'Syne',sans-serif", color: T.textMain, letterSpacing: '-.03em', marginBottom: '.5rem' }}>
            Comment nous contacter
          </h2>
          <p style={{ fontSize: '.88rem', color: T.textSub, lineHeight: 1.7, marginBottom: '2rem' }}>
            Choisissez le canal qui vous convient. WhatsApp est le plus rapide — on répond en moins de 2h.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2.5rem' }}>
            {CHANNELS.map(({ icon: Icon, label, val, href, color, desc }, i) => (
              <motion.div key={label} className="sku-card"
                initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: .1 + i * .08 }}
                style={{ padding: '1.1rem 1.3rem' }}>
                {href ? (
                  <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer"
                    style={{ display: 'flex', alignItems: 'center', gap: '.9rem', textDecoration: 'none' }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: `rgba(34,200,100,.1)`, border: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={18} style={{ color }} />
                    </div>
                    <div>
                      <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.6rem', color: T.greenSub, letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: '.2rem' }}>{label}</div>
                      <div style={{ fontFamily: "'Syne',sans-serif", fontSize: '.84rem', fontWeight: 600, color: T.textMain }}>{val}</div>
                      <div style={{ fontSize: '.72rem', color: T.textMuted }}>{desc}</div>
                    </div>
                    <ChevronRight size={14} style={{ color: T.greenSub, marginLeft: 'auto' }} />
                  </a>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '.9rem' }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(34,200,100,.1)', border: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={18} style={{ color }} />
                    </div>
                    <div>
                      <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.6rem', color: T.greenSub, letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: '.2rem' }}>{label}</div>
                      <div style={{ fontFamily: "'Syne',sans-serif", fontSize: '.84rem', fontWeight: 600, color: T.textMain }}>{val}</div>
                      <div style={{ fontSize: '.72rem', color: T.textMuted }}>{desc}</div>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Social */}
          <div style={{ padding: '1.2rem 1.4rem', borderRadius: 14, background: T.light ? 'rgba(22,163,74,.04)' : 'rgba(34,200,100,.04)', border: `1px solid ${T.border}` }}>
            <div style={{ fontSize: '.68rem', fontWeight: 700, color: T.textSub, textTransform: 'uppercase', letterSpacing: '.12em', marginBottom: '.9rem', fontFamily: "'JetBrains Mono',monospace" }}>Réseaux sociaux</div>
            <div style={{ display: 'flex', gap: '.6rem' }}>
              {[
                { icon: Share2, href: 'https://web.facebook.com/profile.php?id=61577494705852', label: 'Facebook' },
                { icon: MessageCircle, href: 'https://wa.me/2250142507750', label: 'WhatsApp' },
                { icon: Globe, href: 'https://akafolio160502.vercel.app/', label: 'Portfolio' },
              ].map(({ icon: Icon, href, label }) => (
                <a key={label} href={href} target="_blank" rel="noreferrer" title={label}
                  style={{ width: 38, height: 38, borderRadius: 10, background: T.light ? 'rgba(0,0,0,.05)' : 'rgba(34,200,100,.06)', border: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.textSub, transition: 'all .2s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = T.green; e.currentTarget.style.color = '#fff'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = T.light ? 'rgba(0,0,0,.05)' : 'rgba(34,200,100,.06)'; e.currentTarget.style.color = T.textSub; e.currentTarget.style.transform = 'none' }}>
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>
        </motion.div>

        {/* RIGHT — Form */}
        <motion.div initial={{ opacity: 0, x: 30 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: .6, delay: .1 }}>
          <div className="sku-card" style={{ padding: '2.5rem' }}>
            <AnimatePresence mode="wait">
              {sent ? (
                <motion.div key="success" initial={{ opacity: 0, scale: .9 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                    style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(34,200,100,.15)', border: '2px solid rgba(34,200,100,.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                    <CheckCircle size={36} style={{ color: '#22c864' }} />
                  </motion.div>
                  <h3 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: '1.4rem', color: T.textMain, marginBottom: '.8rem' }}>Message envoyé !</h3>
                  <p style={{ color: T.textSub, fontSize: '.88rem', lineHeight: 1.7 }}>
                    Vous allez être redirigé vers WhatsApp. On répond en moins de 2h — à tout de suite !
                  </p>
                </motion.div>
              ) : (
                <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <h3 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: '1.3rem', color: T.textMain, marginBottom: '.4rem' }}>
                    Décrivez votre projet
                  </h3>
                  <p style={{ fontSize: '.8rem', color: T.textMuted, marginBottom: '1.8rem' }}>Remplissez le formulaire — on vous recontacte via WhatsApp sous 2h.</p>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '.72rem', color: T.textSub, marginBottom: '.4rem', fontFamily: "'JetBrains Mono',monospace", letterSpacing: '.06em', textTransform: 'uppercase' }}>Votre nom *</label>
                      <input style={inputStyle} placeholder="Elvis Aka" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        onFocus={e => { e.target.style.borderColor = '#22c864'; e.target.style.boxShadow = '0 0 0 3px rgba(34,200,100,.12)' }}
                        onBlur={e => { e.target.style.borderColor = T.border; e.target.style.boxShadow = 'none' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '.72rem', color: T.textSub, marginBottom: '.4rem', fontFamily: "'JetBrains Mono',monospace", letterSpacing: '.06em', textTransform: 'uppercase' }}>Email *</label>
                      <input type="email" style={inputStyle} placeholder="vous@email.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                        onFocus={e => { e.target.style.borderColor = '#22c864'; e.target.style.boxShadow = '0 0 0 3px rgba(34,200,100,.12)' }}
                        onBlur={e => { e.target.style.borderColor = T.border; e.target.style.boxShadow = 'none' }} />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '.72rem', color: T.textSub, marginBottom: '.4rem', fontFamily: "'JetBrains Mono',monospace", letterSpacing: '.06em', textTransform: 'uppercase' }}>WhatsApp / Tél</label>
                      <input style={inputStyle} placeholder="+225 07 XX XX XX" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                        onFocus={e => { e.target.style.borderColor = '#22c864'; e.target.style.boxShadow = '0 0 0 3px rgba(34,200,100,.12)' }}
                        onBlur={e => { e.target.style.borderColor = T.border; e.target.style.boxShadow = 'none' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '.72rem', color: T.textSub, marginBottom: '.4rem', fontFamily: "'JetBrains Mono',monospace", letterSpacing: '.06em', textTransform: 'uppercase' }}>Type de projet</label>
                      <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.service} onChange={e => setForm(f => ({ ...f, service: e.target.value }))}
                        onFocus={e => { e.target.style.borderColor = '#22c864'; e.target.style.boxShadow = '0 0 0 3px rgba(34,200,100,.12)' }}
                        onBlur={e => { e.target.style.borderColor = T.border; e.target.style.boxShadow = 'none' }}>
                        <option value="">Choisir...</option>
                        <option>Site Vitrine</option>
                        <option>E-Commerce</option>
                        <option>Application SaaS</option>
                        <option>API / Backend</option>
                        <option>Portfolio</option>
                        <option>Maintenance</option>
                        <option>Autre</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', fontSize: '.72rem', color: T.textSub, marginBottom: '.4rem', fontFamily: "'JetBrains Mono',monospace", letterSpacing: '.06em', textTransform: 'uppercase' }}>Budget estimé</label>
                    <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.budget} onChange={e => setForm(f => ({ ...f, budget: e.target.value }))}
                      onFocus={e => { e.target.style.borderColor = '#22c864'; e.target.style.boxShadow = '0 0 0 3px rgba(34,200,100,.12)' }}
                      onBlur={e => { e.target.style.borderColor = T.border; e.target.style.boxShadow = 'none' }}>
                      <option value="">Sélectionner...</option>
                      <option>Moins de 150 000 FCFA</option>
                      <option>150 000 – 300 000 FCFA</option>
                      <option>300 000 – 600 000 FCFA</option>
                      <option>Plus de 600 000 FCFA</option>
                      <option>À discuter</option>
                    </select>
                  </div>

                  <div style={{ marginBottom: '1.8rem' }}>
                    <label style={{ display: 'block', fontSize: '.72rem', color: T.textSub, marginBottom: '.4rem', fontFamily: "'JetBrains Mono',monospace", letterSpacing: '.06em', textTransform: 'uppercase' }}>Décrivez votre projet *</label>
                    <textarea rows={5} style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}
                      placeholder="Ex: J'ai une boutique de vêtements à Abidjan et je veux vendre en ligne avec paiement Mobile Money..."
                      value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                      onFocus={e => { e.target.style.borderColor = '#22c864'; e.target.style.boxShadow = '0 0 0 3px rgba(34,200,100,.12)' }}
                      onBlur={e => { e.target.style.borderColor = T.border; e.target.style.boxShadow = 'none' }} />
                  </div>

                  <motion.button whileTap={{ scale: .97 }} onClick={handleSubmit}
                    className="btn-raised" style={{ width: '100%', justifyContent: 'center', fontSize: '.95rem', padding: '1rem', opacity: sending ? .7 : 1 }}>
                    {sending ? (
                      <><span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin .6s linear infinite', display: 'inline-block' }} /> Envoi en cours...</>
                    ) : (
                      <><Send size={16} /> Envoyer sur WhatsApp</>
                    )}
                  </motion.button>

                  <p style={{ textAlign: 'center', fontSize: '.72rem', color: T.textMuted, marginTop: '.9rem' }}>
                    🔒 Vos données restent confidentielles. Aucun spam.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// ── FAQ RAPIDE ────────────────────────────────────────────────
function QuickFAQ() {
  const T = useTheme()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const [open, setOpen] = useState(null)

  const FAQS = [
    { q: 'Combien coûte un site web ?', a: "Un site vitrine commence à 150 000 FCFA. L'e-commerce à partir de 300 000 FCFA. Un devis précis est établi gratuitement après notre échange." },
    { q: 'Combien de temps pour livrer mon projet ?', a: "Un site vitrine : 5-7 jours. Un e-commerce : 10-14 jours. Une application SaaS : 3-6 semaines. Selon la complexité, les délais sont définis ensemble avant de commencer." },
    { q: 'Vous travaillez avec quel type de clients ?', a: "Entrepreneurs, PME, artisans, créatifs, start-ups — toute personne qui veut une présence digitale sérieuse. Principalement en Côte d'Ivoire et en Afrique de l'Ouest." },
    { q: 'Est-ce que vous intégrez Mobile Money ?', a: "Oui ! MTN MoMo, Orange Money et Wave sont intégrés nativement. On connaît les réalités locales et nos solutions sont pensées pour le marché ivoirien." },
    { q: 'Que se passe-t-il après la livraison ?', a: "Une formation complète est incluse pour gérer votre site. Un mois de support gratuit est offert. Des contrats de maintenance sont disponibles à partir de 25 000 FCFA/mois." },
  ]

  return (
    <section ref={ref} style={{ padding: '5rem 5%', background: T.bg }}>
      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <SectionEye label="// Questions fréquentes" center />
          <h2 style={{ fontSize: 'clamp(1.7rem,3vw,2.4rem)', fontWeight: 800, fontFamily: "'Syne',sans-serif", color: T.textMain, letterSpacing: '-.03em' }}>
            Vous avez des questions ?
          </h2>
        </motion.div>
        {FAQS.map((item, i) => (
          <motion.div key={i} className="sku-card"
            initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: i * .08 }}
            style={{ marginBottom: '.8rem', overflow: 'hidden' }}>
            <button onClick={() => setOpen(open === i ? null : i)}
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.2rem 1.5rem', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', gap: '1rem' }}>
              <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: '.9rem', color: T.textMain }}>{item.q}</span>
              <motion.div animate={{ rotate: open === i ? 45 : 0 }} transition={{ duration: .2 }}
                style={{ width: 24, height: 24, borderRadius: '50%', border: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ color: T.green, fontSize: '1.2rem', lineHeight: 1, marginTop: -2 }}>+</span>
              </motion.div>
            </button>
            <AnimatePresence>
              {open === i && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: .25 }}
                  style={{ overflow: 'hidden' }}>
                  <p style={{ padding: '0 1.5rem 1.3rem', fontSize: '.85rem', color: T.textSub, lineHeight: 1.75 }}>{item.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

// ── MAP CTA ───────────────────────────────────────────────────
function MapCTA() {
  const T = useTheme()
  return (
    <section style={{ padding: '4rem 5%', background: T.bgAlt }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '1.5rem' }}>
        {[
          { icon: Users, title: 'Consultation gratuite', desc: "30 minutes pour analyser votre projet ensemble — sans engagement.", cta: 'Réserver un appel', href: 'https://wa.me/2250142507750?text=Bonjour, je veux une consultation gratuite' },
          { icon: MessageCircle, title: 'Chat WhatsApp', desc: "Posez vos questions en direct. Réponse garantie en moins de 2 heures.", cta: 'Ouvrir WhatsApp', href: 'https://wa.me/2250142507750' },
          { icon: Mail, title: 'Envoyez un email', desc: "Préférez l'email ? Envoyez-nous un message détaillé sur votre projet.", cta: 'Envoyer un email', href: 'mailto:wthomasss06@gmail.com' },
        ].map(({ icon: Icon, title, desc, cta, href }) => (
          <div key={title} className="sku-card" style={{ padding: '2rem', textAlign: 'center' }}>
            <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(34,200,100,.1)', border: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.2rem' }}>
              <Icon size={22} style={{ color: T.green }} />
            </div>
            <h3 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: '1rem', color: T.textMain, marginBottom: '.5rem' }}>{title}</h3>
            <p style={{ fontSize: '.82rem', color: T.textSub, lineHeight: 1.6, marginBottom: '1.5rem' }}>{desc}</p>
            <a href={href} target="_blank" rel="noreferrer" className="btn-ghost" style={{ fontSize: '.8rem', padding: '.65rem 1.4rem', width: '100%', justifyContent: 'center' }}>
              {cta} <ArrowRight size={13} />
            </a>
          </div>
        ))}
      </div>
    </section>
  )
}

export default function ContactPage() {
  return (
    <div>
      <HeroContact />
      <ContactGrid />
      <MapCTA />
      <QuickFAQ />
      <SectionCTA variant="strong" message="Prêt à transformer votre idée en réalité digitale ? Parlons-en maintenant." cta="Démarrer sur WhatsApp →" />
    </div>
  )
}
