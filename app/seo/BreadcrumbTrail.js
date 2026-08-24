'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const PUBLIC_LABELS = {
  services: 'Services',
  projects: 'Réalisations',
  pricing: 'Tarifs',
  about: 'À propos',
  contact: 'Contact',
  blog: 'Blog',
  explorer: 'Explorer les projets',
}

function labelFromSegment(segment) {
  return PUBLIC_LABELS[segment] || decodeURIComponent(segment).replace(/-/g, ' ')
}

export default function BreadcrumbTrail() {
  const pathname = usePathname()
  const segments = pathname.split('/').filter(Boolean)

  if (!segments.length || pathname.startsWith('/dashboard') || pathname.startsWith('/api')) return null

  let currentPath = ''

  return (
    <nav aria-label="Fil d’Ariane" style={{ background: 'var(--bg-dark, #070908)', borderBottom: '1px solid rgba(136,202,83,.14)' }}>
      <ol style={{ maxWidth: 1200, margin: '0 auto', padding: '.65rem 5%', display: 'flex', gap: '.45rem', listStyle: 'none', alignItems: 'center', overflowX: 'auto', fontFamily: "'JetBrains Mono', monospace", fontSize: '.68rem', letterSpacing: '.035em', whiteSpace: 'nowrap' }}>
        <li><Link href="/" style={{ color: '#88ca53', textDecoration: 'none' }}>Accueil</Link></li>
        {segments.map((segment, index) => {
          currentPath += `/${segment}`
          const isCurrent = index === segments.length - 1
          return (
            <li key={currentPath} style={{ display: 'flex', gap: '.45rem', alignItems: 'center' }}>
              <span aria-hidden="true" style={{ color: 'rgba(255,255,255,.28)' }}>›</span>
              {isCurrent ? (
                <span aria-current="page" style={{ color: 'rgba(255,255,255,.68)' }}>{labelFromSegment(segment)}</span>
              ) : (
                <Link href={currentPath} style={{ color: '#88ca53', textDecoration: 'none' }}>{labelFromSegment(segment)}</Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
