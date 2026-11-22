import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Globe2,
  Lock,
  Megaphone,
  MousePointerClick,
  Sparkles,
  Zap,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#09090b] text-[#fafafa] flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      {/* Navigation */}
      <header className="border-b border-[#222328] bg-[#0c0d10]/70 backdrop-blur-md sticky top-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/25 font-bold">
              ⚡
            </div>
            <span className="font-bold text-lg tracking-tight">LinkTrace</span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="text-sm font-medium text-zinc-300 hover:text-white transition"
            >
              Dashboard
            </Link>
            <Link
              href="/dashboard"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium shadow-lg shadow-blue-500/25 transition"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-6xl mx-auto px-6 pt-20 pb-24 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-blue-500/30 bg-blue-950/30 text-blue-300 text-xs font-medium mb-8">
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          <span>Next-Generation SaaS Link Platform v1.0</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-[1.15]">
          Track Every Click. <br />
          <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">
            Understand Every Campaign.
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          LinkTrace turns ordinary URLs into high-performance, trackable short links with real-time attribution, UTM generation, and privacy-conscious analytics.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/dashboard"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-semibold shadow-xl shadow-blue-500/25 transition"
          >
            <span>Launch Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/utm"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 bg-[#14151a] hover:bg-[#1a1b22] border border-[#222328] hover:border-zinc-700 text-zinc-300 hover:text-white rounded-xl text-sm font-semibold transition"
          >
            <span>Try UTM Builder</span>
          </Link>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24 text-left">
          <div className="p-6 rounded-2xl border border-[#222328] bg-[#111113]/80 hover:border-zinc-700 transition">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-4">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-lg text-white mb-2">Ultra-Fast Redirects</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Engineered for sub-300ms p95 redirect latency with non-blocking click tracking event recording.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-[#222328] bg-[#111113]/80 hover:border-zinc-700 transition">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-lg text-white mb-2">Campaign Attribution</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Group links under campaigns and understand exactly which channel delivers the highest volume of visits.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-[#222328] bg-[#111113]/80 hover:border-zinc-700 transition">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mb-4">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-lg text-white mb-2">Privacy-First Tracking</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              No permanent raw IP logging. We estimate unique visitors responsibly without intrusive cross-site cookies.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#222328] bg-[#0c0d10] py-8 px-6 text-center text-xs text-zinc-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 LinkTrace SaaS. Open-source link management platform.</p>
          <div className="flex items-center gap-6">
            <a
              href="https://github.com/Hugoagfarizky/linktrace"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition"
            >
              GitHub Repository
            </a>
            <Link href="/dashboard" className="hover:text-white transition">
              App
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
