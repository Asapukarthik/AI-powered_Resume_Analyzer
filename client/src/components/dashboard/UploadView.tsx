"use client";

import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useResumeStore } from "@/hooks/useResumeStore";
import { 
    Upload, 
    FileText, 
    CheckCircle2, 
    AlertCircle, 
    Loader2, 
    ArrowRight
} from "lucide-react";

export default function UploadView() {
    const { uploadResume, isUploading, uploadProgress, setCurrentTab } = useResumeStore();
    const [uploadedFile, setUploadedFile] = useState<{ name: string; size: string } | null>(null);
    const [error, setError] = useState<string>("");
    const [success, setSuccess] = useState<boolean>(false);

    const [jobDescription, setJobDescription] = useState<string>("");

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        setError("");
        setSuccess(false);
        
        if (acceptedFiles.length === 0) return;
        
        const file = acceptedFiles[0];
        
        // Size validation (5MB)
        if (file.size > 5 * 1024 * 1024) {
            setError("File size exceeds the 5MB threshold.");
            return;
        }

        // Extension check
        const validTypes = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/msword"];
        if (!validTypes.includes(file.type) && !file.name.endsWith(".pdf") && !file.name.endsWith(".docx") && !file.name.endsWith(".doc")) {
            setError("Invalid document format. Please upload a PDF (.pdf) or Word document (.docx).");
            return;
        }

        const sizeFormatted = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
        setUploadedFile({ name: file.name, size: sizeFormatted });

        try {
            await uploadResume(file, jobDescription);
            setSuccess(true);
        } catch (e: any) {
            setError(e.message || "Pipeline error while parsing. Please check encoding parameters.");
        }
    }, [uploadResume, jobDescription]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        maxFiles: 1,
        accept: {
            "application/pdf": [".pdf"],
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
            "application/msword": [".doc"]
        }
    });

    const handleViewReports = () => {
        setCurrentTab("reports");
    };

    return (
        <div className="space-y-8 text-left max-w-3xl mx-auto py-2">
            {/* Header description */}
            <div className="space-y-1">
                <h1 className="text-2xl font-bold tracking-tight text-foreground font-sans">Upload</h1>
                <p className="text-xs text-muted-foreground font-medium">Upload resume documents to compile ATS scores and parse experience blocks.</p>
            </div>

            {/* Upload Area */}
            {!isUploading && !success && (
                <div className="space-y-4">
                    {/* Job Description Input */}
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-foreground">Target Job Description (Optional)</label>
                        <textarea 
                            className="w-full min-h-[100px] p-3 rounded-lg border border-border bg-card text-xs text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary/50 transition-colors"
                            placeholder="Paste the target job description here to tailor the AI analysis. If left blank, a default mock description will be used."
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                        />
                    </div>

                    <div
                        {...getRootProps()}
                        className={`rounded-xl border border-dashed p-12 text-center cursor-pointer transition-all ${
                            isDragActive
                                ? "border-neutral-500 bg-card/80"
                                : "border-border bg-card/30 hover:border-neutral-700"
                        }`}
                    >
                        <input {...getInputProps()} />
                        <div className="flex flex-col items-center justify-center space-y-4">
                            <div className="inline-flex size-10 items-center justify-center rounded-xl border border-border bg-card">
                                <Upload className="size-4.5 text-muted-foreground" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-xs font-semibold text-foreground">
                                    {isDragActive ? "Drop document here" : "Drag and drop resume file"}
                                </h3>
                                <p className="text-[10px] text-muted-foreground max-w-[280px] leading-relaxed mx-auto">
                                    PDF or DOCX formats supported. Up to 5MB file capacity limits.
                                </p>
                            </div>
                            <div className="h-8 rounded-lg bg-secondary border border-border px-4 text-[10px] font-bold text-foreground/80 hover:bg-accent transition-colors flex items-center justify-center">
                                Browse Files
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="rounded-xl border border-border bg-card p-4 flex gap-3 text-xs text-muted-foreground">
                    <AlertCircle className="size-4.5 shrink-0 text-muted-foreground mt-0.5" />
                    <div className="space-y-1">
                        <span className="font-semibold text-foreground">Upload Validation Gaps</span>
                        <p className="text-muted-foreground leading-normal">{error}</p>
                    </div>
                </div>
            )}

            {/* Uploading progress card */}
            {isUploading && uploadedFile && (
                <div className="rounded-xl border border-border bg-card p-6 space-y-6">
                    <div className="flex items-center gap-4 border-b border-border pb-4">
                        <div className="h-9 w-9 rounded-lg bg-secondary border border-border flex items-center justify-center">
                            <FileText className="size-4 text-muted-foreground" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <h4 className="text-xs font-semibold text-foreground truncate font-mono">{uploadedFile.name}</h4>
                            <span className="text-[9px] text-muted-foreground font-mono block mt-0.5">{uploadedFile.size}</span>
                        </div>
                        <Loader2 className="size-4 text-muted-foreground animate-spin" />
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between text-[9px] text-muted-foreground font-mono">
                            <span>PARSING STRUCTURAL MATRIX</span>
                            <span>{uploadProgress}%</span>
                        </div>
                        <div className="w-full bg-secondary h-1 rounded-full overflow-hidden">
                            <div
                                className="bg-primary h-full transition-all duration-150"
                                style={{ width: `${uploadProgress}%` }}
                            />
                        </div>
                    </div>

                    <p className="text-[10px] text-muted-foreground leading-relaxed">
                        Extracting qualifications metadata, identifying work history parameters, and matching keywords compliance tags...
                    </p>
                </div>
            )}

            {/* Upload Completed Successfully */}
            {success && uploadedFile && (
                <div className="rounded-xl border border-border bg-card p-6 space-y-6">
                    <div className="flex flex-col items-center space-y-2">
                        <div className="inline-flex size-10 items-center justify-center rounded-full bg-secondary border border-border text-foreground">
                            <CheckCircle2 className="size-5" />
                        </div>
                        <h3 className="text-xs font-semibold text-foreground">Document Analysis Completed</h3>
                        <p className="text-[10px] text-muted-foreground">Resume parsed successfully. Score indicators recalculated.</p>
                    </div>

                    <div className="rounded-lg border border-border bg-card p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <FileText className="size-4.5 text-muted-foreground" />
                            <div>
                                <h4 className="text-xs font-semibold text-foreground/80 font-mono">{uploadedFile.name}</h4>
                                <span className="text-[9px] text-muted-foreground font-mono mt-0.5 block">{uploadedFile.size}</span>
                            </div>
                        </div>
                        <div className="rounded bg-secondary border border-border px-2 py-0.5 text-[9px] text-muted-foreground font-mono font-semibold">
                            PARSED_OK
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                        <button
                            onClick={handleViewReports}
                            className="flex-1 group flex items-center justify-center gap-1.5 h-10 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_20px_oklch(0.58_0.2_255_/_20%)] transition-all font-semibold text-xs cursor-pointer active:translate-y-[1px]"
                        >
                            Open Compliance Report
                            <ArrowRight className="size-4" />
                        </button>
                        <button
                            onClick={() => {
                                setSuccess(false);
                                setUploadedFile(null);
                            }}
                            className="flex-1 h-10 rounded-xl bg-secondary border border-border hover:bg-accent hover:text-foreground transition-all text-xs font-semibold text-foreground/80 cursor-pointer"
                        >
                            Upload Another File
                        </button>
                    </div>
                </div>
            )}

            {/* Instruction panel */}
            <div className="rounded-xl border border-border bg-card p-6 space-y-4">
                <h4 className="text-[10px] font-mono uppercase text-muted-foreground tracking-wider">ATS Layout Recommendations</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-muted-foreground font-sans leading-relaxed">
                    <div className="space-y-1.5">
                        <h5 className="font-semibold text-foreground/80">Section Headers</h5>
                        <p className="text-[11px] text-muted-foreground">
                            Use standard layout markers like "Experience", "Education", and "Skills". Non-standard tags confuse screening parsers.
                        </p>
                    </div>
                    <div className="space-y-1.5">
                        <h5 className="font-semibold text-foreground/80">Single-column Layout</h5>
                        <p className="text-[11px] text-muted-foreground">
                            Nested side columns or graphic text tables cause word coordinate scrambles. Keep the text timeline linear.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
