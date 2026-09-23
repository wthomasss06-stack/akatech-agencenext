'use client'
import { useState, useEffect } from 'react'
import { BLOG_POSTS } from '@/lib/data'
import BlogClient       from './BlogClient'
import BlogClientMobile from './BlogClientMobile'

export default function BlogResponsive() {
  const [ready, setReady]   = useState(false)
  const [mobile, setMobile] = useState(false)
  const [posts, setPosts] = useState(BLOG_POSTS)
  useEffect(() => {
    fetch('/api/blog').then(r => r.ok ? r.json() : null).then(d => { if (d?.posts?.length) setPosts(prev => [...d.posts, ...prev]) }).catch(() => {})
  }, [])
  useEffect(() => {
    // Le viewport mobile émet des resize lors de l'affichage des barres
    // d'adresse et du clavier. Ne pas remonter la page pendant une interaction.
    setMobile(window.matchMedia('(max-width: 1023px)').matches)
    setReady(true)
  }, [])
  if (!ready) return null
  return mobile ? <BlogClientMobile posts={posts} /> : <BlogClient posts={posts} />
}
