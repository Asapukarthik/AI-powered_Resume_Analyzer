"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import BackgroundParticles from "@/components/layout/BackgroundParticles";
import VercelBackground from "@/components/layout/VercelBackground";
import { Layers, Lock, Eye, EyeOff, Loader2, CheckCircle2, AlertTriangle } from "lucide-react";

function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const [passwordTouched, setPasswordTouched] = useState(false);
    const [confirmTouched, setConfirmTouched] = useState(false);

    const isPasswordValid = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/.test(password);
    const isConfirmValid = password === confirmPassword;

    useEffect(() => {
        if (!token) {
            setError("Invalid request. Missing reset token.");
        }
    }, [token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordTouched(true);
        setConfirmTouched(true);
        setError("");

        if (!token) {
            setError("Missing token.");
            return;
        }

        if (!isPasswordValid) {
            setError("Password must meet complexity requirements.");
            return;
        }

        if (!isConfirmValid) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/reset-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to reset password.");
            }

            setSuccess(true);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "An error occurred.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative z-10 w-full max-w-md">
            <div className="glass-card rounded-2xl border border-border bg-card/60 p-8 backdrop-blur shadow-[0_24px_80px_oklch(0.58_0.2_255_/_12%)]">
                <div className="flex flex-col items-center text-center mb-8">
                    <div className="inline-flex size-10 items-center justify-center rounded-xl border border-primary/25 bg-primary/10 mb-4">
                        <Layers className="size-5 text-primary" />
                    </div>
                    <h1 className="text-xl font-bold tracking-tight text-glow">New Password</h1>
                    <p className="text-xs text-muted-foreground mt-1">Please enter your new password below</p>
                </div>

                {error && (
                    <div className="mb-4 rounded-lg border border-red-500/20 bg-red-950/30 p-3 text-xs text-red-400 font-medium">
                        {error}
                    </div>
                )}

                {success ? (
                    <div className="text-center space-y-4 py-4">
                        <div className="mx-auto size-12 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-500 mb-2">
                            <CheckCircle2 className="size-6" />
                        </div>
                        <h3 className="text-sm font-semibold text-foreground">Password Reset Successfully</h3>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            Your account password has been updated. You can now use your new credentials to sign in.
                        </p>
                        <Link
                            href="/login"
                            className="w-full h-10 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_20px_oklch(0.58_0.2_255_/_20%)] font-semibold text-sm transition-all flex items-center justify-center mt-4"
                        >
                            Sign In
                        </Link>
                    </div>
                ) : !token ? (
                    <div className="text-center space-y-4 py-4">
                        <div className="mx-auto size-12 rounded-full bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-500 mb-2">
                            <AlertTriangle className="size-6" />
                        </div>
                        <h3 className="text-sm font-semibold text-foreground">Invalid Reset Link</h3>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            The link you used is invalid or expired. Please request a new password reset link.
                        </p>
                        <Link
                            href="/forgot-password"
                            className="w-full h-10 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_20px_oklch(0.58_0.2_255_/_20%)] font-semibold text-sm transition-all flex items-center justify-center mt-4"
                        >
                            Request New Link
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* New password input */}
                        <div className="space-y-1.5">
                            <label className="text-xs text-muted-foreground font-medium block">New Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/70" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    onBlur={() => setPasswordTouched(true)}
                                    placeholder="••••••••"
                                    className={`w-full h-10 pl-10 pr-10 rounded-lg bg-secondary/60 border ${passwordTouched && !isPasswordValid
                                        ? "border-red-500/50 focus:border-red-500"
                                        : "border-border focus:border-neutral-500"
                                        } text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/70`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/70 hover:text-foreground/80 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                                </button>
                            </div>
                            {passwordTouched && !isPasswordValid && (
                                <span className="text-[10px] text-red-500 block">Password must be at least 8 characters with one uppercase letter and one number.</span>
                            )}
                        </div>

                        {/* Confirm password input */}
                        <div className="space-y-1.5">
                            <label className="text-xs text-muted-foreground font-medium block">Confirm New Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/70" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    onBlur={() => setConfirmTouched(true)}
                                    placeholder="••••••••"
                                    className={`w-full h-10 pl-10 pr-10 rounded-lg bg-secondary/60 border ${confirmTouched && !isConfirmValid
                                        ? "border-red-500/50 focus:border-red-500"
                                        : "border-border focus:border-neutral-500"
                                        } text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/70`}
                                />
                            </div>
                            {confirmTouched && !isConfirmValid && (
                                <span className="text-[10px] text-red-500 block">Passwords do not match.</span>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-10 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_20px_oklch(0.58_0.2_255_/_20%)] active:translate-y-[1px] text-sm font-semibold transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:pointer-events-none"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="size-4 animate-spin" />
                                    Resetting Password...
                                </>
                            ) : (
                                "Reset Password"
                            )}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <main className="relative min-h-screen bg-background text-foreground flex items-center justify-center p-4 overflow-hidden">
            <VercelBackground />
            <BackgroundParticles />
            <Suspense fallback={
                <div className="relative z-10 w-full max-w-md flex justify-center">
                    <Loader2 className="size-8 text-primary animate-spin" />
                </div>
            }>
                <ResetPasswordForm />
            </Suspense>
        </main>
    );
}
