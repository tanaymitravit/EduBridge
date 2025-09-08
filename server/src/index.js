// Load environment variables first
dotenv.config();

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import 'express-async-errors';

// Import routes
import aiRoutes from './routes/ai.js';
import gamifyRoutes from './routes/gamify.js';
import mentorsRoutes from './routes/mentors.js';
import opportunitiesRoutes from './routes/opportunities.js';
import resumeRoutes from './routes/resume.js';
import sponsorsRoutes from './routes/sponsors.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 10000;
const isProduction = process.env.NODE_ENV === 'production';

// Log environment
console.log('Environment:', {
  NODE_ENV: process.env.NODE_ENV,
  PORT,
  isProduction
});

// Security middleware
app.use(helmet());
app.use(compression());

// Logging
if (isProduction) {
  app.use(morgan('combined'));
} else {
  app.use(morgan('dev'));
}

// CORS configuration
const allowedOrigins = isProduction 
  ? [process.env.CORS_ORIGIN || 'https://edubridge-frontend.onrender.com']
  : ['http://localhost:5173', 'http://localhost:5174'];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files from the built React app
if (isProduction) {
  const staticPath = path.join(__dirname, '../../apps/web/dist');
  app.use(express.static(staticPath, {
    maxAge: '1y',
    etag: true,
    lastModified: true,
    setHeaders: (res, path) => {
      if (path.endsWith('.html')) {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      }
    }
  }));
}

// Serve static files from the public directory (frontend)
app.use(express.static(path.join(__dirname, '../public'), {
  maxAge: '1d',
  setHeaders: (res, path) => {
    // Set cache control for static assets
    if (express.static.mime.lookup(path) === 'text/html') {
      res.setHeader('Cache-Control', 'public, max-age=0');
    }
  }
}));

// API Routes
app.use('/api/ai', aiRoutes);
app.use('/api/gamify', gamifyRoutes);
app.use('/api/mentors', mentorsRoutes);
app.use('/api/opportunities', opportunitiesRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/sponsors', sponsorsRoutes);

// Health check endpoint
app.get('/ping', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve React app for all non-API routes (SPA routing)
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../apps/web/dist/index.html'));
  });
}

// ElevenLabs Agent Conversation endpoint
const ELEVEN_API_KEY = 'sk_8dc59808a33042ec2f67e30eee275d30ab5f8e722a93cb66';
const AGENT_ID = 'agent_4501k4jna51vefyb7gw6kyebgrvc';

app.post('/api/agent-conversation', async (req, res) => {
  try {
    const { audioData, conversationId } = req.body;

    if (!audioData) {
      return res.status(400).json({ error: 'Audio data is required' });
    }

    console.log('Agent Conversation Request:', { agentId: AGENT_ID, hasAudio: !!audioData });

    // Try the correct ElevenLabs agent conversation endpoint
    const response = await fetch(
      `https://api.elevenlabs.io/v1/agents/${AGENT_ID}/conversation`,
      {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': ELEVEN_API_KEY,
        },
        body: JSON.stringify({
          audio: audioData,
          conversation_id: conversationId,
        }),
      }
    );

    console.log('ElevenLabs Agent Response Status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('ElevenLabs Agent Error Response:', errorText);
      
      // If agent endpoint fails, try direct text-to-speech as fallback
      console.log('Trying fallback to text-to-speech...');
      
      // For now, let's use a simple text-to-speech approach
      const fallbackResponse = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/pNInz6obpgDQGcFmaJgB`,
        {
          method: 'POST',
          headers: {
            'Accept': 'audio/mpeg',
            'Content-Type': 'application/json',
            'xi-api-key': ELEVEN_API_KEY,
          },
          body: JSON.stringify({
            text: 'Hello! I am your AI assistant. How can I help you today?',
            model_id: 'eleven_multilingual_v2',
            voice_settings: {
              stability: 0.5,
              similarity_boost: 0.5,
            },
          }),
        }
      );

      if (fallbackResponse.ok) {
        const audioBuffer = await fallbackResponse.arrayBuffer();
        res.set('Content-Type', 'audio/mpeg');
        res.send(Buffer.from(audioBuffer));
      } else {
        res.status(500).json({ error: 'Failed to generate audio response' });
      }
    } else {
      const audioBuffer = await response.arrayBuffer();
      res.set('Content-Type', 'audio/mpeg');
      res.send(Buffer.from(audioBuffer));
    }
  } catch (error) {
    console.error('Agent conversation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Handle client-side routing - return index.html for all non-API routes
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api/')) {
    return res.sendFile(path.join(__dirname, '../public/index.html'));
  }
  next();
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ error: 'Not Found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', {
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? '🔒' : err.stack,
    path: req.path,
    method: req.method,
  });

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal Server Error' 
      : err.message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
});

// Start the server
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  server.close(() => process.exit(1));
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! Shutting down...');
  console.error(err);
  server.close(() => {
    process.exit(1);
  });
});

// Handle SIGTERM (for Render)
process.on('SIGTERM', () => {
  console.log('SIGTERM RECEIVED. Shutting down gracefully');
  server.close(() => {
    console.log('Process terminated!');
  });
});