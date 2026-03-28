'use client'
import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'
import { Clock, ArrowRight, Tag, Search, BookOpen, TrendingUp, Globe, ShoppingCart, Code, Zap } from 'lucide-react'
import { useTheme } from '@/lib/theme'
import { SectionEye, MarqueeStrip, SectionCTA, LaserBeam } from '@/components/ui/index'
import { BLOG_POSTS } from '@/lib/data'

const CATEGORIES = ['Tous', 'Stratégie Digitale', 'E-Commerce', 'Développement Web', 'SEO']
const CAT_ICONS = { 'Stratégie Digitale': TrendingUp, 'E-Commerce': ShoppingCart, 'Développement Web': Code, 'SEO': Globe }

// ── HERO ──────────────────────────────────────────────────────
function HeroBlog() {
  const T = useTheme()
  return (
    <section style={{ padding: '9rem 5% 5rem', background: T.bg, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle,rgba(34,200,100,.07),transparent 65%)', pointerEvents: 'none' }} />
      <div className="grid-bg" style={{ position: 'absolute', inset: 0, opacity: .3 }} />
      <LaserBeam position="right" intensity="strong" />
      <LaserBeam position="left"  intensity="subtle" style={{ animationDelay: '1.6s', height: '40%', top: '15%' }} />
      <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7, ease: [.22,1,.36,1] }}>
          <SectionEye label="// Blog & Ressources" center />
          <h1 style={{ fontSize: 'clamp(2.2rem,5vw,3.8rem)', fontWeight: 800, fontFamily: "'Syne',sans-serif", color: T.textMain, letterSpacing: '-.04em', lineHeight: 1.1, marginBottom: '1.2rem' }}>
            Insights & conseils<br />
            <span className="text-gradient">pour votre business digital</span>
          </h1>
          <p style={{ fontSize: '1.05rem', color: T.textSub, lineHeight: 1.75, maxWidth: 520, margin: '0 auto' }}>
            Stratégie digitale, développement web, SEO et e-commerce — des contenus concrets pour les entrepreneurs ivoiriens.
          </p>
        </motion.div>
      </div>
    </section>
  )
}

// ── FEATURED POST ─────────────────────────────────────────────
function FeaturedPost() {
  const T = useTheme()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const post = BLOG_POSTS[0]

  return (
    <section ref={ref} style={{ padding: '3rem 5%', background: T.bgAlt }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          className="sku-card" style={{ overflow: 'hidden', display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: 340 }}>
          {/* Image */}
          <div style={{ position: 'relative', minHeight: 280 }}>
            <img src={post.img} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,rgba(3,8,6,.3),transparent)' }} />
            <div style={{ position: 'absolute', top: '1rem', left: '1rem', padding: '.3rem .9rem', borderRadius: 100, background: 'rgba(34,200,100,.2)', backdropFilter: 'blur(8px)', border: '1px solid rgba(34,200,100,.35)', fontFamily: "'JetBrains Mono',monospace", fontSize: '.62rem', color: '#22c864', letterSpacing: '.08em' }}>
              ⭐ Article vedette
            </div>
          </div>
          {/* Content */}
          <div style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '.8rem', marginBottom: '1rem' }}>
              <span style={{ padding: '.25rem .8rem', borderRadius: 100, background: T.light ? 'rgba(22,163,74,.08)' : 'rgba(34,200,100,.08)', border: `1px solid ${T.border}`, fontFamily: "'JetBrains Mono',monospace", fontSize: '.6rem', color: T.green, letterSpacing: '.06em' }}>
                {post.category}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '.3rem', fontSize: '.72rem', color: T.textMuted }}>
                <Clock size={11} />{post.readTime}
              </span>
            </div>
            <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: '1.4rem', color: T.textMain, letterSpacing: '-.03em', lineHeight: 1.3, marginBottom: '.9rem' }}>
              {post.title}
            </h2>
            <p style={{ fontSize: '.85rem', color: T.textSub, lineHeight: 1.7, marginBottom: '1.8rem' }}>{post.excerpt}</p>
            <Link href={`/blog/${post.slug}`} className="btn-raised" style={{ display: 'inline-flex', padding: '.7rem 1.5rem', fontSize: '.84rem', width: 'fit-content' }}>
              Lire l'article <ArrowRight size={14} />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// ── BLOG GRID ─────────────────────────────────────────────────
function BlogGrid() {
  const T = useTheme()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const [activeCategory, setActiveCategory] = useState('Tous')
  const [searchQuery, setSearchQuery] = useState('')

  const filtered = BLOG_POSTS.filter(p => {
    const matchCat = activeCategory === 'Tous' || p.category === activeCategory
    const matchSearch = !searchQuery || p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    return matchCat && matchSearch
  })

  return (
    <section ref={ref} style={{ padding: '4rem 5%', background: T.bg }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Filters */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', marginBottom: '3rem', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap' }}>
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                style={{ padding: '.45rem 1.1rem', borderRadius: 100, border: '1px solid', cursor: 'pointer', fontFamily: "'Syne',sans-serif", fontSize: '.8rem', fontWeight: 600, transition: 'all .2s', borderColor: activeCategory === cat ? T.green : T.border, background: activeCategory === cat ? 'linear-gradient(145deg,#27d570,#1aa355)' : 'transparent', color: activeCategory === cat ? '#fff' : T.textSub }}>
                {cat}
              </button>
            ))}
          </div>
          {/* Search */}
          <div style={{ position: 'relative' }}>
            <Search size={14} style={{ position: 'absolute', left: '.9rem', top: '50%', transform: 'translateY(-50%)', color: T.textMuted, pointerEvents: 'none' }} />
            <input
              style={{ padding: '.6rem 1rem .6rem 2.4rem', borderRadius: 100, border: `1px solid ${T.border}`, background: T.light ? '#f5f5f5' : 'rgba(34,200,100,.04)', color: T.textMain, fontFamily: "'Syne',sans-serif", fontSize: '.82rem', outline: 'none', width: 220 }}
              placeholder="Rechercher..."
              value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              onFocus={e => e.target.style.borderColor = '#22c864'}
              onBlur={e => e.target.style.borderColor = T.border}
            />
          </div>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: T.textMuted }}>
            <BookOpen size={40} style={{ margin: '0 auto 1rem', opacity: .3 }} />
            <p>Aucun article trouvé pour cette recherche.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))', gap: '1.5rem' }}>
            {filtered.map((post, i) => {
              const CatIcon = CAT_ICONS[post.category] || Tag
              return (
                <motion.article key={post.slug} className="sku-card"
                  initial={{ opacity: 0, y: 28 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: i * .08 }}
                  style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                  {/* Image */}
                  <div style={{ height: 200, position: 'relative', overflow: 'hidden' }}>
                    <img src={post.img} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .4s ease', display: 'block' }}
                      onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
                      onMouseLeave={e => e.target.style.transform = 'scale(1)'} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(6,14,9,.6),transparent)' }} />
                  </div>
                  {/* Content */}
                  <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '.7rem', marginBottom: '.9rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '.35rem', padding: '.22rem .75rem', borderRadius: 100, background: T.light ? 'rgba(22,163,74,.07)' : 'rgba(34,200,100,.07)', border: `1px solid ${T.border}`, fontFamily: "'JetBrains Mono',monospace", fontSize: '.58rem', color: T.green, letterSpacing: '.06em' }}>
                        <CatIcon size={10} />{post.category}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '.3rem', fontSize: '.7rem', color: T.textMuted }}>
                        <Clock size={10} />{post.readTime}
                      </span>
                    </div>
                    <h3 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: '.98rem', color: T.textMain, letterSpacing: '-.02em', lineHeight: 1.4, marginBottom: '.7rem' }}>
                      {post.title}
                    </h3>
                    <p style={{ fontSize: '.8rem', color: T.textSub, lineHeight: 1.65, flex: 1, marginBottom: '1.4rem' }}>
                      {post.excerpt.length > 120 ? post.excerpt.slice(0, 120) + '…' : post.excerpt}
                    </p>
                    <Link href={`/blog/${post.slug}`}
                      style={{ display: 'flex', alignItems: 'center', gap: '.4rem', fontFamily: "'Syne',sans-serif", fontSize: '.8rem', fontWeight: 700, color: T.green, textDecoration: 'none', transition: 'gap .2s' }}
                      onMouseEnter={e => e.currentTarget.style.gap = '.7rem'}
                      onMouseLeave={e => e.currentTarget.style.gap = '.4rem'}>
                      Lire l'article <ArrowRight size={13} />
                    </Link>
                  </div>
                </motion.article>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}

// ── NEWSLETTER ────────────────────────────────────────────────
function Newsletter() {
  const T = useTheme()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)

  return (
    <section ref={ref} style={{ padding: '5rem 5%', background: T.bgAlt }}>
      <div style={{ maxWidth: 560, margin: '0 auto', textAlign: 'center' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(34,200,100,.12)', border: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
            <Zap size={24} style={{ color: T.green }} />
          </div>
          <SectionEye label="// Newsletter" center />
          <h2 style={{ fontSize: 'clamp(1.5rem,2.5vw,2rem)', fontWeight: 800, fontFamily: "'Syne',sans-serif", color: T.textMain, letterSpacing: '-.03em', marginBottom: '.7rem' }}>
            Restez informé des dernières tendances
          </h2>
          <p style={{ fontSize: '.88rem', color: T.textSub, lineHeight: 1.7, marginBottom: '2rem' }}>
            Conseils digitaux, nouvelles technologies et ressources pour entrepreneurs ivoiriens — directement dans votre boîte mail.
          </p>
          {done ? (
            <motion.div initial={{ scale: .8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              style={{ padding: '1.2rem 2rem', borderRadius: 14, background: 'rgba(34,200,100,.08)', border: `1px solid ${T.border}`, color: T.green, fontFamily: "'Syne',sans-serif", fontWeight: 700 }}>
              ✅ Merci ! Vous êtes abonné.
            </motion.div>
          ) : (
            <div style={{ display: 'flex', gap: '.8rem' }}>
              <input type="email" placeholder="votre@email.com" value={email} onChange={e => setEmail(e.target.value)}
                style={{ flex: 1, padding: '.85rem 1rem', borderRadius: 10, border: `1px solid ${T.border}`, background: T.light ? '#f5f5f5' : 'rgba(34,200,100,.04)', color: T.textMain, fontFamily: "'Syne',sans-serif", fontSize: '.88rem', outline: 'none' }}
                onFocus={e => e.target.style.borderColor = '#22c864'}
                onBlur={e => e.target.style.borderColor = T.border}
              />
              <button className="btn-raised" onClick={() => email && setDone(true)} style={{ flexShrink: 0, padding: '.85rem 1.4rem', fontSize: '.84rem' }}>
                S'abonner
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}

export default function BlogPage() {
  return (
    <div>
      <HeroBlog />
      <FeaturedPost />
      <BlogGrid />
      <Newsletter />
      <SectionCTA message="Vous avez un projet web ? Discutons-en — consultation gratuite et sans engagement." cta="Démarrer un projet →" />
    </div>
  )
}
