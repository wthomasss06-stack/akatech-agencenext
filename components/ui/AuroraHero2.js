'use client'
import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

/* ═══════════════════════════════════════════════════════════════
   GrainientHero — Grainient Engine (port WebGL2 → WebGL1 natif)
   Palette AKATech : noir #030806 · vert forêt #0d2415 · émeraude #88ca53
   Warp + noise + grain (style Nexura) — influence souris conservée
   Props :
     labels  – [{ text, x, y, delay? }]
     overlay – opacité du voile sombre (défaut 0.50)
   ═══════════════════════════════════════════════════════════════ */
export default function AuroraHero({ labels = [], overlay = 0.50 }) {
  const cvRef    = useRef(null)
  const rafRef   = useRef(null)
  const glRef    = useRef(null)
  const uRef     = useRef({})
  const mouseRef = useRef({ x: 0, y: 0, tx: 0, ty: 0 })
  const lastTs   = useRef(0)
  const INTERVAL = 1000 / 60

  useEffect(() => {
    const cv = cvRef.current
    if (!cv) return
    const gl = cv.getContext('webgl') || cv.getContext('experimental-webgl')
    if (!gl) return
    glRef.current = gl

    const SCALE = 0.85

    /* ── Resize ── */
    const resize = () => {
      const parent = cv.parentElement
      const w = parent ? parent.getBoundingClientRect().width  : cv.offsetWidth
      const h = parent ? parent.getBoundingClientRect().height : (cv.offsetHeight || window.innerHeight)
      cv.width  = Math.round((w || window.innerWidth)  * SCALE)
      cv.height = Math.round((h || window.innerHeight) * SCALE)
      gl.viewport(0, 0, cv.width, cv.height)
      if (uRef.current.iResolution)
        gl.uniform2f(uRef.current.iResolution, cv.width, cv.height)
    }
    resize()
    const resizeDeferred = setTimeout(resize, 150)
    const ro = new ResizeObserver(resize)
    ro.observe(cv)

    /* ─────────────────────────────────────────────────────────────
       Vertex — plein écran via TRIANGLE_STRIP
    ───────────────────────────────────────────────────────────── */
    const vert = `
      attribute vec2 a_pos;
      void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
    `

    /* ─────────────────────────────────────────────────────────────
       Fragment — Grainient Engine, converti WebGL2 → WebGL1
         • même logique noise / warp / blend / grain que le HTML source
         • out vec4 fragColor  →  gl_FragColor
         • palette AKATech via uColor1/2/3
         • uCenterOffset piloté par la souris (inertie douce)
    ───────────────────────────────────────────────────────────── */
    const frag = `
      precision highp float;

      uniform vec2  iResolution;
      uniform float iTime;

      uniform float uTimeSpeed;
      uniform float uColorBalance;
      uniform float uWarpStrength;
      uniform float uWarpFrequency;
      uniform float uWarpSpeed;
      uniform float uWarpAmplitude;
      uniform float uBlendAngle;
      uniform float uBlendSoftness;
      uniform float uRotationAmount;
      uniform float uNoiseScale;
      uniform float uGrainAmount;
      uniform float uGrainScale;
      uniform float uGrainAnimated;
      uniform float uContrast;
      uniform float uGamma;
      uniform float uSaturation;
      uniform float uZoom;
      uniform vec2  uCenterOffset;
      uniform vec3  uColor1;
      uniform vec3  uColor2;
      uniform vec3  uColor3;

      /* ── helpers ── */
      mat2 Rot(float a) {
        float s = sin(a), c = cos(a);
        return mat2(c, -s, s, c);
      }

      vec2 hash22(vec2 p) {
        p = vec2(dot(p, vec2(2127.1, 81.17)), dot(p, vec2(1269.5, 283.37)));
        return fract(sin(p) * 43758.5453);
      }

      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(
          mix(dot(-1.0 + 2.0 * hash22(i + vec2(0.0, 0.0)), f - vec2(0.0, 0.0)),
              dot(-1.0 + 2.0 * hash22(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x),
          mix(dot(-1.0 + 2.0 * hash22(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)),
              dot(-1.0 + 2.0 * hash22(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u.x),
          u.y
        ) * 0.5 + 0.5;
      }

      void main() {
        float t     = iTime * uTimeSpeed;
        vec2  uv    = gl_FragCoord.xy / iResolution.xy;
        float ratio = iResolution.x / iResolution.y;

        /* coordonnées centrées + décalage souris */
        vec2 tuv = uv - 0.5 + uCenterOffset;
        tuv /= max(uZoom, 0.001);

        /* rotation pilotée par le noise */
        float degree = noise(vec2(t * 0.1, tuv.x * tuv.y) * uNoiseScale);
        tuv.y *= 1.0 / ratio;
        tuv   *= Rot(radians((degree - 0.5) * uRotationAmount + 180.0));
        tuv.y *= ratio;

        /* warp sinusoïdal */
        float freq = uWarpFrequency;
        float amp  = uWarpAmplitude / max(uWarpStrength, 0.001);
        tuv.x += sin(tuv.y * freq         + t * uWarpSpeed) / amp;
        tuv.y += sin(tuv.x * freq * 1.5   + t * uWarpSpeed) / (amp * 0.5);

        /* blend des 3 couleurs */
        mat2  bRot = Rot(radians(uBlendAngle));
        float bX   = (tuv * bRot).x;
        float s    = max(uBlendSoftness, 0.0);

        vec3 l1 = mix(uColor3, uColor2,
                      smoothstep(-0.3 - uColorBalance - s, 0.2 - uColorBalance + s, bX));
        vec3 l2 = mix(uColor2, uColor1,
                      smoothstep(-0.3 - uColorBalance - s, 0.2 - uColorBalance + s, bX));
        vec3 col = mix(l1, l2,
                       smoothstep(0.5 - uColorBalance + s, -0.3 - uColorBalance - s, tuv.y));

        /* grain */
        vec2  gUv  = uv * max(uGrainScale, 0.001);
        if (uGrainAnimated > 0.5) gUv += vec2(iTime * 0.05);
        float grain = fract(sin(dot(gUv, vec2(12.9898, 78.233))) * 43758.5453);
        col += (grain - 0.5) * uGrainAmount;

        /* contraste · saturation · gamma */
        col = (col - 0.5) * uContrast + 0.5;
        float lum = dot(col, vec3(0.2126, 0.7152, 0.0722));
        col = mix(vec3(lum), col, uSaturation);
        col = pow(max(col, 0.0), vec3(1.0 / max(uGamma, 0.001)));

        gl_FragColor = vec4(col, 1.0);
      }
    `

    /* ── Compilation ── */
    const compile = (type, src) => {
      const s = gl.createShader(type)
      gl.shaderSource(s, src)
      gl.compileShader(s)
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS))
        console.error('[Grainient] Shader error:', gl.getShaderInfoLog(s))
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

    /* ── Localisation de tous les uniforms ── */
    const U = name => gl.getUniformLocation(prog, name)
    uRef.current = {
      iResolution:     U('iResolution'),
      iTime:           U('iTime'),
      uTimeSpeed:      U('uTimeSpeed'),
      uColorBalance:   U('uColorBalance'),
      uWarpStrength:   U('uWarpStrength'),
      uWarpFrequency:  U('uWarpFrequency'),
      uWarpSpeed:      U('uWarpSpeed'),
      uWarpAmplitude:  U('uWarpAmplitude'),
      uBlendAngle:     U('uBlendAngle'),
      uBlendSoftness:  U('uBlendSoftness'),
      uRotationAmount: U('uRotationAmount'),
      uNoiseScale:     U('uNoiseScale'),
      uGrainAmount:    U('uGrainAmount'),
      uGrainScale:     U('uGrainScale'),
      uGrainAnimated:  U('uGrainAnimated'),
      uContrast:       U('uContrast'),
      uGamma:          U('uGamma'),
      uSaturation:     U('uSaturation'),
      uZoom:           U('uZoom'),
      uCenterOffset:   U('uCenterOffset'),
      uColor1:         U('uColor1'),
      uColor2:         U('uColor2'),
      uColor3:         U('uColor3'),
    }

    /* ── Conversion hex → [r,g,b] normalisé ── */
    const hex = h => {
      const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(h)
      return r ? [parseInt(r[1],16)/255, parseInt(r[2],16)/255, parseInt(r[3],16)/255] : [1,1,1]
    }

    /* ── Valeurs fixes (envoyées une seule fois) ── */
    const u = uRef.current
    gl.uniform2f(u.iResolution,    cv.width, cv.height)
    gl.uniform1f(u.uTimeSpeed,     0.45)   /* ↑ vitesse ×2                  */
    gl.uniform1f(u.uColorBalance,  0.0)
    gl.uniform1f(u.uWarpStrength,  2.0)
    gl.uniform1f(u.uWarpFrequency, 5.0)
    gl.uniform1f(u.uWarpSpeed,     2.0)
    gl.uniform1f(u.uWarpAmplitude, 50.0)
    gl.uniform1f(u.uBlendAngle,    0.0)
    gl.uniform1f(u.uBlendSoftness, 0.12)   /* ↑ transitions plus douces      */
    gl.uniform1f(u.uRotationAmount,500.0)
    gl.uniform1f(u.uNoiseScale,    2.0)
    gl.uniform1f(u.uGrainAmount,   0.055)
    gl.uniform1f(u.uGrainScale,    2.0)
    gl.uniform1f(u.uGrainAnimated, 0.0)
    gl.uniform1f(u.uContrast,      1.2)    /* ↓ évite l'écrasement en noir   */
    gl.uniform1f(u.uGamma,         1.0)
    gl.uniform1f(u.uSaturation,    1.1)
    gl.uniform1f(u.uZoom,          0.9)
    gl.uniform2f(u.uCenterOffset,  0.0, 0.0)
    /* Palette AKATech — émeraude, sans noir pur */
    gl.uniform3fv(u.uColor1, hex('#b3ee85'))  /* mint lumineux         */
    gl.uniform3fv(u.uColor2, hex('#88ca53'))  /* émeraude AKATech      */
    gl.uniform3fv(u.uColor3, hex('#0d2415'))  /* vert très sombre (≠ noir pur) */

    /* ── Souris → uCenterOffset ── */
    const onMouse = e => {
      mouseRef.current.tx =  (e.clientX / window.innerWidth  - 0.5) * 0.08
      mouseRef.current.ty = -(e.clientY / window.innerHeight - 0.5) * 0.08
    }
    const onTouch = e => {
      const t0 = e.touches[0]
      mouseRef.current.tx =  (t0.clientX / window.innerWidth  - 0.5) * 0.08
      mouseRef.current.ty = -(t0.clientY / window.innerHeight - 0.5) * 0.08
    }
    window.addEventListener('mousemove', onMouse)
    window.addEventListener('touchmove', onTouch, { passive: true })

    /* ── Boucle de rendu ── */
    const render = ts => {
      if (!glRef.current) return
      rafRef.current = requestAnimationFrame(render)
      if (ts - lastTs.current < INTERVAL) return
      lastTs.current = ts

      /* inertie souris */
      mouseRef.current.x += (mouseRef.current.tx - mouseRef.current.x) * 0.05
      mouseRef.current.y += (mouseRef.current.ty - mouseRef.current.y) * 0.05

      const u = uRef.current
      gl.uniform1f(u.iTime, ts * 0.001)
      gl.uniform2f(u.uCenterOffset, mouseRef.current.x, mouseRef.current.y)
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

      {/* ── Canvas WebGL Grainient ── */}
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
        animation: 'grainient-scan 9s linear infinite',
        pointerEvents: 'none', zIndex: 2,
      }} />

      {/* ── Overlay dégradé — fond AKATech ── */}
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
        @keyframes grainient-scan {
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