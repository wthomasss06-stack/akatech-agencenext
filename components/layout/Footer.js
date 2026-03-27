'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Share2, MessageCircle, Mail, MapPin, Phone, ChevronRight, ExternalLink } from 'lucide-react'
import Logo from '@/components/ui/Logo'
import { useTheme } from '@/lib/theme'

export default function Footer() {
  const T = useTheme()
  const year = new Date().getFullYear()

  const lk = {
    fontSize: '.78rem', color: T.textMuted, transition: 'color .22s',
    lineHeight: 1.75, display: 'flex', alignItems: 'center', gap: '.45rem',
    textDecoration: 'none',
  }

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
              {[
                { icon: Share2, href: 'https://web.facebook.com/profile.php?id=61577494705852', title: 'Facebook' },
                { icon: MessageCircle, href: 'https://wa.me/2250142507750', title: 'WhatsApp' },
                { icon: Mail, href: 'mailto:wthomasss06@gmail.com', title: 'Email' },
              ].map(({ icon: Icon, href, title }) => (
                <a key={title} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" title={title}
                  style={{ width: 34, height: 34, borderRadius: 8, background: T.light ? 'rgba(0,0,0,.05)' : 'rgba(34,200,100,.05)', border: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.textMuted, transition: 'all .2s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = T.green; e.currentTarget.style.borderColor = T.green; e.currentTarget.style.color = '#fff' }}
                  onMouseLeave={e => { e.currentTarget.style.background = T.light ? 'rgba(0,0,0,.05)' : 'rgba(34,200,100,.05)'; e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.textMuted }}
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
              {[['Accueil', '/'], ['À propos', '/about'], ['Projets', '/projects'], ['Tarifs', '/pricing'], ['Blog', '/blog'], ['Contact', '/contact']].map(([label, href]) => (
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
            {' '}· Agence Digitale · Abidjan · Fait avec ❤️ en Côte d'Ivoire
          </p>
        </div>
      </div>
    </footer>
  )
}
