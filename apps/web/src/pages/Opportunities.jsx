import { useEffect, useState } from 'react'

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000'

export default function Opportunities() {
  const [items, setItems] = useState([])
  const [type, setType] = useState('')
  const [country, setCountry] = useState('')

  async function load() {
    const params = new URLSearchParams()
    if (type) params.set('type', type)
    if (country) params.set('country', country)
    const res = await fetch(`${API}/api/opportunities?` + params.toString())
    const data = await res.json()
    setItems(data.items || [])
  }

  useEffect(() => { load() }, [])

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <div className="w-12 h-12 bg-gray-700 rounded-2xl flex items-center justify-center text-2xl">
            🎯
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
            Scholarships & Opportunities
          </h1>
        </div>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Discover funding opportunities, internships, and competitions tailored to your profile and interests.
        </p>
      </div>

      {/* Filters */}
      <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
        <h2 className="text-xl font-bold text-white mb-4">Filter Opportunities</h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <select 
            value={type} 
            onChange={e=>setType(e.target.value)} 
            className="flex-1 bg-gray-700 border border-gray-600 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="">All Types</option>
            <option>scholarship</option>
            <option>internship</option>
            <option>competition</option>
          </select>
          <input 
            placeholder="Country code (e.g., IN)" 
            value={country} 
            onChange={e=>setCountry(e.target.value)} 
            className="flex-1 bg-gray-700 border border-gray-600 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
          <button 
            onClick={load} 
            className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300"
          >
            Apply Filters
          </button>
        </div>
      </div>

      {/* Opportunities Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map(i => (
          <div 
            key={i.id} 
            className="group bg-gray-800 rounded-2xl p-6 border border-gray-700 hover:border-orange-500/50 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/10 cursor-pointer"
            onClick={() => i.url && window.open(i.url, '_blank', 'noopener,noreferrer')}
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 bg-gray-700 rounded-xl flex items-center justify-center text-xl">
                  {i.type === 'scholarship' ? '💰' : i.type === 'internship' ? '💼' : '🏆'}
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  i.type === 'scholarship' ? 'bg-green-500/20 text-green-400' :
                  i.type === 'internship' ? 'bg-blue-500/20 text-blue-400' :
                  'bg-purple-500/20 text-purple-400'
                }`}>
                  {i.type}
                </span>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white group-hover:text-orange-400 transition-colors duration-300">
                  {i.title}
                </h3>
                <p className="text-gray-400 text-sm">
                  <span className="font-medium">Eligibility:</span> {i.eligibility}
                </p>
                <p className="text-gray-400 text-sm">
                  <span className="font-medium">Location:</span> {i.country}
                </p>
              </div>
              
              <div className="flex items-center justify-between">
                <button 
                  className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-semibold px-4 py-2 rounded-lg transition-all duration-300"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (i.url) {
                      window.open(i.url, '_blank', 'noopener,noreferrer');
                    }
                  }}
                >
                  Learn More
                </button>
                {i.url && (
                  <div className="ml-2 text-orange-400 group-hover:text-orange-300 transition-colors duration-300">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-700 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4">
            🔍
          </div>
          <h3 className="text-xl font-semibold text-gray-400 mb-2">No opportunities found</h3>
          <p className="text-gray-500">Try adjusting your filters to see more results.</p>
        </div>
      )}
    </div>
  )
}


