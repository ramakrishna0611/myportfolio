import { motion } from 'motion/react'

const ease = [0.22, 1, 0.36, 1]

/* Fades a block up into place the first time it scrolls into view */
export const Reveal = ({ children, delay = 0, className, as = 'div' }) => {
  const M = motion[as]
  return (
    <M className={className} initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.7, delay, ease }}>
      {children}
    </M>
  )
}

/* "01  ABOUT" label, rule, then a big heading with a serif italic tail and a short note on the right */
export function SectionHead({ n, label, title, accent, note }) {
  return (
    <header>
      <Reveal className="flex items-center gap-4 border-b border-line pb-4">
        <span className="font-mono text-[13px] text-faint">{n}</span>
        <span className="label text-ink">{label}</span>
      </Reveal>
      <div className="mt-10 grid gap-6 md:mt-14 md:grid-cols-[1.25fr_1fr] md:items-end md:gap-16">
        <Reveal as="h2" className="text-[clamp(2.3rem,5.4vw,3.9rem)] font-semibold leading-[1.02] tracking-[-0.035em]">
          {title} <span className="accent">{accent}</span>
        </Reveal>
        {note && <Reveal delay={0.1} as="p" className="max-w-md text-[16px] leading-[1.75] text-muted">{note}</Reveal>}
      </div>
    </header>
  )
}

export const Button = ({ href, children, dark, className = '', ...rest }) => (
  <a href={href} {...rest}
    className={`inline-flex h-12 items-center gap-2 rounded-full px-6 text-[15px] font-medium transition active:scale-[.98] ${dark
      ? 'bg-ink text-bg hover:opacity-85'
      : 'border border-line bg-raised text-ink hover:border-ink/40'} ${className}`}>
    {children}
  </a>
)

export const Tag = ({ children, dot }) => (
  <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-raised px-3 py-1 text-[13px] text-muted">
    {dot && <span className="h-1 w-1 rounded-full bg-ink" />}{children}
  </span>
)

const svg = (d, props = {}) => p => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-[18px] w-[18px]" aria-hidden="true" {...props} {...p}>{d}</svg>
)

export const Icon = {
  arrowUR: svg(<path d="M7 17 17 7M8 7h9v9" />),
  arrowDown: svg(<path d="M12 5v14M6 13l6 6 6-6" />),
  download: svg(<path d="M12 4v11M7 10l5 5 5-5M5 20h14" />),
  mail: svg(<><rect x="3" y="5" width="18" height="14" rx="2.5" /><path d="m4 7 8 6 8-6" /></>),
  moon: svg(<path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z" />),
  sun: svg(<><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>),
  menu: svg(<path d="M4 8h16M4 16h16" />),
  close: svg(<path d="M6 6l12 12M18 6 6 18" />),
  copy: svg(<><rect x="9" y="9" width="11" height="11" rx="2" /><path d="M5 15V5a2 2 0 0 1 2-2h8" /></>),
  check: svg(<path d="m5 12 5 5 9-10" />),
  globe: svg(<><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.5 2.6 3.6 5.6 3.6 9s-1.1 6.4-3.6 9c-2.5-2.6-3.6-5.6-3.6-9S9.5 5.6 12 3z" /></>),
  award: svg(<><circle cx="12" cy="9" r="6" /><path d="M8.5 14 7 22l5-3 5 3-1.5-8" /></>),
  github: p => <svg viewBox="0 0 24 24" fill="currentColor" className="h-[18px] w-[18px]" aria-hidden="true" {...p}><path d="M12 .5a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1.1-.7.1-.7.1-.7 1.2.1 1.9 1.2 1.9 1.2 1.1 1.9 2.9 1.3 3.6 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-6a4.7 4.7 0 0 1 1.3-3.2c-.2-.3-.6-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17.3 4.9 18.3 5.2 18.3 5.2c.7 1.7.2 2.9.1 3.2a4.7 4.7 0 0 1 1.3 3.2c0 4.6-2.8 5.7-5.5 6 .4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .5z" /></svg>,
  linkedin: p => <svg viewBox="0 0 24 24" fill="currentColor" className="h-[18px] w-[18px]" aria-hidden="true" {...p}><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.7h.1c.5-1 1.8-2 3.8-2 4 0 4.8 2.6 4.8 6V21h-4v-5.6c0-1.3 0-3-1.9-3s-2.1 1.4-2.1 2.9V21H9z" /></svg>,
}

export const PAGE = 'mx-auto w-full max-w-[1136px] px-5 sm:px-8'
