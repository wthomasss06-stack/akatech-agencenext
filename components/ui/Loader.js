'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Loader() {
  const [visible, setVisible] = useState(true)
  const [progress, setProgress] = useState(0)
  const [phase, setPhase] = useState(0) // 0=loading, 1=done, 2=exit

  useEffect(() => {
    // Simulate fast loading progress
    const steps = [
      { target: 30, delay: 0,   duration: 300 },
      { target: 65, delay: 300, duration: 400 },
      { target: 88, delay: 700, duration: 300 },
      { target: 100, delay: 900, duration: 250 },
    ]

    steps.forEach(({ target, delay, duration }) => {
      setTimeout(() => {
        const start = Date.now()
        const startVal = progress
        const tick = () => {
          const elapsed = Date.now() - start
          const t = Math.min(elapsed / duration, 1)
          const ease = 1 - Math.pow(1 - t, 3)
          setProgress(Math.round(startVal + (target - startVal) * ease))
          if (t < 1) requestAnimationFrame(tick)
        }
        tick()
      }, delay)
    })

    // Phase transitions
    setTimeout(() => setPhase(1), 1050)
    setTimeout(() => setPhase(2), 1500)
    setTimeout(() => setVisible(false), 1900)
  }, [])

  if (!visible) return null

  return (
    <AnimatePresence>
      {phase < 2 && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: .4, ease: [.22,1,.36,1] }}
          style={{
            position: 'fixed', inset: 0, zIndex: 99999,
            background: '#030806',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          {/* Grid bg */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'linear-gradient(rgba(34,200,100,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(34,200,100,.04) 1px,transparent 1px)',
            backgroundSize: '48px 48px',
          }} />

          {/* Glow orb */}
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%,-60%)',
            width: 'min(500px, 80vw)', height: 'min(500px, 80vw)',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(34,200,100,.12) 0%, transparent 65%)',
            animation: 'glow-pulse 2s ease-in-out infinite',
            pointerEvents: 'none',
          }} />

          <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '0 2rem', width: '100%', maxWidth: 400 }}>

            {/* Logo mark */}
            <motion.div
              initial={{ opacity: 0, scale: .6, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: .6, ease: [.22,1,.36,1] }}
              style={{ marginBottom: '2.5rem' }}
            >
              {/* Animated A logo */}
              <div style={{ position: 'relative', width: 80, height: 80, margin: '0 auto 1.2rem' }}>
                <div style={{
                  width: 80, height: 80, borderRadius: 20,
                  background: 'linear-gradient(145deg,#0a1a0e,#0d2415)',
                  border: '1px solid rgba(34,200,100,.3)',
                  boxShadow: '0 0 40px rgba(34,200,100,.2), inset 0 1px 0 rgba(34,200,100,.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  animation: 'akaGlowPulse 2s ease-in-out infinite',
                }}>
                  <svg width={48} height={48} viewBox="0 0 28 28" fill="none">
                    <motion.path
                      d="M6 22 L14 6 L22 22"
                      stroke="#22c864" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"
                      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                      transition={{ duration: .6, delay: .2, ease: 'easeOut' }}
                    />
                    <motion.path
                      d="M9.5 17 L18.5 17"
                      stroke="#22c864" strokeWidth="2" strokeLinecap="round"
                      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                      transition={{ duration: .4, delay: .7, ease: 'easeOut' }}
                    />
                    <motion.circle
                      cx="22" cy="8" r="3"
                      fill="rgba(34,200,100,.2)" stroke="#22c864" strokeWidth="1.4"
                      initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: .9, type: 'spring', stiffness: 300, damping: 18 }}
                      style={{ transformOrigin: '22px 8px' }}
                    />
                    <motion.circle
                      cx="22" cy="8" r="1.3" fill="#22c864"
                      initial={{ scale: 0 }} animate={{ scale: 1 }}
                      transition={{ delay: 1, type: 'spring', stiffness: 400, damping: 18 }}
                      style={{ transformOrigin: '22px 8px' }}
                    />
                  </svg>
                </div>

                {/* Ping ring */}
                {phase === 1 && (
                  <motion.div
                    initial={{ scale: 1, opacity: .6 }}
                    animate={{ scale: 2.2, opacity: 0 }}
                    transition={{ duration: .5 }}
                    style={{
                      position: 'absolute', inset: 0, borderRadius: 20,
                      border: '2px solid rgba(34,200,100,.6)',
                    }}
                  />
                )}
              </div>

              {/* Brand name */}
              <motion.div
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: .4 }}
                style={{ fontFamily: "'Orbitron',sans-serif", fontWeight: 900, fontSize: 'clamp(1.4rem,5vw,1.8rem)', color: 'rgba(255,255,255,.9)', letterSpacing: '.05em' }}
              >
                AKATech
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: .6 }}
                style={{ fontFamily: "'Dancing Script',cursive", fontWeight: 700, fontSize: '1rem', color: 'rgba(34,200,100,.7)', letterSpacing: '.15em', textTransform: 'uppercase', marginTop: 4 }}
              >
                Agence Digitale · Abidjan
              </motion.div>
            </motion.div>

            {/* Progress bar */}
            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: .3 }}
            >
              {/* Track */}
              <div style={{
                height: 3, borderRadius: 2,
                background: 'rgba(34,200,100,.12)',
                overflow: 'hidden', marginBottom: '.85rem',
                width: '100%',
              }}>
                <motion.div
                  style={{
                    height: '100%', borderRadius: 2,
                    background: 'linear-gradient(90deg,#17a354,#22c864,#66ffaa)',
                    width: `${progress}%`,
                    transition: 'width .15s ease',
                    boxShadow: '0 0 10px rgba(34,200,100,.6)',
                  }}
                />
              </div>

              {/* Counter row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: "'Syne',sans-serif", fontSize: '.65rem', color: 'rgba(255,255,255,.3)', letterSpacing: '.08em' }}>
                  {phase === 1 ? '// Prêt ✓' : '// Chargement...'}
                </span>
                <span style={{ fontFamily: "'Dancing Script',cursive", fontSize: '1.4rem', fontWeight: 700, color: '#22c864', letterSpacing: '.05em' }}>
                  {progress}%
                </span>
              </div>
            </motion.div>
          </div>

          {/* Bottom scan line */}
          <div style={{
            position: 'absolute', left: 0, right: 0, height: 1,
            background: 'linear-gradient(90deg,transparent,rgba(34,200,100,.4),transparent)',
            animation: 'scan-line 2s ease-in-out infinite',
            pointerEvents: 'none',
          }} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
