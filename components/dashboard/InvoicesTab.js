// components/dashboard/InvoicesTab.js
// Onglet "Factures" du dashboard admin — composant autonome (état,
// styles et logique locaux) plutôt qu'intégré directement dans
// app/dashboard/page.js : ce fichier fait déjà 760+ lignes, et isoler
// cette fonctionnalité ici limite le risque de régression sur les
// onglets existants (Vue d'ensemble / Analytics / Conversations /
// Leads) à chaque modification future des factures.
//
// html2canvas / jsPDF sont importés dynamiquement (à l'intérieur des
// fonctions de téléchargement, jamais en haut de fichier) : ces deux
// librairies accèdent à `window`/`document` dès leur chargement, ce qui
// casserait le rendu serveur de cette page 'use client' (Next.js
// pré-rend une fois côté serveur même les composants clients). L'import
// dynamique évite le crash SSR et retire ~200 Ko du bundle initial du
// dashboard, chargés seulement au moment réel du clic sur Télécharger.
'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import {
  Plus, Pencil, Trash2, ArrowLeft, Search, AlertTriangle,
  ChevronLeft, ChevronRight, FileText, Image as ImageIcon, Save,
} from 'lucide-react'
import InvoicePreview from './InvoicePreview'
import { computeInvoiceTotals, formatMoney, emptyInvoiceForm } from '@/lib/invoice-calc'

const STATUS_LABELS = { ENVOYEE: 'Envoyée', PAYEE: 'Payée', ANNULEE: 'Annulée' }
const STATUS_COLORS = { ENVOYEE: '#5b8def', PAYEE: '#88ca53', ANNULEE: '#e05e5e' }

function StatusPill({ status }) {
  const color = STATUS_COLORS[status] || '#9aa0a6'
  return (
    <span style={{
      display: 'inline-block', padding: '3px 10px', borderRadius: 100,
      fontSize: '.7rem', fontWeight: 700, color,
      background: `${color}1a`, border: `1px solid ${color}44`, whiteSpace: 'nowrap',
    }}>
      {STATUS_LABELS[status] || status}
    </span>
  )
}

function Field({ T, label, small, children }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: small ? '.66rem' : '.7rem', fontWeight: 600, color: T.textMuted, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '.03em' }}>
        {label}
      </label>
      {children}
    </div>
  )
}

function inputStyle(T) {
  return {
    width: '100%', padding: '.5rem .7rem', background: T.bg, border: `1px solid ${T.border}`,
    borderRadius: 8, color: T.textMain, fontSize: '.8rem', fontFamily: 'inherit',
  }
}

function iconBtnStyle(T) {
  return { background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0, color: T.textMuted, padding: 6, display: 'flex', borderRadius: 8 }
}

function downloadBtnStyle(T, primary) {
  return {
    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
    padding: '.6rem 1rem', borderRadius: 10, fontSize: '.78rem', fontWeight: 700, cursor: 'pointer', border: 'none',
    background: primary ? T.green : T.tabRail, color: primary ? '#08120a' : T.textMain,
  }
}

export default function InvoicesTab({ T, CARD }) {
  const [view, setView] = useState('list') // 'list' | 'form'
  const [invoices, setInvoices] = useState([])
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const [form, setForm] = useState(emptyInvoiceForm)
  const [editingId, setEditingId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [exporting, setExporting] = useState(null) // 'png' | 'pdf' | null

  const invoiceRef = useRef(null)
  const scaleHostRef = useRef(null)
  const [scale, setScale] = useState(1)

  const loadInvoices = useCallback(() => {
    setLoading(true)
    const params = new URLSearchParams({
      page, limit: 15,
      ...(search ? { search } : {}),
      ...(statusFilter ? { status: statusFilter } : {}),
    })
    fetch(`/api/invoices?${params}`)
      .then(r => r.json())
      .then((d) => { setInvoices(d.invoices || []); setPagination(d.pagination) })
      .catch(err => console.error('Erreur chargement factures:', err))
      .finally(() => setLoading(false))
  }, [page, search, statusFilter])

  useEffect(() => { if (view === 'list') loadInvoices() }, [view, loadInvoices])

  // Ajuste l'échelle d'affichage à la largeur disponible — pour l'aperçu
  // écran uniquement. Ce `transform: scale()` est justement ce qui cassait
  // l'export (voir la copie hors-écran plus bas, dans le rendu de la vue
  // formulaire) : html2canvas ne capture pas correctement un élément dont
  // un ANCÊTRE a un transform CSS, même à scale(1) — ça produisait le
  // texte dédoublé/superposé sur les PNG/PDF générés.
  useEffect(() => {
    if (view !== 'form') return
    function updateScale() {
      if (!scaleHostRef.current) return
      const available = scaleHostRef.current.clientWidth - 24
      setScale(Math.max(0.3, Math.min(available / 793, 1)))
    }
    updateScale()
    window.addEventListener('resize', updateScale)
    return () => window.removeEventListener('resize', updateScale)
  }, [view])

  function openNewInvoice() {
    setForm(emptyInvoiceForm())
    setEditingId(null)
    setSaveError('')
    setView('form')
    fetch('/api/invoices?next=1')
      .then(r => r.json())
      .then(d => { if (d.number) setForm(f => ({ ...f, number: d.number })) })
      .catch(() => {})
  }

  function openEditInvoice(inv) {
    setForm({
      number: inv.number,
      contractRef: inv.contractRef || '',
      issueDate: inv.issueDate.slice(0, 10),
      dueDate: inv.dueDate ? inv.dueDate.slice(0, 10) : '',
      clientName: inv.clientName,
      clientAddress: inv.clientAddress || '',
      clientPhone: inv.clientPhone || '',
      clientEmail: inv.clientEmail || '',
      clientRccm: inv.clientRccm || '',
      currency: inv.currency,
      lines: Array.isArray(inv.lines) && inv.lines.length ? inv.lines : [{ desc: '', qty: 1, price: 0 }],
      applyTva: inv.applyTva,
      applyTimbre: inv.applyTimbre,
      deposit: inv.deposit,
      notes: inv.notes || '',
      status: inv.status,
    })
    setEditingId(inv.id)
    setSaveError('')
    setView('form')
  }

  function backToList() {
    setView('list')
    setEditingId(null)
  }

  function updateField(field, value) {
    setForm(f => ({ ...f, [field]: value }))
  }

  function updateLine(idx, field, value) {
    setForm(f => {
      const lines = f.lines.slice()
      lines[idx] = { ...lines[idx], [field]: field === 'desc' ? value : (parseFloat(value) || 0) }
      return { ...f, lines }
    })
  }

  function addLine() {
    setForm(f => ({ ...f, lines: [...f.lines, { desc: '', qty: 1, price: 0 }] }))
  }

  function removeLine(idx) {
    setForm(f => ({ ...f, lines: f.lines.filter((_, i) => i !== idx) }))
  }

  async function saveInvoice() {
    if (!form.clientName.trim()) {
      setSaveError('Le nom du client est requis.')
      return
    }
    if (form.lines.length === 0 || form.lines.every(l => !l.desc.trim())) {
      setSaveError('Ajoutez au moins une ligne de prestation.')
      return
    }
    setSaving(true)
    setSaveError('')
    try {
      const url = editingId ? `/api/invoices/${editingId}` : '/api/invoices'
      const method = editingId ? 'PATCH' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const d = await res.json()
      if (!res.ok) {
        setSaveError(d.error || "Erreur lors de l'enregistrement")
        return
      }
      backToList()
    } catch (err) {
      setSaveError('Erreur réseau — vérifiez votre connexion et réessayez.')
    } finally {
      setSaving(false)
    }
  }

  async function updateStatus(id, status) {
    await fetch(`/api/invoices/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    loadInvoices()
  }

  async function confirmDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await fetch(`/api/invoices/${deleteTarget.id}`, { method: 'DELETE' })
      loadInvoices()
    } catch (err) {
      console.error('Erreur suppression facture:', err)
    } finally {
      setDeleting(false)
      setDeleteTarget(null)
    }
  }

  async function downloadPNG() {
    if (!invoiceRef.current) return
    setExporting('png')
    try {
      const { default: html2canvas } = await import('html2canvas')
      const canvas = await html2canvas(invoiceRef.current, { scale: 2, backgroundColor: '#ffffff', useCORS: true, logging: false })
      const link = document.createElement('a')
      link.download = `Facture_${form.number || 'AKATECH'}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } catch (err) {
      alert('Erreur lors de la génération du PNG : ' + err.message)
    } finally {
      setExporting(null)
    }
  }

  async function downloadPDF() {
    if (!invoiceRef.current) return
    setExporting('pdf')
    try {
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([import('html2canvas'), import('jspdf')])
      const canvas = await html2canvas(invoiceRef.current, { scale: 2, backgroundColor: '#ffffff', useCORS: true, logging: false })
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      const pageWidth = 210
      const pageHeight = 297
      const imgWidth = pageWidth
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      let heightLeft = imgHeight
      let position = 0
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
      while (heightLeft > 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }
      pdf.save(`Facture_${form.number || 'AKATECH'}.pdf`)
    } catch (err) {
      alert('Erreur lors de la génération du PDF : ' + err.message)
    } finally {
      setExporting(null)
    }
  }

  const totals = computeInvoiceTotals(form)
  const previewProps = {
    number: form.number, contractRef: form.contractRef,
    issueDate: form.issueDate, dueDate: form.dueDate,
    clientName: form.clientName, clientAddress: form.clientAddress,
    clientPhone: form.clientPhone, clientEmail: form.clientEmail, clientRccm: form.clientRccm,
    currency: form.currency, lines: form.lines,
    applyTva: form.applyTva, applyTimbre: form.applyTimbre,
    deposit: Number(form.deposit) || 0, notes: form.notes,
    totals,
  }

  // ── Vue formulaire (création / édition) ──────────────────────
  if (view === 'form') {
    return (
      <div>
        <button onClick={backToList} style={{ background: 'none', border: 'none', color: T.textSub, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: '.8rem', fontWeight: 700, padding: '.4rem 0', marginBottom: 12 }}>
          <ArrowLeft size={15} /> Retour aux factures
        </button>

        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-start' }}>
          {/* Formulaire */}
          <div style={{ ...CARD, padding: '1.2rem', flex: '1 1 340px', minWidth: 300, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <Field T={T} label="N° Facture"><input value={form.number} onChange={e => updateField('number', e.target.value)} style={inputStyle(T)} /></Field>
              <Field T={T} label="Réf. contrat"><input value={form.contractRef} onChange={e => updateField('contractRef', e.target.value)} style={inputStyle(T)} /></Field>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <Field T={T} label="Date d'émission"><input type="date" value={form.issueDate} onChange={e => updateField('issueDate', e.target.value)} style={inputStyle(T)} /></Field>
              <Field T={T} label="Date d'échéance"><input type="date" value={form.dueDate} onChange={e => updateField('dueDate', e.target.value)} style={inputStyle(T)} /></Field>
            </div>

            <div style={{ fontSize: '.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em', color: T.green, marginTop: 8 }}>Client</div>
            <Field T={T} label="Nom / Raison sociale"><input value={form.clientName} onChange={e => updateField('clientName', e.target.value)} style={inputStyle(T)} placeholder="Nom complet du client" /></Field>
            <Field T={T} label="Adresse"><textarea value={form.clientAddress} onChange={e => updateField('clientAddress', e.target.value)} style={{ ...inputStyle(T), minHeight: 50, resize: 'vertical' }} /></Field>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <Field T={T} label="Téléphone"><input value={form.clientPhone} onChange={e => updateField('clientPhone', e.target.value)} style={inputStyle(T)} placeholder="+225 XX XX XX XX" /></Field>
              <Field T={T} label="Email"><input value={form.clientEmail} onChange={e => updateField('clientEmail', e.target.value)} style={inputStyle(T)} /></Field>
            </div>
            <Field T={T} label="RCCM (si applicable)"><input value={form.clientRccm} onChange={e => updateField('clientRccm', e.target.value)} style={inputStyle(T)} /></Field>

            <div style={{ fontSize: '.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em', color: T.green, marginTop: 8 }}>Prestations</div>
            {form.lines.map((line, i) => (
              <div key={i} style={{ background: T.bgAlt, border: `1px solid ${T.border}`, borderRadius: 10, padding: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: '.72rem', fontWeight: 700, color: T.green }}>Ligne {i + 1}</span>
                  {form.lines.length > 1 && (
                    <button onClick={() => removeLine(i)} style={{ background: 'none', border: 'none', color: '#e05e5e', cursor: 'pointer', fontSize: '.7rem', fontWeight: 700 }}>Supprimer</button>
                  )}
                </div>
                <input value={line.desc} onChange={e => updateLine(i, 'desc', e.target.value)} placeholder="Description de la prestation" style={{ ...inputStyle(T), marginBottom: 6 }} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  <Field T={T} label="Qté" small><input type="number" min="0" value={line.qty} onChange={e => updateLine(i, 'qty', e.target.value)} style={inputStyle(T)} /></Field>
                  <Field T={T} label="Prix unitaire" small><input type="number" min="0" value={line.price} onChange={e => updateLine(i, 'price', e.target.value)} style={inputStyle(T)} /></Field>
                </div>
              </div>
            ))}
            <button onClick={addLine} style={{ padding: 10, background: 'rgba(136,202,83,.08)', color: T.green, border: `1px dashed ${T.green}`, borderRadius: 8, fontSize: '.78rem', fontWeight: 700, cursor: 'pointer' }}>
              + Ajouter une ligne
            </button>

            <div style={{ display: 'flex', gap: 16, margin: '8px 0' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '.78rem', color: T.textSub, cursor: 'pointer' }}>
                <input type="checkbox" checked={form.applyTva} onChange={e => updateField('applyTva', e.target.checked)} /> TVA 18%
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '.78rem', color: T.textSub, cursor: 'pointer' }}>
                <input type="checkbox" checked={form.applyTimbre} onChange={e => updateField('applyTimbre', e.target.checked)} /> Timbre 500 F
              </label>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <Field T={T} label="Acompte déjà versé"><input type="number" min="0" value={form.deposit} onChange={e => updateField('deposit', e.target.value)} style={inputStyle(T)} /></Field>
              <Field T={T} label="Devise">
                <select value={form.currency} onChange={e => updateField('currency', e.target.value)} style={inputStyle(T)}>
                  <option value="FCFA">FCFA</option>
                  <option value="EUR">EUR</option>
                  <option value="USD">USD</option>
                </select>
              </Field>
            </div>

            <Field T={T} label="Notes / conditions"><textarea value={form.notes} onChange={e => updateField('notes', e.target.value)} style={{ ...inputStyle(T), minHeight: 70, resize: 'vertical' }} /></Field>

            {editingId && (
              <Field T={T} label="Statut">
                <select value={form.status} onChange={e => updateField('status', e.target.value)} style={inputStyle(T)}>
                  {Object.keys(STATUS_LABELS).map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                </select>
              </Field>
            )}

            {saveError && <div style={{ color: '#e05e5e', fontSize: '.78rem' }}>{saveError}</div>}

            <button onClick={saveInvoice} disabled={saving} style={{
              marginTop: 4, padding: '.7rem 1rem', background: T.green, color: '#08120a', border: 'none', borderRadius: 10,
              fontWeight: 800, fontSize: '.85rem', cursor: saving ? 'default' : 'pointer', opacity: saving ? .7 : 1,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}>
              <Save size={15} /> {saving ? 'Enregistrement…' : editingId ? 'Mettre à jour la facture' : 'Enregistrer la facture'}
            </button>
          </div>

          {/* Aperçu + téléchargement */}
          <div style={{ flex: '1 1 420px', minWidth: 300 }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
              <button onClick={downloadPNG} disabled={exporting !== null} style={downloadBtnStyle(T, false)}>
                <ImageIcon size={14} /> {exporting === 'png' ? 'Génération…' : 'PNG'}
              </button>
              <button onClick={downloadPDF} disabled={exporting !== null} style={downloadBtnStyle(T, true)}>
                <FileText size={14} /> {exporting === 'pdf' ? 'Génération…' : 'PDF'}
              </button>
            </div>
            <div ref={scaleHostRef} style={{ ...CARD, padding: 12, overflow: 'hidden' }}>
              <div style={{ height: 1122 * scale, overflow: 'hidden' }}>
                <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left', width: 793 }}>
                  <InvoicePreview {...previewProps} />
                </div>
              </div>
            </div>

            {/* Copie non scalée, hors écran — c'est elle que html2canvas
                capture (voir le commentaire sur updateScale plus haut). */}
            <div style={{ position: 'fixed', top: 0, left: '-99999px', zIndex: -1 }} aria-hidden="true">
              <InvoicePreview ref={invoiceRef} {...previewProps} />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── Vue liste ──────────────────────────────────────────────
  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 180, display: 'flex', alignItems: 'center', gap: 8, background: T.card, border: `1px solid ${T.border}`, borderRadius: 10, padding: '.5rem .8rem' }}>
          <Search size={15} color={T.textMuted} />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            placeholder="Rechercher une facture…"
            style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: T.textMain, fontSize: '.82rem' }}
          />
        </div>
        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}
          style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 10, padding: '.5rem .8rem', color: T.textMain, fontSize: '.82rem' }}>
          <option value="">Tous les statuts</option>
          {Object.keys(STATUS_LABELS).map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
        </select>
        <button onClick={openNewInvoice} style={{
          display: 'flex', alignItems: 'center', gap: 6, background: T.green, color: '#08120a', border: 'none',
          borderRadius: 10, padding: '.6rem 1rem', fontWeight: 800, fontSize: '.8rem', cursor: 'pointer', flexShrink: 0,
        }}>
          <Plus size={15} /> Nouvelle facture
        </button>
      </div>

      {loading ? (
        <div style={{ color: T.textMuted, fontSize: '.85rem' }}>Chargement…</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {invoices.length === 0 && <div style={{ color: T.textMuted, fontSize: '.82rem', padding: '1rem 0' }}>Aucune facture pour l&apos;instant.</div>}
          {invoices.map((inv) => (
            <div key={inv.id} style={{
              ...CARD, borderRadius: 14, padding: '.9rem 1rem',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap',
            }}>
              <div style={{ minWidth: 0, flex: 1, cursor: 'pointer' }} onClick={() => openEditInvoice(inv)}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontStyle: 'italic', fontSize: '.9rem', fontWeight: 900, color: T.textMain }}>{inv.number}</span>
                  <StatusPill status={inv.status} />
                </div>
                <div style={{ fontSize: '.75rem', color: T.textSub, marginTop: 2 }}>
                  {inv.clientName} · {new Date(inv.issueDate).toLocaleDateString('fr-FR')} · {formatMoney(inv.total, inv.currency)}
                </div>
              </div>
              <select
                value={inv.status}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => updateStatus(inv.id, e.target.value)}
                style={{ background: 'none', border: `1px solid ${T.border}`, borderRadius: 8, padding: '.3rem .5rem', color: T.textMain, fontSize: '.75rem', flexShrink: 0 }}
              >
                {Object.keys(STATUS_LABELS).map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
              </select>
              <button onClick={() => openEditInvoice(inv)} title="Modifier" style={iconBtnStyle(T)}>
                <Pencil size={14} />
              </button>
              <button onClick={() => setDeleteTarget({ id: inv.id, label: `${inv.number} · ${inv.clientName}` })} title="Supprimer" style={iconBtnStyle(T)}>
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {pagination && pagination.pages > 1 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginTop: '1.2rem' }}>
          <button onClick={() => setPage(p => p - 1)} disabled={pagination.page <= 1}
            style={{ background: 'none', border: `1px solid ${T.border}`, borderRadius: 8, padding: 10, minWidth: 40, minHeight: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.textMain, cursor: pagination.page <= 1 ? 'default' : 'pointer', opacity: pagination.page <= 1 ? .4 : 1 }}>
            <ChevronLeft size={16} />
          </button>
          <span style={{ fontSize: '.8rem', color: T.textSub }}>Page {pagination.page} / {pagination.pages}</span>
          <button onClick={() => setPage(p => p + 1)} disabled={pagination.page >= pagination.pages}
            style={{ background: 'none', border: `1px solid ${T.border}`, borderRadius: 8, padding: 10, minWidth: 40, minHeight: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.textMain, cursor: pagination.page >= pagination.pages ? 'default' : 'pointer', opacity: pagination.page >= pagination.pages ? .4 : 1 }}>
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      {deleteTarget && (
        <div onClick={() => !deleting && setDeleteTarget(null)} style={{
          position: 'fixed', inset: 0, zIndex: 10100, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(0,0,0,.4)', padding: '1.2rem',
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            background: T.card, border: `1px solid ${T.border}`, borderRadius: 18, width: 'min(400px, 100%)',
            boxShadow: '0 8px 24px rgba(60,64,67,.18), 0 2px 6px rgba(60,64,67,.12)', padding: '1.5rem',
          }}>
            <div style={{ display: 'flex', gap: 12, marginBottom: '1.1rem' }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', flexShrink: 0, background: 'rgba(217,48,37,.1)', color: '#d93025', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <AlertTriangle size={18} />
              </div>
              <div>
                <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontStyle: 'italic', fontWeight: 900, fontSize: '1.1rem', color: T.textMain }}>Supprimer cette facture ?</div>
                <div style={{ fontSize: '.8rem', color: T.textSub, marginTop: 4 }}>{deleteTarget.label}</div>
              </div>
            </div>
            <div style={{ fontSize: '.78rem', color: T.textMuted, marginBottom: '1.3rem' }}>
              La facture sera supprimée définitivement. Cette action est irréversible.
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button onClick={() => setDeleteTarget(null)} disabled={deleting} style={{ background: 'none', border: `1px solid ${T.border}`, borderRadius: 100, padding: '.55rem 1.1rem', color: T.textSub, cursor: 'pointer', fontSize: '.82rem', fontWeight: 700 }}>
                Annuler
              </button>
              <button onClick={confirmDelete} disabled={deleting} style={{ background: '#d93025', border: '1px solid #d93025', borderRadius: 100, padding: '.55rem 1.1rem', color: '#fff', cursor: deleting ? 'default' : 'pointer', fontSize: '.82rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6, opacity: deleting ? .7 : 1 }}>
                <Trash2 size={13} /> {deleting ? 'Suppression…' : 'Supprimer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
