"use client";

import React from "react";
import { useResumeStore } from "@/hooks/useResumeStore";
import {
    FileText,
    ChevronRight,
    Plus,
    ArrowUpRight,
    ArrowDownRight,
    Minus,
    Calendar,
    Award,
    BrainCircuit,
    Tag,
    AlertTriangle,
    Sparkles
} from "lucide-react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from "recharts";
import ExportReportButton from "./ExportReportButton";
import AnimatedCounter from "../ui/AnimatedCounter";
import confetti from "canvas-confetti";

export default function OverviewView() {
    const { resumes, activeResume, setCurrentTab, setActiveResume } = useResumeStore();
    const [firedConfettiFor, setFiredConfettiFor] = React.useState<string | null>(null);

    React.useEffect(() => {
        if (activeResume && activeResume.score >= 80 && firedConfettiFor !== activeResume.id) {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
            setFiredConfettiFor(activeResume.id);
        }
    }, [activeResume, firedConfettiFor]);

    const handleSelectResume = (id: string) => {
        const selected = resumes.find(r => r.id === id);
        if (selected) {
            setActiveResume(selected);
            setCurrentTab("reports");
        }
    };

    const score = activeResume?.score || 0;
    const skillsMatch = activeResume?.skillsMatch || 0;
    const matchedCount = activeResume ? activeResume.matchedKeywords : 0;
    const missingCount = activeResume ? activeResume.missingKeywords : 0;

    return (
        <div className="space-y-10 text-left max-w-7xl mx-auto py-2">
            {/* Upper dynamic greeting */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold tracking-tight text-foreground font-sans">Dashboard</h1>
                    <p className="text-xs text-muted-foreground font-medium">Real-time resume parsed metadata metrics and compliance trends.</p>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    {activeResume && (
                        <ExportReportButton resume={activeResume} filename={`${activeResume.name.replace(/\s+/g, '_')}_ATS_Report.pdf`} />
                    )}
                    <button
                        onClick={() => setCurrentTab("upload")}
                        className="self-start sm:self-center h-10 px-5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold transition-all shadow-lg hover:shadow-indigo-500/25 flex items-center gap-2 hover:-translate-y-0.5"
                    >
                        <Plus className="size-4" />
                        New Scan
                    </button>
                </div>
            </div>

            <div id="report-container" className="space-y-10">
                {/* Quick Metrics Grid */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Metric 1: ATS Compliance */}
                    <div className={`rounded-xl glass-card glass-card-hover p-6 space-y-4 relative overflow-hidden transition-all ${
                        score >= 80 ? "border-emerald-500/20 bg-gradient-to-b from-card to-emerald-500/5" : ""
                    }`}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className={`p-2 rounded-lg ${score >= 80 ? "bg-emerald-500/10 text-emerald-500" : "bg-blue-500/10 text-blue-500"}`}>
                                    <Award className="size-4" />
                                </div>
                                <span className="text-xs font-semibold text-foreground/80">ATS Score</span>
                            </div>
                            <span className={`flex items-center gap-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                score >= 80 ? "bg-emerald-500/10 text-emerald-500" : "bg-blue-500/10 text-blue-500"
                            }`}>
                                <ArrowUpRight className="size-3" /> +4%
                            </span>
                        </div>
                        
                        <div className="flex items-center gap-4">
                            <div className="relative size-16 shrink-0">
                                <svg className="size-full -rotate-90">
                                    <circle cx="32" cy="32" r="28" stroke="var(--border)" strokeWidth="5.5" fill="none" />
                                    <circle
                                        cx="32" cy="32" r="28" 
                                        stroke={score >= 80 ? "var(--color-chart-2)" : "var(--primary)"} 
                                        strokeWidth="5.5" fill="none"
                                        strokeDasharray={2 * Math.PI * 28}
                                        strokeDashoffset={2 * Math.PI * 28 - (score / 100) * (2 * Math.PI * 28)}
                                        className="transition-all duration-1000 ease-out"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center font-bold font-mono text-xs text-foreground">
                                    {activeResume ? <AnimatedCounter value={score} suffix="%" duration={1.2} /> : "—"}
                                </div>
                            </div>
                            <div className="space-y-0.5">
                                <p className="text-[11px] font-medium text-foreground/90">
                                    {score >= 80 ? "Excellent Profile" : score >= 60 ? "Average Rating" : activeResume ? "Action Required" : "No Profile"}
                                </p>
                                <p className="text-[10px] text-muted-foreground leading-normal">
                                    {score >= 80 ? "Ready for submission." : score >= 60 ? "Improve details." : activeResume ? "Critically low." : "Run a file scan."}
                                </p>
                            </div>
                        </div>

                        {/* Gold Premium Badge overlay */}
                        {score >= 80 && (
                            <div className="absolute top-2 right-2 flex items-center gap-1 bg-amber-500/15 border border-amber-500/20 text-amber-500 text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.2)] animate-pulse">
                                <Sparkles className="size-2.5 fill-amber-500" /> Premium
                            </div>
                        )}
                    </div>

                    {/* Metric 2: Skills Match */}
                    <div className="rounded-xl glass-card glass-card-hover p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-500">
                                    <BrainCircuit className="size-4" />
                                </div>
                                <span className="text-xs font-semibold text-foreground/80">Skills Match</span>
                            </div>
                            <span className="flex items-center gap-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">
                                <Minus className="size-3" /> Stable
                            </span>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between items-baseline">
                                <span className="text-3xl font-extrabold tracking-tight font-mono text-foreground">
                                    {activeResume ? <AnimatedCounter value={skillsMatch} suffix="%" duration={1.2} /> : "—"}
                                </span>
                                <span className="text-[10px] font-mono text-muted-foreground">Target Role Compatibility</span>
                            </div>
                            <div className="w-full bg-secondary h-1.5 rounded-full overflow-hidden">
                                <div className="bg-indigo-500 h-full rounded-full transition-all duration-1000" style={{ width: `${skillsMatch}%` }} />
                            </div>
                        </div>
                        <p className="text-[10px] text-muted-foreground leading-normal">
                            {skillsMatch >= 75 ? "Excellent matching keywords." : activeResume ? "Some key skills missing." : "Awaiting analysis."}
                        </p>
                    </div>

                    {/* Metric 3: Matched Keywords */}
                    <div className="rounded-xl glass-card glass-card-hover p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
                                    <Tag className="size-4" />
                                </div>
                                <span className="text-xs font-semibold text-foreground/80">Matched Keywords</span>
                            </div>
                            <span className="flex items-center gap-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500">
                                <ArrowUpRight className="size-3" /> +2
                            </span>
                        </div>
                        <div className="space-y-1">
                            <div className="text-3xl font-extrabold tracking-tight font-mono text-foreground">
                                {activeResume ? matchedCount : "—"}
                            </div>
                            <p className="text-[11px] font-medium text-foreground/90">Parameters Identified</p>
                            <p className="text-[10px] text-muted-foreground leading-normal">Strong overlap with technical tags.</p>
                        </div>
                    </div>

                    {/* Metric 4: Missing Gaps */}
                    <div className="rounded-xl glass-card glass-card-hover p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
                                    <AlertTriangle className="size-4" />
                                </div>
                                <span className="text-xs font-semibold text-foreground/80">Missing Gaps</span>
                            </div>
                            <span className="flex items-center gap-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500">
                                <ArrowDownRight className="size-3" /> -3
                            </span>
                        </div>
                        <div className="space-y-1">
                            <div className="text-3xl font-extrabold tracking-tight font-mono text-foreground">
                                {activeResume ? missingCount : "—"}
                            </div>
                            <p className="text-[11px] font-medium text-foreground/90">Critical Gaps Detected</p>
                            <p className="text-[10px] text-muted-foreground leading-normal">Add missing skills to improve rating.</p>
                        </div>
                    </div>
                </div>

                {/* Split Content Panels */}
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">

                    {/* Left primary detailed panels */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Active Resume summary & quick details */}
                        {activeResume ? (
                            <div className="rounded-xl glass-card glass-card-hover p-8 space-y-6">
                                {/* Card sub header */}
                                <div className="flex items-center justify-between border-b border-border pb-4">
                                    <div className="flex items-center gap-4">
                                        <div className="inline-flex size-10 items-center justify-center rounded-xl glass-card bg-secondary/30">
                                            <FileText className="size-4.5 text-muted-foreground" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-semibold text-foreground font-sans">{activeResume.name}</h3>
                                            <div className="flex items-center gap-2 mt-0.5 text-[10px] text-muted-foreground font-mono">
                                                <span className="flex items-center gap-1"><Calendar className="size-3" /> {activeResume.date}</span>
                                                <span>•</span>
                                                <span>{activeResume.size}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setCurrentTab("reports")}
                                        className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-0.5 group font-semibold cursor-pointer"
                                    >
                                        View Report
                                        <ChevronRight className="size-4 group-hover:translate-x-0.5 transition-transform" />
                                    </button>
                                </div>

                                {/* Summary blocks with spacious layout */}
                                <div className="space-y-2">
                                    <span className="text-[10px] font-mono uppercase text-muted-foreground tracking-wider block">Executive Summary</span>
                                    <p className="text-xs text-muted-foreground leading-relaxed font-sans">
                                        {activeResume.summary}
                                    </p>
                                </div>

                                {/* Separation between strengths and improvement areas */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-border">
                                    <div className="space-y-3">
                                        <h4 className="text-[10px] font-semibold text-foreground/80 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                                            <span className="h-1.5 w-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                                            Compliance Strengths
                                        </h4>
                                        <ul className="space-y-2 text-xs text-muted-foreground font-sans leading-relaxed">
                                            {activeResume.strengths.slice(0, 2).map((str, idx) => (
                                                <li key={idx} className="relative pl-4">
                                                    <span className="absolute left-0 top-2 h-1 w-1 rounded-full bg-neutral-700" />
                                                    {str}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="space-y-3">
                                        <h4 className="text-[10px] font-semibold text-foreground/80 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                                            <span className="h-1.5 w-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                                            Identified Vulnerabilities
                                        </h4>
                                        <ul className="space-y-2 text-xs text-muted-foreground font-sans leading-relaxed">
                                            {activeResume.weaknesses.slice(0, 2).map((weak, idx) => (
                                                <li key={idx} className="relative pl-4">
                                                    <span className="absolute left-0 top-2 h-1 w-1 rounded-full bg-neutral-700" />
                                                    {weak}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="rounded-xl glass-card border border-dashed p-12 text-center flex flex-col items-center justify-center">
                                <FileText className="size-8 text-muted-foreground/70 mb-3" />
                                <h3 className="text-sm font-semibold text-muted-foreground">No scanned profiles found</h3>
                                <p className="text-xs text-muted-foreground mt-1 max-w-[260px] leading-relaxed mx-auto">
                                    Scan your first resume document to render deep ATS diagnostic charts.
                                </p>
                                <button
                                    onClick={() => setCurrentTab("upload")}
                                    className="mt-4 h-9 rounded-xl bg-secondary border border-border text-xs font-semibold hover:bg-neutral-850 px-4 text-foreground/80 cursor-pointer transition-all hover:scale-105"
                                >
                                    Parse First File
                                </button>
                            </div>
                        )}

                        {/* Multidimensional Radar Chart */}
                        {activeResume && activeResume.skillCategories && activeResume.skillCategories.length > 0 && (
                            <div className="rounded-xl glass-card glass-card-hover p-8 space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-mono uppercase text-muted-foreground tracking-wider">Alignment Radar</span>
                                    <span className="text-[10px] text-primary font-mono font-bold uppercase">Multidimensional</span>
                                </div>
                                <div className="h-[280px] w-full pt-4">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={activeResume.skillCategories}>
                                            <PolarGrid stroke="var(--border)" strokeOpacity={0.6} />
                                            <PolarAngleAxis
                                                dataKey="category"
                                                tick={{ fill: "var(--foreground)", fontSize: 11, fontFamily: "sans-serif", fontWeight: 600 }}
                                            />
                                            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                            <Radar
                                                name="Candidate Score"
                                                dataKey="score"
                                                stroke="var(--primary)"
                                                strokeWidth={2}
                                                fill="var(--primary)"
                                                fillOpacity={0.35}
                                                animationBegin={200}
                                                animationDuration={1500}
                                                animationEasing="ease-out"
                                            />
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: "var(--card)",
                                                    borderColor: "var(--border)",
                                                    borderRadius: "12px",
                                                    boxShadow: "0 10px 30px -5px rgba(0,0,0,0.2)",
                                                    fontSize: "12px",
                                                    fontWeight: 600,
                                                    color: "var(--foreground)"
                                                }}
                                                itemStyle={{ color: "var(--primary)" }}
                                            />
                                        </RadarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right side inventory panels */}
                    <div className="space-y-8">
                        {/* Catalog list */}
                        <div className="rounded-xl glass-card glass-card-hover p-8 space-y-4">
                            <div className="flex items-center justify-between border-b border-border pb-3">
                                <h4 className="text-[10px] font-mono uppercase text-muted-foreground tracking-wider">Scanned Inventory</h4>
                                <button
                                    onClick={() => setCurrentTab("history")}
                                    className="text-[10px] text-muted-foreground hover:text-foreground font-semibold cursor-pointer transition-colors"
                                >
                                    View All ({resumes.length})
                                </button>
                            </div>

                            {resumes.length > 0 ? (
                                <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1">
                                    {resumes.map((res) => (
                                        <div
                                            key={res.id}
                                            onClick={() => handleSelectResume(res.id)}
                                            className={`group rounded-xl border p-3.5 flex items-center justify-between cursor-pointer transition-all ${activeResume?.id === res.id
                                                ? "border-primary/50 bg-secondary/30 shadow-sm"
                                                : "border-border bg-card/50 hover:border-primary/30 hover:bg-secondary/20 hover:-translate-y-0.5 hover:shadow-md"
                                                }`}
                                        >
                                            <div className="min-w-0 pr-2 space-y-0.5">
                                                <h5 className="text-xs font-semibold text-foreground/90 truncate group-hover:text-foreground font-mono transition-colors">
                                                    {res.name}
                                                </h5>
                                                <span className="text-[9px] text-muted-foreground font-mono block">
                                                    {res.date}
                                                </span>
                                            </div>
                                            <div className={`h-7 px-2.5 shrink-0 rounded-lg flex items-center justify-center text-[10px] font-bold font-mono border transition-colors ${res.score >= 80 ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-card text-muted-foreground border-border group-hover:border-primary/30 group-hover:text-foreground/80"
                                                }`}>
                                                {res.score}%
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-8 text-center text-xs text-muted-foreground/70 font-mono">
                                    Inventory empty.
                                </div>
                            )}
                        </div>

                        {/* Role matcher promotion */}
                        <div className="rounded-xl glass-card glass-card-hover p-8 space-y-5 bg-gradient-to-br from-card to-card/50">
                            <div className="space-y-1.5">
                                <span className="text-[10px] font-mono uppercase text-muted-foreground tracking-wider block">Job Matcher</span>
                                <h4 className="text-sm font-semibold text-foreground font-sans">Role Alignment Engine</h4>
                                <p className="text-[11px] text-muted-foreground leading-relaxed font-sans">
                                    Paste job descriptions side-by-side to identify semantic discrepancies and required keyword gaps immediately.
                                </p>
                            </div>
                            <button
                                onClick={() => setCurrentTab("matcher")}
                                className="w-full h-9 rounded-lg bg-secondary/80 border border-border hover:bg-primary hover:border-primary hover:text-primary-foreground transition-all text-xs font-semibold text-foreground/80 flex items-center justify-center gap-1 cursor-pointer hover:-translate-y-0.5 hover:shadow-lg shadow-sm"
                            >
                                Open Matcher
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
