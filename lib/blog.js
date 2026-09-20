import { prisma } from '@/lib/db'
import { BLOG_POSTS } from '@/lib/data'

export function slugify(value = '') {
  return value.toString().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export function normalizeBlogPost(post) {
  return { ...post, img: post.image || post.img, date: post.publishedAt || post.date, readTime: post.readTime || `${Math.max(1, Math.ceil((post.content || '').split(/\s+/).length / 180))} min` }
}

export async function getPublishedBlogPosts() {
  try {
    const posts = await prisma.blogPost.findMany({ where: { published: true }, orderBy: { publishedAt: 'desc' } })
    return [...posts.map(normalizeBlogPost), ...BLOG_POSTS]
  } catch { return BLOG_POSTS }
}

export async function getBlogPostBySlug(slug) {
  try {
    const post = await prisma.blogPost.findUnique({ where: { slug } })
    if (post) return normalizeBlogPost(post)
  } catch {}
  return BLOG_POSTS.find((post) => post.slug === slug) || null
}
