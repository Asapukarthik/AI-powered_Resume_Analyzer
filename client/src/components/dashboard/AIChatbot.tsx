"use client";

import React, { useState, useRef, useEffect } from "react";
import { useResumeStore } from "@/hooks/useResumeStore";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Loader2, Bot, User } from "lucide-react";

export default function AIChatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{ role: "user" | "bot"; content: string }[]>([
        { role: "bot", content: "Hi! I'm Resume.ai Bot. How can I help you with your career or resume today?" }
    ]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { activeResume } = useResumeStore();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = input.trim();
        setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
        setInput("");
        setIsTyping(true);

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chat`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    message: userMsg,
                    resumeId: activeResume?.id || null
                })
            });

            if (!res.ok) {
                throw new Error("Failed to fetch response");
            }

            const data = await res.json();
            setMessages((prev) => [...prev, { role: "bot", content: data.reply }]);
        } catch (error) {
            console.error("Chatbot error:", error);
            setMessages((prev) => [...prev, { role: "bot", content: "Sorry, I'm having trouble connecting right now." }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute bottom-16 right-0 w-80 sm:w-96 h-[500px] max-h-[70vh] bg-card border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-secondary/30">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-primary/20 text-primary rounded-lg">
                                    <Bot className="size-4" />
                                </div>
                                <span className="font-semibold text-sm">Resume.ai Bot</span>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors"
                            >
                                <X className="size-4" />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.map((msg, idx) => (
                                <div
                                    key={idx}
                                    className={`flex items-start gap-2.5 max-w-[85%] ${
                                        msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                                    }`}
                                >
                                    <div
                                        className={`size-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                                            msg.role === "user"
                                                ? "bg-primary text-primary-foreground"
                                                : "bg-secondary text-foreground border border-border"
                                        }`}
                                    >
                                        {msg.role === "user" ? <User className="size-3" /> : <Bot className="size-3" />}
                                    </div>
                                    <div
                                        className={`px-3 py-2 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap ${
                                            msg.role === "user"
                                                ? "bg-primary text-primary-foreground rounded-tr-sm"
                                                : "bg-secondary/50 text-foreground border border-border rounded-tl-sm"
                                        }`}
                                    >
                                        {msg.content}
                                    </div>
                                </div>
                            ))}
                            {isTyping && (
                                <div className="flex items-center gap-2 text-muted-foreground text-xs">
                                    <Loader2 className="size-3 animate-spin" /> Bot is typing...
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-3 border-t border-border bg-secondary/10">
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleSend();
                                }}
                                className="flex items-center gap-2 bg-card border border-border rounded-xl p-1 pr-2"
                            >
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Ask anything..."
                                    className="flex-1 bg-transparent border-none outline-none text-xs px-3 py-2 text-foreground placeholder:text-muted-foreground"
                                />
                                <button
                                    type="submit"
                                    disabled={!input.trim() || isTyping}
                                    className="p-1.5 bg-primary text-primary-foreground rounded-lg disabled:opacity-50 transition-colors"
                                >
                                    <Send className="size-3.5" />
                                </button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <button
                onClick={() => setIsOpen(!isOpen)}
                className="h-12 w-12 rounded-full bg-primary text-primary-foreground shadow-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
            >
                {isOpen ? <X className="size-5" /> : <MessageSquare className="size-5" />}
            </button>
        </div>
    );
}
