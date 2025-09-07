import { useEffect, useState } from 'react'

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000'

export default function Gamify() {
  const [paths, setPaths] = useState([])
  const [progress, setProgress] = useState({})
  const [selected, setSelected] = useState('')
  const [activeTab, setActiveTab] = useState('explorer')
  const [userLevel, setUserLevel] = useState(1)
  const [userXP, setUserXP] = useState(0)
  const [personalityResults, setPersonalityResults] = useState(null)
  const [showPersonalityQuiz, setShowPersonalityQuiz] = useState(false)
  const [quizAnswers, setQuizAnswers] = useState({})
  const [simulationActive, setSimulationActive] = useState(false)
  const [simulationScenario, setSimulationScenario] = useState(null)
  
  // DSA specific states
  const [dsaRoadmap, setDsaRoadmap] = useState(null)
  const [dsaStats, setDsaStats] = useState(null)
  const [expandedSteps, setExpandedSteps] = useState({})
  const [expandedTopics, setExpandedTopics] = useState({})
  const [selectedDifficulty, setSelectedDifficulty] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  async function load() {
    const res = await fetch(`${API}/api/gamify/paths`)
    const data = await res.json()
    setPaths(data.items || [])
    const pr = await fetch(`${API}/api/gamify/progress`)
    const d2 = await pr.json()
    setProgress(d2.progress || {})
    setUserLevel(d2.userLevel || 1)
    setUserXP(d2.userXP || 0)
  }

  async function loadDsaData() {
    try {
      const [roadmapRes, statsRes] = await Promise.all([
        fetch(`${API}/api/gamify/dsa/roadmap`),
        fetch(`${API}/api/gamify/dsa/stats`)
      ])
      const roadmapData = await roadmapRes.json()
      const statsData = await statsRes.json()
      setDsaRoadmap(roadmapData.roadmap)
      setDsaStats(statsData)
    } catch (error) {
      console.error('Error loading DSA data:', error)
    }
  }

  useEffect(() => { 
    load()
    if (activeTab === 'dsa') {
      loadDsaData()
    }
  }, [activeTab])

  async function unlock(a) {
    const res = await fetch(`${API}/api/gamify/progress`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ careerId: selected, achievement: a }) })
    const data = await res.json()
    setProgress(data.progress || {})
    setUserXP(data.userXP || userXP)
    setUserLevel(data.userLevel || userLevel)
  }

  const handlePersonalityQuiz = async () => {
    const res = await fetch(`${API}/api/gamify/personality`, { 
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify({ answers: quizAnswers }) 
    })
    const data = await res.json()
    setPersonalityResults(data.results)
    setShowPersonalityQuiz(false)
  }

  const startSimulation = async (careerId) => {
    const res = await fetch(`${API}/api/gamify/simulation`, { 
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify({ careerId }) 
    })
    const data = await res.json()
    setSimulationScenario(data.scenario)
    setSimulationActive(true)
  }

  const toggleStep = (stepId) => {
    setExpandedSteps(prev => ({
      ...prev,
      [stepId]: !prev[stepId]
    }))
  }

  const toggleTopic = (topicId) => {
    setExpandedTopics(prev => ({
      ...prev,
      [topicId]: !prev[topicId]
    }))
  }

  const updateProblemStatus = async (stepId, topicId, problemId, currentStatus) => {
    const newStatus = currentStatus === 'completed' ? 'pending' : 'completed'
    
    try {
      const res = await fetch(`${API}/api/gamify/dsa/progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stepId, topicId, problemId, status: newStatus })
      })
      
      if (res.ok) {
        // Reload DSA data to reflect changes
        loadDsaData()
      }
    } catch (error) {
      console.error('Error updating problem status:', error)
    }
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-500'
      case 'Medium': return 'bg-yellow-500'
      case 'Hard': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const current = paths.find(p => p.id === selected)
  const unlocked = progress?.[selected]?.unlocked || []
  const totalXP = userLevel * 1000
  const progressPercent = (userXP / totalXP) * 100

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header with Level and XP */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">Career Explorer</h1>
              <p className="text-slate-600 text-lg">Discover your perfect career path through interactive exploration</p>
            </div>
            <div className="text-right">
              <div className="bg-slate-100 rounded-2xl p-6 border border-slate-200">
                <div className="text-slate-900 font-bold text-2xl">Level {userLevel}</div>
                <div className="text-slate-600 text-sm mb-3">Explorer</div>
                <div className="w-40 bg-slate-200 rounded-full h-3 mb-2">
                  <div 
                    className="bg-blue-600 rounded-full h-3 transition-all duration-500" 
                    style={{ width: `${progressPercent}%` }}
                  ></div>
                </div>
                <div className="text-slate-700 text-sm font-medium">{userXP}/{totalXP} XP</div>
              </div>
            </div>
          </div>
          
          {/* Tab Navigation */}
          <div className="flex space-x-1 bg-slate-100 rounded-2xl p-2 border border-slate-200">
            {[
              { id: 'explorer', label: 'Career Explorer' },
              { id: 'dsa', label: 'DSA Roadmap' },
              { id: 'personality', label: 'Personality Match' },
              { id: 'simulation', label: 'Career Simulation' },
              { id: 'achievements', label: 'Achievements' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
                  activeTab === tab.id 
                    ? 'bg-white text-slate-900 shadow-md border border-slate-200' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* DSA Roadmap Tab */}
        {activeTab === 'dsa' && (
          <div className="space-y-8">
            {/* DSA Header */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200">
              <div className="text-center mb-8">
                <h2 className="text-4xl font-bold text-slate-900 mb-4">DSA Roadmap</h2>
                <p className="text-slate-600 text-lg">Master Data Structures and Algorithms step by step</p>
              </div>

              {/* Progress Summary */}
              {dsaStats && (
                <div className="bg-slate-50 rounded-2xl p-6 mb-6 border border-slate-200">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-slate-900">Total Progress</h3>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-slate-900">{dsaStats.completed} / {dsaStats.total}</div>
                      <div className="text-slate-600">Problems Completed</div>
                    </div>
                  </div>
                  
                  <div className="w-full bg-slate-200 rounded-full h-4 mb-6">
                    <div 
                      className="bg-blue-600 rounded-full h-4 transition-all duration-500" 
                      style={{ width: `${dsaStats.progress}%` }}
                    ></div>
                  </div>

                  <div className="grid grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{dsaStats.difficulty.easy.completed}/{dsaStats.difficulty.easy.total}</div>
                      <div className="text-slate-600 text-sm mb-2">Easy</div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 rounded-full h-2" 
                          style={{ width: `${(dsaStats.difficulty.easy.completed / dsaStats.difficulty.easy.total) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-600">{dsaStats.difficulty.medium.completed}/{dsaStats.difficulty.medium.total}</div>
                      <div className="text-slate-600 text-sm mb-2">Medium</div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div 
                          className="bg-yellow-500 rounded-full h-2" 
                          style={{ width: `${(dsaStats.difficulty.medium.completed / dsaStats.difficulty.medium.total) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">{dsaStats.difficulty.hard.completed}/{dsaStats.difficulty.hard.total}</div>
                      <div className="text-slate-600 text-sm mb-2">Hard</div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div 
                          className="bg-red-500 rounded-full h-2" 
                          style={{ width: `${(dsaStats.difficulty.hard.completed / dsaStats.difficulty.hard.total) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation and Filters */}
              <div className="flex flex-wrap items-center gap-4 bg-slate-50 rounded-2xl p-4 border border-slate-200">
                <div className="flex space-x-2">
                  <button className="bg-white text-slate-900 px-4 py-2 rounded-xl font-semibold border border-slate-200 shadow-sm">All Problems</button>
                  <button className="bg-slate-100 text-slate-600 px-4 py-2 rounded-xl font-semibold hover:bg-slate-200 border border-slate-200">Revision</button>
                </div>
                
                <div className="flex items-center space-x-4 ml-auto">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search problems..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-white text-slate-900 placeholder-slate-500 px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <span className="absolute right-3 top-2.5 text-slate-400">🔍</span>
                  </div>
                  
                  <select
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                    className="bg-white text-slate-900 px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="All">All Difficulty</option>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                  
                  <button className="bg-slate-100 text-slate-600 px-4 py-2 rounded-xl font-semibold hover:bg-slate-200 border border-slate-200">
                    &lt;&gt; Pick Random
                  </button>
                </div>
              </div>
            </div>

            {/* DSA Roadmap Content */}
            {dsaRoadmap && (
              <div className="space-y-4">
                {dsaRoadmap.steps.map((step, stepIndex) => (
                  <div key={step.id} className="bg-white rounded-2xl shadow-lg border border-slate-200">
                    {/* Step Header */}
                    <div 
                      className="p-6 cursor-pointer hover:bg-slate-50 transition-all duration-300 border-b border-slate-200"
                      onClick={() => toggleStep(step.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <span className="text-2xl text-slate-600">{expandedSteps[step.id] ? '▼' : '▶'}</span>
                          <div>
                            <h3 className="text-xl font-bold text-slate-900">Step {stepIndex + 1}: {step.title}</h3>
                            <div className="flex items-center space-x-4 mt-2">
                              <span className="text-blue-600 font-semibold">{step.completed} / {step.total}</span>
                              <div className="w-32 bg-slate-200 rounded-full h-2">
                                <div 
                                  className="bg-blue-600 rounded-full h-2 transition-all duration-500" 
                                  style={{ width: `${(step.completed / step.total) * 100}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Step Content */}
                    {expandedSteps[step.id] && (
                      <div className="px-6 pb-6 space-y-4">
                        {step.topics.map((topic, topicIndex) => (
                          <div key={topic.id} className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                            {/* Topic Header */}
                            <div 
                              className="cursor-pointer hover:bg-white transition-all duration-300 p-3 rounded-lg"
                              onClick={() => toggleTopic(topic.id)}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <span className="text-lg text-slate-600">{expandedTopics[topic.id] ? '▼' : '▶'}</span>
                                  <div>
                                    <h4 className="text-lg font-semibold text-slate-900">{topic.title}</h4>
                                    <div className="flex items-center space-x-4 mt-1">
                                      <span className="text-blue-600 font-semibold text-sm">{topic.completed} / {topic.total}</span>
                                      <div className="w-24 bg-slate-200 rounded-full h-1.5">
                                        <div 
                                          className="bg-blue-600 rounded-full h-1.5 transition-all duration-500" 
                                          style={{ width: `${(topic.completed / topic.total) * 100}%` }}
                                        ></div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Topic Problems */}
                            {expandedTopics[topic.id] && (
                              <div className="mt-4 bg-white rounded-xl p-4 border border-slate-200">
                                <div className="overflow-x-auto">
                                  <table className="w-full">
                                    <thead>
                                      <tr className="border-b border-slate-200">
                                        <th className="text-left py-3 px-4 text-slate-900 font-semibold">Status</th>
                                        <th className="text-left py-3 px-4 text-slate-900 font-semibold">Problem</th>
                                        <th className="text-left py-3 px-4 text-slate-900 font-semibold">TUF</th>
                                        <th className="text-left py-3 px-4 text-slate-900 font-semibold">Resource (Plus)</th>
                                        <th className="text-left py-3 px-4 text-slate-900 font-semibold">Resource (Free)</th>
                                        <th className="text-left py-3 px-4 text-slate-900 font-semibold">Practice</th>
                                        <th className="text-left py-3 px-4 text-slate-900 font-semibold">Note</th>
                                        <th className="text-left py-3 px-4 text-slate-900 font-semibold">Revision</th>
                                        <th className="text-left py-3 px-4 text-slate-900 font-semibold">Difficulty</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {topic.problems.map((problem) => (
                                        <tr key={problem.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                          <td className="py-3 px-4">
                                            <button
                                              onClick={() => updateProblemStatus(step.id, topic.id, problem.id, problem.status)}
                                              className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all duration-300 ${
                                                problem.status === 'completed' 
                                                  ? 'bg-blue-600 border-blue-600 text-white' 
                                                  : 'border-slate-300 hover:border-blue-500'
                                              }`}
                                            >
                                              {problem.status === 'completed' && '✓'}
                                            </button>
                                          </td>
                                          <td className="py-3 px-4 text-slate-900 font-medium">{problem.title}</td>
                                          <td className="py-3 px-4">
                                            {problem.resources.tuf && (
                                              <button className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-700 transition-colors border border-blue-600">
                                                Solve
                                              </button>
                                            )}
                                          </td>
                                          <td className="py-3 px-4">
                                            {problem.resources.tuf && (
                                              <button className="bg-orange-500 text-white p-2 rounded-lg hover:bg-orange-600 transition-colors border border-orange-500">
                                                ▶+
                                              </button>
                                            )}
                                          </td>
                                          <td className="py-3 px-4">
                                            <div className="flex items-center space-x-2">
                                              {problem.resources.free && (
                                                <>
                                                  <button className="text-slate-600 hover:text-slate-900 transition-colors">📄</button>
                                                  <button className="bg-red-600 text-white p-1 rounded hover:bg-red-700 transition-colors border border-red-600">▶</button>
                                                </>
                                              )}
                                            </div>
                                          </td>
                                          <td className="py-3 px-4">
                                            {problem.resources.practice ? (
                                              <button className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-700 transition-colors border border-green-600">
                                                Practice
                                              </button>
                                            ) : (
                                              <span className="text-slate-400">-</span>
                                            )}
                                          </td>
                                          <td className="py-3 px-4">
                                            <button className="text-slate-400 hover:text-slate-600 transition-colors">+</button>
                                          </td>
                                          <td className="py-3 px-4">
                                            <button className="text-slate-400 hover:text-yellow-500 transition-colors">☆</button>
                                          </td>
                                          <td className="py-3 px-4">
                                            <span className={`px-2 py-1 rounded text-xs font-semibold text-white ${getDifficultyColor(problem.difficulty)}`}>
                                              {problem.difficulty}
                                            </span>
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Career Explorer Tab */}
        {activeTab === 'explorer' && (
          <div className="space-y-8">
            {/* Career Path Selection */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200">
              <h2 className="text-3xl font-bold text-slate-900 mb-6 text-center">Choose Your Career Path</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paths.map(path => (
                  <div
                    key={path.id}
                    onClick={() => setSelected(path.id)}
                    className={`bg-slate-50 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:shadow-md hover:bg-white border-2 ${
                      selected === path.id ? 'border-blue-500 bg-white shadow-md' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="w-16 h-16 bg-blue-100 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                      <div className="w-8 h-8 bg-blue-600 rounded-lg"></div>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{path.title}</h3>
                    <p className="text-slate-600 text-sm mb-4">{path.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600 text-sm">Difficulty: {path.difficulty || 'Medium'}</span>
                      <span className="text-yellow-600 text-sm font-semibold">⭐ {path.rating || '4.5'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Selected Career Details */}
            {current && (
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Skills Tree */}
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200">
                  <h3 className="text-2xl font-bold text-slate-900 mb-6">
                    Skill Tree
                  </h3>
                  <div className="space-y-4">
                    {current.skills?.map((skill, index) => (
                      <div key={skill} className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                              <span className="text-blue-600 font-bold">{index + 1}</span>
                            </div>
                            <span className="text-slate-900 font-semibold">{skill}</span>
                          </div>
                          <div className="w-24 bg-slate-200 rounded-full h-2">
                            <div className="bg-blue-600 rounded-full h-2 w-3/4"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Achievements */}
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200">
                  <h3 className="text-2xl font-bold text-slate-900 mb-6">
                    Achievements
                  </h3>
                  <div className="space-y-4">
                    {current.achievements?.map(achievement => (
                      <div key={achievement} className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                              unlocked.includes(achievement) ? 'bg-yellow-100' : 'bg-slate-200'
                            }`}>
                              <div className={`w-4 h-4 rounded-full ${
                                unlocked.includes(achievement) ? 'bg-yellow-500' : 'bg-slate-400'
                              }`}></div>
                            </div>
                            <span className="text-slate-900 font-semibold">{achievement}</span>
                          </div>
                          <button
                            disabled={unlocked.includes(achievement)}
                            onClick={() => unlock(achievement)}
                            className={`px-4 py-2 rounded-xl font-semibold transition-all duration-300 ${
                              unlocked.includes(achievement)
                                ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                                : 'bg-blue-600 text-white hover:bg-blue-700 border border-blue-600'
                            }`}
                          >
                            {unlocked.includes(achievement) ? '✅ Unlocked' : '🔓 Unlock'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Other tabs would go here - Personality, Simulation, Achievements */}
        {activeTab === 'personality' && (
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200">
            <h2 className="text-3xl font-bold text-slate-900 mb-6 text-center">Personality Career Match</h2>
            <p className="text-slate-600 text-center">Coming soon...</p>
          </div>
        )}

        {activeTab === 'simulation' && (
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200">
            <h2 className="text-3xl font-bold text-slate-900 mb-6 text-center">Career Simulation</h2>
            <p className="text-slate-600 text-center">Coming soon...</p>
          </div>
        )}

        {activeTab === 'achievements' && (
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200">
            <h2 className="text-3xl font-bold text-slate-900 mb-6 text-center">Achievement Gallery</h2>
            <p className="text-slate-600 text-center">Coming soon...</p>
          </div>
        )}
      </div>
    </div>
  )
}
