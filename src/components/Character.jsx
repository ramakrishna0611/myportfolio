import { useEffect, useRef } from 'react'
import { BOY, MAN, COLORS, GRID_W, GRID_H, pixels } from '../sprites.js'

const BOY_PX = pixels(BOY)
const MAN_PX = pixels(MAN)
const ease = t => 1 - Math.pow(1 - t, 3)

// seeded random so scrubbing the scroll back and forth replays the exact same morph
function rng(seed) {
  return () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296 }
}
const R = rng(7)
const PARTS = MAN_PX.map(p => {
  const from = BOY_PX[Math.floor(R() * BOY_PX.length)]
  const a = R() * Math.PI * 2, burst = 4 + R() * 7
  return { ...p, fx: from.x, fy: from.y, bx: from.x + Math.cos(a) * burst, by: from.y + Math.sin(a) * burst - 3, fc: COLORS[from.ch], d: R() * 0.3 }
})

/* Pixel character on a tiny canvas that CSS scales up with crisp pixels.
   morph: motion value 0 (boy) → 1 (man), usually tied to scroll.
   gulp:  ref holding the time until which the mouth stays open.
   look:  motion value -1..1, where the eyes point. */
export default function Character({ morph, gulp, look, className = '' }) {
  const ref = useRef(null)

  useEffect(() => {
    const ctx = ref.current.getContext('2d')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let frame = 0

    const sprite = (px, dy, { open, blink, eye }) => {
      for (const p of px) {
        let ch = p.ch
        if (ch === 'E') ch = 'S'
        ctx.fillStyle = COLORS[ch]
        ctx.fillRect(p.x, p.y + dy, 1, 1)
      }
      if (!blink) {
        ctx.fillStyle = COLORS.E
        px.filter(p => p.ch === 'E').forEach(p => ctx.fillRect(p.x + eye, p.y + dy, 1, 1))
      }
      if (open) {
        const m = px.filter(p => p.ch === 'M')
        ctx.fillStyle = '#14151a'
        m.forEach(p => ctx.fillRect(p.x, p.y + dy, 1, 2))
      }
    }

    const loop = now => {
      ctx.clearRect(0, 0, GRID_W, GRID_H)
      const m = typeof morph?.get === 'function' ? morph.get() : morph || 0
      const bob = reduce ? 0 : Math.floor(now / 520) % 2 ? -1 : 0
      const blink = !reduce && now % 4200 < 130
      const eye = Math.round(Math.max(-1, Math.min(1, look?.get?.() ?? 0)) * 0.6) // -1, 0 or 1 pixel
      const open = gulp?.current > now

      if (m <= 0.001) sprite(BOY_PX, open ? 1 : bob, { open, blink, eye })
      else if (m >= 0.999) sprite(MAN_PX, bob, { open: false, blink, eye })
      else {
        for (const p of PARTS) {
          const t = Math.min(1, Math.max(0, (m - p.d) / 0.7))
          let x, y
          if (t < 0.4) { const k = ease(t / 0.4); x = p.fx + (p.bx - p.fx) * k; y = p.fy + (p.by - p.fy) * k }
          else { const k = ease((t - 0.4) / 0.6); x = p.bx + (p.x - p.bx) * k; y = p.by + (p.y - p.by) * k }
          ctx.globalAlpha = 0.7 + 0.3 * t
          ctx.fillStyle = t < 0.65 ? p.fc : COLORS[p.ch]
          ctx.fillRect(Math.round(x), Math.round(y), 1, 1)
        }
        ctx.globalAlpha = 1
      }
      frame = requestAnimationFrame(loop)
    }
    frame = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(frame)
  }, [morph, gulp, look])

  return <canvas ref={ref} width={GRID_W} height={GRID_H} className={className} style={{ imageRendering: 'pixelated' }} aria-hidden="true" />
}
