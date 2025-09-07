# 🚀 Simple Render Deployment (Single Service)

## Why This Approach is Perfect

✅ **One Service**: Everything in one place  
✅ **One URL**: Single domain for your entire app  
✅ **Simpler**: No CORS issues, no environment variable management  
✅ **Free**: Uses Render's free tier  
✅ **Fast**: No network calls between frontend and backend  

## How It Works

Your Express server will:
1. **Serve your React app** as static files
2. **Handle all API requests** on the same domain
3. **Route everything** through one service

## Step-by-Step Deployment

### 1. Push Your Code to GitHub

Make sure your repository includes:
- ✅ `render-single.yaml` (deployment config)
- ✅ Updated `server/src/index.js` (serves React app)
- ✅ All your source code

### 2. Deploy to Render

1. **Go to [render.com](https://render.com)**
2. **Sign up with GitHub**
3. **Click "New +" → "Blueprint"**
4. **Connect your GitHub repository**
5. **Select `render-single.yaml`**
6. **Click "Apply"**

### 3. Set Environment Variables

In your Render dashboard, add:
```
GEMINI_API_KEY=your_actual_gemini_api_key_here
GEMINI_MODEL=gemini-2.0-flash-exp
NODE_ENV=production
```

### 4. Deploy!

Render will:
1. Install backend dependencies
2. Build your React app
3. Start your Express server
4. Serve everything from one URL

## Your App Will Be Available At

**Single URL**: `https://edubridge-fullstack.onrender.com`

- **Frontend**: `https://edubridge-fullstack.onrender.com`
- **API**: `https://edubridge-fullstack.onrender.com/api/...`
- **DSA Roadmap**: `https://edubridge-fullstack.onrender.com` (navigate to Explorer → DSA Roadmap)

## What Happens During Build

```bash
# Render runs these commands:
cd server && npm install                    # Install backend deps
cd ../apps/web && npm install              # Install frontend deps  
cd ../apps/web && npm run build            # Build React app
cd server && npm start                     # Start Express server
```

## Free Tier Benefits

- **750 hours/month** (usually enough)
- **100GB bandwidth/month**
- **Automatic deployments** from GitHub
- **Custom domains** (optional)
- **SSL certificates** (automatic)

## Keep Your App Awake (Free)

Your app will sleep after 15 minutes of inactivity. To keep it awake:

1. **Add a ping endpoint** (already included in your server)
2. **Use a service like UptimeRobot** to ping `/ping` every 14 minutes
3. **Or upgrade to Starter plan** ($7/month) for no sleep

## Troubleshooting

### Build Fails?
- Check that all dependencies are in `package.json`
- Make sure `GEMINI_API_KEY` is set
- Verify your GitHub repo is public (or connected properly)

### App Not Working?
- Check the logs in Render dashboard
- Verify environment variables are set
- Make sure the build completed successfully

### Slow Loading?
- First request after sleep takes ~30 seconds
- Subsequent requests are fast
- Consider upgrading to Starter plan for no sleep

## Cost

- **Free**: $0/month (with sleep)
- **Starter**: $7/month (no sleep, more resources)
- **Custom Domain**: Free (just need to own the domain)

## Next Steps After Deployment

1. **Test your app**: Visit your Render URL
2. **Test DSA Roadmap**: Navigate to Explorer → DSA Roadmap
3. **Test Mock Interviewer**: Try the voice features
4. **Set up custom domain** (optional)
5. **Add monitoring** (optional)

## Pro Tips

1. **Environment Variables**: Set them in Render dashboard, not in code
2. **Logs**: Check Render logs if something isn't working
3. **Build Time**: First build takes 5-10 minutes, subsequent builds are faster
4. **Updates**: Push to GitHub and Render auto-deploys

This approach is much simpler than managing separate services and perfect for getting your project live quickly!
