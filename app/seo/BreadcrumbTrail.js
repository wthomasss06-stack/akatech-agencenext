'use client'

// Fil d'Ariane visuel désactivé sur tout le site : cassait les héros
// plein écran (constaté sur /projects, étendu partout à la demande).
// Le schema BreadcrumbList (SEO) n'est pas concerné — il est généré
// par page dans app/seo/StructuredData.js, indépendamment de ce
// composant. Le rendu d'origine (fil d'Ariane texte + liens) reste
// dans l'historique Git si besoin de le réactiver un jour.
export default function BreadcrumbTrail() {
  return null
}
