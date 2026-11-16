import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react'
import { profile, experience, projects, certifications, education } from '../data.js'
import { Icon } from './ui.jsx'

const PAD = 'px-6 sm:px-[max(2.5rem,calc((100vw-80rem)/2+2.5rem))]'

export function Header({ onPlain }) {
  const { scrollYProgress } = useScroll()
  const [pct, setPct] = useState(0)
  useMotionValueEvent(scrollYProgress, 'change', v => setPct(Math.round(v * 100)))
  return (
    <header className={`fixed inset-x-0 top-0 z-50 bg-gradient-to-b from-bg via-bg/85 to-transparent pb-5 pt-5 ${PAD}`}>
      <div className="flex items-center gap-4">
        <a href="#about" className="font-serif text-[17px] font-semibold tracking-tight">{profile.name}</a>
        <span className="ml-auto hidden font-mono text-[12.5px] text-ink/80 sm:inline" aria-live="off">
          {pct >= 99 ? 'Trained. Ready to ship.' : <>Training <span className="inline-block w-[3ch] text-right text-ink">{pct}%</span></>}
        </span>
        <button onClick={onPlain} className="ml-auto font-mono text-[12.5px] text-ink/80 underline decoration-line underline-offset-[6px] hover:text-ink hover:decoration-ink sm:ml-2">Plain CV</button>
        <a href={profile.resume} download aria-label="Download resume (PDF)" title="Download resume (PDF)"
          className="grid h-8 w-8 place-items-center border border-line text-ink/80 transition hover:border-ink hover:text-ink"><Icon.down /></a>
      </div>
      <div className="dash-line relative mt-4 h-px">
        <motion.div className="absolute inset-y-0 left-0 h-px bg-accent" style={{ width: `${pct}%` }} />
      </div>
    </header>
  )
}

/* The recruiter view: everything that matters, as a plain one-page CV. */
export function PlainCV({ open, onClose }) {
  useEffect(() => {
    if (!open) return
    const onKey = e => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[60] overflow-y-auto bg-[#0e0f11]/97" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} role="dialog" aria-modal="true" aria-label="Plain CV">
          <div className="mx-auto max-w-3xl px-6 py-14">
            <div className="flex items-center justify-between font-mono text-[12px] text-muted">
              <span>Plain CV · 30-second read</span>
              <button onClick={onClose} autoFocus className="inline-flex items-center gap-1.5 hover:text-ink">Back to the story <Icon.close /></button>
            </div>
            <h1 className="mt-10 font-serif text-5xl font-medium tracking-tight">{profile.name}</h1>
            <p className="mt-2 text-xl text-ink/85">{profile.title} · {profile.location}</p>
            <p className="mt-5 text-[17px] leading-relaxed text-ink/75">{profile.tagline} {profile.bio}</p>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 font-mono text-[13px]">
              <a className="underline underline-offset-4" href={profile.resume} download>Download resume (PDF)</a>
              <a className="underline underline-offset-4" href={`mailto:${profile.email}`}>{profile.email}</a>
              <a className="underline underline-offset-4" href={profile.linkedin} target="_blank" rel="noopener">LinkedIn</a>
              <a className="underline underline-offset-4" href={profile.github} target="_blank" rel="noopener">GitHub</a>
            </div>

            <h2 className="mt-12 border-b border-line pb-2 font-mono text-[12px] uppercase tracking-[0.2em] text-muted">Experience</h2>
            <div className="mt-4 flex flex-wrap justify-between gap-2"><span className="text-[19px] font-medium">{experience.role}</span><span className="font-mono text-[13px] text-muted">{experience.dates}</span></div>
            <div className="text-ink/70">{experience.company}, {experience.place}</div>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-[15.5px] leading-relaxed text-ink/80">
              {experience.points.map(([a, b, c], i) => <li key={i}>{a}<strong className="font-medium text-ink">{b}</strong>{c}</li>)}
            </ul>

            <h2 className="mt-12 border-b border-line pb-2 font-mono text-[12px] uppercase tracking-[0.2em] text-muted">Projects</h2>
            {projects.map(p => (
              <div key={p.id} className="mt-5">
                <div className="flex flex-wrap items-baseline gap-x-3"><span className="text-[19px] font-medium">{p.name}</span><span className="text-ink/60">{p.kind}</span>
                  <span className="ml-auto space-x-4 font-mono text-[12.5px]">{p.live && <a className="underline underline-offset-4" href={p.live} target="_blank" rel="noopener">Live demo</a>}<a className="underline underline-offset-4" href={p.code} target="_blank" rel="noopener">Code</a></span>
                </div>
                <p className="mt-1 text-[15.5px] text-ink/80">{p.tagline} {p.metrics.slice(0, 2).map(m => `${m.value} ${m.label}`).join('; ')}.</p>
              </div>
            ))}

            <h2 className="mt-12 border-b border-line pb-2 font-mono text-[12px] uppercase tracking-[0.2em] text-muted">Skills</h2>
            <p className="mt-4 text-[15.5px] leading-relaxed text-ink/80">AI agents, tool calling, RAG, embeddings, hybrid search (BM25), reranking, LLM evaluation, guardrails, prompt-injection testing · Python, SQL, JavaScript, SQLAlchemy, ChromaDB · FastAPI, REST APIs, Gmail API, pytest, Git · Agentforce, Data Cloud, Prompt Builder, Einstein Trust Layer</p>

            <h2 className="mt-12 border-b border-line pb-2 font-mono text-[12px] uppercase tracking-[0.2em] text-muted">Education and certifications</h2>
            <p className="mt-4 text-[15.5px] text-ink/80">{education.degree}, {education.school}, {education.dates} · GPA {education.gpa}</p>
            <p className="mt-2 text-[15.5px] text-ink/80">{certifications.map(c => `${c.name} (${c.issuer})`).join(' · ')}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
