'use client'
import { useState, useEffect, useCallback } from 'react'
import {
  LayoutDashboard, BarChart3, MessagesSquare, Users, Search,
  X, ChevronLeft, ChevronRight, RefreshCw, Smartphone, Monitor, Tablet, Sun, Moon,
  Trash2, AlertTriangle,
} from 'lucide-react'
import {
  ResponsiveContainer, AreaChart, Area, BarChart, Bar as RBar,
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip,
} from 'recharts'
import { HoverSlideText } from '@/components/ui/index'
import Logo from '@/components/ui/Logo'

/* ────────────────────────────────────────────────────────────
   Ce dashboard n'utilise ni Tailwind ni shadcn/ui : ce projet ne les
   installe pas (le reste du site est en styles inline + useTheme()).
   Plutôt que d'ajouter ~6 nouvelles dépendances pour cette seule page,
   on reste cohérent avec le système de design existant. Seule
   exception : ce dashboard a son propre thème clair/sombre local
   (DASH_THEME_LIGHT / DASH_THEME_DARK + toggle), indépendant du
   useTheme() du site public — voir plus bas.

   Thème dashboard : indépendant du thème sombre/clair du site public
   (T.toggle du site n'existe pas ici) — palette inspirée des produits
   Google (Analytics/Cloud Console en clair, Workspace dark surface en
   sombre). Toggle propre au dashboard, persisté en localStorage.

   Auth : gérée entièrement par middleware.js (Basic Auth). Si cette
   page s'affiche, c'est que le navigateur a déjà validé les
   identifiants — aucune vérification à refaire ici.

   z-index élevé + position fixed plein écran : masque visuellement le
   Navbar/FloatingWA/AIAssistant du site public montés dans le layout
   racine, sans avoir à restructurer l'arborescence app/ en route
   groups (plus risqué pour un gain cosmétique).
   ──────────────────────────────────────────────────────────── */

const DASH_THEME_LIGHT = {
  light: true,
  bg: '#f6f8f9',
  bgAlt: '#f6f8f9',
  card: '#ffffff',
  textMain: '#1a1d1f',
  textSub: '#5f6368',
  textMuted: '#9aa0a6',
  green: '#4f8a2b',
  greenSub: '#3d7a1f',
  border: '#e4e7eb',
  border2: '#d2d6db',
  shadow: '0 1px 2px rgba(60,64,67,.08), 0 1px 6px rgba(60,64,67,.08)',
  shadowHover: '0 2px 6px rgba(60,64,67,.12), 0 6px 20px rgba(60,64,67,.10)',
  tabRail: '#eceff1',
  tabActive: '#ffffff',
}

const DASH_THEME_DARK = {
  light: false,
  bg: '#202124',
  bgAlt: '#202124',
  card: '#292a2d',
  textMain: '#e8eaed',
  textSub: '#9aa0a6',
  textMuted: '#80868b',
  green: '#88ca53',
  greenSub: '#6fb03f',
  border: '#3c4043',
  border2: '#5f6368',
  shadow: '0 1px 2px rgba(0,0,0,.35), 0 1px 6px rgba(0,0,0,.3)',
  shadowHover: '0 2px 8px rgba(0,0,0,.4), 0 6px 20px rgba(0,0,0,.35)',
  tabRail: '#303134',
  tabActive: '#3c4043',
}

const DASH_THEME_KEY = 'akatech-dashboard-theme'

const TABS = [
  { id: 'overview', label: 'Vue d\'ensemble', icon: LayoutDashboard },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'conversations', label: 'Conversations', icon: MessagesSquare },
  { id: 'leads', label: 'Leads', icon: Users },
]

const STATUS_LABELS = {
  NEW: 'Nouveau', QUALIFIED: 'Qualifié', CONTACTED: 'Contacté',
  CONVERTED: 'Converti', LOST: 'Perdu', ACTIVE: 'Actif', ENDED: 'Terminé',
}
const STATUS_COLORS = {
  NEW: '#5b8def', QUALIFIED: '#88ca53', CONTACTED: '#e0a83e',
  CONVERTED: '#3ee08a', LOST: '#e05e5e', ACTIVE: '#88ca53', ENDED: 'rgba(255,255,255,.4)',
}

function StatusPill({ status, T }) {
  const color = STATUS_COLORS[status] || T.textMuted
  return (
    <span style={{
      display: 'inline-block', padding: '3px 10px', borderRadius: 100,
      fontSize: '.7rem', fontWeight: 700, color,
      background: `${color}1a`, border: `1px solid ${color}44`,
      whiteSpace: 'nowrap',
    }}>
      {STATUS_LABELS[status] || status}
    </span>
  )
}

function KpiCard({ label, value, sub, T }) {
  return (
    <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 18, boxShadow: T.shadow, padding: '1.3rem 1.3rem 1.1rem' }}>
      <div style={{ fontSize: '.68rem', fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: T.textMuted, marginBottom: 10 }}>
        {label}
      </div>
      <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontStyle: 'italic', fontSize: '2.2rem', fontWeight: 900, color: T.textMain, lineHeight: 1 }}>
        {value}
      </div>
      {sub && <div style={{ fontSize: '.75rem', color: T.textSub, marginTop: 8 }}>{sub}</div>}
    </div>
  )
}

function ChartTooltip({ active, payload, label, T, unit = '' }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: T.card, border: `1px solid ${T.border2}`, borderRadius: 8,
      padding: '.5rem .7rem', fontSize: '.75rem', boxShadow: '0 4px 16px rgba(0,0,0,.25)',
    }}>
      {label !== undefined && <div style={{ color: T.textMuted, marginBottom: 2 }}>{label}</div>}
      {payload.map((p, i) => (
        <div key={i} style={{ color: T.textMain, fontWeight: 700 }}>
          {p.value}{unit} {p.name && p.name !== label ? <span style={{ color: T.textMuted, fontWeight: 400 }}>— {p.name}</span> : null}
        </div>
      ))}
    </div>
  )
}

function UsageBar({ label, usage, T }) {
  const { count, approxLimit } = usage
  const pct = Math.min((count / approxLimit) * 100, 100)
  const color = pct > 90 ? '#e05e5e' : pct > 70 ? '#e0a83e' : T.green
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.75rem', marginBottom: 5 }}>
        <span style={{ color: T.textSub }}>{label}</span>
        <span style={{ color: T.textMain, fontWeight: 700 }}>{count} <span style={{ color: T.textMuted, fontWeight: 400 }}>/ ~{approxLimit}</span></span>
      </div>
      <div style={{ height: 8, borderRadius: 4, background: T.border, overflow: 'hidden' }}>
        <div style={{ width: `${Math.max(pct, 2)}%`, height: '100%', background: color, borderRadius: 4 }} />
      </div>
    </div>
  )
}

function Pagination({ pagination, onPage, T }) {
  if (!pagination || pagination.pages <= 1) return null
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginTop: '1.2rem' }}>
      <button onClick={() => onPage(pagination.page - 1)} disabled={pagination.page <= 1}
        style={{ background: 'none', border: `1px solid ${T.border}`, borderRadius: 8, padding: 10, minWidth: 40, minHeight: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.textMain, cursor: pagination.page <= 1 ? 'default' : 'pointer', opacity: pagination.page <= 1 ? .4 : 1 }}>
        <ChevronLeft size={16} />
      </button>
      <span style={{ fontSize: '.8rem', color: T.textSub }}>Page {pagination.page} / {pagination.pages}</span>
      <button onClick={() => onPage(pagination.page + 1)} disabled={pagination.page >= pagination.pages}
        style={{ background: 'none', border: `1px solid ${T.border}`, borderRadius: 8, padding: 10, minWidth: 40, minHeight: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.textMain, cursor: pagination.page >= pagination.pages ? 'default' : 'pointer', opacity: pagination.page >= pagination.pages ? .4 : 1 }}>
        <ChevronRight size={16} />
      </button>
    </div>
  )
}

function DetailModal({ conversation, onClose, T }) {
  if (!conversation) return null
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 10, background: 'rgba(0,0,0,.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'clamp(.75rem, 4vw, 2rem)' }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        background: T.card, border: `1px solid ${T.border}`, borderRadius: 20, width: 'min(560px, 100%)',
        boxShadow: '0 8px 24px rgba(60,64,67,.15), 0 2px 6px rgba(60,64,67,.1)',
        maxHeight: '80vh', display: 'flex', flexDirection: 'column', overflow: 'hidden',
      }}>
        <div style={{ padding: '1.2rem 1.4rem', borderBottom: `1px solid ${T.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontStyle: 'italic', fontSize: '.95rem', fontWeight: 900, color: T.textMain }}>
              Conversation {conversation.sessionId?.slice(0, 8)}
            </div>
            <div style={{ fontSize: '.7rem', color: T.textMuted, marginTop: 2 }}>
              {new Date(conversation.createdAt).toLocaleString('fr-FR')}
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: T.textSub, cursor: 'pointer', padding: 10, minWidth: 44, minHeight: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><X size={20} /></button>
        </div>
        <div style={{ padding: '1.2rem 1.4rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {conversation.lead && (
            <div style={{ background: 'rgba(136,202,83,.06)', border: `1px solid ${T.border2}`, borderRadius: 10, padding: '.8rem 1rem', marginBottom: 4 }}>
              <div style={{ fontSize: '.7rem', fontWeight: 700, color: T.green, marginBottom: 4 }}>LEAD · SCORE {conversation.lead.score}/100</div>
              <div style={{ fontSize: '.8rem', color: T.textMain }}>{conversation.lead.name} — {conversation.lead.contact}</div>
            </div>
          )}
          {(conversation.messages || []).map((m) => (
            <div key={m.id} style={{
              alignSelf: m.role === 'USER' ? 'flex-end' : 'flex-start', maxWidth: '85%',
              background: m.role === 'USER' ? T.green : (T.light ? '#f0f0f0' : 'rgba(255,255,255,.05)'),
              color: m.role === 'USER' ? '#08120a' : T.textMain,
              padding: '.55rem .8rem', borderRadius: 12, fontSize: '.8rem', lineHeight: 1.5, whiteSpace: 'pre-wrap',
            }}>
              {m.content}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Confirmation custom (remplace window.confirm natif, non stylable) —
// affiche le libellé de l'élément visé pour éviter un mauvais clic,
// et désactive le bouton pendant l'appel réseau pour éviter un double-submit.
function ConfirmModal({ target, onCancel, onConfirm, deleting, T }) {
  if (!target) return null
  return (
    <div onClick={onCancel} style={{
      position: 'fixed', inset: 0, zIndex: 10100, display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,.4)', padding: '1.2rem',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: T.card, border: `1px solid ${T.border}`, borderRadius: 18, width: 'min(400px, 100%)',
        boxShadow: '0 8px 24px rgba(60,64,67,.18), 0 2px 6px rgba(60,64,67,.12)',
        padding: '1.5rem',
      }}>
        <div style={{ display: 'flex', gap: 12, marginBottom: '1.1rem' }}>
          <div style={{
            width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
            background: 'rgba(217,48,37,.1)', color: '#d93025',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <AlertTriangle size={18} />
          </div>
          <div>
            <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontStyle: 'italic', fontWeight: 900, fontSize: '1.1rem', color: T.textMain }}>
              Supprimer {target.type === 'lead' ? 'ce lead' : 'cette conversation'} ?
            </div>
            <div style={{ fontSize: '.8rem', color: T.textSub, marginTop: 4 }}>
              {target.label}
            </div>
          </div>
        </div>
        <div style={{ fontSize: '.78rem', color: T.textMuted, marginBottom: '1.3rem' }}>
          {target.type === 'lead'
            ? "Le lead sera supprimé définitivement. La conversation associée n'est pas touchée."
            : 'La conversation et tous ses messages seront supprimés définitivement.'}
          {' '}Cette action est irréversible.
        </div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button onClick={onCancel} disabled={deleting} style={{
            background: 'none', border: `1px solid ${T.border}`, borderRadius: 100,
            padding: '.55rem 1.1rem', color: T.textSub, cursor: 'pointer', fontSize: '.82rem', fontWeight: 700,
          }}>
            Annuler
          </button>
          <button onClick={onConfirm} disabled={deleting} style={{
            background: '#d93025', border: '1px solid #d93025', borderRadius: 100,
            padding: '.55rem 1.1rem', color: '#fff', cursor: deleting ? 'default' : 'pointer', fontSize: '.82rem', fontWeight: 700,
            display: 'flex', alignItems: 'center', gap: 6, opacity: deleting ? .7 : 1,
          }}>
            <Trash2 size={13} /> {deleting ? 'Suppression…' : 'Supprimer'}
          </button>
        </div>
      </div>
    </div>
  )
}

// Valeurs par défaut si /api/stats renvoie un objet où une section
// manque (ex: la requête visiteurs échoue côté serveur pendant que le
// reste réussit) : stats existe alors, mais stats.visitors non — d'où
// le crash "Cannot read properties of undefined (reading totalVisitors)"
// sur v.totalVisitors plus bas. On normalise une fois ici plutôt que de
// semer des `?.` partout dans le JSX.
const EMPTY_VISITORS = {
  totalVisitors: 0, newVisitors: 0, totalSessions: 0, totalPageViews: 0,
  bounceRate: 0, avgSessionDurationSeconds: 0,
  devices: [], sources: [], topPages: [], activeHours: [],
}

function normalizeStats(d) {
  return {
    ...d,
    visitors: { ...EMPTY_VISITORS, ...d?.visitors },
    conversations: { total: 0, today: 0, ...d?.conversations },
    leads: { total: 0, qualified: 0, avgScore: 0, ...d?.leads },
    conversion: { rate: 0, ...d?.conversion },
    activity: d?.activity ?? [],
  }
}

export default function DashboardPage() {
  const [isDark, setIsDark] = useState(false)
  useEffect(() => {
    const saved = localStorage.getItem(DASH_THEME_KEY)
    if (saved === 'dark') setIsDark(true)
  }, [])
  const toggleTheme = () => {
    setIsDark(d => {
      localStorage.setItem(DASH_THEME_KEY, d ? 'light' : 'dark')
      return !d
    })
  }
  const T = isDark ? DASH_THEME_DARK : DASH_THEME_LIGHT
  const CARD = { background: T.card, border: `1px solid ${T.border}`, borderRadius: 18, boxShadow: T.shadow }
  const [tab, setTab] = useState('overview')
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  const [conversations, setConversations] = useState([])
  const [convPage, setConvPage] = useState(1)
  const [convPagination, setConvPagination] = useState(null)
  const [convSearch, setConvSearch] = useState('')
  const [selectedConversation, setSelectedConversation] = useState(null)
  const [confirmTarget, setConfirmTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const [leads, setLeads] = useState([])
  const [leadPage, setLeadPage] = useState(1)
  const [leadPagination, setLeadPagination] = useState(null)
  const [leadSearch, setLeadSearch] = useState('')
  const [leadStatusFilter, setLeadStatusFilter] = useState('')

  const loadStats = useCallback(() => {
    setLoading(true)
    fetch('/api/stats')
      .then(r => r.json())
      .then(d => setStats(normalizeStats(d)))
      .catch(err => console.error('Erreur chargement stats:', err))
      .finally(() => setLoading(false))
  }, [])

  const loadConversations = useCallback(() => {
    const params = new URLSearchParams({ page: convPage, limit: 15, ...(convSearch ? { search: convSearch } : {}) })
    fetch(`/api/conversations?${params}`).then(r => r.json()).then((d) => {
      setConversations(d.conversations || [])
      setConvPagination(d.pagination)
    }).catch(err => console.error('Erreur chargement conversations:', err))
  }, [convPage, convSearch])

  const loadLeads = useCallback(() => {
    const params = new URLSearchParams({
      page: leadPage, limit: 15,
      ...(leadSearch ? { search: leadSearch } : {}),
      ...(leadStatusFilter ? { status: leadStatusFilter } : {}),
    })
    fetch(`/api/leads?${params}`).then(r => r.json()).then((d) => {
      setLeads(d.leads || [])
      setLeadPagination(d.pagination)
    }).catch(err => console.error('Erreur chargement leads:', err))
  }, [leadPage, leadSearch, leadStatusFilter])

  useEffect(() => { loadStats() }, [loadStats])
  useEffect(() => { if (tab === 'conversations') loadConversations() }, [tab, loadConversations])
  useEffect(() => { if (tab === 'leads') loadLeads() }, [tab, loadLeads])

  // Rafraîchissement automatique — remplace le rapport par email comme
  // moyen de voir arriver une nouvelle conversation : plus besoin de
  // cliquer "Actualiser", la vue active se met à jour toute seule.
  useEffect(() => {
    const interval = setInterval(() => {
      loadStats()
      if (tab === 'conversations') loadConversations()
      if (tab === 'leads') loadLeads()
    }, 30_000)
    return () => clearInterval(interval)
  }, [tab, loadStats, loadConversations, loadLeads])

  async function openConversation(id) {
    const res = await fetch(`/api/conversations/${id}`)
    const d = await res.json()
    setSelectedConversation(d.conversation)
  }

  async function updateLeadStatus(id, status) {
    await fetch('/api/leads', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    })
    loadLeads()
  }

  async function confirmDeletion() {
    if (!confirmTarget) return
    setDeleting(true)
    try {
      if (confirmTarget.type === 'lead') {
        await fetch(`/api/leads?id=${confirmTarget.id}`, { method: 'DELETE' })
        loadLeads()
      } else {
        await fetch(`/api/conversations/${confirmTarget.id}`, { method: 'DELETE' })
        if (selectedConversation?.id === confirmTarget.id) setSelectedConversation(null)
        loadConversations()
      }
    } catch (err) {
      console.error('Erreur suppression:', err)
    } finally {
      setDeleting(false)
      setConfirmTarget(null)
    }
  }

  const v = stats?.visitors
  const deviceIcon = { mobile: Smartphone, desktop: Monitor, tablet: Tablet }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9500, overflowY: 'auto',
      background: T.bg, color: T.textMain, fontFamily: 'inherit',
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem 1.2rem 4rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.8rem', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.6rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '.7rem' }}>
            <Logo size={13} animate={false} />
            <h1 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontStyle: 'italic', fontSize: '1.7rem', fontWeight: 900, margin: 0, color: T.textMain }}>Dashboard</h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '.6rem' }}>
            <button onClick={toggleTheme} title={isDark ? 'Passer en clair' : 'Passer en sombre'} style={{
              ...CARD, borderRadius: 100, width: 40, height: 40, padding: 0,
              color: T.textSub, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              {isDark ? <Sun size={15} /> : <Moon size={15} />}
            </button>
            <button onClick={loadStats} title="Rafraîchir maintenant (actualisation auto toutes les 30s)" style={{
              ...CARD, borderRadius: 100, padding: '.6rem 1.1rem',
              color: T.textSub, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
              fontFamily: "'Barlow Condensed',sans-serif", fontStyle: 'italic', fontWeight: 900, fontSize: '.82rem',
              minHeight: 40, flexShrink: 0,
            }}>
              <RefreshCw size={14} /> <HoverSlideText text="Auto · 30s" />
            </button>
          </div>
        </div>

        {/* Onglets — pilule Google-style, actif en carte avec ombre */}
        <div style={{ display: 'inline-flex', gap: 4, marginBottom: '1.6rem', background: T.tabRail, borderRadius: 100, padding: 4, overflowX: 'auto', maxWidth: '100%' }}>
          {TABS.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setTab(id)} style={{
              background: tab === id ? T.tabActive : 'none',
              boxShadow: tab === id ? T.shadow : 'none',
              border: 'none', borderRadius: 100,
              color: tab === id ? T.textMain : T.textSub, padding: '.6rem 1.1rem', cursor: 'pointer',
              fontSize: '.82rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap',
              transition: 'background .2s, box-shadow .2s',
            }}>
              <Icon size={15} /> {label}
            </button>
          ))}
        </div>

        {loading && !stats ? (
          <div style={{ color: T.textMuted, fontSize: '.85rem' }}>Chargement…</div>
        ) : (
          <>
            {tab === 'overview' && stats && (
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12, marginBottom: 24 }}>
                  <KpiCard T={T} label="Visiteurs (30j)" value={v.totalVisitors} sub={`${v.newVisitors} nouveaux`} />
                  <KpiCard T={T} label="Sessions" value={v.totalSessions} sub={`${v.totalPageViews} pages vues`} />
                  <KpiCard T={T} label="Taux de rebond" value={`${v.bounceRate}%`} />
                  <KpiCard T={T} label="Durée moy." value={`${Math.floor(v.avgSessionDurationSeconds / 60)}m${String(v.avgSessionDurationSeconds % 60).padStart(2, '0')}`} />
                  <KpiCard T={T} label="Conversations" value={stats.conversations.total} sub={`${stats.conversations.today} aujourd'hui`} />
                  <KpiCard T={T} label="Leads" value={stats.leads.total} sub={`${stats.leads.qualified} qualifiés`} />
                  <KpiCard T={T} label="Taux conversion" value={`${stats.conversion.rate}%`} />
                  <KpiCard T={T} label="Score moy. lead" value={`${stats.leads.avgScore}/100`} />
                </div>

                <div style={{ ...CARD, padding: '1.2rem' }}>
                  <div style={{ fontSize: '.78rem', fontWeight: 700, color: T.textSub, marginBottom: 12 }}>Activité — 30 derniers jours</div>
                  {stats.activity.length === 0 ? (
                    <div style={{ color: T.textMuted, fontSize: '.78rem' }}>Pas encore de données</div>
                  ) : (
                    <ResponsiveContainer width="100%" height={180}>
                      <AreaChart data={stats.activity} margin={{ top: 6, right: 6, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="activityGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={T.green} stopOpacity={0.35} />
                            <stop offset="100%" stopColor={T.green} stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke={T.border} vertical={false} />
                        <XAxis
                          dataKey="date"
                          tick={{ fontSize: 10, fill: T.textMuted }}
                          tickFormatter={(d) => d.slice(5)}
                          axisLine={{ stroke: T.border }}
                          tickLine={false}
                          interval="preserveStartEnd"
                        />
                        <YAxis tick={{ fontSize: 10, fill: T.textMuted }} axisLine={false} tickLine={false} allowDecimals={false} width={28} />
                        <RTooltip content={<ChartTooltip T={T} />} />
                        <Area type="monotone" dataKey="count" name="Conversations" stroke={T.green} strokeWidth={2} fill="url(#activityGradient)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}
                </div>

                {stats.aiUsage && (
                  <div style={{ ...CARD, padding: '1.2rem', marginTop: 16 }}>
                    <div style={{ fontSize: '.78rem', fontWeight: 700, color: T.textSub, marginBottom: 4 }}>Usage IA aujourd'hui</div>
                    <div style={{ fontSize: '.7rem', color: T.textMuted, marginBottom: 14 }}>
                      Repères indicatifs (limites publiques des fournisseurs, approximatives) — pas un compteur exact de ton quota restant.
                    </div>
                    <UsageBar T={T} label="Gemini" usage={stats.aiUsage.gemini} />
                    <UsageBar T={T} label="Groq (Llama 3.1 8B)" usage={stats.aiUsage.groq} />
                  </div>
                )}
              </div>
            )}

            {tab === 'analytics' && v && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
                <div style={{ ...CARD, padding: '1.2rem' }}>
                  <div style={{ fontSize: '.78rem', fontWeight: 700, color: T.textSub, marginBottom: 14 }}>Appareils</div>
                  {v.devices.length === 0 ? (
                    <div style={{ color: T.textMuted, fontSize: '.78rem' }}>Pas encore de données</div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <ResponsiveContainer width="50%" height={140}>
                        <PieChart>
                          <Pie data={v.devices} dataKey="count" nameKey="device" innerRadius={35} outerRadius={58} paddingAngle={3}>
                            {v.devices.map((d, i) => (
                              <Cell key={d.device} fill={[T.green, '#5b8def', '#e0a83e'][i % 3]} stroke="none" />
                            ))}
                          </Pie>
                          <RTooltip content={<ChartTooltip T={T} />} />
                        </PieChart>
                      </ResponsiveContainer>
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {v.devices.map((d, i) => {
                          const Icon = deviceIcon[d.device] || Monitor
                          const color = [T.green, '#5b8def', '#e0a83e'][i % 3]
                          return (
                            <div key={d.device} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '.75rem' }}>
                              <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0 }} />
                              <Icon size={13} color={T.textMuted} />
                              <span style={{ color: T.textSub, flex: 1 }}>{d.device}</span>
                              <span style={{ color: T.textMain, fontWeight: 700 }}>{d.count}</span>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
                <div style={{ ...CARD, padding: '1.2rem' }}>
                  <div style={{ fontSize: '.78rem', fontWeight: 700, color: T.textSub, marginBottom: 14 }}>Sources de trafic</div>
                  {v.sources.length === 0 ? (
                    <div style={{ color: T.textMuted, fontSize: '.78rem' }}>Pas encore de données</div>
                  ) : (
                    <ResponsiveContainer width="100%" height={Math.max(v.sources.length * 32, 60)}>
                      <BarChart data={v.sources} layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
                        <XAxis type="number" hide allowDecimals={false} />
                        <YAxis type="category" dataKey="source" tick={{ fontSize: 11, fill: T.textSub }} axisLine={false} tickLine={false} width={90} />
                        <RTooltip content={<ChartTooltip T={T} />} cursor={{ fill: T.border, opacity: .3 }} />
                        <RBar dataKey="count" name="Visites" fill={T.green} radius={[0, 4, 4, 0]} barSize={14} />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
                <div style={{ ...CARD, padding: '1.2rem' }}>
                  <div style={{ fontSize: '.78rem', fontWeight: 700, color: T.textSub, marginBottom: 14 }}>Pages les plus vues</div>
                  {v.topPages.length === 0 ? (
                    <div style={{ color: T.textMuted, fontSize: '.78rem' }}>Pas encore de données</div>
                  ) : (
                    <ResponsiveContainer width="100%" height={Math.max(v.topPages.length * 32, 60)}>
                      <BarChart data={v.topPages} layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
                        <XAxis type="number" hide allowDecimals={false} />
                        <YAxis type="category" dataKey="path" tick={{ fontSize: 11, fill: T.textSub }} axisLine={false} tickLine={false} width={90} />
                        <RTooltip content={<ChartTooltip T={T} />} cursor={{ fill: T.border, opacity: .3 }} />
                        <RBar dataKey="count" name="Vues" fill={T.green} radius={[0, 4, 4, 0]} barSize={14} />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
                <div style={{ ...CARD, padding: '1.2rem' }}>
                  <div style={{ fontSize: '.78rem', fontWeight: 700, color: T.textSub, marginBottom: 14 }}>Heures actives</div>
                  <ResponsiveContainer width="100%" height={140}>
                    <BarChart data={v.activeHours} margin={{ top: 6, right: 6, left: -20, bottom: 0 }}>
                      <XAxis
                        dataKey="hour"
                        tick={{ fontSize: 10, fill: T.textMuted }}
                        tickFormatter={(h) => `${h}h`}
                        axisLine={{ stroke: T.border }}
                        tickLine={false}
                        interval={3}
                      />
                      <YAxis tick={{ fontSize: 10, fill: T.textMuted }} axisLine={false} tickLine={false} allowDecimals={false} width={28} />
                      <RTooltip content={<ChartTooltip T={T} />} cursor={{ fill: T.border, opacity: .3 }} />
                      <RBar dataKey="count" name="Pages vues" fill={T.green} radius={[3, 3, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {tab === 'conversations' && (
              <div>
                <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, background: T.card, border: `1px solid ${T.border}`, borderRadius: 10, padding: '.5rem .8rem' }}>
                    <Search size={15} color={T.textMuted} />
                    <input
                      value={convSearch}
                      onChange={(e) => { setConvSearch(e.target.value); setConvPage(1) }}
                      placeholder="Rechercher…"
                      style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: T.textMain, fontSize: '.82rem' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {conversations.length === 0 && <div style={{ color: T.textMuted, fontSize: '.82rem', padding: '1rem 0' }}>Aucune conversation.</div>}
                  {conversations.map((c) => (
                    <div key={c.id} style={{
                      ...CARD, borderRadius: 14,
                      padding: '.9rem 1rem', color: T.textMain,
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10,
                    }}>
                      <button onClick={() => openConversation(c.id)} style={{
                        flex: 1, minWidth: 0, textAlign: 'left', background: 'none', border: 'none', padding: 0,
                        cursor: 'pointer', color: T.textMain, font: 'inherit',
                      }}>
                        <div style={{ fontSize: '.82rem', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {c.messages?.[0]?.content || '(vide)'}
                        </div>
                        <div style={{ fontSize: '.7rem', color: T.textMuted, marginTop: 3 }}>
                          {new Date(c.createdAt).toLocaleString('fr-FR')} · {c._count?.messages ?? 0} messages
                        </div>
                      </button>
                      <StatusPill status={c.status} T={T} />
                      <button
                        onClick={() => setConfirmTarget({ type: 'conversation', id: c.id, label: c.messages?.[0]?.content?.slice(0, 60) || '(vide)' })}
                        title="Supprimer cette conversation"
                        style={{
                          background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0,
                          color: T.textMuted, padding: 6, display: 'flex', borderRadius: 8,
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
                <Pagination pagination={convPagination} onPage={setConvPage} T={T} />
              </div>
            )}

            {tab === 'leads' && (
              <div>
                <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: 180, display: 'flex', alignItems: 'center', gap: 8, background: T.card, border: `1px solid ${T.border}`, borderRadius: 10, padding: '.5rem .8rem' }}>
                    <Search size={15} color={T.textMuted} />
                    <input
                      value={leadSearch}
                      onChange={(e) => { setLeadSearch(e.target.value); setLeadPage(1) }}
                      placeholder="Rechercher un lead…"
                      style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: T.textMain, fontSize: '.82rem' }}
                    />
                  </div>
                  <select
                    value={leadStatusFilter}
                    onChange={(e) => { setLeadStatusFilter(e.target.value); setLeadPage(1) }}
                    style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 10, padding: '.5rem .8rem', color: T.textMain, fontSize: '.82rem' }}
                  >
                    <option value="">Tous les statuts</option>
                    {Object.keys(STATUS_LABELS).filter(s => ['NEW', 'QUALIFIED', 'CONTACTED', 'CONVERTED', 'LOST'].includes(s)).map((s) => (
                      <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {leads.length === 0 && <div style={{ color: T.textMuted, fontSize: '.82rem', padding: '1rem 0' }}>Aucun lead pour l'instant.</div>}
                  {leads.map((lead) => (
                    <div key={lead.id} style={{
                      ...CARD, borderRadius: 14, padding: '.9rem 1rem',
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap',
                    }}>
                      <div style={{ minWidth: 0, flex: 1, cursor: 'pointer' }} onClick={() => lead.conversation?.id && openConversation(lead.conversation.id)}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontSize: '.85rem', fontWeight: 700 }}>{lead.name}</span>
                          <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontStyle: 'italic', fontSize: '.8rem', color: T.green, fontWeight: 900 }}>{lead.score}/100</span>
                        </div>
                        <div style={{ fontSize: '.75rem', color: T.textSub, marginTop: 2 }}>{lead.contact} · {lead.summary?.slice(0, 70)}{lead.summary?.length > 70 ? '…' : ''}</div>
                      </div>
                      <select
                        value={lead.status}
                        onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                        style={{ background: 'none', border: `1px solid ${T.border}`, borderRadius: 8, padding: '.3rem .5rem', color: T.textMain, fontSize: '.75rem', flexShrink: 0 }}
                      >
                        {['NEW', 'QUALIFIED', 'CONTACTED', 'CONVERTED', 'LOST'].map((s) => (
                          <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                        ))}
                      </select>
                      <button
                        onClick={() => setConfirmTarget({ type: 'lead', id: lead.id, label: `${lead.name} · ${lead.contact}` })}
                        title="Supprimer ce lead"
                        style={{
                          background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0,
                          color: T.textMuted, padding: 6, display: 'flex', borderRadius: 8,
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
                <Pagination pagination={leadPagination} onPage={setLeadPage} T={T} />
              </div>
            )}
          </>
        )}
      </div>

      <DetailModal conversation={selectedConversation} onClose={() => setSelectedConversation(null)} T={T} />
      <ConfirmModal target={confirmTarget} onCancel={() => !deleting && setConfirmTarget(null)} onConfirm={confirmDeletion} deleting={deleting} T={T} />
    </div>
  )
}