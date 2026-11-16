import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { profile, lobes, nodes, credits } from './data.js'
import { Header, PlainCV } from './components/Header.jsx'
import Brain from './components/Brain.jsx'
import NodePanel from './components/NodePanel.jsx'
import { ArrowButton } from './components/ui.jsx'

const PAD = 'px-6 sm:px-[max(2.5rem,calc((100vw-80rem)/2+2.5rem))]'
// directions (in the brain's own space) where each lobe label attaches: front, top, side, back
const LOBE_DIRS = [[0, 0.2, 1], [0, 1, -0.1], [1, -0.45, 0.15], [0, 0.15, -1]]

/* Leader lines from each lobe on the 3D brain to its label, drawn every frame. */
function LobeLines({ dots, labels }) {
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
      dots.current.forEach(d => d && (d.style.opacity = vis)) // dots only while the labels are up
      dots.current.forEach((d, i) => {
        const line = svg.children[i], lab = labels.current[i]
        if (!d || !lab || !line) return
        const lr = lab.getBoundingClientRect()
        line.setAttribute('x1', d.dataset.x || 0); line.setAttribute('y1', d.dataset.y || 0)
        line.setAttribute('x2', lr.left - 12); line.setAttribute('y2', lr.top + 10)
      })
    }
    f = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(f)
  }, [dots, labels])
  return (
    <svg ref={svgRef} className="pointer-events-none fixed inset-0 z-[3] hidden h-full w-full md:block" style={{ opacity: 0 }} aria-hidden="true">
      {lobes.map(l => <line key={l.n} stroke="rgba(232,228,218,.55)" strokeWidth="1" />)}
    </svg>
  )
}

export default function App() {
  const [plain, setPlain] = useState(false)
  const [active, setActive] = useState(-1)
  const lobeDots = useRef([]), lobeLabels = useRef([]), nodeTags = useRef([])
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
      <LobeLines dots={lobeDots} labels={lobeLabels} />

      <main className="relative z-[2]">
        {/* 1. the hook, with the brain turning beside it */}
        <section id="hero" className={`flex min-h-[100svh] items-end pb-[22svh] md:items-center md:pb-0 ${PAD}`}>
          <div className="max-w-[640px]">
            <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="font-serif text-[clamp(2.7rem,6vw,5.4rem)] font-medium leading-[0.98] tracking-[-0.025em]">
              I teach AI to follow the rules.
            </motion.h1>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45, duration: 0.8 }}>
              <p className="mt-7 text-[18px] leading-relaxed text-ink/90">I’m {profile.name}, an AI Engineer at Accelerize360 building LLM agents and RAG systems.</p>
              <p className="mt-3 text-[18px] leading-relaxed text-ink/90">The model can propose. My code decides. The numbers prove it.</p>
              <div className="mt-9 flex flex-wrap items-center gap-6">
                <ArrowButton href="#head">Look inside my head</ArrowButton>
                <span className="hidden font-mono text-[12.5px] text-muted sm:inline">Scroll to travel through it.</span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* 2. skills on the lobes */}
        <section id="head" className="relative h-[190vh]">
          <div className={`sticky top-0 flex h-[100svh] flex-col justify-between pb-10 pt-28 ${PAD}`}>
            <div>
              <h2 className="font-serif text-[clamp(2.4rem,5vw,4rem)] font-medium leading-none tracking-[-0.02em]">Inside my head</h2>
              <p className="mt-3 max-w-md text-[17px] text-ink/85">Everything I learn has a place. Keep scrolling and we go in.</p>
            </div>
            <ol className="space-y-6 md:absolute md:right-[max(2.5rem,calc((100vw-80rem)/2+2.5rem))] md:top-1/2 md:w-[340px] md:-translate-y-1/2">
              {lobes.map((l, i) => (
                <li key={l.n} ref={el => (lobeLabels.current[i] = el)}>
                  <div className="font-mono text-[11.5px] text-[#7d97ff]">{l.n} &nbsp;{l.lobe}</div>
                  <div className="mt-1 text-[22px] font-medium leading-tight">{l.title}</div>
                  <div className="text-[14.5px] text-ink/70">{l.items}</div>
                </li>
              ))}
            </ol>
          </div>
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
