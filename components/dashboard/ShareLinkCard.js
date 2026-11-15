'use client'
import { useMemo, useState } from 'react'
import { Copy, Check, ExternalLink } from 'lucide-react'
import { SHARE_CHANNELS, SHARE_PAGES, buildShareLink, whatsappShareUrl } from '@/lib/share-links'

/* Générateur de lien de partage balisé. Un lien partagé sur WhatsApp n'envoie aucun referrer :
   avec ?utm_source=whatsapp, la visite est rangée sous « WhatsApp » dans la carte Provenance
   (au lieu de « Direct »). Rien n'est enregistré ici : le lien se fabrique dans le navigateur. */

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://akatech.vercel.app').replace(/\/+$/, '')

export default function ShareLinkCard({ T, CARD }) {
  const [path, setPath] = useState('/')
  const [source, setSource] = useState('whatsapp')
  const [campaign, setCampaign] = useState('')
  const [copied, setCopied] = useState(false)

  const link = useMemo(() => buildShareLink({ base: SITE_URL, path, source, campaign }), [path, source, campaign])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link)
    } catch {
      // Contexte non sécurisé ou permission refusée : sélection manuelle du champ.
      document.getElementById('share-link-output')?.select()
      return
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const field = {
    width: '100%', padding: '.55rem .7rem', borderRadius: 10, fontSize: '.8rem',
    border: `1px solid ${T.border}`, background: T.bg, color: T.textMain,
  }
  const label = { display: 'block', fontSize: '.68rem', fontWeight: 700, color: T.textMuted, marginBottom: 4 }

  return (
    <div style={{ ...CARD, padding: '1.2rem', gridColumn: '1 / -1', minWidth: 0 }}>
      <div style={{ fontSize: '.78rem', fontWeight: 700, color: T.textSub, marginBottom: 4 }}>Lien de partage balisé</div>
      <div style={{ fontSize: '.68rem', color: T.textMuted, marginBottom: 14 }}>
        Partage ce lien plutôt que l’adresse nue : la visite sera comptée sous le bon canal dans « Provenance ».
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 12, marginBottom: 12 }}>
        <div>
          <label htmlFor="share-page" style={label}>Page</label>
          <select id="share-page" value={path} onChange={(e) => setPath(e.target.value)} style={field}>
            {SHARE_PAGES.map(([value, name]) => <option key={value} value={value}>{name}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="share-channel" style={label}>Canal</label>
          <select id="share-channel" value={source} onChange={(e) => setSource(e.target.value)} style={field}>
            {SHARE_CHANNELS.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="share-campaign" style={label}>Campagne (facultatif)</label>
          <input id="share-campaign" value={campaign} maxLength={40} onChange={(e) => setCampaign(e.target.value)} placeholder="ex. promo noël" style={field} />
        </div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
        <input id="share-link-output" readOnly value={link} onFocus={(e) => e.target.select()} aria-label="Lien balisé" style={{ ...field, flex: '1 1 280px', width: 'auto', fontFamily: "'JetBrains Mono',monospace", fontSize: '.74rem' }} />
        <button type="button" className="btn-raised btn-sm" onClick={copy} disabled={!link}>
          {copied ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />} {copied ? 'Copié' : 'Copier'}
        </button>
        {source === 'whatsapp' && link && (
          <a className="btn-ghost btn-sm" href={whatsappShareUrl(link)} target="_blank" rel="noopener noreferrer">
            <ExternalLink size={14} aria-hidden="true" /> Ouvrir WhatsApp
          </a>
        )}
      </div>
    </div>
  )
}
