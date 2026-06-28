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
import CoverLetterView from "@/components/dashboard/CoverLetterView";
import AIChatbot from "@/components/dashboard/AIChatbot";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { AnimatePresence, motion } from "framer-motion";
import RobotLoader from "@/components/ui/RobotLoader";
import { toast } from "react-hot-toast";

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
    Loader2,
    Menu,
    X,
    Bell,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
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
        updateSettings,
        clearStore,
        setAvatar
    } = useResumeStore();

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [resumeSelectorOpen, setResumeSelectorOpen] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [authLoading, setAuthLoading] = useState(true);


    useEffect(() => {
        let mounted = true;
        const verifyAuth = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                router.push("/login");
                return;
            }

            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });

                if (!res.ok) {
                    throw new Error("Invalid token");
                }

                const data = await res.json();
                if (!mounted) return;
                updateUser(data.name, data.email);

                // Bug 6 fix: Sync avatar from backend on every page load
                if (data.avatar) {
                    setAvatar(data.avatar);
                }

                if (data.settings) {
                    updateSettings({
                        emailAlerts: data.settings.emailAlerts ?? true,
                        autoAnalyze: data.settings.autoAnalyze ?? true,
                        model: data.settings.model ?? "gpt-4o"
                    });
                }

                setIsAuthenticated(true);
            } catch (error) {
                console.error(error);
                localStorage.removeItem("token");
                router.push("/login");
            } finally {
                setAuthLoading(false);
            }
        };


        verifyAuth();
        return () => {
            mounted = false;
        };
    }, []);



    // useEffect(() => {
    //     const handleClickOutside = () => {
    //         setNotificationsOpen(false);
    //         setUserMenuOpen(false);
    //         setResumeSelectorOpen(false);
    //     };

    //     document.addEventListener("click", handleClickOutside);

    //     return () => {
    //         document.removeEventListener("click", handleClickOutside);
    //     };
    // }, []);
    // Dynamic Navigation links
    const NAV_ITEMS = [
        { label: "Dashboard", value: "overview", icon: <LayoutDashboard className="size-4" /> },
        { label: "Upload Resume", value: "upload", icon: <Upload className="size-4" /> },
        { label: "Resume History", value: "history", icon: <History className="size-4" /> },
        { label: "ATS Reports", value: "reports", icon: <Award className="size-4" /> },
        { label: "AI Suggestions", value: "skills", icon: <Sparkles className="size-4" /> },
        { label: "Job Matcher", value: "matcher", icon: <Briefcase className="size-4" /> },
        { label: "Cover Letter", value: "coverletter", icon: <FileText className="size-4" /> },
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
        toast.loading("Disconnecting session...", { id: "signout" });
        setTimeout(() => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            clearStore();
            toast.success("Successfully logged out", { id: "signout" });
            router.replace("/login");
        }, 1000);
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
            case "coverletter":
                return <CoverLetterView />;
            case "settings":
                return <SettingsView />;
            default:
                return <OverviewView />;
        }
    };


    if (authLoading) {
        return (
            <RobotLoader
                text="Verifying session..."
                subtext="Checking authentication credentials and syncing workspace configuration..."
            />
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return (
        <main className="relative h-screen bg-background text-foreground flex overflow-hidden selection:bg-primary/25">
            <VercelBackground />
            <BackgroundParticles />

            {/* --- DESKTOP SIDEBAR NAVIGATION --- */}
            <aside className={`hidden lg:flex flex-col border-r border-border bg-background/40 backdrop-blur-xl shrink-0 relative z-20 transition-[width] duration-300 ease-in-out will-change-[width] overflow-hidden ${isSidebarCollapsed ? "w-20" : "w-60"}`}>
                {/* Collapse Toggle */}
                <button
                    onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                    className="absolute -right-3 top-6 bg-secondary border border-border text-muted-foreground hover:text-foreground rounded-full p-1 z-30 shadow-md cursor-pointer"
                >
                    {isSidebarCollapsed ? <ChevronRight className="size-3.5" /> : <ChevronLeft className="size-3.5" />}
                </button>

                {/* Branding Header */}
                <div className={`flex h-16 items-center px-6 border-b border-border transition-all overflow-hidden ${isSidebarCollapsed ? "justify-center px-0" : "gap-2"}`}>
                    <Layers className="size-5 text-indigo-600 shrink-0" />
                    {!isSidebarCollapsed && (
                        <span className="text-sm font-bold tracking-tight text-foreground whitespace-nowrap">Resume<span className="text-indigo-600">.ai</span></span>
                    )}
                </div>

                {/* Main Link Options */}
                <nav className="flex-1 space-y-2 px-2 py-6 overflow-y-auto overflow-x-hidden">
                    {NAV_ITEMS.map((item) => {
                        const isActive = currentTab === item.value;
                        return (
                            <button
                                key={item.value}
                                title={isSidebarCollapsed ? item.label : undefined}
                                onClick={() => setCurrentTab(item.value)}
                                className={`w-full flex items-center py-2.5 text-xs font-semibold transition-all relative cursor-pointer ${isActive
                                    ? "bg-indigo-50/70 text-indigo-600 dark:bg-indigo-950/20 dark:text-indigo-400 border-l-2 border-indigo-600 dark:border-indigo-400"
                                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/40 border-l-2 border-transparent"
                                    } ${isSidebarCollapsed ? "justify-center px-0" : "gap-3 px-4 rounded-r-lg"}`}
                            >
                                {item.icon}
                                {!isSidebarCollapsed && <span className="whitespace-nowrap">{item.label}</span>}
                            </button>
                        );
                    })}
                </nav>



                {/* Sidebar User Profile at bottom */}
                <div className="border-t border-border/60 p-3 relative">
                    {/* User Dropdown Popover */}
                    {userMenuOpen && (
                        <div className={`absolute bottom-full mb-2 ${isSidebarCollapsed ? "left-2 w-48" : "left-3 right-3"} rounded-xl border border-border bg-card p-1.5 shadow-2xl z-40 text-left`}>
                            <div className="px-2.5 py-2 border-b border-border/60 mb-1">
                                <h4 className="text-xs font-semibold text-foreground truncate">{user.name}</h4>
                                <span className="text-[10px] text-muted-foreground truncate block mt-0.5">{user.email}</span>
                            </div>
                            <button
                                onClick={() => { setUserMenuOpen(false); setCurrentTab("settings"); }}
                                className="w-full flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:bg-secondary/60 hover:text-foreground transition-colors cursor-pointer"
                            >
                                <Settings className="size-3.5" /> Settings
                            </button>
                            <button
                                onClick={handleSignOut}
                                className="w-full flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium text-red-500 hover:bg-red-500/10 transition-colors mt-1 cursor-pointer"
                            >
                                <LogOut className="size-3.5" /> Disconnect Session
                            </button>
                        </div>
                    )}

                    <button
                        onClick={() => { setUserMenuOpen(!userMenuOpen); setNotificationsOpen(false); }}
                        className={`w-full flex items-center hover:bg-secondary/50 rounded-xl transition-all duration-200 cursor-pointer ${isSidebarCollapsed ? "justify-center p-1.5" : "p-2 gap-3"}`}
                    >
                        <div className="h-8 w-8 rounded-full bg-indigo-600/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs shrink-0 shadow-inner overflow-hidden">
                            {user?.avatar ? (
                                <img src={user.avatar} alt="Avatar" className="h-full w-full object-cover" />
                            ) : (
                                user?.name?.charAt(0)?.toUpperCase() || "U"
                            )}
                        </div>
                        {!isSidebarCollapsed && (
                            <div className="flex-1 min-w-0 text-left">
                                <h4 className="text-[11px] font-semibold text-foreground truncate">{user.name}</h4>
                                <span className="text-[9px] text-muted-foreground truncate block mt-0.5">{user.email}</span>
                            </div>
                        )}
                        {!isSidebarCollapsed && (
                            <ChevronDown className={`size-3 text-muted-foreground transition-transform duration-200 ${userMenuOpen ? "rotate-180" : ""}`} />
                        )}
                    </button>
                </div>
            </aside>

            {/* --- RIGHT CONTENT PANEL --- */}
            <div className="flex-1 flex flex-col min-w-0 min-h-0 relative z-10 overflow-hidden">
                {/* --- STICKY TOP NAVBAR --- */}
                <header className="sticky top-0 z-30 w-full flex h-16 shrink-0 items-center justify-between border-b border-border bg-background/40 backdrop-blur-xl px-4 sm:px-6">
                    {/* Mobile Hamburger Drawer Menu Toggle */}
                    <div className="flex items-center gap-3 lg:hidden">
                        <button
                            onClick={() => setMobileMenuOpen(true)}
                            className="p-1.5 rounded-lg border border-border glass-card text-muted-foreground hover:text-foreground cursor-pointer"
                            aria-label="Open navigation menu"
                            title="Open menu"
                        >
                            <Menu className="size-4" />
                        </button>
                        <div className="flex items-center gap-1.5">
                            <Layers className="size-4 text-indigo-600" />
                            <span className="text-xs font-semibold tracking-tight text-foreground">Resume<span className="text-indigo-600">.ai</span></span>
                        </div>
                    </div>

                    {/* Search Bar / Input (Desktop only) */}
                    <div className="hidden lg:flex items-center gap-3 flex-1 max-w-md">
                        <div className="relative w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/60" />
                            <input
                                type="text"
                                placeholder="Search anything..."
                                className="w-full h-9 pl-9 pr-4 rounded-xl border border-border bg-background/30 focus:bg-background/60 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 text-xs transition-all placeholder:text-muted-foreground/60 outline-none"
                            />
                        </div>
                    </div>

                    {/* Quick Access Tools */}
                    <div className="flex items-center gap-3">
                        {/* Dynamic Resume Selector Dropdown */}
                        {resumes.length > 0 && (
                            <div className="relative">
                                <button
                                    onClick={() => setResumeSelectorOpen(!resumeSelectorOpen)}
                                    className="h-8 gap-1.5 rounded-lg border border-border glass-card/80 px-3 text-[10px] font-semibold text-foreground/80 hover:text-foreground hover:border-border transition-all flex items-center cursor-pointer"
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
                            className="hidden sm:flex h-9 gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white px-4 text-xs font-semibold shadow-lg shadow-indigo-600/10 transition-all items-center cursor-pointer border-none"
                        >
                            <Upload className="size-3.5" />
                            Upload New Resume
                        </button>

                        {/* Notifications Menu */}
                        <div className="relative">
                            <button
                                onClick={() => { setNotificationsOpen(!notificationsOpen); setUserMenuOpen(false); }}
                                className="h-9 w-9 rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground flex items-center justify-center relative cursor-pointer hover:bg-secondary/40 transition-colors"
                                aria-label="View notifications"
                                title="Notifications"
                            >
                                <Bell className="size-4" />
                                <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-rose-500 border border-card ring-1 ring-rose-500/20" />
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

                        <div className="hidden sm:block ml-2">
                            <ThemeToggle />
                        </div>
                    </div>
                </header>

                {/* --- MAIN PAGE SCROLLABLE CONTENT --- */}
                <div className="flex-1 overflow-y-auto w-full [scrollbar-gutter:stable]">
                    <div className="mx-auto max-w-[1600px] p-6">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentTab}
                                initial={{
                                    opacity: 0,
                                    y: 20,
                                }}
                                animate={{
                                    opacity: 1,
                                    y: 0,
                                }}
                                exit={{
                                    opacity: 0,
                                    y: -20,
                                }}
                                transition={{
                                    duration: 0.25,
                                }}
                            >
                                {renderActiveView()}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* --- MOBILE COLLAPSIBLE DRAWER DRAWER --- */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-50 flex lg:hidden bg-background/80 backdrop-blur-sm">
                    <div className="relative w-64 bg-background border-r border-border flex flex-col h-full">
                        {/* Close button inside drawer */}
                        <div className="flex h-16 items-center justify-between px-6 border-b border-border">
                            <div className="flex items-center gap-2">
                                <Layers className="size-4 text-indigo-600" />
                                <span className="text-xs font-semibold tracking-tight">Resume<span className="text-indigo-600">.ai</span></span>
                            </div>
                            <button
                                onClick={() => setMobileMenuOpen(false)}
                                className="p-1.5 rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground"
                                aria-label="Close navigation menu"
                                title="Close menu"
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
                                            ? "bg-indigo-50/70 text-indigo-600 dark:bg-indigo-950/20 dark:text-indigo-400 border-l-2 border-indigo-600 dark:border-indigo-400"
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
                                <div className="h-8 w-8 rounded-full bg-secondary border border-border flex items-center justify-center font-mono font-bold text-xs text-muted-foreground overflow-hidden">
                                    {user?.avatar ? (
                                        <img src={user.avatar} alt="Avatar" className="h-full w-full object-cover" />
                                    ) : (
                                        user?.name?.charAt(0)?.toUpperCase() || "U"
                                    )}
                                </div>
                                <div className="min-w-0">
                                    <h4 className="text-[11px] font-semibold text-foreground truncate">{user.name}</h4>
                                    <span className="text-[9px] text-muted-foreground truncate block mt-0.5">{user.email}</span>
                                </div>
                            </div>
                            <button
                                onClick={handleSignOut}
                                className="w-full h-8 flex items-center gap-2 justify-center rounded-lg border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 hover:text-red-600 transition-colors text-[10px] font-bold text-red-500"
                            >
                                <LogOut className="size-3.5" />
                                Disconnect Session
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Global AI Chatbot */}
            <AIChatbot />
        </main>
    );
}
