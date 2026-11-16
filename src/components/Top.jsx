import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useScroll, useSpring } from 'motion/react'
import { profile, stops, experience, projects, certifications, education } from '../data.js'
import { Button, Corners, Icon, Reveal, spotlight } from './ui.jsx'
import Station from './Station.jsx'
import { DemoVideo } from './Projects.jsx'

const Logo = () => (
  <svg viewBox="0 0 64 64" className="h-8 w-8" aria-hidden="true">
    <circle cx="32" cy="32" r="21" fill="none" stroke="#4de1ff" strokeWidth="3" opacity=".5" />
    <ellipse cx="32" cy="32" rx="27" ry="9" fill="none" stroke="#8b5cf6" strokeWidth="3" transform="rotate(-20 32 32)" />
    <circle cx="32" cy="32" r="9" fill="#4de1ff" />
  </svg>
)

export function Nav({ onBriefing }) {
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24 })
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-bg/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 sm:px-6">
        <a href="#about" className="flex items-center gap-2.5">
          <Logo />
          <span className="hidden font-display text-[17px] font-bold tracking-tight sm:inline">{profile.short}</span>
        </a>
        <nav aria-label="Sections" className="ml-auto hidden items-center gap-0.5 lg:flex">
          {stops.slice(1).map(s => (
            <a key={s.id} href={`#${s.id}`} className="rounded-full px-3 py-1.5 text-sm text-muted transition hover:bg-white/5 hover:text-ink">{s.label}</a>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2 lg:ml-3">
          <button onClick={onBriefing}
            className="inline-flex items-center gap-1.5 rounded-full border border-cyan/50 bg-cyan/10 px-3.5 py-2 text-sm font-semibold text-cyan transition hover:bg-cyan/20 hover:shadow-[0_0_20px_rgba(77,225,255,.35)]">
            <Icon.bolt />Quick briefing
          </button>
          <Button href={profile.resume} variant="light" download className="!px-4 !py-2"><Icon.down /><span className="hidden sm:inline">Resume</span></Button>
        </div>
      </div>
      <motion.div className="h-[2px] origin-left bg-gradient-to-r from-cyan via-violet to-cyan" style={{ scaleX: progress }} />
    </header>
  )
}

const FOCUS = ['LLM agents', 'RAG systems', 'AI evaluations', 'guardrails']

function Typer() {
  const [i, setI] = useState(0)
  const [text, setText] = useState('')
  useEffect(() => {
    const word = FOCUS[i]
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setText(word); return }
    if (text.length < word.length) {
      const t = setTimeout(() => setText(word.slice(0, text.length + 1)), 55)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => { setText(''); setI(n => (n + 1) % FOCUS.length) }, 1800)
    return () => clearTimeout(t)
  }, [text, i])
  return <span className="text-cyan">{text}<span className="blink">▍</span></span>
}

export function Hero() {
  return (
    <section id="about" className="relative">
      <div className="mx-auto grid max-w-6xl items-center gap-6 px-4 pb-10 pt-10 sm:px-6 lg:min-h-[calc(100svh-4rem)] lg:grid-cols-[1.05fr_.95fr] lg:gap-4 lg:py-6">
        <div className="min-w-0">
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1.5 font-mono text-[11.5px] uppercase tracking-[0.14em] text-emerald-300">
            <span className="relative flex h-2 w-2"><span className="absolute inset-0 animate-ping rounded-full bg-emerald-400/70" /><span className="relative h-2 w-2 rounded-full bg-emerald-400" /></span>
            Systems online · open to AI Engineer roles
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} transition={{ duration: 0.8, delay: 0.1 }}
            className="grad-text text-glow mt-6 font-display text-[clamp(2.5rem,min(5.4vw,8vh),4.6rem)] font-bold leading-[1.02] tracking-tight">
            {profile.name}
          </motion.h1>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.6 }}>
            <p className="mt-4 font-display text-2xl font-semibold text-ink sm:text-3xl">AI Engineer</p>
            <p className="mt-2 font-mono text-sm text-muted sm:text-base">&gt; building <Typer /></p>
            <p className="mt-5 max-w-xl leading-relaxed text-muted sm:text-[17px]">
              <span className="font-medium text-ink">{profile.tagline}</span> <span className="short:hidden">{profile.bio}</span>
            </p>
            <p className="mt-3 font-mono text-[12.5px] text-muted/80">{profile.degree} · {profile.location}</p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Button href="#demos" variant="primary"><Icon.play />Watch live demos</Button>
              <Button href={profile.resume} variant="light" download><Icon.down />Download resume</Button>
              <Button href={profile.github} className="!h-11 !w-11 !p-0" aria-label="GitHub" title="GitHub"><Icon.github /></Button>
              <Button href={profile.linkedin} className="!h-11 !w-11 !p-0" aria-label="LinkedIn" title="LinkedIn"><Icon.linkedin /></Button>
            </div>

            <dl className="mt-8 grid max-w-xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-4">
              {profile.stats.map(s => (
                <div key={s.label} className="bg-bg/80 px-4 py-3">
                  <dt className="sr-only">{s.label}</dt>
                  <dd className="font-display text-2xl font-bold text-cyan">{s.value}</dd>
                  <dd className="mt-0.5 text-[11.5px] leading-snug text-muted">{s.label}</dd>
                </div>
              ))}
            </dl>
          </motion.div>
        </div>

        <motion.div className="min-w-0 lg:-mr-8" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.1, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}>
          <div className="mx-auto max-w-[340px] sm:max-w-none"><Station /></div>
          <p className="-mt-2 text-center font-mono text-[11px] uppercase tracking-[0.2em] text-muted">Click a module to explore a project</p>
        </motion.div>
      </div>
    </section>
  )
}

/* Right under the hero: both screen recordings, so a recruiter sees the work in seconds. */
export function Demos() {
  const live = projects.filter(p => p.video)
  return (
    <section id="demos" className="mx-auto max-w-6xl px-4 pb-6 pt-4 sm:px-6">
      <Reveal className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-cyan"><span className="h-2 w-2 rounded-full bg-red-500 shadow-[0_0_10px_#ef4444]" />Live transmissions</div>
          <h2 className="mt-2 font-display text-2xl font-bold sm:text-3xl">See my AI apps in action</h2>
        </div>
        <p className="text-sm text-muted">Real recordings of the deployed apps. Both are live: try them yourself.</p>
      </Reveal>
      <div className="grid gap-6 md:grid-cols-2">
        {live.map((p, i) => (
          <Reveal key={p.id} delay={i * 0.1}>
            <div onMouseMove={spotlight} className="glass spot hud rounded-2xl p-3">
              <Corners />
              <div className="relative overflow-hidden rounded-xl">
                <DemoVideo src={p.video} poster={p.poster} label={`Screen recording of ${p.name}`} />
                <div className="pointer-events-none absolute bottom-3 left-3 flex items-center gap-2 rounded-full bg-black/75 px-2.5 py-1 font-mono text-[11px] text-white backdrop-blur">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />REC · {p.name}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3 px-2 pb-1 pt-4">
                <div className="w-full min-w-0 sm:w-auto sm:flex-1">
                  <div className="font-display text-lg font-bold">{p.name} <span className="font-sans text-sm font-normal text-muted">· {p.kind}</span></div>
                  <div className="mt-0.5 text-sm text-muted"><span className="font-semibold text-cyan">{p.metrics[0].value}</span> {p.metrics[0].label}</div>
                </div>
                <div className="flex gap-2">
                  <Button href={p.live} variant="primary" className="!px-4 !py-2">Try it live ↗</Button>
                  <Button href={`#${p.id}`} className="!px-4 !py-2">Details</Button>
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

export function RecruiterMode({ open, onClose }) {
  useEffect(() => {
    if (!open) return
    const onKey = e => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [open, onClose])

  const topSkills = ['AI Agents', 'Tool Calling', 'RAG', 'LLM Evaluation', 'Guardrails', 'Python', 'FastAPI', 'SQL', 'Agentforce', 'Data Cloud']

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[60]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
          <motion.aside role="dialog" aria-modal="true" aria-label="Quick briefing"
            className="absolute right-0 top-0 flex h-full w-full max-w-[560px] flex-col overflow-y-auto border-l border-line bg-[#070a14] shadow-[0_0_80px_rgba(77,225,255,.15)]"
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', stiffness: 260, damping: 30 }}>
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-[#070a14]/90 px-6 py-4 backdrop-blur">
              <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-cyan"><Icon.bolt />Quick briefing · 30-second read</div>
              <button onClick={onClose} autoFocus className="grid h-9 w-9 place-items-center rounded-full border border-line hover:border-cyan" aria-label="Close"><Icon.close /></button>
            </div>
            <div className="space-y-7 px-6 py-6">
              <div>
                <h2 className="font-display text-3xl font-bold tracking-tight">{profile.name}</h2>
                <p className="mt-1 text-lg font-semibold text-cyan">{profile.title} · {profile.location}</p>
                <p className="mt-3 text-muted">{profile.tagline} {profile.bio}</p>
              </div>
              <dl className="glass grid gap-3 rounded-2xl p-4 text-sm">
                {[
                  ['Experience', `${experience.role}, ${experience.company} (${experience.dates})`],
                  ['Education', `B.E. Computer Science (AI & ML), CBIT, ${education.gpa} GPA`],
                  ['Certifications', certifications.map(c => c.name).join(' · ')],
                  ['Availability', 'Open to AI Engineer roles'],
                ].map(([k, v]) => (
                  <div key={k} className="grid grid-cols-[110px_1fr] gap-3"><dt className="text-muted">{k}</dt><dd className="font-medium">{v}</dd></div>
                ))}
              </dl>
              <div>
                <h3 className="mb-2 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">Top skills</h3>
                <div className="flex flex-wrap gap-2">{topSkills.map(s => <span key={s} className="rounded-full border border-line bg-white/5 px-3 py-1 text-sm">{s}</span>)}</div>
              </div>
              <div>
                <h3 className="mb-2 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">Projects</h3>
                <ul className="space-y-3">
                  {projects.map(p => (
                    <li key={p.id} className="glass rounded-2xl p-4">
                      <div className="flex flex-wrap items-baseline gap-x-2"><span className="font-display text-lg font-bold">{p.name}</span><span className="text-sm text-muted">{p.kind}</span></div>
                      <p className="mt-1 text-sm">{p.tagline}</p>
                      <p className="mt-2 text-sm"><span className="font-semibold text-cyan">{p.metrics[0].value}</span> <span className="text-muted">{p.metrics[0].label}</span></p>
                      <div className="mt-3 flex gap-4 text-sm font-semibold">
                        {p.live && <a className="text-cyan hover:underline" href={p.live} target="_blank" rel="noopener">Live demo ↗</a>}
                        <a className="text-cyan hover:underline" href={p.code} target="_blank" rel="noopener">Code ↗</a>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-wrap gap-3 pb-4">
                <Button href={profile.resume} variant="primary" download><Icon.down />Download resume</Button>
                <Button href={`mailto:${profile.email}`} variant="light"><Icon.mail />Email</Button>
                <Button href={profile.linkedin}><Icon.linkedin />LinkedIn</Button>
              </div>
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
