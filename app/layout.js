import './globals.css'
import { ThemeProvider } from '@/lib/theme'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { BackToTop, FloatingWA } from '@/components/ui/index'
import Loader from '@/components/ui/Loader'
import RegisterSW from '@/components/ui/RegisterSW'

export const metadata = {
  title: 'AKATech — Agence Web Abidjan | Sites, E-Commerce, SaaS',
  description: "AKATech accompagne les entrepreneurs et PME en Côte d'Ivoire avec des solutions digitales sur-mesure : sites vitrines, e-commerce, applications SaaS et portfolios modernes.",
  keywords: "agence web abidjan, développeur web côte d'ivoire, site internet abidjan, e-commerce afrique, SaaS afrique",
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'AKATech',
  },
}

export const viewport = {
  themeColor: '#22c864',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="AKATech" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&family=Syne:wght@400;700;800&family=JetBrains+Mono:wght@300;400;600&family=Orbitron:wght@700;900&display=swap" rel="stylesheet" />
      </head>
      <body>
        <ThemeProvider>
          <RegisterSW />
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
