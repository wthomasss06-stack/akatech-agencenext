import './globals.css'
import { ThemeProvider } from '@/lib/theme'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { BackToTop, FloatingWA } from '@/components/ui/index'
import Loader from '@/components/ui/Loader'
import ScrollToTop from '@/components/ui/ScrollToTop'

const SITE_URL = 'https://akatech.vercel.app'

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'AKATech — Agence Web Abidjan | Sites, E-Commerce, SaaS',
    template: '%s | AKATech',
  },
  description: "AKATech accompagne les entrepreneurs et PME en Côte d'Ivoire avec des solutions digitales sur-mesure : sites vitrines, e-commerce, applications SaaS, API et fiches Google My Business. Devis gratuit en 24h.",
  keywords: [
    "agence web abidjan", "développeur web côte d'ivoire", "création site internet abidjan",
    "site vitrine abidjan", "e-commerce afrique", "application SaaS afrique",
    "développeur freelance abidjan", "agence digitale côte d'ivoire",
    "fiche google my business abidjan", "API backend django abidjan",
  ],
  authors: [{ name: "M'Bollo Aka Elvis", url: SITE_URL }],
  creator: 'AKATech',
  publisher: 'AKATech',
  category: 'technology',
  alternates: { canonical: '/' },
  robots: {
    index: true, follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  openGraph: {
    type: 'website',
    locale: 'fr_CI',
    siteName: 'AKATech',
    title: 'AKATech — Agence Web Abidjan | Sites, E-Commerce, SaaS',
    description: "Solutions digitales sur-mesure pour entrepreneurs et PME en Côte d'Ivoire : sites vitrines, e-commerce, SaaS, API et fiches Google My Business.",
    url: SITE_URL,
    images: [{ url: '/images/og-cover.webp', width: 1200, height: 630, alt: 'AKATech — Agence Web Abidjan' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AKATech — Agence Web Abidjan',
    description: "Sites vitrines, e-commerce, SaaS et API sur-mesure pour entrepreneurs ivoiriens.",
    images: ['/images/og-cover.webp'],
  },
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
}

export const viewport = {
  themeColor: '#88ca53',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

/* ════════════════════════════════════════════════════════════
   JSON-LD — ProfessionalService / LocalBusiness
   Sert de socle d'identité pour :
   • SEO  : rich snippets Google (note, adresse, horaires)
   • AEO  : permet aux moteurs de réponse (Google AI Overviews,
            assistants vocaux) de citer AKATech directement
            comme réponse à "qui fait des sites web à Abidjan"
   • GEO  : structure factuelle exploitable par les LLM
            (ChatGPT, Perplexity...) pour recommander AKATech
   ════════════════════════════════════════════════════════════ */
const ORG_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  '@id': `${SITE_URL}/#organization`,
  name: 'AKATech',
  alternateName: "AKATech Abidjan",
  url: SITE_URL,
  logo: `${SITE_URL}/images/logo.webp`,
  image: `${SITE_URL}/images/og-cover.webp`,
  description: "Agence web freelance basée à Abidjan, Côte d'Ivoire. Conception de sites vitrines, e-commerce, applications SaaS, API & backend, et gestion de fiches Google My Business.",
  founder: { '@type': 'Person', name: "M'Bollo Aka Elvis" },
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Abidjan',
    addressCountry: 'CI',
  },
  areaServed: [
    { '@type': 'Country', name: "Côte d'Ivoire" },
    { '@type': 'Place', name: 'Afrique de l\'Ouest' },
  ],
  priceRange: '10 000 FCFA - 1 200 000 FCFA',
  telephone: '+225-01-42-50-77-50',
  email: 'wthomasss06@gmail.com',
  sameAs: [
    'https://web.facebook.com/profile.php?id=61577494705852',
    'https://wa.me/2250142507750',
  ],
  knowsAbout: [
    'Développement web', 'Next.js', 'React', 'Django', 'API REST',
    'E-commerce', 'SEO local', 'Mobile Money', 'Google My Business',
  ],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Services AKATech',
    itemListElement: [
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Conception de Site Web' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Cartes Interactives & Dashboards' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'API & Backend Robustes' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Maintenance & Support' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Fiche Google My Business' } },
    ],
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '5',
    reviewCount: '3',
    bestRating: '5',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <head>
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&family=JetBrains+Mono:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_JSON_LD) }}
        />
      </head>
      <body>
        <ThemeProvider>
          <ScrollToTop />
          <Loader />
          <Navbar />
          <main>{children}</main>
          <Footer />
          <FloatingWA />
          <BackToTop />
        </ThemeProvider>
      </body>
    </html>
  )
}
