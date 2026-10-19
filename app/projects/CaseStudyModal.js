// app/projects/CaseStudyModal.js
// Fiche « En savoir plus » d'une réalisation, ouverte depuis /projects
// (desktop ET mobile).
//
// MORPH : le panneau naît du bouton cliqué, grandit jusqu'à sa taille finale,
// puis se replie dans le bouton à la fermeture. Même mécanique à ressort que
// le panneau de l'assistant IA (components/ui/AIAssistant.js) : mêmes
// constantes (raideur 0.18, friction 0.65), mêmes équations, boucle rAF.
// Différences voulues :
//   • la boucle s'arrête dès que tout est posé (pas de rAF permanent) ;
//   • le pas est normalisé sur 60 Hz → même rythme sur écran 60 ou 120 Hz ;
//   • le contenu garde sa taille finale pendant la croissance (pas de
//     remise en page à chaque image) et apparaît en fondu en fin de course ;
//   • le panneau se déplace en translate3d, seule la taille touche la mise
//     en page (isolée par `contain`).
//
// Contenu écrit pour un futur client : aucune technologie — problème,
// solution, fonctions phares, résultat, puis appel à l'action toujours
// visible (WhatsApp pré-rempli + devis gratuit). Textes : project.story
// (lib/project-stories.js). Style : CaseStudyModal.css (préfixe .cs-).
'use client'
import { useEffect, useLayoutEffect, useRef, useState, useCallback } from 'react'
import { X, Check, ArrowUpRight, MessageCircle } from 'lucide-react'
import { HoverSlideText } from '@/components/ui/index'
import TransitionLink from '@/components/layout/TransitionLink'
import { useLanguage } from '@/lib/language'
import { trackAction } from '@/lib/track-action'
import { hasRealUrl, projectWhatsAppUrl } from '@/lib/project-stories'
import './CaseStudyModal.css'

// Mêmes valeurs que AI_STIFFNESS / AI_FRICTION dans AIAssistant.js
const STIFFNESS = 0.18
const FRICTION = 0.65
const STEP_MS = 1000 / 60
const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
const clamp01 = (n) => Math.max(0, Math.min(1, n))

/** Taille et position finales du panneau, selon l'écran. */
function getTarget() {
  const vw = window.innerWidth
  const vh = window.innerHeight
  const mobile = vw <= 900
  const w = Math.max(280, Math.min(1020, vw - (mobile ? 16 : 64)))
  const h = Math.max(320, Math.min(mobile ? vh * 0.92 : Math.min(vh * 0.88, 720), 780))
  return { x: (vw - w) / 2, y: (vh - h) / 2, w, h, r: mobile ? 18 : 16 }
}

/** Position et taille du bouton d'origine (point de départ et d'arrivée du morph). */
function getOrigin(el) {
  const vw = window.innerWidth
  const vh = window.innerHeight
  if (el && el.isConnected) {
    const r = el.getBoundingClientRect()
    if (r.width > 0 && r.height > 0) return { x: r.left, y: r.top, w: r.width, h: r.height, r: 10 }
  }
  // Bouton introuvable : le panneau naît du centre de l'écran
  return { x: vw / 2 - 60, y: vh / 2 - 20, w: 120, h: 40, r: 10 }
}

export default function CaseStudyModal({ project, originEl, onClosed }) {
  const { t } = useLanguage()
  const reduceMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const panelRef = useRef(null)
  const innerRef = useRef(null)
  const skinRef = useRef(null)
  const backdropRef = useRef(null)
  const closeRef = useRef(null)

  // Départ du morph (calculé une fois, au premier rendu côté client)
  const [origin] = useState(() => getOrigin(originEl))
  const [box, setBox] = useState(() => getTarget())

  // État du ressort : cur = valeur courante, vel = vitesse, tgt = cible
  const sp = useRef(null)
  if (!sp.current) {
    const z = { x: 0, y: 0, w: 0, h: 0, r: 0 }
    sp.current = {
      cur: { ...origin }, vel: { ...z }, tgt: getTarget(),
      closing: false, raf: 0, last: 0, acc: 0, done: false,
    }
  }

  // Écrit l'état courant dans le DOM (sans passer par React)
  const paint = useCallback(() => {
    const s = sp.current
    const panel = panelRef.current
    if (!panel) return
    const o = origin
    const tg = getTarget()
    const dw = tg.w - o.w || 1
    const dh = tg.h - o.h || 1
    const p = clamp01(((s.cur.w - o.w) / dw + (s.cur.h - o.h) / dh) / 2)
    panel.style.transform = `translate3d(${s.cur.x}px, ${s.cur.y}px, 0)`
    panel.style.width = `${Math.max(0, s.cur.w)}px`
    panel.style.height = `${Math.max(0, s.cur.h)}px`
    panel.style.borderRadius = `${Math.max(0, s.cur.r)}px`
    if (skinRef.current) skinRef.current.style.opacity = String(clamp01(1 - p * 2.4))       // lime du bouton → fond sombre
    if (innerRef.current) innerRef.current.style.opacity = String(clamp01((p - 0.5) / 0.4)) // contenu en fin de course
    if (backdropRef.current) backdropRef.current.style.opacity = String(clamp01(p * 1.15))
  }, [origin])

  const finishClose = useCallback(() => {
    const s = sp.current
    if (s.done) return
    s.done = true
    cancelAnimationFrame(s.raf)
    onClosed()
  }, [onClosed])

  const tick = useCallback((now) => {
    const s = sp.current
    if (!s.last) s.last = now
    s.acc += Math.min(now - s.last, 64)
    s.last = now
    while (s.acc >= STEP_MS) {
      s.acc -= STEP_MS
      for (const k of ['x', 'y', 'w', 'h', 'r']) {
        s.vel[k] += (s.tgt[k] - s.cur[k]) * STIFFNESS
        s.vel[k] *= FRICTION
        s.cur[k] += s.vel[k]
      }
    }
    paint()
    const settled = ['x', 'y', 'w', 'h', 'r'].every(
      (k) => Math.abs(s.tgt[k] - s.cur[k]) < 0.4 && Math.abs(s.vel[k]) < 0.05
    )
    if (settled) {
      Object.assign(s.cur, s.tgt)
      paint()
      s.raf = 0
      if (s.closing) finishClose()
      return
    }
    s.raf = requestAnimationFrame(tick)
  }, [paint, finishClose])

  const run = useCallback(() => {
    const s = sp.current
    if (reduceMotion) {
      Object.assign(s.cur, s.tgt)
      Object.keys(s.vel).forEach((k) => { s.vel[k] = 0 })
      paint()
      if (s.closing) finishClose()
      return
    }
    s.last = 0
    s.acc = 0
    cancelAnimationFrame(s.raf)
    s.raf = requestAnimationFrame(tick)
  }, [reduceMotion, paint, tick, finishClose])

  const requestClose = useCallback(() => {
    const s = sp.current
    if (s.closing) return
    s.closing = true
    s.tgt = getOrigin(originEl)          // le bouton a pu bouger : on le re-mesure
    run()
    // Filet de sécurité : si l'animation est interrompue, on démonte quand même
    setTimeout(finishClose, 1400)
  }, [originEl, run, finishClose])

  // Premier affichage : le panneau est posé sur le bouton, puis grandit.
  useLayoutEffect(() => {
    paint()
    run()
    return () => cancelAnimationFrame(sp.current.raf)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Si l'écran change de taille (rotation du téléphone…), la cible suit.
  useEffect(() => {
    const onResize = () => {
      const s = sp.current
      if (s.closing) return
      s.tgt = getTarget()
      setBox(getTarget())
      run()
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [run])

  // Scroll de la page bloqué, focus piégé, Échap, retour du focus.
  useEffect(() => {
    const previouslyFocused = document.activeElement
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus({ preventScroll: true })

    const onKey = (e) => {
      if (e.key === 'Escape') { requestClose(); return }
      if (e.key === 'Tab' && panelRef.current) {
        const items = [...panelRef.current.querySelectorAll(FOCUSABLE)]
        if (!items.length) return
        const first = items[0]
        const last = items[items.length - 1]
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = previousOverflow
      previouslyFocused?.focus?.({ preventScroll: true })
    }
  }, [requestClose])

  const story = project.story
  const online = hasRealUrl(project)
  const inProgress = project.progress != null && project.progress < 100
  // Même logique que la carte : « En ligne » dès que le site est réellement en ligne.
  const statusLabel = online
    ? t('online')
    : (inProgress ? `${t('project_progress')} · ${project.progress}%` : t('delivered'))

  return (
    <div className="cs-root">
      <div ref={backdropRef} className="cs-backdrop" onClick={requestClose} />

      <div
        ref={panelRef}
        className="cs-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cs-title"
      >
        {/* Peau lime = le bouton d'origine, qui s'efface pendant la croissance */}
        <div ref={skinRef} className="cs-skin" aria-hidden="true" />

        <div ref={innerRef} className="cs-inner" style={{ width: box.w, height: box.h }}>
          <button ref={closeRef} type="button" className="cs-close" onClick={requestClose} aria-label={t('close')}>
            <X size={16} />
          </button>

          <div className="cs-image">
            <img src={project.img} alt={`Aperçu du site ${project.title}`} />
            <div className="cs-image-fade" />
          </div>

          <div className="cs-info">
            <div className="cs-scroll" data-lenis-prevent>
              <div className="cs-head">
                <span className="cs-eyebrow">{project.type}</span>
                <span className="cs-status">
                  <i className={`cs-dot${online ? ' is-live' : ''}`} />
                  {statusLabel} · {project.year}
                </span>
              </div>
              <h2 id="cs-title" className="cs-name">{project.title}</h2>
              <p className="cs-pitch">{story?.pitch || project.desc}</p>

              {story && (
                <>
                  <section className="cs-block cs-block--problem">
                    <h3 className="cs-label">{t('caseProblem')}</h3>
                    <p className="cs-text">{story.problem}</p>
                  </section>

                  <section className="cs-block cs-block--solution">
                    <h3 className="cs-label">{t('caseSolution')}</h3>
                    <p className="cs-text">{story.solution}</p>
                  </section>

                  {story.features?.length > 0 && (
                    <section className="cs-block">
                      <h3 className="cs-label">{t('caseFeatures')}</h3>
                      <ul className="cs-features">
                        {story.features.map((f) => (
                          <li key={f}><Check size={15} aria-hidden="true" /><span>{f}</span></li>
                        ))}
                      </ul>
                    </section>
                  )}

                  {story.outcome && (
                    <section className="cs-block">
                      <h3 className="cs-label">{t('caseResult')}</h3>
                      <p className="cs-text">{story.outcome}</p>
                    </section>
                  )}
                </>
              )}
            </div>

            {/* Appel à l'action — hors de la zone qui défile : toujours visible */}
            <div className="cs-footer">
              <p className="cs-footer-title">
                {story?.audience ? `${t('caseCtaTitle')} Idéal pour ${story.audience}.` : t('caseCtaTitle')}
              </p>
              <div className="cs-actions">
                <a
                  href={projectWhatsAppUrl(project)}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-raised btn-sm"
                  onClick={() => trackAction('whatsapp_click')}
                >
                  <MessageCircle size={15} /> <HoverSlideText text={t('caseCtaWhatsApp')} />
                </a>
                <TransitionLink href="/devis" className="btn-ghost btn-sm" onClick={() => trackAction('cta_click')}>
                  <HoverSlideText text={t('caseCtaQuote')} />
                </TransitionLink>
              </div>
              <div className="cs-footer-row">
                <span className="cs-note">{t('uiFreeQuote24')}</span>
                {online && (
                  <a href={project.url} target="_blank" rel="noreferrer" className="cs-site-link">
                    {t('caseSeeSite')} <ArrowUpRight size={13} />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
