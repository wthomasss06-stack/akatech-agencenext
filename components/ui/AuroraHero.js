'use client'
import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

/* ═══════════════════════════════════════════════════════════════
   AuroraHero — WebGL aurora background adapté palette AKATech
   Palette : noir profond → vert émeraude (#22c864) → teal → blanc
   Identique au AuroraCanvas de App.jsx mais recolorisé vert.
   Props :
     labels   – [{ text, x, y, delay? }] pour les badges flottants
     overlay  – opacité du voile sombre final (défaut 0.55)
   ═══════════════════════════════════════════════════════════════ */
export default function AuroraHero({ labels = [], overlay = 0.55 }) {
  const cvRef    = useRef(null)
  const rafRef   = useRef(null)
  const glRef    = useRef(null)
  const uRef     = useRef({})
  const mouseRef = useRef({ x: 0, y: 0 })
  const lastTs   = useRef(0)
  const INTERVAL = 1000 / 60

  useEffect(() => {
    const cv = cvRef.current
    if (!cv) return
    const gl = cv.getContext('webgl') || cv.getContext('experimental-webgl')
    if (!gl) return
    glRef.current = gl

    const SCALE = 0.75

    const resize = () => {
      const parent = cv.parentElement
      const w = parent ? parent.getBoundingClientRect().width  : cv.offsetWidth
      const h = parent ? parent.getBoundingClientRect().height : (cv.offsetHeight || window.innerHeight)
      cv.width  = Math.round(w * SCALE)
      cv.height = Math.round(h * SCALE)
      if (cv.width  < 1) cv.width  = Math.round(window.innerWidth  * SCALE)
      if (cv.height < 1) cv.height = Math.round(window.innerHeight * SCALE)
      gl.viewport(0, 0, cv.width, cv.height)
    }
    resize()
    const resizeDeferred = setTimeout(resize, 150)
    const ro = new ResizeObserver(resize)
    ro.observe(cv)

    /* ── Vertex shader ── */
    const vert = `attribute vec2 a_pos; void main(){gl_Position=vec4(a_pos,0.,1.);}`

    /* ── Fragment shader — palette AKATech vert ── */
    const frag = `
      precision highp float;
      uniform vec2  u_res;
      uniform float u_time;
      uniform vec2  u_mouse;

      float hash(vec2 p){p=fract(p*vec2(234.34,435.345));p+=dot(p,p+34.23);return fract(p.x*p.y);}
      float noise(vec2 p){
        vec2 i=floor(p); vec2 f=fract(p); f=f*f*(3.0-2.0*f);
        return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);
      }
      float fbm(vec2 p){
        float v=0.0,a=0.5;
        for(int i=0;i<6;i++){v+=a*noise(p);p=p*2.1+vec2(1.7,9.2);a*=0.5;}
        return v;
      }

      void main(){
        vec2 uv  = gl_FragCoord.xy / u_res;
        vec2 st  = uv * 2.0 - 1.0;
        st.x    *= u_res.x / u_res.y;
        float t  = u_time * 0.18;

        /* mouse influence */
        vec2 m    = (u_mouse / u_res) * 2.0 - 1.0;
        m.x      *= u_res.x / u_res.y;
        float md  = length(st - m);
        float mf  = exp(-md * 2.2) * 0.35;

        /* double domain warp */
        vec2 q = vec2(
          fbm(st + vec2(0.0, 0.0) + t * 0.6),
          fbm(st + vec2(5.2, 1.3) + t * 0.5)
        );
        vec2 r = vec2(
          fbm(st + 4.0*q + vec2(1.7,9.2) + t*0.4 + mf),
          fbm(st + 4.0*q + vec2(8.3,2.8) + t*0.3)
        );
        float f = fbm(st + 4.5*r + t*0.25);
        f = f*f*f + 0.6*f*f + 0.5*f;

        /* ── Palette AKATech :
              noir profond → vert foncé → émeraude → teal → blanc ── */
        vec3 col = mix(vec3(0.01, 0.03, 0.02), vec3(0.04, 0.22, 0.10), clamp(f*1.6, 0.0, 1.0));
        col = mix(col, vec3(0.13, 0.78, 0.39), clamp(f*f*2.2, 0.0, 1.0));
        col = mix(col, vec3(0.0,  0.88, 0.60), clamp(pow(f, 3.5)*3.0, 0.0, 1.0));
        col = mix(col, vec3(0.88, 1.0,  0.94), clamp(pow(f, 5.0)*2.5, 0.0, 1.0));

        /* vignette */
        float vig = 1.0 - smoothstep(0.5, 1.4, length(uv - 0.5) * 1.8);
        col *= vig;

        /* bottom darkness */
        col *= mix(0.12, 1.0, smoothstep(0.0, 0.45, uv.y));

        /* mouse glow — vert émeraude */
        col += vec3(0.05, 0.55, 0.22) * exp(-md * 3.0) * 0.55;

        gl_FragColor = vec4(col, 1.0);
      }
    `

    const compile = (type, src) => {
      const s = gl.createShader(type)
      gl.shaderSource(s, src)
      gl.compileShader(s)
      return s
    }
    const prog = gl.createProgram()
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, vert))
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, frag))
    gl.linkProgram(prog)
    gl.useProgram(prog)

    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW)
    const aPos = gl.getAttribLocation(prog, 'a_pos')
    gl.enableVertexAttribArray(aPos)
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)

    uRef.current = {
      res:   gl.getUniformLocation(prog, 'u_res'),
      time:  gl.getUniformLocation(prog, 'u_time'),
      mouse: gl.getUniformLocation(prog, 'u_mouse'),
    }

    const onMouse = e => {
      mouseRef.current = { x: e.clientX, y: cv.height - e.clientY }
    }
    const onTouch = e => {
      const t = e.touches[0]
      mouseRef.current = { x: t.clientX, y: cv.height - t.clientY }
    }
    window.addEventListener('mousemove', onMouse)
    window.addEventListener('touchmove', onTouch, { passive: true })

    const render = ts => {
      if (!glRef.current) return
      rafRef.current = requestAnimationFrame(render)
      if (ts - lastTs.current < INTERVAL) return
      lastTs.current = ts
      const u = uRef.current
      gl.uniform2f(u.res,   cv.width, cv.height)
      gl.uniform1f(u.time,  ts * 0.001)
      gl.uniform2f(u.mouse, mouseRef.current.x, mouseRef.current.y)
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

      {/* ── Canvas WebGL aurora ── */}
      <canvas
        ref={cvRef}
        aria-hidden
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          display: 'block',
        }}
      />

      {/* ── Ligne de scan ── */}
      <div style={{
        position: 'absolute', left: 0, right: 0, height: 1,
        background: 'linear-gradient(90deg,transparent,rgba(34,200,100,.35),transparent)',
        animation: 'aurora-scan 9s linear infinite',
        pointerEvents: 'none', zIndex: 2,
      }} />

      {/* ── Overlay foncé pour lisibilité du texte ── */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 3, pointerEvents: 'none',
        background: `linear-gradient(to bottom,
          rgba(3,8,6,${overlay}) 0%,
          rgba(3,8,6,${overlay * 0.3}) 35%,
          rgba(3,8,6,${overlay * 0.25}) 60%,
          rgba(3,8,6,${overlay * 0.9}) 100%)`,
      }} />

      {/* ── Badges flottants contextuels ── */}
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
            border: '1px solid rgba(34,200,100,.28)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 0 16px rgba(34,200,100,.12)',
            pointerEvents: 'none',
          }}
        >
          <span style={{
            width: 6, height: 6, borderRadius: '50%',
            background: '#22c864',
            boxShadow: '0 0 6px rgba(34,200,100,.8)',
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

      {/* ── Keyframe scan injectée une fois ── */}
      <style>{`
        @keyframes aurora-scan {
          0%   { top: -2%; }
          100% { top: 104%; }
        }
      `}</style>
    </div>
  )
}
