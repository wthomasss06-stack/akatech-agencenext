import BlogArticleClient from './BlogArticleClient'
import { BLOG_POSTS } from '@/lib/data'
import { getBlogPostBySlug } from '@/lib/blog'
import { BreadcrumbJsonLd } from '../../seo/StructuredData'

const SITE_URL = 'https://akatech.vercel.app'
export const dynamicParams = true

export function generateStaticParams() { return BLOG_POSTS.map(p => ({ slug: p.slug })) }

export async function generateMetadata({ params }) {
  const post = await getBlogPostBySlug(params.slug)
  if (!post) return { title: 'Article — AKATech' }
  return {
    title: `${post.title} — Blog AKATech`, description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: { title: post.title, description: post.excerpt, url: `${SITE_URL}/blog/${post.slug}`, type: 'article', locale: 'fr_CI', siteName: 'AKATech', publishedTime: post.date, images: [{ url: post.img, width: 1200, height: 630, alt: post.title }] },
    twitter: { card: 'summary_large_image', title: post.title, description: post.excerpt, images: [post.img] },
  }
}

export default async function BlogArticlePage({ params }) {
  const post = await getBlogPostBySlug(params.slug)
  const articleJsonLd = post ? {
    '@context': 'https://schema.org', '@type': 'Article', headline: post.title, description: post.excerpt,
    image: post.img, datePublished: post.date, dateModified: post.updatedAt || post.date,
    author: { '@type': 'Organization', name: 'AKATech' },
    publisher: { '@type': 'Organization', name: 'AKATech', logo: { '@type': 'ImageObject', url: `${SITE_URL}/images/logo.webp` } },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/blog/${params.slug}` },
  } : null
  return (
    <>
      {articleJsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />}
      {post && <BreadcrumbJsonLd items={[{ name: 'Accueil', url: `${SITE_URL}/` }, { name: 'Blog', url: `${SITE_URL}/blog` }, { name: post.title, url: `${SITE_URL}/blog/${post.slug}` }]} />}
      <BlogArticleClient slug={params.slug} initialPost={post} />
    </>
  )
}
