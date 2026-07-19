'use client'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, Clock, Tag, ArrowRight, MessageCircle } from 'lucide-react'
import { useTheme } from '@/lib/theme'
import { PageCTA } from '@/components/ui/index'
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
  'vibe-coding-nouvelle-abstraction-developpement': [
    { type: 'lead', text: 'Le vibe coding dérange certaines personnes parce qu\'il touche à leur ego.' },
    { type: 'h2', text: "L'histoire se répète à chaque nouvelle abstraction" },
    { type: 'p', text: "À une époque, utiliser un compilateur au lieu d'écrire directement en assembleur était mal vu par certains puristes. Plus tard, adopter un framework plutôt que du JavaScript pur a suscité les mêmes réticences. Pourtant, ces outils sont devenus des standards incontournables du développement." },
    { type: 'h2', text: "Ce n'est pas l'outil qui compte, c'est ce qu'on en fait" },
    { type: 'p', text: "Chaque nouvelle abstraction — du compilateur au framework, et aujourd'hui à l'IA générative — suscite de la méfiance avant d'être adoptée. C'est un cycle qui se répète depuis les débuts de l'informatique. L'important n'a jamais été l'outil utilisé, mais la valeur que l'on est capable de créer avec." },
    { type: 'p', text: "Chez AKATech, on utilise l'IA comme un accélérateur, pas comme un raccourci pour éviter de comprendre le code. La différence se voit dans le résultat livré, pas dans la méthode." },
    { type: 'cta', text: 'Envie d\'un site pensé avec les bons outils, pas juste les plus récents ?', href: '/contact' },
  ],
  'erreurs-de-code-dun-junior-et-comment-progresser': [
    { type: 'lead', text: "Le premier Pull Request d'un développeur junior, c'est souvent un mélange de variables inutilisées, de console.log() oubliés, de secrets ou clés API laissés en dur dans le code, et de setInterval() qui tournent à vie." },
    { type: 'h2', text: "C'est normal, et ça ne dit rien de votre potentiel" },
    { type: 'p', text: "On est tous passés par là. Un code qui marche mais que personne ne veut maintenir, ce n'est pas un manque de talent — c'est simplement l'étape avant d'apprendre les bonnes pratiques. Personne ne naît en écrivant du code propre et sécurisé du premier coup." },
    { type: 'h2', text: "Le rôle d'un senior n'est pas de juger" },
    { type: 'p', text: "Le rôle d'un développeur senior n'est pas de se moquer des erreurs d'un junior, mais d'expliquer pourquoi certaines pratiques sont dangereuses — un secret API laissé en dur dans le code peut coûter cher — et comment écrire un code plus propre, plus maintenable et plus sécurisé." },
    { type: 'p', text: "Les meilleurs développeurs ne sont pas ceux qui n'ont jamais fait d'erreur. Ce sont ceux qui ont eu des code reviews qui les ont fait progresser. C'est aussi comme ça qu'on travaille chez AKATech : chaque ligne de code livrée passe par une relecture avant de partir en production." },
    { type: 'cta', text: 'Besoin d\'un code propre et sécurisé pour votre projet ?', href: '/contact' },
  ],
  'ia-ne-remplace-pas-la-competence-technique': [
    { type: 'lead', text: "Un outil ne dépassera jamais une compétence technique. L'IA est puissante, oui — mais entre les mains de quelqu'un qui ne comprend pas le code, ça reste du copier-coller." },
    { type: 'h2', text: 'Le vibe coding a ses limites' },
    { type: 'p', text: "Le \"vibe coding\" donne l'illusion d'être développeur… jusqu'au moment où il faut corriger un bug, optimiser une requête ou sécuriser une faille. Un développeur expérimenté utilise l'IA pour aller plus vite. Un débutant l'utilise pour éviter de réfléchir. Les résultats n'ont rien à voir." },
    { type: 'h2', text: 'Mon propre site en est la preuve' },
    { type: 'p', text: "J'ai refait mon portfolio personnel en passant de Vite + React à Next.js, avec l'IA comme assistant. La différence est claire : meilleure performance, meilleur SEO, meilleure structure. Mais ce n'est pas juste un outil qui a fait ça — ce sont les choix techniques faits à chaque étape." },
    { type: 'p', text: "C'est exactement la même approche qu'on applique chez AKATech pour chaque projet client : l'IA accélère l'exécution, mais l'architecture, les choix de stack et la sécurité restent une question de compétence, pas d'automatisation." },
    { type: 'cta', text: 'Discutons des choix techniques de votre projet', href: '/contact' },
  ],
  'les-vibes-vont-detruire-securite-frontend-backend': [
    { type: 'lead', text: '"Frontend = sécurité"… j\'ai vu ça sur internet et j\'ai souri. Le fait d\'avoir dans un menu déroulant ADMIN, ANNONCEUR, DIFFUSEUR n\'est PAS un problème en soi. Le vrai problème est ailleurs.' },
    { type: 'h2', text: 'Les vraies questions à se poser' },
    { type: 'p', text: "Est-ce qu'un utilisateur peut s'auto-attribuer le rôle ADMIN ? Est-ce que le backend vérifie réellement les permissions à chaque requête ? Est-ce que les routes sensibles sont protégées côté serveur, et pas seulement cachées côté client ?" },
    { type: 'h2', text: 'Le frontend affiche, le backend autorise' },
    { type: 'p', text: 'On peut cacher "ADMIN" dans l\'interface autant qu\'on veut — si le backend ne vérifie rien, n\'importe qui peut se créer un royaume avec un outil comme Postman en appelant directement l\'API. Cette différence entre affichage et autorisation, c\'est littéralement la sécurité d\'une application.' },
    { type: 'p', text: "C'est un principe qu'on applique sur chaque projet chez AKATech : les permissions sont toujours vérifiées côté serveur, jamais seulement masquées côté interface. La sécurité ne vit jamais dans l'UI." },
    { type: 'cta', text: 'Un doute sur la sécurité de votre application ?', href: '/contact' },
  ],
  'plus-gros-mensonge-ia-responsabilite-developpeur': [
    { type: 'lead', text: '"Tu n\'as plus besoin d\'apprendre à coder grâce à l\'IA." Le plus gros mensonge qu\'on a vendu aux développeurs récemment. Oui, tu peux générer une UI, une API, même une application entière. Mais le problème commence quand ça ne marche plus.' },
    { type: 'h2', text: "Copier du code n'est pas comprendre un système" },
    { type: 'p', text: "Ça devient lent, ça casse en production, l'IA invente parfois du code absurde. Et là, on réalise un truc brutal : copier du code n'est pas la même chose que comprendre le système qu'on construit. L'IA peut générer du code, mais elle ne porte jamais la responsabilité du résultat." },
    { type: 'h2', text: 'Quand le backend tombe à 3h du matin' },
    { type: 'p', text: "Ce n'est pas l'IA qui vient corriger les logs en production. C'est le développeur. Le vrai développeur aujourd'hui n'est pas celui qui utilise le plus d'IA — c'est celui qui sait quoi générer, quoi garder, quoi refactorer, et surtout quoi ne pas accepter." },
    { type: 'p', text: "Le vibe coding donne de la vitesse. La compréhension donne le contrôle. Chez AKATech, l'IA fait partie de nos outils, mais chaque ligne livrée est comprise et validée avant de partir en production — pas juste générée et copiée." },
    { type: 'cta', text: 'Besoin d\'un développeur qui comprend ce qu\'il livre ?', href: '/contact' },
  ],
  'lancer-projet-imparfait-plutot-que-jamais': [
    { type: 'lead', text: "Cette ancienne page Facebook ne paierait probablement même pas un designer aujourd'hui. Pourtant, elle a donné naissance à l'une des plus grandes plateformes du monde." },
    { type: 'h2', text: 'La perfection est l\'ennemie du lancement' },
    { type: 'p', text: 'Beaucoup de développeurs et d\'entrepreneurs abandonnent leurs projets parce qu\'ils ne sont pas encore "parfaits". Ils peaufinent, repoussent, recommencent — et ne sortent jamais rien. La vérité, c\'est que mieux vaut lancer une version imparfaite que garder une idée parfaite enfermée dans sa tête.' },
    { type: 'h2', text: 'Le vrai cimetière de projets' },
    { type: 'p', text: "Le plus grand cimetière de projets ne se trouve pas dans des dossiers abandonnés sur un disque dur. Il se trouve dans l'esprit des développeurs qui attendent le moment parfait pour lancer. Une première version, même imparfaite, peut évoluer. Une idée jamais lancée ne devient jamais rien." },
    { type: 'p', text: "C'est exactement l'approche qu'on recommande à nos clients chez AKATech : lancer une V1 solide et fonctionnelle, puis itérer avec de vrais retours utilisateurs — plutôt que d'attendre 6 mois pour une version \"parfaite\" que personne n'aura testée." },
    { type: 'cta', text: 'Prêt à lancer votre V1 ?', href: '/contact' },
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
      <section style={{ padding: '5rem 5% 4rem', background: T.bg, position: 'relative', overflow: 'hidden' }}>
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
              <span style={{ padding: '.25rem .85rem', borderRadius: 100, background: T.light ? 'rgba(95,145,55,.08)' : 'rgba(136,202,83,.08)', border: `1px solid ${T.border}`, fontFamily: "'JetBrains Mono',monospace", fontSize: '.65rem', fontWeight: 600, color: T.green, display: 'flex', alignItems: 'center', gap: '.35rem' }}>
                <Tag size={10} />{post.category}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '.3rem', fontSize: '.72rem', color: T.textMuted }}>
                <Clock size={11} />{post.readTime} de lecture
              </span>
              <span style={{ fontSize: '.72rem', color: T.textMuted }}>
                {new Date(post.date).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            </div>

            <h1 style={{ fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 900, fontStyle: 'italic', fontFamily: "'Barlow Condensed',sans-serif", color: T.textMain, letterSpacing: '-.04em', lineHeight: 1.15, marginBottom: '1.5rem' }}>
              {post.title}
            </h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem', marginBottom: '2rem' }}>
              <img
                src="/images/founder.webp"
                alt="M'Bollo Aka Elvis"
                style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', border: `1px solid ${T.border}`, flexShrink: 0 }}
              />
              <div>
                <div style={{ fontSize: '.85rem', fontWeight: 700, color: T.textMain, fontFamily: "'JetBrains Mono',monospace" }}>
                  M'Bollo Aka Elvis
                </div>
                <a
                  href="https://www.linkedin.com/in/m-bollo-aka"
                  target="_blank"
                  rel="noreferrer"
                  style={{ fontSize: '.72rem', color: T.textMuted, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '.3rem', transition: 'color .2s' }}
                  onMouseEnter={e => e.currentTarget.style.color = T.green}
                  onMouseLeave={e => e.currentTarget.style.color = T.textMuted}
                >
                  Founder, AKATech · Suivre sur LinkedIn ↗
                </a>
              </div>
            </div>

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
                <h2 style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '1.4rem', fontWeight: 800, color: T.textMain, letterSpacing: '-.03em', marginTop: '2.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '.6rem' }}>
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
                <div style={{ margin: '2.5rem 0', padding: '2rem', borderRadius: 16, background: T.light ? 'rgba(95,145,55,.05)' : 'rgba(136,202,83,.05)', border: `1px solid ${T.border}`, textAlign: 'center' }}>
                  <p style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, color: T.textMain, marginBottom: '1.2rem', fontSize: '1.05rem' }}>{block.text}</p>
                  <Link href={block.href} className="btn-raised" style={{ display: 'inline-flex', padding: '.8rem 2rem' }}>
                    Nous contacter <ArrowRight size={14} />
                  </Link>
                </div>
              )}
            </motion.div>
          ))}

          
        </div>
      </section>

      {/* Related posts */}
      {related.length > 0 && (
        <section style={{ padding: '4rem 5%', background: T.bgAlt }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <h2 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontStyle: 'italic', fontSize: '1.4rem', color: T.textMain, marginBottom: '2rem' }}>
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
                    <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.65rem', fontWeight: 600, color: T.green, letterSpacing: '.06em', display: 'flex', alignItems: 'center', gap: '.3rem', marginBottom: '.7rem' }}>
                      <Clock size={10} />{p.readTime}
                    </span>
                    <h3 style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, fontSize: '.92rem', color: T.textMain, lineHeight: 1.4, marginBottom: '.9rem' }}>{p.title}</h3>
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

      <PageCTA message="Vous avez un projet web ? Discutons-en gratuitement." cta="Démarrer un projet" />
    </div>
  )
}
