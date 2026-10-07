import { timingSafeEqual } from 'node:crypto'
import { dispatchPendingEmailNotifications } from '@/lib/email-notifications'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Vercel Cron envoie `Authorization: Bearer <CRON_SECRET>` quand la variable
// CRON_SECRET est définie sur le projet. Sans elle, la route reste fermée.
function isAuthorized(request) {
  const secret = process.env.CRON_SECRET
  if (!secret) return false
  const provided = Buffer.from(request.headers.get('authorization') || '')
  const expected = Buffer.from(`Bearer ${secret}`)
  return provided.length === expected.length && timingSafeEqual(provided, expected)
}

export async function GET(request) {
  if (!isAuthorized(request)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const result = await dispatchPendingEmailNotifications()
    return Response.json({ ok: true, ...result })
  } catch (error) {
    console.error('[Email notification cron] Dispatch failed:', error?.message || error)
    return Response.json({ error: 'Notification dispatch failed' }, { status: 500 })
  }
}
