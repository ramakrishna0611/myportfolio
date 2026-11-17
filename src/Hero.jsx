import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { profile, hero, marquee, projects } from './data.js'
import { Button, Icon, PAGE } from './ui.jsx'

const ease = [0.22, 1, 0.36, 1]
const away = projects.find(p => p.id === 'away')

// a short exchange with Away, replayed on a loop
const CHAT = [
  { who: 'user', text: 'Can I take two days off from the 2nd?' },
  { who: 'check', text: 'checked leave balance · team calendar' },
  { who: 'bot', text: 'You have 6 casual days left. Someone on your team is already off on the 2nd, so the 4th and 5th are clear. Want me to book those?' },
  { who: 'user', text: 'Yes, book them.' },
  { who: 'bot', text: 'Done. It’s with your PM for approval.' },
]

function ChatCard() {
  const [shown, setShown] = useState(1)
  useEffect(() => {
    const t = setTimeout(() => setShown(s => (s >= CHAT.length + 2 ? 1 : s + 1)), shown > CHAT.length ? 2600 : 1500)
    return () => clearTimeout(t)
  }, [shown])
  const visible = CHAT.slice(0, Math.min(shown, CHAT.length))
  return (
    <div className="relative w-full max-w-[400px] sm:rotate-[1.5deg] rounded-[28px] border border-line bg-raised p-2 shadow-[0_40px_80px_-30px_rgba(0,0,0,.35)] transition-transform duration-500 hover:rotate-0">
      <div className="rounded-[22px] border border-line bg-card">
        <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
          <div className="flex items-center gap-2.5">
            <span className="grid h-7 w-7 place-items-center rounded-full bg-ink font-mono text-[11px] font-medium text-bg">A</span>
            <div className="leading-tight">
              <div className="text-[13.5px] font-semibold">Away</div>
              <div className="text-[11.5px] text-faint">my leave-booking agent</div>
            </div>
          </div>
          <span className="flex items-center gap-1.5 font-mono text-[10.5px] uppercase tracking-[.12em] text-live"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-live" />Live</span>
        </div>
        <div className="flex h-[300px] flex-col justify-end gap-2.5 overflow-hidden px-4 py-4 [mask-image:linear-gradient(transparent,#000_22%)]">
          <AnimatePresence initial={false}>
            {visible.map((m, i) => (
              <motion.div key={`${i}-${m.text}`} layout initial={{ opacity: 0, y: 10, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.4, ease }}
                className={m.who === 'user' ? 'ml-auto max-w-[80%] rounded-2xl rounded-br-md bg-ink px-3.5 py-2 text-[13.5px] leading-snug text-bg'
                  : m.who === 'check' ? 'flex items-center gap-1.5 font-mono text-[11px] text-faint'
                  : 'max-w-[88%] rounded-2xl rounded-bl-md border border-line bg-raised px-3.5 py-2 text-[13.5px] leading-snug'}>
                {m.who === 'check' && <Icon.check className="h-3.5 w-3.5 text-live" />}{m.text}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        <div className="flex items-center justify-between border-t border-line px-5 py-3 text-[12px] text-faint">
          <span>The model suggests. My code books it.</span>
          <a href={away.live} target="_blank" rel="noopener" className="inline-flex items-center gap-1 font-medium text-ink hover:underline">Try it <Icon.arrowUR className="h-3.5 w-3.5" /></a>
        </div>
      </div>
    </div>
  )
}

const socials = [
  [profile.github, 'GitHub', Icon.github],
  [profile.linkedin, 'LinkedIn', Icon.linkedin],
  [`mailto:${profile.email}`, 'Email', Icon.mail],
]

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-32 sm:pt-36">
      <div className="hero-grid pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className={`${PAGE} relative`}>
        <motion.a href="#projects" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }}
          className="inline-flex items-center gap-3 rounded-full border border-line bg-raised py-1.5 pl-1.5 pr-4 text-[13.5px] text-muted shadow-sm transition hover:border-ink/30">
          <span className="rounded-full bg-ink px-2.5 py-1 font-mono text-[10.5px] font-medium uppercase tracking-[.12em] text-bg">Now</span>
          {hero.badge} <span aria-hidden="true">→</span>
        </motion.a>

        <div className="mt-10 grid items-center gap-14 lg:mt-12 lg:grid-cols-[minmax(0,1fr)_380px] xl:grid-cols-[minmax(0,1fr)_400px]">
          <div>
            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease, delay: 0.05 }}
              className="text-[clamp(3.2rem,10vw,4.5rem)] sm:text-[clamp(4rem,7.4vw,6.4rem)] font-semibold leading-[0.9] tracking-[-0.055em]">
              {profile.first}<br />{profile.last}<span className="accent">.</span>
            </motion.h1>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease, delay: 0.25 }}>
              <p className="mt-8 max-w-xl text-[clamp(1.2rem,2vw,1.45rem)] leading-snug text-muted">
                {profile.role}. I build AI tools that people can <span className="text-ink">trust with real work.</span>
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <Button href="#projects" dark>See my work <Icon.arrowDown className="h-4 w-4" /></Button>
                <Button href={profile.resume} download>Resume <Icon.download className="h-4 w-4" /></Button>
                <span className="mx-2 hidden h-8 w-px bg-line sm:block" />
                <div className="flex items-center gap-1">
                  {socials.map(([href, label, I]) => (
                    <a key={label} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener" aria-label={label} title={label}
                      className="grid h-11 w-11 place-items-center rounded-full text-muted transition hover:bg-card hover:text-ink"><I /></a>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
          <motion.div initial={{ opacity: 0, y: 30, rotate: 4 }} animate={{ opacity: 1, y: 0, rotate: 0 }} transition={{ duration: 1, ease, delay: 0.35 }} className="flex justify-center lg:justify-end">
            <ChatCard />
          </motion.div>
        </div>

        <dl className="mt-20 grid border-t border-line sm:grid-cols-3">
          {hero.status.map(([k, v, live], i) => (
            <div key={k} className={`py-5 sm:py-6 ${i ? 'border-t border-line sm:border-l sm:border-t-0 sm:pl-6' : ''}`}>
              <dt className="label text-faint">{k}</dt>
              <dd className="mt-2 flex items-center gap-2 text-[15px]">{live && <span className="h-1.5 w-1.5 rounded-full bg-live" />}{v}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="relative overflow-hidden border-y border-line bg-card/60 py-4" aria-label="Tools I use">
        <div className="marquee flex w-max gap-10 whitespace-nowrap">
          {[...marquee, ...marquee].map((m, i) => (
            <span key={i} className="flex items-center gap-10 text-[15px] text-muted">{m}<span className="text-[10px] text-faint" aria-hidden="true">◆</span></span>
          ))}
        </div>
      </div>
    </section>
  )
}
