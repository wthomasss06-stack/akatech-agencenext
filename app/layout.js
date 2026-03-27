import './globals.css'
import { ThemeProvider } from '@/lib/theme'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { MicroCursor, BackToTop, FloatingWA } from '@/components/ui/index'

export const metadata = {
  title: 'AKATech — Agence Web Abidjan | Sites, E-Commerce, SaaS',
  description: "AKATech accompagne les entrepreneurs et PME en Côte d'Ivoire avec des solutions digitales sur-mesure : sites vitrines, e-commerce, applications SaaS et portfolios modernes.",
  keywords: "agence web abidjan, développeur web côte d'ivoire, site internet abidjan, e-commerce afrique, SaaS afrique",
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <ThemeProvider>
          <MicroCursor />
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
