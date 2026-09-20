'use client'
import Link from 'next/link'
import { useTheme } from '@/lib/theme'
import { useLanguage } from '@/lib/language'

function buildStyles(T) {
  return {
    shell: { minHeight: '100vh', padding: 'clamp(7rem, 13vw, 11rem) 5% 7rem', background: T.bg },
    inner: { maxWidth: 920, margin: '0 auto' },
    eyebrow: { color: T.green, fontSize: '.72rem', letterSpacing: '.16em', textTransform: 'uppercase', marginBottom: '1rem' },
    title: { color: T.textMain, fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(2.4rem, 7vw, 5.5rem)', lineHeight: 1, letterSpacing: '-.06em', marginBottom: '1.5rem' },
    intro: { color: T.textSub, maxWidth: 680, fontSize: '1rem', lineHeight: 1.8, marginBottom: '4rem' },
    grid: { display: 'grid', gap: '1rem' },
    section: { background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, padding: 'clamp(1.25rem, 3vw, 2rem)' },
    heading: { color: T.textMain, fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.3rem', marginBottom: '.9rem' },
    text: { color: T.textSub, lineHeight: 1.8, fontSize: '.9rem', marginBottom: '.75rem' },
    list: { color: T.textSub, lineHeight: 1.8, fontSize: '.9rem', paddingLeft: '1.25rem', marginBottom: '.75rem' },
    back: { display: 'inline-block', color: T.green, fontSize: '.8rem', marginTop: '2.5rem' },
  }
}

function renderBlock(block, index, styles) {
  if (block.type === 'list') return <ul key={index} style={styles.list}>{block.items.map((item) => <li key={item}>{item}</li>)}</ul>
  return <p key={index} style={styles.text}>{block.text}</p>
}

export default function LegalPage({ contentByLanguage }) {
  const T = useTheme()
  const { language, t } = useLanguage()
  const content = contentByLanguage[language] || contentByLanguage.fr
  const styles = buildStyles(T)
  return (
    <main style={styles.shell}>
      <div style={styles.inner}>
        <div style={styles.eyebrow}>{content.eyebrow}</div>
        <h1 style={styles.title}>{content.title}</h1>
        <p style={styles.intro}>{content.intro}</p>
        <div style={styles.grid}>{content.sections.map((section) => <section key={section.title} style={styles.section}><h2 style={styles.heading}>{section.title}</h2>{section.blocks.map((block, i) => renderBlock(block, i, styles))}</section>)}</div>
        <Link href="/" style={styles.back}>← {t('backToHome')}</Link>
      </div>
    </main>
  )
}
