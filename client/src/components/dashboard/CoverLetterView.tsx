"use client";

import React, { useState } from "react";
import { useResumeStore } from "@/hooks/useResumeStore";
import { Info, FileText, Send, Loader2 } from "lucide-react";

export default function CoverLetterView() {
    const { activeResume, setCurrentTab } = useResumeStore();
    const [jobDescription, setJobDescription] = useState("");
    const [coverLetter, setCoverLetter] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);

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

    return (
        <div className="space-y-6 text-left max-w-5xl mx-auto py-2 h-full flex flex-col">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground font-sans">Cover Letter Generator</h1>
                    <p className="text-xs text-muted-foreground font-medium">Instantly stream a tailored cover letter using AI.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-[500px]">
                {/* Input Column */}
                <div className="flex flex-col space-y-4">
                    <div className="rounded-xl border border-border bg-card p-4 flex flex-col flex-1">
                        <label className="text-xs font-semibold text-foreground mb-2 flex items-center gap-2">
                            <FileText className="size-4 text-primary" /> Target Job Description
                        </label>
                        <textarea 
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                            placeholder="Paste the job description here..."
                            className="w-full flex-1 bg-background border border-border rounded-lg p-3 text-sm text-foreground focus:ring-1 focus:ring-primary outline-none resize-none min-h-[200px]"
                        />
                        <button 
                            onClick={generateCoverLetter}
                            disabled={isGenerating || !jobDescription.trim()}
                            className="mt-4 btn-primary w-full py-2.5 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isGenerating ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
                            {isGenerating ? "Generating..." : "Generate Cover Letter"}
                        </button>
                    </div>
                </div>

                {/* Output Column */}
                <div className="rounded-xl border border-border bg-card p-6 flex flex-col overflow-hidden relative">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4 border-b border-border pb-2">Generated Output</h3>
                    
                    <div className="flex-1 overflow-y-auto pr-2 font-serif text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">
                        {coverLetter ? coverLetter : (
                            <div className="h-full flex items-center justify-center text-muted-foreground/50 text-xs text-center">
                                Your generated cover letter will appear here.<br/>You can copy it directly once finished.
                            </div>
                        )}
                        {isGenerating && <span className="inline-block w-1.5 h-4 ml-1 bg-primary animate-pulse align-middle" />}
                    </div>
                </div>
            </div>
        </div>
    );
}
