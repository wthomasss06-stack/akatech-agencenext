'use client'
import { useState, useEffect, useCallback } from 'react'
import { useTheme } from '@/lib/theme'
import {
  LayoutDashboard, BarChart3, MessagesSquare, Users, Search,
  X, ChevronLeft, ChevronRight, RefreshCw, Smartphone, Monitor, Tablet,
} from 'lucide-react'

/* ────────────────────────────────────────────────────────────
   Ce dashboard n'utilise ni Tailwind ni shadcn/ui : ce projet ne les
   installe pas (le reste du site est en styles inline + useTheme()).
   Plutôt que d'ajouter ~6 nouvelles dépendances pour cette seule page,
   on reste cohérent avec le système de design existant.

   Auth : gérée entièrement par middleware.js (Basic Auth). Si cette
   page s'affiche, c'est que le navigateur a déjà validé les
   identifiants — aucune vérification à refaire ici.

   z-index élevé + position fixed plein écran : masque visuellement le
   Navbar/FloatingWA/AIAssistant du site public montés dans le layout
   racine, sans avoir à restructurer l'arborescence app/ en route
   groups (plus risqué pour un gain cosmétique).
   ──────────────────────────────────────────────────────────── */

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
    <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, padding: '1.2rem' }}>
      <div style={{ fontSize: '.7rem', fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: T.textMuted, marginBottom: 8 }}>
        {label}
      </div>
      <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '1.9rem', fontWeight: 800, color: T.textMain, lineHeight: 1 }}>
        {value}
      </div>
      {sub && <div style={{ fontSize: '.75rem', color: T.textSub, marginTop: 6 }}>{sub}</div>}
    </div>
  )
}

function Bar({ label, value, max, T, icon: Icon }) {
  const pct = max > 0 ? Math.max((value / max) * 100, 2) : 0
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
      <div style={{ width: 110, fontSize: '.75rem', color: T.textSub, display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {Icon && <Icon size={13} />} {label}
      </div>
      <div style={{ flex: 1, height: 8, borderRadius: 4, background: T.border, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: T.green, borderRadius: 4 }} />
      </div>
      <div style={{ width: 34, textAlign: 'right', fontSize: '.75rem', fontWeight: 700, color: T.textMain, flexShrink: 0 }}>{value}</div>
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
        background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, width: 'min(560px, 100%)',
        maxHeight: '80vh', display: 'flex', flexDirection: 'column', overflow: 'hidden',
      }}>
        <div style={{ padding: '1.2rem 1.4rem', borderBottom: `1px solid ${T.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.85rem', fontWeight: 700, color: T.textMain }}>
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

export default function DashboardPage() {
  const T = useTheme()
  const [tab, setTab] = useState('overview')
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  const [conversations, setConversations] = useState([])
  const [convPage, setConvPage] = useState(1)
  const [convPagination, setConvPagination] = useState(null)
  const [convSearch, setConvSearch] = useState('')
  const [selectedConversation, setSelectedConversation] = useState(null)

  const [leads, setLeads] = useState([])
  const [leadPage, setLeadPage] = useState(1)
  const [leadPagination, setLeadPagination] = useState(null)
  const [leadSearch, setLeadSearch] = useState('')
  const [leadStatusFilter, setLeadStatusFilter] = useState('')

  const loadStats = useCallback(() => {
    setLoading(true)
    fetch('/api/stats').then(r => r.json()).then(setStats).finally(() => setLoading(false))
  }, [])

  const loadConversations = useCallback(() => {
    const params = new URLSearchParams({ page: convPage, limit: 15, ...(convSearch ? { search: convSearch } : {}) })
    fetch(`/api/conversations?${params}`).then(r => r.json()).then((d) => {
      setConversations(d.conversations || [])
      setConvPagination(d.pagination)
    })
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
    })
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

  const v = stats?.visitors
  const maxDevice = v ? Math.max(1, ...v.devices.map(d => d.count)) : 1
  const maxSource = v ? Math.max(1, ...v.sources.map(s => s.count)) : 1
  const maxPage = v ? Math.max(1, ...v.topPages.map(p => p.count)) : 1
  const maxHour = v ? Math.max(1, ...v.activeHours.map(h => h.count)) : 1

  const deviceIcon = { mobile: Smartphone, desktop: Monitor, tablet: Tablet }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9500, overflowY: 'auto',
      background: T.bg, color: T.textMain, fontFamily: 'inherit',
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem 1.2rem 4rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.8rem', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.6rem' }}>
          <div>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.75rem', fontWeight: 700, letterSpacing: '.1em', color: T.green, textTransform: 'uppercase' }}>
              AKATech
            </div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '4px 0 0' }}>Dashboard</h1>
          </div>
          <button onClick={loadStats} title="Rafraîchir maintenant (actualisation auto toutes les 30s)" style={{
            background: 'none', border: `1px solid ${T.border}`, borderRadius: 10, padding: '.6rem .9rem',
            color: T.textSub, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: '.78rem',
            minHeight: 40, flexShrink: 0,
          }}>
            <RefreshCw size={14} /> Auto · 30s
          </button>
        </div>

        {/* Onglets */}
        <div style={{ display: 'flex', gap: 6, marginBottom: '1.6rem', borderBottom: `1px solid ${T.border}`, overflowX: 'auto' }}>
          {TABS.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setTab(id)} style={{
              background: 'none', border: 'none', borderBottom: tab === id ? `2px solid ${T.green}` : '2px solid transparent',
              color: tab === id ? T.textMain : T.textMuted, padding: '.7rem .9rem', cursor: 'pointer',
              fontSize: '.82rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap',
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

                <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, padding: '1.2rem' }}>
                  <div style={{ fontSize: '.78rem', fontWeight: 700, color: T.textSub, marginBottom: 12 }}>Activité — 30 derniers jours</div>
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 80 }}>
                    {stats.activity.length === 0 && <div style={{ color: T.textMuted, fontSize: '.78rem' }}>Pas encore de données</div>}
                    {stats.activity.map((a) => {
                      const max = Math.max(1, ...stats.activity.map(x => x.count))
                      return (
                        <div key={a.date} title={`${a.date} — ${a.count}`} style={{
                          flex: 1, minWidth: 3, height: `${Math.max((a.count / max) * 100, 4)}%`,
                          background: T.green, borderRadius: '2px 2px 0 0', opacity: .8,
                        }} />
                      )
                    })}
                  </div>
                </div>
              </div>
            )}

            {tab === 'analytics' && v && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
                <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, padding: '1.2rem' }}>
                  <div style={{ fontSize: '.78rem', fontWeight: 700, color: T.textSub, marginBottom: 14 }}>Appareils</div>
                  {v.devices.length === 0 && <div style={{ color: T.textMuted, fontSize: '.78rem' }}>Pas encore de données</div>}
                  {v.devices.map((d) => <Bar key={d.device} T={T} label={d.device} value={d.count} max={maxDevice} icon={deviceIcon[d.device] || Monitor} />)}
                </div>
                <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, padding: '1.2rem' }}>
                  <div style={{ fontSize: '.78rem', fontWeight: 700, color: T.textSub, marginBottom: 14 }}>Sources de trafic</div>
                  {v.sources.length === 0 && <div style={{ color: T.textMuted, fontSize: '.78rem' }}>Pas encore de données</div>}
                  {v.sources.map((s) => <Bar key={s.source} T={T} label={s.source} value={s.count} max={maxSource} />)}
                </div>
                <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, padding: '1.2rem' }}>
                  <div style={{ fontSize: '.78rem', fontWeight: 700, color: T.textSub, marginBottom: 14 }}>Pages les plus vues</div>
                  {v.topPages.length === 0 && <div style={{ color: T.textMuted, fontSize: '.78rem' }}>Pas encore de données</div>}
                  {v.topPages.map((p) => <Bar key={p.path} T={T} label={p.path} value={p.count} max={maxPage} />)}
                </div>
                <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, padding: '1.2rem' }}>
                  <div style={{ fontSize: '.78rem', fontWeight: 700, color: T.textSub, marginBottom: 14 }}>Heures actives</div>
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 70 }}>
                    {v.activeHours.map((h) => (
                      <div key={h.hour} title={`${h.hour}h — ${h.count}`} style={{
                        flex: 1, height: `${Math.max((h.count / maxHour) * 100, 3)}%`,
                        background: T.green, borderRadius: '2px 2px 0 0', opacity: .8,
                      }} />
                    ))}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.65rem', color: T.textMuted, marginTop: 4 }}>
                    <span>0h</span><span>12h</span><span>23h</span>
                  </div>
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
                    <button key={c.id} onClick={() => openConversation(c.id)} style={{
                      textAlign: 'left', background: T.card, border: `1px solid ${T.border}`, borderRadius: 12,
                      padding: '.9rem 1rem', cursor: 'pointer', color: T.textMain,
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10,
                    }}>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: '.82rem', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {c.messages?.[0]?.content || '(vide)'}
                        </div>
                        <div style={{ fontSize: '.7rem', color: T.textMuted, marginTop: 3 }}>
                          {new Date(c.createdAt).toLocaleString('fr-FR')} · {c._count?.messages ?? 0} messages
                        </div>
                      </div>
                      <StatusPill status={c.status} T={T} />
                    </button>
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
                      background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: '.9rem 1rem',
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap',
                    }}>
                      <div style={{ minWidth: 0, flex: 1, cursor: 'pointer' }} onClick={() => lead.conversation?.id && openConversation(lead.conversation.id)}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontSize: '.85rem', fontWeight: 700 }}>{lead.name}</span>
                          <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.72rem', color: T.green, fontWeight: 700 }}>{lead.score}/100</span>
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
    </div>
  )
}
