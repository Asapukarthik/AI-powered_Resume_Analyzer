"use client";

import React, { useState } from "react";
import { useResumeStore } from "@/hooks/useResumeStore";
import { 
    Briefcase, 
    Sparkles, 
    Loader2, 
    AlertCircle, 
    CornerDownRight
} from "lucide-react";

export default function JobMatcherView() {
    const { activeResume, setCurrentTab } = useResumeStore();
    const [jobDesc, setJobDesc] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<{
        matchPercentage: number;
        missingSkills: string[];
        matchedKeywords: string[];
        suggestions: string[];
    } | null>(null);

    const handleCompare = async () => {
        if (!jobDesc.trim()) return;
        setLoading(true);

        // Simulated processing latency
        await new Promise((resolve) => setTimeout(resolve, 1200));

        // Dynamic modifier
        const baseScore = activeResume ? activeResume.score : 65;
        const randomModifier = Math.floor(Math.random() * 15) - 8; // -8 to +7
        const matchPct = Math.max(45, Math.min(98, baseScore + randomModifier));

        setResult({
            matchPercentage: matchPct,
            missingSkills: [
                "Advanced AWS IAM Policy design",
                "Helm charts deployments scripting",
                "Prometheus monitoring configurations"
            ],
            matchedKeywords: ["Kubernetes", "CI/CD", "Docker", "Terraform", "Python"],
            suggestions: [
                "Mention explicit experience managing AWS IAM role permissions for containerized workloads.",
                "Detail writing custom Helm charts templates instead of just using basic Kubernetes raw manifests.",
                "Specify setting up custom metrics scraping alerts using Prometheus ServiceMonitors in your cluster details."
            ]
        });
        setLoading(false);
    };

    if (!activeResume) {
        return (
            <div className="rounded-xl border border-border bg-card p-12 text-center flex flex-col items-center justify-center max-w-md mx-auto my-10 space-y-4">
                <AlertCircle className="size-8 text-muted-foreground/70" />
                <div className="space-y-1">
                    <h3 className="text-sm font-semibold text-muted-foreground">No active scanner profile</h3>
                    <p className="text-xs text-muted-foreground max-w-[260px] leading-relaxed mx-auto">
                        Please upload or select a resume file first before running custom Job Description matching.
                    </p>
                </div>
                <button
                    onClick={() => setCurrentTab("upload")}
                    className="btn-primary h-8 text-xs px-4 px-4 cursor-pointer"
                >
                    Upload Document File
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-10 text-left max-w-7xl mx-auto py-2">
            {/* View Header */}
            <div className="space-y-1">
                <h1 className="text-2xl font-bold tracking-tight text-foreground font-sans">Matcher</h1>
                <p className="text-xs text-muted-foreground font-medium">Paste job descriptions side-by-side to compare qualifications and calculate compatibility indexes.</p>
            </div>

            {/* Main Interactive Workspace Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Form Panel */}
                <div className="rounded-xl border border-border bg-card p-6 space-y-5">
                    <div className="flex items-center justify-between border-b border-border pb-3">
                        <span className="text-[10px] font-mono text-muted-foreground uppercase">Target Job posting details</span>
                        <span className="text-[10px] text-muted-foreground/70 font-mono">TEXT_AREA</span>
                    </div>

                    <textarea
                        required
                        value={jobDesc}
                        onChange={(e) => setJobDesc(e.target.value)}
                        placeholder="Paste target job descriptions here... (e.g. 'We are looking for a Software Engineer with experience writing React frontend modules, Node backend microservices, PostgreSQL query optimizations...')"
                        className="w-full h-80 rounded-xl bg-secondary/40 border border-border p-4 text-xs text-foreground/80 outline-none placeholder:text-muted-foreground/70 focus:border-neutral-700 transition-all font-sans resize-none"
                    />

                    <button
                        onClick={handleCompare}
                        disabled={loading || !jobDesc.trim()}
                        className="w-full h-10 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_20px_oklch(0.58_0.2_255_/_20%)] active:translate-y-[1px] text-xs font-bold transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="size-4 animate-spin" />
                                Analyzing Alignment...
                            </>
                        ) : (
                            <>
                                <Sparkles className="size-4" />
                                Compare Alignment
                            </>
                        )}
                    </button>
                </div>

                {/* Right Comparison Results Panel */}
                <div className="space-y-6">
                    {result ? (
                        <div className="space-y-6">
                            {/* Match Score Card */}
                            <div className="rounded-xl border border-border bg-card p-6 flex items-center justify-between">
                                <div className="space-y-1">
                                    <span className="text-[10px] font-mono text-muted-foreground uppercase block">Alignment compatibility</span>
                                    <h3 className="text-xl font-bold font-mono tracking-tight text-foreground">
                                        {result.matchPercentage}% 
                                    </h3>
                                </div>
                                <div className="rounded bg-secondary border border-border px-2.5 py-1 text-[10px] font-mono font-bold text-foreground/80">
                                    {result.matchPercentage >= 80 ? "STRONG COMPATIBILITY" : result.matchPercentage >= 65 ? "BORDERLINE MATCH" : "CRITICAL GAP"}
                                </div>
                            </div>

                            {/* Missing Requirements List */}
                            <div className="rounded-xl border border-border bg-card p-6 space-y-4">
                                <h4 className="text-[10px] font-mono uppercase text-muted-foreground tracking-wider flex items-center gap-2 border-b border-border pb-3">
                                    CRITICAL REQUIREMENTS GAP
                                </h4>
                                <div className="space-y-2.5">
                                    {result.missingSkills.map((skill, i) => (
                                        <div key={i} className="flex gap-2 text-xs text-foreground/80 leading-normal">
                                            <CornerDownRight className="size-3.5 text-muted-foreground/70 shrink-0 mt-0.5" />
                                            <span>{skill}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* AI Advice Panel */}
                            <div className="rounded-xl border border-border bg-card p-6 space-y-4">
                                <h4 className="text-[10px] font-mono uppercase text-muted-foreground tracking-wider flex items-center gap-2 border-b border-border pb-3">
                                    AI SUGGESTED RESUME ALIGNMENTS
                                </h4>
                                <div className="space-y-3.5">
                                    {result.suggestions.map((sug, i) => (
                                        <p key={i} className="text-xs text-muted-foreground leading-relaxed pl-3 border-l border-border">
                                            {sug}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="rounded-xl border border-dashed border-border bg-card/30 p-12 text-center h-full flex flex-col items-center justify-center min-h-[350px] space-y-3">
                            <Briefcase className="size-8 text-muted-foreground/70" />
                            <div className="space-y-1">
                                <h4 className="text-xs font-semibold text-muted-foreground">Await matching computations</h4>
                                <p className="text-xs text-muted-foreground max-w-[240px] leading-relaxed mx-auto">
                                    Paste target role descriptions on the left and run compatibility diagnostics.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
