// middleware.js
import { NextResponse } from 'next/server'

/* ── Auth du dashboard ──
   HTTP Basic Auth plutôt qu'un système de login complet (NextAuth,
   Clerk...) : c'est un usage mono-admin (juste toi), pas une appli
   multi-utilisateurs. Basic Auth protège efficacement contre l'accès
   public sans ajouter de dépendance, de table "users" ni de page de
   login à construire. Identifiants dans ADMIN_USER / ADMIN_PASSWORD. */
const PROTECTED_PREFIXES = ['/dashboard', '/api/leads', '/api/conversations', '/api/stats']

function isProtected(pathname) {
  return PROTECTED_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + '/'))
}

function checkBasicAuth(request) {
  const header = request.headers.get('authorization')
  if (!header?.startsWith('Basic ')) return false

  const decoded = atob(header.slice(6))
  const sepIndex = decoded.indexOf(':')
  const user = decoded.slice(0, sepIndex)
  const pass = decoded.slice(sepIndex + 1)

  return user === process.env.ADMIN_USER && pass === process.env.ADMIN_PASSWORD
}

/* ── Cookies de tracking visiteurs ──
   Posés ici (Edge, rapide) plutôt que dans une route API : pas
   d'aller-retour réseau supplémentaire, et ça fonctionne même si le
   JS client met du temps à charger. L'écriture en base (Visitor /
   VisitSession / PageView, via Prisma) se fait séparément dans
   /api/track, car Prisma ne tourne pas en runtime Edge. */
function getDevice(userAgent = '') {
  if (/tablet|ipad/i.test(userAgent)) return 'tablet'
  if (/mobile|android|iphone/i.test(userAgent)) return 'mobile'
  return 'desktop'
}

export function middleware(request) {
  const { pathname } = request.nextUrl

  if (isProtected(pathname)) {
    if (!checkBasicAuth(request)) {
      return new NextResponse('Authentification requise', {
        status: 401,
        headers: { 'WWW-Authenticate': 'Basic realm="AKATech Admin"' },
      })
    }
    return NextResponse.next()
  }

  // Pas de cookies de tracking sur les assets statiques ou les appels API.
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    /\.(?:svg|png|jpg|jpeg|webp|gif|ico|css|js|woff2?|ttf|map)$/.test(pathname)
  ) {
    return NextResponse.next()
  }

  const response = NextResponse.next()
  const hasVisitor = request.cookies.get('akatech_visitor')
  const hasSession = request.cookies.get('akatech_session')

  if (!hasVisitor) {
    response.cookies.set('akatech_visitor', crypto.randomUUID(), {
      maxAge: 60 * 60 * 24 * 365, // 1 an
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    })
  }

  if (!hasSession) {
    response.cookies.set('akatech_session', crypto.randomUUID(), {
      maxAge: 60 * 30, // 30 min glissantes
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    })
    response.cookies.set('akatech_session_new', '1', {
      maxAge: 60 * 30,
      httpOnly: false, // lisible côté client pour transmettre device/referrer à /api/track
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    })
  } else {
    // Session existante : on la prolonge de 30 min à chaque page vue.
    response.cookies.set('akatech_session', hasSession.value, {
      maxAge: 60 * 30,
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    })
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
