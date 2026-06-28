'use client'
import { useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { gsap } from 'gsap'

/**
 * Loader — AKATech
 * ─────────────────────────────────────────────────────────
 * Sortie du loader en deux variantes :
 *
 *  - Sur la page d'accueil ('/') : "Éclosion Organique", en
 *    séquence stricte :
 *      1. Barre de progression atteint 100%
 *      2. Le blob (vert, bords organiques) apparaît PETIT,
 *         juste sous le logo — pas encore centré écran
 *      3. Bref instant où logo + blob coexistent à l'écran
 *      4. Le logo (+ texte + barre) disparaît
 *      5. Le blob grossit et se recentre jusqu'à couvrir tout
 *         l'écran (border-radius → 0%), même mécanique que la
 *         section 09 "Éclosion Organique" du master_scroll_engine
 *      6. Le blob se dissipe → révèle le Hero déjà monté dessous
 *
 *  - Sur toute autre route : fade + scale classique (inchangé),
 *    le blob n'a de sens narratif que sur la home (qui a un Hero
 *    à révéler juste en dessous).
 */

/* Phases (home only, après la phase de chargement) :
   'loading'   → barre en cours
   'done'      → barre à 100%, ping ring sur le logo
   'blob-in'   → le blob apparaît sous le logo
   'collapse'  → logo/texte/barre disparaissent, blob grossit
*/
const HOME_PHASE_DELAYS = {
  done: 1050,        // barre atteint 100%
  blobIn: 1350,      // 300ms après "done" : le blob apparaît sous le logo
  collapse: 1900,    // 550ms après blob-in : le blob a fini d'apparaître
                      // (transition Framer Motion du blob = 450ms) + un
                      // court instant où logo et blob coexistent à l'écran,
                      // puis le logo disparaît et le blob commence à grossir
}

export default function Loader() {
  const pathname = usePathname()
  const isHome = pathname === '/'

  const [visible, setVisible] = useState(true)
  const [progress, setProgress] = useState(0)
  const [phase, setPhase] = useState(0) // 0=loading, 1=done, 2=exit (non-home)
  const [homePhase, setHomePhase] = useState('loading')

  const bloomRef = useRef(null)
  const contentRef = useRef(null)

  /* ── Progress bar (identique pour toutes les routes) ── */
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

    if (isHome) {
      setTimeout(() => setHomePhase('done'),     HOME_PHASE_DELAYS.done)
      setTimeout(() => setHomePhase('blob-in'),  HOME_PHASE_DELAYS.blobIn)
      setTimeout(() => setHomePhase('collapse'), HOME_PHASE_DELAYS.collapse)
    } else {
      setTimeout(() => setPhase(1), 1050)
      setTimeout(() => setPhase(2), 1500)
      setTimeout(() => setVisible(false), 1900)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /* ── Étape "collapse" → grossissement plein écran puis dissipation ── */
  useEffect(() => {
    if (!isHome || homePhase !== 'collapse') return
    const bloom = bloomRef.current
    const content = contentRef.current
    if (!bloom) { setVisible(false); return }

    const tl = gsap.timeline({
      onComplete: () => setVisible(false),
    })

    // Taille en pixels nécessaire pour couvrir tout l'écran depuis sa
    // position de départ (sous le logo) — plus fiable que d'animer des
    // vw/vh bruts en GSAP (interpolation directe en px, aucune surprise
    // de calcul de layout par le navigateur en cours de tween).
    const coverSize = Math.max(window.innerWidth, window.innerHeight) * 2.6

    // 1) Logo + texte + barre s'effacent — le blob va de toute façon
    //    les recouvrir, mais on évite qu'ils restent visibles "à
    //    travers" pendant l'agrandissement.
    if (content) {
      tl.to(content, { opacity: 0, duration: 0.3, ease: 'power2.in' }, 0)
    }

    // 2) Le blob se recentre sur l'écran (il était décalé sous le logo)
    //    et grossit en perdant ses bords organiques — mécanique
    //    identique à .blob-mask / tlBlob du master_scroll_engine.
    tl.to(bloom, {
      top: '50%',
      width: coverSize,
      height: coverSize,
      borderRadius: '0%',
      duration: 0.9,
      ease: 'power3.inOut',
    }, 0.15)

    // 3) Une fois l'écran entièrement recouvert de vert, on dissipe le
    //    calque pour révéler le Hero déjà monté en dessous.
    tl.to(bloom, {
      opacity: 0,
      duration: 0.45,
      ease: 'power2.out',
    }, '+=0.05')

    return () => tl.kill()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHome, homePhase])

  if (!visible) return null

  // Sur la home, le wrapper reste monté pendant toute la phase "collapse" :
  // c'est la timeline GSAP (onComplete → setVisible(false)) qui retire le
  // loader du DOM, pas AnimatePresence. Si on démontait ici, bloomRef
  // disparaîtrait avant que GSAP n'ait eu la main pour l'animer.
  const stillShowing = isHome ? true : phase < 2

  return (
    <AnimatePresence>
      {stillShowing && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={isHome ? { opacity: 1 } : { opacity: 0, scale: 1.04 }}
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

          <div ref={contentRef} style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '0 2rem', width: '100%', maxWidth: 400 }}>

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
                {(phase === 1 || homePhase === 'done' || homePhase === 'blob-in') && (
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
                style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, fontSize: '.85rem', color: 'rgba(136,202,83,.7)', letterSpacing: '.15em', textTransform: 'uppercase', marginTop: 4 }}
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
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.65rem', color: 'rgba(255,255,255,.3)', letterSpacing: '.08em' }}>
                  {(phase === 1 || homePhase === 'done' || homePhase === 'blob-in') ? '// Prêt ✓' : '// Chargement...'}
                </span>
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '1rem', fontWeight: 800, color: '#88ca53', letterSpacing: '.05em' }}>
                  {progress}%
                </span>
              </div>
            </motion.div>
          </div>

          {/* Blob d'éclosion organique — home uniquement.
              Démarre invisible (scale 0) juste sous le logo, n'apparaît
              qu'à la phase "blob-in" (après barre 100%), puis se recentre
              et grossit à la phase "collapse". */}
          {isHome && (
            <motion.div
              ref={bloomRef}
              aria-hidden="true"
              initial={{ opacity: 0, scale: 0 }}
              animate={
                homePhase === 'blob-in' || homePhase === 'collapse'
                  ? { opacity: 1, scale: 1 }
                  : { opacity: 0, scale: 0 }
              }
              transition={{ duration: 0.45, ease: [.34, 1.56, .64, 1] }}
              style={{
                position: 'absolute',
                /* Juste sous le logo : le bloc logo+texte+barre est centré,
                   le logo occupe environ les ~150px du haut de ce bloc —
                   on positionne donc le blob un peu plus bas que le centre
                   écran pour qu'il apparaisse sous le cercle du logo. */
                top: 'calc(50% + 130px)',
                left: '50%',
                width: '7vw', height: '7vw',
                minWidth: 70, minHeight: 70,
                x: '-50%', y: '-50%',
                borderRadius: '67% 33% 47% 53% / 37% 20% 80% 63%',
                background: 'linear-gradient(135deg, #5f9137, #88ca53 55%, #b3ee85)',
                boxShadow: '0 0 90px rgba(136,202,83,.5)',
                zIndex: 2,
                pointerEvents: 'none',
                willChange: 'width, height, top, border-radius, opacity, transform',
              }}
            />
          )}

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
