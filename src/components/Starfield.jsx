import { useEffect, useRef } from 'react'

/* Full-screen canvas of twinkling stars in three depth layers. Stars drift with the scroll
   (parallax) and a shooting star crosses now and then. Static when reduced motion is on. */
export default function Starfield() {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas.getContext('2d')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let w = 0, h = 0, dpr = 1, stars = [], frame = 0, shoot = null, nextShoot = performance.now() + 3000

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = window.innerWidth; h = window.innerHeight
      canvas.width = w * dpr; canvas.height = h * dpr
      canvas.style.width = `${w}px`; canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const count = Math.round((w * h) / 4200)
      stars = Array.from({ length: count }, () => {
        const z = Math.random() ** 2 * 0.9 + 0.1 // most stars far away
        return { x: Math.random() * w, y: Math.random() * h, z, r: 0.35 + z * 1.25, tw: 0.6 + Math.random() * 2.2, ph: Math.random() * 6.28,
          hue: Math.random() < 0.18 ? (Math.random() < 0.5 ? '190,240,255' : '200,180,255') : '255,255,255' }
      })
    }

    const draw = t => {
      ctx.clearRect(0, 0, w, h)
      const sy = window.scrollY
      for (const s of stars) {
        const y = (((s.y - sy * s.z * 0.35) % h) + h) % h
        const a = reduce ? 0.7 * s.z + 0.2 : (0.55 + 0.45 * Math.sin(t * 0.001 * s.tw + s.ph)) * (0.35 + s.z * 0.65)
        ctx.fillStyle = `rgba(${s.hue},${a})`
        ctx.beginPath(); ctx.arc(s.x, y, s.r, 0, 6.283); ctx.fill()
      }
      if (!reduce) {
        if (!shoot && t > nextShoot) shoot = { x: Math.random() * w * 0.7 + w * 0.2, y: Math.random() * h * 0.35, life: 0 }
        if (shoot) {
          shoot.life += 1
          const p = shoot.life / 55, x = shoot.x - p * 340, y = shoot.y + p * 150
          const g = ctx.createLinearGradient(x, y, x + 120, y - 53)
          g.addColorStop(0, `rgba(180,240,255,${1 - p})`); g.addColorStop(1, 'rgba(180,240,255,0)')
          ctx.strokeStyle = g; ctx.lineWidth = 1.6
          ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 120, y - 53); ctx.stroke()
          if (p >= 1) { shoot = null; nextShoot = t + 5000 + Math.random() * 6000 }
        }
      }
    }

    const loop = t => { draw(t); frame = requestAnimationFrame(loop) }
    resize()
    if (reduce) {
      draw(0)
      const redraw = () => draw(0)
      window.addEventListener('scroll', redraw, { passive: true })
      window.addEventListener('resize', () => { resize(); draw(0) })
      return () => window.removeEventListener('scroll', redraw)
    }
    frame = requestAnimationFrame(loop)
    const onVis = () => { cancelAnimationFrame(frame); if (!document.hidden) frame = requestAnimationFrame(loop) }
    document.addEventListener('visibilitychange', onVis)
    window.addEventListener('resize', resize)
    return () => { cancelAnimationFrame(frame); document.removeEventListener('visibilitychange', onVis); window.removeEventListener('resize', resize) }
  }, [])

  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
      <div className="nebula absolute inset-0" />
      <canvas ref={ref} className="absolute inset-0" />
    </div>
  )
}
