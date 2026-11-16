import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js'
import { nodes } from '../data.js'

/* ---------------- the neural network the camera travels through ---------------- */

// entry point just outside the brain, then one soma per node, winding away into the dark
const ENTRY = [0, 0.2, 3.6]
const NODE_POS = [[0.5, 0, 0], [4, 1.5, -5], [-2.5, -1, -10], [3, 2, -15.5], [-3.5, 0.5, -21], [2.5, -1.8, -26.5], [-1.5, 1.5, -32], [0.8, 0, -37.5]]
const ease = t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v))

function rng(seed) {
  return () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296 }
}

/* branching dendrites: a random walk that forks, thinning out as it goes */
function dendrites(R, origin, count, reach, out, bright) {
  const grow = (p, dir, len, depth) => {
    const steps = Math.floor(len / 0.11)
    let cur = p.clone(), d = dir.clone()
    for (let s = 0; s < steps; s++) {
      d.add(new THREE.Vector3(R() - 0.5, R() - 0.5, R() - 0.5).multiplyScalar(0.55)).normalize()
      const next = cur.clone().addScaledVector(d, 0.11)
      const fade = (1 - s / steps) * (1 - depth * 0.24) * bright
      out.pos.push(cur.x, cur.y, cur.z, next.x, next.y, next.z)
      out.col.push(0.9 * fade, 0.36 * fade, 0.45 * fade, 0.9 * fade * 0.8, 0.36 * fade * 0.8, 0.45 * fade * 0.8)
      cur = next
      if (depth < 3 && R() < 0.07) grow(cur, d.clone().add(new THREE.Vector3(R() - 0.5, R() - 0.5, R() - 0.5)).normalize(), len * (0.45 + R() * 0.3), depth + 1)
    }
  }
  for (let i = 0; i < count; i++) {
    const dir = new THREE.Vector3(R() - 0.5, R() - 0.5, R() - 0.5).normalize()
    grow(origin.clone().addScaledVector(dir, 0.25), dir, reach * (0.6 + R() * 0.6), 0)
  }
}

function glowTexture(inner, outer) {
  const c = document.createElement('canvas'); c.width = c.height = 128
  const g = c.getContext('2d'), grd = g.createRadialGradient(64, 64, 0, 64, 64, 64)
  grd.addColorStop(0, inner); grd.addColorStop(0.22, outer); grd.addColorStop(1, 'rgba(0,0,0,0)')
  g.fillStyle = grd; g.fillRect(0, 0, 128, 128)
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t
}

function buildNetwork(scene, small) {
  const R = rng(42)
  const group = new THREE.Group(); scene.add(group)
  const somaPts = NODE_POS.map(p => new THREE.Vector3(...p))
  const path = new THREE.CatmullRomCurve3([new THREE.Vector3(...ENTRY), ...somaPts], false, 'centripetal')

  // dendrite forest: rich around each node, plus dimmer neurons scattered around the route
  const out = { pos: [], col: [] }
  somaPts.forEach(p => dendrites(R, p, small ? 9 : 14, 2.6, out, 1))
  const extra = small ? 26 : 46
  const extraPts = []
  for (let i = 0; i < extra; i++) {
    const t = R(), base = path.getPoint(t)
    const off = new THREE.Vector3(R() - 0.5, R() - 0.5, R() - 0.5).multiplyScalar(14)
    if (off.length() < 3.5) off.setLength(3.5 + R() * 2)
    const p = base.add(off); extraPts.push(p)
    dendrites(R, p, small ? 5 : 8, 1.8, out, 0.55)
  }
  const dg = new THREE.BufferGeometry()
  dg.setAttribute('position', new THREE.Float32BufferAttribute(out.pos, 3))
  dg.setAttribute('color', new THREE.Float32BufferAttribute(out.col, 3))
  const dMat = new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false })
  group.add(new THREE.LineSegments(dg, dMat))

  // somas: the node bodies and their halos
  const halo = glowTexture('rgba(255,236,240,1)', 'rgba(232,110,128,.55)')
  const haloOn = glowTexture('rgba(255,255,255,1)', 'rgba(116,216,196,.7)')
  const somaGeo = new THREE.SphereGeometry(0.16, 24, 16)
  const somas = somaPts.map(p => {
    const core = new THREE.Mesh(somaGeo, new THREE.MeshBasicMaterial({ color: 0xffd6dc, transparent: true, opacity: 0 }))
    core.position.copy(p); group.add(core)
    const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: halo, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending }))
    glow.position.copy(p); glow.scale.setScalar(1.3); group.add(glow)
    return { core, glow }
  })
  const smallSoma = new THREE.SphereGeometry(0.1, 12, 8)
  const smallMat = new THREE.MeshBasicMaterial({ color: 0xe88a98, transparent: true, opacity: 0 })
  extraPts.forEach(p => { const m = new THREE.Mesh(smallSoma, smallMat); m.position.copy(p); group.add(m) })

  // the axon: a chain of teal beads that lights up behind the camera's travel
  const N = Math.round(path.getLength() / 0.22)
  const bead = new THREE.CylinderGeometry(0.03, 0.03, 0.12, 8); bead.rotateX(Math.PI / 2)
  const beadMat = new THREE.MeshBasicMaterial({ color: 0x8fe6d4, transparent: true, opacity: 0 })
  const beads = new THREE.InstancedMesh(bead, beadMat, N)
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), fwd = new THREE.Vector3(0, 0, 1), one = new THREE.Vector3(1, 1, 1)
  for (let i = 0; i < N; i++) { const u = i / (N - 1); q.setFromUnitVectors(fwd, path.getTangent(u)); m4.compose(path.getPoint(u), q, one); beads.setMatrixAt(i, m4) }
  beads.computeBoundingSphere(); beads.frustumCulled = false; beads.count = 0
  group.add(beads)

  // signals running along the axon
  const pulses = Array.from({ length: 4 }, (_, i) => {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: haloOn, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending }))
    s.scale.setScalar(0.32); s.userData.off = i / 4; group.add(s); return s
  })

  // far dust for depth
  const dust = new THREE.BufferGeometry(), dp = []
  for (let i = 0; i < (small ? 900 : 1800); i++) dp.push((R() - 0.5) * 40, (R() - 0.5) * 26, 6 - R() * 52)
  dust.setAttribute('position', new THREE.Float32BufferAttribute(dp, 3))
  const dustMat = new THREE.PointsMaterial({ color: 0xc9b8c0, size: 0.04, transparent: true, opacity: 0, depthWrite: false })
  group.add(new THREE.Points(dust, dustMat))

  return { path, somas, somaPts, beads, beadMat, N, dMat, smallMat, pulses, dustMat, haloOn, halo }
}

/* ---------------- component ---------------- */

export default function Brain({ onNode, lobeAnchors, labelRefs }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const small = window.innerWidth < 768
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, small ? 1.5 : 1.75))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.3
    const bg = new THREE.Color('#121315')
    renderer.setClearColor(bg)
    const scene = new THREE.Scene()
    scene.fog = new THREE.Fog(bg, 9, 32)
    const camera = new THREE.PerspectiveCamera(35, 1, 0.05, 120)

    // studio lighting for the brain
    scene.add(new THREE.HemisphereLight(0xfff1ea, 0x1a1418, 0.7))
    const key = new THREE.DirectionalLight(0xffe2d6, 3); key.position.set(4, 6, 8); scene.add(key)
    const rim = new THREE.DirectionalLight(0x8fa8ff, 1.6); rim.position.set(-6, 2, -6); scene.add(rim)
    const fill = new THREE.DirectionalLight(0xffffff, 0.4); fill.position.set(-4, -3, 6); scene.add(fill)

    const net = buildNetwork(scene, small)
    const brainRoot = new THREE.Group(); scene.add(brainRoot)
    let brainMats = [], anchors = []

    const loader = new GLTFLoader(); loader.setMeshoptDecoder(MeshoptDecoder)
    loader.load('/models/brain.glb', gltf => {
      const model = gltf.scene
      const box = new THREE.Box3().setFromObject(model), size = box.getSize(new THREE.Vector3()), center = box.getCenter(new THREE.Vector3())
      const s = 4.6 / Math.max(size.x, size.y, size.z)
      model.position.sub(center).multiplyScalar(s); model.scale.setScalar(s)
      model.traverse(o => {
        if (!o.isMesh) return
        const m = new THREE.MeshPhysicalMaterial({ vertexColors: !!o.geometry.attributes.color, color: o.geometry.attributes.color ? 0xffffff : 0xd9928c, roughness: 0.42, clearcoat: 0.35, clearcoatRoughness: 0.5, sheen: 0.4, sheenColor: new THREE.Color(0xffb9b0), transparent: true })
        o.material = m; brainMats.push(m)
      })
      brainRoot.add(model)
      // lobe anchors: points on the surface towards the front, top, side and back
      brainRoot.updateMatrixWorld(true)
      const dirs = lobeAnchors.map(d => new THREE.Vector3(...d).normalize())
      const best = dirs.map(() => ({ score: -Infinity, p: new THREE.Vector3() }))
      const v = new THREE.Vector3()
      model.traverse(o => {
        if (!o.isMesh) return
        const pos = o.geometry.attributes.position
        for (let i = 0; i < pos.count; i += 7) {
          v.fromBufferAttribute(pos, i).applyMatrix4(o.matrixWorld)
          dirs.forEach((d, k) => { const sc = v.dot(d); if (sc > best[k].score) { best[k].score = sc; best[k].p.copy(v) } })
        }
      })
      anchors = best.map(b => brainRoot.worldToLocal(b.p.clone()))
    })

    // ---------- scroll timeline, read from the page's sections ----------
    let marks = null
    const measure = () => {
      const get = id => { const el = document.getElementById(id); if (!el) return null; const r = el.getBoundingClientRect(); return { top: r.top + window.scrollY, h: el.offsetHeight } }
      marks = { head: get('head'), dive: get('dive'), nodes: nodes.map(n => get(`n-${n.id}`)) }
    }
    const resize = () => {
      const w = window.innerWidth, h = window.innerHeight
      renderer.setSize(w, h, false)
      camera.aspect = w / h; camera.fov = w < 768 ? 48 : 35; camera.updateProjectionMatrix()
      heroCam.set(0, 0.4, w < 768 ? 18 : 14.5)
      measure()
    }
    const heroCam = new THREE.Vector3(0, 0.4, 13), heroLook = new THREE.Vector3(0, 0, 0)
    resize()
    window.addEventListener('resize', resize)
    const ro = new ResizeObserver(measure); ro.observe(document.body)

    const camPos = new THREE.Vector3().copy(heroCam), look = new THREE.Vector3(), tmp = new THREE.Vector3(), up = new THREE.Vector3(0, 1, 0)
    const pathPose = (t, outPos, outLook) => {
      const p = net.path.getPoint(t), tan = net.path.getTangent(t)
      const side = new THREE.Vector3().crossVectors(tan, up).normalize()
      outPos.copy(p).addScaledVector(tan, -5.8).addScaledVector(up, 1.7).addScaledVector(side, 1.5)
      outLook.copy(net.path.getPoint(clamp(t + 0.015)))
    }
    let tCur = 0, lastNode = -2, frame = 0, offX = 0, offY = 0, rot = 0, zCur = heroCam.z
    const startPos = new THREE.Vector3(), startLook = new THREE.Vector3()
    pathPose(0, startPos, startLook)
    const K = nodes.length

    // fit the brain into the free space under a block of copy (and between the lobe label columns)
    const rect = id => { const r = document.getElementById(id)?.getBoundingClientRect(); return r && r.height ? r : null }
    const fitBox = (copyId, aspect, w, vh) => {
      const c = rect(copyId); if (!c) return null
      const top = c.bottom + 20, grid = rect('lobe-grid'), bottom = grid ? grid.top - 16 : vh - 24
      const L = rect('lobe-l'), R = rect('lobe-r')
      const maxW = L && R ? R.left - L.right - 60 : w * 0.88
      const px = Math.max(110, Math.min(bottom - top, maxW / aspect, vh * 0.6))
      // the brain's height on screen is roughly K / z of the viewport height (K measured at fov 35)
      const K = 8.8 * Math.tan(THREE.MathUtils.degToRad(17.5)) / Math.tan(THREE.MathUtils.degToRad(camera.fov / 2))
      return { z: Math.min(32, Math.max(8, K * vh / px)), ty: -((top + bottom) / 2 - vh / 2) / vh }
    }

    const loop = now => {
      frame = requestAnimationFrame(loop)
      if (!marks?.dive) { measure(); return }
      const y = window.scrollY, vh = window.innerHeight, w = window.innerWidth
      const headP = clamp((y - marks.head.top + vh * 0.3) / (marks.head.h))
      const diveP = clamp((y - marks.dive.top + vh * 0.5) / marks.dive.h)

      // which node section are we in, and how far along it
      let node = -1, travel = 0
      marks.nodes.forEach((m, i) => { if (m && y + vh * 0.5 >= m.top) { node = i; travel = clamp((y + vh * 0.5 - m.top) / (m.h * 0.45)) } })
      const tTarget = node < 0 ? 0 : ((node + ease(travel)) / K)
      tCur += (tTarget - tCur) * 0.09

      // brain: rotates in the opening, swells and dissolves as we dive in
      // free spin on the cover; side-on and nearly still while the lobe labels are up
      const SIDE = Math.PI / 2
      if (headP < 0.05 && diveP <= 0) rot += 0.0035
      else { const target = SIDE + (headP - 0.5) * 0.35, near = target + Math.PI * 2 * Math.round((rot - target) / (Math.PI * 2)); rot += (near - rot) * 0.05 }
      brainRoot.rotation.set(0.12, rot, 0)
      const dissolve = clamp((diveP - 0.3) / 0.5)
      brainRoot.scale.setScalar(1 + ease(clamp(diveP / 0.85)) * 1.6)
      brainMats.forEach(m => { m.opacity = 1 - dissolve; m.depthWrite = dissolve < 0.5 })
      brainRoot.visible = dissolve < 0.999

      // the network fades in once we're inside
      const inside = clamp((diveP - 0.45) / 0.45)
      net.dMat.opacity = inside * 0.85; net.smallMat.opacity = inside * 0.8; net.dustMat.opacity = inside * 0.5
      net.beadMat.opacity = inside
      net.beads.count = Math.max(0, Math.floor(tCur * net.N))
      net.somas.forEach((s, i) => {
        const reached = node >= i && travel > 0.85 || node > i
        s.core.material.opacity = inside
        s.glow.material.opacity = inside * (node === i && travel > 0.85 ? 0.8 : reached ? 0.45 : 0.3)
        s.glow.material.map = node === i && travel > 0.85 ? net.haloOn : net.halo
        const pulse = node === i ? 1 + Math.sin(now * 0.004) * 0.12 : 1
        s.glow.scale.setScalar((node === i ? 1.9 : 1.2) * pulse)
      })
      net.pulses.forEach(p => {
        const u = clamp(tCur + ((now * 0.00008 + p.userData.off) % 1) * 0.12)
        p.position.copy(net.path.getPoint(u)); p.material.opacity = inside * 0.7
      })

      // camera: orbit pose in the opening, blend into the axon path while diving
      pathPose(clamp(tCur), tmp, look)
      const k = ease(clamp(diveP / 0.95))
      const cover = headP < 0.05 && diveP <= 0
      const box = diveP <= 0 ? (cover ? fitBox('hero-copy', 0.85, w, vh) : fitBox('head-copy', 1.3, w, vh)) : null
      if (box) zCur += (box.z - zCur) * 0.08
      heroCam.z = zCur
      camPos.lerpVectors(heroCam, startPos, k)
      if (node >= 0 || diveP >= 0.999) camPos.copy(tmp)
      else look.lerpVectors(heroLook, startLook, k)
      camera.position.lerp(camPos, 0.12)
      camera.lookAt(look)

      // shift the picture: brain centred under the copy, centred between the lobe labels, then left of the info panel
      const tx = w < 768 || diveP <= 0 ? 0 : diveP < 0.5 ? 0.16 : 0.14
      const ty = box ? box.ty : w < 768 ? 0.2 : 0
      offX += (tx - offX) * 0.06; offY += (ty - offY) * 0.06
      camera.setViewOffset(w, vh, w * offX, vh * offY, w, vh)
      camera.updateProjectionMatrix()

      // HTML labels that follow 3D points: lobes in the opening, node names inside
      if (labelRefs?.current) {
        const { lobeDots, nodeTags } = labelRefs.current
        anchors.forEach((a, i) => {
          const el = lobeDots?.[i]; if (!el) return
          tmp.copy(a).applyMatrix4(brainRoot.matrixWorld).project(camera)
          el.style.transform = `translate(${(tmp.x + 1) / 2 * w}px, ${(1 - tmp.y) / 2 * vh}px)`
          el.dataset.x = (tmp.x + 1) / 2 * w; el.dataset.y = (1 - tmp.y) / 2 * vh
        })
        net.somaPts.forEach((p, i) => {
          const el = nodeTags?.[i]; if (!el) return
          tmp.copy(p).project(camera)
          const d = camera.position.distanceTo(p)
          const show = inside > 0.5 && tmp.z < 1 && d < 16 && Math.abs(tmp.x) < 1 && Math.abs(tmp.y) < 1 && i !== node
          el.style.transform = `translate(${(tmp.x + 1) / 2 * w}px, ${(1 - tmp.y) / 2 * vh}px) translate(-50%, -150%)`
          el.style.opacity = show ? String(clamp(1.2 - d / 16)) : '0'
        })
      }

      const active = node >= 0 && travel > 0.85 ? node : -1
      if (active !== lastNode) { lastNode = active; onNode(active) }
      renderer.render(scene, camera)
    }
    frame = requestAnimationFrame(loop)

    return () => { cancelAnimationFrame(frame); window.removeEventListener('resize', resize); ro.disconnect(); renderer.dispose() }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 h-full w-full" aria-hidden="true" />
}
