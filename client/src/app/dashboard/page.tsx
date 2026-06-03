"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useResumeStore } from "@/hooks/useResumeStore";
import BackgroundParticles from "@/components/layout/BackgroundParticles";
import VercelBackground from "@/components/layout/VercelBackground";

// Import view components
import OverviewView from "@/components/dashboard/OverviewView";
import UploadView from "@/components/dashboard/UploadView";
import ResumeHistoryView from "@/components/dashboard/ResumeHistoryView";
import ATSAnalysisView from "@/components/dashboard/ATSAnalysisView";
import JobMatcherView from "@/components/dashboard/JobMatcherView";
import InterviewView from "@/components/dashboard/InterviewView";
import SkillsGapView from "@/components/dashboard/SkillsGapView";
import SettingsView from "@/components/dashboard/SettingsView";

import {
    Layers,
    LayoutDashboard,
    Upload,
    History,
    Award,
    Sparkles,
    Briefcase,
    MessageSquare,
    Settings,
    LogOut,
    Menu,
    X,
    Bell,
    ChevronDown,
    Plus,
    FileText,
    CheckCircle2,
    Search
} from "lucide-react";

export default function DashboardPage() {
    const router = useRouter();
    const {
        currentTab,
        setCurrentTab,
        resumes,
        activeResume,
        setActiveResume,
        user,
        updateUser,
        updateSettings
    } = useResumeStore();

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [resumeSelectorOpen, setResumeSelectorOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const verifyAuth = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                router.push("/login");
                return;
            }

            try {
                const res = await fetch("http://localhost:3001/api/auth/me", {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });

                if (!res.ok) {
                    throw new Error("Invalid token");
                }

                const data = await res.json();
                updateUser(data.name, data.email);
                
                if (data.settings) {
                    updateSettings({
                        emailAlerts: data.settings.emailAlerts ?? true,
                        autoAnalyze: data.settings.autoAnalyze ?? true,
                        model: data.settings.model ?? "gpt-4o"
                    });
                }

                setIsAuthenticated(true);
            } catch (error) {
                localStorage.removeItem("token");
                router.push("/login");
            }
        };

        verifyAuth();
    }, [router]);

    // Dynamic Navigation links
    const NAV_ITEMS = [
        { label: "Dashboard", value: "overview", icon: <LayoutDashboard className="size-4" /> },
        { label: "Upload Resume", value: "upload", icon: <Upload className="size-4" /> },
        { label: "Resume History", value: "history", icon: <History className="size-4" /> },
        { label: "ATS Reports", value: "reports", icon: <Award className="size-4" /> },
        { label: "AI Suggestions", value: "skills", icon: <Sparkles className="size-4" /> },
        { label: "Job Matcher", value: "matcher", icon: <Briefcase className="size-4" /> },
        { label: "Interview Prep", value: "interview", icon: <MessageSquare className="size-4" /> },
        { label: "Settings", value: "settings", icon: <Settings className="size-4" /> }
    ];

    const getTabTitle = () => {
        const item = NAV_ITEMS.find(n => n.value === currentTab);
        return item ? item.label : "Console";
    };

    const handleSelectResumeFromTop = (id: string) => {
        const res = resumes.find(r => r.id === id);
        if (res) {
            setActiveResume(res);
        }
        setResumeSelectorOpen(false);
    };

    const handleSignOut = () => {
        localStorage.removeItem("token");
        router.push("/");
    };

    // Responsive views mapping
    const renderActiveView = () => {
        switch (currentTab) {
            case "overview":
                return <OverviewView />;
            case "upload":
                return <UploadView />;
            case "history":
                return <ResumeHistoryView />;
            case "reports":
                return <ATSAnalysisView />;
            case "matcher":
                return <JobMatcherView />;
            case "interview":
                return <InterviewView />;
            case "skills":
                return <SkillsGapView />;
            case "settings":
                return <SettingsView />;
            default:
                return <OverviewView />;
        }
    };

    // Close menus on route/tab updates
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [currentTab]);

    if (!isAuthenticated) {
        return null;
    }

    return (
        <main className="relative min-h-screen bg-background text-foreground flex overflow-hidden selection:bg-primary/25">
            <VercelBackground />
            <BackgroundParticles />

            {/* --- DESKTOP SIDEBAR NAVIGATION --- */}
            <aside className="hidden lg:flex flex-col w-64 border-r border-border bg-background/80 backdrop-blur-md shrink-0 relative z-20">
                {/* Branding Header */}
                <div className="flex h-16 items-center gap-2 px-6 border-b border-border">
                    <Layers className="size-4 text-primary" />
                    <span className="text-xs font-bold tracking-tight text-foreground">Resume<span className="text-primary">.ai</span></span>
                </div>

                {/* Main Link Options */}
                <nav className="flex-1 space-y-3 px-2 py-6">
                    {NAV_ITEMS.map((item) => {
                        const isActive = currentTab === item.value;
                        return (
                            <button
                                key={item.value}
                                onClick={() => setCurrentTab(item.value)}
                                className={`w-full flex items-center gap-3 py-1.5 text-xs font-semibold text-left transition-all relative cursor-pointer ${isActive
                                    ? "text-primary pl-5 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-0.5 before:bg-primary before:rounded-r shadow-[inset_4px_0_12px_oklch(0.58_0.2_255_/_15%)]"
                                    : "text-muted-foreground hover:text-foreground/80 pl-5 hover:pl-6"
                                    }`}
                            >
                                {item.icon}
                                {item.label}
                            </button>
                        );
                    })}
                </nav>

                {/* Footer User Profile Card */}
                <div className="border-t border-border p-4 space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-secondary border border-border flex items-center justify-center font-mono font-bold text-xs text-muted-foreground">
                            {user.name[0]}
                        </div>
                        <div className="min-w-0 flex-1">
                            <h4 className="text-[11px] font-semibold text-foreground truncate">{user.name}</h4>
                            <span className="text-[9px] text-muted-foreground truncate block mt-0.5">{user.email}</span>
                        </div>
                    </div>

                    <button
                        onClick={handleSignOut}
                        className="w-full h-8 flex items-center gap-2 justify-center rounded-lg border border-border bg-card hover:bg-secondary hover:text-foreground transition-colors text-[10px] font-bold text-muted-foreground"
                    >
                        <LogOut className="size-3.5" />
                        Disconnect Session
                    </button>
                </div>
            </aside>

            {/* --- RIGHT CONTENT PANEL --- */}
            <div className="flex-1 flex flex-col min-w-0 h-screen relative z-10 overflow-hidden">
                {/* --- STICKY TOP NAVBAR --- */}
                <header className="sticky top-0 z-30 w-full flex h-16 shrink-0 items-center justify-between border-b border-border bg-background/80 backdrop-blur-md px-4 sm:px-6">
                    {/* Mobile Hamburger Drawer Menu Toggle */}
                    <div className="flex items-center gap-3 lg:hidden">
                        <button
                            onClick={() => setMobileMenuOpen(true)}
                            className="p-1.5 rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground cursor-pointer"
                        >
                            <Menu className="size-4" />
                        </button>
                        <div className="flex items-center gap-1.5">
                            <Layers className="size-4 text-primary" />
                            <span className="text-xs font-semibold tracking-tight text-foreground">Resume<span className="text-primary">.ai</span></span>
                        </div>
                    </div>

                    {/* Breadcrumbs (Desktop only) */}
                    <div className="hidden lg:flex items-center gap-3 text-xs text-muted-foreground font-mono">
                        <span className="text-foreground/80 font-semibold">{getTabTitle()}</span>
                    </div>

                    {/* Quick Access Tools */}
                    <div className="flex items-center gap-3">
                        {/* Dynamic Resume Selector Dropdown */}
                        {resumes.length > 0 && (
                            <div className="relative">
                                <button
                                    onClick={() => setResumeSelectorOpen(!resumeSelectorOpen)}
                                    className="h-8 gap-1.5 rounded-lg border border-border bg-card/80 px-3 text-[10px] font-semibold text-foreground/80 hover:text-foreground hover:border-border transition-all flex items-center cursor-pointer"
                                >
                                    <FileText className="size-3.5 text-muted-foreground" />
                                    <span className="max-w-[120px] truncate font-mono">
                                        {activeResume ? activeResume.name : "Select Profile"}
                                    </span>
                                    <ChevronDown className="size-3 text-muted-foreground" />
                                </button>

                                {resumeSelectorOpen && (
                                    <div className="absolute right-0 mt-1.5 w-60 rounded-xl border border-border bg-card p-2 shadow-2xl z-40">
                                        <span className="block text-[9px] font-mono text-muted-foreground/70 uppercase px-2 py-1 border-b border-border mb-1">
                                            Select Active Scanner Profile
                                        </span>
                                        <div className="max-h-40 overflow-y-auto space-y-0.5">
                                            {resumes.map((res) => (
                                                <button
                                                    key={res.id}
                                                    onClick={() => handleSelectResumeFromTop(res.id)}
                                                    className={`w-full flex items-center justify-between rounded px-2 py-1.5 text-left text-[10px] transition-colors cursor-pointer ${activeResume?.id === res.id
                                                        ? "bg-secondary text-foreground font-semibold"
                                                        : "text-muted-foreground hover:bg-secondary/40 hover:text-foreground"
                                                        }`}
                                                >
                                                    <span className="truncate pr-2 font-mono">{res.name}</span>
                                                    <span className="font-mono text-muted-foreground">{res.score}%</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Scan Quick CTA */}
                        <button
                            onClick={() => setCurrentTab("upload")}
                            className="hidden sm:flex h-8 gap-1 rounded-lg btn-primary px-3 text-[10px] transition-all items-center cursor-pointer"
                        >
                            <Plus className="size-3.5" />
                            New Scan
                        </button>

                        {/* Notifications Menu */}
                        <div className="relative">
                            <button
                                onClick={() => setNotificationsOpen(!notificationsOpen)}
                                className="h-8 w-8 rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground flex items-center justify-center relative cursor-pointer"
                            >
                                <Bell className="size-4" />
                                <span className="absolute top-1 right-1 size-1.5 rounded-full bg-neutral-400" />
                            </button>

                            {notificationsOpen && (
                                <div className="absolute right-0 mt-2 w-72 rounded-xl border border-border bg-card p-3 shadow-2xl z-40 text-left space-y-2.5">
                                    <div className="flex justify-between items-center border-b border-border pb-1.5">
                                        <span className="text-[10px] font-mono text-muted-foreground uppercase">Alert Drawer</span>
                                        <span className="text-[9px] text-muted-foreground font-bold flex items-center gap-0.5">
                                            <CheckCircle2 className="size-3" /> Ready
                                        </span>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="rounded border border-border bg-card/30 p-2 text-[10px] leading-normal text-muted-foreground">
                                            <span className="font-semibold text-foreground block">Diagnostics upgraded successfully</span>
                                            Your resume index upgraded by 5 points after closing keyword gaps.
                                        </div>
                                        <div className="rounded border border-border bg-card/30 p-2 text-[10px] leading-normal text-muted-foreground">
                                            <span className="font-semibold text-foreground block">API Model: Claude 3.5 Ready</span>
                                            Roadmaps computed using high accuracy NLP classifiers.
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* --- MAIN PAGE SCROLLABLE CONTENT --- */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-16">
                    {renderActiveView()}
                </div>
            </div>

            {/* --- MOBILE COLLAPSIBLE DRAWER DRAWER --- */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-50 flex lg:hidden bg-background/80 backdrop-blur-sm">
                    <div className="relative w-64 bg-background border-r border-border flex flex-col h-full">
                        {/* Close button inside drawer */}
                        <div className="flex h-16 items-center justify-between px-6 border-b border-border">
                            <div className="flex items-center gap-2">
                                <Layers className="size-4 text-primary" />
                                <span className="text-xs font-semibold tracking-tight">Resume<span className="text-primary">.ai</span></span>
                            </div>
                            <button
                                onClick={() => setMobileMenuOpen(false)}
                                className="p-1.5 rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground"
                            >
                                <X className="size-4.5" />
                            </button>
                        </div>

                        {/* Navigation link elements */}
                        <nav className="flex-1 space-y-1 px-4 py-6">
                            {NAV_ITEMS.map((item) => {
                                const isActive = currentTab === item.value;
                                return (
                                    <button
                                        key={item.value}
                                        onClick={() => {
                                            setCurrentTab(item.value);
                                            setMobileMenuOpen(false);
                                        }}
                                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold text-left transition-colors ${isActive
                                            ? "bg-secondary text-foreground border border-border"
                                            : "text-muted-foreground hover:text-foreground/80"
                                            }`}
                                    >
                                        {item.icon}
                                        {item.label}
                                    </button>
                                );
                            })}
                        </nav>

                        {/* Footer User Info inside mobile drawer */}
                        <div className="border-t border-border p-4 space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-full bg-secondary border border-border flex items-center justify-center font-mono font-bold text-xs text-muted-foreground">
                                    {user.name[0]}
                                </div>
                                <div className="min-w-0">
                                    <h4 className="text-[11px] font-semibold text-foreground truncate">{user.name}</h4>
                                    <span className="text-[9px] text-muted-foreground truncate block mt-0.5">{user.email}</span>
                                </div>
                            </div>
                            <button
                                onClick={handleSignOut}
                                className="w-full h-8 flex items-center gap-2 justify-center rounded-lg border border-border bg-card hover:bg-secondary hover:text-foreground transition-colors text-[10px] font-bold text-muted-foreground"
                            >
                                <LogOut className="size-3.5" />
                                Disconnect Session
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
