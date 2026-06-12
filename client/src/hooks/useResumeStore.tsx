"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";

// Structure definitions
export interface Keyword {
    word: string;
    category: "matched" | "missing" | "overused";
    count: number;
}

export interface Question {
    id: string;
    category: "technical" | "hr" | "project";
    question: string;
    answer: string;
}

export interface RoadmapStep {
    step: number;
    title: string;
    description: string;
    duration: string;
    skills: string[];
}

export interface ResumeData {
    id: string;
    name: string;
    date: string;
    size: string;
    score: number;
    skillsMatch: number;
    matchedKeywords: number;
    missingKeywords: number;
    summary: string;
    strengths: string[];
    weaknesses: string[];
    keywords: Keyword[];
    recommendedSkills: string[];
    suggestedRoadmap: RoadmapStep[];
    interviewQuestions: Question[];
}

interface UserProfile {
    name: string;
    email: string;
    avatar: string;
    tier: string;
}

interface AppSettings {
    emailAlerts: boolean;
    pushNotifications: boolean;
    autoAnalyze: boolean;
    model: string;
}

interface ResumeContextType {
    currentTab: string;
    setCurrentTab: (tab: string) => void;
    resumes: ResumeData[];
    activeResume: ResumeData | null;
    setActiveResume: (resume: ResumeData | null) => void;
    isUploading: boolean;
    uploadProgress: number;
    uploadResume: (file: File, jobDescription: string) => Promise<ResumeData>;
    deleteResume: (id: string) => void;
    reanalyzeResume: (id: string) => Promise<void>;
    user: UserProfile;
    updateUser: (name: string, email: string) => void;
    settings: AppSettings;
    updateSettings: (settings: Partial<AppSettings>) => void;
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

// ---------------------------------------------------------------------------
// Backend API response shape (used for mapping only — not exported)
// ---------------------------------------------------------------------------
interface BackendResume {
    id: string;
    name: string;
    createdAt: string;
    size?: number;
    score?: number;
    skillsMatch?: number;
    matchedKeywordsCount?: number;
    missingKeywordsCount?: number;
    summary?: string;
    strengths?: string[];
    weaknesses?: string[];
    keywords?: Keyword[];
    recommendedSkills?: string[];
    suggestedRoadmap?: RoadmapStep[];
    interviewQuestions?: Question[];
}


export function ResumeProvider({ children }: { children: React.ReactNode }) {
    const [currentTab, setCurrentTab] = useState<string>("overview");
    const [resumes, setResumes] = useState<ResumeData[]>([]);
    const [activeResume, setActiveResume] = useState<ResumeData | null>(null);
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const [user, setUser] = useState<UserProfile>({
        name: "Alex Developer",
        email: "alex@developer.io",
        avatar: "",
        tier: "Professional Plan"
    });
    const [settings, setSettings] = useState<AppSettings>({
        emailAlerts: true,
        pushNotifications: false,
        autoAnalyze: true,
        model: "gpt-4o"
    });


    const fetchResumes = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/resumes`, {
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (res.ok) {
                const data = await res.json();

                // Map backend data to frontend ResumeData interface
                const mappedResumes: ResumeData[] = data.map((r: BackendResume) => ({
                    id: r.id,
                    name: r.name,
                    date: new Date(r.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
                    size: r.size ? `${(r.size / (1024 * 1024)).toFixed(1)} MB` : "Unknown",
                    score: r.score || 0,
                    skillsMatch: r.skillsMatch || 0,
                    matchedKeywords: r.matchedKeywordsCount || 0,
                    missingKeywords: r.missingKeywordsCount || 0,
                    summary: r.summary || "",
                    strengths: r.strengths || [],
                    weaknesses: r.weaknesses || [],
                    keywords: r.keywords || [],
                    recommendedSkills: r.recommendedSkills || [],
                    suggestedRoadmap: r.suggestedRoadmap || [],
                    interviewQuestions: r.interviewQuestions || []
                }));

                setResumes(mappedResumes);
                if (mappedResumes.length > 0) {
                    setActiveResume(mappedResumes[0]);
                }
            }
        } catch (error) {
            console.error("Failed to fetch resumes", error);
        }
    };
    useEffect(() => {
        fetchResumes();
    }, []);

    const uploadResume = async (file: File, jobDescription: string): Promise<ResumeData> => {
        setIsUploading(true);
        setUploadProgress(10);

        // Simulate progressive upload visually
        const interval = setInterval(() => {
            setUploadProgress(prev => {
                if (prev >= 90) {
                    clearInterval(interval);
                    return 90;
                }
                return prev + 15;
            });
        }, 300);

        try {
            const formData = new FormData();
            formData.append("resume", file);

            // Use mock job description if not provided
            const finalJobDescription = jobDescription.trim() ||
                "Software Engineer with experience in React, Node.js, and Cloud Infrastructure. Must be able to work in agile teams and deliver scalable web applications.";

            formData.append("jobDescription", finalJobDescription);

            const token = localStorage.getItem("token");

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/resumes/analyze`, {
                method: "POST",
                headers: {
                    ...(token ? { "Authorization": `Bearer ${token}` } : {})
                },
                body: formData
            });

            clearInterval(interval);
            setUploadProgress(100);

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to upload and analyze resume");
            }

            const resumeRecord = data.resume;

            const newResume: ResumeData = {
                id: resumeRecord.id,
                name: resumeRecord.name,
                date: new Date(resumeRecord.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
                size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
                score: resumeRecord.score || 0,
                skillsMatch: resumeRecord.skillsMatch || 0,
                matchedKeywords: resumeRecord.matchedKeywordsCount || 0,
                missingKeywords: resumeRecord.missingKeywordsCount || 0,
                summary: resumeRecord.summary || "Analysis complete.",
                strengths: (resumeRecord.strengths as string[]) || [],
                weaknesses: (resumeRecord.weaknesses as string[]) || [],
                keywords: (resumeRecord.keywords as Keyword[]) || [],
                recommendedSkills: (resumeRecord.recommendedSkills as string[]) || [],
                suggestedRoadmap: (resumeRecord.suggestedRoadmap as RoadmapStep[]) || [],
                interviewQuestions: (resumeRecord.interviewQuestions as Question[]) || [],
            };

            setResumes(prev => [newResume, ...prev]);
            setActiveResume(newResume);
            setIsUploading(false);
            setUploadProgress(0);
            return newResume;

        } catch (error) {
            clearInterval(interval);
            setIsUploading(false);
            setUploadProgress(0);
            throw error;
        }
    };

    const deleteResume = async (id: string) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/resumes/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (res.ok) {
                setResumes(prev => {
                    const filtered = prev.filter(r => r.id !== id);
                    if (activeResume?.id === id) {
                        setActiveResume(filtered.length > 0 ? filtered[0] : null);
                    }
                    return filtered;
                });
            } else {
                console.error("Failed to delete resume on server");
            }
        } catch (error) {
            console.error("Error deleting resume", error);
        }
    };

    const reanalyzeResume = async (id: string) => {
        setIsUploading(true);
        setUploadProgress(20);
        await new Promise(resolve => setTimeout(resolve, 600));
        setUploadProgress(60);
        await new Promise(resolve => setTimeout(resolve, 400));

        setResumes(prev =>
            prev.map(r => {
                if (r.id === id) {
                    const upgradedScore = Math.min(98, r.score + Math.floor(Math.random() * 5) + 2);
                    const updated = {
                        ...r,
                        score: upgradedScore,
                        skillsMatch: Math.min(99, r.skillsMatch + 3),
                        matchedKeywords: r.matchedKeywords + 1,
                        missingKeywords: Math.max(0, r.missingKeywords - 1)
                    };
                    if (activeResume?.id === id) {
                        setActiveResume(updated);
                    }
                    return updated;
                }
                return r;
            })
        );
        setIsUploading(false);
        setUploadProgress(0);
    };

    const updateUser = useCallback((name: string, email: string) => {
        setUser(prev => ({
            ...prev,
            name,
            email
        }));
    }, []);

    const updateSettings = useCallback((updated: Partial<AppSettings>) => {
        setSettings(prev => ({
            ...prev,
            ...updated
        }));
    }, []);

    const value = useMemo(
        () => ({
            currentTab,
            setCurrentTab,
            resumes,
            activeResume,
            setActiveResume,
            isUploading,
            uploadProgress,
            uploadResume,
            deleteResume,
            reanalyzeResume,
            user,
            updateUser,
            settings,
            updateSettings
        }),
        [
            currentTab,
            resumes,
            activeResume,
            isUploading,
            uploadProgress,
            user,
            settings,
            updateUser,
            updateSettings
        ]
    );
    return (
        <ResumeContext.Provider value={value}>
            {children}
        </ResumeContext.Provider>
    );
}

export function useResumeStore() {
    const context = useContext(ResumeContext);
    if (context === undefined) {
        throw new Error("useResumeStore must be used within a ResumeProvider");
    }
    return context;
}
