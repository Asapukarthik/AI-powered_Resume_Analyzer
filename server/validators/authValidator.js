// const ticket = await client.verifyIdToken({
//     idToken: token,
//     audience: process.env.GOOGLE_CLIENT_ID,
// });

// const payload = ticket.getPayload();

// const {
//     email,
//     name,
//     sub: googleId,
// } = payload;

import { z } from "zod";

export const RegisterSchema = z.object({
    name: z
        .string()
        .min(2, "Name must contain at least 2 characters")
        .max(50),

    email: z
        .string()
        .email("Invalid email"),

    password: z
        .string()
        .min(6, "Password must be at least 6 characters")
});

export const LoginSchema = z.object({
    email: z
        .string()
        .email(),

    password: z
        .string()
        .min(6)
});

export const GoogleLoginSchema = z.object({
    token: z
        .string()
        .min(1, "Google token is required")
});