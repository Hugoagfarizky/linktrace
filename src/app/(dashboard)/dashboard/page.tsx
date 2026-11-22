"use client";

import { useState } from "react";
import {
  MousePointerClick,
  Link2,
  Users,
  Megaphone,
  ArrowUpRight,
  TrendingUp,
  Copy,
  Check,
  Calendar,
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState("30d");

  const kpis = [
    {
      title: "Total Links",
      value: "24",
      change: "+4 this month",
      icon: Link2,
      trend: "up",
    },
    {
      title: "Total Clicks",
      value: "14,820",
      change: "+18.2% vs last period",
      icon: MousePointerClick,
      trend: "up",
    },
    {
      title: "Est. Unique Visitors",
      value: "9,430",
      change: "+12.5% vs last period",
      icon: Users,
      trend: "up",
    },
    {
      title: "Active Campaigns",
      value: "5",
      change: "2 ending soon",
      icon: Megaphone,
      trend: "neutral",
    },
  ];

  const topLinks = [
    {
      id: "1",
      title: "Black Friday Promo - Instagram Bio",
      shortCode: "bf-sale",
      destination: "https://example.com/promo/black-friday?utm_source=ig",
      clicks: 4210,
      status: "Active",
    },
    {
      id: "2",
      title: "YouTube Channel Banner Link",
      shortCode: "yt-hub",
      destination: "https://youtube.com/@linktrace-demo",
      clicks: 3120,
      status: "Active",
    },
    {
      id: "3",
      title: "Product Documentation v1.0",
      shortCode: "docs-v1",
      destination: "https://docs.linktrace.dev/guide",
      clicks: 2450,
      status: "Active",
    },
    {
      id: "4",
      title: "LinkedIn Newsletter Subscription",
      shortCode: "li-sub",
      destination: "https://linkedin.com/newsletter/linktrace",
      clicks: 1890,
      status: "Active",
    },
  ];

  const handleCopy = (code: string) => {
    const fullUrl = `${window.location.origin}/${code}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(code);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Top Welcome Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Dashboard Overview</h1>
          <p className="text-sm text-zinc-400 mt-1">
            Real-time link tracking and campaign analytics across your workspace.
          </p>
        </div>

        {/* Date Filter */}
        <div className="flex items-center gap-2 self-start sm:self-auto bg-[#14151a] p-1 rounded-lg border border-[#222328]">
          <Calendar className="w-4 h-4 text-zinc-400 ml-2" />
          {(["7d", "30d", "90d"] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 rounded text-xs font-medium transition ${
                timeRange === range
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              Last {range.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.title}
              className="p-5 rounded-xl border border-[#222328] bg-[#111113] hover:border-zinc-700/60 transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-zinc-400">{kpi.title}</span>
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-bold text-white tracking-tight">{kpi.value}</div>
              <div className="flex items-center gap-1.5 mt-2 text-[12px] text-emerald-400">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>{kpi.change}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Analytics Visual Chart Placeholder (CSS-based bar visualization) */}
      <div className="p-6 rounded-xl border border-[#222328] bg-[#111113]">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-base font-semibold text-white">Click Traffic Trends</h2>
            <p className="text-xs text-zinc-400 mt-0.5">Daily click volume over the selected period</p>
          </div>
          <Link
            href="/analytics"
            className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium"
          >
            Detailed Analytics <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Visual Bar Timeline Preview */}
        <div className="h-48 flex items-end gap-2 pt-6">
          {[42, 65, 55, 80, 95, 78, 110, 85, 120, 140, 135, 160, 145, 180].map((val, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
              <div
                style={{ height: `${(val / 180) * 100}%` }}
                className="w-full bg-blue-600/40 group-hover:bg-blue-500 rounded-t transition-all duration-150 relative"
              >
                <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-zinc-800 text-[10px] text-white px-2 py-0.5 rounded shadow pointer-events-none whitespace-nowrap transition-opacity">
                  {val * 12} clicks
                </div>
              </div>
              <span className="text-[10px] text-zinc-400">D{idx + 1}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Top Performing Links Table */}
      <div className="p-6 rounded-xl border border-[#222328] bg-[#111113]">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-base font-semibold text-white">Top Performing Links</h2>
            <p className="text-xs text-zinc-400 mt-0.5">Highest traffic destinations in your workspace</p>
          </div>
          <Link
            href="/links"
            className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium"
          >
            View All Links <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#222328] text-[12px] font-medium text-zinc-400">
                <th className="pb-3 pl-1">Link Name & Alias</th>
                <th className="pb-3">Destination</th>
                <th className="pb-3 text-right">Total Clicks</th>
                <th className="pb-3 text-center">Status</th>
                <th className="pb-3 text-right pr-1">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e1f26] text-sm">
              {topLinks.map((link) => (
                <tr key={link.id} className="group hover:bg-[#15161c]/50 transition">
                  <td className="py-3.5 pl-1">
                    <div className="font-medium text-zinc-200">{link.title}</div>
                    <div className="text-xs text-blue-400 font-mono mt-0.5">/{link.shortCode}</div>
                  </td>
                  <td className="py-3.5 text-xs text-zinc-400 max-w-xs truncate font-mono">
                    {link.destination}
                  </td>
                  <td className="py-3.5 text-right font-semibold text-white">
                    {link.clicks.toLocaleString()}
                  </td>
                  <td className="py-3.5 text-center">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {link.status}
                    </span>
                  </td>
                  <td className="py-3.5 text-right pr-1">
                    <button
                      onClick={() => handleCopy(link.shortCode)}
                      className="p-1.5 rounded-lg border border-[#222328] bg-[#17181f] text-zinc-400 hover:text-white hover:border-zinc-700 transition"
                      title="Copy short link"
                    >
                      {copiedId === link.shortCode ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
