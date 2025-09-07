import { Link } from 'react-router-dom'

export default function Home() {
  const features = [
    {
      icon: "🤖",
      title: "AI Career & Learning Buddy",
      description: "Get personalized guidance powered by Gemini AI",
      link: "/buddy",
      color: "from-blue-500 to-purple-600"
    },
    {
      icon: "🎯",
      title: "Scholarships & Opportunities",
      description: "Discover funding and career opportunities",
      link: "/opportunities",
      color: "from-green-500 to-teal-600"
    },
    {
      icon: "👥",
      title: "Mentorship Network",
      description: "Connect with industry professionals",
      link: "/mentorship",
      color: "from-purple-500 to-pink-600"
    },
    {
      icon: "🤝",
      title: "Sponsor–Student Connector",
      description: "Bridge the gap between sponsors and students",
      link: "/sponsors",
      color: "from-orange-500 to-red-600"
    },
    {
      icon: "🎮",
      title: "Gamified Career Explorer",
      description: "Explore career paths through interactive gaming",
      link: "/gamify",
      color: "from-yellow-500 to-orange-600"
    },
    {
      icon: "📄",
      title: "Resume & Interview Assistant",
      description: "Build professional resumes and practice interviews",
      link: "/resume",
      color: "from-indigo-500 to-blue-600"
    }
  ]

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <div className="text-center space-y-8 py-16">
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 bg-clip-text text-transparent leading-tight">
            EduBridge
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Bridging educational inequality through AI-powered career guidance, mentorship, and opportunity access
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to="/buddy" 
            className="px-8 py-4 bg-orange-600 text-white font-semibold rounded-xl hover:bg-orange-700 transition-all duration-300"
          >
            Start with AI Buddy
          </Link>
          <Link 
            to="/opportunities" 
            className="px-8 py-4 border-2 border-orange-500 text-orange-400 font-semibold rounded-xl hover:bg-orange-500 hover:text-white transition-all duration-300"
          >
            Explore Opportunities
          </Link>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <Link
            key={index}
            to={feature.link}
            className="group relative overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700 hover:border-orange-500/50 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/10"
          >
            <div className="space-y-4">
              <div className="w-16 h-16 bg-gray-700 rounded-2xl flex items-center justify-center text-2xl transform group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-white group-hover:text-orange-400 transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                {feature.description}
              </p>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/0 to-orange-500/0 group-hover:from-orange-500/5 group-hover:to-orange-500/10 transition-all duration-300 rounded-2xl"></div>
          </Link>
        ))}
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700">
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div className="space-y-2">
            <div className="text-3xl font-bold text-orange-400">10K+</div>
            <div className="text-gray-400">Students Helped</div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-orange-400">500+</div>
            <div className="text-gray-400">Mentors Available</div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-orange-400">1K+</div>
            <div className="text-gray-400">Opportunities Listed</div>
          </div>
        </div>
      </div>
    </div>
  );
}


