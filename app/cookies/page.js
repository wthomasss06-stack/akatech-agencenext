import CookiesClient from './CookiesClient'
import { BreadcrumbJsonLd } from '../seo/StructuredData'

export const metadata = {
  title: 'Cookies — AKATech | Gérer mes cookies',
  description: 'Les cookies utilisés par le site AKATech, ce que change votre choix, et un moyen de le modifier à tout moment.',
  alternates: { canonical: '/cookies' },
  openGraph: {
    title: 'Cookies — AKATech',
    description: 'Gérez vos préférences de cookies et consultez la liste de ceux utilisés par le site.',
    locale: 'fr_CI',
    type: 'website',
    siteName: 'AKATech',
    url: 'https://akatech.vercel.app/cookies',
  },
}

export default function Page() {
  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: 'Accueil', url: 'https://akatech.vercel.app/' },
        { name: 'Cookies', url: 'https://akatech.vercel.app/cookies' },
      ]} />
      <CookiesClient />
    </>
  )
}
