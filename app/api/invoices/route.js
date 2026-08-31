// app/api/invoices/route.js
// Protégée par middleware.js (Basic Auth) — pas de vérification d'auth
// ici, elle est déjà passée avant d'arriver à ce handler (voir
// app/api/leads/route.js pour le même principe).
import { NextResponse } from 'next/server'
import { listInvoices, createInvoice, getNextInvoiceNumber } from '@/lib/db'

export const runtime = 'nodejs'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)

    // ?next=1 renvoie juste le prochain numéro suggéré (pour préremplir
    // le formulaire "Nouvelle facture"), sans toucher à la base.
    if (searchParams.get('next')) {
      const number = await getNextInvoiceNumber()
      return NextResponse.json({ number })
    }

    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '15')
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || ''

    const result = await listInvoices({ page, limit, search, status })
    return NextResponse.json(result)
  } catch (error) {
    console.error('[API Invoices] Erreur:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const data = await request.json()

    if (!data.clientName || !Array.isArray(data.lines) || data.lines.length === 0) {
      return NextResponse.json({ error: 'Le nom du client et au moins une ligne de prestation sont requis' }, { status: 400 })
    }
    if (!data.issueDate) {
      return NextResponse.json({ error: "La date d'émission est requise" }, { status: 400 })
    }

    const invoice = await createInvoice(data)
    return NextResponse.json({ invoice }, { status: 201 })
  } catch (error) {
    // Numéro de facture en doublon (contrainte @unique sur `number`).
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Ce numéro de facture existe déjà' }, { status: 409 })
    }
    console.error('[API Invoices POST] Erreur:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
