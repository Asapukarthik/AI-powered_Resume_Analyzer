import { prisma } from '../config/prisma.js';
import { extractTextFromFile } from '../services/fileParser.js';
import { analyzeResume } from '../services/aiService.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';


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
    const resumeText = await extractTextFromFile(file.buffer, file.mimetype, file.originalname);
    // 2. Upload file to Cloudinary storage
    let cloudinaryUrl = '';
    try {
      cloudinaryUrl = await uploadToCloudinary(file.buffer, file.originalname);
    } catch (uploadError) {
      console.error('Cloudinary upload error:', uploadError);
      cloudinaryUrl = file.originalname; // Fallback
    }
    // 3. Use AI to analyze
    const analysis = await analyzeResume(resumeText, jobDescription);

    // 3. Derive keyword counts from the nested keywords object
    const matchedKeywords = analysis.keywords?.matched || [];
    const missingKeywords = analysis.keywords?.missing || [];
    const matchedKeywordsCount = matchedKeywords.length;
    const missingKeywordsCount = missingKeywords.length;

    // Flatten keywords into a single array for storage
    const allKeywords = [
      ...matchedKeywords.map(k => ({ word: k.word, category: 'matched', count: k.count || 0 })),
      ...missingKeywords.map(k => ({ word: k.word, category: 'missing', count: 0 })),
      ...(analysis.keywords?.overused || []).map(k => ({ word: k.word, category: 'overused', count: k.count || 0 }))
    ];

    // 4. Save the resume to the database with full AI analysis
    const newResume = await prisma.resume.create({
      data: {
        userId: req.user.id,
        name: file.originalname,
        size: file.size,
        score: analysis.atsAnalysis?.overallScore || 0,
        skillsMatch: analysis.careerInsights?.marketReadinessScore || 0,
        matchedKeywordsCount,
        missingKeywordsCount,
        summary: analysis.atsAnalysis?.summary || '',
        strengths: analysis.atsAnalysis?.strengths || [],
        weaknesses: analysis.atsAnalysis?.weaknesses || [],
        recommendedSkills: analysis.skillGapAnalysis?.recommendedSkills || [],
        keywords: allKeywords,
        skillCategories: analysis.skillCategories || [],
        suggestedRoadmap: analysis.learningRoadmap || [],
        interviewQuestions: analysis.interviewQuestions || [],
        filePath: cloudinaryUrl,
      },
    });

    // 5. Save the job match analysis to the database
    const newJobMatch = await prisma.jobMatch.create({
      data: {
        userId: req.user.id,
        resumeId: newResume.id,
        jobDescription: jobDescription,
        matchPercentage: analysis.atsAnalysis?.overallScore || 0,
        matchedKeywords: matchedKeywords,
        missingSkills: analysis.skillGapAnalysis?.missingSkills || [],
        suggestions: analysis.atsAnalysis?.recommendations || [],
      },
    });
    console.log(resumeText.substring(0, 50));

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

export const getUserResumes = async (req, res) => {
  try {
    const resumes = await prisma.resume.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' }
    });
    res.json(resumes);
  } catch (error) {
    console.error('Error fetching resumes:', error);
    res.status(500).json({ error: 'Failed to fetch resumes' });
  }
};

export const deleteResume = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if resume belongs to user
    const resume = await prisma.resume.findFirst({
      where: { id, userId: req.user.id }
    });

    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    // Prisma handles cascading deletes for JobMatch if configured,
    // otherwise we just delete the resume (and job matches will be orphaned or cascade deleted).
    // Let's explicitly delete associated job matches just in case.
    await prisma.$transaction([
      prisma.jobMatch.deleteMany({
        where: {
          resumeId: id
        }
      }),

      prisma.resume.delete({
        where: {
          id
        }
      })
    ]);

    res.json({ message: 'Resume deleted successfully' });
  } catch (error) {
    console.error('Error deleting resume:', error);
    res.status(500).json({ error: 'Failed to delete resume' });
  }
};
