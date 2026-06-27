<div align="center">

<img src="public/images/logo.png" alt="AKATECH AGENCE" width="150" />

# AKATech — Agence Web & Solutions Digitales

**Sites web sur-mesure · E-Commerce · Applications SaaS · Portfolios**

Développé par **M'Bollo Aka** — Développeur Full-Stack basé à Abidjan, Côte d'Ivoire

[![Live Demo](https://img.shields.io/badge/🌐%20Live%20Demo-akatech--agencenext.vercel.app-22c864?style=flat-square)](https://akatech-agencenext.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-18-61dafb?style=flat-square&logo=react)](https://reactjs.org)
[![Framer Motion](https://img.shields.io/badge/Framer%20Motion-11-0055FF?style=flat-square)](https://www.framer.com/motion)
[![License](https://img.shields.io/badge/Licence-Propriétaire-red?style=flat-square)](./LICENSE)

</div>

---

## 📖 À propos

**AKATech** est une agence digitale basée à **Abidjan, Côte d'Ivoire**, spécialisée dans la conception de solutions web performantes et sur-mesure pour les entreprises, startups et créatifs d'Afrique de l'Ouest.

Ce dépôt contient le **site vitrine officiel d'AKATech** — une vitrine interactive qui présente nos services, nos réalisations, notre processus de travail et nos formules tarifaires. Construit avec **Next.js 14** et **Framer Motion**, il incarne nos standards : code propre, design soigné, performances optimisées.

> **Toutes les prestations sont développées directement par AKATech** — pas de sous-traitance, pas de templates génériques.

---

## 🛠️ Stack Technique

| Technologie | Version | Rôle |
|---|---|---|
| **Next.js** | 14 (App Router) | Framework React, routing, SSR/SSG |
| **React** | 18 | Interface utilisateur & composants |
| **Framer Motion** | 11 | Animations, micro-interactions, transitions |
| **Lucide React** | 0.469 | Système d'icônes vectorielles |
| **CSS Variables** | — | Thème dark/light, design system skeumorphique |
| **JavaScript** | ES6+ | Logique applicative |

**Palette de couleurs :**
- Vert néon `#22c864` — couleur principale
- Fond noir `#060e09` — fond profond (dark mode)
- Typographies : **Syne** (titres) · **Inter / System UI** (corps) · **Orbitron** (prix)

---

## 📁 Structure du projet

```
akatech-nextjs/
├── app/
│   ├── page.js                         # Page d'accueil (Hero, Services, Projets, Témoignages)
│   ├── globals.css                     # Styles globaux + variables CSS + responsive
│   ├── layout.js                       # Layout racine (Navbar, Footer, PWA metadata)
│   │
│   ├── about/
│   │   ├── AboutClient.js              # Équipe, Timeline, Valeurs, Stats animées
│   │   ├── AboutClientMobile.js        # Version mobile optimisée
│   │   └── page.js
│   │
│   ├── services/
│   │   ├── ServicesClient.js           # Services, Tech Stack, Process 4 étapes
│   │   ├── ServicesClientMobile.js     # Version mobile optimisée
│   │   └── page.js
│   │
│   ├── projects/
│   │   ├── ProjectsClient.js           # Galerie filtrée par catégorie
│   │   ├── ProjectsClientMobile.js     # Version mobile optimisée
│   │   └── page.js
│   │
│   ├── pricing/
│   │   ├── PricingClient.js            # Onglets formules, Comparatif, FAQ, Témoignages
│   │   ├── PricingClientMobile.js      # Version mobile optimisée
│   │   └── page.js
│   │
│   ├── blog/
│   │   ├── BlogClient.js               # Liste articles, Recherche, Newsletter
│   │   ├── BlogClientMobile.js         # Version mobile optimisée
│   │   └── [slug]/
│   │       └── BlogArticleClient.js    # Article individuel
│   │
│   └── contact/
│       ├── ContactClient.js            # Formulaire WhatsApp, Canaux, FAQ
│       ├── ContactClientMobile.js      # Version mobile optimisée
│       └── page.js
│
├── components/
│   ├── layout/
│   │   ├── Navbar.js                   # Navigation responsive + toggle dark/light
│   │   └── Footer.js                   # Footer avec liens et contacts
│   └── ui/
│       ├── index.js                    # SectionEye, AnimatedCounter, LazyImg, MarqueeStrip…
│       ├── AuroraHero.js               # Background animé aurora pour les pages héros
│       ├── OrbHero.js                  # Orbe lumineux animé (hero accueil)
│       └── Loader.js                   # Écran de chargement animé
│
├── lib/
│   ├── data.js                         # Données statiques (projets, services, blog, équipe…)
│   └── theme.js                        # Hook useTheme (dark/light + persistence)
│
├── public/
│   ├── images/                         # Photos équipe, clients, projets
│   ├── favicon.
│   ├── manifest.json                   # Manifest PWA
│   └── sw.js                           # Service Worker (cache offline)
│
├── next.config.js
├── jsconfig.json
└── package.json
```

---

## 📄 Pages & Fonctionnalités

| Route | Titre | Contenu principal |
|---|---|---|
| `/` | Accueil | Hero animé, aperçu services, projets récents, témoignages, CTA |
| `/about` | À propos | Équipe, timeline AKATech, valeurs, stats (projets livrés, clients…) |
| `/services` | Services | 6 domaines d'expertise, tech stack visuel, processus en 4 étapes |
| `/projects` | Projets | Galerie filtrée par catégorie (Vitrine, E-Commerce, SaaS, Portfolio…) |
| `/pricing` | Tarifs | Plans par type de projet, tableau comparatif, FAQ, témoignages |
| `/blog` | Blog | Articles avec recherche, tags et inscription newsletter |
| `/blog/[slug]` | Article | Article individuel avec navigation et articles similaires |
| `/contact` | Contact | Formulaire WhatsApp, canaux directs, carte, FAQ |

---

## 💼 Services proposés par AKATech

> **Toutes ces prestations sont réalisées et livrées directement par AKATech.**

### 01 · Sites Vitrine & Landing Pages
Design sur-mesure, SEO intégré, livraison en 7–14 jours. Une présence professionnelle optimisée pour convertir.

### 02 · E-Commerce & Boutiques en ligne
Paiement Mobile Money, gestion de stock, tableau de bord admin. Boutique opérationnelle en 2 semaines.

### 03 · Applications SaaS & Métier
Automatisation des processus internes. Multi-rôles, dashboard temps réel, API REST robuste.

### 04 · Back-end & API
Architecture solide, sécurisée et scalable. Django, NestJS, PostgreSQL — prêt pour la production.

### 05 · Portfolios & Identités créatives
Vitrines animées et percutantes pour créatifs, graphistes et freelances qui veulent plus de clients.

### 06 · Maintenance & Évolutions
Mises à jour, nouvelles fonctionnalités, support réactif sous 48h.

---

## 💰 Tarifs AKATech

> Prix en FCFA · Adapté au marché africain · Devis gratuit et sans engagement

### 🖥️ Site Vitrine

| Formule | Prix | Délai |
|---|---|---|
| **STARTER** | 70 000 FCFA | 3 à 5 jours |
| **STANDARD** ⭐ | 120 000 FCFA | 5 à 7 jours |
| **PREMIUM** | 180 000 FCFA | 7 à 10 jours |

### 🛒 E-Commerce

| Formule | Prix | Délai |
|---|---|---|
| **STARTER** | 150 000 FCFA | 5 jours |
| **PRO** ⭐ | 270 000 FCFA | 7 à 10 jours |
| **ELITE** | 450 000 FCFA | 10 à 14 jours |

### 🏪 Boutique avancée / Marketplace

| Formule | Prix | Délai |
|---|---|---|
| **STARTER** | 400 000 FCFA | 14 jours |
| **PRO** ⭐ | 650 000 FCFA | 21 jours |
| **ELITE** | 1 000 000 FCFA | 30 jours |

### ⚙️ Application SaaS / Métier

| Formule | Prix | Délai |
|---|---|---|
| **MVP** | 700 000 FCFA | 3 à 4 semaines |
| **SCALE** ⭐ | 1 200 000 – 2 000 000 FCFA (sur devis) | 4 à 6 semaines |
| **ENTERPRISE** | À partir de 2 500 000 FCFA | 6 à 10 semaines |

> ⭐ = Formule recommandée · L'hébergement est **offert 1 an** pour les formules PRO et ELITE. Après la 1ère année : ~15 000 FCFA/an. Formation incluse dans toutes les formules.

---

## 🚀 Installation & Démarrage

### Prérequis

- **Node.js** ≥ 18.x
- **npm** ≥ 9.x (ou yarn / pnpm)

### Installation locale

```bash
# 1. Cloner le dépôt
git clone https://github.com/wthomasss06-stack/akatech-agencenext.git
cd akatech-agencenext

# 2. Installer les dépendances
npm install

# 3. Lancer en mode développement
npm run dev
# → http://localhost:3000
```

### Build production

```bash
# Compiler le projet
npm run build

# Prévisualiser le build
npm start
```

### Commandes disponibles

| Commande | Description |
|---|---|
| `npm run dev` | Serveur de développement avec hot reload |
| `npm run build` | Build de production optimisé |
| `npm start` | Serveur Next.js production |

---

## ☁️ Déploiement

### Vercel (recommandé)

```bash
# Installer Vercel CLI si nécessaire
npm i -g vercel

# Déployer
vercel --prod
```

> ⚠️ Pour un déploiement Vercel, s'assurer de retirer `output: 'export'` dans `next.config.js` si présent.

### Hébergement statique (Netlify, GitHub Pages, cPanel…)

Le build génère un dossier `/out/` utilisable sur tout hébergeur statique.

```bash
npm run build
# Uploader le contenu du dossier /out/
```

---

## 📐 Responsive & UX

- **Mobile-first** — breakpoints à 640px et 768px, composants `*Mobile.js` dédiés
- **Héros uniformes** — `padding: 9rem 5% 6rem`, `min-height: 420px` sur desktop
- **PWA** — Service Worker + Web App Manifest pour installation sur mobile
- **Dark / Light mode** — Thème persistant via CSS variables + hook `useTheme`
- **Performance** — Images lazy-loading, animations conditionnelles, code splitting

---

## 🤝 Processus de travail

1. **On vous écoute** — Devis gratuit et personnalisé en moins de 24h, sans engagement
2. **On planifie** — Technologies, design, délais et fonctionnalités définis ensemble
3. **On développe** — Code propre, design soigné, suivi régulier à chaque étape
4. **On livre & on forme** — Mise en ligne, tests, formation incluse, support post-livraison

---

## 📞 Contact & Devis

| Canal | Info |
|---|---|
| 📱 **WhatsApp** | [+225 01 42 50 77 50](https://wa.me/2250142507750) |
| 📧 **Email** | [wthomasss06@gmail.com](mailto:wthomasss06@gmail.com) |
| 🌍 **Portfolio** | [akafolio160502.vercel.app](https://akafolio160502.vercel.app) |
| 📍 **Localisation** | Abidjan, Côte d'Ivoire 🇨🇮 |

---

## 👨‍💻 Auteur

**M'Bollo Aka** — Développeur Full-Stack

React · Next.js · Flask · Django · MYSQL · TailwindCSS

> _"Des prix honnêtes adaptés au marché africain. Pas de frais cachés, pas de jargon."_

---

<div align="center">

*© 2025 AKATech. Tous droits réservés.*

**[🌐 Visiter le site](https://akatech-agencenext.vercel.app)** · **[📱 WhatsApp](https://wa.me/2250142507750)** · **[✉️ Email](mailto:wthomasss06@gmail.com)**

</div>
