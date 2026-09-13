import LegalPage from '@/components/legal/LegalPage'

export const metadata = {
  title: 'Conditions générales d’utilisation',
  description: 'Conditions générales d’utilisation du site AKATech Studio.',
  alternates: { canonical: '/conditions-utilisation' },
}

const sections = [
  {
    title: 'Objet',
    blocks: [
      { type: 'text', text: 'Les présentes conditions définissent les règles d’accès et d’utilisation du site AKATech Studio. En naviguant sur le site, vous acceptez ces conditions dans leur version applicable au moment de votre visite.' },
      { type: 'text', text: 'Les prestations de développement, de maintenance ou d’accompagnement font l’objet de conditions commerciales ou contractuelles distinctes lorsqu’un projet est engagé.' },
    ],
  },
  {
    title: 'Accès au site',
    blocks: [
      { type: 'text', text: 'Le site est accessible gratuitement, hors coût de connexion et d’équipement. AKATech Studio peut suspendre temporairement une partie du service pour maintenance, sécurité, mise à jour ou raison indépendante de sa volonté.' },
      { type: 'text', text: 'L’utilisateur s’engage à ne pas perturber le fonctionnement du site, contourner ses mesures de sécurité, envoyer des contenus illicites ou utiliser l’assistant pour une finalité frauduleuse.' },
    ],
  },
  {
    title: 'Assistant IA et parcours de devis',
    blocks: [
      { type: 'text', text: 'L’assistant IA fournit une aide d’orientation et de qualification. Ses réponses ne constituent pas un conseil juridique, financier ou professionnel et ne remplacent pas l’échange avec AKATech Studio.' },
      { type: 'text', text: 'Le questionnaire peut produire une estimation à partir des informations saisies et de la grille tarifaire disponible. Cette estimation n’est pas un engagement contractuel tant qu’un devis ou une proposition commerciale n’a pas été explicitement validé par AKATech Studio.' },
      { type: 'text', text: 'L’utilisateur est responsable de l’exactitude, de la licéité et de la confidentialité des informations transmises dans le chat et les formulaires.' },
    ],
  },
  {
    title: 'Propriété intellectuelle',
    blocks: [
      { type: 'text', text: 'Les contenus, interfaces, textes, visuels, logiciels et éléments de marque du site sont protégés. Aucun droit de reproduction, de modification, de revente ou d’exploitation n’est accordé en dehors de l’usage normal du site.' },
    ],
  },
  {
    title: 'Liens et services tiers',
    blocks: [
      { type: 'text', text: 'Le site peut contenir des liens vers des services ou sites tiers. AKATech Studio ne contrôle pas leurs contenus, leurs disponibilités ni leurs politiques de confidentialité et ne peut être responsable de leur fonctionnement.' },
    ],
  },
  {
    title: 'Responsabilité',
    blocks: [
      { type: 'text', text: 'AKATech Studio met en œuvre des moyens raisonnables pour maintenir des informations accessibles et un service fiable. Aucune garantie de disponibilité permanente, d’absence d’erreur ou de résultat commercial n’est donnée pour le site, l’assistant ou une estimation automatique.' },
      { type: 'text', text: 'Les présentes conditions n’excluent pas les responsabilités qui ne peuvent pas l’être en vertu des règles applicables.' },
    ],
  },
  {
    title: 'Droit applicable et contact',
    blocks: [
      { type: 'text', text: 'Les présentes conditions sont soumises aux règles applicables en Côte d’Ivoire, sous réserve des dispositions impératives qui pourraient s’appliquer à l’utilisateur.' },
      { type: 'text', text: 'Toute question concernant ces conditions peut être envoyée à wthomasss06@gmail.com.' },
    ],
  },
]

export default function Page() {
  return (
    <LegalPage
      eyebrow="AKATech Studio · Règles du site"
      title="Conditions d’utilisation"
      intro="Ces conditions expliquent le cadre d’utilisation du site, de l’assistant IA et du parcours de devis AKATech."
      sections={sections}
    />
  )
}
