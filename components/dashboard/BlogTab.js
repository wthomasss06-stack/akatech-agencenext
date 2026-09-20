'use client'
import { useEffect, useState } from 'react'
import { Edit3, ExternalLink, Image as ImageIcon, Link as LinkIcon, Plus, Save, Trash2, X } from 'lucide-react'

const EMPTY = { id: '', title: '', excerpt: '', content: '', category: 'Développement Web', image: '/images/og-cover.webp', link: '', publishedAt: new Date().toISOString().slice(0, 10), published: true }

export default function BlogTab({ T, CARD }) {
  const [posts, setPosts] = useState([])
  const [form, setForm] = useState(EMPTY)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const load = () => { setLoading(true); fetch('/api/blog?admin=1').then(r => r.json()).then(d => setPosts(d.posts || [])).catch(() => setMessage('Impossible de charger les articles.')).finally(() => setLoading(false)) }
  useEffect(() => { load() }, [])
  const change = (key, value) => setForm(f => ({ ...f, [key]: value }))
  async function submit(e) {
    e.preventDefault(); setSaving(true); setMessage('')
    try {
      const res = await fetch('/api/blog', { method: form.id ? 'PATCH' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Enregistrement impossible')
      setMessage(form.id ? 'Article mis à jour.' : 'Article publié.')
      setForm(EMPTY); load()
    } catch (error) { setMessage(error.message) } finally { setSaving(false) }
  }
  async function remove(post) {
    if (!window.confirm(`Supprimer « ${post.title} » ?`)) return
    await fetch(`/api/blog?id=${post.id}`, { method: 'DELETE' }); load()
  }
  const input = { width: '100%', boxSizing: 'border-box', background: T.bg, color: T.textMain, border: `1px solid ${T.border}`, borderRadius: 10, padding: '.7rem .8rem', font: 'inherit', fontSize: '.82rem', outline: 'none' }
  return <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(280px, .8fr)', gap: 16, alignItems: 'start' }}>
    <form onSubmit={submit} style={{ ...CARD, padding: '1.3rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 18 }}><div><div style={{ fontWeight: 800, fontSize: '1.05rem' }}>{form.id ? 'Modifier un article' : 'Nouvel article'}</div><div style={{ color: T.textMuted, fontSize: '.75rem', marginTop: 4 }}>Rédige en paragraphes séparés par une ligne vide. Utilise ## pour un sous-titre.</div></div>{form.id && <button type="button" onClick={() => setForm(EMPTY)} style={{ background: 'none', border: 0, color: T.textMuted, cursor: 'pointer' }}><X size={18} /></button>}</div>
      <div style={{ display: 'grid', gap: 12 }}>
        <label style={{ color: T.textSub, fontSize: '.76rem' }}>Titre<input required value={form.title} onChange={e => change('title', e.target.value)} style={input} placeholder="Titre de l'article" /></label>
        <label style={{ color: T.textSub, fontSize: '.76rem' }}>Extrait<textarea required value={form.excerpt} onChange={e => change('excerpt', e.target.value)} style={{ ...input, minHeight: 70, resize: 'vertical' }} placeholder="Résumé visible sur la page blog" /></label>
        <label style={{ color: T.textSub, fontSize: '.76rem' }}>Texte de l’article<textarea required value={form.content} onChange={e => change('content', e.target.value)} style={{ ...input, minHeight: 280, resize: 'vertical', lineHeight: 1.55 }} placeholder="## Introduction\n\nVotre texte..." /></label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}><label style={{ color: T.textSub, fontSize: '.76rem' }}>Catégorie<input value={form.category} onChange={e => change('category', e.target.value)} style={input} /></label><label style={{ color: T.textSub, fontSize: '.76rem' }}>Date de publication<input type="date" value={String(form.publishedAt).slice(0, 10)} onChange={e => change('publishedAt', e.target.value)} style={input} /></label></div>
        <label style={{ color: T.textSub, fontSize: '.76rem' }}><ImageIcon size={13} style={{ verticalAlign: 'middle', marginRight: 5 }} />URL de l’image<input value={form.image} onChange={e => change('image', e.target.value)} style={input} placeholder="https://... ou /images/..." /></label>
        <label style={{ color: T.textSub, fontSize: '.76rem' }}><LinkIcon size={13} style={{ verticalAlign: 'middle', marginRight: 5 }} />Lien externe facultatif<input value={form.link} onChange={e => change('link', e.target.value)} style={input} placeholder="https://linkedin.com/..." /></label>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, color: T.textSub, fontSize: '.8rem' }}><input type="checkbox" checked={form.published} onChange={e => change('published', e.target.checked)} /> Publier immédiatement</label>
        <button disabled={saving} type="submit" className="btn-raised" style={{ justifyContent: 'center', border: 0, padding: '.8rem 1rem', cursor: saving ? 'wait' : 'pointer' }}>{form.id ? <Save size={15} /> : <Plus size={15} />} {saving ? 'Enregistrement…' : form.id ? 'Mettre à jour' : 'Publier l’article'}</button>
        {message && <div style={{ color: message.includes('impossible') ? '#e05e5e' : T.green, fontSize: '.8rem' }}>{message}</div>}
      </div>
    </form>
    <div style={{ display: 'grid', gap: 10 }}><div style={{ fontWeight: 800, fontSize: '.9rem' }}>Articles publiés <span style={{ color: T.textMuted, fontWeight: 400 }}>({posts.length})</span></div>{loading ? <div style={{ color: T.textMuted, fontSize: '.8rem' }}>Chargement…</div> : posts.length === 0 ? <div style={{ ...CARD, padding: '1.2rem', color: T.textMuted, fontSize: '.8rem' }}>Aucun article créé depuis l’admin.</div> : posts.map(post => <div key={post.id} style={{ ...CARD, padding: '1rem', display: 'grid', gap: 8 }}><div style={{ display: 'flex', gap: 10, alignItems: 'start' }}><img src={post.image} alt="" style={{ width: 68, height: 52, objectFit: 'cover', borderRadius: 8 }} /><div style={{ minWidth: 0, flex: 1 }}><div style={{ fontWeight: 750, fontSize: '.82rem' }}>{post.title}</div><div style={{ color: T.textMuted, fontSize: '.7rem', marginTop: 3 }}>{post.category} · {new Date(post.publishedAt).toLocaleDateString('fr-FR')}</div></div></div><div style={{ display: 'flex', gap: 6 }}><button onClick={() => setForm({ ...post, image: post.image || '', link: post.link || '', publishedAt: new Date(post.publishedAt).toISOString().slice(0, 10) })} style={{ ...input, width: 'auto', padding: '.45rem .65rem', cursor: 'pointer' }}><Edit3 size={13} /></button><a href={`/blog/${post.slug}`} target="_blank" rel="noreferrer" style={{ ...input, width: 'auto', padding: '.45rem .65rem', color: T.textSub }}><ExternalLink size={13} /></a><button onClick={() => remove(post)} style={{ ...input, width: 'auto', padding: '.45rem .65rem', color: '#e05e5e', cursor: 'pointer' }}><Trash2 size={13} /></button></div></div>)}</div>
  </div>
}
