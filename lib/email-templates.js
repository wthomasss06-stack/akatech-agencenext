/**
 * Gabarits des e-mails envoyés à l'administrateur AKATech.
 * Fonctions pures (aucun envoi) : { subject, html, text }. Les valeurs sont
 * passées BRUTES — lib/email-layout.js échappe tout ce qui entre dans le HTML.
 * Les alertes visiteurs / intention de devis sont rendues dans
 * lib/email-notifications.js avec les mêmes briques.
 */
import { PROJECT_TYPE_LABELS } from '@/lib/data'
import {
  asText,
  cleanLine,
  emailButton,
  emailFields,
  emailHighlight,
  emailQuote,
  emailStack,
  getSiteUrl,
  renderEmailLayout,
} from '@/lib/email-layout'

const EMAIL_PATTERN = /^[^\s@<>"']+@[^\s@<>"']+\.[^\s@<>"']+$/

function projectTypeLabel(projectType, fallback) {
  return cleanLine(PROJECT_TYPE_LABELS[projectType] || projectType || fallback, 80)
}

/** Formulaire de contact du site (app/api/contact). */
export function buildContactEmail({ name, email, phone = '', projectType = '', budget = '', message = '' }) {
  const displayName = cleanLine(name, 100)
  const firstName = cleanLine(asText(name).split(' ')[0], 40)
  const projectLabel = projectTypeLabel(projectType, '—')
  const phoneDigits = asText(phone).replace(/[^\d+]/g, '')
  const budgetLabel = cleanLine(budget, 100) || 'Non précisé'

  const html = renderEmailLayout({
    preheader: `${displayName} — ${projectLabel}`,
    eyebrow: 'Formulaire de contact',
    title: displayName,
    badge: projectLabel,
    subtitle: 'Nouvelle demande reçue via le formulaire de contact du site.',
    body: emailStack(
      emailFields([
        ['Email', email, { href: `mailto:${email}` }],
        ['WhatsApp / Tél', phone || '—', phoneDigits.length >= 6 ? { href: `tel:${phoneDigits}` } : undefined],
        ['Budget estimé', budgetLabel],
      ]),
      emailQuote('Description du projet', message),
      emailButton(`Répondre à ${firstName}`, `mailto:${email}`),
    ),
    footerNote: 'Envoyé depuis le formulaire de contact du site',
  })
  const text = [
    `Nouvelle demande de contact — ${displayName} (${projectLabel})`,
    '',
    `Email : ${email}`,
    `WhatsApp / Tél : ${phone || '—'}`,
    `Budget estimé : ${budgetLabel}`,
    '',
    asText(message),
  ].join('\n')

  return { subject: `🚀 Nouveau projet — ${displayName} (${projectLabel})`, html, text }
}

/** Prospect qualifié par l'assistant IA (app/api/assistant) — arguments issus du modèle, donc non fiables. */
export function buildLeadEmail(lead = {}) {
  const name = cleanLine(lead.name, 100) || 'Prospect'
  const contact = cleanLine(lead.contact, 200) || 'Non précisé'
  const projectLabel = projectTypeLabel(lead.project_type, 'Non précisé')
  const budget = cleanLine(lead.budget_range, 100) || 'Non précisé'
  const timeline = cleanLine(lead.timeline, 100) || 'Non précisé'
  const summary = asText(lead.summary).slice(0, 2000)
  const dashboardUrl = `${getSiteUrl()}/dashboard`

  const html = renderEmailLayout({
    preheader: `${name} — ${projectLabel} — ${budget}`,
    eyebrow: 'Lead assistant IA',
    title: name,
    badge: projectLabel,
    subtitle: 'Nouveau prospect qualifié par l’assistant du site.',
    body: emailStack(
      emailFields([
        ['Contact', contact, EMAIL_PATTERN.test(contact) ? { href: `mailto:${contact}` } : undefined],
        ['Budget', budget],
        ['Délai souhaité', timeline],
      ]),
      emailQuote('Résumé du besoin', summary),
      emailButton('Voir dans le dashboard', dashboardUrl),
    ),
    footerNote: 'Capturé par l’assistant IA du site',
  })
  const text = [
    `Lead assistant IA — ${name} (${projectLabel})`,
    '',
    `Contact : ${contact}`,
    `Budget : ${budget}`,
    `Délai souhaité : ${timeline}`,
    '',
    summary,
    '',
    `Dashboard : ${dashboardUrl}`,
  ].join('\n')

  return { subject: `🤖 Lead assistant IA — ${name} (${projectLabel})`, html, text }
}

/** Questionnaire soumis / devis accepté (lib/questionnaire-pdf.js). `priceRange` est déjà formaté. */
export function buildQuoteEmail({ accepted = false, typeLabel, contactName, contactHandle, status, tier, priceRange = '', hasQuote = false }) {
  const type = cleanLine(typeLabel, 80) || 'Projet'
  const prospect = cleanLine(contactName, 100) || 'Non renseigné'
  const handle = cleanLine(contactHandle, 200) || 'Non renseigné'
  const statusLabel = cleanLine(status, 40) || 'QUOTED'
  const tierLabel = cleanLine(tier, 120) || 'Tier non renseigné'
  const dashboardUrl = `${getSiteUrl()}/dashboard`

  const html = renderEmailLayout({
    preheader: `${type} — ${prospect}`,
    eyebrow: accepted ? 'Devis accepté' : 'Nouveau devis',
    title: type,
    subtitle: 'Une version PDF du questionnaire et du devis est jointe à cet e-mail.',
    body: emailStack(
      emailFields([
        ['Prospect', prospect],
        ['Contact', handle],
        ['Statut', statusLabel],
      ]),
      hasQuote ? emailHighlight({ label: 'Devis estimé', title: tierLabel, value: priceRange }) : '',
      emailButton('Ouvrir le dashboard', dashboardUrl),
    ),
    footerNote: accepted ? 'Le prospect a accepté le devis' : 'Questionnaire soumis depuis le site',
  })
  const text = [
    `${accepted ? 'Devis accepté' : 'Nouveau devis AKATech'} — ${type}`,
    '',
    `Prospect : ${prospect}`,
    `Contact : ${handle}`,
    `Statut : ${statusLabel}`,
    ...(hasQuote ? ['', `Devis estimé : ${tierLabel}${priceRange ? ` — ${priceRange}` : ''}`] : []),
    '',
    'Une version PDF du questionnaire et du devis est jointe à cet e-mail.',
    `Dashboard : ${dashboardUrl}`,
  ].join('\n')

  return { html, text }
}
