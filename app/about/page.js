import AboutResponsive from './AboutResponsive'

export const metadata = {
  title: 'À propos — AKATech | Agence Web Abidjan',
  description: "Découvrez AKATech, agence web basée à Abidjan. 3+ ans d'expérience, +18 projets livrés, 100% de clients satisfaits.",
  alternates: { canonical: '/about' },
  openGraph: { title: 'À propos — AKATech', description: "3+ ans d'expérience, +18 projets livrés en Côte d'Ivoire.", locale: 'fr_CI', type: 'website', siteName: 'AKATech', url: 'https://akatech.vercel.app/about' },
}

const ABOUT_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  about: { '@type': 'ProfessionalService', name: 'AKATech', founder: { '@type': 'Person', name: "M'Bollo Aka Elvis" } },
}

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ABOUT_JSON_LD) }} />
      <AboutResponsive />
    </>
  )
}
