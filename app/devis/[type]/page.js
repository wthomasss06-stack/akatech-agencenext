'use client'

import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { QUESTIONNAIRES, QUESTIONNAIRE_TYPES } from '@/lib/questionnaires-schema'
import { useTheme } from '@/lib/theme'

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
  const T = useTheme()
  const searchParams = useSearchParams()
  const type = String(params?.type || '').toLowerCase()
  const token = searchParams.get('t') || ''
  const schema = QUESTIONNAIRES[type]
  const [answers, setAnswers] = useState({})
  const [loading, setLoading] = useState(Boolean(token))
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(null)
  const [deciding, setDeciding] = useState(false)

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
        const questionnaire = payload.questionnaire
        setAnswers(questionnaire?.answers || {})
        if (questionnaire?.quote && ['QUOTED', 'ACCEPTED', 'DECLINED'].includes(questionnaire.status)) {
          setSuccess({
            title: questionnaire.status === 'ACCEPTED' ? 'Offre acceptée' : questionnaire.status === 'DECLINED' ? 'Offre refusée' : 'Questionnaire déjà soumis',
            description: questionnaire.status === 'ACCEPTED'
              ? 'Merci. AKATech a bien reçu votre acceptation et reviendra vers vous pour la suite.'
              : questionnaire.status === 'DECLINED'
                ? 'Votre décision a bien été enregistrée. AKATech pourra revenir vers vous si nécessaire.'
                : 'Votre devis est prêt. Vous pouvez maintenant accepter ou refuser l’offre.',
            quote: questionnaire.quote,
            status: questionnaire.status,
          })
        }
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
        status: 'QUOTED',
      })
    } catch (err) {
      setError(err.message || 'Erreur inconnue')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDecision = async (decision) => {
    if (!token || deciding || success?.status !== 'QUOTED') return

    setDeciding(true)
    setError('')
    try {
      const res = await fetch(`/api/questionnaire/${token}/decision`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ decision }),
      })
      const payload = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(payload.error || 'Décision impossible.')

      setSuccess((current) => ({
        ...current,
        status: payload.questionnaire.status,
        title: decision === 'accepted' ? 'Offre acceptée' : 'Offre refusée',
        description: decision === 'accepted'
          ? 'Merci. AKATech a bien reçu votre acceptation et reviendra vers vous pour la suite.'
          : 'Votre décision a bien été enregistrée. AKATech pourra revenir vers vous si nécessaire.',
      }))
    } catch (err) {
      setError(err.message || 'Erreur inconnue')
    } finally {
      setDeciding(false)
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
    <main style={{ minHeight: '100vh', background: T.bg, color: T.textMain, padding: '4rem 1.25rem' }}>
      <div style={{ maxWidth: 1120, margin: '0 auto' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '.75rem', letterSpacing: '.12em', textTransform: 'uppercase', color: T.green, fontWeight: 700 }}>
            {QUESTIONNAIRE_TYPES[type] || schema.label}
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', margin: '0.4rem 0 0.8rem', fontWeight: 800 }}>
            Questionnaire de devis
          </h1>
          <p style={{ color: T.textSub, maxWidth: 760, lineHeight: 1.7, margin: 0 }}>
            {schema.intro || 'Répondez simplement aux questions ci-dessous. Vos réponses aideront Aka à comprendre votre projet et à préparer une proposition adaptée.'}
          </p>
        </div>

        {!token && (
          <div style={{ background: 'rgba(239,68,68,.12)', border: '1px solid rgba(239,68,68,.35)', borderRadius: 18, padding: '1rem 1.2rem', color: T.textMain, marginBottom: '1.5rem' }}>
            Ce formulaire est protégé par un token de sécurité. Le lien du questionnaire est invalide ou incomplet.
          </div>
        )}

        {error && (
          <div style={{ background: 'rgba(239,68,68,.12)', border: '1px solid rgba(239,68,68,.35)', borderRadius: 18, padding: '1rem 1.2rem', color: T.textMain, marginBottom: '1.5rem' }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{ background: 'rgba(34,197,94,.12)', border: '1px solid rgba(34,197,94,.35)', borderRadius: 18, padding: '1rem 1.2rem', color: T.textMain, marginBottom: '1.5rem' }}>
            <h2 style={{ margin: '0 0 .4rem', fontSize: '1.2rem' }}>{success.title}</h2>
            <p style={{ margin: '0 0 .8rem', color: T.textSub }}>{success.description}</p>
            {success.quote && (
              <div style={{ background: T.light ? 'rgba(95,145,55,.1)' : 'rgba(6,95,70,.25)', border: `1px solid ${T.border2}`, borderRadius: 12, padding: '.9rem 1rem' }}>
                <div style={{ fontWeight: 700 }}>Devis estimé</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '.35rem' }}>
                  {success.quote.priceLabel || `${success.quote.priceMinFCFA?.toLocaleString('fr-FR') || 0} FCFA`}
                </div>
                {success.quote.positioningPitch && (
                  <p style={{ margin: '.8rem 0 0', lineHeight: 1.6, color: T.textSub }}>{success.quote.positioningPitch}</p>
                )}
                {success.status === 'QUOTED' && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.7rem', marginTop: '1rem' }}>
                    <button type="button" onClick={() => handleDecision('accepted')} disabled={deciding} style={{ border: 'none', borderRadius: 999, background: T.green, color: '#08120a', fontWeight: 800, padding: '.75rem 1.1rem', cursor: deciding ? 'wait' : 'pointer', opacity: deciding ? .65 : 1 }}>
                      {deciding ? 'Enregistrement…' : 'J’accepte le devis'}
                    </button>
                    <button type="button" onClick={() => handleDecision('declined')} disabled={deciding} style={{ border: `1px solid ${T.border2}`, borderRadius: 999, background: 'transparent', color: T.textMain, fontWeight: 700, padding: '.75rem 1.1rem', cursor: deciding ? 'wait' : 'pointer', opacity: deciding ? .65 : 1 }}>
                      Je refuse le devis
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <div style={{ display: 'grid', gap: '1.25rem' }}>
          {visibleSections.map((section) => (
            <section key={section.title} style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, padding: '1.5rem', boxShadow: '0 12px 30px rgba(0,0,0,.12)' }}>
              <h2 style={{ margin: '0 0 1rem', fontSize: '1.2rem' }}>{section.title}</h2>
              <div style={{ display: 'grid', gap: '1rem' }}>
                {section.fields.map((field) => {
                  const currentValue = answers[field.id]
                  const fieldLabel = <label htmlFor={field.id} style={{ display: 'block', marginBottom: '.45rem', fontWeight: 600, color: T.textMain }}>{field.label}{field.required ? ' *' : ''}</label>

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
                          style={{ width: '100%', minHeight: 120, resize: 'vertical', borderRadius: 10, border: `1px solid ${T.border2}`, background: T.bg, color: T.textMain, padding: '0.9rem 1rem' }}
                        />
                      )}

                      {(field.type === 'text' || field.type === 'email' || field.type === 'phone') && (
                        <input
                          id={field.id}
                          type={field.type === 'email' ? 'email' : field.type === 'phone' ? 'tel' : 'text'}
                          value={typeof currentValue === 'string' ? currentValue : ''}
                          onChange={(event) => handleChange(field, event.target.value)}
                          required={field.required}
                          style={{ width: '100%', borderRadius: 10, border: `1px solid ${T.border2}`, background: T.bg, color: T.textMain, padding: '0.9rem 1rem' }}
                        />
                      )}

                      {field.type === 'radio' && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.7rem' }}>
                          {field.options.map((option) => (
                            <label key={option} style={{ display: 'inline-flex', alignItems: 'center', gap: '.55rem', padding: '.6rem .8rem', borderRadius: 10, border: `1px solid ${T.border}`, background: currentValue === option ? 'rgba(136,202,83,.12)' : T.bg, cursor: 'pointer' }}>
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
                              <label key={option} style={{ display: 'inline-flex', alignItems: 'center', gap: '.55rem', padding: '.6rem .8rem', borderRadius: 10, border: `1px solid ${T.border}`, background: checked ? 'rgba(136,202,83,.12)' : T.bg, cursor: 'pointer' }}>
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
            <div style={{ textAlign: 'center', color: T.textSub, marginTop: '1rem' }}>Chargement du questionnaire…</div>
        )}
      </div>
    </main>
  )
}
