// app/api/track/route.js
import { cookies, headers } from 'next/headers'
import { upsertVisitor, getOrCreateVisitSession, recordPageView, updateSessionConsent, recordAction, ACTION_TYPES } from '@/lib/db'
import { createDailyVisitorAlertKey, enqueueEmailNotification } from '@/lib/email-notifications'

export const runtime = 'nodejs'

function getDevice(userAgent = '') {
  if (/tablet|ipad/i.test(userAgent)) return 'tablet'
  if (/mobile|android|iphone/i.test(userAgent)) return 'mobile'
  return 'desktop'
}

// Dérive la page/section concernée par un clic depuis l'en-tête Referer —
// jamais depuis une valeur transmise par le client. On ne garde que le
// chemin, jamais les paramètres de requête ni le fragment.
function pathFromReferer(referer) {
  if (!referer) return null
  try {
    return new URL(referer).pathname.slice(0, 500)
  } catch {
    return null
  }
}

function safeNotificationPath(path) {
  try {
    return new URL(path, 'https://akatech.local').pathname.slice(0, 200) || '/'
  } catch {
    return '/'
  }
}

function referrerHost(referrer) {
  if (!referrer) return null
  try {
    return new URL(referrer).hostname.slice(0, 120)
  } catch {
    return null
  }
}

function clientIpFromHeaders(headerList) {
  const forwardedFor = headerList.get('x-forwarded-for')
  return forwardedFor?.split(',')[0]?.trim() || headerList.get('x-real-ip') || 'unknown'
}

export async function POST(request) {
  try {
    const { path, referrer, consent, action } = await request.json()
    const hasPath = typeof path === 'string' && path.length > 0 && path.length <= 500
    const hasConsent = consent === 'accepted' || consent === 'rejected'
    const hasAction = typeof action === 'string' && ACTION_TYPES.has(action)

    // Un appel doit porter une page vue, une décision de consentement, OU
    // un clic d'action (la bannière cookies peut être tranchée sans
    // navigation entre-temps, un clic ne change pas toujours de page).
    if (!hasPath && !hasConsent && !hasAction) {
      return Response.json({ ok: false }, { status: 400 })
    }

    const cookieStore = await cookies()
    const visitorId = cookieStore.get('akatech_visitor')?.value
    const sessionId = cookieStore.get('akatech_session')?.value

    // Sans cookies (bloqués par le navigateur, ou requête hors navigation
    // normale), on ignore silencieusement plutôt que de renvoyer une erreur :
    // le tracking est un bonus, pas une fonctionnalité critique du site.
    if (!visitorId || !sessionId) {
      return Response.json({ ok: true, tracked: false })
    }

    const headerList = await headers()
    const userAgent = headerList.get('user-agent') || ''

    const { visitor, isNewVisitor } = await upsertVisitor(visitorId)
    const session = await getOrCreateVisitSession(sessionId, visitor.id, {
      device: getDevice(userAgent),
      referrer: referrer || null,
      userAgent,
    })

    if (hasPath) await recordPageView(session.id, path)
    if (hasConsent) await updateSessionConsent(session.id, consent)
    if (hasAction) await recordAction(session.id, action, pathFromReferer(headerList.get('referer')))

    const alertPath = hasPath ? path : pathFromReferer(headerList.get('referer')) || '/'
    if (isNewVisitor && !/bot|crawler|spider|headless|preview|monitor/i.test(userAgent)) {
      try {
        await enqueueEmailNotification({
          eventKey: createDailyVisitorAlertKey(visitor.id, clientIpFromHeaders(headerList)),
          eventType: 'NEW_VISITOR',
          summary: 'Un nouveau navigateur consulte le site AKATech.',
          details: {
            path: safeNotificationPath(alertPath),
            device: getDevice(userAgent),
            referrer: referrerHost(referrer),
          },
        })
      } catch (error) {
        console.error('[Track] Alerte de visite non mise en file:', error?.message ?? error)
      }
    }

    return Response.json({ ok: true, tracked: true })
  } catch (error) {
    // Le tracking ne doit jamais faire échouer la navigation du visiteur.
    console.error('[Track] Erreur:', error?.message ?? error)
    return Response.json({ ok: false }, { status: 200 })
  }
}
