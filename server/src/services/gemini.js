import fetch from 'node-fetch';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyADB5oVVsrPgbd1wU5MQFEY3n8DBLNhUv4';
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.0-flash-exp';

console.log('Gemini config:', { hasKey: !!GEMINI_API_KEY, model: GEMINI_MODEL, keyLength: GEMINI_API_KEY.length });

const safeFallback = (text) => `AI (offline demo): ${text}`;

export async function geminiChat(message, { level = 'beginner', language = 'en' } = {}) {
  console.log('geminiChat called with:', { message, level, language, hasKey: !!GEMINI_API_KEY });
  if (!GEMINI_API_KEY) return safeFallback(`${message}\n(level: ${level}, lang: ${language})`);
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
  if (!GEMINI_API_KEY) return demo;
  try {
    const prompt = `List 3 beginner-friendly resources for ${topic} in ${language}. Output as bullet points with title and URL.`;
    const text = await geminiChat(prompt, { level, language });
    // naive parse: return demo + ai text as a note
    return [...demo, { id: 'ai', title: 'AI suggestions', url: '', note: text }];
  } catch {
    return demo;
  }
}


