import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

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
const PORT = process.env.PORT || 4000;

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN || ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files from the built React app
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../apps/web/dist')));
}

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

app.listen(PORT, () => {
  console.log(`EduBridge API listening on http://localhost:${PORT}`);
});