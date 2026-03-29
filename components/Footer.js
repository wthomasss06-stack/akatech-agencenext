'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Mail, MapPin, Phone, ChevronRight, ExternalLink, Globe } from 'lucide-react'
import Logo from '@/components/ui/Logo'
import { useTheme } from '@/lib/theme'

function FacebookIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.885v2.27h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
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

export default function Footer() {
  const T = useTheme()
  const year = new Date().getFullYear()

  const lk = {
    fontSize: '.78rem', color: T.textMuted, transition: 'color .22s',
    lineHeight: 1.75, display: 'flex', alignItems: 'center', gap: '.45rem',
    textDecoration: 'none',
  }

  const SOCIALS = [
    { Icon: FacebookIcon, href: 'https://web.facebook.com/profile.php?id=61577494705852', label: 'Facebook', hoverColor: '#1877f2' },
    { Icon: WhatsAppIcon, href: 'https://wa.me/2250142507750', label: 'WhatsApp', hoverColor: '#25d366' },
    { Icon: Mail, href: 'mailto:wthomasss06@gmail.com', label: 'Email', hoverColor: T.green },
  ]

  return (
    <footer style={{ background: T.light ? '#f3f3f3' : '#020504', paddingTop: '4rem', borderTop: `1px solid ${T.border}` }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 5%' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: '2.5rem', paddingBottom: '3rem', borderBottom: `1px solid ${T.border}` }}>

          {/* Brand */}
          <div>
            <div style={{ marginBottom: '1.2rem' }}><Logo size={28} animate={false} showTag={false} /></div>
            <p style={{ fontSize: '.82rem', lineHeight: 1.7, color: T.textMuted, maxWidth: 260, marginBottom: '1.5rem' }}>
              Agence de solutions web basée à Abidjan. Sites vitrines, e-commerce, SaaS et portfolios modernes, rapides et rentables.
            </p>
            <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap' }}>
              {SOCIALS.map(({ Icon, href, label, hoverColor }) => (
                <a key={label} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" title={label}
                  style={{ width: 34, height: 34, borderRadius: 8, background: T.light ? 'rgba(0,0,0,.05)' : 'rgba(34,200,100,.05)', border: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.textMuted, transition: 'all .2s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = hoverColor; e.currentTarget.style.borderColor = hoverColor; e.currentTarget.style.color = '#fff'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = T.light ? 'rgba(0,0,0,.05)' : 'rgba(34,200,100,.05)'; e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.textMuted; e.currentTarget.style.transform = 'none' }}
                ><Icon size={14} /></a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <div style={{ fontSize: '.68rem', fontWeight: 700, color: T.textSub, textTransform: 'uppercase', letterSpacing: '.12em', marginBottom: '1.1rem', fontFamily: "'JetBrains Mono',monospace" }}>Services</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '.15rem' }}>
              {[['Site Vitrine', '/services'], ['E-Commerce', '/services'], ['Application SaaS', '/services'], ['API & Backend', '/services'], ['Portfolio', '/services'], ['Maintenance', '/services']].map(([label, href]) => (
                <Link key={label} href={href} style={lk}
                  onMouseEnter={e => e.currentTarget.style.color = T.green}
                  onMouseLeave={e => e.currentTarget.style.color = T.textMuted}>
                  <ChevronRight size={10} style={{ color: T.greenSub, flexShrink: 0 }} />{label}
                </Link>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <div style={{ fontSize: '.68rem', fontWeight: 700, color: T.textSub, textTransform: 'uppercase', letterSpacing: '.12em', marginBottom: '1.1rem', fontFamily: "'JetBrains Mono',monospace" }}>Navigation</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '.15rem' }}>
              {[['Accueil', '/'], ['À propos', '/about'], ['Réalisations', '/projects'], ['Tarifs', '/pricing'], ['Blog', '/blog'], ['Contact', '/contact']].map(([label, href]) => (
                <Link key={label} href={href} style={lk}
                  onMouseEnter={e => e.currentTarget.style.color = T.green}
                  onMouseLeave={e => e.currentTarget.style.color = T.textMuted}>
                  <ChevronRight size={10} style={{ color: T.greenSub, flexShrink: 0 }} />{label}
                </Link>
              ))}
              <a href="https://akafolio160502.vercel.app/" target="_blank" rel="noreferrer"
                style={{ ...lk, color: T.greenSub, marginTop: '.4rem' }}
                onMouseEnter={e => e.currentTarget.style.color = T.green}
                onMouseLeave={e => e.currentTarget.style.color = T.greenSub}>
                <ExternalLink size={10} style={{ flexShrink: 0 }} />Portfolio complet
              </a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <div style={{ fontSize: '.68rem', fontWeight: 700, color: T.textSub, textTransform: 'uppercase', letterSpacing: '.12em', marginBottom: '1.1rem', fontFamily: "'JetBrains Mono',monospace" }}>Contact</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
              {[
                { icon: Phone, label: '+225 01 42 50 77 50', href: 'tel:+2250142507750' },
                { icon: Mail, label: 'wthomasss06@gmail.com', href: 'mailto:wthomasss06@gmail.com' },
                { icon: MapPin, label: 'Abidjan, Côte d\'Ivoire', href: null },
              ].map(({ icon: Icon, label, href }) =>
                href ? (
                  <a key={label} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer"
                    style={lk}
                    onMouseEnter={e => e.currentTarget.style.color = T.green}
                    onMouseLeave={e => e.currentTarget.style.color = T.textMuted}>
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

        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1.4rem 0', fontSize: '.7rem', color: T.textMuted }}>
          <p style={{ textAlign: 'center' }}>
            © {year}{' '}
            <a href="/" style={{ color: T.greenSub, transition: 'color .2s' }}
              onMouseEnter={e => e.currentTarget.style.color = T.green}
              onMouseLeave={e => e.currentTarget.style.color = T.greenSub}>AKATech</a>
            {' '}· Agence Digitale · Abidjan ·
          </p>
        </div>
      </div>
    </footer>
  )
}
