"use client";

import React, { useState } from "react";
import { useResumeStore } from "@/hooks/useResumeStore";
import { 
    ChevronDown, 
    Loader2,
    CheckCircle2,
    Info,
    Sparkles
} from "lucide-react";

export default function InterviewView() {
    const { activeResume, setActiveResume, setCurrentTab } = useResumeStore();
    const [activeCategory, setActiveCategory] = useState<"all" | "technical" | "hr" | "project">("all");
    const [openQuestionId, setOpenQuestionId] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    if (!activeResume) {
        return (
            <div className="rounded-xl border border-border bg-card p-12 text-center flex flex-col items-center justify-center max-w-md mx-auto my-10 space-y-4">
                <Info className="size-8 text-muted-foreground/70" />
                <div className="space-y-1">
                    <h3 className="text-sm font-semibold text-muted-foreground">No active scanner profile</h3>
                    <p className="text-xs text-muted-foreground max-w-[260px] leading-relaxed mx-auto">
                        Please upload or select a resume file first before accessing interview prep parameters.
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

    const handleToggleQuestion = (id: string) => {
        setOpenQuestionId(prev => (prev === id ? null : id));
    };

    const handleGenerate = async () => {
        setIsGenerating(true);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/interviews/generate`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    category: activeCategory === "all" ? "technical" : activeCategory,
                    resumeId: activeResume.id
                })
            });

            if (!res.ok) {
                throw new Error("Failed to generate questions");
            }

            const data = await res.json();
            
            // Push questions
            const newQuestions = data.questions || [];

            setActiveResume({
                ...activeResume,
                interviewQuestions: [...newQuestions, ...activeResume.interviewQuestions]
            });
            if (newQuestions.length > 0) {
                setOpenQuestionId(newQuestions[0].id);
            }
        } catch (error) {
            console.error("Error generating questions:", error);
            // Optionally add a toast notification here
        } finally {
            setIsGenerating(false);
        }
    };

    // Filter lists
    const filteredQuestions = activeResume.interviewQuestions.filter(q => {
        if (activeCategory === "all") return true;
        return q.category === activeCategory;
    });

    return (
        <div className="space-y-8 text-left max-w-7xl mx-auto py-2">
            {/* View Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-5">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold tracking-tight text-foreground font-sans">Interview Prep</h1>
                    <p className="text-xs text-muted-foreground font-medium">Practice AI-generated questions compiled directly from your work history.</p>
                </div>
                <button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="self-start sm:self-center h-9 gap-1.5 btn-primary text-xs px-4 transition-all flex items-center disabled:opacity-50 disabled:pointer-events-none cursor-pointer active:translate-y-[1px]"
                >
                    {isGenerating ? (
                        <>
                            <Loader2 className="size-3.5 animate-spin" />
                            Compiling...
                        </>
                    ) : (
                        <>
                            <Sparkles className="size-3.5" />
                            Generate Questions
                        </>
                    )}
                </button>
            </div>

            {/* Category tabs */}
            <div className="flex items-center gap-1 border-b border-border pb-4">
                {[
                    { label: "All Questions", value: "all" },
                    { label: "Technical Gaps", value: "technical" },
                    { label: "HR & Behavioral", value: "hr" },
                    { label: "Project Diagnostics", value: "project" }
                ].map((btn) => (
                    <button
                        key={btn.value}
                        onClick={() => setActiveCategory(btn.value as "all" | "technical" | "hr" | "project")}
                        className={`h-7 px-2.5 rounded-md text-[10px] font-semibold transition-colors cursor-pointer ${
                            activeCategory === btn.value
                                ? "bg-primary/15 border border-primary/30 text-primary"
                                : "text-muted-foreground hover:text-foreground/80"
                        }`}
                    >
                        {btn.label}
                    </button>
                ))}
            </div>

            {/* Accordion Questions List */}
            {filteredQuestions.length > 0 ? (
                <div className="space-y-4">
                    {filteredQuestions.map((q) => {
                        const isOpen = openQuestionId === q.id;

                        return (
                            <div
                                key={q.id}
                                className="rounded-xl border border-border bg-card overflow-hidden transition-all duration-200"
                            >
                                <button
                                    onClick={() => handleToggleQuestion(q.id)}
                                    className="flex w-full items-center justify-between px-6 py-5 text-left text-xs font-semibold hover:bg-secondary/10 transition-all cursor-pointer"
                                >
                                    <div className="flex items-center gap-4 pr-4">
                                        <span className="rounded bg-secondary border border-border px-2 py-0.5 text-[9px] font-mono tracking-wider font-bold shrink-0 text-muted-foreground">
                                            {q.category.toUpperCase()}
                                        </span>
                                        <span className="text-foreground leading-normal font-sans text-xs font-semibold">{q.question}</span>
                                    </div>
                                    <ChevronDown
                                        className={`size-4 text-muted-foreground shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                                    />
                                </button>
                                <div
                                    className={`transition-all duration-200 ease-in-out ${isOpen ? "max-h-[300px] border-t border-border py-5 px-6 overflow-y-auto" : "max-h-0 py-0 overflow-hidden"}`}
                                >
                                    <h5 className="text-[9px] font-semibold text-muted-foreground flex items-center gap-1.5 mb-3 font-mono uppercase">
                                        <CheckCircle2 className="size-3.5 text-muted-foreground" /> RECOMMENDED AI RESPONSE MODEL
                                    </h5>
                                    <p className="text-xs text-muted-foreground leading-relaxed font-sans pl-4 border-l border-border">
                                        {q.answer}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="rounded-xl border border-dashed border-border bg-card/30 p-12 text-center max-w-md mx-auto my-10 space-y-2">
                    <h4 className="text-xs font-semibold text-muted-foreground font-sans">No matching questions</h4>
                    <p className="text-xs text-muted-foreground max-w-[240px] leading-relaxed mx-auto">
                        There are no questions in this specific tab. Click &ldquo;Generate Questions&rdquo; to create custom targets.
                    </p>
                </div>
            )}
        </div>
    );
}
