"use client";

import React, { useState } from "react";
import { useResumeStore } from "@/hooks/useResumeStore";
import { 
    User, 
    Bell, 
    Shield, 
    Cpu, 
    Check,
    AlertTriangle,
    Mail,
    Lock,
    Save
} from "lucide-react";

export default function SettingsView() {
    const { user, updateUser, settings, updateSettings } = useResumeStore();
    
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
            const res = await fetch("http://localhost:3001/api/users/profile", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ name, email })
            });
            if (!res.ok) throw new Error("Failed to save profile");
            
            updateUser(name, email);
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 2000);
        } catch (error) {
            console.error(error);
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("http://localhost:3001/api/users/profile", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ password: newPassword })
            });
            if (!res.ok) throw new Error("Failed to change password");

            setOldPassword("");
            setNewPassword("");
            setPwSuccess(true);
            setTimeout(() => setPwSuccess(false), 2000);
        } catch (error) {
            console.error(error);
        }
    };

    const handleUpdateSettings = async (newSettings: Partial<typeof settings>) => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("http://localhost:3001/api/users/settings", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(newSettings)
            });
            if (!res.ok) throw new Error("Failed to update settings");
            
            updateSettings(newSettings);
        } catch (error) {
            console.error(error);
        }
    };


    return (
        <div className="space-y-8 text-left max-w-4xl mx-auto py-2">
            {/* View Header */}
            <div className="space-y-1">
                <h1 className="text-2xl font-bold tracking-tight text-foreground font-sans">Settings</h1>
                <p className="text-xs text-muted-foreground font-medium">Manage user credentials, security systems, and global analytics models.</p>
            </div>

            {/* Split Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left Sidebar Info Card */}
                <div className="md:col-span-1 space-y-4">
                    <div className="rounded-xl glass-card p-5 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-full bg-secondary border border-border flex items-center justify-center font-mono font-bold text-xs text-muted-foreground">
                                {user.name[0]}
                            </div>
                            <div className="min-w-0">
                                <h4 className="text-xs font-semibold text-foreground truncate">{user.name}</h4>
                                <span className="text-[9px] text-muted-foreground truncate block mt-0.5">{user.email}</span>
                            </div>
                        </div>
                        <div className="rounded bg-secondary border border-border p-2 text-center text-[10px] font-mono text-muted-foreground">
                            Current Plan: <span className="text-foreground font-bold">{user.tier}</span>
                        </div>
                    </div>
                </div>

                {/* Right Form Panels */}
                <div className="md:col-span-2 space-y-8">
                    {/* User profile edits */}
                    <div className="rounded-xl glass-card p-6 space-y-5">
                        <h3 className="text-[10px] font-mono uppercase text-muted-foreground tracking-wider flex items-center gap-2 border-b border-border pb-3">
                            <User className="size-4 text-muted-foreground" />
                            USER DETAILS
                        </h3>

                        <form onSubmit={handleSaveProfile} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[9px] text-muted-foreground font-mono uppercase">Full Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full h-9 px-3 rounded-lg bg-secondary/50 border border-border text-xs text-foreground outline-none focus:border-neutral-700 transition-all font-sans"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[9px] text-muted-foreground font-mono uppercase">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground/70" />
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full h-9 pl-9 pr-3 rounded-lg bg-secondary/50 border border-border text-xs text-foreground outline-none focus:border-neutral-700 transition-all font-sans"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between items-center pt-2">
                                <span className="text-[9px] text-muted-foreground max-w-[200px] leading-relaxed">
                                    Profile picture can be configured inside gravatar.
                                </span>
                                <button
                                    type="submit"
                                    className="btn-primary h-8 text-xs gap-1.5 px-4 transition-all flex items-center cursor-pointer shadow-sm active:translate-y-[1px]"
                                >
                                    {saveSuccess ? (
                                        <>
                                            <Check className="size-3.5" /> Saved
                                        </>
                                    ) : (
                                        <>
                                            <Save className="size-3.5" /> Save Profile
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Change Password Panel */}
                    <div className="rounded-xl glass-card p-6 space-y-5">
                        <h3 className="text-[10px] font-mono uppercase text-muted-foreground tracking-wider flex items-center gap-2 border-b border-border pb-3">
                            <Lock className="size-4 text-muted-foreground" />
                            CHANGE PASSWORD
                        </h3>

                        <form onSubmit={handleChangePassword} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[9px] text-muted-foreground font-mono uppercase">Current Password</label>
                                    <input
                                        type="password"
                                        required
                                        value={oldPassword}
                                        onChange={(e) => setOldPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full h-9 px-3 rounded-lg bg-secondary/50 border border-border text-xs text-foreground outline-none focus:border-neutral-700 transition-all"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[9px] text-muted-foreground font-mono uppercase">New Password</label>
                                    <input
                                        type="password"
                                        required
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full h-9 px-3 rounded-lg bg-secondary/50 border border-border text-xs text-foreground outline-none focus:border-neutral-700 transition-all"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end pt-2">
                                <button
                                    type="submit"
                                    className="h-8 rounded-lg bg-secondary border border-border text-xs font-semibold text-foreground/80 hover:bg-accent hover:text-foreground px-4 transition-colors cursor-pointer"
                                >
                                    {pwSuccess ? "Password Updated" : "Update Password"}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Platform Preferences & Model Selector */}
                    <div className="rounded-xl glass-card p-6 space-y-5">
                        <h3 className="text-[10px] font-mono uppercase text-muted-foreground tracking-wider flex items-center gap-2 border-b border-border pb-3">
                            <Cpu className="size-4 text-muted-foreground" />
                            ANALYTICS PREFERENCES
                        </h3>

                        {/* Model selector */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="space-y-0.5">
                                <h4 className="text-xs font-semibold text-foreground">Active AI Model Model</h4>
                                <p className="text-[10px] text-muted-foreground">Configure parameters used to run compliance matching.</p>
                            </div>
                            <select
                                value={settings.model}
                                onChange={(e) => handleUpdateSettings({ model: e.target.value })}
                                className="h-8 px-3 rounded-lg bg-secondary border border-border text-xs text-foreground/80 outline-none focus:border-neutral-700 cursor-pointer"
                            >
                                <option value="gpt-4o">OpenAI GPT-4o</option>
                                <option value="claude-3-5">Anthropic Claude 3.5 Sonnet</option>
                                <option value="llama-3">Meta Llama 3</option>
                            </select>
                        </div>

                        {/* Slide checks */}
                        <div className="space-y-4 pt-4 border-t border-border">
                            {/* Auto parse toggle */}
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <h4 className="text-xs font-semibold text-foreground">Auto Scan Files</h4>
                                    <p className="text-[10px] text-muted-foreground">Automatically trigger full parsing diagnostic chains after drag uploads.</p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={settings.autoAnalyze}
                                    onChange={(e) => handleUpdateSettings({ autoAnalyze: e.target.checked })}
                                    className="size-4 rounded bg-secondary border border-border accent-primary cursor-pointer"
                                />
                            </div>

                            {/* Email updates */}
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <h4 className="text-xs font-semibold text-foreground">Email System Alerts</h4>
                                    <p className="text-[10px] text-muted-foreground">Send email updates when compliance profiles improve.</p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={settings.emailAlerts}
                                    onChange={(e) => handleUpdateSettings({ emailAlerts: e.target.checked })}
                                    className="size-4 rounded bg-secondary border border-border accent-primary cursor-pointer"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Account management */}
                    <div className="rounded-xl border border-border bg-card p-6 space-y-4">
                        <h3 className="text-[10px] font-mono uppercase text-muted-foreground tracking-wider flex items-center gap-2 border-b border-border pb-3">
                            <AlertTriangle className="size-4 text-muted-foreground" />
                            CRITICAL SYSTEM OPTIONS
                        </h3>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="space-y-0.5">
                                <h4 className="text-xs font-semibold text-foreground">Decommission Account</h4>
                                <p className="text-[10px] text-muted-foreground">Delete credentials and completely wipe all parsed PDF uploads from in-memory systems.</p>
                            </div>
                            <button
                                onClick={() => {
                                    if (confirm("Are you sure you want to delete your account? This action is immediate and irreversible.")) {
                                        alert("Account deleted.");
                                    }
                                }}
                                className="h-8 rounded-lg bg-secondary border border-border text-xs font-semibold text-muted-foreground hover:bg-accent px-4 transition-colors shrink-0 cursor-pointer"
                            >
                                Delete Account
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
