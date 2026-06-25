import ProjectsResponsive from './ProjectsResponsive'

export const metadata = {
  title: "Réalisations — AKATech | Projets Web Côte d'Ivoire",
  description: "+18 réalisations livrées : sites vitrines, e-commerce, marketplaces, portfolios et applications métier pour des entrepreneurs en Côte d'Ivoire.",
  alternates: { canonical: '/projects' },
  openGraph: { title: "Réalisations — AKATech", description: "15+ projets web livrés en Côte d'Ivoire : sites, e-commerce, marketplaces, portfolios.", locale: 'fr_CI', type: 'website', siteName: 'AKATech', url: 'https://akatech.vercel.app/projects' },
}

export default function Page() { return <ProjectsResponsive /> }
