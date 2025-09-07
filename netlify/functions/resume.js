import fetch from 'node-fetch';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyADB5oVVsrPgbd1wU5MQFEY3n8DBLNhUv4';
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.0-flash-exp';

const safeFallback = (text) => `AI (offline demo): ${text}`;

async function geminiChat(message, { level = 'beginner', language = 'en' } = {}) {
  if (!GEMINI_API_KEY) return safeFallback(`${message}\n(level: ${level}, lang: ${language})`);
  
  try {
    const system = `You are EduBridge, an educational assistant. Explain at ${level} level in ${language}. Keep answers concise and structured.`;
    const body = {
      contents: [
        { role: "user", parts: [{ text: system }] },
        { role: "user", parts: [{ text: message }] }
      ],
      generationConfig: {
        temperature: 0.8,
        topP: 0.95,
        topK: 50,
        maxOutputTokens: 256
      }
    };

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    const resp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal
    });
    clearTimeout(timeout);

    if (!resp.ok) {
      const errText = await resp.text().catch(() => '');
      throw new Error(`Gemini HTTP ${resp.status} ${errText}`);
    }
    const data = await resp.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response';
    return text;
  } catch (e) {
    return safeFallback(`(gemini error) ${String(e?.message || e)}\n${message}`);
  }
}

export async function handler(event, context) {
  // Handle CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const { httpMethod, path } = event;
    
    if (path === '/api/resume/mock-interview' && httpMethod === 'POST') {
      const { role = 'Software Engineer', question, conversationHistory = [] } = JSON.parse(event.body || '{}');
      
      let prompt;
      if (question) {
        // Respond to candidate's answer
        const context = conversationHistory.length > 0
          ? `Previous conversation:\n${conversationHistory.map(ex => `Interviewer: ${ex.interviewer}\nCandidate: ${ex.user}`).join('\n')}\n\n`
          : '';

        prompt = `You are a professional interviewer for a ${role} position. ${context}Candidate just said: "${question}".

        Respond as an interviewer would:
        - Acknowledge their answer briefly
        - Ask a relevant follow-up question
        - Keep responses conversational and under 2 sentences
        - Be encouraging but professional
        - Focus on technical skills, experience, or behavioral aspects relevant to ${role}`;
      } else {
        // Start the interview
        prompt = `You are a professional interviewer for a ${role} position. Start the interview with a warm welcome and ask the first question.

        Guidelines:
        - Be professional but friendly
        - Ask one clear question at a time
        - Keep responses under 2 sentences
        - Focus on ${role} relevant topics`;
      }

      const reply = await geminiChat(prompt, { level: 'intermediate', language: 'en' });
      
      return {
        statusCode: 200,
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ reply })
      };
    }
    
    return {
      statusCode: 404,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Not found' })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Internal server error', detail: error.message })
    };
  }
}
