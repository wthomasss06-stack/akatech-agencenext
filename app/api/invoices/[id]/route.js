// app/api/invoices/[id]/route.js
// Protégée par middleware.js (Basic Auth).
import { NextResponse } from 'next/server'
import { getInvoiceById, updateInvoice, deleteInvoice } from '@/lib/db'

export const runtime = 'nodejs'

export async function GET(request, { params }) {
  try {
    const { id } = await params
    const invoice = await getInvoiceById(id)
    if (!invoice) {
      return NextResponse.json({ error: 'Facture introuvable' }, { status: 404 })
    }
    return NextResponse.json({ invoice })
  } catch (error) {
    console.error('[API Invoice Detail] Erreur:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// PATCH /api/invoices/:id — mise à jour complète (formulaire) ou
// partielle (ex: { status: 'PAYEE' } depuis la liste). Voir
// lib/db.js:updateInvoice pour la logique de fusion.
export async function PATCH(request, { params }) {
  try {
    const { id } = await params
    const data = await request.json()
    const invoice = await updateInvoice(id, data)
    return NextResponse.json({ invoice })
  } catch (error) {
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Facture introuvable' }, { status: 404 })
    }
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Ce numéro de facture existe déjà' }, { status: 409 })
    }
    console.error('[API Invoice PATCH] Erreur:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params
    await deleteInvoice(id)
    return NextResponse.json({ ok: true })
  } catch (error) {
    // P2025 = déjà supprimée (double-clic) — pas une vraie erreur serveur.
    if (error.code === 'P2025') {
      return NextResponse.json({ ok: true, deleted: 0 })
    }
    console.error('[API Invoice DELETE] Erreur:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
