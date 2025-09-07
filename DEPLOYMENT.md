# EduBridge Deployment Guide

## Environment Variables

For the AI features to work in production, set these environment variables:

### Required for AI Features
```bash
GEMINI_API_KEY=your_gemini_api_key_here
# OR
GOOGLE_API_KEY=your_gemini_api_key_here

GEMINI_MODEL=gemini-2.0-flash-exp
# OR  
GOOGLE_MODEL=gemini-2.0-flash-exp
```

### Platform-Specific Instructions

#### Render.com
1. Go to your service dashboard
2. Click on "Environment" tab
3. Add these variables:
   - `GEMINI_API_KEY` = `AIzaSyADB5oVVsrPgbd1wU5MQFEY3n8DBLNhUv4`
   - `GEMINI_MODEL` = `gemini-2.0-flash-exp`

#### Vercel
1. Go to your project settings
2. Click on "Environment Variables"
3. Add the variables above

#### Heroku
```bash
heroku config:set GEMINI_API_KEY=AIzaSyADB5oVVsrPgbd1wU5MQFEY3n8DBLNhUv4
heroku config:set GEMINI_MODEL=gemini-2.0-flash-exp
```

## Testing AI Configuration

Visit `/api/ai/status` to check if the AI key is properly configured.

Expected response:
```json
{
  "hasKey": true,
  "model": "gemini-2.0-flash-exp",
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