'use client'
/**
 * ConversionMarquee — "CONVERSION CTA"
 * Remplace le MarqueeStrip après WhyUs (desktop) / Process (mobile).
 * Objectif : pousser à l'action. Bande d'urgence qui défile en
 * continu + CTA fixe et pulsant qui ne défile jamais.
 */
import { ArrowRight, Bolt, Clock3, PhoneCall } from 'lucide-react'
import './ConversionMarquee.css'

const ITEMS = [
  { Icon: Bolt, pre: '', strong: '3 créneaux', post: ' dispo ce mois' },
  { Icon: Clock3, pre: 'Délai moyen ', strong: '7 jours', post: '' },
  { Icon: PhoneCall, pre: 'Réponse en ', strong: 'moins de 2h', post: '' },
]

const WA_HREF = "https://wa.me/2250142507750?text=Bonjour+AKATech,+je+veux+démarrer+mon+projet+!"

function TickerSet({ hidden }) {
  return (
    <div className="ccta-set" aria-hidden={hidden || undefined}>
      {ITEMS.map((it, i) => (
        <span className="ccta-item" key={i}>
          <it.Icon size={16} strokeWidth={2.4} aria-hidden="true" />
          {it.pre}<strong>{it.strong}</strong>{it.post}
          <span className="ccta-sep">·</span>
        </span>
      ))}
    </div>
  )
}

export default function ConversionMarquee() {
  return (
    <section className="ccta-section" aria-label="Créneaux disponibles — démarrer un projet">
      <div className="ccta-band">
        <div className="ccta-track-wrap">
          <div className="ccta-track">
            <TickerSet hidden={false} />
            <TickerSet hidden={true} />
          </div>
        </div>
      </div>

      <div className="ccta-fixed">
        <a href={WA_HREF} target="_blank" rel="noreferrer" className="ccta-btn">
          Démarrer mon projet
          <ArrowRight size={15} strokeWidth={2.4} />
        </a>
      </div>
    </section>
  )
}
