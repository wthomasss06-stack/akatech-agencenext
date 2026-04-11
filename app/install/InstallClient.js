'use client'
import { useEffect, useState, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Monitor, Smartphone, Apple, Download, CheckCircle, ArrowRight, Wifi, Zap, RefreshCw, Bell, Chrome, MoreVertical, Share, Plus, ChevronDown } from 'lucide-react'
import { useTheme } from '@/lib/theme'
import { SectionEye, GreenUnderline, SectionCTA } from '@/components/ui/index'
import AuroraHero from '@/components/ui/AuroraHero'

const PLATFORMS = [
  { key: 'desktop', label: 'PC / Mac', icon: Monitor, hint: 'Windows · macOS · Linux' },
  { key: 'android', label: 'Android',  icon: Smartphone, hint: 'Chrome · Samsung Internet' },
  { key: 'ios',     label: 'iOS',      icon: Apple,      hint: 'iPhone · iPad · Safari' },
]

const STEPS = {
  desktop: [
    { icon: Chrome,       title: 'Ouvrez Chrome ou Edge',        desc: 'Allez sur akatech.ci depuis votre navigateur Chrome, Edge ou Brave sur votre PC ou Mac.' },
    { icon: Download,     title: 'Cliquez sur l\'icône d\'install', desc: 'Dans la barre d\'adresse, une icône ⊕ ou un bouton "Installer AKATech" apparaît automatiquement.' },
    { icon: CheckCircle,  title: 'Confirmez l\'installation',     desc: 'Une fenêtre s\'ouvre — cliquez "Installer". L\'app s\'ajoute à votre bureau et votre barre des tâches.' },
    { icon: Zap,          title: 'Lancez comme une vraie app',   desc: 'Ouvrez AKATech depuis votre bureau. Elle tourne en plein écran, hors navigateur, comme une app native.' },
  ],
  android: [
    { icon: Chrome,       title: 'Ouvrez Chrome sur Android',    desc: 'Naviguez vers akatech.ci depuis Chrome sur votre smartphone ou tablette Android.' },
    { icon: MoreVertical, title: 'Menu ⋮ → Ajouter à l\'écran d\'accueil', desc: 'Appuyez sur les trois points en haut à droite, puis sélectionnez "Ajouter à l\'écran d\'accueil".' },
    { icon: CheckCircle,  title: 'Confirmez et nommez l\'app',   desc: 'Renommez l\'app si vous le souhaitez, puis appuyez sur "Ajouter". L\'icône AKATech apparaît sur votre écran.' },
    { icon: Zap,          title: 'Lancez depuis l\'écran d\'accueil', desc: 'Tapez l\'icône AKATech. L\'app s\'ouvre en plein écran, sans barre de navigateur, ultra-rapide.' },
  ],
  ios: [
    { icon: Share,        title: 'Ouvrez Safari sur iPhone / iPad', desc: 'Rendez-vous sur akatech.ci depuis Safari — c\'est le seul navigateur qui supporte l\'installation sur iOS.' },
    { icon: Share,        title: 'Appuyez sur le bouton Partager ↑', desc: 'Trouvez l\'icône de partage en bas de l\'écran (carré avec une flèche vers le haut).' },
    { icon: Plus,         title: 'Choisissez "Sur l\'écran d\'accueil"', desc: 'Faites défiler les options et appuyez sur "Ajouter à l\'écran d\'accueil". Confirmez le nom.' },
    { icon: Zap,          title: 'Ouvrez AKATech comme une app', desc: 'L\'icône AKATech est maintenant sur votre écran d\'accueil. L\'app s\'ouvre en plein écran, comme une app native.' },
  ],
}

const BENEFITS = [
  { icon: Zap,       title: 'Ultra rapide',       desc: 'Chargement instantané même avec une connexion faible. Optimisé pour le réseau africain.' },
  { icon: Wifi,      title: 'Hors ligne',         desc: 'Consultez les pages visitées sans connexion internet — parfait en zone de faible débit.' },
  { icon: Bell,      title: 'Notifications',      desc: 'Recevez des alertes sur vos projets, devis et mises à jour directement sur votre appareil.' },
  { icon: RefreshCw, title: 'Toujours à jour',    desc: 'L\'app se met à jour automatiquement. Pas de téléchargement, pas de Play Store.' },
]

function StepCard({ step, i, active }) {
  const T = useTheme()
  const Icon = step.icon
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: i * .1 }}
      style={{
        display: 'flex', gap: '1.2rem', padding: '1.4rem',
        borderRadius: 14, border: `1px solid ${active ? 'rgba(34,200,100,.4)' : T.border}`,
        background: active ? 'rgba(34,200,100,.05)' : 'transparent',
        transition: 'all .3s',
      }}
    >
      <div style={{ flexShrink: 0, width: 44, height: 44, borderRadius: 12, background: active ? 'rgba(34,200,100,.2)' : 'rgba(34,200,100,.08)', border: `1px solid ${active ? 'rgba(34,200,100,.4)' : T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon size={20} style={{ color: '#22c864' }} />
      </div>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem', marginBottom: '.3rem' }}>
          <span style={{ fontFamily: "'Syne',sans-serif", fontSize: '.55rem', fontWeight: 800, color: '#22c864', opacity: .5, letterSpacing: '.1em' }}>0{i + 1}</span>
          <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: '.9rem', fontWeight: 700, color: T.textMain }}>{step.title}</h3>
        </div>
        <p style={{ fontSize: '.8rem', color: T.textSub, lineHeight: 1.65 }}>{step.desc}</p>
      </div>
    </motion.div>
  )
}

function PhoneMockup({ platform }) {
  const T = useTheme()
  const screens = {
    desktop: (
      <div style={{ padding: '1rem', height: '100%', display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
        <div style={{ height: 6, width: '60%', borderRadius: 3, background: 'rgba(34,200,100,.4)' }} />
        <div style={{ height: 4, width: '40%', borderRadius: 3, background: 'rgba(255,255,255,.15)' }} />
        <div style={{ flex: 1, borderRadius: 8, background: 'rgba(34,200,100,.06)', border: '1px solid rgba(34,200,100,.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Monitor size={28} style={{ color: 'rgba(34,200,100,.4)' }} />
        </div>
        <div style={{ display: 'flex', gap: '.3rem' }}>
          {[40, 60, 30].map((w, i) => <div key={i} style={{ height: 4, width: `${w}%`, borderRadius: 3, background: 'rgba(255,255,255,.08)' }} />)}
        </div>
      </div>
    ),
    android: (
      <div style={{ padding: '.8rem', height: '100%', display: 'flex', flexDirection: 'column', gap: '.4rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ height: 5, width: '35%', borderRadius: 3, background: 'rgba(255,255,255,.2)' }} />
          <MoreVertical size={12} style={{ color: 'rgba(34,200,100,.6)' }} />
        </div>
        <div style={{ flex: 1, borderRadius: 8, background: 'rgba(34,200,100,.08)', border: '1px solid rgba(34,200,100,.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Smartphone size={24} style={{ color: 'rgba(34,200,100,.4)' }} />
        </div>
        <div style={{ padding: '.5rem', borderRadius: 8, background: 'rgba(34,200,100,.12)', border: '1px solid rgba(34,200,100,.3)', display: 'flex', alignItems: 'center', gap: '.4rem' }}>
          <Plus size={10} style={{ color: '#22c864' }} />
          <span style={{ fontFamily: "'Syne',sans-serif", fontSize: '.5rem', color: '#22c864', fontWeight: 700 }}>Ajouter à l'écran d'accueil</span>
        </div>
      </div>
    ),
    ios: (
      <div style={{ padding: '.8rem', height: '100%', display: 'flex', flexDirection: 'column', gap: '.4rem' }}>
        <div style={{ flex: 1, borderRadius: 8, background: 'rgba(34,200,100,.06)', border: '1px solid rgba(34,200,100,.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Apple size={24} style={{ color: 'rgba(34,200,100,.4)' }} />
        </div>
        <div style={{ padding: '.5rem', borderRadius: 8, background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
          {[Share, Plus, Bell].map((Icon, i) => <Icon key={i} size={14} style={{ color: i === 0 ? '#22c864' : 'rgba(255,255,255,.3)' }} />)}
        </div>
        <div style={{ padding: '.45rem', borderRadius: 8, background: 'rgba(34,200,100,.12)', border: '1px solid rgba(34,200,100,.3)', display: 'flex', alignItems: 'center', gap: '.4rem' }}>
          <Plus size={10} style={{ color: '#22c864' }} />
          <span style={{ fontFamily: "'Syne',sans-serif", fontSize: '.5rem', color: '#22c864', fontWeight: 700 }}>Sur l'écran d'accueil</span>
        </div>
      </div>
    ),
  }

  const isDesktop = platform === 'desktop'
  return (
    <motion.div key={platform} initial={{ opacity: 0, scale: .92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: .4 }}
      style={{
        width: isDesktop ? 200 : 120,
        height: isDesktop ? 140 : 220,
        borderRadius: isDesktop ? 16 : 24,
        background: 'rgba(11,26,16,.9)',
        border: '1px solid rgba(34,200,100,.25)',
        boxShadow: '0 0 60px rgba(34,200,100,.12), 12px 16px 40px rgba(0,0,0,.5)',
        overflow: 'hidden',
        position: 'relative',
      }}>
      {!isDesktop && <div style={{ height: 8, display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: 4 }}><div style={{ width: 32, height: 3, borderRadius: 2, background: 'rgba(255,255,255,.15)' }} /></div>}
      {screens[platform]}
      {!isDesktop && <div style={{ height: 8, display: 'flex', justifyContent: 'center', alignItems: 'flex-end', paddingBottom: 4 }}><div style={{ width: 40, height: 3, borderRadius: 2, background: 'rgba(255,255,255,.1)' }} /></div>}
    </motion.div>
  )
}

export default function InstallClient() {
  const T = useTheme()
  const [platform, setPlatform] = useState('android')
  const [activeStep, setActiveStep] = useState(0)
  const benefitsRef = useRef(null)
  const stepsRef = useRef(null)
  const benefitsInView = useInView(benefitsRef, { once: true })
  const stepsInView = useInView(stepsRef, { once: true })

  useEffect(() => {
    const ua = navigator.userAgent
    if (/iPhone|iPad|iPod/.test(ua)) setPlatform('ios')
    else if (/Android/.test(ua)) setPlatform('android')
    else setPlatform('desktop')
  }, [])

  useEffect(() => {
    setActiveStep(0)
    const t = setInterval(() => setActiveStep(s => (s + 1) % 4), 2800)
    return () => clearInterval(t)
  }, [platform])

  const steps = STEPS[platform]
  const activePlatform = PLATFORMS.find(p => p.key === platform)

  return (
    <div>
      {/* ── HERO ── */}
      <section style={{ padding: '9rem 5% 5rem', background: '#060e09', position: 'relative', overflow: 'hidden' }}>
        <AuroraHero labels={[]} />
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .6 }}>
            <SectionEye label="// Installer AKATech" center />
            <h1 style={{ fontSize: 'clamp(2.2rem,5vw,3.6rem)', fontWeight: 800, fontFamily: "'Syne',sans-serif", color: 'rgba(255,255,255,.88)', letterSpacing: '-.04em', lineHeight: 1.1, marginBottom: '1rem' }}>
              AKATech sur votre appareil,<br />
              <GreenUnderline><span className="text-gradient">en 3 étapes.</span></GreenUnderline>
            </h1>
            <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,.5)', lineHeight: 1.75, maxWidth: 520, margin: '0 auto 2rem' }}>
              Installez l'application progressive d'AKATech sur votre PC, Android ou iPhone — sans passer par un store, gratuitement.
            </p>

            {/* Platform selector */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '.6rem', flexWrap: 'wrap' }}>
              {PLATFORMS.map(({ key, label, icon: Icon, hint }) => (
                <button key={key} onClick={() => setPlatform(key)}
                  style={{ display: 'flex', alignItems: 'center', gap: '.55rem', padding: '.6rem 1.2rem', borderRadius: 100, border: `1px solid ${platform === key ? '#22c864' : 'rgba(34,200,100,.2)'}`, background: platform === key ? 'rgba(34,200,100,.15)' : 'rgba(34,200,100,.04)', color: platform === key ? '#22c864' : 'rgba(255,255,255,.45)', fontFamily: "'Syne',sans-serif", fontSize: '.72rem', fontWeight: 700, cursor: 'pointer', transition: 'all .25s', letterSpacing: '.04em' }}>
                  <Icon size={14} />
                  {label}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── BENEFITS ── */}
      <section ref={benefitsRef} style={{ padding: '5rem 5%', background: T.bgAlt }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={benefitsInView ? { opacity: 1, y: 0 } : {}} style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <SectionEye label="// Pourquoi installer l'app ?" center />
            <h2 style={{ fontSize: 'clamp(1.7rem,3vw,2.4rem)', fontWeight: 800, fontFamily: "'Syne',sans-serif", color: T.textMain, letterSpacing: '-.03em' }}>
              Plus rapide qu'un site,{' '}<GreenUnderline><span className="text-gradient">plus léger qu'une app.</span></GreenUnderline>
            </h2>
          </motion.div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '1rem' }}>
            {BENEFITS.map(({ icon: Icon, title, desc }, i) => (
              <motion.div key={title} className="sku-card"
                initial={{ opacity: 0, y: 20 }} animate={benefitsInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: i * .09 }}
                style={{ padding: '1.8rem' }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(34,200,100,.1)', border: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                  <Icon size={22} style={{ color: '#22c864' }} />
                </div>
                <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: '.95rem', fontWeight: 700, color: T.textMain, marginBottom: '.4rem' }}>{title}</h3>
                <p style={{ fontSize: '.8rem', color: T.textSub, lineHeight: 1.65 }}>{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STEPS ── */}
      <section ref={stepsRef} style={{ padding: '6rem 5%', background: T.bg }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={stepsInView ? { opacity: 1, y: 0 } : {}} style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <SectionEye label={`// Installation ${activePlatform?.label}`} center />
            <h2 style={{ fontSize: 'clamp(1.7rem,3vw,2.4rem)', fontWeight: 800, fontFamily: "'Syne',sans-serif", color: T.textMain, letterSpacing: '-.03em' }}>
              Installer sur{' '}<GreenUnderline><span className="text-gradient">{activePlatform?.label}</span></GreenUnderline>
            </h2>
          </motion.div>

          {/* Platform tabs */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '.5rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
            {PLATFORMS.map(({ key, label, icon: Icon }) => (
              <button key={key} onClick={() => setPlatform(key)}
                style={{ display: 'flex', alignItems: 'center', gap: '.45rem', padding: '.55rem 1.1rem', borderRadius: 10, border: `1px solid ${platform === key ? '#22c864' : T.border}`, background: platform === key ? 'rgba(34,200,100,.12)' : T.bgAlt, color: platform === key ? '#22c864' : T.textMuted, fontFamily: "'Syne',sans-serif", fontSize: '.7rem', fontWeight: 700, cursor: 'pointer', transition: 'all .22s' }}>
                <Icon size={13} />{label}
              </button>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '3rem', alignItems: 'center' }}>
            {/* Steps list */}
            <AnimatePresence mode="wait">
              <motion.div key={platform} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: .35 }}
                style={{ display: 'flex', flexDirection: 'column', gap: '.8rem' }}>
                {steps.map((step, i) => (
                  <div key={i} onClick={() => setActiveStep(i)} style={{ cursor: 'pointer' }}>
                    <StepCard step={step} i={i} active={activeStep === i} />
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>

            {/* Mockup */}
            <div className="hide-mobile" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
              <AnimatePresence mode="wait">
                <PhoneMockup key={platform} platform={platform} />
              </AnimatePresence>
              <div style={{ display: 'flex', gap: '.4rem' }}>
                {steps.map((_, i) => (
                  <div key={i} onClick={() => setActiveStep(i)} style={{ width: i === activeStep ? 20 : 6, height: 6, borderRadius: 3, background: i === activeStep ? '#22c864' : 'rgba(34,200,100,.2)', cursor: 'pointer', transition: 'all .3s' }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <SectionCTA message="Une question sur l'installation ? On vous répond en moins de 2h sur WhatsApp." cta="Contacter le support →" />
    </div>
  )
}
