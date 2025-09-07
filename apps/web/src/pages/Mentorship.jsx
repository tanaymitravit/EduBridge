import { useEffect, useState } from 'react'

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000'

export default function Mentorship() {
  const [mentors, setMentors] = useState([])
  const [domain, setDomain] = useState('')
  const [language, setLanguage] = useState('en')
  const [match, setMatch] = useState(null)

  async function load() {
    const params = new URLSearchParams()
    if (domain) params.set('domain', domain)
    if (language) params.set('language', language)
    const res = await fetch(`${API}/api/mentors?` + params.toString())
    const data = await res.json()
    setMentors(data.items || [])
  }

  useEffect(() => { load() }, [])

  async function doMatch() {
    const res = await fetch(`${API}/api/mentors/match`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ interests: [domain], language }) })
    const data = await res.json()
    setMatch(data.mentor)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <div className="w-12 h-12 bg-gray-700 rounded-2xl flex items-center justify-center text-2xl">
            👥
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
            Mentorship Network
          </h1>
        </div>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Connect with industry professionals and experienced mentors for personalized career guidance and academic support.
        </p>
      </div>

      {/* Search & Match */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700">
        <h2 className="text-xl font-bold text-white mb-4">Find Your Mentor</h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <input 
            placeholder="Domain (e.g., Software, Finance, Design)" 
            value={domain} 
            onChange={e=>setDomain(e.target.value)} 
            className="flex-1 bg-gray-700 border border-gray-600 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
          <select 
            value={language} 
            onChange={e=>setLanguage(e.target.value)} 
            className="bg-gray-700 border border-gray-600 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="en">English</option>
            <option value="hi">Hindi</option>
          </select>
          <button 
            onClick={load} 
            className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300"
          >
            Search
          </button>
          <button 
            onClick={doMatch} 
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300"
          >
            Auto Match
          </button>
        </div>
      </div>

      {/* Match Result */}
      {match && (
        <div className="bg-gradient-to-r from-green-500/10 to-teal-500/10 border border-green-500/20 rounded-2xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
              ✨
            </div>
            <h3 className="text-lg font-semibold text-green-400">Perfect Match Found!</h3>
          </div>
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 border border-gray-700">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gray-700 rounded-xl flex items-center justify-center text-xl">
                👨‍💼
              </div>
              <div>
                <h4 className="text-xl font-bold text-white">{match.name}</h4>
                <p className="text-gray-400">{match.domain} • {match.languages.join(', ')}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mentors Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mentors.map(m => (
          <div key={m.id} className="group bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 hover:border-orange-500/50 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/10">
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-700 rounded-xl flex items-center justify-center text-xl">
                  👨‍💼
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-orange-400 transition-colors duration-300">
                    {m.name}
                  </h3>
                  <p className="text-gray-400 text-sm">{m.domain}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-400 text-sm">Languages:</span>
                  <div className="flex space-x-1">
                    {m.languages.map(lang => (
                      <span key={lang} className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs">
                        {lang === 'en' ? 'English' : 'Hindi'}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-semibold px-4 py-2 rounded-lg transition-all duration-300">
                  Connect
                </button>
                <button className="px-4 py-2 border border-gray-600 text-gray-300 hover:border-orange-500 hover:text-orange-400 rounded-lg transition-all duration-300">
                  View Profile
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {mentors.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-700 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4">
            👥
          </div>
          <h3 className="text-xl font-semibold text-gray-400 mb-2">No mentors found</h3>
          <p className="text-gray-500">Try adjusting your search criteria or use Auto Match to find the perfect mentor.</p>
        </div>
      )}
    </div>
  )
}


