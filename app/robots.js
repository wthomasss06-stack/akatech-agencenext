export const dynamic = 'force-static'

const SITE_URL = 'https://akatech-agence.vercel.app'

export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
