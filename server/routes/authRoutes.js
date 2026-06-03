import express from 'express';
import { registerUser, loginUser, getMe } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', registerUser);
router.get('/register', (req, res) => {
  res.json({ message: 'Register endpoint reachable via GET (debug)' });
});
router.post('/login', loginUser);
router.get('/me', protect, getMe);

export default router;
