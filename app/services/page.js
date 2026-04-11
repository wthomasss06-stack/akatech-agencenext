// Server Component — metadata SSR + thin wrapper
import ServicesClient from './ServicesClient'

export const metadata = {
  title: 'Services — AKATech | Sites Vitrines, E-Commerce, SaaS Abidjan',
  description: "Sites vitrines, boutiques e-commerce, applications SaaS, APIs et portfolios créatifs. Des services web sur-mesure pour le marché africain.",
  keywords: "services web abidjan, création site internet côte d'ivoire, e-commerce abidjan, application saas afrique",
  openGraph: {
    title: 'Services — AKATech | Sites Vitrines, E-Commerce, SaaS Abidjan',
    description: "Sites vitrines, boutiques e-commerce, applications SaaS, APIs et portfolios créatifs. Des services web sur-mesure pour le marché africain.",
    locale: 'fr_CI',
    type: 'website',
    siteName: 'AKATech',
    url: 'https://akatech.vercel.app/services',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Services — AKATech | Sites Vitrines, E-Commerce, SaaS Abidjan',
    description: "Sites vitrines, boutiques e-commerce, applications SaaS, APIs et portfolios créatifs. Des services web sur-mesure pour le marché africain.",
  },
}

export default function Page() {
  return <ServicesClient />
}
