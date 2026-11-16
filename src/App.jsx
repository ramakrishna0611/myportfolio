import { lazy, Suspense, useEffect, useState } from 'react'
import { Header, PlainCV } from './components/Header.jsx'
import { Hero, Mind } from './components/Story.jsx'
import { Experience, Projects, Closing } from './components/Work.jsx'

// the 3D map is the heaviest part, so it loads after the first screen
const Journey = lazy(() => import('./components/Journey.jsx'))

export default function App() {
  const [plain, setPlain] = useState(false)

  // each chapter carries its own accent colour; the header line and buttons follow it
  useEffect(() => {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) document.documentElement.style.setProperty('--accent', e.target.dataset.accent) })
    }, { rootMargin: '-45% 0px -50% 0px' })
    const watch = () => document.querySelectorAll('[data-accent]').forEach(el => io.observe(el))
    watch()
    const mo = new MutationObserver(watch)
    mo.observe(document.getElementById('root'), { childList: true, subtree: true })
    return () => { io.disconnect(); mo.disconnect() }
  }, [])

  return (
    <div className="grain">
      <Header onPlain={() => setPlain(true)} />
      <main className="relative z-[2]">
        <Hero />
        <Mind />
        <Suspense fallback={<div className="h-[100svh]" />}>
          <Journey />
        </Suspense>
        <Experience />
        <Projects />
        <Closing />
      </main>
      <PlainCV open={plain} onClose={() => setPlain(false)} />
    </div>
  )
}
