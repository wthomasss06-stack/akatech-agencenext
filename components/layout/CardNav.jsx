'use client'
import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/lib/theme'
import { useGhostCycle } from './useGhostCycle'
import TransitionLink from './TransitionLink'
import './CardNav.css'

/* ── Slogans cycle — navJAX ─────────────────────────── */
const NAV_SLOGANS = [
  "Des sites web qui\nfont grandir votre activité.",
  "Votre croissance\ncommence en ligne.",
  "Transformez votre\nprésence en opportunités.",
  "Digital, local,\nrentable.",
]

function NavSlogan() {
  const [i, setI] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setI(v => (v + 1) % NAV_SLOGANS.length), 4000)
    return () => clearInterval(id)
  }, [])
  const lines = NAV_SLOGANS[i].split('\n')
  return (
    <div style={{ position: 'relative', minHeight: '2.8em', overflow: 'hidden' }}>
      <AnimatePresence mode="wait">
        <motion.p
          key={i}
          className="aka-card-slogan"
          initial={{ y: 14, opacity: 0, filter: 'blur(6px)' }}
          animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
          exit={{ y: -14, opacity: 0, filter: 'blur(6px)' }}
          transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
          style={{ margin: 0, position: 'absolute', width: '100%' }}
        >
          {lines[0]}<br />{lines[1]}
        </motion.p>
      </AnimatePresence>
    </div>
  )
}

/* ═══════════════════════════════════════════════
   CardNav — AKATech (desktop uniquement)
   Port fidèle du mockup akatech_UI.html :
   barre pill compacte → hamburger ouvre une grille
   de 3 cartes (Services / Réalisations / Agence)
   avec timeline GSAP (hauteur de la nav + stagger
   cards). Palette émeraude AKATech.
   ═══════════════════════════════════════════════ */

const ArrowIcon = () => (
  <svg className="aka-link-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M7 17L17 7M17 7H7M17 7V17" />
  </svg>
)

/* ── Lien de carte avec ghost-cycle text au survol (même mécanique que StaggeredMenu) ── */
function CardLinkWithGhost({ href, label, sub, onClick }) {
  const ghost = useGhostCycle(label.toUpperCase())
  return (
    <TransitionLink href={href} className="aka-card-link" onClick={onClick} onMouseEnter={ghost.play}>
      <ArrowIcon />
      <span className="aka-card-link-textWrap">
        <span className="aka-card-link-label">{label}</span>
        <span className="aka-card-link-ghost" aria-hidden="true">
          <span className="aka-card-ghost-cycle">
            <span className="aka-card-ghost-inner" ref={ghost.innerRef}>
              {ghost.lines.map((l, i) => <span className="aka-card-ghost-line" key={i}>{l}</span>)}
            </span>
          </span>
        </span>
        <em className="aka-link-sub">{sub}</em>
      </span>
    </TransitionLink>
  )
}

export default function CardNav() {
  const T = useTheme()
  const navRef = useRef(null)
  const contentRef = useRef(null)
  const cardsRef = useRef([])
  const tlRef = useRef(null)
  const openRef = useRef(false)
  const [open, setOpen] = useState(false)

  /* ── Transparent partout, le fond ne revient que quand le menu est déployé ── */

  useEffect(() => {
    const nav = navRef.current
    const content = contentRef.current
    const cards = cardsRef.current
    if (!nav || !content) return

    // Init cards hors écran
    gsap.set(cards, { y: 45, opacity: 0 })

    const tl = gsap.timeline({ paused: true })
    tl.to(nav, {
      height: () => content.scrollHeight + 64,
      duration: 0.55,
      ease: 'power3.inOut',
    })
    tl.to(cards, {
      y: 0, opacity: 1,
      duration: 0.4,
      stagger: 0.08,
      ease: 'power3.out',
    }, '-=0.25')
    tlRef.current = tl

    const onResize = () => {
      if (openRef.current) gsap.set(nav, { height: content.scrollHeight + 64 })
    }
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      tl.kill()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const toggle = () => {
    const tl = tlRef.current
    if (!tl) return
    const next = !openRef.current
    openRef.current = next
    if (next) tl.play()
    else tl.reverse()
    setOpen(next)
  }

  const closeNav = () => {
    if (!openRef.current) return
    openRef.current = false
    tlRef.current?.reverse()
    setOpen(false)
  }

  return (
    <div className="aka-nav-container">
      <nav ref={navRef} className={'aka-card-nav' + (open ? ' is-open' : '')} style={{
        '--nav-bg': open ? (T.light ? 'rgba(248,248,248,0.88)' : 'rgba(6,14,9,0.85)') : 'transparent',
        '--nav-blur': open ? 'blur(20px) saturate(160%)' : 'none',
        '--nav-border': open ? (T.light ? '1px solid rgba(95,145,55,0.18)' : '1px solid rgba(136,202,83,0.15)') : '1px solid transparent',
        '--nav-shadow': open ? '0 8px 32px rgba(0,0,0,0.22)' : 'none',
        '--nav-hline': '#88ca53',
        '--nav-btn-border': !open ? 'rgba(255,255,255,0.3)' : 'rgba(242,237,232,.15)',
        '--nav-btn-bg': !open ? 'rgba(0,0,0,0.18)' : 'rgba(255,255,255,.05)',
        '--nav-btn-color': '#88ca53',
        '--card1-bg': T.light ? '#f0eeeb' : '#0d1a11',
        '--card2-bg': T.light ? '#eaf5e2' : '#0a1f10',
        '--card3-bg': T.light ? '#ffffff' : '#060e09',
        '--card-text': T.light ? '#0a0c16' : '#f2ede8',
        '--card1-border': T.light ? '1px solid rgba(10,20,10,0.06)' : '1px solid rgba(136,202,83,0.16)',
        '--card2-border': T.light ? '1px solid rgba(95,145,55,0.18)' : '1px solid rgba(136,202,83,0.22)',
        '--card3-border': T.light ? '1px solid rgba(10,20,10,0.08)' : '1px solid rgba(255,255,255,0.06)',
        '--card3-label': T.light ? 'rgba(10,20,10,0.5)' : 'rgba(242,237,232,0.5)',
        '--card1-link-hover': T.light ? '#2f6a17' : '#88ca53',
        '--theme-green': T.green,
      }}>
        <div className="aka-nav-top">
          <button className={'aka-hamburger' + (open ? ' open' : '')} onClick={toggle} aria-label="Menu" type="button">
            <div className="aka-hline" />
            <div className="aka-hline" />
          </button>

          <TransitionLink href="/" className="aka-nav-logo" onClick={closeNav}>
            <Image src="/images/logo.webp" alt="AKATech" width={75} height={50} style={{ objectFit: 'contain' }} priority />
          </TransitionLink>

          <div className="aka-nav-right">
            <button onClick={T.toggle} className="aka-theme-btn" title={T.light ? 'Mode sombre' : 'Mode clair'} type="button">
              {T.light ? <Moon size={13} /> : <Sun size={13} />}
            </button>
            <a href="https://wa.me/2250142507750" target="_blank" rel="noreferrer" className="aka-nav-cta">
              Démarrer
            </a>
          </div>
        </div>

        <div className="aka-nav-content" ref={contentRef}>
          <div className="aka-nav-card aka-card-1" ref={el => cardsRef.current[0] = el}>
            <div className="aka-card-label">Ce qu'on fait</div>
            <div className="aka-card-brand">
              <TransitionLink href="/" onClick={closeNav} className="aka-card-logo-link" aria-label="Retour à l'accueil">
                <Image src="/images/logo.webp" alt="AKATech" width={138} height={92} style={{ objectFit: 'contain' }} />
              </TransitionLink>
              <NavSlogan />
            </div>
          </div>

          <div className="aka-nav-card aka-card-2" ref={el => cardsRef.current[1] = el}>
            <div className="aka-card-label">Nos réalisations</div>
            <div className="aka-card-links">
              <CardLinkWithGhost href="/projects" label="Portfolio" sub="Projets sélectionnés" onClick={closeNav} />
              <CardLinkWithGhost href="/pricing" label="Tarifs" sub="Devis transparents" onClick={closeNav} />
              <CardLinkWithGhost href="/blog" label="Blog" sub="Conseils & actualités" onClick={closeNav} />
            </div>
          </div>

          <div className="aka-nav-card aka-card-3" ref={el => cardsRef.current[2] = el}>
            <div className="aka-card-label">L'agence</div>
            <div className="aka-card-links">
              <CardLinkWithGhost href="/services" label="Service" sub="Ce que nous proposons" onClick={closeNav} />
              <CardLinkWithGhost href="/about" label="À propos" sub="Notre équipe, Abidjan" onClick={closeNav} />
              <CardLinkWithGhost href="/contact" label="Contact" sub="Parlons de ton projet" onClick={closeNav} />
            </div>
          </div>
        </div>
      </nav>
    </div>
  )
}
