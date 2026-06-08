import React from 'react';

export default function MeshGradientBackground() {
    return (
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none w-full h-full">
            {/* Dynamic Glassmorphic Gradient Orbs */}

            {/* 
            <div className="absolute top-[20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-gradient-to-bl from-blue-400/40 to-cyan-300/40 dark:from-blue-900/40 dark:to-cyan-900/40 blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-blob animation-delay-2000" /> */}

            <div className="absolute bottom-[-20%] left-[20%] w-[70%] h-[70%] rounded-full bg-gradient-to-tr from-indigo-400/30 to-purple-400/30 dark:from-indigo-900/40 dark:to-purple-900/40 blur-[150px] mix-blend-multiply dark:mix-blend-screen animate-blob animation-delay-4000" />

            {/* Subtle Noise Texture overlay */}
            <div className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03] mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
        </div>
    );
}
