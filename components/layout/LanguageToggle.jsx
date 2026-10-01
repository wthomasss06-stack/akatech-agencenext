'use client'
import { useEffect, useState } from 'react'

/* Sélecteur de langue simple via la traduction Google du navigateur.
   Le site reste écrit en français ; le cookie `googtrans` + le script Google
   Translate traduisent la page à la volée. */

const LANGS = [
  { code: 'fr', label: 'FR', name: 'Français' },
  { code: 'en', label: 'EN', name: 'English' },
  { code: 'zh-CN', label: 'ZH', name: '中文' },
  { code: 'es', label: 'ES', name: 'Español' },
  { code: 'ar', label: 'AR', name: 'العربية' },
  { code: 'pt', label: 'PT', name: 'Português' },
]

function readLang() {
  const m = document.cookie.match(/(?:^|;\s*)googtrans=\/fr\/([\w-]+)/)
  return m && LANGS.some(l => l.code === m[1]) ? m[1] : 'fr'
}

function setCookie(value) {
  const host = window.location.hostname
  const expires = value ? '' : '; expires=Thu, 01 Jan 1970 00:00:00 GMT'
  const base = `googtrans=${value}; path=/${expires}`
  document.cookie = base
  document.cookie = `${base}; domain=${host}`
  if (host.split('.').length > 1) document.cookie = `${base}; domain=.${host}`
}

/* Google Translate modifie le DOM : on évite les erreurs React
   (removeChild / insertBefore sur des nœuds déplacés). */
function patchDomForTranslate() {
  if (window.__akaGtPatched) return
  window.__akaGtPatched = true
  const removeChild = Node.prototype.removeChild
  Node.prototype.removeChild = function (child) {
    if (child.parentNode !== this) return child
    return removeChild.apply(this, arguments)
  }
  const insertBefore = Node.prototype.insertBefore
  Node.prototype.insertBefore = function (node, ref) {
    if (ref && ref.parentNode !== this) return node
    return insertBefore.apply(this, arguments)
  }
}

function loadGoogleTranslate() {
  if (window.__akaGtLoading) return
  window.__akaGtLoading = true
  patchDomForTranslate()

  if (!document.getElementById('aka-gt-style')) {
    const style = document.createElement('style')
    style.id = 'aka-gt-style'
    style.textContent = `
      .goog-te-banner-frame, iframe.skiptranslate, #goog-gt-tt, .goog-tooltip, .goog-te-balloon-frame { display: none !important; }
      body { top: 0 !important; }
      .goog-text-highlight { background: none !important; box-shadow: none !important; }
      #aka-gt-holder { display: none; }
    `
    document.head.appendChild(style)
  }

  const holder = document.createElement('div')
  holder.id = 'aka-gt-holder'
  document.body.appendChild(holder)

  window.akaGoogleTranslateInit = () => {
    new window.google.translate.TranslateElement(
      { pageLanguage: 'fr', includedLanguages: LANGS.map(l => l.code).join(','), autoDisplay: false },
      'aka-gt-holder'
    )
  }
  const script = document.createElement('script')
  script.src = 'https://translate.google.com/translate_a/element.js?cb=akaGoogleTranslateInit'
  script.async = true
  document.body.appendChild(script)
}

export default function LanguageToggle() {
  const [lang, setLang] = useState('fr')

  useEffect(() => {
    const current = readLang()
    setLang(current)
    if (current !== 'fr') loadGoogleTranslate()
  }, [])

  const change = event => {
    const next = event.target.value
    setLang(next)
    setCookie(next === 'fr' ? '' : `/fr/${next}`)
    window.location.reload()
  }

  return (
    <div className="aka-language-toggle notranslate" translate="no" title="Langue / Language">
      <select value={lang} onChange={change} aria-label="Langue / Language">
        {LANGS.map(l => (
          <option key={l.code} value={l.code}>{l.label}</option>
        ))}
      </select>
    </div>
  )
}
