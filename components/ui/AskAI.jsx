'use client'
// components/ui/AskAI.jsx
// « Demandez à l'IA ce qu'elle pense d'AKATech » — logique partagée entre le
// footer, le CardNav (desktop) et le StaggeredMenu (mobile).
//   useAskAI()  → { heading, platforms, copied, ask(platform), label(platform) }
//   <AskAIStrip /> (export par défaut) → bandeau centré utilisé dans le footer.
import { useCallback, useMemo, useRef, useEffect, useState } from 'react'
import { useLanguage } from '@/lib/language'
import { HoverSlideText } from '@/components/ui/index'

export function useAskAI() {
  const { t } = useLanguage()
  const [copied, setCopied] = useState(null)
  const timer = useRef(null)
  const PROMPT = t('askAiPrompt')

  useEffect(() => () => clearTimeout(timer.current), [])

  const platforms = useMemo(() => [
    { id: 'chatgpt',    label: 'ChatGPT',    icon: '/icons/chatgpt-vitamin.png',    url: `https://chatgpt.com/?q=${encodeURIComponent(PROMPT)}` },
    { id: 'claude',     label: 'Claude',     icon: '/icons/claude-vitamin.png',     url: 'https://claude.ai/new' },
    { id: 'perplexity', label: 'Perplexity', icon: '/icons/perplexity-vitamin.png', url: `https://www.perplexity.ai/?q=${encodeURIComponent(PROMPT)}` },
    { id: 'gemini',     label: 'Gemini',     icon: '/icons/gemini-vitamin.png',     url: 'https://gemini.google.com/app' },
    { id: 'grok',       label: 'Grok',       icon: '/icons/grok-vitamin.png',       url: `https://grok.com/?q=${encodeURIComponent(PROMPT)}` },
    { id: 'manus',      label: 'Manus',      icon: '/icons/manus-vitamin.png',      url: `https://manus.im/?q=${encodeURIComponent(PROMPT)}` },
  ], [PROMPT])

  // Copie le prompt (pour les plateformes sans paramètre ?q=) puis ouvre la plateforme.
  const ask = useCallback(async (platform) => {
    try { await navigator.clipboard.writeText(PROMPT) } catch {}
    setCopied(platform.id)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setCopied(null), 2000)
    window.open(platform.url, '_blank', 'noopener,noreferrer')
  }, [PROMPT])

  const label = useCallback((p) => (copied === p.id ? t('copied') : p.label), [copied, t])

  return { heading: t('askAiHeading'), askLabel: t('askPlatform'), platforms, copied, ask, label }
}

/* ── Bandeau centré — footer (rendu identique à l'ancien AskAIStrip) ── */
export default function AskAIStrip() {
  const { heading, askLabel, platforms, ask, label } = useAskAI()
  return (
    <div style={{ padding: '2.2rem 0', textAlign: 'center' }}>
      <p id="ask-ai-heading" style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.65rem', letterSpacing: '.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,.5)', marginBottom: '1rem' }}>
        {heading}
      </p>
      <div style={{ display: 'flex', gap: '.6rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        {platforms.map((p) => (
          <button key={p.id} type="button" onClick={() => ask(p)} title={`${askLabel} ${p.label}`}
            aria-label={`${askLabel} ${p.label}`} aria-describedby="ask-ai-heading"
            className="aka-ask-btn"
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '.5rem', padding: '.75rem .95rem', borderRadius: 14, background: 'transparent', border: 'none', cursor: 'pointer', minWidth: 70 }}>
            <span style={{ width: 36, height: 36, display: 'grid', placeItems: 'center', background: 'transparent', boxShadow: 'none', overflow: 'visible' }}>
              <img src={p.icon} alt={p.label} width={28} height={28} style={{ display: 'block', filter: 'none', objectFit: 'contain' }} />
            </span>
            <span aria-live="polite" style={{ fontSize: '.6rem', fontFamily: "'JetBrains Mono',monospace", color: 'rgba(255,255,255,.5)' }}>
              <HoverSlideText text={label(p)} />
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
