import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react'
import { Bus } from './ui.jsx'

const BUS_W = 64 // px, desktop bus width

/* The journey bar: a road fixed to the bottom of the screen. The bus drives to the
   section you are reading, and every stop is a link. */
export default function Road({ stops }) {
  const n = stops.length
  const raw = useMotionValue(0)
  const pos = useSpring(raw, { stiffness: 90, damping: 20, mass: 0.6 })
  const [active, setActive] = useState(0)
  const [facing, setFacing] = useState(1)
  const prev = useRef(0)

  useEffect(() => {
    let frame = 0
    const measure = () => {
      frame = 0
      const probe = window.scrollY + window.innerHeight * 0.4
      const tops = stops.map(s => {
        const el = document.getElementById(s.id)
        return el ? el.getBoundingClientRect().top + window.scrollY : 0
      })
      let i = 0
      while (i < n - 1 && probe >= tops[i + 1]) i++
      let p = i
      if (i < n - 1) p += Math.min(1, Math.max(0, (probe - tops[i]) / (tops[i + 1] - tops[i])))
      // the last stop is short: arrive when the page bottom is reached
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) { p = n - 1; i = n - 1 }
      const v = p / (n - 1)
      if (Math.abs(v - prev.current) > 0.002) setFacing(v > prev.current ? 1 : -1)
      prev.current = v
      raw.set(v)
      setActive(Math.round(p))
    }
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(measure) }
    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); cancelAnimationFrame(frame) }
  }, [stops, n, raw])

  const left = useTransform(pos, v => `calc(${v} * (100% - ${BUS_W}px))`)
  const wheel = useTransform(pos, v => v * 2400)

  const go = id => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <nav aria-label="Journey through the sections" className="pointer-events-none fixed inset-x-0 bottom-3 z-40 flex justify-center px-3 sm:bottom-4">
      <div className="pointer-events-auto w-full max-w-[820px] rounded-2xl border border-line bg-surface/90 px-4 pb-2 pt-1.5 shadow-[0_12px_40px_-16px_rgba(0,0,0,.35)] backdrop-blur-md sm:px-6">
        <div className="relative h-[52px]">
          {/* the road */}
          <div className="absolute inset-x-0 top-[34px] h-[10px] rounded-full bg-road">
            <div className="absolute inset-x-3 top-1/2 h-0 -translate-y-1/2 border-t-2 border-dashed border-white/50" />
          </div>
          {/* the stops */}
          {stops.map((s, i) => {
            const x = `calc(${i / (n - 1)} * (100% - ${BUS_W}px) + ${BUS_W / 2}px)`
            const on = i === active
            return (
              <button
                key={s.id}
                onClick={() => go(s.id)}
                className="group absolute top-[28px] -translate-x-1/2 p-1"
                style={{ left: x }}
                aria-label={`Go to ${s.label}`}
                aria-current={on ? 'true' : undefined}
              >
                <span className={`block h-4 w-4 rounded-full border-[3px] transition ${on ? 'scale-110 border-ink bg-accent' : 'border-road bg-surface group-hover:bg-accent'}`} />
              </button>
            )
          })}
          {/* the bus */}
          <motion.div className="pointer-events-none absolute top-0" style={{ left, width: BUS_W }}>
            <motion.div animate={{ scaleX: facing }} transition={{ duration: 0.25 }} initial={false}>
              <motion.div initial={{ x: -120, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}>
                <Bus className="block w-full" wheel={wheel} />
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
        {/* stop names: all on desktop, only the current one on phones */}
        <div className="relative hidden h-4 sm:block">
          {stops.map((s, i) => (
            <button
              key={s.id}
              onClick={() => go(s.id)}
              className={`absolute -translate-x-1/2 whitespace-nowrap text-[11px] transition ${i === active ? 'font-semibold text-ink' : 'text-muted hover:text-ink'}`}
              style={{ left: `calc(${i / (n - 1)} * (100% - ${BUS_W}px) + ${BUS_W / 2}px)` }}
              tabIndex={-1}
            >
              {s.label}
            </button>
          ))}
        </div>
        <div className="flex h-4 items-center justify-between text-[11px] sm:hidden">
          <span className="font-mono text-muted">Stop {active + 1}/{n}</span>
          <span className="font-semibold text-ink">{stops[active].label}</span>
        </div>
      </div>
    </nav>
  )
}
