// app/api/track/route.js
import { cookies, headers } from 'next/headers'
import { upsertVisitor, getOrCreateVisitSession, recordPageView } from '@/lib/db'

export const runtime = 'nodejs'

function getDevice(userAgent = '') {
  if (/tablet|ipad/i.test(userAgent)) return 'tablet'
  if (/mobile|android|iphone/i.test(userAgent)) return 'mobile'
  return 'desktop'
}

export async function POST(request) {
  try {
    const { path, referrer } = await request.json()
    if (!path || typeof path !== 'string' || path.length > 500) {
      return Response.json({ ok: false }, { status: 400 })
    }

    const cookieStore = await cookies()
    const visitorId = cookieStore.get('akatech_visitor')?.value
    const sessionId = cookieStore.get('akatech_session')?.value
    const isNewSession = !!cookieStore.get('akatech_session_new')?.value

    // Sans cookies (bloqués par le navigateur, ou requête hors navigation
    // normale), on ignore silencieusement plutôt que de renvoyer une erreur :
    // le tracking est un bonus, pas une fonctionnalité critique du site.
    if (!visitorId || !sessionId) {
      return Response.json({ ok: true, tracked: false })
    }

    const headerList = await headers()
    const userAgent = headerList.get('user-agent') || ''

    const visitor = await upsertVisitor(visitorId)
    const session = await getOrCreateVisitSession(sessionId, visitor.id, {
      device: isNewSession ? getDevice(userAgent) : undefined,
      referrer: isNewSession ? (referrer || null) : undefined,
      userAgent: isNewSession ? userAgent : undefined,
    })
    await recordPageView(session.id, path)

    return Response.json({ ok: true, tracked: true })
  } catch (error) {
    // Le tracking ne doit jamais faire échouer la navigation du visiteur.
    console.error('[Track] Erreur:', error?.message ?? error)
    return Response.json({ ok: false }, { status: 200 })
  }
}
