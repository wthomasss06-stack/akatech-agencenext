'use client'
import { useEffect, useMemo, useRef, useState } from 'react'
import 'leaflet/dist/leaflet.css'

/* Carte des villes de mes visiteurs (Leaflet + tuiles OpenStreetMap).

   Données : `points` = [{ city, country, count, lat, lng }] (db.js → getGeoStats().cityPoints).
   Une pastille par ville, plus grosse quand il y a plus de visites. Ces villes n'existent que
   pour les visiteurs ayant accepté les cookies analytiques ; la position est celle du centre
   de la ville du fournisseur d'accès (arrondie à ~1 km), jamais celle d'une personne.

   Leaflet n'est chargé que dans le navigateur (import dynamique) : il lit `window` à l'import.
   Pastilles dessinées en SVG (circleMarker) : pas d'icônes par défaut à déclarer. */

const CI_CENTER = [7.54, -5.55]
const TILES = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'

export default function VisitorsMapCard({ points = [], unlocated = 0, T, CARD }) {
  const hostRef = useRef(null)
  const mapRef = useRef(null)
  const layerRef = useRef(null)
  const leafletRef = useRef(null)
  const fittedFor = useRef('')
  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const mod = await import('leaflet')
        const L = mod.default || mod
        if (cancelled || !hostRef.current || mapRef.current) return
        const map = L.map(hostRef.current, { scrollWheelZoom: false, worldCopyJump: true, minZoom: 2 })
        L.tileLayer(TILES, { maxZoom: 18, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a>' }).addTo(map)
        map.setView(CI_CENTER, 5)
        layerRef.current = L.layerGroup().addTo(map)
        mapRef.current = map
        leafletRef.current = L
        setReady(true)
        setTimeout(() => map.invalidateSize(), 0)
      } catch (error) {
        console.warn('[Carte visiteurs] Leaflet indisponible (npm install leaflet ?)', error)
        if (!cancelled) setFailed(true)
      }
    })()
    return () => {
      cancelled = true
      mapRef.current?.remove()
      mapRef.current = null
      layerRef.current = null
    }
  }, [])

  // Les données sont rafraîchies toutes les 30 s : on redessine les pastilles, mais on ne recadre
  // la carte que si la liste des villes a changé (sinon elle sauterait pendant qu'on la déplace).
  const dataKey = useMemo(() => JSON.stringify(points), [points])
  useEffect(() => {
    const L = leafletRef.current
    const map = mapRef.current
    const layer = layerRef.current
    if (!ready || !L || !map || !layer) return
    layer.clearLayers()
    const max = Math.max(1, ...points.map((p) => p.count))
    const bounds = []
    for (const p of points) {
      // Texte via un nœud DOM : jamais d'HTML construit à partir d'un nom de ville.
      const label = document.createElement('span')
      label.textContent = `${p.city} · ${p.count} visite${p.count > 1 ? 's' : ''}`
      L.circleMarker([p.lat, p.lng], {
        radius: 7 + 15 * Math.sqrt(p.count / max),
        color: '#5aa02c', weight: 2, fillColor: '#88ca53', fillOpacity: 0.55,
      }).bindTooltip(label).addTo(layer)
      bounds.push([p.lat, p.lng])
    }
    const citiesKey = points.map((p) => `${p.city}|${p.lat}|${p.lng}`).join(';')
    if (fittedFor.current === citiesKey) return
    fittedFor.current = citiesKey
    if (bounds.length === 1) map.setView(bounds[0], 7)
    else if (bounds.length > 1) map.fitBounds(bounds, { padding: [40, 40], maxZoom: 8 })
    else map.setView(CI_CENTER, 5)
  }, [dataKey, ready]) // eslint-disable-line react-hooks/exhaustive-deps

  const note = `${points.length} ville${points.length > 1 ? 's' : ''} · position approximative, cookies analytiques acceptés uniquement`
    + (unlocated > 0 ? ` · ${unlocated} visite${unlocated > 1 ? 's' : ''} sans position connue` : '')

  return (
    <div style={{ ...CARD, padding: '1.2rem', gridColumn: '1 / -1', minWidth: 0 }}>
      <div style={{ fontSize: '.78rem', fontWeight: 700, color: T.textSub, marginBottom: 4 }}>Carte des visiteurs</div>
      <div style={{ fontSize: '.68rem', color: T.textMuted, marginBottom: 12 }}>{note}</div>
      <style>{`
        .vm-wrap .leaflet-container { background: ${T.light ? '#e8eef2' : '#1b2420'}; font-family: inherit; }
        .vm-dark .leaflet-tile-pane { filter: invert(1) hue-rotate(180deg) brightness(.92) contrast(.88) saturate(.6); }
      `}</style>
      <div className={`vm-wrap${T.light ? '' : ' vm-dark'}`} style={{ position: 'relative', isolation: 'isolate', height: 340, borderRadius: 12, overflow: 'hidden', border: `1px solid ${T.border}` }}>
        <div ref={hostRef} role="img" aria-label="Carte des villes d’où viennent les visiteurs" style={{ position: 'absolute', inset: 0 }} />
        {(failed || (ready && points.length === 0)) && (
          <div style={{ position: 'absolute', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', textAlign: 'center', pointerEvents: 'none' }}>
            <span style={{ background: T.card, color: T.textSub, border: `1px solid ${T.border}`, borderRadius: 10, padding: '.6rem .9rem', fontSize: '.76rem', maxWidth: 360 }}>
              {failed
                ? 'La carte ne peut pas se charger : installe la dépendance avec `npm install leaflet@1.9.4`.'
                : 'Aucune ville localisée pour l’instant. Elles n’apparaissent qu’après acceptation des cookies analytiques.'}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
