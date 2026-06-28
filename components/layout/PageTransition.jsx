'use client'
/**
 * PageTransition.jsx — AKATech
 * ─────────────────────────────────────────────────────────
 * Transition "Vertical Strip" — port du projet barba-js
 * "vertical-strip-transition-10" (inspiré Inkfish/SOTD),
 * adapté Next.js 14 App Router (au lieu de Barba.js).
 *
 * Mécanique (identique à l'original, juste le déclencheur qui
 * change) : une grille plein écran de cellules (8 colonnes × 5
 * lignes desktop, 4×7 mobile), chacune une simple div de couleur
 * unie. Chaque cellule est animée individuellement via
 * clip-path: inset(), en stagger aléatoire :
 *   - IN  (couvre l'écran) : inset(101% 0% 0% 0%) → inset(0% 0% 0% 0%)
 *     la cellule "descend" depuis le haut jusqu'à occuper sa
 *     case en entier.
 *   - OUT (révèle la page) : inset(0% 0% 0% 0%) → inset(0% 0% 101% 0%)
 *     la cellule continue son mouvement et s'enfonce hors écran
 *     par le bas, révélant le contenu derrière elle.
 * Le tout en une seule teinte unie (vert AKATech), pas d'alternance
 * de couleurs entre cellules.
 *
 * Différence avec Barba.js (qui swap lui-même le container DOM) :
 *   - Ici, au midpoint (grille 100% IN, écran totalement couvert),
 *     on déclenche router.push(href) : Next démonte/remonte la
 *     page. On attend la confirmation que la nouvelle route est
 *     montée (changement de pathname) + une marge de sécurité
 *     avant de lancer le OUT, pour ne jamais laisser apparaître
 *     un flash de l'ancienne page ou un trou pendant le chargement
 *     RSC.
 *
 * Usage :
 *   <PageTransitionProvider> ... </PageTransitionProvider>  (dans layout.js)
 *   const navigate = useNavTransition()
 *   navigate('/about')   → à utiliser à la place de router.push direct
 *                           sur tous les liens internes (CardNav,
 *                           StaggeredMenu, Footer).
 *
 * Le hook gère lui-même les clics : si la cible est externe
 * (http..., mailto:, tel:, target=_blank) il faut laisser le
 * <a> natif faire son travail — ne PAS appeler navigate() dans
 * ce cas (voir les wrappers de nav qui filtrent déjà ce cas).
 */

import { createContext, useCallback, useContext, useEffect, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { gsap } from 'gsap'
import './PageTransition.css'

/* ── Grille ── */
const GRID_COLS_DESKTOP = 8
const GRID_ROWS_DESKTOP = 5
const GRID_COLS_MOBILE  = 4
const GRID_ROWS_MOBILE  = 7
const MOBILE_BREAKPOINT = 720

/* ── Timings (calqués sur l'original blocksIn/blocksOut) ── */
const IN_DUR   = 1.1
const IN_STAG  = 0.6
const OUT_DUR  = 1.0
const OUT_STAG = 0.6
const EASE_IN  = 'power3.inOut'
const EASE_OUT = 'power4.inOut'

/* Délai de sécurité après détection du changement de pathname,
   pour laisser le nouveau contenu (images, layout) se stabiliser
   sous la grille avant de l'OUT. */
const SETTLE_MS = 120
/* Garde-fou : si jamais le pathname ne change pas (lien vers la
   page courante, erreur de navigation), on déclenche le OUT quand
   même après ce délai max pour ne jamais bloquer l'UI. */
const MAX_WAIT_MS = 1800

const PageTransitionCtx = createContext(null)

function gridSize() {
  if (typeof window === 'undefined') return { cols: GRID_COLS_DESKTOP, rows: GRID_ROWS_DESKTOP }
  const mobile = window.innerWidth <= MOBILE_BREAKPOINT
  return mobile
    ? { cols: GRID_COLS_MOBILE, rows: GRID_ROWS_MOBILE }
    : { cols: GRID_COLS_DESKTOP, rows: GRID_ROWS_DESKTOP }
}

export function PageTransitionProvider({ children }) {
  const router = useRouter()
  const pathname = usePathname()

  const layerRef = useRef(null)
  const blocksRef = useRef([])
  const runningRef = useRef(false)
  const pendingTargetPathRef = useRef(null)
  const settledRef = useRef(null) // callback à appeler quand la route a changé

  /* ── Construit (une fois) le layer + sa grille de cellules, jamais
     retiré du DOM entre deux transitions : on la laisse hors-écran
     (inset 101% en haut) en idle. ── */
  useEffect(() => {
    const { cols, rows } = gridSize()
    const layer = document.createElement('div')
    layer.className = 'aka-pt-layer'
    layer.style.gridTemplateColumns = `repeat(${cols}, minmax(0, 1fr))`

    const blocks = []
    for (let i = 0; i < cols * rows; i++) {
      const block = document.createElement('div')
      block.className = 'aka-pt-block'
      layer.appendChild(block)
      blocks.push(block)
    }
    gsap.set(blocks, { clipPath: 'inset(101% 0% 0% 0%)' })

    document.body.appendChild(layer)
    layerRef.current = layer
    blocksRef.current = blocks

    return () => { layer.remove() }
  }, [])

  /* ── Quand la route change réellement (Next a fini de naviguer),
     on prévient le runner qui attend ce signal pour lancer le OUT. ── */
  useEffect(() => {
    if (settledRef.current && pathname === pendingTargetPathRef.current) {
      const cb = settledRef.current
      settledRef.current = null
      cb()
    }
  }, [pathname])

  const runTransition = useCallback((href) => {
    if (runningRef.current) return
    if (!href || href === pathname) return

    runningRef.current = true
    /* On ne garde que le path (sans query/hash) pour la comparaison
       avec usePathname(), qui ne renvoie jamais ces deux parties. */
    pendingTargetPathRef.current = href.split('?')[0].split('#')[0]

    const blocks = blocksRef.current
    if (!blocks.length) {
      // Sécurité : layer pas encore prêt → navigation directe sans effet
      router.push(href)
      runningRef.current = false
      return
    }

    function playOut() {
      gsap.to(blocks, {
        clipPath: 'inset(0% 0% 101% 0%)',
        duration: OUT_DUR,
        stagger: { amount: OUT_STAG, from: 'random' },
        ease: EASE_OUT,
        onComplete: () => {
          gsap.set(blocks, { clipPath: 'inset(101% 0% 0% 0%)' })
          runningRef.current = false
        },
      })
    }

    /* ── IN : la grille couvre l'écran en stagger aléatoire ── */
    gsap.to(blocks, {
      clipPath: 'inset(0% 0% 0% 0%)',
      duration: IN_DUR,
      stagger: { amount: IN_STAG, from: 'random' },
      ease: EASE_IN,
      onComplete: () => {
        /* ── Midpoint : écran entièrement couvert → on lance la navigation ── */
        router.push(href)

        let settled = false
        const fireOut = () => {
          if (settled) return
          settled = true
          playOut()
        }

        // Le useEffect ci-dessus appellera settledRef.current dès que
        // pathname === pendingTargetPathRef.current. On y ajoute la
        // marge SETTLE_MS avant de réellement lancer le OUT.
        settledRef.current = () => setTimeout(fireOut, SETTLE_MS)
        // Garde-fou anti-blocage si le pathname ne change jamais
        setTimeout(fireOut, MAX_WAIT_MS)
      },
    })
  }, [pathname, router])

  return (
    <PageTransitionCtx.Provider value={runTransition}>
      {children}
    </PageTransitionCtx.Provider>
  )
}

/**
 * useNavTransition — retourne navigate(href).
 * À appeler dans le onClick d'un lien interne à la place de
 * laisser le <Link> Next.js naviguer normalement :
 *
 *   <Link href={href} onClick={(e) => { e.preventDefault(); navigate(href) }}>
 */
export function useNavTransition() {
  const ctx = useContext(PageTransitionCtx)
  if (!ctx) {
    // Pas de provider monté (ne devrait pas arriver, RootLayout le monte
    // toujours) → fallback navigation native silencieuse.
    return (href) => { window.location.href = href }
  }
  return ctx
}
