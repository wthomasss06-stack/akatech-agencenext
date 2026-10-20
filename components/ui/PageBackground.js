// components/ui/PageBackground.js
// Fond des pages secondaires (légales, admin) = fond des sections de la
// landing PC : fond uni de la page + texture .grid-bg (globals.css, opacité
// 0.2 comme sur l'accueil) + deux halos verts très discrets (0.04–0.05).
//
// Utilisation : à placer en PREMIER enfant d'un conteneur `position: relative`
// qui crée son propre contexte d'empilement (`isolation: isolate`, ou un
// z-index). La couche est en z-index -1 : elle passe derrière le contenu
// sans qu'il faille toucher à son z-index, et au-dessus de la couleur de
// fond du conteneur.
//   <PageBackground />        → suit la hauteur du conteneur (page qui défile)
//   <PageBackground fixed />  → reste calée sur l'écran (conteneur fixe qui défile en interne)
//
// Même recette que `.pd-bg` dans app/projects/[slug]/ProjectDetail.css.
export default function PageBackground({ fixed = false }) {
  return (
    <div
      aria-hidden="true"
      style={{ position: fixed ? 'fixed' : 'absolute', inset: 0, zIndex: -1, pointerEvents: 'none', overflow: 'hidden' }}
    >
      <div className="grid-bg" style={{ position: 'absolute', inset: 0, opacity: 0.2 }} />
      <div
        style={{
          position: 'absolute', inset: 0,
          background:
            'radial-gradient(800px 520px at 76% 13%, rgba(136,202,83,.05), transparent 65%), ' +
            'radial-gradient(800px 520px at 18% 60%, rgba(136,202,83,.04), transparent 65%)',
        }}
      />
    </div>
  )
}
