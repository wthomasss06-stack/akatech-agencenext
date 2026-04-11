'use client'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, Clock, Tag, ArrowRight, MessageCircle } from 'lucide-react'
import { useTheme } from '@/lib/theme'
import { SectionCTA } from '@/components/ui/index'
import { BLOG_POSTS } from '@/lib/data'

const FULL_ARTICLES = {
  'pourquoi-votre-business-a-besoin-dun-site-web': [
    { type: 'lead', text: "En Côte d'Ivoire, plus de 60% des consommateurs recherchent une entreprise en ligne avant d'acheter. Si votre business n'est pas visible sur internet, vous perdez des clients chaque jour — sans même le savoir." },
    { type: 'h2', text: '1. Les clients vous cherchent déjà en ligne' },
    { type: 'p', text: "Que vous vendiez des vêtements, de la nourriture ou des services, vos clients potentiels tapent sur Google avant de se déplacer. Un site web vous permet d'être présent à ce moment crucial de décision." },
    { type: 'p', text: "Sans site, vous dépendez uniquement du bouche-à-oreille et des réseaux sociaux — dont vous ne contrôlez pas les algorithmes. Facebook peut changer ses règles du jour au lendemain. Votre site, lui, vous appartient." },
    { type: 'h2', text: '2. Un site web renforce votre crédibilité' },
    { type: 'p', text: "Imaginez deux prestataires identiques. L'un a un site professionnel avec ses services, prix et témoignages clients. L'autre n'a qu'un numéro WhatsApp. Lequel choisiriez-vous pour un projet important ?" },
    { type: 'p', text: "Un site web soigné signal à vos prospects que vous êtes sérieux, établi, et que vous investissez dans votre image. C'est de la crédibilité instantanée." },
    { type: 'h2', text: '3. Il travaille pour vous 24h/24' },
    { type: 'p', text: "Votre site présente vos services, répond aux questions fréquentes et collecte des contacts de prospects — même quand vous dormez. C'est votre meilleur commercial, disponible à toute heure." },
    { type: 'cta', text: "Prêt à créer votre site ? On vous accompagne.", href: '/contact' },
  ],
  'mobile-money-integration-site-ecommerce': [
    { type: 'lead', text: "Le paiement mobile représente plus de 70% des transactions e-commerce en Côte d'Ivoire. Intégrer MTN MoMo, Orange Money et Wave n'est plus optionnel — c'est indispensable." },
    { type: 'h2', text: "Pourquoi Mobile Money s'impose" },
    { type: 'p', text: "La majorité des Ivoiriens n'ont pas de carte bancaire, mais presque tous ont un mobile money. C'est la réalité du marché local. Votre boutique en ligne doit s'adapter à cette réalité, pas l'inverse." },
    { type: 'h2', text: 'Les 3 plateformes à intégrer' },
    { type: 'p', text: "MTN MoMo est le leader avec plus de 10 millions d'utilisateurs. Orange Money est très utilisé dans les zones rurales. Wave a révolutionné le marché avec ses frais quasi nuls — c'est le favori des jeunes." },
    { type: 'h2', text: 'Comment AKATech intègre ces paiements' },
    { type: 'p', text: "On utilise des APIs officielles et des passerelles de paiement locales (CinetPay, Kkiapay) pour intégrer ces systèmes de manière sécurisée et conforme. Les transactions sont tracées, remboursables et auditables." },
    { type: 'cta', text: 'Créer votre boutique avec Mobile Money', href: '/contact' },
  ],
}

const defaultContent = (post) => [
  { type: 'lead', text: post.excerpt },
  { type: 'h2', text: "L'importance pour votre business" },
  { type: 'p', text: "Dans un marché africain en pleine transformation digitale, comprendre les enjeux du web est crucial pour la croissance de votre entreprise." },
  { type: 'p', text: "Chez AKATech, nous ne vendons pas juste des sites web. Nous construisons des solutions digitales qui répondent aux réalités du marché ivoirien — Mobile Money, faible débit, usage mobile-first." },
  { type: 'p', text: "Chaque projet est pensé pour générer des résultats concrets : plus de clients, plus de revenus, moins de tâches répétitives. C'est notre engagement." },
  { type: 'cta', text: 'Discutons de votre projet', href: '/contact' },
]

export default function BlogArticleClient({ slug }) {
  const T = useTheme()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  const post = BLOG_POSTS.find(p => p.slug === slug) || BLOG_POSTS[0]
  const content = FULL_ARTICLES[post.slug] || defaultContent(post)
  const related = BLOG_POSTS.filter(p => p.slug !== post.slug).slice(0, 2)

  return (
    <div style={{ paddingTop: 72 }}>
      {/* Header */}
      <section style={{ padding: '4rem 5% 3rem', background: T.bg, position: 'relative', overflow: 'hidden' }}>
        <div className="grid-bg" style={{ position: 'absolute', inset: 0, opacity: .2 }} />
        <div style={{ maxWidth: 780, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .6 }}>
            <Link href="/blog"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '.5rem', fontSize: '.8rem', color: T.textMuted, marginBottom: '1.5rem', textDecoration: 'none', transition: 'color .2s' }}
              onMouseEnter={e => e.currentTarget.style.color = T.green}
              onMouseLeave={e => e.currentTarget.style.color = T.textMuted}>
              <ArrowLeft size={14} /> Retour au blog
            </Link>

            <div style={{ display: 'flex', alignItems: 'center', gap: '.8rem', marginBottom: '1.2rem', flexWrap: 'wrap' }}>
              <span style={{ padding: '.25rem .85rem', borderRadius: 100, background: T.light ? 'rgba(22,163,74,.08)' : 'rgba(34,200,100,.08)', border: `1px solid ${T.border}`, fontFamily: "'Dancing Script',cursive", fontSize: '1rem', fontWeight: 700, color: T.green, display: 'flex', alignItems: 'center', gap: '.35rem' }}>
                <Tag size={10} />{post.category}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '.3rem', fontSize: '.72rem', color: T.textMuted }}>
                <Clock size={11} />{post.readTime} de lecture
              </span>
              <span style={{ fontSize: '.72rem', color: T.textMuted }}>
                {new Date(post.date).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            </div>

            <h1 style={{ fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 800, fontFamily: "'Syne',sans-serif", color: T.textMain, letterSpacing: '-.04em', lineHeight: 1.15, marginBottom: '2rem' }}>
              {post.title}
            </h1>

            <div style={{ borderRadius: 16, overflow: 'hidden', marginBottom: '3rem', border: `1px solid ${T.border}` }}>
              <img src={post.img} alt={post.title} style={{ width: '100%', height: 340, objectFit: 'cover', display: 'block' }} />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Article body */}
      <section ref={ref} style={{ padding: '0 5% 5rem', background: T.bg }}>
        <div style={{ maxWidth: 780, margin: '0 auto' }}>
          {content.map((block, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * .07 }}>

              {block.type === 'lead' && (
                <p style={{ fontSize: '1.05rem', color: T.textSub, lineHeight: 1.85, marginBottom: '2rem', paddingLeft: '1.2rem', borderLeft: `3px solid ${T.green}`, fontStyle: 'italic' }}>
                  {block.text}
                </p>
              )}
              {block.type === 'h2' && (
                <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: '1.4rem', fontWeight: 800, color: T.textMain, letterSpacing: '-.03em', marginTop: '2.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '.6rem' }}>
                  <span style={{ width: 20, height: 2, background: T.green, display: 'inline-block', flexShrink: 0 }} />
                  {block.text}
                </h2>
              )}
              {block.type === 'p' && (
                <p style={{ fontSize: '.95rem', color: T.textSub, lineHeight: 1.85, marginBottom: '1.2rem' }}>
                  {block.text}
                </p>
              )}
              {block.type === 'cta' && (
                <div style={{ margin: '2.5rem 0', padding: '2rem', borderRadius: 16, background: T.light ? 'rgba(22,163,74,.05)' : 'rgba(34,200,100,.05)', border: `1px solid ${T.border}`, textAlign: 'center' }}>
                  <p style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, color: T.textMain, marginBottom: '1.2rem', fontSize: '1.05rem' }}>{block.text}</p>
                  <Link href={block.href} className="btn-raised" style={{ display: 'inline-flex', padding: '.8rem 2rem' }}>
                    Nous contacter <ArrowRight size={14} />
                  </Link>
                </div>
              )}
            </motion.div>
          ))}

          {/* Author card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: .5 }}
            style={{ marginTop: '3rem', padding: '1.5rem', borderRadius: 14, background: T.light ? 'rgba(22,163,74,.04)' : 'rgba(34,200,100,.04)', border: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', gap: '1.2rem', flexWrap: 'wrap' }}>
            <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(34,200,100,.15)', border: `2px solid ${T.border2}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontFamily: "'Dancing Script',cursive", fontWeight: 800, color: T.green, fontSize: '1.1rem' }}>
              E
            </div>
            <div>
              <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, color: T.textMain, fontSize: '.9rem' }}>M'Bollo Aka Elvis</div>
              <div style={{ fontFamily: "'Dancing Script',cursive", fontSize: '1rem', fontWeight: 700, color: T.greenSub, letterSpacing: '.06em' }}>Fondateur · AKATech · Développeur Full-Stack</div>
            </div>
            <a href="https://wa.me/2250142507750" target="_blank" rel="noreferrer"
              className="btn-raised"
              style={{ marginLeft: 'auto', padding: '.55rem 1.1rem', fontSize: '.78rem', flexShrink: 0, display: 'inline-flex', alignItems: 'center', gap: '.4rem' }}>
              <MessageCircle size={13} /> Contacter
            </a>
          </motion.div>
        </div>
      </section>

      {/* Related posts */}
      {related.length > 0 && (
        <section style={{ padding: '4rem 5%', background: T.bgAlt }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: '1.4rem', color: T.textMain, marginBottom: '2rem' }}>
              Articles similaires
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: '1.5rem' }}>
              {related.map((p, i) => (
                <motion.article key={p.slug} className="sku-card"
                  initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: i * .1 }}
                  style={{ overflow: 'hidden' }}>
                  <div style={{ height: 160, overflow: 'hidden' }}>
                    <img src={p.img} alt={p.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .4s', display: 'block' }}
                      onMouseEnter={e => e.target.style.transform = 'scale(1.06)'}
                      onMouseLeave={e => e.target.style.transform = 'scale(1)'} />
                  </div>
                  <div style={{ padding: '1.3rem' }}>
                    <span style={{ fontFamily: "'Dancing Script',cursive", fontSize: '1rem', fontWeight: 700, color: T.green, letterSpacing: '.06em', display: 'flex', alignItems: 'center', gap: '.3rem', marginBottom: '.7rem' }}>
                      <Clock size={10} />{p.readTime}
                    </span>
                    <h3 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: '.92rem', color: T.textMain, lineHeight: 1.4, marginBottom: '.9rem' }}>{p.title}</h3>
                    <Link href={`/blog/${p.slug}`}
                      style={{ display: 'flex', alignItems: 'center', gap: '.4rem', fontSize: '.8rem', fontWeight: 700, color: T.green, textDecoration: 'none' }}>
                      Lire <ArrowRight size={12} />
                    </Link>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      )}

      <SectionCTA variant="strong" message="Vous avez un projet web ? Discutons-en gratuitement." cta="Démarrer un projet →" />
    </div>
  )
}
