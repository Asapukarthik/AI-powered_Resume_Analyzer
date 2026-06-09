"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import BackgroundParticles from "@/components/layout/BackgroundParticles";
import VercelBackground from "@/components/layout/VercelBackground";
import { Layers, Mail, Lock, Eye, EyeOff, Loader2, ArrowLeft, ShieldCheck } from "lucide-react";

import { useGoogleLogin } from "@react-oauth/google";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    // const [loading, setLoading] = useState(false);
    const [emailLoading, setEmailLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    // Mock validation states
    const [emailTouched, setEmailTouched] = useState(false);
    const [passwordTouched, setPasswordTouched] = useState(false);

    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const isPasswordValid = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/.test(password);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setEmailTouched(true);
        setPasswordTouched(true);
        setError("");

        if (!isEmailValid) {
            setError("Please enter a valid email address.");
            return;
        }

        if (!isPasswordValid) {
            setError("Password must be at least 6 characters.");
            return;
        }

        setEmailLoading(true);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Login failed");
            }

            // Save JWT token
            localStorage.setItem("token", data.token);

            setSuccess(true);

            // // Direct redirect to dashboard
            // setTimeout(() => {
            //     router.push("/dashboard");
            // }, 300);
            router.replace("/dashboard");
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "An error occurred during login.");
        } finally {
            setEmailLoading(false);
        }
    };

    const handleGoogleLoginSuccess = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            setGoogleLoading(true);
            setError("");
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/google`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ token: tokenResponse.access_token }),
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || "Google auth failed");

                localStorage.setItem("token", data.token);
                setSuccess(true);
                router.replace("/dashboard");
            } catch (err: unknown) {
                setError(err instanceof Error ? err.message : "Google auth failed.");
            } finally {
                setGoogleLoading(false);
            }
        },
        onError: () => {
            setError("Google auth failed.");
        }
    });

    return (
        <main className="relative min-h-screen bg-background text-foreground flex items-center justify-center p-4 overflow-hidden">
            {/* Background Ambient Particles */}
            <VercelBackground />
            <BackgroundParticles />

            {/* Back button */}
            <Link
                href="/"
                className="absolute top-6 left-6 z-10 flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground/80 transition-colors"
            >
                <ArrowLeft className="size-3.5" />
                Back to landing
            </Link>

            {/* Login Card Container */}
            <div className="relative z-10 w-full max-w-md">
                <div className="glass-card rounded-2xl border border-border bg-card/60 p-8 backdrop-blur shadow-[0_24px_80px_oklch(0.58_0.2_255_/_12%)]">
                    {/* Header Logo */}
                    <div className="flex flex-col items-center text-center mb-8">
                        <div className="inline-flex size-10 items-center justify-center rounded-xl border border-primary/25 bg-primary/10 mb-4">
                            <Layers className="size-5 text-primary" />
                        </div>
                        <h1 className="text-xl font-bold tracking-tight text-glow">Welcome back</h1>
                        <p className="text-xs text-muted-foreground mt-1">Enter details to optimize your career track</p>
                    </div>

                    {/* Alert banner */}
                    {error && (
                        <div className="mb-4 rounded-lg border border-red-500/20 bg-red-950/30 p-3 text-xs text-red-400 font-medium">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="mb-4 rounded-lg border border-green-500/20 bg-green-950/30 p-3 text-xs text-green-400 font-medium flex items-center gap-1.5">
                            <ShieldCheck className="size-4" /> Credentials verified. Loading dashboard...
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Email input */}
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

                        {/* Password input */}
                        <div className="space-y-1.5">
                            <div className="flex justify-between items-center">
                                <label className="text-xs text-muted-foreground font-medium">Password</label>
                                <span className="text-[10px] text-muted-foreground hover:text-foreground/80 cursor-pointer">
                                    Forgot password?
                                </span>
                            </div>
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

                        <button
                            type="submit"
                            disabled={emailLoading || success}
                            className="w-full h-10 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_20px_oklch(0.58_0.2_255_/_20%)] active:translate-y-[1px] text-sm font-semibold transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:pointer-events-none"
                        >
                            {emailLoading ? (
                                <>
                                    <Loader2 className="size-4 animate-spin" />
                                    Signing In...
                                </>
                            ) : (
                                "Sign In with Email"
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-border"></div>
                        </div>
                        <div className="relative flex justify-center text-[10px] uppercase">
                            <span className="bg-background/80 px-2 text-muted-foreground font-mono">Or continue with</span>
                        </div>
                    </div>

                    {/* Google Sign In */}
                    <button
                        onClick={() => handleGoogleLoginSuccess()}
                        disabled={googleLoading}
                        className="w-full h-10 rounded-lg border border-border bg-secondary/40 hover:bg-accent/40 active:translate-y-[1px] text-sm font-semibold text-foreground transition-all flex items-center justify-center gap-2"
                    >
                        <svg className="size-4" viewBox="0 0 24 24">
                            <path
                                fill="currentColor"
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                                fill="currentColor"
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                                fill="currentColor"
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                            />
                            <path
                                fill="currentColor"
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                            />
                        </svg>
                        Sign in with Google
                    </button>

                    {/* Footer link */}
                    <p className="mt-6 text-center text-xs text-muted-foreground">
                        Don&apos;t have an account?{" "}
                        <Link href="/register" className="text-foreground/80 hover:text-foreground underline-offset-4 hover:underline font-semibold">
                            Create Account
                        </Link>
                    </p>
                </div>
            </div>
        </main>
    );
}
