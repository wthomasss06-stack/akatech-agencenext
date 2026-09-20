from pathlib import Path
for name in ['BlogClient.js','BlogClientMobile.js']:
    p=Path('/home/ubuntu/akatech-work/app/blog')/name
    s=p.read_text()
    s=s.replace('function FeaturedPost() {', 'function FeaturedPost({ posts }) {')
    s=s.replace('function BlogGrid() {', 'function BlogGrid({ posts }) {')
    s=s.replace('export default function BlogPage() {', 'export default function BlogPage({ posts = BLOG_POSTS }) {')
    s=s.replace('<FeaturedPost />', '<FeaturedPost posts={posts} />')
    s=s.replace('<BlogGrid />', '<BlogGrid posts={posts} />')
    p.write_text(s)
