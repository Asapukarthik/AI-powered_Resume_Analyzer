"use client";

import React, { useState } from "react";
import { useResumeStore } from "@/hooks/useResumeStore";
import { Info, FileText, Send, Loader2, Bold, Italic, Heading2, List, Sparkles, Copy, Check, CheckSquare } from "lucide-react";

export default function CoverLetterView() {
    const { activeResume, setCurrentTab } = useResumeStore();
    const [jobDescription, setJobDescription] = useState("");
    const [coverLetter, setCoverLetter] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [isCopied, setIsCopied] = useState(false);

    if (!activeResume) {
        return (
            <div className="rounded-xl border border-border bg-card p-12 text-center flex flex-col items-center justify-center max-w-md mx-auto my-10 space-y-4">
                <Info className="size-8 text-muted-foreground/70" />
                <div className="space-y-1">
                    <h3 className="text-sm font-semibold text-muted-foreground">No active scanner profile</h3>
                    <p className="text-xs text-muted-foreground max-w-[260px] leading-relaxed mx-auto">
                        Please upload or select a resume file first to generate a cover letter.
                    </p>
                </div>
                <button
                    onClick={() => setCurrentTab("upload")}
                    className="btn-primary h-8 text-xs px-4 cursor-pointer"
                >
                    Upload Document File
                </button>
            </div>
        );
    }

    const generateCoverLetter = async () => {
        if (!jobDescription.trim()) return;

        setIsGenerating(true);
        setCoverLetter(""); // Clear previous

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/resumes/${activeResume.id}/cover-letter`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { "Authorization": `Bearer ${token}` } : {})
                },
                body: JSON.stringify({ jobDescription })
            });

            if (!response.body) throw new Error("No response body");

            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                const lines = chunk.split('\n');
                
                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const dataStr = line.substring(6);
                        if (dataStr === '[DONE]') break;
                        
                        try {
                            const data = JSON.parse(dataStr);
                            if (data.text) {
                                setCoverLetter(prev => prev + data.text);
                            }
                            if (data.error) {
                                console.error(data.error);
                            }
                        } catch (e) {
                            // Incomplete JSON or other issue, ignore
                        }
                    }
                }
            }
        } catch (error) {
            console.error("Failed to generate cover letter:", error);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleCopy = () => {
        if (!coverLetter) return;
        navigator.clipboard.writeText(coverLetter);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    return (
        <div className="space-y-6 text-left max-w-5xl mx-auto py-2 h-full flex flex-col">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground font-sans">Cover Letter Generator</h1>
                    <p className="text-xs text-muted-foreground font-medium">Instantly stream a tailored cover letter using AI.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-[550px] items-stretch">
                {/* Input Column */}
                <div className="lg:col-span-4 flex flex-col space-y-4">
                    <div className="rounded-xl border border-border bg-card p-4 flex flex-col flex-1 shadow-sm">
                        <label className="text-xs font-semibold text-foreground mb-2 flex items-center gap-2">
                            <FileText className="size-4 text-primary" /> Target Job Description
                        </label>
                        <textarea 
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                            placeholder="Paste the job description here..."
                            className="w-full flex-1 bg-background border border-border rounded-lg p-3 text-xs text-foreground focus:ring-1 focus:ring-primary outline-none resize-none min-h-[250px]"
                        />
                        <button 
                            onClick={generateCoverLetter}
                            disabled={isGenerating || !jobDescription.trim()}
                            className="mt-4 btn-primary w-full py-2.5 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-xs"
                        >
                            {isGenerating ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
                            {isGenerating ? "Generating..." : "Generate Cover Letter"}
                        </button>
                    </div>
                </div>

                {/* Output Column: Notion-style Editor */}
                <div className="lg:col-span-8 flex flex-col relative group">
                    <div className="flex-1 flex flex-col rounded-xl border border-border bg-muted/30 p-8 overflow-hidden relative shadow-inner">
                        
                        {/* Notion-style Document Page */}
                        <div className="flex-1 bg-card border border-border/80 rounded-lg p-10 font-serif text-xs leading-relaxed text-foreground/90 whitespace-pre-wrap overflow-y-auto shadow-sm max-w-2xl w-full mx-auto relative select-text">
                            
                            {/* Floating Formatting Toolbar (appears on hover) */}
                            {coverLetter && (
                                <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-1 px-2.5 py-1 rounded-full border border-border bg-card/90 backdrop-blur-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 select-none">
                                    <button className="p-1 rounded hover:bg-secondary text-muted-foreground hover:text-foreground cursor-pointer" title="Bold"><Bold className="size-3" /></button>
                                    <button className="p-1 rounded hover:bg-secondary text-muted-foreground hover:text-foreground cursor-pointer" title="Italic"><Italic className="size-3" /></button>
                                    <button className="p-1 rounded hover:bg-secondary text-muted-foreground hover:text-foreground cursor-pointer" title="Heading"><Heading2 className="size-3" /></button>
                                    <button className="p-1 rounded hover:bg-secondary text-muted-foreground hover:text-foreground cursor-pointer" title="List"><List className="size-3" /></button>
                                    <div className="w-px h-4 bg-border mx-1" />
                                    <button className="p-1 rounded hover:bg-secondary text-primary hover:text-primary-foreground flex items-center gap-0.5 text-[9px] font-semibold cursor-pointer" title="AI Polish">
                                        <Sparkles className="size-2.5" /> Polish
                                    </button>
                                </div>
                            )}

                            {/* Document Text */}
                            {coverLetter ? coverLetter : (
                                <div className="h-full flex flex-col items-center justify-center text-muted-foreground/40 text-xs text-center font-sans space-y-2 select-none">
                                    <FileText className="size-8 stroke-[1.5]" />
                                    <p>Your generated cover letter will appear here.</p>
                                    <p className="text-[10px]">Provide a job description and click generate to begin.</p>
                                </div>
                            )}
                            {isGenerating && <span className="inline-block w-1.5 h-4 ml-1 bg-primary animate-pulse align-middle" />}
                        </div>

                        {/* Copy Floating Badge (appears on hover) */}
                        {coverLetter && (
                            <button
                                onClick={handleCopy}
                                className={`absolute bottom-12 right-12 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold shadow-md transition-all duration-200 opacity-0 group-hover:opacity-100 cursor-pointer ${
                                    isCopied 
                                        ? "bg-green-500/10 border-green-500/20 text-green-500 hover:bg-green-500/20" 
                                        : "bg-card border-border text-muted-foreground hover:text-foreground hover:bg-secondary"
                                }`}
                            >
                                {isCopied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                                {isCopied ? "Copied!" : "Copy Document"}
                            </button>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
}
