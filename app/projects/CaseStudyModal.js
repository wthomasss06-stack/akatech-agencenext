// app/projects/CaseStudyModal.js
// Fiche détail d'un projet, ouverte depuis /projects (bouton unique
// "Détail du projet"). Réutilise volontairement le même gabarit et la
// même feuille de style que components/explorer/ProjectModal.jsx
// (import de ProjectModal.css, classes .pgm-*) pour que la modale
// Réalisations soit visuellement identique à celle d'Explorer — seule
// différence : les sections Problème / Solution / Résultat, propres à
// l'étude de cas, ajoutées via les classes .pgm-case-* (mêmes fichier
// CSS, règles ajoutées à la suite).
'use client'
import { useEffect } from 'react'
import { X, ArrowUpRight } from 'lucide-react'
import { HoverSlideText } from '@/components/ui/index'
import { useLanguage } from '@/lib/language'
import '@/components/explorer/ProjectModal.css'

function statusInfo(p, t) {
  if (p.live && p.url) return { label: t('online'), offline: false }
  if (p.progress != null && p.progress < 100) return { label: `${t('project_progress')} · ${p.progress}%`, offline: true }
  return { label: t('offline'), offline: true }
}

export default function CaseStudyModal({ project, onClose }) {
  const { t } = useLanguage()
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  if (!project) return null
  const status = statusInfo(project, t)

  return (
    <div className="pgm-backdrop" onClick={onClose}>
      <div className="pgm-modal" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="pgm-close" onClick={onClose} aria-label={t('close')}>
          <X size={16} />
        </button>

        <div className="pgm-image">
          <img src={project.img} alt={project.title} />
          <div className="pgm-image-fade" />
        </div>

        <div className="pgm-info">
          <span className="pgm-eyebrow">{project.type}</span>
          <h2 className="pgm-name">{project.title}</h2>
          {project.subtitle && <p className="pgm-sub">{project.subtitle}</p>}

          <div className="pgm-meta">
            <div className="pgm-meta-item">
              <span>{t('project_year')}</span>
              <span>{project.year}</span>
            </div>
            <div className="pgm-meta-item">
              <span>{t('project_market')}</span>
              <span>{t('project_country')}</span>
            </div>
            <div className="pgm-meta-item">
              <span>{t('status')}</span>
              <span>
                <em style={{
                  width: 6, height: 6, borderRadius: '50%', fontStyle: 'normal',
                  background: status.offline ? 'rgba(255,255,255,.35)' : '#88ca53',
                  boxShadow: status.offline ? 'none' : '0 0 6px 1px rgba(136,202,83,.7)',
                  display: 'inline-block',
                }} />
                {status.label}
              </span>
            </div>
          </div>

          {project.result && (
            <span className="pgm-result">↑ {project.result}</span>
          )}

          {project.desc && <p className="pgm-desc">{project.desc}</p>}

          {project.problem && (
            <div className="pgm-case-block">
              <span className="pgm-case-label">{t('caseProblem')}</span>
              <p className="pgm-case-text">{project.problem}</p>
            </div>
          )}
          {project.solution && (
            <div className="pgm-case-block">
              <span className="pgm-case-label">{t('caseSolution')}</span>
              <p className="pgm-case-text">{project.solution}</p>
            </div>
          )}
          {project.impact && (
            <div className="pgm-case-block">
              <span className="pgm-case-label">{t('caseResult')}</span>
              <p className="pgm-case-text">{project.impact}</p>
            </div>
          )}

          {Array.isArray(project.tech) && project.tech.length > 0 && (
            <div className="pgm-tags">
              {project.tech.map((t, i) => <span className="pgm-tag" key={i}>{t}</span>)}
            </div>
          )}

          <div className="pgm-actions">
            {project.live && project.url ? (
              <a href={project.url} target="_blank" rel="noreferrer" className="btn-raised">
                <HoverSlideText text={t('project_view')} /> <ArrowUpRight size={15} />
              </a>
            ) : (
              <span className="pgm-cta-muted">
                {project.progress != null && project.progress < 100 ? `${t('project_progress')} — ${project.progress}%` : t('project_demo')}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
