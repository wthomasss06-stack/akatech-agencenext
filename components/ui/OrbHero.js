'use client'
import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

/* ─────────────────────────────────────────────────────────────
   OrbHeroBg — Fond hero époustouflant style Recognito
   Props:
     labels   – tableau de { text, x, y } pour les labels flottants
     orbColor – couleur principale (défaut vert AKATech)
   ───────────────────────────────────────────────────────────── */
export default function OrbHeroBg({ labels, orbColor = '#22c864' }) {
  // Dérive une version plus sombre/saturée pour les glows
  const orbDim = orbColor + '55'
  const orbFaint = orbColor + '18'

  // Nodes du réseau de circuit
  const nodes = [
    { x: 15, y: 25 }, { x: 82, y: 18 }, { x: 28, y: 72 },
    { x: 70, y: 65 }, { x: 50, y: 50 }, { x: 8, y: 55 },
    { x: 92, y: 45 }, { x: 38, y: 88 }, { x: 63, y: 82 },
    { x: 55, y: 15 }, { x: 20, y: 42 }, { x: 78, y: 78 },
  ]
  // Connexions entre nodes
  const edges = [
    [0,4],[1,4],[2,4],[3,4],[4,5],[4,6],[4,7],[4,8],
    [0,10],[1,9],[2,7],[3,8],[5,10],[6,11],[7,8],[9,1],
    [10,2],[11,3],
  ]

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 0,
      background: 'linear-gradient(160deg, #030806 0%, #050f08 40%, #060e09 100%)',
      overflow: 'hidden',
    }}>

      {/* ── Grille fine ── */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `linear-gradient(${orbColor}08 1px,transparent 1px),linear-gradient(90deg,${orbColor}08 1px,transparent 1px)`,
        backgroundSize: '44px 44px',
        zIndex: 1,
      }} />

      {/* ── Orbe principal — glow en plusieurs couches ── */}
      {/* Halo extérieur très doux */}
      <motion.div
        animate={{ scale: [1, 1.08, 1], opacity: [0.35, 0.55, 0.35] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute', bottom: '-18%', left: '50%',
          transform: 'translateX(-50%)',
          width: '70vw', height: '70vw',
          maxWidth: 900, maxHeight: 900,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${orbColor}22 0%, ${orbColor}08 35%, transparent 70%)`,
          zIndex: 2, pointerEvents: 'none',
        }}
      />
      {/* Halo intermédiaire */}
      <motion.div
        animate={{ scale: [1, 1.12, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
        style={{
          position: 'absolute', bottom: '-12%', left: '50%',
          transform: 'translateX(-50%)',
          width: '45vw', height: '45vw',
          maxWidth: 600, maxHeight: 600,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${orbColor}44 0%, ${orbColor}18 40%, transparent 70%)`,
          zIndex: 3, pointerEvents: 'none',
        }}
      />
      {/* Noyau brillant */}
      <motion.div
        animate={{ scale: [1, 1.07, 1] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
        style={{
          position: 'absolute', bottom: '-8%', left: '50%',
          transform: 'translateX(-50%)',
          width: '22vw', height: '22vw',
          maxWidth: 280, maxHeight: 280,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${orbColor}cc 0%, ${orbColor}88 30%, ${orbColor}33 60%, transparent 80%)`,
          boxShadow: `0 0 80px ${orbColor}66, 0 0 160px ${orbColor}33`,
          zIndex: 4, pointerEvents: 'none',
        }}
      />
      {/* Reflet spéculaire sur l'orbe */}
      <motion.div
        animate={{ opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute', bottom: '-2%', left: '50%',
          transform: 'translateX(-50%) translateX(-18%) translateY(-30%)',
          width: '7vw', height: '3vw',
          maxWidth: 80, maxHeight: 36,
          borderRadius: '50%',
          background: `radial-gradient(ellipse, rgba(255,255,255,0.55) 0%, transparent 75%)`,
          zIndex: 5, pointerEvents: 'none', filter: 'blur(2px)',
        }}
      />

      {/* ── SVG réseau de circuit ── */}
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 2, opacity: 0.55 }}
      >
        <defs>
          <filter id="glow-line">
            <feGaussianBlur stdDeviation="0.4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          {/* Gradient qui s'atténue vers les bords */}
          <radialGradient id="fade-mask" cx="50%" cy="70%" r="55%">
            <stop offset="0%" stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0.05" />
          </radialGradient>
          <mask id="circuit-mask">
            <rect width="100" height="100" fill="url(#fade-mask)" />
          </mask>
        </defs>

        <g mask="url(#circuit-mask)" filter="url(#glow-line)">
          {/* Lignes entre nodes */}
          {edges.map(([a, b], i) => (
            <motion.line
              key={i}
              x1={nodes[a].x} y1={nodes[a].y}
              x2={nodes[b].x} y2={nodes[b].y}
              stroke={orbColor}
              strokeWidth="0.12"
              strokeOpacity="0.45"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: [0, 0.5, 0.3] }}
              transition={{ duration: 1.5 + i * 0.12, delay: i * 0.06, ease: 'easeOut' }}
            />
          ))}

          {/* Points de node */}
          {nodes.map((n, i) => (
            <motion.circle
              key={i}
              cx={n.x} cy={n.y} r="0.45"
              fill={orbColor}
              fillOpacity="0.7"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [1, 1.6, 1], opacity: [0.4, 0.9, 0.4] }}
              transition={{ duration: 2.5 + (i % 3) * 0.8, delay: 0.1 + i * 0.07, repeat: Infinity, ease: 'easeInOut' }}
            />
          ))}

          {/* Petits carrés aux nœuds clés */}
          {[0, 1, 3, 5, 6].map(idx => (
            <motion.rect
              key={idx}
              x={nodes[idx].x - 0.8} y={nodes[idx].y - 0.8}
              width="1.6" height="1.6"
              fill="none" stroke={orbColor}
              strokeWidth="0.15" strokeOpacity="0.5"
              rx="0.2"
              animate={{ rotate: [0, 90, 0], opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 6 + idx, repeat: Infinity, ease: 'easeInOut' }}
              style={{ transformOrigin: `${nodes[idx].x}px ${nodes[idx].y}px` }}
            />
          ))}

          {/* Particule qui voyage sur les lignes */}
          {[0, 2, 4].map(ei => {
            const [a, b] = edges[ei]
            return (
              <motion.circle
                key={`p${ei}`}
                r="0.35"
                fill={orbColor}
                fillOpacity="0.9"
                animate={{
                  cx: [nodes[a].x, nodes[b].x, nodes[a].x],
                  cy: [nodes[a].y, nodes[b].y, nodes[a].y],
                }}
                transition={{ duration: 3 + ei * 1.2, repeat: Infinity, ease: 'linear', delay: ei * 1.1 }}
              />
            )
          })}
        </g>
      </svg>

      {/* ── Lignes de scan horizontales ── */}
      <motion.div
        animate={{ top: ['-4%', '104%'] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'linear', repeatDelay: 3 }}
        style={{
          position: 'absolute', left: 0, right: 0, height: 1,
          background: `linear-gradient(90deg,transparent,${orbColor}44,transparent)`,
          zIndex: 6, pointerEvents: 'none',
        }}
      />
      <motion.div
        animate={{ top: ['-4%', '104%'] }}
        transition={{ duration: 13, repeat: Infinity, ease: 'linear', repeatDelay: 2, delay: 4 }}
        style={{
          position: 'absolute', left: 0, right: 0, height: '1px',
          background: `linear-gradient(90deg,transparent,${orbColor}22,transparent)`,
          zIndex: 6, pointerEvents: 'none',
        }}
      />

      {/* ── Overlay gradient pour lisibilité du texte ── */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 7,
        background: 'linear-gradient(to bottom, rgba(3,8,6,.55) 0%, rgba(3,8,6,.15) 40%, rgba(3,8,6,.6) 80%, rgba(3,8,6,.92) 100%)',
        pointerEvents: 'none',
      }} />

      {/* ── Labels flottants ── */}
      {labels && labels.map(({ text, x, y, delay = 0 }, i) => (
        <motion.div
          key={text}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: [0, -5, 0] }}
          transition={{
            opacity: { delay: 0.6 + delay, duration: 0.6 },
            y: { duration: 3.5 + i * 0.4, repeat: Infinity, ease: 'easeInOut', delay: delay },
          }}
          style={{
            position: 'absolute',
            left: `${x}%`, top: `${y}%`,
            zIndex: 8,
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '5px 12px',
            borderRadius: 100,
            background: 'rgba(6,14,9,0.75)',
            border: `1px solid ${orbColor}33`,
            backdropFilter: 'blur(10px)',
            boxShadow: `0 0 16px ${orbColor}18`,
            pointerEvents: 'none',
          }}
        >
          {/* Dot */}
          <span style={{
            width: 6, height: 6, borderRadius: '50%',
            background: orbColor,
            boxShadow: `0 0 6px ${orbColor}cc`,
            display: 'inline-block',
            animation: 'dot-blink 2s ease-in-out infinite',
            animationDelay: `${i * 0.3}s`,
          }} />
          <span style={{
            fontFamily: "'Syne',sans-serif",
            fontSize: '0.6rem', fontWeight: 600,
            color: 'rgba(255,255,255,0.7)',
            letterSpacing: '.1em', textTransform: 'uppercase',
            whiteSpace: 'nowrap',
          }}>
            {text}
          </span>
        </motion.div>
      ))}

      {/* ── Vignette coins ── */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 3, pointerEvents: 'none',
        background: 'radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(3,8,6,.7) 100%)',
      }} />
    </div>
  )
}
