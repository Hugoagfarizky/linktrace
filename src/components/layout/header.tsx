"use client";

import { useState } from "react";
import { ChevronDown, Plus, Layers, User } from "lucide-react";
import Link from "next/link";

export function Header() {
  const [currentWorkspace, setCurrentWorkspace] = useState("Personal Workspace");

  return (
    <header className="h-16 border-b border-[#222328] bg-[#0c0d10]/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-40">
      {/* Workspace Selector */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#222328] bg-[#14151a] text-sm text-zinc-200 hover:border-zinc-700 transition cursor-pointer">
          <Layers className="w-4 h-4 text-blue-400" />
          <span className="font-medium text-xs md:text-sm">{currentWorkspace}</span>
          <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
        </div>
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-3">
        <Link
          href="/links?create=true"
          className="flex items-center gap-2 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs md:text-sm font-medium shadow-md shadow-blue-500/20 transition"
        >
          <Plus className="w-4 h-4" />
          <span>New Link</span>
        </Link>

        {/* User avatar indicator */}
        <div className="w-8 h-8 rounded-full border border-[#222328] bg-[#1a1b22] flex items-center justify-center text-zinc-300 text-xs font-semibold">
          <User className="w-4 h-4 text-zinc-400" />
        </div>
      </div>
    </header>
  );
}
