import { useState } from 'react'
import { stops } from './data.js'
import { Nav, Hero, RecruiterMode } from './components/Top.jsx'
import { Experience, Skills, Certifications, Education, Contact } from './components/Sections.jsx'
import Projects from './components/Projects.jsx'
import Road from './components/Road.jsx'

export default function App() {
  const [recruiter, setRecruiter] = useState(false)
  return (
    <>
      <a href="#experience" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-bg">Skip to content</a>
      <Nav onRecruiter={() => setRecruiter(true)} />
      <main>
        <Hero />
        <Experience />
        <Skills />
        <Projects />
        <Certifications />
        <Education />
        <Contact />
      </main>
      <Road stops={stops} />
      <RecruiterMode open={recruiter} onClose={() => setRecruiter(false)} />
    </>
  )
}
