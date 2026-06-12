import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/prisma.js';
import { RegisterSchema, LoginSchema, GoogleLoginSchema } from '../validators/authValidator.js';

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
