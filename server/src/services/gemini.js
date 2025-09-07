import fetch from 'node-fetch';

// Get API key from environment or use fallback
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || 'AIzaSyADB5oVVsrPgbd1wU5MQFEY3n8DBLNhUv4';
const GEMINI_MODEL = process.env.GEMINI_MODEL || process.env.GOOGLE_MODEL || 'gemini-2.5-flash';

// Check if we have a valid API key (always use the key for now)
const hasValidKey = true; // Force to true to use the API key

console.log('Gemini config:', { 
  hasKey: !!GEMINI_API_KEY, 
  hasValidKey,
  model: GEMINI_MODEL, 
  keyLength: GEMINI_API_KEY?.length,
  envKeys: Object.keys(process.env).filter(k => k.includes('GEMINI') || k.includes('GOOGLE'))
});

const safeFallback = (text) => `AI (offline demo): ${text}`;

export async function geminiChat(message, { level = 'beginner', language = 'en' } = {}) {
  console.log('geminiChat called with:', { message, level, language, hasValidKey });
  if (!hasValidKey) return safeFallback(`${message}\n(level: ${level}, lang: ${language})`);
  try {
    const system = `You are EduBridge, an educational assistant. Explain at ${level} level in ${language}. Keep answers concise and structured.`;
    const body = {
      contents: [
        { role: "user", parts: [{ text: system }] },
        { role: "user", parts: [{ text: message }] }
      ],
      generationConfig: {
        temperature: 0.8,  // Higher temperature for more natural, varied responses
        topP: 0.95,        // Higher topP for more diverse word choices
        topK: 50,          // Higher topK for more natural language
        maxOutputTokens: 256  // Shorter responses for better speech flow
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

export async function geminiRecommend(topic = 'learning', { level = 'beginner', language = 'en' } = {}) {
  const demo = [
    { id: 'res1', title: `Intro ${topic} guide`, url: 'https://example.com/guide', offline: true },
    { id: 'res2', title: `${topic} video playlist`, url: 'https://example.com/playlist', offline: false }
  ];
  if (!hasValidKey) return demo;
  try {
    const prompt = `List 3 beginner-friendly resources for ${topic} in ${language}. Output as bullet points with title and URL.`;
    const text = await geminiChat(prompt, { level, language });
    // naive parse: return demo + ai text as a note
    return [...demo, { id: 'ai', title: 'AI suggestions', url: '', note: text }];
  } catch {
    return demo;
  }
}


