// lib/project-categories.js
// Classement des réalisations selon les 7 rubriques « Ce que nous concevons »
// (WHAT_WE_BUILD dans lib/data.js — c'est la source unique des libellés).
//
// Ici : uniquement le rattachement projet → rubrique et la fabrication des
// slugs d'URL. Aucun import depuis data.js (data.js importe ce fichier : pas
// de dépendance circulaire).
//
// Pour reclasser un projet : changer sa rubrique dans PROJECT_CATEGORY_BY_ID.
// Pour un nouveau projet : ajouter son id ici, sinon il n'a pas de rubrique
// et la page de détail l'affiche sans étiquette de rubrique.

/** Slugs de rubriques — doivent correspondre à `slug` dans WHAT_WE_BUILD. */
export const CATEGORY_SLUGS = {
  VITRINE: 'site-vitrine',
  ECOMMERCE: 'e-commerce',
  RESERVATION: 'reservation',
  PLATEFORME: 'plateforme',
  GESTION: 'gestion',
  APPLICATION: 'application',
  POS: 'pos',
}

const C = CATEGORY_SLUGS

/** id du projet (lib/data.js) → slug de rubrique. */
export const PROJECT_CATEGORY_BY_ID = {
  1: C.ECOMMERCE,      // ShopCI — marketplace e-commerce multi-vendeurs
  2: C.VITRINE,        // TechFlow
  3: C.PLATEFORME,     // TerraSafe — plateforme foncière
  9: C.VITRINE,        // Tati — portfolio / vitrine
  10: C.VITRINE,       // MK Studio — portfolio client
  11: C.ECOMMERCE,     // ManoBeat 777 — vente de beats (commande via WhatsApp)
  12: C.RESERVATION,   // New Horizon Service — location de résidences
  13: C.VITRINE,       // AKATech — site de l'agence
  14: C.VITRINE,       // Université les Anges — site institutionnel
  15: C.PLATEFORME,    // Nexura — marketplace multi-catégories
  16: C.PLATEFORME,    // KokoEat — livraison de repas
  17: C.VITRINE,       // Jean Edy · Portfolio
  18: C.VITRINE,       // MD Laverie Pressing
  19: C.ECOMMERCE,     // Chez Florence — vente & réservation de lapins
  20: C.APPLICATION,   // ChapChap Bara — SaaS préparation d'entretiens
  21: C.APPLICATION,   // Karnet — gestion opérationnelle PME
  22: C.POS,           // ProTech POS — caisse
  23: C.PLATEFORME,    // Anyama Proxy — annuaire d'artisans
  24: C.APPLICATION,   // REKOLLECTE — registre d'accueil par QR code
}

/**
 * Titre → slug d'URL : minuscules, sans accents, tirets.
 * « Jean Edy · Portfolio » → « jean-edy-portfolio ».
 */
export function slugify(text) {
  return String(text || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
