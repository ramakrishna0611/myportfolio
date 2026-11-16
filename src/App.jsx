import { useCallback, useEffect, useState } from 'react'
import { Nav, RecruiterMode } from './components/Top.jsx'
import World, { DESTS } from './components/World.jsx'
import Panel from './components/Panels.jsx'
import Starfield from './components/Starfield.jsx'

const fromHash = () => {
  const id = window.location.hash.slice(1)
  return DESTS.some(d => d.id === id) ? id : null
}

export default function App() {
  const [briefing, setBriefing] = useState(false)
  const [initial] = useState(fromHash) // a shared link like #sieve opens straight on the map
  const [openId, setOpenId] = useState(initial)

  const go = useCallback(id => {
    setOpenId(id)
    history.replaceState(null, '', id ? `#${id}` : window.location.pathname + window.location.search)
  }, [])
  const close = useCallback(() => go(null), [go])

  useEffect(() => {
    const onHash = () => setOpenId(fromHash())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  return (
    <>
      <Starfield />
      <Nav onBriefing={() => setBriefing(true)} onMap={close} />
      <main className="relative z-10">
        <World onOpen={go} openId={openId} startOnMap={!!initial} />
      </main>
      <Panel id={openId} onClose={close} onGo={go} />
      <RecruiterMode open={briefing} onClose={() => setBriefing(false)} />
    </>
  )
}
