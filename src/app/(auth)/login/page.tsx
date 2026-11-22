"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Lock, Mail, ArrowRight, AlertCircle, Loader2 } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to sign in");
        setLoading(false);
        return;
      }

      router.push(from);
      router.refresh();
    } catch {
      setError("An unexpected network error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 rounded-2xl border border-[#222328] bg-[#111113] shadow-2xl space-y-6">
      {error && (
        <div className="flex items-center gap-2.5 p-3.5 rounded-xl border border-red-500/20 bg-red-950/20 text-red-400 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-xs font-medium text-zinc-300 mb-1.5">
            Email address
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="username"
              spellCheck={false}
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              className="w-full bg-[#18191f] border border-[#282930] rounded-xl pl-10 pr-4 py-2.5 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="password" className="block text-xs font-medium text-zinc-300">
              Password
            </label>
            <a
              href="#forgot-password"
              onClick={(e) => {
                e.preventDefault();
                alert("Password recovery link sent if email matches an active account.");
              }}
              className="text-xs text-blue-400 hover:text-blue-300 transition"
            >
              Forgot password?
            </a>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#18191f] border border-[#282930] rounded-xl pl-10 pr-11 py-2.5 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="p-2 text-zinc-400 hover:text-zinc-200 absolute right-1.5 top-1/2 -translate-y-1/2 transition"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl text-sm font-semibold shadow-lg shadow-blue-500/25 transition mt-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Signing In...</span>
            </>
          ) : (
            <>
              <span>Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <div className="text-center text-xs text-zinc-400 pt-2 border-t border-[#1e1f26]">
        Don&apos;t have an account yet?{" "}
        <Link href="/register" className="text-blue-400 hover:text-blue-300 font-medium">
          Create an account
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#09090b] flex flex-col justify-center items-center px-4 py-12 selection:bg-blue-600 selection:text-white">
      {/* Brand Header */}
      <div className="text-center mb-8">
        <Link href="/" className="inline-flex items-center gap-2.5 mb-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xl shadow-blue-500/25 font-bold text-lg">
            ⚡
          </div>
          <span className="font-bold text-2xl tracking-tight text-white">LinkTrace</span>
        </Link>
        <h1 className="text-xl font-bold text-zinc-100 tracking-tight">Sign in to your account</h1>
        <p className="text-xs text-zinc-400 mt-1">Access your workspaces, links, and campaign tracking.</p>
      </div>

      <Suspense fallback={<div className="text-sm text-zinc-400">Loading sign in...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
