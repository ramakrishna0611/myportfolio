import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { profile, about, job, projects, projectMeta, skills, certifications } from './data.js'
import { Button, Icon, PAGE, Reveal, SectionHead, Tag } from './ui.jsx'

const Section = ({ id, children, className = '' }) => (
  <section id={id} className={`py-24 sm:py-32 ${className}`}><div className={PAGE}>{children}</div></section>
)

/* ---------------- About ---------------- */
export function About() {
  return (
    <Section id="about">
      <SectionHead n="01" label="About" title="A little about" accent="me." />
      <div className="mt-14 grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:gap-16">
        <div className="space-y-6">
          {about.paras.map((p, i) => (
            <Reveal key={i} delay={i * 0.08} as="p" className={i ? 'text-[17px] leading-[1.8] text-muted' : 'text-[clamp(1.25rem,2.1vw,1.6rem)] leading-[1.5] tracking-[-0.01em]'}>{p}</Reveal>
          ))}
        </div>
        <Reveal delay={0.1} className="self-start rounded-[28px] border border-line bg-card p-7 sm:p-8">
          <div className="label text-faint">Education</div>
          {about.education.map(e => (
            <div key={e.title} className="mt-6 grid grid-cols-[auto_1fr] gap-x-6">
              <span className="font-mono text-[12.5px] text-faint">{e.years}</span>
              <div>
                <h3 className="text-[17px] font-semibold leading-snug">{e.title}</h3>
                <p className="mt-1 text-[14.5px] text-muted">{e.place}</p>
                <p className="mt-3 text-[14.5px] leading-[1.7] text-muted">{e.note}</p>
              </div>
            </div>
          ))}
        </Reveal>
      </div>
      <Reveal className="mt-14 grid grid-cols-2 overflow-hidden rounded-[28px] border border-line lg:grid-cols-4">
        {about.stats.map(([v, l], i) => (
          <div key={l} className={`p-7 sm:p-8 ${i % 2 ? 'border-l border-line' : ''} ${i > 1 ? 'border-t border-line lg:border-t-0' : ''} ${i === 2 ? 'lg:border-l' : ''}`}>
            <div className="text-[clamp(2.4rem,5vw,3.6rem)] font-semibold leading-none tracking-[-0.04em]">{v}</div>
            <div className="label mt-4 text-faint">{l}</div>
          </div>
        ))}
      </Reveal>
    </Section>
  )
}

/* ---------------- Experience ---------------- */
export function Experience() {
  return (
    <Section id="experience">
      <SectionHead n="02" label="Experience" title="Where I’ve" accent="worked."
        note="Almost two years on the AI side of Salesforce, building agents that real support teams used every day." />
      <Reveal className="mt-14 rounded-[28px] border border-line bg-card p-7 sm:p-10">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h3 className="text-[clamp(1.4rem,2.6vw,1.85rem)] font-semibold tracking-[-0.02em]">{job.role}</h3>
            <p className="mt-1.5 text-[16px] text-muted">{job.company} · {job.place} · {job.type}</p>
          </div>
          <span className="rounded-full border border-line bg-raised px-3.5 py-1.5 font-mono text-[12.5px] text-muted">{job.dates}</span>
        </div>
        <p className="mt-6 max-w-3xl text-[17px] leading-[1.7]">{job.summary}</p>
        <ul className="mt-7 grid gap-x-10 gap-y-4 md:grid-cols-2">
          {job.points.map((p, i) => (
            <li key={i} className="flex gap-3.5 text-[15px] leading-[1.7] text-muted">
              <span className="mt-[10px] h-1.5 w-1.5 shrink-0 rounded-full bg-ink/70" />{p}
            </li>
          ))}
        </ul>
        <div className="mt-8 flex flex-wrap gap-2 border-t border-line pt-7">{job.tags.map(t => <Tag key={t}>{t}</Tag>)}</div>
      </Reveal>
    </Section>
  )
}

/* ---------------- Projects ---------------- */
function Clip({ p, className = '' }) {
  const ref = useRef(null)
  // only play while on screen
  useEffect(() => {
    const v = ref.current; if (!v) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause()), { threshold: 0.35 })
    io.observe(v); return () => io.disconnect()
  }, [])
  return (
    <video ref={ref} muted loop playsInline preload="metadata" poster={p.poster} aria-label={`Screen recording of ${p.name}`}
      className={`block w-full object-cover object-top ${className}`}><source src={p.video} type="video/mp4" /></video>
  )
}

/* HR assistant has no live app, so its picture is the path a question takes */
const Flow = ({ p, compact }) => (
  <ol className={`${compact ? 'space-y-2.5' : 'space-y-3'} p-6`}>
    {p.flow.map((f, i) => (
      <li key={f.title} className="flex gap-3">
        <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full border border-line bg-raised font-mono text-[11px] text-muted">{i + 1}</span>
        <div className="text-[13.5px] leading-snug"><span className="font-semibold">{f.title}</span> <span className="text-muted">{f.text}</span></div>
      </li>
    ))}
  </ol>
)

const Media = ({ p, className = '' }) => (
  <div className={`relative overflow-hidden rounded-[20px] border border-line bg-raised ${className}`}>
    <span className="absolute left-3 top-3 z-10 rounded-full border border-line bg-raised/90 px-3 py-1 text-[12.5px] backdrop-blur">{projectMeta[p.id].category}</span>
    {p.video ? <Clip p={p} className="aspect-[16/10]" /> : <div className="pt-10"><Flow p={p} compact /></div>}
  </div>
)

function Links({ p, onOpen }) {
  return (
    <div className="mt-auto flex items-center gap-2 border-t border-line pt-5">
      <button onClick={() => onOpen(p)} className="group mr-auto inline-flex items-center gap-2.5 text-[15px] font-medium">
        How it works <span className="grid h-8 w-8 place-items-center rounded-full bg-ink text-bg transition group-hover:rotate-45"><Icon.arrowUR className="h-4 w-4" /></span>
      </button>
      <a href={p.code} target="_blank" rel="noopener" aria-label={`${p.name} on GitHub`} className="grid h-10 w-10 place-items-center rounded-full border border-line bg-raised text-muted transition hover:text-ink"><Icon.github /></a>
      {p.live && <a href={p.live} target="_blank" rel="noopener" className="inline-flex h-10 items-center gap-1.5 rounded-full border border-line bg-raised px-4 text-[14px] transition hover:border-ink/40">Live <Icon.arrowUR className="h-3.5 w-3.5" /></a>}
    </div>
  )
}

function CaseStudy({ p, onClose }) {
  const [copied, setCopied] = useState(null)
  useEffect(() => {
    if (!p) return
    const onKey = e => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey); document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [p, onClose])
  return (
    <AnimatePresence>
      {p && (
        <motion.div className="fixed inset-0 z-[60] overflow-y-auto bg-black/40 p-3 backdrop-blur-sm sm:p-8" onClick={onClose}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} role="dialog" aria-modal="true" aria-label={`${p.name}: how it works`}>
          <motion.article onClick={e => e.stopPropagation()} initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 30, opacity: 0 }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto max-w-4xl rounded-[28px] border border-line bg-bg p-6 shadow-2xl sm:p-10">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="label text-faint">{projectMeta[p.id].category} · case study</div>
                <h3 className="mt-3 text-[clamp(2rem,4.5vw,3rem)] font-semibold leading-none tracking-[-0.035em]">{p.name}</h3>
                <p className="mt-3 text-[17px] text-muted">{p.tagline}</p>
              </div>
              <button onClick={onClose} autoFocus aria-label="Close" className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-line hover:bg-card"><Icon.close /></button>
            </div>
            {p.video && <div className="mt-8 overflow-hidden rounded-[20px] border border-line"><Clip p={p} className="aspect-[16/10]" /></div>}
            <div className="mt-10 grid gap-10 md:grid-cols-2">
              <div>
                <h4 className="label text-faint">What it does</h4>
                <p className="mt-3 text-[16px] leading-[1.8]">{p.does}</p>
              </div>
              <div>
                <h4 className="label text-faint">How I built it</h4>
                <p className="mt-3 text-[16px] leading-[1.8]">{p.built}</p>
              </div>
            </div>
            <h4 className="label mt-12 text-faint">The path a request takes</h4>
            <div className="mt-4 rounded-[20px] border border-line bg-card"><Flow p={p} /></div>
            {p.snippet && (
              <>
                <h4 className="label mt-12 text-faint">A piece of the code · {p.snippet.file}</h4>
                <pre className="mt-4 overflow-x-auto rounded-[20px] bg-[#0f0f10] p-6 font-mono text-[13px] leading-[1.75] text-[#e7e5e4]"><code>{p.snippet.code}</code></pre>
              </>
            )}
            <div className="mt-10 flex flex-wrap gap-2">{p.stack.map(t => <Tag key={t}>{t}</Tag>)}</div>
            <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-line pt-8">
              {p.live && <Button href={p.live} target="_blank" rel="noopener" dark>Try it live <Icon.arrowUR className="h-4 w-4" /></Button>}
              <Button href={p.code} target="_blank" rel="noopener"><Icon.github /> Read the code</Button>
            </div>
            {p.login && (
              <p className="mt-5 text-[13.5px] text-muted">
                Demo login (tap to copy):{' '}
                {p.login.map(([k, v]) => (
                  <button key={k} title={k} onClick={() => navigator.clipboard?.writeText(v).then(() => { setCopied(v); setTimeout(() => setCopied(null), 1200) })}
                    className="mr-2 font-mono text-[12.5px] text-ink underline decoration-line underline-offset-4 hover:decoration-ink">{copied === v ? 'copied' : v}</button>
                ))}
              </p>
            )}
          </motion.article>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function Projects() {
  const [open, setOpen] = useState(null)
  const [featured, ...rest] = [...projects].sort((a, b) => !!projectMeta[b.id].featured - !!projectMeta[a.id].featured)
  return (
    <Section id="projects">
      <SectionHead n="03" label="Projects" title="Things I’ve" accent="built."
        note="Three AI projects, each aimed at a real problem in HR. In all of them the model does the reading and talking, and my code makes the decisions." />

      <Reveal className="mt-14 grid gap-8 rounded-[32px] border border-line bg-card p-3 sm:p-4 lg:grid-cols-[1.25fr_1fr] lg:gap-10">
        <Media p={featured} className="self-center" />
        <div className="flex flex-col px-3 pb-3 pt-2 lg:py-6 lg:pr-6">
          <div className="label text-faint">Featured project</div>
          <h3 className="mt-3 text-[clamp(1.9rem,3.4vw,2.6rem)] font-semibold leading-[1.05] tracking-[-0.03em]">{featured.name}</h3>
          <p className="mt-2 text-[15px] font-medium">{featured.tagline}</p>
          <p className="mt-4 text-[15.5px] leading-[1.75] text-muted">{featured.does}</p>
          <div className="mb-8 mt-6 flex flex-wrap gap-2">{featured.stack.slice(0, 6).map(t => <Tag key={t}>{t}</Tag>)}</div>
          <Links p={featured} onOpen={setOpen} />
        </div>
      </Reveal>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {rest.map((p, i) => (
          <Reveal key={p.id} delay={i * 0.08} className="flex flex-col rounded-[32px] border border-line bg-card p-3 sm:p-4">
            <Media p={p} />
            <div className="flex flex-1 flex-col px-3 pb-3 pt-6">
              <h3 className="text-[1.6rem] font-semibold leading-tight tracking-[-0.025em]">{p.name}</h3>
              <p className="mt-2 text-[15px] font-medium">{p.tagline}</p>
              <p className="mt-3 text-[15px] leading-[1.75] text-muted">{p.does}</p>
              <div className="mb-7 mt-5 flex flex-wrap gap-2">{p.stack.slice(0, 5).map(t => <Tag key={t}>{t}</Tag>)}</div>
              <Links p={p} onOpen={setOpen} />
            </div>
          </Reveal>
        ))}
      </div>
      <CaseStudy p={open} onClose={() => setOpen(null)} />
    </Section>
  )
}

/* ---------------- Skills ---------------- */
export function Skills() {
  return (
    <Section id="skills">
      <SectionHead n="04" label="Skills" title="Tools I" accent="reach for."
        note="Mostly Python and the LLM toolkit around it, plus enough front end and Salesforce to ship the whole thing myself." />
      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {skills.map((g, i) => (
          <Reveal key={g.name} delay={i * 0.06} className="rounded-[28px] border border-line bg-card p-7 sm:p-8">
            <div className="label text-faint">{g.items.length} tools</div>
            <h3 className="mt-5 text-[1.3rem] font-semibold tracking-[-0.015em]">{g.name}</h3>
            <div className="mt-5 flex flex-wrap gap-2">{g.items.map(s => <Tag key={s} dot>{s}</Tag>)}</div>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}

/* ---------------- Certifications ---------------- */
export function Certifications() {
  return (
    <Section id="certifications">
      <SectionHead n="05" label="Certifications" title="Proof I did" accent="the homework." />
      <div className="mt-14 grid gap-5 sm:grid-cols-2">
        {certifications.map((c, i) => (
          <Reveal key={c.name} delay={i * 0.08} className="flex items-center gap-5 rounded-[28px] border border-line bg-card p-7">
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-line bg-raised"><Icon.award className="h-6 w-6" /></span>
            <div>
              <h3 className="text-[1.15rem] font-semibold leading-snug">{c.name}</h3>
              <p className="mt-1 text-[14.5px] text-muted">{c.issuer}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}

/* ---------------- Contact ---------------- */
export function Contact() {
  const [copied, setCopied] = useState(false)
  return (
    <Section id="contact" className="pb-16 sm:pb-20">
      <Reveal className="relative overflow-hidden rounded-[36px] bg-ink px-7 py-16 text-bg sm:px-14 sm:py-24">
        <div className="label opacity-60">06 · Contact</div>
        <h2 className="mt-6 max-w-3xl text-[clamp(2.6rem,7vw,5.5rem)] font-semibold leading-[0.95] tracking-[-0.045em]">
          Let’s build something <span className="accent">useful.</span>
        </h2>
        <p className="mt-7 max-w-xl text-[17px] leading-[1.75] opacity-70">
          I’m looking for my next role in AI engineering. If you’re hiring, or you just want to talk about agents and RAG, write to me. I read everything.
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-3">
          <a href={`mailto:${profile.email}`} className="inline-flex h-12 items-center gap-2 rounded-full bg-bg px-6 text-[15px] font-medium text-ink transition hover:opacity-90">
            <Icon.mail className="h-4 w-4" /> Email me
          </a>
          <button onClick={() => navigator.clipboard?.writeText(profile.email).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1500) })}
            className="inline-flex h-12 items-center gap-2 rounded-full border border-bg/20 px-6 font-mono text-[13.5px] transition hover:border-bg/50">
            {copied ? <><Icon.check className="h-4 w-4" /> Copied</> : <><Icon.copy className="h-4 w-4" /> {profile.email}</>}
          </button>
        </div>
        <div className="mt-12 flex flex-wrap gap-6 border-t border-bg/15 pt-8 text-[15px]">
          <a href={profile.linkedin} target="_blank" rel="noopener" className="inline-flex items-center gap-2 opacity-75 hover:opacity-100"><Icon.linkedin /> LinkedIn</a>
          <a href={profile.github} target="_blank" rel="noopener" className="inline-flex items-center gap-2 opacity-75 hover:opacity-100"><Icon.github /> GitHub</a>
          <a href={profile.resume} download className="inline-flex items-center gap-2 opacity-75 hover:opacity-100"><Icon.download /> Resume (PDF)</a>
        </div>
      </Reveal>
      <footer className="mt-10 flex flex-wrap justify-between gap-3 text-[13.5px] text-faint">
        <span>Designed and built by {profile.first} {profile.last}, {new Date().getFullYear()}.</span>
        <a href="#top" className="hover:text-ink">Back to top ↑</a>
      </footer>
    </Section>
  )
}
