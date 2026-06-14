import { z } from "zod";

export const ResumeAnalysisSchema = z.object({
  atsAnalysis: z.object({
    overallScore: z.number(),
    keywordScore: z.number(),
    experienceScore: z.number(),
    projectScore: z.number(),
    formattingScore: z.number(),
    summary: z.string(),
    strengths: z.array(z.string()),
    weaknesses: z.array(z.string()),
    recommendations: z.array(z.string()),
  }),
  keywords: z.object({
    matched: z.array(z.object({
      word: z.string(),
      count: z.number(),
      importance: z.string()
    })),
    missing: z.array(z.object({
      word: z.string(),
      importance: z.string()
    })),
    overused: z.array(z.object({
      word: z.string(),
      count: z.number()
    }))
  }),
  resumeSections: z.object({
    summary: z.number(),
    skills: z.number(),
    experience: z.number(),
    projects: z.number(),
    education: z.number()
  }),
  careerInsights: z.object({
    currentLevel: z.string(),
    targetRole: z.string(),
    estimatedTimeline: z.string(),
    marketReadinessScore: z.number()
  }),
  skillGapAnalysis: z.object({
    currentSkills: z.array(z.string()),
    missingSkills: z.array(z.string()),
    recommendedSkills: z.array(z.string())
  }),
  skillCategories: z.array(z.object({
    category: z.string(),
    score: z.number()
  })),
  learningRoadmap: z.array(z.object({
    step: z.number(),
    title: z.string(),
    description: z.string(),
    duration: z.string(),
    skills: z.array(z.string())
  })),
  resumeOptimization: z.object({
    rewrittenSummary: z.string(),
    improvedBulletPoints: z.array(z.string())
  }),
  projectFeedback: z.array(z.object({
    project: z.string(),
    score: z.number(),
    suggestions: z.array(z.string())
  })),
  interviewQuestions: z.array(z.object({
    id: z.string(),
    category: z.string(),
    question: z.string(),
    answer: z.string()
  })),
  recruiterView: z.object({
    hireRecommendation: z.string(),
    riskFactors: z.array(z.string())
  })
});
