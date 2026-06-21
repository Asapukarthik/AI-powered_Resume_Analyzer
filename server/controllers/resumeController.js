import { prisma } from '../config/prisma.js';
import { extractTextFromFile } from '../services/fileParser.js';
import { analyzeResume, streamCoverLetter } from '../services/aiService.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';

export const uploadAndAnalyzeResume = async (req, res) => {
  try {
    // Establish SSE Connection
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    const { jobDescription } = req.body;
    const file = req.file;

    if (!file) {
      res.write(`data: ${JSON.stringify({ error: 'Resume file is required' })}\n\n`);
      return res.end();
    }

    res.write(`data: ${JSON.stringify({ status: "Parsing document structure and extracting text..." })}\n\n`);
    const resumeText = await extractTextFromFile(file.buffer, file.mimetype, file.originalname);
    
    res.write(`data: ${JSON.stringify({ status: "Uploading original file to secure cloud storage..." })}\n\n`);
    let cloudinaryUrl = '';
    try {
      cloudinaryUrl = await uploadToCloudinary(file.buffer, file.originalname);
    } catch (uploadError) {
      console.error('Cloudinary upload error:', uploadError);
      cloudinaryUrl = file.originalname; // Fallback
    }
    
    res.write(`data: ${JSON.stringify({ status: "Initializing deep AI semantic analysis..." })}\n\n`);

    // Simulate progress updates while the long AI call runs
    const aiSteps = [
      "Analyzing keyword density and compliance...",
      "Evaluating technical skills and domain expertise...",
      "Simulating enterprise recruiter ATS parsing...",
      "Generating tailored interview questions...",
      "Structuring professional learning roadmap..."
    ];
    let stepIndex = 0;
    const progressInterval = setInterval(() => {
        if (stepIndex < aiSteps.length) {
            res.write(`data: ${JSON.stringify({ status: aiSteps[stepIndex] })}\n\n`);
            stepIndex++;
        }
    }, 2500);

    const analysis = await analyzeResume(resumeText, jobDescription);
    clearInterval(progressInterval);

    res.write(`data: ${JSON.stringify({ status: "Finalizing and saving database records..." })}\n\n`);

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
        resumeOptimization: analysis.resumeOptimization || null,
        projectFeedback: analysis.projectFeedback || null,
        recruiterView: analysis.recruiterView || null,
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

    res.write(`data: ${JSON.stringify({
      status: "complete",
      message: 'Resume analyzed successfully',
      resume: newResume,
      analysis: newJobMatch,
    })}\n\n`);
    res.end();
  } catch (error) {
    console.error('Error in uploadAndAnalyzeResume:', error);
    res.write(`data: ${JSON.stringify({ error: 'Failed to process and analyze resume' })}\n\n`);
    res.end();
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

export const generateCoverLetter = async (req, res) => {
  try {
    const { id } = req.params;
    const { jobDescription } = req.body;

    const resumeRecord = await prisma.resume.findFirst({
      where: { id, userId: req.user.id }
    });

    if (!resumeRecord) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    // Prepare SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders(); // flush the headers to establish SSE

    // We don't have the raw text in DB, but we have the summary and keywords. 
    // It's better to reconstruct a text blob from the parsed data since we didn't save the raw text.
    const reconstructedResume = `
      Name: ${resumeRecord.name}
      Summary: ${resumeRecord.summary}
      Strengths: ${(resumeRecord.strengths || []).join(', ')}
      Skills: ${(resumeRecord.skillCategories || []).map(c => c.category).join(', ')}
    `;

    await streamCoverLetter(reconstructedResume, jobDescription, res);

  } catch (error) {
    console.error('Error generating cover letter:', error);
    res.status(500).json({ error: 'Failed to generate cover letter.' });
  }
};

export const reanalyzeResume = async (req, res) => {
  try {
    // Establish SSE Connection
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    const { id } = req.params;
    const { jobDescription } = req.body;

    res.write(`data: ${JSON.stringify({ status: "Fetching original document from cloud storage..." })}\n\n`);
    
    const resume = await prisma.resume.findUnique({
      where: { id: id, userId: req.user.id },
    });

    if (!resume) {
       res.write(`data: ${JSON.stringify({ error: 'Resume not found' })}\n\n`);
       return res.end();
    }

    let fileBuffer;
    let mimetype = 'application/pdf'; // Assume PDF
    if (resume.filePath.startsWith('http')) {
      const response = await fetch(resume.filePath);
      const arrayBuffer = await response.arrayBuffer();
      fileBuffer = Buffer.from(arrayBuffer);
    } else {
      res.write(`data: ${JSON.stringify({ error: 'Cannot reanalyze local fallback files.' })}\n\n`);
      return res.end();
    }

    res.write(`data: ${JSON.stringify({ status: "Extracting text using OCR pipeline..." })}\n\n`);
    const resumeText = await extractTextFromFile(fileBuffer, mimetype, resume.name);

    res.write(`data: ${JSON.stringify({ status: "Re-initializing deep AI semantic analysis..." })}\n\n`);

    // Simulate progress updates while the long AI call runs
    const aiSteps = [
      "Analyzing keyword density and compliance...",
      "Evaluating technical skills and domain expertise...",
      "Simulating enterprise recruiter ATS parsing...",
      "Generating tailored interview questions...",
      "Structuring professional learning roadmap..."
    ];
    let stepIndex = 0;
    const progressInterval = setInterval(() => {
        if (stepIndex < aiSteps.length) {
            res.write(`data: ${JSON.stringify({ status: aiSteps[stepIndex] })}\n\n`);
            stepIndex++;
        }
    }, 2500);

    const analysis = await analyzeResume(resumeText, jobDescription);
    clearInterval(progressInterval);

    res.write(`data: ${JSON.stringify({ status: "Updating database records..." })}\n\n`);

    const matchedKeywords = analysis.keywords?.matched || [];
    const missingKeywords = analysis.keywords?.missing || [];
    const matchedKeywordsCount = matchedKeywords.length;
    const missingKeywordsCount = missingKeywords.length;

    const allKeywords = [
      ...matchedKeywords.map(k => ({ word: k.word, category: 'matched', count: k.count || 0 })),
      ...missingKeywords.map(k => ({ word: k.word, category: 'missing', count: 0 })),
      ...(analysis.keywords?.overused || []).map(k => ({ word: k.word, category: 'overused', count: k.count || 0 }))
    ];

    const updatedResume = await prisma.resume.update({
      where: { id: id },
      data: {
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
        resumeOptimization: analysis.resumeOptimization || null,
        projectFeedback: analysis.projectFeedback || null,
        recruiterView: analysis.recruiterView || null,
      },
    });

    if (jobDescription) {
       // update or create jobMatch
       const existingJobMatch = await prisma.jobMatch.findFirst({ where: { resumeId: id } });
       if (existingJobMatch) {
          await prisma.jobMatch.update({
             where: { id: existingJobMatch.id },
             data: {
               jobDescription,
               matchScore: analysis.careerInsights?.marketReadinessScore || 0,
               matchDetails: analysis.atsAnalysis || {},
             }
          });
       } else {
          await prisma.jobMatch.create({
            data: {
              userId: req.user.id,
              resumeId: id,
              jobDescription,
              matchScore: analysis.careerInsights?.marketReadinessScore || 0,
              matchDetails: analysis.atsAnalysis || {},
            }
          });
       }
    }

    res.write(`data: ${JSON.stringify({ resume: updatedResume })}\n\n`);
    res.end();
  } catch (error) {
    console.error("Reanalyze Error:", error);
    res.write(`data: ${JSON.stringify({ error: "Failed to reanalyze resume" })}\n\n`);
    res.end();
  }
};
