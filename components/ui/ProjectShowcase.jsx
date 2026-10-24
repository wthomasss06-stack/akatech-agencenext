'use client'
// components/ui/ProjectShowcase.jsx
// Vitrine « portable + téléphone » d'une liste de projets : le média du projet
// joue dans les écrans (DeviceShowcase), fiche + navigation à côté (PC) ou
// dessous (mobile, glisser à gauche / droite). Défilement auto en pause au
// survol / au toucher.
import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react'
import TransitionLink from '@/components/layout/TransitionLink'
import DeviceShowcase from '@/components/ui/DeviceShowcase'
import { HoverSlideText } from '@/components/ui/index'
import { useTheme } from '@/lib/theme'
import { useLanguage } from '@/lib/language'
import { trackAction } from '@/lib/track-action'
import './ProjectShowcase.css'

export default function ProjectShowcase({ items, autoMs = 9000, startId }) {
  const T = useTheme()
  const { t } = useLanguage()
  const reduce = useReducedMotion()
  const startIndex = Math.max(0, items.findIndex((p) => p.id === startId))
  const [index, setIndex] = useState(startIndex)
  const [paused, setPaused] = useState(false)
  const touchX = useRef(null)
  const project = items[index] || items[0]
  const go = useCallback((dir) => setIndex((i) => (i + dir + items.length) % items.length), [items.length])

  useEffect(() => {
    if (paused || reduce || items.length < 2) return undefined
    const id = window.setTimeout(() => go(1), autoMs)
    return () => window.clearTimeout(id)
  }, [index, paused, reduce, items.length, autoMs, go])

  if (!project) return null

  const onTouchStart = (e) => { setPaused(true); touchX.current = e.touches[0].clientX }
  const onTouchEnd = (e) => {
    setPaused(false)
    if (touchX.current == null) return
    const dx = e.changedTouches[0].clientX - touchX.current
    touchX.current = null
    if (Math.abs(dx) > 42) go(dx < 0 ? 1 : -1)
  }
  const arrow = { border: `1px solid ${T.border}`, background: T.card, color: T.textMain }

  return (
    <div
      className="ps-grid"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} style={{ touchAction: 'pan-y' }}>
        <DeviceShowcase project={project} />
      </div>

      <div className="ps-info">
        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.75rem', letterSpacing: '.22em', color: '#88ca53' }}>
          {String(index + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35 }}
          >
            <h3 className="ps-title" style={{ color: T.textMain }}>{project.title}</h3>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.72rem', color: '#88ca53', textTransform: 'uppercase', letterSpacing: '.1em' }}>
              {project.category?.label || project.type}
            </div>
            {project.story?.pitch && (
              <p className="ps-pitch" style={{ color: T.textSub }}>{project.story.pitch}</p>
            )}
            <TransitionLink
              href={`/projects/${project.slug}`}
              className="btn-raised"
              aria-label={`${t('detailAria')} ${project.title}`}
              onClick={() => trackAction('cta_click')}
            >
              <HoverSlideText text={t('detail')} />
              <ArrowUpRight size={16} />
            </TransitionLink>
          </motion.div>
        </AnimatePresence>

        <div className="ps-controls">
          <button type="button" className="ps-arrow" style={arrow} onClick={() => go(-1)} aria-label="Précédent"><ChevronLeft size={18} /></button>
          <button type="button" className="ps-arrow" style={arrow} onClick={() => go(1)} aria-label="Suivant"><ChevronRight size={18} /></button>
        </div>

        <ol className="ps-pills">
          {items.map((p, i) => (
            <li key={p.id}>
              <button
                type="button"
                className="ps-pill"
                aria-current={i === index}
                onClick={() => setIndex(i)}
                style={{
                  border: `1px solid ${i === index ? '#88ca53' : T.border}`,
                  background: i === index ? 'rgba(136,202,83,.12)' : 'transparent',
                  color: i === index ? '#88ca53' : T.textMuted,
                }}
              >
                {p.title}
              </button>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
