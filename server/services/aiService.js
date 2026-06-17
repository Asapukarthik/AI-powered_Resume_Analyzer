import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { ResumeAnalysisSchema } from "../validators/resumeAnalysisSchema.js";

dotenv.config();

export const analyzeResume = async (resumeText, jobDescription) => {
  let retries = 3;
  let delay = 2000;

  while (retries > 0) {
    try {
      const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
      });

      const jobContext = jobDescription && jobDescription.trim() !== ""
        ? `JOB DESCRIPTION:\n${jobDescription}`
        : `JOB DESCRIPTION:\nNot provided. Please infer the candidate's target role based on their resume and evaluate their resume and market readiness against standard industry expectations for that inferred role.`;

      const prompt = `
You are an expert ATS system, recruiter, career coach, and technical interviewer.

Analyze the resume against the provided job description or inferred role.

${jobContext}

RESUME:
${resumeText}

Return ONLY valid JSON.

{
  "atsAnalysis": {
    "overallScore": 0,
    "keywordScore": 0,
    "experienceScore": 0,
    "projectScore": 0,
    "formattingScore": 0,
    "summary": "",
    "strengths": [],
    "weaknesses": [],
    "recommendations": []
  },

  "keywords": {
    "matched": [
      {
        "word": "",
        "count": 0,
        "importance": "high"
      }
    ],
    "missing": [
      {
        "word": "",
        "importance": "high"
      }
    ],
    "overused": [
      {
        "word": "",
        "count": 0
      }
    ]
  },

  "resumeSections": {
    "summary": 0,
    "skills": 0,
    "experience": 0,
    "projects": 0,
    "education": 0
  },

  "careerInsights": {
    "currentLevel": "",
    "targetRole": "",
    "estimatedTimeline": "",
    "marketReadinessScore": 0
  },

  "skillGapAnalysis": {
    "currentSkills": [],
    "missingSkills": [],
    "recommendedSkills": []
  },

  "skillCategories": [
    { "category": "<Domain-specific category e.g. Machine Learning>", "score": 0 },
    { "category": "<Domain-specific category e.g. Cloud Infrastructure>", "score": 0 },
    { "category": "<Domain-specific category e.g. System Design>", "score": 0 },
    { "category": "<Domain-specific category e.g. DevOps & CI/CD>", "score": 0 },
    { "category": "<Domain-specific category e.g. Soft Skills>", "score": 0 }
  ],

  "learningRoadmap": [
    {
      "step": 1,
      "title": "",
      "description": "",
      "duration": "",
      "skills": []
    }
  ],

  "resumeOptimization": {
    "rewrittenSummary": "",
    "improvedBulletPoints": []
  },

  "projectFeedback": [
    {
      "project": "",
      "score": 0,
      "suggestions": []
    }
  ],

  "interviewQuestions": [
    {
      "id": "q1",
      "category": "technical",
      "question": "",
      "answer": ""
    }
  ],

  "recruiterView": {
    "hireRecommendation": "",
    "riskFactors": []
  }
}

Rules:

1. All scores must be between 0 and 100.
2. Include at least:
   - 5 matched keywords
   - 3 missing keywords
   - 2 overused words
3. Generate exactly 3 roadmap steps.
4. Generate at least:
   - 5 technical questions
   - 5 HR questions
   - 5 project questions
5. For skillCategories: generate exactly 5 categories that are SPECIFIC to the candidate's domain (e.g. if they are a Data Scientist use categories like "Machine Learning", "Data Engineering", "Statistics", "MLOps", "Soft Skills"). Do NOT use generic names like "Core Skills" or "Category 1".
6. Recommendations must be actionable.
7. Return ONLY JSON with no markdown, no code fences, no extra text.
`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.2,
        },
      });

      const rawResponse = response.text;

      const cleanedResponse = rawResponse
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      let parsedData;

      try {
        parsedData = JSON.parse(
          cleanedResponse
        );
      } catch (error) {
        throw new Error(
          "Gemini returned invalid JSON"
        );
      }

      const validatedData = ResumeAnalysisSchema.parse(parsedData);

      return validatedData;
    } catch (error) {
      if (error?.status === 503 && retries > 1) {
        console.warn(`Gemini API 503 error. Retrying in ${delay}ms... (${retries - 1} retries left)`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        retries--;
        delay *= 2;
      } else {
        console.error("Gemini Analysis Error:", error);

        throw new Error(
          error?.message || "Failed to analyze resume"
        );
      }
    }
  }
};
