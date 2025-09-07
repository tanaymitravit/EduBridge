# 🚀 EduBridge Deployment Guide

## Quick Start (Recommended: Vercel + Railway)

### 1. Deploy Backend to Railway

1. **Go to [railway.app](https://railway.app)**
2. **Sign up with GitHub**
3. **Create New Project** → **Deploy from GitHub repo**
4. **Select your repository**
5. **Choose the `server` folder**
6. **Add Environment Variables:**
   ```
   GEMINI_API_KEY=your_actual_gemini_key
   GEMINI_MODEL=gemini-2.0-flash-exp
   PORT=4000
   NODE_ENV=production
   ```
7. **Deploy!** Railway will give you a URL like `https://your-app.railway.app`

### 2. Deploy Frontend to Vercel

1. **Go to [vercel.com](https://vercel.com)**
2. **Sign up with GitHub**
3. **Import Project** → **Select your repository**
4. **Configure:**
   - **Framework Preset:** Vite
   - **Root Directory:** `apps/web`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. **Add Environment Variable:**
   ```
   VITE_API_URL=https://your-backend-url.railway.app
   ```
6. **Deploy!**

### 3. Update CORS Settings

After getting your Vercel URL, update your Railway environment variables:
```
CORS_ORIGIN=https://your-frontend-url.vercel.app
```

## Alternative Options

### Option 2: Netlify + Heroku

**Frontend (Netlify):**
1. Connect GitHub repo to Netlify
2. Set build command: `cd apps/web && npm run build`
3. Set publish directory: `apps/web/dist`
4. Add environment variable: `VITE_API_URL=https://your-heroku-app.herokuapp.com`

**Backend (Heroku):**
1. Install Heroku CLI
2. `heroku create your-app-name`
3. `heroku config:set GEMINI_API_KEY=your_key`
4. `git subtree push --prefix=server heroku main`

### Option 3: Full-Stack on Railway

1. Deploy both frontend and backend on Railway
2. Use Railway's built-in database
3. Single deployment for everything

## Environment Variables

### Frontend (.env)
```
VITE_API_URL=https://your-backend-url.railway.app
```

### Backend (.env)
```
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.0-flash-exp
PORT=4000
NODE_ENV=production
CORS_ORIGIN=https://your-frontend-url.vercel.app
```

## Cost Breakdown

### Free Tiers:
- **Vercel**: 100GB bandwidth/month, unlimited personal projects
- **Railway**: $5 credit/month (usually enough for small projects)
- **Netlify**: 100GB bandwidth/month, 300 build minutes
- **Heroku**: 550-1000 dyno hours/month (limited)

### Recommended for Production:
- **Vercel Pro**: $20/month (unlimited bandwidth)
- **Railway Pro**: $5/month + usage
- **Total**: ~$25-30/month for production use

## Post-Deployment Checklist

- [ ] Test all API endpoints
- [ ] Verify CORS is working
- [ ] Check environment variables
- [ ] Test DSA roadmap functionality
- [ ] Test mock interviewer
- [ ] Verify mobile responsiveness
- [ ] Set up custom domain (optional)

## Troubleshooting

### Common Issues:

1. **CORS Errors**: Make sure CORS_ORIGIN matches your frontend URL exactly
2. **API Not Found**: Check VITE_API_URL environment variable
3. **Build Failures**: Ensure all dependencies are in package.json
4. **Environment Variables**: Double-check all required variables are set

### Support:
- Railway: [docs.railway.app](https://docs.railway.app)
- Vercel: [vercel.com/docs](https://vercel.com/docs)
- Netlify: [docs.netlify.com](https://docs.netlify.com)
