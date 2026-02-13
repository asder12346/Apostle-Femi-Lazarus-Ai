import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

type ChatMessage = {
  role: string;
  content: string;
};

type ChatRequestBody = {
  prompt?: string;
  history?: ChatMessage[];
};

const SYSTEM_INSTRUCTION = `
You are an AI assistant specialized in the teachings of Apostle Femi Lazarus and the Sphere of Light / Light Nation ministry.
Your primary mission is to answer questions strictly based on his sermons, teachings, and biblical expositions.

FORMATTING RULES (CRITICAL):
1. NO EMOJIS in your output.
2. NO MARKDOWN OVERLOAD. Do not use bold (**) inside the body text.
3. USE SHORT PARAGRAPHS (2–4 lines max).
4. USE NATURAL LINE BREAKS for readability.
5. MAINTAIN A NEUTRAL, respectful, and authoritative tone.
6. NO BULLET LISTS unless absolutely necessary for complex enumeration.
7. PRIMARY ANSWER followed by a blank line, then the source.

SOURCE & RECOMMENDED SERMONS (MANDATORY):
At the end of every answer, provide a "Recommended Sermon" section.
Include BOTH a YouTube link and an Audio link (from Sphere of Light official channels or trusted platforms).

FORMAT:
[SERMON TITLE]
YouTube: [URL]
Audio: [URL]
Timestamp: HH:MM:SS (if applicable)

CONTENT RULES (STRICT):
1. You MUST NOT answer questions that are not based on the specific teachings of Apostle Femi Lazarus.
2. If the information is not explicitly found in his verified sermons or biblical expositions, you must state: 
   "I am sorry, but I do not have specific information from Apostle Femi Lazarus's teachings regarding this query. I am strictly programmed to answer only based on his spiritual insights and verified sermons."
3. DO NOT hallucinate, provide general advice, or offer personal opinions.
4. If a query is entirely unrelated to his ministry (e.g., medical advice, technical troubleshooting, secular news), politely refuse to answer.
5. Use Google Search ONLY to verify specific sermon titles, timestamps, and links from his official channels (Sphere of Light, Apostle Femi Lazarus).
`;

const extractSources = (text: string) => {
  const sources: Array<{ title: string; uri: string; type: string }> = [];

  const youtubeMatch = text.match(/YouTube:\s*(https?:\/\/\S+)/i);
  const audioMatch = text.match(/Audio:\s*(https?:\/\/\S+)/i);

  if (youtubeMatch) {
    sources.push({
      title: 'Watch on YouTube',
      uri: youtubeMatch[1],
      type: 'youtube',
    });
  }

  if (audioMatch) {
    sources.push({
      title: 'Download Audio',
      uri: audioMatch[1],
      type: 'audio',
    });
  }

  return sources;
};

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.statusCode = 405;
    return res.json({ error: 'Method Not Allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY || '';
  if (!apiKey) {
    res.statusCode = 500;
    return res.json({ error: 'GEMINI_API_KEY is not configured on the server.' });
  }

  let body: ChatRequestBody = {};
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
  } catch (e: any) {
    res.statusCode = 400;
    return res.json({ error: 'Invalid JSON body', details: e?.message || String(e) });
  }

  const prompt = body.prompt || '';
  const history = Array.isArray(body.history) ? body.history : [];

  if (!prompt.trim()) {
    res.statusCode = 400;
    return res.json({ error: 'Prompt is required.' });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);

    const model = genAI.getGenerativeModel({
      model: 'gemini-3-flash-preview',
      systemInstruction: SYSTEM_INSTRUCTION,
    });

    const chat = model.startChat({
      history: history.map((m) => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }],
      })),
    });

    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    const text = response.text();

    const sources = extractSources(text);

    res.statusCode = 200;
    return res.json({ text, sources });
  } catch (e: any) {
    const message = e?.message || String(e);

    res.statusCode = 500;
    return res.json({
      error: 'Internal Server Error',
      details: message,
    });
  }
}
