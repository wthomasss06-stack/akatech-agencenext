// app/api/conversations/[id]/route.js
// Protégée par middleware.js (Basic Auth).
import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function GET(request, { params }) {
  try {
    const { id } = await params

    const conversation = await prisma.conversation.findUnique({
      where: { id },
      include: {
        messages: { orderBy: { createdAt: 'asc' } },
        lead: true,
      },
    })

    if (!conversation) {
      return NextResponse.json({ error: 'Conversation non trouvée' }, { status: 404 })
    }

    return NextResponse.json({ conversation })
  } catch (error) {
    console.error('[API Conversation Detail] Erreur:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// DELETE /api/conversations/:id — Supprimer une conversation entière.
// Le Lead associé (s'il existe) n'a pas de cascade déclarée sur cette
// relation dans le schéma → on le supprime explicitement en premier,
// sinon la contrainte de clé étrangère ferait échouer la suppression
// de la conversation. Les messages, eux, cascadent déjà (schema.prisma).
export async function DELETE(request, { params }) {
  try {
    const { id } = await params

    const existing = await prisma.conversation.findUnique({ where: { id }, select: { id: true } })
    if (!existing) {
      return NextResponse.json({ ok: true, deleted: 0 })
    }

    await prisma.lead.deleteMany({ where: { conversationId: id } })
    await prisma.conversation.delete({ where: { id } })

    return NextResponse.json({ ok: true, deleted: 1 })
  } catch (error) {
    if (error.code === 'P2025') {
      return NextResponse.json({ ok: true, deleted: 0 })
    }
    console.error('[API Conversation DELETE] Erreur:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
