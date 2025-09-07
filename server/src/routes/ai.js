import { Router } from 'express';
import { geminiChat, geminiRecommend } from '../services/gemini.js';

const router = Router();

router.get('/status', (req, res) => {
  const hasKey = !!process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL || 'gemini-1.5-flash-latest';
  res.json({ hasKey, model });
});

router.post('/chat', async (req, res) => {
  const { message, level = 'beginner', language = 'en' } = req.body || {};
  if (!message) return res.status(400).json({ error: 'message required' });
  try {
    const reply = await geminiChat(message, { level, language });
    res.json({ reply });
  } catch (e) {
    res.status(500).json({ error: 'AI service failed', detail: String(e.message || e) });
  }
});

router.post('/recommend', async (req, res) => {
  const { topic, level = 'beginner', language = 'en' } = req.body || {};
  try {
    const items = await geminiRecommend(topic, { level, language });
    res.json({ items });
  } catch (e) {
    res.status(500).json({ error: 'recommendation failed', detail: String(e.message || e) });
  }
});

export default router;

