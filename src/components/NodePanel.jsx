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
    <div className="overflow-hidden rounded-md border border-line">
      <video ref={ref} key={src} muted loop playsInline autoPlay preload="auto" poster={poster} aria-label={label} className="block aspect-[16/10] w-full bg-[#0b0c0e] object-cover object-top">
        <source src={src} type="video/mp4" />
      </video>
    </div>
  )
}

const Metric = ({ value, label, color }) => (
  <div className="border-t border-line pt-2.5">
    <div className="font-serif text-[1.65rem] font-medium leading-none" style={{ color }}>{value}</div>
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

function Project({ p }) {
  const [copied, setCopied] = useState(null)
  return (
    <>
      <p className="text-[15.5px] text-ink/90">{p.tagline}</p>
      <div className="mt-4">
        {p.video
          ? <Clip src={p.video} poster={p.poster} label={`10-second recording of ${p.name}`} />
          : (
            <div className="rounded-md border border-line p-4">
              <div className="text-[14px] font-medium">Answer found in the top 4 retrieved chunks</div>
              <div className="mt-3 space-y-3">
                {p.bars.map(([l, v], i) => (
                  <div key={l}>
                    <div className="mb-1 flex justify-between text-[12.5px]"><span className="text-ink/70">{l}</span><span className="font-mono">{v}%</span></div>
                    <div className="h-[3px] bg-line"><motion.div className="h-full" style={{ background: i === p.bars.length - 1 ? '#74d8c4' : 'rgba(232,228,218,.45)' }} initial={{ width: 0 }} animate={{ width: `${v}%` }} transition={{ duration: 0.9, delay: 0.2 + i * 0.15 }} /></div>
                  </div>
                ))}
              </div>
            </div>
          )}
      </div>
      <div className="mt-5 grid grid-cols-2 gap-x-6 gap-y-4">
        {p.metrics.map(m => <Metric key={m.label} value={m.value} label={m.label} color="#74d8c4" />)}
      </div>
      <p className="mt-5 text-[13.5px] leading-relaxed text-ink/65">{p.summary}</p>
      <div className="mt-5 flex flex-wrap items-center gap-5">
        {p.live && <ArrowButton href={p.live} tip="↗">Try it live</ArrowButton>}
        <TextLink href={p.code}><Icon.github />Code</TextLink>
      </div>
      {p.login && (
        <div className="mt-4 font-mono text-[11.5px] text-ink/60">
          Demo login (click to copy):{' '}
          {p.login.map(([k, v]) => (
            <button key={k} className="mr-2 underline decoration-line underline-offset-4 hover:text-ink" onClick={() => navigator.clipboard?.writeText(v).then(() => { setCopied(v); setTimeout(() => setCopied(null), 1200) })}>
              {copied === v ? 'copied ✓' : v}
            </button>
          ))}
        </div>
      )}
    </>
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
    <div className="pointer-events-none fixed inset-x-3 bottom-3 z-30 md:inset-x-auto md:bottom-auto md:right-[max(2rem,calc((100vw-80rem)/2+2rem))] md:top-[96px] md:w-[440px]">
      <AnimatePresence mode="wait">
        {n && (
          <motion.aside key={n.id} aria-live="polite" aria-label={n.label}
            className="pointer-events-auto max-h-[58svh] overflow-y-auto rounded-md border border-line bg-[#0f1012]/90 p-5 shadow-[0_30px_80px_-30px_rgba(0,0,0,.95)] backdrop-blur-md md:max-h-[calc(100svh-120px)] md:p-7"
            initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}>
            <div className="flex items-center justify-between font-mono text-[11.5px]">
              <span className="text-[#74d8c4]">Neuron {String(active + 1).padStart(2, '0')} / {String(nodes.length).padStart(2, '0')}</span>
              <span className="text-muted">{n.kind}</span>
            </div>
            <h2 className="mt-2 font-serif text-[2rem] font-medium leading-tight tracking-[-0.01em]">{project ? project.name : TITLES[n.id]}</h2>
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
