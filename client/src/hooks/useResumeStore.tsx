"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

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

// Initial Rich Mock Resumes
const INITIAL_RESUMES: ResumeData[] = [
    {
        id: "res-1",
        name: "DevOps_Engineer_Senior_2026.pdf",
        date: "May 24, 2026",
        size: "1.4 MB",
        score: 87,
        skillsMatch: 89,
        matchedKeywords: 28,
        missingKeywords: 4,
        summary: "Highly skilled DevOps Engineer with 6+ years of experience leading cloud infrastructure transformations. Expert in AWS, Kubernetes containerization, and writing robust Terraform infrastructure-as-code modules. Strong track record of cutting deployment failures by 40% and optimizing cloud expenditure.",
        strengths: [
            "Extensive expertise in Docker and highly scalable multi-cluster Kubernetes deployments.",
            "Strong infrastructure-as-code implementation using Terraform, reducing manual errors by 90%.",
            "Advanced experience designing high-speed, zero-downtime CI/CD build pipelines using GitHub Actions.",
            "Great focus on cloud budget optimizations, slashing unnecessary AWS spend by 30%."
        ],
        weaknesses: [
            "Relatively minimal hands-on coding experience in systems-level programming (e.g. Rust/Go).",
            "Fewer formal certifications in security auditing standards (such as ISO 27001 or SOC2).",
            "Limited exposure to enterprise multi-cloud setups utilizing Google Cloud or Microsoft Azure."
        ],
        keywords: [
            { word: "Kubernetes", category: "matched", count: 8 },
            { word: "AWS", category: "matched", count: 12 },
            { word: "Terraform", category: "matched", count: 6 },
            { word: "CI/CD", category: "matched", count: 5 },
            { word: "Docker", category: "matched", count: 4 },
            { word: "Python", category: "matched", count: 3 },
            { word: "Prometheus", category: "matched", count: 2 },
            { word: "Rust", category: "missing", count: 0 },
            { word: "Azure", category: "missing", count: 0 },
            { word: "SOC2", category: "missing", count: 0 },
            { word: "Git", category: "overused", count: 14 },
            { word: "Deploy", category: "overused", count: 18 }
        ],
        recommendedSkills: ["Go (Golang)", "Google Cloud Platform (GCP)", "SOC2 Security Standards", "Helm Charts"],
        suggestedRoadmap: [
            {
                step: 1,
                title: "Master Go (Golang) Programming",
                description: "Deepen understanding of systems programming, building custom CLI tools and Kubernetes operators using Go controllers.",
                duration: "4 weeks",
                skills: ["Go Syntax", "Goroutines", "Kubernetes client-go"]
            },
            {
                step: 2,
                title: "GCP Multi-cloud Foundations",
                description: "Earn the GCP Professional Cloud Architect certification to handle advanced hybrid-cloud environments.",
                duration: "6 weeks",
                skills: ["GKE", "GCP IAM", "Cloud Spanner"]
            },
            {
                step: 3,
                title: "Enterprise Compliance & SOC2 Auditing",
                description: "Learn how to architect networks and access policies that comply with security certifications like SOC2 and ISO 27001.",
                duration: "3 weeks",
                skills: ["Network Isolation", "Vulnerability Scanning", "Vault Secrets"]
            }
        ],
        interviewQuestions: [
            {
                id: "q-1",
                category: "technical",
                question: "How do you manage state files and team collaboration securely in Terraform?",
                answer: "I leverage Terraform Backend (specifically AWS S3 for storage and DynamoDB for state locking). This prevents race conditions during concurrent runs. Additionally, the bucket is encrypted at rest using KMS, has versioning enabled, and has public access blocked completely."
            },
            {
                id: "q-2",
                category: "technical",
                question: "Explain the difference between a Kubernetes Pod, Deployment, and StatefulSet.",
                answer: "A Pod is the smallest deployable unit containing one or more containers. A Deployment manages stateless pods, automating rolling updates and replica scaling. A StatefulSet is used for stateful applications, providing stable persistent network identifiers and guaranteed ordering of volume attachments."
            },
            {
                id: "q-3",
                category: "hr",
                question: "Describe a situation where you had an architectural disagreement with your team. How did you resolve it?",
                answer: "In a previous project, some team members preferred manual AWS console tweaks for quick hotfixes, whereas I insisted on enforcing 100% Terraform compliance. I resolved this by explaining the risks of environment drift and showing how drift-detection pipelines notify us automatically. I conducted a short workshop, created reusable templates, and made the transition seamless for everyone."
            },
            {
                id: "q-4",
                category: "project",
                question: "Can you walk us through the CI/CD pipeline you designed which reduced build times?",
                answer: "Certainly. It was a GitHub Actions-based build system. By modularizing our docker builds, caching dependency layers (npm and python-pip virtual environments), running test suites in parallel matrix containers, and pushing only modified assets, we cut average release build cycles from 22 minutes to just under 5 minutes."
            }
        ]
    },
    {
        id: "res-2",
        name: "FullStack_React_Developer_Resume.pdf",
        date: "May 10, 2026",
        size: "950 KB",
        score: 64,
        skillsMatch: 60,
        matchedKeywords: 14,
        missingKeywords: 8,
        summary: "Passionate Full-Stack Developer with 2+ years of experience working primarily on frontend architectures using React and Next.js. Decent familiarity with Express Node backends. Energetic team player looking to contribute clean code to scaling systems.",
        strengths: [
            "Highly proficient with modern React, hooks, state managers (Redux), and responsive Tailwind design.",
            "Strong understanding of semantic HTML layouts and CSS layouts.",
            "Solid experience with RESTful API structures and JSON data parsing."
        ],
        weaknesses: [
            "Lacks performance-optimization skills like database indexing, pagination, and query profiling.",
            "Minimal experience with containerization tools (Docker) or serverless cloud infrastructure.",
            "No formal unit or integration testing configurations (Jest, React Testing Library, Cypress)."
        ],
        keywords: [
            { word: "React", category: "matched", count: 14 },
            { word: "Tailwind CSS", category: "matched", count: 8 },
            { word: "Node.js", category: "matched", count: 4 },
            { word: "JavaScript", category: "matched", count: 10 },
            { word: "Express", category: "matched", count: 3 },
            { word: "Docker", category: "missing", count: 0 },
            { word: "Jest", category: "missing", count: 0 },
            { word: "PostgreSQL", category: "missing", count: 0 },
            { word: "TypeScript", category: "missing", count: 0 },
            { word: "Next.js", category: "missing", count: 0 },
            { word: "Create", category: "overused", count: 22 },
            { word: "Code", category: "overused", count: 19 }
        ],
        recommendedSkills: ["TypeScript", "Next.js", "Docker", "Jest & Cypress", "PostgreSQL"],
        suggestedRoadmap: [
            {
                step: 1,
                title: "Upgrade to TypeScript",
                description: "Migrate basic JavaScript projects to TypeScript. Master static typing, interfaces, generics, and custom type definitions to avoid runtime errors.",
                duration: "3 weeks",
                skills: ["TS Config", "Generics", "Type Safeguarding"]
            },
            {
                step: 2,
                title: "Next.js Framework & Server Components",
                description: "Adopt App Router, Server Actions, Server Component strategies, and static/dynamic rendering parameters.",
                duration: "4 weeks",
                skills: ["App Router", "SSR / ISR", "Server Actions"]
            },
            {
                step: 3,
                title: "Add Unit & Integration Testing",
                description: "Learn Jest and React Testing Library for frontend component checks, and write end-to-end user flows in Cypress.",
                duration: "3 weeks",
                skills: ["Mocking APIs", "Component Testing", "E2E Testing"]
            }
        ],
        interviewQuestions: [
            {
                id: "q-201",
                category: "technical",
                question: "Explain the difference between React Client and Server Components in Next.js.",
                answer: "Server Components are executed and rendered on the server, sending pre-rendered HTML to the client which improves SEO and performance. They cannot use state, effects, or browser APIs. Client Components (marked with 'use client') are sent to the browser for hydration, supporting active user interactions, state, and hooks."
            },
            {
                id: "q-202",
                category: "hr",
                question: "What is your process for learning a new technology rapidly?",
                answer: "I start by building a small, simple project (like a todo app or dashboard widgets) instead of just reading tutorials. I then review the official documentation, analyze open-source code repositories implementing that tech, and document my bugs and findings. Hands-on error debugging is my fastest way to learn."
            }
        ]
    }
];

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

    useEffect(() => {
        const fetchResumes = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) return;
                
                const res = await fetch("http://localhost:3001/api/resumes", {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                
                if (res.ok) {
                    const data = await res.json();
                    
                    // Map backend data to frontend ResumeData interface
                    const mappedResumes: ResumeData[] = data.map((r: any) => ({
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

            const res = await fetch("http://localhost:3001/api/resumes/analyze", {
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

            // Map backend response to ResumeData
            // Backend returns: { resume: {...}, analysis: { matchPercentage, missingSkills, suggestions } }
            const resumeRecord = data.resume;
            const jobMatchRecord = data.analysis;
            
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

            const res = await fetch(`http://localhost:3001/api/resumes/${id}`, {
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

    const updateUser = (name: string, email: string) => {
        setUser(prev => ({
            ...prev,
            name,
            email
        }));
    };

    const updateSettings = (updated: Partial<AppSettings>) => {
        setSettings(prev => ({
            ...prev,
            ...updated
        }));
    };

    return (
        <ResumeContext.Provider
            value={{
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
            }}
        >
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
