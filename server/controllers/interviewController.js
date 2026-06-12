import { GoogleGenAI } from "@google/genai";
import { prisma } from '../config/prisma.js';

export const generateQuestions = async (req, res, next) => {
    try {
        const { category, resumeId } = req.body;

        if (!resumeId) {
            return res.status(400).json({ error: "resumeId is required" });
        }

        const resume = await prisma.resume.findUnique({
            where: { id: resumeId, userId: req.user.id }
        });

        if (!resume) {
            return res.status(404).json({ error: "Resume not found" });
        }

        const ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY,
        });

        const prompt = `
You are an expert technical recruiter and interviewer.
Based on the following resume summary, generate 3 hyper-personalized mock interview questions in the "${category}" category. 
Provide a recommended ideal response for each question.

RESUME SUMMARY:
${resume.summary || "General professional experience"}

Return ONLY valid JSON in this exact format:
[
  {
    "id": "q-gen-unique-id",
    "category": "${category}",
    "question": "The interview question here",
    "answer": "The recommended ideal response here"
  }
]
`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                temperature: 0.7,
            },
        });

        const rawResponse = response.text;
        const cleanedResponse = rawResponse.replace(/```json/g, "").replace(/```/g, "").trim();

        let questions;
        try {
            questions = JSON.parse(cleanedResponse);
        } catch (e) {
            throw new Error("Failed to parse AI response");
        }

        // We don't save to db here, just return to frontend which updates activeResume state
        res.json({ questions });
    } catch (error) {
        next(error);
    }
};
