import { motion } from 'motion/react'

/* Side-view school bus drawn in a 124x62 box. `wheel` is an optional motion value (degrees) that spins the wheels. */
export function BusShape({ wheel }) {
  const wheelAt = cx => (
    <motion.g key={cx} style={{ rotate: wheel, transformBox: 'fill-box', transformOrigin: 'center' }}>
      <circle cx={cx} cy="50" r="8.5" fill="#14151a" />
      <circle cx={cx} cy="50" r="3.6" fill="#d9d9d9" />
      <rect x={cx - 0.9} y="42.5" width="1.8" height="15" fill="#d9d9d9" />
    </motion.g>
  )
  return (
    <>
      <rect x="3" y="7" width="114" height="40" rx="9" fill="#ffc21a" stroke="#14151a" strokeWidth="2.5" />
      {[12, 32, 52, 72].map(x => (
        <rect key={x} x={x} y="14" width="16" height="13" rx="2.5" fill="#cfe8ff" stroke="#14151a" strokeWidth="2" />
      ))}
      <rect x="93" y="14" width="18" height="17" rx="3" fill="#cfe8ff" stroke="#14151a" strokeWidth="2" />
      <rect x="3" y="33" width="114" height="3.5" fill="#14151a" />
      <circle cx="113" cy="41" r="2.4" fill="#fff4bf" stroke="#14151a" strokeWidth="1.2" />
      <rect x="5" y="39" width="5" height="3" rx="1" fill="#ff5a4f" />
      {wheelAt(28)}
      {wheelAt(92)}
    </>
  )
}

export function Bus({ className = '', wheel }) {
  return (
    <svg viewBox="0 0 124 62" className={className} aria-hidden="true">
      <BusShape wheel={wheel} />
    </svg>
  )
}

export function SectionHeader({ stop, title, kicker }) {
  return (
    <div className="mb-10">
      <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.18em] text-muted">
        <span className="inline-flex h-6 items-center rounded-full bg-accent px-2.5 font-semibold text-accent-ink">Stop {String(stop).padStart(2, '0')}</span>
        <span className="h-px w-10 bg-line" />
        <span>{kicker}</span>
      </div>
      <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-ink sm:text-5xl">{title}</h2>
    </div>
  )
}

export function Reveal({ children, className = '', delay = 0, as = 'div' }) {
  const M = motion[as]
  return (
    <M
      className={className}
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </M>
  )
}

export function Button({ href, children, variant = 'ghost', className = '', ...rest }) {
  const base = 'inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-link'
  const styles = {
    primary: 'bg-accent text-accent-ink shadow-[0_2px_0_#14151a] hover:-translate-y-0.5 hover:shadow-[0_4px_0_#14151a] active:translate-y-0 active:shadow-none',
    dark: 'bg-ink text-bg hover:opacity-90',
    ghost: 'border border-line bg-surface text-ink hover:border-ink',
  }
  const external = href?.startsWith('http')
  return (
    <a href={href} className={`${base} ${styles[variant]} ${className}`} {...(external ? { target: '_blank', rel: 'noopener' } : {})} {...rest}>
      {children}
    </a>
  )
}

export const Icon = {
  arrow: p => <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4" {...p}><path d="M5 10h10M11 6l4 4-4 4" /></svg>,
  down: p => <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4" {...p}><path d="M10 4v10M6 10l4 4 4-4M4 17h12" /></svg>,
  play: p => <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5" {...p}><path d="M6 4l10 6-10 6z" /></svg>,
  github: p => <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" {...p}><path d="M12 .5a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1.1-.7.1-.7.1-.7 1.2.1 1.9 1.2 1.9 1.2 1.1 1.9 2.9 1.3 3.6 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-6a4.7 4.7 0 0 1 1.3-3.2c-.2-.3-.6-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17.3 4.9 18.3 5.2 18.3 5.2c.7 1.7.2 2.9.1 3.2a4.7 4.7 0 0 1 1.3 3.2c0 4.6-2.8 5.7-5.5 6 .4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .5z" /></svg>,
  linkedin: p => <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" {...p}><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.7h.1c.5-1 1.8-2 3.8-2 4 0 4.8 2.6 4.8 6V21h-4v-5.6c0-1.3 0-3-1.9-3s-2.1 1.4-2.1 2.9V21H9z" /></svg>,
  mail: p => <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4" {...p}><rect x="2.5" y="4.5" width="15" height="11" rx="2" /><path d="M3 5.5l7 5 7-5" /></svg>,
  bolt: p => <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" {...p}><path d="M11 1 3 12h6l-1 7 8-11h-6z" /></svg>,
  sun: p => <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4" {...p}><circle cx="10" cy="10" r="3.5" /><path d="M10 1.5v2M10 16.5v2M1.5 10h2M16.5 10h2M4 4l1.4 1.4M14.6 14.6 16 16M4 16l1.4-1.4M14.6 5.4 16 4" /></svg>,
  moon: p => <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" {...p}><path d="M15.5 12.8A6.5 6.5 0 0 1 7.2 4.5a6.5 6.5 0 1 0 8.3 8.3z" /></svg>,
  close: p => <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5" {...p}><path d="M5 5l10 10M15 5 5 15" /></svg>,
  check: p => <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.4" className="h-3.5 w-3.5" {...p}><path d="M4 10.5l4 4 8-9" /></svg>,
  award: p => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-6 w-6" {...p}><circle cx="12" cy="9" r="6" /><path d="M8.5 14 7 22l5-3 5 3-1.5-8" /></svg>,
  briefcase: p => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-6 w-6" {...p}><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 13h18" /></svg>,
  cap: p => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-6 w-6" {...p}><path d="M2 9l10-5 10 5-10 5z" /><path d="M6 11v5c3 2.5 9 2.5 12 0v-5M22 9v6" /></svg>,
}

/* Minimal Python highlighter for the code excerpts */
const RE = /(#[^\n]*)|("""[\s\S]*?"""|"(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*')|\b(\d+(?:\.\d+)?)\b|\b(class|def|return|if|elif|else|for|in|not|and|or|None|True|False|import|from|while|with|as|lambda|self)\b|\b([A-Za-z_]\w*)(?=\()|(:=|==|\+|=|\{|\}|\[|\])/g

export function highlight(src) {
  const out = []
  let last = 0, m, i = 0
  RE.lastIndex = 0
  while ((m = RE.exec(src))) {
    if (m.index > last) out.push(src.slice(last, m.index))
    const cls = m[1] ? 'c' : m[2] ? 's' : m[3] ? 'n' : m[4] ? 'k' : m[5] ? (/^[A-Z]/.test(m[5]) ? 'b' : 'f') : 'o'
    out.push(<span key={i++} className={`tk-${cls}`}>{m[0]}</span>)
    last = RE.lastIndex
  }
  out.push(src.slice(last))
  return out
}

export function CodeWindow({ file, code, note, className = '' }) {
  const lines = code.split('\n')
  return (
    <div className={`overflow-hidden rounded-2xl border border-black/80 bg-code text-[#e8e9ee] shadow-[0_20px_50px_-24px_rgba(0,0,0,.55)] ${className}`}>
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2.5 font-mono text-xs text-white/60">
        <span className="flex gap-1.5"><i className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]" /><i className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" /><i className="h-2.5 w-2.5 rounded-full bg-[#27c93f]" /></span>
        <span className="ml-2 text-white/90">{file}</span>
        {note && <span className="ml-auto truncate">{note}</span>}
      </div>
      <pre className="overflow-x-auto py-4 font-mono text-[12.5px] leading-[1.75] sm:text-[13px]">
        {lines.map((l, i) => (
          <div key={i} className="whitespace-pre pr-5">
            <span className="inline-block w-10 select-none pr-4 text-right text-white/25">{i + 1}</span>
            {highlight(l) }
          </div>
        ))}
      </pre>
    </div>
  )
}
