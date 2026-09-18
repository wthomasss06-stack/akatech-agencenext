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
      >
        {LANGUAGES.map(item => (
          <option key={item.code} value={item.code}>
            {item.label}
          </option>
        ))}
      </select>
    </div>
  )
}
