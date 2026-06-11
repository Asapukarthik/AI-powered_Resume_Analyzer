import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import pkg from '@prisma/client';
const { PrismaClient } = pkg;
import { notFound, errorHandler } from './middleware/errorHandler.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import resumeRoutes from './routes/resumeRoutes.js';
import interviewRoutes from './routes/interviewRoutes.js';
import chatRoutes from './routes/chatRoutes.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(
  helmet({
    crossOriginOpenerPolicy: {
      policy: "same-origin-allow-popups",
    },
  })
);

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests. Try again later."
});

app.use(limiter);

// Initialize Prisma
export const prisma = new PrismaClient();

// Middleware
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/interviews', interviewRoutes);
app.use('/api/chat', chatRoutes);

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'AI Resume Analyzer API is running' });
});

// Error Handler Middleware
app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
