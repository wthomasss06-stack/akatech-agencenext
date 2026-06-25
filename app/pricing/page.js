import PricingResponsive from './PricingResponsive'
import { FAQ_ITEMS } from '@/lib/data'

export const metadata = {
  title: 'Tarifs — AKATech | Prix Sites Web & Applications Abidjan',
  description: "Tarifs transparents : portfolio dès 100 000 FCFA, site vitrine dès 220 000 FCFA, e-commerce dès 450 000 FCFA. Mobile Money accepté, paiement en 2 fois.",
  alternates: { canonical: '/pricing' },
  openGraph: { title: 'Tarifs — AKATech', description: "Tarifs transparents pour sites vitrines, e-commerce, applications web et fiches Google. Mobile Money accepté.", locale: 'fr_CI', type: 'website', siteName: 'AKATech', url: 'https://akatech-agence.vercel.app/pricing' },
}

const FAQ_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ_ITEMS.map(({ q, a }) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
}

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSON_LD) }} />
      <PricingResponsive />
    </>
  )
}
