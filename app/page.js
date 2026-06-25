import HomeResponsive from './HomeResponsive'

const SITE_URL = 'https://akatech.vercel.app'

export const metadata = {
  title: 'AKATech — Agence Web Abidjan | Sites, E-Commerce, SaaS',
  description: "AKATech accompagne les entrepreneurs et PME en Côte d'Ivoire avec des solutions digitales sur-mesure : sites vitrines, e-commerce, API et fiches Google My Business. Devis gratuit en 24h.",
  alternates: { canonical: '/' },
  openGraph: {
    title: 'AKATech — Agence Web Abidjan',
    description: "Sites vitrines, e-commerce, SaaS, API et fiches Google My Business pour entrepreneurs ivoiriens.",
    url: SITE_URL,
    locale: 'fr_CI', type: 'website', siteName: 'AKATech',
  },
}

const FAQ_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: "Quel est le prix d'un site web à Abidjan avec AKATech ?",
      acceptedAnswer: { '@type': 'Answer', text: "Les tarifs démarrent à 100 000 FCFA pour un portfolio, 220 000 FCFA pour un site vitrine, et 450 000 FCFA pour un e-commerce. Le devis exact dépend du nombre de pages et fonctionnalités." },
    },
    {
      '@type': 'Question',
      name: 'Combien de temps faut-il pour livrer un site web ?',
      acceptedAnswer: { '@type': 'Answer', text: "Entre 3 et 14 jours selon le pack choisi : un portfolio simple est livré en 3 à 5 jours, un site vitrine en 5 à 10 jours, un e-commerce en 14 jours." },
    },
    {
      '@type': 'Question',
      name: "AKATech accepte-t-il le paiement Mobile Money ?",
      acceptedAnswer: { '@type': 'Answer', text: "Oui, AKATech accepte Orange Money, MTN Mobile Money, Wave et le virement bancaire, avec un paiement en deux fois : 50% à la commande et 50% à la livraison." },
    },
  ],
}

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSON_LD) }}
      />
      <HomeResponsive />
    </>
  )
}
