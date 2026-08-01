// lib/hoverImageChars.js
// Utilitaire partagé, indépendant du framework : au survol d'un conteneur
// dont le texte est déjà découpé en caractères (un <span> par lettre — un
// span par caractère, classe passée via charSelector), affiche une image
// flottante à côté du caractère le plus proche du curseur, choisie au
// hasard dans un pool. Port du helper équivalent du projet Chez Florence
// (voir hoverImageChars.ts), converti en JS pour ce projet (pas de TS ici :
// pas de tsconfig/jsconfig avec support .ts, cf. jsconfig.json → baseUrl
// seul). Généralisé à un nombre arbitraire de caractères et de lignes
// (distance 2D).
//
// Utilisation : appeler une fois le conteneur monté (et son texte déjà
// découpé en caractères), garder la fonction de nettoyage retournée pour
// la rappeler au démontage (return de cette fonction dans un useEffect).

export function wireHoverImageChars(container, charSelector, images) {
  if (!images.length) return () => {}
  const chars = Array.from(container.querySelectorAll(charSelector))
  if (!chars.length) return () => {}

  const img = document.createElement('img')
  img.className = 'hover-char-image'
  img.alt = ''
  img.setAttribute('aria-hidden', 'true')
  img.decoding = 'async'
  if (!container.style.position) container.style.position = 'relative'
  container.appendChild(img)

  let active = null

  function nearestChar(x, y) {
    let best = null
    let bestDist = Infinity
    for (const el of chars) {
      const r = el.getBoundingClientRect()
      const cx = r.left + r.width / 2
      const cy = r.top + r.height / 2
      const d = (cx - x) ** 2 + (cy - y) ** 2
      if (d < bestDist) { bestDist = d; best = el }
    }
    return best
  }

  function place(el) {
    const containerRect = container.getBoundingClientRect()
    const r = el.getBoundingClientRect()
    img.style.left = `${r.left - containerRect.left + r.width / 2}px`
    img.style.top = `${r.top - containerRect.top + r.height / 2}px`
  }

  function showAt(x, y) {
    const nearest = nearestChar(x, y)
    if (!nearest) return
    if (nearest !== active) {
      active = nearest
      img.src = images[Math.floor(Math.random() * images.length)]
      place(active)
    }
  }

  function onMouseEnter(e) {
    showAt(e.clientX, e.clientY)
    img.classList.add('is-active')
  }
  function onMouseMove(e) {
    showAt(e.clientX, e.clientY)
  }
  function onMouseLeave() {
    img.classList.remove('is-active')
    active = null
  }
  function onTouchStart(e) {
    const t = e.touches[0]
    if (!t) return
    showAt(t.clientX, t.clientY)
    img.classList.add('is-active')
    window.setTimeout(onMouseLeave, 900)
  }

  container.addEventListener('mouseenter', onMouseEnter)
  container.addEventListener('mousemove', onMouseMove)
  container.addEventListener('mouseleave', onMouseLeave)
  container.addEventListener('touchstart', onTouchStart, { passive: true })

  return () => {
    container.removeEventListener('mouseenter', onMouseEnter)
    container.removeEventListener('mousemove', onMouseMove)
    container.removeEventListener('mouseleave', onMouseLeave)
    container.removeEventListener('touchstart', onTouchStart)
    img.remove()
  }
}

// Variante « swap en place » — remplace wireHoverImageCharsByLetter
// (mousemove + image flottante partagée) par le mécanisme de la référence
// Effect 093 (reveal_hover_image_par_lettre.html) : CHAQUE caractère porte
// SA PROPRE <img> (rendue par le composant appelant, une fois pour toutes,
// pas créée ici) ; au survol de CE caractère précis, la lettre s'efface et
// SON image apparaît par-dessus, en place — pas d'image qui suit le
// curseur ni de calcul de distance. Le survol natif (:hover CSS, cf.
// FooterWordmark.css) gère toute l'animation ; ce module se contente de
// injecter une src aléatoire dans le pool AVANT que le survol ne
// s'affiche, et de précharger les pools en arrière-plan.
//
// Plus simple et plus rapide que la version précédente : plus de
// getBoundingClientRect() du tout dans le chemin chaud (survol), plus de
// nearestChar(), plus de cache à invalider au scroll/resize — le
// positionnement et la taille sont natifs (CSS, unités em), donc toujours
// justes sans JS.
//
// Structure DOM attendue par caractère (voir Footer.js → renderChars) :
//   <span class="hover-char">
//     <span class="hover-char-letter">A</span>
//     <img class="hover-char-image" alt="" aria-hidden="true" />
//   </span>
export function wireLetterHoverSwap(container, charSelector, letterPools) {
  const chars = Array.from(container.querySelectorAll(charSelector))
  if (!chars.length) return () => {}

  const cleanups = []

  chars.forEach((el) => {
    const letter = (el.textContent || '').trim().toUpperCase()
    const pool = letterPools[letter]
    const img = el.querySelector('.hover-char-image')
    if (!pool || !pool.length || !img) return // pas de pool dédié : pas d'effet sur ce caractère

    function pickRandom() {
      img.src = pool[Math.floor(Math.random() * pool.length)]
    }
    function onTouchStart() {
      pickRandom()
      el.classList.add('is-touched')
      window.setTimeout(() => el.classList.remove('is-touched'), 900)
    }

    el.addEventListener('mouseenter', pickRandom)
    el.addEventListener('touchstart', onTouchStart, { passive: true })
    cleanups.push(() => {
      el.removeEventListener('mouseenter', pickRandom)
      el.removeEventListener('touchstart', onTouchStart)
    })
  })

  // Préchargement paresseux : dès que le wordmark approche du viewport
  // (IntersectionObserver, marge 600px — pas au montage direct, pour ne
  // pas ajouter ~1 Mo de requêtes au chargement initial pour un visiteur
  // qui ne scrollera peut-être jamais jusqu'au footer), précharge toutes
  // les images de tous les pools en Image() mémoire (hors DOM). Le temps
  // que l'utilisateur repère le wordmark et survole une lettre, l'image
  // est déjà en cache navigateur.
  let preloaded = false
  function preloadPools() {
    if (preloaded) return
    preloaded = true
    const seen = new Set()
    for (const key in letterPools) {
      for (const src of letterPools[key]) {
        if (seen.has(src)) continue
        seen.add(src)
        const p = new Image()
        p.src = src
      }
    }
  }
  const io = (typeof IntersectionObserver !== 'undefined')
    ? new IntersectionObserver((entries) => {
        if (entries.some((e) => e.isIntersecting)) preloadPools()
      }, { rootMargin: '600px' })
    : null
  if (io) io.observe(container)
  else preloadPools() // navigateur sans IntersectionObserver : pas de gate

  return () => {
    cleanups.forEach((fn) => fn())
    if (io) io.disconnect()
  }
}
