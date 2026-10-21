'use client'
/**
 * ProjectModal — fiche projet ouverte depuis une carte du tunnel Explorer.
 *
 * Modal PLEIN : la capture du projet occupe tout le modal, avec dessus
 * l'essentiel — rubrique, nom, statut, technologies — et un seul bouton
 * « Détail » qui mène à la page du projet (/projects/<slug>). Le panneau
 * de détails à droite n'existe plus : tout le détail est sur la page slug.
 *
 * Contenu 100% issu de lib/data.js (PROJECTS) : slug, category, tech…
 * Classes en `pjm-` (le modal du globe, inutilisé, garde ses `pgm-`).
 */
import { useEffect } from 'react'
import { X, ArrowUpRight } from 'lucide-react'
import TransitionLink from '@/components/layout/TransitionLink'
import { HoverSlideText } from '@/components/ui/index'
import { useLanguage } from '@/lib/language'
import { trackAction } from '@/lib/track-action'
import './ProjectModal.css'

function statusInfo(p, t) {
  if (p.live && p.url) return { label: t('online'), offline: false }
  if (p.progress != null && p.progress < 100) return { label: `${t('inProgressLabel')} · ${p.progress}%`, offline: true }
  return { label: t('offline'), offline: true }
}

export default function ProjectModal({ project, onClose }) {
  const { t } = useLanguage()

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  // Le focus clavier arrive sur le bouton principal à l'ouverture
  useEffect(() => { document.getElementById('pjm-detail')?.focus({ preventScroll: true }) }, [project])

  if (!project) return null
  const status = statusInfo(project, t)
  const tech = Array.isArray(project.tech) ? project.tech : []

  return (
    <div className="pjm-backdrop" onClick={onClose}>
      <div
        className="pjm-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="pjm-title"
        onClick={(e) => e.stopPropagation()}
      >
        <img className="pjm-bg" src={project.img} alt="" />
        <div className="pjm-shade" aria-hidden="true" />

        <button type="button" className="pjm-close" onClick={onClose} aria-label={t('close')}>
          <X size={18} />
        </button>

        <div className="pjm-content">
          <div className="pjm-top">
            {project.category && <span className="pjm-sticker">{project.category.label}</span>}
            <span className="pjm-status">
              <i className={`pjm-dot${status.offline ? '' : ' is-live'}`} aria-hidden="true" />
              {status.label} · {project.year}
            </span>
          </div>

          <h2 id="pjm-title" className="pjm-title">{project.title}</h2>
          {project.subtitle && <p className="pjm-sub">{project.subtitle}</p>}

          {tech.length > 0 && (
            <div className="pjm-tech">
              <span className="pjm-tech-label">{t('techUsed')}</span>
              <ul className="pjm-chips">
                {tech.map((name) => <li key={name} className="pjm-chip">{name}</li>)}
              </ul>
            </div>
          )}

          <div className="pjm-actions">
            <TransitionLink
              id="pjm-detail"
              href={`/projects/${project.slug}`}
              className="btn-raised"
              aria-label={`${t('detailAria')} ${project.title}`}
              onClick={() => { trackAction('cta_click'); onClose() }}
            >
              <HoverSlideText text={t('detail')} /> <ArrowUpRight size={16} />
            </TransitionLink>
          </div>
        </div>
      </div>
    </div>
  )
}
