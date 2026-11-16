import { useEffect, useRef, useState } from 'react'
import { motion, useAnimationFrame, useMotionValue, useMotionValueEvent, useScroll, useTransform } from 'motion/react'
import { profile, mind, mindSkills } from '../data.js'
import Character from './Character.jsx'
import { ArrowButton, ChapterTitle } from './ui.jsx'

const PAD = 'px-6 sm:px-[max(2.5rem,calc((100vw-80rem)/2+2.5rem))]'

/* ---------------- chapter 1: the hook ---------------- */
const LINES = ['Hello, Ramakrishna.', 'Teach me the rules.', 'I will only propose.', 'You decide.']

function Typing() {
  const [i, setI] = useState(0), [n, setN] = useState(0)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setN(LINES[i].length); return }
    const full = LINES[i].length
    const t = setTimeout(() => (n < full ? setN(n + 1) : (setN(0), setI((i + 1) % LINES.length))), n < full ? 70 : 2200)
    return () => clearTimeout(t)
  }, [n, i])
  return <>{LINES[i].slice(0, n)}<span className="blink ml-0.5 inline-block h-[1em] w-[0.5em] translate-y-[2px] bg-[#7d97ff]" /></>
}

export function Hero() {
  const look = useMotionValue(0)
  const gulp = useRef(0)
  const onMove = e => look.set((e.clientX / window.innerWidth) * 2 - 1)
  return (
    <section id="about" data-accent="#7d97ff" onMouseMove={onMove} className={`relative grid min-h-[100svh] items-center gap-10 pb-16 pt-28 lg:grid-cols-[1.15fr_.85fr] ${PAD}`}>
      <div>
        <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="font-serif text-[clamp(2.8rem,6.4vw,5.6rem)] font-medium leading-[0.98] tracking-[-0.025em]">
          I teach AI to follow the rules.
        </motion.h1>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 0.8 }}>
          <p className="mt-8 max-w-xl text-[19px] leading-relaxed text-ink/90">I’m {profile.name}, an AI Engineer at Accelerize360 building LLM agents and RAG systems.</p>
          <p className="mt-4 max-w-xl text-[19px] leading-relaxed text-ink/90">The model can propose. My code decides. The numbers prove it.</p>
          <div className="mt-10 flex flex-wrap items-center gap-6">
            <ArrowButton href="#mind">Watch it happen</ArrowButton>
            <span className="hidden font-mono text-[13px] text-muted sm:inline">Or move your cursor over me.</span>
          </div>
        </motion.div>
      </div>

      <motion.div className="relative mx-auto w-full max-w-[420px]" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 1 }}>
        {/* the boy's terminal */}
        <div className="absolute left-1/2 top-[36%] z-10 w-max -translate-x-1/2 rounded-sm border border-[#7d97ff]/40 bg-[#0b0d14] px-3 py-2 font-pixel text-[12px] text-[#c9d4ff] shadow-[0_0_40px_rgba(125,151,255,.25)]">
          <Typing />
          <span className="absolute -bottom-[7px] left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-b border-r border-[#7d97ff]/40 bg-[#0b0d14]" />
        </div>
        <div className="relative mx-auto mt-14 aspect-[4/5] w-[78%]">
          <div className="absolute inset-x-[8%] bottom-0 h-[10%] rounded-[50%] bg-[#7d97ff]/20 blur-xl" />
          <div className="absolute inset-0 bg-[radial-gradient(closest-side,rgba(125,151,255,.14),transparent)]" />
          <Character morph={0} gulp={gulp} look={look} className="relative h-full w-full" />
        </div>
        <p className="mt-4 text-center font-mono text-[11.5px] text-muted">Level 1 · a boy who wanted to build AI</p>
      </motion.div>
    </section>
  )
}

/* ---------------- chapter 2: inside my head ---------------- */
const N = mindSkills.length
const START = 0.06, STEP = 0.055, WIN = 0.08 // skill i is swallowed over [START + i*STEP, + WIN]
const MORPH = [0.68, 0.86]

function OrbitSkill({ s, i, p, rx, ry, mouth }) {
  const x = useMotionValue(0), y = useMotionValue(0), scale = useMotionValue(1), opacity = useMotionValue(1)
  useAnimationFrame(t => {
    const a = (i / N) * Math.PI * 2 + t * 0.00022
    const ox = rx * Math.cos(a), oy = ry * Math.sin(a)
    const L = Math.min(1, Math.max(0, (p.get() - (START + i * STEP)) / WIN))
    const k = L * L
    x.set(ox + (mouth.x - ox) * k); y.set(oy + (mouth.y - oy) * k)
    scale.set((0.85 + 0.15 * ((Math.sin(a) + 1) / 2)) * (1 - 0.8 * k))
    opacity.set(L < 0.85 ? 1 : (1 - L) / 0.15)
  })
  return (
    <motion.div className="absolute left-1/2 top-1/2" style={{ x, y, scale, opacity }}>
      <div className="flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1">
        <div className="grid h-9 w-9 place-items-center border-2 border-black/80 font-pixel text-[10px] text-[#111]"
          style={{ background: s[2], boxShadow: 'inset -3px -3px 0 rgba(0,0,0,.25), inset 3px 3px 0 rgba(255,255,255,.35)' }}>{s[0]}</div>
        <div className="whitespace-nowrap font-pixel text-[9px] text-ink/80">{s[1]}</div>
      </div>
    </motion.div>
  )
}

export function Mind() {
  const ref = useRef(null)
  const gulp = useRef(0)
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const morph = useTransform(p, MORPH, [0, 1], { clamp: true })
  const [eaten, setEaten] = useState(0)
  const [size, setSize] = useState(300)
  useEffect(() => {
    const set = () => setSize(window.innerWidth < 768 ? Math.min(230, window.innerHeight * 0.3) : Math.min(340, window.innerHeight * 0.44))
    set(); window.addEventListener('resize', set)
    return () => window.removeEventListener('resize', set)
  }, [])
  useMotionValueEvent(p, 'change', v => {
    const n = Math.max(0, Math.min(N, Math.floor((v - START - WIN * 0.95) / STEP) + 1))
    if (n > eaten) gulp.current = performance.now() + 220
    if (n !== eaten) setEaten(n)
  })
  const done = useTransform(p, [MORPH[1], MORPH[1] + 0.04], [0, 1])
  const eatenIds = new Set(mindSkills.slice(0, eaten).map(s => s[0]))
  const px = size / 30
  const mouth = { x: 0, y: 3.5 * px }
  const rx = Math.min(size * 0.9, typeof window !== 'undefined' ? window.innerWidth * 0.4 : 300), ry = size * 0.62

  return (
    <section ref={ref} id="mind" data-accent="#a593f5" className="relative h-[420vh]">
      <div className={`sticky top-0 grid h-[100svh] grid-rows-[auto_1fr] overflow-hidden pt-24 ${PAD}`}>
        <ChapterTitle title="Inside my head" line="Every skill I learn, the engineer absorbs. Keep scrolling." />
        <div className="grid items-center gap-6 md:grid-cols-[1.1fr_.9fr]">
          <div className="relative mx-auto" style={{ width: size * 0.8, height: size }}>
            {mindSkills.map((s, i) => <OrbitSkill key={s[0]} s={s} i={i} p={p} rx={rx} ry={ry} mouth={mouth} />)}
            <div className="absolute inset-x-[5%] bottom-[-3%] h-[8%] rounded-[50%] bg-[#a593f5]/25 blur-lg" />
            <Character morph={morph} gulp={gulp} className="relative h-full w-full" />
            <div className="absolute left-1/2 top-full mt-5 w-60 -translate-x-1/2 text-center">
              <div className="flex justify-between font-pixel text-[10px] text-ink/80"><span>{eaten < N ? 'Boy · Lvl 1' : 'Evolving'}</span><span>Skills {eaten}/{N}</span></div>
              <div className="mt-1 h-2.5 border border-ink/30 p-px"><div className="h-full bg-[#a593f5] transition-[width] duration-200" style={{ width: `${(eaten / N) * 100}%` }} /></div>
              <motion.div style={{ opacity: done }} className="mt-3 font-pixel text-[13px] text-[#e2c26c]">Level up · AI Engineer</motion.div>
            </div>
          </div>
          <ol className="hidden space-y-7 md:block">
            {mind.map(g => {
              const got = g.skills.filter(id => eatenIds.has(id)).length
              const on = got > 0
              return (
                <li key={g.n} className={`transition-opacity duration-500 ${on ? 'opacity-100' : 'opacity-35'}`}>
                  <div className="font-mono text-[11.5px] text-[#a593f5]">{g.n} &nbsp;{g.lobe}{on && got === g.skills.length ? ' · absorbed' : ''}</div>
                  <div className="mt-1 text-[22px] font-medium">{g.title}</div>
                  <div className="text-[15px] text-ink/70">{g.items}</div>
                </li>
              )
            })}
          </ol>
        </div>
      </div>
    </section>
  )
}
