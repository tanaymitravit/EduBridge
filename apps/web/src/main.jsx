import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import './styles.css'
import Home from './pages/Home.jsx'
import Buddy from './pages/Buddy.jsx'
import Opportunities from './pages/Opportunities.jsx'
import Mentorship from './pages/Mentorship.jsx'
import Sponsors from './pages/Sponsors.jsx'
import Gamify from './pages/Gamify.jsx'
import Resume from './pages/Resume.jsx'
import Dashboard from './pages/Dashboard.jsx'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-gray-100">
        <nav className="bg-black/80 backdrop-blur-md border-b border-orange-500/20 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link className="flex items-center space-x-2 group" to="/">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">E</span>
                </div>
                <span className="font-bold text-xl bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent group-hover:from-orange-300 group-hover:to-orange-500 transition-all duration-300">EduBridge</span>
              </Link>
              <div className="hidden md:flex items-center space-x-8">
                <Link className="text-gray-300 hover:text-orange-400 transition-colors duration-200 font-medium" to="/buddy">AI Buddy</Link>
                <Link className="text-gray-300 hover:text-orange-400 transition-colors duration-200 font-medium" to="/opportunities">Opportunities</Link>
                <Link className="text-gray-300 hover:text-orange-400 transition-colors duration-200 font-medium" to="/mentorship">Mentorship</Link>
                <Link className="text-gray-300 hover:text-orange-400 transition-colors duration-200 font-medium" to="/sponsors">Sponsors</Link>
                <Link className="text-gray-300 hover:text-orange-400 transition-colors duration-200 font-medium" to="/gamify">Explorer</Link>
                <Link className="text-gray-300 hover:text-orange-400 transition-colors duration-200 font-medium" to="/resume">Mock Interviewer</Link>
                <Link className="text-gray-300 hover:text-orange-400 transition-colors duration-200 font-medium" to="/dashboard">Dashboard</Link>
              </div>
              <div className="md:hidden">
                <button className="text-gray-300 hover:text-orange-400">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </nav>
        <main className="max-w-7xl mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/buddy" element={<Buddy />} />
            <Route path="/opportunities" element={<Opportunities />} />
            <Route path="/mentorship" element={<Mentorship />} />
            <Route path="/sponsors" element={<Sponsors />} />
            <Route path="/gamify" element={<Gamify />} />
            <Route path="/resume" element={<Resume />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

createRoot(document.getElementById('root')).render(<App />)


