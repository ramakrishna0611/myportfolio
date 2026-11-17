import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { profile } from './data.js'
import { Icon } from './ui.jsx'

const LINKS = [['about', 'About'], ['experience', 'Experience'], ['projects', 'Projects'], ['skills', 'Skills'], ['certifications', 'Certifications']]

export function useTheme() {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'))
  const toggle = () => {
    const next = !dark
    setDark(next)
    document.documentElement.classList.toggle('dark', next)
    document.querySelector('meta[name=theme-color]')?.setAttribute('content', next ? '#0b0b0c' : '#fafaf9')
    try { localStorage.setItem('theme', next ? 'dark' : 'light') } catch (e) { /* private mode: theme just won't stick */ }
  }
  return [dark, toggle]
}

export default function Nav() {
  const [dark, toggle] = useTheme()
  const [active, setActive] = useState('')
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  // highlight whichever section holds the middle of the screen
  useEffect(() => {
    const io = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && setActive(e.target.id)), { rootMargin: '-45% 0px -50% 0px' })
    ;[...LINKS.map(l => l[0]), 'contact'].forEach(id => { const el = document.getElementById(id); el && io.observe(el) })
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll(); window.addEventListener('scroll', onScroll, { passive: true })
    return () => { io.disconnect(); window.removeEventListener('scroll', onScroll) }
  }, [])

  return (
    <div className="fixed inset-x-0 top-3 z-50 px-3 sm:top-4 sm:px-6">
      <nav aria-label="Main" className={`mx-auto flex h-[60px] max-w-[1136px] items-center gap-2 rounded-full border pl-5 pr-2 transition-all duration-300 ${scrolled || open
        ? 'border-line bg-raised/80 shadow-[0_12px_40px_-16px_rgba(0,0,0,.22)] backdrop-blur-xl' : 'border-transparent'}`}>
        <a href="#top" className="mr-auto flex items-center gap-2.5 text-[15px] font-semibold tracking-[-0.01em]">
          <span className="h-2 w-2 rounded-full bg-ink" />{profile.first} {profile.last}
        </a>

        <ul className="hidden items-center gap-0.5 md:flex">
          {LINKS.map(([id, label]) => (
            <li key={id} className="relative">
              {active === id && <motion.span layoutId="pill" className="absolute inset-0 rounded-full bg-ink" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
              <a href={`#${id}`} className={`relative block rounded-full px-3.5 py-2 text-[14px] transition-colors lg:px-4 ${active === id ? 'font-medium text-bg' : 'text-muted hover:text-ink'}`}>{label}</a>
            </li>
          ))}
        </ul>

        <button onClick={toggle} aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'} className="ml-auto grid h-10 w-10 place-items-center rounded-full text-muted transition hover:bg-card hover:text-ink md:ml-3">
          {dark ? <Icon.sun /> : <Icon.moon />}
        </button>
        <a href="#contact" className="hidden h-11 items-center gap-1.5 rounded-full bg-ink px-5 text-[14px] font-medium text-bg transition hover:opacity-85 sm:inline-flex">
          Let’s talk <Icon.arrowUR className="h-4 w-4" />
        </a>
        <button onClick={() => setOpen(o => !o)} aria-expanded={open} aria-label="Menu" className="grid h-10 w-10 place-items-center rounded-full text-ink md:hidden">
          {open ? <Icon.close /> : <Icon.menu />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.ul initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className="mx-auto mt-2 max-w-[1136px] rounded-3xl border border-line bg-raised/95 p-2 shadow-xl backdrop-blur-xl md:hidden">
            {[...LINKS, ['contact', 'Let’s talk']].map(([id, label]) => (
              <li key={id}><a href={`#${id}`} onClick={() => setOpen(false)} className="block rounded-2xl px-4 py-3 text-[16px] hover:bg-card">{label}</a></li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}
