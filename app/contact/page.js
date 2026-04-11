// Server Component — metadata SSR + thin wrapper
import ContactClient from './ContactClient'

export const metadata = {
  title: 'Contact — AKATech | Devis Gratuit en 24h',
  description: "Contactez AKATech pour un devis gratuit. WhatsApp, email ou formulaire — réponse en moins de 2h. Développement web sur-mesure à Abidjan.",
  keywords: "contact agence web abidjan, devis site web gratuit côte d'ivoire, développeur web abidjan whatsapp",
  openGraph: {
    title: 'Contact — AKATech | Devis Gratuit en 24h',
    description: "Contactez AKATech pour un devis gratuit. WhatsApp, email ou formulaire — réponse en moins de 2h. Développement web sur-mesure à Abidjan.",
    locale: 'fr_CI',
    type: 'website',
    siteName: 'AKATech',
    url: 'https://akatech.vercel.app/contact',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact — AKATech | Devis Gratuit en 24h',
    description: "Contactez AKATech pour un devis gratuit. WhatsApp, email ou formulaire — réponse en moins de 2h. Développement web sur-mesure à Abidjan.",
  },
}

export default function Page() {
  return <ContactClient />
}
