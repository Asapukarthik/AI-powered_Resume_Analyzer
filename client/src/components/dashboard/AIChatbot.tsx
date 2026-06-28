"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useResumeStore } from "@/hooks/useResumeStore";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Loader2, User, Sparkles, Target, TrendingUp, Mic, Search, Map, Copy, Check, Trash2, Download } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// Mascot image paths (served from /public/assets/)
const mascotIdle = "/assets/mascot-idle.png";
const mascotHappy = "/assets/mascot-happy.png";
const mascotThinking = "/assets/mascot-thinking.png";
const mascotTyping = "/assets/mascot-typing.png";
const mascotConfused = "/assets/mascot-confused.png";
const mascotLoading = "/assets/mascot-loading.png";

type MascotState = "idle" | "thinking" | "typing" | "happy" | "confused" | "loading";

const mascotMap: Record<MascotState, string> = {
    idle: mascotIdle,
    happy: mascotHappy,
    thinking: mascotThinking,
    typing: mascotTyping,
    confused: mascotConfused,
    loading: mascotLoading,
};

const SUGGESTED_ACTIONS = [
    { icon: <Target className="size-3" />, label: "Analyze Resume", message: "Analyze my resume and give me a detailed breakdown of its strengths and weaknesses." },
    { icon: <TrendingUp className="size-3" />, label: "Improve ATS Score", message: "How can I improve my ATS score and make my resume more compatible with applicant tracking systems?" },
    { icon: <Mic className="size-3" />, label: "Interview Questions", message: "Generate interview questions based on my resume that I should prepare for." },
    { icon: <Search className="size-3" />, label: "Missing Skills", message: "What key skills am I missing that would make my profile stronger for my target role?" },
    { icon: <Map className="size-3" />, label: "Career Roadmap", message: "Create a personalized career roadmap for me based on my current skills and experience." },
];

export default function AIChatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{ role: "user" | "bot"; content: string }[]>([]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [mascotState, setMascotState] = useState<MascotState>("idle");
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const { activeResume } = useResumeStore();

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
            setTimeout(() => inputRef.current?.focus(), 300);
        }
    }, [messages, isOpen]);

    // Load from local storage on mount
    useEffect(() => {
        const saved = localStorage.getItem("resume_ai_chat_history");
        if (saved) {
            try {
                setMessages(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse chat history");
            }
        }
    }, []);

    // Save to local storage when messages change
    useEffect(() => {
        localStorage.setItem("resume_ai_chat_history", JSON.stringify(messages));
    }, [messages]);

    // Global Keyboard Shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen) {
                setIsOpen(false);
            }
            if (e.ctrlKey && e.key === "/") {
                e.preventDefault();
                setIsOpen((prev) => !prev);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen]);

    useEffect(() => {
        return () => { if (resetTimerRef.current) clearTimeout(resetTimerRef.current); };
    }, []);

    const setMascotWithReset = (state: MascotState, resetAfterMs?: number) => {
        setMascotState(state);
        if (resetAfterMs) {
            if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
            resetTimerRef.current = setTimeout(() => setMascotState("idle"), resetAfterMs);
        }
    };

    const sendMessage = async (text: string) => {
        if (!text.trim()) return;
        const userMsg = text.trim();
        setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
        setInput("");
        setIsTyping(true);
        setMascotWithReset("thinking");

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chat`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ message: userMsg, history: messages, resumeId: activeResume?.id || null })
            });
            setMascotState("typing");
            const data = await res.json();
            setMessages((prev) => [...prev, { role: "bot", content: data.reply || "Sorry, I couldn't get a response." }]);
            setMascotWithReset("happy", 2500);
        } catch {
            setMessages((prev) => [...prev, { role: "bot", content: "Sorry, I'm having trouble connecting right now. Please try again." }]);
            setMascotWithReset("confused", 2500);
        } finally {
            setIsTyping(false);
        }
    };

    const handleSend = () => sendMessage(input);
    const handleSuggestion = (msg: string) => sendMessage(msg);

    const handleCopy = (text: string, index: number) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    const handleClearChat = () => {
        if (confirm("Are you sure you want to clear the chat history?")) {
            setMessages([]);
        }
    };

    const handleExport = () => {
        if (messages.length === 0) return;
        const textContent = messages.map(m => `${m.role === 'user' ? 'You' : 'Resume.ai Bot'}:\n${m.content}\n\n`).join('---\n\n');
        const blob = new Blob([textContent], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `chat-export-${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const currentMascot = mascotMap[mascotState];

    return (
        <>
            {/* Backdrop */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        key="backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px]"
                        onClick={() => setIsOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* Glassmorphic Sidebar Panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        key="panel"
                        initial={{ x: "100%", opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: "100%", opacity: 0 }}
                        transition={{ type: "spring", damping: 30, stiffness: 300 }}
                        className="fixed right-0 top-0 h-full w-[380px] max-w-[95vw] z-50 flex flex-col"
                        style={{
                            background: "var(--card)",
                            backdropFilter: "blur(40px)",
                            WebkitBackdropFilter: "blur(40px)",
                            borderLeft: "1px solid var(--border)",
                            boxShadow: "-20px 0 60px -15px rgba(0,0,0,0.25)",
                        }}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-border shrink-0">
                            <div className="flex items-center gap-3">
                                {/* Reactive Mascot in Header */}
                                <div className="relative h-14 w-14 shrink-0">
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={mascotState}
                                            initial={{ opacity: 0, scale: 0.85 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.85 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute inset-0"
                                        >
                                            <Image
                                                src={currentMascot}
                                                alt={`Mascot ${mascotState}`}
                                                fill
                                                className="object-contain drop-shadow-md"
                                                priority
                                            />
                                        </motion.div>
                                    </AnimatePresence>
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-foreground tracking-tight">Resume AI Assistant</p>
                                    <p className="text-[10px] text-muted-foreground font-medium">Career Coach & ATS Expert</p>
                                    <p className="text-[9px] text-emerald-500 font-semibold mt-0.5">● Online · Powered by Gemini</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                                <button
                                    onClick={handleExport}
                                    title="Export Chat"
                                    className="h-7 w-7 rounded-lg border border-transparent text-muted-foreground hover:text-foreground hover:bg-secondary/60 flex items-center justify-center transition-colors cursor-pointer"
                                >
                                    <Download className="size-3.5" />
                                </button>
                                <button
                                    onClick={handleClearChat}
                                    title="Clear Chat"
                                    className="h-7 w-7 rounded-lg border border-transparent text-muted-foreground hover:text-red-400 hover:bg-red-500/10 flex items-center justify-center transition-colors cursor-pointer"
                                >
                                    <Trash2 className="size-3.5" />
                                </button>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    title="Close (Esc)"
                                    className="h-7 w-7 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-secondary/60 flex items-center justify-center transition-colors cursor-pointer ml-1"
                                >
                                    <X className="size-4" />
                                </button>
                            </div>
                        </div>

                        {/* Active Resume Banner */}
                        {activeResume && (
                            <div className="mx-4 mt-3 px-3 py-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center gap-2 shrink-0">
                                <Sparkles className="size-3.5 text-indigo-500 shrink-0" />
                                <p className="text-[10px] text-indigo-400 font-medium truncate">
                                    Active context: <span className="text-indigo-300 font-bold">{activeResume.name}</span>
                                </p>
                            </div>
                        )}

                        {/* Messages or Suggested Actions */}
                        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 [scrollbar-width:thin]">
                            {messages.length === 0 ? (
                                /* Suggested Actions */
                                <div className="space-y-3 pt-2">
                                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-1">Quick Actions</p>
                                    {SUGGESTED_ACTIONS.map((action) => (
                                        <button
                                            key={action.label}
                                            onClick={() => handleSuggestion(action.message)}
                                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-border bg-secondary/40 hover:bg-secondary/70 hover:border-indigo-500/30 text-left transition-all group cursor-pointer"
                                        >
                                            <span className="h-7 w-7 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0 group-hover:bg-indigo-500/20 transition-colors">
                                                {action.icon}
                                            </span>
                                            <span className="text-xs font-medium text-foreground/80 group-hover:text-foreground transition-colors">{action.label}</span>
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                /* Chat Messages */
                                <>
                                    {messages.map((msg, idx) => (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className={`flex items-end gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                                        >
                                            {/* Avatar */}
                                            <div className={`h-7 w-7 rounded-full flex items-center justify-center shrink-0 overflow-hidden ${
                                                msg.role === "user"
                                                    ? "bg-gradient-to-br from-indigo-500 to-purple-600"
                                                    : "bg-secondary border border-border"
                                            }`}>
                                                {msg.role === "user" ? (
                                                    <User className="size-3.5 text-white" />
                                                ) : (
                                                    <div className="relative h-full w-full">
                                                        <Image src={mascotIdle} alt="Bot" fill className="object-contain" />
                                                    </div>
                                                )}
                                            </div>
                                            {/* Bubble */}
                                            <div className="relative group max-w-[78%]">
                                                <div className={`px-3.5 py-2.5 text-xs leading-relaxed whitespace-pre-wrap ${
                                                    msg.role === "user"
                                                        ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-2xl rounded-br-sm shadow-md shadow-indigo-500/15"
                                                        : "bg-secondary/60 text-foreground border border-border rounded-2xl rounded-bl-sm"
                                                }`}>
                                                    {msg.role === "user" ? (
                                                        msg.content
                                                    ) : (
                                                        <ReactMarkdown 
                                                            remarkPlugins={[remarkGfm]}
                                                            components={{
                                                                p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                                                                ul: ({node, ...props}) => <ul className="list-disc pl-4 mb-2 space-y-1" {...props} />,
                                                                ol: ({node, ...props}) => <ol className="list-decimal pl-4 mb-2 space-y-1" {...props} />,
                                                                li: ({node, ...props}) => <li className="pl-1" {...props} />,
                                                                h3: ({node, ...props}) => <h3 className="text-[13px] font-bold mt-3 mb-1.5 text-indigo-100" {...props} />,
                                                                h4: ({node, ...props}) => <h4 className="font-semibold mt-2 mb-1 text-indigo-200" {...props} />,
                                                                strong: ({node, ...props}) => <strong className="font-bold text-indigo-300" {...props} />,
                                                                code: ({node, inline, ...props}: any) => inline 
                                                                    ? <code className="bg-black/30 px-1.5 py-0.5 rounded text-[11px] font-mono text-indigo-300" {...props} />
                                                                    : <code className="block bg-black/40 p-2.5 rounded-lg text-[11px] font-mono text-muted-foreground overflow-x-auto mb-2 border border-white/5" {...props} />,
                                                            }}
                                                        >
                                                            {msg.content}
                                                        </ReactMarkdown>
                                                    )}
                                                </div>
                                                
                                                {/* Copy Button (only for bot) */}
                                                {msg.role === "bot" && (
                                                    <button
                                                        onClick={() => handleCopy(msg.content, idx)}
                                                        className={`absolute -right-8 top-1/2 -translate-y-1/2 p-1.5 rounded-md border border-border bg-secondary/80 text-muted-foreground hover:text-foreground shadow-sm transition-all opacity-0 group-hover:opacity-100 ${copiedIndex === idx ? 'text-green-400 border-green-500/30 bg-green-500/10' : ''}`}
                                                        title="Copy message"
                                                    >
                                                        {copiedIndex === idx ? <Check className="size-3" /> : <Copy className="size-3" />}
                                                    </button>
                                                )}
                                            </div>
                                        </motion.div>
                                    ))}

                                    {/* Typing indicator */}
                                    {isTyping && (
                                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-end gap-2.5">
                                            <div className="h-7 w-7 rounded-full bg-secondary border border-border flex items-center justify-center shrink-0 overflow-hidden">
                                                <div className="relative h-full w-full">
                                                    <Image src={mascotTyping} alt="Typing" fill className="object-contain" />
                                                </div>
                                            </div>
                                            <div className="px-3.5 py-3 bg-secondary/60 border border-border rounded-2xl rounded-bl-sm flex items-center gap-1.5">
                                                <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0ms" }} />
                                                <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "150ms" }} />
                                                <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "300ms" }} />
                                            </div>
                                        </motion.div>
                                    )}
                                    <div ref={messagesEndRef} />
                                </>
                            )}
                        </div>

                        {/* Input */}
                        <div className="p-4 border-t border-border shrink-0">
                            <form
                                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                                className="flex items-center gap-2 bg-background/50 border border-border rounded-xl p-1 pr-1.5 focus-within:border-indigo-500/50 focus-within:ring-1 focus-within:ring-indigo-500/20 transition-all"
                            >
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Ask about your career..."
                                    className="flex-1 bg-transparent border-none outline-none text-xs px-3 py-2 text-foreground placeholder:text-muted-foreground"
                                />
                                <button
                                    type="submit"
                                    disabled={!input.trim() || isTyping}
                                    className="h-8 w-8 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-lg flex items-center justify-center disabled:opacity-40 hover:from-indigo-400 hover:to-purple-500 transition-all shadow-sm cursor-pointer"
                                >
                                    {isTyping ? <Loader2 className="size-3.5 animate-spin" /> : <Send className="size-3.5" />}
                                </button>
                            </form>
                            <p className="text-[9px] text-muted-foreground/50 text-center mt-2">Powered by Gemini · Context-aware resume analysis</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Mascot Trigger */}
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 z-50 h-20 w-20 cursor-pointer border-none bg-transparent outline-none p-0 mascot-float-idle"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.92 }}
                animate={isOpen ? { scale: 0.88 } : { scale: 1 }}
                transition={{ type: "spring", stiffness: 380, damping: 22 }}
                aria-label="Open AI Career Assistant"
            >
                <div
                    className="relative h-20 w-20"
                    style={{
                        filter: isOpen
                            ? "drop-shadow(0 0 8px rgba(99,102,241,0.3))"
                            : "drop-shadow(0 0 14px rgba(99,102,241,0.55)) drop-shadow(0 4px 12px rgba(0,0,0,0.25))"
                    }}
                >
                    <Image
                        src={isOpen ? mascotHappy : mascotIdle}
                        alt="AI Career Assistant"
                        width={80}
                        height={80}
                        className="object-contain w-full h-full"
                        priority
                    />
                </div>
            </motion.button>
        </>
    );
}
