"use client";

import React, { useState } from "react";
import { useResumeStore } from "@/hooks/useResumeStore";
import { 
    Search, 
    Trash2, 
    RefreshCw, 
    FileText, 
    Loader2, 
    SlidersHorizontal,
    Calendar
} from "lucide-react";

export default function ResumeHistoryView() {
    const { resumes, activeResume, setActiveResume, deleteResume, reanalyzeResume, setCurrentTab } = useResumeStore();
    const [searchQuery, setSearchQuery] = useState("");
    const [scoreFilter, setScoreFilter] = useState<"all" | "high" | "mid" | "low">("all");
    const [reanalyzingId, setReanalyzingId] = useState<string | null>(null);

    const handleSelect = (id: string) => {
        const res = resumes.find(r => r.id === id);
        if (res) {
            setActiveResume(res);
            setCurrentTab("reports");
        }
    };

    const handleReanalyze = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation(); // Avoid row selection trigger
        setReanalyzingId(id);
        try {
            await reanalyzeResume(id);
        } catch (err) {
            console.error(err);
        }
        setReanalyzingId(null);
    };

    const handleDelete = (id: string, e: React.MouseEvent) => {
        e.stopPropagation(); // Avoid row selection trigger
        if (confirm("Are you sure you want to delete this scan record?")) {
            deleteResume(id);
        }
    };

    // Filter list
    const filteredResumes = resumes.filter(res => {
        const matchesSearch = res.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            res.date.toLowerCase().includes(searchQuery.toLowerCase());
        
        if (scoreFilter === "all") return matchesSearch;
        if (scoreFilter === "high") return matchesSearch && res.score >= 80;
        if (scoreFilter === "mid") return matchesSearch && res.score >= 60 && res.score < 80;
        if (scoreFilter === "low") return matchesSearch && res.score < 60;
        
        return matchesSearch;
    });

    return (
        <div className="space-y-8 text-left max-w-7xl mx-auto py-2">
            {/* View Header */}
            <div className="space-y-1">
                <h1 className="text-2xl font-bold tracking-tight text-foreground font-sans">Inventory</h1>
                <p className="text-xs text-muted-foreground font-medium">Manage and review your complete history of scanned resume compliance diagnostics.</p>
            </div>

            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between border-b border-border pb-5">
                {/* Search input */}
                <div className="relative w-full sm:max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Filter scanned profiles..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-8 pl-9 pr-4 rounded-lg bg-card border border-border text-xs text-foreground/80 outline-none placeholder:text-muted-foreground/70 focus:border-border transition-all font-mono"
                    />
                </div>

                {/* Filter buttons */}
                <div className="flex items-center gap-1 self-end sm:self-center">
                    <SlidersHorizontal className="size-3.5 text-muted-foreground mr-2" />
                    {[
                        { label: "All Scans", value: "all" },
                        { label: "High (80+)", value: "high" },
                        { label: "Mid (60-80)", value: "mid" },
                        { label: "Low (<60)", value: "low" }
                    ].map((btn) => (
                        <button
                            key={btn.value}
                            onClick={() => setScoreFilter(btn.value as any)}
                            className={`h-7 px-2.5 rounded-md text-[10px] font-semibold transition-all cursor-pointer ${
                                scoreFilter === btn.value
                                    ? "bg-primary/15 border border-primary/30 text-primary"
                                    : "text-muted-foreground hover:text-foreground/80"
                            }`}
                        >
                            {btn.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Catalog Grid */}
            {filteredResumes.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {filteredResumes.map((res) => {
                        const isActive = activeResume?.id === res.id;
                        const isReanalyzing = reanalyzingId === res.id;

                        return (
                            <div
                                key={res.id}
                                onClick={() => handleSelect(res.id)}
                                className={`rounded-xl border p-5 flex flex-col justify-between cursor-pointer transition-all ${
                                    isActive
                                        ? "border-neutral-700 bg-card/40"
                                        : "border-border bg-card/30 hover:border-border"
                                }`}
                            >
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="inline-flex size-9 items-center justify-center rounded-xl border border-border bg-card shrink-0">
                                                <FileText className="size-4 text-muted-foreground" />
                                            </div>
                                            <div className="min-w-0">
                                                <h4 className="text-xs font-semibold text-foreground truncate font-mono">
                                                    {res.name}
                                                </h4>
                                                <div className="flex items-center gap-2 mt-0.5 text-[9px] text-muted-foreground font-mono">
                                                    <span className="flex items-center gap-1"><Calendar className="size-3" /> {res.date}</span>
                                                    <span>{res.size}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="h-8 px-2.5 rounded border border-border bg-secondary flex items-center justify-center text-xs font-mono font-bold text-foreground">
                                            {res.score}%
                                        </div>
                                    </div>

                                    {/* Flat monochrome tag list */}
                                    <div className="flex flex-wrap gap-1.5 pt-3 border-t border-border">
                                        {res.keywords.slice(0, 4).map((kw, i) => (
                                            <span
                                                key={i}
                                                className="text-[9px] font-mono px-2 py-0.5 rounded bg-secondary text-muted-foreground border border-border"
                                            >
                                                {kw.word}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="mt-6 flex items-center justify-between pt-3 border-t border-border/60 text-xs">
                                    <div className="flex items-center gap-1.5 text-[9px] text-muted-foreground font-mono">
                                        {isActive ? (
                                            <span className="flex items-center gap-1 text-foreground/80 font-semibold">
                                                <span className="h-1.5 w-1.5 rounded-full bg-neutral-300 animate-pulse" />
                                                Active Session Profile
                                            </span>
                                        ) : (
                                            <span className="group-hover:text-foreground/80 transition-colors">Select profile</span>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={(e) => handleReanalyze(res.id, e)}
                                            disabled={isReanalyzing}
                                            className="h-7 w-7 rounded bg-secondary border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-neutral-700 transition-colors disabled:opacity-40 cursor-pointer"
                                            title="Run diagnostics recalculation"
                                        >
                                            {isReanalyzing ? (
                                                <Loader2 className="size-3.5 animate-spin" />
                                            ) : (
                                                <RefreshCw className="size-3.5" />
                                            )}
                                        </button>
                                        <button
                                            onClick={(e) => handleDelete(res.id, e)}
                                            className="h-7 w-7 rounded bg-secondary border border-border flex items-center justify-center text-muted-foreground hover:text-foreground/80 hover:border-border transition-colors cursor-pointer"
                                            title="Delete record"
                                        >
                                            <Trash2 className="size-3.5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="rounded-xl border border-dashed border-border p-12 text-center flex flex-col items-center justify-center max-w-lg mx-auto my-10 bg-card/30">
                    <FileText className="size-8 text-muted-foreground/70 mb-3" />
                    <h3 className="text-sm font-semibold text-muted-foreground">No scanned profiles matched</h3>
                    <p className="text-xs text-muted-foreground mt-1 max-w-[260px] leading-relaxed">
                        Refine filter criteria parameters or search query terms.
                    </p>
                </div>
            )}
        </div>
    );
}
