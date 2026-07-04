import ExplorerClient from './ExplorerClient'

export const metadata = {
  title: "Explorer — Le tunnel des projets AKATech",
  description: "Explorez nos réalisations en 3D : un tunnel WebGL immersif qui rassemble tous les projets livrés par AKATech en Côte d'Ivoire.",
  alternates: { canonical: '/explorer' },
  openGraph: {
    title: "Explorer — AKATech",
    description: "Le tunnel interactif de nos réalisations.",
    locale: 'fr_CI', type: 'website', siteName: 'AKATech', url: 'https://akatech.vercel.app/explorer',
  },
  robots: { index: true, follow: true },
}

export default function Page() {
  return <ExplorerClient />
}
