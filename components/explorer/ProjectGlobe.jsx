'use client'
/**
 * ProjectGlobe — mode Explorer AKATech
 * ─────────────────────────────────────────────────────────
 * Port du globe DOM 3D immersif (état "FIBONACCI GLOBE" de la
 * démo gemini-code-...999.html) : chaque PROJECTS[i] devient un
 * nœud positionné sur une sphère via la distribution de Fibonacci,
 * en pur CSS 3D (translate3d + rotateX/rotateY sur variables CSS).
 *
 * Interactions :
 *  - Rotation automatique lente en continu
 *  - Glisser (pointer drag) pour tourner manuellement — l'auto-
 *    rotation reprend dès le relâchement
 *  - Survol d'un nœud → grayscale→couleur, glow, titre
 *  - Clic (sans glisser) → ouvre ProjectGlobeModal
 * ─────────────────────────────────────────────────────────
 */
import { useEffect, useRef, useState, useMemo } from 'react'
import { ArrowLeft } from 'lucide-react'
import { PROJECTS } from '@/lib/data'
import { useBlobTransition } from '@/components/layout/BlobTransition'
import ProjectGlobeModal from './ProjectGlobeModal'
import './ProjectGlobe.css'

const NODE_W = 132
const NODE_H = 178
const AUTO_SPEED = 0.045 // deg / frame

function useFibonacciLayout(count, radius) {
  return useMemo(() => {
    const nodes = []
    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2
      const radiusAtY = Math.sqrt(Math.max(0, 1 - y * y))
      const theta = 2.399963 * i
      const x = Math.cos(theta) * radiusAtY * radius
      const z = Math.sin(theta) * radiusAtY * radius
      const posY = y * radius
      const ry = Math.atan2(x, z) * (180 / Math.PI)
      const rx = Math.asin(-y) * (180 / Math.PI)
      nodes.push({ x, y: posY, z, rx, ry })
    }
    return nodes
  }, [count, radius])
}

export default function ProjectGlobe() {
  const blobNavigate = useBlobTransition()
  const sceneRef = useRef(null)
  const worldRef = useRef(null)
  const rotationRef = useRef(-8)
  const draggingRef = useRef(false)
  const dragDistRef = useRef(0)
  const lastXRef = useRef(0)
  const pausedRef = useRef(false)
  const [isDragging, setIsDragging] = useState(false)
  const [radius, setRadius] = useState(340)
  const [selected, setSelected] = useState(null)

  const positions = useFibonacciLayout(PROJECTS.length, radius)

  // Rayon un peu adapté à la fenêtre (desktop uniquement)
  useEffect(() => {
    const compute = () => {
      const base = Math.min(window.innerWidth, window.innerHeight)
      setRadius(Math.max(260, Math.min(380, base * 0.32)))
    }
    compute()
    window.addEventListener('resize', compute)
    return () => window.removeEventListener('resize', compute)
  }, [])

  // Verrouille le scroll de la page pendant l'exploration
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [])

  // Rotation continue (rAF)
  useEffect(() => {
    let raf
    const tick = () => {
      if (!draggingRef.current && !pausedRef.current) {
        rotationRef.current += AUTO_SPEED
      }
      if (worldRef.current) {
        worldRef.current.style.transform = `rotateY(${rotationRef.current}deg)`
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  useEffect(() => { pausedRef.current = !!selected }, [selected])

  const onPointerDown = (e) => {
    draggingRef.current = true
    dragDistRef.current = 0
    lastXRef.current = e.clientX
    setIsDragging(true)
    e.currentTarget.setPointerCapture?.(e.pointerId)
  }
  const onPointerMove = (e) => {
    if (!draggingRef.current) return
    const dx = e.clientX - lastXRef.current
    lastXRef.current = e.clientX
    dragDistRef.current += Math.abs(dx)
    rotationRef.current += dx * 0.3
  }
  const onPointerUp = () => {
    draggingRef.current = false
    setIsDragging(false)
  }

  const handleNodeClick = (project) => {
    if (dragDistRef.current > 6) return
    setSelected(project)
  }

  const handleBack = (e) => blobNavigate('/', e)

  return (
    <div className="pg-page">
      <div className="pg-grid-overlay" />
      <div className="pg-glow" />

      <button className="pg-back-btn" onClick={handleBack} type="button">
        <ArrowLeft size={13} /> Retour au site
      </button>

      <div className="pg-chrome-top">
        <span className="pg-eyebrow">Mode Explorer</span>
        <h1 className="pg-title">L'univers <em>AKATech</em></h1>
      </div>

      <div className="pg-count">
        <strong>{PROJECTS.length}</strong>projets
      </div>

      <div
        ref={sceneRef}
        className={'pg-scene' + (isDragging ? ' is-dragging' : '')}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        <div ref={worldRef} className="pg-world">
          {PROJECTS.map((p, i) => {
            const pos = positions[i]
            if (!pos) return null
            return (
              <div
                key={p.id}
                className="pg-node"
                style={{
                  '--node-w': `${NODE_W}px`,
                  '--node-h': `${NODE_H}px`,
                  '--x': `${pos.x}px`,
                  '--y': `${pos.y}px`,
                  '--z': `${pos.z}px`,
                  '--rx': `${pos.rx}deg`,
                  '--ry': `${pos.ry}deg`,
                }}
                onClick={() => handleNodeClick(p)}
              >
                <img src={p.img} alt={p.title} loading="lazy" draggable={false} />
                <div className="pg-node-overlay" />
                <span className={'pg-live-dot' + (p.live ? '' : ' is-offline')} />
                <div className="pg-node-label">
                  {p.title}
                  <span>{p.type}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="pg-hint">
        <strong>Glissez</strong> pour tourner le globe · <strong>Cliquez</strong> sur un projet pour le découvrir
      </div>

      {selected && (
        <ProjectGlobeModal project={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  )
}
