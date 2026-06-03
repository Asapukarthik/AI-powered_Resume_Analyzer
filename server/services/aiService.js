import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

export const analyzeResume = async (resumeText, jobDescription) => {
  // Instantiate inside the function so GEMINI_API_KEY is read after dotenv loads
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });
  try {
    const prompt = `You are an expert ATS (Applicant Tracking System) and resume analyzer. Your goal is to evaluate a resume against a specific job description and provide a comprehensive analysis in JSON format.

Please analyze the following resume against the provided job description.

Job Description:
${jobDescription}

Resume:
${resumeText}

Provide your analysis ONLY as a valid JSON object with this EXACT structure (no markdown, no explanation, just JSON):
{
  "matchScore": <number between 0 and 100>,
  "summary": "a concise 2-3 sentence summary of the candidate's fit for this role",
  "strengths": ["strength 1", "strength 2", "strength 3", "strength 4"],
  "weaknesses": ["weakness/gap 1", "weakness/gap 2", "weakness/gap 3"],
  "recommendations": ["actionable tip 1", "actionable tip 2", "actionable tip 3"],
  "keywords": [
    { "word": "keyword name", "category": "matched", "count": <how many times it appears in resume> },
    { "word": "keyword name", "category": "missing", "count": 0 },
    { "word": "overused keyword", "category": "overused", "count": <count> }
  ],
  "suggestedRoadmap": [
    {
      "step": 1,
      "title": "Short title for this learning step",
      "description": "What the candidate should do and why it helps",
      "duration": "X weeks",
      "skills": ["skill1", "skill2", "skill3"]
    },
    {
      "step": 2,
      "title": "Short title for this learning step",
      "description": "What the candidate should do and why it helps",
      "duration": "X weeks",
      "skills": ["skill1", "skill2"]
    },
    {
      "step": 3,
      "title": "Short title for this learning step",
      "description": "What the candidate should do and why it helps",
      "duration": "X weeks",
      "skills": ["skill1", "skill2"]
    }
  ],
  "interviewQuestions": [
    {
      "id": "q-1",
      "category": "technical",
      "question": "A technical question relevant to the job and resume",
      "answer": "A detailed model answer demonstrating expertise"
    },
    {
      "id": "q-2",
      "category": "technical",
      "question": "Another technical question",
      "answer": "A detailed model answer"
    },
    {
      "id": "q-3",
      "category": "hr",
      "question": "A behavioral or situational HR question",
      "answer": "A STAR-method model answer"
    },
    {
      "id": "q-4",
      "category": "project",
      "question": "A question about a specific project or accomplishment on the resume",
      "answer": "A detailed model answer referencing the resume content"
    }
  ]
}

Rules:
- keywords array MUST include at least 5 matched keywords (skills found in both resume and job description), 3 missing keywords (required by job but absent from resume), and 2 overused words.
- suggestedRoadmap MUST have exactly 3 steps addressing the candidate's biggest gaps.
- interviewQuestions MUST have at least 4 questions across technical, hr, and project categories.
- All string values must be complete sentences, not placeholders.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.2,
      }
    });

    const aiResponse = response.text;
    return JSON.parse(aiResponse);
  } catch (error) {
    console.error('Error analyzing resume with Gemini:', error);
    throw new Error('Failed to analyze resume with AI');
  }
};
