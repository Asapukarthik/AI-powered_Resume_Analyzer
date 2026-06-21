import { prisma } from '../config/prisma.js';
import bcrypt from 'bcrypt';
import { uploadToCloudinary, uploadImageToCloudinary } from '../utils/cloudinary.js';

export const updateProfile = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        const user = await prisma.user.findUnique({ where: { id: req.user.id } });

        if (!user) {
            res.status(404);
            throw new Error('User not found');
        }

        const dataToUpdate = {
            ...(name && { name }),
            ...(email && { email })
        };

        if (password) {
            const salt = await bcrypt.genSalt(10);
            dataToUpdate.passwordHash = await bcrypt.hash(password, salt);
        }

        const updatedUser = await prisma.user.update({
            where: { id: req.user.id },
            data: dataToUpdate,
            select: { id: true, name: true, email: true, tier: true, avatar: true }
        });

        res.json(updatedUser);
    } catch (error) {
        next(error);
    }
};

export const updateSettings = async (req, res, next) => {
    try {
        const { emailAlerts, autoAnalyze, model } = req.body;

        const updatedSettings = await prisma.userSettings.upsert({
            where: { userId: req.user.id },
            update: {
                ...(emailAlerts !== undefined && { emailAlerts }),
                ...(autoAnalyze !== undefined && { autoAnalyze }),
                ...(model !== undefined && { model })
            },
            create: {
                userId: req.user.id,
                emailAlerts: emailAlerts ?? false,
                autoAnalyze: autoAnalyze ?? true,
                model: model ?? 'openai'
            }
        });

        res.json(updatedSettings);
    } catch (error) {
        next(error);
    }
};

export const uploadAvatar = async (req, res, next) => {
    try {
        const file = req.file;
        if (!file) {
            res.status(400);
            throw new Error('Please upload an image file');
        }

        const cloudinaryUrl = await uploadImageToCloudinary(file.buffer, file.originalname);

        const updatedUser = await prisma.user.update({
            where: { id: req.user.id },
            data: { avatar: cloudinaryUrl },
            select: { id: true, name: true, email: true, tier: true, avatar: true }
        });

        res.json(updatedUser);
    } catch (error) {
        next(error);
    }
};

export const deleteAvatar = async (req, res, next) => {
    try {
        const updatedUser = await prisma.user.update({
            where: { id: req.user.id },
            data: { avatar: null },
            select: { id: true, name: true, email: true, tier: true, avatar: true }
        });

        res.json(updatedUser);
    } catch (error) {
        next(error);
    }
};
