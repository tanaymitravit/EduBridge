# 🎓 EduBridge - AI-Powered Career Development Platform

A comprehensive full-stack application that bridges the gap between students and career opportunities through AI-powered mentorship, mock interviews, and personalized career guidance.

## ✨ Features

### 🎤 AI Mock Interview
- **Natural Voice Synthesis**: High-quality, human-like voice responses
- **Real-time Speech Recognition**: Convert speech to text seamlessly
- **Intelligent Follow-ups**: AI generates contextual questions based on your answers
- **Multiple Voice Options**: Choose from various natural-sounding voices

### 🗺️ Career Explorer
- **Interactive Career Paths**: Explore different career trajectories
- **Skill Tree Visualization**: Track your skill development progress
- **Achievement System**: Unlock badges and milestones
- **Personality Matching**: Find careers that match your personality

### 📚 DSA Roadmap
- **Comprehensive Learning Path**: Step-by-step Data Structures & Algorithms guide
- **Progress Tracking**: Mark completed problems and track your journey
- **Difficulty Levels**: Easy, Medium, and Hard problems with clear indicators
- **Resource Links**: Access to tutorials, practice platforms, and solutions

### 🤝 Mentorship Platform
- **AI-Powered Mentors**: Get guidance from virtual mentors
- **Personalized Advice**: Tailored recommendations based on your profile
- **Career Simulation**: Practice real-world scenarios

### 📄 Resume Builder
- **AI-Enhanced Resume**: Get suggestions for improvement
- **Template Library**: Professional resume templates
- **ATS Optimization**: Ensure your resume passes ATS systems

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI library
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Browser Speech API** - Voice synthesis and recognition

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **Google Gemini AI** - AI-powered responses
- **CORS** - Cross-origin resource sharing

### Mobile
- **React Native** - Cross-platform mobile development
- **Expo** - Development platform

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/tanaymitravit/EduBridge.git
cd EduBridge
```

2. **Install dependencies**
```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd apps/web
npm install

# Install backend dependencies
cd ../../server
npm install

# Install mobile dependencies (optional)
cd ../apps/mobile
npm install
```

3. **Set up environment variables**
```bash
# Create .env file in server directory
cd ../../server
cp env.example .env

# Add your Gemini API key
echo "GEMINI_API_KEY=your_actual_api_key_here" >> .env
```

4. **Run the development servers**
```bash
# Start backend (from server directory)
cd server
npm start

# Start frontend (from apps/web directory)
cd apps/web
npm run dev

# Start mobile (from apps/mobile directory)
cd apps/mobile
npm start
```

## 🌐 Deployment

### Render (Recommended)
1. **Connect your GitHub repository** to Render
2. **Use the `render-simple.yaml` blueprint** for automatic deployment
3. **Set environment variables** in Render dashboard:
   - `GEMINI_API_KEY`: Your Google Gemini API key
   - `NODE_ENV`: production
4. **Deploy!**

### Vercel + Railway
1. **Frontend**: Deploy to Vercel using `vercel.json`
2. **Backend**: Deploy to Railway using `railway.json`
3. **Set environment variables** in both platforms

## 📁 Project Structure

```
EduBridge/
├── apps/
│   ├── web/                 # React frontend
│   │   ├── src/
│   │   │   ├── pages/       # React components
│   │   │   └── main.jsx     # Entry point
│   │   └── package.json
│   └── mobile/              # React Native mobile app
│       ├── App.js
│       └── package.json
├── server/                  # Node.js backend
│   ├── src/
│   │   ├── routes/          # API routes
│   │   ├── services/        # AI services
│   │   └── index.js         # Server entry point
│   └── package.json
├── render-simple.yaml       # Render deployment config
├── vercel.json             # Vercel deployment config
├── railway.json            # Railway deployment config
└── README.md
```

## 🎯 API Endpoints

### AI & Mock Interview
- `POST /api/ai/chat` - Chat with AI mentor
- `POST /api/resume/mock-interview` - Start mock interview
- `POST /api/resume/feedback` - Get interview feedback

### Career Explorer
- `GET /api/gamify/paths` - Get career paths
- `GET /api/gamify/skills` - Get skill tree
- `GET /api/gamify/achievements` - Get achievements

### DSA Roadmap
- `GET /api/gamify/dsa/roadmap` - Get DSA roadmap
- `POST /api/gamify/dsa/progress` - Update progress
- `GET /api/gamify/dsa/stats` - Get statistics

## 🔧 Development

### Adding New Features
1. **Frontend**: Add components in `apps/web/src/pages/`
2. **Backend**: Add routes in `server/src/routes/`
3. **API**: Add services in `server/src/services/`

### Code Style
- Use ESLint and Prettier for consistent formatting
- Follow React best practices
- Use TypeScript for better type safety (optional)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google Gemini AI** for intelligent responses
- **React** and **Vite** for the frontend framework
- **Express.js** for the backend framework
- **Tailwind CSS** for styling
- **Render** for hosting

## 📞 Support

If you have any questions or need help, please:
- Open an issue on GitHub
- Contact the development team
- Check the documentation

---

**Built with ❤️ for students and career seekers**
