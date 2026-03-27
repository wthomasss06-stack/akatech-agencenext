import BlogArticleClient from './BlogArticleClient'
import { BLOG_POSTS } from '@/lib/data'

export function generateStaticParams() {
  return BLOG_POSTS.map(p => ({ slug: p.slug }))
}

export default function BlogArticlePage({ params }) {
  return <BlogArticleClient slug={params.slug} />
}
