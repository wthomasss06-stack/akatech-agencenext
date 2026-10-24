'use client'
// components/ui/HoverRevealList.jsx
// Liste « hover reveal image » (réf. TRES_MINIMALISM.html) : au survol d'une
// ligne, une image en couleur suit le curseur (GSAP quickTo).
//
// items : [{ id, title, desc?, tag?, img, href? }]
// theme : { text, muted, line, accent } (couleurs du thème courant)
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import gsap from 'gsap'
import './HoverRevealList.css'

export default function HoverRevealList({ items, theme = {}, className = '' }) {
  const floatRef = useRef(null)
  const listRef = useRef(null)
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  useEffect(() => {
    if (!mounted) return undefined
    const el = floatRef.current
    const list = listRef.current
    if (!el || !list) return undefined

    const xTo = gsap.quickTo(el, 'left', { duration: 0.4, ease: 'power3' })
    const yTo = gsap.quickTo(el, 'top', { duration: 0.4, ease: 'power3' })
    const onMove = (e) => {
      xTo(e.clientX)
      yTo(e.clientY)
    }
    list.addEventListener('mousemove', onMove)

    // Précharge les images pour que la première révélation soit instantanée
    items.forEach((it) => {
      if (it.img) {
        const im = new window.Image()
        im.src = it.img
      }
    })

    const show = (img) => {
      if (!img) return
      el.style.backgroundImage = `url("${img}")`
      gsap.to(el, { opacity: 1, scale: 1, duration: 0.4, ease: 'power2.out', overwrite: 'auto' })
    }
    const hide = () => gsap.to(el, { opacity: 0, scale: 0.8, duration: 0.3, ease: 'power2.in', overwrite: 'auto' })

    const rows = Array.from(list.querySelectorAll('[data-img]'))
    const handlers = rows.map((row) => {
      const enter = () => show(row.getAttribute('data-img'))
      row.addEventListener('mouseenter', enter)
      row.addEventListener('mouseleave', hide)
      row.addEventListener('focusin', enter)
      row.addEventListener('focusout', hide)
      return { row, enter }
    })

    return () => {
      list.removeEventListener('mousemove', onMove)
      handlers.forEach(({ row, enter }) => {
        row.removeEventListener('mouseenter', enter)
        row.removeEventListener('mouseleave', hide)
        row.removeEventListener('focusin', enter)
        row.removeEventListener('focusout', hide)
      })
      gsap.killTweensOf(el)
    }
  }, [items, mounted])

  const vars = {
    '--hrl-line': theme.line,
    '--hrl-muted': theme.muted,
    '--hrl-accent': theme.accent,
    color: theme.text,
  }

  return (
    <>
      <ul ref={listRef} className={`hrl ${className}`.trim()} style={vars}>
        {items.map((it, i) => {
          const inner = (
            <>
              <span className="hrl-num">{String(i + 1).padStart(2, '0')}</span>
              <span>
                <span className="hrl-title">{it.title}</span>
                {it.desc && <span className="hrl-desc">{it.desc}</span>}
              </span>
              {it.tag && <span className="hrl-tag">{it.tag}</span>}
            </>
          )
          return (
            <li className="hrl-row" key={it.id ?? i} data-img={it.img}>
              {it.href ? (
                <Link href={it.href} className="hrl-link">{inner}</Link>
              ) : (
                <div className="hrl-static">{inner}</div>
              )}
            </li>
          )
        })}
      </ul>
      {/* Portail : « position: fixed » reste ancré au viewport même si un parent a un transform */}
      {mounted && createPortal(<div ref={floatRef} className="hrl-float" aria-hidden="true" />, document.body)}
    </>
  )
}
