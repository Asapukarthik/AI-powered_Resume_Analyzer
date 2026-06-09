"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useResumeStore } from "@/hooks/useResumeStore";
import { motion } from "framer-motion";
import BackgroundParticles from "@/components/layout/BackgroundParticles";
import VercelBackground from "@/components/layout/VercelBackground";
import {
    ArrowRight,
    FileText,
    Sparkles,
    Cpu,
    Target,
    Award,
    CheckCircle2,
    MessageSquare,
    ChevronDown,
    Shield,
    Layers,
} from "lucide-react";

import { FaGithub, FaLinkedin } from "react-icons/fa";

// Reusable animation variants
const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15
        }
    }
};

export default function LandingPage() {
    const router = useRouter();
    const { setCurrentTab } = useResumeStore();
    const [atsScore, setAtsScore] = useState<number>(55);
    const [faqOpen, setFaqOpen] = useState<Record<number, boolean>>({});

    const toggleFaq = (index: number) => {
        setFaqOpen(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    const handleTryDemo = () => {
        // Go straight to dashboard with overview loaded
        setCurrentTab("overview");
        router.push("/dashboard");
    };

    // FAQ list
    const FAQS = [
        {
            q: "What is an ATS, and why does my resume score matter?",
            a: "Applicant Tracking Systems (ATS) are software applications used by 99% of Fortune 500 companies to screen resumes automatically. If your resume does not contain the right keywords, structure, or semantic patterns, it will be automatically filtered out before reaching a human recruiter. Our analyzer simulates these exact parsers to guarantee your file gets past the filters."
        },
        {
            q: "Is my personal data and resume content secure?",
            a: "Absolutely. We prioritize high confidentiality. Your resume files are parsed in-memory using strict end-to-end encryption. Your information is never sold, shared, or used to train public LLM models."
        },
        {
            q: "How does the Job Description Matching work?",
            a: "You simply paste the text of any job posting next to your resume. Our AI system compares the core technologies, qualifications, soft skills, and experiences. It calculates a matching index and lists exactly what keywords and skills you need to add to rank in the top 5% of applicants."
        },
        {
            q: "Does this support PDF and DOCX formats?",
            a: "Yes, we fully support standard professional document formats, including PDF (.pdf) and Word documents (.docx) up to 5MB."
        }
    ];

    const FEATURES = [
        {
            icon: <Award className="size-6 text-primary" />,
            title: "ATS Score Analysis",
            desc: "Get an instant mathematical score representing how searchable and parseable your resume is to enterprise applicant parsers."
        },
        {
            icon: <FileText className="size-6 text-primary" />,
            title: "Resume Parsing",
            desc: "Instantly decompose unstructured document files into clean database records containing contact, work history, and education."
        },
        {
            icon: <Sparkles className="size-6 text-primary" />,
            title: "AI Suggestions",
            desc: "Receive professional, actionable recommendations detailing exactly how to optimize grammar, bullet points, and metrics."
        },
        {
            icon: <Target className="size-6 text-primary" />,
            title: "Job Description Matching",
            desc: "Compare your resume against any job description to instantly calculate your semantic match percentage and missing keywords."
        },
        {
            icon: <MessageSquare className="size-6 text-primary" />,
            title: "Interview Questions",
            desc: "Practice tailored HR, technical, and project questions generated directly from your resume strengths and job focus."
        },
        {
            icon: <Cpu className="size-6 text-primary" />,
            title: "Skill Gap Detection",
            desc: "Map out missing technologies, identify career roadmaps, and receive curated technical learning recommendations."
        }
    ];

    return (
        <main className="relative min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary/25">
            <VercelBackground />
            <BackgroundParticles />

            <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-background/70 backdrop-blur-xl transition-all duration-300">
                <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="flex items-center gap-2.5"
                    >
                        <div className="flex size-7 items-center justify-center rounded-md bg-primary/15 border border-primary/25">
                            <Layers className="size-4 text-primary" />
                        </div>
                        <span className="text-sm font-semibold tracking-tight">
                            Resume<span className="text-primary">.ai</span>
                        </span>
                    </motion.div>

                    <motion.nav
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground"
                    >
                        <a href="#features" className="hover:text-foreground transition-colors">Features</a>
                        <a href="#how-it-works" className="hover:text-foreground transition-colors">How it works</a>
                        <a href="#preview" className="hover:text-foreground transition-colors">Score Optimizer</a>
                        <a href="#faq" className="hover:text-foreground transition-colors">FAQs</a>
                    </motion.nav>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="flex items-center gap-3"
                    >
                        <Link
                            href="/login"
                            className="rounded-lg px-4 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Sign In
                        </Link>
                        <Link
                            href="/register"
                            className="rounded-lg btn-primary px-4 py-1.5 text-sm active:translate-y-[1px] transition-all"
                        >
                            Get Started
                        </Link>
                    </motion.div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative z-10 mx-auto max-w-5xl px-4 pt-20 pb-16 text-center sm:px-6 lg:px-8 lg:pt-32">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer}
                    className="flex flex-col items-center"
                >
                    <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
                        <Sparkles className="size-3.5 text-foreground animate-pulse" />
                        <span>Revolutionizing modern hiring prep with AI</span>
                    </motion.div>

                    <motion.h1 variants={fadeInUp} className="mt-6 text-4xl font-bold tracking-tight sm:text-6xl sm:leading-[1.1]">
                        <span className="bg-gradient-to-b from-foreground via-foreground/90 to-muted-foreground bg-clip-text text-transparent">
                            AI-Powered Resume
                        </span>
                        <br />
                        <span className="bg-gradient-to-r from-primary via-blue-400 to-primary bg-clip-text text-transparent">
                            Analyzer
                        </span>
                    </motion.h1>

                    <motion.p variants={fadeInUp} className="mx-auto mt-6 max-w-2xl text-md text-muted-foreground sm:text-lg leading-relaxed">
                        Instantly optimize your resume to beat Applicant Tracking Systems (ATS). Receive actionable AI suggestions, detect skill gaps, and auto-generate tailormade interview questions.
                    </motion.p>

                    <motion.div variants={fadeInUp} className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href="/login"
                            className="group flex items-center gap-1.5 rounded-lg btn-primary px-6 py-3 text-sm transition-all active:translate-y-[1px] shadow-[0_0_24px_oklch(0.58_0.2_255_/_25%)]"
                        >
                            Upload Resume
                            <ArrowRight className="size-4 group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                        <button
                            onClick={handleTryDemo}
                            className="rounded-lg border border-border bg-secondary/30 backdrop-blur-md px-6 py-3 text-sm font-medium text-foreground/80 hover:bg-accent/50 hover:text-foreground transition-all active:translate-y-[1px]"
                        >
                            Try Live Demo
                        </button>
                    </motion.div>
                </motion.div>

                {/* Dashboard Preview Illustration */}
                <motion.div
                    initial={{ opacity: 0, y: 60 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" as const }}
                    className="relative mt-20 rounded-xl border border-border bg-card/40 p-2 sm:p-4 backdrop-blur shadow-[0_24px_80px_oklch(0.58_0.2_255_/_12%)]"
                >
                    <div className="rounded-lg border border-border bg-background/90 p-4 sm:p-6 text-left">
                        {/* Mock App Header */}
                        <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
                            <div className="flex items-center gap-3">
                                <span className="h-3 w-3 rounded-full bg-red-500/80" />
                                <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
                                <span className="h-3 w-3 rounded-full bg-green-500/80" />
                                <span className="text-xs text-muted-foreground font-mono ml-2">Console / Dashboard</span>
                            </div>
                            <div className="rounded border border-border px-2 py-0.5 text-[10px] text-muted-foreground">
                                Model: Claude 3.5 Sonnet
                            </div>
                        </div>

                        {/* Mock App Content */}
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                            <div className="rounded-lg border border-border bg-card/80 p-4 flex flex-col items-center justify-center text-center">
                                <span className="text-xs text-muted-foreground font-medium">ATS Match Score</span>
                                <div className="relative mt-4 flex items-center justify-center h-28 w-28 rounded-full border-4 border-border border-t-primary">
                                    <span className="text-2xl font-bold font-mono">87%</span>
                                </div>
                                <span className="mt-4 text-xs text-green-400 font-medium flex items-center gap-1">
                                    <CheckCircle2 className="size-3" /> Excellent ATS Readiness
                                </span>
                            </div>

                            <div className="lg:col-span-2 rounded-lg border border-border bg-card/80 p-4">
                                <span className="text-xs text-muted-foreground font-medium">Keyword Analysis Breakdown</span>
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {["Kubernetes", "Docker", "AWS", "Terraform", "CI/CD", "Python"].map((k) => (
                                        <span key={k} className="rounded bg-secondary border border-border px-2.5 py-1 text-xs text-foreground/80">
                                            {k} <span className="text-[10px] text-green-400 ml-1">✓</span>
                                        </span>
                                    ))}
                                    {["Rust", "Azure", "SOC2"].map((k) => (
                                        <span key={k} className="rounded bg-secondary/20 border border-dashed border-border px-2.5 py-1 text-xs text-muted-foreground">
                                            {k} <span className="text-[10px] text-red-500 ml-1">✗</span>
                                        </span>
                                    ))}
                                </div>
                                <div className="mt-6 border-t border-border pt-4">
                                    <span className="text-xs text-muted-foreground block mb-2">Automated Recommendation</span>
                                    <p className="text-xs text-muted-foreground leading-relaxed">
                                        Your experience highlights strong infrastructure engineering, but adding GCP and security standards (SOC2) will instantly elevate you to the top tier of candidates.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* Features Section */}
            <section id="features" className="relative z-10 border-t border-border bg-background/60 py-24 overflow-hidden">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={fadeInUp}
                        className="mx-auto max-w-3xl text-center"
                    >
                        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                            Engineered for Technical Job Seekers
                        </h2>
                        <p className="mt-4 text-muted-foreground text-md sm:text-lg">
                            Ditch simple, basic templates. Leverage analytical developer-level dashboards designed for maximum clarity and optimization.
                        </p>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={staggerContainer}
                        className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
                    >
                        {FEATURES.map((feat, i) => (
                            <motion.div
                                key={i}
                                variants={fadeInUp}
                                className="glass-card glass-card-hover rounded-xl p-6 flex flex-col gap-4 text-left"
                            >
                                <div className="inline-flex size-10 items-center justify-center rounded-lg border border-primary/20 bg-primary/10">
                                    {feat.icon}
                                </div>
                                <h3 className="text-md font-semibold text-foreground">{feat.title}</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">{feat.desc}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* How It Works Section */}
            <section id="how-it-works" className="relative z-10 border-t border-border bg-card/30 py-24 overflow-hidden">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={fadeInUp}
                        className="mx-auto max-w-3xl text-center"
                    >
                        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                            Four Steps to Landing the Role
                        </h2>
                        <p className="mt-4 text-muted-foreground text-md">
                            A seamless path to preparing and polishing your applications.
                        </p>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={staggerContainer}
                        className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-4"
                    >
                        {[
                            { step: "01", title: "Upload PDF", desc: "Drag and drop your current resume. Our strict security safeguards protect your credentials." },
                            { step: "02", title: "Analyze Score", desc: "View your ATS alignment rating, detailed breakdowns, and semantic structure indicators." },
                            { step: "03", title: "Compare Job", desc: "Paste your target job post to identify exact missing keywords and matching margins." },
                            { step: "04", title: "Prepare Prep", desc: "Utilize dynamic AI roadmap logs and practice customizable interview mockups." }
                        ].map((item, idx) => (
                            <motion.div key={idx} variants={fadeInUp} className="relative flex flex-col gap-3 text-left">
                                <span className="font-mono text-3xl font-bold text-primary/25">{item.step}</span>
                                <h3 className="text-md font-semibold text-foreground">{item.title}</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Interactive ATS Score Optimizer Section */}
            <section id="preview" className="relative z-10 border-t border-border bg-background/80 py-24 overflow-hidden">
                <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 items-center">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-100px" }}
                            variants={{
                                hidden: { opacity: 0, x: -40 },
                                visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
                            }}
                            className="text-left"
                        >
                            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                                Instantly Elevate Your Application Appeal
                            </h2>
                            <p className="mt-4 text-muted-foreground text-md leading-relaxed">
                                Slide the score optimizer to see how fixing semantic structure, adding missing system parameters, and aligning keywords directly elevates your visibility threshold.
                            </p>

                            <div className="mt-8 space-y-6">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs text-muted-foreground font-mono">
                                        <span>SIMULATED ATS OPTIMIZATION</span>
                                        <span>{atsScore}%</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="40"
                                        max="99"
                                        value={atsScore}
                                        onChange={(e) => setAtsScore(parseInt(e.target.value))}
                                        className="w-full h-1 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                                    />
                                </div>

                                <div className="rounded-lg border border-border bg-card p-4 space-y-3 font-mono text-xs">
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground">Recruiter Verdict:</span>
                                        <span className={atsScore >= 80 ? "text-green-400 font-bold" : atsScore >= 65 ? "text-yellow-400 font-bold" : "text-red-500 font-bold"}>
                                            {atsScore >= 80 ? "IMMEDIATE INTERVIEW" : atsScore >= 65 ? "BORDERLINE REVIEW" : "AUTO-REJECTED"}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground">Applicant Rating:</span>
                                        <span className="text-foreground">
                                            {atsScore >= 80 ? "Top 3% of Applicants" : atsScore >= 65 ? "Top 15% of Applicants" : "Standard Pool"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-100px" }}
                            variants={{
                                hidden: { opacity: 0, scale: 0.8 },
                                visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: "easeOut" as const, delay: 0.2 } }
                            }}
                            className="relative flex justify-center items-center"
                        >
                            <div className="h-64 w-64 rounded-full border border-border bg-card/50 flex flex-col justify-center items-center shadow-[0_0_60px_oklch(0.58_0.2_255_/_15%)]">
                                <span className="text-muted-foreground text-xs font-mono tracking-widest uppercase">ATS Score</span>
                                <span className="text-6xl font-bold font-mono tracking-tighter text-glow mt-2">{atsScore}</span>
                                <div className="mt-4 rounded-full px-3 py-1 bg-secondary text-[10px] text-muted-foreground border border-border flex items-center gap-1.5">
                                    <span className={`h-2 h-2 w-2 rounded-full ${atsScore >= 80 ? "bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.5)]" : atsScore >= 65 ? "bg-yellow-400 animate-ping" : "bg-red-500"}`} />
                                    <span>Status Updated</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="relative z-10 border-t border-border bg-card/40 py-24 overflow-hidden">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={fadeInUp}
                        className="mx-auto max-w-3xl text-center"
                    >
                        <h2 className="text-3xl font-bold tracking-tight">
                            Loved by Leading Engineers
                        </h2>
                        <p className="mt-4 text-muted-foreground text-md">
                            Read how developers use our toolkit to crack recruitment loops.
                        </p>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={staggerContainer}
                        className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3 text-left"
                    >
                        {[
                            {
                                comment: "Before this, my resume was getting zero hits. The keywords breakdown showed me that the parsers couldn't scan my complex 2-column layout. Redesigned, uploaded, and within a week I had recruiter calls.",
                                name: "David L.",
                                role: "Senior Site Reliability Engineer"
                            },
                            {
                                comment: "The interview questions generated directly from my background were scary-accurate. They matched exactly what was brought up in my backend technical rounds at Stripe.",
                                name: "Sarah K.",
                                role: "Full-Stack React Developer"
                            },
                            {
                                comment: "The skills gap roadmap is highly structured. Instead of random courses, it gave me a clear, logical progression to learn Kubernetes operators. Incredibly helpful.",
                                name: "Marcus P.",
                                role: "Infrastructure Architect"
                            }
                        ].map((test, index) => (
                            <motion.div key={index} variants={fadeInUp} className="glass-card rounded-xl p-6 border border-border/60 bg-card/40 flex flex-col justify-between">
                                <p className="text-sm text-foreground/80 italic leading-relaxed">&ldquo;{test.comment}&rdquo;</p>
                                <div className="mt-6 border-t border-border pt-4 flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-full bg-secondary border border-border flex items-center justify-center text-xs font-mono font-bold text-muted-foreground">
                                        {test.name[0]}
                                    </div>
                                    <div>
                                        <div className="text-xs font-semibold text-foreground">{test.name}</div>
                                        <div className="text-[10px] text-muted-foreground">{test.role}</div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* FAQ Section */}
            <section id="faq" className="relative z-10 border-t border-border bg-background/60 py-24 overflow-hidden">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={fadeInUp}
                        className="text-center"
                    >
                        <h2 className="text-3xl font-bold tracking-tight">
                            Frequently Asked Questions
                        </h2>
                        <p className="mt-4 text-muted-foreground text-md">
                            Everything you need to know about the platform.
                        </p>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={staggerContainer}
                        className="mt-16 space-y-4"
                    >
                        {FAQS.map((faq, idx) => (
                            <motion.div
                                key={idx}
                                variants={fadeInUp}
                                className="rounded-xl border border-border bg-card/40 backdrop-blur-md overflow-hidden transition-all duration-300"
                            >
                                <button
                                    onClick={() => toggleFaq(idx)}
                                    className="flex w-full items-center justify-between px-6 py-5 text-left text-sm font-semibold hover:bg-secondary/20 transition-all"
                                >
                                    <span className="text-foreground">{faq.q}</span>
                                    <ChevronDown
                                        className={`size-4 text-muted-foreground transition-transform duration-300 ${faqOpen[idx] ? "rotate-180" : ""}`}
                                    />
                                </button>
                                <div
                                    className={`transition-all duration-300 ease-in-out ${faqOpen[idx] ? "max-h-60 border-t border-border py-5 px-6" : "max-h-0 py-0 overflow-hidden"}`}
                                >
                                    <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>
            {/*footer section*/}
            <footer className="relative z-10 border-t border-border bg-background/90 py-16 text-muted-foreground text-sm">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                    {/* Main Footer Content */}
                    <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-4">

                        {/* Brand */}
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-2">
                                <Layers className="size-5 text-primary" />
                                <span className="text-lg font-bold tracking-tight">
                                    Resume<span className="text-primary">.AI</span>
                                </span>
                            </div>

                            <p className="max-w-[250px] leading-relaxed">
                                AI-powered resume analysis platform helping candidates
                                optimize resumes, improve ATS scores, identify skill gaps,
                                and increase interview opportunities.
                            </p>
                        </div>

                        {/* Product */}
                        <div>
                            <h4 className="mb-4 font-semibold text-foreground">
                                Product
                            </h4>

                            <ul className="space-y-3">
                                <li>
                                    <a
                                        href="#features"
                                        className="hover:text-foreground transition-colors"
                                    >
                                        Resume Analysis
                                    </a>
                                </li>

                                <li>
                                    <a
                                        href="#features"
                                        className="hover:text-foreground transition-colors"
                                    >
                                        ATS Score
                                    </a>
                                </li>

                                <li>
                                    <a
                                        href="#features"
                                        className="hover:text-foreground transition-colors"
                                    >
                                        Skill Gap Detection
                                    </a>
                                </li>

                                <li>
                                    <a
                                        href="#features"
                                        className="hover:text-foreground transition-colors"
                                    >
                                        Job Match Insights
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* Security */}
                        <div>
                            <h4 className="mb-4 font-semibold text-foreground">
                                Security
                            </h4>

                            <ul className="space-y-3">
                                <li className="flex items-center gap-2">
                                    <Shield className="size-4" />
                                    Data Privacy
                                </li>

                                <li>Secure File Processing</li>

                                <li>No Resume Storage</li>

                                <li>
                                    <a
                                        href="/terms"
                                        className="hover:text-foreground transition-colors"
                                    >
                                        Terms & Conditions
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* Resources */}
                        <div>
                            <h4 className="mb-4 font-semibold text-foreground">
                                Resources
                            </h4>

                            <ul className="space-y-3">
                                <li>
                                    <a
                                        href="#"
                                        className="hover:text-foreground transition-colors"
                                    >
                                        ATS Guide
                                    </a>
                                </li>

                                <li>
                                    <a
                                        href="#"
                                        className="hover:text-foreground transition-colors"
                                    >
                                        Resume Tips
                                    </a>
                                </li>

                                <li>
                                    <a
                                        href="#"
                                        className="hover:text-foreground transition-colors"
                                    >
                                        Career Resources
                                    </a>
                                </li>

                                <li>
                                    <a
                                        href="#"
                                        className="hover:text-foreground transition-colors"
                                    >
                                        Developer Documentation
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Bottom Footer */}
                    <div className="mt-12 flex flex-col items-center justify-between gap-6 border-t border-border pt-8 sm:flex-row">

                        <p className="text-center sm:text-left">
                            © {new Date().getFullYear()} Resume.AI. All rights reserved.
                        </p>

                        <div className="flex items-center gap-6 text-xl">

                            <a
                                href="https://github.com/Asapukarthik"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="GitHub"
                                className="transition-all duration-300 hover:scale-110 hover:text-foreground"
                            >
                                <FaGithub />
                            </a>

                            <a
                                href="https://www.linkedin.com/in/venkata-veera-hanuma-karthik-asapu-78ba6a256/"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="LinkedIn"
                                className="transition-all duration-300 hover:scale-110 hover:text-foreground"
                            >
                                <FaLinkedin />
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </main>
    );
}