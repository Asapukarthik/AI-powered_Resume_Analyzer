"use client";
import { useEffect } from "react";
import Link from "next/link";
import { AlertOctagon, RefreshCcw } from "lucide-react";
import MeshGradientBackground from "@/components/layout/MeshGradientBackground";
import BackgroundParticles from "@/components/layout/BackgroundParticles";
export default function ErrorPage({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error("Global Error Boundary caught:", error);
    }, [error]);
    return (
        <main className="relative min-h-screen bg-background text-foreground flex items-center justify-center overflow-hidden">
            <MeshGradientBackground />
            <BackgroundParticles />

            <div className="relative z-10 text-center space-y-6 p-8 max-w-md mx-auto">
                <div className="mx-auto w-24 h-24 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center shadow-xl shadow-red-500/10 mb-8">
                    <AlertOctagon className="size-10 text-red-500" />
                </div>

                <h1 className="text-3xl font-bold tracking-tight font-sans">
                    Something went wrong
                </h1>

                <p className="text-sm text-muted-foreground leading-relaxed">
                    A critical rendering error occurred in the application. We've logged the issue and are looking into it.
                </p>

                <div className="p-4 rounded-lg bg-secondary/50 border border-border text-left overflow-hidden">
                    <p className="text-[10px] font-mono text-red-400 break-words line-clamp-3">
                        {error.message || "Unknown error boundary fault"}
                    </p>
                </div>

                <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <button
                        onClick={() => reset()}
                        className="inline-flex w-full sm:w-auto items-center justify-center gap-2 h-11 px-8 rounded-xl bg-primary text-primary-foreground font-semibold text-sm transition-all hover:bg-primary/90 shadow-[0_0_20px_oklch(0.58_0.2_255_/_20%)] hover:shadow-indigo-500/40 hover:-translate-y-0.5"
                    >
                        <RefreshCcw className="size-4" />
                        Try Again
                    </button>
                    <Link
                        href="/dashboard"
                        className="inline-flex w-full sm:w-auto items-center justify-center gap-2 h-11 px-8 rounded-xl bg-secondary border border-border text-foreground font-semibold text-sm transition-all hover:bg-accent"
                    >
                        Go to Dashboard
                    </Link>
                </div>
            </div>
        </main>
    );
}
