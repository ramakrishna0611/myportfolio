import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { AnimatePresence, animate, motion, useAnimationFrame, useMotionValue } from 'motion/react'
import { profile } from '../data.js'
import Character from './Character.jsx'
import { Button, Icon } from './ui.jsx'

/* ---------- what orbits the boy ---------- */
const SKILLS = [
  ['PY', 'Python', '#ffd43b'], ['LLM', 'LLMs', '#a78bfa'], ['RAG', 'RAG', '#34d399'], ['AGT', 'Agents', '#4de1ff'],
  ['TC', 'Tool calling', '#f472b6'], ['EV', 'Evals', '#fb923c'], ['GR', 'Guardrails', '#f87171'], ['API', 'FastAPI', '#22d3ee'],
  ['SQL', 'SQL', '#60a5fa'], ['AF', 'Agentforce', '#38bdf8'],
]
const EAT_GAP = 300 // ms between swallowed skills

/* ---------- the map ---------- */
export const DESTS = [
  { id: 'about', label: 'About me', type: 'area' },
  { id: 'experience', label: 'Experience', type: 'area' },
  { id: 'skills', label: 'Skills', type: 'area' },
  { id: 'sieve', label: 'Sieve', sub: 'AI resume screening', type: 'project', live: true },
  { id: 'away', label: 'Away', sub: 'AI leave-tracker agent', type: 'project', live: true },
  { id: 'hr-rag', label: 'HR Policy RAG', sub: 'Retrieval assistant', type: 'project' },
  { id: 'certifications', label: 'Certifications', type: 'area' },
  { id: 'education', label: 'Education', type: 'area' },
  { id: 'contact', label: 'Contact', type: 'area' },
]
// x, y in % of the stage
const POS_WIDE = { about: [17, 24], experience: [10, 52], skills: [17, 80], sieve: [83, 24], away: [90, 52], 'hr-rag': [83, 80], education: [33, 11], certifications: [67, 11], contact: [50, 91] }
const POS_TALL = { sieve: [17, 36], away: [50, 41], 'hr-rag': [83, 36], about: [17, 60], experience: [50, 64], skills: [83, 60], certifications: [17, 82], education: [50, 86], contact: [83, 82] }

function useStageSize(ref) {
  const [size, setSize] = useState({ w: 0, h: 0 })
  useLayoutEffect(() => {
    const el = ref.current
    const ro = new ResizeObserver(() => setSize({ w: el.clientWidth, h: el.clientHeight }))
    ro.observe(el)
    return () => ro.disconnect()
  }, [ref])
  return size
}

/* one orbiting skill; when `eatAfter` is set it flies into the boy's mouth */
function Skill({ s, i, n, rx, ry, eatAfter, mouth, onEaten }) {
  const x = useMotionValue(0), y = useMotionValue(0), scale = useMotionValue(1), opacity = useMotionValue(1)
  const eating = useRef(false)
  const phase = (i / n) * Math.PI * 2
  useAnimationFrame(t => {
    if (eating.current) return
    const a = phase + t * 0.00028
    x.set(rx * Math.cos(a)); y.set(ry * Math.sin(a) - 10)
    scale.set(0.85 + 0.15 * ((Math.sin(a) + 1) / 2))
  })
  useEffect(() => {
    if (eatAfter == null) return
    const t = setTimeout(() => {
      eating.current = true
      const o = { duration: 0.42, ease: [0.5, 0, 0.75, 0] }
      animate(x, mouth.x, o); animate(scale, 0.25, o); animate(opacity, 0, { ...o, delay: 0.3 })
      animate(y, mouth.y, { ...o, onComplete: () => onEaten(i) })
    }, eatAfter)
    return () => clearTimeout(t)
  }, [eatAfter]) // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <motion.div className="absolute left-1/2 top-1/2" style={{ x, y, scale, opacity }}>
      <div className="flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1">
        <div className="grid h-9 w-9 place-items-center border-2 border-black font-['Silkscreen',monospace] text-[10px] font-bold text-black"
          style={{ background: s[2], boxShadow: 'inset -3px -3px 0 rgba(0,0,0,.28), inset 3px 3px 0 rgba(255,255,255,.45), 0 0 14px ' + s[2] + '66' }}>{s[0]}</div>
        <div className="whitespace-nowrap rounded bg-black/60 px-1.5 font-['Silkscreen',monospace] text-[9px] text-white">{s[1]}</div>
      </div>
    </motion.div>
  )
}

function Burst({ at, color }) {
  return (
    <div className="pointer-events-none absolute left-1/2 top-1/2" style={{ transform: `translate(${at.x}px, ${at.y}px)` }}>
      {Array.from({ length: 8 }, (_, k) => {
        const a = (k / 8) * Math.PI * 2
        return <motion.span key={k} className="absolute h-1.5 w-1.5" style={{ background: color }}
          initial={{ x: 0, y: 0, opacity: 1 }} animate={{ x: Math.cos(a) * 34, y: Math.sin(a) * 34, opacity: 0 }} transition={{ duration: 0.5, ease: 'easeOut' }} />
      })}
    </div>
  )
}

/* glowing laser from the man to a destination, with light pulses running along it */
function Laser({ d, i, active, shot }) {
  return (
    <g>
      <motion.path d={d} fill="none" stroke={active ? '#7cecff' : '#4de1ff'} strokeWidth={active ? 7 : 5} strokeOpacity={active ? 0.35 : 0.16} filter="url(#glow)"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.9, delay: 0.15 + i * 0.08, ease: 'easeOut' }} />
      <motion.path d={d} fill="none" stroke={active ? '#e8fcff' : '#8feeff'} strokeWidth={active ? 2 : 1.3} strokeLinecap="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.9, delay: 0.15 + i * 0.08, ease: 'easeOut' }} />
      <circle r="2.6" fill="#ffffff" opacity=".9">
        <animateMotion dur={`${2.4 + (i % 3) * 0.4}s`} begin={`${1 + i * 0.25}s`} repeatCount="indefinite" path={d} />
      </circle>
      {shot && (
        <circle key={shot} r="6" fill="#ffffff" filter="url(#glow)">
          <animateMotion dur="0.4s" fill="freeze" path={d} />
        </circle>
      )}
    </g>
  )
}

function Node({ dest, x, y, i, onOpen, onHover, tall }) {
  const project = dest.type === 'project'
  const above = !tall && y < 45 // label above the beacon, so the laser arriving from below never crosses it
  return (
    <motion.button
      className="group absolute -translate-x-1/2 -translate-y-1/2 text-center outline-none"
      style={{ left: `${x}%`, top: `${y}%` }}
      initial={{ opacity: 0, scale: 0.4 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.7 + i * 0.08, type: 'spring', stiffness: 260, damping: 18 }}
      onClick={() => onOpen(dest.id)} onMouseEnter={() => onHover(dest.id)} onMouseLeave={() => onHover(null)} onFocus={() => onHover(dest.id)} onBlur={() => onHover(null)}
      aria-label={`Open ${dest.label}${dest.sub ? `: ${dest.sub}` : ''}`}>
      <span className={`flex items-center ${above ? 'flex-col-reverse' : 'flex-col'}`}>
      <span className="relative mx-auto grid place-items-center">
        <span className={`absolute rounded-full ${project ? 'h-16 w-16 bg-cyan/20' : 'h-11 w-11 bg-amber/15'} animate-ping [animation-duration:2.6s]`} />
        <span className={`relative grid place-items-center rounded-full border-2 transition duration-200 group-hover:scale-110 group-focus-visible:scale-110 ${project
          ? 'h-12 w-12 border-cyan bg-[#06202b] text-cyan shadow-[0_0_28px_rgba(77,225,255,.65)]'
          : 'h-9 w-9 border-amber/80 bg-[#22180a] text-amber shadow-[0_0_20px_rgba(255,181,71,.45)]'}`}>
          {project ? <Icon.play /> : <span className="h-2.5 w-2.5 rounded-full bg-amber" />}
        </span>
      </span>
      <span className={`mt-2 block whitespace-nowrap font-display font-bold text-ink ${project ? 'text-[15px]' : 'text-[13px]'} ${tall ? '' : 'drop-shadow-[0_2px_6px_rgba(0,0,0,.9)]'}`}>{dest.label}</span>
      {dest.sub && !tall && <span className="block whitespace-nowrap text-[11px] text-muted">{dest.sub}</span>}
      {dest.live && <span className={`mt-1 inline-flex items-center gap-1 rounded-full border border-emerald-400/40 bg-emerald-400/10 px-1.5 py-px font-mono text-[9.5px] font-semibold text-emerald-300 ${above ? 'mb-2' : ''}`}><i className="h-1 w-1 animate-pulse rounded-full bg-emerald-400" />{tall ? 'LIVE' : 'LIVE · watch demo'}</span>}
      </span>
    </motion.button>
  )
}

export default function World({ onOpen, openId, startOnMap }) {
  const stageRef = useRef(null)
  const charRef = useRef(null)
  const { w, h } = useStageSize(stageRef)
  const tall = w < 768 || w / Math.max(h, 1) < 1.05
  const [phase, setPhase] = useState(startOnMap ? 'map' : 'idle') // idle → eating → morph → levelup → map
  const [eaten, setEaten] = useState(0)
  const [bursts, setBursts] = useState([])
  const [hover, setHover] = useState(null)
  const [shot, setShot] = useState(null)
  const [run, setRun] = useState(0) // bumps to replay the intro

  // character size and where its mouth is (relative to the centre of the canvas)
  const charH = tall ? Math.min(220, h * 0.3) : Math.min(320, h * 0.48)
  const px = charH / 30
  const mouth = { x: 0, y: 3.5 * px }
  const rx = tall ? Math.min(w * 0.4, 170) : charH * 0.78, ry = tall ? charH * 0.55 : charH * 0.56
  const atMap = phase === 'map'
  const charPos = atMap ? (tall ? [50, 16] : [50, 50]) : (tall ? [50, 66] : [70, 52])
  const charScale = atMap ? (tall ? 0.5 : 0.62) : 1

  useEffect(() => { if (startOnMap) charRef.current?.set('man') }, [startOnMap])

  const start = useCallback(() => {
    if (phase !== 'idle') return
    setPhase('eating')
    setTimeout(() => {
      setPhase('morph')
      charRef.current?.morph(() => setPhase('levelup'))
    }, SKILLS.length * EAT_GAP + 520)
  }, [phase])

  const onEaten = useCallback(i => {
    charRef.current?.gulp()
    setEaten(n => n + 1)
    const id = `${i}-${Date.now()}`
    setBursts(b => [...b, { id, color: SKILLS[i][2] }])
    setTimeout(() => setBursts(b => b.filter(x => x.id !== id)), 600)
  }, [])

  const skip = () => { charRef.current?.set('man'); setEaten(SKILLS.length); setPhase('map') }
  const replay = () => { charRef.current?.set('boy'); setEaten(0); setRun(r => r + 1); setPhase('idle') }
  const clickChar = () => { if (phase === 'idle') start(); else if (phase === 'levelup') setPhase('map'); else if (phase === 'map') open('about') }
  const open = id => { setShot({ id, k: Date.now() }); setTimeout(() => onOpen(id), 380) }

  // laser paths from the man to each destination, in stage pixels
  const pos = tall ? POS_TALL : POS_WIDE
  const cx = (charPos[0] / 100) * w, cy = (charPos[1] / 100) * h + (atMap ? charH * charScale * 0.1 : 0)
  const paths = DESTS.map((d, i) => {
    const tx = (pos[d.id][0] / 100) * w, ty = (pos[d.id][1] / 100) * h
    const mx = (cx + tx) / 2, my = (cy + ty) / 2, dx = tx - cx, dy = ty - cy, len = Math.hypot(dx, dy) || 1
    const straight = Math.abs(dx) < len * 0.2
    const bend = straight ? 0.3 * (i % 2 ? 1 : -1) : 0.14 * (dx > 0 ? 1 : -1) * (dy > 0 ? -1 : 1)
    const qx = mx - (dy / len) * len * bend, qy = my + (dx / len) * len * bend
    return `M ${cx} ${cy} Q ${qx} ${qy} ${tx} ${ty}`
  })

  const hint = { idle: 'Click the boy to level him up', eating: 'Absorbing skills…', morph: 'Evolving…', levelup: 'Click him to open the map', map: '' }[phase]

  return (
    <section ref={stageRef} id="world" aria-label="Interactive map of my work" className="relative h-[calc(100svh-4rem)] min-h-[600px] w-full overflow-hidden">
      {/* navigator grid */}
      <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="4" /></filter>
          <radialGradient id="fade"><stop offset="0%" stopColor="#4de1ff" stopOpacity=".10" /><stop offset="100%" stopColor="#4de1ff" stopOpacity="0" /></radialGradient>
        </defs>
        <circle cx={(charPos[0] / 100) * w} cy={(charPos[1] / 100) * h} r={Math.max(w, h) * 0.45} fill="url(#fade)" style={{ transition: 'cx .9s, cy .9s' }} />
        {[0.14, 0.26, 0.38, 0.5].map(r => (
          <circle key={r} cx={(charPos[0] / 100) * w} cy={(charPos[1] / 100) * h} r={Math.max(w, h) * r} fill="none" stroke="rgba(77,225,255,.08)" strokeDasharray="2 8" style={{ transition: 'cx .9s, cy .9s' }} />
        ))}
      </svg>

      {/* intro copy */}
      <AnimatePresence>
        {!atMap && (
          <motion.div key="copy" className={`absolute z-20 ${tall ? 'inset-x-0 top-0 px-5 pt-6 text-center' : 'left-[max(2rem,calc((100vw-72rem)/2+1.5rem))] top-1/2 w-[min(46vw,560px)] -translate-y-1/2'}`}
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -40, transition: { duration: 0.4 } }} transition={{ duration: 0.6 }}>
            <div className={`inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.14em] text-emerald-300 ${tall ? 'hidden sm:inline-flex' : ''}`}>
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />Open to AI Engineer roles
            </div>
            <h1 className={`grad-text text-glow font-display font-bold leading-[1.02] tracking-tight ${tall ? 'mt-1 text-[clamp(1.9rem,8vw,2.6rem)]' : 'mt-5 text-[clamp(2.4rem,4.6vw,4.2rem)]'}`}>{profile.name}</h1>
            <p className={`font-display font-semibold text-ink ${tall ? 'mt-1 text-xl' : 'mt-3 text-3xl'}`}>AI Engineer</p>
            {!tall && <p className="mt-4 max-w-md text-[17px] leading-relaxed text-muted"><span className="text-ink">{profile.tagline}</span> Two of my AI apps are live: the map shows where they are.</p>}
            <div className={`flex flex-wrap items-center gap-3 ${tall ? 'mt-3 justify-center' : 'mt-7'}`}>
              {phase === 'idle' && <Button href="#world" variant="primary" onClick={e => { e.preventDefault(); start() }} className={tall ? '!px-4 !py-2' : ''}><Icon.play />Start the level-up</Button>}
              <Button href="#world" onClick={e => { e.preventDefault(); skip() }} className={tall ? '!px-4 !py-2' : ''}>Skip to the map</Button>
              {!tall && <Button href="#world" onClick={e => { e.preventDefault(); skip(); setTimeout(() => onOpen('sieve'), 700) }}>Watch live demos</Button>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* lasers + destinations */}
      {atMap && w > 0 && (
        <>
          <svg className="pointer-events-none absolute inset-0 z-10 h-full w-full" aria-hidden="true">
            {paths.map((d, i) => <Laser key={`${DESTS[i].id}-${tall}`} d={d} i={i} active={hover === DESTS[i].id || openId === DESTS[i].id} shot={shot?.id === DESTS[i].id ? shot.k : null} />)}
          </svg>
          <nav aria-label="Destinations" className="absolute inset-0 z-20">
            {DESTS.map((d, i) => <Node key={d.id} dest={d} x={pos[d.id][0]} y={pos[d.id][1]} i={i} onOpen={open} onHover={setHover} tall={tall} />)}
          </nav>
          <motion.div className={`absolute z-20 font-mono text-[11px] text-muted ${tall ? 'inset-x-0 bottom-3 flex justify-center gap-4' : 'inset-x-6 bottom-5 flex items-end justify-between'}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
            <p className="uppercase tracking-[0.2em]">{tall ? '' : 'Pick a destination · '}<span className="text-cyan">● projects</span> · <span className="text-amber">● about me</span></p>
            <button onClick={replay} className="underline-offset-4 hover:text-cyan hover:underline">↺ replay the level-up</button>
          </motion.div>
        </>
      )}

      {/* the character with its orbiting skills */}
      <motion.div className="absolute z-30" style={{ width: charH * 0.8, height: charH, marginLeft: -charH * 0.4, marginTop: -charH / 2 }}
        initial={false} animate={{ left: `${charPos[0]}%`, top: `${charPos[1]}%`, scale: charScale }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}>
        <AnimatePresence>
          {(phase === 'idle' || phase === 'eating') && (
            <motion.div key={`skills-${run}`} className="absolute inset-0" exit={{ opacity: 0 }}>
              {SKILLS.map((s, i) => (
                <Skill key={s[0]} s={s} i={i} n={SKILLS.length} rx={rx} ry={ry} mouth={mouth}
                  eatAfter={phase === 'eating' ? i * EAT_GAP : null} onEaten={onEaten} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
        {bursts.map(b => <Burst key={b.id} at={mouth} color={b.color} />)}

        <button onClick={clickChar} className="relative block h-full w-full cursor-pointer outline-none [&:focus-visible]:drop-shadow-[0_0_10px_#4de1ff]"
          aria-label={phase === 'idle' ? 'Start: the boy absorbs my skills' : phase === 'map' ? 'Open About me' : 'Open the map'}>
          <span className="absolute inset-x-[10%] bottom-[-4%] h-[7%] rounded-[50%] bg-cyan/25 blur-md" />
          <Character ref={charRef} startAs={startOnMap ? 'man' : 'boy'} className="relative h-full w-full" />
        </button>

        {/* level / XP readout */}
        <AnimatePresence>
          {phase !== 'map' && (
            <motion.div key="hud" className="absolute left-1/2 top-full mt-4 w-56 -translate-x-1/2 text-center font-['Silkscreen',monospace]" exit={{ opacity: 0 }}>
              {phase === 'levelup' ? (
                <motion.div initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 14 }}>
                  <div className="text-lg text-amber drop-shadow-[0_0_10px_rgba(255,181,71,.8)]">LEVEL UP!</div>
                  <div className="text-[11px] text-cyan">AI ENGINEER · LVL 99</div>
                </motion.div>
              ) : (
                <>
                  <div className="flex justify-between text-[10px] text-ink"><span>{eaten < SKILLS.length ? 'BOY · LVL 1' : 'EVOLVING'}</span><span className="text-cyan">XP {eaten}/{SKILLS.length}</span></div>
                  <div className="mt-1 h-3 border-2 border-black bg-[#151a2c] p-[1px]">
                    <motion.div className="h-full bg-gradient-to-r from-cyan to-violet" animate={{ width: `${(eaten / SKILLS.length) * 100}%` }} transition={{ duration: 0.25 }} />
                  </div>
                </>
              )}
              {hint && <div className="blink mt-3 text-[10px] text-muted [animation-duration:1.6s]">▶ {hint}</div>}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  )
}
