import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { profile, experience, skillGroups, certifications, education } from '../data.js'
import { Button, Corners, Icon, Reveal, SectionHeader, spotlight } from './ui.jsx'

const Wrap = ({ id, children, className = '' }) => (
  <section id={id} className={`relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24 ${className}`}>{children}</section>
)

export function Experience() {
  return (
    <Wrap id="experience">
      <SectionHeader n={2} code="mission log" title="Experience" sub="Where I build production AI today." />
      <Reveal>
        <div onMouseMove={spotlight} className="glass spot rounded-3xl p-6 sm:p-9">
          <div className="flex flex-wrap items-start gap-x-6 gap-y-3">
            <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-cyan/40 bg-cyan/10 text-cyan shadow-[0_0_24px_rgba(77,225,255,.25)]"><Icon.briefcase /></div>
            <div className="min-w-0 flex-1">
              <h3 className="font-display text-2xl font-bold tracking-tight">{experience.role}</h3>
              <p className="mt-1 text-muted"><span className="font-semibold text-ink">{experience.company}</span> · {experience.place}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300"><i className="h-1.5 w-1.5 rounded-full bg-emerald-400" />Active</span>
              <span className="font-mono text-sm text-muted">{experience.dates}</span>
            </div>
          </div>
          <ul className="relative mt-8 space-y-5 pl-9 before:absolute before:bottom-3 before:left-[11px] before:top-3 before:w-px before:bg-gradient-to-b before:from-cyan/70 before:via-violet/50 before:to-transparent">
            {experience.points.map(([a, b, c], i) => (
              <motion.li key={i} className="relative leading-relaxed text-muted"
                initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.6 }} transition={{ delay: i * 0.08 }}>
                <span className="absolute -left-9 top-1 grid h-6 w-6 place-items-center rounded-full border border-cyan/60 bg-bg text-cyan shadow-[0_0_14px_rgba(77,225,255,.45)]"><Icon.check /></span>
                {a}<strong className="font-semibold text-ink">{b}</strong>{c}
              </motion.li>
            ))}
          </ul>
        </div>
      </Reveal>
    </Wrap>
  )
}

export function Skills() {
  const [sel, setSel] = useState(skillGroups[0].items[0])
  return (
    <Wrap id="skills">
      <SectionHeader n={3} code="systems" title="Skills" sub="Select any skill to see where I used it." />
      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="grid gap-5 sm:grid-cols-2">
          {skillGroups.map((g, gi) => (
            <Reveal key={g.name} delay={gi * 0.05}>
              <div onMouseMove={spotlight} className="glass spot h-full rounded-3xl p-5">
                <h3 className="mb-4 flex items-center justify-between font-display text-lg font-bold">{g.name}<span className="font-mono text-xs font-normal text-cyan">{String(g.items.length).padStart(2, '0')}</span></h3>
                <div className="flex flex-wrap gap-2">
                  {g.items.map(it => {
                    const on = sel[0] === it[0]
                    return (
                      <button key={it[0]} onClick={() => setSel(it)} aria-pressed={on}
                        className={`rounded-full border px-3 py-1.5 text-sm transition duration-200 ${on
                          ? 'border-cyan bg-cyan/15 text-cyan shadow-[0_0_16px_rgba(77,225,255,.35)]'
                          : 'border-line bg-white/[.03] text-ink/90 hover:border-cyan/50 hover:text-ink'}`}>
                        {it[0]}
                      </button>
                    )
                  })}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="hud glass rounded-3xl p-6">
            <Corners />
            <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-cyan"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan" />Scanning skill</div>
            <AnimatePresence mode="wait">
              <motion.div key={sel[0]} initial={{ opacity: 0, y: 8, filter: 'blur(4px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.22 }}>
                <h3 className="mt-3 font-display text-2xl font-bold">{sel[0]}</h3>
                <p className="mt-2 leading-relaxed text-muted">{sel[1]}</p>
                <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">Used in</p>
                <p className="mt-1 font-semibold text-cyan">{sel[2]}</p>
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
      <SectionHeader n={5} code="clearances" title="Certifications" />
      <div className="grid gap-5 sm:grid-cols-2">
        {certifications.map((c, i) => (
          <Reveal key={c.name} delay={i * 0.08}>
            <div onMouseMove={spotlight} className="glass spot flex items-center gap-5 rounded-3xl p-6">
              <div className="relative grid h-16 w-16 shrink-0 place-items-center">
                <motion.div className="absolute inset-0 rounded-full border-2 border-dashed border-cyan/50" animate={{ rotate: 360 }} transition={{ duration: 18, repeat: Infinity, ease: 'linear' }} />
                <div className="grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-cyan to-violet text-[#05070f] shadow-[0_0_24px_rgba(77,225,255,.45)]"><Icon.award /></div>
              </div>
              <div>
                <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-cyan">Certified</div>
                <h3 className="mt-1 font-display text-xl font-bold">{c.name}</h3>
                <p className="text-muted">{c.issuer}</p>
              </div>
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
      <SectionHeader n={6} code="origin" title="Education" />
      <Reveal>
        <div onMouseMove={spotlight} className="glass spot flex flex-wrap items-center gap-6 rounded-3xl p-6 sm:p-8">
          <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-violet/50 bg-violet/15 text-[#c4b5fd]"><Icon.cap /></div>
          <div className="min-w-0 flex-1 basis-72">
            <h3 className="font-display text-xl font-bold sm:text-2xl">{education.school}</h3>
            <p className="mt-1 text-muted">{education.degree}</p>
            <p className="mt-1 text-sm text-muted">{education.place} · {education.dates} · {education.note}</p>
          </div>
          <div className="rounded-2xl border border-cyan/30 bg-cyan/5 px-6 py-3 text-center">
            <div className="font-display text-3xl font-bold text-cyan">{education.gpa}</div>
            <div className="font-mono text-xs text-muted">GPA / 10</div>
          </div>
        </div>
      </Reveal>
    </Wrap>
  )
}

export function Contact() {
  return (
    <Wrap id="contact" className="pb-16">
      <Reveal>
        <div className="hud relative overflow-hidden rounded-[2rem] border border-cyan/30 bg-gradient-to-b from-[#0a1430] to-[#070a14] px-6 py-16 text-center sm:px-12">
          <Corners />
          <div className="relative mx-auto mb-8 grid h-20 w-20 place-items-center" aria-hidden="true">
            {[0, 0.85, 1.7].map(d => <span key={d} className="signal absolute inset-0 rounded-full border-2 border-cyan/60" style={{ animationDelay: `${d}s` }} />)}
            <span className="grid h-14 w-14 place-items-center rounded-full bg-cyan text-[#04121a] shadow-[0_0_40px_rgba(77,225,255,.6)]"><Icon.mail /></span>
          </div>
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-cyan">07 // open a channel</p>
          <h2 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-5xl">Let’s build something.</h2>
          <p className="mx-auto mt-4 max-w-md text-muted">Hiring for an AI Engineer role? I’d love to hear about it.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button href={`mailto:${profile.email}`} variant="primary"><Icon.mail />Email me</Button>
            <Button href={profile.linkedin}><Icon.linkedin />LinkedIn</Button>
            <Button href={profile.github}><Icon.github />GitHub</Button>
            <Button href={profile.resume} download><Icon.down />Resume</Button>
          </div>
          <p className="mt-6 font-mono text-sm text-muted">{profile.email}</p>
        </div>
      </Reveal>
      <p className="mt-8 text-center text-sm text-muted">© {new Date().getFullYear()} {profile.name} · Built with React, Tailwind and Motion</p>
    </Wrap>
  )
}
