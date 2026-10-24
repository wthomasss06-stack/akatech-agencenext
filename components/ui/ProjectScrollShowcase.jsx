'use client'
// components/ui/ProjectScrollShowcase.jsx
// Vitrine « portable + téléphone » avec DÉFILEMENT PARALLAXE HORIZONTAL :
//   • la section fait (nb de projets × 100vh) de haut ; un bloc sticky de 100vh
//     reste à l'écran pendant que le défilement vertical fait glisser les
//     projets de droite à gauche (même mécanique que l'ancien « une par une »)
//   • parallaxe : l'appareil file un peu plus vite que le texte
//   • le média (DeviceShowcase) n'est monté que pour le projet affiché et ses
//     voisins → pas 20+ vidéos en même temps
//   • flèches aux deux extrémités de la page = défilent jusqu'au projet précédent / suivant
// PC uniquement (≥ 1024 px) : le mobile garde ProjectShowcase (glisser au doigt).
import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react'
import TransitionLink from '@/components/layout/TransitionLink'
import DeviceShowcase from '@/components/ui/DeviceShowcase'
import { HoverSlideText } from '@/components/ui/index'
import { useTheme } from '@/lib/theme'
import { useLanguage } from '@/lib/language'
import { trackAction } from '@/lib/track-action'
import { getLenis } from '@/lib/lenis-instance'
import './ProjectShowcase.css' // .ps-title, .ps-pitch, .ps-controls, .ps-arrow
import './ProjectScrollShowcase.css'

const DEVICE_PARALLAX = 9  // vw d'avance de l'appareil par rapport à la piste
const INFO_PARALLAX = -3   // vw de retard du texte

export default function ProjectScrollShowcase({ items }) {
  const T = useTheme()
  const { t } = useLanguage()
  const total = items.length
  const sectionRef = useRef(null)
  const trackRef = useRef(null)
  const fillRef = useRef(null)
  const deviceRefs = useRef([])
  const infoRefs = useRef([])
  const activeRef = useRef(0)
  const [active, setActive] = useState(0)

  useEffect(() => {
    const section = sectionRef.current
    const track = trackRef.current
    if (!section || !track || total < 1) return undefined
    let raf = 0

    const update = () => {
      raf = 0
      const rect = section.getBoundingClientRect()
      const range = section.offsetHeight - window.innerHeight
      const progress = range > 0 ? Math.max(0, Math.min(1, -rect.top / range)) : 0
      const pos = progress * (total - 1) // position fractionnaire, en « projets »

      track.style.transform = `translate3d(${-pos * 100}vw,0,0)`
      if (fillRef.current) fillRef.current.style.width = `${progress * 100}%`

      for (let i = 0; i < total; i++) {
        const d = i - pos
        if (Math.abs(d) > 1.5) continue // hors champ : rien à mettre à jour
        const dev = deviceRefs.current[i]
        const inf = infoRefs.current[i]
        if (dev) dev.style.transform = `translate3d(${d * DEVICE_PARALLAX}vw,0,0)`
        if (inf) inf.style.transform = `translate3d(${d * INFO_PARALLAX}vw,0,0)`
      }

      const idx = Math.round(pos)
      if (idx !== activeRef.current) {
        activeRef.current = idx
        setActive(idx)
      }
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    update()
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [total])

  // Flèches : défile jusqu'au projet voulu (Lenis s'il est actif, sinon défilement natif fluide)
  const goTo = useCallback((idx) => {
    const section = sectionRef.current
    if (!section || total < 2) return
    const clamped = Math.max(0, Math.min(total - 1, idx))
    const range = section.offsetHeight - window.innerHeight
    const top = section.getBoundingClientRect().top + window.scrollY
    const y = top + (clamped / (total - 1)) * range
    const lenis = getLenis()
    if (lenis) lenis.scrollTo(y, { duration: 1 })
    else window.scrollTo({ top: y, behavior: 'smooth' })
  }, [total])

  if (!total) return null
  const arrow = { border: `1px solid ${T.border}`, background: T.card, color: T.textMain }

  return (
    <section ref={sectionRef} className="pss-section" style={{ height: `${total * 100}vh`, background: T.bg }}>
      <div className="pss-sticky">
        <ul ref={trackRef} className="pss-track">
          {items.map((project, i) => {
            const isActive = i === active
            return (
              <li key={project.id} className="pss-slide" aria-hidden={!isActive}>
                <div className="pss-grid">
                  <div ref={(el) => { deviceRefs.current[i] = el }} className="pss-device">
                    {Math.abs(i - active) <= 1 && <DeviceShowcase project={project} />}
                  </div>

                  <div ref={(el) => { infoRefs.current[i] = el }} className="pss-info">
                    <div className="pss-count">
                      {String(i + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
                    </div>
                    <h3 className="ps-title" style={{ color: T.textMain }}>{project.title}</h3>
                    <div className="pss-cat">{project.category?.label || project.type}</div>
                    {(project.story?.pitch || project.desc) && (
                      <p className="ps-pitch" style={{ color: T.textSub }}>{project.story?.pitch || project.desc}</p>
                    )}
                    <TransitionLink
                      href={`/projects/${project.slug}`}
                      className="btn-raised"
                      tabIndex={isActive ? 0 : -1}
                      aria-label={`${t('detailAria')} ${project.title}`}
                      onClick={() => trackAction('cta_click')}
                    >
                      <HoverSlideText text={t('detail')} />
                      <ArrowUpRight size={16} />
                    </TransitionLink>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>

        <button type="button" className="ps-arrow pss-nav pss-nav--prev"
          style={{ ...arrow, opacity: active === 0 ? 0.35 : 1 }}
          disabled={active === 0} onClick={() => goTo(active - 1)} aria-label={t('projectPrevAria')}>
          <ChevronLeft size={22} />
        </button>
        <button type="button" className="ps-arrow pss-nav pss-nav--next"
          style={{ ...arrow, opacity: active === total - 1 ? 0.35 : 1 }}
          disabled={active === total - 1} onClick={() => goTo(active + 1)} aria-label={t('projectNextAria')}>
          <ChevronRight size={22} />
        </button>

        <p className="pss-hint">// {t('projectsScrollHint')}</p>
        <div className="pss-progress" aria-hidden="true">
          <div ref={fillRef} className="pss-progress-fill" />
        </div>
      </div>
    </section>
  )
}
