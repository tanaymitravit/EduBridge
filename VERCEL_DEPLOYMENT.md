# Vercel Deployment Guide for EduBridge

## 🚀 Quick Deployment Steps

### 1. Connect to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "New Project"
4. Import `tanaymitravit/EduBridge`

### 2. Configure Build Settings
Vercel will auto-detect the settings from `vercel.json`, but verify:
- **Framework Preset**: Vite
- **Root Directory**: `apps/web`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

### 3. Add Environment Variables
In Vercel dashboard → Settings → Environment Variables:
```
GEMINI_API_KEY = AIzaSyADB5oVVsrPgbd1wU5MQFEY3n8DBLNhUv4
GEMINI_MODEL = gemini-2.0-flash-exp
```

### 4. Deploy
Click "Deploy" and wait for the build to complete!

## ✅ What Gets Deployed

- **Frontend**: React app with all pages and components
- **Backend API**: Node.js serverless functions for all endpoints
- **AI Features**: Gemini AI integration for chat and mock interviews
- **Voice Interface**: Mock interviewer with speech recognition
- **PWA Support**: Offline functionality and app-like experience

## 🔧 API Endpoints Available

- `/api/ai/status` - Check AI configuration
- `/api/ai/chat` - AI career buddy chat
- `/api/ai/recommend` - Resource recommendations
- `/api/opportunities` - Scholarships and opportunities
- `/api/mentors` - Mentorship network
- `/api/sponsors` - Sponsor connections
- `/api/gamify` - Career exploration games
- `/api/resume/mock-interview` - Mock interview functionality

## 🌐 After Deployment

Your site will be available at: `https://your-project-name.vercel.app`

Test these features:
1. **AI Chat**: Navigate to Career Buddy page
2. **Mock Interview**: Try the voice interface
3. **Opportunities**: Browse scholarships and internships
4. **API Status**: Visit `/api/ai/status` to verify AI is working

## 🎯 Benefits of Vercel Deployment

- ✅ **Automatic HTTPS** and global CDN
- ✅ **Serverless functions** for backend API
- ✅ **Automatic deployments** on git push
- ✅ **Preview deployments** for pull requests
- ✅ **Edge functions** for fast global performance
- ✅ **Built-in analytics** and monitoring
