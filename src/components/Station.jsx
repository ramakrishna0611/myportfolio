import { motion, useAnimationFrame, useMotionValue, useReducedMotion } from 'motion/react'

/* The hero visual: an AI core sending out pulse waves, a rotating station wheel around it,
   and three project modules orbiting on a tilted ring. Click a module to jump to that project. */

const MODULES = [
  { id: 'sieve', label: 'SIEVE', phase: 0.4 },
  { id: 'away', label: 'AWAY', phase: 0.4 + 2.094 },
  { id: 'hr-rag', label: 'RAG', phase: 0.4 + 4.189 },
]
const RX = 222, RY = 66, TILT = (-16 * Math.PI) / 180

function useOrbiter(phase, speed, rx, ry, tilt) {
  const x = useMotionValue(0), y = useMotionValue(0), s = useMotionValue(1)
  const front = useMotionValue(1), back = useMotionValue(0)
  const reduce = useReducedMotion()
  useAnimationFrame(t => {
    const a = phase + (reduce ? 0 : t * speed)
    const ex = rx * Math.cos(a), ey = ry * Math.sin(a)
    x.set(ex * Math.cos(tilt) - ey * Math.sin(tilt))
    y.set(ex * Math.sin(tilt) + ey * Math.cos(tilt))
    const depth = Math.sin(a) // > 0: in front of the core
    s.set(0.82 + 0.22 * (depth + 1) / 2)
    front.set(depth >= 0 ? 1 : 0)
    back.set(depth < 0 ? 0.55 : 0)
  })
  return { x, y, s, front, back }
}

function ModuleShape({ label }) {
  return (
    <g>
      <rect x="-54" y="-6" width="26" height="12" rx="1.5" fill="#24338f" stroke="#7aa2ff" strokeWidth=".8" />
      <rect x="28" y="-6" width="26" height="12" rx="1.5" fill="#24338f" stroke="#7aa2ff" strokeWidth=".8" />
      {[-45, -37, 37, 45].map(x => <line key={x} x1={x} x2={x} y1="-6" y2="6" stroke="#7aa2ff" strokeWidth=".6" />)}
      <line x1="-28" x2="-22" y1="0" y2="0" stroke="#9aa6c8" strokeWidth="2" />
      <line x1="22" x2="28" y1="0" y2="0" stroke="#9aa6c8" strokeWidth="2" />
      <rect x="-22" y="-9" width="44" height="18" rx="9" fill="#0c1430" stroke="#4de1ff" strokeWidth="1.5" />
      {[-10, 0, 10].map(x => <circle key={x} cx={x} cy="0" r="2.4" fill="#4de1ff" />)}
      <g transform="translate(0 22)">
        <rect x="-24" y="-8" width="48" height="16" rx="8" fill="rgba(5,7,15,.85)" stroke="rgba(77,225,255,.5)" strokeWidth="1" />
        <text y="3.5" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="9" fontWeight="700" fill="#4de1ff" letterSpacing="1">{label}</text>
      </g>
    </g>
  )
}

function Module({ m, layer }) {
  const o = useOrbiter(m.phase, 0.00017, RX, RY, TILT)
  const go = () => document.getElementById(m.id)?.scrollIntoView({ behavior: 'smooth' })
  const opacity = layer === 'front' ? o.front : o.back
  return (
    <motion.g style={{ x: o.x, y: o.y, scale: o.s, opacity, cursor: 'pointer' }} onClick={go}
      role={layer === 'front' ? 'button' : undefined} aria-label={layer === 'front' ? `Jump to project ${m.label}` : undefined}
      tabIndex={layer === 'front' ? 0 : -1} onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && go()}
      className="transition-[filter] hover:brightness-150">
      <ModuleShape label={m.label} />
    </motion.g>
  )
}

function Particle({ i }) {
  const o = useOrbiter(i * 1.257, 0.0005, 152, 40, (24 * Math.PI) / 180)
  return <motion.circle r="2.2" fill="#b9a2ff" style={{ x: o.x, y: o.y }} />
}

export default function Station() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[540px] select-none">
      <div className="rays absolute -inset-[12%] rounded-full" aria-hidden="true" />
      {[0, 1.2, 2.4, 3.6].map(d => (
        <div key={d} className="wave absolute inset-[4%] rounded-full border border-cyan/40" style={{ animationDelay: `${d}s` }} aria-hidden="true" />
      ))}

      <svg viewBox="-270 -270 540 540" className="absolute inset-0 h-full w-full overflow-visible">
        <defs>
          <radialGradient id="core" cx="50%" cy="45%" r="55%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="35%" stopColor="#8ff0ff" />
            <stop offset="75%" stopColor="#4de1ff" stopOpacity=".55" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="halo" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#4de1ff" stopOpacity=".35" />
            <stop offset="100%" stopColor="#4de1ff" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* the orbit ring and the modules currently behind the core */}
        <ellipse rx={RX} ry={RY} transform="rotate(-16)" fill="none" stroke="rgba(139,92,246,.45)" strokeWidth="1.2" strokeDasharray="3 7" />
        {MODULES.map(m => <Module key={m.id} m={m} layer="back" />)}

        {/* rotating station wheel */}
        <motion.g animate={{ rotate: 360 }} transition={{ duration: 90, ease: 'linear', repeat: Infinity }}>
          <circle r="124" fill="none" stroke="rgba(77,225,255,.18)" strokeWidth="12" />
          <circle r="124" fill="none" stroke="rgba(77,225,255,.55)" strokeWidth="1.2" strokeDasharray="2 9" />
          {[0, 90, 180, 270].map(a => (
            <g key={a} transform={`rotate(${a})`}>
              <line x1="52" x2="114" y1="0" y2="0" stroke="rgba(160,190,255,.35)" strokeWidth="3" />
              <rect x="114" y="-9" width="22" height="18" rx="3" fill="#0c1430" stroke="#4de1ff" strokeWidth="1.2" />
              <circle cx="125" cy="0" r="2.5" fill="#ffb547" />
            </g>
          ))}
        </motion.g>

        {Array.from({ length: 5 }, (_, i) => <Particle key={i} i={i} />)}

        {/* AI core */}
        <circle r="96" fill="url(#halo)" />
        <motion.circle r="48" fill="url(#core)" animate={{ scale: [1, 1.06, 1] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }} />
        <g stroke="#05213a" strokeWidth="1.4" opacity=".9">
          {[[0, -22], [19, -11], [19, 11], [0, 22], [-19, 11], [-19, -11]].map(([x, y], i, arr) => (
            <g key={i}><line x1="0" y1="0" x2={x} y2={y} /><line x1={x} y1={y} x2={arr[(i + 2) % 6][0]} y2={arr[(i + 2) % 6][1]} /></g>
          ))}
        </g>
        {[[0, 0], [0, -22], [19, -11], [19, 11], [0, 22], [-19, 11], [-19, -11]].map(([x, y], i) => (
          <motion.circle key={i} cx={x} cy={y} r="3.4" fill="#05213a"
            animate={{ opacity: [1, 0.35, 1] }} transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.25 }} />
        ))}

        {/* modules in front of the core */}
        {MODULES.map(m => <Module key={m.id} m={m} layer="front" />)}
      </svg>
    </div>
  )
}
