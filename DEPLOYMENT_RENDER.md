# 🚀 Deploy EduBridge on Render (Full Stack)

## Why Render is Perfect for Your Project

✅ **Single Platform**: Host both frontend and backend  
✅ **Free Tier**: Generous free tier for both services  
✅ **Automatic Deployments**: Deploy from GitHub automatically  
✅ **Built-in Database**: Add PostgreSQL if needed later  
✅ **Custom Domains**: Easy custom domain setup  
✅ **Environment Variables**: Simple environment management  

## Step-by-Step Deployment

### 1. Prepare Your Repository

Make sure your code is pushed to GitHub with the `render.yaml` file I created.

### 2. Deploy to Render

1. **Go to [render.com](https://render.com)**
2. **Sign up with GitHub**
3. **Click "New +" → "Blueprint"**
4. **Connect your GitHub repository**
5. **Render will automatically detect the `render.yaml` file**
6. **Click "Apply"**

### 3. Set Environment Variables

After deployment, go to your backend service and add:

```
GEMINI_API_KEY=your_actual_gemini_api_key_here
GEMINI_MODEL=gemini-2.0-flash-exp
NODE_ENV=production
```

### 4. Update CORS Settings

In your backend service environment variables, add:
```
CORS_ORIGIN=https://your-frontend-url.onrender.com
```

## What Render Will Create

1. **Backend Service**: `https://edubridge-backend.onrender.com`
2. **Frontend Service**: `https://edubridge-frontend.onrender.com`

## Free Tier Limits

- **Web Services**: 750 hours/month (usually enough)
- **Bandwidth**: 100GB/month
- **Build Time**: 90 minutes/month
- **Sleep**: Services sleep after 15 minutes of inactivity (wake up on first request)

## Pro Tips

### Keep Services Awake (Free)
Add a simple ping service to keep your backend awake:

```javascript
// Add this to your server/src/index.js
app.get('/ping', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
```

### Custom Domain (Optional)
1. Go to your service settings
2. Add your custom domain
3. Update DNS records as instructed

## Troubleshooting

### Common Issues:

1. **Build Failures**: Check that all dependencies are in package.json
2. **Environment Variables**: Make sure GEMINI_API_KEY is set
3. **CORS Errors**: Verify CORS_ORIGIN matches your frontend URL
4. **Service Sleeping**: First request after sleep takes ~30 seconds

### Support:
- Render Docs: [render.com/docs](https://render.com/docs)
- Community: [community.render.com](https://community.render.com)

## Cost

- **Free Tier**: $0/month (with limitations)
- **Starter Plan**: $7/month per service (no sleep, more resources)
- **Total for Production**: ~$14/month for both services

## Alternative: Single Service Deployment

If you want everything in one service, you can also:

1. Create a single Web Service
2. Build both frontend and backend
3. Serve static files from Express
4. Use the same domain for both

Would you like me to show you how to set up the single-service approach instead?
