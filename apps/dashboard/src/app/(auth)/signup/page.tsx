import Link from "next/link"
import { redirect } from "next/navigation"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Sign Up — AI Gateway",
}

const prisma = new PrismaClient()

async function registerUser(formData: FormData) {
  "use server"
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email || !password || password.length < 8) return

  const passwordHash = await bcrypt.hash(password, 12)
  await prisma.user.create({
    data: { email, passwordHash },
  })
  redirect("/login?registered=1")
}

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A] px-6 text-[#fafafa]">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2 text-white hover:opacity-80 transition-opacity mb-8">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-white"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg> 
            <span className="font-bold text-lg tracking-widest uppercase">AI Gateway</span>
          </Link>
          <h1 className="text-3xl font-medium tracking-tighter text-white mb-2">Create your account</h1>
          <p className="text-[#a3a3a3] text-sm">Free forever. No credit card required.</p>
        </div>
        
        <form
          action={registerUser}
          className="bg-[#111111] border border-white/10 rounded-2xl p-8 shadow-2xl"
        >
          <div className="mb-5">
            <label className="block text-[13px] font-medium text-[#a3a3a3] mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              placeholder="you@example.com"
              className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/30 transition-all placeholder:text-[#555555]"
            />
          </div>
          <div className="mb-8">
            <label className="block text-[13px] font-medium text-[#a3a3a3] mb-2">
              Password <span className="text-[#555555] font-normal">(min 8 chars)</span>
            </label>
            <input
              type="password"
              name="password"
              required
              minLength={8}
              placeholder="••••••••"
              className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/30 transition-all placeholder:text-[#555555]"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-white text-black border-none rounded-lg py-3 text-sm font-semibold cursor-pointer hover:bg-white/90 transition-colors shadow-lg shadow-white/5"
          >
            Create Free Account
          </button>
        </form>
        
        <p className="text-center mt-8 text-[#888888] text-[13px]">
          Already have an account?{" "}
          <Link href="/login" className="text-white hover:underline font-medium">
            Sign in &rarr;
          </Link>
        </p>
      </div>
    </div>
  )
}
