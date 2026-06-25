'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Loader() {
  const [visible, setVisible] = useState(true)
  const [progress, setProgress] = useState(0)
  const [phase, setPhase] = useState(0) // 0=loading, 1=done, 2=exit

  useEffect(() => {
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
            backgroundImage: 'linear-gradient(rgba(136,202,83,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(136,202,83,.04) 1px,transparent 1px)',
            backgroundSize: '48px 48px',
          }} />

          {/* Glow orb */}
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%,-60%)',
            width: 'min(500px, 80vw)', height: 'min(500px, 80vw)',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(136,202,83,.12) 0%, transparent 65%)',
            animation: 'glow-pulse 2s ease-in-out infinite',
            pointerEvents: 'none',
          }} />

          <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '0 2rem', width: '100%', maxWidth: 400 }}>

            {/* Logo image */}
            <motion.div
              initial={{ opacity: 0, scale: .6, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: .6, ease: [.22,1,.36,1] }}
              style={{ marginBottom: '2.5rem' }}
            >
              <div style={{ position: 'relative', width: 150, height: 150, margin: '0 auto 1rem' }}>
                <motion.img
                  src="/images/logo.webp"
                  alt="AKATech"
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: .6, delay: .1, ease: [.22,1,.36,1] }}
                  style={{
                    width: '100%', height: '100%',
                    objectFit: 'contain',
                    filter: 'drop-shadow(0 0 24px rgba(136,202,83,.6))',
                    animation: 'akaGlowPulseImg 2s ease-in-out infinite',
                  }}
                />

                {/* Ping ring on complete */}
                {phase === 1 && (
                  <motion.div
                    initial={{ scale: 1, opacity: .6 }}
                    animate={{ scale: 2.2, opacity: 0 }}
                    transition={{ duration: .5 }}
                    style={{
                      position: 'absolute', inset: 0, borderRadius: '50%',
                      border: '2px solid rgba(136,202,83,.6)',
                    }}
                  />
                )}
              </div>

              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: .5 }}
                style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: '.85rem', color: 'rgba(136,202,83,.7)', letterSpacing: '.15em', textTransform: 'uppercase', marginTop: 4 }}
              >
                Agence Digitale · Abidjan
              </motion.div>
            </motion.div>

            {/* Progress bar */}
            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: .3 }}
            >
              <div style={{
                height: 3, borderRadius: 2,
                background: 'rgba(136,202,83,.12)',
                overflow: 'hidden', marginBottom: '.85rem',
                width: '100%',
              }}>
                <motion.div
                  style={{
                    height: '100%', borderRadius: 2,
                    background: 'linear-gradient(90deg,#5f9137,#88ca53,#b3ee85)',
                    width: `${progress}%`,
                    transition: 'width .15s ease',
                    boxShadow: '0 0 10px rgba(136,202,83,.6)',
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: "'Syne',sans-serif", fontSize: '.65rem', color: 'rgba(255,255,255,.3)', letterSpacing: '.08em' }}>
                  {phase === 1 ? '// Prêt ✓' : '// Chargement...'}
                </span>
                <span style={{ fontFamily: "'Syne',sans-serif", fontSize: '1rem', fontWeight: 800, color: '#88ca53', letterSpacing: '.05em' }}>
                  {progress}%
                </span>
              </div>
            </motion.div>
          </div>

          {/* CSS animations */}
          <style>{`
            @keyframes akaGlowPulseImg {
              0%,100% { filter: drop-shadow(0 0 12px rgba(136,202,83,.4)); }
              50%      { filter: drop-shadow(0 0 28px rgba(136,202,83,.85)); }
            }
            @keyframes glow-pulse {
              0%,100% { opacity: .6; }
              50%      { opacity: 1; }
            }
          `}</style>

          {/* Bottom scan line */}
          <div style={{
            position: 'absolute', left: 0, right: 0, height: 1,
            background: 'linear-gradient(90deg,transparent,rgba(136,202,83,.4),transparent)',
            animation: 'scan-line 2s ease-in-out infinite',
            pointerEvents: 'none',
          }} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
