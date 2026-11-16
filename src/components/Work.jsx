import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { profile, experience, projects, certifications } from '../data.js'
import { ArrowButton, ChapterTitle, CodeWindow, Icon, Reveal, TextLink } from './ui.jsx'

const PAD = 'px-6 sm:px-[max(2.5rem,calc((100vw-80rem)/2+2.5rem))]'
const ACCENTS = { sieve: '#e2c26c', away: '#e8876a', 'hr-rag': '#74d8c4' }

const KIND = {
  in: { tag: 'Input', c: '#e2c26c' },
  ai: { tag: 'LLM', c: '#a593f5' },
  code: { tag: 'Code', c: '#8fb0ff' },
  ml: { tag: 'ML model', c: '#74d8c4' },
  human: { tag: 'Human', c: '#e8876a' },
}

/* Autoplays muted while on screen, pauses when scrolled away. */
function DemoVideo({ src, poster, label }) {
  const ref = useRef(null)
  useEffect(() => {
    const v = ref.current
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { v.controls = true; return }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { if (v.preload === 'none') { v.preload = 'auto'; v.load() } v.play()?.catch(() => { v.controls = true }) }
      else v.pause()
    }, { threshold: 0.35 })
    io.observe(v)
    return () => io.disconnect()
  }, [])
  return (
    <video ref={ref} muted loop playsInline preload="none" poster={poster} aria-label={label} className="block aspect-[16/10] w-full bg-[#0b0c0e] object-cover object-top">
      <source src={src} type="video/mp4" />
    </video>
  )
}

/* ---------------- chapter: at work ---------------- */
export function Experience() {
  return (
    <section id="experience" data-accent="#8fb0ff" className={`relative py-32 ${PAD}`}>
      <Reveal><ChapterTitle title="At work" line={`${experience.role}, ${experience.company} · ${experience.dates.replace('–', 'to')}`} /></Reveal>
      <ol className="mt-14 grid gap-x-16 gap-y-10 md:grid-cols-2">
        {experience.points.map(([a, b, c], i) => (
          <Reveal as="li" key={i} delay={i * 0.06} className="border-t border-line pt-5">
            <div className="font-mono text-[11.5px] text-[#8fb0ff]">{String(i + 1).padStart(2, '0')}</div>
            <div className="mt-2 text-[21px] font-medium leading-snug">{b[0].toUpperCase() + b.slice(1)}</div>
            <p className="mt-2 text-[15.5px] leading-relaxed text-ink/70">{a}<span className="text-ink/90">{b}</span>{c}</p>
          </Reveal>
        ))}
      </ol>
    </section>
  )
}

/* ---------------- chapters: the projects ---------------- */
function Flow({ steps }) {
  return (
    <div>
      {steps.map((s, i) => (
        <div key={i}>
          {i > 0 && (
            <div aria-hidden="true" className="relative ml-[13px] h-7 w-2">
              <div className="absolute inset-y-0 left-[3px] w-px bg-line" />
              <span className="packet absolute left-0 top-0 h-2 w-2 rounded-full" style={{ background: KIND[s.kind].c, boxShadow: `0 0 8px ${KIND[s.kind].c}`, animationDelay: `${i * -0.3}s` }} />
            </div>
          )}
          <div className="flex items-start gap-4">
            <span className="mt-1 h-[9px] w-[9px] shrink-0 translate-x-[10px] rounded-full" style={{ background: KIND[s.kind].c }} />
            <div className="pl-3">
              <div className="font-mono text-[10.5px] uppercase tracking-wider" style={{ color: KIND[s.kind].c }}>{KIND[s.kind].tag}</div>
              <div className="text-[17px] font-medium">{s.title}</div>
              <div className="text-[14px] leading-snug text-ink/65">{s.text}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function Rubric({ extra, color }) {
  return (
    <div>
      <div className="text-[19px] font-medium">{extra.title}</div>
      <div className="mt-4 flex h-9 overflow-hidden rounded-sm font-mono text-[11.5px] text-[#121315]">
        {extra.parts.map(([l, v], i) => (
          <motion.div key={l} className="flex items-center justify-center" style={{ background: color, opacity: 1 - i * 0.2 }}
            initial={{ width: 0 }} whileInView={{ width: `${v}%` }} viewport={{ once: true }} transition={{ duration: 0.8, delay: i * 0.1 }}>{v}</motion.div>
        ))}
      </div>
      <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-[13.5px] text-ink/70">
        {extra.parts.map(([l], i) => <span key={l} className="flex items-center gap-2"><i className="h-2 w-2" style={{ background: color, opacity: 1 - i * 0.2 }} />{l}</span>)}
      </div>
      <p className="mt-3 text-[14.5px] leading-relaxed text-ink/70">{extra.note}</p>
    </div>
  )
}

function Bars({ bars, color }) {
  return (
    <div>
      <div className="text-[19px] font-medium">Answer found in the top 4 retrieved chunks</div>
      <div className="mt-5 space-y-5">
        {bars.map(([l, v], i) => {
          const best = i === bars.length - 1
          return (
            <div key={l}>
              <div className="mb-2 flex justify-between text-[14px]"><span className={best ? 'text-ink' : 'text-ink/65'}>{l}</span><span className="font-mono">{v}%</span></div>
              <div className="h-[3px] bg-line">
                <motion.div className="h-full" style={{ background: best ? color : 'rgba(232,228,218,.45)' }}
                  initial={{ width: 0 }} whileInView={{ width: `${v}%` }} viewport={{ once: true }} transition={{ duration: 1, delay: i * 0.15 }} />
              </div>
            </div>
          )
        })}
      </div>
      <p className="mt-5 text-[13.5px] text-ink/60">Measured on 14 hand-written questions; the README lists the limits.</p>
    </div>
  )
}

function DemoLogin({ login }) {
  const [copied, setCopied] = useState(null)
  return (
    <div className="mt-6 font-mono text-[12px] text-ink/70">
      <div className="mb-2 text-muted">Demo login · click to copy · free hosting may take a minute to wake</div>
      <div className="flex flex-wrap gap-x-4 gap-y-1.5">
        {login.map(([k, v]) => (
          <button key={k} onClick={() => navigator.clipboard?.writeText(v).then(() => { setCopied(v); setTimeout(() => setCopied(null), 1200) })}
            className="text-left underline decoration-line underline-offset-4 hover:text-ink hover:decoration-ink">
            {k}: <span className="text-ink">{copied === v ? 'copied ✓' : v}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

function Project({ p, i }) {
  const [open, setOpen] = useState(false)
  const color = ACCENTS[p.id]
  return (
    <section id={p.id} data-accent={color} className={`relative py-28 ${PAD}`}>
      <Reveal>
        <div className="flex flex-wrap items-center gap-3 font-mono text-[11.5px]" style={{ color }}>
          <span>Project {String(i + 1).padStart(2, '0')}</span><span className="text-faint">/</span><span className="text-muted">{p.kind}</span>
          {p.live && <span className="inline-flex items-center gap-1.5 text-ink/80"><i className="h-1.5 w-1.5 animate-pulse rounded-full" style={{ background: color }} />live</span>}
        </div>
        <h2 className="mt-3 font-serif text-[clamp(2.6rem,6vw,4.8rem)] font-medium leading-none tracking-[-0.025em]">{p.name}</h2>
        <p className="mt-4 max-w-2xl text-[19px] text-ink/85">{p.tagline}</p>
      </Reveal>

      <div className="mt-12 grid gap-12 lg:grid-cols-[.9fr_1.1fr]">
        <Reveal delay={0.1}>
          <p className="text-[16.5px] leading-relaxed text-ink/75">{p.summary}</p>
          <dl className="mt-9 grid grid-cols-2 gap-x-8 gap-y-7">
            {p.metrics.map(m => (
              <div key={m.label} className="border-t border-line pt-3">
                <dt className="sr-only">{m.label}</dt>
                <dd className="font-serif text-[clamp(1.9rem,3vw,2.6rem)] font-medium leading-none" style={{ color }}>{m.value}</dd>
                <dd className="mt-2 text-[13.5px] leading-snug text-ink/65">{m.label}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-10 flex flex-wrap items-center gap-6">
            {p.live && <ArrowButton href={p.live} tip="↗" style={{ '--accent': color }}>Try it live</ArrowButton>}
            <TextLink href={p.code}><Icon.github />Code on GitHub</TextLink>
          </div>
          {p.login && <DemoLogin login={p.login} />}
        </Reveal>

        <Reveal delay={0.2}>
          {p.video ? (
            <figure>
              <div className="overflow-hidden rounded-md border border-line shadow-[0_40px_80px_-40px_rgba(0,0,0,.9)]">
                <div className="flex items-center gap-2 border-b border-line bg-[#0e0f11] px-3 py-2 font-mono text-[11px] text-muted">
                  <i className="h-1.5 w-1.5 rounded-full bg-[#e8876a]" />{p.live.replace('https://', '')}
                </div>
                <DemoVideo src={p.video} poster={p.poster} label={`Screen recording of ${p.name}`} />
              </div>
              <figcaption className="mt-3 text-[13.5px] text-ink/60">{p.caption}</figcaption>
            </figure>
          ) : <div className="rounded-md border border-line p-7"><Bars bars={p.bars} color={color} /></div>}
        </Reveal>
      </div>

      <div className="mt-14 border-t border-line pt-6">
        <button onClick={() => setOpen(o => !o)} aria-expanded={open} className="inline-flex items-center gap-2 font-mono text-[13px] text-ink/80 hover:text-ink">
          <motion.span animate={{ rotate: open ? 90 : 0 }} className="inline-block" style={{ color }}>▸</motion.span>
          {open ? 'Hide how it works' : 'How it works, step by step'}
        </button>
        <AnimatePresence initial={false}>
          {open && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }} className="overflow-hidden">
              <div className="grid gap-12 pb-2 pt-8 lg:grid-cols-2">
                <Flow steps={p.flow} />
                <div className="space-y-8">
                  {p.extra?.type === 'rubric' && <Rubric extra={p.extra} color={color} />}
                  {p.extra?.type === 'note' && <div><div className="text-[19px] font-medium">{p.extra.title}</div><p className="mt-2 text-[15px] leading-relaxed text-ink/70">{p.extra.note}</p></div>}
                  {!p.extra && <div><div className="text-[19px] font-medium">Why hybrid search</div><p className="mt-2 text-[15px] leading-relaxed text-ink/70">Embeddings miss exact terms like “PTO” or “183 days”; BM25 catches them. Fusing both and reranking with a cross-encoder put the right answer in the top 4 for 92.9% of questions.</p></div>}
                  <CodeWindow file={p.snippet.file} note="simplified from the repo" code={p.snippet.code} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}

export function Projects() {
  // most impressive first: the two live ones
  const order = ['sieve', 'away', 'hr-rag'].map(id => projects.find(p => p.id === id))
  return <div id="projects">{order.map((p, i) => <Project key={p.id} p={p} i={i} />)}</div>
}

/* ---------------- closing ---------------- */
export function Closing() {
  return (
    <section id="contact" data-accent="#e2c26c" className={`relative pb-16 pt-32 ${PAD}`}>
      <Reveal>
        <div className="font-mono text-[11.5px] text-[#e2c26c]">Certified</div>
        <div className="mt-4 flex flex-wrap gap-x-12 gap-y-4">
          {certifications.map(c => (
            <div key={c.name}><div className="text-[22px] font-medium">{c.name}</div><div className="text-[14px] text-ink/60">{c.issuer}</div></div>
          ))}
        </div>
      </Reveal>
      <Reveal className="mt-28">
        <h2 className="max-w-4xl font-serif text-[clamp(2.6rem,6vw,5rem)] font-medium leading-[1] tracking-[-0.025em]">The model proposes. A human still decides.</h2>
        <p className="mt-6 max-w-xl text-[19px] text-ink/85">Hiring for an AI Engineer role? Let’s talk.</p>
        <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-5">
          <ArrowButton href={`mailto:${profile.email}`} tip="→" style={{ '--accent': '#e2c26c' }}>Email me</ArrowButton>
          <TextLink href={profile.linkedin}><Icon.linkedin />LinkedIn</TextLink>
          <TextLink href={profile.github}><Icon.github />GitHub</TextLink>
          <TextLink href={profile.resume} download><Icon.down />Resume (PDF)</TextLink>
        </div>
        <p className="mt-6 font-mono text-[13px] text-muted">{profile.email}</p>
      </Reveal>
      <footer className="dash-line mt-28 flex flex-wrap justify-between gap-3 pt-6 font-mono text-[11.5px] text-muted">
        <span>© {new Date().getFullYear()} {profile.name}</span>
        <span>Built with AI, React and Three.js. The terrain is generated in code.</span>
      </footer>
    </section>
  )
}
