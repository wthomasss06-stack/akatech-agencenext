# AKATech — Site Next.js

Agence de solutions web basée à Abidjan, Côte d'Ivoire.

## Stack
- **Next.js 14** (App Router, Static Export)
- **Framer Motion** — animations & micro-interactions
- **Lucide React** — icônes
- **CSS Variables** — thème dark/light skeumorphique vert/noir

## Pages
| Route | Description |
|-------|-------------|
| `/` | Accueil — Hero, Services, Process, Projets, Témoignages |
| `/about` | À propos — Équipe, Timeline, Valeurs, Stats |
| `/services` | Services — Détail complet, Tech Stack, Process |
| `/projects` | Projets — Galerie filtrée |
| `/pricing` | Tarifs — Onglets, FAQ |
| `/blog` | Blog — Articles, Recherche, Newsletter |
| `/blog/[slug]` | Article individuel |
| `/contact` | Contact — Formulaire WhatsApp, FAQ |

## Installation

```bash
npm install
npm run dev       # Développement sur http://localhost:3000
npm run build     # Build production (export statique dans /out)
npm start         # Preview du build
```

## Déploiement (Vercel)
```bash
# Dans next.config.js, retirer output: 'export' pour Vercel
# Ou utiliser le dossier /out/ pour hébergement statique
vercel --prod
```

## Contact
- WhatsApp: +225 01 42 50 77 50
- Email: wthomasss06@gmail.com
- Portfolio: https://akafolio160502.vercel.app/
