import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config({ quiet: true });

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

export async function GeminiResponse(prompt) {
    const promptSize = Buffer.byteLength(prompt, 'utf8');
    const maxSize = 30000000;
    if (promptSize > maxSize) {
        const truncatedPrompt = prompt.substring(0, maxSize * 0.8) + '\n\n[Content truncated due to size limits]';
        prompt = truncatedPrompt;
    }

    try {
        const result = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });
        return result.text;
    } catch (error) {
        console.error('Gemini API error:', error);
        if (error.message.includes('Request Entity Too Large')) {
            throw new Error('Repository too large to analyze. Please try with a smaller repository or fewer files.');
        }
        throw error;
    }
}