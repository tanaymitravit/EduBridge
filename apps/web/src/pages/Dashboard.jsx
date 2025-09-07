import { useEffect, useState } from 'react'

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000'

export default function Dashboard() {
  const [gamify, setGamify] = useState({})
  const [impact, setImpact] = useState([])

  async function load() {
    const p = await fetch(`${API}/api/gamify/progress`)
    const pd = await p.json()
    setGamify(pd.progress || {})
    const i = await fetch(`${API}/api/sponsors/impact`)
    const id = await i.json()
    setImpact(id.matches || [])
  }
  useEffect(() => { load() }, [])

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-semibold text-orange-400">Teacher/Mentor Dashboard</h2>
      <div className="grid md:grid-cols-2 gap-3">
        <div className="border border-neutral-700 p-3 bg-neutral-900 rounded">
          <div className="font-medium mb-2 text-orange-300">Student Progress (Gamify)</div>
          <pre className="overflow-auto">{JSON.stringify(gamify, null, 2)}</pre>
        </div>
        <div className="border border-neutral-700 p-3 bg-neutral-900 rounded">
          <div className="font-medium mb-2 text-orange-300">Sponsor Impact</div>
          <ul className="space-y-2">
            {impact.map(i => <li key={i.id} className="border border-neutral-700 p-2 rounded bg-neutral-900">{i.studentName} → {i.sponsorId} ({i.need})</li>)}
          </ul>
        </div>
      </div>
    </div>
  )
}


