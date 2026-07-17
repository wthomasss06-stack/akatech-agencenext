// app/api/stats/route.js
// Protégée par middleware.js (Basic Auth).
import { prisma, getConversationActivity, getVisitorStats, getTodayAiUsage } from '@/lib/db'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function GET() {
  try {
    const now = new Date()
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay())
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    const [
      totalConversations, activeConversations, convertedConversations,
      todayConversations, weekConversations, monthConversations,
      totalLeads, qualifiedLeads, contactedLeads, convertedLeads,
      avgLeadScore, totalMessages, avgMessagesPerConversation,
      leadsByProjectType, activity, visitorStats, aiUsage,
    ] = await Promise.all([
      prisma.conversation.count(),
      prisma.conversation.count({ where: { status: 'ACTIVE' } }),
      prisma.conversation.count({ where: { status: 'CONVERTED' } }),
      prisma.conversation.count({ where: { createdAt: { gte: startOfDay } } }),
      prisma.conversation.count({ where: { createdAt: { gte: startOfWeek } } }),
      prisma.conversation.count({ where: { createdAt: { gte: startOfMonth } } }),
      prisma.lead.count(),
      prisma.lead.count({ where: { status: 'QUALIFIED' } }),
      prisma.lead.count({ where: { status: 'CONTACTED' } }),
      prisma.lead.count({ where: { status: 'CONVERTED' } }),
      prisma.lead.aggregate({ _avg: { score: true } }).then(r => r._avg.score || 0),
      prisma.message.count(),
      prisma.conversation.aggregate({ _avg: { messageCount: true } }).then(r => r._avg.messageCount || 0),
      prisma.lead.groupBy({ by: ['projectType'], _count: { id: true }, orderBy: { _count: { id: 'desc' } } }),
      getConversationActivity(30),
      getVisitorStats(30),
      getTodayAiUsage(),
    ])

    return NextResponse.json({
      conversations: {
        total: totalConversations,
        active: activeConversations,
        converted: convertedConversations,
        today: todayConversations,
        thisWeek: weekConversations,
        thisMonth: monthConversations,
        avgMessages: Math.round(avgMessagesPerConversation * 10) / 10,
      },
      leads: {
        total: totalLeads,
        qualified: qualifiedLeads,
        contacted: contactedLeads,
        converted: convertedLeads,
        avgScore: Math.round(avgLeadScore),
      },
      conversion: {
        rate: totalConversations > 0 ? Math.round((convertedConversations / totalConversations) * 1000) / 10 : 0,
      },
      byProjectType: leadsByProjectType.map(p => ({ type: p.projectType || 'Non précisé', count: p._count.id })),
      activity,
      visitors: visitorStats,
      aiUsage,
    })
  } catch (error) {
    console.error('[API Stats] Erreur:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
