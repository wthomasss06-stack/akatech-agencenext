'use client'
import { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Code, Check, Globe, ArrowUpRight } from 'lucide-react'
import { useTheme } from '@/lib/theme'
import { SectionEye, LazyImg, GreenUnderline } from '@/components/ui/index'
import AuroraHero from '@/components/ui/AuroraHero'
import { PROJECTS } from '@/lib/data'


/* ────────────────────────────────────────────────
   HERO
──────────────────────────────────────────────── */
function HeroRealisations() {
  const T = useTheme()
  const layerBgRef   = useRef(null)
  const layerMidRef  = useRef(null)
  const layerForeRef = useRef(null)

  useEffect(() => {
    const onMouse = (e) => {
      const x = (e.clientX - window.innerWidth  / 2) / (window.innerWidth  / 2)
      const y = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2)
      const rX = y * -5, rY = x * 5
      const apply = (el, sp) => { if (el) el.style.transform = `translate3d(${x*50*sp}px,${y*50*sp}px,0) rotateX(${rX}deg) rotateY(${rY}deg)` }
      apply(layerBgRef.current, 0.2); apply(layerMidRef.current, 0.5); apply(layerForeRef.current, 0.8)
    }
    window.addEventListener('mousemove', onMouse)
    return () => window.removeEventListener('mousemove', onMouse)
  }, [])

  useEffect(() => {
    const onScroll = () => {
      const s = window.pageYOffset
      if (layerBgRef.current) { layerBgRef.current.style.transform = `scale(${1 + s * 0.0005}) translateY(${s * 0.2}px)`; layerBgRef.current.style.filter = `blur(${Math.min(s / 60, 12)}px)` }
      if (layerMidRef.current) { layerMidRef.current.style.opacity = Math.max(0, 1 - s / 700); layerMidRef.current.style.transform = `translateY(${s * 0.4}px)`; layerMidRef.current.style.filter = `blur(${s / 100}px)` }
      if (layerForeRef.current) { layerForeRef.current.style.transform = `translateY(${-s * 0.96}px)`; layerForeRef.current.style.opacity = Math.max(0, 1 - s / 400) }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section style={{ height: '100vh', minHeight: 640, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#060e09' }}>
      <div ref={layerBgRef} style={{ position: 'absolute', inset: '-8%', zIndex: 1, willChange: 'transform, filter', transition: 'transform .1s ease-out' }}>
        <AuroraHero labels={[]} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 20%, rgba(6,14,9,.95) 100%)' }} />
      </div>
      <div ref={layerMidRef} style={{ position: 'relative', zIndex: 10, maxWidth: 900, padding: '0 5%', textAlign: 'center', willChange: 'transform, opacity, filter', transition: 'transform .1s ease-out' }}>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .6 }}>
          <SectionEye label="// Nos Réalisations" center />
          <h1 style={{ fontSize: 'clamp(2.4rem,5vw,3.8rem)', fontWeight: 800, fontFamily: "'Syne',sans-serif", color: 'rgba(255,255,255,.88)', letterSpacing: '-.04em', lineHeight: 1.1, marginBottom: '1.2rem' }}>
            +18 réalisations livrées,<br /><GreenUnderline><span className="text-gradient">100% satisfaits.</span></GreenUnderline>
          </h1>
          <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,.55)', lineHeight: 1.75, maxWidth: 560, margin: '0 auto 2.5rem' }}>
            Sites vitrines, e-commerces, SaaS, portfolios… Chaque réalisation est une histoire de transformation digitale réussie.
          </p>
        </motion.div>
      </div>
      <div ref={layerForeRef} style={{ position: 'absolute', inset: 0, zIndex: 20, pointerEvents: 'none', willChange: 'transform, opacity', transition: 'transform .1s ease-out' }}>
        {[{left:'8%',top:'25%',s:4,op:.18,dur:3.8,dy:0},{left:'22%',top:'68%',s:3,op:.11,dur:5.1,dy:1.2},{left:'60%',top:'22%',s:4,op:.20,dur:4.4,dy:0.6},{left:'75%',top:'70%',s:3,op:.09,dur:6.2,dy:1.8},{left:'88%',top:'15%',s:4,op:.15,dur:3.2,dy:0.3}].map((p,i) => (
          <motion.div key={i} style={{ position:'absolute', width:p.s, height:p.s, borderRadius:'50%', background:'#88ca53', left:p.left, top:p.top, opacity:p.op }}
            animate={{ y:[0,-18,0] }} transition={{ duration:p.dur, repeat:Infinity, ease:'easeInOut', delay:p.dy }} />
        ))}
      </div>
    </section>
  )
}

/* ────────────────────────────────────────────────
   HELPERS — mêmes utilitaires que App.jsx
──────────────────────────────────────────────── */
const PROJECT_TYPE_BADGE = (type, live) => live ? `${type} — En ligne` : `${type} — En cours`

function getDisplayUrl(url) {
  const m = /^https?:\/\/([^/]+)/.exec(url || '')
  return m ? m[1] : (url || 'Démo locale')
}

/* ────────────────────────────────────────────────
   SLIDE PROJET — plein écran, mockup desktop (browser
   chrome) + mockup mobile (phone shell) côte à côte,
   panneau d'infos à droite. Port exact de
   ProjectScrollSlide (App.jsx / elvis-portfolio).
──────────────────────────────────────────────── */
function ProjectScrollSlide({ project, index, total, T }) {
  const desktopImg = project.img
  const displayUrl = getDisplayUrl(project.url)

  // "preview" dans le nom → capture recadrée du contenu → on superpose notre browser chrome.
  // "responsive" ou nom brut → capture qui contient déjà son propre cadre/mockup → pas de
  // fausse barre navigateur (sinon double cadre, ex. TechFlow, ShopCI).
  const isPreviewAsset = /preview/i.test(project.img)

  // Image mobile :
  // 1. imgMobile explicite dans data.js (variante responsive dédiée)
  // 2. isPreviewAsset → même image preview (portrait ~9:16, ça couvre le phone shell)
  // 3. responsive dans img → même image (déjà au bon format)
  // 4. sinon → null = pas de phone shell affiché
  const isResponsiveAsset = /responsive/i.test(project.img)
  const mobileImg = project.imgMobile
    ? project.imgMobile
    : (isPreviewAsset || isResponsiveAsset ? project.img : null)

  return (
    <li className="fcx-slide">
      <div className="fc-grid">

        {/* ── Mockups ── */}
        <div className="fc-mockups">
          <div className="fc-desktop-wrap">
            <div className="fc-desktop-shell" style={{ background: T.light ? '#fff' : '#0c1710', borderColor: T.border }}>
              {isPreviewAsset && (
                <div className="fc-desktop-bar" style={{ background: T.light ? '#f3f6f2' : '#081209', borderColor: T.border }}>
                  <span className="fc-dot fc-dot--r" />
                  <span className="fc-dot fc-dot--y" />
                  <span className="fc-dot fc-dot--g" />
                  <span className="fc-bar-url" style={{ background: T.border, color: T.textMuted }}>{displayUrl}</span>
                </div>
              )}
              <div className="fc-desktop-screen" style={{ background: T.light ? '#f3f6f2' : '#081209' }}>
                <LazyImg
                  src={desktopImg}
                  alt={`${project.title} — aperçu desktop`}
                  className="fc-screen-img"
                  placeholder={
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Code size={40} style={{ color: 'rgba(136,202,83,.2)' }} />
                    </div>
                  }
                />
              </div>
            </div>
          </div>

          {mobileImg && (
          <div className="fc-mobile-wrap">
            <div className="fc-mobile-shell" style={{ background: T.light ? '#fff' : '#0c1710', borderColor: T.border }}>
              <div className="fc-mobile-notch" style={{ background: T.light ? '#f3f6f2' : '#081209' }} />
              <div className="fc-mobile-screen" style={{ background: T.light ? '#f3f6f2' : '#081209' }}>
                <LazyImg src={mobileImg} alt={`${project.title} — aperçu mobile`} className="fc-screen-img" />
              </div>
              <div className="fc-mobile-home" style={{ '--gb': T.border }} />
            </div>
            <div className="fc-resp-badge">
              <Check size={12} /> 100% Responsive
            </div>
          </div>
          )}
          <div className="fc-glow" />
        </div>

        {/* ── Info panel ── */}
        <div className="fc-info">
          <div>
            <h3 className="fc-name" style={{ color: T.textMain }}>{project.title}</h3>
            <h3 className="fc-sub">{project.subtitle}</h3>
          </div>

          <div className="fc-meta" style={{ borderColor: 'rgba(136,202,83,.25)' }}>
            <div className="fc-meta-row"><span className="fc-ml" style={{ color: T.textMuted }}>Type</span><span className="fc-mv" style={{ color: T.textMain }}>{PROJECT_TYPE_BADGE(project.type, project.live)}</span></div>
            <div className="fc-meta-row"><span className="fc-ml" style={{ color: T.textMuted }}>Marché</span><span className="fc-mv" style={{ color: T.textMain }}>Côte d'Ivoire</span></div>
            <div className="fc-meta-row"><span className="fc-ml" style={{ color: T.textMuted }}>Mon rôle</span><span className="fc-mv" style={{ color: T.textMain }}>Conception & Développement</span></div>
            <div className="fc-meta-row"><span className="fc-ml" style={{ color: T.textMuted }}>Année</span><span className="fc-mv" style={{ color: T.textMain }}>{project.year}</span></div>
          </div>

          <div className="fc-tags">
            {(project.tech || []).map(t => <span key={t} className="fc-tag">{t}</span>)}
          </div>

          <h3 className="fc-desc" style={{ color: T.textSub }}>{project.desc}</h3>

          {project.url ? (
            <a href={project.url} target="_blank" rel="noreferrer" className="fc-cta">
              <Globe size={15} /> Voir le projet
              <ArrowUpRight size={14} />
            </a>
          ) : (
            <span className="fc-cta" style={{ opacity: .6, cursor: 'default', pointerEvents: 'none' }}>
              <Code size={15} /> Démo locale
            </span>
          )}
        </div>
      </div>

      <div className="fcx-counter">
        <strong>{String(index + 1).padStart(2, '0')}</strong> / {String(total).padStart(2, '0')}
      </div>
    </li>
  )
}

/* ────────────────────────────────────────────────
   SECTION PRINCIPALE — Scroll horizontal plein écran
   Port exact de ProjectsHorizontalScroll (App.jsx) :
   • section height = total × 100vh
   • sticky 100vh contenant le track
   • track translaté en vw selon la progression de scroll
   Desktop uniquement (mobile garde son propre composant).
──────────────────────────────────────────────── */
function StackedRealisations() {
  const T = useTheme()
  const sectionRef = useRef(null)
  const trackRef    = useRef(null)
  const fillRef     = useRef(null)
  const total = PROJECTS.length

  useEffect(() => {
    const section = sectionRef.current
    const track   = trackRef.current
    const fill    = fillRef.current
    if (!section || !track) return

    const update = () => {
      const rect     = section.getBoundingClientRect()
      const sectionH = section.offsetHeight
      const viewH    = window.innerHeight
      let progress = -rect.top / (sectionH - viewH)
      progress = Math.max(0, Math.min(1, progress))

      const maxVW = (total - 1) * 100
      track.style.transform = `translateX(-${progress * maxVW}vw)`
      if (fill) fill.style.width = `${progress * 100}%`
    }

    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    update()
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [total])

  return (
    <section ref={sectionRef} id="hscroll-section" className="fcx-section" style={{ height: `${total * 100}vh`, background: T.bg }}>
      <div className="fcx-sticky">

        {/* Heading flottant dans le sticky */}
        <div className="fcx-section-label">
          <p style={{ fontFamily: "'Syne',sans-serif", fontSize: '.6rem', fontWeight: 700, color: '#88ca53', letterSpacing: '.45em', textTransform: 'uppercase', marginBottom: '.6rem' }}>
            // Scroll pour parcourir
          </p>
          <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 'clamp(1.1rem,1.8vw,1.6rem)', color: T.textMain, letterSpacing: '-.02em', margin: 0 }}>
            {total} réalisations, une par une.
          </h2>
        </div>

        <ul ref={trackRef} className="fcx-track">
          {PROJECTS.map((project, i) => (
            <ProjectScrollSlide key={project.id} project={project} index={i} total={total} T={T} />
          ))}
        </ul>

        <div className="fcx-progress-track" style={{ background: 'rgba(136,202,83,.12)' }}>
          <div ref={fillRef} className="fcx-progress-fill" style={{ width: 0, background: '#88ca53' }} />
        </div>
      </div>

      {/* CSS — port direct des classes fcx et fc d'App.jsx, palette AKATech */}
      <style>{`
        .fcx-section { position: relative; }
        .fcx-sticky {
          position: sticky; top: 0; height: 100vh; width: 100%;
          overflow: hidden; display: flex; align-items: stretch;
        }
        .fcx-section-label {
          position: absolute; top: 28px; left: 8vw; z-index: 10;
          pointer-events: none; text-align: left;
        }
        .fcx-track {
          display: flex; height: 100vh; flex-shrink: 0;
          will-change: transform; list-style: none; margin: 0; padding: 0;
          transition: transform 60ms linear;
        }
        .fcx-slide {
          position: relative; width: 100vw; height: 100vh; flex-shrink: 0;
          display: flex; align-items: center; padding: 0 8vw; overflow: hidden;
        }
        .fcx-slide .fc-grid { width: 100%; }
        .fcx-counter {
          position: absolute; top: 28px; right: 8vw; z-index: 5;
          font-family: 'JetBrains Mono', monospace; font-size: .68rem;
          letter-spacing: .1em; color: ${T.textMuted}; pointer-events: none;
        }
        .fcx-counter strong { color: #88ca53; }
        .fcx-progress-track {
          position: absolute; bottom: 28px; left: 8vw; right: 8vw; height: 2px;
          z-index: 5; border-radius: 2px; overflow: hidden;
        }
        .fcx-progress-fill { height: 100%; will-change: width; }

        .fc-grid { display: grid; grid-template-columns: 1.15fr 1fr; gap: 6vw; align-items: center; }
        .fc-mockups { position: relative; }
        .fc-desktop-wrap { position: relative; z-index: 2; }
        .fc-desktop-shell { border-radius: 10px 10px 6px 6px; border: 2px solid; overflow: hidden; box-shadow: 0 32px 80px rgba(0,0,0,.35); }
        .fc-desktop-bar { display: flex; align-items: center; gap: 6px; padding: 8px 14px; border-bottom: 1px solid; }
        .fc-dot { width: 10px; height: 10px; border-radius: 50%; }
        .fc-dot--r { background: #FF5F57; }
        .fc-dot--y { background: #FFBD2E; }
        .fc-dot--g { background: #28C840; }
        .fc-bar-url { margin-left: 10px; font-family: 'JetBrains Mono', monospace; font-size: .6rem; border-radius: 4px; padding: 2px 10px; }
        .fc-desktop-screen { width: 100%; aspect-ratio: 16/9; overflow: hidden; position: relative; }
        .fc-screen-img { width: 100%; height: 100%; object-fit: cover; object-position: top; display: block; }
        .fc-mobile-wrap { position: absolute; bottom: -20px; right: -28px; z-index: 4; width: 28%; }
        .fc-mobile-shell { border-radius: 28px; border: 2px solid; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,.5); }
        .fc-mobile-notch { width: 40%; height: 6px; border-radius: 0 0 6px 6px; margin: 0 auto; }
        .fc-mobile-screen { aspect-ratio: 9/18; overflow: hidden; position: relative; }
        .fc-mobile-home { height: 20px; display: flex; align-items: center; justify-content: center; }
        .fc-mobile-home::after { content: ''; width: 32px; height: 4px; background: rgba(136,202,83,.4); border-radius: 3px; }
        .fc-resp-badge {
          display: inline-flex; align-items: center; gap: 6px; margin-top: 12px;
          font-family: 'JetBrains Mono', monospace; font-size: .6rem; letter-spacing: .1em; text-transform: uppercase;
          color: #88ca53; border: 1px solid rgba(136,202,83,.35); border-radius: 20px;
          padding: 5px 12px; background: rgba(136,202,83,.08);
        }
        .fc-glow {
          position: absolute; bottom: -40px; left: 10%; width: 60%; height: 120px;
          background: radial-gradient(ellipse, rgba(136,202,83,.22) 0%, transparent 70%);
          pointer-events: none; z-index: 1;
        }
        .fc-info { display: flex; flex-direction: column; gap: 2.2rem; min-height: 420px; }
        .fc-name { font-family: 'Syne',sans-serif; font-size: clamp(2rem,3.5vw,3.2rem); font-weight: 800; letter-spacing: -.02em; line-height: 1; }
        .fc-sub { font-family: 'JetBrains Mono', monospace; font-size: .75rem; letter-spacing: .15em; text-transform: uppercase; color: #88ca53; margin-top: .4rem; }
        .fc-meta { display: flex; flex-direction: column; gap: .55rem; border-left: 2px solid; padding-left: 1.2rem; }
        .fc-meta-row { display: flex; gap: 1rem; font-size: .78rem; }
        .fc-ml { font-family: 'JetBrains Mono', monospace; font-size: .6rem; letter-spacing: .1em; text-transform: uppercase; min-width: 80px; }
        .fc-mv { font-weight: 500; }
        .fc-tags { display: flex; flex-wrap: wrap; gap: .5rem; }
        .fc-tag {
          font-family: 'JetBrains Mono', monospace; font-size: .6rem; letter-spacing: .08em; text-transform: uppercase;
          padding: 4px 12px; border-radius: 20px; border: 1.5px solid rgba(136,202,83,.3);
          color: #88ca53; background: rgba(136,202,83,.07); transition: background .2s, border-color .2s;
        }
        .fc-tag:hover { background: rgba(136,202,83,.16); border-color: rgba(136,202,83,.6); }
        .fc-desc { font-size: .9rem; line-height: 1.7; max-width: 44ch; font-weight: 400; }
        .fc-cta {
          display: inline-flex; align-items: center; gap: 8px; padding: 14px 28px;
          background: #88ca53; color: #04140a;
          font-family: 'Syne',sans-serif; font-size: .82rem; font-weight: 700; letter-spacing: .05em; text-transform: uppercase;
          text-decoration: none; border: 2.5px solid #88ca53; border-radius: 6px;
          transition: background .2s, color .2s, transform .15s; align-self: flex-start;
        }
        .fc-cta:hover { background: transparent; color: #88ca53; transform: translate(-2px,-2px); box-shadow: 4px 4px 0 #88ca53; }

        @media (max-width: 1100px) {
          .fc-grid { grid-template-columns: 1fr; gap: 5rem; }
          .fc-mobile-wrap { right: -14px; }
          .fcx-slide { padding: 0 6vw; }
        }
        @media (max-width: 768px) {
          /* Cette section n'est rendue que côté desktop (voir export par défaut) */
          .fcx-slide { padding: 0 5vw; }
          .fcx-counter { top: 18px; right: 5vw; font-size: .6rem; }
          .fcx-progress-track { left: 5vw; right: 5vw; bottom: 18px; }
        }
      `}</style>
    </section>
  )
}

function StartRealisation() {
  const T = useTheme()
  return (
    <section style={{ padding: '7rem 5%', background: T.bgAlt }}>
      <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <SectionEye label="// Votre Projet" center />
          <h2 style={{ fontSize: 'clamp(1.9rem,3.5vw,2.6rem)', fontWeight: 800, fontFamily: "'Syne',sans-serif", color: T.textMain, letterSpacing: '-.03em', marginBottom: '1rem' }}>
            Votre réalisation peut être<br />
            <GreenUnderline><span className="text-gradient">la prochaine ici.</span></GreenUnderline>
          </h2>
          <p style={{ fontSize: '.9rem', color: T.textSub, lineHeight: 1.75, maxWidth: 520, margin: '0 auto 2.5rem' }}>
            Partagez votre idée. On l'écoute, on la chiffre gratuitement et on la réalise dans les délais. Aucun engagement pour commencer.
          </p>
          <a
            href="https://wa.me/2250142507750?text=Bonjour AKATech, j'ai un projet web à vous soumettre."
            target="_blank" rel="noreferrer"
            className="btn-raised"
            style={{ fontSize: '1rem', padding: '1rem 2.5rem' }}>
            Démarrer ma réalisation <ArrowRight size={16} />
          </a>
        </motion.div>
      </div>
    </section>
  )
}


/* ────────────────────────────────────────────────
   PAGE EXPORT
──────────────────────────────────────────────── */
export default function RealisationsPage() {
  return (
    <div>
      <HeroRealisations />
      <StackedRealisations />
      <StartRealisation />
    </div>
  )
}