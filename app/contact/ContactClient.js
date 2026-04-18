'use client'
import { useRef, useState, useEffect } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import {
  Phone, Mail, MapPin, MessageCircle, Send, Clock,
  CheckCircle, Zap, Globe, Share2,
  ArrowRight, Shield
} from 'lucide-react'
import { useTheme } from '@/lib/theme'
import { SectionEye, MarqueeStrip, SectionCTA, LaserBeam, GreenUnderline } from '@/components/ui/index'
import AuroraHero from '@/components/ui/AuroraHero'



/* ── Icônes sociales SVG branded ── */
function FacebookIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.885v2.27h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
    </svg>
  )
}

function WhatsAppIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  )
}

/* ── HERO ── */
function HeroContact() {
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
    <section style={{ height: '70vh', minHeight: 520, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#060e09' }}>
      {/* Layer BG */}
      <div ref={layerBgRef} style={{ position: 'absolute', inset: '-8%', zIndex: 1, willChange: 'transform, filter', transition: 'transform .1s ease-out' }}>
        <AuroraHero labels={[]} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 20%, rgba(6,14,9,.95) 100%)' }} />
      </div>
      {/* Layer MID */}
      <div ref={layerMidRef} style={{ position: 'relative', zIndex: 10, maxWidth: 1000, padding: '0 5%', textAlign: 'center', willChange: 'transform, opacity, filter', transition: 'transform .1s ease-out' }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7, ease: [.22, 1, .36, 1] }}>
          <SectionEye label="// Contactez-nous" center />
          <h1 style={{ fontSize: 'clamp(1.9rem,5vw,3.8rem)', fontWeight: 800, fontFamily: "'Syne',sans-serif", color: 'rgba(255,255,255,.88)', letterSpacing: '-.04em', lineHeight: 1.1, marginBottom: '1.2rem' }}>
            Parlons de votre <GreenUnderline><span className="text-gradient">projet</span></GreenUnderline>
          </h1>
          <p style={{ fontSize: 'clamp(.9rem,2vw,1.05rem)', color: 'rgba(255,255,255,.55)', lineHeight: 1.75, maxWidth: 560, margin: '0 auto 2.5rem' }}>
            Devis gratuit en moins de 24h. Pas d'engagement, pas de jargon technique — juste une conversation pour comprendre votre besoin.
          </p>
        </motion.div>
      </div>
      {/* Layer FORE — particules */}
      <div ref={layerForeRef} style={{ position: 'absolute', inset: 0, zIndex: 20, pointerEvents: 'none', willChange: 'transform, opacity', transition: 'transform .1s ease-out' }}>
        {[{left:'8%',top:'25%',s:4,op:.18,dur:3.8,dy:0},{left:'22%',top:'68%',s:3,op:.11,dur:5.1,dy:1.2},{left:'60%',top:'22%',s:4,op:.20,dur:4.4,dy:0.6},{left:'75%',top:'70%',s:3,op:.09,dur:6.2,dy:1.8},{left:'88%',top:'15%',s:4,op:.15,dur:3.2,dy:0.3}].map((p,i) => (
          <motion.div key={i} style={{ position:'absolute', width:p.s, height:p.s, borderRadius:'50%', background:'#22c864', left:p.left, top:p.top, opacity:p.op }}
            animate={{ y:[0,-18,0] }} transition={{ duration:p.dur, repeat:Infinity, ease:'easeInOut', delay:p.dy }} />
        ))}
      </div>
    </section>
  )
}

/* ── COMMENT NOUS CONTACTER ── */
function ContactChannels() {
  const T = useTheme()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  const CHANNELS = [
    { icon: MessageCircle, label: 'WhatsApp', val: '+225 01 42 50 77 50', href: 'https://wa.me/2250142507750', color: '#25d366', desc: 'Réponse en moins de 2h' },
    { icon: Mail, label: 'Email', val: 'wthomasss06@gmail.com', href: 'mailto:wthomasss06@gmail.com', color: '#22c864', desc: 'Réponse sous 24h' },
    { icon: Phone, label: 'Téléphone', val: '+225 01 42 50 77 50', href: 'tel:+2250142507750', color: '#22c864', desc: 'Lun–Ven, 8h–18h' },
    { icon: MapPin, label: 'Localisation', val: "Abidjan, Côte d'Ivoire", href: null, color: '#22c864', desc: 'Déplacements possibles' },
  ]

  return (
    <section ref={ref} style={{ padding: 'clamp(3rem,6vw,5rem) 5% clamp(2rem,4vw,3rem)', background: T.bgAlt }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} style={{ marginBottom: '2.5rem' }}>
          <SectionEye label="// Canaux de contact" />
          <h2 style={{ fontSize: 'clamp(1.3rem,3vw,2rem)', fontWeight: 800, fontFamily: "'Syne',sans-serif", color: T.textMain, letterSpacing: '-.03em', marginBottom: '.5rem' }}>
            Comment nous contacter
          </h2>
          <p style={{ fontSize: '.88rem', color: T.textSub, lineHeight: 1.7, maxWidth: 500 }}>
            Choisissez le canal qui vous convient. WhatsApp est le plus rapide — on répond en moins de 2h.
          </p>
        </motion.div>

        {/* 2-col on mobile, 4-col on desktop */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(220px,100%),1fr))', gap: '1rem' }}>
          {CHANNELS.map(({ icon: Icon, label, val, href, color, desc }, i) => (
            <motion.div key={label}
              initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: .1 + i * .08 }}
              whileHover={{ y: -4 }}
              style={{
                borderRadius: 16, overflow: 'hidden',
                background: T.light ? 'rgba(255,255,255,.8)' : 'rgba(255,255,255,.04)',
                backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
                border: `1px solid ${T.light ? 'rgba(0,0,0,.08)' : 'rgba(255,255,255,.08)'}`,
                boxShadow: T.light ? '0 4px 20px rgba(0,0,0,.06)' : '0 4px 20px rgba(0,0,0,.3), inset 0 1px 0 rgba(255,255,255,.05)',
                padding: '1.1rem 1.3rem',
                cursor: href ? 'pointer' : 'default',
              }}>
              {href ? (
                <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer"
                  style={{ display: 'flex', alignItems: 'center', gap: '.9rem', textDecoration: 'none' }}>
                  <ChannelIcon Icon={Icon} color={color} T={T} />
                  <ChannelInfo label={label} val={val} desc={desc} T={T} />
                  <ArrowRight size={14} style={{ color: T.green, marginLeft: 'auto', flexShrink: 0 }} />
                </a>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '.9rem' }}>
                  <ChannelIcon Icon={Icon} color={color} T={T} />
                  <ChannelInfo label={label} val={val} desc={desc} T={T} />
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Social row */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: .5 }}
          style={{ marginTop: '1.5rem', padding: '1rem 1.3rem', borderRadius: 14, background: 'rgba(34,200,100,.04)', border: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <span style={{ fontFamily: "'Syne',sans-serif", fontSize: '.78rem', fontWeight: 600, color: T.textMuted }}>Réseaux sociaux</span>
          <div style={{ display: 'flex', gap: '.6rem' }}>
            {[
              { Icon: FacebookIcon, href: 'https://web.facebook.com/profile.php?id=61577494705852', label: 'Facebook', color: '#1877f2' },
              { Icon: WhatsAppIcon, href: 'https://wa.me/2250142507750', label: 'WhatsApp', color: '#25d366' },
              { Icon: Globe, href: 'https://akafolio160502.vercel.app/', label: 'Portfolio', color: '#22c864' },
            ].map(({ Icon, href, label, color }) => (
              <a key={label} href={href} target="_blank" rel="noreferrer" title={label}
                style={{ width: 36, height: 36, borderRadius: 10, background: T.light ? 'rgba(0,0,0,.05)' : 'rgba(34,200,100,.06)', border: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.textSub, transition: 'all .2s' }}
                onMouseEnter={e => { e.currentTarget.style.background = color; e.currentTarget.style.borderColor = color; e.currentTarget.style.color = '#fff'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                onMouseLeave={e => { e.currentTarget.style.background = T.light ? 'rgba(0,0,0,.05)' : 'rgba(34,200,100,.06)'; e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.textSub; e.currentTarget.style.transform = 'none' }}>
                <Icon size={15} />
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function ChannelIcon({ Icon, color, T }) {
  return (
    <div style={{ width: 42, height: 42, borderRadius: 12, background: 'rgba(34,200,100,.1)', border: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <Icon size={19} style={{ color }} />
    </div>
  )
}

function ChannelInfo({ label, val, desc, T }) {
  return (
    <div style={{ minWidth: 0 }}>
      <div style={{ fontFamily: "'Syne',sans-serif", fontSize: '.65rem', fontWeight: 600, color: T.green, letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: '.2rem' }}>{label}</div>
      <div style={{ fontFamily: "'Syne',sans-serif", fontSize: '.82rem', fontWeight: 600, color: T.textMain, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{val}</div>
      <div style={{ fontSize: '.7rem', color: T.textMuted }}>{desc}</div>
    </div>
  )
}

/* ── DÉCRIVEZ VOTRE PROJET (FORM) ── */
function ProjectForm() {
  const T = useTheme()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const [form, setForm] = useState({ name: '', email: '', phone: '', service: '', budget: '', message: '' })
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)

  const inputStyle = {
    width: '100%', padding: '.8rem .95rem', borderRadius: 10,
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

  return (
    <section ref={ref} style={{ padding: 'clamp(2rem,4vw,3rem) 5% clamp(3rem,7vw,6rem)', background: T.bgAlt }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} style={{ marginBottom: '2rem' }}>
          <SectionEye label="// Formulaire de projet" />
          <h2 style={{ fontSize: 'clamp(1.3rem,3vw,2rem)', fontWeight: 800, fontFamily: "'Syne',sans-serif", color: T.textMain, letterSpacing: '-.03em', marginBottom: '.5rem' }}>
            Décrivez votre projet
          </h2>
          <p style={{ fontSize: '.88rem', color: T.textSub, lineHeight: 1.7, maxWidth: 500 }}>
            Remplissez le formulaire — on vous recontacte via WhatsApp sous 2h avec un devis gratuit.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: .15 }}>
          <div style={{
            borderRadius: 20,
            background: T.light ? 'rgba(255,255,255,.9)' : 'rgba(255,255,255,.04)',
            backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
            border: `1px solid ${T.light ? 'rgba(0,0,0,.08)' : 'rgba(255,255,255,.1)'}`,
            boxShadow: T.light ? '0 4px 32px rgba(0,0,0,.08)' : '0 8px 48px rgba(0,0,0,.4), inset 0 1px 0 rgba(255,255,255,.07)',
            padding: 'clamp(1.2rem,4vw,2.5rem)',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg,transparent,rgba(255,255,255,.15),transparent)', pointerEvents: 'none' }} />

            <AnimatePresence mode="wait">
              {sent ? (
                <motion.div key="success" initial={{ opacity: 0, scale: .9 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center', padding: 'clamp(2rem,6vw,3rem) 1rem' }}>
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                    style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(34,200,100,.15)', border: '2px solid rgba(34,200,100,.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                    <CheckCircle size={36} style={{ color: '#22c864' }} />
                  </motion.div>
                  <h3 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 'clamp(1.1rem,3vw,1.4rem)', color: T.textMain, marginBottom: '.8rem' }}>Message envoyé !</h3>
                  <p style={{ color: T.textSub, fontSize: '.88rem', lineHeight: 1.7 }}>
                    Vous allez être redirigé vers WhatsApp. On répond en moins de 2h — à tout de suite !
                  </p>
                </motion.div>
              ) : (
                <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  {/* Responsive 2-col grid — stacks on mobile */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(220px,100%),1fr))', gap: '1rem', marginBottom: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '.72rem', color: T.textSub, marginBottom: '.4rem', fontFamily: "'Syne',sans-serif", letterSpacing: '.06em', textTransform: 'uppercase' }}>Votre nom *</label>
                      <input style={inputStyle} placeholder="Elvis Aka" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        onFocus={e => { e.target.style.borderColor = '#22c864'; e.target.style.boxShadow = '0 0 0 3px rgba(34,200,100,.12)' }}
                        onBlur={e => { e.target.style.borderColor = T.border; e.target.style.boxShadow = 'none' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '.72rem', color: T.textSub, marginBottom: '.4rem', fontFamily: "'Syne',sans-serif", letterSpacing: '.06em', textTransform: 'uppercase' }}>Email *</label>
                      <input type="email" style={inputStyle} placeholder="vous@email.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                        onFocus={e => { e.target.style.borderColor = '#22c864'; e.target.style.boxShadow = '0 0 0 3px rgba(34,200,100,.12)' }}
                        onBlur={e => { e.target.style.borderColor = T.border; e.target.style.boxShadow = 'none' }} />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(220px,100%),1fr))', gap: '1rem', marginBottom: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '.72rem', color: T.textSub, marginBottom: '.4rem', fontFamily: "'Syne',sans-serif", letterSpacing: '.06em', textTransform: 'uppercase' }}>WhatsApp / Tél</label>
                      <input style={inputStyle} placeholder="+225 07 XX XX XX" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                        onFocus={e => { e.target.style.borderColor = '#22c864'; e.target.style.boxShadow = '0 0 0 3px rgba(34,200,100,.12)' }}
                        onBlur={e => { e.target.style.borderColor = T.border; e.target.style.boxShadow = 'none' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '.72rem', color: T.textSub, marginBottom: '.4rem', fontFamily: "'Syne',sans-serif", letterSpacing: '.06em', textTransform: 'uppercase' }}>Type de projet</label>
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
                    <label style={{ display: 'block', fontSize: '.72rem', color: T.textSub, marginBottom: '.4rem', fontFamily: "'Syne',sans-serif", letterSpacing: '.06em', textTransform: 'uppercase' }}>Budget estimé</label>
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
                    <label style={{ display: 'block', fontSize: '.72rem', color: T.textSub, marginBottom: '.4rem', fontFamily: "'Syne',sans-serif", letterSpacing: '.06em', textTransform: 'uppercase' }}>Décrivez votre projet *</label>
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

export default function ContactPage() {
  return (
    <div>
      <HeroContact />
      <ContactChannels />
      <ProjectForm />
      <MarqueeStrip />
      <SectionCTA variant="strong" message="Prêt à transformer votre idée en réalité digitale ? Parlons-en maintenant." cta="Démarrer sur WhatsApp →" />
    </div>
  )
}