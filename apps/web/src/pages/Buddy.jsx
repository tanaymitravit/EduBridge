import { useState, useEffect } from 'react'

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000'

export default function Buddy() {
  const [message, setMessage] = useState('Explain arrays vs linked lists')
  const [level, setLevel] = useState('beginner')
  const [language, setLanguage] = useState('en')
  const [reply, setReply] = useState('')
  const [topic, setTopic] = useState('JavaScript basics')
  const [resources, setResources] = useState([])
  const [status, setStatus] = useState({ hasKey: true, model: '' })
  const isFallback = reply?.startsWith('AI (offline demo)')

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch(`${API}/api/ai/status`).then(r=>r.json())
        setStatus(r)
      } catch {
        setStatus({ hasKey: false, model: '' })
      }
    })()
  }, [])

  async function ask() {
    const res = await fetch(`${API}/api/ai/chat`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message, level, language }) })
    const data = await res.json()
    setReply(data.reply || '')
  }

  async function recommend() {
    const res = await fetch(`${API}/api/ai/recommend`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ topic, level, language }) })
    const data = await res.json()
    setResources(data.items || [])
    localStorage.setItem('offlineResources', JSON.stringify(data.items || []))
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <div className="w-12 h-12 bg-gray-700 rounded-2xl flex items-center justify-center text-2xl">
            🤖
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
            AI Career & Learning Buddy
          </h1>
        </div>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Get personalized guidance powered by Gemini AI. Ask questions, get explanations, and discover resources tailored to your learning level.
        </p>
      </div>

      {/* Status Alerts */}
      {!status.hasKey && (
        <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center">
              ⚠️
            </div>
            <div>
              <h3 className="font-semibold text-yellow-400">Demo Mode</h3>
              <p className="text-yellow-300/80 text-sm">AI key not configured. Using offline demo responses.</p>
            </div>
          </div>
        </div>
      )}
      {status.hasKey && isFallback && (
        <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center">
              🔄
            </div>
            <div>
              <h3 className="font-semibold text-red-400">Fallback Mode</h3>
              <p className="text-red-300/80 text-sm">AI fallback active due to network or API error.</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Chat Interface */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-4">Ask Your Question</h2>
            
            {/* Controls */}
            <div className="flex gap-3 mb-4">
              <select 
                value={level} 
                onChange={e=>setLevel(e.target.value)} 
                className="flex-1 bg-gray-700 border border-gray-600 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option>beginner</option>
                <option>intermediate</option>
                <option>advanced</option>
              </select>
              <select 
                value={language} 
                onChange={e=>setLanguage(e.target.value)} 
                className="flex-1 bg-gray-700 border border-gray-600 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="en">English</option>
                <option value="hi">Hindi</option>
              </select>
            </div>

            {/* Message Input */}
            <textarea 
              value={message} 
              onChange={e=>setMessage(e.target.value)} 
              className="w-full bg-gray-700 border border-gray-600 text-white px-4 py-3 rounded-lg h-32 resize-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Ask me anything about careers, learning, or skills..."
            />
            
            <button 
              onClick={ask} 
              className="w-full mt-4 bg-orange-600 hover:bg-orange-700 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300"
            >
              Ask AI Buddy
            </button>
          </div>

          {/* Response */}
          {reply && (
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center">
                  🤖
                </div>
                <h3 className="text-lg font-semibold text-white">AI Response</h3>
              </div>
              <div className="prose prose-invert max-w-none">
                <div className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                  {reply}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Resources */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-4">Recommended Resources</h2>
            
            <input 
              value={topic} 
              onChange={e=>setTopic(e.target.value)} 
              className="w-full bg-gray-700 border border-gray-600 text-white px-4 py-3 rounded-lg mb-4 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Enter a topic to get resources..."
            />
            
            <button 
              onClick={recommend} 
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300"
            >
              Get Resources
            </button>
          </div>

          {/* Resource List */}
          {resources.length > 0 && (
            <div className="space-y-4">
              {resources.map(r => (
                <div key={r.id} className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 border border-gray-700 hover:border-orange-500/50 transition-all duration-300">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-orange-300 mb-2">{r.title}</h4>
                      {r.note && (
                        <p className="text-gray-400 text-sm mb-3">{r.note}</p>
                      )}
                      <div className="flex items-center space-x-3">
                        {r.url && (
                          <a 
                            href={r.url} 
                            target="_blank" 
                            rel="noreferrer"
                            className="inline-flex items-center space-x-2 bg-orange-600 hover:bg-orange-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200"
                          >
                            <span>Open</span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                        )}
                        {r.offline && (
                          <span className="inline-flex items-center space-x-1 bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs">
                            <span>📱</span>
                            <span>Offline</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


