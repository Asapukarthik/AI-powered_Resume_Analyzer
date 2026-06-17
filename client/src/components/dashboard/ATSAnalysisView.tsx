"use client";

import React from "react";
import { useResumeStore } from "@/hooks/useResumeStore";
import { 
    Info,
    TrendingUp,
    FileCode,
    Check,
    AlertCircle,
    UserCheck,
    AlertTriangle,
    Lightbulb,
    Pen,
    ArrowRight
} from "lucide-react";

export default function ATSAnalysisView() {
    const { activeResume, setCurrentTab } = useResumeStore();

    if (!activeResume) {
        return (
            <div className="rounded-xl border border-border bg-card p-12 text-center flex flex-col items-center justify-center max-w-md mx-auto my-10 space-y-4">
                <Info className="size-8 text-muted-foreground/70" />
                <div className="space-y-1">
                    <h3 className="text-sm font-semibold text-muted-foreground">No active scanner profile</h3>
                    <p className="text-xs text-muted-foreground max-w-[260px] leading-relaxed mx-auto">
                        Please upload or select a resume file first to compile deep ATS analytics.
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

    // Filter keywords
    const matchedKws = activeResume.keywords.filter(k => k.category === "matched");
    const missingKws = activeResume.keywords.filter(k => k.category === "missing");
    const overusedKws = activeResume.keywords.filter(k => k.category === "overused");

    // Recruiter & optimization data
    const recruiterView = activeResume.recruiterView;
    const resumeOpt = activeResume.resumeOptimization;

    // Determine hire recommendation styling
    const getRecommendationStyle = (rec: string) => {
        const lower = rec.toLowerCase();
        if (lower.includes("strong") || lower.includes("yes") || lower.includes("recommend")) {
            return { bg: "bg-emerald-500/10", border: "border-emerald-500/30", text: "text-emerald-400", icon: "✓" };
        }
        if (lower.includes("no") || lower.includes("reject") || lower.includes("not")) {
            return { bg: "bg-red-500/10", border: "border-red-500/30", text: "text-red-400", icon: "✗" };
        }
        return { bg: "bg-amber-500/10", border: "border-amber-500/30", text: "text-amber-400", icon: "~" };
    };

    return (
        <div className="space-y-10 text-left max-w-7xl mx-auto py-2">
            {/* View Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold tracking-tight text-foreground font-sans">Compliance</h1>
                    <p className="text-xs text-muted-foreground font-medium">Compliance scoring checks, credentials compatibility, and keyword audits.</p>
                </div>
                <div className="rounded-lg bg-card border border-border px-3 py-1 text-[10px] font-mono text-muted-foreground">
                    Scanner Active: <span className="text-foreground font-semibold">{activeResume.name}</span>
                </div>
            </div>

            {/* Score Ring and Overview Card */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* SVG Progress Ring */}
                <div className="rounded-xl border border-border bg-card p-6 flex flex-col items-center justify-center text-center space-y-4">
                    <span className="text-[10px] font-mono uppercase text-muted-foreground tracking-wider">ATS Score Index</span>
                    
                    {/* Monochrome SVG Ring */}
                    <div className="relative flex items-center justify-center">
                        <svg className="size-36 transform -rotate-90">
                            {/* Track Circle */}
                            <circle
                                cx="72"
                                cy="72"
                                r="62"
                                className="stroke-neutral-900"
                                strokeWidth="6"
                                fill="transparent"
                            />
                            {/* Value Circle */}
                            <circle
                                cx="72"
                                cy="72"
                                r="62"
                                className="stroke-white"
                                strokeWidth="6"
                                fill="transparent"
                                strokeDasharray={2 * Math.PI * 62}
                                strokeDashoffset={2 * Math.PI * 62 * (1 - activeResume.score / 100)}
                                strokeLinecap="round"
                            />
                        </svg>
                        <div className="absolute flex flex-col items-center justify-center">
                            <span className="text-4xl font-semibold tracking-tighter font-mono text-foreground">{activeResume.score}%</span>
                        </div>
                    </div>

                    <div className="rounded bg-secondary border border-border px-3 py-1 text-[10px] font-mono font-semibold text-foreground/80">
                        {activeResume.score >= 80 
                            ? "EXCELLENT ALIGNMENT" 
                            : activeResume.score >= 65 
                            ? "MODERATE COMPLIANCE" 
                            : "VULNERABLE STATE"}
                    </div>
                </div>

                {/* Compliance Summary */}
                <div className="lg:col-span-2 rounded-xl border border-border bg-card p-6 flex flex-col justify-between">
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <TrendingUp className="size-4.5 text-muted-foreground" />
                            <h3 className="text-sm font-semibold text-foreground font-sans">Semantic AI Diagnosis</h3>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed font-sans">
                            {activeResume.summary}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-6 border-t border-border text-xs">
                        <div className="rounded-lg bg-card p-4 border border-border">
                            <span className="text-[10px] font-mono text-muted-foreground uppercase block mb-1">Keywords Compliance</span>
                            <div className="flex items-baseline gap-1.5">
                                <span className="text-xl font-semibold font-mono text-foreground">{matchedKws.length}</span>
                                <span className="text-[10px] text-muted-foreground/70">matched of {activeResume.keywords.length} total</span>
                            </div>
                        </div>
                        <div className="rounded-lg bg-card p-4 border border-border">
                            <span className="text-[10px] font-mono text-muted-foreground uppercase block mb-1">Deficiency Gaps</span>
                            <div className="flex items-baseline gap-1.5">
                                <span className="text-xl font-semibold font-mono text-foreground">{missingKws.length}</span>
                                <span className="text-[10px] text-muted-foreground/70">parameters missing</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Strengths & Weaknesses vs Keyword analyzer */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Lists panel */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Strengths */}
                    <div className="rounded-xl border border-border bg-card p-6 space-y-4">
                        <h3 className="text-[10px] font-mono uppercase text-muted-foreground tracking-wider flex items-center gap-2 border-b border-border pb-3">
                            <Check className="size-4 text-muted-foreground" />
                            COMPLIANCE STRENGTHS
                        </h3>
                        <ul className="space-y-3.5 text-xs text-muted-foreground font-sans leading-relaxed">
                            {activeResume.strengths.map((str, idx) => (
                                <li key={idx} className="relative pl-5">
                                    <span className="absolute left-0 top-1.5 h-1.5 w-1.5 rounded-full bg-neutral-700" />
                                    {str}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Weaknesses */}
                    <div className="rounded-xl border border-border bg-card p-6 space-y-4">
                        <h3 className="text-[10px] font-mono uppercase text-muted-foreground tracking-wider flex items-center gap-2 border-b border-border pb-3">
                            <AlertCircle className="size-4 text-muted-foreground" />
                            VULNERABLE CREDENTIAL PARAMETERS
                        </h3>
                        <ul className="space-y-3.5 text-xs text-muted-foreground font-sans leading-relaxed">
                            {activeResume.weaknesses.map((weak, idx) => (
                                <li key={idx} className="relative pl-5">
                                    <span className="absolute left-0 top-1.5 h-1.5 w-1.5 rounded-full bg-neutral-700" />
                                    {weak}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Keyword Analyzer flat tag cloud */}
                <div className="rounded-xl border border-border bg-card p-6 space-y-6">
                    <div className="space-y-1">
                        <h3 className="text-xs font-mono uppercase text-muted-foreground tracking-wider flex items-center gap-2">
                            <FileCode className="size-4 text-muted-foreground" />
                            Keyword Audit
                        </h3>
                        <p className="text-[10px] text-muted-foreground leading-relaxed">
                            Individual keyword frequencies extracted from your document sections.
                        </p>
                    </div>

                    {/* Matched Cloud */}
                    <div className="space-y-2">
                        <span className="text-[9px] font-semibold font-mono text-muted-foreground uppercase block tracking-wider">Matched Keywords ({matchedKws.length})</span>
                        <div className="flex flex-wrap gap-1.5">
                            {matchedKws.map((kw, i) => (
                                <span key={i} className="rounded-md bg-card border border-border px-2 py-0.5 text-xs text-foreground/80 font-mono">
                                    {kw.word} <span className="text-[9px] text-muted-foreground font-mono ml-0.5">({kw.count})</span>
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Missing Cloud */}
                    <div className="space-y-2">
                        <span className="text-[9px] font-semibold font-mono text-muted-foreground uppercase block tracking-wider">Missing Parameters ({missingKws.length})</span>
                        <div className="flex flex-wrap gap-1.5">
                            {missingKws.map((kw, i) => (
                                <span key={i} className="rounded-md bg-card border border-dashed border-border px-2 py-0.5 text-xs text-muted-foreground/70 font-mono">
                                    {kw.word}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Overused Cloud */}
                    <div className="space-y-2">
                        <span className="text-[9px] font-semibold font-mono text-muted-foreground uppercase block tracking-wider">Overused Warning ({overusedKws.length})</span>
                        <div className="flex flex-wrap gap-1.5">
                            {overusedKws.map((kw, i) => (
                                <span key={i} className="rounded-md bg-card border border-border px-2 py-0.5 text-xs text-muted-foreground font-mono">
                                    {kw.word} <span className="text-[9px] text-muted-foreground/70 font-mono ml-0.5">({kw.count})</span>
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* --- RECRUITER VIEW CARD --- */}
            {recruiterView && recruiterView.hireRecommendation && (
                <div className="rounded-xl border border-border bg-card p-6 space-y-6">
                    <div className="flex items-center justify-between border-b border-border pb-4">
                        <div className="flex items-center gap-2.5">
                            <div className="inline-flex size-9 items-center justify-center rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                                <UserCheck className="size-4.5 text-indigo-400" />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-foreground font-sans">Recruiter Insight</h3>
                                <p className="text-[10px] text-muted-foreground font-mono mt-0.5">AI-simulated hiring decision based on resume analysis</p>
                            </div>
                        </div>
                        <span className="text-[9px] font-mono uppercase text-muted-foreground tracking-wider bg-secondary border border-border px-2 py-0.5 rounded">AI GENERATED</span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Hire Recommendation */}
                        <div className="space-y-3">
                            <span className="text-[10px] font-mono uppercase text-muted-foreground tracking-wider block">Hire Recommendation</span>
                            {(() => {
                                const style = getRecommendationStyle(recruiterView.hireRecommendation);
                                return (
                                    <div className={`rounded-lg ${style.bg} border ${style.border} p-4`}>
                                        <div className="flex items-start gap-3">
                                            <span className={`text-lg font-bold ${style.text} shrink-0 mt-0.5`}>{style.icon}</span>
                                            <p className={`text-xs ${style.text} font-medium leading-relaxed`}>
                                                {recruiterView.hireRecommendation}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })()}
                        </div>

                        {/* Risk Factors */}
                        {recruiterView.riskFactors && recruiterView.riskFactors.length > 0 && (
                            <div className="space-y-3">
                                <span className="text-[10px] font-mono uppercase text-muted-foreground tracking-wider flex items-center gap-1.5">
                                    <AlertTriangle className="size-3 text-amber-400/70" />
                                    Risk Factors ({recruiterView.riskFactors.length})
                                </span>
                                <ul className="space-y-2.5">
                                    {recruiterView.riskFactors.map((risk, idx) => (
                                        <li key={idx} className="flex items-start gap-2 text-xs text-muted-foreground leading-relaxed">
                                            <span className="shrink-0 mt-1.5 h-1.5 w-1.5 rounded-full bg-amber-500/50" />
                                            {risk}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* --- RESUME OPTIMIZATION CARD --- */}
            {resumeOpt && (resumeOpt.rewrittenSummary || (resumeOpt.improvedBulletPoints && resumeOpt.improvedBulletPoints.length > 0)) && (
                <div className="rounded-xl border border-border bg-card p-6 space-y-6">
                    <div className="flex items-center justify-between border-b border-border pb-4">
                        <div className="flex items-center gap-2.5">
                            <div className="inline-flex size-9 items-center justify-center rounded-lg bg-violet-500/10 border border-violet-500/20">
                                <Pen className="size-4 text-violet-400" />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-foreground font-sans">Resume Rewriter</h3>
                                <p className="text-[10px] text-muted-foreground font-mono mt-0.5">AI-optimized content suggestions to boost your ATS score</p>
                            </div>
                        </div>
                        <span className="text-[9px] font-mono uppercase text-muted-foreground tracking-wider bg-secondary border border-border px-2 py-0.5 rounded">SUGGESTIONS</span>
                    </div>

                    {/* Rewritten Summary */}
                    {resumeOpt.rewrittenSummary && (
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <Lightbulb className="size-3.5 text-amber-400/70" />
                                <span className="text-[10px] font-mono uppercase text-muted-foreground tracking-wider">Optimized Professional Summary</span>
                            </div>
                            <div className="rounded-lg bg-secondary/30 border border-border p-4">
                                <p className="text-xs text-foreground/90 leading-relaxed font-sans italic">
                                    &ldquo;{resumeOpt.rewrittenSummary}&rdquo;
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Improved Bullet Points */}
                    {resumeOpt.improvedBulletPoints && resumeOpt.improvedBulletPoints.length > 0 && (
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <ArrowRight className="size-3.5 text-violet-400/70" />
                                <span className="text-[10px] font-mono uppercase text-muted-foreground tracking-wider">Improved Bullet Points ({resumeOpt.improvedBulletPoints.length})</span>
                            </div>
                            <ul className="space-y-2.5">
                                {resumeOpt.improvedBulletPoints.map((bullet, idx) => (
                                    <li key={idx} className="flex items-start gap-3 rounded-lg bg-secondary/20 border border-border/50 p-3 text-xs text-foreground/85 leading-relaxed font-sans group hover:bg-secondary/40 transition-colors">
                                        <span className="shrink-0 mt-0.5 inline-flex items-center justify-center size-5 rounded-md bg-violet-500/10 border border-violet-500/20 text-[9px] font-bold font-mono text-violet-400">
                                            {idx + 1}
                                        </span>
                                        {bullet}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
