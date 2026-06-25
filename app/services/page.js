import ServicesResponsive from './ServicesResponsive'

export const metadata = {
  title: 'Services — AKATech | Sites Vitrines, E-Commerce, API Abidjan',
  description: "Conception de site web, cartes interactives & dashboards, API & backend, maintenance et fiches Google My Business. Tarifs clairs, devis gratuit en 24h.",
  alternates: { canonical: '/services' },
  openGraph: { title: 'Services — AKATech', description: "Sites vitrines, e-commerce, API et fiches Google My Business pour entrepreneurs ivoiriens.", locale: 'fr_CI', type: 'website', siteName: 'AKATech', url: 'https://akatech-agence.vercel.app/services' },
}

const SERVICES_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  itemListElement: [
    { '@type': 'Service', position: 1, name: 'Conception de Site Web', areaServed: "Côte d'Ivoire", provider: { '@type': 'ProfessionalService', name: 'AKATech' } },
    { '@type': 'Service', position: 2, name: 'Cartes Interactives & Dashboards', areaServed: "Côte d'Ivoire", provider: { '@type': 'ProfessionalService', name: 'AKATech' } },
    { '@type': 'Service', position: 3, name: 'API & Backend Robustes', areaServed: "Côte d'Ivoire", provider: { '@type': 'ProfessionalService', name: 'AKATech' } },
    { '@type': 'Service', position: 4, name: 'Maintenance & Support', areaServed: "Côte d'Ivoire", provider: { '@type': 'ProfessionalService', name: 'AKATech' } },
    { '@type': 'Service', position: 5, name: 'Fiche Google My Business', areaServed: "Côte d'Ivoire", provider: { '@type': 'ProfessionalService', name: 'AKATech' } },
  ],
}

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SERVICES_JSON_LD) }} />
      <ServicesResponsive />
    </>
  )
}
