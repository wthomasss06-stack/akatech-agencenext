// ── SHARED DATA ─────────────────────────────────────────────
import { cld } from './cloudinary'
import { PROJECT_DESCRIPTION_TRANSLATIONS } from './project-i18n'
import { PROJECT_STORIES } from './project-stories'
import { PROJECT_CATEGORY_BY_ID, slugify } from './project-categories'

export const SERVICES = [
  {
    icon: 'Globe',
    n: '// 01',
    title: 'Conception de Site Web',
    desc: "Création de sites web modernes, responsive et optimisés pour convertir vos visiteurs en clients. Du portfolio à la plateforme e-commerce, chaque page est conçue avec soin.",
    price: 'À partir de 200 000 FCFA',
    del: '10-15 jours',
    img: '/images/service/creation%20de%20site%20web.webp',
    features: ['Design sur-mesure','SEO optimisé','Formulaire de contact','Hébergement 1 an offert','Formation incluse'],
    slug: 'site-vitrine',
    color: '#88ca53',
  },
  {
    icon: 'Map',
    n: '// 02',
    title: 'Cartes Interactives & Dashboards',
    desc: "Intégration de cartes interactives Mapbox / Leaflet et de dashboards de visualisation de données. Vos données brutes deviennent des interfaces lisibles et actionnables.",
    price: 'Sur devis',
    del: '7-14 jours',
    img: '/images/service/dasbord.webp',
    features: ['Cartes Mapbox / Leaflet','Dashboards data temps réel','Filtres et exports','Graphiques interactifs','API de données'],
    slug: 'cartes-dashboards',
    color: '#88ca53',
  },
  {
    icon: 'Search',
    n: '// 03',
    title: 'Optimisation SEO',
    desc: "Audit technique, recherche de mots-clés, optimisation des pages et de la vitesse pour améliorer votre positionnement sur Google. Vous gagnez en visibilité, AKATech s'occupe du reste.",
    price: 'Sur devis',
    del: 'Contrat mensuel',
    img: '/images/service/seo.webp',
    features: ['Audit SEO technique','Recherche de mots-clés','Optimisation des pages (on-page)','Vitesse & performance mobile','Rapport mensuel de positionnement'],
    slug: 'seo',
    color: '#88ca53',
  },
  {
    icon: 'MapPin',
    n: '// 04',
    title: 'Fiche Google My Business',
    desc: "Création ou optimisation de votre fiche Google (NAP, catégories, photos, description SEO local) et suivi mensuel : réponse aux avis, publications et statistiques.",
    price: 'À partir de 59 000 FCFA',
    del: '2-7 jours',
    img: '/images/service/fiche-google.webp',
    features: ['Création ou optimisation','SEO local (NAP)','Photos & description','Suivi mensuel & avis','Statistiques de fiche'],
    slug: 'google-my-business',
    color: '#88ca53',
  },
  {
    icon: 'MessageCircle',
    n: '// 05',
    title: 'Intégration IA Chatbot',
    desc: "Un assistant métier conversationnel — ce que nous appelons « chatbot » — intégré à votre site ou à votre application. Il connaît votre activité, répond à vos visiteurs et à vos clients, qualifie les demandes et peut préparer des actions (recherche, suivi, brouillon) que la personne confirme toujours. Même famille d'assistant que celui d'akatech.vercel.app, pensé pour augmenter la productivité de votre business.",
    price: 'Sur devis',
    del: '7-14 jours',
    img: '/images/service/ia.webp',
    features: ['Assistant métier sur-mesure (connaît votre activité)','Réponses sur vos services, tarifs et données','Qualification automatique des visiteurs','Actions préparées, toujours confirmées par la personne','Garde-fous et limites d\'usage','Capture de leads 24h/24','Intégration WhatsApp possible'],
    slug: 'chatbot-ia',
    color: '#88ca53',
  },
  {
    icon: 'CreditCard',
    n: '// 06',
    title: 'Intégration de Paiement en Ligne',
    desc: "Intégration de solutions de paiement directement sur votre site — Mobile Money (Orange Money, MTN MoMo, Wave) et carte bancaire selon vos besoins — pour encaisser sans friction.",
    price: 'Sur devis',
    del: '5-10 jours',
    img: '/images/service/peiement.webp',
    features: ['Orange Money / MTN MoMo / Wave','Carte bancaire (selon besoin)','Suivi des transactions','Notifications de paiement','Sécurisation des flux'],
    slug: 'paiement-en-ligne',
    color: '#88ca53',
  },
  {
    icon: 'Video',
    n: '// 07',
    title: 'Vidéos IA pour le marketing',
    desc: "Création de vidéos générées par IA pour vos réseaux sociaux, publicités et pages de vente : scénario, visuels, voix et montage. Des contenus pensés pour capter l'attention, gagner en engagement et soutenir vos ventes.",
    price: 'Sur devis',
    del: 'Selon le projet',
    img: '/images/service/videos-ia-marketing.webp',
    features: ['Vidéos générées par IA','Scripts & scénarios marketing','Voix off & sous-titres','Formats réseaux sociaux & publicités','Montage et révisions incluses'],
    slug: 'videos-ia-marketing',
    color: '#88ca53',
  },
]

// ══════════════════════════════════════════════════════════════════
// RÈGLE DURE — TEXTES « PROBLÈME / SOLUTION / RÉSULTAT »
// ──────────────────────────────────────────────────────────────────
// Ces textes sont lus par des CLIENTS (dirigeants de PME, commerçants,
// écoles, institutions), pas par des développeurs. Chaque champ
// doit être compris par quelqu'un qui n'a jamais écrit une ligne de
// code. Cette règle vaut pour tout nouveau projet et pour toute
// modification, sans exception.
// Champs concernés : `problem`, `solution`, `result` (courte étiquette
// « ↑ … ») et `impact` (résultat détaillé). `desc` et `tech` ne le sont pas.
//
//  1. ZÉRO terme technique. Interdits : frameworks, langages, bases de
//     données, hébergeurs, API, PWA, SaaS, back-office, KYC, MVP, build,
//     staging, « en production », « temps réel », « offline »,
//     « responsive », « dashboard », « marketplace », tests, erreurs de
//     code… Les technologies vivent UNIQUEMENT dans `tech`.
//  2. Mots de tous les jours : « en ligne » (pas déployé), « en direct »
//     (pas temps réel), « marche sans internet » (pas offline-first),
//     « tableau de bord » (pas dashboard), « place de marché » (pas
//     marketplace), « tableur » (pas export CSV), « s'installe sur le
//     téléphone » (pas PWA).
//  3. Parler du client, pas de la technique : problem = sa situation de
//     départ ; solution = ce qu'il peut faire maintenant ; result = ce
//     que ça change pour lui.
//  4. Phrases courtes, une idée par phrase.
//  5. Honnêteté : aucun chiffre inventé. Ce qui est en test, à venir ou
//     non lancé se dit tel quel.
//  6. Avant d'ajouter ou de modifier un projet, relire ces champs en se
//     demandant : « un commerçant comprend-il, sans explication ? »
// ══════════════════════════════════════════════════════════════════

export const PROJECTS = [
  {
    id: 1,
    title: 'ShopCI',
    type: 'E-Commerce',
    subtitle: 'Marketplace E-commerce',
    desc: "Marketplace multi-vendeurs ivoirienne type Amazon : catalogue, panier, commandes, livraison géolocalisée avec preuve photo et paiement à la livraison. Authentification Google uniquement, tableaux de bord acheteur/vendeur séparés, PWA installable.",
    img: '/images/projects/shopci--preview.webp',
    imgMobile: '/images/projects/shopci-responsive.webp',
    tech: ['Next.js 16', 'Django REST Framework', 'NextAuth v4', 'Tailwind CSS', 'PWA'],
    url: 'https://shopci-v2.vercel.app/',
    result: '↑ Plusieurs vendeurs réunis',
    problem: "Les vendeurs locaux n'avaient pas de vitrine fiable pour regrouper leurs produits, et les acheteurs hésitaient à commander sans garantie.",
    solution: "Une place de marché en ligne où chaque vendeur gère sa boutique et ses commandes. L'acheteur suit sa livraison jusqu'à la réception, avec une photo de preuve, et paie à la livraison. Il se connecte en un clic avec son compte Google.",
    impact: "En ligne : le catalogue, les commandes et la livraison fonctionnent. Le paiement par Mobile Money reste à ajouter, le prestataire de paiement n'étant pas encore choisi.",
    live: true,
    year: '2026',
    progress: 90,
  },
  {
    id: 2,
    title: 'TechFlow',
    type: 'Site Vitrine',
    subtitle: 'Site Vitrine Professionnel',
    desc: "Site vitrine moderne destiné à présenter une activité technologique de manière claire et professionnelle. UI propre, responsive et déployé en production.",
    img: '/images/projects/techflow-preview.webp',
    imgMobile: '/images/projects/techflow.webp',
    tech: ['HTML', 'Tailwind CSS', 'JavaScript', 'Vercel'],
    url: 'https://techflow-ten.vercel.app/',
    result: '↑ Lisible sur tous les écrans',
    problem: "Le client n'avait aucune présence en ligne pour présenter son activité technologique de façon crédible.",
    solution: "Un site d'une seule page, rapide et agréable à lire, qui présente l'offre et rassure le visiteur dès les premières secondes.",
    impact: "Estimation : site livré en moins d'une semaine, prêt à être partagé en prospection commerciale.",
    live: true,
    year: '2024',
    progress: 97,
  },
  {
    id: 3,
    title: 'TerraSafe',
    type: 'Marketplace Foncière',
    subtitle: 'Marketplace Foncière',
    desc: "Plateforme foncière visant à réduire les risques d'arnaques liées à la vente de terrains. Backend sécurisé avec authentification et recherche avancée.",
    img: '/images/projects/terrasafe-preview.webp',
    imgMobile: '/images/projects/terrasafe.webp',
    tech: ['Python / Flask', 'MySQL', 'JavaScript', 'Bootstrap 5'],
    url: 'https://wthomassss06.pythonanywhere.com',
    result: '↑ Comptes sécurisés',
    problem: "Les arnaques sont fréquentes dans la vente de terrains : les annonces et les vendeurs ne sont pas vérifiés.",
    solution: "Une plateforme où les annonces de terrains sont présentées de façon claire, avec une recherche précise et des comptes sécurisés pour les vendeurs et les acheteurs.",
    impact: "Cette première plateforme a fait ses preuves : elle a servi de base à NEXURA, une plateforme plus complète.",
    live: true,
    year: '2024',
    progress: 85,
  },
  {
    id: 9,
    title: 'Tati',
    type: 'Portfolio',
    subtitle: 'Portfolio & Vitrine Moderne',
    desc: "Portfolio personnel double fonction : vitrine professionnelle et page de présentation. Animations fluides, thème sombre/clair, design 100% responsive.",
    img: '/images/projects/tati-preview.webp',
    imgMobile: '/images/projects/tati.webp',
    tech: ['React', 'Tailwind CSS', 'Framer Motion', 'Vercel'],
    url: 'https://tatii.vercel.app/',
    result: '↑ Mode clair et sombre',
    problem: "Besoin d'un portfolio personnel qui sorte des modèles classiques, avec une vraie identité visuelle.",
    solution: "Un portfolio fait sur mesure, avec des animations soignées de bout en bout et un mode clair ou sombre.",
    impact: "Livré et en ligne : utilisé au quotidien comme vitrine professionnelle.",
    live: true,
    year: '2024',
    progress: 100,
  },
  {
    id: 10,
    title: 'MK Studio',
    type: 'Portfolio',
    subtitle: 'Portfolio Graphiste Client',
    desc: "Portfolio professionnel sur-mesure pour un client graphiste. Galerie immersive, animations soignées et thème sombre élégant.",
    img: '/images/projects/mk-preview.webp',
    imgMobile: '/images/projects/mk.webp',
    tech: ['React', 'Tailwind CSS', 'Framer Motion', 'Vercel'],
    url: 'https://mory01ff.vercel.app/',
    result: '↑ Design sur mesure',
    problem: "Un graphiste avait besoin d'une galerie en ligne qui met ses créations en valeur, sans les noyer dans un modèle standard.",
    solution: "Un portfolio sur mesure avec une galerie immersive et des animations pensées pour mettre le visuel en avant.",
    impact: "Livré au client et en ligne : sa vitrine pour présenter ses prestations.",
    live: true,
    year: '2024',
    progress: 100,
  },
  {
    id: 11,
    title: 'ManoBeat 777',
    type: 'E-Commerce',
    subtitle: 'Portfolio Beatmaker',
    desc: "Portfolio d'un beatmaker ivoirien : découvrez et écoutez ses créations directement en ligne, puis achetez vos beats préférés via WhatsApp en quelques clics.",
    img: '/images/projects/beatstore-preview.webp',
    imgMobile: '/images/projects/beatstore.webp',
    tech: ['React', 'Tailwind CSS', 'Howler.js', 'Vercel'],
    url: 'https://xxx-x.vercel.app/',
    result: '↑ Écoute en ligne',
    problem: "Un beatmaker ivoirien n'avait aucun moyen professionnel de faire écouter ses créations en ligne, ni de les vendre sans dépendre d'une plateforme tierce.",
    solution: "Un site où l'on écoute chaque beat directement, puis où l'on achète via WhatsApp. Pour ajouter un nouveau beat, l'artiste n'a besoin que d'un lien Google Drive.",
    impact: "Estimation : écoute d'un beat ramenée à un simple clic, sans passer par un lien externe.",
    live: true,
    year: '2025',
    progress: 100,
  },
  {
    id: 12,
    title: 'New Horizon Service',
    type: 'Application',
    subtitle: 'Location de Résidences',
    desc: "Plateforme de location de résidences meublées haut de gamme. Interface moderne côté client, backend Flask sécurisé avec API REST, recherche avancée et gestion des disponibilités.",
    img: '/images/projects/newhorizon-preview.webp',
    imgMobile: '/images/projects/newhorizon.webp',
    tech: ['Next.js', 'Flask', 'Python', 'MySQL', 'Vercel'],
    url: 'https://new-horizonservice.vercel.app/',
    result: '↑ Réservation en ligne',
    problem: "Les résidences meublées haut de gamme n'avaient pas de plateforme de réservation fiable : les demandes passaient par des appels et le bouche-à-oreille, de façon dispersée.",
    solution: "Une plateforme où chaque résidence a sa fiche complète : photos, équipements, tarifs et position sur une carte. La réservation se lance directement sur WhatsApp, avec les dates et le tarif déjà remplis. Un espace sécurisé permet de publier et de modifier les annonces.",
    impact: "En ligne : cette plateforme a servi de base avant l'évolution vers NEXURA.",
    live: true,
    year: '2025',
    progress: 100,
  },
  {
    id: 13,
    title: 'AKATech',
    type: 'Agence Digitale',
    subtitle: 'Agence Digitale Abidjan',
    desc: "Site officiel d'AKATech Studio., qui accompagne les entrepreneurs et PME en Côte d'Ivoire dans leurs projets digitaux.",
    img: '/images/projects/akatech-preview.webp',
    imgMobile: '/images/projects/akatech.webp',
    tech: ['Next.js 15', 'Framer Motion', 'WebGL Iridescence', 'Vercel'],
    url: 'https://akatech.vercel.app/',
    result: '↑ Site officiel',
    problem: "Mon agence n'avait pas de site propre capable de transformer les visiteurs en clients.",
    solution: "Un site pensé pour convaincre : services, tarifs, méthode de travail, réalisations et prise de contact en quelques clics, avec des animations soignées.",
    impact: "En ligne et rapidement visible sur Google : c'est notre vitrine commerciale principale.",
    live: true,
    year: '2025',
    progress: 100,
  },
  {
    id: 14,
    title: 'Université les Anges',
    type: 'Institutionnel',
    subtitle: 'Site Institutionnel',
    desc: "Site institutionnel moderne pour un établissement d'enseignement supérieur. Présentation des filières, admissions et vie étudiante dans une interface claire et professionnelle.",
    img: '/images/projects/universitelesanges-preview.webp',
    imgMobile: '/images/projects/universitelesanges.webp',
    tech: ['HTML', 'CSS', 'Bulma', 'Bootstrap', 'Vercel'],
    url: 'https://universitelesanges.vercel.app/',
    result: '↑ Image de confiance',
    problem: "Une université privée avait besoin d'un site qui inspire confiance aux futurs étudiants et à leurs parents.",
    solution: "Un site qui présente l'établissement et ses filières de façon claire, avec un contact facile.",
    impact: "Livré et en ligne : c'est le point d'entrée officiel de l'établissement.",
    live: true,
    year: '2025',
    progress: 100,
  },
  {
    id: 15,
    title: 'Nexura',
    type: 'Marketplace',
    subtitle: 'Marketplace Nouvelle Génération',
    desc: "Marketplace nouvelle génération : location de résidences meublées, motos & véhicules, bureaux & salles de conférence, terrains & immobilier. Auth sécurisée, KYC intégré, temps réel.",
    img: '/images/projects/nexura-preview.webp',
    imgMobile: '/images/projects/nexura-responsive.webp',
    tech: ['Next.js 14', 'Django REST', 'PostgreSQL', 'WebSockets', 'Redis & Celery'],
    url: 'https://nexura-one.vercel.app/',
    result: '↑ Plusieurs catégories',
    problem: "Les annonces de logements, véhicules, bureaux et terrains étaient éparpillées, avec un risque élevé d'arnaques, des vendeurs difficiles à vérifier, des paiements peu transparents et aucun suivi fiable des réservations.",
    solution: "Une plateforme unique où les vendeurs sont vérifiés avant de vendre (pièce d'identité et selfie), où l'on cherche par catégorie, prix et lieu, et où chaque réservation est suivie. Le paiement par Mobile Money est en préparation.",
    impact: "Les parcours de l'acheteur, du vendeur et de l'administrateur sont en place et testés. Le produit est privé et continue d'évoluer.",
    live: true,
    year: '2025',
    progress: 100,
  },
  {
    id: 16,
    title: 'KokoEat',
    type: 'Livraison',
    subtitle: 'Livraison Alimentaire',
    desc: "Application de livraison de repas pensée pour le marché ivoirien. Commande en ligne, suivi en temps réel et paiement Mobile Money.",
    img: '/images/projects/kokoeat-preview.webp',
    imgMobile: '/images/projects/kokoeat-responsive.webp',
    tech: ['React', 'Django REST', 'PostgreSQL', 'Vercel'],
    url: 'https://koko-eats.vercel.app',
    result: '↑ Suivi de commande en direct',
    problem: "Les restaurants locaux sont difficiles à découvrir : les clients connaissent mal les adresses, et de bons établissements restent invisibles hors de leur quartier.",
    solution: "Une plateforme qui rassemble les restaurants et leurs menus : on repère une adresse, on consulte le menu, puis on y va ou on commande quand le service est disponible.",
    impact: "Les clients se rapprochent des restaurants locaux, et ceux-ci gagnent une vitrine au-delà de leur quartier. La couverture s'élargit progressivement : toutes les villes et tous les restaurants ne sont pas encore disponibles.",
    live: true,
    year: '2025',
    progress: 80,
  },
  {
    id: 17,
    title: 'Jean Edy · Portfolio',
    type: 'Portfolio',
    subtitle: 'Portfolio React UI Avancé',
    desc: "Portfolio personnel développé pour un autre développeur basé à Abidjan. Trilingue FR/EN/RU, animations soignées et système de design sur-mesure.",
    img: '/images/projects/jean-edy-preview.webp',
    imgMobile: '/images/projects/jean-edy.webp',
    tech: ['React 18', 'Vite', 'GSAP', 'Framer Motion', 'TailwindCSS'],
    url: 'https://jean-edy-dev.vercel.app/',
    result: '↑ Présence pro en ligne',
    problem: "Un développeur avait besoin d'un portfolio qui montre un haut niveau de finition pour ses candidatures.",
    solution: "Un portfolio sur mesure à l'identité visuelle très marquée, avec des animations soignées et trois langues : français, anglais et russe.",
    impact: "Livré et en ligne. Le projet reste privé, propriété du client.",
    live: true,
    year: '2026',
    progress: 100,
  },
  {
    id: 18,
    title: 'MD Laverie Pressing',
    type: 'Site Vitrine',
    subtitle: 'Site Vitrine Pressing',
    desc: "Site vitrine complet pour un pressing à Abidjan. Hero animé, grille de tarifs claire et formulaire de contact pour la prise de rendez-vous en ligne.",
    img: '/images/projects/laverie-preview.webp',
    imgMobile: '/images/projects/laverie.webp',
    tech: ['React 18', 'Vite', 'GSAP', 'React Router v6', 'EmailJS'],
    url: 'https://laverie-plus.vercel.app/',
    result: '↑ Rendez-vous en ligne',
    problem: "Un pressing d'Abidjan n'avait aucune présence en ligne pour présenter ses tarifs et être contacté.",
    solution: "Un site vitrine complet : une présentation animée, des tarifs lisibles et un formulaire pour contacter le pressing et prendre rendez-vous.",
    impact: "Livré et en ligne : les demandes de contact arrivent directement depuis le site.",
    live: true,
    year: '2025',
    progress: 100,
  },
  {
    id: 19,
    title: 'Chez Florence',
    type: 'E-Commerce',
    subtitle: 'Vente & Réservation de Lapins',
    desc: "Plateforme complète de vente et réservation de lapins pour un élevage ivoirien : présentation par race, gestion des stocks en temps réel et réservation en ligne. Stock mis à jour automatiquement et ouverture d'une conversation WhatsApp pré-remplie pour finaliser la commande.",
    img: '/images/projects/chez-florence-preview.webp',
    imgMobile: '/images/projects/chez-florence-responsive.webp',
    tech: ['Next.js 14', 'Express.js', 'Prisma', 'PostgreSQL (Neon)', 'Cloudinary'],
    url: 'https://chez-florence.vercel.app/',
    result: '↑ Stock toujours à jour',
    live: true,
    year: '2026',
    progress: 100,
    problem: "Les sites d'élevage se ressemblaient et ne savaient ni gérer le stock et les réservations en direct, ni transformer les visiteurs en clients.",
    solution: "Une plateforme où chaque race a sa fiche, où le stock se met à jour tout seul à chaque réservation et où la commande se finalise sur WhatsApp avec un message déjà prêt. Un espace de gestion permet de suivre le stock, les réservations et les ventes.",
    impact: "En ligne : les réservations et le stock sont au même endroit, l'achat est plus rapide et chaque commande alerte l'administrateur. Le site s'installe sur le téléphone comme une application.",
  
  },
  {
    id: 20,
    title: 'ChapChap Bara',
    type: 'SaaS',
    subtitle: "Préparation aux entretiens d'embauche",
    desc: "SaaS de préparation aux entretiens : dépôt du CV et de l'offre, score de compatibilité en quelques minutes, CV corrigé et guide de réponses personnalisées, sans carte bancaire pour la première analyse.",
    img: '/images/projects/chapchap-bara-preview.webp',
    imgMobile: '/images/projects/chapchap-bara-responsive.webp',
    tech: ['React', 'Vite', 'Django', 'Celery', 'PostgreSQL', 'Render + Vercel'],
    url: 'https://chapchap-bara.vercel.app/',
    result: '↑ Diagnostic en minutes',
    problem: "Les candidats arrivent en entretien sans savoir où leur profil correspond à l'offre, ni quels écarts combler avant l'échange.",
    solution: "On dépose son CV et l'offre d'emploi : le service donne un score de compatibilité, indique les compétences confirmées, partielles ou manquantes, corrige le CV sans rien inventer et prépare un guide de réponses sur mesure pour l'entretien.",
    impact: "Score de compatibilité, CV corrigé et guide de réponses obtenus en 3 minutes chrono, dès la première analyse gratuite.",
    live: true,
    year: '2026',
    progress: 100,
  },
  {
    id: 21,
    title: 'Karnet',
    type: 'SaaS',
    subtitle: 'Gestion Opérationnelle PME (Mobile-First)',
    desc: "Plateforme de gestion opérationnelle (clients, ressources, réservations) pour PME de service, mobile-first : app Expo en CRUD complet, web admin Next.js pour le dashboard, le journal d'audit et la gestion d'équipe.",
    img: '/images/projects/karnet-preview.webp',
    imgMobile: '/images/projects/karnet-responsive.webp',
    tech: ['Expo / React Native', 'NestJS', 'Prisma', 'Next.js 15', 'PostgreSQL (Neon)'],
    url: 'https://karnet-ci.vercel.app/',
    result: '↑ Tout depuis son téléphone',
    problem: "Les petites entreprises de services gèrent clients, ressources et réservations de façon éparpillée, sans outil adapté au travail sur le terrain.",
    solution: "Une application mobile pour tout gérer depuis son téléphone, et un espace web pour le responsable : tableau de bord, historique des actions (exportable dans un tableur) et gestion de l'équipe.",
    impact: "L'application mobile et l'espace web fonctionnent et ont été vérifiés.",
    live: true,
    year: '2026',
    progress: 85,
  },
  {
    id: 22,
    title: 'ProTech POS',
    type: 'SaaS',
    subtitle: 'Caisse Offline-First pour Boutiques',
    desc: "Caisse (POS) et gestion opérationnelle pour petites boutiques, pensée pour continuer à fonctionner même quand la connexion Internet est instable.",
    img: '/images/projects/pos-preview.webp',
    imgMobile: '/images/projects/pos-responsive.webp',
    tech: ['React 19', 'Vite', 'TypeScript', 'Django 6', 'DRF', 'PostgreSQL', 'PWA'],
    url: 'https://akapos-pi.vercel.app/',
    result: '↑ Marche sans internet',
    problem: "Dans les petites boutiques, une coupure de connexion en pleine vente fait perdre des ventes ou crée des doublons.",
    solution: "Une caisse qui continue de fonctionner sans internet : chaque vente est enregistrée sur l'appareil, puis envoyée automatiquement dès que la connexion revient, sans doublon.",
    impact: "Première version fonctionnelle, testée de bout en bout.",
    live: true,
    year: '2026',
    progress: 100,
  },
  {
    id: 23,
    title: 'Anyama Proxy',
    type: 'Annuaire',
    subtitle: "Annuaire Local d'Artisans",
    desc: "Annuaire local d'artisans et services à Anyama : recherche par métier et quartier, contact direct WhatsApp/téléphone, inscription sans compte avec validation manuelle avant publication.",
    img: '/images/projects/anyama-proxy-preview.webp',
    imgMobile: '/images/projects/anyama-proxy-responsive.webp',
    tech: ['Flask', 'PostgreSQL (Neon)', 'HTML / CSS / JS', 'Resend'],
    url: 'https://anyama-proxy.vercel.app/',
    result: '↑ Sans création de compte',
    problem: "Trouver un artisan à Anyama se faisait de façon dispersée : appels, réseaux sociaux, bouche-à-oreille.",
    solution: "Un annuaire local où l'on cherche un artisan par métier et par quartier, puis où on le contacte directement par WhatsApp ou par téléphone. Les artisans s'inscrivent sans créer de compte, et chaque fiche est validée avant publication.",
    impact: "Deuxième version terminée : annuaire public en ligne, avis modérés, possibilité pour un artisan de retirer sa fiche, mode clair et sombre, et installation sur le téléphone comme une application.",
    live: true,
    year: '2026',
    progress: 100,
  },
  {
    id: 24,
    title: 'REKOLLECTE',
    type: 'SaaS',
    subtitle: "Registre d'Accueil Sans Contact",
    desc: "SaaS de registre d'accueil sans contact par QR code pour bureaux, restaurants, hôtels et accès de salle : mode kiosque offline-first, formulaires adaptables par secteur, signature à l'écran.",
    img: '/images/projects/r3ns3ngn3m3nt-preview.webp',
    imgMobile: '/images/projects/r3ns3ngn3m3nt-responsive.webp',
    tech: ['Next.js 14', 'Django REST Framework', 'PostgreSQL (Neon)', 'Dexie.js / IndexedDB'],
    url: 'https://rekollecte-ci.vercel.app/',
    result: '↑ Marche sans internet',
    problem: "Les bureaux, restaurants et hôtels accueillent encore leurs visiteurs avec un cahier papier : lent à consolider, peu confidentiel et impossible à analyser.",
    solution: "Le visiteur scanne un QR code ou remplit une tablette à l'entrée, même sans internet. Tout est regroupé automatiquement dans un tableau de bord. Trois niveaux d'accès (patron, gérant, agent), plusieurs formulaires et une signature directement sur l'écran.",
    impact: "La première version est en service : registre des visiteurs, tablette d'accueil qui marche sans internet, tableau de bord avec export dans un tableur, mode sombre et installation sur le téléphone. Une version plus complète, REKOLLECTE+ (clients, réservations, paiements, rappels), est en cours de test.",
    live: true,
    year: '2026',
    progress: 90,
  },
  {
    id: 25,
    title: 'Vazi Express',
    type: 'Livraison',
    subtitle: 'Livraison de Colis à Moto',
    desc: "Plateforme de livraison de colis à moto pensée pour Abidjan : demande de course, prix verrouillé avant confirmation, suivi en direct, code de remise et photo de preuve. Espaces client, livreur et administration ; application mobile Expo en préparation.",
    img: '/images/projects/vazi-express-preview.webp',
    imgMobile: '/images/projects/vazi-express-responsive.webp',
    tech: ['React 19', 'NestJS', 'PostgreSQL (Prisma)', 'Redis / Socket.IO', 'Mapbox', 'Expo'],
    url: '',
    result: '↑ Preuve de remise',
    problem: "À Abidjan, envoyer un colis par un livreur à moto se règle souvent au cas par cas : prix flou négocié à la dernière minute, colis perdu de vue en route, livreur que l'on ne connaît pas et aucune preuve que le destinataire l'a bien reçu.",
    solution: "On demande une course : le prix est calculé sur la distance routière puis fixé avant confirmation, un livreur proche accepte, et on suit le colis en direct. À l'arrivée, le destinataire donne un code au livreur, qui prend une photo : un reçu est généré.",
    impact: "Le service web est prêt et testé en interne ; les essais sur le terrain et le pilote à Abidjan restent à faire. Le paiement se fait en espèces à la remise, aucun paiement en ligne n'est intégré. Aucun lancement n'est annoncé.",
    live: false,
    year: '2026',
    progress: 60,
  },
  {
    id: 26,
    title: 'Redianice',
    type: 'Site Vitrine',
    subtitle: 'Site Vitrine de Startup',
    desc: "Site vitrine de Redianice, startup indépendante d'Abidjan qui conçoit et lance ses propres produits numériques. Il présente l'équipe, la méthode et le premier produit, Mon E-Carnet : hero animé en WebGL, objets 3D qui suivent le défilement, fiches d'équipe et formulaire de contact sécurisé.",
    img: '/images/projects/redianice-preview.webp',
    imgMobile: '/images/projects/redianice-responsive.webp',
    tech: ['HTML / CSS / JavaScript', 'GSAP + ScrollTrigger', 'Lenis', 'WebGL', 'Vercel', 'Resend'],
    url: 'https://redianice.vercel.app/',
    result: '↑ Présence en ligne',
    problem: "Une jeune startup n'avait aucun endroit en ligne pour se présenter, expliquer sa démarche et montrer son premier produit, Mon E-Carnet, sans dévoiler de données réelles.",
    solution: "Un site clair, rapide et vivant : une présentation de l'équipe et de la méthode, une fiche pour chaque membre, une page dédiée au premier produit et un formulaire pour écrire à l'équipe, avec réponse par e-mail.",
    impact: "Le site est en ligne. Le premier produit y est présenté en phase de test, il n'est pas encore ouvert au public.",
    live: true,
    year: '2026',
    progress: 100,
  },
]

export const TESTIMONIALS = [
  { name: 'Tanoh Calvin', role: 'Gérant · MEUBLE CI', project: 'Site Vitrine', rating: 5, text: "AKATech a créé notre site en moins d'une semaine. Résultat professionnel, rapide et exactement ce qu'on voulait. On recommande sans hésiter !", img: '/images/clients/client-1.webp', result: '↑ Visibilité x3' },
  { name: 'Gnihan Tatiana', role: 'Cuisinière & Artisane du fil', project: 'Portfolio', rating: 5, text: "Mon portfolio en ligne tourne depuis 3 mois. Les clients me contactent directement depuis le site. Exactement ce dont j'avais besoin.", img: '/images/clients/client-2.webp', result: '↑ 3 nouveaux clients' },
  { name: 'Yao Darwell', role: 'Graphiste · Designer', project: 'Portfolio', rating: 5, text: "Mon portfolio m'a permis d'obtenir 3 nouveaux clients en un mois. Design superbe, animations fluides. AKATech comprend vraiment les créatifs.", img: '/images/clients/client-3.webp', result: '↑ CA en 30 jours' },
]

export const TEAM = [
  { name: "M'Bollo Aka Elvis", role: 'Fondateur & Développeur Full-Stack', skills: ['React','Django','Python','Next.js','PostgreSQL'], bio: "Développeur passionné basé à Abidjan avec 3+ ans d'expérience. Spécialisé dans les solutions web pour le marché africain.", img: '/images/about-4.webp' },
]

// Projets réellement livrés (en ligne). Les projets encore en développement
// (live: false, ex. Vazi Express) figurent dans les réalisations mais ne
// sont pas comptés dans « Projets livrés ».
export const DELIVERED_COUNT = PROJECTS.filter((p) => p.live).length

export const STATS = [
  { val: DELIVERED_COUNT, suffix: '+', label: 'Projets livrés' },
  { val: 99, suffix: '%', label: 'Clients satisfaits' },
  { val: 3, suffix: '+', label: "Années d'expérience" },
  { val: 48, suffix: 'h', label: 'Support max' },
]

export const BLOG_POSTS = [
  {
    slug: 'pourquoi-votre-business-a-besoin-dun-site-web',
    title: 'Pourquoi votre business a besoin d\'un site web en 2025',
    excerpt: 'En Côte d\'Ivoire, plus de 60% des consommateurs recherchent une entreprise en ligne avant d\'acheter. Voici pourquoi ne pas avoir de site web vous coûte des clients chaque jour.',
    category: 'Stratégie Digitale',
    date: '2025-01-15',
    readTime: '5 min',
    img: '/images/about-1.webp',
  },
  {
    slug: 'mobile-money-integration-site-ecommerce',
    title: 'Intégrer Mobile Money sur votre site e-commerce en Côte d\'Ivoire',
    excerpt: 'MTN MoMo, Orange Money, Wave... Comment accepter les paiements mobiles sur votre boutique en ligne et multiplier vos conversions de 3x.',
    category: 'E-Commerce',
    date: '2025-02-10',
    readTime: '8 min',
    img: '/images/projects/moncashjour-preview.webp',
  },
  {
    slug: 'react-vs-wordpress-pour-pme-africaines',
    title: 'React ou WordPress : que choisir pour votre PME africaine ?',
    excerpt: 'Deux approches, deux philosophies. On compare les coûts, la performance et la maintenance pour vous aider à faire le bon choix selon votre budget.',
    category: 'Développement Web',
    date: '2025-03-05',
    readTime: '6 min',
    img: '/images/about-2.webp',
  },
  {
    slug: 'seo-local-abidjan-guide-complet',
    title: 'SEO Local à Abidjan : le guide complet pour apparaître en premier sur Google',
    excerpt: 'Votre concurrent apparaît en premier sur Google et vous non ? Voici les 7 optimisations SEO locales qui font la différence pour les entreprises abidjanaises.',
    category: 'SEO',
    date: '2025-03-20',
    readTime: '10 min',
    img: '/images/about-3.webp',
  },
  {
    slug: 'ia-ne-remplace-pas-la-competence-technique',
    title: "L'IA ne remplacera jamais une vraie compétence technique",
    excerpt: "Le vibe coding donne l'illusion d'être développeur, jusqu'au moment où il faut corriger un bug ou sécuriser une faille. Retour sur la refonte de mon propre site, de Vite/React à Next.js, avec l'IA comme accélérateur — pas comme pilote.",
    category: 'Développement Web',
    date: '2026-05-18',
    readTime: '4 min',
    img: '/images/blog/ia-vs-competence-technique.webp',
    linkedinUrl: 'https://www.linkedin.com/posts/m-bollo-aka_faut-arr%C3%AAter-de-confondre-les-choses-un-activity-7450893414918746112-bWWb',
  },
  {
    slug: 'les-vibes-vont-detruire-securite-frontend-backend',
    title: 'Non, cacher "ADMIN" dans le frontend n\'est pas de la sécurité',
    excerpt: "Avoir ADMIN, ANNONCEUR, DIFFUSEUR dans un menu déroulant n'est pas un problème en soi. Le vrai problème, c'est si le backend ne vérifie pas les permissions — n'importe qui peut alors se créer un rôle avec Postman.",
    category: 'Développement Web',
    date: '2026-05-28',
    readTime: '3 min',
    img: '/images/blog/frontend-securite-backend.webp',
    linkedinUrl: 'https://www.linkedin.com/posts/m-bollo-aka_les-vibes-vont-d%C3%A9truire-ce-monde-activity-7458516630524850177-TEB1',
  },
  {
    slug: 'plus-gros-mensonge-ia-responsabilite-developpeur',
    title: "Non, l'IA ne vous dispense pas d'apprendre à coder",
    excerpt: "Générer une UI, une API, une app entière avec l'IA, c'est possible. Le problème commence quand ça casse en production à 3h du matin — et que ce n'est pas l'IA qui vient corriger les logs.",
    category: 'Développement Web',
    date: '2026-06-05',
    readTime: '4 min',
    img: '/images/blog/ia-responsabilite-developpeur.webp',
    linkedinUrl: 'https://www.linkedin.com/posts/m-bollo-aka_le-plus-gros-mensonge-quon-a-vendu-aux-d%C3%A9veloppeurs-activity-7460711653911842816-TFlf',
  },
  {
    slug: 'lancer-projet-imparfait-plutot-que-jamais',
    title: 'Le plus grand cimetière de projets se trouve dans la tête des développeurs',
    excerpt: "La toute première version de Facebook ne paierait probablement même pas un designer aujourd'hui. Elle a pourtant donné naissance à l'une des plus grandes plateformes du monde. Mieux vaut lancer imparfait que ne jamais lancer.",
    category: 'Stratégie Digitale',
    date: '2026-06-14',
    readTime: '3 min',
    img: '/images/blog/lancer-projet-imparfait.webp',
    linkedinUrl: 'https://www.linkedin.com/posts/m-bollo-aka_cette-ancienne-page-facebook-ne-paierait-activity-7474370460831580161-0ypl',
  },
  {
    slug: 'erreurs-de-code-dun-junior-et-comment-progresser',
    title: "Les erreurs classiques d'un junior (et pourquoi elles sont normales)",
    excerpt: "Variables inutilisées, secrets en dur, console.log oubliés... Le premier code d'un junior ressemble souvent à ça. Voici pourquoi ce n'est pas grave, et comment progresser vite.",
    category: 'Développement Web',
    date: '2026-06-25',
    readTime: '4 min',
    img: '/images/blog/erreurs-junior-code-review.webp',
    linkedinUrl: 'https://www.linkedin.com/posts/m-bollo-aka_mes-erreurs-davant-le-premier-pull-activity-7479465548054142976-3pog',
  },
  {
    slug: 'vibe-coding-nouvelle-abstraction-developpement',
    title: 'Le vibe coding dérange, comme chaque nouvelle abstraction avant lui',
    excerpt: "Compilateurs, frameworks, puis l'IA : chaque nouvel outil a d'abord suscité la méfiance avant de devenir un standard. Ce qui compte n'a jamais été l'outil, mais la valeur qu'on crée avec.",
    category: 'Développement Web',
    date: '2026-07-02',
    readTime: '4 min',
    img: '/images/blog/vibe-coding-abstraction.webp',
    linkedinUrl: 'https://www.linkedin.com/posts/m-bollo-aka_pour-dire-vrai-le-vibe-coding-d%C3%A9range-certaines-activity-7479806249555968000-wJWL',
  },
]

export const FAQ_ITEMS = [
  { q: 'Combien coûte un site avec AKATech ?', a: "À partir de 200 000 FCFA pour un site vitrine (le portfolio en fait partie). Le tarif exact dépend du type de projet (vitrine, e-commerce, application sur-mesure) et des fonctionnalités souhaitées : il vous est communiqué dans un devis gratuit sous 24h." },
  { q: 'Comment se déroule le paiement de mon site ?', a: "Pour un projet jusqu'à 2 000 000 FCFA : 50 % à la commande pour démarrer, et 50 % à la livraison, juste avant de recevoir les fichiers finaux et les accès. Pour un projet supérieur à 2 000 000 FCFA, le paiement se fait en trois temps : 40 % à la commande, 30 % à la validation de la pré-version et 30 % à la livraison, après la recette." },
  { q: "Pourquoi un acompte est-il demandé avant de commencer ?", a: "L'acompte confirme votre commande et permet de démarrer le développement immédiatement, de récupérer vos contenus (logo, textes, photos) et de garantir le délai annoncé. Sans acompte, le projet n'est pas priorisé dans le planning." },
  { q: 'Quels moyens de paiement acceptez-vous ?', a: "Orange Money, MTN Mobile Money, Wave ou virement bancaire. Vous précisez votre moyen préféré au moment de la commande et les coordonnées correspondantes vous sont envoyées." },
  { q: 'Quel est le délai pour recevoir mon site ?', a: "Cela dépend du pack choisi : 10 à 15 jours pour une landing page, 2 à 5 semaines pour une vitrine, 3 à 10 semaines pour une boutique e-commerce, 4 à 28 semaines pour une application web, un SaaS ou un projet complexe. Le délai exact est précisé dans le devis et démarre dès réception de l'acompte et de vos contenus." },
  { q: 'Quand mon site est-il mis en ligne ?', a: "Une fois le solde réglé. Avant cela, un lien de prévisualisation vous est partagé pour valider le design et le contenu." },
  { q: "Puis-je voir mon site avant qu'il soit en ligne ?", a: "Oui, toujours. Vous recevez un lien de prévisualisation pour tester le site, faire vos retours et demander des ajustements avant la mise en ligne officielle." },
  { q: 'Combien de modifications sont incluses ?', a: "Les petites corrections — textes, couleurs, ajustements visuels — sont incluses pendant la phase de validation. Les modifications majeures, comme un changement de structure ou l'ajout de pages, font l'objet d'un devis complémentaire." },
  { q: 'Quel pack choisir pour mon projet ?', a: "Tout dépend de vos besoins : portfolio, vitrine, boutique e-commerce ou application plus complexe type SaaS. Un conseil gratuit est proposé lors du brief initial pour identifier le pack le plus adapté." },
  { q: "Le nom de domaine et l'hébergement sont-ils vraiment gratuits ?", a: "Le nom de domaine est offert la première année sur tous les packs, et l'hébergement l'est aussi sur les packs Site Vitrine et E-commerce. Pour une application web, un SaaS ou un projet complexe, nous mettons l'hébergement en place à votre nom et les frais d'infrastructure sont facturés par les fournisseurs, au coût réel. Après la première année, le renouvellement du domaine coûte environ 15 000 à 30 000 FCFA par an selon l'extension, avec un rappel envoyé avant l'expiration." },
  { q: 'Quels contenus dois-je fournir ?', a: "Votre logo, vos photos, vos textes de présentation et vos informations de contact. Plus ces éléments arrivent vite, plus le développement avance rapidement." },
  { q: "Je n'ai pas de logo ni de textes, pouvez-vous m'aider ?", a: "Oui. AKATech peut proposer un logo simple, utiliser des visuels libres de droits adaptés à votre activité, ou rédiger une trame de textes professionnels que vous ajustez ensuite. Ces services s'ajoutent au devis initial." },
  { q: 'Qui gère mon site après la livraison ?', a: "Vous. Tous les accès — administration, hébergement, nom de domaine — vous sont transmis, ainsi qu'un tutoriel simple pour modifier vos textes et images sans dépendre de quelqu'un d'autre. Si vous préférez ne pas vous en occuper, AKATech propose une offre de maintenance mensuelle : corrections, mises à jour de sécurité, sauvegardes et support." },
  { q: 'Combien coûte la maintenance après la livraison ?', a: "Elle se calcule entre 15 et 20 % du prix du projet par an, payée en mensualités, avec un minimum de 10 000 FCFA par mois : de 10 000 à 15 000 FCFA par mois pour un site vitrine, jusqu'aux projets complexes, chiffrés sur devis. Les frais d'hébergement et de services tiers sont facturés à part par leurs fournisseurs." },
  { q: "Que se passe-t-il si le délai annoncé n'est pas respecté ?", a: "C'est rare, mais si cela arrive du fait d'AKATech, une pénalité s'applique sur le montant total et vous pouvez demander l'annulation du projet avec un remboursement partiel. Ces conditions figurent dans le devis signé." },
  { q: 'Mon site a un bug après la livraison, que faites-vous ?', a: "Tout bug lié au développement est corrigé gratuitement pendant la durée de support incluse dans votre pack (de 1 à 6 mois selon le pack). Ensuite, il peut être pris en charge par l'offre de maintenance mensuelle ou sur devis." },
  { q: 'Comment commander mon site ?', a: "Trois étapes : échange sur votre projet et le pack adapté, envoi d'un devis avec l'acompte (50 %, ou 40 % pour un projet supérieur à 2 000 000 FCFA), puis dès réception du paiement le développement démarre." },
  { q: 'Quelles technologies utilise AKATech ?', a: "Next.js et React côté frontend pour des sites rapides et modernes, Django ou Flask côté backend pour les API et fonctionnalités sur-mesure, PostgreSQL pour les bases de données. Des choix éprouvés, qui évoluent avec votre activité plutôt que de la brider." },
  { q: 'Faites-vous du référencement (SEO) ?', a: "Oui, à deux niveaux : le SEO de base (structure, performance, balises) est inclus dans tous les packs, et un SEO avancé est proposé sur les packs supérieurs. AKATech propose aussi la création et l'optimisation de fiche Google My Business pour le référencement local à Abidjan." },
]

/* ─────────────────────────────────────────────────────────
   PRICING — source unique (desktop ET mobile importent ceci)
   Champs : badge, price, del (livraison), features, popular

   RÈGLES COMMERCIALES (oct. 2026)
   • Échéancier : projet ≤ 2 000 000 FCFA → 50 % commande / 50 % livraison ;
     projet > 2 000 000 FCFA → 40 % commande / 30 % validation de la pré-version
     / 30 % livraison (après recette).
   • Domaine offert 1 an sur tous les packs. Hébergement offert 1 an : Site Vitrine
     et E-commerce uniquement. App Web / SaaS, Marketplace et Projet complexe :
     hébergement mis en place au nom du client, frais d'infra facturés au coût réel.
   • Maintenance : 15 à 20 % du prix du projet par an, en mensualités (minimum
     10 000 FCFA/mois) — voir `maintenance` ci-dessous.
───────────────────────────────────────────────────────── */
export const PRICING = {
  // Le portfolio n'a plus sa propre grille : d'après l'étude de marché
  // comparative (CI/Afrique, France, USA — sept. 2026), ce n'est pas une
  // offre à part mais une application du Site Vitrine ("les familles
  // expliquent les projets, les offres expliquent les prix" — voir
  // WHAT_WE_BUILD plus bas). Le questionnaire "portfolio" reste séparé
  // (questions différentes : CV, projets, témoignages plutôt que
  // horaires/services) mais son devis pioche dans cette même grille —
  // voir CATEGORY_BY_TYPE dans lib/quote-calc.js.
  vitrine: {
    label: 'Site Vitrine',
    plans: [
      {
        badge: 'LANDING', price: '200 000 FCFA', del: '10 à 15 jours',
        features: ['1 page : présentation, services, CTA', 'Design responsive',
          'Formulaire de contact WhatsApp', 'Nom de domaine offert (1 an)',
          'Hébergement inclus (1 an)', '1 mois support'],
      },
      {
        badge: 'STARTER', price: '350 000 FCFA', del: '2 à 3 semaines', popular: true,
        features: ['4 à 6 pages', 'Design sur-mesure', 'Formulaire de contact', 'SEO de base',
          'Nom de domaine offert (1 an)', 'Hébergement inclus (1 an)', '2 mois support'],
      },
      {
        badge: 'PREMIUM', price: '750 000 FCFA', del: '3 à 5 semaines',
        features: ['10 à 15 pages', 'Design sur mesure', 'Blog intégré', 'SEO + AEO',
          'Animations avancées', 'Nom de domaine offert (1 an)', 'Hébergement inclus (1 an)',
          '3 mois support', 'Formation 2h'],
      },
    ],
  },
  ecommerce: {
    label: 'E-commerce',
    plans: [
      {
        badge: 'STARTER', price: '650 000 FCFA', del: '3 à 5 semaines',
        features: ["Jusqu'à 50 produits", 'Paiement Mobile Money', 'Gestion commandes',
          'Tableau de bord', 'Nom de domaine offert (1 an)',
          'Hébergement inclus (1 an)', '1 mois support'],
      },
      {
        badge: 'PRO', price: '1 100 000 FCFA', del: '4 à 7 semaines', popular: true,
        features: ['200 à 500 produits', 'Multi-paiement', 'Gestion stock temps réel',
          'SEO produits + CRO + Analytics', 'Nom de domaine offert (1 an)', 'Hébergement inclus (1 an)',
          '3 mois support', 'Formation admin'],
      },
      {
        // 1,2M → 1,5M (étude de marché sept. 2026) → 2M (révision oct. 2026) :
        // le marché ivoirien monte jusqu'à 2-5M pour de l'e-commerce complet
        // (multi-vendeurs/KYC type Nexura/ShopCI) — 2M reste dans le bas de
        // la fourchette pour ce niveau de complexité.
        badge: 'ELITE', price: '2 000 000 FCFA', del: '6 à 10 semaines',
        features: ['Produits illimités', 'API paiement personnalisée',
          'Optimisation IA (GEO)', 'Automatisations + Rapports avancés',
          'Nom de domaine offert (1 an)', 'Hébergement inclus (1 an)',
          '6 mois support', 'Formation équipe'],
      },
    ],
  },
  saas: {
    label: 'App Web / SaaS',
    // 3 archétypes (fourchettes, pas de palier fixe) plutôt qu'un
    // "Sur devis" unique — alignés sur AKATech_Offres_..._SaaS_GBP.md
    // section 5. Nécessaire pour que le moteur de devis (lib/quote-calc.js)
    // puisse classer une réponse de questionnaire sur un tier réel plutôt
    // que de tout renvoyer vers "étude personnalisée".
    // Révision oct. 2026 : fourchettes relevées (≈ ×1,8) — les anciennes
    // (étude de marché sept. 2026) revenaient à ~40 000 FCFA par jour de
    // travail. Le moteur de devis (base, PDF, dashboard) a besoin d'un min
    // ET d'un max : le marketplace garde donc une fourchette bornée, même
    // si on le présente en pratique comme « dès 4 M, sur devis ».
    plans: [
      {
        badge: 'MVP / OUTIL MÉTIER', price: '1 000 000 – 1 800 000 FCFA', del: '4 à 7 semaines',
        features: ['1 à 2 types d\'utilisateurs (utilisateur + admin)', 'Authentification simple',
          'Tableau de bord basique', '1 workflow métier principal automatisé',
          'Export de données (PDF, Excel)', 'Nom de domaine offert (1 an)',
          "Hébergement mis en place (frais d'infra à votre charge)", '1 mois support'],
      },
      {
        badge: 'PLATEFORME + ABONNEMENT', price: '2 000 000 – 3 800 000 FCFA', del: '8 à 12 semaines', popular: true,
        features: ['Comptes utilisateurs avec rôles (client / admin)', 'Paiement récurrent + Mobile Money',
          'Dashboard utilisateur + back-office admin', 'Notifications (email, WhatsApp)',
          'Intégrations tierces (paiement, emailing)', 'Nom de domaine offert (1 an)',
          "Hébergement mis en place (frais d'infra à votre charge)", '3 mois support', 'Formation admin'],
      },
      {
        badge: 'MARKETPLACE MULTI-ACTEURS', price: '4 000 000 – 7 000 000 FCFA', del: '12 à 20 semaines',
        features: ['Plusieurs types d\'utilisateurs (client, vendeur/prestataire, admin)',
          'Rôles et permissions avancés, multi-tenant si besoin', 'Suivi des encaissements et reversements entre acteurs',
          'Géolocalisation / suivi temps réel si pertinent', 'Notifications multi-canal temps réel',
          'Dashboard analytics avancé', 'API pour intégrations futures', 'Nom de domaine offert (1 an)',
          "Hébergement mis en place (frais d'infra à votre charge)", '6 mois support', 'Formation équipe'],
      },
      {
        // Ajouté oct. 2026 : au-delà de 7 M, un projet multi-modules (ex. marketplace +
        // livraison + assistant métier) sortait de la grille. Fourchette bornée (min ET max)
        // pour le moteur de devis ; au-delà de 12 M : étude personnalisée.
        badge: 'PROJET COMPLEXE', price: '7 000 000 – 12 000 000 FCFA', del: '16 à 28 semaines',
        features: ['Plateforme multi-modules (ex. marketplace + livraison + assistant métier)',
          '3 types d\'utilisateurs ou plus, rôles et permissions avancés',
          'Modules métier sur mesure (livreurs, reversements, abonnements…)',
          'Assistant métier IA avec garde-fous', 'Temps réel, cartes, notifications multi-canal',
          'Dashboard analytics avancé + API pour intégrations futures',
          'Nom de domaine offert (1 an)', "Hébergement mis en place (frais d'infra à votre charge)",
          '6 mois support', 'Formation équipe'],
      },
    ],
  },
  gbp: {
    label: 'Fiche Google',
    plans: [
      {
        badge: 'CRÉATION', price: '59 000 FCFA', del: '2 à 7 jours', popular: true,
        features: ['Création complète de zéro', 'Vérification infos (NAP)', 'Horaires + zone de service',
          'Catégorie + attributs', 'Lien vers le site web', 'Photos (logo, local, produits)',
          'Description optimisée SEO local', 'Mots-clés locaux ciblés', 'Intégration carte sur le site'],
      },
      {
        badge: 'OPTIMISATION', price: '29 000 FCFA', del: '1 à 3 jours',
        features: ['Correction fiche existante', 'Vérification infos (NAP)', 'Horaires + zone de service',
          'Catégorie + attributs', 'Photos (logo, local, produits)', 'Description optimisée SEO local',
          'Mots-clés locaux ciblés'],
      },
      {
        badge: 'SUIVI MENSUEL', price: '9 000 FCFA/mois', del: 'Continu',
        features: ['Réponse aux avis clients', 'Posts Google réguliers', 'Suivi statistiques de fiche'],
      },
    ],
  },
  // Maintenance & évolutions — réintroduite oct. 2026 (offre post-livraison).
  // Règle : 15 à 20 % du prix du projet par an, payée en mensualités, minimum 10 000 FCFA/mois.
  // Le prix affiché va de la formule Essentielle à la formule Avancée. Les frais d'hébergement
  // et de services tiers (Vercel, Render, Neon…) ne sont PAS inclus : facturés par les fournisseurs.
  maintenance: {
    label: 'Maintenance',
    plans: [
      {
        badge: 'SITE VITRINE', price: '10 000 – 15 000 FCFA/mois', del: 'Contrat mensuel',
        features: ['Essentielle : 10 000 FCFA/mois · Avancée : 15 000 FCFA/mois', 'Mises à jour et correctifs',
          'Sauvegardes contrôlées', 'Support par e-mail / WhatsApp', 'Hébergement et domaine facturés à part'],
      },
      {
        badge: 'E-COMMERCE', price: '15 000 – 35 000 FCFA/mois', del: 'Contrat mensuel',
        features: ['Essentielle : 15 000 FCFA/mois · Avancée : 35 000 FCFA/mois', 'Mises à jour de sécurité',
          'Sauvegardes contrôlées', 'Suivi des paiements et des erreurs (Avancée)', 'Support prioritaire (Avancée)'],
      },
      {
        badge: 'MVP / OUTIL MÉTIER', price: '15 000 – 30 000 FCFA/mois', del: 'Contrat mensuel',
        features: ['Essentielle : 15 000 FCFA/mois · Avancée : 30 000 FCFA/mois', 'Corrections et mises à jour de sécurité',
          'Sauvegardes contrôlées', 'Petites évolutions (Avancée)', 'Infra facturée à part'],
      },
      {
        badge: 'PLATEFORME + ABONNEMENT', price: '40 000 – 60 000 FCFA/mois', del: 'Contrat mensuel',
        features: ['Essentielle : 40 000 FCFA/mois · Avancée : 60 000 FCFA/mois', 'Corrections et mises à jour de sécurité',
          'Sauvegardes et test de restauration', 'Supervision (Avancée)', 'Évolutions mineures (Avancée)', 'Rapport mensuel'],
      },
      {
        badge: 'MARKETPLACE MULTI-ACTEURS', price: '75 000 – 115 000 FCFA/mois', del: 'Contrat mensuel',
        features: ['Essentielle : 75 000 FCFA/mois · Avancée : 115 000 FCFA/mois', 'Corrections et mises à jour de sécurité',
          'Sauvegardes et test de restauration', 'Supervision par alertes (Avancée)', 'Évolutions mineures (Avancée)',
          'Support sous 48 h / 24 h', 'Rapport mensuel'],
      },
      {
        badge: 'PROJET COMPLEXE', price: 'Sur devis', del: 'Contrat mensuel',
        features: ['Formules Essentielle et Avancée chiffrées selon le projet', 'Repère : 15 à 20 % du prix du projet par an, en mensualités',
          'Corrections et mises à jour de sécurité', 'Sauvegardes et test de restauration', 'Supervision par alertes (Avancée)',
          'Évolutions mineures incluses (Avancée)', 'Support sous 48 h / 24 h', 'Rapport mensuel et réunion trimestrielle (Avancée)'],
      },
    ],
  },
}

// ── CE QUE NOUS CONCEVONS ────────────────────────────────────
// Familles de projets (pour la page d'accueil / services), distinctes de
// PRICING : "les familles expliquent les projets, les offres expliquent
// les prix" — une même famille (ex. Site Vitrine) peut couvrir plusieurs
// paliers de prix, et une famille peut ne pas encore avoir de palier
// dédié (ex. Gestion commerciale, POS). `examples` référence des titres
// réels de PROJECTS ci-dessus — ne pas en inventer de nouveaux ici.
export const WHAT_WE_BUILD = [
  {
    slug: 'site-vitrine', short: 'Site vitrine', icon: '🌐', title: 'Sites vitrines & sites métier',
    desc: "Pour présenter votre activité et transformer vos visiteurs en clients : entreprise, agence, cabinet, école, pressing, salon, restaurant, portfolio professionnel.",
    examples: ['MD Laverie Pressing'],
    img: '/images/ce%20que%20nous%20concevons/types_sites_01_creation.webp',
  },
  {
    slug: 'e-commerce', short: 'E-commerce', icon: '🛒', title: 'E-commerce',
    desc: "Pour vendre vos produits directement en ligne : catalogue, panier, paiement Mobile Money, livraison, gestion des stocks, tableau de bord vendeur.",
    examples: ['ShopCI', 'ElvisMarket', 'Chez Florence'],
    img: '/images/ce%20que%20nous%20concevons/types_sites_02_ecommerce.webp',
  },
  {
    slug: 'reservation', short: 'Réservation', icon: '📅', title: 'Réservation & rendez-vous',
    desc: "Pour permettre à vos clients de réserver sans vous appeler : résidences, hôtels, salons, restaurants, prestations, location de véhicules, salles.",
    examples: ['New Horizon Service'],
    img: '/images/ce%20que%20nous%20concevons/types_sites_03_reservation.webp',
  },
  {
    slug: 'plateforme', short: 'Plateforme', icon: '🏢', title: 'Plateformes & marketplaces',
    desc: "Pour une vraie plateforme multi-utilisateurs : comptes clients/vendeurs, géolocalisation, KYC, paiements répartis, dashboards.",
    examples: ['Nexura'],
    img: '/images/ce%20que%20nous%20concevons/types_sites_04_plateformes.webp',
  },
  {
    slug: 'gestion', short: 'Gestion & facturation', icon: '🧾', title: 'Gestion commerciale & facturation',
    desc: "Pour digitaliser la gestion quotidienne de votre activité : devis, factures avec TVA et numérotation automatique, clients, historique des ventes, export PDF.",
    examples: [],
    img: '/images/ce%20que%20nous%20concevons/types_sites_05_gestion.webp',
  },
  {
    slug: 'application', short: 'Application web', icon: '⚙️', title: 'Applications web & outils métier',
    desc: "Pour automatiser un processus propre à votre entreprise : dashboard métier, CRM, gestion de stocks, suivi logistique, portail client, SaaS sur-mesure.",
    examples: ['MonCashJour', 'LivreurTrack Pro'],
    img: '/images/ce%20que%20nous%20concevons/types_sites_06_applications.webp',
  },
  {
    slug: 'pos', short: 'POS & caisse', icon: '🧮', title: 'POS & caisse',
    desc: "Système d'encaissement et de caisse physique.",
    examples: [], comingSoon: true,
    img: '/images/ce%20que%20nous%20concevons/types_sites_07_pos.webp',
  },
]

// ── PROCESSUS AKATECH ────────────────────────────────────────
// Les 6 étapes du contrat de prestation (Contrat_Prestation_AKATech_
// Studio_MAJ.docx) — source canonique pour le site (actuellement dupliqué
// dans app/HomeClientDesktop.js `WHY_PANELS` et son équivalent mobile) et
// pour la régénération des documents contrat/devis. Toute reformulation
// du texte doit rester alignée avec les articles du contrat, pas l'inverse.
export const PROCESS_STEPS = [
  { n: '01', title: 'Brief & découverte', desc: "Nous échangeons sur votre projet, vos objectifs et vos besoins. Premier échange gratuit et sans engagement.", img: '/images/process/process_akatech_01_brief.webp' },
  { n: '02', title: 'Devis & contrat', desc: "Nous définissons le périmètre, le prix et le délai, puis validons le projet ensemble.", img: '/images/process/process_akatech_02_devis.webp' },
  { n: '03', title: 'Acompte & contenus', desc: "Vous versez l'acompte (50 %, ou 40 % pour un projet supérieur à 2 000 000 FCFA) et transmettez les éléments nécessaires (logo, informations, visuels...). Le délai démarre lorsque l'acompte et les contenus sont reçus.", img: '/images/process/process_akatech_03_acompte.webp' },
  { n: '04', title: 'Conception & développement', desc: "Nous concevons et développons votre projet conformément au devis.", img: '/images/process/process_akatech_04_conception.webp' },
  { n: '05', title: 'Prévisualisation & validation', desc: "Vous recevez un lien de prévisualisation, testez le projet, et nous effectuons les corrections mineures incluses. Pour un projet supérieur à 2 000 000 FCFA, une deuxième tranche de 30 % est due à la validation de la pré-version.", img: '/images/process/process_akatech_05_validation.webp' },
  { n: '06', title: 'Livraison & suivi', desc: "Après recette et paiement du solde, le projet est mis en ligne et les accès sont transmis. La période de garantie/support commence ensuite.", img: '/images/process/process_akatech_06_livraison.webp' },
]

// ── TYPES DE PROJET ──────────────────────────────────────────
// Vocabulaire partagé entre le formulaire de contact (app/api/contact)
// et l'assistant IA (lib/assistant.js) pour classer une demande.
// Slug → libellé humain affiché dans les emails / utilisé par le LLM.
export const PROJECT_TYPE_LABELS = {
  'portfolio': 'Portfolio professionnel',
  'site-vitrine': 'Conception de Site Web',
  'e-commerce': 'E-commerce',
  'application-web': 'Application Web / SaaS',
  'cartes-dashboards': 'Cartes Interactives & Dashboards',
  'chatbot-ia': 'Intégration IA Chatbot',
  'paiement-en-ligne': 'Intégration de Paiement en Ligne',
  'videos-ia-marketing': 'Vidéos IA pour le marketing',
  'api-backend': 'API & Backend', // service retiré du catalogue — conservé ici pour l'affichage des leads déjà existants avec ce type
  'google-my-business': 'Fiche Google My Business',
  'seo': 'Optimisation SEO',
  'maintenance': 'Maintenance & Support', // offre de maintenance post-livraison (voir PRICING.maintenance)
  'autre': 'Autre',
}

export function getLocalizedData(language = 'fr') {
  const safeLanguage = ['fr', 'en', 'es'].includes(language) ? language : 'fr'

  const serviceTitles = {
    fr: {},
    en: {
      'Conception de Site Web': 'Website Design',
      'Cartes Interactives & Dashboards': 'Interactive Maps & Dashboards',
      'Optimisation SEO': 'SEO Optimization',
      'Fiche Google My Business': 'Google Business Profile',
      'Intégration IA Chatbot': 'AI Chatbot Integration',
      'Intégration de Paiement en Ligne': 'Online Payment Integration',
      'Vidéos IA pour le marketing': 'AI Videos for Marketing',
    },
    es: {
      'Conception de Site Web': 'Diseño de sitios web',
      'Cartes Interactives & Dashboards': 'Mapas interactivos y dashboards',
      'Optimisation SEO': 'Optimización SEO',
      'Fiche Google My Business': 'Perfil de empresa de Google',
      'Intégration IA Chatbot': 'Integración de chatbot IA',
      'Intégration de Paiement en Ligne': 'Integración de pagos online',
      'Vidéos IA pour le marketing': 'Videos con IA para marketing',
    },
  }

  const serviceDescs = {
    fr: {},
    en: {
      "Création de sites web modernes, responsive et optimisés pour convertir vos visiteurs en clients. Du portfolio à la plateforme e-commerce, chaque page est conçue avec soin.": 'Modern, responsive websites designed to convert visitors into customers. From portfolio to e-commerce platform, every page is built with care.',
      "Intégration de cartes interactives Mapbox / Leaflet et de dashboards de visualisation de données. Vos données brutes deviennent des interfaces lisibles et actionnables.": 'Integration of interactive Mapbox / Leaflet maps and data visualization dashboards. Your raw data becomes clear, actionable interfaces.',
      "Audit technique, recherche de mots-clés, optimisation des pages et de la vitesse pour améliorer votre positionnement sur Google. Vous gagnez en visibilité, AKATech s'occupe du reste.": 'Technical audit, keyword research, page and speed optimization to improve your ranking on Google. You gain visibility while AKATech handles the rest.',
      "Création ou optimisation de votre fiche Google (NAP, catégories, photos, description SEO local) et suivi mensuel : réponse aux avis, publications et statistiques.": 'Creation or optimization of your Google Business Profile (NAP, categories, photos, local SEO description) and monthly follow-up: review replies, posts and stats.',
      "Un assistant métier conversationnel — ce que nous appelons « chatbot » — intégré à votre site ou à votre application. Il connaît votre activité, répond à vos visiteurs et à vos clients, qualifie les demandes et peut préparer des actions (recherche, suivi, brouillon) que la personne confirme toujours. Même famille d'assistant que celui d'akatech.vercel.app, pensé pour augmenter la productivité de votre business.": 'A conversational business assistant — what we call a "chatbot" — integrated into your site or application. It knows your business, answers visitors and customers, qualifies requests and can prepare actions (search, tracking, drafts) that the person always confirms. Same family of assistant as akatech.vercel.app, designed to increase business productivity.',
      "Intégration de solutions de paiement directement sur votre site — Mobile Money (Orange Money, MTN MoMo, Wave) et carte bancaire selon vos besoins — pour encaisser sans friction.": 'Integration of payment solutions directly into your site — Mobile Money (Orange Money, MTN MoMo, Wave) and credit cards as needed — to collect payments without friction.',
      "Création de vidéos générées par IA pour vos réseaux sociaux, publicités et pages de vente : scénario, visuels, voix et montage. Des contenus pensés pour capter l'attention, gagner en engagement et soutenir vos ventes.": 'AI-generated videos for your social media, ads and sales pages: script, visuals, voice and editing. Content designed to grab attention, boost engagement and support your sales.',
    },
    es: {
      "Création de sites web modernes, responsive et optimisés pour convertir vos visiteurs en clients. Du portfolio à la plateforme e-commerce, chaque page est conçue avec soin.": 'Creación de sitios web modernos, responsivos y optimizados para convertir visitantes en clientes. Desde portfolio hasta plataforma de comercio electrónico, cada página se diseña con cuidado.',
      "Intégration de cartes interactives Mapbox / Leaflet et de dashboards de visualisation de données. Vos données brutes deviennent des interfaces lisibles et actionnables.": 'Integración de mapas interactivos Mapbox/Leaflet y dashboards de visualización de datos. Tus datos brutos se convierten en interfaces claras y accionables.',
      "Audit technique, recherche de mots-clés, optimisation des pages et de la vitesse pour améliorer votre positionnement sur Google. Vous gagnez en visibilité, AKATech s'occupe du reste.": 'Auditoría técnica, investigación de palabras clave y optimización de páginas y velocidad para mejorar tu posicionamiento en Google. Tú ganas visibilidad y AKATech se encarga del resto.',
      "Création ou optimisation de votre fiche Google (NAP, catégories, photos, description SEO local) et suivi mensuel : réponse aux avis, publications et statistiques.": 'Creación u optimización de tu ficha de Google (NAP, categorías, fotos, descripción SEO local) y seguimiento mensual: respuestas a reseñas, publicaciones y estadísticas.',
      "Un assistant métier conversationnel — ce que nous appelons « chatbot » — intégré à votre site ou à votre application. Il connaît votre activité, répond à vos visiteurs et à vos clients, qualifie les demandes et peut préparer des actions (recherche, suivi, brouillon) que la personne confirme toujours. Même famille d'assistant que celui d'akatech.vercel.app, pensé pour augmenter la productivité de votre business.": 'Un asistente de negocio conversacional — lo que llamamos «chatbot» — integrado en tu sitio o aplicación. Conoce tu actividad, responde a visitantes y clientes, califica solicitudes y puede preparar acciones (búsqueda, seguimiento, borradores) que la persona siempre confirma. Misma familia de asistente que akatech.vercel.app, pensado para aumentar la productividad de tu negocio.',
      "Intégration de solutions de paiement directement sur votre site — Mobile Money (Orange Money, MTN MoMo, Wave) et carte bancaire selon vos besoins — pour encaisser sans friction.": 'Integración de soluciones de pago directamente en tu sitio — Mobile Money (Orange Money, MTN MoMo, Wave) y tarjeta según tus necesidades — para cobrar sin fricción.',
      "Création de vidéos générées par IA pour vos réseaux sociaux, publicités et pages de vente : scénario, visuels, voix et montage. Des contenus pensés pour capter l'attention, gagner en engagement et soutenir vos ventes.": 'Creación de videos generados con IA para tus redes sociales, anuncios y páginas de venta: guion, visuales, voz y edición. Contenidos pensados para captar la atención, aumentar el engagement y apoyar tus ventas.',
    },
  }

  const faqMap = {
    fr: {},
    en: {
      'Combien coûte un site avec AKATech ?': 'How much does a website with AKATech cost?',
      'Comment se déroule le paiement de mon site ?': 'How does the payment for my website work?',
      'Quels moyens de paiement acceptez-vous ?': 'Which payment methods do you accept?',
      'Quel est le délai pour recevoir mon site ?': 'How long does it take to receive my website?',
      'Quand mon site est-il mis en ligne ?': 'When is my website launched?',
      'Quel pack choisir pour mon projet ?': 'Which package should I choose for my project?',
      'Quelles technologies utilise AKATech ?': 'Which technologies does AKATech use?',
    },
    es: {
      'Combien coûte un site avec AKATech ?': '¿Cuánto cuesta un sitio web con AKATech?',
      'Comment se déroule le paiement de mon site ?': '¿Cómo funciona el pago de mi sitio web?',
      'Quels moyens de paiement acceptez-vous ?': '¿Qué métodos de pago aceptan?',
      'Quel est le délai pour recevoir mon site ?': '¿Cuánto tarda en entregarse mi sitio web?',
      'Quand mon site est-il mis en ligne ?': '¿Cuándo se publica mi sitio web?',
      'Quel pack choisir pour mon projet ?': '¿Qué paquete elegir para mi proyecto?',
      'Quelles technologies utilise AKATech ?': '¿Qué tecnologías usa AKATech?',
    },
  }

  const localizedPricing = (() => {
    const source = PRICING
    if (safeLanguage === 'fr') return source

    const translateLabel = (value) => {
      const labels = {
        en: {
          'Site Vitrine': 'Showcase Website',
          'E-commerce': 'E-commerce',
          'App Web / SaaS': 'Web App / SaaS',
          'Fiche Google': 'Google Business Profile',
          'Maintenance': 'Maintenance',
        },
        es: {
          'Site Vitrine': 'Sitio web de presentación',
          'E-commerce': 'E-commerce',
          'App Web / SaaS': 'Aplicación Web / SaaS',
          'Fiche Google': 'Perfil de empresa de Google',
          'Maintenance': 'Mantenimiento',
        },
      }
      return labels[safeLanguage]?.[value] || value
    }

    return Object.fromEntries(
      Object.entries(source).map(([key, category]) => [
        key,
        {
          ...category,
          label: translateLabel(category.label),
        },
      ])
    )
  })()

  const localizedProjects = PROJECTS.map((project) => ({
    ...project,
    desc: safeLanguage === 'fr'
      ? project.desc
      : (PROJECT_DESCRIPTION_TRANSLATIONS[project.title]?.[safeLanguage] || project.desc),
  }))
  return {
    SERVICES: SERVICES.map((service) => ({
      ...service,
      title: serviceTitles[safeLanguage][service.title] || service.title,
      desc: serviceDescs[safeLanguage][service.desc] || service.desc,
      features: service.features,
    })),
    PROJECTS: localizedProjects,
    FAQ_ITEMS: FAQ_ITEMS.map((item) => ({
      ...item,
      q: faqMap[safeLanguage][item.q] || item.q,
      a: item.a,
    })),
    PRICING: localizedPricing,
    PROJECT_TYPE_LABELS,
    TEAM,
  }
}

// ── Histoires « côté client » ────────────────────────────────
// Problème / solution / fonctions phares en langage simple, sans
// technologies (voir lib/project-stories.js). Les champs problem, solution,
// result et impact ci-dessus suivent la même règle dure (voir le bloc au-dessus
// de PROJECTS) et servent de repli ; desc et tech restent pour l'Explorer,
// le dashboard et le SEO.
for (const project of PROJECTS) {
  project.story = PROJECT_STORIES[project.id] || null
}

// ── Slug d'URL et rubrique ───────────────────────────────────
// `slug`     → adresse de la page de détail : /projects/<slug>
// `category` → l'une des rubriques de WHAT_WE_BUILD (« E-commerce »,
//              « Site vitrine »…), choisie dans lib/project-categories.js.
//              Remplace `type` à l'affichage : `type` garde ses valeurs
//              d'origine (dashboard, Explorer, assistant).
for (const project of PROJECTS) {
  project.slug = slugify(project.title)
  const rubric = WHAT_WE_BUILD.find((c) => c.slug === PROJECT_CATEGORY_BY_ID[project.id])
  project.category = rubric
    ? { slug: rubric.slug, label: rubric.short, title: rubric.title, desc: rubric.desc }
    : null
}

/** Réalisation à partir de son slug d'URL (null si inconnue). */
export function getProjectBySlug(slug) {
  return PROJECTS.find((p) => p.slug === slug) || null
}

/**
 * Autres réalisations à proposer en bas d'une page de détail : d'abord celles
 * de la même rubrique, puis, pour compléter, les plus récentes.
 */
export function getRelatedProjects(project, limit = 3) {
  const others = PROJECTS.filter((p) => p.id !== project.id)
  const sameRubric = others.filter((p) => p.category?.slug === project.category?.slug)
  const rest = others
    .filter((p) => !sameRubric.includes(p))
    .sort((a, b) => b.id - a.id)
  return [...sameRubric, ...rest].slice(0, limit)
}

// ── Bascule Cloudinary ───────────────────────────────────────
// Toutes les données ci-dessus gardent leurs chemins locaux tels quels
// ('/images/...') — c'est plus lisible et ça reste la référence si
// Cloudinary doit être désactivé un jour. La conversion se fait une
// seule fois ici, plutôt que dans chaque composant qui consomme ces
// tableaux (Projets, Blog, À propos...).
//
for (const arr of [SERVICES, PROJECTS, TESTIMONIALS, TEAM, BLOG_POSTS, PROCESS_STEPS]) {
  for (const item of arr) {
    if (item.img && typeof item.img === 'string' && item.img.startsWith('/images/')) {
      item.img = cld(item.img)
    }
    if (item.imgMobile && typeof item.imgMobile === 'string' && item.imgMobile.startsWith('/images/')) {
      item.imgMobile = cld(item.imgMobile)
    }
  }
}
