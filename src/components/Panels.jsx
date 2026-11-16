import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { profile, experience, skillGroups, certifications, education, projects } from '../data.js'
import { Button, Corners, Icon } from './ui.jsx'
import { ProjectBody } from './Projects.jsx'
import { DESTS } from './World.jsx'

function About() {
  return (
    <div className="space-y-6">
      <p className="text-lg leading-relaxed"><span className="font-semibold text-ink">{profile.tagline}</span> <span className="text-muted">{profile.bio}</span></p>
      <dl className="grid grid-cols-2 gap-3">
        {profile.stats.map(s => (
          <div key={s.label} className="rounded-2xl border border-line bg-black/30 p-4">
            <dd className="font-display text-3xl font-bold text-cyan">{s.value}</dd>
            <dt className="mt-1 text-[13px] text-muted">{s.label}</dt>
          </div>
        ))}
      </dl>
      <div className="rounded-2xl border border-line bg-black/30 p-4 text-sm">
        <div className="grid grid-cols-[96px_1fr] gap-2">
          <span className="text-muted">Role</span><span>AI Engineer · {experience.company}</span>
          <span className="text-muted">Education</span><span>{profile.degree}</span>
          <span className="text-muted">Location</span><span>{profile.location}</span>
          <span className="text-muted">Looking for</span><span>AI Engineer roles</span>
        </div>
      </div>
      <div className="flex flex-wrap gap-3">
        <Button href={profile.resume} variant="primary" download><Icon.down />Download resume</Button>
        <Button href={profile.github}><Icon.github />GitHub</Button>
        <Button href={profile.linkedin}><Icon.linkedin />LinkedIn</Button>
      </div>
    </div>
  )
}

function Experience() {
  return (
    <div>
      <div className="flex flex-wrap items-start gap-4">
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-cyan/40 bg-cyan/10 text-cyan"><Icon.briefcase /></div>
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-xl font-bold">{experience.role}</h3>
          <p className="text-muted"><span className="font-semibold text-ink">{experience.company}</span> · {experience.place}</p>
          <p className="mt-1 inline-flex items-center gap-2 font-mono text-xs text-muted"><i className="h-1.5 w-1.5 rounded-full bg-emerald-400" />{experience.dates}</p>
        </div>
      </div>
      <ul className="relative mt-7 space-y-5 pl-9 before:absolute before:bottom-3 before:left-[11px] before:top-3 before:w-px before:bg-gradient-to-b before:from-cyan/70 before:via-violet/50 before:to-transparent">
        {experience.points.map(([a, b, c], i) => (
          <motion.li key={i} className="relative leading-relaxed text-muted" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.07 }}>
            <span className="absolute -left-9 top-1 grid h-6 w-6 place-items-center rounded-full border border-cyan/60 bg-bg text-cyan shadow-[0_0_14px_rgba(77,225,255,.45)]"><Icon.check /></span>
            {a}<strong className="font-semibold text-ink">{b}</strong>{c}
          </motion.li>
        ))}
      </ul>
    </div>
  )
}

function Skills() {
  const [sel, setSel] = useState(skillGroups[0].items[0])
  return (
    <div className="space-y-5">
      <div className="hud rounded-2xl border border-cyan/30 bg-cyan/[.04] p-5">
        <Corners />
        <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-cyan">Selected skill</div>
        <AnimatePresence mode="wait">
          <motion.div key={sel[0]} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.18 }}>
            <h3 className="mt-2 font-display text-2xl font-bold">{sel[0]}</h3>
            <p className="mt-1 text-muted">{sel[1]}</p>
            <p className="mt-3 text-sm"><span className="text-muted">Used in:</span> <span className="font-semibold text-cyan">{sel[2]}</span></p>
          </motion.div>
        </AnimatePresence>
      </div>
      {skillGroups.map(g => (
        <div key={g.name}>
          <h4 className="mb-2 font-display font-bold">{g.name}</h4>
          <div className="flex flex-wrap gap-2">
            {g.items.map(it => {
              const on = sel[0] === it[0]
              return (
                <button key={it[0]} onClick={() => setSel(it)} aria-pressed={on}
                  className={`rounded-full border px-3 py-1.5 text-sm transition ${on ? 'border-cyan bg-cyan/15 text-cyan shadow-[0_0_16px_rgba(77,225,255,.35)]' : 'border-line bg-white/[.03] hover:border-cyan/50'}`}>
                  {it[0]}
                </button>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

function Certifications() {
  return (
    <div className="space-y-4">
      {certifications.map(c => (
        <div key={c.name} className="flex items-center gap-5 rounded-2xl border border-line bg-black/30 p-5">
          <div className="relative grid h-16 w-16 shrink-0 place-items-center">
            <motion.div className="absolute inset-0 rounded-full border-2 border-dashed border-cyan/50" animate={{ rotate: 360 }} transition={{ duration: 18, repeat: Infinity, ease: 'linear' }} />
            <div className="grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-cyan to-violet text-[#05070f]"><Icon.award /></div>
          </div>
          <div>
            <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-cyan">Certified</div>
            <h3 className="mt-1 font-display text-xl font-bold">{c.name}</h3>
            <p className="text-muted">{c.issuer}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

function Education() {
  return (
    <div className="rounded-2xl border border-line bg-black/30 p-6">
      <div className="flex flex-wrap items-center gap-5">
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-violet/50 bg-violet/15 text-[#c4b5fd]"><Icon.cap /></div>
        <div className="min-w-0 flex-1 basis-60">
          <h3 className="font-display text-xl font-bold">{education.school}</h3>
          <p className="mt-1 text-muted">{education.degree}</p>
          <p className="mt-1 text-sm text-muted">{education.place} · {education.dates}</p>
        </div>
        <div className="rounded-2xl border border-cyan/30 bg-cyan/5 px-5 py-2 text-center">
          <div className="font-display text-3xl font-bold text-cyan">{education.gpa}</div>
          <div className="font-mono text-xs text-muted">GPA / 10</div>
        </div>
      </div>
      <p className="mt-4 text-muted">{education.note}</p>
    </div>
  )
}

function Contact() {
  return (
    <div className="text-center">
      <div className="relative mx-auto mb-6 grid h-20 w-20 place-items-center" aria-hidden="true">
        {[0, 0.85, 1.7].map(d => <span key={d} className="signal absolute inset-0 rounded-full border-2 border-cyan/60" style={{ animationDelay: `${d}s` }} />)}
        <span className="grid h-14 w-14 place-items-center rounded-full bg-cyan text-[#04121a] shadow-[0_0_40px_rgba(77,225,255,.6)]"><Icon.mail /></span>
      </div>
      <h3 className="font-display text-3xl font-bold">Let’s build something.</h3>
      <p className="mx-auto mt-3 max-w-sm text-muted">Hiring for an AI Engineer role? I’d love to hear about it.</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Button href={`mailto:${profile.email}`} variant="primary"><Icon.mail />Email me</Button>
        <Button href={profile.linkedin}><Icon.linkedin />LinkedIn</Button>
        <Button href={profile.github}><Icon.github />GitHub</Button>
        <Button href={profile.resume} download><Icon.down />Resume</Button>
      </div>
      <p className="mt-5 font-mono text-sm text-muted">{profile.email}</p>
    </div>
  )
}

const AREAS = { about: About, experience: Experience, skills: Skills, certifications: Certifications, education: Education, contact: Contact }
const TITLES = { about: profile.name, experience: 'Experience', skills: 'Skills', certifications: 'Certifications', education: 'Education', contact: 'Contact' }

export default function Panel({ id, onClose, onGo }) {
  const closeRef = useRef(null)
  const idx = DESTS.findIndex(d => d.id === id)
  const dest = DESTS[idx]
  const project = projects.find(p => p.id === id)

  useEffect(() => {
    if (!id) return
    const onKey = e => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onGo(DESTS[(idx + 1) % DESTS.length].id)
      if (e.key === 'ArrowLeft') onGo(DESTS[(idx - 1 + DESTS.length) % DESTS.length].id)
    }
    document.addEventListener('keydown', onKey)
    closeRef.current?.focus()
    return () => document.removeEventListener('keydown', onKey)
  }, [id, idx, onClose, onGo])

  const Body = AREAS[id]
  return (
    <AnimatePresence>
      {id && dest && (
        <motion.div key="panel" className="fixed inset-0 z-[55]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-black/50" onClick={onClose} />
          <motion.aside role="dialog" aria-modal="true" aria-label={dest.label}
            className="absolute right-0 top-0 flex h-full w-full max-w-[680px] flex-col border-l border-cyan/25 bg-[#060912]/95 shadow-[0_0_90px_rgba(77,225,255,.18)]"
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', stiffness: 250, damping: 30 }}>
            <div className="flex items-center gap-3 border-b border-line px-5 py-4 sm:px-7">
              <div className="min-w-0 flex-1">
                <div className={`font-mono text-[11px] uppercase tracking-[0.2em] ${dest.type === 'project' ? 'text-cyan' : 'text-amber'}`}>
                  Destination {String(idx + 1).padStart(2, '0')} · {dest.type === 'project' ? 'Project' : 'About me'}
                </div>
                <h2 className="truncate font-display text-2xl font-bold tracking-tight sm:text-3xl">{project ? project.name : TITLES[id]}</h2>
              </div>
              <button onClick={() => onGo(DESTS[(idx - 1 + DESTS.length) % DESTS.length].id)} className="grid h-9 w-9 place-items-center rounded-full border border-line hover:border-cyan" aria-label="Previous destination"><Icon.arrow style={{ transform: 'rotate(180deg)' }} /></button>
              <button onClick={() => onGo(DESTS[(idx + 1) % DESTS.length].id)} className="grid h-9 w-9 place-items-center rounded-full border border-line hover:border-cyan" aria-label="Next destination"><Icon.arrow /></button>
              <button ref={closeRef} onClick={onClose} className="grid h-9 w-9 place-items-center rounded-full border border-line hover:border-cyan" aria-label="Back to the map"><Icon.close /></button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-7">
              <AnimatePresence mode="wait">
                <motion.div key={id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
                  {project ? <ProjectBody p={project} /> : <Body />}
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="border-t border-line px-5 py-3 text-center font-mono text-[11px] text-muted sm:px-7">← → next destination · Esc back to the map</div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
