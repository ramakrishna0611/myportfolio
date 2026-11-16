import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { profile, experience, skillGroups, certifications, education } from '../data.js'
import { Bus, Button, Icon, Reveal, SectionHeader } from './ui.jsx'

const Wrap = ({ id, children, className = '' }) => (
  <section id={id} className={`mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24 ${className}`}>{children}</section>
)

export function Experience() {
  return (
    <Wrap id="experience">
      <SectionHeader stop={2} title="Experience" kicker="Where I build AI today" />
      <Reveal className="relative rounded-3xl border border-line bg-surface p-6 sm:p-9">
        <div className="flex flex-wrap items-start gap-x-6 gap-y-3">
          <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-ink text-bg"><Icon.briefcase /></div>
          <div className="min-w-0 flex-1">
            <h3 className="font-display text-2xl font-bold tracking-tight">{experience.role}</h3>
            <p className="mt-1 text-muted"><span className="font-semibold text-ink">{experience.company}</span> · {experience.place}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400">Current</span>
            <span className="font-mono text-sm text-muted">{experience.dates}</span>
          </div>
        </div>
        <ul className="relative mt-8 space-y-5 pl-8 before:absolute before:bottom-2 before:left-[11px] before:top-2 before:w-px before:bg-line">
          {experience.points.map(([a, b, c], i) => (
            <motion.li key={i} className="relative leading-relaxed text-muted"
              initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
              <span className="absolute -left-8 top-0.5 grid h-6 w-6 place-items-center rounded-full border border-line bg-bg text-ink"><Icon.check /></span>
              {a}<strong className="font-semibold text-ink">{b}</strong>{c}
            </motion.li>
          ))}
        </ul>
      </Reveal>
    </Wrap>
  )
}

export function Skills() {
  const [sel, setSel] = useState(skillGroups[0].items[0])
  return (
    <Wrap id="skills">
      <SectionHeader stop={3} title="Skills" kicker="Tap a skill to see where I used it" />
      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="grid gap-5 sm:grid-cols-2">
          {skillGroups.map((g, gi) => (
            <Reveal key={g.name} delay={gi * 0.05} className="rounded-3xl border border-line bg-surface p-5">
              <h3 className="mb-3 flex items-center justify-between font-display text-lg font-bold">{g.name}<span className="font-mono text-xs font-normal text-muted">{g.items.length}</span></h3>
              <div className="flex flex-wrap gap-2">
                {g.items.map(it => {
                  const on = sel[0] === it[0]
                  return (
                    <button key={it[0]} onClick={() => setSel(it)} aria-pressed={on}
                      className={`rounded-full border px-3 py-1.5 text-sm transition ${on ? 'border-ink bg-ink text-bg' : 'border-line bg-bg text-ink hover:border-ink'}`}>
                      {it[0]}
                    </button>
                  )
                })}
              </div>
            </Reveal>
          ))}
        </div>
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="relative overflow-hidden rounded-3xl border border-ink bg-ink p-6 text-bg">
            <div className="font-mono text-xs uppercase tracking-[0.18em] text-bg/60">Skill details</div>
            <AnimatePresence mode="wait">
              <motion.div key={sel[0]} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
                <h3 className="mt-3 font-display text-2xl font-bold">{sel[0]}</h3>
                <p className="mt-2 leading-relaxed text-bg/80">{sel[1]}</p>
                <p className="mt-5 text-xs uppercase tracking-wider text-bg/50">Used in</p>
                <p className="mt-1 font-semibold text-accent">{sel[2]}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </Wrap>
  )
}

export function Certifications() {
  return (
    <Wrap id="certifications">
      <SectionHeader stop={5} title="Certifications" kicker="Verified" />
      <div className="grid gap-5 sm:grid-cols-2">
        {certifications.map((c, i) => (
          <Reveal key={c.name} delay={i * 0.08} className="flex items-center gap-5 rounded-3xl border border-line bg-surface p-6">
            <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-accent text-accent-ink"><Icon.award /></div>
            <div>
              <h3 className="font-display text-xl font-bold">{c.name}</h3>
              <p className="text-muted">{c.issuer}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Wrap>
  )
}

export function Education() {
  return (
    <Wrap id="education">
      <SectionHeader stop={6} title="Education" kicker="Where the journey started" />
      <Reveal className="flex flex-wrap items-center gap-6 rounded-3xl border border-line bg-surface p-6 sm:p-8">
        <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-ink text-bg"><Icon.cap /></div>
        <div className="min-w-0 flex-1 basis-72">
          <h3 className="font-display text-xl font-bold sm:text-2xl">{education.school}</h3>
          <p className="mt-1 text-muted">{education.degree}</p>
          <p className="mt-1 text-sm text-muted">{education.place} · {education.dates} · {education.note}</p>
        </div>
        <div className="rounded-2xl border border-line bg-bg px-6 py-3 text-center">
          <div className="font-display text-3xl font-bold">{education.gpa}</div>
          <div className="font-mono text-xs text-muted">GPA / 10</div>
        </div>
      </Reveal>
    </Wrap>
  )
}

export function Contact() {
  return (
    <Wrap id="contact" className="pb-40">
      <Reveal className="relative overflow-hidden rounded-[2rem] bg-ink px-6 py-14 text-center text-bg sm:px-12">
        <div className="mx-auto mb-6 w-28"><Bus className="w-full" /></div>
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-bg/60">Stop 07 · Final stop</p>
        <h2 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-5xl">Let’s build something.</h2>
        <p className="mx-auto mt-4 max-w-md text-bg/70">Hiring for an AI Engineer role? I’d love to hear about it.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button href={`mailto:${profile.email}`} variant="primary"><Icon.mail />Email me</Button>
          <Button href={profile.linkedin} className="!border-white/20 !bg-white/10 !text-bg hover:!border-white"><Icon.linkedin />LinkedIn</Button>
          <Button href={profile.github} className="!border-white/20 !bg-white/10 !text-bg hover:!border-white"><Icon.github />GitHub</Button>
          <Button href={profile.resume} download className="!border-white/20 !bg-white/10 !text-bg hover:!border-white"><Icon.down />Resume</Button>
        </div>
        <p className="mt-6 font-mono text-sm text-bg/60">{profile.email}</p>
      </Reveal>
      <p className="mt-8 text-center text-sm text-muted">© {new Date().getFullYear()} {profile.name} · Built with React, Tailwind and Motion</p>
    </Wrap>
  )
}
