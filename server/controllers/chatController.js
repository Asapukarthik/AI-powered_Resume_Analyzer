import { GoogleGenAI } from "@google/genai";
import { prisma } from '../config/prisma.js';

export const chatWithAI = async (req, res, next) => {
    try {
        const { message, resumeId } = req.body;

        if (!message) {
            return res.status(400).json({ error: "Message is required" });
        }

        let resumeContext = "The user has not uploaded a resume yet.";
        if (resumeId) {
            const resume = await prisma.resume.findUnique({
                where: { id: resumeId, userId: req.user.id }
            });

            if (resume) {
                resumeContext = `The user's active resume summary is: ${resume.summary || 'Not generated yet'}. Strengths: ${JSON.stringify(resume.strengths || [])}. Weaknesses: ${JSON.stringify(resume.weaknesses || [])}.`;
            }
        }

        const ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY,
        });

        const prompt = `
You are an expert technical recruiter, career advisor, and AI assistant named Resume.ai Bot.
Your goal is to answer the user's career and resume-related questions.
You have the following context about the user's current resume:
${resumeContext}

User Message:
${message}

Respond directly, concisely, and professionally. Use markdown formatting if needed. Do not output JSON, just output the response text.
`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                temperature: 0.7,
            },
        });

        const reply = response.text.trim();

        res.json({ reply });
    } catch (error) {
        next(error);
    }
};
