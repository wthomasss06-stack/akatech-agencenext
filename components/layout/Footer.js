'use client'
import { useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Phone, Send } from 'lucide-react'
import Logo from '@/components/ui/Logo'
import AuroraHero from '@/components/ui/AuroraHero'
import { HoverSlideText } from '@/components/ui/index'
import { useTheme } from '@/lib/theme'
import { useLanguage } from '@/lib/language'
import TransitionLink from './TransitionLink'
import { wireLetterHoverSwap } from '@/lib/hoverImageChars'
import { STUDIO_LETTER_IMAGE_POOLS } from '@/lib/studioWordmarkImages'
import './FooterWordmark.css'

/* ── Slogans cycle — footer (traduits via t(), voir FooterSlogan) ── */

function FooterSlogan({ textMuted, t }) {
  const slogans = [t('footerSlogan1'), t('footerSlogan2'), t('footerSlogan3'), t('footerSlogan4')]
  const [i, setI] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setI(v => (v + 1) % slogans.length), 4000)
    return () => clearInterval(id)
  }, [slogans.length])
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
          {slogans[i]}
        </motion.p>
      </AnimatePresence>
    </div>
  )
}

// ── Ask AI — vérifiez AKATech par vous-même (site-wide, footer) ──
function AskAIStrip({ T, t }) {
  const [copied, setCopied] = useState(null)
  const PROMPT = t('askAiPrompt')

  const PLATFORMS = [
    { id: 'chatgpt', label: 'ChatGPT', icon: '/icons/chatgpt-vitamin.png', url: `https://chatgpt.com/?q=${encodeURIComponent(PROMPT)}` },
    { id: 'claude', label: 'Claude', icon: '/icons/claude-vitamin.png', url: 'https://claude.ai/new' },
    { id: 'perplexity', label: 'Perplexity', icon: '/icons/perplexity-vitamin.png', url: `https://www.perplexity.ai/?q=${encodeURIComponent(PROMPT)}` },
    { id: 'gemini', label: 'Gemini', icon: '/icons/gemini-vitamin.png', url: 'https://gemini.google.com/app' },
    { id: 'grok', label: 'Grok', icon: '/icons/grok-vitamin.png', url: `https://grok.com/?q=${encodeURIComponent(PROMPT)}` },
    { id: 'manus', label: 'Manus', icon: '/icons/manus-vitamin.png', url: `https://manus.im/?q=${encodeURIComponent(PROMPT)}` },
  ]

  const handleClick = async (platform) => {
    try { await navigator.clipboard.writeText(PROMPT) } catch {}
    setCopied(platform.id)
    setTimeout(() => setCopied(null), 2000)
    window.open(platform.url, '_blank', 'noopener,noreferrer')
  }

  return (
    <div style={{ padding: '2.2rem 0', textAlign: 'center' }}>
      
      <p id="ask-ai-heading" style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.65rem', letterSpacing: '.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,.5)', marginBottom: '1rem' }}>
        {t('askAiHeading')}
      </p>
      <div style={{ display: 'flex', gap: '.6rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        {PLATFORMS.map(p => (
          <button key={p.id} type="button" onClick={() => handleClick(p)} title={`${t('askPlatform')} ${p.label}`}
            aria-label={`${t('askPlatform')} ${p.label}`} aria-describedby="ask-ai-heading"
            className="aka-ask-btn"
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '.5rem', padding: '.75rem .95rem', borderRadius: 14, background: 'transparent', border: 'none', cursor: 'pointer', minWidth: 70 }}>
            <span style={{ width: 36, height: 36, display: 'grid', placeItems: 'center', background: 'transparent', boxShadow: 'none', overflow: 'visible' }}>
              <img src={p.icon} alt={p.label} width={28} height={28} style={{ display: 'block', filter: 'none', objectFit: 'contain' }} />
            </span>
            <span aria-live="polite" style={{ fontSize: '.6rem', fontFamily: "'JetBrains Mono',monospace", color: 'rgba(255,255,255,.5)' }}>
              <HoverSlideText text={copied === p.id ? t('copied') : p.label} />
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

// ── Wordmark géant hoverable — "AKATECH" (blanc) / "STUDIO." (vert) ───
// Chaque caractère porte SA PROPRE <img> (rendue ci-dessous, cachée par
// défaut) ; au survol de CE caractère précis, la lettre s'efface et SON
// image — tirée au hasard dans son pool, cf. lib/studioWordmarkImages.js,
// ex. 9 variantes pour "A" — apparaît par-dessus, en place. Reprend la
// mécanique de reveal_hover_image_par_lettre.html (Effect 093 : lettre →
// image EN PLACE, pas une image qui suit le curseur) via
// wireLetterHoverSwap (lib/hoverImageChars.js), en gardant le tirage
// aléatoire par lettre plutôt qu'une image fixe par position. Le point
// final de "STUDIO." a son propre pool dédié (clé '.').
function StudioWordmark() {
  const ref = useRef(null)

  useEffect(() => {
    if (!ref.current) return
    return wireLetterHoverSwap(ref.current, '.hover-char', STUDIO_LETTER_IMAGE_POOLS)
  }, [])

  const renderChars = (word) =>
    word.split('').map((ch, i) => {
      const hasPool = (STUDIO_LETTER_IMAGE_POOLS[ch] || []).length > 0
      return (
        <span className="hover-char" key={i}>
          <span className="hover-char-letter">{ch}</span>
          {hasPool && <img className="hover-char-image" alt="" aria-hidden="true" decoding="async" />}
        </span>
      )
    })

  return (
    <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', width: '100%', overflow: 'visible', pointerEvents: 'none', padding: '1rem 0 2rem' }}>
      <div
        ref={ref}
        className="studio-wordmark-hoverable"
        style={{
          position: 'relative',
          display: 'inline-block',
          fontFamily: "'Barlow Condensed',sans-serif",
          fontSize: 'clamp(4rem, 17vw, 21rem)',
          fontWeight: 900,
          fontStyle: 'italic',
          letterSpacing: '-.02em',
          lineHeight: 0.82,
          transform: 'translateY(5%)',
          background: 'linear-gradient(to bottom, rgba(255,255,255,.9) 0%, rgba(255,255,255,.05) 85%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          textTransform: 'uppercase',
          pointerEvents: 'auto',
        }}
      >
        {renderChars('AKATECH')}
        <br />
        <span style={{ display: 'inline-block' }}>
          {renderChars('STUDIO.')}
        </span>
      </div>
    </div>
  )
}

// ── Footer principal ──────────────────────────────────────────
// Structure "dashboard" — header (logo + slogan) en haut, aurora shader
// en fond plein écran, nav-grid + AskAI en bas, wordmark géant en clôture.
export default function Footer() {
  const T = useTheme()
  const { t } = useLanguage()
  const pathname = usePathname()
  const year = new Date().getFullYear()
  const border = 'rgba(255,255,255,.16)'
  const muted = 'rgba(255,255,255,.5)'

  if (pathname?.startsWith('/explorer')) return null

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
    [t('home'), '/'],
    [t('services'), '/services'],
    [t('projects'), '/projects'],
    [t('about'), '/about'],
  ]

  const SERVICES = [
    [t('footerServiceVitrine'), '/services'],
    [t('footerServiceEcommerce'), '/services'],
    [t('footerServiceSaas'), '/services'],
    [t('footerServiceMaintenance'), '/services'],
  ]

  const LEGAL = [
    [t('legalMentions'), '/mentions-legales'],
    [t('legalPrivacy'), '/confidentialite'],
    [t('legalTerms'), '/conditions-utilisation'],
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
          <FooterSlogan textMuted={muted} t={t} />
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
              {t('menu')}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {NAV.map(([label, href]) => (
                <TransitionLink key={label} href={href} style={lk}
                  onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.paddingLeft = '4px' }}
                  onMouseLeave={e => { e.currentTarget.style.color = muted; e.currentTarget.style.paddingLeft = '0' }}>
                  <HoverSlideText text={label} />
                </TransitionLink>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 style={{ fontSize: '.72rem', textTransform: 'uppercase', letterSpacing: '.14em', marginBottom: '1.1rem', fontWeight: 700, color: '#fff', fontFamily: "'JetBrains Mono',monospace" }}>
              {t('services')}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {SERVICES.map(([label, href]) => (
                <TransitionLink key={label} href={href} style={lk}
                  onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.paddingLeft = '4px' }}
                  onMouseLeave={e => { e.currentTarget.style.color = muted; e.currentTarget.style.paddingLeft = '0' }}>
                  <HoverSlideText text={label} />
                </TransitionLink>
              ))}
            </div>
          </div>

          {/* Legal */}
          <div>
            <h3 style={{ fontSize: '.72rem', textTransform: 'uppercase', letterSpacing: '.14em', marginBottom: '1.1rem', fontWeight: 700, color: '#fff', fontFamily: "'JetBrains Mono',monospace" }}>
              {t('legal')}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {LEGAL.map(([label, href]) => (
                <TransitionLink key={label} href={href} style={lk}
                  onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.paddingLeft = '4px' }}
                  onMouseLeave={e => { e.currentTarget.style.color = muted; e.currentTarget.style.paddingLeft = '0' }}>
                  <HoverSlideText text={label} />
                </TransitionLink>
              ))}
            </div>
          </div>

          {/* Contact + CTA */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1.5rem' }}>
            <div style={{ width: '100%' }}>
              <h3 style={{ fontSize: '.72rem', textTransform: 'uppercase', letterSpacing: '.14em', marginBottom: '1.1rem', fontWeight: 700, color: '#fff', fontFamily: "'JetBrains Mono',monospace" }}>
                {t('contact')}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '.3rem' }}>
                <a href="tel:+2250142507750" style={lk}
                  onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.paddingLeft = '4px' }}
                  onMouseLeave={e => { e.currentTarget.style.color = muted; e.currentTarget.style.paddingLeft = '0' }}>
                  <Phone size={12} style={{ flexShrink: 0 }} /><HoverSlideText text="+225 01 42 50 77 50" />
                </a>
                <span style={{ ...lk, cursor: 'default' }}>
                  <MapPin size={12} style={{ flexShrink: 0 }} />Abidjan, Côte d'Ivoire
                </span>
                <a href="mailto:wthomasss06@gmail.com" style={lk}
                  onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.paddingLeft = '4px' }}
                  onMouseLeave={e => { e.currentTarget.style.color = muted; e.currentTarget.style.paddingLeft = '0' }}>
                  <HoverSlideText text={t('emailLabel')} />
                </a>
                {SOCIALS.map(({ label, href }) => (
                  <a key={label} href={href} target="_blank" rel="noreferrer" style={lk}
                    onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.paddingLeft = '4px' }}
                    onMouseLeave={e => { e.currentTarget.style.color = muted; e.currentTarget.style.paddingLeft = '0' }}>
                    <HoverSlideText text={label} />
                  </a>
                ))}
              </div>
            </div>
            <a href="https://wa.me/2250142507750" target="_blank" rel="noreferrer" className="btn-ghost" style={{ fontSize: '.8rem', padding: '.7rem 1.6rem' }}>
              <Send size={14} /> <HoverSlideText text={t('sendMessageBtn')} />
            </a>
          </div>
        </div>

        <AskAIStrip T={T} t={t} />
      </div>

      {/* ── Wordmark géant — AKATECH STUDIO. (hoverable) ──────── */}
      <StudioWordmark />

      {/* ── Copyright bar ──────────────────────────────────────── */}
      <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '1.2rem 5% 1.6rem', fontSize: '.7rem', color: muted }}>
        © {year}{' '}
        <TransitionLink href="/" style={{ color: 'rgba(136,202,83,.8)' }}><HoverSlideText text="AKATech Studio." /></TransitionLink>
        {' '} · Abidjan
      </div>
    </footer>
  )
}
