import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import { cn } from "@/lib/utils";
import { ResumeProvider } from "@/hooks/useResumeStore";

const geistSans = Geist({
    subsets: ["latin"],
    variable: "--font-sans",
});

const geistMono = Geist_Mono({
    subsets: ["latin"],
    variable: "--font-mono",
});

export const metadata = {
    title: "AI Resume Analyzer",
    description: "AI-powered ATS Resume Analyzer",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html
            lang="en"
            className={cn("dark font-sans", geistSans.variable, geistMono.variable)}
            style={{ colorScheme: "dark" }}
        >
            <body className="bg-background text-foreground antialiased selection:bg-primary/25 selection:text-foreground min-h-screen">
                <ResumeProvider>{children}</ResumeProvider>
            </body>
        </html>
    );
}
