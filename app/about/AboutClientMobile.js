'use client'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Users, Monitor, Code, Heart, Zap, Star, Target, MessageCircle, ExternalLink } from 'lucide-react'
import { useTheme } from '@/lib/theme'
import { GhostTitle, AnimatedCounter, LazyImg, MarqueeStrip, PageCTA, GreenUnderline } from '@/components/ui/index'
import AuroraHero from '@/components/ui/AuroraHero'
import { STATS } from '@/lib/data'

const SKILLS = ['React','Next.js','Django','Python','Node.js','PostgreSQL','MySQL','Tailwind CSS','Framer Motion','Vercel','AWS','Docker','REST API','GraphQL','Mobile Money API']

const VALUES = [
  { icon: Target, title: 'Résultats concrets', desc: "Chaque solution est conçue pour générer des résultats mesurables : plus de clients, plus de revenus, moins de tâches manuelles." },
  { icon: Heart, title: 'Adapté au marché africain', desc: "Je comprends les réalités locales — Mobile Money, coupures internet, faible débit. Vos solutions fonctionnent dans votre contexte." },
  { icon: Zap, title: 'Livraison rapide', desc: "Pas d'attente de 3 mois. Les projets sont livrés en 5 à 21 jours selon la complexité, avec des jalons clairs à chaque étape." },
  { icon: Star, title: 'Qualité premium', desc: "Code propre, design sur-mesure, animations soignées. Chaque détail compte pour que votre solution se démarque." },
]

const TIMELINE = [
  { year: '2022', title: 'Les débuts', desc: "Premier projet freelance livré : un site vitrine pour un commerçant abidjanais. Le début d'une aventure." },
  { year: '2023', title: 'Premières applications métier', desc: "Développement de LivreurTrack Pro et MonCashJour, des outils de gestion pensés pour les commerçants et livreurs locaux." },
  { year: '2024', title: 'AKATech Agence', desc: "Transformation en agence officielle. Lancement de services structurés et premiers clients récurrents." },
  { year: '2025', title: "Aujourd'hui", desc: "+18 projets livrés, 100% de clients satisfaits. L'agence continue de grandir et d'innover." },
]

const PAYS = [
  { code: 'CI', name: "Côte d'Ivoire", note: 'Siège — Abidjan', primary: true  },
  { code: 'SN', name: 'Sénégal',       note: 'Clients actifs'                   },
  { code: 'CM', name: 'Cameroun',      note: 'Clients actifs'                   },
  { code: 'BJ', name: 'Bénin',         note: 'Projets livrés'                   },
  { code: 'BF', name: 'Burkina Faso',  note: 'Projets livrés'                   },
  { code: 'FR', name: 'France',        note: 'Diaspora africaine'               },
]

function FlagBadge({ code, primary }) {
  const colors = {
    CI: ['#f77f00','#fff','#009a44'],
    SN: ['#00853f','#fdef42','#e31b23'],
    CM: ['#007a5e','#ce1126','#fcd116'],
    BJ: ['#008751','#fcd116','#e8112d'],
    BF: ['#ef2b2d','#009a44','#fcd116'],
    FR: ['#002395','#fff','#ed2939'],
  }
  const [c1,c2,c3] = colors[code] || ['#88ca53','#fff','#88ca53']
  return (
    <div style={{ width:32,height:32,borderRadius:8,overflow:'hidden',flexShrink:0,border:primary?'1.5px solid rgba(136,202,83,.5)':'1px solid rgba(255,255,255,.12)',display:'flex',flexDirection:'column',boxShadow:primary?'0 0 10px rgba(136,202,83,.2)':'none' }}>
      <div style={{flex:1,background:c1}}/><div style={{flex:1,background:c2}}/><div style={{flex:1,background:c3}}/>
    </div>
  )
}

// ── 1. HERO ──────────────────────────────────────────────────
function HeroAbout() {
  const T = useTheme()
  return (
    <section style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', background: T.bg }}>
      <div style={{ position: 'absolute', inset: '-8%', zIndex: 1 }}>
        <AuroraHero labels={[]} />
        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to bottom, transparent 20%, ${T.bg} 100%)`, opacity: T.light ? 1 : .95 }} />
      </div>
      <div style={{ position: 'relative', zIndex: 10, width: '100%', padding: '7rem 5% 4rem' }}>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7, ease: [.22,1,.36,1] }}>
          <h1 style={{ position: 'relative', fontSize: 'clamp(2rem,7vw,3rem)', fontWeight: 800, fontFamily: "'JetBrains Mono',monospace", color: T.textMain, letterSpacing: '-.04em', lineHeight: 1.1, marginBottom: '1.2rem' }}>
            <GhostTitle text="Votre croissance digitale, c'est notre mission." />
            Votre croissance digitale,<br />
            <GreenUnderline><span className="text-gradient">c'est notre mission.</span></GreenUnderline>
          </h1>
          <p style={{ fontSize: '.95rem', color: T.textSub, lineHeight: 1.75, marginBottom: '2rem', maxWidth: 480 }}>
            AKATech accompagne les entrepreneurs et PME en Côte d'Ivoire qui veulent une présence digitale sérieuse.
          </p>
        </motion.div>
        {/* Photo grid */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7, delay: .2 }}
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '180px 130px', gap: '.75rem' }}>
          <div style={{ gridRow: '1 / 3', borderRadius: 14, overflow: 'hidden', border: '1px solid rgba(136,202,83,.2)', boxShadow: '6px 6px 24px rgba(0,0,0,.3)' }}>
            <LazyImg src="/images/about-1.webp" alt="AKATech" style={{ width:'100%',height:'100%',objectFit:'cover' }}
              placeholder={<div style={{ height:'100%',background:'linear-gradient(135deg,#0a1a0e,#060e09)',display:'flex',alignItems:'center',justifyContent:'center' }}><Users size={28} style={{color:'rgba(136,202,83,.3)'}}/></div>} />
          </div>
          <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(136,202,83,.15)' }}>
            <LazyImg src="/images/about-2.webp" alt="Bureau" style={{ width:'100%',height:'100%',objectFit:'cover' }}
              placeholder={<div style={{ height:'100%',background:'linear-gradient(135deg,#0a1a0e,#060e09)',display:'flex',alignItems:'center',justifyContent:'center' }}><Monitor size={22} style={{color:'rgba(136,202,83,.3)'}}/></div>} />
          </div>
          <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(136,202,83,.15)' }}>
            <LazyImg src="/images/about-3.webp" alt="Dev" style={{ width:'100%',height:'100%',objectFit:'cover' }}
              placeholder={<div style={{ height:'100%',background:'linear-gradient(135deg,#0a1a0e,#060e09)',display:'flex',alignItems:'center',justifyContent:'center' }}><Code size={22} style={{color:'rgba(136,202,83,.3)'}}/></div>} />
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// ── 2. STATS ─────────────────────────────────────────────────
function StatsSection() {
  const T = useTheme()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  return (
    <section ref={ref} style={{ padding: '5rem 5%', background: T.bgAlt }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2 style={{ position: 'relative', fontSize: 'clamp(1.6rem,5vw,2.2rem)', fontWeight: 800, fontFamily: "'JetBrains Mono',monospace", color: T.textMain, letterSpacing: '-.03em' }}>
          <GhostTitle text="Des résultats concrets" />
          Des résultats <GreenUnderline><span className="text-gradient">concrets</span></GreenUnderline>
        </h2>
      </motion.div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.75rem' }}>
        {STATS.map(({ val, suffix, label }, i) => (
          <motion.div key={label} className="sku-card"
            initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: i * .1 }}
            style={{ padding: '1.5rem 1rem', textAlign: 'center' }}>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.9rem', fontWeight: 800, color: T.green, lineHeight: 1 }}>
              <AnimatedCounter target={val} suffix={suffix} />
            </div>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.55rem', color: T.textMuted, textTransform: 'uppercase', letterSpacing: '.08em', marginTop: '.4rem' }}>{label}</div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

// ── 3. FONDATEUR ─────────────────────────────────────────────
function FounderSection() {
  const T = useTheme()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <section ref={ref} style={{ padding: '5rem 5%', background: T.bg, position: 'relative' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}>
        <h2 style={{ position: 'relative', fontSize: 'clamp(1.6rem,5vw,2.2rem)', fontWeight: 800, fontFamily: "'JetBrains Mono',monospace", color: T.textMain, letterSpacing: '-.03em', marginBottom: '1.2rem' }}>
          <GhostTitle text="M'Bollo Aka Elvis" />
          M'Bollo Aka <GreenUnderline><span className="text-gradient">Elvis</span></GreenUnderline>
        </h2>
        <p style={{ fontSize: '.95rem', color: T.textMain, lineHeight: 1.85, marginBottom: '.8rem' }}>
          <strong>AKATech</strong> construit des solutions digitales pour les entrepreneurs et PME en Côte d'Ivoire qui veulent professionnaliser leur image, générer plus d'opportunités et automatiser leurs processus.
        </p>
        <p style={{ fontSize: '.95rem', color: T.textSub, lineHeight: 1.85, marginBottom: '.8rem' }}>
          Nous aidons les entreprises à transformer leur présence en ligne en véritable levier de croissance, avec des produits web clairs, performants et adaptés aux usages locaux.
        </p>
        <p style={{ fontSize: '.9rem', color: T.textSub, lineHeight: 1.85, marginBottom: '2rem' }}>
          Notre approche repose sur la <strong style={{ color: T.textMain }}>fiabilité</strong>, la <strong style={{ color: T.textMain }}>simplicité</strong> et l'<strong style={{ color: T.textMain }}>impact concret</strong>.
        </p>

        {/* Photo + identité + portfolio */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.1rem', borderRadius: 14, background: 'rgba(136,202,83,.06)', border: '1px solid rgba(136,202,83,.2)', marginBottom: '1.5rem' }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', overflow: 'hidden', flexShrink: 0, border: '2px solid rgba(136,202,83,.5)', boxShadow: '0 0 14px rgba(136,202,83,.2)' }}>
            <LazyImg
              src="/images/founder.webp"
              alt="M'Bollo Aka Elvis"
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 10%' }}
              placeholder={<div style={{ width: 56, height: 56, background: 'rgba(136,202,83,.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#88ca53', fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, fontSize: '1.1rem' }}>E</div>}
            />
          </div>
          <div>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 800, fontSize: '.9rem', color: T.textMain, marginBottom: '.15rem' }}>M'Bollo Aka Elvis</div>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.58rem', color: T.textMuted, textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: '.45rem' }}>Dev Full-Stack · Fondateur, AKATech</div>
            <a href="https://mbolloaka-dev.vercel.app/" target="_blank" rel="noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '.3rem', fontFamily: "'JetBrains Mono',monospace", fontSize: '.65rem', fontWeight: 700, color: '#88ca53', textDecoration: 'none', padding: '.22rem .65rem', borderRadius: 100, background: 'rgba(136,202,83,.1)', border: '1px solid rgba(136,202,83,.3)' }}>
              <ExternalLink size={10} /> Voir son portfolio
            </a>
          </div>
        </div>

        <a href="https://wa.me/2250142507750" target="_blank" rel="noreferrer" className="btn-raised" style={{ fontSize: '.9rem' }}>
          Me contacter <MessageCircle size={15} />
        </a>
      </motion.div>
    </section>
  )
}

// ── 4. HISTOIRE ──────────────────────────────────────────────
function TimelineSection() {
  const T = useTheme()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <section ref={ref} style={{ padding: '5rem 5%', background: T.bgAlt, position: 'relative' }}>
      <div className="grid-bg" style={{ position: 'absolute', inset: 0, opacity: .18 }} />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{ position: 'relative', fontSize: 'clamp(1.6rem,5vw,2.2rem)', fontWeight: 800, fontFamily: "'JetBrains Mono',monospace", color: T.textMain, letterSpacing: '-.03em' }}>
            <GhostTitle text="L'évolution d'AKATech" />
            L'évolution d'<GreenUnderline><span className="text-gradient">AKATech</span></GreenUnderline>
          </h2>
        </motion.div>
        <div style={{ position: 'relative', paddingLeft: '1.5rem' }}>
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 1, background: `linear-gradient(to bottom, transparent, ${T.green}, transparent)` }} />
          {TIMELINE.map(({ year, title, desc }, i) => (
            <motion.div key={year}
              initial={{ opacity: 0, x: -20 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ delay: i * .12 }}
              style={{ position: 'relative', marginBottom: '2rem' }}>
              <div style={{ position: 'absolute', left: '-1.8rem', top: '1.1rem', width: 12, height: 12, borderRadius: '50%', background: '#88ca53', border: '2.5px solid rgba(136,202,83,.3)', boxShadow: '0 0 10px rgba(136,202,83,.4)' }} />
              <div className="sku-card" style={{ padding: '1.2rem 1.4rem' }}>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.85rem', fontWeight: 800, color: T.green, letterSpacing: '.08em', marginBottom: '.35rem' }}>{year}</div>
                <h3 style={{ fontSize: '.92rem', fontWeight: 700, color: T.textMain, fontFamily: "'JetBrains Mono',monospace", marginBottom: '.3rem' }}>{title}</h3>
                <p style={{ fontSize: '.78rem', color: T.textSub, lineHeight: 1.6 }}>{desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── 5. VALEURS ───────────────────────────────────────────────
function ValuesSection() {
  const T = useTheme()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <section ref={ref} style={{ padding: '5rem 5%', background: T.bg }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h2 style={{ position: 'relative', fontSize: 'clamp(1.6rem,5vw,2.2rem)', fontWeight: 800, fontFamily: "'JetBrains Mono',monospace", color: T.textMain, letterSpacing: '-.03em' }}>
          <GhostTitle text="Ce qui nous distingue" />
          Ce qui nous <GreenUnderline><span className="text-gradient">distingue</span></GreenUnderline>
        </h2>
      </motion.div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
        {VALUES.map(({ icon: Icon, title, desc }, i) => (
          <motion.div key={title} className="sku-card"
            initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: i * .1 }}
            style={{ padding: '1.5rem' }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(136,202,83,.1)', border: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <Icon size={20} style={{ color: T.green }} />
            </div>
            <h3 style={{ fontSize: '.95rem', fontWeight: 700, color: T.textMain, fontFamily: "'JetBrains Mono',monospace", marginBottom: '.4rem' }}>{title}</h3>
            <p style={{ fontSize: '.8rem', color: T.textSub, lineHeight: 1.65 }}>{desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

// ── 6. STACK TECHNIQUE ───────────────────────────────────────
function SkillsSection() {
  const T = useTheme()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <section ref={ref} style={{ padding: '5rem 5%', background: T.bgAlt }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} style={{ marginBottom: '2rem' }}>
        <h2 style={{ position: 'relative', fontSize: 'clamp(1.6rem,5vw,2.2rem)', fontWeight: 800, fontFamily: "'JetBrains Mono',monospace", color: T.textMain, letterSpacing: '-.03em', marginBottom: '.8rem' }}>
          <GhostTitle text="Les technologies qui font la différence" />
          Les technologies qui font <GreenUnderline><span className="text-gradient">la différence</span></GreenUnderline>
        </h2>
        <p style={{ fontSize: '.88rem', color: T.textSub, lineHeight: 1.75, marginBottom: '1.5rem' }}>
          J'utilise les meilleures technologies modernes — sélectionnées pour leur performance, leur fiabilité et leur adéquation avec vos besoins réels.
        </p>
      </motion.div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.45rem' }}>
        {SKILLS.map((s, i) => (
          <motion.span key={s} initial={{ opacity: 0, y: 8 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: .2 + i * .04 }}
            style={{ padding: '.32rem .8rem', background: 'rgba(136,202,83,.07)', border: `1px solid ${T.border}`, borderRadius: 100, fontFamily: "'JetBrains Mono',monospace", fontSize: '.62rem', fontWeight: 600, color: T.green, letterSpacing: '.05em' }}>
            {s}
          </motion.span>
        ))}
      </div>
      {/* Image */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: .35 }}
        style={{ marginTop: '2rem', borderRadius: 14, overflow: 'hidden', border: `1px solid ${T.border}`, height: 220 }}>
        <LazyImg src="/images/about-4.webp" alt="Développeur" style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          placeholder={<div style={{ height: '100%', background: 'linear-gradient(135deg,#0a1a0e,#060e09)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Code size={36} style={{ color: 'rgba(136,202,83,.3)' }} /></div>} />
      </motion.div>
    </section>
  )
}

// ── 7. RAYON D'ACTION ────────────────────────────────────────
function RayonSection() {
  const T = useTheme()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <section ref={ref} style={{ padding: '5rem 5%', background: T.bg, position: 'relative' }}>
      <div className="grid-bg" style={{ position: 'absolute', inset: 0, opacity: .18 }} />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} style={{ marginBottom: '2rem' }}>
          <h2 style={{ position: 'relative', fontSize: 'clamp(1.6rem,5vw,2.2rem)', fontWeight: 800, fontFamily: "'JetBrains Mono',monospace", color: T.textMain, letterSpacing: '-.03em', marginBottom: '.8rem' }}>
            <GhostTitle text="Où intervenons-nous ?" />
            Où intervenons-<GreenUnderline><span className="text-gradient">nous ?</span></GreenUnderline>
          </h2>
          <p style={{ fontSize: '.88rem', color: T.textSub, lineHeight: 1.75, marginBottom: '1.2rem' }}>
            Basés à <strong style={{ color: T.textMain }}>Abidjan</strong>, nous travaillons à distance avec des entrepreneurs à travers l'Afrique de l'Ouest et la diaspora.
          </p>
          <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap', marginBottom: '1.8rem' }}>
            {['100% remote', 'WhatsApp & Zoom', 'FCFA & EUR'].map(b => (
              <span key={b} style={{ padding: '.28rem .75rem', borderRadius: 100, background: 'rgba(136,202,83,.08)', border: '1px solid rgba(136,202,83,.2)', fontFamily: "'JetBrains Mono',monospace", fontSize: '.65rem', fontWeight: 600, color: '#88ca53' }}>{b}</span>
            ))}
          </div>
        </motion.div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.65rem' }}>
          {PAYS.map(({ code, name, note, primary }, i) => (
            <motion.div key={name}
              initial={{ opacity: 0, y: 14 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: i * .07 }}
              style={{ padding: '.85rem 1rem', borderRadius: 12, background: primary ? 'linear-gradient(135deg,rgba(136,202,83,.14),rgba(136,202,83,.05))' : (T.light ? 'rgba(0,0,0,.03)' : 'rgba(255,255,255,.03)'), border: `1px solid ${primary ? 'rgba(136,202,83,.35)' : T.border}`, display: 'flex', alignItems: 'center', gap: '.65rem' }}>
              <FlagBadge code={code} primary={primary} />
              <div>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, fontSize: '.75rem', color: primary ? '#88ca53' : T.textMain }}>{name}</div>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.58rem', color: T.textMuted }}>{note}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── PAGE ─────────────────────────────────────────────────────
export default function AboutPageMobile() {
  return (
    <div>
      {/* 1 */}<HeroAbout />
      {/* 2 */}<StatsSection />
      {/* 3 */}<FounderSection />
      <MarqueeStrip />
      {/* 4 */}<TimelineSection />
      {/* 5 */}<ValuesSection />
      {/* 6 */}<SkillsSection />
      {/* 7 */}<RayonSection />
      <PageCTA message="Prêt à collaborer avec AKATech ? Discutons de votre projet." cta="Démarrer un projet" />
    </div>
  )
}
