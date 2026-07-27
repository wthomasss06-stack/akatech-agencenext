'use client'

/**
 * AvatarGroup — adapté de @animate-ui/primitives-animate-avatar-group.
 * Version simplifiée pour AKATech : pas de backend Django, les images
 * viennent directement de /public (TESTIMONIALS dans lib/data.js), donc
 * le resolvePhoto() de la version Nexura d'origine n'a pas lieu d'être.
 */

import React, { useState } from 'react'

export function AvatarGroup({ children, className = '', max, spacing = -10 }) {
  const items = React.Children.toArray(children)
  const visible = max ? items.slice(0, max) : items
  const overflow = max && items.length > max ? items.length - max : 0

  return (
    <div className={`agp-group ${className}`} style={{ '--agp-spacing': `${spacing}px` }}>
      {visible.map((child, i) =>
        React.cloneElement(child, { key: i, _index: i })
      )}
      {overflow > 0 && (
        <div className="agp-overflow">+{overflow}</div>
      )}
      <style suppressHydrationWarning>{`
        .agp-group { display: flex; align-items: center; flex-direction: row; }
        .agp-group > * + * { margin-left: var(--agp-spacing, -10px); }

        .agp-avatar {
          position: relative;
          width: 34px; height: 34px;
          border-radius: 50%;
          border: 2.5px solid #030806;
          background: #0d1a11;
          flex-shrink: 0;
          cursor: pointer;
          transition: transform .22s cubic-bezier(.34,1.56,.64,1), z-index 0s;
          z-index: 1;
        }
        .agp-avatar:hover { transform: translateY(-5px) scale(1.1); z-index: 20; }

        .agp-img { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; display: block; }

        .agp-fallback {
          position: absolute; inset: 0;
          display: flex; align-items: center; justify-content: center;
          border-radius: 50%;
          font-size: 12px; font-weight: 800; color: #88ca53;
          background: linear-gradient(135deg, #0d1a11, #1a3d2d);
          font-family: 'Barlow Condensed', sans-serif; letter-spacing: -.02em;
        }

        .agp-tooltip-wrap {
          position: absolute; bottom: calc(100% + 10px); left: 50%;
          transform: translateX(-50%) translateY(4px);
          white-space: nowrap; z-index: 100; opacity: 0; pointer-events: none;
          transition: opacity .18s, transform .18s cubic-bezier(.34,1.56,.64,1);
        }
        .agp-avatar:hover .agp-tooltip-wrap { opacity: 1; transform: translateX(-50%) translateY(0); }
        .agp-tooltip-inner {
          background: #030806; border: 1px solid rgba(136,202,83,.35); border-radius: 8px;
          padding: 5px 10px; font-size: 11px; font-weight: 700; color: rgba(255,255,255,.9);
          font-family: 'JetBrains Mono', monospace; box-shadow: 0 8px 24px rgba(0,0,0,.4);
        }
        .agp-tooltip-arrow { position: absolute; bottom: -5px; left: 50%; transform: translateX(-50%); width: 10px; height: 5px; overflow: hidden; }
        .agp-tooltip-arrow::before {
          content: ''; position: absolute; width: 8px; height: 8px;
          background: #030806; border: 1px solid rgba(136,202,83,.35);
          transform: rotate(45deg); top: -4px; left: 50%; margin-left: -4px;
        }

        .agp-overflow {
          width: 34px; height: 34px; border-radius: 50%;
          border: 2.5px solid #030806; background: rgba(136,202,83,.2);
          display: flex; align-items: center; justify-content: center;
          font-size: 10px; font-weight: 800; color: #88ca53;
          font-family: 'JetBrains Mono', monospace;
          margin-left: var(--agp-spacing, -10px); flex-shrink: 0;
        }
      `}</style>
    </div>
  )
}

export function Avatar({ children, className = '', _index = 0 }) {
  const [imgError, setImgError] = useState(false)

  const processedChildren = React.Children.map(children, child => {
    if (!child) return null
    if (child.type === AvatarImage) {
      const hasSrc = !!child.props.src && !imgError
      return React.cloneElement(child, { onError: () => setImgError(true), hidden: !hasSrc })
    }
    if (child.type === AvatarFallback) {
      const hasSrc = React.Children.toArray(children).some(c => c?.type === AvatarImage && c?.props?.src)
      return React.cloneElement(child, { visible: imgError || !hasSrc })
    }
    return child
  })

  return (
    <div className={`agp-avatar ${className}`} style={{ zIndex: 10 + _index }}>
      {processedChildren}
    </div>
  )
}

export function AvatarImage({ src, alt = '', onError, hidden }) {
  if (hidden || !src) return null
  return <img src={src} alt={alt} className="agp-img" onError={onError} loading="lazy" />
}

export function AvatarFallback({ children, visible }) {
  return <div className="agp-fallback" style={{ opacity: visible ? 1 : 0 }}>{children}</div>
}

export function AvatarGroupTooltip({ children }) {
  return (
    <div className="agp-tooltip-wrap">
      <div className="agp-tooltip-inner">{children}</div>
    </div>
  )
}

export function AvatarGroupTooltipArrow() {
  return <div className="agp-tooltip-arrow" />
}
