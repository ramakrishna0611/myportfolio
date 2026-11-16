import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { projects } from '../data.js'
import { Button, CodeWindow, Corners, Icon, Reveal, SectionHeader, spotlight } from './ui.jsx'

const KIND = {
  in:    { tag: 'Input',    cls: 'border-amber-300/40 bg-amber-300/10 text-amber-200', dot: '#ffb547' },
  ai:    { tag: 'LLM',      cls: 'border-violet-400/50 bg-violet-400/15 text-violet-200', dot: '#a78bfa' },
  code:  { tag: 'Code',     cls: 'border-cyan/40 bg-cyan/10 text-cyan', dot: '#4de1ff' },
  ml:    { tag: 'ML model', cls: 'border-emerald-400/40 bg-emerald-400/10 text-emerald-200', dot: '#34d399' },
  human: { tag: 'Human',    cls: 'border-yellow-300/50 bg-yellow-300/10 text-yellow-200', dot: '#fde047' },
}

/* Autoplays muted while on screen, pauses when scrolled away. */
export function DemoVideo({ src, poster, label }) {
  const ref = useRef(null)
  useEffect(() => {
    const v = ref.current
    if (!v) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { v.controls = true; return }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        if (v.preload === 'none') { v.preload = 'auto'; v.load() }
        v.play()?.catch(() => { v.controls = true })
      } else v.pause()
    }, { threshold: 0.35 })
    io.observe(v)
    return () => io.disconnect()
  }, [])
  return (
    <video ref={ref} muted loop playsInline preload="none" poster={poster} aria-label={label}
      className="block aspect-[16/10] w-full bg-[#0b0e18] object-cover object-top">
      <source src={src} type="video/mp4" />
    </video>
  )
}

function HoloFrame({ url, children }) {
  return (
    <div className="hud rounded-2xl">
      <Corners />
      <div className="overflow-hidden rounded-2xl border border-cyan/25 bg-[#0b0e18] shadow-[0_0_50px_-12px_rgba(77,225,255,.35)]">
        <div className="flex items-center gap-2 border-b border-line bg-white/[.03] px-3 py-2">
          <span className="flex gap-1.5"><i className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]" /><i className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" /><i className="h-2.5 w-2.5 rounded-full bg-[#27c93f]" /></span>
          <span className="ml-2 flex min-w-0 flex-1 items-center gap-2 truncate rounded-md bg-black/40 px-2.5 py-1 font-mono text-[11px] text-muted">
            <span className="h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-red-500" />{url}
          </span>
        </div>
        {children}
      </div>
    </div>
  )
}

function Flow({ steps }) {
  return (
    <div className="flex flex-col items-stretch min-[900px]:flex-row">
      {steps.map((s, i) => (
        <div key={i} className="contents">
          {i > 0 && (
            <div aria-hidden="true" className="relative mx-auto h-8 w-2 min-[900px]:mx-0 min-[900px]:h-2 min-[900px]:w-9 min-[900px]:self-center">
              <div className="absolute inset-0 m-auto h-full w-[2px] bg-gradient-to-b from-cyan/60 to-violet/60 min-[900px]:h-[2px] min-[900px]:w-full min-[900px]:bg-gradient-to-r" />
              <span className="packet absolute left-0 top-0 h-2 w-2 rounded-full" style={{ background: KIND[s.kind].dot, boxShadow: `0 0 10px 2px ${KIND[s.kind].dot}`, animationDelay: `${i * -0.3}s` }} />
            </div>
          )}
          <motion.div
            initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
            className="flex-1 rounded-2xl border border-line bg-black/30 p-4 min-[900px]:min-w-0">
            <span className={`inline-block rounded-md border px-2 py-0.5 font-mono text-[10.5px] font-semibold uppercase tracking-wider ${KIND[s.kind].cls}`}>{KIND[s.kind].tag}</span>
            <div className="mt-2 font-display text-base font-bold leading-tight">{s.title}</div>
            <div className="mt-1 text-[13px] leading-snug text-muted">{s.text}</div>
          </motion.div>
        </div>
      ))}
    </div>
  )
}

function Rubric({ extra }) {
  const colors = ['#a78bfa', '#34d399', '#4de1ff', '#ffb547']
  return (
    <div>
      <h4 className="font-display text-lg font-bold">{extra.title}</h4>
      <div className="mt-3 flex h-10 overflow-hidden rounded-xl border border-line text-xs font-bold text-[#05070f]">
        {extra.parts.map(([l, v], i) => (
          <motion.div key={l} className="flex items-center justify-center border-r border-black/30 last:border-r-0" style={{ background: colors[i] }}
            initial={{ width: 0 }} whileInView={{ width: `${v}%` }} viewport={{ once: true }} transition={{ duration: 0.8, delay: i * 0.12 }}>{v}</motion.div>
        ))}
      </div>
      <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-muted">
        {extra.parts.map(([l], i) => <span key={l} className="flex items-center gap-2"><i className="h-2.5 w-2.5 rounded-sm" style={{ background: colors[i] }} />{l}</span>)}
      </div>
      <p className="mt-3 text-sm leading-relaxed text-muted">{extra.note}</p>
    </div>
  )
}

function Bars({ bars }) {
  return (
    <div>
      <h4 className="font-display text-lg font-bold">Retrieval: answer found in the top 4</h4>
      <div className="mt-4 space-y-4">
        {bars.map(([l, v], i) => {
          const best = i === bars.length - 1
          return (
            <div key={l}>
              <div className="mb-1.5 flex justify-between text-sm"><span className="text-muted">{l}</span><span className={`font-mono font-semibold ${best ? 'text-cyan' : ''}`}>{v}%</span></div>
              <div className="h-2.5 overflow-hidden rounded-full bg-white/5">
                <motion.div className="h-full rounded-full" style={{ background: best ? 'linear-gradient(90deg,#4de1ff,#8b5cf6)' : '#4b5368', boxShadow: best ? '0 0 16px rgba(77,225,255,.6)' : 'none' }}
                  initial={{ width: 0 }} whileInView={{ width: `${v}%` }} viewport={{ once: true }} transition={{ duration: 0.9, delay: i * 0.15 }} />
              </div>
            </div>
          )
        })}
      </div>
      <p className="mt-4 text-sm text-muted">Measured on 14 in-scope questions. The test set is small and hand-written; the README lists the limits.</p>
    </div>
  )
}

function CopyLogin({ login }) {
  const [copied, setCopied] = useState(null)
  const copy = v => navigator.clipboard?.writeText(v).then(() => { setCopied(v); setTimeout(() => setCopied(null), 1300) })
  return (
    <div className="rounded-2xl border border-dashed border-cyan/30 bg-cyan/[.03] p-3.5">
      <div className="mb-2 font-mono text-[11px] uppercase tracking-[0.2em] text-cyan">Demo access · click to copy</div>
      <div className="flex flex-wrap gap-2">
        {login.map(([k, v]) => (
          <button key={k} onClick={() => copy(v)} title={`Copy ${k.toLowerCase()}`}
            className="group inline-flex items-center gap-1.5 rounded-lg border border-line bg-white/[.04] px-2.5 py-1 text-left font-mono text-xs transition hover:border-cyan hover:bg-cyan/15">
            <span className="text-muted">{k}</span><span className="font-semibold text-ink">{copied === v ? 'copied ✓' : v}</span>
          </button>
        ))}
      </div>
      <p className="mt-2 text-xs text-muted">Free hosting sleeps when idle, so the first load can take about a minute.</p>
    </div>
  )
}

function ProjectCard({ p, i }) {
  const [open, setOpen] = useState(false)
  return (
    <Reveal as="article">
      <div id={p.id} onMouseMove={spotlight} className="glass spot scroll-mt-24 rounded-[2rem] p-5 sm:p-8">
        <div className="flex flex-wrap items-start gap-4">
          <div className="min-w-0 flex-1 basis-80">
            <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
              <span className="text-cyan">Module {String(i + 1).padStart(2, '0')}</span><span>·</span><span>{p.kind}</span>
              {p.live
                ? <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2 py-0.5 font-semibold normal-case tracking-normal text-emerald-300"><i className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />Live</span>
                : <span className="rounded-full border border-line px-2 py-0.5 font-semibold normal-case tracking-normal text-ink/80">Open source</span>}
            </div>
            <h3 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">{p.name}</h3>
            <p className="mt-2 text-lg text-ink/90">{p.tagline}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {p.live && <Button href={p.live} variant="primary"><Icon.play />Live demo</Button>}
            <Button href={p.code}><Icon.github />Code</Button>
          </div>
        </div>

        <div className="mt-7 grid gap-8 lg:grid-cols-[1fr_1.15fr]">
          <div className="min-w-0">
            <p className="leading-relaxed text-muted">{p.summary}</p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              {p.metrics.map(m => (
                <div key={m.label} className="rounded-2xl border border-line bg-black/30 p-4">
                  <div className="font-display text-2xl font-bold tracking-tight text-cyan sm:text-3xl">{m.value}</div>
                  <div className="mt-1 text-[13px] leading-snug text-muted">{m.label}</div>
                </div>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap gap-1.5">
              {p.stack.map(s => <span key={s} className="rounded-full border border-line bg-white/[.03] px-2.5 py-0.5 font-mono text-[11.5px] text-muted">{s}</span>)}
            </div>
          </div>
          <div className="min-w-0 space-y-4">
            {p.video ? (
              <>
                <HoloFrame url={p.live.replace('https://', '')}><DemoVideo src={p.video} poster={p.poster} label={`Screen recording of ${p.name}`} /></HoloFrame>
                <p className="text-sm text-muted">{p.caption}</p>
                <CopyLogin login={p.login} />
              </>
            ) : (
              <div className="hud rounded-2xl border border-line bg-black/30 p-5"><Corners /><Bars bars={p.bars} /></div>
            )}
          </div>
        </div>

        <div className="mt-8 border-t border-line pt-6">
          <button onClick={() => setOpen(o => !o)} aria-expanded={open}
            className="inline-flex items-center gap-2 rounded-full border border-cyan/50 bg-cyan/10 px-4 py-2 text-sm font-semibold text-cyan transition hover:bg-cyan/20 hover:shadow-[0_0_20px_rgba(77,225,255,.3)]">
            <motion.span animate={{ rotate: open ? 90 : 0 }}><Icon.arrow /></motion.span>
            {open ? 'Hide how it works' : 'How it works · architecture'}
          </button>
          <AnimatePresence initial={false}>
            {open && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }} className="overflow-hidden">
                <div className="pb-3 pt-6">
                  <div className="mb-4 flex flex-wrap gap-2 text-xs text-muted">
                    {[...new Set(p.flow.map(s => s.kind))].map(k => <span key={k} className={`rounded-md border px-2 py-0.5 font-mono font-semibold ${KIND[k].cls}`}>{KIND[k].tag}</span>)}
                    <span className="self-center">· glowing packets show data moving through the system</span>
                  </div>
                  <Flow steps={p.flow} />
                  <div className="mt-6 grid gap-6 lg:grid-cols-2">
                    <div className="min-w-0">
                      {p.extra?.type === 'rubric' && <Rubric extra={p.extra} />}
                      {p.extra?.type === 'note' && (<><h4 className="font-display text-lg font-bold">{p.extra.title}</h4><p className="mt-2 leading-relaxed text-muted">{p.extra.note}</p></>)}
                      {!p.extra && <><h4 className="font-display text-lg font-bold">Why hybrid search</h4><p className="mt-2 leading-relaxed text-muted">Embeddings miss exact terms like “PTO” or “183 days”; BM25 catches them. Fusing both and reranking with a cross-encoder put the right answer in the top 4 for 92.9% of questions.</p></>}
                    </div>
                    <CodeWindow className="min-w-0" file={p.snippet.file} note="simplified from the repo" code={p.snippet.code} />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Reveal>
  )
}

export default function Projects() {
  return (
    <section id="projects" className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
      <SectionHeader n={4} code="station modules" title="Projects" sub="Built from scratch. Every number comes from the project’s own tests or evaluation run." />
      <div className="space-y-8">
        {projects.map((p, i) => <ProjectCard key={p.id} p={p} i={i} />)}
      </div>
    </section>
  )
}
