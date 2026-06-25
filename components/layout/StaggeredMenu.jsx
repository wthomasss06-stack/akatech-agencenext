'use client'
import { useCallback, useLayoutEffect, useRef, useState, useEffect } from 'react'
import { gsap } from 'gsap'
import Link from 'next/link'
import { Moon, Sun } from 'lucide-react'
import Logo from '@/components/ui/Logo'
import { useTheme } from '@/lib/theme'
import './StaggeredMenu.css'

/* ═══════════════════════════════════════════════
   StaggeredMenu — AKATech (mobile uniquement)
   Port fidèle du composant du portfolio personnel :
   panel plein écran depuis la droite, balayage de
   couleur à l'ouverture, ghost-cycle text au survol,
   items numérotés. Accent #88ca53 (vs #FF5500 origine).
   items = NAV_LINKS { label, href } — navigation par
   route Next.js (site multi-pages, pas d'ancres).
   ═══════════════════════════════════════════════ */

const GHOST_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#+*/=<>'

function ghostScramble(text) {
  return text.split('').map(ch =>
    /[a-zA-Z0-9]/.test(ch)
      ? GHOST_CHARS[Math.floor(Math.random() * GHOST_CHARS.length)]
      : ch
  ).join('')
}

function buildGhostSeq(text, cycles = 3) {
  const seq = [ghostScramble(text)]
  for (let i = 0; i < cycles; i++) seq.push(ghostScramble(text))
  seq.push(text, text)
  return seq
}

function useGhostCycle(text) {
  const innerRef = useRef(null)
  const tweenRef = useRef(null)
  const [lines, setLines] = useState([text])

  const play = useCallback(() => {
    if (!text) return
    tweenRef.current?.kill()
    const seq = buildGhostSeq(text, 3)
    setLines(seq)
    requestAnimationFrame(() => {
      const inner = innerRef.current
      if (!inner) return
      gsap.set(inner, { yPercent: 0 })
      const finalShift = ((seq.length - 1) / seq.length) * 100
      tweenRef.current = gsap.to(inner, {
        yPercent: -finalShift,
        duration: 0.42 + seq.length * 0.055,
        ease: 'power4.out',
        overwrite: 'auto',
      })
    })
  }, [text])

  return { innerRef, lines, play }
}

function NavItemWithGhost({ it, idx, isActive, closeMenu }) {
  const ghost = useGhostCycle(it.label.toUpperCase())

  return (
    <li className="sm-panel-itemWrap" key={it.href + idx}>
      <Link
        className={'sm-panel-item' + (isActive ? ' sm-panel-item--active' : '')}
        href={it.href}
        aria-label={it.label}
        data-index={idx + 1}
        onMouseEnter={ghost.play}
        onClick={closeMenu}
      >
        <span className="sm-panel-itemLabel">{it.label}</span>

        <span className="sm-panel-item-ghost" aria-hidden="true">
          <span className="sm-ghost-cycle-wrap">
            <span className="sm-ghost-cycle-inner" ref={ghost.innerRef}>
              {ghost.lines.map((l, i) => (
                <span className="sm-ghost-cycle-line" key={i}>{l}</span>
              ))}
            </span>
          </span>
        </span>

        <span className="sm-panel-item-arrow" aria-hidden="true">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.2"
            strokeLinecap="round" strokeLinejoin="round">
            <line x1="7" y1="17" x2="17" y2="7" />
            <polyline points="7 7 17 7 17 17" />
          </svg>
        </span>
      </Link>
    </li>
  )
}

export default function StaggeredMenu({ items = [], isActive, onOpenChange }) {
  const T = useTheme()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const openRef = useRef(false)
  const panelRef = useRef(null)
  const preLayersRef = useRef(null)
  const preLayerElsRef = useRef([])
  const plusHRef = useRef(null)
  const plusVRef = useRef(null)
  const iconRef = useRef(null)
  const textInnerRef = useRef(null)
  const [textLines, setTextLines] = useState(['Menu', 'Close'])

  const openTlRef = useRef(null)
  const closeTweenRef = useRef(null)
  const spinTweenRef = useRef(null)
  const textCycleAnimRef = useRef(null)
  const toggleBtnRef = useRef(null)
  const busyRef = useRef(false)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const panel = panelRef.current
      const preContainer = preLayersRef.current
      const plusH = plusHRef.current
      const plusV = plusVRef.current
      const icon = iconRef.current
      const textInner = textInnerRef.current
      if (!panel || !plusH || !plusV || !icon || !textInner) return

      const preLayers = preContainer
        ? Array.from(preContainer.querySelectorAll('.sm-prelayer'))
        : []
      preLayerElsRef.current = preLayers

      gsap.set([panel, ...preLayers], { xPercent: 100, opacity: 1 })
      if (preContainer) gsap.set(preContainer, { xPercent: 0, opacity: 1 })
      gsap.set(plusH, { transformOrigin: '50% 50%', rotate: 0 })
      gsap.set(plusV, { transformOrigin: '50% 50%', rotate: 90 })
      gsap.set(icon, { rotate: 0, transformOrigin: '50% 50%' })
      gsap.set(textInner, { yPercent: 0 })
    })
    return () => ctx.revert()
  }, [])

  const buildOpenTimeline = useCallback(() => {
    const panel = panelRef.current
    const layers = preLayerElsRef.current
    if (!panel) return null

    openTlRef.current?.kill()
    closeTweenRef.current?.kill()
    closeTweenRef.current = null

    const itemEls = Array.from(panel.querySelectorAll('.sm-panel-itemLabel'))
    const numberEls = Array.from(panel.querySelectorAll('.sm-panel-list[data-numbering] .sm-panel-item'))

    if (itemEls.length) gsap.set(itemEls, { yPercent: 140, rotate: 10 })
    if (numberEls.length) gsap.set(numberEls, { '--sm-num-opacity': 0 })

    const tl = gsap.timeline({ paused: true })

    layers.forEach((el, i) => {
      tl.fromTo(el, { xPercent: 100 }, { xPercent: 0, duration: 0.5, ease: 'power4.out' }, i * 0.07)
    })

    const lastTime = layers.length ? (layers.length - 1) * 0.07 : 0
    const panelInsertTime = lastTime + (layers.length ? 0.08 : 0)
    const panelDuration = 0.65

    tl.fromTo(panel,
      { xPercent: 100 },
      { xPercent: 0, duration: panelDuration, ease: 'power4.out' },
      panelInsertTime
    )

    if (itemEls.length) {
      const itemsStart = panelInsertTime + panelDuration * 0.15
      tl.to(itemEls, {
        yPercent: 0, rotate: 0, duration: 1,
        ease: 'power4.out',
        stagger: { each: 0.1, from: 'start' },
      }, itemsStart)

      if (numberEls.length) {
        tl.to(numberEls, {
          duration: 0.6, ease: 'power2.out',
          '--sm-num-opacity': 1,
          stagger: { each: 0.08, from: 'start' },
        }, itemsStart + 0.1)
      }
    }

    openTlRef.current = tl
    return tl
  }, [])

  const playOpen = useCallback(() => {
    if (busyRef.current) return
    busyRef.current = true
    const tl = buildOpenTimeline()
    if (tl) {
      tl.eventCallback('onComplete', () => { busyRef.current = false })
      tl.play(0)
    } else {
      busyRef.current = false
    }
  }, [buildOpenTimeline])

  const playClose = useCallback(() => {
    openTlRef.current?.kill()
    openTlRef.current = null

    const panel = panelRef.current
    const layers = preLayerElsRef.current
    if (!panel) return

    closeTweenRef.current?.kill()
    closeTweenRef.current = gsap.to([...layers, panel], {
      xPercent: 100, duration: 0.32, ease: 'power3.in', overwrite: 'auto',
      onComplete: () => {
        const itemEls = Array.from(panel.querySelectorAll('.sm-panel-itemLabel'))
        const numberEls = Array.from(panel.querySelectorAll('.sm-panel-list[data-numbering] .sm-panel-item'))
        if (itemEls.length) gsap.set(itemEls, { yPercent: 140, rotate: 10 })
        if (numberEls.length) gsap.set(numberEls, { '--sm-num-opacity': 0 })
        busyRef.current = false
      },
    })
  }, [])

  const animateIcon = useCallback(opening => {
    spinTweenRef.current?.kill()
    if (!iconRef.current) return
    spinTweenRef.current = gsap.to(iconRef.current, {
      rotate: opening ? 225 : 0,
      duration: opening ? 0.8 : 0.35,
      ease: opening ? 'power4.out' : 'power3.inOut',
      overwrite: 'auto',
    })
  }, [])

  const animateText = useCallback(opening => {
    const inner = textInnerRef.current
    if (!inner) return
    textCycleAnimRef.current?.kill()

    const from = opening ? 'Menu' : 'Close'
    const to = opening ? 'Close' : 'Menu'
    const cycles = 3
    const seq = [from]
    let last = from
    for (let i = 0; i < cycles; i++) { last = last === 'Menu' ? 'Close' : 'Menu'; seq.push(last) }
    if (last !== to) seq.push(to)
    seq.push(to)
    setTextLines(seq)

    gsap.set(inner, { yPercent: 0 })
    const finalShift = ((seq.length - 1) / seq.length) * 100
    textCycleAnimRef.current = gsap.to(inner, {
      yPercent: -finalShift,
      duration: 0.5 + seq.length * 0.07,
      ease: 'power4.out',
    })
  }, [])

  const toggleMenu = useCallback(() => {
    const target = !openRef.current
    openRef.current = target
    setOpen(target)
    onOpenChange?.(target)
    if (target) playOpen()
    else playClose()
    animateIcon(target)
    animateText(target)
  }, [playOpen, playClose, animateIcon, animateText, onOpenChange])

  const closeMenu = useCallback(() => {
    if (!openRef.current) return
    openRef.current = false
    setOpen(false)
    onOpenChange?.(false)
    playClose()
    animateIcon(false)
    animateText(false)
  }, [playClose, animateIcon, animateText, onOpenChange])

  /* Ferme le menu à chaque changement de route */
  useEffect(() => { closeMenu() }, []) // eslint-disable-line

  /* ── Header transparent dans hero, glass en dehors ── */
  useEffect(() => {
    const threshold = window.innerHeight * 0.85
    const onScroll = () => setScrolled(window.scrollY > threshold)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return
    const handler = e => {
      if (
        panelRef.current && !panelRef.current.contains(e.target) &&
        toggleBtnRef.current && !toggleBtnRef.current.contains(e.target)
      ) closeMenu()
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open, closeMenu])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const SWIPE_COLORS = ['#88ca53', null]

  return (
    <>
      {/* ── Header mobile fixe : logo gauche + theme toggle + bouton menu ── */}
      <header className={`sm-header${scrolled || open ? ' sm-header--scrolled' : ''}`}>
        <Link href="/" className="sm-header-logo" onClick={closeMenu}>
          <Logo size={22} showTag={false} animate={false} />
        </Link>
        <div className="sm-header-right">
          <button
            onClick={T.toggle}
            className="sm-header-theme"
            title={T.light ? 'Mode sombre' : 'Mode clair'}
            type="button"
            aria-label="Basculer le thème"
          >
            {T.light ? <Moon size={14} /> : <Sun size={14} />}
          </button>
          <button
            ref={toggleBtnRef}
            className="sm-toggle"
            aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={open}
            aria-controls="sm-panel"
            onClick={toggleMenu}
            type="button"
          >
            <span className="sm-toggle-textWrap" aria-hidden="true">
              <span ref={textInnerRef} className="sm-toggle-textInner">
                {textLines.map((l, i) => (
                  <span className="sm-toggle-line" key={i}>{l}</span>
                ))}
              </span>
            </span>
            <span ref={iconRef} className="sm-icon" aria-hidden="true">
              <span ref={plusHRef} className="sm-icon-line" />
              <span ref={plusVRef} className="sm-icon-line sm-icon-line--v" />
            </span>
          </button>
        </div>
      </header>

    <div className={'sm-root' + (open ? ' sm-root--open' : '')} style={{ '--sm-accent': '#88ca53' }}>
      <div ref={preLayersRef} className="sm-prelayers" aria-hidden="true">
        {SWIPE_COLORS.map((c, i) => (
          <div
            key={i}
            className={'sm-prelayer' + (c === null ? ' sm-prelayer--bg' : '')}
            style={c ? { background: c } : {}}
          />
        ))}
      </div>

      <aside id="sm-panel" ref={panelRef} className="sm-panel" aria-hidden={!open} aria-label="Navigation">
        <div className="sm-panel-inner">
          <div className="sm-panel-logo">
            <Logo size={26} showTag={false} animate={false} />
          </div>

          <ul className="sm-panel-list" role="list" data-numbering="true">
            {items.map((it, idx) => (
              <NavItemWithGhost
                key={it.href + idx}
                it={it}
                idx={idx}
                isActive={isActive ? isActive(it.href) : false}
                closeMenu={closeMenu}
              />
            ))}
          </ul>

          <div className="sm-panel-footer">
            <a
              href="https://wa.me/2250142507750"
              target="_blank"
              rel="noreferrer"
              className="sm-panel-cta"
              onClick={closeMenu}
            >
              Démarrer un projet
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="19" x2="19" y2="5" /><polyline points="9 5 19 5 19 15" /></svg>
            </a>
            <p className="sm-panel-footer-sub">Devis gratuit · Réponse en moins de 24h</p>
          </div>
        </div>
      </aside>
    </div>
    </>
  )
}
