const SITE_URL = 'https://akatech.vercel.app'

const MAIN_NAVIGATION = [
  { name: 'Accueil', url: `${SITE_URL}/` },
  { name: 'Services', url: `${SITE_URL}/services` },
  { name: 'Réalisations', url: `${SITE_URL}/projects` },
  { name: 'Tarifs', url: `${SITE_URL}/pricing` },
  { name: 'À propos', url: `${SITE_URL}/about` },
  { name: 'Blog', url: `${SITE_URL}/blog` },
  { name: 'Contact', url: `${SITE_URL}/contact` },
]

function JsonLd({ data }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

export function SitewideStructuredData({ organization }) {
  const website = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: 'AKATech Studio',
    alternateName: 'AKATech',
    inLanguage: 'fr-CI',
    publisher: { '@id': `${SITE_URL}/#organization` },
    significantLink: MAIN_NAVIGATION.map((item) => item.url),
  }

  const navigation = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Navigation principale AKATech Studio',
    itemListElement: MAIN_NAVIGATION.map((item, index) => ({
      '@type': 'SiteNavigationElement',
      position: index + 1,
      name: item.name,
      url: item.url,
    })),
  }

  return (
    <>
      <JsonLd data={organization} />
      <JsonLd data={website} />
      <JsonLd data={navigation} />
    </>
  )
}

export function BreadcrumbJsonLd({ items }) {
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }

  return <JsonLd data={breadcrumb} />
}
