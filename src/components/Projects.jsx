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

/* Architecture steps stacked top to bottom, with light packets travelling between them. */
function Flow({ steps }) {
  return (
    <div className="flex flex-col items-stretch">
      {steps.map((s, i) => (
        <div key={i} className="contents">
          {i > 0 && (
            <div aria-hidden="true" className="relative ml-7 h-8 w-2">
              <div className="absolute inset-0 mx-auto h-full w-[2px] bg-gradient-to-b from-cyan/60 to-violet/60" />
              <span className="packet absolute left-0 top-0 h-2 w-2 rounded-full" style={{ background: KIND[s.kind].dot, boxShadow: `0 0 10px 2px ${KIND[s.kind].dot}`, animationDelay: `${i * -0.3}s` }} />
            </div>
          )}
          <motion.div
            initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
            className="flex items-start gap-3 rounded-2xl border border-line bg-black/30 p-4">
            <span className={`mt-0.5 shrink-0 rounded-md border px-2 py-0.5 font-mono text-[10.5px] font-semibold uppercase tracking-wider ${KIND[s.kind].cls}`}>{KIND[s.kind].tag}</span>
            <div><div className="font-display text-base font-bold leading-tight">{s.title}</div><div className="mt-1 text-[13px] leading-snug text-muted">{s.text}</div></div>
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

/* Full story of one project, shown in its map panel. */
export function ProjectBody({ p }) {
  return (
    <div className="space-y-7">
      <div className="flex flex-wrap items-center gap-2">
        {p.live
          ? <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-300"><i className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />Live</span>
          : <span className="rounded-full border border-line px-2.5 py-0.5 text-xs font-semibold text-ink/80">Open source</span>}
        <span className="font-mono text-xs text-muted">{p.kind}</span>
        <div className="ml-auto flex gap-2">
          {p.live && <Button href={p.live} variant="primary" className="!px-4 !py-2"><Icon.play />Live demo</Button>}
          <Button href={p.code} className="!px-4 !py-2"><Icon.github />Code</Button>
        </div>
      </div>
      <p className="text-lg text-ink">{p.tagline}</p>

      {p.video
        ? (<div className="space-y-3">
            <HoloFrame url={p.live.replace('https://', '')}><DemoVideo src={p.video} poster={p.poster} label={`Screen recording of ${p.name}`} /></HoloFrame>
            <p className="text-sm text-muted">{p.caption}</p>
          </div>)
        : <div className="hud rounded-2xl border border-line bg-black/30 p-5"><Corners /><Bars bars={p.bars} /></div>}

      <p className="leading-relaxed text-muted">{p.summary}</p>
      <div className="grid grid-cols-2 gap-3">
        {p.metrics.map(m => (
          <div key={m.label} className="rounded-2xl border border-line bg-black/30 p-4">
            <div className="font-display text-2xl font-bold tracking-tight text-cyan">{m.value}</div>
            <div className="mt-1 text-[13px] leading-snug text-muted">{m.label}</div>
          </div>
        ))}
      </div>
      {p.login && <CopyLogin login={p.login} />}

      <div>
        <h4 className="mb-3 font-display text-lg font-bold">How it works</h4>
        <div className="mb-4 flex flex-wrap gap-2 text-xs text-muted">
          {[...new Set(p.flow.map(s => s.kind))].map(k => <span key={k} className={`rounded-md border px-2 py-0.5 font-mono font-semibold ${KIND[k].cls}`}>{KIND[k].tag}</span>)}
          <span className="self-center">· glowing packets show data moving through the system</span>
        </div>
        <Flow steps={p.flow} />
      </div>
      {p.extra?.type === 'rubric' && <Rubric extra={p.extra} />}
      {p.extra?.type === 'note' && (<div><h4 className="font-display text-lg font-bold">{p.extra.title}</h4><p className="mt-2 leading-relaxed text-muted">{p.extra.note}</p></div>)}
      {!p.extra && <div><h4 className="font-display text-lg font-bold">Why hybrid search</h4><p className="mt-2 leading-relaxed text-muted">Embeddings miss exact terms like “PTO” or “183 days”; BM25 catches them. Fusing both and reranking with a cross-encoder put the right answer in the top 4 for 92.9% of questions.</p></div>}
      <CodeWindow file={p.snippet.file} note="simplified from the repo" code={p.snippet.code} />
      <div className="flex flex-wrap gap-1.5">
        {p.stack.map(s => <span key={s} className="rounded-full border border-line bg-white/[.03] px-2.5 py-0.5 font-mono text-[11.5px] text-muted">{s}</span>)}
      </div>
    </div>
  )
}
