'use client'
import { useRef, useState, useEffect } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Mail, MapPin, Phone, ChevronRight, ExternalLink } from 'lucide-react'
import Logo from '@/components/ui/Logo'
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
    <div style={{ position: 'relative', minHeight: '3.2em', marginBottom: '1.5rem', overflow: 'hidden' }}>
      <AnimatePresence mode="wait">
        <motion.p
          key={i}
          initial={{ y: 10, opacity: 0, filter: 'blur(5px)' }}
          animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
          exit={{ y: -10, opacity: 0, filter: 'blur(5px)' }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: 'absolute', width: '100%',
            fontSize: '.82rem', lineHeight: 1.7,
            color: textMuted, maxWidth: 260, margin: 0,
          }}
        >
          {FOOTER_SLOGANS[i]}
        </motion.p>
      </AnimatePresence>
    </div>
  )
}

// ── SVG custom icons ─────────────────────────────────────────
function FacebookIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.885v2.27h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
    </svg>
  )
}

function LinkedInIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  )
}

function WhatsAppIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  )
}

// ── Données SVG AKATECH (paths lettre par lettre) ────────────
// viewBox 776 × 148 — 7 lettres : A K A T E C H
const LOGO_PATHS = [
  // A (première)
  { d: 'M 10 140 L 58 8 L 106 140 L 86 140 L 73 102 L 43 102 L 30 140 Z M 58 32 L 47 88 L 69 88 Z' },
  // K
  { d: 'M 122 8 L 122 140 L 142 140 L 142 82 L 180 140 L 203 140 L 161 72 L 200 8 L 177 8 L 142 67 L 142 8 Z' },
  // A (deuxième)
  { d: 'M 220 140 L 268 8 L 316 140 L 296 140 L 283 102 L 253 102 L 240 140 Z M 268 32 L 257 88 L 279 88 Z' },
  // T
  { d: 'M 332 8 L 332 28 L 366 28 L 366 140 L 386 140 L 386 28 L 420 28 L 420 8 Z' },
  // E
  { d: 'M 436 8 L 436 140 L 540 140 L 540 120 L 456 120 L 456 82 L 528 82 L 528 62 L 456 62 L 456 28 L 538 28 L 538 8 Z' },
  // C
  { d: 'M 558 8 Q 520 8 497 36 Q 478 58 478 74 Q 478 96 497 116 Q 520 140 558 140 Q 596 140 620 116 L 604 100 Q 586 122 558 122 Q 530 122 514 104 Q 500 88 500 74 Q 500 58 514 46 Q 530 24 558 24 Q 588 24 604 50 L 620 34 Q 596 8 558 8 Z' },
  // H
  { d: 'M 636 8 L 636 140 L 656 140 L 656 82 L 730 82 L 730 140 L 750 140 L 750 8 L 730 8 L 730 62 L 656 62 L 656 8 Z' },
]

// ── Animated SVG Logo Banner ──────────────────────────────────
// variant="page"     → lettres vertes (#88ca53), animation slide-up au scroll
// variant="services" → lettres gris/bordure (stroke only), statique, pas d'anim
function FooterLogoBanner({ variant = 'page' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: false, margin: '-80px' })
  const isPage = variant === 'page'

  return (
    <div ref={ref} style={{ overflow: 'hidden', padding: '0 0' }}>
      <svg
        viewBox="0 0 776 148"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: 'auto', display: 'block' }}
      >
        {LOGO_PATHS.map((p, i) => (
          isPage ? (
            // page : slide-up depuis le bas, fill vert, stagger
            <motion.path
              key={i}
              d={p.d}
              fill="#88ca53"
              initial={{ y: 160, opacity: 0 }}
              animate={inView ? { y: 0, opacity: 1 } : { y: 160, opacity: 0 }}
              transition={{
                duration: 0.65,
                ease: [0.34, 1.56, 0.64, 1],
                delay: i * 0.055,
              }}
            />
          ) : (
            // services : statique, stroke uniquement, couleur atténuée
            <path
              key={i}
              d={p.d}
              fill="none"
              stroke="rgba(136,202,83,0.18)"
              strokeWidth="1.5"
            />
          )
        ))}
      </svg>
    </div>
  )
}
// ── Footer principal ──────────────────────────────────────────
// variant="page"     → logo SVG animé (vert, slide-up)
// variant="services" → logo SVG statique stroke gris
export default function Footer({ variant = 'page' }) {
  const T = useTheme()
  const year = new Date().getFullYear()
  const isPage = variant === 'page'

  const lk = {
    fontSize: '.78rem', color: T.textMuted, transition: 'color .22s',
    lineHeight: 1.75, display: 'flex', alignItems: 'center', gap: '.45rem',
    textDecoration: 'none',
  }

  const SOCIALS = [
    { Icon: LinkedInIcon, href: 'https://www.linkedin.com/in/m-bollo-aka', label: 'LinkedIn', hoverColor: '#0a66c2' },
    { Icon: FacebookIcon, href: 'https://web.facebook.com/profile.php?id=61577494705852', label: 'Facebook', hoverColor: '#1877f2' },
    { Icon: WhatsAppIcon, href: 'https://wa.me/2250142507750', label: 'WhatsApp', hoverColor: '#25d366' },
    { Icon: Mail, href: 'mailto:wthomasss06@gmail.com', label: 'Email', hoverColor: T.green },
  ]

  return (
    <footer id="site-footer" style={{
      background: T.light ? '#f3f3f3' : '#020504',
      paddingTop: isPage ? '5rem' : '4rem',
      borderTop: `1px solid ${T.border}`,
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 5%' }}>

        {/* ── Colonnes principales ───────────────────────────── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))',
          gap: '2.5rem',
          paddingBottom: '3rem',
          borderBottom: `1px solid ${T.border}`,
        }}>

          {/* Brand */}
          <div>
            <div style={{ marginBottom: '1.2rem' }}>
              <Logo size={28} animate={false} showTag={false} />
            </div>
            <FooterSlogan textMuted={T.textMuted} />
            <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap' }}>
              {SOCIALS.map(({ Icon, href, label, hoverColor }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel="noreferrer"
                  title={label}
                  style={{
                    width: 34, height: 34, borderRadius: 8,
                    background: T.light ? 'rgba(0,0,0,.05)' : 'rgba(136,202,83,.05)',
                    border: `1px solid ${T.border}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: T.textMuted, transition: 'all .2s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = hoverColor
                    e.currentTarget.style.borderColor = hoverColor
                    e.currentTarget.style.color = '#fff'
                    e.currentTarget.style.transform = 'translateY(-2px)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = T.light ? 'rgba(0,0,0,.05)' : 'rgba(136,202,83,.05)'
                    e.currentTarget.style.borderColor = T.border
                    e.currentTarget.style.color = T.textMuted
                    e.currentTarget.style.transform = 'none'
                  }}
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <div style={{ fontSize: '.68rem', fontWeight: 700, color: T.textSub, textTransform: 'uppercase', letterSpacing: '.12em', marginBottom: '1.1rem', fontFamily: "'JetBrains Mono',monospace" }}>
              Services
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '.15rem' }}>
              {[
                ['Site Vitrine', '/services'],
                ['E-Commerce', '/services'],
                ['Application SaaS', '/services'],
                ['API & Backend', '/services'],
                ['Portfolio', '/services'],
                ['Maintenance', '/services'],
              ].map(([label, href]) => (
                <TransitionLink
                  key={label}
                  href={href}
                  style={lk}
                  onMouseEnter={e => e.currentTarget.style.color = T.green}
                  onMouseLeave={e => e.currentTarget.style.color = T.textMuted}
                >
                  <ChevronRight size={10} style={{ color: T.greenSub, flexShrink: 0 }} />{label}
                </TransitionLink>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <div style={{ fontSize: '.68rem', fontWeight: 700, color: T.textSub, textTransform: 'uppercase', letterSpacing: '.12em', marginBottom: '1.1rem', fontFamily: "'JetBrains Mono',monospace" }}>
              Navigation
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '.15rem' }}>
              {[
                ['Accueil', '/'],
                ['À propos', '/about'],
                ['Réalisations', '/projects'],
                ['Tarifs', '/pricing'],
                ['Blog', '/blog'],
                ['Contact', '/contact'],
              ].map(([label, href]) => (
                <TransitionLink
                  key={label}
                  href={href}
                  style={lk}
                  onMouseEnter={e => e.currentTarget.style.color = T.green}
                  onMouseLeave={e => e.currentTarget.style.color = T.textMuted}
                >
                  <ChevronRight size={10} style={{ color: T.greenSub, flexShrink: 0 }} />{label}
                </TransitionLink>
              ))}
              <a
                href="https://mbolloaka-dev.vercel.app/"
                target="_blank"
                rel="noreferrer"
                style={{ ...lk, color: T.greenSub, marginTop: '.4rem' }}
                onMouseEnter={e => e.currentTarget.style.color = T.green}
                onMouseLeave={e => e.currentTarget.style.color = T.greenSub}
              >
                <ExternalLink size={10} style={{ flexShrink: 0 }} />Portfolio complet
              </a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <div style={{ fontSize: '.68rem', fontWeight: 700, color: T.textSub, textTransform: 'uppercase', letterSpacing: '.12em', marginBottom: '1.1rem', fontFamily: "'JetBrains Mono',monospace" }}>
              Contact
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
              {[
                { icon: Phone, label: '+225 01 42 50 77 50', href: 'tel:+2250142507750' },
                { icon: Mail, label: 'wthomasss06@gmail.com', href: 'mailto:wthomasss06@gmail.com' },
                { icon: MapPin, label: "Abidjan, Côte d'Ivoire", href: null },
              ].map(({ icon: Icon, label, href }) =>
                href ? (
                  <a
                    key={label}
                    href={href}
                    target={href.startsWith('http') ? '_blank' : undefined}
                    rel="noreferrer"
                    style={lk}
                    onMouseEnter={e => e.currentTarget.style.color = T.green}
                    onMouseLeave={e => e.currentTarget.style.color = T.textMuted}
                  >
                    <Icon size={12} style={{ color: T.green, flexShrink: 0 }} />{label}
                  </a>
                ) : (
                  <span key={label} style={{ ...lk, cursor: 'default' }}>
                    <Icon size={12} style={{ color: T.green, flexShrink: 0 }} />{label}
                  </span>
                )
              )}
            </div>
          </div>
        </div>

        {/* ── Logo SVG banner ────────────────────────────────── */}
        <div style={{
          borderBottom: `1px solid ${T.border}`,
          padding: '2rem 0',
          margin: '0',
        }}>
          <FooterLogoBanner variant={variant} />
        </div>

        {/* ── Copyright bar ──────────────────────────────────── */}
        <div style={{
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          padding: '1.4rem 0', fontSize: '.7rem', color: T.textMuted,
        }}>
          <p style={{ textAlign: 'center', margin: 0 }}>
            © {year}{' '}
            <TransitionLink
              href="/"
              style={{ color: T.greenSub, transition: 'color .2s' }}
              onMouseEnter={e => e.currentTarget.style.color = T.green}
              onMouseLeave={e => e.currentTarget.style.color = T.greenSub}
            >
              AKATech
            </TransitionLink>
            {' '}· Agence Digitale · Abidjan ·
          </p>
        </div>
      </div>
    </footer>
  )
}