import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'motion/react'
import { Bus } from './ui.jsx'

const ROAD_W = 26
const BUS_W = 84
const BUS_H = 42
const MIN_GUTTER = 92 // free space needed beside the content before the road is drawn

/* A road that leaves the hero street, runs down the page margin beside each section and
   swings across to the other side between sections. The bus drives along it with the scroll. */
export default function WindingRoad({ wrapRef, sections, heroId }) {
  const pathRef = useRef(null)
  const samples = useRef([])
  const [geo, setGeo] = useState(null)
  const geoRef = useRef(null)
  geoRef.current = geo

  // ---- build the path from where the sections actually are ----
  const measure = useCallback(() => {
    const wrap = wrapRef.current
    if (!wrap) return
    const wr = wrap.getBoundingClientRect()
    const els = sections.map(s => document.getElementById(s.id)).filter(Boolean)
    const scene = document.getElementById('hero-scene')
    if (!els.length || !scene) return
    const contentLeft = els[0].getBoundingClientRect().left - wr.left + 24
    if (contentLeft < MIN_GUTTER) { setGeo(null); return }
    const W = wr.width
    const laneL = contentLeft - Math.min(contentLeft / 2, 80)
    const laneR = W - laneL
    const sr = scene.getBoundingClientRect()
    const scale = Math.max(sr.width / 1440, sr.height / 240)
    const startY = sr.bottom - wr.top - 28 * scale // lower edge of the street

    const box = els.map(el => { const r = el.getBoundingClientRect(); return { top: r.top - wr.top, bottom: r.bottom - wr.top } })
    let x = laneL
    let d = `M ${x} ${startY}`
    const stops = []
    box.forEach((b, i) => {
      stops.push({ x, y: b.top + 96 + 14, side: x === laneL ? 'L' : 'R', n: i + 2, label: sections[i].label })
      if (i < box.length - 1) {
        const B = b.bottom
        const nx = x === laneL ? laneR : laneL
        d += ` L ${x} ${B - 70} C ${x} ${B} ${nx} ${B} ${nx} ${B + 70}`
        x = nx
      } else {
        d += ` L ${x} ${b.top + 220}`
      }
    })
    setGeo({ d, W, H: wr.height, stops, end: { x, y: box[box.length - 1].top + 220 } })
  }, [wrapRef, sections])

  useEffect(() => {
    let t
    const later = () => { clearTimeout(t); t = setTimeout(measure, 120) }
    measure()
    const ro = new ResizeObserver(later)
    if (wrapRef.current) ro.observe(wrapRef.current)
    window.addEventListener('resize', later)
    document.fonts?.ready.then(measure)
    return () => { ro.disconnect(); window.removeEventListener('resize', later); clearTimeout(t) }
  }, [measure, wrapRef])

  // ---- sample the path so a scroll position can be turned into a distance along it ----
  useLayoutEffect(() => {
    const p = pathRef.current
    if (!geo || !p) { samples.current = []; return }
    const L = p.getTotalLength()
    const out = []
    for (let l = 0; l <= L; l += 5) { const pt = p.getPointAtLength(l); out.push({ l, y: pt.y }) }
    samples.current = out
  }, [geo])

  const target = useMotionValue(0)
  const len = useSpring(target, { stiffness: 70, damping: 18, mass: 0.7 })
  const bx = useMotionValue(-200), by = useMotionValue(-200)
  const angle = useMotionValue(90), face = useMotionValue(1)
  const rot = useSpring(angle, { stiffness: 120, damping: 20 })
  const flip = useSpring(face, { stiffness: 300, damping: 30 })
  const [reached, setReached] = useState(0) // how many stops the bus has passed

  useEffect(() => {
    if (!geo) return
    const onScroll = () => {
      const s = samples.current
      if (!s.length || !wrapRef.current) return
      const wrapTop = wrapRef.current.getBoundingClientRect().top + window.scrollY
      const y = window.scrollY + window.innerHeight * 0.55 - wrapTop
      let lo = 0, hi = s.length - 1
      while (lo < hi) { const mid = (lo + hi) >> 1; if (s[mid].y < y) lo = mid + 1; else hi = mid }
      target.set(s[lo].l)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [geo, target, wrapRef])

  useEffect(() => len.on('change', l => {
    const p = pathRef.current
    if (!p) return
    const L = p.getTotalLength()
    const a = p.getPointAtLength(Math.max(0, Math.min(L, l)))
    const b = p.getPointAtLength(Math.max(0, Math.min(L, l + 6)))
    bx.set(a.x); by.set(a.y)
    const dx = b.x - a.x, dy = b.y - a.y
    if (Math.abs(dx) > 0.4) face.set(dx > 0 ? 1 : -1)
    // screen-space heading; a left-facing bus is drawn mirrored, so its nose points the other way
    const deg = face.get() > 0 ? Math.atan2(dy, dx) : Math.atan2(-dy, -dx)
    if (Math.hypot(dx, dy) > 0.1) angle.set((deg * 180) / Math.PI)
    setReached(geoRef.current ? geoRef.current.stops.filter(st => a.y >= st.y - 30).length : 0)
  }), [len, bx, by, angle, face])

  if (!geo) return null
  return (
    <div className="pointer-events-none absolute inset-0 z-0 hidden overflow-hidden min-[1200px]:block" aria-hidden="true">
      <svg width={geo.W} height={geo.H} className="absolute left-0 top-0">
        <path d={geo.d} fill="none" className="road-edge" strokeWidth={ROAD_W + 8} strokeLinecap="butt" strokeLinejoin="round" />
        <path ref={pathRef} d={geo.d} fill="none" className="road-base" strokeWidth={ROAD_W} strokeLinecap="butt" strokeLinejoin="round" />
        <path d={geo.d} fill="none" stroke="#fff" strokeOpacity=".5" strokeWidth="2" strokeDasharray="12 12" />
      </svg>

      {geo.stops.map(s => {
        const on = reached >= s.n - 1
        return (
          <div key={s.n} className="absolute flex flex-col items-center" style={{ left: s.x + (s.side === 'L' ? -44 : 44), top: s.y - 34, transform: 'translateX(-50%)' }}>
            <div className={`grid h-9 w-9 place-items-center rounded-full border-[3px] border-ink font-mono text-xs font-bold transition duration-300 ${on ? 'scale-110 bg-accent text-accent-ink shadow-[0_0_0_6px_rgba(255,194,26,.25)]' : 'bg-surface text-muted'}`}>
              {String(s.n).padStart(2, '0')}
            </div>
            <div className="h-8 w-1 bg-ink" />
          </div>
        )
      })}

      <div className="absolute flex flex-col items-center" style={{ left: geo.end.x, top: geo.end.y - 6, transform: 'translate(-50%, 0)' }}>
        <div className="rounded-md bg-ink px-2 py-1 font-mono text-[10px] font-bold tracking-widest text-accent">END</div>
      </div>

      <motion.div className="absolute left-0 top-0" style={{ x: bx, y: by, width: 0, height: 0 }}>
        <motion.div style={{ rotate: rot, width: BUS_W, height: BUS_H, marginLeft: -BUS_W / 2, marginTop: -BUS_H * 0.82, transformOrigin: '50% 82%' }}>
          <motion.div className="h-full w-full" style={{ scaleX: flip }}>
            <Bus className="block h-full w-full drop-shadow-[0_6px_6px_rgba(0,0,0,.25)]" />
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  )
}
