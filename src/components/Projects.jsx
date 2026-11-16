import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { projects } from '../data.js'
import { Button, CodeWindow, Icon, Reveal, SectionHeader } from './ui.jsx'

const KIND = {
  in:    { tag: 'Input', cls: 'bg-amber-100 text-amber-900 dark:bg-amber-400/15 dark:text-amber-300' },
  ai:    { tag: 'LLM', cls: 'bg-violet-100 text-violet-800 dark:bg-violet-400/15 dark:text-violet-300' },
  code:  { tag: 'Code', cls: 'bg-slate-200 text-slate-800 dark:bg-slate-400/15 dark:text-slate-300' },
  ml:    { tag: 'ML model', cls: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-400/15 dark:text-emerald-300' },
  human: { tag: 'Human', cls: 'bg-yellow-200 text-yellow-900 dark:bg-yellow-400/20 dark:text-yellow-300' },
}

/* Autoplays muted while on screen, pauses when scrolled away. */
function DemoVideo({ src, poster, label }) {
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
      className="block aspect-[16/10] w-full bg-[#111] object-cover object-top">
      <source src={src} type="video/mp4" />
    </video>
  )
}

function BrowserFrame({ url, children }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_24px_60px_-30px_rgba(0,0,0,.45)]">
      <div className="flex items-center gap-2 border-b border-line bg-surface-2 px-3 py-2">
        <span className="flex gap-1.5"><i className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]" /><i className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" /><i className="h-2.5 w-2.5 rounded-full bg-[#27c93f]" /></span>
        <span className="ml-2 flex min-w-0 flex-1 items-center gap-2 truncate rounded-md bg-bg px-2.5 py-1 font-mono text-[11px] text-muted">
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" />{url}
        </span>
      </div>
      {children}
    </div>
  )
}

function Flow({ steps }) {
  return (
    <div className="flex flex-col items-stretch min-[900px]:flex-row">
      {steps.map((s, i) => (
        <div key={i} className="contents">
          {i > 0 && (
            <div aria-hidden="true" className="relative mx-auto h-7 w-2 min-[900px]:mx-0 min-[900px]:h-2 min-[900px]:w-8 min-[900px]:self-center">
              <div className="absolute inset-0 m-auto h-full w-[2px] bg-line min-[900px]:h-[2px] min-[900px]:w-full" />
              <span className="pipe-dot absolute left-0 top-0 h-2 w-2 rounded-full bg-accent ring-2 ring-ink" style={{ animationDelay: `${i * -0.3}s` }} />
            </div>
          )}
          <motion.div
            initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
            className="flex-1 rounded-2xl border border-line bg-bg p-4 min-[900px]:min-w-0">
            <span className={`inline-block rounded-md px-2 py-0.5 font-mono text-[10.5px] font-semibold uppercase tracking-wider ${KIND[s.kind].cls}`}>{KIND[s.kind].tag}</span>
            <div className="mt-2 font-display text-base font-bold leading-tight">{s.title}</div>
            <div className="mt-1 text-[13px] leading-snug text-muted">{s.text}</div>
          </motion.div>
        </div>
      ))}
    </div>
  )
}

function Rubric({ extra }) {
  const colors = ['#a78bfa', '#34d399', '#ffc21a', '#94a3b8']
  return (
    <div>
      <h4 className="font-display text-lg font-bold">{extra.title}</h4>
      <div className="mt-3 flex h-10 overflow-hidden rounded-xl border border-ink text-xs font-bold text-[#14151a]">
        {extra.parts.map(([l, v], i) => (
          <motion.div key={l} className="flex items-center justify-center border-r border-ink last:border-r-0" style={{ background: colors[i] }}
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
      <div className="mt-4 space-y-3">
        {bars.map(([l, v], i) => (
          <div key={l}>
            <div className="mb-1 flex justify-between text-sm"><span className="text-muted">{l}</span><span className="font-mono font-semibold">{v}%</span></div>
            <div className="h-3 overflow-hidden rounded-full bg-surface-2">
              <motion.div className="h-full rounded-full" style={{ background: i === bars.length - 1 ? '#ffc21a' : '#9aa1ad' }}
                initial={{ width: 0 }} whileInView={{ width: `${v}%` }} viewport={{ once: true }} transition={{ duration: 0.9, delay: i * 0.15 }} />
            </div>
          </div>
        ))}
      </div>
      <p className="mt-3 text-sm text-muted">Measured on 14 in-scope questions. The test set is small and hand-written; the README lists the limits.</p>
    </div>
  )
}

function CopyLogin({ login }) {
  const [copied, setCopied] = useState(null)
  const copy = v => navigator.clipboard?.writeText(v).then(() => { setCopied(v); setTimeout(() => setCopied(null), 1300) })
  return (
    <div className="rounded-2xl border border-dashed border-line p-3.5">
      <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">Demo login</div>
      <div className="flex flex-wrap gap-2">
        {login.map(([k, v]) => (
          <button key={k} onClick={() => copy(v)} title={`Copy ${k.toLowerCase()}`}
            className="group inline-flex items-center gap-1.5 rounded-lg bg-surface-2 px-2.5 py-1 text-left font-mono text-xs transition hover:bg-accent hover:text-accent-ink">
            <span className="text-muted group-hover:text-accent-ink/70">{k}</span><span className="font-semibold">{copied === v ? 'copied ✓' : v}</span>
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
    <Reveal as="article" className="rounded-[2rem] border border-line bg-surface p-5 sm:p-8">
      <div className="flex flex-wrap items-start gap-4">
        <div className="min-w-0 flex-1 basis-80">
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-muted">
            <span>Project {String(i + 1).padStart(2, '0')}</span><span>·</span><span>{p.kind}</span>
            {p.live
              ? <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2 py-0.5 font-semibold normal-case tracking-normal text-emerald-700 dark:text-emerald-400"><i className="h-1.5 w-1.5 rounded-full bg-emerald-500" />Live</span>
              : <span className="rounded-full bg-surface-2 px-2 py-0.5 font-semibold normal-case tracking-normal">Open source</span>}
          </div>
          <h3 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">{p.name}</h3>
          <p className="mt-2 text-lg text-ink">{p.tagline}</p>
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
              <div key={m.label} className="rounded-2xl bg-surface-2 p-4">
                <div className="font-display text-2xl font-bold tracking-tight sm:text-3xl">{m.value}</div>
                <div className="mt-1 text-[13px] leading-snug text-muted">{m.label}</div>
              </div>
            ))}
          </div>
          <div className="mt-5 flex flex-wrap gap-1.5">
            {p.stack.map(s => <span key={s} className="rounded-full border border-line px-2.5 py-0.5 font-mono text-[11.5px] text-muted">{s}</span>)}
          </div>
        </div>
        <div className="min-w-0 space-y-4">
          {p.video ? (
            <>
              <BrowserFrame url={p.live.replace('https://', '')}><DemoVideo src={p.video} poster={p.poster} label={`Screen recording of ${p.name}`} /></BrowserFrame>
              <p className="text-sm text-muted">{p.caption}</p>
              <CopyLogin login={p.login} />
            </>
          ) : (
            <div className="rounded-2xl border border-line bg-bg p-5"><Bars bars={p.bars} /></div>
          )}
        </div>
      </div>

      <div className="mt-8 border-t border-line pt-6">
        <button onClick={() => setOpen(o => !o)} aria-expanded={open}
          className="inline-flex items-center gap-2 rounded-full border border-ink px-4 py-2 text-sm font-semibold transition hover:bg-ink hover:text-bg">
          <motion.span animate={{ rotate: open ? 90 : 0 }}><Icon.arrow /></motion.span>
          {open ? 'Hide how it works' : 'How it works'}
        </button>
        <AnimatePresence initial={false}>
          {open && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }} className="overflow-hidden">
              <div className="pb-3 pt-6">
                <div className="mb-4 flex flex-wrap gap-2 text-xs text-muted">
                  {[...new Set(p.flow.map(s => s.kind))].map(k => <span key={k} className={`rounded-md px-2 py-0.5 font-mono font-semibold ${KIND[k].cls}`}>{KIND[k].tag}</span>)}
                  <span className="self-center">· yellow dots show data moving through the system</span>
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
    </Reveal>
  )
}

export default function Projects() {
  return (
    <section id="projects" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
      <SectionHeader stop={4} title="Projects" kicker="Built from scratch · try them live" />
      <div className="space-y-8">
        {projects.map((p, i) => <ProjectCard key={p.id} p={p} i={i} />)}
      </div>
    </section>
  )
}
