/* Liens de partage balisés (UTM).

   Un lien partagé sur WhatsApp n'envoie aucun referrer : sans balise, la visite
   apparaît « Direct ». Avec ?utm_source=whatsapp, /api/track la reconnaît et le
   dashboard la range sous « WhatsApp » (voir classifySource dans lib/geo.js).
   Utilisé par la carte « Lien de partage » de l'onglet Analytics. */

import { sanitizeUtmValue } from '@/lib/geo'

export const SHARE_CHANNELS = [
  { id: 'whatsapp', label: 'WhatsApp', medium: 'social' },
  { id: 'facebook', label: 'Facebook', medium: 'social' },
  { id: 'linkedin', label: 'LinkedIn', medium: 'social' },
  { id: 'instagram', label: 'Instagram', medium: 'social' },
  { id: 'tiktok', label: 'TikTok', medium: 'social' },
  { id: 'telegram', label: 'Telegram', medium: 'social' },
  { id: 'email', label: 'E-mail', medium: 'email' },
  { id: 'sms', label: 'SMS', medium: 'sms' },
]

export const SHARE_PAGES = [
  ['/', 'Accueil'], ['/services', 'Services'], ['/projects', 'Réalisations'], ['/pricing', 'Tarifs'],
  ['/about', 'À propos'], ['/blog', 'Blog'], ['/devis', 'Devis'], ['/contact', 'Contact'],
]

// `base` doit être absolu (https://akatech.vercel.app). Retourne '' si les paramètres sont invalides.
export function buildShareLink({ base, path = '/', source, campaign = '' }) {
  const channel = SHARE_CHANNELS.find((c) => c.id === source)
  if (!channel) return ''
  try {
    const url = new URL(path, base)
    url.searchParams.set('utm_source', channel.id)
    url.searchParams.set('utm_medium', channel.medium)
    const slug = sanitizeUtmValue(campaign)
    if (slug) url.searchParams.set('utm_campaign', slug)
    return url.toString()
  } catch {
    return ''
  }
}

// Lien d'ouverture de WhatsApp avec le message prêt à envoyer.
export const whatsappShareUrl = (link, text = '') =>
  `https://wa.me/?text=${encodeURIComponent(text ? `${text} ${link}` : link)}`
