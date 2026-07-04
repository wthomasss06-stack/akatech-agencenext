'use client'
/**
 * ProjectsTunnel — mode Explorer AKATech
 * ─────────────────────────────────────────────────────────
 * Port du tunnel WebGL "Mes projets" (App.jsx / elvis-portfolio) :
 * débris texturés avec les images des 18 projets AKATech, poussière
 * d'étoiles + étoiles filantes, raycasting pour le survol/clic.
 * Reskinné en vert AKATech (#88ca53), données 100% lib/data.js.
 *
 * ── Différences volontaires vs la version portfolio ──
 * 1. Pas de ScrollTrigger `pin:true`. Le pin GSAP reparente la
 *    section dans un `.pin-spacer` que React ne voit jamais, ce qui
 *    provoque un crash "removeChild" au démontage (changement de
 *    route). À la place : `position: sticky` en CSS pur (zéro
 *    mutation DOM) + ScrollTrigger utilisé uniquement pour lire la
 *    progression du scroll (sans pin), la caméra est pilotée à la
 *    main dans la boucle d'animation.
 * 2. Boucle réellement infinie : la profondeur de la caméra est
 *    calculée en continu puis "wrappée" (modulo) sur la longueur
 *    d'un cycle — le tunnel des 18 projets se répète en boucle
 *    tant qu'on scrolle, sans jamais s'arrêter.
 * 3. Particules réduites à 9 000 (au lieu de 22 000) pour rester
 *    fluide sur un plus large éventail de machines.
 * ─────────────────────────────────────────────────────────
 */
import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowLeft } from 'lucide-react'
import { PROJECTS } from '@/lib/data'
import { useBlobTransition } from '@/components/layout/BlobTransition'
import ProjectModal from './ProjectModal'
import './ProjectsTunnel.css'

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger)

const ACCENT_A = 0x88ca53 // vert AKATech
const ACCENT_B = 0x4fe0a8 // vert-cyan complémentaire, reste dans la famille de la marque
const SECTION_VH = 500    // hauteur du wrapper scrollable (5 écrans)
const LOOP_CYCLES = 4     // nombre de répétitions du tunnel sur ces 500vh

export default function ProjectsTunnel() {
  const blobNavigate = useBlobTransition()
  const outerRef = useRef(null)
  const sectionRef = useRef(null)
  const containerRef = useRef(null)
  const titleRef = useRef(null)
  const [selectedProject, setSelectedProject] = useState(null)
  const [hoveredProject, setHoveredProject] = useState(null)
  const selectedRef = useRef(null)
  const hoveredRef = useRef(null)
  useEffect(() => { selectedRef.current = selectedProject }, [selectedProject])

  useEffect(() => {
    const outer = outerRef.current
    const container = containerRef.current
    if (!outer || !container) return

    let width = container.clientWidth
    let height = container.clientHeight

    const scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2(0x030806, 0.00028)

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 5000)
    camera.position.z = 0

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.2
    container.appendChild(renderer.domElement)

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.25)
    scene.add(ambientLight)

    const movingLight = new THREE.PointLight(ACCENT_A, 10, 2200)
    movingLight.position.set(0, 0, -200)
    scene.add(movingLight)

    /* ── Textures : les captures des 18 projets AKATech ── */
    const textureLoader = new THREE.TextureLoader()
    const projectTextures = PROJECTS.map(p => {
      const tex = textureLoader.load(p.img)
      tex.generateMipmaps = true
      tex.minFilter = THREE.LinearMipmapLinearFilter
      if ('colorSpace' in tex) tex.colorSpace = THREE.SRGBColorSpace
      return tex
    })

    const vertexShader = `
      varying vec2 vUv;
      uniform float uTime;
      uniform float uDistortion;
      void main() {
        vUv = uv;
        vec3 pos = position;
        float wave = sin(pos.y * 0.03 + uTime * 1.6) * cos(pos.x * 0.03 + uTime * 1.6) * uDistortion;
        pos.z += wave * 15.0;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `

    const fragmentShader = `
      varying vec2 vUv;
      uniform sampler2D uTexture;
      uniform float uTime;
      uniform vec3 uColorGlow;
      void main() {
        float shift = 0.006 * sin(uTime * 3.0);
        float r = texture2D(uTexture, vUv + vec2(shift, 0.0)).r;
        float g = texture2D(uTexture, vUv).g;
        float b = texture2D(uTexture, vUv - vec2(shift, 0.0)).b;
        vec3 finalColor = vec3(r, g, b);
        float scanline = sin(vUv.y * 200.0 + uTime * 5.0) * 0.03;
        finalColor += vec3(scanline) + (uColorGlow * 0.1);
        gl_FragColor = vec4(finalColor, 1.0);
      }
    `

    const CARD_W = 345
    const CARD_H = 225
    const geometry = new THREE.PlaneGeometry(CARD_W, CARD_H, 20, 20)

    const debrisGroup = new THREE.Group()
    const meshObjects = []

    const ITEMS_PER_PROJECT = 2
    const ITEMS_PER_LOOP = PROJECTS.length * ITEMS_PER_PROJECT
    const SPACING = 52
    const LOOP_LENGTH = ITEMS_PER_LOOP * SPACING

    // Construit une boucle complète de la séquence des 18 projets.
    // Appelée deux fois (loopIndex 0 et 1) : la caméra "wrappe" ensuite
    // entre les deux pour un tunnel qui semble infini.
    function buildLoop(loopIndex) {
      for (let i = 0; i < ITEMS_PER_LOOP; i++) {
        const globalIndex = loopIndex * ITEMS_PER_LOOP + i
        const projIndex = i % PROJECTS.length
        const proj = PROJECTS[projIndex]
        const tex = projectTextures[projIndex]

        const material = new THREE.ShaderMaterial({
          vertexShader,
          fragmentShader,
          uniforms: {
            uTexture: { value: tex },
            uTime: { value: 0 },
            uDistortion: { value: 0.4 },
            uColorGlow: { value: new THREE.Color(globalIndex % 2 === 0 ? ACCENT_A : ACCENT_B) },
          },
          side: THREE.DoubleSide,
        })

        const mesh = new THREE.Mesh(geometry, material)
        mesh.userData.project = proj

        const angle = Math.random() * Math.PI * 2
        const radius = 320 + Math.random() * 260
        mesh.position.x = Math.cos(angle) * radius
        mesh.position.y = Math.sin(angle) * radius
        mesh.position.z = -(loopIndex * LOOP_LENGTH) - i * SPACING

        mesh.lookAt(0, 0, mesh.position.z)
        mesh.rotation.z += Math.random() * 0.2

        debrisGroup.add(mesh)
        meshObjects.push(mesh)
      }
    }

    buildLoop(0)
    buildLoop(1)
    scene.add(debrisGroup)

    const TOTAL_LENGTH = LOOP_LENGTH * 2
    const VIRTUAL_DEPTH = TOTAL_LENGTH * LOOP_CYCLES

    /* ── Nuage de particules : tailles/couleurs variées + twinkle shader ── */
    const particleCount = 9000
    const particleGeo = new THREE.BufferGeometry()
    const starPositions = new Float32Array(particleCount * 3)
    const starSizes = new Float32Array(particleCount)
    const starPhases = new Float32Array(particleCount)
    const starColors = new Float32Array(particleCount * 3)

    const STAR_WHITE = new THREE.Color(0xffffff)
    const STAR_GREEN = new THREE.Color(0xbfe8a0)
    const STAR_AMBER = new THREE.Color(0xffe9c2)

    for (let i = 0; i < particleCount; i++) {
      const pAngle = Math.random() * Math.PI * 2
      const pRadius = Math.random() * 700
      starPositions[i * 3] = Math.cos(pAngle) * pRadius
      starPositions[i * 3 + 1] = Math.sin(pAngle) * pRadius
      // Champ étalé sur un cycle complet (+ marge) : la caméra ne
      // voit jamais deux fois la même zone d'étoiles au même endroit
      // du cycle, aucun "saut" perceptible lors du wrap des cartes.
      starPositions[i * 3 + 2] = -Math.random() * (TOTAL_LENGTH + 500)

      starSizes[i] = 0.7 + Math.random() * 2.1
      starPhases[i] = Math.random() * Math.PI * 2

      const tint = Math.random()
      const c = tint < 0.78 ? STAR_WHITE : tint < 0.9 ? STAR_GREEN : STAR_AMBER
      starColors[i * 3] = c.r
      starColors[i * 3 + 1] = c.g
      starColors[i * 3 + 2] = c.b
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3))
    particleGeo.setAttribute('aSize', new THREE.BufferAttribute(starSizes, 1))
    particleGeo.setAttribute('aPhase', new THREE.BufferAttribute(starPhases, 1))
    particleGeo.setAttribute('aColor', new THREE.BufferAttribute(starColors, 3))

    const starVertexShader = `
      attribute float aSize;
      attribute float aPhase;
      attribute vec3 aColor;
      varying float vTwinkle;
      varying vec3 vColor;
      uniform float uTime;
      void main() {
        vColor = aColor;
        vTwinkle = 0.5 + 0.5 * sin(uTime * (0.6 + aPhase * 0.15) + aPhase * 6.2831);
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = aSize * (320.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `
    const starFragmentShader = `
      varying float vTwinkle;
      varying vec3 vColor;
      void main() {
        float d = length(gl_PointCoord - vec2(0.5));
        float alpha = smoothstep(0.5, 0.05, d);
        gl_FragColor = vec4(vColor * (0.55 + vTwinkle * 0.7), alpha * (0.4 + vTwinkle * 0.6));
      }
    `
    const starMaterial = new THREE.ShaderMaterial({
      vertexShader: starVertexShader,
      fragmentShader: starFragmentShader,
      uniforms: { uTime: { value: 0 } },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
    const starField = new THREE.Points(particleGeo, starMaterial)
    scene.add(starField)

    /* ── Étoiles filantes : trait + tête lumineuse, cycle spawn aléatoire ── */
    const SHOOTING_STAR_COUNT = 6
    const shootingStars = []
    for (let s = 0; s < SHOOTING_STAR_COUNT; s++) {
      const lineGeo = new THREE.BufferGeometry()
      lineGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(6), 3))
      const lineMat = new THREE.LineBasicMaterial({
        color: 0xffffff, transparent: true, opacity: 0,
        blending: THREE.AdditiveBlending, depthWrite: false,
      })
      const line = new THREE.Line(lineGeo, lineMat)
      scene.add(line)

      const headGeo = new THREE.BufferGeometry()
      headGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(3), 3))
      const headMat = new THREE.PointsMaterial({
        color: 0xffffff, size: 7, transparent: true, opacity: 0,
        sizeAttenuation: true, blending: THREE.AdditiveBlending, depthWrite: false,
      })
      const head = new THREE.Points(headGeo, headMat)
      scene.add(head)

      shootingStars.push({
        line, head, active: false, life: 0, maxLife: 0.6,
        pos: new THREE.Vector3(), vel: new THREE.Vector3(),
        nextSpawn: 1 + Math.random() * 4,
      })
    }

    function spawnShootingStar(s) {
      const camZ = camera.position.z
      s.pos.set(
        (Math.random() - 0.5) * 1100,
        200 + Math.random() * 500,
        camZ - 500 - Math.random() * 1400
      )
      const dir = new THREE.Vector3(
        (Math.random() - 0.5) * 0.6 - 0.3,
        -1 - Math.random() * 0.3,
        (Math.random() - 0.5) * 0.4
      ).normalize()
      s.vel.copy(dir).multiplyScalar(1500 + Math.random() * 1000)
      s.maxLife = 0.45 + Math.random() * 0.35
      s.life = 0
      s.active = true
    }

    /* ── Suivi souris amorti ── */
    let mouseX = 0
    let mouseY = 0
    let targetCameraX = 0
    let targetCameraY = 0
    const handleMouseMove = e => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1
      mouseY = -(e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('mousemove', handleMouseMove)

    /* ── Clic sur une carte → ouvre le modal projet (raycasting) ── */
    const raycaster = new THREE.Raycaster()
    const pointer = new THREE.Vector2()
    const getPointerNDC = e => {
      const rect = container.getBoundingClientRect()
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
    }
    const handleClick = e => {
      if (selectedRef.current) return
      getPointerNDC(e)
      raycaster.setFromCamera(pointer, camera)
      const hits = raycaster.intersectObjects(meshObjects, false)
      if (hits.length) {
        const proj = hits[0].object.userData.project
        if (proj) setSelectedProject(proj)
      }
    }
    const handlePointerMove = e => {
      getPointerNDC(e)
      raycaster.setFromCamera(pointer, camera)
      const hits = raycaster.intersectObjects(meshObjects, false)
      const hitProj = hits.length ? hits[0].object.userData.project : null
      container.style.cursor = hitProj ? 'pointer' : 'default'
      const hitId = hitProj ? hitProj.id : null
      if (hoveredRef.current !== hitId) {
        hoveredRef.current = hitId
        setHoveredProject(hitProj)
      }
    }
    const handlePointerLeave = () => {
      if (hoveredRef.current !== null) {
        hoveredRef.current = null
        setHoveredProject(null)
      }
      container.style.cursor = 'default'
    }
    container.addEventListener('click', handleClick)
    container.addEventListener('pointermove', handlePointerMove)
    container.addEventListener('pointerleave', handlePointerLeave)

    /* ── Progression du scroll (SANS pin) : `position: sticky` gère
       le maintien visuel en CSS pur, ScrollTrigger sert uniquement
       à lire `self.progress` sur la grande section wrapper. ── */
    const scrollProgressRef = { current: 0 }
    const scrollST = ScrollTrigger.create({
      trigger: outer,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: self => { scrollProgressRef.current = self.progress },
    })

    /* ── Boucle d'animation ── */
    const clock = new THREE.Clock()
    let lastT = 0
    let rafId
    function animate() {
      rafId = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()
      const dt = Math.min(t - lastT, 0.05)
      lastT = t

      // Caméra pilotée par le scroll, wrappée pour une boucle infinie
      const rawDepth = scrollProgressRef.current * VIRTUAL_DEPTH
      const targetZ = -(rawDepth % TOTAL_LENGTH)
      const jump = Math.abs(targetZ - camera.position.z)
      if (jump > TOTAL_LENGTH * 0.5) {
        camera.position.z = targetZ // on vient de wrapper : saut propre, pas de lerp
      } else {
        camera.position.z += (targetZ - camera.position.z) * 0.12
      }

      // Le titre "NOS PROJETS" s'efface dès que le scroll démarre
      if (titleRef.current) {
        titleRef.current.style.opacity = String(Math.max(0, 1 - scrollProgressRef.current * VIRTUAL_DEPTH / (TOTAL_LENGTH * 0.12)))
      }

      meshObjects.forEach(mesh => {
        mesh.material.uniforms.uTime.value = t
        mesh.rotation.z += 0.0015
      })

      starMaterial.uniforms.uTime.value = t
      starField.rotation.z = t * 0.015

      shootingStars.forEach(s => {
        if (!s.active) {
          s.nextSpawn -= dt
          if (s.nextSpawn <= 0) spawnShootingStar(s)
          return
        }
        s.life += dt
        const p = s.life / s.maxLife
        s.pos.addScaledVector(s.vel, dt)
        const tail = s.pos.clone().addScaledVector(s.vel, -0.045)

        const linePos = s.line.geometry.attributes.position
        linePos.setXYZ(0, s.pos.x, s.pos.y, s.pos.z)
        linePos.setXYZ(1, tail.x, tail.y, tail.z)
        linePos.needsUpdate = true

        const headPos = s.head.geometry.attributes.position
        headPos.setXYZ(0, s.pos.x, s.pos.y, s.pos.z)
        headPos.needsUpdate = true

        const fade = p < 0.15 ? p / 0.15 : p > 0.7 ? Math.max(0, (1 - p) / 0.3) : 1
        s.line.material.opacity = fade * 0.85
        s.head.material.opacity = fade

        if (p >= 1) {
          s.active = false
          s.nextSpawn = 2 + Math.random() * 6
          s.line.material.opacity = 0
          s.head.material.opacity = 0
        }
      })

      targetCameraX = mouseX * 45
      targetCameraY = mouseY * 45
      camera.position.x += (targetCameraX - camera.position.x) * 0.05
      camera.position.y += (targetCameraY - camera.position.y) * 0.05
      camera.lookAt(new THREE.Vector3(camera.position.x * 0.5, camera.position.y * 0.5, camera.position.z - 200))

      movingLight.position.z = camera.position.z - 150

      renderer.render(scene, camera)
    }
    animate()

    const handleResize = () => {
      width = container.clientWidth
      height = container.clientHeight
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    }
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
      container.removeEventListener('click', handleClick)
      container.removeEventListener('pointermove', handlePointerMove)
      container.removeEventListener('pointerleave', handlePointerLeave)
      scrollST.kill()
      geometry.dispose()
      meshObjects.forEach(mesh => mesh.material.dispose())
      projectTextures.forEach(tex => tex.dispose())
      particleGeo.dispose()
      starMaterial.dispose()
      shootingStars.forEach(s => {
        s.line.geometry.dispose(); s.line.material.dispose()
        s.head.geometry.dispose(); s.head.material.dispose()
      })
      renderer.dispose()
      // Défensif : si le nœud a déjà été retiré (démontage React en
      // cours), on avale l'erreur plutôt que de laisser planter la page.
      try {
        if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement)
      } catch (err) { /* no-op */ }
    }
  }, [])

  const handleBack = (e) => blobNavigate('/', e)

  return (
    <div ref={outerRef} className="pt-outer" style={{ height: `${SECTION_VH}vh` }}>
      <section ref={sectionRef} className="pt-section">
        <button className="pt-back-btn" onClick={handleBack} type="button">
          <ArrowLeft size={13} /> Retour au site
        </button>

        <div className="pt-section-label">
          <span className="pt-eyebrow">Mode Explorer</span>
          <span className="pt-count">{PROJECTS.length} réalisations — boucle infinie</span>
        </div>

        <div ref={containerRef} className="pt-webgl-container" />

        <div className="pt-ui-overlay">
          <h2 ref={titleRef} className="pt-ui-title">NOS PROJETS</h2>
          <h2 className={'pt-hover-title' + (hoveredProject ? ' is-visible' : '')}>
            {hoveredProject ? hoveredProject.title : ''}
          </h2>
        </div>

        <div className="pt-hint">
          <strong>Scrollez</strong> pour traverser le tunnel · <strong>Cliquez</strong> sur un projet pour le découvrir
        </div>

        {selectedProject && (
          <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
        )}
      </section>
    </div>
  )
}
