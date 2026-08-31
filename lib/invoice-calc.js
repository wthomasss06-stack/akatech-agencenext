// lib/invoice-calc.js
// Calculs de facture partagés entre le formulaire du dashboard (aperçu
// live, avant sauvegarde) et l'API (calcul définitif au moment de
// l'enregistrement, voir lib/db.js). Une seule fonction pour les deux
// évite tout écart entre ce que l'admin voit à l'écran et ce qui part
// réellement en base — le serveur ne fait jamais confiance aux totaux
// envoyés par le navigateur, il les recalcule toujours à partir des
// lignes brutes.
// Fonction pure (aucun import Prisma / navigateur) : utilisable telle
// quelle côté client comme côté serveur.

export const TVA_RATE = 0.18
export const TIMBRE_FCFA = 500

export function computeInvoiceTotals({ lines = [], applyTva = true, applyTimbre = true, deposit = 0 }) {
  const subtotal = lines.reduce((sum, l) => sum + (Number(l.qty) || 0) * (Number(l.price) || 0), 0)
  const tvaAmount = applyTva ? Math.round(subtotal * TVA_RATE) : 0
  const timbreAmount = applyTimbre ? TIMBRE_FCFA : 0
  const total = subtotal + tvaAmount + timbreAmount
  const balance = Math.max(0, total - (Number(deposit) || 0))
  return { subtotal, tvaAmount, timbreAmount, total, balance }
}

export function formatMoney(n, currency = 'FCFA') {
  return `${Math.round(Number(n) || 0).toLocaleString('fr-FR')} ${currency}`
}

// État de départ du formulaire "Nouvelle facture" — mêmes valeurs par
// défaut que l'outil HTML autonome (délai d'échéance à 14 jours,
// mentions de paiement standard), mais dates calculées à partir
// d'aujourd'hui plutôt qu'écrites en dur, pour que le formulaire reste
// correct au-delà de 2026.
export function emptyInvoiceForm() {
  const today = new Date()
  const due = new Date(today)
  due.setDate(due.getDate() + 14)
  const iso = (d) => d.toISOString().slice(0, 10)

  return {
    number: '',
    contractRef: '',
    issueDate: iso(today),
    dueDate: iso(due),
    clientName: '',
    clientAddress: '',
    clientPhone: '',
    clientEmail: '',
    clientRccm: '',
    currency: 'FCFA',
    lines: [{ desc: '', qty: 1, price: 0 }],
    applyTva: true,
    applyTimbre: true,
    deposit: 0,
    notes: 'Paiement par Orange Money, MTN MoMo, Wave ou virement bancaire. Tout retard entraîne des pénalités conformément au contrat.',
    status: 'ENVOYEE',
  }
}
