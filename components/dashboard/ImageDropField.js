'use client'
import { useRef, useState } from 'react'
import { UploadCloud, RefreshCw, Trash2 } from 'lucide-react'

/* Champ « photo de couverture » du dashboard : glisser-déposer, clic pour choisir, ou coller une
   capture. Remplace le champ où l'on collait un lien.

   • L'image est réduite et convertie en WebP dans le navigateur (1600 px max) avant l'envoi,
     pour rester légère (quelques centaines de Ko) quelle que soit la photo d'origine.
   • Elle part vers /api/admin/media, qui la range dans la table MediaAsset (base de données).
   • `onChange` reçoit l'adresse à enregistrer dans le champ image de l'article
     (ex. /api/media/<id>), ou '' quand on retire la photo.
   • Le champ « coller un lien » reste disponible en secours (image hébergée ailleurs).

   Utilisation (remplace l'ancien <input> du lien) :
     <ImageDropField T={T} value={form.image} onChange={(url) => setForm((f) => ({ ...f, image: url }))} /> */

const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']
const MAX_SOURCE_BYTES = 20 * 1024 * 1024 // photo d'origine
const MAX_EDGE = 1600
const TARGET_BYTES = 1.5 * 1024 * 1024 // le serveur refuse au-delà de 2 Mo

const toBlob = (canvas, type, quality) => new Promise((resolve) => canvas.toBlob(resolve, type, quality))

async function compress(file) {
  let bitmap
  try {
    bitmap = await createImageBitmap(file)
  } catch {
    // Format que le navigateur ne sait pas lire (ex. HEIC hors Safari).
    throw new Error('Cette image ne peut pas être lue. Essaie un JPG ou un PNG.')
  }
  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.max(1, Math.round(bitmap.width * scale))
  canvas.height = Math.max(1, Math.round(bitmap.height * scale))
  canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  bitmap.close?.()

  let best = null
  for (const type of ['image/webp', 'image/jpeg']) {
    for (const quality of [0.84, 0.72, 0.6]) {
      const blob = await toBlob(canvas, type, quality)
      if (!blob || blob.type !== type) break // format d'export non géré : on passe au suivant
      if (!best || blob.size < best.size) best = blob
      if (blob.size <= TARGET_BYTES) return blob
    }
    if (best && best.size <= TARGET_BYTES) return best
  }
  if (best) return best
  throw new Error('Cette image ne peut pas être traitée.')
}

export default function ImageDropField({ value = '', onChange, T, label = 'Photo de couverture' }) {
  const inputRef = useRef(null)
  const [over, setOver] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [broken, setBroken] = useState(false)

  const upload = async (file) => {
    setError('')
    if (!file) return
    if (!ACCEPTED.includes(file.type)) { setError('Format non pris en charge. Utilise une image JPG, PNG ou WebP.'); return }
    if (file.size > MAX_SOURCE_BYTES) { setError('Image trop lourde (20 Mo maximum).'); return }
    setBusy(true)
    try {
      const blob = await compress(file)
      const body = new FormData()
      body.append('file', blob, 'cover')
      body.append('kind', 'blog-cover')
      const res = await fetch('/api/admin/media', { method: 'POST', body })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data.url) throw new Error(data.error || 'Envoi impossible pour le moment.')
      setBroken(false)
      onChange?.(data.url)
    } catch (err) {
      setError(err?.message || 'Envoi impossible pour le moment.')
    } finally {
      setBusy(false)
    }
  }

  const pick = () => inputRef.current?.click()
  const onDrop = (e) => { e.preventDefault(); setOver(false); upload(e.dataTransfer?.files?.[0]) }
  const onPaste = (e) => {
    const item = [...(e.clipboardData?.items || [])].find((i) => i.kind === 'file' && i.type.startsWith('image/'))
    if (item) { e.preventDefault(); upload(item.getAsFile()) }
  }

  const accent = T.green || '#88ca53'
  return (
    <div>
      <style>{'@keyframes idf-spin{to{transform:rotate(360deg)}}'}</style>
      <div style={{ fontSize: '.72rem', fontWeight: 700, color: T.textSub, marginBottom: 6 }}>{label}</div>

      {value ? (
        <div style={{ border: `1px solid ${T.border}`, borderRadius: 14, overflow: 'hidden', background: T.card }}>
          {broken ? (
            <div style={{ height: 150, display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.textMuted, fontSize: '.76rem' }}>Aperçu indisponible</div>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="Aperçu de la photo de couverture" onError={() => setBroken(true)} style={{ display: 'block', width: '100%', maxHeight: 220, objectFit: 'cover' }} />
          )}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8, padding: '.6rem .8rem' }}>
            <button type="button" className="btn-ghost btn-sm" onClick={pick} disabled={busy}>
              <RefreshCw size={13} aria-hidden="true" style={busy ? { animation: 'idf-spin 1s linear infinite' } : undefined} /> {busy ? 'Envoi…' : 'Remplacer'}
            </button>
            <button type="button" className="btn-ghost btn-sm" onClick={() => { setError(''); onChange?.('') }} disabled={busy}>
              <Trash2 size={13} aria-hidden="true" /> Retirer
            </button>
          </div>
        </div>
      ) : (
        <div
          role="button"
          tabIndex={0}
          aria-label="Ajouter une photo de couverture : glisser-déposer, cliquer pour choisir ou coller une image"
          aria-busy={busy}
          onClick={pick}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick() } }}
          onDragOver={(e) => { e.preventDefault(); setOver(true) }}
          onDragLeave={() => setOver(false)}
          onDrop={onDrop}
          onPaste={onPaste}
          style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, textAlign: 'center',
            padding: '1.6rem 1rem', borderRadius: 14, cursor: busy ? 'progress' : 'pointer',
            border: `2px dashed ${over ? accent : T.border}`, background: over ? 'rgba(136,202,83,.10)' : 'transparent', transition: 'border-color .15s, background .15s',
          }}
        >
          {busy
            ? <RefreshCw size={22} color={accent} aria-hidden="true" style={{ animation: 'idf-spin 1s linear infinite' }} />
            : <UploadCloud size={24} color={accent} aria-hidden="true" />}
          <div style={{ fontSize: '.82rem', fontWeight: 700, color: T.textMain }}>{busy ? 'Envoi en cours…' : 'Glisse une photo ici, ou clique pour choisir'}</div>
          <div style={{ fontSize: '.7rem', color: T.textMuted }}>JPG, PNG ou WebP · réduite automatiquement · tu peux aussi coller une capture</div>
        </div>
      )}

      <input ref={inputRef} type="file" accept={ACCEPTED.join(',')} hidden onChange={(e) => { upload(e.target.files?.[0]); e.target.value = '' }} />

      {error && <div role="alert" style={{ marginTop: 8, fontSize: '.74rem', color: '#e5484d' }}>{error}</div>}

      <details style={{ marginTop: 8 }}>
        <summary style={{ cursor: 'pointer', fontSize: '.7rem', color: T.textMuted }}>Ou coller un lien d’image</summary>
        <input
          type="text"
          inputMode="url"
          value={value}
          onChange={(e) => { setBroken(false); onChange?.(e.target.value) }}
          placeholder="https://…"
          aria-label="Lien de l’image"
          style={{ width: '100%', marginTop: 6, padding: '.55rem .7rem', borderRadius: 10, fontSize: '.78rem', border: `1px solid ${T.border}`, background: T.bg, color: T.textMain }}
        />
      </details>
    </div>
  )
}
