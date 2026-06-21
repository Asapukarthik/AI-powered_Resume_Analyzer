"use client";

import { useEffect, useState } from "react";

interface AnimatedCounterProps {
    value: number;
    duration?: number;
    className?: string;
    suffix?: string;
}

export default function AnimatedCounter({ value, duration = 1.5, className = "", suffix = "" }: AnimatedCounterProps) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let startTime: number | null = null;
        let animationFrameId: number;

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            
            // Ease out quartic function for a smooth slow-down at the end
            const easeOutQuart = 1 - Math.pow(1 - Math.min(progress / (duration * 1000), 1), 4);
            
            const currentCount = Math.round(easeOutQuart * value);
            setCount(currentCount);

            if (progress < duration * 1000) {
                animationFrameId = requestAnimationFrame(animate);
            } else {
                setCount(value);
            }
        };

        animationFrameId = requestAnimationFrame(animate);
        
        return () => cancelAnimationFrame(animationFrameId);
    }, [value, duration]);

    return (
        <span className={className}>
            {count}{suffix}
        </span>
    );
}
