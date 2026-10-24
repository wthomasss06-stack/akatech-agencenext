'use client'
// components/ui/SpotlightMarquee.jsx
// Bandeau d'images qui défile de droite à gauche, suit le pointeur (souris ou
// doigt) dans le hero, et fait remonter / onduler les éléments `[data-wake]`
// qu'il croise (effet « sillage »). Adapté de de_malade.html (GSAP).
//
// Usage : <SpotlightMarquee images={[...]} /> comme PREMIER enfant d'un
// conteneur `position: relative` (le hero) ; marquer les textes à pousser avec
// `data-wake` sur un simple <div>/<span> d'enveloppe (jamais sur un élément
// déjà animé par framer-motion : le sillage écrit son propre transform).
import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import './SpotlightMarquee.css'

const CFG = {
  speed: 90,           // px / seconde (défilement horizontal)
  followEase: 0.06,    // inertie du bandeau derrière le pointeur
  contentRise: 0.85,   // taux de remontée du contenu quand le bandeau descend
  risenTopGap: 100,    // marge à garder en haut quand le contenu a remonté
  liftHeadStart: 125,  // le contenu se soulève un peu avant que le bandeau l'atteigne
  wakeStrength: 2.5,
  wakeReach: 125,
  settleEase: 0.09,
}

export default function SpotlightMarquee({ images = [], mobileImages, restCenter, zIndex }) {
  const rootRef = useRef(null)
  const trackRef = useRef(null)
  const [mobile, setMobile] = useState(false)
  const [sets, setSets] = useState(2)

  const list = (mobile && mobileImages?.length ? mobileImages : images).filter(Boolean)
  // Les tableaux arrivent recréés à chaque rendu du parent : on se repose sur leur contenu.
  const listKey = list.join('|')

  // Largeur d'un jeu d'images → nombre de répétitions nécessaires
  useEffect(() => {
    const compute = () => {
      const isMobile = window.innerWidth < 1024
      setMobile(isMobile)
      const tile = isMobile ? 84 : 210
      const gap = isMobile ? 10 : 14
      const one = Math.max(1, list.length) * (tile + gap)
      setSets(Math.ceil(window.innerWidth / one) + 2)
    }
    compute()
    window.addEventListener('resize', compute)
    return () => window.removeEventListener('resize', compute)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [list.length])

  useEffect(() => {
    const strip = rootRef.current
    const track = trackRef.current
    const hero = strip?.parentElement
    if (!strip || !track || !hero || list.length === 0) return undefined

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const tileW = mobile ? 84 : 210
    const gap = mobile ? 10 : 14
    const oneSet = list.length * (tileW + gap)

    // 1) Défilement continu droite → gauche
    let tween = null
    if (!reduce) {
      gsap.set(track, { x: 0 })
      tween = gsap.to(track, {
        x: -oneSet,
        duration: oneSet / CFG.speed,
        ease: 'none',
        repeat: -1,
      })
    }

    // 2) Sillage : on ne l'active que si des cibles existent et pas de reduce-motion
    let targets = []
    let stripH = strip.offsetHeight
    let restCenterY = restCenter ?? (mobile ? 96 : 110)
    let contentTop = 0
    let targetY = 0
    let curY = 0
    let prevY = 0
    let pointerSeen = false
    let visible = true

    const restY = () => restCenterY - stripH / 2

    const measure = () => {
      stripH = strip.offsetHeight
      const heroTop = hero.getBoundingClientRect().top
      const els = Array.from(hero.querySelectorAll('[data-wake]'))
      let top = Infinity
      targets = els.map((el) => {
        const prev = targets.find((t) => t.el === el)
        const offset = prev ? prev.cur : 0 // on retire le décalage en cours pour retrouver la position de repos
        const r = el.getBoundingClientRect()
        const rest = r.top - heroTop - offset
        top = Math.min(top, rest)
        return { el, restCenter: rest + r.height / 2, cur: prev ? prev.cur : 0 }
      })
      contentTop = Number.isFinite(top) ? top : 0
      if (!pointerSeen) {
        targetY = curY = prevY = restY()
        gsap.set(strip, { y: curY })
      }
    }

    measure()
    const t1 = setTimeout(measure, 250)
    const t2 = setTimeout(measure, 1200) // après chargement des polices / animations d'entrée
    const ro = new ResizeObserver(measure)
    ro.observe(hero)

    const setPointer = (clientY) => {
      pointerSeen = true
      const rect = hero.getBoundingClientRect()
      targetY = clientY - rect.top - stripH / 2
    }
    const onMove = (e) => setPointer(e.clientY)
    const onTouch = (e) => e.touches[0] && setPointer(e.touches[0].clientY)
    const onLeave = () => {
      pointerSeen = false
      targetY = restY()
    }
    if (!reduce) {
      hero.addEventListener('pointermove', onMove, { passive: true })
      hero.addEventListener('pointerleave', onLeave, { passive: true })
      hero.addEventListener('touchmove', onTouch, { passive: true })
      hero.addEventListener('touchend', onLeave, { passive: true })
    }

    const io = new IntersectionObserver(([en]) => {
      visible = en.isIntersecting
      if (tween) (visible ? tween.play() : tween.pause())
    })
    io.observe(hero)

    const tick = () => {
      if (!visible || reduce) return
      curY += (targetY - curY) * CFG.followEase
      gsap.set(strip, { y: curY })

      const stripCenter = curY + stripH / 2
      const velocity = curY - prevY
      prevY = curY

      const below = Math.max(0, stripCenter - restCenterY)
      const maxRise = Math.max(0, contentTop - CFG.risenTopGap)
      const rise = -Math.min(below * CFG.contentRise, maxRise)

      for (const t of targets) {
        const gapToStrip = t.restCenter - stripCenter
        const reached = stripCenter + CFG.liftHeadStart >= t.restCenter
        const influence = Math.exp(-(gapToStrip * gapToStrip) / (2 * CFG.wakeReach * CFG.wakeReach))
        const wake = velocity * influence * CFG.wakeStrength
        const goal = (reached ? rise : 0) + wake
        t.cur += (goal - t.cur) * CFG.settleEase
        gsap.set(t.el, { y: t.cur })
      }
    }
    if (!reduce) gsap.ticker.add(tick)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      ro.disconnect()
      io.disconnect()
      hero.removeEventListener('pointermove', onMove)
      hero.removeEventListener('pointerleave', onLeave)
      hero.removeEventListener('touchmove', onTouch)
      hero.removeEventListener('touchend', onLeave)
      gsap.ticker.remove(tick)
      tween?.kill()
      targets.forEach((t) => gsap.set(t.el, { clearProps: 'transform' }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listKey, mobile, sets, restCenter])

  if (list.length === 0) return null
  const tiles = []
  for (let s = 0; s < sets; s++) {
    list.forEach((src, i) => tiles.push({ key: `${s}-${i}`, src }))
  }

  return (
    <div ref={rootRef} className="sm-strip" aria-hidden="true" style={zIndex != null ? { zIndex } : undefined}>
      <div ref={trackRef} className="sm-track">
        {tiles.map((t) => (
          <div className="sm-tile" key={t.key}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={t.src} alt="" loading="lazy" decoding="async" draggable={false} />
          </div>
        ))}
      </div>
    </div>
  )
}
