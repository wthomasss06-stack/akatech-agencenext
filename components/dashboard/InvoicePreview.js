// components/dashboard/InvoicePreview.js
// Rendu visuel de la facture, isolé dans son propre composant avec
// `<style jsx>` (CSS scopé natif à Next.js, zéro dépendance) plutôt
// qu'en styles inline comme le reste du dashboard : ce gabarit reprend
// la centaine de règles CSS de l'outil HTML autonome (tailles en mm
// pour l'A4, mise en page imprimable). Les convertir en objets style
// inline serait long et fragile pour un gain nul, alors qu'ici le CSS
// reste scopé à ce seul composant grâce à styled-jsx — aucun risque de
// fuite sur le reste du dashboard.
//
// `forwardRef` : le parent (InvoicesTab) a besoin d'une référence DOM
// directe vers la facture, à taille réelle, pour la passer telle
// quelle à html2canvas lors du téléchargement PNG/PDF.
'use client'
import { forwardRef } from 'react'
import { formatMoney } from '@/lib/invoice-calc'

const InvoicePreview = forwardRef(function InvoicePreview({
  number, contractRef, issueDate, dueDate,
  clientName, clientAddress, clientPhone, clientEmail, clientRccm,
  currency, lines, applyTva, applyTimbre, deposit, notes, totals,
}, ref) {
  const { subtotal, tvaAmount, timbreAmount, total, balance } = totals

  const fmtDate = (d) => {
    if (!d) return ''
    const dt = new Date(d)
    return Number.isNaN(dt.getTime()) ? '' : dt.toLocaleDateString('fr-FR')
  }

  return (
    <div className="ak-invoice" ref={ref}>
      <div className="ak-inv-header">
        <div className="ak-inv-brand">
          <div className="ak-inv-logo">AK</div>
          <div className="ak-inv-brand-text">
            <h2>AKATECH STUDIO</h2>
            <span>Agence Web · Abidjan, Côte d&apos;Ivoire</span>
          </div>
        </div>
        <div className="ak-inv-prestataire">
          <strong>M&apos;Bollo Aka Elvis</strong><br />
          Entreprise Individuelle<br />
          RCCM : [N° RCCM] · NCC : [N° NCC]<br />
          Abidjan, Côte d&apos;Ivoire<br />
          wthomasss06@gmail.com<br />
          +225 01 42 50 77 50
        </div>
      </div>

      <div className="ak-inv-title">
        <h1>FACTURE</h1>
        <p>Prestation de Services Digitaux</p>
      </div>

      <div className="ak-inv-meta-row">
        <div className="ak-inv-meta">
          <div><strong>N° Facture :</strong> {number || '—'}</div>
          <div><strong>Date d&apos;émission :</strong> {fmtDate(issueDate)}</div>
          <div><strong>Date d&apos;échéance :</strong> {fmtDate(dueDate)}</div>
          {contractRef ? <div><strong>Contrat réf. :</strong> {contractRef}</div> : null}
        </div>
        <div className="ak-inv-client">
          <div className="ak-inv-client-label">Facturé à</div>
          <div className="ak-inv-client-name">{clientName || '[Nom du client]'}</div>
          <div className="ak-inv-client-info">
            {clientAddress ? clientAddress.split('\n').map((line, i) => <span key={i}>{line}<br /></span>) : null}
            {clientPhone ? <>{clientPhone}<br /></> : null}
            {clientEmail ? <>{clientEmail}<br /></> : null}
            {clientRccm || ''}
          </div>
        </div>
      </div>

      <table className="ak-inv-table">
        <thead>
          <tr>
            <th style={{ width: '55%' }}>Description</th>
            <th style={{ width: '10%' }}>Qté</th>
            <th style={{ width: '17%' }}>Prix U.</th>
            <th style={{ width: '18%' }}>Total</th>
          </tr>
        </thead>
        <tbody>
          {lines.map((l, i) => (
            <tr key={i}>
              <td>{l.desc || '—'}</td>
              <td style={{ textAlign: 'center' }}>{l.qty}</td>
              <td style={{ textAlign: 'right' }}>{formatMoney(l.price, currency)}</td>
              <td style={{ textAlign: 'right' }}>{formatMoney((Number(l.qty) || 0) * (Number(l.price) || 0), currency)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="ak-inv-totals">
        <div className="ak-inv-total-row"><span>Sous-total HT</span><span>{formatMoney(subtotal, currency)}</span></div>
        {applyTva ? <div className="ak-inv-total-row"><span>TVA (18%)</span><span>{formatMoney(tvaAmount, currency)}</span></div> : null}
        {applyTimbre ? <div className="ak-inv-total-row"><span>Timbre fiscal</span><span>{formatMoney(timbreAmount, currency)}</span></div> : null}
        <div className="ak-inv-total-row grand"><span>TOTAL TTC</span><span>{formatMoney(total, currency)}</span></div>
        {deposit > 0 ? (
          <div className="ak-inv-total-row"><span>Acompte versé</span><span style={{ color: '#88ca53' }}>- {formatMoney(deposit, currency)}</span></div>
        ) : null}
        {deposit > 0 ? (
          <div className="ak-inv-total-row" style={{ borderTop: '2px solid #333', paddingTop: 10, marginTop: 6 }}>
            <span><strong>SOLDE À RÉGLER</strong></span><span><strong>{formatMoney(balance, currency)}</strong></span>
          </div>
        ) : null}
      </div>

      <div className="ak-inv-conditions">
        <h4>Conditions de paiement</h4>
        {(notes || '').split('\n').map((line, i) => <span key={i}>{line}<br /></span>)}
        {deposit > 0 ? (
          <><br /><strong>Acompte versé :</strong> {formatMoney(deposit, currency)} — <strong>Solde restant :</strong> {formatMoney(balance, currency)}</>
        ) : null}
      </div>

      <div className="ak-inv-signatures">
        <div className="ak-inv-sig-block">
          <h4>Pour AKATech Studio</h4>
          <div className="ak-inv-sig-line">M&apos;Bollo Aka Elvis — Fondateur<br /><em>Signature &amp; cachet</em></div>
        </div>
        <div className="ak-inv-sig-block">
          <h4>Pour le Client</h4>
          <div className="ak-inv-sig-line">{clientName || '[Nom et qualité]'}<br /><em>Signature &amp; cachet</em></div>
        </div>
      </div>

      <div className="ak-inv-footer">
        AKATech Studio — Facture établie conformément au contrat de prestation de services · {number || '—'}<br />
        Cette facture est due à sa date d&apos;émission. Aucun escompte pour paiement anticipé.
      </div>

      <style jsx>{`
        .ak-invoice { width: 210mm; min-height: 297mm; background: #fff; color: #1a1a1a; padding: 20mm; font-family: 'Inter', sans-serif; position: relative; }
        .ak-inv-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8mm; padding-bottom: 6mm; border-bottom: 2px solid #88ca53; }
        .ak-inv-brand { display: flex; align-items: center; gap: 12px; }
        .ak-inv-logo { width: 48px; height: 48px; background: #88ca53; border-radius: 10px; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 800; font-size: 18px; }
        .ak-inv-brand-text h2 { font-size: 22px; font-weight: 800; color: #1a1a1a; letter-spacing: -1px; line-height: 1; margin: 0; }
        .ak-inv-brand-text span { font-size: 11px; color: #666; font-weight: 500; }
        .ak-inv-prestataire { text-align: right; font-size: 10px; color: #555; line-height: 1.6; }
        .ak-inv-prestataire strong { color: #1a1a1a; font-size: 11px; }
        .ak-inv-title { background: #1a1a1a; color: #fff; padding: 10px 20px; border-radius: 8px; display: inline-block; margin-bottom: 6mm; }
        .ak-inv-title h1 { font-size: 24px; font-weight: 800; letter-spacing: 2px; margin: 0; }
        .ak-inv-title p { font-size: 10px; color: #88ca53; margin: 2px 0 0 0; font-weight: 600; }
        .ak-inv-meta-row { display: flex; justify-content: space-between; margin-bottom: 8mm; gap: 16px; }
        .ak-inv-meta { font-size: 10px; line-height: 1.8; color: #444; }
        .ak-inv-meta strong { color: #1a1a1a; display: inline-block; width: 110px; }
        .ak-inv-client { background: #f8f8f8; border: 1px solid #e0e0e0; border-left: 4px solid #88ca53; border-radius: 8px; padding: 12px 16px; min-width: 70mm; }
        .ak-inv-client-label { font-size: 9px; font-weight: 700; color: #88ca53; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px; }
        .ak-inv-client-name { font-size: 12px; font-weight: 700; color: #1a1a1a; margin-bottom: 4px; }
        .ak-inv-client-info { font-size: 9px; color: #666; line-height: 1.5; }
        .ak-inv-table { width: 100%; border-collapse: collapse; margin-bottom: 6mm; font-size: 10px; }
        .ak-inv-table thead th { background: #1a1a1a; color: #fff; padding: 10px 12px; text-align: left; font-weight: 700; font-size: 9px; text-transform: uppercase; letter-spacing: .5px; }
        .ak-inv-table thead th:last-child { text-align: right; }
        .ak-inv-table tbody td { padding: 10px 12px; border-bottom: 1px solid #eee; color: #333; vertical-align: top; }
        .ak-inv-table tbody tr:nth-child(even) { background: #fafafa; }
        .ak-inv-totals { width: 60mm; margin-left: auto; margin-bottom: 8mm; }
        .ak-inv-total-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 10px; color: #555; border-bottom: 1px solid #eee; }
        .ak-inv-total-row.grand { background: #1a1a1a; color: #fff; padding: 12px 14px; border-radius: 8px; margin-top: 8px; border: none; }
        .ak-inv-total-row.grand span:first-child { color: #88ca53; font-weight: 700; font-size: 11px; }
        .ak-inv-total-row.grand span:last-child { font-weight: 800; font-size: 14px; color: #88ca53; }
        .ak-inv-conditions { background: #f8f8f8; border-radius: 8px; padding: 14px 16px; margin-bottom: 8mm; font-size: 9px; line-height: 1.7; color: #555; }
        .ak-inv-conditions h4 { font-size: 10px; font-weight: 700; color: #1a1a1a; margin-bottom: 8px; text-transform: uppercase; letter-spacing: .5px; }
        .ak-inv-signatures { display: flex; justify-content: space-between; margin-top: 14mm; }
        .ak-inv-sig-block { width: 70mm; }
        .ak-inv-sig-block h4 { font-size: 10px; font-weight: 700; color: #1a1a1a; margin-bottom: 20px; }
        .ak-inv-sig-line { border-top: 1px solid #ccc; padding-top: 6px; font-size: 9px; color: #888; }
        .ak-inv-footer { margin-top: 10mm; text-align: center; font-size: 8px; color: #aaa; border-top: 1px solid #eee; padding-top: 8px; }
      `}</style>
    </div>
  )
})

export default InvoicePreview
