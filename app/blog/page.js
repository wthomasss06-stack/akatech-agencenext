import BlogResponsive from './BlogResponsive'

export const metadata = {
  title: 'Blog — AKATech | Conseils Digitaux pour Entrepreneurs Africains',
  description: "Stratégie digitale, SEO, e-commerce et développement web — articles concrets pour entrepreneurs ivoiriens.",
  alternates: { canonical: '/blog' },
  openGraph: { title: 'Blog — AKATech', description: "Conseils concrets en stratégie digitale, SEO et e-commerce pour entrepreneurs ivoiriens.", locale: 'fr_CI', type: 'website', siteName: 'AKATech', url: 'https://akatech.vercel.app/blog' },
}

export default function Page() { return <BlogResponsive /> }
