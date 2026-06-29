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
 *      1. Le compteur défile de 0 à 100, lentement (~4.5s
 *         au total) — pas de barre, juste le chiffre, gros,
 *         centré sous le logo
 *      2. Une fois à 100% : logo + texte + compteur s'effacent
 *         lentement (1.1s) PENDANT qu'un anneau organique (vert,
 *         bords organiques, transparent à l'intérieur) apparaît
 *         EN MÊME TEMPS, déjà centré sur l'écran
 *      3. L'anneau continue de grossir lentement en perdant ses
 *         bords organiques (border-radius → 0%). Il ne remplit
 *         plus l'écran de couleur : un vrai trou transparent est
 *         percé dans le fond du loader (mask-image sur bgLayer,
 *         recalé à chaque frame sur la taille réelle de l'anneau)
 *         — le Hero, déjà monté en dessous, devient visible À
 *         TRAVERS en direct, pendant que ça grossit
 *      4. Le trou couvre tout l'écran → on efface juste le glow
 *         de l'anneau, le Hero est déjà 100% révélé
 *
 *  - Sur toute autre route : fade + scale classique (inchangé),
 *    l'anneau n'a de sens narratif que sur la home (qui a un Hero
 *    à révéler juste en dessous).
 */

/* Phases (home only, après la phase de comptage) :
   'loading'   → compteur en cours
   'done'      → compteur à 100, ping ring sur le logo
   'collapse'  → logo/texte/compteur disparaissent ET le blob
                 apparaît (centré) puis grossit, simultanément
*/
const HOME_PHASE_DELAYS = {
  done: 4900,        // compteur atteint 100 (~5s au total)
  collapse: 5350,    // ~450ms après le 100 : "Prêt ✓" visible un instant, puis collapse
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
  const bgLayerRef = useRef(null) // calque fond+grid+glow, percé par un mask au moment du collapse
  const progressRef = useRef(0)  // ref pour éviter le closure stale dans les steps

  /* ── Compteur 0 → 100, ralenti (~2.5s au total) ── */
  useEffect(() => {
    const steps = isHome
      ? [
          { target: 15, delay: 0,    duration: 950  },
          { target: 35, delay: 1000, duration: 1050 },
          { target: 58, delay: 2100, duration: 1050 },
          { target: 82, delay: 3200, duration: 850  },
          { target: 100, delay: 4100, duration: 650 },
        ]
      : [
          { target: 30, delay: 0,   duration: 200 },
          { target: 65, delay: 200, duration: 280 },
          { target: 88, delay: 480, duration: 200 },
          { target: 100, delay: 680, duration: 150 },
        ]

    steps.forEach(({ target, delay, duration }) => {
      setTimeout(() => {
        const start = Date.now()
        const startVal = progressRef.current   // ← lit la valeur RÉELLE au moment du départ
        const tick = () => {
          const elapsed = Date.now() - start
          const t = Math.min(elapsed / duration, 1)
          const ease = 1 - Math.pow(1 - t, 3)
          const next = Math.round(startVal + (target - startVal) * ease)
          progressRef.current = next
          setProgress(next)
          if (t < 1) requestAnimationFrame(tick)
        }
        tick()
      }, delay)
    })

    if (isHome) {
      setTimeout(() => setHomePhase('done'),     HOME_PHASE_DELAYS.done)
      setTimeout(() => setHomePhase('collapse'), HOME_PHASE_DELAYS.collapse)
    } else {
      setTimeout(() => setPhase(1), 750)
      setTimeout(() => setPhase(2), 1100)
      setTimeout(() => setVisible(false), 1450)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /* ── Étape "collapse" → contenu disparaît + un trou transparent
     s'ouvre au centre de l'écran et grossit : le Hero (déjà monté en
     dessous, le fond du loader étant percé par un mask) devient visible
     À TRAVERS dès le début, pas seulement à la fin. L'ancien blob plein
     devient un simple anneau / glow vert qui trace le bord du trou. ── */
  useEffect(() => {
    if (!isHome || homePhase !== 'collapse') return
    const bloom = bloomRef.current
    const content = contentRef.current
    const bgLayer = bgLayerRef.current
    if (!bloom) { setVisible(false); return }

    const tl = gsap.timeline({
      onComplete: () => setVisible(false),
    })

    // Taille en pixels nécessaire pour couvrir tout l'écran depuis le
    // centre — plus fiable que d'animer des vw/vh bruts en GSAP
    // (interpolation directe en px, aucune surprise de calcul de
    // layout par le navigateur en cours de tween).
    const coverSize = Math.max(window.innerWidth, window.innerHeight) * 2.6
    const FEATHER = 70 // px de fondu doux sur le bord du trou (avec le glow de l'anneau)

    // Le trou est un radial-gradient mask sur bgLayer (fond + grid + glow
    // orb + scan-line). On relit la taille RÉELLEMENT rendue du blob à
    // chaque frame via getBoundingClientRect — contrairement à
    // offsetWidth, ça tient compte du scale appliqué par GSAP, donc le
    // trou suit exactement l'anneau, qu'il soit en train d'apparaître
    // (scale 0→1) ou de grossir (width/height).
    const syncHole = () => {
      if (!bgLayer) return
      const r = bloom.getBoundingClientRect()
      const radius = Math.max(r.width, r.height) / 2
      const mask = `radial-gradient(circle at 50% 50%, transparent ${radius}px, #000 ${radius + FEATHER}px)`
      bgLayer.style.maskImage = mask
      bgLayer.style.WebkitMaskImage = mask
    }
    tl.eventCallback('onUpdate', syncHole)

    // 1) Logo + texte + compteur s'effacent lentement...
    if (content) {
      tl.to(content, { opacity: 0, duration: 1.1, ease: 'power1.inOut' }, 0)
    }

    // 2) ...EN MÊME TEMPS que l'anneau apparaît, déjà centré sur l'écran
    //    (plus de décalage sous le logo). Comme syncHole tourne en
    //    continu, le trou s'ouvre déjà à cet instant, en synchro.
    tl.fromTo(bloom,
      { opacity: 0, scale: 0 },
      { opacity: 1, scale: 1, duration: 1.1, ease: 'power1.inOut' },
      0
    )

    // 3) L'anneau continue de grossir en perdant ses bords organiques —
    //    et le trou transparent grandit avec lui : le Hero apparaît à
    //    travers en direct, sans attendre la fin.
    tl.to(bloom, {
      width: coverSize,
      height: coverSize,
      borderRadius: '0%',
      duration: 1.6,
      ease: 'power2.inOut',
    }, 0.3)

    // 4) coverSize dépasse largement la diagonale de l'écran : à ce
    //    stade le trou couvre déjà tout, le Hero est 100% visible. On
    //    efface juste l'anneau / le glow restant.
    tl.to(bloom, {
      opacity: 0,
      duration: 0.6,
      ease: 'power2.out',
    }, '+=0.1')

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
            background: 'transparent',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          {/* Calque fond — couleur + grid + glow + scan-line. C'est CE
              calque qui se fait percer d'un trou transparent pendant le
              collapse (via mask-image), pas le wrapper racine : du coup
              le Hero (monté en dessous, derrière tout ça) devient
              visible à travers le trou dès qu'il s'ouvre. */}
          <div ref={bgLayerRef} style={{ position: 'absolute', inset: 0, background: '#030806' }}>
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

            {/* Bottom scan line */}
            <div style={{
              position: 'absolute', left: 0, right: 0, height: 1,
              background: 'linear-gradient(90deg,transparent,rgba(136,202,83,.4),transparent)',
              animation: 'scan-line 2s ease-in-out infinite',
              pointerEvents: 'none',
            }} />
          </div>

          <div ref={contentRef} style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '0 2rem', width: '100%', maxWidth: 400 }}>

            {/* Logo image */}
            <motion.div
              initial={{ opacity: 0, scale: .6, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: .6, ease: [.22,1,.36,1] }}
              style={{ marginBottom: '2rem' }}
            >
              <div style={{ position: 'relative', width: 220, height: 220, margin: '0 auto 1rem' }}>
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
                {(phase === 1 || homePhase === 'done') && (
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
                Agence Digitale 
              </motion.div>
            </motion.div>

            {/* Compteur 0 → 100, sans barre */}
            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: .3 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}
            >
              <span style={{
                fontFamily: "'JetBrains Mono',monospace", fontWeight: 800,
                fontSize: '2.6rem', lineHeight: 1, color: '#88ca53',
                letterSpacing: '.02em', textShadow: '0 0 24px rgba(136,202,83,.5)',
              }}>
                {progress}<span style={{ fontSize: '1.2rem', opacity: .6, marginLeft: 2 }}>%</span>
              </span>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.65rem', color: 'rgba(255,255,255,.3)', letterSpacing: '.08em' }}>
                {(phase === 1 || homePhase === 'done') ? '// Prêt ✓' : '// Chargement...'}
              </span>
            </motion.div>
          </div>

          {/* Anneau d'éclosion organique — home uniquement.
              Invisible (scale 0) jusqu'à la phase "collapse" : à ce
              moment, il apparaît DÉJÀ CENTRÉ sur l'écran, en même temps
              que le logo/texte/compteur s'effacent, puis grossit
              lentement jusqu'à couvrir tout l'écran. Plus de fill plein :
              transparent à l'intérieur (juste un trait + un glow vert),
              pour qu'on voie le Hero directement à travers pendant qu'il
              grossit — le trou réel est creusé dans bgLayer (cf. syncHole
              dans l'effet "collapse"), cet anneau n'est que la garniture
              visuelle qui trace son bord. */}
          {isHome && (
            <div
              ref={bloomRef}
              aria-hidden="true"
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: '7vw', height: '7vw',
                minWidth: 70, minHeight: 70,
                opacity: 0,
                transform: 'translate(-50%, -50%) scale(0)',
                borderRadius: '67% 33% 47% 53% / 37% 20% 80% 63%',
                background: 'transparent',
                border: '2px solid rgba(136,202,83,.55)',
                boxShadow: '0 0 60px 10px rgba(136,202,83,.45), inset 0 0 40px rgba(136,202,83,.25)',
                zIndex: 2,
                pointerEvents: 'none',
                willChange: 'width, height, border-radius, opacity, transform',
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

        </motion.div>
      )}
    </AnimatePresence>
  )
}