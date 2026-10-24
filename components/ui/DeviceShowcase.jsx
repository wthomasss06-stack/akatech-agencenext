'use client'
// components/ui/DeviceShowcase.jsx
// Portable + téléphone (images fournies, fond retiré). Le média du projet joue
// dans les écrans :
//   • PC (≥ 1024 px)  : portable → vidéo .webm si dispo, sinon aperçu .webp ;
//                       téléphone → image `-responsive`
//   • Mobile          : téléphone seul, image `-responsive`, JAMAIS de vidéo
// Réglages de perspective : lib/device-mockups.js. Styles : DeviceShowcase.css.
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { LAPTOP, PHONE, DEVICE_FRAME } from '@/lib/device-mockups'
import { getProjectMedia } from '@/lib/project-media'
import './DeviceShowcase.css'

const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

/** true quand la fenêtre fait au moins 1024 px (même seuil que le reste du site). */
function useIsDesktop() {
  const [desktop, setDesktop] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const update = () => setDesktop(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])
  return desktop
}

/** Appareil : cadre + média déformé en perspective derrière l'écran. */
function Device({ kind, children }) {
  const cfg = kind === 'laptop' ? LAPTOP : PHONE
  const boxRef = useRef(null)
  const [scale, setScale] = useState(0)

  useIsoLayoutEffect(() => {
    const el = boxRef.current
    if (!el) return undefined
    const measure = () => setScale(el.clientWidth / DEVICE_FRAME.w)
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return (
    <div ref={boxRef} className={`dv-dev dv-dev--${kind}`}>
      <div
        className={`dv-stage${scale ? ' is-ready' : ''}`}
        style={{ transform: `scale(${scale || 0.0001})` }}
      >
        <div className="dv-clip" style={{ clipPath: cfg.clip }}>
          <div
            className="dv-content"
            style={{ width: cfg.content.w, height: cfg.content.h, transform: cfg.matrix }}
          >
            {children}
          </div>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="dv-frame"
          src={cfg.frame}
          width={DEVICE_FRAME.w}
          height={DEVICE_FRAME.h}
          alt=""
          aria-hidden="true"
          draggable={false}
          decoding="async"
        />
      </div>
    </div>
  )
}

/** Vidéo d'écran : ne joue que lorsqu'elle est visible ; repli sur l'image si elle échoue. */
function ScreenVideo({ src, poster, onFail }) {
  const ref = useRef(null)
  useEffect(() => {
    const v = ref.current
    if (!v) return undefined
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) v.play().catch(() => {})
        else v.pause()
      },
      { threshold: 0.15 }
    )
    io.observe(v)
    return () => io.disconnect()
  }, [src])
  return (
    <video
      ref={ref}
      className="dv-main"
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      autoPlay
      preload="auto"
      onError={onFail}
    />
  )
}

function LaptopScreen({ media, title, allowVideo }) {
  const [failed, setFailed] = useState(false)
  useEffect(() => setFailed(false), [media.video])
  const showVideo = allowVideo && media.video && !failed
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="dv-ambient" src={media.desktopImg} alt="" aria-hidden="true" decoding="async" />
      {showVideo ? (
        <ScreenVideo src={media.video} poster={media.desktopImg} onFail={() => setFailed(true)} />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img className="dv-main" src={media.desktopImg} alt={title} decoding="async" />
      )}
    </>
  )
}

function PhoneScreen({ media, title }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img className="dv-phone-img" src={media.mobileImg} alt={`${title} — mobile`} decoding="async" />
}

/** @param {{ project: object, className?: string }} props */
export default function DeviceShowcase({ project, className = '' }) {
  const desktop = useIsDesktop()
  const reduce = useReducedMotion()
  if (!project) return null
  const media = getProjectMedia(project)
  const fade = { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.55 } }

  return (
    <div className={`dv ${className}`.trim()}>
      <div className="dv-slot dv-slot--laptop">
        <Device kind="laptop">
          <AnimatePresence initial={false}>
            <motion.div key={project.id} className="dv-fade" {...fade}>
              <LaptopScreen media={media} title={project.title} allowVideo={desktop && !reduce} />
            </motion.div>
          </AnimatePresence>
        </Device>
      </div>

      <div className="dv-slot dv-slot--phone">
        <Device kind="phone">
          <AnimatePresence initial={false}>
            <motion.div key={project.id} className="dv-fade" {...fade}>
              <PhoneScreen media={media} title={project.title} />
            </motion.div>
          </AnimatePresence>
        </Device>
      </div>
    </div>
  )
}
