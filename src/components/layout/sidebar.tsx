"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Link2,
  Megaphone,
  BarChart3,
  SlidersHorizontal,
  Settings,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigationItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Links", href: "/links", icon: Link2 },
  { name: "Campaigns", href: "/campaigns", icon: Megaphone },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "UTM Builder", href: "/utm", icon: SlidersHorizontal },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-[#222328] bg-[#0c0d10] flex flex-col justify-between shrink-0">
      <div>
        {/* Brand / Logo */}
        <div className="h-16 flex items-center px-6 border-b border-[#222328] gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 font-bold text-lg">
            ⚡
          </div>
          <div>
            <span className="font-semibold text-base tracking-tight text-white block">LinkTrace</span>
            <span className="text-[11px] text-zinc-400 font-mono block">v1.0 SaaS</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-3 space-y-1">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
                  isActive
                    ? "bg-blue-600/15 text-blue-400 border border-blue-500/20 shadow-sm"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-[#16171d]"
                )}
              >
                <Icon className={cn("w-4 h-4", isActive ? "text-blue-400" : "text-zinc-400")} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Info / Pro Badge */}
      <div className="p-4 border-t border-[#222328]">
        <div className="rounded-xl border border-blue-500/20 bg-blue-950/20 p-3.5">
          <div className="flex items-center gap-2 mb-1.5">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-semibold text-blue-300">Freemium Ready</span>
          </div>
          <p className="text-[12px] text-zinc-400 leading-relaxed mb-3">
            Track up to 10k clicks/month on the free tier.
          </p>
          <a
            href="https://github.com/Hugoagfarizky/linktrace"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between text-xs text-blue-400 hover:text-blue-300 font-medium"
          >
            <span>GitHub Repo</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </aside>
  );
}
