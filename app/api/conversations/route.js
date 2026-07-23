// app/api/conversations/route.js
// Protégée par middleware.js (Basic Auth).
import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const minScore = searchParams.get('minScore')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = (page - 1) * limit

    const where = {}
    if (status) where.status = status
    if (minScore) where.leadScore = { gte: parseInt(minScore) }
    if (search) {
      where.OR = [
        { sessionId: { contains: search, mode: 'insensitive' } },
        { messages: { some: { content: { contains: search, mode: 'insensitive' } } } },
      ]
    }

    const [conversations, total] = await Promise.all([
      prisma.conversation.findMany({
        where,
        include: {
          messages: { orderBy: { createdAt: 'asc' }, take: 1 },
          lead: true,
          _count: { select: { messages: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.conversation.count({ where }),
    ])

    return NextResponse.json({
      conversations,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    })
  } catch (error) {
    console.error('[API Conversations] Erreur:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// DELETE /api/conversations — Supprimer une ou plusieurs conversations
// ?id=xxx pour une seule, ou body { ids: [...] } pour plusieurs (le
// dashboard utilise toujours la forme { ids } même pour une suppression
// unique, afin de ne garder qu'un seul chemin de code côté frontend).
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (id) {
      // Supprimer une conversation spécifique (avec ses messages et lead en cascade)
      await prisma.conversation.delete({ where: { id } })
      return NextResponse.json({ ok: true, deleted: 1 })
    }

    const body = await request.json().catch(() => ({}))
    const ids = body.ids

    if (Array.isArray(ids) && ids.length > 0) {
      const result = await prisma.conversation.deleteMany({
        where: { id: { in: ids } },
      })
      return NextResponse.json({ ok: true, deleted: result.count })
    }

    return NextResponse.json({ error: 'ID ou liste d\'IDs requis' }, { status: 400 })
  } catch (error) {
    // P2025 = déjà supprimée (double-clic, ou auto-refresh 30s qui se
    // chevauche avec la suppression) — pas une vraie erreur serveur.
    if (error.code === 'P2025') {
      return NextResponse.json({ ok: true, deleted: 0 })
    }
    console.error('[API Conversations DELETE] Erreur:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
