'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Moon, Sun } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Logo from '@/components/ui/Logo'
import { useTheme } from '@/lib/theme'

const NAV_LINKS = [
  { label: 'Accueil', href: '/' },
  { label: 'À propos', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Projets', href: '/projects' },
  { label: 'Tarifs', href: '/pricing' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()
  const T = useTheme()

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <>
      <motion.nav
        className={scrolled ? 'nav-scrolled' : ''}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: .6, ease: [.22,1,.36,1] }}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9000,
          padding: '0 5%',
          height: scrolled ? 60 : 72,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: scrolled
            ? (T.light ? 'rgba(255,255,255,.95)' : 'rgba(6,14,9,.95)')
            : 'transparent',
          backdropFilter: scrolled ? 'blur(16px)' : 'none',
          borderBottom: scrolled ? `1px solid ${T.border}` : '1px solid transparent',
          transition: 'all .3s cubic-bezier(.22,1,.36,1)',
        }}
      >
        <Link href="/" style={{ textDecoration: 'none' }}>
          <Logo size={36} showTag={false} />
        </Link>

        {/* Desktop Nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '.2rem' }} className="hide-mobile">
          {NAV_LINKS.map(({ label, href }) => {
            const active = pathname === href
            return (
              <Link key={href} href={href}
                style={{
                  padding: '.5rem .9rem',
                  borderRadius: 8,
                  fontFamily: "'Syne',sans-serif",
                  fontSize: '.82rem',
                  fontWeight: active ? 700 : 500,
                  color: active ? T.green : T.textSub,
                  background: active ? (T.light ? 'rgba(22,163,74,.08)' : 'rgba(34,200,100,.08)') : 'transparent',
                  transition: 'all .2s',
                  textDecoration: 'none',
                  position: 'relative',
                }}
                onMouseEnter={e => { e.currentTarget.style.color = T.green; e.currentTarget.style.background = T.light ? 'rgba(22,163,74,.06)' : 'rgba(34,200,100,.06)' }}
                onMouseLeave={e => { e.currentTarget.style.color = active ? T.green : T.textSub; e.currentTarget.style.background = active ? (T.light ? 'rgba(22,163,74,.08)' : 'rgba(34,200,100,.08)') : 'transparent' }}
              >
                {label}
                {active && (
                  <motion.div layoutId="nav-active"
                    style={{ position: 'absolute', bottom: 2, left: '50%', transform: 'translateX(-50%)', width: 16, height: 2, borderRadius: 1, background: T.green }} />
                )}
              </Link>
            )
          })}
        </div>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
          <button className="theme-toggle" onClick={T.toggle} style={{ display:'flex',alignItems:'center',justifyContent:'center',width:36,height:36,borderRadius:'50%',border:`1px solid ${T.border}`,background:T.light?'rgba(0,0,0,.05)':'rgba(34,200,100,.08)',color:T.textSub,cursor:'pointer',transition:'all .3s' }}>
            {T.light ? <Moon size={15} /> : <Sun size={15} />}
          </button>

          <a href="https://wa.me/2250142507750" target="_blank" rel="noreferrer"
            className="btn-raised hide-mobile"
            style={{ padding: '.55rem 1.2rem', fontSize: '.8rem' }}>
            Démarrer un projet →
          </a>

          <button className="hide-desktop"
            onClick={() => setMenuOpen(o => !o)}
            style={{ background: 'none', border: `1px solid ${T.border}`, borderRadius: 8, padding: '.4rem', color: T.textMain, cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: .25 }}
            style={{
              position: 'fixed', top: 72, left: 0, right: 0, zIndex: 8999,
              background: T.light ? '#ffffff' : '#030806',
              borderBottom: `1px solid ${T.border}`,
              padding: '1rem 5% 2rem',
            }}
          >
            {NAV_LINKS.map(({ label, href }, i) => (
              <motion.div key={href}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * .05 }}
              >
                <Link href={href} onClick={() => setMenuOpen(false)}
                  style={{
                    display: 'block', padding: '.85rem 0',
                    borderBottom: `1px solid ${T.border}`,
                    fontFamily: "'Syne',sans-serif", fontWeight: 600,
                    fontSize: '.95rem',
                    color: pathname === href ? T.green : T.textMain,
                    textDecoration: 'none',
                  }}>
                  {label}
                </Link>
              </motion.div>
            ))}
            <a href="https://wa.me/2250142507750" target="_blank" rel="noreferrer"
              className="btn-raised" style={{ marginTop: '1.5rem', justifyContent: 'center', width: '100%' }}>
              Démarrer un projet →
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
