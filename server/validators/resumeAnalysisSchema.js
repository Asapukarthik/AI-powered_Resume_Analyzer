import { z } from "zod";

export const ResumeAnalysisSchema = z.object({
  atsAnalysis: z.object({
    overallScore: z.number().catch(0),
    keywordScore: z.number().catch(0),
    experienceScore: z.number().catch(0),
    projectScore: z.number().catch(0),
    formattingScore: z.number().catch(0),
    summary: z.string().catch(""),
    strengths: z.array(z.string()).catch([]),
    weaknesses: z.array(z.string()).catch([]),
    recommendations: z.array(z.string()).catch([]),
  }).catch({
    overallScore: 0, keywordScore: 0, experienceScore: 0, projectScore: 0,
    formattingScore: 0, summary: "", strengths: [], weaknesses: [], recommendations: []
  }),
  keywords: z.object({
    matched: z.array(z.object({
      word: z.string().catch(""),
      count: z.number().catch(0),
      importance: z.string().catch("medium")
    })).catch([]),
    missing: z.array(z.object({
      word: z.string().catch(""),
      importance: z.string().catch("medium")
    })).catch([]),
    overused: z.array(z.object({
      word: z.string().catch(""),
      count: z.number().catch(0)
    })).catch([])
  }).catch({ matched: [], missing: [], overused: [] }),
  resumeSections: z.object({
    summary: z.number().catch(0),
    skills: z.number().catch(0),
    experience: z.number().catch(0),
    projects: z.number().catch(0),
    education: z.number().catch(0)
  }).catch({ summary: 0, skills: 0, experience: 0, projects: 0, education: 0 }),
  careerInsights: z.object({
    currentLevel: z.string().catch(""),
    targetRole: z.string().catch(""),
    estimatedTimeline: z.string().catch(""),
    marketReadinessScore: z.number().catch(0)
  }).catch({ currentLevel: "", targetRole: "", estimatedTimeline: "", marketReadinessScore: 0 }),
  skillGapAnalysis: z.object({
    currentSkills: z.array(z.string()).catch([]),
    missingSkills: z.array(z.string()).catch([]),
    recommendedSkills: z.array(z.string()).catch([])
  }).catch({ currentSkills: [], missingSkills: [], recommendedSkills: [] }),
  skillCategories: z.array(z.object({
    category: z.string().catch("Unknown"),
    score: z.number().catch(0)
  })).catch([]),
  learningRoadmap: z.array(z.object({
    step: z.number().catch(0),
    title: z.string().catch(""),
    description: z.string().catch(""),
    duration: z.string().catch(""),
    skills: z.array(z.string()).catch([])
  })).catch([]),
  resumeOptimization: z.object({
    rewrittenSummary: z.string().catch(""),
    improvedBulletPoints: z.array(z.string()).catch([])
  }).catch({ rewrittenSummary: "", improvedBulletPoints: [] }),
  projectFeedback: z.array(z.object({
    project: z.string().catch(""),
    score: z.number().catch(0),
    suggestions: z.array(z.string()).catch([])
  })).catch([]),
  interviewQuestions: z.array(z.object({
    id: z.string().catch("q0"),
    category: z.string().catch("technical"),
    question: z.string().catch(""),
    answer: z.string().catch("")
  })).catch([]),
  recruiterView: z.object({
    hireRecommendation: z.string().catch(""),
    riskFactors: z.array(z.string()).catch([])
  }).catch({ hireRecommendation: "", riskFactors: [] }),
}).passthrough();

