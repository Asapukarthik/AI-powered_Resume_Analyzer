import express from 'express';
import { chatWithAI } from '../controllers/chatController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, chatWithAI);

export default router;
