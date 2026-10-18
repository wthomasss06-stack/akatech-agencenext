// app/projects/CaseStudyModal.js
// Fiche « En savoir plus » d'une réalisation, ouverte depuis /projects
// (desktop ET mobile). Écrite pour un futur client, pas pour un développeur :
// aucune technologie affichée — le problème de départ, la solution, les
// fonctions phares, où en est le projet, puis un appel à l'action toujours
// visible (WhatsApp pré-rempli + devis gratuit).
//
// Les textes viennent de project.story (lib/project-stories.js). Style
// autonome dans CaseStudyModal.css (préfixe .cs-), sans toucher au CSS partagé
// avec l'Explorer.
'use client'
import { useEffect, useRef } from 'react'
import { X, Check, ArrowUpRight, MessageCircle } from 'lucide-react'
import { HoverSlideText } from '@/components/ui/index'
import TransitionLink from '@/components/layout/TransitionLink'
import { useLanguage } from '@/lib/language'
import { trackAction } from '@/lib/track-action'
import { hasRealUrl, projectWhatsAppUrl } from '@/lib/project-stories'
import './CaseStudyModal.css'

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'

export default function CaseStudyModal({ project, onClose }) {
  const { t } = useLanguage()
  const modalRef = useRef(null)
  const closeRef = useRef(null)

  useEffect(() => {
    if (!project) return undefined
    const previouslyFocused = document.activeElement
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()

    const onKey = (e) => {
      if (e.key === 'Escape') { onClose(); return }
      // Piège à focus : Tab reste dans la fenêtre tant qu'elle est ouverte.
      if (e.key === 'Tab' && modalRef.current) {
        const items = [...modalRef.current.querySelectorAll(FOCUSABLE)]
        if (!items.length) return
        const first = items[0]
        const last = items[items.length - 1]
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = previousOverflow
      previouslyFocused?.focus?.()
    }
  }, [project, onClose])

  if (!project) return null

  const story = project.story
  const online = hasRealUrl(project)
  const inProgress = project.progress != null && project.progress < 100
  // Même logique que la carte : « En ligne » dès que le site est réellement en ligne.
  const statusLabel = online
    ? t('online')
    : (inProgress ? `${t('project_progress')} · ${project.progress}%` : t('delivered'))

  return (
    <div className="cs-backdrop" onClick={onClose}>
      <div
        ref={modalRef}
        className="cs-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cs-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button ref={closeRef} type="button" className="cs-close" onClick={onClose} aria-label={t('close')}>
          <X size={16} />
        </button>

        <div className="cs-image">
          <img src={project.img} alt={`Aperçu du site ${project.title}`} />
          <div className="cs-image-fade" />
        </div>

        <div className="cs-info">
          <div className="cs-scroll">
            <div className="cs-head">
              <span className="cs-eyebrow">{project.type}</span>
              <span className="cs-status">
                <i className={`cs-dot${online ? ' is-live' : ''}`} />
                {statusLabel} · {project.year}
              </span>
            </div>
            <h2 id="cs-title" className="cs-name">{project.title}</h2>
            <p className="cs-pitch">{story?.pitch || project.desc}</p>

            {story && (
              <>
                <section className="cs-block cs-block--problem">
                  <h3 className="cs-label">{t('caseProblem')}</h3>
                  <p className="cs-text">{story.problem}</p>
                </section>

                <section className="cs-block cs-block--solution">
                  <h3 className="cs-label">{t('caseSolution')}</h3>
                  <p className="cs-text">{story.solution}</p>
                </section>

                {story.features?.length > 0 && (
                  <section className="cs-block">
                    <h3 className="cs-label">{t('caseFeatures')}</h3>
                    <ul className="cs-features">
                      {story.features.map((f) => (
                        <li key={f}><Check size={15} aria-hidden="true" /><span>{f}</span></li>
                      ))}
                    </ul>
                  </section>
                )}

                {story.outcome && (
                  <section className="cs-block">
                    <h3 className="cs-label">{t('caseResult')}</h3>
                    <p className="cs-text">{story.outcome}</p>
                  </section>
                )}
              </>
            )}
          </div>

          {/* Appel à l'action — hors de la zone qui défile : toujours visible */}
          <div className="cs-footer">
            <p className="cs-footer-title">
              {story?.audience ? `${t('caseCtaTitle')} Idéal pour ${story.audience}.` : t('caseCtaTitle')}
            </p>
            <div className="cs-actions">
              <a
                href={projectWhatsAppUrl(project)}
                target="_blank"
                rel="noreferrer"
                className="btn-raised btn-sm"
                onClick={() => trackAction('whatsapp_click')}
              >
                <MessageCircle size={15} /> <HoverSlideText text={t('caseCtaWhatsApp')} />
              </a>
              <TransitionLink href="/devis" className="btn-ghost btn-sm" onClick={() => trackAction('cta_click')}>
                <HoverSlideText text={t('caseCtaQuote')} />
              </TransitionLink>
            </div>
            <div className="cs-footer-row">
              <span className="cs-note">{t('uiFreeQuote24')}</span>
              {online && (
                <a href={project.url} target="_blank" rel="noreferrer" className="cs-site-link">
                  {t('caseSeeSite')} <ArrowUpRight size={13} />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
