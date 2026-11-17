// lib/project-stories.js
//
// ══════════════════════════════════════════════════════════════════
// RÈGLE DURE — TEXTES « PROBLÈME / SOLUTION / RÉSULTAT »
// ──────────────────────────────────────────────────────────────────
// Ces textes sont lus par des CLIENTS (dirigeants de PME, commerçants,
// écoles, institutions), pas par des développeurs. Chaque champ
// doit être compris par quelqu'un qui n'a jamais écrit une ligne de
// code. Cette règle vaut pour tout nouveau projet et pour toute
// modification, sans exception.
// Champs concernés : `problem`, `solution`, `outcome`, `pitch`, `badge`,
// `features`.
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
//
// Textes « côté client » des réalisations — AUCUN terme technique.
//
// Pourquoi un fichier à part : lib/data.js garde `desc` et `tech` pour
// l'Explorer, le dashboard et le SEO. Ici, on écrit pour un dirigeant de PME
// qui se demande « est-ce qu'ils peuvent régler MON problème ? ». Rattaché
// à chaque projet par son id dans lib/data.js (champ `story`). Les champs
// problem / solution / result / impact de lib/data.js suivent la même règle
// dure et servent de repli si une story manque.
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
    problem: "L'absence d'un point de vente commun obligeait les vendeurs à multiplier les canaux de présentation et les acheteurs à demander les informations une par une. Cette organisation rendait le parcours moins fluide, du choix du produit jusqu'à la réception.",
    solution: "L'expérience rassemble donc les étapes essentielles dans un même espace : découverte des articles, choix, commande et suivi. Chaque vendeur conserve la maîtrise de sa boutique, tandis que l'acheteur dispose d'un parcours plus lisible.",
    features: [
      'Une boutique et un espace de gestion pour chaque vendeur',
      'Panier et commande simples pour l’acheteur',
      'Livraison suivie, avec photo de preuve à la réception',
      'Paiement à la livraison',
      'Connexion en un clic avec son compte Google',
      'S’installe sur le téléphone comme une application',
    ],
    outcome: "Les visiteurs peuvent découvrir les articles et suivre une commande sans devoir chercher les informations auprès de plusieurs interlocuteurs. Le paiement par Mobile Money n'est pas encore intégré : il est prévu comme évolution future.",
    audience: 'les vendeurs et les boutiques qui veulent vendre en ligne',
  },
  2: {
    badge: 'Présence en ligne',
    pitch: "Un site clair et rapide pour présenter une activité technologique de façon professionnelle.",
    problem: "Sans présentation centralisée, un prospect devait se fier aux informations qu'il pouvait obtenir au cas par cas. Il devenait plus difficile de comprendre rapidement l'activité, les services proposés et la manière de prendre contact.",
    solution: "La page donne une place claire à l'activité, à son offre et aux informations utiles. La navigation accompagne le visiteur dans sa découverte, sans multiplier les détours ni le noyer sous des détails inutiles.",
    features: [
      'Présentation claire de l’activité et de l’offre',
      'Éléments de réassurance pour inspirer confiance',
      'Lecture agréable sur téléphone, tablette et ordinateur',
      'Mis en ligne et prêt à être partagé',
    ],
    outcome: "L'entreprise dispose d'une adresse à partager dans ses échanges professionnels. Les futurs clients peuvent découvrir l'offre à leur rythme avant de prendre contact.",
    audience: 'les entreprises qui n’ont pas encore de site',
  },
  3: {
    badge: 'Recherche avancée',
    pitch: "Une plateforme de terrains pour limiter les risques d'arnaque à l'achat.",
    problem: "Les annonces foncières peuvent manquer de détails homogènes, et il n'est pas toujours facile de distinguer une offre sérieuse d'une annonce peu fiable. Pour un acheteur, ce manque de repères complique les premières vérifications.",
    solution: "Le projet rassemble les annonces de terrains dans un espace dédié. Les informations sont présentées de façon plus structurée, avec une recherche par critères et des espaces distincts pour les vendeurs et les acheteurs.",
    features: [
      'Annonces de terrains présentées de façon claire',
      'Recherche avancée par critères',
      'Comptes sécurisés pour les vendeurs et les acheteurs',
    ],
    outcome: "TerraSafe a constitué une première étape dans la réflexion autour de la confiance immobilière. Cette expérience a nourri la conception de NEXURA, qui étend l'approche à plusieurs catégories de biens.",
    audience: 'les acteurs de l’immobilier et du foncier',
  },
  9: {
    badge: 'Design sur mesure',
    pitch: "Un portfolio personnel qui ne ressemble à aucun modèle tout fait.",
    problem: "Un portfolio standard peut présenter des informations, mais il ne traduit pas toujours la personnalité, le parcours ou l'univers de la personne qu'il représente. Une présentation trop générique risque de rendre les réalisations moins mémorables.",
    solution: "Le portfolio a été conçu autour d'une identité visuelle propre, avec une navigation fluide et une mise en valeur du parcours. Les choix graphiques accompagnent le contenu au lieu de le masquer.",
    features: [
      'Design unique, pas un modèle standard',
      'Animations fluides',
      'Mode clair et mode sombre',
      'Adapté à tous les écrans',
    ],
    outcome: "La personne dispose d'une vitrine personnelle cohérente pour présenter son profil et ses réalisations. Le visiteur peut découvrir son univers et parcourir les informations essentielles dans une présentation soignée.",
    audience: 'les indépendants et les créatifs',
  },
  10: {
    badge: 'Galerie sur mesure',
    pitch: "Le portfolio d'un graphiste, pensé pour mettre ses créations au premier plan.",
    problem: "Pour un graphiste, les créations sont au cœur de la présentation. Une galerie trop ordinaire ou trop chargée peut détourner l'attention des visuels et ne pas rendre justice au travail présenté.",
    solution: "Le portfolio privilégie une galerie immersive et une mise en page sur mesure. Chaque création bénéficie d'un espace de présentation qui permet au visiteur de se concentrer sur les images et de découvrir le travail à son rythme.",
    features: [
      'Galerie immersive pour montrer ses créations',
      'Ambiance sombre et élégante',
      'Animations soignées',
      'Confortable à consulter sur téléphone',
    ],
    outcome: "Le graphiste dispose d'une galerie en ligne conçue pour présenter ses prestations et ses réalisations. Le site devient un support de présentation plus personnel qu'une simple succession d'images.",
    audience: 'les graphistes, photographes et artistes',
  },
  11: {
    badge: 'Écoute en ligne',
    pitch: "Le site d'un beatmaker ivoirien : on écoute ses créations en ligne, puis on achète par WhatsApp en quelques clics.",
    problem: "Un beatmaker qui partage ses morceaux uniquement par messages ou sur des plateformes externes ne maîtrise pas toujours la façon dont son catalogue est présenté. Les personnes intéressées doivent parfois chercher séparément les extraits, les informations et les modalités d'achat.",
    solution: "Le site réunit les productions dans un catalogue où chaque visiteur peut écouter les morceaux et consulter leurs informations. Lorsqu'un beat l'intéresse, il peut poursuivre sa demande d'achat directement avec l'artiste sur WhatsApp.",
    features: [
      'Écoute de chaque beat directement sur le site',
      'Achat en quelques clics via WhatsApp',
      'Ajout d’un nouveau beat à partir d’un simple lien Google Drive',
      'Fiche détaillée : genre, tempo, ambiance, prix',
    ],
    outcome: "Les productions disposent d'un espace dédié, accessible à tout moment. L'écoute se fait sur le site et le contact pour l'achat est plus direct, tandis que l'artiste peut ajouter de nouveaux morceaux à son catalogue.",
    audience: 'les musiciens et producteurs qui veulent vendre leur travail',
  },
  12: {
    badge: 'Réservation WhatsApp',
    pitch: "Une plateforme de location de résidences meublées haut de gamme, avec réservation directe par WhatsApp.",
    problem: "Les personnes qui cherchent une résidence meublée ont besoin de comparer les lieux, les équipements, les tarifs et la localisation avant de se décider. Lorsque ces renseignements sont transmis séparément par téléphone ou message, la comparaison devient moins pratique.",
    solution: "Chaque résidence dispose d'une présentation qui rassemble les photos, les équipements, les tarifs et sa localisation. Le visiteur peut parcourir les offres puis préparer une demande de réservation sur WhatsApp avec les informations utiles déjà renseignées.",
    features: [
      'Fiche complète : photos, équipements, tarifs',
      'Position de la résidence sur une carte',
      'Recherche et gestion des disponibilités',
      'Réservation sur WhatsApp avec dates et tarif pré-remplis',
      'Espace sécurisé pour publier et modifier les annonces',
    ],
    outcome: "Les visiteurs peuvent découvrir les résidences au même endroit et mieux préparer leur demande avant de contacter le service. L'équipe dispose également d'un espace pour publier et mettre à jour ses offres.",
    audience: 'les loueurs de résidences, d’hôtels et de logements',
  },
  13: {
    badge: 'Site officiel',
    pitch: "Le site de notre agence : conçu pour transformer un visiteur en client.",
    problem: "Une agence qui ne présente pas clairement ses services, ses réalisations et sa façon de travailler laisse ses prospects avec des questions importantes. Le visiteur doit pouvoir comprendre ce qui est proposé, à quel besoin cela répond et comment démarrer un projet.",
    solution: "Le site rassemble les services, les formules, les réalisations et les étapes de collaboration. Des points de contact sont prévus pour permettre au visiteur de poser ses questions ou de demander un devis sans chercher longtemps la bonne information.",
    features: [
      'Services et tarifs affichés clairement',
      'Méthode de travail expliquée étape par étape',
      'Réalisations à découvrir',
      'Assistant qui répond aux questions des visiteurs',
      'Demande de devis en ligne',
    ],
    outcome: "AKATech dispose d'une vitrine centrale pour présenter son approche et orienter les prospects. Le visiteur peut se faire une idée des prestations, consulter des exemples et engager une première discussion autour de son besoin.",
    audience: 'les agences et les prestataires de services',
  },
  14: {
    badge: 'Image institutionnelle',
    pitch: "Le site d'une université privée, clair et rassurant pour les futurs étudiants et leurs parents.",
    problem: "Les futurs étudiants et leurs familles cherchent à comprendre les formations proposées, les conditions d'admission et l'environnement de l'établissement. Lorsque les informations sont difficiles à trouver, il devient plus compliqué de préparer une orientation ou de demander des renseignements.",
    solution: "Le site présente l'établissement, ses filières et les informations utiles aux futurs étudiants. La navigation organise les contenus par sujets afin que chacun puisse découvrir l'université et trouver plus facilement le moyen de contacter l'administration.",
    features: [
      'Présentation de l’établissement et des filières',
      'Informations sur les admissions',
      'Aperçu de la vie étudiante',
      'Contact facile',
    ],
    outcome: "L'université dispose d'un point d'information accessible en ligne. Les familles et les candidats peuvent découvrir l'établissement, parcourir les formations et préparer leurs questions avant une prise de contact.",
    audience: 'les écoles, universités et institutions',
  },
  15: {
    badge: 'Multi-catégories',
    pitch: "Une place de marché où l'on trouve, réserve et sécurise logements, véhicules, bureaux et terrains.",
    problem: "Les annonces de logements, de véhicules, de bureaux et de terrains sont souvent réparties sur plusieurs canaux. Les acheteurs peuvent avoir du mal à comparer les offres, à identifier les vendeurs et à garder une trace de leurs demandes de réservation.",
    solution: "NEXURA rassemble plusieurs catégories de biens dans un même espace. Les visiteurs peuvent rechercher selon le type de bien, le prix et la localisation, consulter les annonces et suivre leurs demandes. Les vendeurs font l'objet d'une vérification avant publication ; le paiement Mobile Money reste en préparation.",
    features: [
      'Résidences meublées, motos et véhicules, bureaux et salles, terrains et immobilier',
      'Vérification d’identité des vendeurs (pièce d’identité et selfie)',
      'Recherche par catégorie, prix et localisation',
      'Calendrier de réservation',
      'Notifications en direct',
      'Bon de visite en PDF avec QR code',
    ],
    outcome: "Les parcours de recherche, de réservation et de gestion sont en place et continuent d'évoluer. Le visiteur bénéficie d'un espace plus organisé pour découvrir les offres. Le paiement par Mobile Money reste une étape à venir.",
    audience: 'les plateformes d’annonces, de location et de vente',
  },
  16: {
    badge: 'Suivi en direct',
    pitch: "Une plateforme qui rapproche les clients des restaurants locaux : découvrir, choisir, commander.",
    problem: "De nombreux restaurants de proximité restent peu visibles auprès des personnes qui ne fréquentent pas déjà leur quartier. Les clients peuvent aussi avoir du mal à retrouver les menus, les adresses et les informations nécessaires pour choisir où manger.",
    solution: "La plateforme rassemble les restaurants et leurs menus dans un même espace. Le visiteur peut découvrir une adresse, consulter les plats proposés et choisir de s'y rendre ou de commander lorsque ce service est disponible pour le restaurant concerné.",
    features: [
      'Restaurants et menus réunis au même endroit',
      'Commande en ligne quand le service est disponible',
      'Suivi de la commande en direct',
      'Paiement par Mobile Money',
      'Assistant intégré pour aider à choisir',
    ],
    outcome: "Les établissements disposent d'une vitrine supplémentaire pour faire connaître leur offre au-delà de leur clientèle habituelle. Les visiteurs gagnent un point de départ pratique pour découvrir de nouvelles adresses et consulter leurs menus.",
    audience: 'les restaurants, la livraison et la restauration',
  },
  17: {
    badge: '3 langues',
    pitch: "Le portfolio d'un développeur d'Abidjan, en français, anglais et russe, avec une direction artistique forte.",
    problem: "Un professionnel a besoin d'une présentation qui donne rapidement une idée de son parcours et de ses compétences, notamment lorsqu'il partage son profil dans le cadre de candidatures. Une vitrine limitée à un simple CV ne permet pas toujours de mettre ses réalisations en contexte.",
    solution: "Le portfolio propose une présentation personnalisée du parcours et des réalisations, avec une consultation en français, en anglais et en russe. L'identité visuelle accompagne les contenus et donne au visiteur plusieurs façons de découvrir le profil.",
    features: [
      'Design entièrement sur mesure',
      'Site en trois langues : français, anglais, russe',
      'Animations soignées',
      'Adapté à tous les écrans',
    ],
    outcome: "Le professionnel dispose d'un lien unique à partager avec des recruteurs ou des partenaires. La présentation multilingue facilite la découverte de son profil par des interlocuteurs de différents horizons.",
    audience: 'les professionnels qui veulent se démarquer',
  },
  18: {
    badge: 'Rendez-vous en ligne',
    pitch: "Le site complet d'un pressing d'Abidjan : tarifs clairs et prise de rendez-vous en ligne.",
    problem: "Avant de confier leurs vêtements à un pressing, les clients veulent connaître les prestations, les tarifs et les moyens de contact. Sans informations accessibles, ils doivent appeler ou se déplacer simplement pour obtenir les premiers renseignements.",
    solution: "Le site présente l'établissement, détaille les services et affiche les tarifs de manière lisible. Un formulaire permet ensuite de poser une question ou de préparer une demande de rendez-vous, directement depuis la vitrine en ligne.",
    features: [
      'Grille de tarifs claire',
      'Prise de rendez-vous par formulaire',
      'Présentation animée de l’activité',
      'Confortable à consulter sur téléphone',
    ],
    outcome: "Les visiteurs peuvent consulter les informations essentielles avant de contacter le pressing. L'établissement bénéficie d'une présence en ligne qui facilite la découverte de ses prestations et la prise de contact.",
    audience: 'les commerces et services de proximité',
  },
  19: {
    badge: 'Stock en direct',
    pitch: "La plateforme d'un élevage de lapins : fiches par race, stock en direct et commande finalisée sur WhatsApp.",
    problem: "Les clients qui souhaitent réserver des animaux ont besoin de connaître les races proposées et les disponibilités réelles. De son côté, l'élevage doit pouvoir suivre les quantités, les demandes et les ventes sans perdre le fil entre les différents échanges.",
    solution: "Chaque race dispose d'une fiche de présentation avec les informations utiles et les disponibilités. Le visiteur peut préparer sa réservation sur WhatsApp, tandis qu'un espace de gestion permet de suivre les stocks, les demandes et les ventes au même endroit.",
    features: [
      'Une fiche détaillée par race de lapin',
      'Stock mis à jour automatiquement',
      'Réservation en ligne avec choix de la quantité',
      'WhatsApp qui s’ouvre avec la commande pré-remplie',
      'Espace de gestion du stock, des réservations et des ventes',
      'S’installe sur le téléphone comme une application',
    ],
    outcome: "Les clients savent mieux ce qui est proposé avant de prendre contact. Pour l'élevage, les réservations et les quantités sont plus faciles à suivre, ce qui rend le parcours de demande plus clair pour les deux parties.",
    audience: 'les éleveurs, producteurs et vendeurs de produits en stock limité',
  },
  20: {
    badge: 'Score en minutes',
    pitch: "On dépose son CV et une offre d'emploi : en quelques minutes, on sait où l'on est prêt et où il faut progresser.",
    problem: "Face à une offre d'emploi, un candidat peut avoir du mal à distinguer les compétences qu'il possède déjà de celles qui lui manquent. Il peut aussi manquer de repères pour adapter son CV et préparer un entretien sans embellir artificiellement son parcours.",
    solution: "Le candidat transmet son CV et l'offre qui l'intéresse. Le service met en évidence les points de correspondance, les compétences à renforcer et les améliorations possibles du CV, puis propose un guide pour préparer les échanges en entretien sans inventer d'expérience.",
    features: [
      'Score de compatibilité entre le CV et l’offre',
      'Compétences confirmées, partielles ou manquantes',
      'CV corrigé, sans rien inventer',
      'Guide de réponses personnalisé pour l’entretien',
      'Première analyse gratuite, sans carte bancaire',
    ],
    outcome: "Le candidat obtient une lecture plus structurée de son dossier et des pistes concrètes pour se préparer. Une première analyse gratuite permet de découvrir le service et ses recommandations avant d'aller plus loin.",
    audience: 'les services en ligne qui vendent un résultat rapide',
  },
  21: {
    badge: 'Gestion mobile',
    pitch: "Une application pour gérer clients, ressources et réservations depuis son téléphone.",
    problem: "Dans une petite entreprise de services, les rendez-vous, les clients, les ressources et les membres de l'équipe peuvent être suivis dans plusieurs outils ou sur papier. Cette dispersion rend plus difficile la coordination des activités et la consultation de l'historique.",
    solution: "Karnet réunit les informations essentielles dans un même environnement. Les équipes peuvent utiliser l'application mobile pour les opérations quotidiennes, tandis que le responsable retrouve sur le web les clients, les réservations, les ressources et l'activité de son équipe.",
    features: [
      'Clients, ressources et réservations au même endroit',
      'Application sur téléphone pour le travail sur le terrain',
      'Tableau de bord pour le responsable',
      'Historique de toutes les actions, exportable',
      'Gestion de l’équipe',
    ],
    outcome: "Les informations sont plus faciles à retrouver et les responsables disposent d'une vue d'ensemble de l'activité. L'application mobile et l'espace web ont été vérifiés : la solution est déjà fonctionnelle.",
    audience: 'les PME de services qui veulent tout suivre au même endroit',
  },
  22: {
    badge: 'Marche sans internet',
    pitch: "Une caisse pour petites boutiques qui continue de fonctionner même quand la connexion coupe.",
    problem: "Dans une boutique, une interruption d'internet ne devrait pas empêcher le commerçant de continuer à servir ses clients. Lorsque les ventes dépendent entièrement de la connexion, une panne peut interrompre le travail et compliquer la reprise des opérations.",
    solution: "La caisse permet de poursuivre les ventes même lorsque la connexion est indisponible. Les opérations sont conservées sur l'appareil, puis transmises automatiquement lorsque le réseau revient, afin d'éviter les oublis et les doublons dans le suivi.",
    features: [
      'Encaisser même sans connexion internet',
      'Envoi automatique des ventes au retour du réseau',
      'Aucune vente enregistrée en double',
      'Gestion courante de la boutique',
      'S’installe sur le téléphone ou la tablette',
    ],
    outcome: "La première version est fonctionnelle et a été testée de bout en bout. Le commerçant peut ainsi continuer son activité pendant une coupure, puis retrouver ses ventes réunies une fois la connexion rétablie.",
    audience: 'les boutiques, commerces et points de vente',
  },
  23: {
    badge: 'Sans création de compte',
    pitch: "L'annuaire des artisans et services d'Anyama : on cherche par métier et par quartier, on contacte en direct.",
    problem: "À Anyama, les habitants qui cherchent un artisan ou un service de proximité passent souvent par des recommandations, des appels ou plusieurs publications sur les réseaux sociaux. Il n'est pas toujours facile de trouver rapidement le bon professionnel selon son métier et son quartier.",
    solution: "L'annuaire rassemble les professionnels par activité et par zone. Le visiteur peut consulter une fiche, découvrir les informations disponibles et contacter directement l'artisan par téléphone ou WhatsApp. Les fiches sont vérifiées avant leur publication.",
    features: [
      'Recherche par métier et par quartier',
      'Contact direct par WhatsApp ou par téléphone',
      'Inscription des artisans sans création de compte',
      'Fiches validées avant publication',
      'Avis des clients, modérés',
      'S’installe sur le téléphone comme une application',
    ],
    outcome: "L'annuaire public est en ligne et facilite la découverte de professionnels locaux. Les avis sont encadrés et un artisan peut demander le retrait de sa fiche, afin de garder une présentation plus maîtrisée des informations publiées.",
    audience: 'les villes, quartiers et communautés qui veulent un annuaire local',
  },
  24: {
    badge: 'Marche sans internet',
    pitch: "Un registre d'accueil sans contact : le visiteur s'enregistre par QR code ou sur tablette, sans cahier papier.",
    problem: "Dans de nombreux lieux d'accueil, les visiteurs inscrivent encore leurs informations dans un cahier papier. Les équipes doivent ensuite retrouver les entrées, rassembler les données et consulter l'historique, alors que ces informations peuvent être difficiles à organiser et à protéger.",
    solution: "REKOLLECTE permet au visiteur de s'enregistrer à l'aide d'un QR code ou d'une tablette à l'accueil, y compris lorsque la connexion internet n'est pas disponible. Les visites sont ensuite regroupées dans un espace de consultation, avec plusieurs niveaux d'accès, des formulaires adaptés et une signature sur écran.",
    features: [
      'Enregistrement par QR code ou sur tablette d’accueil',
      'Fonctionne même sans connexion internet',
      'Formulaires adaptés à chaque secteur',
      'Signature directement sur l’écran',
      'Trois niveaux d’accès : patron, gérant, agent',
      'Export des données dans un tableur',
    ],
    outcome: "La première version est en service : les établissements peuvent enregistrer les visiteurs et consulter les entrées dans un même espace. Les fonctions complémentaires liées aux clients, aux réservations, aux paiements et aux rappels sont en cours de test et pas encore disponibles.",
    audience: 'les bureaux, restaurants, hôtels et lieux d’accueil',
  },
  25: {
    badge: 'Preuve de remise',
    pitch: "Une plateforme pour envoyer un colis à moto à Abidjan : prix annoncé d'avance, suivi en direct, remise validée par un code.",
    problem: "À Abidjan, organiser l'envoi d'un colis à moto peut manquer de visibilité : le prix est parfois discuté au dernier moment, le client perd de vue son colis pendant le trajet et la remise n'est pas toujours accompagnée d'une confirmation claire.",
    solution: "Le parcours prévoit l'annonce d'un prix avant confirmation, l'acceptation de la course par un livreur et le suivi de la livraison. À l'arrivée, un code permet de confirmer la remise et une photo vient compléter la preuve de livraison.",
    features: [
      'Prix calculé sur la distance, fixé avant confirmation',
      'Suivi de la course en direct',
      'Livreurs inscrits sur dossier, vérifiés par l’équipe',
      'Remise validée par un code et une photo',
      'Reçu téléchargeable après la livraison',
      'Paiement en espèces à la remise',
    ],
    outcome: "Le service web est prêt et a été testé en interne. Les essais sur le terrain et le lancement pilote à Abidjan restent à réaliser : le service n'est donc pas encore ouvert au public.",
    audience: 'les services de livraison, la logistique urbaine et les commerces qui expédient des colis',
  },
  26: {
    badge: 'Startup',
    pitch: "Le site d'une startup d'Abidjan qui crée ses propres produits : qui elle est, comment elle travaille, et son premier produit.",
    problem: "Une jeune startup a besoin d'un espace pour expliquer ce qu'elle construit, présenter les personnes qui portent le projet et donner une première visibilité à ses produits. Sans cette vitrine, les visiteurs disposent de peu de repères pour comprendre sa démarche et entrer en contact avec l'équipe.",
    solution: "Le site présente l'équipe, sa manière de travailler et son premier produit, Mon E-Carnet. Chaque membre dispose d'une présentation dédiée et une page permet de découvrir le produit à travers des visuels de démonstration, sans exposer de données réelles.",
    features: [
      'Accueil qui raconte la démarche, de l’idée au produit',
      'Une fiche pour chaque membre de l’équipe',
      'Page dédiée au premier produit, avec des données fictives uniquement',
      'Animations et objets 3D qui réagissent au défilement et à la souris',
      'Formulaire de contact avec réponse par e-mail',
      'Réponses aux questions fréquentes, lisibles aussi par les moteurs de recherche',
    ],
    outcome: "Le site de Redianice est en ligne et donne un premier aperçu de l'équipe et de son travail. Mon E-Carnet y est présenté en phase de test avec des données fictives uniquement ; le produit n'est pas encore ouvert au public.",
    audience: 'les startups et jeunes entreprises qui veulent se présenter avec une image soignée',
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
