// app/api/leads/route.js
// Protégée par middleware.js (Basic Auth) — pas de vérification d'auth
// ici, elle est déjà passée avant d'arriver à ce handler.
import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

const VALID_STATUSES = ['NEW', 'QUALIFIED', 'CONTACTED', 'CONVERTED', 'LOST']

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
    if (minScore) where.score = { gte: parseInt(minScore) }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { contact: { contains: search, mode: 'insensitive' } },
        { summary: { contains: search, mode: 'insensitive' } },
      ]
    }

    const [leads, total] = await Promise.all([
      prisma.lead.findMany({
        where,
        include: {
          conversation: {
            select: { id: true, sessionId: true, createdAt: true, messageCount: true },
          },
        },
        orderBy: { score: 'desc' },
        skip,
        take: limit,
      }),
      prisma.lead.count({ where }),
    ])

    return NextResponse.json({
      leads,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    })
  } catch (error) {
    console.error('[API Leads] Erreur:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// PATCH /api/leads — Mettre à jour le statut d'un lead
export async function PATCH(request) {
  try {
    const { id, status, notes } = await request.json()

    if (!id || !status) {
      return NextResponse.json({ error: 'ID et status requis' }, { status: 400 })
    }
    if (!VALID_STATUSES.includes(status)) {
      return NextResponse.json({ error: `Statut invalide. Valeurs acceptées : ${VALID_STATUSES.join(', ')}` }, { status: 400 })
    }

    const lead = await prisma.lead.update({
      where: { id },
      data: { status, ...(notes !== undefined ? { notes } : {}) },
    })

    return NextResponse.json({ lead })
  } catch (error) {
    console.error('[API Leads PATCH] Erreur:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
