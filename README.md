<div align="center">

<img src="public/images/logo.webp" alt="AKATECH" width="150" />

# AKATech — Agence Web Abidjan

**Sites Vitrine · E-Commerce · Applications SaaS · API & Backend · Fiches Google My Business**

Développé par **M'Bollo Aka Elvis** — Développeur Full-Stack basé à Abidjan, Côte d'Ivoire 🇨🇮

[![Live Demo](https://img.shields.io/badge/🌐%20Live-akatech.vercel.app-88ca53?style=flat-square)](https://akatech.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-18.2-61dafb?style=flat-square&logo=react)](https://reactjs.org)
[![GSAP](https://img.shields.io/badge/GSAP-3.12-88ce02?style=flat-square)](https://gsap.com)
[![Three.js](https://img.shields.io/badge/Three.js-r185-000000?style=flat-square&logo=three.js)](https://threejs.org)
[![Framer Motion](https://img.shields.io/badge/Framer%20Motion-11-0055FF?style=flat-square)](https://www.framer.com/motion)
[![License](https://img.shields.io/badge/Licence-Propriétaire-red?style=flat-square)](#)

</div>

---

## 📖 À propos

**AKATech** est une agence web freelance basée à **Abidjan, Côte d'Ivoire**, spécialisée dans la conception de solutions digitales sur-mesure pour les entrepreneurs, PME et créatifs d'Afrique de l'Ouest : sites vitrines, e-commerce, applications SaaS, API/backend et fiches Google My Business.

Ce dépôt contient le **site officiel d'AKATech** — la vitrine de l'agence, construite avec **Next.js 14**, **GSAP** et **Three.js**. Le SEO est pensé au-delà du référencement classique : données structurées **JSON-LD** taillées pour le SEO, l'**AEO** (moteurs de réponse type Google AI Overviews) et le **GEO** (recommandation par les LLM comme ChatGPT ou Perplexity).

> **Toutes les prestations sont développées directement par AKATech** — pas de sous-traitance, pas de templates génériques.

---

## 🛠️ Stack technique

| Techno | Version | Rôle |
|---|---|---|
| **Next.js** | 14.2.29 (App Router) | Framework React — routing, SSR |
| **React** | 18.2 | UI & composants |
| **GSAP** + ScrollTrigger | 3.12.5 | Animations scroll-driven, tunnel 3D |
| **Three.js** | 0.185 | Tunnel WebGL du mode Explorer |
| **Framer Motion** | 11 | Micro-interactions, transitions de page |
| **Lucide React** | 0.469 | Icônes vectorielles |
| **Resend** | 4.0 | Envoi d'e-mails (formulaire de contact) |

**Design system :**
- Vert de marque `#88ca53` (dark mode) / `#5f9137` (light mode)
- Polices : **JetBrains Mono** (corps, UI) · **Space Grotesk** (titres) · **Dancing Script** (accents décoratifs)
- Thème clair/sombre persistant, bascule en transition circulaire (**View Transitions API**, repli instantané sur Firefox)

---

## 📁 Structure du projet

```
akatech-nextjs/
├── app/
│   ├── page.js · HomeClientDesktop.js · HomeClientMobile.js · HomeResponsive.js
│   ├── layout.js              # Metadata SEO/AEO/GEO + JSON-LD ProfessionalService
│   ├── globals.css            # Design system, thème dark/light, responsive
│   ├── robots.js · sitemap.js
│   │
│   ├── about/                 # Équipe, stats animées, valeurs
│   ├── services/               # 5 domaines d'expertise
│   ├── projects/               # Galerie filtrée (19 réalisations)
│   ├── pricing/                 # 5 grilles tarifaires + FAQ
│   ├── blog/[slug]/            # 4 articles + recherche + newsletter
│   ├── contact/                 # Formulaire + canaux directs
│   ├── explorer/                # Tunnel 3D WebGL des projets (NEW)
│   └── api/contact/             # Route Resend + rate-limit anti-spam
│
├── components/
│   ├── layout/    # Navbar, Footer, CardNav, StaggeredMenu, PageTransition, BlobTransition
│   ├── ui/        # AuroraHero, OrbHero, Loader, ConversionMarquee, TrustStacksMarquee…
│   ├── explorer/  # ProjectsTunnel (Three.js live), ProjectModal, ProjectGlobe (dormant)
│   └── responsive/# ResponsiveLoader — bascule desktop/mobile par composant
│
├── lib/
│   ├── data.js    # SERVICES, PROJECTS (19), PRICING, TESTIMONIALS, TEAM, STATS, BLOG_POSTS, FAQ_ITEMS
│   └── theme.js   # useTheme — dark/light + View Transitions
│
├── public/
├── next.config.js · vercel.json · jsconfig.json · package.json
```

> Chaque route suit le même schéma **Desktop / Mobile / Responsive-loader** — même logique de séparation que sur AKAFOLIO.

---

## 📄 Pages & fonctionnalités

| Route | Titre | Contenu principal |
|---|---|---|
| `/` | Accueil | Hero animé, services, marquees de confiance, projets récents, témoignages |
| `/about` | À propos | Équipe, stats animées, valeurs |
| `/services` | Services | 5 domaines d'expertise, process en 4 étapes |
| `/projects` | Projets | Galerie filtrée par catégorie — 19 réalisations |
| `/explorer` | **Explorer** | Tunnel 3D **WebGL** (Three.js + GSAP ScrollTrigger) à travers les 19 projets — desktop uniquement, repli vers `/projects` sur mobile |
| `/pricing` | Tarifs | 5 grilles (Portfolio, Vitrine, E-commerce, SaaS, GBP), FAQ, témoignages |
| `/blog` + `/blog/[slug]` | Blog | Articles, recherche, tags, newsletter |
| `/contact` | Contact | Formulaire (Resend), canaux directs, FAQ |

---

## 💼 Services proposés

> **Toutes ces prestations sont réalisées et livrées directement par AKATech.**

### 01 · Conception de Site Web
Sites modernes, responsive et optimisés conversion — du portfolio à l'e-commerce.
**À partir de 100 000 FCFA · 5 à 7 jours**

### 02 · Cartes Interactives & Dashboards
Cartes Mapbox / Leaflet et dashboards de data en temps réel.
**Sur devis · 7 à 14 jours**

### 03 · API & Backend Robustes
API REST sécurisées (Django / Flask), JWT, Mobile Money, déploiement cloud.
**À partir de 200 000 FCFA · 7 à 14 jours**

### 04 · Maintenance & Support
Mises à jour, corrections, sauvegardes, support prioritaire.
**À partir de 20 000 FCFA/mois**

### 05 · Fiche Google My Business
Création ou optimisation, SEO local, suivi mensuel des avis.
**À partir de 20 000 FCFA · 1 à 2 jours**

---

## 💰 Tarifs AKATech

> Prix en FCFA · Marché ivoirien · Devis gratuit sous 24h · Domaine + hébergement offerts la 1ère année sur la majorité des formules

### 🎨 Portfolio
| Formule | Prix | Délai |
|---|---|---|
| STARTER | 100 000 FCFA | 3 à 5 jours |
| **STANDARD** ⭐ | 175 000 FCFA | 5 à 7 jours |
| PREMIUM | 275 000 FCFA | 7 à 10 jours |

### 🖥️ Site Vitrine
| Formule | Prix | Délai |
|---|---|---|
| STARTER | 220 000 FCFA | 5 à 7 jours |
| **PRO** ⭐ | 350 000 FCFA | 7 à 10 jours |
| ELITE | 550 000 FCFA | 10 à 14 jours |

### 🛒 E-commerce
| Formule | Prix | Délai |
|---|---|---|
| STARTER | 450 000 FCFA | 14 jours |
| **PRO** ⭐ | 750 000 FCFA | 21 jours |
| ELITE | 1 200 000 FCFA | 30 jours |

### ⚙️ App Web / SaaS
| Formule | Prix | Délai |
|---|---|---|
| SUR DEVIS | Étude personnalisée | Diagnostic gratuit sous 48h |

### 📍 Fiche Google My Business
| Formule | Prix | Délai |
|---|---|---|
| **CRÉATION** ⭐ | 20 000 FCFA | 1 à 2 jours |
| OPTIMISATION | 12 000 FCFA | 1 jour |
| SUIVI MENSUEL | 10 000 FCFA/mois | Continu |

> ⭐ = Formule recommandée. Détail complet des fonctionnalités par formule → page [`/pricing`](https://akatech.vercel.app/pricing).

---

## 🚀 Installation & démarrage

### Prérequis
- **Node.js** ≥ 18.x
- **npm** ≥ 9.x

### Installation locale

```bash
git clone https://github.com/wthomasss06-stack/akatech-agencenext.git
cd akatech-agencenext
npm install

# Variable d'environnement requise pour le formulaire de contact
echo "RESEND_API_KEY=re_xxxxxxxx" > .env.local

npm run dev
# → http://localhost:3000
```

### Build production

```bash
npm run build
npm start
```

| Commande | Description |
|---|---|
| `npm run dev` | Serveur de développement, hot reload |
| `npm run build` | Build de production |
| `npm start` | Sert le build de production |

---

## ☁️ Déploiement

Déployé sur **Vercel**, en rendu **SSR classique** (pas d'export statique) — la route `/api/contact` (Resend) est une fonction serverless et a besoin d'un runtime Node, incompatible avec `output: 'export'`.

```bash
npm i -g vercel
vercel --prod
```

`next.config.js` actuel : `trailingSlash: true`, `images.unoptimized: true`.

---

## ⚙️ Fonctionnalités techniques notables

- **Tunnel 3D WebGL** (`/explorer`) — Three.js + GSAP ScrollTrigger, parcourt les 19 projets, textures = vraies captures d'écran
- **Thème clair/sombre** en transition circulaire via **View Transitions API** (repli instantané si non supporté)
- **SEO structuré JSON-LD** (`ProfessionalService`) pensé SEO + AEO + GEO — citable par Google AI Overviews et les LLM
- **Footer "Demander à l'IA"** — liens pré-remplis vers ChatGPT, Claude, Perplexity, Gemini, Grok
- **Formulaire de contact** → Resend, avec limite anti-spam basique en mémoire
- **Marquees de confiance** (`TrustStacksMarquee`, `ConversionMarquee`) sur Accueil / À propos / Services

---

## 🤝 Processus de travail

1. **On vous écoute** — devis gratuit sous 24h, sans engagement
2. **On planifie** — techno, design, délais définis ensemble
3. **On développe** — acompte de 50%, suivi régulier, lien de prévisualisation avant mise en ligne
4. **On livre & on forme** — solde à la livraison, accès transmis, corrections de bugs gratuites le mois suivant

---

## 📞 Contact & devis

| Canal | Info |
|---|---|
| 📱 **WhatsApp** | [+225 01 42 50 77 50](https://wa.me/2250142507750) |
| 📧 **Email** | [wthomasss06@gmail.com](mailto:wthomasss06@gmail.com) |
| 💼 **LinkedIn** | [m-bollo-aka](https://www.linkedin.com/in/m-bollo-aka) |
| 📘 **Facebook** | [AKATech](https://web.facebook.com/profile.php?id=61577494705852) |
| 🌍 **Portfolio perso** | [AKAFOLIO](https://mbolloaka-dev.vercel.app/) |
| 📍 **Localisation** | Abidjan, Côte d'Ivoire 🇨🇮 |

---

## 👨‍💻 Auteur

**M'Bollo Aka Elvis** — Développeur Full-Stack, fondateur AKATech

React · Next.js · Django · Flask · PostgreSQL · GSAP

> _"Des prix honnêtes adaptés au marché africain. Pas de frais cachés, pas de jargon."_

---

<div align="center">

*© 2026 AKATech. Tous droits réservés.*

**[🌐 Visiter le site](https://akatech.vercel.app)** · **[🧭 Mode Explorer](https://akatech.vercel.app/explorer)** · **[📱 WhatsApp](https://wa.me/2250142507750)**

</div>