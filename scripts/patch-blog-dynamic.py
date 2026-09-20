from pathlib import Path

for name in ['BlogClient.js', 'BlogClientMobile.js']:
    p = Path('/home/ubuntu/akatech-work/app/blog') / name
    s = p.read_text()
    s = s.replace('export default function BlogClient()', 'export default function BlogClient({ posts = BLOG_POSTS })')
    s = s.replace('export default function BlogClientMobile()', 'export default function BlogClientMobile({ posts = BLOG_POSTS })')
    s = s.replace('BLOG_POSTS[0]', 'posts[0]')
    s = s.replace('BLOG_POSTS.filter', 'posts.filter')
    p.write_text(s)

p = Path('/home/ubuntu/akatech-work/app/blog/BlogResponsive.js')
s = p.read_text()
s = s.replace("import { useState, useEffect } from 'react'", "import { useState, useEffect } from 'react'\nimport { BLOG_POSTS } from '@/lib/data'")
s = s.replace("  const [mobile, setMobile] = useState(false)", "  const [mobile, setMobile] = useState(false)\n  const [posts, setPosts] = useState(BLOG_POSTS)")
s = s.replace("  useEffect(() => {\n    const check", "  useEffect(() => {\n    fetch('/api/blog').then(r => r.ok ? r.json() : null).then(d => { if (d?.posts?.length) setPosts(prev => [...d.posts, ...prev]) }).catch(() => {})\n  }, [])\n  useEffect(() => {\n    const check")
s = s.replace("return mobile ? <BlogClientMobile /> : <BlogClient />", "return mobile ? <BlogClientMobile posts={posts} /> : <BlogClient posts={posts} />")
p.write_text(s)
