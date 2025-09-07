import { useEffect, useState } from 'react'

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000'

export default function Sponsors() {
  const [items, setItems] = useState([])
  const [need, setNeed] = useState('mentorship')
  const [studentName, setStudentName] = useState('Student Demo')
  const [match, setMatch] = useState(null)
  const [impact, setImpact] = useState([])

  async function load() {
    const res = await fetch(`${API}/api/sponsors`)
    const data = await res.json()
    setItems(data.items || [])
  }
  async function connect() {
    const res = await fetch(`${API}/api/sponsors/connect`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ studentName, need }) })
    const data = await res.json()
    setMatch(data.match)
    impactLoad()
  }
  async function impactLoad() {
    const res = await fetch(`${API}/api/sponsors/impact`)
    const data = await res.json()
    setImpact(data.matches || [])
  }
  useEffect(() => { load(); impactLoad() }, [])

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-semibold text-orange-400">Sponsor–Student Connector</h2>
      <div className="flex gap-2">
        <input value={studentName} onChange={e=>setStudentName(e.target.value)} className="border border-neutral-700 bg-neutral-900 p-2 rounded" />
        <select value={need} onChange={e=>setNeed(e.target.value)} className="border border-neutral-700 bg-neutral-900 p-2 rounded">
          <option>mentorship</option>
          <option>resources</option>
          <option>scholarship</option>
        </select>
        <button onClick={connect} className="bg-orange-600 hover:bg-orange-500 text-white px-4 py-2 rounded">Connect</button>
      </div>
      <ul className="grid md:grid-cols-2 gap-3">
        {items.map(s => (
          <li key={s.id} className="border border-neutral-700 p-3 bg-neutral-900 rounded">
            <div className="font-medium text-orange-300">{s.name}</div>
            <div className="text-sm text-gray-400">Supports: {s.support.join(', ')}</div>
          </li>
        ))}
      </ul>
      {match && <div className="p-3 border border-neutral-700 bg-neutral-900 rounded">Connected with sponsor: <span className="font-medium text-orange-300">{match.sponsorId}</span></div>}
      <div>
        <h3 className="font-semibold text-orange-400">Impact</h3>
        <ul className="space-y-2">
          {impact.map(i => (
            <li key={i.id} className="border border-neutral-700 p-2 bg-neutral-900 rounded">{i.studentName} → {i.sponsorId} ({i.need})</li>
          ))}
        </ul>
      </div>
    </div>
  )
}


