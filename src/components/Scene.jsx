import { useEffect } from 'react'
import { animate, motion, useMotionValue, useScroll, useTransform } from 'motion/react'
import { BusShape } from './ui.jsx'

/* "Project City": the hero scene. A bus drives in, stops at Stop 01, and drives off when you scroll. */

const GROUND = 196 // y where buildings stand
const BUILDINGS = [
  { x: 30, w: 110, h: 118, c: '#6c8cff' },
  { x: 156, w: 92, h: 82, c: '#ff8a65' },
  { x: 266, w: 132, h: 128, c: '#334155', label: 'SIEVE' },
  { x: 414, w: 84, h: 96, c: '#f59e0b' },
  { x: 514, w: 124, h: 120, c: '#7c5cff', label: 'AWAY' },
  { x: 958, w: 124, h: 124, c: '#10b981', label: 'RAG' },
  { x: 1098, w: 92, h: 92, c: '#ef476f' },
  { x: 1206, w: 140, h: 130, c: '#1f2937', label: 'AI LAB' },
  { x: 1362, w: 96, h: 104, c: '#60a5fa' },
]
const BACK = Array.from({ length: 22 }, (_, i) => ({ x: i * 68 - 10, w: 58, h: 58 + ((i * 37) % 52) }))
const TREES = [668, 712, 930, 1190]
const CLOUDS = [
  { y: 70, s: 0.9, d: 70, delay: -10 },
  { y: 98, s: 0.65, d: 95, delay: -50 },
  { y: 56, s: 0.75, d: 120, delay: -85 },
]

function Building({ b, i }) {
  const top = GROUND - b.h
  const cols = Math.max(1, Math.floor((b.w - 16) / 20))
  const rows = Math.max(1, Math.floor((b.h - 34) / 24))
  const wins = []
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++) {
      const lit = (i * 7 + r * 3 + c * 5) % 4 !== 0
      wins.push(<rect key={`${r}-${c}`} className={lit ? 'win lit' : 'win'} x={b.x + 12 + c * 20} y={top + 16 + r * 24} width="10" height="13" rx="1.5" />)
    }
  return (
    <g>
      <rect x={b.x} y={top} width={b.w} height={b.h} rx="4" fill={b.c} />
      <rect x={b.x} y={top} width={b.w} height="6" rx="3" fill="#000" opacity=".12" />
      {wins}
      {b.label && (
        <g>
          <rect x={b.x + b.w / 2 - 34} y={top - 22} width="68" height="18" rx="4" fill="#14151a" />
          <text x={b.x + b.w / 2} y={top - 9} textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="10.5" fontWeight="700" fill="#ffc21a" letterSpacing="1">{b.label}</text>
        </g>
      )}
    </g>
  )
}

export default function Scene() {
  const { scrollY } = useScroll()
  const arrive = useMotionValue(0)
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) { arrive.set(1); return }
    const a = animate(arrive, 1, { duration: 2.4, ease: [0.16, 1, 0.3, 1], delay: 0.5 })
    return () => a.stop()
  }, [arrive])

  // bus x: drives in from off-screen, then leaves to the right as the page scrolls
  const busX = useTransform([arrive, scrollY], ([a, s]) => -960 + a * 960 + Math.max(0, s) * 2.2)
  const wheel = useTransform([arrive, scrollY], ([a, s]) => a * 1100 + Math.max(0, s) * 2.6)
  const puff = useTransform(arrive, a => (a > 0.98 ? 1 : 0))

  return (
    <div className="relative h-[190px] w-full overflow-hidden sm:h-[230px] lg:h-[min(240px,16.7vw)]" aria-hidden="true">
      <svg viewBox="0 40 1440 240" preserveAspectRatio="xMidYMax slice" className="absolute inset-0 h-full w-full">
        {/* sun / moon and stars */}
        <circle className="scene-sun" cx="1300" cy="84" r="28" />
        <circle className="scene-moon-cut" cx="1313" cy="76" r="24" />
        {[[120, 64], [380, 92], [620, 58], [860, 80], [1040, 52], [1180, 100], [240, 110]].map(([x, y]) => (
          <circle key={x} className="scene-star" cx={x} cy={y} r="1.8" />
        ))}

        {/* clouds */}
        {CLOUDS.map((c, i) => (
          <g key={i} className="scene-cloud" style={{ animationDuration: `${c.d}s`, animationDelay: `${c.delay}s` }}>
            <g transform={`translate(0 ${c.y}) scale(${c.s})`}>
              <ellipse cx="60" cy="20" rx="44" ry="16" /><ellipse cx="34" cy="14" rx="22" ry="14" /><ellipse cx="74" cy="8" rx="26" ry="18" />
            </g>
          </g>
        ))}

        {/* skyline */}
        {BACK.map((b, i) => <rect key={i} className="scene-back" x={b.x} y={GROUND - b.h} width={b.w} height={b.h} rx="3" />)}
        {BUILDINGS.map((b, i) => <Building key={i} b={b} i={i} />)}
        {TREES.map(x => (
          <g key={x}><rect x={x - 2.5} y={GROUND - 26} width="5" height="26" fill="#7a5230" /><circle cx={x} cy={GROUND - 36} r="17" fill="#3fa34d" /><circle cx={x - 7} cy={GROUND - 42} r="9" fill="#5cc26a" /></g>
        ))}

        {/* bus stop */}
        <g>
          <rect x="890" y="122" width="5" height="76" fill="#14151a" />
          <circle cx="892.5" cy="114" r="19" fill="#ffc21a" stroke="#14151a" strokeWidth="3" />
          <text x="892.5" y="119" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="13" fontWeight="700" fill="#14151a">01</text>
          <rect x="864" y="138" width="57" height="16" rx="3" fill="#14151a" />
          <text x="892.5" y="150" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="9" fontWeight="700" fill="#fff" letterSpacing="1">ABOUT</text>
        </g>

        {/* street */}
        <rect x="0" y={GROUND} width="1440" height="10" className="scene-walk" />
        <rect x="0" y={GROUND + 10} width="1440" height="46" className="scene-road" />
        <line x1="0" x2="1440" y1={GROUND + 33} y2={GROUND + 33} stroke="#fff" strokeOpacity=".55" strokeWidth="3" strokeDasharray="26 20" />
        <rect x="0" y={GROUND + 56} width="1440" height="40" className="scene-grass" />

        {/* the bus */}
        <motion.g style={{ x: busX }}>
          <g transform={`translate(650 ${GROUND + 50 - 94}) scale(1.6)`}>
            <motion.g animate={{ y: [0, -0.6, 0] }} transition={{ duration: 0.5, repeat: Infinity }}>
              <BusShape wheel={wheel} />
            </motion.g>
            <motion.g style={{ opacity: puff }}>
              {[0, 1, 2].map(i => (
                <motion.circle key={i} cx="-2" cy="42" r="4" className="scene-puff"
                  animate={{ cx: [-2, -26], cy: [42, 34], r: [3, 8], opacity: [0.6, 0] }}
                  transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.6, ease: 'easeOut' }} />
              ))}
            </motion.g>
          </g>
        </motion.g>
      </svg>
    </div>
  )
}
