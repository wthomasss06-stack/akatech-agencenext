import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const VALID_STATUSES = ['STARTED', 'SUBMITTED', 'QUOTED', 'ACCEPTED', 'DECLINED']

export async function GET(request) {
  try {
    const { searchParams } = request.nextUrl
    const status = searchParams.get('status')
    const search = searchParams.get('search')?.trim()
    const page = Math.max(1, Number(searchParams.get('page') || '1'))
    const limit = Math.min(50, Math.max(1, Number(searchParams.get('limit') || '20')))

    const where = {}
    if (status) where.status = status
    if (search) {
      where.OR = [
        { token: { contains: search, mode: 'insensitive' } },
        { contactName: { contains: search, mode: 'insensitive' } },
        { contactHandle: { contains: search, mode: 'insensitive' } },
      ]
    }

    const [rows, total] = await Promise.all([
      prisma.questionnaire.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: { quote: true },
      }),
      prisma.questionnaire.count({ where }),
    ])

    return NextResponse.json({
      prospects: rows.map((row) => ({
        id: row.id,
        token: row.token,
        type: row.type,
        status: row.status,
        contactName: row.contactName,
        contactHandle: row.contactHandle,
        answers: row.answers || {},
        createdAt: row.createdAt,
        submittedAt: row.submittedAt,
        decidedAt: row.decidedAt,
        quote: row.quote ? {
          id: row.quote.id,
          category: row.quote.category,
          tier: row.quote.tier,
          priceMinFCFA: row.quote.priceMinFCFA,
          priceMaxFCFA: row.quote.priceMaxFCFA,
          rationale: row.quote.rationale,
          positioningPitch: row.quote.positioningPitch,
        } : null,
      })),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('[API Prospects] Erreur:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function PATCH(request) {
  try {
    const { id, status } = await request.json()
    if (!id || !VALID_STATUSES.includes(status)) {
      return NextResponse.json({ error: 'ID et statut valide requis' }, { status: 400 })
    }

    const prospect = await prisma.questionnaire.update({
      where: { id },
      data: { status, ...(status === 'ACCEPTED' || status === 'DECLINED' ? { decidedAt: new Date() } : {}) },
      include: { quote: true },
    })
    return NextResponse.json({ prospect })
  } catch (error) {
    if (error.code === 'P2025') return NextResponse.json({ error: 'Prospect introuvable' }, { status: 404 })
    console.error('[API Prospects PATCH] Erreur:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function DELETE(request) {
  try {
    const id = new URL(request.url).searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'ID requis' }, { status: 400 })
    await prisma.questionnaire.delete({ where: { id } })
    return NextResponse.json({ ok: true, deleted: 1 })
  } catch (error) {
    if (error.code === 'P2025') return NextResponse.json({ ok: true, deleted: 0 })
    console.error('[API Prospects DELETE] Erreur:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
