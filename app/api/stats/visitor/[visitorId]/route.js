// app/api/stats/visitor/[visitorId]/route.js
// Protégée par middleware.js (préfixe /api/stats). Parcours détaillé
// d'un visiteur (shortId ou id interne) — appelée à la demande depuis
// le dashboard (onglet Analytics, liste des visiteurs récurrents),
// jamais chargée en masse dans /api/stats.
import { getVisitorJourney } from '@/lib/db'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function GET(request, { params }) {
  try {
    const { visitorId } = await params
    if (!visitorId || typeof visitorId !== 'string') {
      return NextResponse.json({ error: 'Identifiant manquant' }, { status: 400 })
    }

    const journey = await getVisitorJourney(visitorId)
    if (!journey) {
      return NextResponse.json({ error: 'Visiteur introuvable' }, { status: 404 })
    }

    return NextResponse.json(journey)
  } catch (error) {
    console.error('[API Stats Visitor] Erreur:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
