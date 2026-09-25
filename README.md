<div align="center">

<img src="public/images/logo.webp" alt="AKATECH" width="150" />

# AKATech — Agence Web Abidjan

**Sites Vitrine · E-Commerce · Applications SaaS · Chatbot IA · Paiement en ligne · Fiches Google My Business**

Développé par **M'Bollo Aka Elvis** — Développeur Full-Stack basé à Abidjan, Côte d'Ivoire 🇨🇮

[![Live Demo](https://img.shields.io/badge/🌐%20Live-akatech.vercel.app-88ca53?style=flat-square)](https://akatech.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-18.2-61dafb?style=flat-square&logo=react)](https://reactjs.org)
[![GSAP](https://img.shields.io/badge/GSAP-3.12-88ce02?style=flat-square)](https://gsap.com)
[![Three.js](https://img.shields.io/badge/Three.js-r185-000000?style=flat-square&logo=three.js)](https://threejs.org)
[![Framer Motion](https://img.shields.io/badge/Framer%20Motion-11-0055FF?style=flat-square)](https://www.framer.com/motion)
[![Gemini](https://img.shields.io/badge/Gemini-2.5%2F3.x-4285F4?style=flat-square&logo=googlegemini)](https://aistudio.google.com)
[![Groq](https://img.shields.io/badge/Groq-Llama%203.1-F55036?style=flat-square)](https://groq.com)
[![Prisma](https://img.shields.io/badge/Prisma-6.x-2D3748?style=flat-square&logo=prisma)](https://prisma.io)
[![License](https://img.shields.io/badge/Licence-Propriétaire-red?style=flat-square)](#)

</div>

---

## 📖 À propos

**AKATech** est une agence web freelance basée à **Abidjan, Côte d'Ivoire**, spécialisée dans la conception de solutions digitales sur-mesure pour les entrepreneurs, PME et créatifs d'Afrique de l'Ouest : sites vitrines, e-commerce, applications SaaS, chatbots IA, paiement en ligne et fiches Google My Business.

Ce dépôt contient le **site officiel d'AKATech** — la vitrine du Studio., construite avec **Next.js 14**, **GSAP** et **Three.js** — ainsi qu'un **assistant IA conversationnel** intégré au site public. Le SEO est pensé au-delà du référencement classique : données structurées **JSON-LD** taillées pour le SEO, l'**AEO** (moteurs de réponse type Google AI Overviews) et le **GEO** (recommandation par les LLM comme ChatGPT ou Perplexity).

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
| **@google/genai** | 2.11 | Assistant IA — fournisseur principal (Gemini, gratuit) |
| **groq-sdk** | 1.3 | Assistant IA — fournisseur de secours (Llama 3.1 8B, gratuit) |
| **Prisma** + PostgreSQL (Neon) | 6.19 | Conversations, leads, questionnaires, devis, articles, analytics visiteurs — alimente le dashboard admin |
| **@vercel/analytics** | 2.0 | Pageviews + Web Vitals (en complément du tracking interne visiteurs) |
| **Recharts** | 3.9 | Graphiques du dashboard admin |

**Site bilingue FR/EN** — `lib/language.js` (contexte + ~200 clés de traduction), `useLanguage()` consommé dans une trentaine de composants/pages ; sélecteur FR/EN dans la navbar, préférence persistée en `localStorage` (`akatech-language`).

**Design system :**
- Vert de marque `#88ca53` (dark mode) / `#5f9137` (light mode)
- Polices : **JetBrains Mono** (corps, UI) · **Space Grotesk** (titres) · **Anton** (labels du mode Explorer/Tunnel) · **Dancing Script** (accents décoratifs)
- Thème clair/sombre persistant, bascule en transition circulaire (**View Transitions API**, repli instantané sur Firefox)

---

## 📁 Structure du projet

```
akatech-nextjs/
├── middleware.js               # Basic Auth (/dashboard + API admin) + cookies de tracking visiteurs
├── prisma/
│   └── schema.prisma            # Conversation, Message, Lead, Visitor, VisitSession, PageView, VisitorAction, Questionnaire, Quote, BlogPost, Invoice
│
├── app/
│   ├── page.js · HomeClientDesktop.js · HomeClientMobile.js · HomeResponsive.js
│   ├── layout.js              # Metadata SEO/AEO/GEO + JSON-LD ProfessionalService
│   ├── globals.css            # Design system, thème dark/light, responsive
│   ├── robots.js · sitemap.js
│   │
│   ├── about/                 # Équipe, stats animées, valeurs
│   ├── services/               # 6 domaines d'expertise, 7 types de solutions conçues, processus en 6 étapes
│   ├── projects/               # Galerie filtrée (19 réalisations)
│   ├── pricing/                 # 4 grilles tarifaires (Vitrine, E-commerce, SaaS, GBP) + FAQ
│   ├── devis/ · devis/[type]/   # Questionnaire de devis dynamique (portfolio, vitrine/e-commerce, SaaS)
│   ├── blog/[slug]/            # Articles (modèle BlogPost) + recherche + newsletter
│   ├── contact/                 # Formulaire + canaux directs
│   ├── explorer/                # Tunnel 3D WebGL des projets (NEW)
│   ├── dashboard/                # Admin — leads, prospects/devis, conversations, analytics visiteurs, factures (protégé par middleware)
│   │
│   └── api/
│       ├── contact/             # Route Resend + rate-limit anti-spam
│       ├── assistant/           # Chat IA — Gemini → Groq, tool use start_questionnaire/capture_lead
│       ├── assistant/end/       # Clôture une conversation en base (sans appel IA)
│       ├── questionnaire/       # Soumission du devis + décision (accepter/décliner)
│       ├── prospects/           # Lecture/recherche des questionnaires (dashboard)
│       ├── invoices/            # CRUD factures (dashboard)
│       ├── blog/                # Articles (CRUD, modèle BlogPost)
│       ├── leads/ · conversations/ · stats/  # Lecture dashboard (leads, historique chat, stats agrégées)
│       ├── stats/visitor/[visitorId]/  # Parcours détaillé d'un visiteur (à la demande, dashboard uniquement)
│       ├── track/                # Écrit page vue / clic d'action en base (cookies posés par middleware.js)
│       │
│
├── components/
│   ├── layout/    # Navbar, Footer, CardNav, StaggeredMenu, PageTransition, BlobTransition
│   ├── ui/        # AuroraHero, OrbHero, Loader, ConversionMarquee, TrustStacksMarquee, AIAssistant, VisitorTracker, CookieConsent…
│   ├── dashboard/ # Onglets admin — ProspectsTab, InvoicesTab, etc.
│   ├── explorer/  # ProjectsTunnel (Three.js live), ProjectModal, ProjectGlobe (dormant)
│   └── responsive/# ResponsiveLoader — bascule desktop/mobile par composant
│
├── lib/
│   ├── data.js         # SERVICES (6), PROJECTS (19), PRICING, WHAT_WE_BUILD (7), PROCESS_STEPS (6), TESTIMONIALS, TEAM, STATS, BLOG_POSTS, FAQ_ITEMS, PROJECT_TYPE_LABELS
│   ├── db.js           # Couche Prisma — conversations, leads, questionnaires/devis, factures, analytics visiteurs (visiteurs/jour, clics, parcours)
│   ├── theme.js         # useTheme — dark/light + View Transitions
│   ├── language.js       # useLanguage — bilingue FR/EN, persisté localStorage
│   ├── assistant.js     # Prompt de qualification + tools start_questionnaire/capture_lead
│   ├── ai-providers.js  # Cascade de modèles Gemini, fallback Groq, rate-limiting, validation — partagé entre les routes assistant
│   ├── questionnaires-schema.js  # Source unique des 3 questionnaires (champs, types, conditions d'affichage)
│   ├── quote-calc.js · market-positioning.js  # Classification tarifaire + argumentaire du devis, générés par LLM
│   ├── questionnaire-pdf.js  # Génération du PDF de devis + envoi email
│   ├── track-action.js  # Helper client — envoie un clic d'action (WhatsApp, tel, chat, formulaire) à /api/track
│   │
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
| `/services` | Services | 6 domaines d'expertise, 7 types de solutions conçues, processus en 6 étapes |
| `/projects` | Projets | Galerie filtrée par catégorie — 19 réalisations |
| `/explorer` | **Explorer** | Tunnel 3D **WebGL** (Three.js + GSAP ScrollTrigger) à travers les 19 projets — desktop uniquement, repli vers `/projects` sur mobile |
| `/pricing` | Tarifs | 4 grilles (Vitrine — incluant le portfolio —, E-commerce, SaaS, GBP), FAQ, témoignages |
| `/devis` + `/devis/[type]` | Devis | Formulaire de questionnaire dynamique (portfolio, vitrine/e-commerce, SaaS), généré depuis `lib/questionnaires-schema.js` — accessible depuis l'assistant IA ou directement par lien |
| `/blog` + `/blog/[slug]` | Blog | Articles stockés en base (modèle `BlogPost`), recherche, tags, newsletter |
| `/contact` | Contact | Formulaire (Resend), canaux directs, FAQ |


---

## 🤖 Assistant IA

Widget de chat flottant (bouton bas-gauche — le bas-droit est déjà pris par le bouton WhatsApp), présent sur tout le site public.

**Ce qu'il fait** : répond aux questions sur AKATech, qualifie brièvement le visiteur puis lance le questionnaire de devis adapté (`start_questionnaire`) pour les projets portfolio, vitrine/e-commerce et SaaS. Pour les besoins hors parcours, il utilise `capture_lead` pour enregistrer le prospect et envoyer un email à l'admin.

**Questionnaire → Devis, jusqu'à la décision** : le questionnaire (rempli sur `/devis/[type]`, dans ou hors du chat) est persisté (modèle `Questionnaire`, lien public via token non devinable). Une fois soumis, `lib/quote-calc.js` classe la demande dans une formule tarifaire (`lib/data.js` → `PRICING`) et un LLM génère une justification lisible (jamais le prix lui-même) ainsi qu'un texte de positionnement optionnel (`lib/market-positioning.js`, Groq) — le tout stocké dans le modèle `Quote`. Un PDF est généré et envoyé par email (`lib/questionnaire-pdf.js`). Le prospect accepte ou décline ensuite le devis (`/api/questionnaire/[token]/decision`) ; une acceptation déclenche un email de confirmation. Le dashboard (onglet **Prospects**) affiche l'ensemble des réponses et décisions.

**Double fournisseur, cascade automatique** :
```
Gemini (gemini-3.5-flash → gemini-3.1-flash-lite → gemini-1.5-flash)
   ↓ (si les 3 échouent : quota épuisé, modèle indisponible…)
Groq (Llama 3.1 8B, gratuit)
   ↓ (si les deux fournisseurs sont hors service)
Message de repli invitant à écrire sur WhatsApp
```
Les deux fournisseurs sont sur des paliers **gratuits** (voir `.env.example`) — aucun coût direct tant que le volume reste raisonnable pour une agence qui démarre.

**System prompt généré, pas codé en dur** — `lib/assistant.js` construit le prompt à partir de `lib/data.js` (`SERVICES`, `PRICING`, `FAQ_ITEMS`, `PROJECT_TYPE_LABELS`) à chaque requête : un changement de tarif sur le site se reflète automatiquement dans les réponses de l'assistant, sans synchronisation manuelle.



Fichiers clés : `lib/ai-providers.js` (cascade + rate-limiting, partagé), `lib/assistant.js` (prompt + tool), `lib/quote-calc.js` + `lib/market-positioning.js` (classification et argumentaire du devis), `lib/questionnaire-pdf.js` (génération PDF + email), `app/api/assistant/route.js`, `app/api/questionnaire/`, `components/ui/AIAssistant.js`.

---

## 📊 Analytics visiteurs

Tracking interne (dashboard, onglet **Analytics**), en complément de Vercel Analytics — pensé pour rester anonyme et léger, sans dépendance externe.

**Comment ça fonctionne :**

1. **À l'arrivée sur une page publique**, le navigateur envoie un événement `page_view` à `/api/track`. Les pages `/dashboard` et les routes `/api/*` sont exclues (pas de cookie posé, pas d'événement).
2. **`middleware.js` pose deux cookies techniques** dès la première requête : `akatech_visitor` (1 an, identifie le navigateur — pas une personne) et `akatech_session` (30 min glissantes, se prolonge à chaque page vue). Un retour après 30 min d'inactivité crée une nouvelle session, comptée comme une nouvelle "visite".
3. **Les clics d'action** sont suivis via `lib/track-action.js` sur les points d'entrée principaux du site (badge WhatsApp flottant, liens WhatsApp/téléphone du footer, ouverture du chat IA, envoi réussi du formulaire de contact). Chaque clic est classé dans une whitelist serveur (`ACTION_TYPES` dans `lib/db.js`) — jamais une valeur arbitraire envoyée par le navigateur — et la page/section concernée est déduite de l'en-tête `Referer` (chemin seul, jamais les paramètres d'URL ni le contenu d'un champ saisi).
4. **Dans le dashboard**, les visiteurs par jour sont comptés comme des `visitorId` distincts ce jour-là (courbe Recharts). Le nombre de fois qu'un visiteur est revenu correspond à son nombre de sessions distinctes, pas à son nombre de pages vues. La liste "Visiteurs récurrents" est cliquable et ouvre le **parcours** détaillé (pages vues + clics fusionnés et triés chronologiquement, session par session) via `/api/stats/visitor/[visitorId]`, chargé à la demande.

**Limites à garder en tête :** cela compte des navigateurs, pas des personnes. Effacer les cookies ou changer d'appareil crée une autre identité de suivi ; plusieurs personnes partageant un appareil peuvent être regroupées.

**Point important sur le consentement :** la bannière cookies (`components/ui/CookieConsent.js`) enregistre un choix ("Tout accepter" / "Refuser l'optionnel") côté session, pour que le dashboard affiche la vraie répartition accepté/refusé — mais que le choix soit accepter ou refuser, la mesure d'audience anonyme posée par `middleware.js` continue de tourner : elle n'attend pas la décision de la bannière pour démarrer. Autrement dit, le consentement ne sert pas aujourd'hui à activer ou couper ce tracking, seulement à l'enregistrer.

Aucune purge automatique des événements (`PageView`, `VisitorAction`) n'existe dans le code actuel — à prévoir si le volume ou la durée de rétention le justifie.

---

## 🗄️ Base de données

PostgreSQL (testé avec [Neon](https://neon.tech), palier gratuit), schéma dans `prisma/schema.prisma` :

| Modèle | Rôle |
|---|---|
| `Conversation` | Une session de chat — statut ACTIVE / ENDED / CONVERTED |
| `Message` | Chaque tour de la conversation, avec le fournisseur IA utilisé |
| `Lead` | Prospect capturé par l'assistant — score, statut, notes |
| `Visitor` / `VisitSession` / `PageView` / `VisitorAction` | Analytics visiteurs (pages vues + clics d'action) pour le dashboard — voir section dédiée plus haut |
| `Questionnaire` | Réponses au formulaire de devis (`/devis/[type]`) — lien public par token, statut STARTED → SUBMITTED → QUOTED → accepted/declined |
| `Quote` | Devis généré pour un `Questionnaire` : formule tarifaire, fourchette de prix, justification et argumentaire générés par LLM |
| `BlogPost` | Articles du blog (titre, contenu, catégorie, image, publication) |
| `Invoice` | Factures émises par AKATech — créées, modifiées et téléchargées (PNG/PDF) depuis l'onglet **Factures** du dashboard |

> ⚠️ La connexion à la base est **facultative** : sans `DATABASE_URL`, le chat continue de fonctionner normalement (juste sans historique ni dashboard) plutôt que de planter.

> **Note Prisma** : la CLI (`prisma db push`, `prisma generate`) lit `.env`, **pas** `.env.local` — contrairement à Next.js qui lit les deux. Il faut un `.env` classique à la racine avec au moins `DATABASE_URL` pour que les commandes Prisma fonctionnent en local (`.env.local` reste le fichier principal pour tout le reste).

> **Séparation dev / prod** : comme la CLI Prisma ne lit que `.env`, ce fichier doit toujours pointer vers une branche Neon **de développement** (Neon Console → Branches → Create branch), jamais la prod — sinon un `db push` local risque de modifier le schéma en prod par erreur. La branche prod ne vit que sur Vercel (Environment Variables, scope "Production"), jamais dans un fichier local. Le terminal affiche l'hôte connecté au démarrage (`[DB] Connecté à : ...`) pour vérifier en un coup d'œil qu'on est bien sur la branche dev.

> **Prisma 6.x, pas 7.x** — la version 7 a changé la façon de déclarer `datasource.url` dans le schéma (système d'adaptateurs). `package.json` est volontairement figé sur `^6.19.3`.

> **Après avoir tiré cette mise à jour** : le modèle `VisitorAction` est nouveau — pense à lancer `npx prisma db push` (ou `prisma migrate`) sur ta branche dev avant de relancer le site, sinon le tracking des clics échoue silencieusement (le dashboard reste fonctionnel, juste sans ces données) et l'onglet Analytics affiche des sections vides pour "Clics & actions" et "Visiteurs récurrents".

---

## 💼 Services proposés

> **Toutes ces prestations sont réalisées et livrées directement par AKATech.**

### 01 · Conception de Site Web
Création de sites web modernes, responsive et optimisés pour convertir vos visiteurs en clients. Du portfolio à la plateforme e-commerce, chaque page est conçue avec soin.
**À partir de 150 000 FCFA · 5 à 7 jours**

### 02 · Cartes Interactives & Dashboards
Intégration de cartes interactives Mapbox / Leaflet et de dashboards de visualisation de données. Vos données brutes deviennent des interfaces lisibles et actionnables.
**Sur devis · 7 à 14 jours**

### 03 · Maintenance & Support
Suivi technique, corrections de bugs, mises à jour de sécurité et améliorations continues. Vous vous concentrez sur votre métier, AKATech s'occupe du reste.
**À partir de 20 000 FCFA/mois**

### 04 · Fiche Google My Business
Création ou optimisation de votre fiche Google (NAP, catégories, photos, description SEO local) et suivi mensuel : réponse aux avis, publications et statistiques.
**À partir de 20 000 FCFA · 1 à 2 jours**

### 05 · Intégration IA Chatbot
Un chatbot conversationnel intégré à votre site pour interagir avec vos visiteurs et les guider — le même type d'assistant que celui d'akatech.vercel.app, pensé pour augmenter la productivité de votre business.
**Sur devis · 7 à 14 jours**

### 06 · Intégration de Paiement en Ligne
Intégration de solutions de paiement directement sur votre site — Mobile Money (Orange Money, MTN MoMo, Wave) et carte bancaire selon vos besoins — pour encaisser sans friction.
**Sur devis · 5 à 10 jours**

---

## 🧩 Types de solutions conçues

Familles de projets présentées sur `/services` et l'accueil — une même famille peut couvrir plusieurs paliers de prix (voir Tarifs ci-dessous), et une famille peut ne pas encore avoir de palier dédié.

| # | Solution | Pour qui / pour quoi | Exemples livrés |
|---|---|---|---|
| 01 | 🌐 Sites vitrines & sites métier | Présenter une activité et convertir les visiteurs en clients : entreprise, agence, cabinet, école, pressing, salon, restaurant, portfolio professionnel | MD Laverie Pressing, Chez Florence |
| 02 | 🛒 E-commerce | Vendre des produits en ligne : catalogue, panier, paiement Mobile Money, livraison, gestion des stocks, tableau de bord vendeur | ShopCI, ElvisMarket |
| 03 | 📅 Réservation & rendez-vous | Réserver sans appeler : résidences, hôtels, salons, restaurants, prestations, location de véhicules, salles | New Horizon Service |
| 04 | 🏢 Plateformes & marketplaces | Vraie plateforme multi-utilisateurs : comptes clients/vendeurs, géolocalisation, KYC, paiements répartis, dashboards | Nexura |
| 05 | 🧾 Gestion commerciale & facturation | Digitaliser la gestion quotidienne : devis, factures avec TVA et numérotation automatique, clients, historique des ventes, export PDF | — |
| 06 | ⚙️ Applications web & outils métier | Automatiser un processus propre à l'entreprise : dashboard métier, CRM, gestion de stocks, suivi logistique, portail client, SaaS sur-mesure | MonCashJour, LivreurTrack Pro |
| 07 | 🧮 POS & caisse | Système d'encaissement et de caisse physique | *à venir* |

> Source unique : `WHAT_WE_BUILD` dans `lib/data.js`.

---

## 🤝 Processus de travail

6 étapes, alignées sur le contrat de prestation AKATech Studio (source unique : `PROCESS_STEPS` dans `lib/data.js`) :

### 01 · Brief & découverte
Nous échangeons sur votre projet, vos objectifs et vos besoins. Premier échange gratuit et sans engagement.

### 02 · Devis & contrat
Nous définissons le périmètre, le prix et le délai, puis validons le projet ensemble.

### 03 · Acompte & contenus
Vous versez 50 % d'acompte et transmettez les éléments nécessaires (logo, informations, visuels...). Le délai démarre lorsque l'acompte et les contenus sont reçus.

### 04 · Conception & développement
Nous concevons et développons votre projet conformément au devis.

### 05 · Prévisualisation & validation
Vous recevez un lien de prévisualisation, testez le projet, et nous effectuons les corrections mineures incluses.

### 06 · Livraison & suivi
Après paiement du solde, le projet est mis en ligne et les accès sont transmis. La période de garantie/support commence ensuite.

---

## 💰 Tarifs AKATech

> Prix en FCFA · Marché ivoirien · Devis gratuit sous 24h · Domaine + hébergement offerts la 1ère année sur toutes les formules
>
> Le **portfolio** n'a plus sa propre grille : c'est une déclinaison du Site Vitrine (questionnaire dédié sur `/devis/portfolio`, mais devis piochant dans la même grille de prix).

### 🖥️ Site Vitrine (portfolio inclus)
| Formule | Prix | Délai |
|---|---|---|
| LANDING | 150 000 FCFA | 5 à 7 jours |
| **STARTER** ⭐ | 250 000 FCFA | 7 à 10 jours |
| PREMIUM | 550 000 FCFA | 10 à 14 jours |

### 🛒 E-commerce
| Formule | Prix | Délai |
|---|---|---|
| STARTER | 450 000 FCFA | 1 mois à 1 mois 2 semaines |
| **PRO** ⭐ | 750 000 FCFA | 1 mois à 1 mois 2 semaines |
| ELITE | 1 500 000 FCFA | 1 mois à 1 mois 2 semaines |

### ⚙️ App Web / SaaS
| Formule | Prix | Délai |
|---|---|---|
| MVP / Outil métier | 600 000 – 1 000 000 FCFA | 3 à 5 semaines |
| **Plateforme + abonnement** ⭐ | 1 200 000 – 2 200 000 FCFA | 6 à 10 semaines |
| Marketplace multi-acteurs | 2 500 000 – 4 500 000 FCFA | 10 à 16 semaines |

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
- Un compte [Neon](https://neon.tech) (gratuit) si tu veux le dashboard/historique — facultatif
- Une clé [Gemini](https://aistudio.google.com/app/apikey) et/ou [Groq](https://console.groq.com/keys) (gratuites) pour l'assistant IA

### Installation locale

```bash
git clone https://github.com/wthomasss06-stack/akatech-agencenext.git
cd akatech-agencenext
npm install
# → lance automatiquement `prisma generate` (postinstall)
```

Crée **deux fichiers** d'environnement (oui, deux — voir note Prisma plus haut) :

```bash
# .env.local — lu par Next.js (le site)
RESEND_API_KEY=re_xxxxxxxx
FROM_EMAIL=onboarding@resend.dev
ADMIN_EMAIL=ton-email@example.com
GEMINI_API_KEY=xxxxxxxx
GROQ_API_KEY=xxxxxxxx
DATABASE_URL=postgresql://...   # branche Neon "development"
ADMIN_USER=xxxxxxxx
ADMIN_PASSWORD=xxxxxxxx

# .env — lu par la CLI Prisma uniquement
DATABASE_URL=postgresql://...   # même branche "development" que ci-dessus,
                                 # jamais la branche prod (voir note plus haut)
```

Puis, si tu utilises la base de données :
```bash
npx prisma db push   # crée/synchronise les tables dans la branche dev de Neon
```

```bash
npm run dev
# → http://localhost:3000
```

Sans `DATABASE_URL` ni clés IA, le site tourne quand même — juste sans assistant fonctionnel ni dashboard alimenté.

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

Déployé sur **Vercel**, en rendu **SSR classique** (pas d'export statique) — les routes `/api/contact`, `/api/assistant` etc. sont des fonctions serverless et ont besoin d'un runtime Node, incompatible avec `output: 'export'`.

```bash
npm i -g vercel
vercel --prod
```

Variables d'environnement à configurer sur Vercel (Project Settings → Environment Variables) : `RESEND_API_KEY`, `FROM_EMAIL`, `ADMIN_EMAIL`, `GEMINI_API_KEY`, `GROQ_API_KEY`, `DATABASE_URL`, `ADMIN_USER`, `ADMIN_PASSWORD` — pas de fichier `.env` à gérer côté Vercel, tout passe par son interface.

`DATABASE_URL` doit être scopée différemment par environnement (menu déroulant à côté de chaque variable) : branche Neon **prod** pour "Production", branche **dev** pour "Preview" et "Development" — sinon les preview deployments (ou `vercel dev`) touchent la même base que le site en ligne.

`next.config.js` actuel : `trailingSlash: true`, `images.unoptimized: true`.

---

## ⚙️ Fonctionnalités techniques notables

- **Tunnel 3D WebGL** (`/explorer`) — Three.js + GSAP ScrollTrigger, parcourt les 19 projets, textures = vraies captures d'écran
- **Thème clair/sombre** en transition circulaire via **View Transitions API** (repli instantané si non supporté)
- **Bilingue FR/EN** — sélecteur navbar, persisté en `localStorage`, ~200 clés de traduction (`lib/language.js`)
- **Devis en ligne** (`/devis/[type]`) — questionnaire dynamique, classification tarifaire et argumentaire générés par LLM, PDF envoyé par email, décision (accepter/décliner) trackée — voir section Assistant IA
- **Analytics visiteurs interne** — visiteurs uniques/jour (courbe Recharts), clics d'action trackés (WhatsApp, téléphone, chat, formulaire), parcours détaillé par visiteur récurrent — voir section dédiée plus haut
- **SEO structuré JSON-LD** (`ProfessionalService`) pensé SEO + AEO + GEO — citable par Google AI Overviews et les LLM
- **`public/llms.txt`** — résumé structuré du site (services, tarifs, pages, contact) au format markdown conventionnel, pour que les LLM (ChatGPT, Perplexity, Claude…) décrivent Studio. avec des informations à jour plutôt que des suppositions
- **Footer "Demander à l'IA"** — liens pré-remplis vers ChatGPT, Claude, Perplexity, Gemini, Grok
- **Formulaire de contact** → Resend, avec limite anti-spam basique en mémoire
- **Marquees de confiance** (`TrustStacksMarquee`, `ConversionMarquee`) sur Accueil / À propos / Services
- **Assistant IA** conversationnel, double fournisseur (Gemini → Groq), capture de leads — voir section dédiée plus haut
- **Factures** (`/dashboard`, onglet Factures) — création, historique et export PNG/PDF (html2canvas + jsPDF, générés à la demande depuis les données de la facture, rien n'est stocké en fichier) ; totaux toujours recalculés côté serveur avant écriture en base

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
