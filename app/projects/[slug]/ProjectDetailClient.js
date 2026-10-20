// app/projects/[slug]/ProjectDetailClient.js
// Page de détail d'une réalisation — le seul endroit où l'on « détaille » un
// projet (le bouton unique « Détail » des cartes mène ici ; le bouton
// « Voir le projet » vit dans cette page).
//
// Écrite pour un futur client, en langage de tous les jours : le problème de
// départ, ce qu'on a mis en place, ce que ça apporte, où en est le projet.
// Aucune technologie affichée. Textes : project.story (lib/project-stories.js).
//
// Un seul composant pour PC et mobile (mise en page en CSS) : le HTML est
// rendu côté serveur, donc lisible par les moteurs de recherche — contrairement
// aux paires Desktop/Mobile qui attendent `useEffect` avant d'afficher quoi que
// ce soit. Style : ProjectDetail.css (préfixe .pd-).
'use client'
import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, MessageCircle } from 'lucide-react'
import TransitionLink from '@/components/layout/TransitionLink'
import { HoverSlideText, LazyImg } from '@/components/ui/index'
import { useLanguage } from '@/lib/language'
import { trackAction } from '@/lib/track-action'
import { getProjectScreens, hasRealUrl, projectWhatsAppUrl } from '@/lib/project-stories'
import './ProjectDetail.css'

const cap = (text) => (text ? text.charAt(0).toUpperCase() + text.slice(1) : text)

/** Navigateur + téléphone : mêmes règles de captures que la page /projects. */
function Mockups({ project }) {
  const { t } = useLanguage()
  const { desktop, mobile, withBrowserBar } = getProjectScreens(project)
  const host = /^https?:\/\/([^/]+)/.exec(project.url || '')?.[1] || project.slug

  return (
    <div className="pd-visual">
      <div className="pd-desktop">
        {withBrowserBar && (
          <div className="pd-bar" aria-hidden="true">
            <i className="pd-bar-dot pd-bar-dot--r" />
            <i className="pd-bar-dot pd-bar-dot--y" />
            <i className="pd-bar-dot pd-bar-dot--g" />
            <span className="pd-bar-url">{host}</span>
          </div>
        )}
        <div className="pd-screen">
          {/* Image du premier écran : chargée tout de suite (pas de lazy) */}
          <img
            className="pd-shot"
            src={desktop}
            alt={`${t('pdScreenshotAlt')} ${project.title}`}
            loading="eager"
            decoding="async"
            fetchPriority="high"
          />
        </div>
      </div>

      {mobile && (
        <div className="pd-phone">
          <div className="pd-phone-screen">
            <img
              className="pd-shot"
              src={mobile}
              alt={`${t('pdScreenshotAlt')} ${project.title} — mobile`}
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      )}
    </div>
  )
}

/** Barre d'avancement : se remplit une fois, quand elle entre à l'écran. */
function Meter({ value, label }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-10% 0px' })
  const reduce = useReducedMotion()
  const filled = reduce || inView

  return (
    <div className="pd-meter" ref={ref}>
      <div className="pd-meter-top">
        <span>{label}</span>
        <strong>{value} %</strong>
      </div>
      <div
        className="pd-meter-track"
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={value}
      >
        <div className="pd-meter-fill" style={{ transform: `scaleX(${filled ? value / 100 : 0})` }} />
      </div>
    </div>
  )
}

function RelatedCard({ item }) {
  const { t } = useLanguage()
  return (
    <li>
      <TransitionLink
        href={`/projects/${item.slug}`}
        className="pd-card"
        aria-label={`${t('detailAria')} ${item.title}`}
        onClick={() => trackAction('cta_click')}
      >
        <div className="pd-card-img">
          <LazyImg src={item.img} alt="" className="pd-shot" />
        </div>
        <div className="pd-card-body">
          {item.category && <span className="pd-card-tag">{item.category}</span>}
          <h3 className="pd-card-title">{item.title}</h3>
          <p className="pd-card-pitch">{item.pitch}</p>
          <span className="btn-raised btn-sm pd-card-btn" aria-hidden="true">
            {t('detail')} <ArrowUpRight size={14} />
          </span>
        </div>
      </TransitionLink>
    </li>
  )
}

export default function ProjectDetailClient({ project, related, prev, next }) {
  const { t } = useLanguage()
  const story = project.story
  const online = hasRealUrl(project)
  const inProgress = project.progress != null && project.progress < 100

  const statusLabel = online
    ? cap(t('online'))
    : inProgress
      ? `${t('project_progress')} · ${project.progress} %`
      : t('delivered')

  // Texte « client » d'abord ; à défaut, les champs d'origine de la fiche.
  const pitch = story?.pitch || project.desc
  const problem = story?.problem || project.problem
  const solution = story?.solution || project.solution
  const features = story?.features || []
  const outcome = story?.outcome

  const allSameCategory = related.length > 0 && related.every((r) => r.sameCategory)
  const relatedTitle = allSameCategory && project.category
    ? `${t('pdSameCategory')} : ${project.category.label}`
    : t('pdOtherWork')

  const facts = [
    project.category && { label: t('pdFactCategory'), value: project.category.label },
    { label: t('status'), value: statusLabel },
    { label: t('project_year'), value: project.year },
    { label: t('project_market'), value: t('project_country') },
    { label: t('project_role'), value: t('project_design') },
  ].filter(Boolean)

  return (
    <article className="pd">
      {/* Fond identique à la landing PC : voir .pd-bg dans ProjectDetail.css */}
      <div className="pd-bg" aria-hidden="true">
        <div className="grid-bg pd-bg-grid" />
        <div className="pd-bg-glow" />
      </div>

      {/* ── HERO ─────────────────────────────────────────── */}
      <header className="pd-hero">
        <div className="pd-wrap pd-hero-grid">
          <div className="pd-hero-text">
            <TransitionLink href="/projects" className="pd-back">
              <ArrowLeft size={16} aria-hidden="true" /> {t('backToProjects')}
            </TransitionLink>

            <div className="pd-tags">
              {project.category && <span className="pd-sticker">{project.category.label}</span>}
              <span className="pd-status">
                <i className={`pd-dot${online ? ' is-live' : ''}`} aria-hidden="true" />
                {statusLabel} · {project.year}
              </span>
            </div>

            <h1 className="pd-title">{project.title}</h1>
            <p className="pd-pitch">{pitch}</p>

            <div className="pd-hero-actions">
              {online ? (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-raised"
                  onClick={() => trackAction('cta_click')}
                >
                  <HoverSlideText text={t('project_view')} /> <ArrowUpRight size={16} />
                </a>
              ) : (
                <span className="pd-soon">{t('pdLinkSoon')}</span>
              )}
            </div>
          </div>

          <Mockups project={project} />
        </div>
      </header>

      {/* ── FICHE RAPIDE ─────────────────────────────────── */}
      <div className="pd-wrap">
        <dl className="pd-facts" style={{ '--pd-n': facts.length }}>
          {facts.map((f) => (
            <div className="pd-fact" key={f.label}>
              <dt>{f.label}</dt>
              <dd>{f.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* ── LE PROBLÈME → NOTRE SOLUTION ─────────────────── */}
      {(problem || solution) && (
        <div className="pd-story" role="region" aria-label={`${t('caseProblem')} / ${t('caseSolution')}`}>
          {problem && (
            <div className="pd-wrap">
              <h2 className="pd-h2">{t('caseProblem')}</h2>
              <p className="pd-big pd-big--muted">{problem}</p>
            </div>
          )}
          {solution && (
            <div className="pd-solution">
              <div className="pd-wrap">
                <h2 className="pd-h2">{t('caseSolution')}</h2>
                <p className="pd-big">{solution}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── CE QUE ÇA APPORTE ────────────────────────────── */}
      {features.length > 0 && (
        <div className="pd-features">
          <div className="pd-wrap pd-features-grid">
            <div className="pd-features-head">
              <h2 className="pd-h2">{t('caseFeatures')}</h2>
            </div>
            <ul className="pd-list">
              {features.map((f) => (
                <li className="pd-item" key={f}>
                  <span className="pd-tick" aria-hidden="true"><Check size={16} strokeWidth={3} /></span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* ── OÙ EN EST LE PROJET ──────────────────────────── */}
      {(outcome || inProgress) && (
        <div className="pd-where">
          <div className="pd-wrap">
            <div className="pd-where-card">
              <h2 className="pd-h2">{t('pdWhereAt')}</h2>
              <div className="pd-where-body">
                {outcome && <p className="pd-where-text">{outcome}</p>}
                {inProgress && <Meter value={project.progress} label={t('pdProgress')} />}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── APPEL À L'ACTION ─────────────────────────────── */}
      <div className="pd-cta" role="region" aria-labelledby="pd-cta-title">
        <div className="pd-wrap">
          <div className="pd-cta-box">
            <h2 id="pd-cta-title" className="pd-cta-title">{t('caseCtaTitle')}</h2>
            {story?.audience && (
              <p className="pd-cta-lead">{t('pdIdealFor')} {story.audience}.</p>
            )}
            <div className="pd-cta-actions">
              <a
                href={projectWhatsAppUrl(project)}
                target="_blank"
                rel="noreferrer"
                className="btn-raised btn-xl"
                onClick={() => trackAction('whatsapp_click')}
              >
                <MessageCircle size={20} /> <HoverSlideText text={t('caseCtaWhatsApp')} />
              </a>
              <TransitionLink href="/devis" className="btn-ghost" onClick={() => trackAction('cta_click')}>
                <HoverSlideText text={t('caseCtaQuote')} />
              </TransitionLink>
            </div>
            <p className="pd-cta-note">{t('uiFreeQuote24')}</p>
          </div>
        </div>
      </div>

      {/* ── AUTRES RÉALISATIONS ──────────────────────────── */}
      {related.length > 0 && (
        <div className="pd-related" role="region" aria-labelledby="pd-related-title">
          <div className="pd-wrap">
            <h2 id="pd-related-title" className="pd-h2">{relatedTitle}</h2>
            <ul className="pd-cards">
              {related.map((item) => <RelatedCard key={item.slug} item={item} />)}
            </ul>
          </div>
        </div>
      )}

      {/* ── PRÉCÉDENT / SUIVANT ──────────────────────────── */}
      <nav className="pd-wrap pd-pager" aria-label={t('projects')}>
        <TransitionLink href={`/projects/${prev.slug}`} className="pd-pager-link">
          <ArrowLeft size={18} aria-hidden="true" />
          <span><small>{t('pdPrev')}</small>{prev.title}</span>
        </TransitionLink>
        <TransitionLink href={`/projects/${next.slug}`} className="pd-pager-link pd-pager-link--next">
          <span><small>{t('pdNext')}</small>{next.title}</span>
          <ArrowRight size={18} aria-hidden="true" />
        </TransitionLink>
      </nav>
    </article>
  )
}
