import React from 'react'
import * as ReactPDF from '@react-pdf/renderer'
import { getResend } from '@/lib/ai-providers'

const { Document, Page, Text, View, StyleSheet } = ReactPDF

const QUESTIONNAIRE_LABELS = {
  portfolio: 'Portfolio',
  vitrine_ecommerce: 'Vitrine e-commerce',
  saas: 'SaaS',
}

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 32,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#d6d3d1',
    paddingBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  meta: {
    fontSize: 10,
    color: '#4b5563',
    marginBottom: 4,
  },
  section: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  row: {
    marginBottom: 6,
  },
  label: {
    fontSize: 10,
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  value: {
    fontSize: 12,
    color: '#111827',
    lineHeight: 1.5,
  },
  quoteBox: {
    marginTop: 18,
    padding: 14,
    backgroundColor: '#f3f4f6',
    borderRadius: 10,
  },
  quoteTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
})

function escapeText(value) {
  if (value === null || value === undefined || value === '') return 'Non renseigné'
  if (Array.isArray(value)) return value.map((entry) => formatValue(entry)).join(', ')
  if (typeof value === 'object') {
    return Object.entries(value)
      .map(([key, nested]) => `${key}: ${formatValue(nested)}`)
      .join(' | ')
  }
  return String(value)
}

function formatValue(value) {
  if (value === null || value === undefined || value === '') return 'Non renseigné'
  if (Array.isArray(value)) return value.join(', ')
  if (typeof value === 'object') {
    if (typeof value.label === 'string') return value.label
    return Object.entries(value)
      .map(([key, nested]) => `${key}: ${formatValue(nested)}`)
      .join(' | ')
  }
  return String(value)
}

function normalizeQuestionnaireType(type) {
  const map = {
    portfolio: 'portfolio',
    vitrine_ecommerce: 'vitrine_ecommerce',
    saas: 'saas',
    PORTFOLIO: 'portfolio',
    VITRINE_ECOMMERCE: 'vitrine_ecommerce',
    SAAS: 'saas',
  }
  return map[String(type)] || 'portfolio'
}

function safeMoney(value) {
  const num = Number(value)
  if (!Number.isFinite(num)) return '0 FCFA'
  return `${num.toLocaleString('fr-FR')} FCFA`
}

export async function buildQuestionnairePdfBuffer(questionnaire, quote = null) {
  const normalizedType = normalizeQuestionnaireType(questionnaire?.type)
  const answers = questionnaire?.answers && typeof questionnaire.answers === 'object' ? questionnaire.answers : {}

  const doc = React.createElement(
    Document,
    null,
    React.createElement(
      Page,
      { size: 'A4', style: styles.page },
      React.createElement(
        View,
        { style: styles.header },
        React.createElement(Text, { style: styles.title }, `Devis AKATech — ${QUESTIONNAIRE_LABELS[normalizedType] || 'Projet'}`),
        React.createElement(Text, { style: styles.meta }, `Token: ${questionnaire?.token || 'inconnu'}`),
        React.createElement(Text, { style: styles.meta }, `Statut: ${questionnaire?.status || 'STARTED'}`),
        React.createElement(Text, { style: styles.meta }, `Date: ${new Date(questionnaire?.createdAt || Date.now()).toLocaleString('fr-FR', { timeZone: 'Africa/Abidjan' })}`),
      ),
      React.createElement(
        View,
        { style: styles.section },
        React.createElement(Text, { style: styles.sectionTitle }, 'Coordonnées'),
        React.createElement(Text, { style: styles.label }, 'Nom / société'),
        React.createElement(Text, { style: styles.value }, escapeText(questionnaire?.contactName || 'Non renseigné')),
        React.createElement(Text, { style: styles.label }, 'Contact'),
        React.createElement(Text, { style: styles.value }, escapeText(questionnaire?.contactHandle || 'Non renseigné')),
      ),
      Object.entries(answers).length > 0 &&
        React.createElement(
          View,
          { style: styles.section },
          React.createElement(Text, { style: styles.sectionTitle }, 'Réponses'),
          ...Object.entries(answers).map(([key, value]) =>
            React.createElement(
              View,
              { key, style: styles.row },
              React.createElement(Text, { style: styles.label }, key.replace(/_/g, ' ')),
              React.createElement(Text, { style: styles.value }, escapeText(value)),
            ),
          ),
        ),
      quote &&
        React.createElement(
          View,
          { style: styles.quoteBox },
          React.createElement(Text, { style: styles.quoteTitle }, 'Devis estimé'),
          React.createElement(Text, { style: styles.label }, 'Catégorie'),
          React.createElement(Text, { style: styles.value }, quote.category || 'Non renseigné'),
          React.createElement(Text, { style: styles.label }, 'Tier'),
          React.createElement(Text, { style: styles.value }, quote.tier || 'Non renseigné'),
          React.createElement(Text, { style: styles.label }, 'Prix estimé'),
          React.createElement(Text, { style: styles.value }, `${safeMoney(quote.priceMinFCFA)}${quote.priceMinFCFA !== quote.priceMaxFCFA ? ` – ${safeMoney(quote.priceMaxFCFA)}` : ''}`),
          React.createElement(Text, { style: styles.label }, 'Raison'),
          React.createElement(Text, { style: styles.value }, escapeText(quote.rationale || 'Non renseigné')),
        ),
    ),
  )

  const stream = await ReactPDF.renderToStream(doc)
  const chunks = []
  for await (const chunk of stream) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
  }
  return Buffer.concat(chunks)
}

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export async function sendQuestionnaireEmail({ questionnaire, quote, mode = 'submitted' }) {
  if (!process.env.RESEND_API_KEY) return null

  const payload = questionnaire || {}
  const normalizedType = normalizeQuestionnaireType(payload.type)
  const typeLabel = QUESTIONNAIRE_LABELS[normalizedType] || 'Projet'
  const subject = mode === 'accepted'
    ? `🔥 Devis accepté — ${typeLabel}`
    : `📄 Nouveau devis AKATech — ${typeLabel}`

  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif; background:#0b1220; color:#f3f4f6; padding:24px; max-width:640px; margin:0 auto;">
      <div style="background:#111827; border:1px solid #2f3644; border-radius:12px; padding:24px;">
        <div style="font-size:12px; color:#9ae6b4; font-weight:700; letter-spacing:0.12em; text-transform:uppercase; margin-bottom:12px;">
          AKATech • ${mode === 'accepted' ? 'Acceptation' : 'Nouveau devis'}
        </div>
        <h2 style="margin:0 0 8px; font-size:22px;">${escapeHtml(typeLabel)}</h2>
        <p style="margin:0 0 16px; color:#d1d5db; line-height:1.6;">
          Prospect: <strong>${escapeHtml(payload.contactName || 'Non renseigné')}</strong><br />
          Contact: <strong>${escapeHtml(payload.contactHandle || 'Non renseigné')}</strong><br />
          Statut: <strong>${escapeHtml(payload.status || 'QUOTED')}</strong>
        </p>
        ${quote ? `
          <div style="background:#1f2937; border:1px solid #374151; border-radius:10px; padding:16px; margin-top:12px;">
            <div style="font-size:11px; color:#9ca3af; text-transform:uppercase; letter-spacing:0.08em; margin-bottom:8px;">Devis estimé</div>
            <div style="font-size:20px; font-weight:700; color:#f9fafb; margin-bottom:4px;">${escapeHtml(quote.tier || 'Tier non renseigné')}</div>
            <div style="color:#d1fae5; font-size:15px; font-weight:600;">${escapeHtml(safeMoney(quote.priceMinFCFA))}${quote.priceMinFCFA !== quote.priceMaxFCFA ? ` – ${escapeHtml(safeMoney(quote.priceMaxFCFA))}` : ''}</div>
          </div>
        ` : ''}
        <p style="margin-top:18px; color:#d1d5db; line-height:1.6;">
          Une version PDF du questionnaire et du devis est jointe à cet email.
        </p>
      </div>
    </div>
  `

  const buffer = await buildQuestionnairePdfBuffer(payload, quote)
  const result = await getResend().emails.send({
    from: process.env.FROM_EMAIL ?? 'onboarding@resend.dev',
    to: process.env.ADMIN_EMAIL ?? 'wthomasss06@gmail.com',
    subject,
    html,
    attachments: [{
      filename: `${payload.token || 'questionnaire'}-${mode === 'accepted' ? 'accepted' : 'submitted'}.pdf`,
      content: buffer.toString('base64'),
    }],
  })

  return result
}
