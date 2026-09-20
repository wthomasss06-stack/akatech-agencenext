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
    const check = () => setMobile(window.innerWidth < 1024)
    check(); setReady(true)
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])
  if (!ready) return null
  return mobile ? <BlogClientMobile posts={posts} /> : <BlogClient posts={posts} />
}
