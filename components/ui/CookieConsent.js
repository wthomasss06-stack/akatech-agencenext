'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Cookie } from 'lucide-react'
import { useTheme } from '@/lib/theme'
import { HoverSlideText } from '@/components/ui/index'

const STORAGE_KEY = 'akatech_cookie_consent'

// Signale le choix à /api/track (même endpoint que VisitorTracker) : le
// serveur lit les cookies akatech_visitor / akatech_session déjà posés par
// middleware.js pour rattacher la décision à la session en cours — pas
// besoin de transmettre un identifiant ici. Best-effort, comme le reste
// du tracking : un échec réseau ne doit jamais bloquer le visiteur.
function sendConsent(consent) {
  fetch('/api/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ consent }),
    keepalive: true,
  }).catch(() => {})
}

/* Bannière de consentement cookies. Que le choix soit "accepter" ou
   "refuser", la mesure d'audience anonyme déjà posée par middleware.js
   continue de tourner (c'est elle qui marque la présence sur le
   dashboard) — seule la case "cookies analytiques" ci-dessous influe
   sur ce que le visiteur autorise en plus. Le choix est enregistré
   côté session pour que le dashboard affiche la vraie répartition
   accepté / refusé. */
export default function CookieConsent() {
  const T = useTheme()
  const [visible, setVisible] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [analyticsOn, setAnalyticsOn] = useState(true)

  useEffect(() => {
    let stored = null
    try { stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null') } catch {}
    if (stored?.status) return // déjà décidé lors d'une visite précédente

    const timer = setTimeout(() => setVisible(true), 900)
    return () => clearTimeout(timer)
  }, [])

  const decide = (status, analytics) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ status, analytics, ts: Date.now() }))
    } catch {}
    sendConsent(status)
    setVisible(false)
  }

  const cardBg = T.light ? '#111111' : T.card
  const cardText = '#f2f2f2'
  const cardSub = 'rgba(255,255,255,.6)'

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="dialog"
          aria-modal="false"
          aria-label="Préférences de cookies"
          initial={{ opacity: 0, y: 24, scale: .97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: .97, transition: { duration: .25 } }}
          transition={{ duration: .5, ease: [.22, 1, .36, 1] }}
          style={{
            position: 'fixed', zIndex: 8500,
            background: cardBg,
            padding: '1.6rem 1.6rem 1.4rem',
          }}
          className="cookie-consent-card"
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '.7rem', marginBottom: '.7rem' }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(136,202,83,.14)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Cookie size={18} color="#88ca53" />
            </div>
            <h2 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontStyle: 'italic', fontSize: '1.15rem', color: cardText, letterSpacing: '-.01em', paddingTop: '.2rem' }}>
              On peut parler cookies deux secondes ?
            </h2>
          </div>

          {!expanded ? (
            <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.8rem', lineHeight: 1.65, color: cardSub, marginBottom: '1.3rem' }}>
              Des cookies essentiels font tourner le site et nous permettent de mesurer la fréquentation de façon anonyme. Avec votre accord, on active aussi des cookies analytiques pour mieux comprendre votre navigation.
            </p>
          ) : (
            <div style={{ marginBottom: '1.3rem', display: 'flex', flexDirection: 'column', gap: '.9rem' }}>
              <PrefRow
                title="Cookies essentiels"
                desc="Nécessaires au fonctionnement du site — toujours actifs."
                locked
                cardText={cardText}
                cardSub={cardSub}
              />
              <PrefRow
                title="Cookies analytiques"
                desc="Nous aident à comprendre comment le site est utilisé."
                value={analyticsOn}
                onChange={setAnalyticsOn}
                cardText={cardText}
                cardSub={cardSub}
              />
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '.6rem' }}>
            {!expanded ? (
              <>
                <button onClick={() => decide('accepted', true)} className="cookie-btn cookie-btn-raised">
                  <HoverSlideText text="Tout accepter" />
                </button>
                <button onClick={() => decide('rejected', false)} className="cookie-btn cookie-btn-ghost">
                  <HoverSlideText text="Refuser les cookies optionnels" />
                </button>
                <button onClick={() => setExpanded(true)} style={btnStyle('transparent', cardSub, true)}>
                  <HoverSlideText text="Gérer mes préférences" />
                </button>
              </>
            ) : (
              <button onClick={() => decide(analyticsOn ? 'accepted' : 'rejected', analyticsOn)} className="cookie-btn cookie-btn-raised">
                <HoverSlideText text="Enregistrer mes préférences" />
              </button>
            )}
          </div>

          {expanded && (
            <button
              onClick={() => setExpanded(false)}
              style={{
                display: 'block', margin: '.9rem auto 0', background: 'none', border: 'none',
                fontFamily: "'JetBrains Mono',monospace", fontSize: '.7rem', color: 'rgba(255,255,255,.45)',
                cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: '3px',
              }}
            >
              <HoverSlideText text="← Retour" />
            </button>
          )}

          <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.66rem', lineHeight: 1.6, color: 'rgba(255,255,255,.4)', marginTop: '1.1rem' }}>
            Vous pouvez changer d&apos;avis à tout moment. Des questions sur vos données&nbsp;? Écrivez à{' '}
            <a href="mailto:wthomasss06@gmail.com" style={{ color: 'rgba(255,255,255,.6)' }}>wthomasss06@gmail.com</a>.
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function btnStyle(bg, color, ghost = false) {
  return {
    display: 'block', width: '100%',
    padding: ghost ? '.5rem 1rem' : '.85rem 1rem',
    borderRadius: 100,
    background: bg,
    color,
    border: ghost ? 'none' : '1px solid rgba(255,255,255,.1)',
    fontFamily: "'Barlow Condensed',sans-serif",
    fontWeight: 900, fontStyle: 'italic',
    fontSize: ghost ? '.78rem' : '.85rem',
    textTransform: ghost ? 'none' : 'uppercase',
    letterSpacing: '.01em',
    cursor: 'pointer',
    textAlign: 'center',
    textDecoration: ghost ? 'underline' : 'none',
    textUnderlineOffset: '3px',
  }
}

function PrefRow({ title, desc, value, onChange, locked = false, cardText, cardSub }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '.8rem' }}>
      <button
        role="switch"
        aria-checked={locked ? true : value}
        aria-label={title}
        disabled={locked}
        onClick={() => onChange && onChange(!value)}
        style={{
          flexShrink: 0, marginTop: 2,
          width: 36, height: 20, borderRadius: 100,
          background: (locked || value) ? '#88ca53' : 'rgba(255,255,255,.15)',
          border: 'none', position: 'relative',
          cursor: locked ? 'default' : 'pointer',
          opacity: locked ? .6 : 1,
          transition: 'background .2s',
        }}
      >
        <span style={{
          position: 'absolute', top: 2, left: (locked || value) ? 18 : 2,
          width: 16, height: 16, borderRadius: '50%', background: '#fff',
          transition: 'left .2s',
        }} />
      </button>
      <div>
        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, fontSize: '.78rem', color: cardText }}>{title}</div>
        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.7rem', color: cardSub, marginTop: 2 }}>{desc}</div>
      </div>
    </div>
  )
}
