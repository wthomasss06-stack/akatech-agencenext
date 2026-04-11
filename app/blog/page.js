// Server Component — metadata SSR + thin wrapper
import BlogClient from './BlogClient'

export const metadata = {
  title: 'Blog — AKATech | Conseils Digitaux pour Entrepreneurs Africains',
  description: "Stratégie digitale, SEO, e-commerce et développement web — des articles concrets pour les entrepreneurs ivoiriens qui veulent grandir en ligne.",
  keywords: "blog web abidjan, conseils digitaux afrique, seo côte d'ivoire, e-commerce afrique",
  openGraph: {
    title: 'Blog — AKATech | Conseils Digitaux pour Entrepreneurs Africains',
    description: "Stratégie digitale, SEO, e-commerce et développement web — des articles concrets pour les entrepreneurs ivoiriens qui veulent grandir en ligne.",
    locale: 'fr_CI',
    type: 'website',
    siteName: 'AKATech',
    url: 'https://akatech.vercel.app/blog',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog — AKATech | Conseils Digitaux pour Entrepreneurs Africains',
    description: "Stratégie digitale, SEO, e-commerce et développement web — des articles concrets pour les entrepreneurs ivoiriens qui veulent grandir en ligne.",
  },
}

export default function Page() {
  return <BlogClient />
}
