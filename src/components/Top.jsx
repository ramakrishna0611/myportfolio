import { useEffect } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { profile, experience, projects, certifications, education } from '../data.js'
import { Button, Icon } from './ui.jsx'

const Logo = () => (
  <svg viewBox="0 0 64 64" className="h-8 w-8" aria-hidden="true">
    <circle cx="32" cy="32" r="21" fill="none" stroke="#4de1ff" strokeWidth="3" opacity=".5" />
    <ellipse cx="32" cy="32" rx="27" ry="9" fill="none" stroke="#8b5cf6" strokeWidth="3" transform="rotate(-20 32 32)" />
    <circle cx="32" cy="32" r="9" fill="#4de1ff" />
  </svg>
)

export function Nav({ onBriefing, onMap }) {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-bg/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 sm:px-6">
        <a href="#" onClick={e => { e.preventDefault(); onMap() }} className="flex items-center gap-2.5">
          <Logo />
          <span className="hidden font-display text-[17px] font-bold tracking-tight sm:inline">{profile.short}</span>
        </a>
        <button onClick={onMap} className="ml-auto hidden items-center gap-1.5 rounded-full px-3 py-1.5 text-sm text-muted transition hover:bg-white/5 hover:text-ink md:inline-flex">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan shadow-[0_0_8px_#4de1ff]" />Map
        </button>
        <div className="ml-auto flex items-center gap-2 md:ml-1">
          <button onClick={onBriefing}
            className="inline-flex items-center gap-1.5 rounded-full border border-cyan/50 bg-cyan/10 px-3.5 py-2 text-sm font-semibold text-cyan transition hover:bg-cyan/20 hover:shadow-[0_0_20px_rgba(77,225,255,.35)]">
            <Icon.bolt />Quick briefing
          </button>
          <Button href={profile.resume} variant="light" download className="!px-4 !py-2"><Icon.down /><span className="hidden sm:inline">Resume</span></Button>
        </div>
      </div>
      <div className="h-px bg-gradient-to-r from-transparent via-cyan/50 to-transparent" />
    </header>
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
