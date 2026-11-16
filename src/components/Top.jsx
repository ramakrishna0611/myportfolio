import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { profile, stops, experience, projects, certifications, education } from '../data.js'
import { Bus, Button, CodeWindow, Icon } from './ui.jsx'

export function Nav({ onRecruiter }) {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'))
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    try { localStorage.setItem('rr-theme', dark ? 'dark' : 'light') } catch (e) { /* storage blocked */ }
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#0e1014' : '#f7f6f2')
  }, [dark])

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-bg/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 sm:px-6">
        <a href="#about" className="flex items-center gap-2.5 font-display text-lg font-bold tracking-tight text-ink">
          <Bus className="h-6 w-12" />
          <span className="hidden sm:inline">{profile.short}</span>
        </a>
        <nav aria-label="Sections" className="ml-auto hidden items-center gap-1 lg:flex">
          {stops.slice(1, -1).map(s => (
            <a key={s.id} href={`#${s.id}`} className="rounded-full px-3 py-1.5 text-sm text-muted transition hover:bg-surface-2 hover:text-ink">{s.label}</a>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2 lg:ml-2">
          <button onClick={onRecruiter} className="inline-flex items-center gap-1.5 rounded-full border border-ink px-3.5 py-2 text-sm font-semibold text-ink transition hover:bg-ink hover:text-bg">
            <Icon.bolt /><span className="hidden sm:inline">Recruiter mode</span><span className="sm:hidden">Quick view</span>
          </button>
          <button onClick={() => setDark(d => !d)} className="grid h-9 w-9 place-items-center rounded-full border border-line bg-surface text-ink transition hover:border-ink" aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}>
            {dark ? <Icon.sun /> : <Icon.moon />}
          </button>
          <Button href={profile.resume} variant="primary" download className="!px-4 !py-2"><Icon.down /><span className="hidden sm:inline">Resume</span></Button>
        </div>
      </div>
    </header>
  )
}

export function Hero() {
  const words = profile.name.split(' ')
  return (
    <section id="about" className="relative overflow-hidden">
      <div className="dots pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_75%)]" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 pb-20 pt-14 sm:px-6 sm:pt-20 lg:grid-cols-[1.1fr_.9fr]">
        <div className="min-w-0">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5 text-sm text-muted">
            <span className="relative flex h-2.5 w-2.5"><span className="absolute inset-0 animate-ping rounded-full bg-emerald-500/60" /><span className="relative h-2.5 w-2.5 rounded-full bg-emerald-500" /></span>
            Open to AI Engineer roles · {profile.location}
          </motion.div>

          <h1 className="mt-6 font-display text-[clamp(2.6rem,6.6vw,4.9rem)] font-extrabold leading-[0.98] tracking-tight text-ink">
            <span className="sr-only">{profile.name}</span>
            <span aria-hidden="true">
              {words.map((w, i) => (
                <motion.span key={w} className="mr-[0.22em] inline-block"
                  initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 + i * 0.09, ease: [0.22, 1, 0.36, 1] }}>
                  {w}
                </motion.span>
              ))}
            </span>
          </h1>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
            <p className="mt-5 inline-flex items-center gap-3 font-display text-2xl font-bold text-ink sm:text-3xl">
              <span className="rounded-lg bg-accent px-2.5 py-0.5 text-accent-ink">{profile.title}</span>
            </p>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink"><strong className="font-semibold">{profile.tagline}</strong> <span className="text-muted">{profile.bio}</span></p>
            <p className="mt-4 font-mono text-[13px] text-muted">{profile.degree}</p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="#projects" variant="primary"><Icon.play />See live projects</Button>
              <Button href={profile.resume} variant="dark" download><Icon.down />Download resume</Button>
              <Button href={profile.github}><Icon.github />GitHub</Button>
              <Button href={profile.linkedin}><Icon.linkedin />LinkedIn</Button>
            </div>
          </motion.div>
        </div>

        <motion.div className="min-w-0" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}>
          <CodeWindow className="hidden sm:block" file="about_me.py" note="main ✓" code={
`class Engineer:
    name   = "Abbidi Ramakrishna Reddy"
    role   = "AI Engineer"
    since  = 2025          # AI at Accelerize360
    builds = ["agents", "RAG", "evals"]

    def principles(self):
        return [
            "Rules live in code.",
            "The model proposes.",
            "Results get measured.",
        ]`} />
          <div className="grid grid-cols-2 gap-3 sm:mt-4 sm:grid-cols-4">
            {profile.stats.map(s => (
              <div key={s.label} className="rounded-2xl border border-line bg-surface p-3.5">
                <div className="font-display text-3xl font-bold text-ink">{s.value}</div>
                <div className="mt-1 text-xs leading-snug text-muted">{s.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
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
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={onClose} />
          <motion.aside role="dialog" aria-modal="true" aria-label="Recruiter quick view"
            className="absolute right-0 top-0 flex h-full w-full max-w-[560px] flex-col overflow-y-auto bg-bg shadow-2xl"
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', stiffness: 260, damping: 30 }}>
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-bg/90 px-6 py-4 backdrop-blur">
              <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-muted"><Icon.bolt />Recruiter mode · 30-second read</div>
              <button onClick={onClose} autoFocus className="grid h-9 w-9 place-items-center rounded-full border border-line hover:border-ink" aria-label="Close"><Icon.close /></button>
            </div>
            <div className="space-y-7 px-6 py-6">
              <div>
                <h2 className="font-display text-3xl font-bold tracking-tight">{profile.name}</h2>
                <p className="mt-1 text-lg font-semibold">{profile.title} · {profile.location}</p>
                <p className="mt-3 text-muted">{profile.tagline} {profile.bio}</p>
              </div>
              <dl className="grid gap-3 rounded-2xl border border-line bg-surface p-4 text-sm">
                {[
                  ['Experience', `${experience.role}, ${experience.company} (${experience.dates})`],
                  ['Education', `${education.degree.replace('with Artificial Intelligence and Machine Learning', '(AI & ML)')}, CBIT, ${education.gpa} GPA`],
                  ['Certifications', certifications.map(c => c.name).join(' · ')],
                  ['Location', `${profile.location} · open to AI Engineer roles`],
                ].map(([k, v]) => (
                  <div key={k} className="grid grid-cols-[110px_1fr] gap-3"><dt className="text-muted">{k}</dt><dd className="font-medium">{v}</dd></div>
                ))}
              </dl>
              <div>
                <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-muted">Top skills</h3>
                <div className="flex flex-wrap gap-2">{topSkills.map(s => <span key={s} className="rounded-full border border-line bg-surface px-3 py-1 text-sm">{s}</span>)}</div>
              </div>
              <div>
                <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-muted">Projects</h3>
                <ul className="space-y-3">
                  {projects.map(p => (
                    <li key={p.id} className="rounded-2xl border border-line bg-surface p-4">
                      <div className="flex flex-wrap items-baseline gap-x-2"><span className="font-display text-lg font-bold">{p.name}</span><span className="text-sm text-muted">{p.kind}</span></div>
                      <p className="mt-1 text-sm">{p.tagline}</p>
                      <p className="mt-2 text-sm"><span className="rounded bg-accent px-1.5 py-0.5 font-semibold text-accent-ink">{p.metrics[0].value}</span> <span className="text-muted">{p.metrics[0].label}</span></p>
                      <div className="mt-3 flex gap-4 text-sm font-semibold">
                        {p.live && <a className="text-link hover:underline" href={p.live} target="_blank" rel="noopener">Live demo ↗</a>}
                        <a className="text-link hover:underline" href={p.code} target="_blank" rel="noopener">Code ↗</a>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-wrap gap-3 pb-4">
                <Button href={profile.resume} variant="primary" download><Icon.down />Download resume</Button>
                <Button href={`mailto:${profile.email}`} variant="dark"><Icon.mail />Email</Button>
                <Button href={profile.linkedin}><Icon.linkedin />LinkedIn</Button>
              </div>
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

