import { dispatchPendingEmailNotifications } from '@/lib/email-notifications'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request) {
  const cronSecret = process.env.CRON_SECRET
  const authorization = request.headers.get('authorization')
  if (!cronSecret || authorization !== `Bearer ${cronSecret}`) {
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
