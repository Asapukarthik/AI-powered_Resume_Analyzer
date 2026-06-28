"use client";

import React, { useEffect, useState, useRef, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import BackgroundParticles from "@/components/layout/BackgroundParticles";
import VercelBackground from "@/components/layout/VercelBackground";
import { Layers, Loader2, CheckCircle2, AlertTriangle } from "lucide-react";

function VerifyEmailComponent() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const apiCalledRef = useRef(false);

    useEffect(() => {
        if (!token) {
            setError("Verification token is missing.");
            setLoading(false);
            return;
        }

        if (apiCalledRef.current) return;
        apiCalledRef.current = true;

        const verify = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify-email?token=${token}`);
                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.error || "Verification failed.");
                }

                setSuccess(true);
            } catch (err: unknown) {
                setError(err instanceof Error ? err.message : "An error occurred.");
            } finally {
                setLoading(false);
            }
        };

        verify();
    }, [token]);

    return (
        <div className="relative z-10 w-full max-w-md">
            <div className="glass-card rounded-2xl border border-border bg-card/60 p-8 backdrop-blur shadow-[0_24px_80px_oklch(0.58_0.2_255_/_12%)]">
                <div className="flex flex-col items-center text-center mb-8">
                    <div className="inline-flex size-10 items-center justify-center rounded-xl border border-primary/25 bg-primary/10 mb-4">
                        <Layers className="size-5 text-primary" />
                    </div>
                    <h1 className="text-xl font-bold tracking-tight text-glow">Email Verification</h1>
                    <p className="text-xs text-muted-foreground mt-1">Verifying your Resume.ai registration</p>
                </div>

                {loading ? (
                    <div className="text-center py-8 space-y-4">
                        <Loader2 className="size-8 text-primary animate-spin mx-auto" />
                        <p className="text-xs text-muted-foreground">Verifying secure token with database...</p>
                    </div>
                ) : success ? (
                    <div className="text-center space-y-4 py-4">
                        <div className="mx-auto size-12 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-500 mb-2">
                            <CheckCircle2 className="size-6" />
                        </div>
                        <h3 className="text-sm font-semibold text-foreground">Verification Successful</h3>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            Your email address has been successfully verified! You can now log into your account.
                        </p>
                        <Link
                            href="/login"
                            className="w-full h-10 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_20px_oklch(0.58_0.2_255_/_20%)] font-semibold text-sm transition-all flex items-center justify-center mt-4"
                        >
                            Sign In
                        </Link>
                    </div>
                ) : (
                    <div className="text-center space-y-4 py-4">
                        <div className="mx-auto size-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 mb-2">
                            <AlertTriangle className="size-6" />
                        </div>
                        <h3 className="text-sm font-semibold text-foreground">Verification Failed</h3>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            {error || "The verification link is invalid or has expired."}
                        </p>
                        <Link
                            href="/login"
                            className="w-full h-10 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_20px_oklch(0.58_0.2_255_/_20%)] font-semibold text-sm transition-all flex items-center justify-center mt-4"
                        >
                            Back to login
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function VerifyEmailPage() {
    return (
        <main className="relative min-h-screen bg-background text-foreground flex items-center justify-center p-4 overflow-hidden">
            <VercelBackground />
            <BackgroundParticles />
            <Suspense fallback={
                <div className="relative z-10 w-full max-w-md flex justify-center">
                    <Loader2 className="size-8 text-primary animate-spin" />
                </div>
            }>
                <VerifyEmailComponent />
            </Suspense>
        </main>
    );
}
