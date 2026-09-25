// lib/track-action.js
// Envoie un événement d'action (clic bouton) à /api/track — même
// mécanisme que VisitorTracker (page_view) : best-effort, jamais
// bloquant, aucune donnée personnelle transmise. Le serveur déduit la
// page/section depuis l'en-tête Referer (chemin seul, sans paramètres
// d'URL) — inutile de le transmettre ici. `type` doit faire partie de
// ACTION_TYPES (lib/db.js) ou l'événement est ignoré côté serveur.
export function trackAction(type) {
  if (typeof window === 'undefined') return
  try {
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: type }),
      keepalive: true,
    }).catch(() => {})
  } catch {
    // Le tracking est un bonus — un échec ne doit jamais remonter au visiteur.
  }
}
