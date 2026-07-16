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
        report: true,
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
