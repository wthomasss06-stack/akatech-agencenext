// lib/project-stories.js
// Textes « côté client » des réalisations — AUCUN terme technique.
//
// Pourquoi un fichier à part : lib/data.js garde les champs d'origine
// (desc, tech, problem, solution, impact) pour l'Explorer, le dashboard et
// le SEO. Ici, on écrit pour un dirigeant de PME qui se demande « est-ce
// qu'ils peuvent régler MON problème ? ». Rattaché à chaque projet par son
// id dans lib/data.js (champ `story`).
//
// Règle d'écriture : on ne promet que ce qui est dans les fiches projet.
// Pas de chiffre inventé. Quand une fonction est « à venir », on le dit.
//
//   badge     → pastille courte sur la carte (mobile)
//   pitch     → 1 à 2 phrases sous le titre (remplace la description technique)
//   problem   → la situation de départ du client
//   solution  → ce qu'on a mis en place, en langage de tous les jours
//   features  → les fonctions phares, 3 à 6 puces courtes
//   outcome   → où en est le projet / ce que ça change
//   audience  → « Pour : … », sert la phrase d'accroche du bouton final

export const PROJECT_STORIES = {
  1: {
    badge: 'Multi-vendeurs',
    pitch: "Une place de marché en ligne où plusieurs vendeurs ivoiriens exposent leurs produits, et où l'acheteur commande en confiance.",
    problem: "Les vendeurs locaux n'avaient pas de vitrine fiable pour regrouper leurs produits, et les acheteurs hésitaient à commander sans garantie.",
    solution: "Une marketplace où chaque vendeur gère sa boutique et ses commandes, et où l'acheteur suit sa livraison jusqu'à la réception, avec paiement à la livraison.",
    features: [
      'Une boutique et un espace de gestion pour chaque vendeur',
      'Panier et commande simples pour l’acheteur',
      'Livraison suivie, avec photo de preuve à la réception',
      'Paiement à la livraison',
      'Connexion en un clic avec son compte Google',
      'S’installe sur le téléphone comme une application',
    ],
    outcome: "En ligne : le catalogue, les commandes et la livraison fonctionnent. Le paiement par Mobile Money est la prochaine étape.",
    audience: 'les vendeurs et les boutiques qui veulent vendre en ligne',
  },
  2: {
    badge: 'Présence en ligne',
    pitch: "Un site clair et rapide pour présenter une activité technologique de façon professionnelle.",
    problem: "L'entreprise n'avait aucune présence en ligne pour présenter son activité de façon crédible.",
    solution: "Un site d'une seule page, agréable à lire, qui présente l'offre et rassure le visiteur dès les premières secondes.",
    features: [
      'Présentation claire de l’activité et de l’offre',
      'Éléments de réassurance pour inspirer confiance',
      'Lecture agréable sur téléphone, tablette et ordinateur',
      'Mis en ligne et prêt à être partagé',
    ],
    outcome: "En ligne et prêt à être utilisé en prospection commerciale.",
    audience: 'les entreprises qui n’ont pas encore de site',
  },
  3: {
    badge: 'Recherche avancée',
    pitch: "Une plateforme de terrains pour limiter les risques d'arnaque à l'achat.",
    problem: "Les arnaques sont fréquentes dans la vente de terrains : les annonces et les vendeurs ne sont pas vérifiés.",
    solution: "Une plateforme où les annonces de terrains sont présentées de façon claire et comparable, avec une recherche précise et des comptes sécurisés.",
    features: [
      'Annonces de terrains présentées de façon claire',
      'Recherche avancée par critères',
      'Comptes sécurisés pour les vendeurs et les acheteurs',
    ],
    outcome: "Cette première plateforme a servi de base à NEXURA, notre marketplace plus complète.",
    audience: 'les acteurs de l’immobilier et du foncier',
  },
  9: {
    badge: 'Design sur mesure',
    pitch: "Un portfolio personnel qui ne ressemble à aucun modèle tout fait.",
    problem: "Besoin d'un portfolio qui sorte des modèles classiques, avec une vraie identité visuelle.",
    solution: "Un portfolio fait sur mesure, à la fois vitrine professionnelle et page de présentation, avec des animations fluides.",
    features: [
      'Design unique, pas un modèle standard',
      'Animations fluides',
      'Mode clair et mode sombre',
      'Adapté à tous les écrans',
    ],
    outcome: "En ligne et utilisé au quotidien comme vitrine professionnelle.",
    audience: 'les indépendants et les créatifs',
  },
  10: {
    badge: 'Galerie sur mesure',
    pitch: "Le portfolio d'un graphiste, pensé pour mettre ses créations au premier plan.",
    problem: "Un graphiste avait besoin d'une galerie en ligne qui valorise ses créations sans les noyer dans un modèle standard.",
    solution: "Un portfolio sur mesure avec une galerie immersive, où chaque visuel a la place qu'il mérite.",
    features: [
      'Galerie immersive pour montrer ses créations',
      'Ambiance sombre et élégante',
      'Animations soignées',
      'Confortable à consulter sur téléphone',
    ],
    outcome: "Livré au client et en ligne : sa vitrine pour présenter ses prestations.",
    audience: 'les graphistes, photographes et artistes',
  },
  11: {
    badge: 'Écoute en ligne',
    pitch: "Le site d'un beatmaker ivoirien : on écoute ses créations en ligne, puis on achète par WhatsApp en quelques clics.",
    problem: "Un beatmaker n'avait aucun moyen professionnel de faire écouter ses créations en ligne, ni de les vendre sans dépendre d'une plateforme tierce.",
    solution: "Un site où l'on écoute chaque beat directement, puis où l'on achète via WhatsApp. Côté artiste, ajouter un nouveau beat ne demande qu'un lien Google Drive.",
    features: [
      'Écoute de chaque beat directement sur le site',
      'Achat en quelques clics via WhatsApp',
      'Ajout d’un nouveau beat à partir d’un simple lien Google Drive',
      'Fiche détaillée : genre, tempo, ambiance, prix',
    ],
    outcome: "Écouter un beat se fait en un clic, sans quitter le site.",
    audience: 'les musiciens et producteurs qui veulent vendre leur travail',
  },
  12: {
    badge: 'Réservation WhatsApp',
    pitch: "Une plateforme de location de résidences meublées haut de gamme, avec réservation directe par WhatsApp.",
    problem: "Les résidences meublées haut de gamme n'avaient pas de plateforme fiable : les demandes passaient par des appels et le bouche-à-oreille, de façon dispersée.",
    solution: "Une plateforme où chaque résidence a sa fiche complète, et où la réservation se lance sur WhatsApp avec les dates et le tarif déjà remplis.",
    features: [
      'Fiche complète : photos, équipements, tarifs',
      'Position de la résidence sur une carte',
      'Recherche et gestion des disponibilités',
      'Réservation sur WhatsApp avec dates et tarif pré-remplis',
      'Espace sécurisé pour publier et modifier les annonces',
    ],
    outcome: "En ligne, et à l'origine de NEXURA, notre marketplace plus complète.",
    audience: 'les loueurs de résidences, d’hôtels et de logements',
  },
  13: {
    badge: 'Site officiel',
    pitch: "Le site de notre agence : conçu pour transformer un visiteur en client.",
    problem: "L'agence n'avait pas de site capable de transformer un visiteur en client.",
    solution: "Un site pensé pour convaincre : services, tarifs, méthode de travail, réalisations et prise de contact en quelques clics.",
    features: [
      'Services et tarifs affichés clairement',
      'Méthode de travail expliquée étape par étape',
      'Réalisations à découvrir',
      'Assistant qui répond aux questions des visiteurs',
      'Demande de devis en ligne',
    ],
    outcome: "En ligne et référencé sur Google : c'est notre vitrine principale.",
    audience: 'les agences et les prestataires de services',
  },
  14: {
    badge: 'Image institutionnelle',
    pitch: "Le site d'une université privée, clair et rassurant pour les futurs étudiants et leurs parents.",
    problem: "Une université privée avait besoin d'un site qui inspire confiance aux futurs étudiants et à leurs parents.",
    solution: "Un site institutionnel qui présente l'établissement, les filières, les admissions et la vie étudiante de façon claire.",
    features: [
      'Présentation de l’établissement et des filières',
      'Informations sur les admissions',
      'Aperçu de la vie étudiante',
      'Contact facile',
    ],
    outcome: "En ligne : c'est le point d'entrée officiel de l'établissement.",
    audience: 'les écoles, universités et institutions',
  },
  15: {
    badge: 'Multi-catégories',
    pitch: "Une marketplace où l'on trouve, réserve et sécurise logements, véhicules, bureaux et terrains.",
    problem: "Les annonces de biens étaient éparpillées, avec un risque élevé d'arnaques, des vendeurs difficiles à vérifier et aucun suivi fiable des réservations.",
    solution: "Une plateforme unique où les vendeurs sont vérifiés avant de vendre, où l'on cherche par catégorie, prix et lieu, et où chaque réservation est suivie.",
    features: [
      'Résidences meublées, motos et véhicules, bureaux et salles, terrains et immobilier',
      'Vérification d’identité des vendeurs (pièce d’identité et selfie)',
      'Recherche par catégorie, prix et localisation',
      'Calendrier de réservation',
      'Notifications en temps réel',
      'Bon de visite en PDF avec QR code',
    ],
    outcome: "Les parcours acheteur, vendeur et administrateur sont en place et testés. Le produit continue d'évoluer.",
    audience: 'les plateformes d’annonces, de location et de vente',
  },
  16: {
    badge: 'Suivi en direct',
    pitch: "Une plateforme qui rapproche les clients des restaurants locaux : découvrir, choisir, commander.",
    problem: "Les restaurants locaux sont difficiles à découvrir : les clients connaissent mal les adresses, et de bons établissements restent invisibles hors de leur quartier.",
    solution: "Une plateforme qui rassemble restaurants et menus : on repère une adresse, on consulte le menu, puis on y va ou on commande quand le service est disponible.",
    features: [
      'Restaurants et menus réunis au même endroit',
      'Commande en ligne quand le service est disponible',
      'Suivi de la commande en temps réel',
      'Paiement par Mobile Money',
      'Assistant intégré pour aider à choisir',
    ],
    outcome: "Les clients se rapprochent des restaurants locaux, et ceux-ci gagnent une vitrine au-delà de leur quartier. La couverture s'élargit progressivement.",
    audience: 'les restaurants, la livraison et la restauration',
  },
  17: {
    badge: '3 langues',
    pitch: "Le portfolio d'un développeur d'Abidjan, en français, anglais et russe, avec une direction artistique forte.",
    problem: "Un développeur avait besoin d'un portfolio qui montre un haut niveau de finition pour ses candidatures.",
    solution: "Un portfolio sur mesure avec une identité visuelle marquée, des animations soignées et trois langues.",
    features: [
      'Design entièrement sur mesure',
      'Site en trois langues : français, anglais, russe',
      'Animations soignées',
      'Adapté à tous les écrans',
    ],
    outcome: "Livré et en ligne, prêt à accompagner ses candidatures.",
    audience: 'les professionnels qui veulent se démarquer',
  },
  18: {
    badge: 'Rendez-vous en ligne',
    pitch: "Le site complet d'un pressing d'Abidjan : tarifs clairs et prise de rendez-vous en ligne.",
    problem: "Un pressing d'Abidjan n'avait aucune présence en ligne pour présenter ses tarifs et être contacté.",
    solution: "Un site vitrine complet : une présentation animée, des tarifs lisibles et un formulaire pour prendre rendez-vous.",
    features: [
      'Grille de tarifs claire',
      'Prise de rendez-vous par formulaire',
      'Présentation animée de l’activité',
      'Confortable à consulter sur téléphone',
    ],
    outcome: "En ligne : les demandes de contact arrivent directement depuis le site.",
    audience: 'les commerces et services de proximité',
  },
  19: {
    badge: 'Stock en direct',
    pitch: "La plateforme d'un élevage de lapins : fiches par race, stock en direct et commande finalisée sur WhatsApp.",
    problem: "Les sites d'élevage se ressemblaient, et ne savaient ni gérer le stock et les réservations en temps réel, ni transformer les visiteurs en clients.",
    solution: "Une plateforme où chaque race a sa fiche, où le stock se met à jour tout seul à chaque réservation, et où la commande se finalise sur WhatsApp avec un message déjà prêt.",
    features: [
      'Une fiche détaillée par race de lapin',
      'Stock mis à jour automatiquement',
      'Réservation en ligne avec choix de la quantité',
      'WhatsApp qui s’ouvre avec la commande pré-remplie',
      'Espace de gestion du stock, des réservations et des ventes',
      'S’installe sur le téléphone comme une application',
    ],
    outcome: "En ligne : réservations et stock au même endroit, achat plus rapide, et chaque commande alerte l'administrateur.",
    audience: 'les éleveurs, producteurs et vendeurs de produits en stock limité',
  },
  20: {
    badge: 'Score en minutes',
    pitch: "On dépose son CV et une offre d'emploi : en quelques minutes, on sait où l'on est prêt et où il faut progresser.",
    problem: "Les candidats arrivent en entretien sans savoir où leur profil correspond à l'offre, ni quels écarts combler avant l'échange.",
    solution: "On dépose son CV et l'offre : le service donne un score de compatibilité, un CV corrigé et un guide de réponses sur mesure pour l'entretien.",
    features: [
      'Score de compatibilité entre le CV et l’offre',
      'Compétences confirmées, partielles ou manquantes',
      'CV corrigé, sans rien inventer',
      'Guide de réponses personnalisé pour l’entretien',
      'Première analyse gratuite, sans carte bancaire',
    ],
    outcome: "Le diagnostic et la préparation sont prêts en quelques minutes, dès la première analyse gratuite.",
    audience: 'les services en ligne qui vendent un résultat rapide',
  },
  21: {
    badge: 'Gestion mobile',
    pitch: "Une application pour gérer clients, ressources et réservations depuis son téléphone.",
    problem: "Les petites entreprises de services gèrent clients, ressources et réservations de façon éparpillée, sans outil adapté au travail sur le terrain.",
    solution: "Une application mobile pour tout gérer depuis son téléphone, et un espace web pour le responsable : tableau de bord, historique des actions et gestion de l'équipe.",
    features: [
      'Clients, ressources et réservations au même endroit',
      'Application sur téléphone pour le travail sur le terrain',
      'Tableau de bord pour le responsable',
      'Historique de toutes les actions, exportable',
      'Gestion de l’équipe',
    ],
    outcome: "L'application mobile et l'espace web fonctionnent et ont été vérifiés.",
    audience: 'les PME de services qui veulent tout suivre au même endroit',
  },
  22: {
    badge: 'Marche sans internet',
    pitch: "Une caisse pour petites boutiques qui continue de fonctionner même quand la connexion coupe.",
    problem: "Dans les petites boutiques, une coupure de connexion en pleine vente fait perdre des ventes ou crée des doublons.",
    solution: "Une caisse qui continue sans internet : chaque vente est enregistrée sur l'appareil, puis envoyée automatiquement dès que la connexion revient, sans doublon.",
    features: [
      'Encaisser même sans connexion internet',
      'Envoi automatique des ventes au retour du réseau',
      'Aucune vente enregistrée en double',
      'Gestion courante de la boutique',
      'S’installe sur le téléphone ou la tablette',
    ],
    outcome: "Première version fonctionnelle, testée de bout en bout.",
    audience: 'les boutiques, commerces et points de vente',
  },
  23: {
    badge: 'Sans création de compte',
    pitch: "L'annuaire des artisans et services d'Anyama : on cherche par métier et par quartier, on contacte en direct.",
    problem: "Trouver un artisan à Anyama se faisait de façon dispersée : appels, réseaux sociaux, bouche-à-oreille.",
    solution: "Un annuaire local où l'on cherche un artisan par métier et par quartier, puis où on le contacte directement par WhatsApp ou téléphone. Chaque fiche est validée avant publication.",
    features: [
      'Recherche par métier et par quartier',
      'Contact direct par WhatsApp ou par téléphone',
      'Inscription des artisans sans création de compte',
      'Fiches validées avant publication',
      'Avis des clients, modérés',
      'S’installe sur le téléphone comme une application',
    ],
    outcome: "L'annuaire public est en ligne, avec des avis modérés et la possibilité, pour un artisan, de retirer sa fiche.",
    audience: 'les villes, quartiers et communautés qui veulent un annuaire local',
  },
  24: {
    badge: 'Marche sans internet',
    pitch: "Un registre d'accueil sans contact : le visiteur s'enregistre par QR code ou sur tablette, sans cahier papier.",
    problem: "Bureaux, restaurants et hôtels accueillent encore leurs visiteurs avec un cahier papier : lent à consolider, peu confidentiel et impossible à analyser.",
    solution: "Le visiteur scanne un QR code ou remplit une tablette à l'entrée, même sans internet. Tout est regroupé automatiquement et consultable dans un tableau de bord.",
    features: [
      'Enregistrement par QR code ou sur tablette d’accueil',
      'Fonctionne même sans connexion internet',
      'Formulaires adaptés à chaque secteur',
      'Signature directement sur l’écran',
      'Trois niveaux d’accès : patron, gérant, agent',
      'Export des données dans un tableur',
    ],
    outcome: "La première version est en service. Une version plus complète (clients, réservations, paiements, rappels) est en cours de test.",
    audience: 'les bureaux, restaurants, hôtels et lieux d’accueil',
  },
}

/** L'URL du projet est-elle réellement utilisable (pas un lien de remplissage) ? */
export function hasRealUrl(project) {
  if (!project?.live || !project?.url) return false
  return !/xxx-x\./i.test(project.url)
}

/**
 * Captures à montrer pour une réalisation — même règle que la page /projects :
 *  - « preview » dans le nom du fichier → capture recadrée du contenu : on lui
 *    ajoute une fausse barre de navigateur ;
 *  - « responsive » → la capture contient déjà son propre cadre : on n'ajoute rien ;
 *  - mobile : `imgMobile` si elle existe, sinon la même image quand elle a déjà
 *    le bon format, sinon pas de téléphone.
 */
export function getProjectScreens(project) {
  const img = project?.img || ''
  const isPreview = /preview/i.test(img)
  const isResponsive = /responsive/i.test(img)
  return {
    desktop: img,
    mobile: project?.imgMobile || (isPreview || isResponsive ? img : null),
    withBrowserBar: isPreview,
  }
}

/** Message WhatsApp pré-rempli pour « Je veux un projet comme celui-ci ». */
export function projectWhatsAppUrl(project) {
  const text = `Bonjour AKATech, j'ai vu votre réalisation « ${project?.title || ''} » sur votre site. J'aimerais un projet similaire, pouvons-nous en discuter ?`
  return `https://wa.me/2250142507750?text=${encodeURIComponent(text)}`
}
