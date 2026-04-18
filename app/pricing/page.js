// Server Component — metadata SSR + thin wrapper
import PricingClient from './PricingClient'

export const metadata = {
  title: 'Tarifs — AKATech | Prix Sites Web & Applications Abidjan',
  description: "Tarifs transparents pour sites vitrines, e-commerce, SaaS et portfolios. Paiement Mobile Money accepté. Devis gratuit en 24h sans engagement.",
  keywords: "prix site web abidjan, tarif e-commerce côte d'ivoire, agence web pas cher abidjan",
  openGraph: {
    title: 'Tarifs — AKATech | Prix Sites Web & Applications Abidjan',
    description: "Tarifs transparents pour sites vitrines, e-commerce, SaaS et portfolios. Paiement Mobile Money accepté. Devis gratuit en 24h sans engagement.",
    locale: 'fr_CI',
    type: 'website',
    siteName: 'AKATech',
    url: 'https://akatech.vercel.app/pricing',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tarifs — AKATech | Prix Sites Web & Applications Abidjan',
    description: "Tarifs transparents pour sites vitrines, e-commerce, SaaS et portfolios. Paiement Mobile Money accepté. Devis gratuit en 24h sans engagement.",
  },
}

export default function Page() {
  return <PricingClient />
}
