import { prisma } from '../index.js';
import { extractTextFromFile } from '../services/fileParser.js';
import { analyzeResume } from '../services/aiService.js';


export const uploadAndAnalyzeResume = async (req, res) => {
  try {
    const { jobDescription } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'Resume file is required' });
    }

    if (!jobDescription) {
      return res.status(400).json({ error: 'Job description is required' });
    }

    // 1. Extract text from the uploaded file
    const resumeText = await extractTextFromFile(file.buffer, file.mimetype);

    // 2. Use AI to analyze the resume against the job description
    const analysis = await analyzeResume(resumeText, jobDescription);

    // 3. Derive keyword counts from the AI's keywords array
    const keywords = analysis.keywords || [];
    const matchedKeywordsCount = keywords.filter(k => k.category === 'matched').length;
    const missingKeywordsCount = keywords.filter(k => k.category === 'missing').length;

    // 4. Save the resume to the database with full AI analysis
    const newResume = await prisma.resume.create({
      data: {
        userId: req.user.id,
        name: file.originalname,
        size: file.size,
        score: analysis.matchScore || 0,
        skillsMatch: analysis.matchScore || 0,
        matchedKeywordsCount,
        missingKeywordsCount,
        summary: analysis.summary || '',
        strengths: analysis.strengths || [],
        weaknesses: analysis.weaknesses || [],
        recommendedSkills: analysis.recommendations || [],
        keywords: analysis.keywords || [],
        suggestedRoadmap: analysis.suggestedRoadmap || [],
        interviewQuestions: analysis.interviewQuestions || [],
        filePath: file.originalname, // buffer-based; no disk path
      },
    });

    // 5. Save the job match analysis to the database
    const newJobMatch = await prisma.jobMatch.create({
      data: {
        userId: req.user.id,
        resumeId: newResume.id,
        jobDescription: jobDescription,
        matchPercentage: analysis.matchScore || 0,
        matchedKeywords: analysis.keywords?.filter(k => k.category === 'matched') || [],
        missingSkills: analysis.weaknesses || [],
        suggestions: analysis.recommendations || [],
      },
    });

    return res.status(201).json({
      message: 'Resume analyzed successfully',
      resume: newResume,
      analysis: newJobMatch,
    });
  } catch (error) {
    console.error('Error in uploadAndAnalyzeResume:', error);
    return res.status(500).json({ error: 'Failed to process and analyze resume' });
  }
};
