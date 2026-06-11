import express from 'express';
import { generateQuestions } from '../controllers/interviewController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/generate', protect, generateQuestions);

export default router;
