'use client'
/**
 * ProjectGlobeModal — fiche projet ouverte depuis un nœud du globe.
 * Structure reprise du modal du tunnel projet (tunnel-modal /
 * elvis-portfolio) : image fixe à gauche, détails scrollables à
 * droite. Contenu 100% issu de lib/data.js (PROJECTS), sans
 * inventer de champs qui n'existent pas côté données.
 */
import { useEffect } from 'react'
import { X, ArrowUpRight } from 'lucide-react'
import './ProjectGlobeModal.css'

function statusInfo(p) {
  if (p.live && p.url) return { label: 'En ligne', offline: false }
  if (p.progress != null && p.progress < 100) return { label: `En cours · ${p.progress}%`, offline: true }
  return { label: 'Hors ligne', offline: true }
}

export default function ProjectGlobeModal({ project, onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  if (!project) return null
  const status = statusInfo(project)

  return (
    <div className="pgm-backdrop" onClick={onClose}>
      <div className="pgm-modal" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="pgm-close" onClick={onClose} aria-label="Fermer">
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
              <span>Année</span>
              <span>{project.year}</span>
            </div>
            <div className="pgm-meta-item">
              <span>Marché</span>
              <span>Côte d'Ivoire</span>
            </div>
            <div className="pgm-meta-item">
              <span>Statut</span>
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

          {Array.isArray(project.tech) && project.tech.length > 0 && (
            <div className="pgm-tags">
              {project.tech.map((t, i) => <span className="pgm-tag" key={i}>{t}</span>)}
            </div>
          )}

          <div className="pgm-actions">
            {project.live && project.url ? (
              <a href={project.url} target="_blank" rel="noreferrer" className="pgm-cta">
                Voir le site <ArrowUpRight size={15} />
              </a>
            ) : (
              <span className="pgm-cta-muted">
                {project.progress != null && project.progress < 100 ? `En cours — ${project.progress}%` : 'Hors ligne'}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
