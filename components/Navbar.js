'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Menu, X, Moon, Sun,
  Home, User, Layers, FolderOpen, Tag, BookOpen, Mail,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Logo from '@/components/ui/Logo'
import { useTheme } from '@/lib/theme'

const NAV_LINKS = [
  { label: 'Accueil',       href: '/',            Icon: Home       },
  { label: 'À propos',      href: '/about',        Icon: User       },
  { label: 'Services',      href: '/services',     Icon: Layers     },
  { label: 'Réalisations',  href: '/projects',     Icon: FolderOpen },
  { label: 'Tarifs',        href: '/pricing',      Icon: Tag        },
  { label: 'Blog',          href: '/blog',         Icon: BookOpen   },
  { label: 'Contact',       href: '/contact',      Icon: Mail       },
]

/* ─── AnimLink : icône seule → label glisse au hover/actif ─── */
function AnimNavLink({ href, Icon, label, active, T }) {
  const [hov, setHov] = useState(false)
  const on = active || hov

  return (
    <Link
      href={href}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 0,
        padding: '7px 10px', borderRadius: 999, textDecoration: 'none',
        background: on
          ? (T.light ? 'rgba(22,163,74,.11)' : 'rgba(34,200,100,.11)')
          : 'transparent',
        border: `1px solid ${on
          ? (T.light ? 'rgba(22,163,74,.25)' : 'rgba(34,200,100,.25)')
          : 'transparent'}`,
        color: on ? T.green : T.textSub,
        transition: 'background .18s, border-color .18s, color .15s',
        position: 'relative', flexShrink: 0, overflow: 'hidden',
      }}
    >
      {/* Icône */}
      <span style={{
        display: 'flex', flexShrink: 0,
        transform: on ? 'scale(1.15)' : 'scale(1)',
        transition: 'transform .2s cubic-bezier(.34,1.56,.64,1)',
      }}>
        <Icon size={15} />
      </span>

      {/* Label qui glisse */}
      <span style={{
        fontFamily: "'Syne',sans-serif", fontWeight: 600, fontSize: '.78rem',
        whiteSpace: 'nowrap', overflow: 'hidden',
        maxWidth: on ? 110 : 0,
        opacity: on ? 1 : 0,
        marginLeft: on ? 6 : 0,
        transform: on ? 'translateX(0)' : 'translateX(-8px)',
        transition: 'max-width .22s ease, opacity .18s ease, margin-left .22s ease, transform .18s ease',
        pointerEvents: 'none', letterSpacing: '.01em',
      }}>
        {label}
      </span>

      {/* Pastille active */}
      {active && (
        <motion.span layoutId="nav-dot"
          style={{
            position: 'absolute', bottom: 3, left: '50%',
            transform: 'translateX(-50%)',
            width: 4, height: 4, borderRadius: '50%',
            background: T.green, display: 'block',
          }}
        />
      )}
    </Link>
  )
}

/* ─────────────────────── NAVBAR ─────────────────────── */
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()
  const T = useTheme()

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => { setMenuOpen(false) }, [pathname])

  const isActive = (href) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  const navBg = scrolled
    ? (T.light ? 'rgba(255,255,255,.97)' : 'rgba(3,8,6,.96)')
    : 'transparent'

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: .65, ease: [.22, 1, .36, 1] }}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9000,
          padding: '0 5%',
          height: scrolled ? 58 : 70,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: navBg,
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom: `1px solid ${scrolled
            ? (T.light ? 'rgba(0,0,0,.08)' : 'rgba(34,200,100,.14)')
            : 'transparent'}`,
          transition: 'height .3s, background .3s, border-color .3s',
        }}
      >
        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', flexShrink: 0 }}>
          <Logo size={scrolled ? 30 : 34} showTag={false} animate={false} />
        </Link>

        {/* Desktop nav — pill container */}
        <div className="hide-mobile" style={{
          display: 'flex', alignItems: 'center', gap: '.15rem',
          background: T.light ? 'rgba(0,0,0,.03)' : 'rgba(255,255,255,.03)',
          border: `1px solid ${T.light ? 'rgba(0,0,0,.06)' : 'rgba(255,255,255,.05)'}`,
          borderRadius: 999, padding: '4px 6px',
        }}>
          {NAV_LINKS.map(({ label, href, Icon }) => (
            <AnimNavLink key={href} href={href} Icon={Icon} label={label} active={isActive(href)} T={T} />
          ))}
        </div>

        {/* Actions droite */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '.6rem' }}>

          {/* Thème */}
          <button onClick={T.toggle} title={T.light ? 'Mode sombre' : 'Mode clair'}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 34, height: 34, borderRadius: '50%',
              border: `1px solid ${T.border}`,
              background: T.light ? 'rgba(0,0,0,.05)' : 'rgba(34,200,100,.07)',
              color: T.light ? '#666' : 'rgba(255,255,255,.55)',
              cursor: 'pointer', transition: 'all .22s', flexShrink: 0,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = T.light ? 'rgba(0,0,0,.1)' : 'rgba(34,200,100,.18)'
              e.currentTarget.style.color = T.green
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = T.light ? 'rgba(0,0,0,.05)' : 'rgba(34,200,100,.07)'
              e.currentTarget.style.color = T.light ? '#666' : 'rgba(255,255,255,.55)'
            }}>
            {T.light ? <Moon size={14} /> : <Sun size={14} />}
          </button>

          {/* CTA desktop */}
          <a href="https://wa.me/2250142507750" target="_blank" rel="noreferrer"
            className="btn-raised hide-mobile"
            style={{ padding: '.5rem 1.2rem', fontSize: '.78rem', whiteSpace: 'nowrap' }}>
            Démarrer un projet →
          </a>

          {/* Burger mobile */}
          <button className="hide-desktop" onClick={() => setMenuOpen(o => !o)}
            style={{
              background: 'none', border: `1px solid ${T.border}`,
              borderRadius: 8, padding: '.4rem .5rem',
              color: T.textMain, cursor: 'pointer',
              display: 'flex', alignItems: 'center', transition: 'border-color .2s',
            }}>
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </motion.nav>

      {/* Drawer mobile */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }}
            transition={{ duration: .22 }}
            style={{
              position: 'fixed', top: scrolled ? 58 : 70, left: 0, right: 0, zIndex: 8999,
              background: T.light ? 'rgba(255,255,255,.99)' : 'rgba(3,8,6,.99)',
              backdropFilter: 'blur(20px)', borderBottom: `1px solid ${T.border}`,
              padding: '.8rem 5% 2rem',
            }}
          >
            {NAV_LINKS.map(({ label, href, Icon }, i) => {
              const active = isActive(href)
              return (
                <motion.div key={href}
                  initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * .04 }}>
                  <Link href={href} style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '.85rem 0', borderBottom: `1px solid ${T.border}`,
                    fontFamily: "'Syne',sans-serif", fontWeight: 600, fontSize: '.95rem',
                    color: active ? T.green : T.textMain,
                    textDecoration: 'none', transition: 'color .2s',
                  }}>
                    <span style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                      background: active
                        ? (T.light ? 'rgba(22,163,74,.12)' : 'rgba(34,200,100,.12)')
                        : (T.light ? 'rgba(0,0,0,.05)' : 'rgba(255,255,255,.05)'),
                      color: active ? T.green : T.textSub,
                    }}>
                      <Icon size={14} />
                    </span>
                    {label}
                    {active && (
                      <span style={{
                        marginLeft: 'auto', width: 6, height: 6,
                        borderRadius: '50%', background: T.green,
                      }} />
                    )}
                  </Link>
                </motion.div>
              )
            })}
            <a href="https://wa.me/2250142507750" target="_blank" rel="noreferrer"
              className="btn-raised"
              style={{ marginTop: '1.4rem', justifyContent: 'center', width: '100%', display: 'flex' }}>
              Démarrer un projet →
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}