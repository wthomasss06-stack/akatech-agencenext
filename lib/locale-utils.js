export const VALID_LANGUAGES = ['fr', 'en', 'es']

export function normalizeLanguage(value, fallback = 'fr') {
  const normalized = typeof value === 'string' ? value.toLowerCase() : ''
  return VALID_LANGUAGES.includes(normalized) ? normalized : fallback
}

export function detectLanguageFromText(text = '') {
  const sample = String(text || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')

  if (!sample) return 'fr'

  const scores = { fr: 0, en: 0, es: 0 }

  const frPatterns = [
    'bonjour', 'salut', 'merci', 's il vous plaît', 'svp', 'francais', 'français', 'devis',
    'site web', 'projet', 'prix', 'tarif', 'besoin', 'abidjan', 'bonjour', 'mon projet',
    'comment', 'pourquoi', 'oui', 'non', 'je veux', 'je souhaite', 'voici'
  ]
  const enPatterns = [
    'hello', 'hi', 'thanks', 'please', 'english', 'project', 'website', 'quote', 'pricing',
    'budget', 'need', 'i want', 'i need', 'how', 'what', 'why', 'can you', 'contact'
  ]
  const esPatterns = [
    'hola', 'gracias', 'por favor', 'espanol', 'español', 'proyecto', 'pagina web', 'sitio web',
    'presupuesto', 'precio', 'necesito', 'quiero', 'como', 'donde', 'ayuda' 
  ]

  for (const pattern of frPatterns) {
    if (sample.includes(pattern)) scores.fr += 2
  }
  for (const pattern of enPatterns) {
    if (sample.includes(pattern)) scores.en += 2
  }
  for (const pattern of esPatterns) {
    if (sample.includes(pattern)) scores.es += 2
  }

  const hasFrenchAccent = /[àâçéèêëîïôùûü]/.test(sample)
  const hasSpanishAccent = /[áéíóúñü]/.test(sample)
  if (hasFrenchAccent) scores.fr += 2
  if (hasSpanishAccent) scores.es += 2

  if (sample.includes('what') || sample.includes('how') || sample.includes('need')) scores.en += 1
  if (sample.includes('comment') || sample.includes('pourquoi') || sample.includes('besoin')) scores.fr += 1
  if (sample.includes('como') || sample.includes('donde') || sample.includes('necesito')) scores.es += 1

  const best = Object.entries(scores).sort((a, b) => b[1] - a[1])[0]
  return best && best[1] > 0 ? normalizeLanguage(best[0], 'fr') : 'fr'
}
