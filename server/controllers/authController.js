import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../index.js';

import { OAuth2Client } from 'google-auth-library';

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};


const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleLogin = async (req, res, next) => {
    try {
        const { token } = req.body;
        if (!token) {
            res.status(400);
            throw new Error('Google token is required');
        }

        // The frontend now sends an access_token via useGoogleLogin.
        // We fetch the user profile from Google's userinfo endpoint.
        const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch user profile from Google');
        }

        const payload = await response.json();
        const { email, name, sub: googleId } = payload;

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
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            res.status(400);
            throw new Error('Please provide all fields');
        }

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

        res.status(201).json({
            id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user.id),
        });
    } catch (error) {
        next(error);
    }
};

export const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;

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
