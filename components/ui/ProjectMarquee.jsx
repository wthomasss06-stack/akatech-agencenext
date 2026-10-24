'use client'
// components/ui/ProjectMarquee.jsx
// Bandeau d'images des réalisations (webp des projets) — version « prête à
// poser » de SpotlightMarquee : aperçus PC sur grand écran, images
// `-responsive` sur mobile, projets les plus récents d'abord.
import SpotlightMarquee from './SpotlightMarquee'
import { PROJECTS } from '@/lib/data'
import { getMarqueeImages } from '@/lib/project-media'

const RECENT_FIRST = [...PROJECTS].sort((a, b) => b.id - a.id)
const DESKTOP = getMarqueeImages(RECENT_FIRST)
const MOBILE = getMarqueeImages(RECENT_FIRST, { mobile: true })

export default function ProjectMarquee(props) {
  return <SpotlightMarquee images={DESKTOP} mobileImages={MOBILE} {...props} />
}
