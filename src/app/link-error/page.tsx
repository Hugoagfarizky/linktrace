import { Suspense } from "react";
import Link from "next/link";
import { AlertCircle, Clock, Link2Off, ArrowLeft } from "lucide-react";

function LinkErrorContent({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; code?: string }>;
}) {
  return (
    <Suspense fallback={<div className="text-zinc-500 text-sm">Loading status...</div>}>
      <LinkErrorView searchParams={searchParams} />
    </Suspense>
  );
}

async function LinkErrorView({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; code?: string }>;
}) {
  const params = await searchParams;
  const type = params.type || "not-found";
  const code = params.code ? `/${params.code}` : "";

  const config = {
    "not-found": {
      icon: Link2Off,
      title: "Short Link Not Found",
      color: "text-red-400 bg-red-950/20 border-red-500/20",
      description: `The tracking link ${code} does not exist or may have been deleted by its owner.`,
    },
    disabled: {
      icon: AlertCircle,
      title: "Link Currently Disabled",
      color: "text-amber-400 bg-amber-950/20 border-amber-500/20",
      description: `This link ${code} is currently paused or inactive. Please contact the person who shared it with you.`,
    },
    expired: {
      icon: Clock,
      title: "Link Has Expired",
      color: "text-purple-400 bg-purple-950/20 border-purple-500/20",
      description: `The campaign or promotional period for ${code} has reached its expiration date.`,
    },
    "server-error": {
      icon: AlertCircle,
      title: "Temporary Service Error",
      color: "text-zinc-400 bg-zinc-900 border-zinc-700",
      description: "We encountered a temporary error while redirecting your link. Please try again shortly.",
    },
  }[type] || {
    icon: Link2Off,
    title: "Link Error",
    color: "text-zinc-400 bg-zinc-900 border-zinc-700",
    description: "An error occurred with this link.",
  };

  const Icon = config.icon;

  return (
    <div className="w-full max-w-md p-8 rounded-2xl border border-[#222328] bg-[#111113] shadow-2xl text-center space-y-5">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto border ${config.color}`}>
        <Icon className="w-7 h-7" />
      </div>

      <div className="space-y-2">
        <h1 className="text-xl font-bold text-white tracking-tight">{config.title}</h1>
        <p className="text-xs text-zinc-400 leading-relaxed max-w-xs mx-auto">
          {config.description}
        </p>
      </div>

      <div className="pt-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-500/25 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Go to LinkTrace Homepage</span>
        </Link>
      </div>
    </div>
  );
}

export default function LinkErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; code?: string }>;
}) {
  return (
    <div className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center p-6 selection:bg-blue-600 selection:text-white">
      <LinkErrorContent searchParams={searchParams} />
    </div>
  );
}
