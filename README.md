# AKATech — Agence Web & Solutions Digitales

> Site vitrine de l'agence **AKATech**, spécialisée dans la conception de solutions web sur-mesure pour les entreprises et startups en Côte d'Ivoire et en Afrique de l'Ouest.

🌐 **Live** → [akatech-agencenext.vercel.app](https://akatech-agencenext.vercel.app)

---

## ✨ Aperçu

AKATech est une agence digitale basée à **Abidjan, Côte d'Ivoire**, proposant des services allant de la création de sites web à la mise en place de plateformes SaaS complètes. Ce site vitrine présente nos services, nos projets réalisés, notre processus de travail et nos formules tarifaires.

---

## 🛠️ Stack Technique

| Technologie | Rôle |
|---|---|
| **Next.js 14** (App Router) | Framework frontend, routing, export statique |
| **React 18** | UI & composants |
| **Framer Motion** | Animations & micro-interactions |
| **Lucide React** | Système d'icônes |
| **CSS Variables** | Thème dark/light skeumorphique (vert / noir) |
| **JavaScript (ES6+)** | Logique applicative |

---

## 📁 Structure du projet

```
akatech-agencenext/
├── app/
│   ├── page.js                      # Accueil
│   ├── globals.css                  # Styles globaux + responsive
│   ├── layout.js                    # Layout racine (Navbar, Footer, PWA)
│   ├── about/
│   │   └── AboutClient.js           # Équipe, Timeline, Valeurs, Stats
│   ├── services/
│   │   └── ServicesClient.js        # Services, Tech Stack, Process
│   ├── projects/
│   │   └── ProjectsClient.js        # Galerie filtrée par catégorie
│   ├── pricing/
│   │   └── PricingClient.js         # Onglets formules, Comparatif, FAQ
│   ├── blog/
│   │   ├── BlogClient.js            # Liste articles, Recherche, Newsletter
│   │   └── [slug]/
│   │       └── BlogArticleClient.js # Article individuel
│   └── contact/
│       └── ContactClient.js         # Formulaire WhatsApp, Canaux, FAQ
├── components/
│   ├── layout/
│   │   ├── Navbar.js
│   │   └── Footer.js
│   └── ui/
│       ├── index.js                 # SectionEye, AnimatedCounter, LazyImg, MarqueeStrip…
│       ├── AuroraHero.js            # Background animé pour les héros
│       ├── OrbHero.js
│       └── Loader.js
├── lib/
│   ├── data.js                      # Données statiques (projets, services, blog…)
│   └── theme.js                     # Hook useTheme (dark/light)
├── public/
│   ├── images/                      # Photos about, clients
│   ├── favicon.svg
│   ├── manifest.json
│   └── sw.js                        # Service Worker (PWA)
├── next.config.js
├── jsconfig.json
└── package.json
```

---

## 📄 Pages

| Route | Description |
|---|---|
| `/` | Accueil — Hero, Services, Process, Projets, Témoignages |
| `/about` | À propos — Équipe, Timeline, Valeurs, Stats |
| `/services` | Services — Détail complet, Tech Stack, Process |
| `/projects` | Projets — Galerie filtrée par catégorie |
| `/pricing` | Tarifs — Onglets par formule, Comparatif, FAQ |
| `/blog` | Blog — Articles, Recherche, Newsletter |
| `/blog/[slug]` | Article individuel |
| `/contact` | Contact — Formulaire WhatsApp, Canaux, FAQ |

---

## 🚀 Installation & Démarrage

```bash
# Cloner le dépôt
git clone https://github.com/wthomasss06-stack/akatech-agencenext.git
cd akatech-agencenext

# Installer les dépendances
npm install

# Lancer en développement
npm run dev
# → http://localhost:3000

# Build production
npm run build

# Preview du build
npm start
```

---

## ☁️ Déploiement

### Vercel (recommandé)

```bash
vercel --prod
```

> ⚠️ Pour un déploiement Vercel, retirer `output: 'export'` dans `next.config.js` si présent.

### Hébergement statique

Le build génère un dossier `/out/` utilisable sur tout hébergeur statique (Netlify, GitHub Pages, cPanel…).

```bash
npm run build
# Uploader le contenu de /out/
```

---

## 🎨 Thème & Design

- **Palette** : Vert néon `#22c864` sur fond noir profond `#060e09`
- **Style** : Dark luxury, skeumorphique, animations fluides
- **Typographie** : Syne (titres), Inter / System UI (corps)
- **Motion** : Framer Motion — entrées au scroll, transitions de pages, micro-interactions
- **AuroraHero** : Background animé sur tous les héros de pages

---

## 📐 Responsive & UX

- **Mobile-first** — breakpoints à 640px et 768px
- **Héros uniformes** — tous les héros de pages partagent `padding: 9rem 5% 6rem` avec `min-height: 420px` sur desktop
- **Floating pills** — les badges/pills flottants sur les cartes sont masqués sur mobile via `.no-pill-mobile` pour un rendu épuré
- **PWA** — Service Worker + Manifest pour installation sur mobile

---

## 📞 Contact

| Canal | Info |
|---|---|
| 📱 WhatsApp | [+225 01 42 50 77 50](https://wa.me/2250142507750) |
| 📧 Email | [wthomasss06@gmail.com](mailto:wthomasss06@gmail.com) |
| 🌍 Portfolio | [akafolio160502.vercel.app](https://akafolio160502.vercel.app) |
| 📍 Localisation | Abidjan, Côte d'Ivoire |

---

## 👨‍💻 Auteur

Développé par **MBOLLO AKA NOE ELVIS** — Développeur Full-Stack (React / Next.js / Flask / Django)

---

*© 2026 AKATech. Tous droits réservés.*
