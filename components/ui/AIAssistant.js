'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { usePathname } from 'next/navigation'
import { motion, useReducedMotion } from 'framer-motion'
import { Bot, X, Send, MessageCircleWarning, ExternalLink, Phone, Globe, Mail } from 'lucide-react'
import { useTheme } from '@/lib/theme'

const HOUR = new Date().getHours()

const GREETINGS_DAY = [
  "Yo ! 👋 Bienvenue chez AKATech. Aka est en train de coder quelque chose de fou en ce moment, mais je suis là pour toi. Tu cherches un site, une app, ou tu explores juste ?",
  "Hey ! 👋 Tu es tombé au bon endroit. Ici on construit des sites et des apps qui convertissent — pas des templates tout pourris. Tu as un projet en tête ou tu fais juste un tour ?",
  "Bienvenue ! 🚀 Aka a déjà livré 19+ projets pour des entrepreneurs et PME en Côte d'Ivoire. Si tu as une idée à concrétiser, je suis ton premier contact. Sinon, je peux te montrer ce qu'on fait.",
  "Salut ! 👋 Je suis le bras droit numérique d'Aka chez AKATech. Il est occupé à développer un projet client, mais je peux déjà te renseigner sur les tarifs, les délais, ou capturer ton besoin. Qu'est-ce qui t'amène ?",
  "Hello ! 👋 Tu sais ce qui est cool ici ? On ne te vend pas du rêve. On te dit combien ça coûte, combien de temps ça prend, et ce que tu reçois exactement. Tu veux un site vitrine, un e-commerce, ou autre chose ?",
]

const GREETINGS_NIGHT = [
  "Mec… il est 3h du mat' et tu cherches un site web ? 😅 Respect. Aka ronfle probablement à côté de son clavier, mais moi je suis branché 24/7. Tu veux qu'on discute de ton projet ou c'est juste une visite nocturne ?",
  "Haha, t'es un vrai ! 👀 Il fait nuit noire, tout le monde dort, et toi tu traines sur AKATech. Tu cherches un site, une app, ou t'es juste en mode 'je vais tout réussir avant le lever du soleil' ? Je suis là de toute façon.",
  "Wesh, insomniaque ! 🌙 Aka est en mode DND jusqu'à 8h, mais moi je ne dors jamais. Si tu as une idée de site ou d'app qui te trotte dans la tête à cette heure-ci, c'est sûrement une bonne idée. Raconte-moi tout.",
  "3h du mat', le cerveau tourne à 200%, et tu atterris ici… je connais ça. 😏 Aka est en pleine sieste de codeur, mais moi je capte tout. Tu veux un site vitrine, un e-commerce, ou juste quelqu'un qui écoute ton idée de génie ?",
  "Tu dors pas, toi ? 😂 Moi non plus, c'est mon job. Aka par contre, il a crashé depuis belle lurette. Si tu es là à cette heure pour un site ou une app, c'est que c'est sérieux. Je t'écoute, chef.",
]

const GREETINGS_LUNCH = [
  "Il est midi, tu cherches une solution web au lieu de manger ? 😂 Respect, l'entrepreneur ne s'arrête jamais. Aka est probablement en train d'engloutir un attiéké, mais moi je suis là. Quel est ton besoin ?",
  "Wesh, tu n'as pas faim ? 🍛 Tout le monde est à table et toi tu traines sur AKATech. Si tu es prêt à sacrifier ton déjeuner pour ton projet, c'est que ça vaut le coup. Raconte-moi ce que tu veux construire.",
  "Midi pile ! ⏰ Aka est en mode pause-déj', mais moi je ne mange pas — je discute. Tu cherches un site vitrine, une app mobile, ou tu veux juste savoir combien ça coûte avant de reprendre ton plat ?",
  "Haha, l'heure du déjeuner et toi tu es sur un site tech… 😅 Je connais ça, l'idée qui te trotte dans la tête et qui te coupe l'appétit. Aka est en train de manger, mais moi je suis tout ouïe. Qu'est-ce qui te ramène ici ?",
  "Bon appétit… ou pas ? 🍽️ Parce que visiblement, ton projet te passionne plus que ton plat du jour. Aka est à table, mais moi je suis branché. Tu veux un site, une app, ou juste discuter de ton idée ?",
]

const GREETING = (HOUR >= 23 || HOUR < 6)
  ? GREETINGS_NIGHT[Math.floor(Math.random() * GREETINGS_NIGHT.length)]
  : (HOUR >= 12 && HOUR < 14)
    ? GREETINGS_LUNCH[Math.floor(Math.random() * GREETINGS_LUNCH.length)]
    : GREETINGS_DAY[Math.floor(Math.random() * GREETINGS_DAY.length)]
    
/* Regex pour détecter les liens dans les messages */
const URL_REGEX = /(https?:\/\/[^\s]+)/g
const WA_REGEX = /https:\/\/wa\.me\/\S+/g
const PORTFOLIO_REGEX = /https:\/\/mbolloaka-dev\.vercel\.app\/?/g
const SITE_REGEX = /https:\/\/akatech\.vercel\.app\/?/g
const LINKEDIN_REGEX = /https:\/\/www\.linkedin\.com\/in\/[^\s]+/g
const GITHUB_REGEX = /https:\/\/github\.com\/[^\s]+/g

/* Détecte et transforme les liens en boutons cliquables */
function renderMessageContent(text) {
  if (!text) return text

  // D'abord, remplace les liens spécifiques par des boutons stylés
  let processed = text

  // WhatsApp
  processed = processed.replace(WA_REGEX, (match) => {
    return `\n[BUTTON_WA:${match}]\n`
  })

  // Portfolio
  processed = processed.replace(PORTFOLIO_REGEX, (match) => {
    return `\n[BUTTON_PORTFOLIO:${match}]\n`
  })

  // Site AKATech
  processed = processed.replace(SITE_REGEX, (match) => {
    return `\n[BUTTON_SITE:${match}]\n`
  })

  // LinkedIn
  processed = processed.replace(LINKEDIN_REGEX, (match) => {
    return `\n[BUTTON_LINKEDIN:${match}]\n`
  })

  // GitHub
  processed = processed.replace(GITHUB_REGEX, (match) => {
    return `\n[BUTTON_GITHUB:${match}]\n`
  })

  // Autres liens génériques
  processed = processed.replace(URL_REGEX, (match) => {
    if (match.includes('wa.me') || match.includes('mbolloaka-dev') || 
        match.includes('akatech.vercel') || match.includes('linkedin.com') ||
        match.includes('github.com')) {
      return match // Déjà traité
    }
    return `\n[BUTTON_LINK:${match}]\n`
  })

  // Maintenant, on split et on rend chaque partie
  const parts = processed.split(/\n/)

  return parts.map((part, i) => {
    // Bouton WhatsApp
    if (part.startsWith('[BUTTON_WA:')) {
      const url = part.replace('[BUTTON_WA:', '').replace(']', '')
      return <WhatsAppButton key={i} url={url} />
    }

    // Bouton Portfolio
    if (part.startsWith('[BUTTON_PORTFOLIO:')) {
      const url = part.replace('[BUTTON_PORTFOLIO:', '').replace(']', '')
      return <PortfolioButton key={i} url={url} />
    }

    // Bouton Site
    if (part.startsWith('[BUTTON_SITE:')) {
      const url = part.replace('[BUTTON_SITE:', '').replace(']', '')
      return <SiteButton key={i} url={url} />
    }

    // Bouton LinkedIn
    if (part.startsWith('[BUTTON_LINKEDIN:')) {
      const url = part.replace('[BUTTON_LINKEDIN:', '').replace(']', '')
      return <LinkedInButton key={i} url={url} />
    }

    // Bouton GitHub
    if (part.startsWith('[BUTTON_GITHUB:')) {
      const url = part.replace('[BUTTON_GITHUB:', '').replace(']', '')
      return <GitHubButton key={i} url={url} />
    }

    // Bouton lien générique
    if (part.startsWith('[BUTTON_LINK:')) {
      const url = part.replace('[BUTTON_LINK:', '').replace(']', '')
      return <LinkButton key={i} url={url} label="Voir le lien" />
    }

    // Texte normal
    if (part.trim()) {
      return <span key={i}>{part}</span>
    }

    return <br key={i} />
  })
}

/* ── Boutons stylés ── */
function WhatsAppButton({ url }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="ai-assistant-btn ai-assistant-btn-wa"
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '.5rem',
        padding: '.55rem 1rem', borderRadius: 10,
        background: 'linear-gradient(135deg, #25d366, #128c7e)',
        color: '#fff', fontSize: '.8rem', fontWeight: 600,
        textDecoration: 'none', margin: '.3rem 0',
        boxShadow: '0 2px 8px rgba(37,211,102,.3)',
        transition: 'transform .15s, box-shadow .15s',
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(37,211,102,.4)' }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(37,211,102,.3)' }}
    >
      <Phone size={15} />
      Continuer sur WhatsApp
      <ExternalLink size={12} style={{ opacity: .7 }} />
    </a>
  )
}

function PortfolioButton({ url }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="ai-assistant-btn ai-assistant-btn-portfolio"
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '.5rem',
        padding: '.55rem 1rem', borderRadius: 10,
        background: 'linear-gradient(135deg, #c6ff3d, #88ca53)',
        color: '#fff', fontSize: '.8rem', fontWeight: 600,
        textDecoration: 'none', margin: '.3rem 0',
        boxShadow: '0 2px 8px rgba(136,202,83,.3)',
        transition: 'transform .15s, box-shadow .15s',
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(136,202,83,.4)' }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(136,202,83,.3)' }}
    >
      <Globe size={15} />
      Voir le portfolio d'Aka
      <ExternalLink size={12} style={{ opacity: .7 }} />
    </a>
  )
}

function SiteButton({ url }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="ai-assistant-btn ai-assistant-btn-site"
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '.5rem',
        padding: '.55rem 1rem', borderRadius: 10,
        background: 'linear-gradient(135deg, #667eea, #764ba2)',
        color: '#fff', fontSize: '.8rem', fontWeight: 600,
        textDecoration: 'none', margin: '.3rem 0',
        boxShadow: '0 2px 8px rgba(102,126,234,.3)',
        transition: 'transform .15s, box-shadow .15s',
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(102,126,234,.4)' }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(102,126,234,.3)' }}
    >
      <Globe size={15} />
      Visiter le site AKATech
      <ExternalLink size={12} style={{ opacity: .7 }} />
    </a>
  )
}

function LinkedInButton({ url }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="ai-assistant-btn ai-assistant-btn-linkedin"
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '.5rem',
        padding: '.55rem 1rem', borderRadius: 10,
        background: 'linear-gradient(135deg, #0077b5, #005885)',
        color: '#fff', fontSize: '.8rem', fontWeight: 600,
        textDecoration: 'none', margin: '.3rem 0',
        boxShadow: '0 2px 8px rgba(0,119,181,.3)',
        transition: 'transform .15s, box-shadow .15s',
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,119,181,.4)' }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,119,181,.3)' }}
    >
      <ExternalLink size={15} />
      LinkedIn d'Aka
      <ExternalLink size={12} style={{ opacity: .7 }} />
    </a>
  )
}

function GitHubButton({ url }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="ai-assistant-btn ai-assistant-btn-github"
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '.5rem',
        padding: '.55rem 1rem', borderRadius: 10,
        background: 'linear-gradient(135deg, #333, #1a1a1a)',
        color: '#fff', fontSize: '.8rem', fontWeight: 600,
        textDecoration: 'none', margin: '.3rem 0',
        boxShadow: '0 2px 8px rgba(0,0,0,.3)',
        transition: 'transform .15s, box-shadow .15s',
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,.4)' }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,.3)' }}
    >
      <ExternalLink size={15} />
      GitHub d'Aka
      <ExternalLink size={12} style={{ opacity: .7 }} />
    </a>
  )
}

function LinkButton({ url, label }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="ai-assistant-btn ai-assistant-btn-link"
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '.5rem',
        padding: '.55rem 1rem', borderRadius: 10,
        background: 'rgba(136,202,83,.15)', border: '1px solid rgba(136,202,83,.3)',
        color: '#88ca53', fontSize: '.8rem', fontWeight: 600,
        textDecoration: 'none', margin: '.3rem 0',
        transition: 'transform .15s, background .15s',
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.background = 'rgba(136,202,83,.25)' }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.background = 'rgba(136,202,83,.15)' }}
    >
      <ExternalLink size={15} />
      {label}
      <ExternalLink size={12} style={{ opacity: .7 }} />
    </a>
  )
}

const AI_STIFFNESS = 0.18
const AI_FRICTION = 0.65
const AI_PANEL_W = 380
const AI_PANEL_H = 560
const AI_BTN_SIZE = 54
const AI_GAP = 14

export default function AIAssistant() {
  const T = useTheme()
  const pathname = usePathname()
  const reduceMotion = useReducedMotion()
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])
  const [messages, setMessages] = useState([{ role: 'assistant', content: GREETING }])
  const [input, setInput] = useState('')
  const [streaming, setStreaming] = useState(false)
  const [errorMsg, setErrorMsg] = useState(null)
  const listRef = useRef(null)
  const abortRef = useRef(null)

  const sessionIdRef = useRef(null)
  if (!sessionIdRef.current) sessionIdRef.current = crypto.randomUUID()

  const messagesRef = useRef(messages)
  useEffect(() => {
    messagesRef.current = messages
  }, [messages])

  const endConversation = useCallback((messagesList) => {
    if (!messagesList || messagesList.length < 2) return
    const payload = JSON.stringify({ sessionId: sessionIdRef.current })
    if (navigator.sendBeacon) {
      const blob = new Blob([payload], { type: 'application/json' })
      navigator.sendBeacon('/api/assistant/end', blob)
    } else {
      fetch('/api/assistant/end', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload,
        keepalive: true,
      }).catch(() => {})
    }
  }, [])

  useEffect(() => {
    const handleBeforeUnload = () => {
      endConversation(messagesRef.current)
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      abortRef.current?.abort()
      endConversation(messagesRef.current)
    }
  }, [endConversation])

  // ── Morph bouton → panneau (même mécanique que ProjectFormHome : le
  // formulaire est désormais toujours visible, donc ce bouton hérite de
  // l'effet ressort. Contrairement au formulaire, le bouton garde une
  // taille fixe (cercle) — seule sa position bascule du coin bas-gauche
  // vers le coin haut-droit du panneau ouvert) ──
  const wrapRef = useRef(null)
  const panelRef = useRef(null)
  const btnRef = useRef(null)
  const openRef = useRef(false)
  const panelAnim = useRef({ currentW: 0, currentH: 0, currentOpacity: 0, targetW: 0, targetH: 0, targetOpacity: 0, vxW: 0, vxH: 0, vxO: 0 })
  const btnAnim = useRef({ currentX: 0, currentY: 0, targetX: 0, targetY: 0, vxX: 0, vxY: 0 })

  const getPanelSize = () => (typeof window === 'undefined'
    ? { w: AI_PANEL_W, h: AI_PANEL_H }
    : { w: Math.min(AI_PANEL_W, window.innerWidth - 38), h: Math.min(AI_PANEL_H, window.innerHeight - 128) })

  const openPanel = () => {
    const { w, h } = getPanelSize()
    panelAnim.current.targetW = w
    panelAnim.current.targetH = h
    panelAnim.current.targetOpacity = 1
    btnAnim.current.targetX = w - AI_BTN_SIZE - AI_GAP
    btnAnim.current.targetY = h - AI_BTN_SIZE - AI_GAP
    if (reduceMotion) {
      Object.assign(panelAnim.current, { currentW: w, currentH: h, currentOpacity: 1 })
      Object.assign(btnAnim.current, { currentX: btnAnim.current.targetX, currentY: btnAnim.current.targetY })
    }
    setOpen(true)
    openRef.current = true
  }

  const closePanel = () => {
    panelAnim.current.targetW = 0
    panelAnim.current.targetH = 0
    panelAnim.current.targetOpacity = 0
    btnAnim.current.targetX = 0
    btnAnim.current.targetY = 0
    if (reduceMotion) {
      Object.assign(panelAnim.current, { currentW: 0, currentH: 0, currentOpacity: 0 })
      Object.assign(btnAnim.current, { currentX: 0, currentY: 0 })
    }
    setOpen(false)
    openRef.current = false
    endConversation(messagesRef.current)
  }

  const toggleOpen = () => { openRef.current ? closePanel() : openPanel() }

  // Boucle à ressort — identique à ProjectFormHome. En reduceMotion, les
  // valeurs current sont déjà égales aux target (voir openPanel/closePanel
  // ci-dessus) donc la boucle tourne mais n'anime rien.
  useEffect(() => {
    let raf = 0
    const tick = () => {
      const p = panelAnim.current
      const b = btnAnim.current
      p.vxW += (p.targetW - p.currentW) * AI_STIFFNESS; p.vxW *= AI_FRICTION; p.currentW += p.vxW
      p.vxH += (p.targetH - p.currentH) * AI_STIFFNESS; p.vxH *= AI_FRICTION; p.currentH += p.vxH
      p.vxO += (p.targetOpacity - p.currentOpacity) * AI_STIFFNESS; p.vxO *= AI_FRICTION; p.currentOpacity += p.vxO
      b.vxX += (b.targetX - b.currentX) * AI_STIFFNESS; b.vxX *= AI_FRICTION; b.currentX += b.vxX
      b.vxY += (b.targetY - b.currentY) * AI_STIFFNESS; b.vxY *= AI_FRICTION; b.currentY += b.vxY
      if (panelRef.current) {
        panelRef.current.style.width = `${p.currentW}px`
        panelRef.current.style.height = `${p.currentH}px`
        panelRef.current.style.opacity = String(p.currentOpacity)
        panelRef.current.style.visibility = p.currentOpacity > 0.05 ? 'visible' : 'hidden'
      }
      if (btnRef.current) {
        btnRef.current.style.transform = `translate3d(${b.currentX}px, ${-b.currentY}px, 0)`
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  useEffect(() => {
    if (!listRef.current) return
    listRef.current.scrollTop = listRef.current.scrollHeight
  }, [messages, streaming])

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
        body: JSON.stringify({ messages: nextMessages, sessionId: sessionIdRef.current }),
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

  if (pathname?.startsWith('/explorer')) return null
  if (!mounted) return null

  return createPortal(
    <motion.div
      ref={wrapRef}
      initial={reduceMotion ? false : { scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: reduceMotion ? 0 : 2.4, type: 'spring', stiffness: 260, damping: 20 }}
      style={{ position: 'fixed', bottom: '2rem', left: '2rem', zIndex: 9000 }}
    >
      {/* ── Fenêtre de chat ── */}
      <div
        ref={panelRef}
        role="dialog"
        aria-label="Assistant AKATech"
        aria-hidden={!open}
        style={{
          position: 'absolute', bottom: 0, left: 0, zIndex: 1, overflow: 'hidden',
          background: T.card,
          border: `3px solid ${T.green}`,
          borderRadius: 12,
          boxShadow: '8px 8px 0px #050505',
        }}
      >
        <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* Header */}
          <div style={{
            padding: '1rem 4.2rem 1rem 1.2rem', display: 'flex', alignItems: 'center', gap: '.7rem',
            borderBottom: `2px solid ${T.green}`,
            background: T.light ? 'rgba(136,202,83,.07)' : 'rgba(136,202,83,.06)',
            flexShrink: 0,
          }}>
            <div style={{
              width: 34, height: 34, borderRadius: 6, background: T.green,
              border: '2px solid #050505',
              boxShadow: '2px 2px 0px #050505',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#08120a', flexShrink: 0,
            }}>
              <Bot size={20} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: '1.1rem', fontWeight: 900, fontStyle: 'italic', textTransform: 'uppercase', color: T.textMain, letterSpacing: '.02em' }}>
                ASSISTANT AKATECH
              </div>
              <div style={{ fontSize: '.7rem', color: T.green, fontFamily: "'JetBrains Mono',monospace", fontWeight: 600 }}>
                ⚡ Répond en direct
              </div>
            </div>
          </div>

          {/* Messages */}
          <div ref={listRef} style={{ flex: 1, overflowY: 'auto', padding: '1rem 1.1rem', display: 'flex', flexDirection: 'column', gap: '.85rem', background: T.bg }}>
            {messages.map((m, i) => (
              <div key={i} style={{
                alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '86%',
                background: m.role === 'user' ? T.green : T.card,
                color: m.role === 'user' ? '#08120a' : T.textMain,
                padding: '.7rem .95rem', borderRadius: 8,
                border: m.role === 'user'
                  ? ('2px solid #050505')
                  : `2px solid ${T.green}`,
                boxShadow: m.role === 'user'
                  ? ('3px 3px 0px #050505')
                  : `3px 3px 0px ${T.green}`,
                fontSize: '.85rem', fontWeight: m.role === 'user' ? 700 : 500, lineHeight: 1.55, whiteSpace: 'pre-wrap', wordBreak: 'break-word',
              }}>
                {m.role === 'assistant' && m.content === '' && streaming && i === messages.length - 1
                  ? <TypingDots color={T.green} />
                  : renderMessageContent(m.content)}
              </div>
            ))}
            {errorMsg && (
              <div style={{ display: 'flex', gap: '.4rem', alignItems: 'flex-start', fontSize: '.78rem', color: '#e08a4a', background: 'rgba(224,138,74,.1)', padding: '.5rem', border: '1px solid #e08a4a', borderRadius: 6 }}>
                <MessageCircleWarning size={15} style={{ flexShrink: 0, marginTop: 1 }} />
                {errorMsg}
              </div>
            )}
          </div>

          {/* Input */}
          <div style={{ padding: '.8rem', borderTop: `2px solid ${T.green}`, background: T.card, display: 'flex', gap: '.6rem', flexShrink: 0 }}>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Décrivez votre projet…"
              rows={1}
              disabled={streaming}
              tabIndex={open ? 0 : -1}
              aria-label="Votre message"
              style={{
                flex: 1, resize: 'none', minHeight: 42, maxHeight: 90,
                background: T.light ? '#f7f7f7' : '#040d06',
                border: `2px solid ${T.green}`, borderRadius: 6,
                boxShadow: '3px 3px 0px #050505',
                padding: '.65rem .85rem', fontSize: '.85rem', color: T.textMain,
                fontFamily: 'inherit', outline: 'none',
              }}
            />
            <button
              type="button"
              onClick={send}
              disabled={streaming || !input.trim()}
              tabIndex={open ? 0 : -1}
              aria-label="Envoyer"
              style={{
                width: 44, height: 44, minWidth: 44, borderRadius: 6, flexShrink: 0,
                background: streaming || !input.trim() ? (T.light ? 'rgba(136,202,83,.2)' : '#1a3320') : T.green,
                border: '2px solid #050505',
                boxShadow: '3px 3px 0px #050505',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: streaming || !input.trim() ? 'default' : 'pointer',
                color: '#08120a', transition: 'transform .1s, background .15s',
              }}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Bouton flottant ── */}
      <button
        ref={btnRef}
        type="button"
        onClick={toggleOpen}
        aria-label={open ? "Fermer l'assistant AKATech" : "Ouvrir l'assistant AKATech"}
        style={{
          position: 'absolute', bottom: 0, left: 0, zIndex: 2,
          width: AI_BTN_SIZE, height: AI_BTN_SIZE, minWidth: 44, minHeight: 44, borderRadius: 12,
          background: T.green,
          border: '3px solid #050505',
          boxShadow: '4px 4px 0px #050505',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', color: '#08120a', padding: 0, willChange: 'transform',
        }}
      >
        {open ? <X size={24} /> : <Bot size={26} />}
      </button>
    </motion.div>,
    document.body
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