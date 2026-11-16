import { useEffect, useImperativeHandle, useRef } from 'react'
import { BOY, MAN, COLORS, GRID_W, GRID_H, pixels } from '../sprites.js'

const BOY_PX = pixels(BOY)
const MAN_PX = pixels(MAN)
const ease = t => 1 - Math.pow(1 - t, 3)

/* Pixel character drawn on a tiny canvas that CSS scales up with crisp pixels.
   Parent controls it through ref: gulp() when a skill is swallowed, morph(done) to grow into the man. */
export default function Character({ ref, startAs = 'boy', className = '' }) {
  const canvasRef = useRef(null)
  const st = useRef({ mode: startAs, gulpUntil: 0, morphStart: 0, parts: null, onDone: null, flashUntil: 0 })

  useImperativeHandle(ref, () => ({
    gulp() { st.current.gulpUntil = performance.now() + 220 },
    morph(onDone) {
      const s = st.current
      // every pixel of the man starts at a random pixel of the boy and flies to its place
      s.parts = MAN_PX.map(p => {
        const from = BOY_PX[Math.floor(Math.random() * BOY_PX.length)]
        const angle = Math.random() * Math.PI * 2, burst = 4 + Math.random() * 7
        return { ...p, fx: from.x, fy: from.y, bx: from.x + Math.cos(angle) * burst, by: from.y + Math.sin(angle) * burst - 3, fc: COLORS[from.ch], d: Math.random() * 0.35 }
      })
      s.mode = 'morph'; s.morphStart = performance.now(); s.onDone = onDone
    },
    set(mode) { st.current.mode = mode },
  }))

  useEffect(() => {
    const ctx = canvasRef.current.getContext('2d')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let frame = 0

    const drawSprite = (px, dy, gulping, blink) => {
      for (const p of px) {
        let ch = p.ch
        if (blink && ch === 'E') ch = 'S'
        ctx.fillStyle = COLORS[ch]
        ctx.fillRect(p.x, p.y + dy, 1, 1)
      }
      if (gulping) { // open mouth
        const m = px.filter(p => p.ch === 'M')
        ctx.fillStyle = '#14151a'
        m.forEach(p => ctx.fillRect(p.x, p.y + dy, 1, 1))
        if (m.length) ctx.fillRect(m[0].x, m[0].y + dy + 1, m.length, 1)
      }
    }

    const loop = now => {
      const s = st.current
      ctx.clearRect(0, 0, GRID_W, GRID_H)
      const bob = reduce ? 0 : Math.floor(now / 480) % 2 === 0 ? 0 : -1
      const blink = !reduce && now % 3800 < 140
      const gulping = now < s.gulpUntil

      if (s.mode === 'boy') drawSprite(BOY_PX, gulping ? 1 : bob, gulping, blink)
      else if (s.mode === 'man') {
        drawSprite(MAN_PX, bob, false, blink)
        if (!reduce && Math.floor(now / 600) % 2) { ctx.fillStyle = '#ffffff'; MAN_PX.filter(p => p.ch === 'A').slice(0, 1).forEach(p => ctx.fillRect(p.x, p.y + bob, 1, 1)) }
      } else if (s.mode === 'morph') {
        const T = (now - s.morphStart) / 1500
        for (const p of s.parts) {
          const t = Math.min(1, Math.max(0, (T - p.d) / (1 - 0.35)))
          // two legs: burst outward, then fly to the target pixel
          let x, y
          if (t < 0.35) { const k = ease(t / 0.35); x = p.fx + (p.bx - p.fx) * k; y = p.fy + (p.by - p.fy) * k }
          else { const k = ease((t - 0.35) / 0.65); x = p.bx + (p.x - p.bx) * k; y = p.by + (p.y - p.by) * k }
          ctx.fillStyle = t < 0.6 ? p.fc : COLORS[p.ch]
          ctx.globalAlpha = 0.65 + 0.35 * t
          ctx.fillRect(Math.round(x), Math.round(y), 1, 1)
        }
        ctx.globalAlpha = 1
        if (T >= 1.02) {
          s.mode = 'man'; s.flashUntil = now + 260
          const done = s.onDone; s.onDone = null; done?.()
        }
      }
      if (now < s.flashUntil) { // the new body glows white for a moment
        ctx.globalAlpha = ((s.flashUntil - now) / 260) * 0.85; ctx.fillStyle = '#ffffff'
        MAN_PX.forEach(p => ctx.fillRect(p.x, p.y, 1, 1)); ctx.globalAlpha = 1
      }
      frame = requestAnimationFrame(loop)
    }
    frame = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(frame)
  }, [])

  return <canvas ref={canvasRef} width={GRID_W} height={GRID_H} className={className} style={{ imageRendering: 'pixelated' }} aria-hidden="true" />
}
