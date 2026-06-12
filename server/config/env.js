const requiredEnvVars = [
    "DATABASE_URL",
    "JWT_SECRET",
    "GEMINI_API_KEY",
    "GOOGLE_CLIENT_ID",
    "CLOUDINARY_CLOUD_NAME",
    "CLOUDINARY_API_KEY",
    "CLOUDINARY_API_SECRET"
];

export const validateEnv = () => {
    const missing = requiredEnvVars.filter(
        (key) => !process.env[key]
    );

    if (missing.length > 0) {
        console.error(
            `❌ Missing Environment Variables: ${missing.join(", ")}`
        );

        process.exit(1);
    }

    console.log("✅ Environment Variables Loaded");
};