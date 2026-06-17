"use client";

import React, { useEffect, useState, memo } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

const DotLottiePlayer = dynamic(
    () =>
        import("@dotlottie/react-player").then(
            (mod) => mod.DotLottiePlayer
        ),
    {
        ssr: false,
    }
);

interface RobotLoaderProps {
    text?: string;
    subtext?: string;
    isCompact?: boolean;
}

const RobotAnimation = memo(function RobotAnimation({
    size,
}: {
    size: string;
}) {
    return (
        <div className={`${size} flex items-center justify-center`}>
            <DotLottiePlayer
                src="/robot.lottie"
                autoplay
                loop
                style={{
                    width: "100%",
                    height: "100%",
                }}
            />
        </div>
    );
});

const AnimatedDots = memo(function AnimatedDots() {
    return (
        <div className="flex items-center gap-1.5 pt-1">
            {[0, 1, 2].map((i) => (
                <motion.span
                    key={i}
                    className="size-2 rounded-full bg-primary"
                    animate={{
                        y: [0, -6, 0],
                    }}
                    transition={{
                        duration: 0.8,
                        repeat: Infinity,
                        delay: i * 0.15,
                        ease: "easeInOut",
                    }}
                />
            ))}
        </div>
    );
});

function RobotLoaderComponent({
    text = "Verifying session...",
    subtext = "Please wait a moment while we process your request.",
    isCompact = false,
}: RobotLoaderProps) {
    const shouldReduceMotion = useReducedMotion();
    const [showDelayMessage, setShowDelayMessage] = useState(false);

    useEffect(() => {
        if (isCompact) return;

        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = "";
        };
    }, [isCompact]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowDelayMessage(true);
        }, 8000);

        return () => clearTimeout(timer);
    }, []);

    if (isCompact) {
        return (
            <div
                role="status"
                aria-live="polite"
                aria-busy="true"
                className="flex flex-col items-center justify-center p-2"
            >
                <span className="sr-only">{text}</span>
                <RobotAnimation size="size-24" />
            </div>
        );
    }

    return (
        <div
            role="status"
            aria-live="polite"
            aria-busy="true"
            className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-background/80 backdrop-blur-md"
        >
            <span className="sr-only">{text}</span>

            {/* Background Glow */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5" />

                <motion.div
                    className="absolute inset-0"
                    animate={
                        shouldReduceMotion
                            ? {}
                            : {
                                opacity: [0.3, 0.6, 0.3],
                            }
                    }
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                    }}
                >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.15),transparent_70%)]" />
                </motion.div>
            </div>

            <AnimatePresence>
                <motion.div
                    initial={
                        shouldReduceMotion
                            ? false
                            : {
                                opacity: 0,
                                scale: 0.95,
                            }
                    }
                    animate={{
                        opacity: 1,
                        scale: 1,
                    }}
                    exit={
                        shouldReduceMotion
                            ? undefined
                            : {
                                opacity: 0,
                                scale: 0.95,
                            }
                    }
                    transition={{
                        duration: 0.3,
                    }}
                    className="relative z-10 mx-4 flex w-full max-w-md flex-col items-center space-y-6 rounded-3xl border border-border bg-card/60 p-8 text-center shadow-2xl backdrop-blur-xl"
                >
                    {/* Card Glow */}
                    <div className="absolute -inset-0.5 -z-10 rounded-3xl bg-gradient-to-r from-indigo-500/20 to-purple-500/20 blur-xl opacity-70" />

                    {/* Robot */}
                    <RobotAnimation size="size-44" />

                    {/* Text */}
                    <div className="space-y-2">
                        <h3 className="text-sm font-bold tracking-tight text-foreground">
                            {text}
                        </h3>

                        {subtext && (
                            <p className="max-w-xs text-[11px] leading-relaxed text-muted-foreground">
                                {subtext}
                            </p>
                        )}

                        {showDelayMessage && (
                            <p className="pt-2 text-[10px] text-muted-foreground">
                                This is taking a little longer than expected...
                            </p>
                        )}
                    </div>

                    {!shouldReduceMotion && <AnimatedDots />}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}

export default memo(RobotLoaderComponent);