// lib/questionnaires-schema.js
// ── SOURCE UNIQUE DES 3 QUESTIONNAIRES CLIENTS ──────────────────────
// Transforme les questionnaires texte (Questionnaire_Client_*.txt) en
// définitions de champs structurées. Une seule source de vérité,
// consommée par :
//   - app/devis/[type]/page.js         → génère le formulaire dynamique
//   - lib/quote-calc.js                → construit le prompt de
//                                         classification du devis
//   - lib/questionnaire-pdf.js         → génère le PDF envoyé à Aka
//   - components/dashboard/ProspectsTab.js → affiche les réponses
//
// Types de champ : 'text' | 'textarea' | 'radio' | 'checkboxes' |
//                   'email' | 'phone'
// showIf (optionnel) : { field: <id>, equals: <valeur> } ou
//                       { field: <id>, includes: <valeur> } — affichage
// conditionnel côté formulaire uniquement (les réponses cachées ne sont
// pas exigées, mais restent stockées si déjà renseignées).
//
// Les options ci-dessous reprennent le libellé exact des questionnaires
// PDF/WhatsApp existants — ne pas reformuler sans mettre à jour les 3
// fichiers .txt sources en parallèle.

export const QUESTIONNAIRE_TYPES = {
  portfolio: "Portfolio professionnel",
  vitrine_ecommerce: "Site Vitrine / E-commerce",
  saas: "Application Web / SaaS",
}

export const QUESTIONNAIRES = {
  // ═══════════════════════════════════════════════════════════
  // PORTFOLIO — 26 questions / 7 sections
  // ═══════════════════════════════════════════════════════════
  portfolio: {
    label: "Portfolio professionnel",
    intro: "Ce questionnaire permet de comprendre votre profil, vos objectifs et la manière dont votre portfolio doit vous présenter.",
    sections: [
      {
        title: "Votre profil",
        fields: [
          { id: "full_name_job", label: "Nom complet et profession exacte", type: "text", required: true },
          { id: "main_goal", label: "Objectif principal", type: "radio", required: true,
            options: ["Trouver des clients", "Trouver un emploi ou des missions", "Montrer mes compétences", "Crédibiliser mon activité", "Autre"] },
          { id: "whatsapp", label: "Téléphone / WhatsApp professionnel à afficher", type: "phone", required: true },
          { id: "email", label: "Email professionnel à afficher", type: "email", required: true },
          { id: "location", label: "Ville / zone d'activité", type: "text", required: true },
          { id: "bio", label: "Présentez-vous brièvement : parcours, spécialité, ce qui vous différencie", type: "textarea", required: true },
        ],
      },
      {
        title: "Présence en ligne",
        fields: [
          { id: "existing_site", label: "Avez-vous déjà un site ou portfolio ? Si oui, envoyez le lien", type: "text" },
          { id: "social_links", label: "Réseaux professionnels (LinkedIn / Instagram / Behance / Dribbble / GitHub / autre) — envoyez les liens", type: "textarea" },
          { id: "has_cv", label: "Avez-vous un CV à jour disponible ?", type: "radio", options: ["Oui, à jour", "Oui, mais à mettre à jour", "Non"] },
        ],
      },
      {
        title: "Réalisations",
        fields: [
          { id: "project_count", label: "Combien de projets souhaitez-vous mettre en avant ?", type: "text", required: true },
          { id: "has_project_assets", label: "Pour chaque projet, avez-vous captures, descriptions, technologies et liens ?", type: "radio",
            options: ["Oui, tout est prêt", "En partie", "Non, à préparer ensemble"] },
          { id: "gallery_style", label: "Souhaitez-vous des présentations détaillées de vos projets ou une galerie plus simple ?", type: "radio",
            options: ["Présentations détaillées", "Galerie simple", "Un mix des deux"] },
          { id: "confidential_projects", label: "Y a-t-il des projets confidentiels ou en cours qui ne doivent pas apparaître ?", type: "textarea" },
        ],
      },
      {
        title: "Compétences / parcours",
        fields: [
          { id: "skills", label: "Quelles compétences, technologies ou outils souhaitez-vous mettre en avant ?", type: "textarea", required: true },
          { id: "experience", label: "Quelles expériences ou formations doivent apparaître ?", type: "textarea" },
          { id: "certifications", label: "Avez-vous des certifications, diplômes, prix ou distinctions à présenter ?", type: "textarea" },
        ],
      },
      {
        title: "Preuves de crédibilité",
        fields: [
          { id: "testimonials", label: "Avez-vous des témoignages de clients, employeurs ou collaborateurs ?", type: "textarea" },
          { id: "credibility_numbers", label: "Avez-vous des chiffres à mettre en avant ? (années, projets, clients, etc.)", type: "text" },
        ],
      },
      {
        title: "Identité visuelle",
        fields: [
          { id: "has_logo", label: "Avez-vous un logo ou une identité visuelle personnelle ?", type: "radio", options: ["Oui", "Non, à créer"] },
          { id: "has_photo", label: "Avez-vous une photo professionnelle ?", type: "radio", options: ["Oui", "Non"] },
          { id: "style_preferences", label: "Quelles couleurs, ambiances ou styles aimez-vous ? Lesquels détestez-vous ?", type: "textarea" },
        ],
      },
      {
        title: "Site / suite",
        fields: [
          { id: "wants_blog", label: "Souhaitez-vous un blog ou une section actualités ?", type: "radio", options: ["Oui", "Non", "Pas sûr"] },
          { id: "has_domain", label: "Avez-vous déjà acheté votre nom de domaine ? Si oui, lequel ?", type: "text" },
          { id: "inspirations", label: "Avez-vous des portfolios dont vous aimez le style ? Envoyez les liens", type: "textarea" },
          { id: "budget_timeline", label: "Fourchette de budget et délai souhaité", type: "text", required: true },
          { id: "completion_goal", label: "Complétez : « Je veux que mon portfolio me permette de ... »", type: "textarea", required: true },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════
  // VITRINE / E-COMMERCE — 62 questions / 15 sections
  // (le type e-commerce vs vitrine pur est déterminé par la réponse à
  // wants_online_order, pas par un champ séparé — voir lib/quote-calc.js)
  // ═══════════════════════════════════════════════════════════
  vitrine_ecommerce: {
    label: "Site Vitrine / E-commerce",
    intro: "Répondez simplement aux questions ci-dessous. Vos réponses aideront Aka à comprendre votre activité et à préparer une proposition adaptée. Si une question ne vous concerne pas, indiquez « Non concerné ».",
    sections: [
      {
        title: "Votre activité",
        fields: [
          { id: "company_name", label: "Nom exact de votre entreprise / établissement", type: "text", required: true },
          { id: "responsible_name_role", label: "Nom et fonction du responsable du projet", type: "text", required: true },
          { id: "phone", label: "Téléphone professionnel", type: "phone", required: true },
          { id: "whatsapp", label: "WhatsApp professionnel à afficher", type: "phone", required: true },
          { id: "address", label: "Adresse complète", type: "text", required: true },
          { id: "hours", label: "Horaires d'ouverture", type: "text", required: true },
          { id: "activity_description", label: "Présentez votre activité en quelques phrases", type: "textarea", required: true },
          { id: "services_offered", label: "Services proposés", type: "checkboxes",
            options: ["Sur place", "À emporter", "Livraison", "Commandes", "Événements", "Autre"] },
        ],
      },
      {
        title: "Présence en ligne",
        fields: [
          { id: "existing_site", label: "Avez-vous déjà un site internet ? Si oui, envoyez le lien et indiquez ce que vous souhaitez garder ou changer", type: "textarea" },
          { id: "gbp_link", label: "Avez-vous une fiche Google / Google Maps ? Si oui, envoyez le lien", type: "text" },
          { id: "social_links", label: "Réseaux sociaux utilisés (Instagram / Facebook / TikTok / WhatsApp Business / YouTube / autre) — envoyez les liens", type: "textarea" },
          { id: "ordering_platform", label: "Utilisez-vous une plateforme de commande ou de livraison ? Laquelle ?", type: "text" },
        ],
      },
      {
        title: "Identité et visuels",
        fields: [
          { id: "has_logo", label: "Avez-vous un logo ? Si oui, vous pourrez l'envoyer à Aka après validation du devis", type: "radio", options: ["Oui", "Non, à créer"] },
          { id: "brand_colors", label: "Avez-vous des couleurs ou un style visuel déjà utilisés ?", type: "textarea" },
          { id: "has_photos", label: "Avez-vous déjà les photos de vos produits ou réalisations ?", type: "radio", options: ["Oui, tout est prêt", "En partie", "Non, à prévoir"] },
          { id: "has_prices", label: "Avez-vous déjà vos tarifs ou votre catalogue de produits ?", type: "radio", options: ["Oui, tout est prêt", "En partie", "Non, à préparer"] },
          { id: "has_videos", label: "Avez-vous des vidéos ?", type: "radio", options: ["Oui", "Non"] },
          { id: "existing_materials", label: "Avez-vous un menu, catalogue, flyer ou autre support existant à reprendre ?", type: "text" },
        ],
      },
      {
        title: "Contenu",
        fields: [
          { id: "main_content", label: "Que souhaitez-vous principalement présenter sur le site ?", type: "textarea", required: true },
          { id: "category_count", label: "Combien de catégories de produits / menus / services avez-vous ?", type: "text" },
          { id: "content_changes_often", label: "Votre contenu ou vos prix changent-ils régulièrement ?", type: "radio", options: ["Oui, souvent", "Occasionnellement", "Rarement"] },
          { id: "self_editable", label: "Souhaitez-vous pouvoir modifier vous-même menus, prix, photos ou informations après livraison ?", type: "radio", options: ["Oui", "Non"] },
        ],
      },
      {
        title: "Commandes en ligne",
        fields: [
          { id: "wants_online_order", label: "Souhaitez-vous seulement présenter vos produits/menus, ou permettre aussi de commander en ligne ?", type: "radio", required: true,
            options: ["Présenter seulement", "Permettre la commande en ligne"] },
          { id: "order_flow_needs", label: "Si commande : que doit pouvoir faire le client ?", type: "checkboxes",
            showIf: { field: "wants_online_order", equals: "Permettre la commande en ligne" },
            options: ["Choisir produits/quantités", "Options", "Instructions", "Retrait", "Livraison", "Heure souhaitée", "Voir le total", "Confirmation", "Autre"] },
          { id: "order_reception", label: "Comment souhaitez-vous recevoir les commandes ?", type: "checkboxes",
            options: ["WhatsApp", "Téléphone", "Email", "Espace de gestion", "Plusieurs canaux"] },
        ],
      },
      {
        title: "Paiement",
        fields: [
          { id: "payment_timing", label: "Comment souhaitez-vous gérer le paiement ?", type: "radio",
            options: ["Paiement directement en ligne", "Commande d'abord, paiement ensuite", "Je ne sais pas encore"] },
          { id: "online_payment", label: "Si paiement en ligne, quels moyens faut-il proposer ?", type: "checkboxes",
            showIf: { field: "payment_timing", equals: "Paiement directement en ligne" },
            options: ["Orange Money", "MTN MoMo", "Wave", "Carte bancaire", "Autre"] },
          { id: "account_required", label: "Le client doit-il obligatoirement créer un compte pour commander ?", type: "radio", options: ["Oui", "Non"] },
        ],
      },
      {
        title: "Livraison",
        fields: [
          { id: "offers_delivery", label: "Proposez-vous la livraison ?", type: "radio", options: ["Oui", "Non"] },
          { id: "delivery_method", label: "Livrez-vous vous-même ou utilisez-vous un service externe ?", type: "radio",
            showIf: { field: "offers_delivery", equals: "Oui" }, options: ["Nous-mêmes", "Service externe", "Les deux"] },
          { id: "delivery_zones", label: "Quelles sont vos zones de livraison ?", type: "textarea", showIf: { field: "offers_delivery", equals: "Oui" } },
          { id: "delivery_fee_calc", label: "Comment sont calculés les frais de livraison ?", type: "text", showIf: { field: "offers_delivery", equals: "Oui" } },
          { id: "show_zones_on_site", label: "Souhaitez-vous afficher les zones et tarifs sur le site ?", type: "radio",
            showIf: { field: "offers_delivery", equals: "Oui" }, options: ["Oui", "Non"] },
        ],
      },
      {
        title: "Localisation / réservation",
        fields: [
          { id: "show_map", label: "Souhaitez-vous afficher votre emplacement avec Google Maps ?", type: "radio", options: ["Oui", "Non"] },
          { id: "map_address_correct", label: "Votre adresse est-elle correctement indiquée sur Google Maps ?", type: "radio", options: ["Oui", "Non, à corriger", "Je ne sais pas"] },
          { id: "wants_reservation", label: "Souhaitez-vous permettre la réservation d'une table / d'un service depuis le site ?", type: "radio", options: ["Oui", "Non"] },
          { id: "reservation_info", label: "Si oui, quelles informations faut-il demander au client ?", type: "textarea", showIf: { field: "wants_reservation", equals: "Oui" } },
        ],
      },
      {
        title: "Avis et preuves de confiance",
        fields: [
          { id: "has_reviews", label: "Avez-vous des avis clients ? (Google / réseaux sociaux / WhatsApp / autre)", type: "text" },
          { id: "can_send_reviews", label: "Pouvez-vous envoyer quelques avis ou captures à afficher ?", type: "radio", options: ["Oui", "Non"] },
          { id: "trust_numbers", label: "Avez-vous des chiffres ou éléments de confiance à mettre en avant ? (années, clients, commandes, note...)", type: "text" },
          { id: "partners_certifications", label: "Avez-vous des partenaires, certifications, marques ou institutions à présenter ?", type: "text" },
        ],
      },
      {
        title: "Objectifs",
        fields: [
          { id: "visitor_main_action", label: "Que doit principalement faire un visiteur lorsqu'il arrive sur votre site ?", type: "textarea", required: true },
          { id: "priority_cta", label: "Quelle action souhaitez-vous encourager en priorité ?", type: "radio", required: true,
            options: ["Appeler", "WhatsApp", "Visiter", "Voir le menu", "Commander", "Réserver", "Autre"] },
          { id: "why_now", label: "Pourquoi souhaitez-vous créer ou refaire le site maintenant ?", type: "textarea", required: true },
          { id: "current_problem", label: "Quel problème rencontrez-vous actuellement avec votre présence en ligne ?", type: "textarea", required: true },
          { id: "wished_capability", label: "Qu'aimeriez-vous que le site vous permette de faire que vous ne pouvez pas faire aujourd'hui ?", type: "textarea" },
        ],
      },
      {
        title: "Textes / contenu",
        fields: [
          { id: "has_texts", label: "Avez-vous déjà les textes de présentation ?", type: "radio", options: ["Oui", "Non", "En partie"] },
          { id: "wants_copywriting", label: "Souhaitez-vous que je rédige/adapte les textes à partir de vos informations ?", type: "radio", options: ["Oui", "Non"] },
          { id: "ok_generated_visuals", label: "Êtes-vous d'accord pour utiliser des visuels professionnels ou générés si certaines photos manquent ?", type: "radio", options: ["Oui", "Non"] },
          { id: "wants_newsletter", label: "Souhaitez-vous une newsletter ou une collecte d'adresses email ?", type: "radio", options: ["Oui", "Non"] },
        ],
      },
      {
        title: "Après livraison",
        fields: [
          { id: "self_editable_content", label: "Que souhaitez-vous pouvoir modifier vous-même après livraison ?", type: "textarea" },
          { id: "wants_admin_space", label: "Souhaitez-vous un espace de gestion pour administrer certains éléments du site ?", type: "radio", options: ["Oui", "Non"] },
        ],
      },
      {
        title: "Domaine / hébergement",
        fields: [
          { id: "has_domain", label: "Avez-vous déjà acheté un nom de domaine ? Si oui, lequel ?", type: "text" },
          { id: "has_hosting", label: "Avez-vous déjà un hébergement ?", type: "radio", options: ["Oui", "Non"] },
          { id: "wants_setup_handled", label: "Souhaitez-vous que la création et la configuration soient prises en charge ?", type: "radio", options: ["Oui", "Non"] },
        ],
      },
      {
        title: "Attentes",
        fields: [
          { id: "inspirations", label: "Avez-vous vu des sites que vous aimez ? Envoyez les liens", type: "textarea" },
          { id: "must_have_features", label: "Quelles fonctionnalités sont absolument indispensables ?", type: "textarea", required: true },
          { id: "unwanted_features", label: "Quelles fonctionnalités ne souhaitez-vous surtout pas ?", type: "textarea" },
          { id: "completion_goal", label: "Complétez : « Je veux que mes clients puissent ... grâce à mon site »", type: "textarea", required: true },
        ],
      },
      {
        title: "Budget / organisation",
        fields: [
          { id: "launch_date", label: "Date idéale de mise en ligne", type: "text", required: true },
          { id: "budget_range", label: "Fourchette de budget prévue", type: "text", required: true },
          { id: "decision_maker", label: "Qui prendra les décisions et validera le projet ?", type: "text", required: true },
          { id: "other_stakeholders", label: "Y aura-t-il d'autres personnes impliquées dans les validations ?", type: "text" },
          { id: "anything_else", label: "Y a-t-il une information importante que je n'ai pas demandée ?", type: "textarea" },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════
  // APPLICATION WEB / SAAS — 41 questions / 8 sections
  // ═══════════════════════════════════════════════════════════
  saas: {
    label: "Application Web / SaaS",
    intro: "Décrivez simplement l'outil que vous voulez créer, pour qui il est destiné et ce qu'il doit permettre de faire. Vos réponses serviront à préparer une proposition adaptée.",
    sections: [
      {
        title: "Le projet",
        fields: [
          { id: "description", label: "Décrivez votre application en 2 ou 3 phrases : qu'est-ce qu'elle fait et pour qui ?", type: "textarea", required: true },
          { id: "problem_solved", label: "Quel problème précis souhaitez-vous résoudre ?", type: "textarea", required: true },
          { id: "why_now", label: "Pourquoi souhaitez-vous créer cette solution maintenant ?", type: "textarea", required: true },
        ],
      },
      {
        title: "Utilisateurs / fonctionnement",
        fields: [
          { id: "user_types", label: "Quels types d'utilisateurs utiliseront l'application ?", type: "textarea", required: true },
          { id: "user_actions", label: "Pour chaque type, que doit-il pouvoir faire ?", type: "textarea", required: true },
          { id: "main_journey", label: "Quel est le parcours principal d'un utilisateur, de son arrivée jusqu'à son action principale ?", type: "textarea", required: true },
          { id: "different_rights", label: "Certains utilisateurs doivent-ils avoir des droits différents ?", type: "radio", options: ["Oui", "Non"] },
          { id: "signup_required", label: "L'inscription est-elle obligatoire ?", type: "radio", options: ["Oui", "Non"] },
          { id: "identity_verification", label: "Une vérification d'identité est-elle nécessaire ?", type: "radio", options: ["Oui", "Non"] },
        ],
      },
      {
        title: "Fonctionnalités",
        fields: [
          { id: "must_have_features", label: "Quelles sont les fonctionnalités indispensables pour la première version ?", type: "textarea", required: true },
          { id: "future_features", label: "Quelles fonctionnalités pourraient être ajoutées plus tard ?", type: "textarea" },
          { id: "needs_dashboard", label: "Avez-vous besoin d'un espace de gestion / tableau de bord ? Pour qui et pour faire quoi ?", type: "textarea" },
          { id: "notifications_needed", label: "Quelles notifications sont nécessaires ?", type: "checkboxes",
            options: ["Email", "SMS", "WhatsApp", "Téléphone", "Temps réel", "Autre", "Aucune"] },
          { id: "needs_search_geo", label: "Avez-vous besoin de recherche, filtres, géolocalisation ou carte ?", type: "checkboxes",
            options: ["Recherche", "Filtres", "Géolocalisation", "Carte", "Aucun"] },
          { id: "needs_documents", label: "Avez-vous besoin de documents, factures, PDF ou QR codes ?", type: "checkboxes",
            options: ["Documents", "Factures", "PDF", "QR codes", "Aucun"] },
          { id: "has_mockups", label: "Avez-vous des maquettes, captures, schémas ou cahier des charges ?", type: "radio", options: ["Oui", "Non"] },
          { id: "starting_point", label: "Le projet doit-il reprendre une solution existante, un prototype, ou partir de zéro ?", type: "radio",
            options: ["Solution existante", "Prototype", "Zéro"] },
        ],
      },
      {
        title: "Modèle économique",
        fields: [
          { id: "revenue_model", label: "Comment la solution gagnera-t-elle de l'argent ?", type: "radio", required: true,
            options: ["Abonnement", "Commission", "Paiement à l'usage", "Gratuit", "Autre"] },
          { id: "payment_methods", label: "Quels moyens de paiement doivent être disponibles ?", type: "checkboxes",
            options: ["Orange Money", "MTN MoMo", "Wave", "Carte bancaire", "Virement", "Autre"] },
          { id: "needs_billing", label: "Faut-il gérer les paiements et la facturation ?", type: "radio", options: ["Oui", "Non"] },
          { id: "free_trial", label: "Souhaitez-vous une période d'essai gratuit ou une formule gratuite ?", type: "radio", options: ["Oui", "Non", "Pas sûr"] },
        ],
      },
      {
        title: "Données / sécurité",
        fields: [
          { id: "personal_data_collected", label: "Quelles informations personnelles seront collectées ?", type: "textarea", required: true },
          { id: "sensitive_data", label: "Des informations sensibles seront-elles traitées ?", type: "radio", options: ["Oui", "Non"] },
          { id: "compliance_requirements", label: "Existe-t-il des exigences particulières de conformité ou de sécurité ?", type: "text" },
          { id: "data_export", label: "Les utilisateurs doivent-ils pouvoir exporter leurs données ou générer des rapports ?", type: "radio", options: ["Oui", "Non"] },
        ],
      },
      {
        title: "Services / outils à connecter",
        fields: [
          { id: "integrations", label: "Quels services externes doivent être connectés ?", type: "checkboxes",
            options: ["WhatsApp", "Mobile Money", "Email", "Cartes", "Autre", "Aucune"] },
          { id: "has_technical_accounts", label: "Disposez-vous déjà de comptes techniques nécessaires au projet ? (Domaine / hébergement / autre)", type: "text" },
          { id: "expected_volume", label: "Combien d'utilisateurs ou de transactions prévoyez-vous au lancement ? (ou « Je ne sais pas »)", type: "text" },
          { id: "mobile_priority", label: "La solution doit-elle être utilisée principalement sur téléphone ? Faut-il envisager une application mobile en plus du site ?", type: "radio",
            options: ["Web uniquement", "Mobile prioritaire", "App mobile envisagée en plus"] },
        ],
      },
      {
        title: "Marché",
        fields: [
          { id: "competitors", label: "Quels sont vos concurrents directs ? Envoyez les liens si disponibles", type: "textarea" },
          { id: "differentiation", label: "Qu'est-ce qui différencie votre solution ?", type: "textarea", required: true },
          { id: "pilot_users", label: "Avez-vous déjà des utilisateurs pilotes, premiers clients ou partenaires intéressés ?", type: "radio",
            options: ["Oui", "Non", "En discussion"] },
          { id: "acquisition_plan", label: "Comment comptez-vous obtenir vos premiers utilisateurs ?", type: "textarea" },
        ],
      },
      {
        title: "Budget / organisation",
        fields: [
          { id: "budget_range", label: "Fourchette de budget pour le développement", type: "text", required: true },
          { id: "monthly_budget", label: "Budget mensuel envisagé pour maintenance et évolution", type: "text" },
          { id: "has_cofounders", label: "Y a-t-il des cofondateurs, investisseurs ou partenaires impliqués ?", type: "text" },
          { id: "decision_maker", label: "Qui prend les décisions et valide le projet ?", type: "text", required: true },
          { id: "target_launch_date", label: "Date cible pour lancer la première version", type: "text", required: true },
          { id: "needs_training", label: "Une formation de votre équipe sera-t-elle nécessaire ? Si oui, combien de personnes ?", type: "text" },
          { id: "change_management", label: "Comment souhaitez-vous gérer les demandes ou changements qui apparaissent après le début du projet ?", type: "textarea" },
          { id: "anything_else", label: "Y a-t-il une information importante que je n'ai pas demandée ?", type: "textarea" },
        ],
      },
    ],
  },
}

/* ── Helpers partagés ── */

export function getQuestionnaire(type) {
  return QUESTIONNAIRES[type] || null
}

// Liste à plat de tous les champs d'un questionnaire, dans l'ordre —
// utile pour valider les réponses reçues et pour construire le PDF.
export function flattenFields(type) {
  const q = getQuestionnaire(type)
  if (!q) return []
  return q.sections.flatMap((s) => s.fields.map((f) => ({ ...f, sectionTitle: s.title })))
}

// Vérifie qu'un champ requis (et visible d'après showIf) a bien une
// réponse non vide — utilisé côté API avant de calculer un devis.
export function getMissingRequiredFields(type, answers = {}) {
  return flattenFields(type).filter((f) => {
    if (!f.required) return false
    if (f.showIf) {
      const dep = answers[f.showIf.field]
      const visible = f.showIf.equals ? dep === f.showIf.equals : f.showIf.includes ? String(dep || '').includes(f.showIf.includes) : true
      if (!visible) return false
    }
    const val = answers[f.id]
    return val === undefined || val === null || (typeof val === 'string' && val.trim() === '') || (Array.isArray(val) && val.length === 0)
  }).map((f) => f.id)
}
