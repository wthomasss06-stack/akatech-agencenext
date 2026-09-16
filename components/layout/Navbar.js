'use client'
import { usePathname } from 'next/navigation'
import CardNav from './CardNav'
import StaggeredMenu from './StaggeredMenu'
import { useLanguage } from '@/lib/language'

const NAV_LINKS = [
  { key: 'home', href: '/' },
  { key: 'about', href: '/about' },
  { key: 'services', href: '/services' },
  { key: 'projects', href: '/projects' },
  { key: 'blog', href: '/blog' },
]

export default function Navbar() {
  const pathname = usePathname()
  const { t } = useLanguage()
  const translatedLinks = NAV_LINKS.map(link => ({ ...link, label: t(link.key) }))

  const isActive = (href) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  if (pathname?.startsWith('/explorer')) return null

  return (
    <>
      <style>{`
        .nav-desktop-only { display: block; }
        .nav-mobile-only  { display: none; }
        @media (max-width: 920px) {
          .nav-desktop-only { display: none; }
          .nav-mobile-only  {
            display: block;
          }
        }
      `}</style>

      {/* ── Desktop : Card-Nav (port du mockup HTML) ── */}
      <div className="nav-desktop-only">
        <CardNav />
      </div>

      {/* ── Mobile : Staggered Menu (port du portfolio) ── */}
      <div className="nav-mobile-only">
        <StaggeredMenu items={translatedLinks} isActive={isActive} />
      </div>
    </>
  )
}
