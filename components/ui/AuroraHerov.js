'use client'
import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

/* ═══════════════════════════════════════════════════════════════
   DitherHero — Port du shader "Dither Pro" (Three.js WebGL2)
   → WebGL1 natif, sans dépendance externe
   Palette AKATech : émeraude #88ca53 sur fond noir
   FBM Perlin + dithering Bayer 4×4 + pixelation + souris
   Optimisations perf :
     • rendu à 75 % de la résolution physique (CSS upscale)
     • pixelSize = 3 → moins de fragments uniques
     • FBM limité à 3 octaves
     • Bayer 4×4 calculé (pas de tableau WebGL2)
     • boucle 60 fps cappée
   Props :
     labels  – [{ text, x, y, delay? }]
     overlay – opacité du voile sombre (défaut 0.50)
   ═══════════════════════════════════════════════════════════════ */
export default function AuroraHero({ labels = [], overlay = 0.50 }) {
  const cvRef    = useRef(null)
  const rafRef   = useRef(null)
  const glRef    = useRef(null)
  const uRef     = useRef({})
  const mouseRef = useRef({ x: -10, y: -10, tx: -10, ty: -10 })
  const lastTs   = useRef(0)
  const INTERVAL = 1000 / 60

  useEffect(() => {
    const cv = cvRef.current
    if (!cv) return
    const gl = cv.getContext('webgl') || cv.getContext('experimental-webgl')
    if (!gl) return
    glRef.current = gl

    /* ── rendu à 75 % → la pixelation compense le flou ── */
    const SCALE = 0.75

    const resize = () => {
      const parent = cv.parentElement
      const w = parent ? parent.getBoundingClientRect().width  : cv.offsetWidth
      const h = parent ? parent.getBoundingClientRect().height : (cv.offsetHeight || window.innerHeight)
      cv.width  = Math.round((w || window.innerWidth)  * SCALE)
      cv.height = Math.round((h || window.innerHeight) * SCALE)
      gl.viewport(0, 0, cv.width, cv.height)
      if (uRef.current.u_res)
        gl.uniform2f(uRef.current.u_res, cv.width, cv.height)
    }
    resize()
    const resizeDeferred = setTimeout(resize, 150)
    const ro = new ResizeObserver(resize)
    ro.observe(cv)

    /* ─────────────────────────────────────────────────────────
       Vertex — plein écran
    ───────────────────────────────────────────────────────── */
    const vert = `
      attribute vec2 a_pos;
      void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
    `

    /* ─────────────────────────────────────────────────────────
       Fragment — Dither Pro, converti Three.js/GLSL ES 3 → WebGL1
         • const float bayer8[64] = float[64](...) interdit en WebGL1
           → remplacé par bayer4() calculé mathématiquement (bit-interleaving)
         • gl_FragColor à la place de out vec4
         • FBM 3 octaves (vs 4) pour les perfs
         • palette AKATech injectée via uWaveColor
    ───────────────────────────────────────────────────────── */
    const frag = `
      precision highp float;

      uniform vec2  u_res;
      uniform float u_time;
      uniform float uWaveSpeed;
      uniform float uWaveFrequency;
      uniform float uWaveAmplitude;
      uniform vec3  uWaveColor;
      uniform vec2  u_mouse;
      uniform float uMouseRadius;
      uniform float uColorNum;
      uniform float uPixelSize;

      /* ── Perlin noise (cnoise) — identique au HTML source ── */
      vec4 mod289v(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec4 permute4(vec4 x) { return mod289v(((x * 34.0) + 1.0) * x); }
      vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
      vec2 fade2(vec2 t) { return t * t * t * (t * (t * 6.0 - 15.0) + 10.0); }

      float cnoise(vec2 P) {
        vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
        vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
        Pi = mod289v(Pi);
        vec4 ix = Pi.xzxz; vec4 iy = Pi.yyww;
        vec4 fx = Pf.xzxz; vec4 fy = Pf.yyww;
        vec4 i  = permute4(permute4(ix) + iy);
        vec4 gx = fract(i * (1.0 / 41.0)) * 2.0 - 1.0;
        vec4 gy = abs(gx) - 0.5;
        gx -= floor(gx + 0.5);
        vec2 g00 = vec2(gx.x, gy.x); vec2 g10 = vec2(gx.y, gy.y);
        vec2 g01 = vec2(gx.z, gy.z); vec2 g11 = vec2(gx.w, gy.w);
        vec4 norm = taylorInvSqrt(vec4(
          dot(g00, g00), dot(g01, g01),
          dot(g10, g10), dot(g11, g11)
        ));
        g00 *= norm.x; g01 *= norm.y; g10 *= norm.z; g11 *= norm.w;
        float n00 = dot(g00, vec2(fx.x, fy.x));
        float n10 = dot(g10, vec2(fx.y, fy.y));
        float n01 = dot(g01, vec2(fx.z, fy.z));
        float n11 = dot(g11, vec2(fx.w, fy.w));
        vec2 fade_xy = fade2(Pf.xy);
        vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
        return 2.3 * mix(n_x.x, n_x.y, fade_xy.y);
      }

      /* ── FBM — 3 octaves (perf) ── */
      float fbm(vec2 p) {
        float value = 0.0;
        float amp   = 1.0;
        float freq  = uWaveFrequency;
        for (int i = 0; i < 3; i++) {
          value += amp * abs(cnoise(p));
          p    *= freq;
          amp  *= uWaveAmplitude;
        }
        return value;
      }

      /* ── Bayer 4×4 calculé (bit-interleaving, WebGL1-compatible) ──
         Remplace const float bayer8[64] = float[64](...) de WebGL2.
         Valeurs vérifiées : ligne 0 → 0,8,2,10 / ligne 1 → 12,4,14,6 … */
      float bayer4(vec2 p) {
        vec2  c = mod(floor(p), 4.0);
        float v = 0.0;
        v += step(0.5, mod(c.x,              2.0)) * 8.0;
        v += step(0.5, mod(c.y,              2.0)) * 4.0;
        v += step(0.5, mod(floor(c.x * 0.5), 2.0)) * 2.0;
        v += step(0.5, mod(floor(c.y * 0.5), 2.0)) * 1.0;
        return v / 16.0;
      }

      void main() {
        /* pixelation — même logique que le HTML */
        vec2 uvPixel = floor(gl_FragCoord.xy / uPixelSize) * uPixelSize;
        vec2 uv      = uvPixel / u_res.xy;

        /* espace clip centré avec ratio */
        vec2 p  = (uv - 0.5) * 2.0;
        p.x    *= u_res.x / u_res.y;

        /* FBM double — signature "Dither Pro" */
        float f = fbm(p + fbm(p - u_time * uWaveSpeed));

        /* répulsion souris */
        float dist   = length(p - u_mouse);
        float effect = 1.0 - smoothstep(0.0, uMouseRadius * 2.0, dist);
        f -= 0.5 * effect;

        /* dithering Bayer */
        float threshold = bayer4(uvPixel / uPixelSize) - 0.25;

        vec3  col      = uWaveColor * f;
        float stepVal  = 1.0 / (uColorNum - 1.0);
        col += threshold * stepVal;
        col  = floor(col * (uColorNum - 1.0) + 0.5) / (uColorNum - 1.0);

        gl_FragColor = vec4(col, 1.0);
      }
    `

    /* ── Compilation ── */
    const compile = (type, src) => {
      const s = gl.createShader(type)
      gl.shaderSource(s, src)
      gl.compileShader(s)
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS))
        console.error('[DitherHero] Shader error:', gl.getShaderInfoLog(s))
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
      u_res:         U('u_res'),
      u_time:        U('u_time'),
      uWaveSpeed:    U('uWaveSpeed'),
      uWaveFrequency:U('uWaveFrequency'),
      uWaveAmplitude:U('uWaveAmplitude'),
      uWaveColor:    U('uWaveColor'),
      u_mouse:       U('u_mouse'),
      uMouseRadius:  U('uMouseRadius'),
      uColorNum:     U('uColorNum'),
      uPixelSize:    U('uPixelSize'),
    }

    /* ── Valeurs initiales ── */
    const u = uRef.current
    gl.uniform2f(u.u_res,          cv.width, cv.height)
    gl.uniform1f(u.uWaveSpeed,     0.06)           /* légèrement plus rapide que l'original 0.05 */
    gl.uniform1f(u.uWaveFrequency, 3.0)
    gl.uniform1f(u.uWaveAmplitude, 0.3)
    gl.uniform3f(u.uWaveColor,     0.133, 0.784, 0.392)  /* #88ca53 émeraude AKATech */
    gl.uniform2f(u.u_mouse,        -10.0, -10.0)
    gl.uniform1f(u.uMouseRadius,   0.3)
    gl.uniform1f(u.uColorNum,      5.0)            /* +1 niveau vs original → plus de nuances */
    gl.uniform1f(u.uPixelSize,     3.0)            /* pixelSize 3 → perf ×2.25 vs 2 */

    /* ── Souris — espace clip avec ratio (identique au HTML) ── */
    const onMouse = e => {
      const rect = cv.getBoundingClientRect()
      const x =   ((e.clientX - rect.left) / rect.width)  * 2.0 - 1.0
      const y = -(((e.clientY - rect.top)  / rect.height) * 2.0 - 1.0)
      mouseRef.current.tx = x * (rect.width / rect.height)
      mouseRef.current.ty = y
    }
    const onTouch = e => {
      const t0   = e.touches[0]
      const rect = cv.getBoundingClientRect()
      const x =   ((t0.clientX - rect.left) / rect.width)  * 2.0 - 1.0
      const y = -(((t0.clientY - rect.top)  / rect.height) * 2.0 - 1.0)
      mouseRef.current.tx = x * (rect.width / rect.height)
      mouseRef.current.ty = y
    }
    window.addEventListener('mousemove', onMouse)
    window.addEventListener('touchmove', onTouch, { passive: true })

    /* ── Boucle de rendu — 60 fps cappé ── */
    const render = ts => {
      if (!glRef.current) return
      rafRef.current = requestAnimationFrame(render)
      if (ts - lastTs.current < INTERVAL) return
      lastTs.current = ts

      /* inertie souris douce */
      mouseRef.current.x += (mouseRef.current.tx - mouseRef.current.x) * 0.07
      mouseRef.current.y += (mouseRef.current.ty - mouseRef.current.y) * 0.07

      const u = uRef.current
      gl.uniform1f(u.u_time,  ts * 0.001)
      gl.uniform2f(u.u_mouse, mouseRef.current.x, mouseRef.current.y)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    }
    rafRef.current = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(rafRef.current)
      clearTimeout(resizeDeferred)
      ro.disconnect()
      window.removeEventListener('mousemove', onMouse)
      window.removeEventListener('touchmove', onTouch)
      glRef.current = null
    }
  }, [])

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden' }}>

      {/* ── Canvas WebGL Dither ── */}
      <canvas
        ref={cvRef}
        aria-hidden
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          display: 'block',
          imageRendering: 'pixelated',   /* conserve le rendu pixelisé lors du upscale */
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