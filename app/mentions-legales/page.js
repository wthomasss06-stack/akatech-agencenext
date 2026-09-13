import LegalPage from '@/components/legal/LegalPage'

export const metadata = {
  title: 'Mentions légales',
  description: 'Mentions légales du site AKATech Studio.',
  alternates: { canonical: '/mentions-legales' },
}

const sections = [
  {
    title: 'Éditeur du site',
    blocks: [
      { type: 'text', text: 'Le site akatech.vercel.app est édité par AKATech Studio, activité de conception et de développement de solutions digitales basée à Abidjan, Côte d’Ivoire.' },
      { type: 'text', text: 'Responsable de la publication : M’Bollo Aka Elvis.' },
      { type: 'text', text: 'Contact : wthomasss06@gmail.com — +225 01 42 50 77 50.' },
      { type: 'text', text: 'Les informations d’identification administrative complémentaires de l’éditeur doivent être ajoutées dès qu’elles sont disponibles : forme juridique, numéro RCCM, identifiant fiscal et adresse professionnelle complète.' },
    ],
  },
  {
    title: 'Hébergement',
    blocks: [
      { type: 'text', text: 'Le site est hébergé par Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis. Le déploiement public est accessible à l’adresse akatech.vercel.app.' },
    ],
  },
  {
    title: 'Activité',
    blocks: [
      { type: 'text', text: 'AKATech Studio propose notamment la conception de sites vitrines, de boutiques e-commerce, d’applications SaaS, d’API et de solutions backend, ainsi que des prestations de maintenance et de visibilité locale.' },
      { type: 'text', text: 'Les tarifs affichés ou communiqués par le parcours de devis sont des estimations. Une proposition commerciale ou un devis validé précise le périmètre, les livrables, les délais et les conditions applicables.' },
    ],
  },
  {
    title: 'Propriété intellectuelle',
    blocks: [
      { type: 'text', text: 'La structure, les textes, le design, les éléments graphiques, les composants logiciels et les contenus du site sont protégés par les règles applicables de propriété intellectuelle.' },
      { type: 'text', text: 'Toute reproduction, représentation, adaptation ou extraction non autorisée est interdite. Les marques, logos et contenus appartenant à des tiers restent la propriété de leurs titulaires.' },
    ],
  },
  {
    title: 'Contact et signalement',
    blocks: [
      { type: 'text', text: 'Pour toute question relative au site ou pour signaler un contenu, contactez AKATech Studio à l’adresse wthomasss06@gmail.com.' },
    ],
  },
]

export default function Page() {
  return (
    <LegalPage
      eyebrow="AKATech Studio · Informations légales"
      title="Mentions légales"
      intro="Cette page présente l’éditeur, l’hébergement et les règles d’utilisation des contenus publiés sur le site AKATech."
      sections={sections}
    />
  )
}
