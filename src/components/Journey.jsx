import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react'
import * as THREE from 'three'
import { journey } from '../data.js'
import { ChapterTitle } from './ui.jsx'

/* ---------- terrain height: a few octaves of value noise ---------- */
function hash(x, y) { const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453; return s - Math.floor(s) }
function vnoise(x, y) {
  const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi
  const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf)
  const a = hash(xi, yi), b = hash(xi + 1, yi), c = hash(xi, yi + 1), d = hash(xi + 1, yi + 1)
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v
}
const height = (x, z) => {
  let h = 0, amp = 1, f = 0.09
  for (let o = 0; o < 4; o++) { h += vnoise(x * f + 11, z * f - 7) * amp; amp *= 0.5; f *= 2.1 }
  return (h - 0.9) * 2.6
}

// where the stops sit on the land (x, z); the path runs from the near edge into the distance
const STOP_XZ = [[-3, 30], [4, 20], [-2.5, 10], [4.5, 0], [-3.5, -10], [2.5, -20], [0, -30]]

const terrainVert = /* glsl */`
  varying float vH; varying vec2 vXZ; varying float vDist;
  void main() {
    vH = position.y; vXZ = position.xz;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vDist = -mv.z;
    gl_Position = projectionMatrix * mv;
  }`
const terrainFrag = /* glsl */`
  precision highp float;
  varying float vH; varying vec2 vXZ; varying float vDist;
  uniform vec3 uBg; uniform float uTime;
  float h21(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float n2(vec2 p){ vec2 i = floor(p), f = fract(p); vec2 u = f*f*(3.0-2.0*f);
    return mix(mix(h21(i), h21(i+vec2(1,0)), u.x), mix(h21(i+vec2(0,1)), h21(i+vec2(1,1)), u.x), u.y); }
  void main() {
    vec3 col = vec3(0.085, 0.09, 0.105) + vH * 0.012;
    // topographic contour lines
    float k = vH * 3.2;
    float c = abs(fract(k - 0.5) - 0.5) / max(fwidth(k), 1e-4);
    col += vec3(0.62, 0.6, 0.56) * (1.0 - min(c, 1.0)) * 0.2;
    // veins: thin ridges of a noise field, brightest in the valleys
    vec2 q = vXZ + vec2(n2(vXZ * 0.3), n2(vXZ * 0.3 + 5.0)) * 2.5; // warp so the lines meander like streams
    float r1 = abs(n2(q * 0.16 + 3.1) - 0.5);
    float r2 = abs(n2(q * 0.38 - 8.2) - 0.5);
    float r3 = abs(n2(q * 0.8 + 1.7) - 0.5);
    float vein = (1.0 - smoothstep(0.0, fwidth(r1) * 1.2 + 0.004, r1))
               + 0.7 * (1.0 - smoothstep(0.0, fwidth(r2) * 1.1 + 0.003, r2)) * smoothstep(0.55, 0.3, n2(q * 0.11))
               + 0.45 * (1.0 - smoothstep(0.0, fwidth(r3) + 0.002, r3)) * smoothstep(0.6, 0.35, n2(q * 0.21 + 2.0));
    float valley = smoothstep(0.6, -0.8, vH);
    col += vec3(0.88, 0.3, 0.38) * min(vein, 1.2) * (0.3 + 0.7 * valley) * 0.85;
    float fog = smoothstep(12.0, 42.0, vDist);
    gl_FragColor = vec4(mix(col, uBg, fog), 1.0);
  }`

function glowTexture(color) {
  const c = document.createElement('canvas'); c.width = c.height = 64
  const g = c.getContext('2d'), grd = g.createRadialGradient(32, 32, 0, 32, 32, 32)
  grd.addColorStop(0, 'rgba(255,255,255,1)'); grd.addColorStop(0.25, color); grd.addColorStop(1, 'rgba(0,0,0,0)')
  g.fillStyle = grd; g.fillRect(0, 0, 64, 64)
  return new THREE.CanvasTexture(c)
}

function buildScene(canvas, small) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: 'high-performance' })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, small ? 1.5 : 1.75))
  renderer.outputColorSpace = THREE.SRGBColorSpace
  const bg = new THREE.Color('#121315')
  renderer.setClearColor(bg)
  const scene = new THREE.Scene()
  scene.fog = new THREE.Fog(bg, 14, 44)
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 120)

  scene.add(new THREE.HemisphereLight(0xb8c6ff, 0x0a0a0c, 0.9))
  const sun = new THREE.DirectionalLight(0xffffff, 1.1); sun.position.set(-6, 12, 6); scene.add(sun)

  // terrain
  const seg = small ? [90, 200] : [150, 330]
  const geo = new THREE.PlaneGeometry(44, 84, seg[0], seg[1]); geo.rotateX(-Math.PI / 2)
  const pos = geo.attributes.position
  for (let i = 0; i < pos.count; i++) pos.setY(i, height(pos.getX(i), pos.getZ(i)))
  geo.computeVertexNormals()
  const terrainMat = new THREE.ShaderMaterial({ vertexShader: terrainVert, fragmentShader: terrainFrag, uniforms: { uBg: { value: bg }, uTime: { value: 0 } } })
  scene.add(new THREE.Mesh(geo, terrainMat))

  // the route through the stops
  const pts = STOP_XZ.map(([x, z]) => new THREE.Vector3(x, height(x, z) + 0.28, z))
  const curve = new THREE.CatmullRomCurve3(pts, false, 'centripetal')

  // voxel fields on the far sides of the land, like blocks of memory
  const box = new THREE.BoxGeometry(0.4, 0.4, 0.4)
  const voxMat = new THREE.MeshStandardMaterial({ color: 0x3550d8, emissive: 0x1c2fa0, emissiveIntensity: 0.7, roughness: 0.45, metalness: 0.1 })
  const vox = []
  const route = Array.from({ length: 41 }, (_, i) => curve.getPoint(i / 40)) // sampled once
  for (let x = -21; x <= 21; x += 0.5) for (let z = -40; z <= 40; z += 0.5) {
    let d = Infinity
    for (const p of route) d = Math.min(d, Math.hypot(p.x - x, p.z - z))
    const field = vnoise(x * 0.14 + 40, z * 0.14 - 9)
    const edge = (d - 7) / 5 + (field - 0.5) * 1.6
    if (edge > 0.15 && hash(x, z) < (small ? 0.5 : 0.85)) vox.push([x, height(x, z) + 0.2 + Math.min(1.2, edge) * 0.35 * hash(z, x), z])
  }
  const voxMesh = new THREE.InstancedMesh(box, voxMat, vox.length)
  const m4 = new THREE.Matrix4()
  vox.forEach((v, i) => { m4.makeTranslation(v[0], v[1], v[2]); voxMesh.setMatrixAt(i, m4) })
  scene.add(voxMesh)

  // the path, drawn as a chain of glowing beads
  const N = Math.round(curve.getLength() / 0.3) // one bead every 0.3 units, with a gap between
  const bead = new THREE.CylinderGeometry(0.12, 0.12, 0.2, 12); bead.rotateX(Math.PI / 2)
  const beadMat = new THREE.MeshStandardMaterial({ color: 0x9fe9d8, emissive: 0x3fb59d, emissiveIntensity: 0.9, roughness: 0.35 })
  const beads = new THREE.InstancedMesh(bead, beadMat, N)
  const q = new THREE.Quaternion(), fwd = new THREE.Vector3(0, 0, 1), sc = new THREE.Vector3(1, 1, 1)
  const ground = u => { const p = curve.getPoint(u); p.y = height(p.x, p.z) + 0.2; return p }
  for (let i = 0; i < N; i++) {
    const u = i / (N - 1), p = ground(u), t = ground(Math.min(1, u + 0.002)).sub(ground(Math.max(0, u - 0.002))).normalize()
    q.setFromUnitVectors(fwd, t); m4.compose(p, q, sc); beads.setMatrixAt(i, m4)
  }
  beads.computeBoundingSphere() // bounds of the full path, before it is hidden
  beads.frustumCulled = false
  beads.count = 0
  scene.add(beads)

  // stop markers: a thin beam and a glow
  const glowTex = glowTexture('rgba(116,216,196,.55)')
  const stops = pts.map(p => {
    const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 1.6, 6), new THREE.MeshBasicMaterial({ color: 0x9fe9d8, transparent: true, opacity: 0.35 }))
    beam.position.set(p.x, height(p.x, p.z) + 1, p.z); scene.add(beam)
    const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0.25 }))
    glow.position.set(p.x, height(p.x, p.z) + 0.3, p.z); glow.scale.setScalar(0.9); scene.add(glow)
    return { beam, glow }
  })
  const head = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }))
  head.scale.setScalar(1.1); scene.add(head)

  return { renderer, scene, camera, curve, ground, beads, N, stops, head, pts, dispose: () => { renderer.dispose(); geo.dispose(); box.dispose(); bead.dispose() } }
}

export default function Journey() {
  const sectionRef = useRef(null)
  const canvasRef = useRef(null)
  const labelRefs = useRef([])
  const world = useRef(null)
  const prog = useRef(0)
  const [active, setActive] = useState(-1)
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] })
  useMotionValueEvent(scrollYProgress, 'change', v => { prog.current = v })

  useEffect(() => {
    const canvas = canvasRef.current
    const small = window.innerWidth < 768
    const w = buildScene(canvas, small)
    world.current = w
    const camPos = new THREE.Vector3(), look = new THREE.Vector3(), tmp = new THREE.Vector3()
    let t = 0, frame = 0, running = false, last = -2

    const resize = () => {
      const r = canvas.parentElement.getBoundingClientRect()
      w.renderer.setSize(r.width, r.height, false)
      w.camera.aspect = r.width / r.height
      w.camera.fov = r.width < 768 ? 50 : 38
      if (r.width >= 768) w.camera.setViewOffset(r.width, r.height, r.width * 0.14, 0, r.width, r.height)
      else w.camera.clearViewOffset()
      w.camera.updateProjectionMatrix()
    }
    resize()
    const ro = new ResizeObserver(resize); ro.observe(canvas.parentElement)

    const n = w.pts.length
    const render = () => {
      // ease the journey towards the scroll position
      const target = Math.min(1, Math.max(0, (prog.current - 0.04) / 0.9))
      t += (target - t) * 0.08
      const p = w.ground(t)
      w.beads.count = Math.max(1, Math.floor(t * w.N))
      w.head.position.copy(p)
      const off = window.innerWidth < 768 ? [0, 11, 11] : [4, 9.5, 11.5]
      camPos.set(p.x * 0.5 + off[0], p.y + off[1], p.z + off[2])
      if (!w._init) { w.camera.position.copy(camPos); w._init = true }
      w.camera.position.lerp(camPos, 0.1)
      look.copy(w.ground(Math.min(1, t + 0.05))); look.y -= 1
      w.camera.lookAt(look)

      // stops light up once the path reaches them; labels follow their markers on screen
      let reached = -1
      const rect = canvas.getBoundingClientRect()
      const reachedNow = w.pts.reduce((r, _, i) => (t >= i / (n - 1) - 0.002 ? i : r), -1)
      w.pts.forEach((sp, i) => {
        const on = t >= i / (n - 1) - 0.002
        if (on) reached = i
        w.stops[i].glow.material.opacity = on ? 0.9 : 0.18
        w.stops[i].beam.material.opacity = on ? 0.8 : 0.2
        const el = labelRefs.current[i]
        if (!el) return
        tmp.copy(sp); tmp.y += 1.7; tmp.project(w.camera)
        const visible = tmp.z < 1 && Math.abs(tmp.x) < 1.1 && Math.abs(tmp.y) < 1.1 && w.camera.position.distanceTo(sp) < 30
        el.style.transform = `translate(${((tmp.x + 1) / 2) * rect.width}px, ${((1 - tmp.y) / 2) * rect.height}px) translate(-50%, -100%)`
        el.style.opacity = visible && i === reachedNow ? '1' : '0'
      })
      if (reached !== last) { last = reached; setActive(reached) }
      w.renderer.render(w.scene, w.camera)
      if (running) frame = requestAnimationFrame(render)
    }
    // only render while the chapter is on screen
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !running) { running = true; frame = requestAnimationFrame(render) }
      else if (!e.isIntersecting) { running = false; cancelAnimationFrame(frame) }
    })
    io.observe(sectionRef.current)
    render()
    return () => { running = false; cancelAnimationFrame(frame); io.disconnect(); ro.disconnect(); w.dispose() }
  }, [])

  return (
    <section ref={sectionRef} id="journey" data-accent="#74d8c4" className="relative h-[520vh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />
        {/* stop labels on the map */}
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          {journey.map((s, i) => (
            <div key={s.id} ref={el => (labelRefs.current[i] = el)} className="absolute left-0 top-0 whitespace-nowrap rounded-sm bg-bg/70 px-1.5 py-0.5 font-mono text-[12px] text-ink transition-opacity duration-300" style={{ opacity: 0 }}>
              <span className="mr-1 text-teal">✦</span>{s.pin}
            </div>
          ))}
        </div>
        {/* chapter copy and timeline */}
        <div className="pointer-events-none absolute inset-x-0 top-0 bg-gradient-to-b from-bg via-bg/70 to-transparent px-6 pb-20 pt-24 sm:px-[max(2.5rem,calc((100vw-80rem)/2+2.5rem))]">
          <ChapterTitle title="How I got here" line="From a classroom in Hyderabad to AI agents in production." />
        </div>
        {/* the stop the path has reached, told in a panel on the right */}
        <aside className="absolute inset-x-4 bottom-4 md:inset-x-auto md:bottom-auto md:right-[max(2.5rem,calc((100vw-80rem)/2+2.5rem))] md:top-1/2 md:w-[380px] md:-translate-y-1/2"
          aria-live="polite">
          <div className="rounded-md border border-line bg-[#0f1012]/85 p-5 shadow-[0_30px_60px_-30px_rgba(0,0,0,.9)] backdrop-blur-sm md:p-7">
            <AnimatePresence mode="wait">
              {active < 0 ? (
                <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="font-mono text-[11.5px] text-teal">Stop 00 / {String(journey.length).padStart(2, '0')}</div>
                  <div className="mt-3 text-[22px] font-medium leading-snug">Keep scrolling to travel.</div>
                  <p className="mt-2 text-[14.5px] text-ink/65">The path only goes where I’ve been.</p>
                </motion.div>
              ) : (
                <motion.div key={journey[active].id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
                  <div className="flex items-center justify-between font-mono text-[11.5px]">
                    <span className="text-teal">Stop {String(active + 1).padStart(2, '0')} / {String(journey.length).padStart(2, '0')}</span>
                    <span className="text-muted">{journey[active].kind}</span>
                  </div>
                  <div className="mt-3 font-serif text-[clamp(1.35rem,2.2vw,1.75rem)] font-medium leading-tight">{journey[active].title}</div>
                  <div className="mt-2 text-[15px] text-ink/70">{journey[active].place}</div>
                  {journey[active].note && <div className="mt-4 border-l-2 border-teal pl-3 text-[14.5px] text-ink/90">{journey[active].note}</div>}
                  {journey[active].link && (
                    <a href={journey[active].link} className="mt-5 inline-flex items-center gap-1.5 font-mono text-[12.5px] text-ink/80 underline decoration-line underline-offset-[6px] hover:text-ink hover:decoration-ink">
                      {journey[active].kind.startsWith('Project') ? 'See the project' : 'Read more'} ↓
                    </a>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
            <div className="mt-6 flex gap-1.5" aria-hidden="true">
              {journey.map((s, i) => <span key={s.id} className={`h-1 flex-1 rounded-full transition-colors duration-500 ${i <= active ? 'bg-teal' : 'bg-line'}`} />)}
            </div>
          </div>
        </aside>
      </div>
    </section>
  )
}
