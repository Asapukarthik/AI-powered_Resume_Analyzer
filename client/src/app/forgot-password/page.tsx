"use client";

import React, { useState } from "react";
import Link from "next/link";
import BackgroundParticles from "@/components/layout/BackgroundParticles";
import VercelBackground from "@/components/layout/VercelBackground";
import { Layers, Mail, Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [emailTouched, setEmailTouched] = useState(false);

    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setEmailTouched(true);
        setError("");

        if (!isEmailValid) {
            setError("Please enter a valid email address.");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/forgot-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to request password reset link.");
            }

            setSuccess(true);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "An error occurred.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="relative min-h-screen bg-background text-foreground flex items-center justify-center p-4 overflow-hidden">
            <VercelBackground />
            <BackgroundParticles />

            <Link
                href="/login"
                className="absolute top-6 left-6 z-10 flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground/80 transition-colors"
            >
                <ArrowLeft className="size-3.5" />
                Back to login
            </Link>

            <div className="relative z-10 w-full max-w-md">
                <div className="glass-card rounded-2xl border border-border bg-card/60 p-8 backdrop-blur shadow-[0_24px_80px_oklch(0.58_0.2_255_/_12%)]">
                    <div className="flex flex-col items-center text-center mb-8">
                        <div className="inline-flex size-10 items-center justify-center rounded-xl border border-primary/25 bg-primary/10 mb-4">
                            <Layers className="size-5 text-primary" />
                        </div>
                        <h1 className="text-xl font-bold tracking-tight text-glow">Reset Password</h1>
                        <p className="text-xs text-muted-foreground mt-1">We'll send you instructions to reset your password</p>
                    </div>

                    {error && (
                        <div className="mb-4 rounded-lg border border-red-500/20 bg-red-950/30 p-3 text-xs text-red-400 font-medium">
                            {error}
                        </div>
                    )}

                    {success ? (
                        <div className="text-center space-y-4 py-4">
                            <div className="mx-auto size-12 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-500 mb-2 animate-bounce">
                                <CheckCircle2 className="size-6" />
                            </div>
                            <h3 className="text-sm font-semibold text-foreground">Check your email</h3>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                If an account exists with the email <strong>{email}</strong>, you will receive a secure password reset link shortly.
                            </p>
                            <Link
                                href="/login"
                                className="inline-flex h-9 items-center justify-center px-4 rounded-lg border border-border bg-secondary hover:bg-secondary/80 text-xs font-semibold text-foreground transition-all mt-2"
                            >
                                Back to Sign In
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-xs text-muted-foreground font-medium block">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/70" />
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        onBlur={() => setEmailTouched(true)}
                                        placeholder="name@company.com"
                                        className={`w-full h-10 pl-10 pr-4 rounded-lg bg-secondary/60 border ${emailTouched && !isEmailValid
                                            ? "border-red-500/50 focus:border-red-500"
                                            : "border-border focus:border-neutral-500"
                                            } text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/70`}
                                    />
                                </div>
                                {emailTouched && !isEmailValid && (
                                    <span className="text-[10px] text-red-500 block">Please enter a valid email address.</span>
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
                                        Sending Instructions...
                                    </>
                                ) : (
                                    "Send Reset Link"
                                )}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </main>
    );
}
