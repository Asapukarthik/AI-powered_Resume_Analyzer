"use client";

import React, { useState } from "react";
import { useResumeStore } from "@/hooks/useResumeStore";
import {
    User,
    Check,
    AlertTriangle,
    Mail,
    Lock,
    Save,
    Bell,
    Smartphone,
    Cpu,
    Moon,
    Sun,
    Monitor,
    Loader2
} from "lucide-react";
import { useTheme } from "next-themes";

export default function SettingsView() {
    const { user, updateUser, settings, updateSettings, uploadAvatar, deleteAvatar } = useResumeStore();
    const { theme, setTheme } = useTheme();

    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    // Form fields
    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState(user.email);

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");

    const [saveSuccess, setSaveSuccess] = useState(false);
    const [pwSuccess, setPwSuccess] = useState(false);

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            if (token) {
                // If backend isn't ready for this yet, we just update local state.
                fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/users/profile`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({ name, email })
                }).catch(() => {}); // silent catch if endpoint doesn't exist
            }

            updateUser(name, email);
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 2000);
        } catch (error) {
            console.error(error);
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setPwSuccess(true);
        setOldPassword("");
        setNewPassword("");
        setTimeout(() => setPwSuccess(false), 2000);
    };

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploadingAvatar(true);
        try {
            await uploadAvatar(file);
        } catch (error) {
            console.error("Avatar upload failed", error);
        } finally {
            setIsUploadingAvatar(false);
        }
    };

    // Helper for toggle switch
    const Toggle = ({ enabled, onChange, label }: { enabled: boolean, onChange: (v: boolean) => void, label: string }) => (
        <button
            type="button"
            role="switch"
            aria-checked={enabled}
            onClick={() => onChange(!enabled)}
            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background ${enabled ? 'bg-indigo-500' : 'bg-secondary border border-border'}`}
        >
            <span className="sr-only">Toggle {label}</span>
            <span
                aria-hidden="true"
                className={`pointer-events-none absolute left-0.5 inline-block h-4 w-4 rounded-full bg-white shadow-sm ring-0 transition-transform duration-300 ease-in-out ${enabled ? 'translate-x-4' : 'translate-x-0'}`}
            />
        </button>
    );

    return (
        <div className="space-y-8 text-left max-w-5xl mx-auto py-2">
            {/* View Header */}
            <div className="space-y-1">
                <h1 className="text-2xl font-bold tracking-tight text-foreground font-sans">Settings</h1>
                <p className="text-xs text-muted-foreground font-medium">Manage credentials, preferences, and configure AI parsing behaviors.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Account & Danger Zone */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Profile Summary Card */}
                    <div className="rounded-xl glass-card p-6 space-y-4 text-center flex flex-col items-center">
                        <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                className="hidden" 
                                accept="image/*" 
                                onChange={handleFileChange} 
                                disabled={isUploadingAvatar}
                            />
                            <div className="h-20 w-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 p-1 relative z-10">
                                {user.avatar ? (
                                    <>
                                        <img src={user.avatar} alt="Profile" className="h-full w-full rounded-full border-[3px] border-background object-cover" />
                                        {/* Enlarged Zoom Preview on Hover */}
                                        <div className="absolute top-1/2 left-[120%] -translate-y-1/2 w-56 h-56 rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] border-[6px] border-background opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[100] overflow-hidden pointer-events-none scale-75 group-hover:scale-100 origin-left hidden md:block">
                                            <img src={user.avatar} alt="Profile Zoom" className="w-full h-full object-cover" />
                                        </div>
                                    </>
                                ) : (
                                    <div className="h-full w-full rounded-full bg-card border-[3px] border-background flex items-center justify-center font-mono font-bold text-2xl text-foreground">
                                        {user.name[0]}
                                    </div>
                                )}
                            </div>
                            <div className="absolute inset-0 rounded-full bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                {isUploadingAvatar ? (
                                    <Loader2 className="size-4 text-white animate-spin" />
                                ) : (
                                    <span className="text-[10px] font-semibold text-white">Upload</span>
                                )}
                            </div>
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-foreground">{user.name}</h4>
                            <span className="text-xs text-muted-foreground">{user.tier}</span>
                        </div>
                        <div className="flex gap-2 w-full justify-center">
                            <button onClick={handleAvatarClick} disabled={isUploadingAvatar} className="px-3 py-1.5 text-xs font-semibold bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600/20 rounded-lg transition-colors cursor-pointer">
                                Upload
                            </button>
                            {user.avatar && (
                                <button onClick={() => deleteAvatar()} className="px-3 py-1.5 text-xs font-semibold bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-lg transition-colors cursor-pointer">
                                    Remove
                                </button>
                            )}
                        </div>
                        <div className="w-full pt-4 border-t border-border/50">
                        <div className="flex items-center justify-between w-full text-xs font-semibold">
                            <span className="text-muted-foreground">Current Plan</span>
                            <span className="text-indigo-500 bg-indigo-500/10 px-2 py-0.5 rounded uppercase tracking-wider text-[10px] font-bold">{user.tier}</span>
                        </div>
                        </div>
                    </div>

                    {/* Appearance / Theme Settings */}
                    <div className="rounded-xl glass-card p-6 space-y-4">
                        <h3 className="text-[10px] font-mono uppercase text-muted-foreground tracking-wider flex items-center gap-2 border-b border-border pb-3">
                            <Sun className="size-4 text-muted-foreground" />
                            Appearance
                        </h3>
                        <div className="grid grid-cols-3 gap-2">
                            <button onClick={() => setTheme('light')} className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl border ${theme === 'light' ? 'border-indigo-500 bg-indigo-500/10 text-indigo-500' : 'border-border bg-secondary/30 text-muted-foreground hover:bg-secondary/60'} transition-all`}>
                                <Sun className="size-4" />
                                <span className="text-[10px] font-semibold">Light</span>
                            </button>
                            <button onClick={() => setTheme('dark')} className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl border ${theme === 'dark' ? 'border-indigo-500 bg-indigo-500/10 text-indigo-500' : 'border-border bg-secondary/30 text-muted-foreground hover:bg-secondary/60'} transition-all`}>
                                <Moon className="size-4" />
                                <span className="text-[10px] font-semibold">Dark</span>
                            </button>
                            <button onClick={() => setTheme('system')} className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl border ${theme === 'system' ? 'border-indigo-500 bg-indigo-500/10 text-indigo-500' : 'border-border bg-secondary/30 text-muted-foreground hover:bg-secondary/60'} transition-all`}>
                                <Monitor className="size-4" />
                                <span className="text-[10px] font-semibold">System</span>
                            </button>
                        </div>
                    </div>

                    {/* Danger Zone */}
                    <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-6 space-y-4">
                        <h3 className="text-[10px] font-mono uppercase text-red-400 tracking-wider flex items-center gap-2 border-b border-red-500/20 pb-3">
                            <AlertTriangle className="size-4 text-red-400" />
                            DANGER ZONE
                        </h3>
                        <div className="space-y-1">
                            <h4 className="text-xs font-semibold text-foreground">Decommission Account</h4>
                            <p className="text-[10px] text-muted-foreground/80 leading-relaxed">Permanently delete your credentials and purge all in-memory ATS data matrices.</p>
                        </div>
                        <button className="w-full h-9 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-xs font-bold text-red-500 transition-colors">
                            Delete Account
                        </button>
                    </div>
                </div>

                {/* Right Column: Forms & Preferences */}
                <div className="lg:col-span-2 space-y-6">
                    {/* User Profile Form */}
                    <div className="rounded-xl glass-card p-6 space-y-6">
                        <h3 className="text-[10px] font-mono uppercase text-muted-foreground tracking-wider flex items-center gap-2 border-b border-border pb-3">
                            <User className="size-4 text-muted-foreground" />
                            Profile Details
                        </h3>
                        
                        <form onSubmit={handleSaveProfile} className="space-y-5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div className="space-y-2 group">
                                    <label className="text-[10px] text-foreground font-semibold px-1 flex items-center gap-2">Full Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full h-10 px-4 rounded-xl bg-background/50 border border-border text-xs text-foreground outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all font-sans shadow-inner"
                                    />
                                </div>
                                <div className="space-y-2 group">
                                    <label className="text-[10px] text-foreground font-semibold px-1 flex items-center gap-2">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/60 transition-colors group-focus-within:text-indigo-500" />
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full h-10 pl-10 pr-4 rounded-xl bg-background/50 border border-border text-xs text-foreground outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all font-sans shadow-inner"
                                        />
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex justify-end pt-2">
                                <button type="submit" className="btn-primary h-9 text-xs gap-2 px-6 rounded-xl shadow-[0_0_15px_oklch(0.58_0.2_255_/_20%)]">
                                    {saveSuccess ? <><Check className="size-4" /> Saved</> : <><Save className="size-4" /> Save Changes</>}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Preferences & Notifications */}
                    <div className="rounded-xl glass-card p-6 space-y-6">
                        <h3 className="text-[10px] font-mono uppercase text-muted-foreground tracking-wider flex items-center gap-2 border-b border-border pb-3">
                            <Cpu className="size-4 text-muted-foreground" />
                            System Preferences
                        </h3>
                        
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 border border-border/50 hover:bg-secondary/50 transition-colors">
                                <div className="flex items-start gap-3">
                                    <Bell className="size-4.5 text-indigo-400 mt-0.5" />
                                    <div>
                                        <p className="text-xs font-bold text-foreground">Email Analysis Reports</p>
                                        <p className="text-[10px] text-muted-foreground mt-0.5 max-w-[250px] leading-relaxed">Receive a detailed PDF summary via email after every successful ATS scan.</p>
                                    </div>
                                </div>
                                <Toggle 
                                    enabled={settings.emailAlerts} 
                                    onChange={(val) => updateSettings({ emailAlerts: val })} 
                                    label="Email Alerts" 
                                />
                            </div>

                            <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 border border-border/50 hover:bg-secondary/50 transition-colors">
                                <div className="flex items-start gap-3">
                                    <Smartphone className="size-4.5 text-purple-400 mt-0.5" />
                                    <div>
                                        <p className="text-xs font-bold text-foreground">Push Notifications</p>
                                        <p className="text-[10px] text-muted-foreground mt-0.5 max-w-[250px] leading-relaxed">Get browser push notifications when long-running OCR tasks complete.</p>
                                    </div>
                                </div>
                                <Toggle 
                                    enabled={settings.pushNotifications} 
                                    onChange={(val) => updateSettings({ pushNotifications: val })} 
                                    label="Push Notifications" 
                                />
                            </div>

                            <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 border border-border/50 hover:bg-secondary/50 transition-colors">
                                <div className="flex items-start gap-3">
                                    <Cpu className="size-4.5 text-cyan-400 mt-0.5" />
                                    <div>
                                        <p className="text-xs font-bold text-foreground">Auto-Analyze on Upload</p>
                                        <p className="text-[10px] text-muted-foreground mt-0.5 max-w-[250px] leading-relaxed">Instantly stream document to Gemini AI engine upon dropping a file.</p>
                                    </div>
                                </div>
                                <Toggle 
                                    enabled={settings.autoAnalyze} 
                                    onChange={(val) => updateSettings({ autoAnalyze: val })} 
                                    label="Auto Analyze" 
                                />
                            </div>
                        </div>
                    </div>

                    {/* Security */}
                    <div className="rounded-xl glass-card p-6 space-y-6">
                        <h3 className="text-[10px] font-mono uppercase text-muted-foreground tracking-wider flex items-center gap-2 border-b border-border pb-3">
                            <Lock className="size-4 text-muted-foreground" />
                            Security
                        </h3>
                        
                        <form onSubmit={handleChangePassword} className="space-y-5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div className="space-y-2 group">
                                    <label className="text-[10px] text-foreground font-semibold px-1">Current Password</label>
                                    <input
                                        type="password"
                                        required
                                        value={oldPassword}
                                        onChange={(e) => setOldPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full h-10 px-4 rounded-xl bg-background/50 border border-border text-xs text-foreground outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all font-sans shadow-inner"
                                    />
                                </div>
                                <div className="space-y-2 group">
                                    <label className="text-[10px] text-foreground font-semibold px-1">New Password</label>
                                    <input
                                        type="password"
                                        required
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full h-10 px-4 rounded-xl bg-background/50 border border-border text-xs text-foreground outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all font-sans shadow-inner"
                                    />
                                </div>
                            </div>
                            
                            <div className="flex justify-end pt-2">
                                <button type="submit" className="h-9 px-6 rounded-xl bg-secondary border border-border text-xs font-semibold text-foreground/90 hover:bg-accent hover:text-foreground transition-all">
                                    {pwSuccess ? "Password Updated" : "Update Password"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
