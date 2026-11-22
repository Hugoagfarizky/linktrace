"use client";

import { useEffect, useState } from "react";
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
  Loader2,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { TrafficChart } from "@/components/analytics/traffic-chart";

interface AnalyticsData {
  summary: {
    totalLinks: number;
    activeCampaigns: number;
    totalClicks: number;
    uniqueVisitors: number;
    range: string;
  };
  timeSeries: Array<{ date: string; clicks: number; visitors: number }>;
  topLinks: Array<{
    id: string;
    title: string;
    shortCode: string;
    destination: string;
    count: number;
  }>;
}

export default function DashboardPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState("30d");

  const fetchDashboardData = async (range: string) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/analytics?range=${range}`);
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (e) {
      console.error("Failed to fetch analytics:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData(timeRange);
  }, [timeRange]);

  const handleCopy = (code: string) => {
    const fullUrl = `${window.location.origin}/${code}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(code);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const kpis = [
    {
      title: "Total Links",
      value: data?.summary.totalLinks ?? 0,
      change: "Active in workspace",
      icon: Link2,
    },
    {
      title: "Total Clicks",
      value: data?.summary.totalClicks.toLocaleString() ?? "0",
      change: `Recorded in last ${timeRange.toUpperCase()}`,
      icon: MousePointerClick,
    },
    {
      title: "Est. Unique Visitors",
      value: data?.summary.uniqueVisitors.toLocaleString() ?? "0",
      change: "Privacy-hashed daily visitors",
      icon: Users,
    },
    {
      title: "Active Campaigns",
      value: data?.summary.activeCampaigns ?? 0,
      change: "Marketing groups",
      icon: Megaphone,
    },
  ];

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
              className="p-5 rounded-2xl border border-[#222328] bg-[#111113] hover:border-zinc-700/60 transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-zinc-400">{kpi.title}</span>
                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-bold text-white tracking-tight">{kpi.value}</div>
              <div className="flex items-center gap-1.5 mt-2 text-[12px] text-zinc-400">
                <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
                <span>{kpi.change}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Analytics Visual Chart */}
      <div className="p-6 rounded-2xl border border-[#222328] bg-[#111113]">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-base font-semibold text-white">Click Traffic Trends</h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Daily click and unique visitor volume over the selected period
            </p>
          </div>
          <Link
            href="/analytics"
            className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium"
          >
            Detailed Analytics <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="h-64 flex items-center justify-center text-xs text-zinc-500 gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
            <span>Loading traffic metrics...</span>
          </div>
        ) : (
          <TrafficChart data={data?.timeSeries || []} />
        )}
      </div>

      {/* Top Performing Links Table */}
      <div className="p-6 rounded-2xl border border-[#222328] bg-[#111113]">
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

        {loading ? (
          <div className="p-8 text-center text-xs text-zinc-500">Loading top links...</div>
        ) : !data?.topLinks || data.topLinks.length === 0 ? (
          <div className="p-8 text-center space-y-2">
            <p className="text-sm text-zinc-400">No link activity recorded yet.</p>
            <Link
              href="/links"
              className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:underline"
            >
              <Plus className="w-3.5 h-3.5" /> Create a short link to start tracking
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#222328] text-[12px] font-medium text-zinc-400">
                  <th className="pb-3 pl-1">Link Name & Alias</th>
                  <th className="pb-3">Destination</th>
                  <th className="pb-3 text-right">Clicks in Period</th>
                  <th className="pb-3 text-right pr-1">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e1f26] text-sm">
                {data.topLinks.map((link) => (
                  <tr key={link.id} className="group hover:bg-[#15161c]/50 transition">
                    <td className="py-3.5 pl-1">
                      <div className="font-medium text-zinc-200">{link.title}</div>
                      <div className="text-xs text-blue-400 font-mono mt-0.5">/{link.shortCode}</div>
                    </td>
                    <td className="py-3.5 text-xs text-zinc-400 max-w-xs truncate font-mono">
                      {link.destination}
                    </td>
                    <td className="py-3.5 text-right font-semibold text-white">
                      {link.count.toLocaleString()}
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
        )}
      </div>
    </div>
  );
}
