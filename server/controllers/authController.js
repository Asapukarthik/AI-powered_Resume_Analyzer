import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { prisma } from '../config/prisma.js';
import { RegisterSchema, LoginSchema, GoogleLoginSchema } from '../validators/authValidator.js';
import { sendPasswordResetEmail, sendVerificationEmail } from '../services/emailService.js';
import { OAuth2Client } from 'google-auth-library';

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};


const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleLogin = async (req, res, next) => {
    try {
        const result = GoogleLoginSchema.safeParse(req.body);
        if (!result.success) {
            res.status(400);
            throw new Error(result.error.errors[0].message);
        }

        const { token } = result.data;

        // The frontend now sends an access_token via useGoogleLogin.
        // We fetch the user profile from Google's userinfo endpoint.


        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();

        const {
            email,
            name,
            sub: googleId,
        } = payload;

        if (!email) {
            res.status(400);
            throw new Error('Email not provided by Google');
        }

        let user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            // Generate a random password hash for OAuth-created users
            const salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash(Math.random().toString(36), salt);
            user = await prisma.user.create({
                data: {
                    name: name || email.split('@')[0],
                    email,
                    passwordHash,
                    settings: { create: {} }
                },
                include: { settings: true }
            });
        }

        res.status(200).json({
            id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user.id),
        });
    } catch (error) {
        res.status(401);
        next(new Error('Invalid Google Token or ' + error.message));
    }
};


export const registerUser = async (req, res, next) => {
    try {
        const validation = RegisterSchema.safeParse(req.body);

        if (!validation.success) {
            res.status(400);
            throw new Error(validation.error.errors[0].message);
        }

        const { name, email, password } = validation.data;

        const userExists = await prisma.user.findUnique({ where: { email } });

        if (userExists) {
            res.status(400);
            throw new Error('User already exists');
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                passwordHash,
                settings: {
                    create: {} // default settings
                }
            },
            include: { settings: true }
        });

        // Send email verification
        try {
            const verifyToken = crypto.randomBytes(32).toString('hex');
            await prisma.emailVerificationToken.create({
                data: {
                    token: verifyToken,
                    userId: user.id,
                    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24h
                }
            });
            const verifyUrl = `${process.env.CLIENT_URL}/verify-email?token=${verifyToken}`;
            await sendVerificationEmail(email, verifyUrl);
        } catch (emailErr) {
            console.error('Verification email failed (non-blocking):', emailErr.message);
        }

        res.status(201).json({
            id: user.id,
            name: user.name,
            email: user.email,
            isVerified: user.isVerified,
            token: generateToken(user.id),
        });
    } catch (error) {
        next(error);
    }
};

export const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        if (!email) {
            res.status(400);
            throw new Error('Email is required');
        }

        const user = await prisma.user.findUnique({ where: { email } });
        // Always respond 200 to avoid email enumeration
        if (!user) {
            return res.json({ message: 'If this email exists, a reset link has been sent.' });
        }

        // Invalidate all existing unused tokens for this user
        await prisma.passwordResetToken.updateMany({
            where: { userId: user.id, used: false },
            data: { used: true },
        });

        const token = crypto.randomBytes(32).toString('hex');
        await prisma.passwordResetToken.create({
            data: {
                token,
                userId: user.id,
                expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
            }
        });

        const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${token}`;
        await sendPasswordResetEmail(email, resetUrl);

        res.json({ message: 'If this email exists, a reset link has been sent.' });
    } catch (error) {
        next(error);
    }
};

export const resetPassword = async (req, res, next) => {
    try {
        const { token, password } = req.body;
        if (!token || !password) {
            res.status(400);
            throw new Error('Token and new password are required');
        }
        if (password.length < 8) {
            res.status(400);
            throw new Error('Password must be at least 8 characters');
        }

        const record = await prisma.passwordResetToken.findUnique({ where: { token } });

        if (!record || record.used || record.expiresAt < new Date()) {
            res.status(400);
            throw new Error('Reset link is invalid or has expired');
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        await prisma.$transaction([
            prisma.user.update({
                where: { id: record.userId },
                data: { passwordHash },
            }),
            prisma.passwordResetToken.update({
                where: { token },
                data: { used: true },
            }),
        ]);

        res.json({ message: 'Password updated successfully. You can now log in.' });
    } catch (error) {
        next(error);
    }
};

export const verifyEmail = async (req, res, next) => {
    try {
        const { token } = req.query;
        if (!token) {
            res.status(400);
            throw new Error('Verification token is missing');
        }

        const record = await prisma.emailVerificationToken.findUnique({ where: { token } });

        if (!record || record.expiresAt < new Date()) {
            res.status(400);
            throw new Error('Verification link is invalid or has expired');
        }

        await prisma.$transaction([
            prisma.user.update({
                where: { id: record.userId },
                data: { isVerified: true },
            }),
            prisma.emailVerificationToken.delete({ where: { token } }),
        ]);

        res.json({ message: 'Email verified successfully! You can now log in.' });
    } catch (error) {
        next(error);
    }
};

export const resendVerification = async (req, res, next) => {
    try {
        const user = await prisma.user.findUnique({ where: { id: req.user.id } });
        if (!user) { res.status(404); throw new Error('User not found'); }
        if (user.isVerified) { return res.json({ message: 'Email already verified' }); }

        // Delete old tokens and create fresh one
        await prisma.emailVerificationToken.deleteMany({ where: { userId: user.id } });
        const token = crypto.randomBytes(32).toString('hex');
        await prisma.emailVerificationToken.create({
            data: { token, userId: user.id, expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) }
        });
        const verifyUrl = `${process.env.CLIENT_URL}/verify-email?token=${token}`;
        await sendVerificationEmail(user.email, verifyUrl);
        res.json({ message: 'Verification email resent.' });
    } catch (error) {
        next(error);
    }
};

export const loginUser = async (req, res, next) => {
    try {
        const validation = LoginSchema.safeParse(req.body);

        if (!validation.success) {
            res.status(400);
            throw new Error(validation.error.errors[0].message);
        }

        const { email, password } = validation.data;

        const user = await prisma.user.findUnique({
            where: { email },
            include: { settings: true }
        });

        if (user && (await bcrypt.compare(password, user.passwordHash))) {
            res.json({
                id: user.id,
                name: user.name,
                email: user.email,
                token: generateToken(user.id),
            });
        } else {
            res.status(401);
            throw new Error('Invalid email or password');
        }
    } catch (error) {
        next(error);
    }
};

export const getCurrentUser = async (req, res, next) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: {
                id: true,
                name: true,
                email: true,
                tier: true,
                avatar: true,
                createdAt: true,
                settings: true
            }
        });

        if (!user) {
            res.status(404);
            throw new Error('User not found');
        }

        res.json(user);
    } catch (error) {
        next(error);
    }
};

export const getMe = async (req, res, next) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: { id: true, name: true, email: true, tier: true, settings: true, createdAt: true }
        });
        res.json(user);
    } catch (error) {
        next(error);
    }
};
