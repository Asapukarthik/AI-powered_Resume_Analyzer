import express from 'express';
import { uploadAndAnalyzeResume, getUserResumes, deleteResume, generateCoverLetter, reanalyzeResume } from '../controllers/resumeController.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import rateLimit from 'express-rate-limit';

const router = express.Router();

// Stricter rate limiter for the expensive AI analysis endpoint
const analysisLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: "Too many resume analysis requests. Please wait 15 minutes and try again." }
});

// Protect the routes with authenticateToken middleware
router.post('/analyze', protect, analysisLimiter, upload.single('resume'), uploadAndAnalyzeResume);
router.get('/', protect, getUserResumes);
router.delete('/:id', protect, deleteResume);
router.post('/:id/cover-letter', protect, analysisLimiter, generateCoverLetter);
router.post('/:id/reanalyze', protect, analysisLimiter, reanalyzeResume);

export default router;
