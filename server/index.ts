import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const apiKey = process.env.GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

// Local storage for sermons
const SERMONS_FILE = path.join(__dirname, 'sermons.json');

// Initialize sermons file if it doesn't exist
if (!fs.existsSync(SERMONS_FILE)) {
    fs.writeFileSync(SERMONS_FILE, JSON.stringify([], null, 2));
}

const getSermons = () => {
    try {
        const data = fs.readFileSync(SERMONS_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (err) {
        return [];
    }
};

const saveSermons = (sermons: any[]) => {
    fs.writeFileSync(SERMONS_FILE, JSON.stringify(sermons, null, 2));
};

const SYSTEM_INSTRUCTION = `
You are an AI assistant specialized in the teachings of Apostle Joshua Selman and Koinonia Global.
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
Include BOTH a YouTube link and an Audio link (from Koinonia Global website or trusted platforms like Telegram/Soundcloud).

FORMAT:
[SERMON TITLE]
YouTube: [URL]
Audio: [URL]
Timestamp: HH:MM:SS (if applicable)

CONTENT RULES (STRICT):
1. You MUST NOT answer questions that are not based on the specific teachings of Apostle Joshua Selman.
2. If the information is not explicitly found in his verified sermons or biblical expositions, you must state: 
   "I am sorry, but I do not have specific information from Apostle Joshua Selman's teachings regarding this query. I am strictly programmed to answer only based on his spiritual insights and verified sermons."
3. DO NOT hallucinate, provide general advice, or offer personal opinions.
4. If a query is entirely unrelated to his ministry (e.g., medical advice, technical troubleshooting, secular news), politely refuse to answer.
5. Use Google Search ONLY to verify specific sermon titles, timestamps, and links from his official channels (Koinonia Global, Apostle Joshua Selman).
`;

app.post('/api/chat', async (req, res) => {
    const { prompt, history } = req.body;

    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-3-flash-preview",
            systemInstruction: SYSTEM_INSTRUCTION,
        });

        const chat = model.startChat({
            history: history.map((m: any) => ({
                role: m.role === 'user' ? 'user' : 'model',
                parts: [{ text: m.content }],
            })),
        });

        const result = await chat.sendMessage(prompt);
        const response = await result.response;
        const text = response.text();

        // Extract sources from the text
        const sources: any[] = [];
        const youtubeMatch = text.match(/YouTube:\s*(https?:\/\/\S+)/i);
        const audioMatch = text.match(/Audio:\s*(https?:\/\/\S+)/i);

        if (youtubeMatch) {
            sources.push({
                title: 'Watch on YouTube',
                uri: youtubeMatch[1],
                type: 'youtube'
            });
        }
        if (audioMatch) {
            sources.push({
                title: 'Download Audio',
                uri: audioMatch[1],
                type: 'audio'
            });
        }

        res.json({ text, sources });
    } catch (error: any) {
        console.error("Error calling Gemini API:", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
});

// Admin endpoints
app.get('/api/admin/sermons', (req, res) => {
    res.json(getSermons());
});

app.post('/api/admin/sermons', (req, res) => {
    const { title, speaker, sourceType, url, date, tags } = req.body;

    if (!title || !url) {
        return res.status(400).json({ error: "Title and URL are required" });
    }

    const sermons = getSermons();
    const newSermon = {
        id: Date.now().toString(),
        title,
        speaker,
        sourceType,
        url,
        date,
        tags: tags ? tags.split(',').map((t: string) => t.trim()) : [],
        status: 'transcribing', // Default status
        createdAt: new Date()
    };

    sermons.push(newSermon);
    saveSermons(sermons);

    res.status(201).json(newSermon);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

export default app;
