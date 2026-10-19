// app/projects/[slug]/page.js
// Page de détail d'une réalisation : /projects/<slug>
//
// Composant serveur : le HTML complet (titre, problème, solution, fonctions…)
// est livré aux moteurs de recherche, sans dépendre d'un rendu côté client.
// L'affichage et les animations sont dans ProjectDetailClient.js.
import { notFound } from 'next/navigation'
import { PROJECTS, getProjectBySlug, getRelatedProjects } from '@/lib/data'
import { BreadcrumbJsonLd } from '../../seo/StructuredData'
import ProjectDetailClient from './ProjectDetailClient'

const SITE_URL = 'https://akatech.vercel.app'

// Seules les réalisations connues existent : un slug inconnu renvoie une 404.
export const dynamicParams = false

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }))
}

export function generateMetadata({ params }) {
  const project = getProjectBySlug(params.slug)
  if (!project) return { title: 'Réalisation introuvable' }

  const rubric = project.category?.label
  const title = rubric ? `${project.title} — ${rubric}` : project.title
  const description = project.story?.pitch || project.desc
  const url = `${SITE_URL}/projects/${project.slug}`

  return {
    title,
    description,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      title: `${title} | AKATech`,
      description,
      url,
      type: 'website',
      locale: 'fr_CI',
      siteName: 'AKATech',
      images: [{ url: project.img, alt: `Aperçu du site ${project.title}` }],
    },
    twitter: { card: 'summary_large_image', title: `${title} | AKATech`, description, images: [project.img] },
  }
}

export default function ProjectDetailPage({ params }) {
  const project = getProjectBySlug(params.slug)
  if (!project) notFound()

  const index = PROJECTS.findIndex((p) => p.id === project.id)
  const total = PROJECTS.length
  const prev = PROJECTS[(index - 1 + total) % total]
  const next = PROJECTS[(index + 1) % total]
  const url = `${SITE_URL}/projects/${project.slug}`

  // Schema aligné sur ce que la page affiche (voir ProjectDetailClient.js) :
  // nom, description courte, image, année, rubrique. Rien d'inventé.
  const workJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    description: project.story?.pitch || project.desc,
    image: project.img,
    url,
    dateCreated: project.year,
    ...(project.category ? { genre: project.category.label } : {}),
    inLanguage: 'fr',
    creator: { '@type': 'Organization', name: 'AKATech', url: SITE_URL },
  }

  // Seuls les champs affichés partent vers le client (payload léger).
  const view = {
    slug: project.slug,
    title: project.title,
    desc: project.desc,
    img: project.img,
    imgMobile: project.imgMobile || null,
    url: project.url || null,
    live: !!project.live,
    year: project.year,
    progress: project.progress ?? null,
    problem: project.problem || null,
    solution: project.solution || null,
    category: project.category ? { slug: project.category.slug, label: project.category.label } : null,
    story: project.story || null,
  }
  const related = getRelatedProjects(project, 3).map((p) => ({
    slug: p.slug,
    title: p.title,
    img: p.img,
    pitch: p.story?.pitch || p.desc,
    category: p.category?.label || null,
    sameCategory: !!project.category && p.category?.slug === project.category.slug,
  }))

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(workJsonLd) }} />
      <BreadcrumbJsonLd
        items={[
          { name: 'Accueil', url: `${SITE_URL}/` },
          { name: 'Réalisations', url: `${SITE_URL}/projects` },
          { name: project.title, url },
        ]}
      />
      <ProjectDetailClient
        project={view}
        related={related}
        prev={{ slug: prev.slug, title: prev.title }}
        next={{ slug: next.slug, title: next.title }}
      />
    </>
  )
}
