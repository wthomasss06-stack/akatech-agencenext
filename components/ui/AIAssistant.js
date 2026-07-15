'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Bot, X, Send, MessageCircleWarning } from 'lucide-react'
import { useTheme } from '@/lib/theme'

const GREETING = "Salut 👋 Je suis l'assistant IA d'AKATech. Dites-moi ce que vous voulez construire — je vous donne une fourchette de prix et les prochaines étapes."
const WA_REGEX = /https:\/\/wa\.me\/\S+/g

/* Détecte un lien wa.me dans un texte terminé et le remplace par un
   bouton stylé plutôt qu'une URL brute. Ne traite jamais le HTML —
   uniquement du texte + un tableau de segments React, pour ne jamais
   avoir besoin de dangerouslySetInnerHTML sur du contenu généré par le modèle. */
function renderMessageContent(text) {
  const parts = text.split(WA_REGEX)
  const links = text.match(WA_REGEX) || []
  if (links.length === 0) return text

  const nodes = []
  parts.forEach((part, i) => {
    if (part) nodes.push(<span key={`t${i}`}>{part}</span>)
    if (links[i]) {
      nodes.push(
        <a
          key={`l${i}`}
          href={links[i]}
          target="_blank"
          rel="noreferrer"
          className="ai-assistant-wa-btn"
        >
          Continuer sur WhatsApp →
        </a>
      )
    }
  })
  return nodes
}

export default function AIAssistant() {
  const T = useTheme()
  const reduceMotion = useReducedMotion()
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([{ role: 'assistant', content: GREETING }])
  const [input, setInput] = useState('')
  const [streaming, setStreaming] = useState(false)
  const [errorMsg, setErrorMsg] = useState(null)
  const listRef = useRef(null)
  const abortRef = useRef(null)

  useEffect(() => {
    if (!listRef.current) return
    listRef.current.scrollTop = listRef.current.scrollHeight
  }, [messages, streaming])

  useEffect(() => () => abortRef.current?.abort(), [])

  const send = useCallback(async () => {
    const text = input.trim()
    if (!text || streaming) return

    setErrorMsg(null)
    const nextMessages = [...messages, { role: 'user', content: text }]
    setMessages([...nextMessages, { role: 'assistant', content: '' }])
    setInput('')
    setStreaming(true)

    const controller = new AbortController()
    abortRef.current = controller

    try {
      const res = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: nextMessages }),
        signal: controller.signal,
      })

      if (!res.ok || !res.body) throw new Error('Réponse invalide du serveur')

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let acc = ''

      for (;;) {
        const { done, value } = await reader.read()
        if (done) break
        acc += decoder.decode(value, { stream: true })
        const snapshot = acc
        setMessages(curr => {
          const copy = [...curr]
          copy[copy.length - 1] = { role: 'assistant', content: snapshot }
          return copy
        })
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        setErrorMsg("La connexion a été interrompue. Réessayez, ou écrivez directement sur WhatsApp.")
      }
    } finally {
      setStreaming(false)
    }
  }, [input, streaming, messages])

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  return (
    <>
      <motion.button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-label={open ? "Fermer l'assistant AKATech" : "Ouvrir l'assistant AKATech"}
        initial={reduceMotion ? false : { scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: reduceMotion ? 0 : 2.4, type: 'spring', stiffness: 260, damping: 20 }}
        style={{
          position: 'fixed', bottom: '2rem', left: '2rem', zIndex: 9000,
          width: 54, height: 54, minWidth: 44, minHeight: 44, borderRadius: '50%',
          background: T.light ? 'linear-gradient(145deg,#ffffff,#f0f0f0)' : 'linear-gradient(145deg,#0e2416,#081208)',
          border: `1px solid ${T.border2}`,
          boxShadow: T.light ? '4px 4px 14px rgba(0,0,0,.12), 0 0 20px rgba(136,202,83,.12)' : '4px 4px 14px rgba(0,0,0,.7), 0 0 20px rgba(136,202,83,.18)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', color: T.green, padding: 0,
        }}
      >
        {open ? <X size={22} /> : <Bot size={24} />}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label="Assistant AKATech"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: .92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: .92, y: 16 }}
            transition={{ duration: .22, ease: [.22, 1, .36, 1] }}
            style={{
              position: 'fixed', bottom: '5.5rem', left: '1.2rem', zIndex: 9001,
              width: 'min(380px, calc(100vw - 2.4rem))',
              height: 'min(560px, calc(100vh - 8rem))',
              display: 'flex', flexDirection: 'column',
              background: T.card, border: `1px solid ${T.border}`, borderRadius: 18,
              boxShadow: T.light ? '0 12px 40px rgba(0,0,0,.16)' : '0 12px 40px rgba(0,0,0,.6)',
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <div style={{
              padding: '1rem 1.2rem', display: 'flex', alignItems: 'center', gap: '.7rem',
              borderBottom: `1px solid ${T.border}`, flexShrink: 0,
            }}>
              <div style={{
                width: 34, height: 34, borderRadius: '50%', background: 'rgba(136,202,83,.12)',
                border: `1px solid ${T.border2}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: T.green, flexShrink: 0,
              }}>
                <Bot size={18} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.82rem', fontWeight: 700, color: T.textMain }}>
                  Assistant AKATech
                </div>
                <div style={{ fontSize: '.68rem', color: T.textMuted }}>Répond en quelques secondes</div>
              </div>
            </div>

            {/* Messages */}
            <div ref={listRef} style={{ flex: 1, overflowY: 'auto', padding: '1rem 1.1rem', display: 'flex', flexDirection: 'column', gap: '.7rem' }}>
              {messages.map((m, i) => (
                <div key={i} style={{
                  alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  background: m.role === 'user' ? T.green : (T.light ? '#f0f0f0' : 'rgba(255,255,255,.05)'),
                  color: m.role === 'user' ? '#08120a' : T.textMain,
                  padding: '.65rem .9rem', borderRadius: 14,
                  borderBottomRightRadius: m.role === 'user' ? 3 : 14,
                  borderBottomLeftRadius: m.role === 'assistant' ? 3 : 14,
                  fontSize: '.85rem', lineHeight: 1.55, whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                }}>
                  {m.role === 'assistant' && m.content === '' && streaming && i === messages.length - 1
                    ? <TypingDots color={T.textMuted} />
                    : renderMessageContent(m.content)}
                </div>
              ))}
              {errorMsg && (
                <div style={{ display: 'flex', gap: '.4rem', alignItems: 'flex-start', fontSize: '.78rem', color: '#e08a4a' }}>
                  <MessageCircleWarning size={15} style={{ flexShrink: 0, marginTop: 1 }} />
                  {errorMsg}
                </div>
              )}
            </div>

            {/* Input */}
            <div style={{ padding: '.8rem', borderTop: `1px solid ${T.border}`, display: 'flex', gap: '.5rem', flexShrink: 0 }}>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Décrivez votre projet…"
                rows={1}
                disabled={streaming}
                aria-label="Votre message"
                style={{
                  flex: 1, resize: 'none', minHeight: 40, maxHeight: 90,
                  background: T.light ? '#f5f5f5' : 'rgba(255,255,255,.04)',
                  border: `1px solid ${T.border}`, borderRadius: 10,
                  padding: '.6rem .8rem', fontSize: '.85rem', color: T.textMain,
                  fontFamily: 'inherit', outline: 'none',
                }}
              />
              <button
                type="button"
                onClick={send}
                disabled={streaming || !input.trim()}
                aria-label="Envoyer"
                style={{
                  width: 44, height: 44, minWidth: 44, borderRadius: 10, flexShrink: 0,
                  background: streaming || !input.trim() ? T.border : T.green,
                  border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: streaming || !input.trim() ? 'default' : 'pointer',
                  color: '#08120a', transition: 'background .15s',
                }}
              >
                <Send size={17} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

function TypingDots({ color }) {
  return (
    <span style={{ display: 'inline-flex', gap: 4, padding: '.15rem 0' }} aria-label="L'assistant écrit…">
      {[0, 1, 2].map(i => (
        <span key={i} style={{
          width: 6, height: 6, borderRadius: '50%', background: color,
          animation: 'dot-blink 1.2s ease-in-out infinite',
          animationDelay: `${i * 0.15}s`,
        }} />
      ))}
    </span>
  )
}
