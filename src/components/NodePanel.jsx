import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { profile, experience, skillGroups, projects, certifications, education, nodes } from '../data.js'
import { ArrowButton, Icon, TextLink } from './ui.jsx'

/* 10-second clip that plays as soon as its panel opens */
function Clip({ src, poster, label }) {
  const ref = useRef(null)
  useEffect(() => {
    const v = ref.current
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { v.controls = true; return }
    v.play()?.catch(() => { v.controls = true })
  }, [src])
  return (
    <div className="overflow-hidden">
      <video ref={ref} key={src} muted loop playsInline autoPlay preload="auto" poster={poster} aria-label={label} className="block aspect-[16/10] w-full bg-[#0b0c0e] object-cover object-top">
        <source src={src} type="video/mp4" />
      </video>
    </div>
  )
}

const Metric = ({ value, label, color }) => (
  <div className="border-t border-line pt-2.5">
    <div className="font-serif text-[1.8rem] font-normal leading-none" style={{ color }}>{value}</div>
    <div className="mt-1.5 text-[12.5px] leading-snug text-ink/65">{label}</div>
  </div>
)

function Bio() {
  return (
    <>
      <p className="text-[16px] leading-relaxed text-ink/85">{profile.tagline} {profile.bio}</p>
      <div className="mt-5 grid grid-cols-2 gap-x-6 gap-y-4">
        {profile.stats.map(s => <Metric key={s.label} value={s.value} label={s.label} color="#74d8c4" />)}
      </div>
      <p className="mt-5 font-mono text-[12px] text-muted">{profile.degree} · {profile.location}</p>
      <div className="mt-5 flex flex-wrap items-center gap-5">
        <ArrowButton href={profile.resume} tip="↓" download>Resume</ArrowButton>
        <TextLink href={profile.linkedin}><Icon.linkedin />LinkedIn</TextLink>
        <TextLink href={profile.github}><Icon.github />GitHub</TextLink>
      </div>
    </>
  )
}

function Skills() {
  return (
    <div className="space-y-4">
      {skillGroups.map(g => (
        <div key={g.name}>
          <div className="font-mono text-[11.5px] text-[#74d8c4]">{g.name}</div>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {g.items.map(it => <span key={it[0]} title={`${it[1]} Used in: ${it[2]}`} className="rounded-sm border border-line px-2 py-0.5 text-[13.5px] text-ink/85">{it[0]}</span>)}
          </div>
        </div>
      ))}
    </div>
  )
}

function Experience() {
  return (
    <>
      <div className="text-[17px] font-medium">{experience.role}</div>
      <div className="text-[14px] text-ink/65">{experience.company}, {experience.place} · {experience.dates.replace('–', 'to')}</div>
      <ol className="mt-4 space-y-3">
        {experience.points.map(([a, b, c], i) => (
          <li key={i} className="grid grid-cols-[22px_1fr] gap-2 text-[14px] leading-snug text-ink/75">
            <span className="font-mono text-[11px] text-[#74d8c4]">{String(i + 1).padStart(2, '0')}</span>
            <span>{a}<span className="text-ink">{b}</span>{c}</span>
          </li>
        ))}
      </ol>
    </>
  )
}

const Pill = ({ children, className }) => (
  <span className={`inline-flex items-center gap-1.5 rounded-[4px] border px-2 py-[2px] font-mono text-[9.5px] font-bold uppercase tracking-[0.05em] backdrop-blur-sm ${className}`}>{children}</span>
)

/* Project card: framed media, name and year, a short description, tech chips, icon links */
function Project({ p }) {
  const [copied, setCopied] = useState(null)
  return (
    <article className="rounded-xl border border-line bg-white/[0.02] p-3 lg:grid lg:grid-cols-[1.15fr_1fr] lg:gap-6">
      <div>
      <div className="relative overflow-hidden rounded-lg border border-line bg-[repeating-linear-gradient(135deg,rgba(232,228,218,.035)_0_1px,transparent_1px_7px)] pl-8 pt-11">
        <div className="absolute inset-x-3 top-3 flex justify-between">
          <Pill className={p.live ? 'border-[#74d8c4]/30 bg-[#74d8c4]/10 text-[#74d8c4]' : 'border-line bg-ink/5 text-ink/60'}>
            <span className={`h-1.5 w-1.5 rounded-full ${p.live ? 'animate-pulse bg-[#74d8c4]' : 'bg-ink/40'}`} />{p.live ? 'Live' : 'Repo'}
          </Pill>
          <Pill className="border-[#e2c26c]/35 bg-[#e2c26c]/10 text-[#e2c26c]">Featured</Pill>
        </div>
        {p.video
          ? <div className="overflow-hidden rounded-tl-md border-l border-t border-line"><Clip src={p.video} poster={p.poster} label={`10-second recording of ${p.name}`} /></div>
          : (
            <ol className="rounded-tl-md border-l border-t border-line bg-[#0b0c0e] p-4">
              {p.flow.map((f, i) => (
                <motion.li key={f.title} className="grid grid-cols-[18px_1fr] gap-2 py-1.5" initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 + i * 0.12 }}>
                  <span className={`mt-[5px] h-2 w-2 rounded-full ${f.kind === 'ai' ? 'bg-[#a593f5]' : f.kind === 'in' ? 'bg-ink/60' : 'bg-[#74d8c4]'}`} />
                  <span className="text-[12.5px] leading-snug"><span className="font-medium text-ink">{f.title}</span> <span className="text-ink/60">{f.text}</span></span>
                </motion.li>
              ))}
            </ol>
          )}
      </div>

      <div className="px-1.5 pb-1.5">
        <div className="mt-4 flex items-baseline justify-between gap-3">
          <h3 className="text-[17px] font-semibold tracking-[0.02em]">{p.name}</h3>
          <span className="font-mono text-[12px] text-muted">2026</span>
        </div>
        <p className="mt-0.5 font-mono text-[11px] text-[#74d8c4]">{p.kind}</p>
        <p className="mt-2.5 text-[13.5px] leading-[1.6] text-ink/70">{p.tagline}</p>
      </div>
      </div>

      {/* on wide screens the how-to sits beside the clip, so nothing hides below the fold */}
      <div className="px-1.5 pb-1.5 lg:pt-1">
        <h4 className="mt-5 font-mono lg:mt-0 text-[11px] uppercase tracking-[0.12em] text-muted">How to use it</h4>
        <ol className="mt-2 space-y-2">
          {p.use.map((step, i) => (
            <li key={i} className="grid grid-cols-[22px_1fr] gap-1.5 text-[13.5px] leading-snug text-ink/80">
              <span className="font-mono text-[11px] leading-[1.6] text-[#74d8c4]">{String(i + 1).padStart(2, '0')}</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>

        <div className="mt-4 flex items-end gap-4 border-t border-line pt-4">
          <div className="flex flex-1 flex-wrap gap-1.5">
            {p.stack.map(t => <span key={t} className="rounded-[4px] border border-line px-2 py-[3px] font-mono text-[11px] text-ink/70">{t}</span>)}
          </div>
          <div className="flex shrink-0 items-center gap-3 pb-1 text-ink/60">
            {p.live && <a href={p.live} target="_blank" rel="noopener" aria-label={`${p.name} live demo`} title="Live demo" className="transition hover:text-ink"><Icon.globe className="h-[18px] w-[18px]" /></a>}
            <a href={p.code} target="_blank" rel="noopener" aria-label={`${p.name} source code`} title="Source code" className="transition hover:text-ink"><Icon.github className="h-[18px] w-[18px]" /></a>
          </div>
        </div>

        {p.login && (
          <div className="mt-3 font-mono text-[11px] leading-relaxed text-ink/55">
            Demo login, click to copy:{' '}
            {p.login.map(([k, v]) => (
              <button key={k} className="mr-2 underline decoration-line underline-offset-4 hover:text-ink" onClick={() => navigator.clipboard?.writeText(v).then(() => { setCopied(v); setTimeout(() => setCopied(null), 1200) })}>
                {copied === v ? 'copied ✓' : v}
              </button>
            ))}
          </div>
        )}
      </div>
    </article>
  )
}

function Certifications() {
  return (
    <div className="space-y-4">
      {certifications.map(c => (
        <div key={c.name} className="border-t border-line pt-3">
          <div className="text-[18px] font-medium">{c.name}</div>
          <div className="text-[13.5px] text-ink/60">{c.issuer}</div>
        </div>
      ))}
      <div className="border-t border-line pt-3">
        <div className="text-[18px] font-medium">{education.degree.replace('with Artificial Intelligence and Machine Learning', '(AI & ML)')}</div>
        <div className="text-[13.5px] text-ink/60">{education.school} · {education.dates} · GPA {education.gpa}</div>
      </div>
    </div>
  )
}

function Contact() {
  return (
    <>
      <p className="font-serif text-[1.6rem] leading-tight">The model proposes. A human still decides.</p>
      <p className="mt-3 text-[15px] text-ink/75">Hiring for an AI Engineer role? Let’s talk.</p>
      <div className="mt-6 flex flex-wrap items-center gap-5">
        <ArrowButton href={`mailto:${profile.email}`} tip="→">Email me</ArrowButton>
        <TextLink href={profile.linkedin}><Icon.linkedin />LinkedIn</TextLink>
        <TextLink href={profile.github}><Icon.github />GitHub</TextLink>
        <TextLink href={profile.resume} download><Icon.down />Resume</TextLink>
      </div>
      <p className="mt-5 font-mono text-[12px] text-muted">{profile.email}</p>
    </>
  )
}

const TITLES = { bio: profile.name, skills: 'Skills', experience: 'Experience', certifications: 'Certifications & education', contact: 'Let’s build something' }
const BODY = { bio: Bio, skills: Skills, experience: Experience, certifications: Certifications, contact: Contact }

export default function NodePanel({ active }) {
  const n = nodes[active]
  const project = n && projects.find(p => p.id === n.id)
  const Body = n && BODY[n.id]
  return (
    <div className={`pointer-events-none fixed inset-x-3 bottom-3 z-30 md:inset-x-auto md:bottom-auto md:right-[max(2rem,calc((100vw-80rem)/2+2rem))] md:top-[96px] md:w-[440px] ${project ? 'lg:w-[min(860px,calc(100vw-7rem))]' : ''}`}>
      <AnimatePresence mode="wait">
        {n && (
          <motion.aside key={n.id} aria-live="polite" aria-label={n.label}
            className="pointer-events-auto max-h-[58svh] overflow-y-auto rounded-md border border-line bg-[#0f1012]/90 p-5 shadow-[0_30px_80px_-30px_rgba(0,0,0,.95)] backdrop-blur-md md:max-h-[calc(100svh-120px)] md:p-7"
            initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}>
            <div className="flex items-center justify-between font-mono text-[11.5px]">
              <span className="text-[#74d8c4]">Neuron {String(active + 1).padStart(2, '0')} / {String(nodes.length).padStart(2, '0')}</span>
              <span className="text-muted">{n.kind}</span>
            </div>
            <h2 className="mt-2 font-serif text-[2.1rem] font-normal leading-tight tracking-[-0.01em]">{project ? 'Projects' : TITLES[n.id]}</h2>
            <div className="mt-4">{project ? <Project p={project} /> : <Body />}</div>
            <div className="mt-6 flex gap-1" aria-hidden="true">
              {nodes.map((x, i) => <span key={x.id} className={`h-[3px] flex-1 rounded-full ${i <= active ? 'bg-[#74d8c4]' : 'bg-line'}`} />)}
            </div>
            {active < nodes.length - 1 && <p className="mt-3 font-mono text-[11px] text-muted">Scroll to travel to {nodes[active + 1].label}</p>}
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  )
}
