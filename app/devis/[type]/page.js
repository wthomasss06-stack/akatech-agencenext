'use client'

import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { QUESTIONNAIRES, QUESTIONNAIRE_TYPES } from '@/lib/questionnaires-schema'

const VALID_TYPES = Object.keys(QUESTIONNAIRES)

function fieldIsVisible(field, answers) {
  if (!field?.showIf) return true

  const ref = answers[field.showIf.field]
  if (field.showIf.equals !== undefined) return ref === field.showIf.equals
  if (field.showIf.includes !== undefined) {
    if (Array.isArray(ref)) return ref.includes(field.showIf.includes)
    return String(ref ?? '').includes(String(field.showIf.includes))
  }

  return true
}

function buildFieldValue(currentValue, field, nextValue) {
  if (field.type === 'checkboxes') {
    const arr = Array.isArray(currentValue) ? currentValue : []
    return arr.includes(nextValue)
      ? arr.filter((value) => value !== nextValue)
      : [...arr, nextValue]
  }

  return nextValue
}

export default function DevisTypePage({ params }) {
  const searchParams = useSearchParams()
  const type = String(params?.type || '').toLowerCase()
  const token = searchParams.get('t') || ''
  const schema = QUESTIONNAIRES[type]
  const [answers, setAnswers] = useState({})
  const [loading, setLoading] = useState(Boolean(token))
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(null)

  useEffect(() => {
    if (!token || !schema) return

    let mounted = true
    setLoading(true)
    setError('')

    fetch(`/api/questionnaire/${token}`)
      .then(async (res) => {
        if (!res.ok) {
          const payload = await res.json().catch(() => ({}))
          throw new Error(payload.error || 'Questionnaire introuvable')
        }

        const payload = await res.json()
        if (!mounted) return
        setAnswers(payload.questionnaire?.answers || {})
      })
      .catch((err) => {
        if (!mounted) return
        setError(err.message || 'Impossible de charger le questionnaire.')
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [schema, token])

  const visibleSections = useMemo(() => {
    if (!schema) return []
    return schema.sections.map((section) => ({
      ...section,
      fields: section.fields.filter((field) => fieldIsVisible(field, answers)),
    }))
  }, [answers, schema])

  const updateAnswer = (fieldId, value) => {
    setAnswers((prev) => ({ ...prev, [fieldId]: value }))
  }

  const handleChange = (field, value) => {
    const nextValue = field.type === 'checkboxes'
      ? buildFieldValue(answers[field.id], field, value)
      : value

    updateAnswer(field.id, nextValue)
  }

  const handleSubmit = async () => {
    if (!token) {
      setError('Token de questionnaire manquant.')
      return
    }

    setSubmitting(true)
    setError('')
    setSuccess(null)

    try {
      const res = await fetch(`/api/questionnaire/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answers,
          contactName: answers.full_name_job || answers.company_name || answers.responsible_name_role || null,
          contactHandle: answers.whatsapp || answers.phone || null,
        }),
      })

      const payload = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(payload.error || 'Soumission impossible.')
      }

      setSuccess({
        title: 'Questionnaire soumis',
        description: 'Votre devis a bien été généré. Vous pouvez maintenant accepter ou refuser l’offre.',
        quote: payload.quote,
      })
    } catch (err) {
      setError(err.message || 'Erreur inconnue')
    } finally {
      setSubmitting(false)
    }
  }

  if (!schema) {
    return (
      <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#0c1015', color: '#fff', padding: '2rem' }}>
        <div style={{ maxWidth: 520, textAlign: 'center', padding: '2rem', borderRadius: 20, background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Type de devis introuvable</h1>
          <p style={{ color: '#c7d0d9', lineHeight: 1.7 }}>
            Le type de questionnaire demandé n’existe pas. Vérifiez le lien ou choisissez une option valide parmi le portfolio, la vitrine e-commerce ou le SaaS.
          </p>
          <div style={{ marginTop: '1.25rem', display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            {VALID_TYPES.map((item) => (
              <a key={item} href={`/devis/${item}?t=${encodeURIComponent(token)}`} style={{ color: '#fff', background: '#88ca53', borderRadius: 999, padding: '0.7rem 1rem', textDecoration: 'none', fontWeight: 700 }}>
                {QUESTIONNAIRE_TYPES[item]}
              </a>
            ))}
          </div>
        </div>
      </main>
    )
  }

  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0a0f14 0%, #111827 100%)', color: '#fff', padding: '4rem 1.25rem' }}>
      <div style={{ maxWidth: 1120, margin: '0 auto' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '.75rem', letterSpacing: '.12em', textTransform: 'uppercase', color: '#a4d96c', fontWeight: 700 }}>
            {QUESTIONNAIRE_TYPES[type] || schema.label}
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', margin: '0.4rem 0 0.8rem', fontWeight: 800 }}>
            Questionnaire de devis
          </h1>
          <p style={{ color: '#d7dee6', maxWidth: 760, lineHeight: 1.7, margin: 0 }}>
            {schema.intro}
          </p>
        </div>

        {!token && (
          <div style={{ background: 'rgba(239,68,68,.12)', border: '1px solid rgba(239,68,68,.35)', borderRadius: 18, padding: '1rem 1.2rem', color: '#fecaca', marginBottom: '1.5rem' }}>
            Ce formulaire est protégé par un token de sécurité. Le lien du questionnaire est invalide ou incomplet.
          </div>
        )}

        {error && (
          <div style={{ background: 'rgba(239,68,68,.12)', border: '1px solid rgba(239,68,68,.35)', borderRadius: 18, padding: '1rem 1.2rem', color: '#fecaca', marginBottom: '1.5rem' }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{ background: 'rgba(34,197,94,.12)', border: '1px solid rgba(34,197,94,.35)', borderRadius: 18, padding: '1rem 1.2rem', color: '#dcfce7', marginBottom: '1.5rem' }}>
            <h2 style={{ margin: '0 0 .4rem', fontSize: '1.2rem' }}>{success.title}</h2>
            <p style={{ margin: '0 0 .8rem', color: '#dcfce7' }}>{success.description}</p>
            {success.quote && (
              <div style={{ background: 'rgba(6,95,70,.25)', borderRadius: 12, padding: '.9rem 1rem' }}>
                <div style={{ fontWeight: 700 }}>Devis estimé</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '.35rem' }}>
                  {success.quote.priceLabel || `${success.quote.priceMinFCFA?.toLocaleString('fr-FR') || 0} FCFA`}
                </div>
                {success.quote.positioningPitch && (
                  <p style={{ margin: '.8rem 0 0', lineHeight: 1.6, color: '#f0fdf4' }}>{success.quote.positioningPitch}</p>
                )}
              </div>
            )}
          </div>
        )}

        <div style={{ display: 'grid', gap: '1.25rem' }}>
          {visibleSections.map((section) => (
            <section key={section.title} style={{ background: 'rgba(17,24,39,.76)', border: '1px solid rgba(148,163,184,.22)', borderRadius: 22, padding: '1.5rem', boxShadow: '0 25px 50px rgba(15,23,42,.35)' }}>
              <h2 style={{ margin: '0 0 1rem', fontSize: '1.2rem' }}>{section.title}</h2>
              <div style={{ display: 'grid', gap: '1rem' }}>
                {section.fields.map((field) => {
                  const currentValue = answers[field.id]
                  const fieldLabel = <label htmlFor={field.id} style={{ display: 'block', marginBottom: '.45rem', fontWeight: 600, color: '#e5eef9' }}>{field.label}{field.required ? ' *' : ''}</label>

                  return (
                    <div key={field.id} style={{ display: 'grid', gap: '.5rem' }}>
                      {fieldLabel}

                      {field.type === 'textarea' && (
                        <textarea
                          id={field.id}
                          value={typeof currentValue === 'string' ? currentValue : ''}
                          onChange={(event) => handleChange(field, event.target.value)}
                          required={field.required}
                          rows={5}
                          style={{ width: '100%', minHeight: 120, resize: 'vertical', borderRadius: 12, border: '1px solid rgba(148,163,184,.35)', background: '#0f172a', color: '#fff', padding: '0.9rem 1rem' }}
                        />
                      )}

                      {(field.type === 'text' || field.type === 'email' || field.type === 'phone') && (
                        <input
                          id={field.id}
                          type={field.type === 'email' ? 'email' : field.type === 'phone' ? 'tel' : 'text'}
                          value={typeof currentValue === 'string' ? currentValue : ''}
                          onChange={(event) => handleChange(field, event.target.value)}
                          required={field.required}
                          style={{ width: '100%', borderRadius: 12, border: '1px solid rgba(148,163,184,.35)', background: '#0f172a', color: '#fff', padding: '0.9rem 1rem' }}
                        />
                      )}

                      {field.type === 'radio' && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.7rem' }}>
                          {field.options.map((option) => (
                            <label key={option} style={{ display: 'inline-flex', alignItems: 'center', gap: '.55rem', padding: '.6rem .8rem', borderRadius: 12, border: '1px solid rgba(148,163,184,.25)', background: currentValue === option ? 'rgba(136,202,83,.12)' : 'rgba(15,23,42,.7)', cursor: 'pointer' }}>
                              <input
                                type="radio"
                                name={field.id}
                                checked={currentValue === option}
                                onChange={() => handleChange(field, option)}
                              />
                              <span>{option}</span>
                            </label>
                          ))}
                        </div>
                      )}

                      {field.type === 'checkboxes' && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.7rem' }}>
                          {field.options.map((option) => {
                            const checked = Array.isArray(currentValue) && currentValue.includes(option)
                            return (
                              <label key={option} style={{ display: 'inline-flex', alignItems: 'center', gap: '.55rem', padding: '.6rem .8rem', borderRadius: 12, border: '1px solid rgba(148,163,184,.25)', background: checked ? 'rgba(136,202,83,.12)' : 'rgba(15,23,42,.7)', cursor: 'pointer' }}>
                                <input
                                  type="checkbox"
                                  checked={checked}
                                  onChange={() => handleChange(field, option)}
                                />
                                <span>{option}</span>
                              </label>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </section>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting || !token}
            style={{
              border: 'none',
              borderRadius: 999,
              background: 'linear-gradient(135deg, #88ca53, #4f8a2b)',
              color: '#fff',
              fontWeight: 700,
              padding: '0.9rem 1.5rem',
              cursor: submitting || !token ? 'not-allowed' : 'pointer',
              opacity: submitting || !token ? 0.7 : 1,
            }}
          >
            {submitting ? 'Soumission…' : 'Soumettre le questionnaire'}
          </button>
        </div>

        {loading && (
          <div style={{ textAlign: 'center', color: '#d7dee6', marginTop: '1rem' }}>Chargement du questionnaire…</div>
        )}
      </div>
    </main>
  )
}
