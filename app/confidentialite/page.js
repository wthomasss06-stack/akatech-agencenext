import LegalPage from '@/components/legal/LegalPage'

export const metadata = {
  title: 'Politique de confidentialité',
  description: 'Politique de confidentialité et de protection des données d’AKATech Studio.',
  alternates: { canonical: '/confidentialite' },
}

const sections = [
  {
    title: 'Responsable et contact',
    blocks: [
      { type: 'text', text: 'Le responsable du traitement est AKATech Studio, basé à Abidjan, Côte d’Ivoire. Pour toute demande relative à vos données : wthomasss06@gmail.com.' },
    ],
  },
  {
    title: 'Données collectées',
    blocks: [
      { type: 'text', text: 'Selon le parcours utilisé, le site peut traiter les données que vous saisissez volontairement : nom ou nom d’entreprise, adresse email, numéro de téléphone, type de projet, budget, délai, messages et réponses au questionnaire de devis.' },
      { type: 'text', text: 'Le site peut aussi recevoir des données techniques nécessaires à son fonctionnement : adresse IP ou empreinte technique limitée, navigateur, appareil, pages consultées, source de visite et identifiants de session.' },
      { type: 'text', text: 'Ne transmettez pas de données sensibles ou de documents confidentiels dans le chat ou les formulaires qui ne seraient pas nécessaires à votre demande.' },
    ],
  },
  {
    title: 'Finalités et bases d’utilisation',
    blocks: [
      { type: 'list', items: ['Répondre aux demandes envoyées via le formulaire de contact ou l’assistant IA.', 'Qualifier un besoin et générer un devis estimatif à partir des réponses fournies.', 'Conserver l’historique nécessaire au suivi commercial et à la sécurité du service.', 'Mesurer la fréquentation et améliorer la fiabilité du site, lorsque le consentement ou la base légale applicable le permet.'] },
      { type: 'text', text: 'Les données sont utilisées uniquement pour les finalités liées au service demandé, à la gestion de la relation avec le prospect ou au fonctionnement et à la sécurité du site.' },
    ],
  },
  {
    title: 'Prestataires et transferts',
    blocks: [
      { type: 'text', text: 'Le site s’appuie sur des prestataires techniques pouvant traiter certaines données pour son compte : Vercel pour l’hébergement et le déploiement, Neon/PostgreSQL pour la persistance, Resend pour les emails, Google (Gemini) et Groq pour le traitement des messages par l’assistant IA et le calcul de devis, Cloudinary pour certains médias, ainsi que Vercel Analytics pour la mesure d’audience.' },
      { type: 'text', text: 'Ces prestataires peuvent être établis en dehors de la Côte d’Ivoire. AKATech Studio sélectionne les services nécessaires au fonctionnement du site et leur transmet uniquement les données utiles à leur mission.' },
    ],
  },
  {
    title: 'Cadre légal applicable',
    blocks: [
      { type: 'text', text: 'Ce traitement de données personnelles est encadré par la loi n° 2013-450 du 19 juin 2013 relative à la protection des données à caractère personnel en Côte d’Ivoire, dont le respect est contrôlé par l’Autorité de Régulation des Télécommunications/TIC de Côte d’Ivoire (ARTCI).' },
    ],
  },
  {
    title: 'Cookies et conservation',
    blocks: [
      { type: 'text', text: 'Une bannière vous permet de choisir : les cookies essentiels au fonctionnement du site et à une mesure d’audience anonyme restent actifs dans tous les cas, tandis que les cookies analytiques ne sont activés qu’avec votre accord. Votre choix est mémorisé sur votre appareil et vous pouvez le modifier à tout moment en effaçant les données de navigation du site.' },
      { type: 'text', text: 'Les données sont conservées pendant une durée proportionnée à la finalité : le temps du traitement de la demande, du suivi commercial ou des obligations applicables. Les durées exactes peuvent dépendre du type de données et du service concerné.' },
    ],
  },
  {
    title: 'Vos droits',
    blocks: [
      { type: 'text', text: 'Vous pouvez demander l’accès, la rectification, la suppression, la limitation ou l’opposition au traitement de vos données, lorsque ces droits sont applicables. Vous pouvez également retirer un consentement donné.' },
      { type: 'text', text: 'Pour exercer un droit, écrivez à wthomasss06@gmail.com en précisant votre demande et, si nécessaire, le contexte dans lequel vos données ont été transmises. Une vérification raisonnable de votre identité peut être demandée.' },
      { type: 'text', text: 'Vous disposez également du droit d’introduire une réclamation auprès de l’ARTCI, autorité de protection des données personnelles en Côte d’Ivoire.' },
    ],
  },
]

export default function Page() {
  return (
    <LegalPage
      eyebrow="AKATech Studio · Données personnelles"
      title="Politique de confidentialité"
      intro="AKATech Studio explique ici quelles données sont utilisées, pourquoi elles le sont et comment exercer vos droits."
      sections={sections}
    />
  )
}
