// Server Component — metadata SSR + thin wrapper
import ProjectsClient from './ProjectsClient'

export const metadata = {
  title: "Réalisations — AKATech | Projets Web Côte d'Ivoire",
  description: "+12 réalisations livrées : sites vitrines, e-commerce, SaaS, portfolios. Découvrez nos projets web pour entrepreneurs et PME en Côte d'Ivoire.",
  keywords: "réalisations agence web abidjan, projets web côte d'ivoire, portfolio développeur abidjan",
  openGraph: {
    title: "Réalisations — AKATech | Projets Web Côte d'Ivoire",
    description: "+12 réalisations livrées : sites vitrines, e-commerce, SaaS, portfolios. Découvrez nos projets web pour entrepreneurs et PME en Côte d'Ivoire.",
    locale: 'fr_CI',
    type: 'website',
    siteName: 'AKATech',
    url: 'https://akatech.vercel.app/projects',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Réalisations — AKATech | Projets Web Côte d'Ivoire",
    description: "+12 réalisations livrées : sites vitrines, e-commerce, SaaS, portfolios. Découvrez nos projets web pour entrepreneurs et PME en Côte d'Ivoire.",
  },
}

export default function Page() {
  return <ProjectsClient />
}
