import ContactResponsive from './ContactResponsive'

export const metadata = {
  title: 'Contact — AKATech | Devis Gratuit en 24h',
  description: "Contactez AKATech pour un devis gratuit. WhatsApp, email ou formulaire — réponse en moins de 24h.",
  alternates: { canonical: '/contact' },
  openGraph: { title: 'Contact — AKATech', description: "Devis gratuit en 24h pour votre projet web à Abidjan.", locale: 'fr_CI', type: 'website', siteName: 'AKATech', url: 'https://akatech-agence.vercel.app/contact' },
}

const CONTACT_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  about: {
    '@type': 'ProfessionalService',
    name: 'AKATech',
    telephone: '+225-01-42-50-77-50',
    email: 'wthomasss06@gmail.com',
  },
}

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(CONTACT_JSON_LD) }} />
      <ContactResponsive />
    </>
  )
}
