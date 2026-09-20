'use client'
import { LANGUAGES, useLanguage } from '@/lib/language'

export default function LanguageToggle() {
  const { language, setLanguage, t } = useLanguage()

  return (
    <div className="aka-language-toggle" title={t('language')}>
      <select
        value={language}
        onChange={event => setLanguage(event.target.value)}
        aria-label={t('language')}
        style={{
          background: '#c6ff3d',
          color: '#050505',
          border: '2px solid #050505',
          borderRadius: '999px',
          boxShadow: '2px 2px 0 #050505',
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '0.62rem',
          fontWeight: 800,
          width: '42px',
          minWidth: '42px',
          height: '28px',
          padding: '0 6px',
          textAlign: 'center',
          textAlignLast: 'center',
          appearance: 'none',
          WebkitAppearance: 'none',
          MozAppearance: 'none',
          outline: 'none',
          cursor: 'pointer',
        }}
      >
        {LANGUAGES.map(item => (
          <option key={item.code} value={item.code} style={{ background: '#0f1712', color: '#f3f9f0' }}>
            {item.label}
          </option>
        ))}
      </select>
    </div>
  )
}
