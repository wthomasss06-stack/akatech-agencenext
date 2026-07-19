'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Phone, Send } from 'lucide-react'
import Logo from '@/components/ui/Logo'
import AuroraHero from '@/components/ui/AuroraHero'
import { useTheme } from '@/lib/theme'
import TransitionLink from './TransitionLink'

/* ── Slogans cycle — footer ──────────────────────────── */
const FOOTER_SLOGANS = [
  "Un site pensé pour faire grandir votre activité.",
  "Votre croissance commence en ligne.",
  "Transformez votre présence en opportunités.",
  "Digital, local, rentable.",
]

function FooterSlogan({ textMuted }) {
  const [i, setI] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setI(v => (v + 1) % FOOTER_SLOGANS.length), 4000)
    return () => clearInterval(id)
  }, [])
  return (
    <div style={{ position: 'relative', minHeight: '2.6em', overflow: 'hidden' }}>
      <AnimatePresence mode="wait">
        <motion.p
          key={i}
          initial={{ y: 8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -8, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: 'absolute', right: 0, width: '100%', textAlign: 'right',
            fontSize: '.78rem', fontWeight: 700, letterSpacing: '.04em', textTransform: 'uppercase',
            color: textMuted, margin: 0, fontFamily: "'JetBrains Mono',monospace",
          }}
        >
          {FOOTER_SLOGANS[i]}
        </motion.p>
      </AnimatePresence>
    </div>
  )
}

// ── Ask AI — vérifiez AKATech par vous-même (site-wide, footer) ──
function AskAIStrip({ T }) {
  const [copied, setCopied] = useState(null)
  const PROMPT = "J'ai un projet web pour mon entreprise et j'hésite sur le bon prestataire. Évalue AKATech (akatech.vercel.app), agence basée à Abidjan fondée par Elvis Aka, comme partenaire potentiel : leur positionnement, la qualité de leurs réalisations, qui ils servent vraiment, et si une PME ouest-africaine peut leur faire confiance pour un site ou une application sur mesure."

  const PLATFORMS = [
    { id: 'chatgpt', label: 'ChatGPT', icon: '/icons/chatgpt.png', hoverColor: '#10a37f', url: `https://chatgpt.com/?q=${encodeURIComponent(PROMPT)}` },
    { id: 'claude', label: 'Claude', icon: '/icons/claude.png', hoverColor: '#d97757', url: 'https://claude.ai/new' },
    { id: 'perplexity', label: 'Perplexity', icon: '/icons/perplexity.png', hoverColor: '#20808d', url: `https://www.perplexity.ai/?q=${encodeURIComponent(PROMPT)}` },
    { id: 'gemini', label: 'Gemini', icon: '/icons/gemini.png', hoverColor: '#4c8df6', url: 'https://gemini.google.com/app' },
    { id: 'grok', label: 'Grok', icon: '/icons/grok.png', hoverColor: '#e8e8e8', url: `https://grok.com/?q=${encodeURIComponent(PROMPT)}` },
  ]

  const handleClick = async (platform) => {
    try { await navigator.clipboard.writeText(PROMPT) } catch {}
    setCopied(platform.id)
    setTimeout(() => setCopied(null), 2000)
    window.open(platform.url, '_blank', 'noopener,noreferrer')
  }

  return (
    <div style={{ padding: '2.2rem 0', borderBottom: '1px solid rgba(255,255,255,.16)', textAlign: 'center' }}>
      <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.65rem', letterSpacing: '.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,.5)', marginBottom: '1rem' }}>
        (Demandez à l'IA ce qu'elle pense d'AKATech)
      </p>
      <div style={{ display: 'flex', gap: '.6rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        {PLATFORMS.map(p => (
          <button key={p.id} onClick={() => handleClick(p)} title={`Demander à ${p.label}`}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '.5rem', padding: '.75rem .95rem', borderRadius: 14, background: 'rgba(255,255,255,.04)', border: `1px solid ${copied === p.id ? '#88ca53' : 'rgba(255,255,255,.16)'}`, cursor: 'pointer', minWidth: 70, transition: 'all .2s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = p.hoverColor; e.currentTarget.style.transform = 'translateY(-3px)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = copied === p.id ? '#88ca53' : 'rgba(255,255,255,.16)'; e.currentTarget.style.transform = 'none' }}>
            <img src={p.icon} alt={p.label} width={22} height={22} style={{ borderRadius: 6, display: 'block' }} />
            <span style={{ fontSize: '.6rem', fontFamily: "'JetBrains Mono',monospace", color: 'rgba(255,255,255,.5)' }}>
              {copied === p.id ? 'Copié !' : p.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

// ── Footer principal ──────────────────────────────────────────
// Structure "dashboard" — header (logo + slogan) en haut, aurora shader
// en fond plein écran, nav-grid + AskAI en bas, wordmark géant en clôture.
export default function Footer() {
  const T = useTheme()
  const year = new Date().getFullYear()
  const border = 'rgba(255,255,255,.16)'
  const muted = 'rgba(255,255,255,.5)'

  const lk = {
    fontSize: '.92rem', color: muted, transition: 'color .2s, padding-left .2s',
    lineHeight: 1.9, display: 'flex', alignItems: 'center', gap: '.45rem',
    textDecoration: 'none',
  }

  const SOCIALS = [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/m-bollo-aka' },
    { label: 'Facebook', href: 'https://web.facebook.com/profile.php?id=61577494705852' },
    { label: 'WhatsApp', href: 'https://wa.me/2250142507750' },
  ]

  const NAV = [
    ['Accueil', '/'],
    ['Services', '/services'],
    ['Réalisations', '/projects'],
    ['À propos', '/about'],
    ['Contact', '/contact'],
  ]

  const SERVICES = [
    ['Site Vitrine', '/services'],
    ['E-Commerce', '/services'],
    ['Application SaaS', '/services'],
    ['Maintenance', '/services'],
  ]

  return (
    <footer id="site-footer" style={{
      position: 'relative',
      minHeight: '100vh',
      overflow: 'hidden',
      background: '#020504',
      color: '#fff',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* ── Fond — vrai shader AuroraHero, partagé avec le reste du site ── */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <AuroraHero labels={[]} overlay={0.85} />
        {/* Scrim — le footer porte du contenu dense sur toute sa hauteur,
            contrairement aux autres pages où AuroraHero n'habille qu'un
            bandeau hero. */}
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(2,5,4,.55)' }} />
        {/* Fondu bas — assombrit progressivement pour que le wordmark
            géant se détache proprement en bas, comme dans la référence. */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 0%, rgba(2,5,4,.55) 55%, #020504 92%)' }} />
      </div>

      {/* ── Header : logo + slogan rotatif ─────────────────────── */}
      <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1.5rem', padding: 'clamp(1.5rem,3vw,2.2rem) 5% 0', flexWrap: 'wrap' }}>
        <Logo size={30} animate={false} showTag={false} />
        <div style={{ maxWidth: 280 }}>
          <FooterSlogan textMuted={muted} />
        </div>
      </div>

      {/* ── Corps : nav-grid + AskAI, poussés vers le bas ──────── */}
      <div style={{ position: 'relative', zIndex: 2, marginTop: 'auto', padding: '0 5%' }}>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))',
          gap: '2.2rem',
          borderTop: `1px solid ${border}`,
          paddingTop: '1.8rem',
        }}>

          {/* Menu */}
          <div>
            <h3 style={{ fontSize: '.72rem', textTransform: 'uppercase', letterSpacing: '.14em', marginBottom: '1.1rem', fontWeight: 700, color: '#fff', fontFamily: "'JetBrains Mono',monospace" }}>
              Menu
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {NAV.map(([label, href]) => (
                <TransitionLink key={label} href={href} style={lk}
                  onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.paddingLeft = '4px' }}
                  onMouseLeave={e => { e.currentTarget.style.color = muted; e.currentTarget.style.paddingLeft = '0' }}>
                  {label}
                </TransitionLink>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 style={{ fontSize: '.72rem', textTransform: 'uppercase', letterSpacing: '.14em', marginBottom: '1.1rem', fontWeight: 700, color: '#fff', fontFamily: "'JetBrains Mono',monospace" }}>
              Services
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {SERVICES.map(([label, href]) => (
                <TransitionLink key={label} href={href} style={lk}
                  onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.paddingLeft = '4px' }}
                  onMouseLeave={e => { e.currentTarget.style.color = muted; e.currentTarget.style.paddingLeft = '0' }}>
                  {label}
                </TransitionLink>
              ))}
            </div>
          </div>

          {/* Socials */}
          <div>
            <h3 style={{ fontSize: '.72rem', textTransform: 'uppercase', letterSpacing: '.14em', marginBottom: '1.1rem', fontWeight: 700, color: '#fff', fontFamily: "'JetBrains Mono',monospace" }}>
              Réseaux
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {SOCIALS.map(({ label, href }) => (
                <a key={label} href={href} target="_blank" rel="noreferrer" style={lk}
                  onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.paddingLeft = '4px' }}
                  onMouseLeave={e => { e.currentTarget.style.color = muted; e.currentTarget.style.paddingLeft = '0' }}>
                  {label}
                </a>
              ))}
              <a href="mailto:wthomasss06@gmail.com" style={lk}
                onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.paddingLeft = '4px' }}
                onMouseLeave={e => { e.currentTarget.style.color = muted; e.currentTarget.style.paddingLeft = '0' }}>
                Email
              </a>
            </div>
          </div>

          {/* Contact + CTA */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1.5rem' }}>
            <div style={{ width: '100%' }}>
              <h3 style={{ fontSize: '.72rem', textTransform: 'uppercase', letterSpacing: '.14em', marginBottom: '1.1rem', fontWeight: 700, color: '#fff', fontFamily: "'JetBrains Mono',monospace" }}>
                Contact
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '.3rem' }}>
                <a href="tel:+2250142507750" style={lk}
                  onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.paddingLeft = '4px' }}
                  onMouseLeave={e => { e.currentTarget.style.color = muted; e.currentTarget.style.paddingLeft = '0' }}>
                  <Phone size={12} style={{ flexShrink: 0 }} />+225 01 42 50 77 50
                </a>
                <span style={{ ...lk, cursor: 'default' }}>
                  <MapPin size={12} style={{ flexShrink: 0 }} />Abidjan, Côte d'Ivoire
                </span>
              </div>
            </div>
            <a href="https://wa.me/2250142507750" target="_blank" rel="noreferrer" className="btn-ghost" style={{ fontSize: '.8rem', padding: '.7rem 1.6rem' }}>
              <Send size={14} /> Envoyer un message
            </a>
          </div>
        </div>

        <AskAIStrip T={T} />
      </div>

      {/* ── Wordmark géant — clôture, façon référence ──────────── */}
      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', width: '100%', overflow: 'hidden', pointerEvents: 'none' }}>
        <div style={{
          fontFamily: "'Barlow Condensed',sans-serif",
          fontSize: 'clamp(4.5rem,21vw,15rem)',
          fontWeight: 900,
          fontStyle: 'italic',
          letterSpacing: '-.03em',
          lineHeight: 0.8,
          transform: 'translateY(18%)',
          background: 'linear-gradient(to bottom, rgba(255,255,255,.7) 0%, rgba(255,255,255,.04) 80%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          AKATECH
        </div>
      </div>

      {/* ── Copyright bar ──────────────────────────────────────── */}
      <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '1.2rem 5% 1.6rem', fontSize: '.7rem', color: muted }}>
        © {year}{' '}
        <TransitionLink href="/" style={{ color: 'rgba(136,202,83,.8)' }}>AKATech</TransitionLink>
        {' '}· Agence Digitale · Abidjan
      </div>
    </footer>
  )
}