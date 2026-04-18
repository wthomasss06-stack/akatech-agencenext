// Server Component — metadata SSR + thin wrapper
import AboutClient from './AboutClient'

export const metadata = {
  title: 'À propos — AKATech | Agence Web Abidjan',
  description: "Découvrez AKATech, agence web basée à Abidjan. 3+ ans d'expérience, +10 projets livrés, 100% de clients satisfaits. React, Next.js, Django, Python.",
  keywords: "agence web abidjan, développeur full-stack côte d'ivoire, react django abidjan, aka elvis mbollo",
  openGraph: {
    title: 'À propos — AKATech | Agence Web Abidjan',
    description: "Découvrez AKATech, agence web basée à Abidjan. 3+ ans d'expérience, +10 projets livrés, 100% de clients satisfaits. React, Next.js, Django, Python.",
    locale: 'fr_CI',
    type: 'website',
    siteName: 'AKATech',
    url: 'https://akatech.vercel.app/about',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'À propos — AKATech | Agence Web Abidjan',
    description: "Découvrez AKATech, agence web basée à Abidjan. 3+ ans d'expérience, +10 projets livrés, 100% de clients satisfaits. React, Next.js, Django, Python.",
  },
}

export default function Page() {
  return <AboutClient />
}
