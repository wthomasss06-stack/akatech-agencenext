import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { slugify } from '@/lib/blog'

function isAdmin(request) {
  const header = request.headers.get('authorization')
  if (!header?.startsWith('Basic ')) return false
  try {
    const decoded = atob(header.slice(6))
    const separator = decoded.indexOf(':')
    return decoded.slice(0, separator) === process.env.ADMIN_USER && decoded.slice(separator + 1) === process.env.ADMIN_PASSWORD
  } catch { return false }
}

function clean(body) {
  const title = String(body.title || '').trim()
  const slug = slugify(body.slug || title)
  const content = String(body.content || '').trim()
  if (!title || !slug || !content) throw new Error('Titre, slug et contenu sont obligatoires.')
  return {
    title, slug, content,
    excerpt: String(body.excerpt || content.replace(/[#*_]/g, '').slice(0, 180)).trim(),
    category: String(body.category || 'Développement Web').trim(),
    image: String(body.image || '/images/og-cover.webp').trim(),
    link: body.link ? String(body.link).trim() : null,
    published: body.published !== false,
    publishedAt: body.publishedAt ? new Date(body.publishedAt) : new Date(),
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const admin = searchParams.get('admin') === '1'
  if (admin && !isAdmin(request)) return NextResponse.json({ error: 'Authentification requise' }, { status: 401 })
  try {
    const posts = await prisma.blogPost.findMany({ ...(admin ? {} : { where: { published: true } }), orderBy: { publishedAt: 'desc' } })
    return NextResponse.json({ posts })
  } catch (error) { return NextResponse.json({ posts: [], error: error.message }, { status: 500 }) }
}

export async function POST(request) {
  if (!isAdmin(request)) return NextResponse.json({ error: 'Authentification requise' }, { status: 401 })
  try {
    const post = await prisma.blogPost.create({ data: clean(await request.json()) })
    return NextResponse.json({ post }, { status: 201 })
  } catch (error) { return NextResponse.json({ error: error.message }, { status: 400 }) }
}

export async function PATCH(request) {
  if (!isAdmin(request)) return NextResponse.json({ error: 'Authentification requise' }, { status: 401 })
  try {
    const body = await request.json()
    const id = String(body.id || '')
    if (!id) throw new Error('Article introuvable.')
    const data = clean(body)
    const post = await prisma.blogPost.update({ where: { id }, data })
    return NextResponse.json({ post })
  } catch (error) { return NextResponse.json({ error: error.message }, { status: 400 }) }
}

export async function DELETE(request) {
  if (!isAdmin(request)) return NextResponse.json({ error: 'Authentification requise' }, { status: 401 })
  try {
    const id = new URL(request.url).searchParams.get('id')
    if (!id) throw new Error('Article introuvable.')
    await prisma.blogPost.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (error) { return NextResponse.json({ error: error.message }, { status: 400 }) }
}
