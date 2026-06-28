'use client'
/**
 * TransitionLink — wrapper autour de next/link qui déclenche la
 * transition staircase (PageTransition.jsx) au lieu de la navigation
 * Next.js par défaut.
 *
 * Garde le comportement natif (clic milieu, ctrl/cmd+clic = nouvel
 * onglet, etc.) intact en ne court-circuitant QUE le clic gauche
 * simple, et seulement pour les liens internes (href commençant par
 * '/' ou '#').
 *
 * Utilisé par CardNav, StaggeredMenu et Footer à la place de <Link>
 * pour que toute navigation interne du site passe par la transition.
 */
import Link from 'next/link'
import { useNavTransition } from './PageTransition'

function isInternal(href) {
  return typeof href === 'string' && href.startsWith('/')
}

export default function TransitionLink({ href, onClick, children, ...rest }) {
  const navigate = useNavTransition()

  const handleClick = (e) => {
    // Laisse passer les clics spéciaux (nouvel onglet, etc.) et les
    // liens externes / ancres — comportement natif du <a>.
    const isSpecialClick = e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0
    if (!isInternal(href) || isSpecialClick) {
      onClick?.(e)
      return
    }

    e.preventDefault()
    onClick?.(e)
    navigate(href)
  }

  return (
    <Link href={href} onClick={handleClick} {...rest}>
      {children}
    </Link>
  )
}
