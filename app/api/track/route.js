// app/api/track/route.js
import { cookies, headers } from 'next/headers'
import { prisma, upsertVisitor, getOrCreateVisitSession, recordPageView, updateSessionConsent, updateSessionGeo, updateSessionUtm, eraseVisitorLocations, purgeOldVisitorLocations, recordAction, ACTION_TYPES } from '@/lib/db'
import { clientIp, geoFromHeaders, parseUserAgent, classifySource, countryLabel, sanitizeUtm, isBot } from '@/lib/geo'
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
    const { path, referrer, consent, action, utm: rawUtm } = await request.json()
    const utm = sanitizeUtm(rawUtm)
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

    // Provenance balisée (?utm_source=whatsapp…) : les partages WhatsApp n'envoient aucun referrer.
    if (utm) {
      try {
        await updateSessionUtm(session.id, utm)
      } catch (error) {
        // Colonnes absentes tant que `npx prisma db push` n'a pas été lancé : le suivi continue.
        console.warn('[Track] Provenance balisée non enregistrée :', error?.message ?? error)
      }
    }

    // Décision explicite (bannière ou page /cookies) = appel avec un choix et sans page vue.
    // Les pages vues renvoient aussi le choix déjà mémorisé : elles ne déclenchent ni effacement
    // ni alerte, seulement l'enregistrement de la décision.
    const isConsentDecision = hasConsent && !hasPath

    // Localisation approximative et appareil (voir lib/geo.js).
    //  • Toujours (anonyme) : pays, système, navigateur.
    //  • UNIQUEMENT si le visiteur a accepté les cookies analytiques : IP, région, ville.
    //    Le choix est renvoyé par le navigateur à chaque page vue (VisitorTracker) ;
    //    un refus efface aussitôt ce qui aurait déjà été enregistré pour la session.
    const geo = geoFromHeaders(headerList)
    const system = parseUserAgent(userAgent)
    const geoValues = { country: geo.country ?? undefined, os: system.os ?? undefined, browser: system.browser ?? undefined }
    if (consent === 'accepted') {
      Object.assign(geoValues, {
        ip: clientIp(headerList) ?? undefined,
        region: geo.region ?? undefined,
        city: geo.city ?? undefined,
        latitude: geo.latitude ?? undefined,
        longitude: geo.longitude ?? undefined,
      })
    } else if (consent === 'rejected') {
      Object.assign(geoValues, { ip: null, region: null, city: null, latitude: null, longitude: null })
      // Retrait du consentement : on efface aussi ce qui avait été enregistré lors des visites précédentes.
      if (isConsentDecision) {
        try {
          await eraseVisitorLocations(visitor.id)
        } catch (error) {
          console.warn('[Track] Effacement des localisations ignoré :', error?.message ?? error)
        }
      }
    }
    try {
      await updateSessionGeo(session.id, geoValues)
    } catch (error) {
      // Colonnes absentes tant que `npx prisma db push` n'a pas été lancé : le suivi continue.
      console.warn('[Track] Localisation non enregistrée :', error?.message ?? error)
    }

    // Alerte « Nouvelle visite depuis <ville> » : UNIQUEMENT si le visiteur a accepté les cookies.
    // Sans accord, aucune alerte n'est envoyée (la ville n'est d'ailleurs pas enregistrée).
    // Elle part à la première visite d'un navigateur : soit sa toute première requête quand son
    // choix est déjà mémorisé, soit le moment où il accepte (appel de décision, sans page vue).
    // Une seule alerte par IP et par jour (clé HMAC) ; aucune IP n'est incluse dans l'e-mail.
    if (consent === 'accepted' && (isNewVisitor || isConsentDecision) && !isBot(userAgent)) {
      try {
        const firstVisit = isNewVisitor
          || (await prisma.visitSession.count({ where: { visitorId: visitor.id } })) <= 1
        if (firstVisit) {
          const alertPath = hasPath ? path : pathFromReferer(headerList.get('referer')) || '/'
          const arrivedFrom = referrer || session.referrer || null
          let storedUtm = utm?.source ?? null
          if (!storedUtm) {
            // L'appel de décision ne porte pas la balise de l'arrivée : on la relit sur la session.
            try {
              storedUtm = (await prisma.visitSession.findUnique({ where: { id: session.id }, select: { utmSource: true } }))?.utmSource ?? null
            } catch { /* colonne absente : source déduite du referrer */ }
          }
          const place = geo.city || (geo.country ? countryLabel(geo.country) : null)
          await enqueueEmailNotification({
            eventKey: createDailyVisitorAlertKey(visitor.id, clientIpFromHeaders(headerList)),
            eventType: 'NEW_VISITOR',
            summary: place
              ? `Un nouveau visiteur (cookies acceptés) consulte le site AKATech depuis ${place}.`
              : 'Un nouveau visiteur (cookies acceptés) consulte le site AKATech.',
            details: {
              path: safeNotificationPath(alertPath),
              device: getDevice(userAgent),
              referrer: referrerHost(arrivedFrom),
              source: classifySource(arrivedFrom, userAgent, undefined, storedUtm),
              city: geo.city || null,
              country: geo.country ? countryLabel(geo.country) : null,
            },
          })
        }
      } catch (error) {
        console.error('[Track] Alerte de visite non mise en file:', error?.message ?? error)
      }
    }

    // Rétention : efface IP / ville / région des sessions de plus de ANALYTICS_IP_RETENTION_DAYS
    // jours (90 par défaut). Lancé de temps en temps plutôt qu'à chaque appel.
    if (Math.random() < 0.02) {
      try { await purgeOldVisitorLocations() } catch (error) { console.warn('[Track] Purge IP/ville ignorée :', error?.message ?? error) }
    }

    return Response.json({ ok: true, tracked: true })
  } catch (error) {
    // Le tracking ne doit jamais faire échouer la navigation du visiteur.
    console.error('[Track] Erreur:', error?.message ?? error)
    return Response.json({ ok: false }, { status: 200 })
  }
}
