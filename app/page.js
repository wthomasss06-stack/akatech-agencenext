import HomeResponsive from './HomeResponsive'
import { FAQ_ITEMS } from '@/lib/data'

const SITE_URL = 'https://akatech.vercel.app'

export const metadata = {
  title: 'AKATech — Agence Web Abidjan | Sites, E-Commerce, SaaS',
  description: "AKATech accompagne les entrepreneurs et PME en Côte d'Ivoire avec des solutions digitales sur-mesure : sites vitrines, e-commerce, API et fiches Google My Business. Devis gratuit en 24h.",
  alternates: { canonical: '/' },
  openGraph: {
    title: 'AKATech — Agence Web Abidjan',
    description: "Sites vitrines, e-commerce, SaaS, API et fiches Google My Business pour entrepreneurs ivoiriens.",
    url: SITE_URL,
    locale: 'fr_CI', type: 'website', siteName: 'AKATech',
  },
}

// Les 6 premières questions de FAQ_ITEMS — mêmes questions, dans le même
// ordre, que celles réellement affichées sur la page (voir
// HomeClientDesktop.js : FAQ_ITEMS.slice(0, 6)). Avant, ce schema listait
// 3 questions codées en dur qui ne correspondaient à aucun texte visible
// sur la page — un schema FAQPage est censé refléter le contenu affiché,
// pas en inventer un autre. app/pricing/page.js suit déjà ce principe
// (schema généré depuis FAQ_ITEMS) ; on aligne l'accueil dessus.
const FAQ_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ_ITEMS.slice(0, 6).map(({ q, a }) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
}

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSON_LD) }}
      />
      <HomeResponsive />
    </>
  )
}
