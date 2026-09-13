import Link from 'next/link'

const styles = {
  shell: {
    minHeight: '100vh',
    padding: 'clamp(7rem, 13vw, 11rem) 5% 7rem',
    background: 'var(--bg-dark)',
  },
  inner: { maxWidth: 920, margin: '0 auto' },
  eyebrow: {
    color: 'var(--g1)',
    fontSize: '.72rem',
    letterSpacing: '.16em',
    textTransform: 'uppercase',
    marginBottom: '1rem',
  },
  title: {
    color: 'var(--text-main)',
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: 'clamp(2.4rem, 7vw, 5.5rem)',
    lineHeight: 1,
    letterSpacing: '-.06em',
    marginBottom: '1.5rem',
  },
  intro: {
    color: 'var(--text-sub)',
    maxWidth: 680,
    fontSize: '1rem',
    lineHeight: 1.8,
    marginBottom: '4rem',
  },
  grid: { display: 'grid', gap: '1rem' },
  section: {
    background: 'var(--bg-dark-card)',
    border: '1px solid var(--border)',
    borderRadius: 16,
    padding: 'clamp(1.25rem, 3vw, 2rem)',
  },
  heading: {
    color: 'var(--text-main)',
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: '1.3rem',
    marginBottom: '.9rem',
  },
  text: {
    color: 'var(--text-sub)',
    lineHeight: 1.8,
    fontSize: '.9rem',
    marginBottom: '.75rem',
  },
  list: {
    color: 'var(--text-sub)',
    lineHeight: 1.8,
    fontSize: '.9rem',
    paddingLeft: '1.25rem',
    marginBottom: '.75rem',
  },
  link: { color: 'var(--g1)', textDecoration: 'underline' },
  back: {
    display: 'inline-block',
    color: 'var(--g1)',
    fontSize: '.8rem',
    marginTop: '2.5rem',
  },
}

function renderBlock(block, index) {
  if (block.type === 'list') {
    return (
      <ul key={index} style={styles.list}>
        {block.items.map((item) => <li key={item}>{item}</li>)}
      </ul>
    )
  }

  return <p key={index} style={styles.text}>{block.text}</p>
}

export default function LegalPage({ eyebrow, title, intro, sections }) {
  return (
    <main style={styles.shell}>
      <div style={styles.inner}>
        <div style={styles.eyebrow}>{eyebrow}</div>
        <h1 style={styles.title}>{title}</h1>
        <p style={styles.intro}>{intro}</p>
        <div style={styles.grid}>
          {sections.map((section) => (
            <section key={section.title} style={styles.section}>
              <h2 style={styles.heading}>{section.title}</h2>
              {section.blocks.map(renderBlock)}
            </section>
          ))}
        </div>
        <Link href="/" style={styles.back}>← Retour à l'accueil</Link>
      </div>
    </main>
  )
}
