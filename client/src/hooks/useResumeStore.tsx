"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

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

export interface SkillCategory {
    category: string;
    score: number;
}

export interface ResumeOptimization {
    rewrittenSummary: string;
    improvedBulletPoints: string[];
}

export interface ProjectFeedback {
    project: string;
    score: number;
    suggestions: string[];
}

export interface RecruiterView {
    hireRecommendation: string;
    riskFactors: string[];
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
    skillCategories: SkillCategory[];
    recommendedSkills: string[];
    suggestedRoadmap: RoadmapStep[];
    interviewQuestions: Question[];
    resumeOptimization: ResumeOptimization | null;
    projectFeedback: ProjectFeedback[] | null;
    recruiterView: RecruiterView | null;
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

interface ResumeStoreState {
    currentTab: string;
    setCurrentTab: (tab: string) => void;
    resumes: ResumeData[];
    activeResume: ResumeData | null;
    setActiveResume: (resume: ResumeData | null) => void;
    isUploading: boolean;
    uploadProgress: number;
    uploadStatusText: string;
    setIsUploading: (val: boolean) => void;
    setUploadProgress: (val: number) => void;
    setUploadStatusText: (text: string) => void;
    fetchResumes: (page?: number, limit?: number) => Promise<void>;
    resumesPagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
    uploadResume: (file: File, jobDescription: string) => Promise<ResumeData>;
    deleteResume: (id: string) => Promise<void>;
    reanalyzeResume: (id: string) => Promise<void>;
    user: UserProfile;
    updateUser: (name: string, email: string) => void;
    setAvatar: (url: string) => void;
    uploadAvatar: (file: File) => Promise<void>;
    deleteAvatar: () => Promise<void>;
    settings: AppSettings;
    updateSettings: (settings: Partial<AppSettings>) => void;
    clearStore: () => void;
}

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
    skillCategories?: SkillCategory[];
    recommendedSkills?: string[];
    suggestedRoadmap?: RoadmapStep[];
    interviewQuestions?: Question[];
    resumeOptimization?: ResumeOptimization | null;
    projectFeedback?: ProjectFeedback[] | null;
    recruiterView?: RecruiterView | null;
}

export const useResumeStore = create<ResumeStoreState>()(
    persist(
        (set, get) => ({
            currentTab: "overview",
            setCurrentTab: (tab) => set({ currentTab: tab }),

            resumes: [],
            activeResume: null,
            setActiveResume: (resume) => set({ activeResume: resume }),

            clearStore: () => set({
                currentTab: "overview",
                resumes: [],
                activeResume: null,
                user: {
                    name: "John Doe",
                    email: "john@example.com",
                    avatar: "",
                    tier: "Professional Plan"
                }
            }),

            isUploading: false,
            uploadProgress: 0,
            uploadStatusText: "Initializing...",
            setIsUploading: (val) => set({ isUploading: val }),
            setUploadProgress: (val) => set({ uploadProgress: val }),
            setUploadStatusText: (text) => set({ uploadStatusText: text }),

            user: {
                name: "John Doe",
                email: "john@example.com",
                avatar: "",
                tier: "Professional Plan"
            },
            updateUser: (name, email) => set((state) => ({ user: { ...state.user, name, email } })),
            setAvatar: (url) => set((state) => ({ user: { ...state.user, avatar: url } })),
            uploadAvatar: async (file: File) => {
                const token = localStorage.getItem("token");
                if (!token) return;

                const formData = new FormData();
                formData.append('avatar', file);

                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/users/avatar`, {
                    method: 'POST',
                    headers: { "Authorization": `Bearer ${token}` },
                    body: formData
                });

                if (res.ok) {
                    const data = await res.json();
                    if (data.avatar) {
                        set((state) => ({ user: { ...state.user, avatar: data.avatar } }));
                    }
                } else {
                    const errorText = await res.text();
                    console.error("Failed to upload avatar. Backend response:", res.status, errorText);
                    throw new Error(`Upload failed: ${errorText}`);
                }
            },
            deleteAvatar: async () => {
                const token = localStorage.getItem("token");
                if (!token) return;

                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/users/avatar`, {
                    method: 'DELETE',
                    headers: { "Authorization": `Bearer ${token}` }
                });

                if (res.ok) {
                    set((state) => ({ user: { ...state.user, avatar: "" } }));
                } else {
                    console.error("Failed to delete avatar");
                    throw new Error("Delete avatar failed");
                }
            },

            settings: {
                emailAlerts: true,
                pushNotifications: false,
                autoAnalyze: true,
                model: "gpt-4o"
            },
            updateSettings: (newSettings) => set((state) => ({ settings: { ...state.settings, ...newSettings } })),

            resumesPagination: {
                page: 1,
                limit: 10,
                total: 0,
                totalPages: 1,
                hasNext: false,
                hasPrev: false,
            },

            fetchResumes: async (page = 1, limit = 10) => {
                try {
                    const token = localStorage.getItem("token");
                    if (!token) return;

                    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/resumes?page=${page}&limit=${limit}`, {
                        headers: { "Authorization": `Bearer ${token}` }
                    });

                    if (res.ok) {
                        const json = await res.json();
                        // Handle both old flat array and new paginated format
                        const rawResumes = Array.isArray(json) ? json : (json.resumes || []);
                        const pagination = Array.isArray(json) ? {
                            page: 1,
                            limit: rawResumes.length,
                            total: rawResumes.length,
                            totalPages: 1,
                            hasNext: false,
                            hasPrev: false
                        } : (json.pagination || {
                            page: 1,
                            limit,
                            total: rawResumes.length,
                            totalPages: 1,
                            hasNext: false,
                            hasPrev: false
                        });

                        const mappedResumes: ResumeData[] = rawResumes.map((r: BackendResume) => ({
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
                            skillCategories: r.skillCategories || [],
                            recommendedSkills: r.recommendedSkills || [],
                            suggestedRoadmap: r.suggestedRoadmap || [],
                            interviewQuestions: r.interviewQuestions || [],
                            resumeOptimization: r.resumeOptimization || null,
                            projectFeedback: r.projectFeedback || null,
                            recruiterView: r.recruiterView || null,
                        }));

                        set({ resumes: mappedResumes, resumesPagination: pagination });
                        
                        // Only set active resume if one doesn't exist, to preserve user's view across refreshes
                        const currentActive = get().activeResume;
                        if (mappedResumes.length > 0 && !currentActive) {
                            set({ activeResume: mappedResumes[0] });
                        }
                    }
                } catch (error) {
                    console.error("Failed to fetch resumes", error);
                }
            },

            uploadResume: async (file: File, jobDescription: string) => {
                set({ isUploading: true, uploadProgress: 5, uploadStatusText: "Connecting to secure server..." });

                try {
                    const formData = new FormData();
                    formData.append("resume", file);
                    formData.append("jobDescription", jobDescription.trim());

                    const token = localStorage.getItem("token");

                    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/resumes/analyze`, {
                        method: "POST",
                        headers: {
                            ...(token ? { "Authorization": `Bearer ${token}` } : {})
                        },
                        body: formData
                    });

                    if (!res.body) throw new Error("No response body");

                    const reader = res.body.getReader();
                    const decoder = new TextDecoder();
                    let finalData = null;

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
                                    if (data.error) {
                                        throw new Error(data.error);
                                    }
                                    if (data.status === "complete") {
                                        finalData = data;
                                    } else if (data.status) {
                                        set({ 
                                            uploadStatusText: data.status,
                                            // auto-increment progress roughly
                                            uploadProgress: get().uploadProgress >= 90 ? 90 : get().uploadProgress + 10
                                        });
                                    }
                                } catch (e) {
                                    // ignore parse errors for partial chunks
                                }
                            }
                        }
                    }

                    if (!finalData) throw new Error("Stream closed without final data.");

                    const resumeRecord = finalData.resume;

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
                        skillCategories: (resumeRecord.skillCategories as SkillCategory[]) || [],
                        recommendedSkills: (resumeRecord.recommendedSkills as string[]) || [],
                        suggestedRoadmap: (resumeRecord.suggestedRoadmap as RoadmapStep[]) || [],
                        interviewQuestions: (resumeRecord.interviewQuestions as Question[]) || [],
                        resumeOptimization: (resumeRecord.resumeOptimization as ResumeOptimization) || null,
                        projectFeedback: (resumeRecord.projectFeedback as ProjectFeedback[]) || null,
                        recruiterView: (resumeRecord.recruiterView as RecruiterView) || null,
                    };

                    set((state) => ({
                        resumes: [newResume, ...state.resumes],
                        activeResume: newResume,
                        isUploading: false,
                        uploadProgress: 100,
                        uploadStatusText: "Complete!"
                    }));

                    return newResume;

                } catch (error) {
                    set({ isUploading: false, uploadProgress: 0, uploadStatusText: "Failed." });
                    // Priority 1 #4: surface upload errors as toast messages
                    const { default: toast } = await import('react-hot-toast');
                    const msg = error instanceof Error ? error.message : 'Upload failed. Please try again.';
                    toast.error(msg, { id: 'upload-error', duration: 5000 });
                    throw error;
                }
            },

            deleteResume: async (id: string) => {
                try {
                    const token = localStorage.getItem("token");
                    if (!token) return;

                    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/resumes/${id}`, {
                        method: "DELETE",
                        headers: { "Authorization": `Bearer ${token}` }
                    });

                    if (res.ok) {
                        set((state) => {
                            const filtered = state.resumes.filter(r => r.id !== id);
                            return {
                                resumes: filtered,
                                activeResume: state.activeResume?.id === id ? (filtered.length > 0 ? filtered[0] : null) : state.activeResume
                            };
                        });
                    } else {
                        console.error("Failed to delete resume on server");
                    }
                } catch (error) {
                    console.error("Error deleting resume", error);
                }
            },

            reanalyzeResume: async (id: string) => {
                set({ isUploading: true, uploadProgress: 10, uploadStatusText: "Connecting to server..." });
                const token = localStorage.getItem("token");

                try {
                    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/resumes/${id}/reanalyze`, {
                        method: "POST",
                        headers: {
                            "Authorization": `Bearer ${token}`,
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({})
                    });

                    if (!res.body) throw new Error("No response body");

                    const reader = res.body.getReader();
                    const decoder = new TextDecoder();
                    let finalData = null;

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
                                    if (data.error) {
                                        throw new Error(data.error);
                                    }
                                    if (data.resume) {
                                        finalData = data;
                                    }
                                    if (data.status && typeof data.status === 'string') {
                                        set(state => ({
                                            uploadStatusText: data.status,
                                            uploadProgress: Math.min(95, state.uploadProgress + 15)
                                        }));
                                    }
                                } catch (e) {
                                    console.error("Error parsing SSE chunk:", e);
                                }
                            }
                        }
                    }

                    if (finalData && finalData.resume) {
                        const r = finalData.resume;
                        const newResumeData: ResumeData = {
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
                            skillCategories: r.skillCategories || [],
                            recommendedSkills: r.recommendedSkills || [],
                            suggestedRoadmap: r.suggestedRoadmap || [],
                            interviewQuestions: r.interviewQuestions || [],
                            resumeOptimization: r.resumeOptimization || null,
                            projectFeedback: r.projectFeedback || null,
                            recruiterView: r.recruiterView || null,
                        };

                        set((state) => {
                            const newResumes = state.resumes.map(resume => resume.id === id ? newResumeData : resume);
                            return {
                                resumes: newResumes,
                                activeResume: state.activeResume?.id === id ? newResumeData : state.activeResume,
                                isUploading: false,
                                uploadProgress: 100,
                                uploadStatusText: "Re-analysis complete!"
                            };
                        });
                        
                        setTimeout(() => {
                            set({ uploadProgress: 0, uploadStatusText: "" });
                        }, 1000);
                    } else {
                        throw new Error("No resume data returned");
                    }

                } catch (error) {
                    set({ isUploading: false, uploadProgress: 0, uploadStatusText: "Failed." });
                    console.error("Error reanalyzing resume", error);
                }
            }
        }),
        {
            name: "resume-store-storage", // name of item in the storage (must be unique)
            partialize: (state) => ({ 
                resumes: state.resumes, 
                activeResume: state.activeResume,
                user: state.user,
                settings: state.settings
            }), // only persist these fields
        }
    )
);
