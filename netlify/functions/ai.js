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
    
    if (path === '/api/ai/status') {
      const hasKey = !!GEMINI_API_KEY;
      const hasValidKey = hasKey && GEMINI_API_KEY !== 'AIzaSyADB5oVVsrPgbd1wU5MQFEY3n8DBLNhUv4';
      
      return {
        statusCode: 200,
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hasKey: hasValidKey,
          model: GEMINI_MODEL,
          details: { geminiKey: hasKey, envVars: Object.keys(process.env).filter(k => k.includes('GEMINI')) }
        })
      };
    }
    
    if (path === '/api/ai/chat' && httpMethod === 'POST') {
      const { message, level = 'beginner', language = 'en' } = JSON.parse(event.body || '{}');
      if (!message) {
        return {
          statusCode: 400,
          headers: { ...headers, 'Content-Type': 'application/json' },
          body: JSON.stringify({ error: 'message required' })
        };
      }
      
      const reply = await geminiChat(message, { level, language });
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
