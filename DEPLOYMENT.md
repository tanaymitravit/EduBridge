# EduBridge Deployment Guide

## Prerequisites

- Node.js 18+ and npm 8+
- Git
- Render.com account
- Gemini API key (for AI features)

## Environment Variables

Create a `.env` file in the project root with the following variables:

```bash
# Server Configuration
PORT=10000
NODE_ENV=production

# CORS Configuration (update with your frontend URL)
CORS_ORIGIN=https://your-render-frontend-url.onrender.com

# Gemini AI Configuration
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-1.5-flash
```

## Deployment to Render.com

### 1. Push to GitHub

Make sure your code is pushed to a GitHub repository.

### 2. Deploy to Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New" and select "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: edubridge-backend
   - **Region**: Choose the one closest to your users
   - **Branch**: main
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free

5. Add environment variables from your `.env` file
6. Click "Create Web Service"

### 3. Deploy Frontend (Static Site)

1. In Render Dashboard, click "New" and select "Static Site"
2. Connect your GitHub repository
3. Configure the static site:
   - **Name**: edubridge-frontend
   - **Branch**: main
   - **Build Command**: `cd apps/web && npm install && npm run build`
   - **Publish Directory**: `apps/web/dist`
   - **Environment Variables**:
     - `VITE_API_URL`: https://your-backend-url.onrender.com

4. Click "Create Static Site"

## Manual Deployment

### Build for Production

```bash
# Install dependencies
npm install

# Build frontend
cd apps/web
npm install
npm run build

# Build server
cd ../../server
npm install
npm run build

# Start production server
npm start
```

## Environment Configuration

### Required Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Port the server runs on | `10000` |
| `NODE_ENV` | Node environment | `production` |
| `CORS_ORIGIN` | Allowed origins for CORS | `https://your-frontend-url.com` |
| `GEMINI_API_KEY` | Gemini AI API key | `your-api-key-here` |
| `GEMINI_MODEL` | Gemini model to use | `gemini-1.5-flash` |

## Testing the Deployment

### Check Server Status

```bash
curl https://your-backend-url.onrender.com/ping
```

### Test AI Configuration

```bash
curl https://your-backend-url.onrender.com/api/ai/status
```

Expected response:
```json
{
  "hasKey": true,
  "model": "gemini-1.5-flash",
  "details": {
    "geminiKey": true,
    "googleKey": false,
    "envVars": ["GEMINI_API_KEY", "GEMINI_MODEL"]
  }
}
```

## Features That Require AI Key

- AI Career & Learning Buddy (chat)
- Mock Interviewer (voice interface)
- Resource recommendations
- Career guidance

Without the AI key, these features will show fallback demo responses.