import { useState } from 'react'
import { Nav, Hero, Demos, RecruiterMode } from './components/Top.jsx'
import { Experience, Skills, Certifications, Education, Contact } from './components/Sections.jsx'
import Projects from './components/Projects.jsx'
import Starfield from './components/Starfield.jsx'

export default function App() {
  const [briefing, setBriefing] = useState(false)
  return (
    <>
      <a href="#experience" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-full focus:bg-cyan focus:px-4 focus:py-2 focus:text-[#04121a]">Skip to content</a>
      <Starfield />
      <Nav onBriefing={() => setBriefing(true)} />
      <main className="relative z-10">
        <Hero />
        <Demos />
        <Experience />
        <Skills />
        <Projects />
        <Certifications />
        <Education />
        <Contact />
      </main>
      <RecruiterMode open={briefing} onClose={() => setBriefing(false)} />
    </>
  )
}
