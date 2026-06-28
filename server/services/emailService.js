import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Gmail App Password
    },
});

export const sendPasswordResetEmail = async (toEmail, resetUrl) => {
    await transporter.sendMail({
        from: `"Resume.ai" <${process.env.EMAIL_USER}>`,
        to: toEmail,
        subject: 'Reset Your Password — Resume.ai',
        html: `
        <div style="font-family: 'Inter', sans-serif; max-width: 520px; margin: 0 auto; background: #0f0f11; color: #e5e5e5; border-radius: 16px; overflow: hidden; border: 1px solid #27272a;">
            <div style="background: linear-gradient(135deg, #6366f1, #8b5cf6); padding: 32px 40px;">
                <h1 style="margin:0; font-size: 22px; font-weight: 700; color: #fff; letter-spacing: -0.5px;">Resume<span style="opacity:0.7;">.ai</span></h1>
            </div>
            <div style="padding: 36px 40px;">
                <h2 style="margin: 0 0 12px; font-size: 20px; font-weight: 700; color: #fff;">Reset your password</h2>
                <p style="margin: 0 0 28px; color: #a1a1aa; font-size: 14px; line-height: 1.6;">
                    We received a request to reset the password for your Resume.ai account. Click the button below to choose a new password. This link expires in <strong style="color:#c4b5fd;">1 hour</strong>.
                </p>
                <a href="${resetUrl}" style="display: inline-block; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: #fff; text-decoration: none; padding: 14px 32px; border-radius: 10px; font-size: 14px; font-weight: 600; letter-spacing: 0.2px;">
                    Reset Password
                </a>
                <p style="margin: 28px 0 0; color: #71717a; font-size: 12px; line-height: 1.6;">
                    If you didn't request a password reset, you can safely ignore this email. Your password will not change.<br/><br/>
                    Or copy and paste this link:<br/>
                    <a href="${resetUrl}" style="color: #818cf8; word-break: break-all;">${resetUrl}</a>
                </p>
            </div>
            <div style="padding: 20px 40px; border-top: 1px solid #27272a; background: #09090b;">
                <p style="margin: 0; color: #52525b; font-size: 11px;">© ${new Date().getFullYear()} Resume.ai · AI-Powered Career Tools</p>
            </div>
        </div>
        `,
    });
};

export const sendVerificationEmail = async (toEmail, verifyUrl) => {
    await transporter.sendMail({
        from: `"Resume.ai" <${process.env.EMAIL_USER}>`,
        to: toEmail,
        subject: 'Verify Your Email — Resume.ai',
        html: `
        <div style="font-family: 'Inter', sans-serif; max-width: 520px; margin: 0 auto; background: #0f0f11; color: #e5e5e5; border-radius: 16px; overflow: hidden; border: 1px solid #27272a;">
            <div style="background: linear-gradient(135deg, #6366f1, #8b5cf6); padding: 32px 40px;">
                <h1 style="margin:0; font-size: 22px; font-weight: 700; color: #fff; letter-spacing: -0.5px;">Resume<span style="opacity:0.7;">.ai</span></h1>
            </div>
            <div style="padding: 36px 40px;">
                <h2 style="margin: 0 0 12px; font-size: 20px; font-weight: 700; color: #fff;">Verify your email address</h2>
                <p style="margin: 0 0 28px; color: #a1a1aa; font-size: 14px; line-height: 1.6;">
                    Welcome to Resume.ai! Click the button below to verify your email address and activate your account. This link expires in <strong style="color:#c4b5fd;">24 hours</strong>.
                </p>
                <a href="${verifyUrl}" style="display: inline-block; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: #fff; text-decoration: none; padding: 14px 32px; border-radius: 10px; font-size: 14px; font-weight: 600; letter-spacing: 0.2px;">
                    Verify Email
                </a>
                <p style="margin: 28px 0 0; color: #71717a; font-size: 12px; line-height: 1.6;">
                    Or copy and paste this link:<br/>
                    <a href="${verifyUrl}" style="color: #818cf8; word-break: break-all;">${verifyUrl}</a>
                </p>
            </div>
            <div style="padding: 20px 40px; border-top: 1px solid #27272a; background: #09090b;">
                <p style="margin: 0; color: #52525b; font-size: 11px;">© ${new Date().getFullYear()} Resume.ai · AI-Powered Career Tools</p>
            </div>
        </div>
        `,
    });
};
