import "./globals.css";
import { Outfit, Roboto_Mono } from "next/font/google";
import { cn } from "@/lib/utils";
import { ResumeProvider } from "@/hooks/useResumeStore";
import { GoogleOAuthProvider } from "@react-oauth/google";

const outfit = Outfit({
    subsets: ["latin"],
    variable: "--font-sans",
});

const robotoMono = Roboto_Mono({
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
    // Note: We use process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID. Ensure this is set in your .env.local
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

    if (!clientId) {
        throw new Error(
            "NEXT_PUBLIC_GOOGLE_CLIENT_ID is missing"
        );
    }

    return (
        <html
            lang="en"
            className={cn("dark font-sans", outfit.variable, robotoMono.variable)}
            style={{ colorScheme: "dark" }}
        >
            <body className="bg-background text-foreground antialiased selection:bg-primary/25 selection:text-foreground min-h-screen">
                <GoogleOAuthProvider clientId={clientId}>
                    <ResumeProvider>{children}</ResumeProvider>
                </GoogleOAuthProvider>
            </body>
        </html>
    );
}
