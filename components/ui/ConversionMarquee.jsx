'use client'
/**
 * ConversionMarquee — "CONVERSION CTA"
 * Remplace le MarqueeStrip après WhyUs (desktop) / Process (mobile).
 * Objectif : pousser à l'action. Bande d'urgence qui défile en
 * continu + CTA fixe et pulsant qui ne défile jamais.
 */
import { ArrowRight, Bolt, Clock3, PhoneCall } from 'lucide-react'
import { HoverSlideText } from '@/components/ui/index'
import './ConversionMarquee.css'
import { useLanguage } from '@/lib/language'

const WA_HREF = "https://wa.me/2250142507750?text=Bonjour+AKATech,+je+veux+démarrer+mon+projet+!"

function TickerSet({ hidden, items }) {
  return (
    <div className="ccta-set" aria-hidden={hidden || undefined}>
      {items.map((it, i) => (
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
  const { t } = useLanguage()
  const items = [
    { Icon: Bolt, pre: '', strong: t('tickerSlots'), post: t('tickerSlotsPost') },
    { Icon: Clock3, pre: `${t('tickerLead')} `, strong: t('tickerSevenDays'), post: '' },
    { Icon: PhoneCall, pre: `${t('tickerReply')} `, strong: t('tickerReplyPost'), post: '' },
  ]
  return (
    <section className="ccta-section" aria-label={t('uiStartProject')}>
      <div className="ccta-band">
        <div className="ccta-track-wrap">
          <div className="ccta-track">
            <TickerSet hidden={false} items={items} />
            <TickerSet hidden={true} items={items} />
          </div>
        </div>
      </div>

      <div className="ccta-fixed">
        <a href={WA_HREF} target="_blank" rel="noreferrer" className="btn-raised btn-sm">
          <HoverSlideText text={t('uiStartMyProject')} />
          <ArrowRight size={15} strokeWidth={2.4} />
        </a>
      </div>
    </section>
  )
}
