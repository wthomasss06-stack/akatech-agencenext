import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

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
