// components/dashboard/InvoicePreview.js
// Gabarit visuel de la facture — reproduit le pattern de
// Exemple_Facture_AKATech.svg (fond ivoire, liseré vert en bordure
// gauche, libellés "// XXX" en vert, encart "Net à payer" en vert
// plein) plutôt que l'ancien gabarit boîte noire + logo "AK".
//
// Police de marque : 'Bitcount Prop Single' (display, Google Fonts) —
// choisie dans le mockup fourni. Chargée globalement dans
// app/globals.css (comme Barlow Condensed / JetBrains Mono) plutôt
// qu'en `<style jsx>` local : styled-jsx gère mal `@import` dans un
// bloc scopé, `globals.css` est le seul endroit qui la charge déjà
// pour les autres polices du site.
//
// `forwardRef` : le parent (InvoicesTab) a besoin d'une référence DOM
// directe vers la facture, à taille réelle, pour la passer telle
// quelle à html2canvas lors du téléchargement PNG/PDF.
'use client'
import { forwardRef } from 'react'
import { formatMoney } from '@/lib/invoice-calc'

// Parse manuel de "YYYY-MM-DD" avec le constructeur Date local (pas
// `new Date("YYYY-MM-DD")`, qui est interprété en UTC et peut afficher
// le jour précédent selon le fuseau du navigateur).
function fmtDateLong(isoDateStr) {
  if (!isoDateStr) return ''
  const [y, m, d] = isoDateStr.split('-').map(Number)
  if (!y || !m || !d) return ''
  const dt = new Date(y, m - 1, d)
  return dt.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}

// Montants du tableau de lignes : sans devise, déjà donnée par l'en-tête
// de colonne ("MONTANT HT") — seuls les totaux la répètent.
function fmtBare(n) {
  return Math.round(Number(n) || 0).toLocaleString('fr-FR')
}

const InvoicePreview = forwardRef(function InvoicePreview({
  number, contractRef, issueDate, dueDate,
  clientName, clientAddress, clientPhone, clientEmail, clientRccm,
  currency, lines, applyTva, applyTimbre, deposit, notes, totals,
}, ref) {
  const { subtotal, tvaAmount, timbreAmount, total, balance } = totals
  const depositNum = Number(deposit) || 0
  // Badge "Facture de solde" affiché seulement pour un acompte partiel
  // (0 < acompte < total) — sinon ce n'est ni un solde ni pertinent.
  const depositPct = total > 0 ? Math.round((depositNum / total) * 100) : 0
  const showSoldeBadge = depositNum > 0 && depositNum < total

  return (
    <div className="ak-invoice" ref={ref}>
      <div className="ak-bar" />

      <div className="ak-header">
        <div className="ak-brand">
          <h2 className="ak-brand-name">AKATECH STUDIO</h2>
          <div className="ak-brand-tag">Agence Web — Abidjan, Côte d&apos;Ivoire</div>
        </div>
        <div className="ak-meta">
          <div className="ak-label">// Facture</div>
          <div className="ak-meta-number">N° {number || '—'}</div>
          {contractRef ? <div className="ak-meta-sub">Contrat : {contractRef}</div> : null}
          {showSoldeBadge ? (
            <div className="ak-badge">Facture de solde · {depositPct}%</div>
          ) : null}
          <div className="ak-meta-dates">
            <div>Émise le {fmtDateLong(issueDate)}</div>
            <div>Échéance : {dueDate ? fmtDateLong(dueDate) : 'à réception'}</div>
          </div>
        </div>
      </div>

      <div className="ak-divider" />

      <div className="ak-parties">
        <div className="ak-party">
          <div className="ak-label">// Émetteur</div>
          <div className="ak-party-name">AKATech Studio</div>
          <div className="ak-party-line">M&apos;Bollo Aka Elvis — Entreprise Individuelle</div>
          <div className="ak-party-line">Abidjan, Côte d&apos;Ivoire</div>
          <div className="ak-party-line">wthomasss06@gmail.com · +225 01 42 50 77 50</div>
          <div className="ak-party-fine">RCCM : [N° RCCM] · NCC : [N° NCC]</div>
        </div>
        <div className="ak-party">
          <div className="ak-label">// Facturé à</div>
          <div className="ak-party-name">{clientName || '[Nom du client]'}</div>
          {clientAddress
            ? clientAddress.split('\n').map((l, i) => <div className="ak-party-line" key={i}>{l}</div>)
            : null}
          {(clientPhone || clientEmail) ? (
            <div className="ak-party-line">{[clientEmail, clientPhone].filter(Boolean).join(' · ')}</div>
          ) : null}
          {clientRccm ? <div className="ak-party-fine">{clientRccm}</div> : null}
        </div>
      </div>

      <table className="ak-table">
        <thead>
          <tr>
            <th className="ak-col-desc">Prestation</th>
            <th className="ak-col-num">Qté</th>
            <th className="ak-col-num">PU HT</th>
            <th className="ak-col-num ak-col-total">Montant HT</th>
          </tr>
        </thead>
        <tbody>
          {lines.map((l, i) => (
            <tr key={i}>
              <td className="ak-col-desc">
                <div className="ak-item-title">{l.desc || '—'}</div>
                {l.detail ? <div className="ak-item-detail">{l.detail}</div> : null}
              </td>
              <td className="ak-col-num">{l.qty}</td>
              <td className="ak-col-num">{fmtBare(l.price)}</td>
              <td className="ak-col-num ak-col-total">{fmtBare((Number(l.qty) || 0) * (Number(l.price) || 0))}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="ak-close-rule" />

      <div className="ak-totals">
        <div className="ak-total-row">
          <span className="ak-tot-label">Sous-total HT</span>
          <span className="ak-tot-value">{formatMoney(subtotal, currency)}</span>
        </div>

        {applyTva ? (
          <div className="ak-total-row">
            <span className="ak-tot-label">TVA (18%)</span>
            <span className="ak-tot-value">{formatMoney(tvaAmount, currency)}</span>
          </div>
        ) : (
          <div className="ak-total-row">
            <span className="ak-tot-label">TVA — régime de l&apos;impôt synthétique</span>
            <span className="ak-tot-value ak-italic">non applicable</span>
          </div>
        )}

        {applyTimbre ? (
          <div className="ak-total-row">
            <span className="ak-tot-label">Timbre fiscal</span>
            <span className="ak-tot-value">{formatMoney(timbreAmount, currency)}</span>
          </div>
        ) : null}

        <div className="ak-total-rule" />

        <div className="ak-total-row ak-total-ttc">
          <span>TOTAL TTC</span>
          <span>{formatMoney(total, currency)}</span>
        </div>

        {depositNum > 0 ? (
          <div className="ak-total-row">
            <span className="ak-tot-label">Acompte versé ({depositPct}%, à la commande)</span>
            <span className="ak-tot-value">− {formatMoney(depositNum, currency)}</span>
          </div>
        ) : null}

        <div className="ak-net-box">
          <span>Net à payer</span>
          <span>{formatMoney(balance, currency)}</span>
        </div>
      </div>

      <div className="ak-modalites">
        <div className="ak-label">// Modalités</div>
        {(notes || '').split('\n').map((l, i) => (
          <div key={i} className={i === 0 ? 'ak-modal-line' : 'ak-modal-line ak-modal-sub'}>{l}</div>
        ))}
      </div>

      <div className="ak-footer">
        <div className="ak-footer-rule" />
        <div className="ak-thanks">Merci pour votre confiance.</div>
        <div className="ak-legal">Facture émise conformément aux mentions légales en vigueur en République de Côte d&apos;Ivoire.</div>
      </div>

      <style jsx>{`
        .ak-invoice {
          width: 210mm; min-height: 297mm; background: #FAFAF8; color: #1A1A1A;
          padding: 20mm 16.8mm 16mm; font-family: Helvetica, Arial, sans-serif;
          position: relative; box-sizing: border-box;
        }
        .ak-bar { position: absolute; left: 0; top: 0; bottom: 0; width: 10px; background: #88CA53; }

        .ak-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; }
        .ak-brand-name { font-family: 'Bitcount Prop Single', Helvetica, Arial, sans-serif; font-size: 30px; font-weight: 700; color: #1A1A1A; margin: 0; line-height: 1; }
        .ak-brand-tag { font-size: 13px; font-style: italic; color: #767676; margin-top: 9px; }

        .ak-meta { text-align: right; flex-shrink: 0; }
        .ak-label { font-size: 11px; letter-spacing: 2px; font-weight: 700; color: #5B8C3A; text-transform: uppercase; }
        .ak-meta-number { font-size: 17px; font-weight: 700; color: #1A1A1A; margin-top: 8px; }
        .ak-meta-sub { font-size: 11px; color: #9A9A9A; margin-top: 4px; }
        .ak-badge { display: inline-block; margin-top: 10px; padding: 6px 14px; border-radius: 12.5px; background: #EAF3E3; color: #5B8C3A; font-size: 11px; font-weight: 700; letter-spacing: .5px; text-transform: uppercase; }
        .ak-meta-dates { font-size: 12.5px; color: #767676; margin-top: 12px; line-height: 1.6; }

        .ak-divider { height: 2px; background: #88CA53; margin: 18px 0 24px; }

        .ak-parties { display: flex; gap: 24px; margin-bottom: 42px; }
        .ak-party { flex: 1; min-width: 0; }
        .ak-party-name { font-size: 15px; font-weight: 700; color: #1A1A1A; margin-top: 10px; }
        .ak-party-line { font-size: 12.5px; color: #767676; margin-top: 7px; }
        .ak-party-fine { font-size: 11px; color: #9A9A9A; margin-top: 7px; }

        .ak-table { width: 100%; border-collapse: collapse; }
        .ak-table thead th { border-top: 1.2px solid #1A1A1A; border-bottom: 1.2px solid #1A1A1A; padding: 8px 0 10px; text-align: left; font-size: 11.5px; letter-spacing: 1px; font-weight: 700; color: #1A1A1A; text-transform: uppercase; }
        .ak-table .ak-col-num { text-align: right; width: 15%; }
        .ak-table .ak-col-desc { width: 55%; }
        .ak-table tbody td { padding: 18px 0 14px; vertical-align: top; border-bottom: 1px solid #E5E5E0; font-size: 13.5px; color: #1A1A1A; }
        .ak-table tbody tr:last-child td { border-bottom: none; }
        .ak-item-title { font-size: 14px; font-weight: 600; color: #1A1A1A; }
        .ak-item-detail { font-size: 11.5px; color: #767676; margin-top: 5px; }
        .ak-col-total { font-weight: 600; }

        .ak-close-rule { height: 2px; background: #88CA53; margin-top: 4px; margin-bottom: 34px; }

        .ak-totals { width: 62%; margin-left: auto; }
        .ak-total-row { display: flex; justify-content: space-between; gap: 12px; padding: 6px 0; }
        .ak-tot-label { font-size: 13px; color: #767676; }
        .ak-tot-value { font-size: 13px; font-weight: 600; color: #1A1A1A; white-space: nowrap; }
        .ak-italic { font-style: italic; font-weight: 400; }
        .ak-total-rule { height: 1px; background: #D8D8D2; margin: 12px 0; }
        .ak-total-ttc { font-size: 14.5px; font-weight: 700; color: #1A1A1A; padding: 4px 0 14px; }
        .ak-net-box { display: flex; justify-content: space-between; align-items: center; background: #5B8C3A; color: #fff; border-radius: 8px; padding: 16px 20px; margin-top: 14px; font-size: 15px; font-weight: 700; letter-spacing: .5px; text-transform: uppercase; }
        .ak-net-box span:last-child { font-size: 21px; letter-spacing: 0; text-transform: none; }

        .ak-modalites { margin-top: 56px; }
        .ak-modal-line { font-size: 12.5px; color: #1A1A1A; margin-top: 10px; }
        .ak-modal-sub { color: #767676; }

        .ak-footer { margin-top: 56px; }
        .ak-footer-rule { height: 1.5px; background: #88CA53; margin-bottom: 22px; }
        .ak-thanks { text-align: center; font-size: 14.5px; font-style: italic; color: #5B8C3A; }
        .ak-legal { text-align: center; font-size: 10.5px; color: #9A9A9A; margin-top: 14px; }
      `}</style>
    </div>
  )
})

export default InvoicePreview
