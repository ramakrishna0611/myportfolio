import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { profile, lobes, nodes, credits } from './data.js'
import { Header, PlainCV } from './components/Header.jsx'
import Brain from './components/Brain.jsx'
import NodePanel from './components/NodePanel.jsx'
import { ArrowButton } from './components/ui.jsx'

const PAD = 'px-6 sm:px-[max(2.5rem,calc((100vw-80rem)/2+2.5rem))]'
// directions (in the brain's own space) where each lobe label attaches: front, top, side, back
const LOBE_DIRS = [[0, 0.2, -1], [0, 1, 0.2], [0.5, -0.6, -0.65], [0, 0.15, 1]]

/* Leader lines from each lobe on the 3D brain to its label, drawn every frame. */
function LobeLines({ dots, labels, overlay }) {
  const svgRef = useRef(null)
  useEffect(() => {
    let f = 0
    const draw = () => {
      f = requestAnimationFrame(draw)
      const head = document.getElementById('head')
      const svg = svgRef.current
      if (!head || !svg) return
      const r = head.getBoundingClientRect(), vh = window.innerHeight
      const vis = Math.min(1, Math.max(0, Math.min((vh * 0.75 - r.top) / (vh * 0.4), (r.bottom - vh * 0.6) / (vh * 0.4))))
      svg.style.opacity = vis
      if (overlay.current) overlay.current.style.opacity = vis
      dots.current.forEach(d => d && (d.style.opacity = vis)) // dots only while the labels are up
      dots.current.forEach((d, i) => {
        const line = svg.children[i], lab = labels.current[i]
        if (!d || !lab || !line) return
        const lr = lab.getBoundingClientRect(), leftSide = lr.right < window.innerWidth / 2
        line.setAttribute('x1', d.dataset.x || 0); line.setAttribute('y1', d.dataset.y || 0)
        line.setAttribute('x2', leftSide ? lr.right + 12 : lr.left - 12); line.setAttribute('y2', lr.top + 10)
      })
    }
    f = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(f)
  }, [dots, labels, overlay])
  return (
    <svg ref={svgRef} className="pointer-events-none fixed inset-0 z-[3] hidden h-full w-full md:block" style={{ opacity: 0 }} aria-hidden="true">
      {lobes.map(l => <line key={l.n} stroke="rgba(232,228,218,.55)" strokeWidth="1" />)}
    </svg>
  )
}

const LobeLabel = ({ l, small, ref }) => (
  <li ref={ref}>
    <div className={`font-mono text-[#7d97ff] ${small ? 'text-[10.5px]' : 'text-[11.5px]'}`}>{l.n} &nbsp;{l.lobe}</div>
    <div className={`mt-1 font-serif leading-tight ${small ? 'text-[19px]' : 'text-[27px]'}`}>{l.title}</div>
    <div className={`text-ink/65 ${small ? 'text-[12.5px] leading-snug' : 'mt-0.5 text-[14px]'}`}>{l.items}</div>
  </li>
)

export default function App() {
  const [plain, setPlain] = useState(false)
  const [active, setActive] = useState(-1)
  const lobeDots = useRef([]), lobeLabels = useRef([]), nodeTags = useRef([]), lobeOverlay = useRef(null)
  const labelRefs = useRef({ lobeDots: lobeDots.current, nodeTags: nodeTags.current })

  return (
    <div className="grain">
      <Brain onNode={setActive} lobeAnchors={LOBE_DIRS} labelRefs={labelRefs} />
      <Header onPlain={() => setPlain(true)} />

      {/* points on the brain that the leader lines start from, and node names inside the network */}
      <div className="pointer-events-none fixed inset-0 z-[3]" aria-hidden="true">
        {lobes.map((l, i) => (
          <span key={l.n} ref={el => (lobeDots.current[i] = el)} className="absolute left-0 top-0 hidden md:block">
            <span className="block h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-ink bg-bg" />
          </span>
        ))}
        {nodes.map((n, i) => (
          <span key={n.id} ref={el => (nodeTags.current[i] = el)} className="absolute left-0 top-0 whitespace-nowrap font-mono text-[11.5px] text-ink/80" style={{ opacity: 0 }}>
            {String(i + 1).padStart(2, '0')} · {n.label}
          </span>
        ))}
      </div>
      <LobeLines dots={lobeDots} labels={lobeLabels} overlay={lobeOverlay} />

      {/* skills on the lobes: fixed beside the brain, fading in and out rather than scrolling away */}
      <div ref={lobeOverlay} className="pointer-events-none fixed inset-0 z-[4]" style={{ opacity: 0 }}>
        <div id="head-copy" className="absolute inset-x-0 top-[88px] px-6 text-center md:top-[96px]">
          <h2 className="font-serif text-[clamp(2.4rem,5vw,4rem)] font-normal leading-none tracking-[-0.02em]">Inside my head</h2>
          <p className="mt-2 text-[15px] text-ink/70">Everything I learn has a place. Keep scrolling and we go in.</p>
        </div>
        {[[0, 1], [2, 3]].map((pair, side) => (
          <ol key={side} id={side ? 'lobe-r' : 'lobe-l'} className={`absolute top-1/2 hidden w-[min(300px,26vw)] -translate-y-1/2 space-y-14 md:block ${side ? 'right-[max(2.5rem,calc((100vw-80rem)/2+2.5rem))]' : 'left-[max(2.5rem,calc((100vw-80rem)/2+2.5rem))] text-right'}`}>
            {pair.map(i => <LobeLabel key={i} l={lobes[i]} ref={el => (lobeLabels.current[i] = el)} />)}
          </ol>
        ))}
        <ol id="lobe-grid" className="absolute inset-x-0 bottom-6 grid grid-cols-2 gap-x-5 gap-y-4 px-6 md:hidden">
          {lobes.map(l => <LobeLabel key={l.n} l={l} small />)}
        </ol>
      </div>

      <main className="relative z-[2]">
        {/* 1. the hook, with the brain turning beside it */}
        <section id="hero" className={`flex min-h-[100svh] flex-col items-center pt-[13svh] text-center md:pt-[12svh] [@media(max-height:760px)]:md:pt-[96px] ${PAD}`}>
          <div id="hero-copy" className="max-w-[860px]">
            <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="font-serif text-[clamp(2.6rem,5.6vw,5rem)] font-normal leading-[0.98] [@media(max-height:760px)]:md:text-[3.4rem] tracking-[-0.025em]">
              I teach AI to follow the rules.
            </motion.h1>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45, duration: 0.8 }}>
              <p className="mx-auto mt-5 max-w-[620px] text-[16.5px] [@media(max-height:760px)]:mt-3 [@media(max-height:760px)]:text-[15px] leading-relaxed text-ink/75">
                I’m {profile.name}, an AI Engineer at Accelerize360 building LLM agents and RAG systems. The model can propose. My code decides. The numbers prove it.
              </p>
              <div className="mt-7 flex flex-wrap items-center justify-center gap-6 [@media(max-height:760px)]:mt-5">
                <ArrowButton href="#head">Look inside my head</ArrowButton>
                <span className="hidden font-mono text-[12.5px] text-muted sm:inline">or scroll to travel through it</span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* 2. skills on the lobes (the labels live in the fixed overlay above; this is the scroll distance) */}
        <section id="head" className="relative h-[190vh]" aria-label="Skills by lobe">
          <ul className="sr-only">{lobes.map(l => <li key={l.n}>{l.title}: {l.items}</li>)}</ul>
        </section>

        {/* 3. the dive */}
        <section id="dive" className="relative h-[160vh]">
          <div className="sticky top-0 flex h-[100svh] items-end justify-center pb-16">
            <p className="font-mono text-[12.5px] text-muted">Going in. Every neuron is a part of my story.</p>
          </div>
        </section>

        {/* 4. one stretch of scroll per neuron; the panel opens when the camera arrives */}
        {nodes.map(n => (
          <section key={n.id} id={`n-${n.id}`} className="h-[135vh]" aria-label={n.label} />
        ))}

        <footer className={`dash-line relative flex flex-wrap justify-between gap-3 bg-bg/80 py-6 font-mono text-[11px] text-muted ${PAD}`}>
          <span>© {new Date().getFullYear()} {profile.name} · Built with AI, React and Three.js</span>
          <span>
            Brain: “<a className="underline underline-offset-4" href={credits.brain.source} target="_blank" rel="noopener">{credits.brain.title}</a>” by {credits.brain.author}, NIH 3D,{' '}
            <a className="underline underline-offset-4" href={credits.brain.licenseUrl} target="_blank" rel="noopener">{credits.brain.license}</a>; simplified and compressed.
          </span>
        </footer>
      </main>

      <NodePanel active={active} />
      <PlainCV open={plain} onClose={() => setPlain(false)} />
    </div>
  )
}
