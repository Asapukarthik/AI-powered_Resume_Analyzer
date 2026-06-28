import "./globals.css";
import { Inter, Roboto_Mono } from "next/font/google";
import { cn } from "@/lib/utils";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { ThemeProvider } from "@/components/ui/ThemeProvider";
import { Toaster } from "react-hot-toast";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-sans",
});

const robotoMono = Roboto_Mono({
    subsets: ["latin"],
    variable: "--font-mono",
});

import type { Metadata } from "next";

export const metadata: Metadata = {
    metadataBase: new URL(
        process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
    ),
    title: {
        default: "Resume.ai — AI-Powered ATS Resume Analyzer",
        template: "%s | Resume.ai",
    },
    description: "Analyze your resume with AI, beat ATS filters, get instant career coaching, and land more interviews. Built for modern job seekers.",
    keywords: ["resume analyzer", "ATS score", "AI resume", "job search", "career coach", "resume builder"],
    authors: [{ name: "Resume.ai" }],
    creator: "Resume.ai",
    icons: {
        icon: [
            { url: "/favicon.png", type: "image/png" },
            { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
            { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
        ],
        apple: [
            { url: "/favicon.png", sizes: "180x180", type: "image/png" },
        ],
        shortcut: "/favicon.png",
    },
    openGraph: {
        type: "website",
        title: "Resume.ai — AI-Powered ATS Resume Analyzer",
        description: "Analyze your resume with AI, beat ATS filters, get instant career coaching.",
        siteName: "Resume.ai",
        images: [{ url: "/icon-512.png", width: 512, height: 512, alt: "Resume.ai" }],
    },
    twitter: {
        card: "summary",
        title: "Resume.ai — AI-Powered ATS Resume Analyzer",
        description: "Analyze your resume with AI, beat ATS filters, get instant career coaching.",
        images: ["/icon-512.png"],
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Note: We use process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID. Ensure this is set in your .env.local
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

    if (!clientId) {
        console.warn(
            "Warning: NEXT_PUBLIC_GOOGLE_CLIENT_ID is not set. Google OAuth login will be disabled."
        );
    }

    return (
        <html
            lang="en"
            className={cn("font-sans", inter.variable, robotoMono.variable)}
            suppressHydrationWarning
            data-scroll-behavior="smooth"
        >
            <body className="bg-background text-foreground antialiased selection:bg-primary/25 selection:text-foreground min-h-screen">
                <GoogleOAuthProvider clientId={clientId}>
                    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                        {children}
                        <Toaster position="top-right" />
                    </ThemeProvider>
                </GoogleOAuthProvider>
            </body>
        </html>
    );
}
