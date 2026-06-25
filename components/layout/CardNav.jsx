'use client'
import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/lib/theme'

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

export default function CardNav() {
  const T = useTheme()
  const navRef = useRef(null)
  const contentRef = useRef(null)
  const cardsRef = useRef([])
  const tlRef = useRef(null)
  const openRef = useRef(false)
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  /* ── Transparent dans le hero, glass + border en dehors ── */
  useEffect(() => {
    const threshold = window.innerHeight * 0.85
    const onScroll = () => setScrolled(window.scrollY > threshold)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

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
      <style>{`
        .aka-nav-container {
          position: fixed; top: 14px; left: 50%; transform: translateX(-50%);
          width: 92%; max-width: 1100px; z-index: 9000;
        }

        nav.aka-card-nav {
          background-color: ${scrolled || open
            ? (T.light ? 'rgba(248,248,248,0.88)' : 'rgba(6,14,9,0.85)')
            : 'transparent'};
          backdrop-filter: ${scrolled || open ? 'blur(20px) saturate(160%)' : 'none'};
          -webkit-backdrop-filter: ${scrolled || open ? 'blur(20px) saturate(160%)' : 'none'};
          border-radius: 22px;
          overflow: hidden;
          border: ${scrolled || open
            ? (T.light ? '1px solid rgba(95,145,55,0.18)' : '1px solid rgba(136,202,83,0.15)')
            : '1px solid transparent'};
          box-shadow: ${scrolled || open ? '0 8px 32px rgba(0,0,0,0.22)' : 'none'};
          height: 64px;
          transition: background-color 0.4s ease, border-color 0.4s ease,
                      backdrop-filter 0.4s ease, box-shadow 0.4s ease;
        }

        .aka-nav-top {
          height: 64px;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 18px;
        }

        .aka-hamburger {
          width: 24px; height: 15px; cursor: pointer;
          display: flex; flex-direction: column; justify-content: space-between;
          z-index: 10; background: none; border: none; padding: 0;
        }
        .aka-hline {
          width: 100%; height: 1.5px;
          background: ${!scrolled && !open ? 'rgba(255,255,255,0.85)' : (T.light ? 'rgba(10,20,10,0.75)' : 'rgba(242,237,232,0.7)')};
          transition: transform 0.35s cubic-bezier(0.77,0,0.175,1), opacity 0.3s, background 0.4s;
          border-radius: 2px; transform-origin: center;
        }
        .aka-hamburger.open .aka-hline:nth-child(1) { transform: translateY(6.75px) rotate(45deg); background: #88ca53; }
        .aka-hamburger.open .aka-hline:nth-child(2) { transform: translateY(-8.25px) rotate(-45deg); background: #88ca53; }

        .aka-nav-logo {
          display: flex; align-items: center;
          text-decoration: none; line-height: 0;
        }

        .aka-nav-right { display: flex; align-items: center; gap: 8px; }
        .aka-theme-btn {
          width: 28px; height: 28px; border-radius: 8px;
          border: 1px solid ${!scrolled && !open ? 'rgba(255,255,255,0.3)' : 'rgba(242,237,232,.15)'};
          background: ${!scrolled && !open ? 'rgba(0,0,0,0.18)' : 'rgba(255,255,255,.05)'};
          color: ${!scrolled && !open ? 'rgba(255,255,255,0.85)' : 'rgba(242,237,232,.6)'};
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: all .2s;
        }
        .aka-theme-btn:hover { color: #88ca53; border-color: rgba(136,202,83,.4); }

        .aka-nav-cta {
          background: linear-gradient(135deg, #88ca53, #5a9e34);
          color: #04140a; border: none; padding: 7px 16px;
          border-radius: 999px; font-family: 'JetBrains Mono',monospace;
          font-weight: 700; font-size: 0.7rem; letter-spacing: 0.08em;
          text-transform: uppercase; cursor: pointer;
          box-shadow: 0 4px 16px rgba(136,202,83,0.22);
          transition: transform 0.25s, box-shadow 0.25s;
          text-decoration: none; display: inline-block;
        }
        .aka-nav-cta:hover { transform: translateY(-2px); box-shadow: 0 8px 22px rgba(136,202,83,0.38); }

        .aka-nav-content {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 14px; padding: 14px;
        }

        .aka-nav-card {
          border-radius: 18px; padding: 24px 22px; min-height: 230px;
          display: flex; flex-direction: column; justify-content: space-between;
          transform: translateY(45px); opacity: 0;
          transition: box-shadow 0.3s;
        }
        .aka-nav-card:hover { box-shadow: 0 12px 40px rgba(0,0,0,0.4); }

        .aka-card-1 { background: #f0eeeb; color: #0a0c16; }
        .aka-card-2 { background: #0a1f10; color: #F2EDE8; border: 1px solid rgba(136,202,83,0.22); }
        .aka-card-3 { background: #060e09; color: #F2EDE8; border: 1px solid rgba(255,255,255,0.06); }

        .aka-card-label {
          font-family: 'JetBrains Mono',monospace; font-style: italic;
          font-size: 0.78rem; font-weight: 400; letter-spacing: 0.05em; opacity: 0.55;
        }
        .aka-card-1 .aka-card-label { color: #0a0c16; }
        .aka-card-2 .aka-card-label { color: #88ca53; opacity: 0.85; }
        .aka-card-3 .aka-card-label { color: rgba(242,237,232,0.5); }

        .aka-card-links { display: flex; flex-direction: column; gap: 10px; }
        .aka-card-link {
          text-decoration: none; color: inherit;
          font-family: 'JetBrains Mono',monospace; font-size: 1rem; font-weight: 700;
          display: flex; align-items: center; gap: 10px;
          transition: transform 0.2s, color 0.2s; letter-spacing: -0.01em;
        }
        .aka-card-1 .aka-card-link:hover { color: #2f6a17; transform: translateX(5px); }
        .aka-card-2 .aka-card-link:hover,
        .aka-card-3 .aka-card-link:hover { color: #88ca53; transform: translateX(5px); }

        .aka-card-brand { display: flex; flex-direction: column; gap: 14px; }
        .aka-card-logo-link {
          display: flex; align-items: center; justify-content: center;
          width: 100%; line-height: 0; transition: transform 0.25s ease;
        }
        .aka-card-logo-link:hover { transform: scale(1.05); }
        .aka-card-slogan {
          font-family: 'JetBrains Mono',monospace; font-weight: 700;
          font-size: 1.05rem; line-height: 1.25; letter-spacing: -0.01em;
          color: #0a0c16; margin: 0;
        }

        .aka-link-arrow { width: 16px; height: 16px; opacity: 0.5; transition: opacity 0.2s; flex-shrink: 0; }
        .aka-card-link:hover .aka-link-arrow { opacity: 1; }

        .aka-link-sub {
          font-family: 'JetBrains Mono',monospace; font-style: italic;
          font-size: 0.68rem; opacity: 0.5; display: block;
          margin-top: -6px; font-weight: 400;
        }
      `}</style>

      <nav ref={navRef} className={'aka-card-nav' + (open ? ' is-open' : '')}>
        <div className="aka-nav-top">
          <button className={'aka-hamburger' + (open ? ' open' : '')} onClick={toggle} aria-label="Menu" type="button">
            <div className="aka-hline" />
            <div className="aka-hline" />
          </button>

          <Link href="/" className="aka-nav-logo" onClick={closeNav}>
            <Image src="/images/logo.webp" alt="AKATech" width={46} height={46} style={{ objectFit: 'contain' }} priority />
          </Link>

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
              <Link href="/" onClick={closeNav} className="aka-card-logo-link" aria-label="Retour à l'accueil">
                <Image src="/images/logo.webp" alt="AKATech" width={92} height={92} style={{ objectFit: 'contain' }} />
              </Link>
              <NavSlogan />
            </div>
          </div>

          <div className="aka-nav-card aka-card-2" ref={el => cardsRef.current[1] = el}>
            <div className="aka-card-label">Nos réalisations</div>
            <div className="aka-card-links">
              <Link href="/projects" className="aka-card-link" onClick={closeNav}>
                <ArrowIcon />
                <span>Portfolio<em className="aka-link-sub">Projets sélectionnés</em></span>
              </Link>
              <Link href="/pricing" className="aka-card-link" onClick={closeNav}>
                <ArrowIcon />
                <span>Tarifs<em className="aka-link-sub">Devis transparents</em></span>
              </Link>
              <Link href="/blog" className="aka-card-link" onClick={closeNav}>
                <ArrowIcon />
                <span>Blog<em className="aka-link-sub">Conseils & actualités</em></span>
              </Link>
            </div>
          </div>

          <div className="aka-nav-card aka-card-3" ref={el => cardsRef.current[2] = el}>
            <div className="aka-card-label">L'agence</div>
            <div className="aka-card-links">
              <Link href="/services" className="aka-card-link" onClick={closeNav}>
                <ArrowIcon />
                <span>Service<em className="aka-link-sub">Ce que nous proposons</em></span>
              </Link>
              <Link href="/about" className="aka-card-link" onClick={closeNav}>
                <ArrowIcon />
                <span>À propos<em className="aka-link-sub">Notre équipe, Abidjan</em></span>
              </Link>
              <Link href="/contact" className="aka-card-link" onClick={closeNav}>
                <ArrowIcon />
                <span>Contact<em className="aka-link-sub">Parlons de ton projet</em></span>
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </div>
  )
}
