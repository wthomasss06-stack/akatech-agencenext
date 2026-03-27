// ── SHARED DATA ─────────────────────────────────────────────

export const SERVICES = [
  {
    icon: 'Globe',
    n: '// 01',
    title: 'Site Vitrine',
    desc: 'Un site professionnel qui reflète votre image de marque. Responsive, rapide et optimisé pour convertir vos visiteurs en clients.',
    price: 'À partir de 150 000 FCFA',
    del: '5-7 jours',
    img: '/images/services/ecommerce.jpg',
    features: ['Design sur-mesure','SEO optimisé','Formulaire de contact','Hébergement 1 an offert','Formation incluse'],
    slug: 'site-vitrine',
    color: '#22c864',
  },
  {
    icon: 'ShoppingCart',
    n: '// 02',
    title: 'E-Commerce',
    desc: 'Vendez en ligne 24h/24. Une boutique complète avec paiement sécurisé, gestion des stocks et suivi des commandes.',
    price: 'À partir de 300 000 FCFA',
    del: '10-14 jours',
    img: '/images/services/ecommerce.jpg',
    features: ['Catalogue produits illimité','Paiement Mobile Money','Tableau de bord admin','Gestion commandes/stocks','Notifications automatiques'],
    slug: 'ecommerce',
    color: '#22c864',
  },
  {
    icon: 'Cpu',
    n: '// 03',
    title: 'Application SaaS',
    desc: 'Une application web sur-mesure pour automatiser vos processus métier et scale votre activité sans recruter.',
    price: 'Sur devis',
    del: '3-6 semaines',
    img: '/images/services/saas.jpg',
    features: ['Architecture scalable','Authentification sécurisée','API REST','Dashboard analytics','Déploiement cloud'],
    slug: 'saas',
    color: '#22c864',
  },
  {
    icon: 'Server',
    n: '// 04',
    title: 'API & Backend',
    desc: 'Des APIs robustes et documentées pour connecter vos applications, automatiser vos workflows et intégrer des services tiers.',
    price: 'À partir de 200 000 FCFA',
    del: '7-14 jours',
    img: '/images/services/api.jpg',
    features: ['REST / GraphQL','Documentation Swagger','Authentification JWT','Rate limiting','Monitoring 24/7'],
    slug: 'api-backend',
    color: '#22c864',
  },
  {
    icon: 'Palette',
    n: '// 05',
    title: 'Portfolio Créatif',
    desc: 'Votre vitrine numérique pour attirer les bons clients. Un portfolio moderne avec animations et micro-interactions.',
    price: 'À partir de 100 000 FCFA',
    del: '3-5 jours',
    img: '/images/services/ecommerce.jpg',
    features: ['Design unique','Animations Framer Motion','Blog intégré','Contact form','Optimisé LinkedIn/SEO'],
    slug: 'portfolio',
    color: '#22c864',
  },
  {
    icon: 'Wrench',
    n: '// 06',
    title: 'Maintenance & Support',
    desc: 'Votre site reste performant, sécurisé et à jour. Intervention rapide, mises à jour régulières et sauvegardes automatiques.',
    price: 'À partir de 25 000 FCFA/mois',
    del: 'Contrat mensuel',
    img: '/images/services/maintenance.jpg',
    features: ['Mises à jour CMS/plugins','Sauvegardes quotidiennes','Monitoring uptime','Support prioritaire','Rapport mensuel'],
    slug: 'maintenance',
    color: '#22c864',
  },
]

export const PROJECTS = [
  { title: 'ShopCI', type: 'E-Commerce', desc: 'Plateforme e-commerce ivoirienne avec paiement Mobile Money intégré. +200 produits, gestion stocks en temps réel.', img: '/images/projects/shopci.jpg', tech: ['React','Django','PostgreSQL'], url: '#', result: '↑ CA +40%' },
  { title: 'MonMarket', type: 'Marketplace', desc: 'Marketplace multi-vendeurs pour le marché africain. Gestion des commandes, livraison et paiements MTN/Orange.', img: '/images/projects/monmarket.jpg', tech: ['Next.js','Node.js','MySQL'], url: '#', result: '↑ 500+ utilisateurs' },
  { title: 'TechFlow', type: 'SaaS', desc: 'Application SaaS de gestion de projets pour PME africaines. Kanban, timeline, rapports automatisés.', img: '/images/projects/techflow.jpg', tech: ['React','Python','PostgreSQL'], url: '#', result: '↑ Productivité x2' },
  { title: 'TerraSafe', type: 'Application Web', desc: "Solution de gestion immobilière. Suivi des biens, locataires, loyers et documents légaux depuis un dashboard.", img: '/images/projects/terrasafe.jpg', tech: ['React','Django','Stripe'], url: '#', result: '↑ 150 biens gérés' },
  { title: 'MK Studio', type: 'Portfolio', desc: 'Portfolio créatif pour un studio de design. Animations 3D, galerie interactive et formulaire de devis automatisé.', img: '/images/projects/mk.jpg', tech: ['Next.js','Framer Motion','Sanity'], url: '#', result: '↑ Leads +80%' },
  { title: 'ChapChap', type: 'App Livraison', desc: "Application de livraison express à Abidjan. Géolocalisation temps réel, tracking conducteurs et notifications push.", img: '/images/projects/chapchap.jpg', tech: ['React Native','Node.js','Socket.io'], url: '#', result: '↑ 1000+ livraisons' },
  { title: 'ElvisMarket', type: 'E-Commerce', desc: 'Boutique en ligne pour produits artisanaux ivoiriens. Paiement sécurisé, galerie photo et gestion admin.', img: '/images/projects/elvismarket.jpg', tech: ['React','WooCommerce','MySQL'], url: '#', result: '↑ 3x visibilité' },
  { title: 'MonCash', type: 'Fintech', desc: "Dashboard analytics pour suivi de transactions Mobile Money. Rapports PDF automatiques et alertes en temps réel.", img: '/images/projects/moncash.jpg', tech: ['React','Python','Redis'], url: '#', result: '↑ 10K transactions/j' },
]

export const TESTIMONIALS = [
  { name: 'Tanoh Calvin', role: 'Gérant · MEUBLE CI', project: 'Site Vitrine', rating: 5, text: "AKATech a créé notre site en moins d'une semaine. Résultat professionnel, rapide et exactement ce qu'on voulait. On recommande sans hésiter !", img: '/images/clients/client-1.jpg', result: '↑ Visibilité x3' },
  { name: 'Gnihan Tatiana', role: 'Cuisinière & Artisane du fil', project: 'Portfolio', rating: 5, text: "Mon portfolio en ligne tourne depuis 3 mois. Les clients me contactent directement depuis le site. Exactement ce dont j'avais besoin.", img: '/images/clients/client-2.jpg', result: '↑ 3 nouveaux clients' },
  { name: 'Yao Darwell', role: 'Graphiste · Designer', project: 'Portfolio', rating: 5, text: "Mon portfolio m'a permis d'obtenir 3 nouveaux clients en un mois. Design superbe, animations fluides. AKATech comprend vraiment les créatifs.", img: '/images/clients/client-3.jpg', result: '↑ CA en 30 jours' },
]

export const PRICING = {
  vitrine: {
    label: 'Site Vitrine',
    plans: [
      { badge: 'STARTER', price: '150 000 FCFA', del: '5 jours', popular: false, features: ['5 pages','Design responsive','Formulaire contact','SEO de base','1 mois support'] },
      { badge: 'PRO', price: '250 000 FCFA', del: '7 jours', popular: true, features: ['10 pages','Design premium','Blog intégré','SEO avancé','3 mois support','Formation 2h'] },
      { badge: 'ELITE', price: '400 000 FCFA', del: '10 jours', popular: false, features: ['Pages illimitées','Design sur-mesure','CMS complet','SEO + Analytics','6 mois support','Formation complète'] },
    ],
  },
  ecommerce: {
    label: 'E-Commerce',
    plans: [
      { badge: 'STARTER', price: '300 000 FCFA', del: '10 jours', popular: false, features: ['50 produits','Paiement Mobile Money','Gestion commandes','Tableau de bord','1 mois support'] },
      { badge: 'PRO', price: '500 000 FCFA', del: '14 jours', popular: true, features: ['500 produits','Multi-paiement','Stocks temps réel','Analytics avancées','3 mois support','Formation admin'] },
      { badge: 'ELITE', price: '800 000 FCFA', del: '21 jours', popular: false, features: ['Produits illimités','API paiement custom','ERP intégré','Rapports automatiques','1 an support','Formation équipe'] },
    ],
  },
  saas: {
    label: 'Application SaaS',
    plans: [
      { badge: 'MVP', price: 'À partir de 500K', del: '3 semaines', popular: false, features: ['Fonctionnalités core','Auth + Roles','Dashboard basique','API REST','Déploiement cloud'] },
      { badge: 'SCALE', price: 'Sur devis', del: '4-6 semaines', popular: true, features: ['Modules avancés','Multi-tenant','Analytics temps réel','Intégrations tierces','Support prioritaire'] },
      { badge: 'ENTERPRISE', price: 'Sur devis', del: '6-10 semaines', popular: false, features: ['Architecture microservices','SLA 99.9%','Sécurité renforcée','Formation équipe','Accompagnement dédié'] },
    ],
  },
}

export const TEAM = [
  { name: "M'Bollo Aka Elvis", role: 'Fondateur & Développeur Full-Stack', skills: ['React','Django','Python','Next.js','PostgreSQL'], bio: "Développeur passionné basé à Abidjan avec 3+ ans d'expérience. Spécialisé dans les solutions web pour le marché africain.", img: '/images/about-4.jpg' },
]

export const STATS = [
  { val: 10, suffix: '+', label: 'Projets livrés' },
  { val: 100, suffix: '%', label: 'Clients satisfaits' },
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
    img: '/images/about-1.jpg',
  },
  {
    slug: 'mobile-money-integration-site-ecommerce',
    title: 'Intégrer Mobile Money sur votre site e-commerce en Côte d\'Ivoire',
    excerpt: 'MTN MoMo, Orange Money, Wave... Comment accepter les paiements mobiles sur votre boutique en ligne et multiplier vos conversions de 3x.',
    category: 'E-Commerce',
    date: '2025-02-10',
    readTime: '8 min',
    img: '/images/projects/moncash.jpg',
  },
  {
    slug: 'react-vs-wordpress-pour-pme-africaines',
    title: 'React ou WordPress : que choisir pour votre PME africaine ?',
    excerpt: 'Deux approches, deux philosophies. On compare les coûts, la performance et la maintenance pour vous aider à faire le bon choix selon votre budget.',
    category: 'Développement Web',
    date: '2025-03-05',
    readTime: '6 min',
    img: '/images/about-2.jpg',
  },
  {
    slug: 'seo-local-abidjan-guide-complet',
    title: 'SEO Local à Abidjan : le guide complet pour apparaître en premier sur Google',
    excerpt: 'Votre concurrent apparaît en premier sur Google et vous non ? Voici les 7 optimisations SEO locales qui font la différence pour les entreprises abidjanaises.',
    category: 'SEO',
    date: '2025-03-20',
    readTime: '10 min',
    img: '/images/about-3.jpg',
  },
]
