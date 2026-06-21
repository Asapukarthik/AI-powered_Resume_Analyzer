"use client";

import Link from "next/link";
import { ArrowLeft, SearchX } from "lucide-react";
import VercelBackground from "@/components/layout/VercelBackground";
import BackgroundParticles from "@/components/layout/BackgroundParticles";

export default function NotFound() {
    return (
        <main className="relative min-h-screen bg-background text-foreground flex items-center justify-center overflow-hidden">
            <VercelBackground />
            <BackgroundParticles />

            <div className="relative z-10 text-center space-y-6 p-8 max-w-lg mx-auto">
                <div className="mx-auto w-24 h-24 rounded-full bg-secondary/80 border border-border flex items-center justify-center shadow-xl mb-8">
                    <SearchX className="size-10 text-indigo-500" />
                </div>

                <h1 className="text-5xl font-extrabold tracking-tight font-sans">
                    404
                </h1>

                <h2 className="text-xl font-semibold text-foreground/90">
                    Page not found
                </h2>

                <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
                    The requested URL doesn't exist or you don't have access to it. It might have been moved or deleted.
                </p>

                <div className="pt-6">
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center gap-2 h-11 px-8 rounded-xl bg-primary text-primary-foreground font-semibold text-sm transition-all hover:bg-primary/90 shadow-[0_0_20px_oklch(0.58_0.2_255_/_20%)] hover:shadow-indigo-500/40 hover:-translate-y-0.5 active:translate-y-0"
                    >
                        <ArrowLeft className="size-4" />
                        Return to Dashboard
                    </Link>
                </div>
            </div>
        </main>
    );
}
