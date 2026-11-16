import { useRef, useState } from 'react'
import { stops } from './data.js'
import { Nav, Hero, RecruiterMode } from './components/Top.jsx'
import { Experience, Skills, Certifications, Education, Contact } from './components/Sections.jsx'
import Projects from './components/Projects.jsx'
import WindingRoad from './components/WindingRoad.jsx'

export default function App() {
  const [recruiter, setRecruiter] = useState(false)
  const wrapRef = useRef(null)
  return (
    <>
      <a href="#experience" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-bg">Skip to content</a>
      <Nav onRecruiter={() => setRecruiter(true)} />
      <main ref={wrapRef} className="relative">
        <Hero />
        <WindingRoad wrapRef={wrapRef} sections={stops.slice(1)} />
        <div className="relative z-10">
          <Experience />
          <Skills />
          <Projects />
          <Certifications />
          <Education />
          <Contact />
        </div>
      </main>
      <RecruiterMode open={recruiter} onClose={() => setRecruiter(false)} />
    </>
  )
}
