'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Cookie, Check, ShieldCheck } from 'lucide-react'
import { useTheme } from '@/lib/theme'
import { useLanguage } from '@/lib/language'
import { readConsent, writeConsent, reportConsent, CONSENT_TTL_MS } from '@/lib/cookie-consent'

/* Page « Gérer mes cookies » (lien dans le pied de page, et depuis la bannière).
   Le choix se lit et se modifie ici à tout moment ; il passe par les mêmes fonctions que la
   bannière (lib/cookie-consent.js), donc le serveur est prévenu de la même façon :
   un refus efface IP, ville et position déjà enregistrées pour ce navigateur. */

const ACCEPT_EFFECTS = [
  'Votre adresse IP, votre région et votre ville approximative (celle de votre fournisseur d’accès, jamais une adresse) sont enregistrées avec votre visite, ainsi que la position approximative de cette ville, pour la carte des visiteurs du tableau de bord.',
  'Ces données sont effacées automatiquement au bout de 90 jours.',
  'À votre première visite, AKATech Studio peut recevoir une alerte e-mail indiquant votre ville approximative. Votre adresse IP n’y figure jamais.',
]

const REJECT_EFFECTS = [
  'Aucune adresse IP, ville ni position n’est conservée. Ce qui avait déjà été enregistré avec ce navigateur est effacé.',
  'Aucune alerte n’est envoyée à votre sujet.',
  'Le site fonctionne exactement de la même façon.',
]

const COOKIES = [
  { name: 'akatech_visitor', purpose: 'Identifiant technique anonyme du navigateur, pour compter les visiteurs et reconnaître un retour.', duration: '1 an', type: 'Essentiel · mesure d’audience anonyme' },
  { name: 'akatech_session', purpose: 'Regroupe les pages vues d’une même visite. Une nouvelle visite commence après 30 minutes d’inactivité.', duration: '30 minutes glissantes', type: 'Essentiel · mesure d’audience anonyme' },
  { name: 'akatech_cookie_consent', purpose: 'Se souvient de votre choix pour ne pas vous redemander à chaque page. Il est aussi gardé dans le stockage local du navigateur.', duration: '12 mois', type: 'Essentiel' },
]

const formatDate = (ts) => new Date(ts).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })

export default function CookiesClient() {
  const T = useTheme()
  const { t } = useLanguage()
  const [ready, setReady] = useState(false)
  const [consent, setConsent] = useState(null)
  const [analytics, setAnalytics] = useState(false)
  const [notice, setNotice] = useState('')

  useEffect(() => {
    const stored = readConsent()
    setConsent(stored)
    setAnalytics(stored ? stored.analytics : false)
    setReady(true)
  }, [])

  const apply = (status, analyticsOn) => {
    const durable = writeConsent({ status, analytics: analyticsOn, ts: Date.now() })
    reportConsent(status)
    setConsent(readConsent())
    setAnalytics(analyticsOn)
    setNotice(durable
      ? 'Votre choix est enregistré.'
      : 'Votre choix est appliqué pour cette visite, mais votre navigateur bloque le stockage : il vous sera redemandé.')
  }

  const mono = "'JetBrains Mono',monospace"
  const title = "'Barlow Condensed',sans-serif"
  const card = { background: T.card, border: `1px solid ${T.border}`, borderRadius: 18, padding: 'clamp(1.1rem, 3vw, 1.7rem)' }
  const h2 = { fontFamily: title, fontWeight: 900, fontStyle: 'italic', fontSize: 'clamp(1.3rem, 3.4vw, 1.7rem)', color: T.textMain, letterSpacing: '-.01em', margin: '0 0 .9rem' }
  const body = { fontFamily: mono, fontSize: '.82rem', lineHeight: 1.7, color: T.textSub, margin: 0 }

  const statusLabel = !ready ? '…'
    : !consent ? 'Aucun choix enregistré pour l’instant'
    : consent.analytics ? 'Cookies analytiques acceptés' : 'Cookies analytiques refusés'

  return (
    <div style={{ background: T.bg, minHeight: '100vh', padding: 'clamp(7rem, 14vw, 9.5rem) clamp(1rem, 4vw, 2rem) 5rem' }}>
      <div style={{ maxWidth: 880, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>

        <header>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '.5rem', fontFamily: mono, fontSize: '.72rem', color: T.green, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: '.8rem' }}>
            <Cookie size={15} aria-hidden="true" /> AKATech Studio · Cookies
          </div>
          <h1 style={{ fontFamily: title, fontWeight: 900, fontStyle: 'italic', fontSize: 'clamp(2.2rem, 7vw, 3.6rem)', lineHeight: 1, color: T.textMain, letterSpacing: '-.02em', margin: '0 0 1rem' }}>
            Gérer mes cookies
          </h1>
          <p style={{ ...body, maxWidth: 640 }}>
            Voici ce que le site enregistre dans votre navigateur, ce que change votre choix, et un moyen de le modifier quand vous voulez. Votre choix est mémorisé 12 mois sur votre appareil.
          </p>
        </header>

        <section aria-labelledby="choix" style={card}>
          <h2 id="choix" style={h2}>Votre choix</h2>
          <p style={{ ...body, display: 'flex', alignItems: 'center', gap: '.5rem', color: T.textMain, fontWeight: 700 }} aria-live="polite">
            <ShieldCheck size={16} color={T.green} aria-hidden="true" /> {statusLabel}
          </p>
          {ready && consent && (
            <p style={{ ...body, fontSize: '.72rem', marginTop: '.3rem', color: T.textMuted }}>
              Enregistré le {formatDate(consent.ts)} · à renouveler d’ici le {formatDate(consent.ts + CONSENT_TTL_MS)}
            </p>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', margin: '1.3rem 0' }}>
            <Row title={t('cookieEssentialTitle')} desc={t('cookieEssentialDesc')} locked T={T} mono={mono} />
            <Row title={t('cookieAnalyticsTitle')} desc={t('cookieAnalyticsDesc')} value={analytics} onChange={setAnalytics} T={T} mono={mono} />
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.7rem' }}>
            <button type="button" className="btn-raised btn-sm" onClick={() => apply(analytics ? 'accepted' : 'rejected', analytics)}>{t('savePrefs')}</button>
            <button type="button" className="btn-ghost btn-sm" onClick={() => apply('accepted', true)}>{t('acceptAll')}</button>
            <button type="button" className="btn-ghost btn-sm" onClick={() => apply('rejected', false)}>{t('rejectOptional')}</button>
          </div>
          <p role="status" style={{ ...body, minHeight: '1.4em', marginTop: '.9rem', color: T.green, display: 'flex', alignItems: 'center', gap: '.4rem' }}>
            {notice && <><Check size={14} aria-hidden="true" /> {notice}</>}
          </p>
        </section>

        <section aria-labelledby="effets" style={card}>
          <h2 id="effets" style={h2}>Ce que change votre choix</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.2rem' }}>
            <Effects heading="Si vous acceptez" items={ACCEPT_EFFECTS} T={T} mono={mono} />
            <Effects heading="Si vous refusez" items={REJECT_EFFECTS} T={T} mono={mono} />
          </div>
          <p style={{ ...body, marginTop: '1.2rem' }}>
            <strong style={{ color: T.textMain }}>Dans tous les cas</strong>, une mesure d’audience anonyme compte les pages vues, le type d’appareil, le système, le navigateur, le pays et la provenance de la visite (site d’origine, ou lien de partage balisé comme <code>?utm_source=whatsapp</code>). Elle ne permet pas de vous identifier.
          </p>
        </section>

        <section aria-labelledby="liste" style={card}>
          <h2 id="liste" style={h2}>Les cookies de ce site</h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', minWidth: 560, borderCollapse: 'collapse', fontFamily: mono, fontSize: '.76rem' }}>
              <thead>
                <tr>
                  {['Nom', 'À quoi il sert', 'Durée', 'Type'].map((h) => (
                    <th key={h} scope="col" style={{ textAlign: 'left', padding: '.5rem .7rem .5rem 0', color: T.textMuted, fontWeight: 700, borderBottom: `1px solid ${T.border}` }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COOKIES.map((c) => (
                  <tr key={c.name}>
                    <td style={{ padding: '.75rem .7rem .75rem 0', color: T.textMain, fontWeight: 700, verticalAlign: 'top', borderBottom: `1px solid ${T.border}` }}>{c.name}</td>
                    <td style={{ padding: '.75rem .7rem .75rem 0', color: T.textSub, lineHeight: 1.6, verticalAlign: 'top', borderBottom: `1px solid ${T.border}` }}>{c.purpose}</td>
                    <td style={{ padding: '.75rem .7rem .75rem 0', color: T.textSub, verticalAlign: 'top', borderBottom: `1px solid ${T.border}` }}>{c.duration}</td>
                    <td style={{ padding: '.75rem 0', color: T.textSub, verticalAlign: 'top', borderBottom: `1px solid ${T.border}` }}>{c.type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ ...body, marginTop: '1.1rem' }}>
            La mesure d’audience Vercel Analytics n’utilise pas de cookie. Le site charge ses polices depuis Google Fonts et certaines images depuis Cloudinary : ces services reçoivent votre adresse IP pour répondre à la requête, comme pour tout contenu hébergé ailleurs. Le site ne dépose pas de cookie publicitaire.
          </p>
        </section>

        <section aria-labelledby="droits" style={card}>
          <h2 id="droits" style={h2}>Retirer votre accord, exercer vos droits</h2>
          <p style={body}>
            Vous pouvez changer d’avis à tout moment avec les boutons ci-dessus : un refus efface les données de localisation déjà enregistrées pour ce navigateur. Pour accéder à vos données, les corriger ou les faire supprimer, écrivez à <a href="mailto:wthomasss06@gmail.com" style={{ color: T.green }}>wthomasss06@gmail.com</a>. Vous pouvez aussi saisir l’ARTCI. Le détail figure dans la politique de confidentialité, accessible depuis le pied de page.
          </p>
        </section>

        <Link href="/" style={{ fontFamily: mono, fontSize: '.78rem', color: T.textSub, textDecoration: 'underline', textUnderlineOffset: 3, alignSelf: 'flex-start' }}>
          {t('backToHome')}
        </Link>
      </div>
    </div>
  )
}

function Effects({ heading, items, T, mono }) {
  return (
    <div>
      <h3 style={{ fontFamily: mono, fontSize: '.8rem', fontWeight: 800, color: T.textMain, margin: '0 0 .6rem' }}>{heading}</h3>
      <ul style={{ margin: 0, paddingLeft: '1.1rem', display: 'flex', flexDirection: 'column', gap: '.55rem' }}>
        {items.map((text) => (
          <li key={text} style={{ fontFamily: mono, fontSize: '.78rem', lineHeight: 1.65, color: T.textSub }}>{text}</li>
        ))}
      </ul>
    </div>
  )
}

function Row({ title, desc, value, onChange, locked = false, T, mono }) {
  const on = locked || value
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '.9rem' }}>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        aria-label={title}
        disabled={locked}
        onClick={() => onChange && onChange(!value)}
        style={{
          flexShrink: 0, marginTop: 2, width: 40, height: 22, borderRadius: 100, border: 'none', position: 'relative',
          background: on ? '#c6ff3d' : T.border, opacity: locked ? .6 : 1, cursor: locked ? 'default' : 'pointer', transition: 'background .2s',
        }}
      >
        <span style={{ position: 'absolute', top: 3, left: on ? 21 : 3, width: 16, height: 16, borderRadius: '50%', background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,.35)', transition: 'left .2s' }} />
      </button>
      <div>
        <div style={{ fontFamily: mono, fontWeight: 700, fontSize: '.82rem', color: T.textMain }}>{title}</div>
        <div style={{ fontFamily: mono, fontSize: '.74rem', lineHeight: 1.6, color: T.textSub, marginTop: 2 }}>{desc}</div>
      </div>
    </div>
  )
}
