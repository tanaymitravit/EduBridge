import { Router } from 'express';
import { geminiChat } from '../services/gemini.js';

const router = Router();

router.post('/build', (req, res) => {
  const { name, education = [], skills = [], projects = [] } = req.body || {};
  const resume = {
    name,
    summary: `Aspiring student passionate about ${skills.slice(0, 3).join(', ')}`,
    education,
    skills,
    projects,
  };
  res.json({ resume });
});

router.post('/mock-interview', async (req, res) => {
  const { role = 'Software Engineer', question, conversationHistory = [] } = req.body || {};
  
  console.log('Mock interview request:', { role, question, conversationHistory });
  
  let prompt;
  
  if (question) {
    // Respond to candidate's answer
    const context = conversationHistory.length > 0 
      ? `Previous conversation:\n${conversationHistory.map(ex => `Interviewer: ${ex.interviewer}\nCandidate: ${ex.user}`).join('\n')}\n\n`
      : '';
    
    prompt = `You are a warm, professional interviewer for a ${role} position. ${context}Candidate just said: "${question}". 
    
    Respond naturally as a human interviewer would:
    - Acknowledge their answer with genuine interest
    - Ask a thoughtful follow-up question that flows naturally
    - Keep responses conversational, warm, and under 2 sentences
    - Use natural speech patterns and contractions (I'm, you're, that's)
    - Be encouraging and supportive while staying professional
    - Focus on technical skills, experience, or behavioral aspects relevant to ${role}
    - Avoid robotic phrases like "I understand" or "That's interesting"`;
  } else {
    // Start the interview
    prompt = `You are a warm, professional interviewer for a ${role} position. Start the interview with a genuine welcome and ask the first question. 
    
    Guidelines:
    - Be friendly and approachable, like a real person
    - Use natural, conversational language with contractions
    - Ask one clear, engaging question at a time
    - Keep responses under 2 sentences and easy to speak aloud
    - Focus on ${role} relevant topics
    - Sound like you're having a real conversation, not reading a script`;
  }
  
  console.log('Generated prompt:', prompt);
  
  try {
    const reply = await geminiChat(prompt, { level: 'intermediate', language: 'en' });
    console.log('Gemini response:', reply);
    res.json({ reply });
  } catch (e) {
    console.error('Mock interview error:', e);
    res.status(500).json({ error: 'mock interview failed', detail: String(e.message || e) });
  }
});

export default router;

