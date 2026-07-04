'use client'
/**
 * BlobTransition.jsx — AKATech
 * ─────────────────────────────────────────────────────────
 * Transition "Éclosion Organique" — même mécanique visuelle que
 * le Loader de la home (anneau organique + trou percé au mask
 * radial-gradient dans un calque fond+grid+glow), mais généralisée
 * pour tourner À LA DEMANDE et DANS LES DEUX SENS. Utilisée pour
 * entrer/sortir du mode Explorer (toggle du header, desktop).
 *
 *  1. COUVRIR : l'anneau apparaît à l'origine du clic, une zone
 *     opaque grossit depuis ce point jusqu'à couvrir tout l'écran
 *     (mask inversé : opaque au centre, transparent au bord).
 *  2. Une fois l'écran totalement couvert → router.push(href),
 *     on attend la confirmation que la nouvelle route est montée
 *     (même garde-fou que PageTransition : SETTLE_MS + MAX_WAIT_MS).
 *  3. RÉVÉLER : exactement le mécanisme du Loader — un trou
 *     transparent grossit depuis la même origine, la nouvelle page
 *     apparaît à travers en direct, puis l'anneau s'efface.
 *
 * Usage :
 *   <BlobTransitionProvider> ... </BlobTransitionProvider>  (layout.js)
 *   const navigate = useBlobTransition()
 *   navigate('/explorer/', event)   // event optionnel → origine = clic
 */
import { createContext, useCallback, useContext, useEffect, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { gsap } from 'gsap'

const SETTLE_MS   = 140
const MAX_WAIT_MS = 2200
const FEATHER = 70
const ORGANIC_RADIUS = '67% 33% 47% 53% / 37% 20% 80% 63%'

const BlobCtx = createContext(null)

export function BlobTransitionProvider({ children }) {
  const router = useRouter()
  const pathname = usePathname()

  const layerRef = useRef(null)
  const ringRef = useRef(null)
  const runningRef = useRef(false)
  const pendingTargetPathRef = useRef(null)
  const settledRef = useRef(null)

  /* ── Construit une fois le calque + l'anneau, jamais retirés du
     DOM entre deux transitions (display:none en idle). ── */
  useEffect(() => {
    const layer = document.createElement('div')
    layer.className = 'aka-blob-layer'
    Object.assign(layer.style, {
      position: 'fixed', inset: '0', zIndex: '99998',
      background: '#030806', display: 'none', pointerEvents: 'none',
      overflow: 'hidden',
    })

    const grid = document.createElement('div')
    Object.assign(grid.style, {
      position: 'absolute', inset: '0',
      backgroundImage: 'linear-gradient(rgba(136,202,83,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(136,202,83,.04) 1px,transparent 1px)',
      backgroundSize: '48px 48px',
    })
    layer.appendChild(grid)

    const glow = document.createElement('div')
    Object.assign(glow.style, {
      position: 'absolute', top: '50%', left: '50%',
      transform: 'translate(-50%,-50%)',
      width: 'min(600px, 90vw)', height: 'min(600px, 90vw)',
      borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(136,202,83,.12) 0%, transparent 65%)',
    })
    layer.appendChild(glow)

    const ring = document.createElement('div')
    ring.className = 'aka-blob-ring'
    Object.assign(ring.style, {
      position: 'fixed', width: '70px', height: '70px',
      minWidth: '70px', minHeight: '70px',
      transform: 'translate(-50%,-50%)',
      borderRadius: ORGANIC_RADIUS,
      background: 'transparent',
      border: '2px solid rgba(136,202,83,.55)',
      boxShadow: '0 0 60px 10px rgba(136,202,83,.45), inset 0 0 40px rgba(136,202,83,.25)',
      pointerEvents: 'none',
      opacity: '0',
    })
    layer.appendChild(ring)

    document.body.appendChild(layer)
    layerRef.current = layer
    ringRef.current = ring

    return () => layer.remove()
  }, [])

  /* ── Quand la route change réellement, on prévient le runner qui
     attend ce signal pour lancer la phase RÉVÉLER. ── */
  useEffect(() => {
    if (settledRef.current && pathname === pendingTargetPathRef.current) {
      const cb = settledRef.current
      settledRef.current = null
      cb()
    }
  }, [pathname])

  const navigate = useCallback((href, evt) => {
    if (runningRef.current) return
    if (!href || href === pathname) return

    const layer = layerRef.current
    const ring = ringRef.current
    if (!layer || !ring) { router.push(href); return }

    runningRef.current = true
    pendingTargetPathRef.current = href.split('?')[0].split('#')[0]

    const ox = evt?.clientX ?? window.innerWidth / 2
    const oy = evt?.clientY ?? window.innerHeight / 2
    const coverSize = Math.max(window.innerWidth, window.innerHeight) * 2.6

    ring.style.left = `${ox}px`
    ring.style.top = `${oy}px`

    function applyMask(radius, mode) {
      const mask = mode === 'cover'
        ? `radial-gradient(circle at ${ox}px ${oy}px, #000 ${radius}px, transparent ${radius + FEATHER}px)`
        : `radial-gradient(circle at ${ox}px ${oy}px, transparent ${radius}px, #000 ${radius + FEATHER}px)`
      layer.style.maskImage = mask
      layer.style.WebkitMaskImage = mask
      const ringSize = Math.max(radius * 2, 70)
      ring.style.width = `${ringSize}px`
      ring.style.height = `${ringSize}px`
      ring.style.borderRadius = radius > coverSize * 0.4 ? '0%' : ORGANIC_RADIUS
    }

    // État initial : écran pas encore couvert, anneau minuscule à l'origine
    applyMask(0, 'cover')
    layer.style.display = 'block'
    gsap.set(ring, { opacity: 0, scale: 0 })
    gsap.to(ring, { opacity: 1, scale: 1, duration: 0.35, ease: 'power1.out' })

    // 1) COUVRIR — la zone opaque grossit depuis le clic
    const coverState = { radius: 0 }
    gsap.to(coverState, {
      radius: coverSize,
      duration: 0.95,
      ease: 'power2.inOut',
      onUpdate: () => applyMask(coverState.radius, 'cover'),
      onComplete: () => {
        // 2) Midpoint : écran totalement couvert → navigation réelle
        router.push(href)

        let settled = false
        const fireReveal = () => {
          if (settled) return
          settled = true
          playReveal()
        }
        settledRef.current = () => setTimeout(fireReveal, SETTLE_MS)
        setTimeout(fireReveal, MAX_WAIT_MS) // garde-fou anti-blocage
      },
    })

    // 3) RÉVÉLER — mécanique identique au Loader : le trou grossit
    //    depuis la même origine, la nouvelle page apparaît à travers.
    function playReveal() {
      applyMask(0, 'reveal')
      const revealState = { radius: 0 }
      gsap.to(revealState, {
        radius: coverSize,
        duration: 1.05,
        ease: 'power2.inOut',
        onUpdate: () => applyMask(revealState.radius, 'reveal'),
        onComplete: () => {
          gsap.to(ring, {
            opacity: 0,
            duration: 0.5,
            ease: 'power2.out',
            onComplete: () => {
              layer.style.display = 'none'
              runningRef.current = false
            },
          })
        },
      })
    }
  }, [pathname, router])

  return <BlobCtx.Provider value={navigate}>{children}</BlobCtx.Provider>
}

/**
 * useBlobTransition — retourne navigate(href, event).
 * Passer l'event du clic pour que l'anneau parte de sa position ;
 * sans event, l'origine par défaut est le centre de l'écran.
 */
export function useBlobTransition() {
  const ctx = useContext(BlobCtx)
  if (!ctx) return (href) => { window.location.href = href }
  return ctx
}
