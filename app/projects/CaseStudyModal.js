// app/projects/CaseStudyModal.js
// Étude de cas (Problème → Solution → Résultat) affichée en overlay
// plutôt qu'ajoutée directement dans .fc-info : les slides de
// /projects sont en `height: 100vh; overflow: hidden` (mécanique de
// scroll horizontal), donc du texte ajouté à même la colonne peut être
// tronqué sans qu'on le voie. Un overlay avec son propre
// `overflow-y: auto` évite ce risque quelle que soit la hauteur de
// l'écran, et fonctionne à l'identique en desktop et mobile.
'use client'
import { X } from 'lucide-react'

export default function CaseStudyModal({ project, onClose }) {
  if (!project) return null
  const rows = [
    ['Problème', project.problem],
    ['Solution', project.solution],
    ['Résultat', project.impact],
  ].filter(([, text]) => !!text)

  return (
    <div
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Étude de cas — ${project.title}`}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(4,10,6,.88)', backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6vw 5vw',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#0c1710', border: '1px solid rgba(136,202,83,.3)', borderRadius: 18,
          maxWidth: 620, width: '100%', maxHeight: '82vh', overflowY: 'auto',
          padding: '2.2rem 2rem', position: 'relative', boxShadow: '0 40px 100px rgba(0,0,0,.5)',
        }}
      >
        <button
          onClick={onClose}
          aria-label="Fermer"
          style={{
            position: 'absolute', top: 16, right: 16, background: 'rgba(255,255,255,.06)',
            border: '1px solid rgba(255,255,255,.1)', borderRadius: '50%', width: 34, height: 34,
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#cfe4d6', cursor: 'pointer',
          }}
        >
          <X size={16} />
        </button>

        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.72rem', letterSpacing: '.1em', textTransform: 'uppercase', color: '#88ca53', marginBottom: 8 }}>
          Étude de cas
        </div>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', margin: '0 0 1.6rem', lineHeight: 1.2 }}>
          {project.title}
        </h3>

        {rows.map(([label, text]) => (
          <div key={label} style={{ marginBottom: '1.4rem' }}>
            <div style={{ fontSize: '.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: 'rgba(255,255,255,.4)', marginBottom: '.4rem' }}>
              {label}
            </div>
            <p style={{ fontSize: '.95rem', lineHeight: 1.7, color: 'rgba(255,255,255,.85)', margin: 0 }}>
              {text}
            </p>
          </div>
        ))}

        {project.url ? (
          <a href={project.url} target="_blank" rel="noreferrer" className="btn-ghost btn-sm" style={{ marginTop: '.4rem' }}>
            Voir le projet en ligne
          </a>
        ) : null}
      </div>
    </div>
  )
}
