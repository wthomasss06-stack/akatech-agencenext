'use client'
/**
 * TrustStacksMarquee — "TRUST & STACKS"
 * Remplace le MarqueeStrip après ArchiveTunnelSection (desktop)
 * / ProjectsSection (mobile).
 *
 * Objectif : prouver la crédibilité technique + montrer les
 * avantages concrets.
 *   Ligne 1 — Stack technique, bande sombre tournée en 2D,
 *             défile à gauche, survol → logo réel depuis /icons.
 *   Ligne 2 — Avantages clés, bande vert plein tournée à
 *             l'inverse, défile à droite. Même taille de texte
 *             que la Ligne 1.
 *   Ligne 3 — Métriques de performance, bande plate statique,
 *             même calibrage typographique.
 */
import { Truck, Palette, Search, Smartphone, Headset, ShieldCheck } from 'lucide-react'
import './TrustStacksMarquee.css'

const STACK = [
  { name: 'React',           icon: '/icons/react.svg' },
  { name: 'Next.js',         icon: '/icons/nextjs.svg' },
  { name: 'Django',          icon: '/icons/django.svg' },
  { name: 'Python',          icon: '/icons/python.svg' },
  { name: 'PostgreSQL',      icon: '/icons/postgresql.svg' },
  { name: 'Tailwind CSS',    icon: '/icons/tailwindcss.svg' },
  { name: 'Framer Motion',   icon: '/icons/framermotion.svg' },
  { name: 'GSAP',            icon: '/icons/gsap.svg' },
  { name: 'Node.js',         icon: '/icons/nodejs.svg' },
  { name: 'Prisma',          icon: '/icons/prisma.svg' },
  { name: 'Three.js / WebGL',icon: '/icons/webgl.svg' },
  { name: 'Vercel',          icon: '/icons/vercel.svg' },
]

const BADGES = [
  { label: 'Livraison 5-7 jours',  Icon: Truck },
  { label: 'Design sur mesure',    Icon: Palette },
  { label: 'SEO intégré',          Icon: Search },
  { label: 'Mobile Money',         Icon: Smartphone },
  { label: 'Support 48h',          Icon: Headset },
  { label: 'Hébergement offert',   Icon: ShieldCheck },
]

const METRICS = [
  { value: '95+',  label: 'Score Lighthouse' },
  { value: '<2s',  label: 'Chargement moyen' },
  { value: '100%', label: 'Responsive' },
  { value: 'SEO',  label: 'Optimisé dès le code' },
  { value: 'SSL',  label: 'Gratuit inclus' },
]

function StackBand() {
  const set = (keySuffix, hidden) => (
    <div className="ts-band-set" aria-hidden={hidden || undefined}>
      {STACK.map((t, i) => (
        <span className="ts-stack-item" key={`${keySuffix}-${i}`}>
          <span className="ts-stack-icon">
            <span className="ts-dot" />
            <span className="ts-icon-chip">
              <img src={t.icon} alt="" className="ts-icon-img" loading="lazy" />
            </span>
          </span>
          <span className="ts-stack-name">{t.name}</span>
        </span>
      ))}
    </div>
  )
  return (
    <div className="ts-band ts-band--stack">
      <div className="ts-band-track ts-band-track--left">
        {set('a', false)}
        {set('b', true)}
      </div>
    </div>
  )
}

function BadgesBand() {
  const set = (keySuffix, hidden) => (
    <div className="ts-band-set" aria-hidden={hidden || undefined}>
      {BADGES.map((b, i) => (
        <span className="ts-badge-item" key={`${keySuffix}-${i}`}>
          <b.Icon size={18} strokeWidth={2.4} />
          {b.label}
          <span className="ts-badge-sep">•</span>
        </span>
      ))}
    </div>
  )
  return (
    <div className="ts-band ts-band--badges">
      <div className="ts-band-track ts-band-track--right">
        {set('a', false)}
        {set('b', true)}
      </div>
    </div>
  )
}

function MetricsBand() {
  const set = (keySuffix, hidden) => (
    <div className="ts-band-set" aria-hidden={hidden || undefined}>
      {METRICS.map((m, i) => (
        <span className="ts-metric" key={`${keySuffix}-${i}`}>
          <strong>{m.value}</strong>{m.label}
          <span className="ts-metric-sep">•</span>
        </span>
      ))}
    </div>
  )

  return (
    <div className="ts-band ts-band--metrics">
      <div className="ts-band-track ts-band-track--left">
        {set('a', false)}
        {set('b', true)}
      </div>
    </div>
  )
}

export default function TrustStacksMarquee() {
  return (
    <section className="ts-section" aria-label="Stack technique et avantages AKATech">
      <div className="ts-glow" />

      <span className="ts-eyebrow">Notre stack · Nos avantages · Nos performances</span>

      <StackBand />
      <BadgesBand />
      <MetricsBand />
    </section>
  )
}
