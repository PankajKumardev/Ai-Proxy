"use client";

import Link from "next/link";
import { Github, Mail, Lock, ArrowLeft, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

export function LoginClient() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-6 text-[#fafafa] relative overflow-hidden font-sans">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.04)_0,transparent_50%)]" />

      <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-[#888888] hover:text-white transition-colors text-sm font-medium z-20">
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </Link>

      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="w-full max-w-sm relative z-10"
      >
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2 text-white hover:opacity-80 transition-opacity mb-8">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-white"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg> 
            <span className="font-bold text-lg tracking-widest uppercase">AI Gateway</span>
          </Link>
          <h1 className="text-3xl font-medium tracking-tight text-white mb-2">Welcome back</h1>
          <p className="text-[#a3a3a3] text-sm">Sign in to your account</p>
        </div>
        
        <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-8 shadow-[0_0_80px_rgba(0,0,0,0.8)] relative">

          <form action="/api/auth/signin" method="POST" onSubmit={() => setIsSubmitting(true)}>
            <div className="mb-5">
              <label className="block text-[13px] font-medium text-[#a3a3a3] mb-2 cursor-pointer">
                Email
              </label>
              <div className="relative group/input">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="w-4 h-4 text-[#A3A3A3]" />
                </div>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="you@example.com"
                  className="w-full bg-black border border-white/10 hover:border-white/30 rounded-lg pl-[40px] pr-4 py-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/30 transition-all placeholder:text-[#555555]"
                />
              </div>
            </div>
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <label className="text-[13px] font-medium text-[#a3a3a3] cursor-pointer">
                  Password
                </label>
                <Link href="#" className="text-[12px] text-[#888888] hover:text-white transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="relative group/input">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="w-4 h-4 text-[#A3A3A3]" />
                </div>
                <input
                  type="password"
                  name="password"
                  required
                  placeholder="••••••••"
                  className="w-full bg-black border border-white/10 hover:border-white/30 rounded-lg pl-[40px] pr-4 py-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/30 transition-all placeholder:text-[#555555]"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full relative flex items-center justify-center bg-white text-black border-none rounded-lg py-3 text-sm font-semibold cursor-pointer hover:bg-white/90 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed mb-6 h-[44px]"
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin text-black" />
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          <div className="relative flex items-center py-2 mb-6">
            <div className="flex-grow border-t border-white/10"></div>
            <span className="flex-shrink-0 mx-4 text-[#555555] text-[11px] uppercase tracking-wider font-semibold">Or continue with</span>
            <div className="flex-grow border-t border-white/10"></div>
          </div>

          <button type="button" className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-lg py-3 text-sm font-medium transition-colors">
            <Github className="w-4 h-4" />
            GitHub
          </button>
        </div>
        
        <p className="text-center mt-8 text-[#888888] text-[13px]">
          Don't have an account?{" "}
          <Link href="/signup" className="text-white hover:underline font-medium">
            Sign up free &rarr;
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
