"use client";

import React from "react";
import { useResumeStore } from "@/hooks/useResumeStore";
import { 
    Calendar,
    ArrowUpRight,
    Info
} from "lucide-react";

export default function SkillsGapView() {
    const { activeResume, setCurrentTab } = useResumeStore();

    if (!activeResume) {
        return (
            <div className="rounded-xl border border-border bg-card p-12 text-center flex flex-col items-center justify-center max-w-md mx-auto my-10 space-y-4">
                <Info className="size-8 text-muted-foreground/70" />
                <div className="space-y-1">
                    <h3 className="text-sm font-semibold text-muted-foreground">No active scanner profile</h3>
                    <p className="text-xs text-muted-foreground max-w-[260px] leading-relaxed mx-auto">
                        Please upload or select a resume file first before accessing learning roadmaps.
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
        <div className="space-y-8 text-left max-w-7xl mx-auto py-2">
            {/* View Header */}
            <div className="space-y-1">
                <h1 className="text-2xl font-bold tracking-tight text-foreground font-sans">Roadmap</h1>
                <p className="text-xs text-muted-foreground font-medium">Recommended learning timelines and technical schedules to close core credentials gaps.</p>
            </div>

            {/* Missing Skill Chips Summary */}
            <div className="rounded-xl border border-border bg-card p-6 space-y-4">
                <span className="text-[10px] font-mono uppercase text-muted-foreground tracking-wider block">Credentials Deficiencies</span>
                <div className="flex flex-wrap gap-2.5">
                    {activeResume.recommendedSkills.map((skill, i) => (
                        <span key={i} className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-secondary px-3 py-1.5 text-xs text-foreground/80">
                            <span className="h-1.5 w-1.5 rounded-full bg-neutral-500" />
                            {skill}
                        </span>
                    ))}
                </div>
                <p className="text-[11px] text-muted-foreground leading-normal">
                    Adding these technologies to your active work description fields increases compliance indexes by up to 25%.
                </p>
            </div>

            {/* Visual Step-by-Step Roadmap Tree */}
            <div className="space-y-4">
                <h3 className="text-[10px] font-mono uppercase text-muted-foreground tracking-wider">Suggested Career Roadmap</h3>
                
                <div className="relative border-l border-dashed border-border ml-4 pl-6 space-y-6">
                    {activeResume.suggestedRoadmap.map((step, idx) => (
                        <div key={idx} className="relative group text-left">
                            {/* Dotted indicator step icon */}
                            <span className="absolute -left-[33px] top-1.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-background border border-border text-[9px] font-mono text-muted-foreground group-hover:border-neutral-500 group-hover:text-foreground transition-all">
                                {step.step}
                            </span>

                            <div className="rounded-xl border border-border bg-card p-5 space-y-3">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 border-b border-border pb-2">
                                    <h4 className="text-xs font-semibold text-foreground">{step.title}</h4>
                                    <span className="flex items-center gap-1 rounded bg-secondary border border-border px-2 py-0.5 text-[9px] font-mono text-muted-foreground">
                                        <Calendar className="size-3" /> {step.duration}
                                    </span>
                                </div>
                                <p className="text-[11px] text-muted-foreground leading-relaxed">
                                    {step.description}
                                </p>
                                <div className="flex flex-wrap gap-1.5 pt-2">
                                    {step.skills.map((s, i) => (
                                        <span key={i} className="text-[9px] font-mono px-2 py-0.5 rounded bg-secondary text-muted-foreground border border-border">
                                            {s}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* suggested learning resources */}
            <div className="space-y-4">
                <h3 className="text-[10px] font-mono uppercase text-muted-foreground tracking-wider">Curated Learning Recommendations</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                        {
                            title: "Kubernetes Operator Patterns",
                            category: "Documentation / Reference",
                            desc: "Learn to build controller reconcilers to manage custom resources inside clusters.",
                            src: "Official Kubernetes SDK Guides",
                            link: "kubernetes.io/docs"
                        },
                        {
                            title: "Terraform State & Backend Locks",
                            category: "Best Practice Course",
                            desc: "Master lock strategies, KMS bucket access policies, and modular template drift management.",
                            src: "HashiCorp Associate Academy",
                            link: "learn.hashicorp.com"
                        }
                    ].map((card, idx) => (
                        <div key={idx} className="rounded-xl border border-border bg-card p-5 flex flex-col justify-between hover:border-border transition-colors">
                            <div className="space-y-2">
                                <span className="text-[9px] font-mono text-muted-foreground uppercase">{card.category}</span>
                                <h4 className="text-xs font-semibold text-foreground flex items-center gap-1">
                                    {card.title}
                                    <ArrowUpRight className="size-3 text-muted-foreground" />
                                </h4>
                                <p className="text-[11px] text-muted-foreground leading-relaxed">{card.desc}</p>
                            </div>
                            <div className="mt-5 pt-3 border-t border-border flex justify-between items-center text-[9px] font-mono text-muted-foreground">
                                <span>Source: {card.src}</span>
                                <span className="text-primary hover:underline cursor-pointer">{card.link}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
