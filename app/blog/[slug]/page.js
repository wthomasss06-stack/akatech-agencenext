import BlogArticleClient from './BlogArticleClient'
import { BLOG_POSTS } from '@/lib/data'

const SITE_URL = 'https://akatech-agence.vercel.app'

export function generateStaticParams() {
  return BLOG_POSTS.map(p => ({ slug: p.slug }))
}

export function generateMetadata({ params }) {
  const post = BLOG_POSTS.find(p => p.slug === params.slug)
  if (!post) return { title: 'Article — AKATech' }

  return {
    title: `${post.title} — Blog AKATech`,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `${SITE_URL}/blog/${post.slug}`,
      type: 'article',
      locale: 'fr_CI', siteName: 'AKATech',
      publishedTime: post.date,
      images: [{ url: post.img, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [post.img],
    },
  }
}

export default function BlogArticlePage({ params }) {
  const post = BLOG_POSTS.find(p => p.slug === params.slug)

  const ARTICLE_JSON_LD = post ? {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: `${SITE_URL}${post.img}`,
    datePublished: post.date,
    dateModified: post.date,
    author: { '@type': 'Organization', name: 'AKATech' },
    publisher: { '@type': 'Organization', name: 'AKATech', logo: { '@type': 'ImageObject', url: `${SITE_URL}/images/logo.webp` } },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/blog/${post.slug}` },
  } : null

  return (
    <>
      {ARTICLE_JSON_LD && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ARTICLE_JSON_LD) }} />
      )}
      <BlogArticleClient slug={params.slug} />
    </>
  )
}
