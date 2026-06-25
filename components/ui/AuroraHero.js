'use client'
import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

/* ═══════════════════════════════════════════════════════════════
   IridescenceHero — Port du shader "Iridescence" (reactbits/ogl)
   → WebGL1 natif, sans dépendance externe (remplace l'ancien
   composant AuroraHero "Dither Pro" — même nom de fichier/export
   pour ne casser aucun import existant dans le projet).
   Palette AKATech : émeraude #88ca53 sur fond noir
   Boucle cos/sin entrelacée (8 itérations) + souris + couleur teintée
   Optimisations perf :
     • rendu à 80 % de la résolution physique (CSS upscale)
     • boucle 60 fps cappée
     • un seul triangle plein écran (pas de géométrie lourde)
   Props (identiques à l'ancien composant) :
     labels  – [{ text, x, y, delay? }]
     overlay – opacité du voile sombre (défaut 0.50)
   ═══════════════════════════════════════════════════════════════ */
export default function AuroraHero({ labels = [], overlay = 0.50 }) {
  const cvRef    = useRef(null)
  const rafRef   = useRef(null)
  const glRef    = useRef(null)
  const uRef     = useRef({})
  const mouseRef = useRef({ x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 })
  const lastTs   = useRef(0)
  const INTERVAL = 1000 / 60

  useEffect(() => {
    const cv = cvRef.current
    if (!cv) return
    const gl = cv.getContext('webgl') || cv.getContext('experimental-webgl')
    if (!gl) return
    glRef.current = gl

    /* ── rendu à 80 % de la résolution physique ── */
    const SCALE = 0.8

    const resize = () => {
      const parent = cv.parentElement
      const w = parent ? parent.getBoundingClientRect().width  : cv.offsetWidth
      const h = parent ? parent.getBoundingClientRect().height : (cv.offsetHeight || window.innerHeight)
      cv.width  = Math.round((w || window.innerWidth)  * SCALE)
      cv.height = Math.round((h || window.innerHeight) * SCALE)
      gl.viewport(0, 0, cv.width, cv.height)
      if (uRef.current.u_res)
        gl.uniform3f(uRef.current.u_res, cv.width, cv.height, cv.width / cv.height)
    }
    resize()
    const resizeDeferred = setTimeout(resize, 150)
    const ro = new ResizeObserver(resize)
    ro.observe(cv)

    /* ─────────────────────────────────────────────────────────
       Vertex — plein écran via TRIANGLE_STRIP
    ───────────────────────────────────────────────────────── */
    const vert = `
      attribute vec2 a_pos;
      varying vec2 v_uv;
      void main() {
        v_uv = a_pos * 0.5 + 0.5;
        gl_Position = vec4(a_pos, 0.0, 1.0);
      }
    `

    /* ─────────────────────────────────────────────────────────
       Fragment — Iridescence, port direct du shader reactbits/ogl
         • même logique cos/sin entrelacée que l'original
         • gl_FragColor à la place de out vec4
         • palette AKATech injectée via u_color (émeraude)
         • répulsion/attraction souris conservée (u_mouse)
    ───────────────────────────────────────────────────────── */
    const frag = `
      precision highp float;

      varying vec2 v_uv;

      uniform float u_time;
      uniform vec3  u_color;
      uniform vec3  u_res;
      uniform vec2  u_mouse;
      uniform float u_amplitude;
      uniform float u_speed;

      void main() {
        float mr = min(u_res.x, u_res.y);
        vec2 uv = (v_uv.xy * 2.0 - 1.0) * u_res.xy / mr;

        uv += (u_mouse - vec2(0.5)) * u_amplitude;

        float d = -u_time * 0.5 * u_speed;
        float a = 0.0;
        for (float i = 0.0; i < 8.0; ++i) {
          a += cos(i - d - a * uv.x);
          d += sin(uv.y * i + a);
        }
        d += u_time * 0.5 * u_speed;
        vec3 col = vec3(cos(uv * vec2(d, a)) * 0.6 + 0.4, cos(a + d) * 0.5 + 0.5);
        col = cos(col * cos(vec3(d, a, 2.5)) * 0.5 + 0.5) * u_color;
        gl_FragColor = vec4(col, 1.0);
      }
    `

    /* ── Compilation ── */
    const compile = (type, src) => {
      const s = gl.createShader(type)
      gl.shaderSource(s, src)
      gl.compileShader(s)
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS))
        console.error('[IridescenceHero] Shader error:', gl.getShaderInfoLog(s))
      return s
    }
    const prog = gl.createProgram()
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, vert))
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, frag))
    gl.linkProgram(prog)
    gl.useProgram(prog)

    /* ── Géométrie plein écran ── */
    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW)
    const aPos = gl.getAttribLocation(prog, 'a_pos')
    gl.enableVertexAttribArray(aPos)
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)

    /* ── Localisation uniforms ── */
    const U = n => gl.getUniformLocation(prog, n)
    uRef.current = {
      u_time:      U('u_time'),
      u_color:     U('u_color'),
      u_res:       U('u_res'),
      u_mouse:     U('u_mouse'),
      u_amplitude: U('u_amplitude'),
      u_speed:     U('u_speed'),
    }

    /* ── Valeurs initiales ── */
    const u = uRef.current
    gl.uniform3f(u.u_res,       cv.width, cv.height, cv.width / cv.height)
    gl.uniform3f(u.u_color,     0.133, 0.784, 0.392)  /* #88ca53 émeraude AKATech */
    gl.uniform2f(u.u_mouse,     0.5, 0.5)
    gl.uniform1f(u.u_amplitude, 0.12)
    gl.uniform1f(u.u_speed,     0.7)

    /* ── Souris — inertie douce, lerp vers la cible ── */
    const handleMouseMove = e => {
      const rect = cv.getBoundingClientRect()
      mouseRef.current.tx = (e.clientX - rect.left) / rect.width
      mouseRef.current.ty = 1.0 - (e.clientY - rect.top) / rect.height
    }
    const parentEl = cv.parentElement
    parentEl?.addEventListener('mousemove', handleMouseMove)

    /* ── Boucle de rendu — 60 fps cappé ── */
    const render = ts => {
      if (!glRef.current) return
      rafRef.current = requestAnimationFrame(render)
      if (ts - lastTs.current < INTERVAL) return
      lastTs.current = ts

      const m = mouseRef.current
      m.x += (m.tx - m.x) * 0.06
      m.y += (m.ty - m.y) * 0.06

      const u = uRef.current
      gl.uniform1f(u.u_time,  ts * 0.001)
      gl.uniform2f(u.u_mouse, m.x, m.y)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    }
    rafRef.current = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(rafRef.current)
      clearTimeout(resizeDeferred)
      ro.disconnect()
      parentEl?.removeEventListener('mousemove', handleMouseMove)
      glRef.current = null
    }
  }, [])

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden' }}>

      {/* ── Canvas WebGL Iridescence ── */}
      <canvas
        ref={cvRef}
        aria-hidden
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          display: 'block',
        }}
      />

      {/* ── Ligne de scan — émeraude ── */}
      <div style={{
        position: 'absolute', left: 0, right: 0, height: 1,
        background: 'linear-gradient(90deg,transparent,rgba(136,202,83,.45),rgba(102,255,170,.6),rgba(136,202,83,.45),transparent)',
        animation: 'dither-scan 9s linear infinite',
        pointerEvents: 'none', zIndex: 2,
      }} />

      {/* ── Overlay dégradé — isole la navbar en haut ── */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 3, pointerEvents: 'none',
        background: `linear-gradient(to bottom,
          rgba(3,8,6,0.82)              0%,
          rgba(3,8,6,0.65)              8%,
          rgba(3,8,6,${overlay * 0.28}) 35%,
          rgba(3,8,6,${overlay * 0.20}) 60%,
          rgba(3,8,6,${overlay * 0.92}) 100%)`,
      }} />

      {/* ── Badges flottants — masqués sur mobile ── */}
      {labels.map(({ text, x, y, delay = 0 }, i) => (
        <motion.div
          key={text}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: [0, -5, 0] }}
          transition={{
            opacity: { delay: 0.6 + delay, duration: 0.6 },
            y: { duration: 3.5 + i * 0.4, repeat: Infinity, ease: 'easeInOut', delay },
          }}
          style={{
            position: 'absolute',
            left: `${x}%`, top: `${y}%`,
            zIndex: 4,
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '5px 12px', borderRadius: 100,
            background: 'rgba(3,8,6,0.72)',
            border: '1px solid rgba(136,202,83,.28)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 0 16px rgba(136,202,83,.15)',
            pointerEvents: 'none',
          }}
          className="aurora-pill"
        >
          <span style={{
            width: 6, height: 6, borderRadius: '50%',
            background: '#88ca53',
            boxShadow: '0 0 8px rgba(136,202,83,.9)',
            display: 'inline-block',
            animation: 'dot-blink 2s ease-in-out infinite',
            animationDelay: `${i * 0.3}s`,
          }} />
          <span style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.6rem', fontWeight: 600,
            color: 'rgba(255,255,255,.72)',
            letterSpacing: '.1em', textTransform: 'uppercase',
            whiteSpace: 'nowrap',
          }}>
            {text}
          </span>
        </motion.div>
      ))}

      {/* ── Keyframes ── */}
      <style>{`
        @keyframes dither-scan {
          0%   { top: -2%; }
          100% { top: 104%; }
        }
        @keyframes dot-blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.3; }
        }
        @media (max-width: 768px) {
          .aurora-pill { display: none !important; }
        }
      `}</style>
    </div>
  )
}
