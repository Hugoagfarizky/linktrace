"use client";

import { useState } from "react";
import {
  Globe,
  Smartphone,
  Laptop,
  Compass,
  Calendar,
  Share2,
} from "lucide-react";

export default function AnalyticsPage() {
  const [range, setRange] = useState("30d");

  const sources = [
    { name: "Direct / Email", count: 4820, percent: 38 },
    { name: "Instagram", count: 3240, percent: 25 },
    { name: "YouTube", count: 2150, percent: 17 },
    { name: "LinkedIn", count: 1420, percent: 11 },
    { name: "Twitter / X", count: 1190, percent: 9 },
  ];

  const devices = [
    { name: "Mobile", count: 7850, percent: 61, icon: Smartphone },
    { name: "Desktop", count: 4620, percent: 36, icon: Laptop },
    { name: "Tablet", count: 350, percent: 3, icon: Smartphone },
  ];

  const countries = [
    { name: "Indonesia", count: 6240, percent: 48 },
    { name: "United States", count: 2890, percent: 22 },
    { name: "Singapore", count: 1450, percent: 11 },
    { name: "Malaysia", count: 980, percent: 8 },
    { name: "Other Countries", count: 1260, percent: 11 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Analytics</h1>
          <p className="text-sm text-zinc-400 mt-1">
            Privacy-conscious visitor attribution and traffic source breakdowns.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#14151a] p-1 rounded-lg border border-[#222328]">
          <Calendar className="w-4 h-4 text-zinc-400 ml-2" />
          {(["7d", "30d", "90d"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1 rounded text-xs font-medium transition ${
                range === r
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              Last {r.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Traffic Sources */}
        <div className="p-6 rounded-xl border border-[#222328] bg-[#111113]">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Share2 className="w-4 h-4" />
            </div>
            <h2 className="font-semibold text-white text-base">Top Referrers</h2>
          </div>
          <div className="space-y-3.5">
            {sources.map((s) => (
              <div key={s.name} className="space-y-1">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-zinc-300">{s.name}</span>
                  <span className="text-zinc-400">{s.count.toLocaleString()} ({s.percent}%)</span>
                </div>
                <div className="h-2 rounded-full bg-[#1e1f26] overflow-hidden">
                  <div
                    style={{ width: `${s.percent}%` }}
                    className="h-full bg-blue-500 rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Devices */}
        <div className="p-6 rounded-xl border border-[#222328] bg-[#111113]">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Smartphone className="w-4 h-4" />
            </div>
            <h2 className="font-semibold text-white text-base">Device Categories</h2>
          </div>
          <div className="space-y-3.5">
            {devices.map((d) => (
              <div key={d.name} className="space-y-1">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-zinc-300">{d.name}</span>
                  <span className="text-zinc-400">{d.count.toLocaleString()} ({d.percent}%)</span>
                </div>
                <div className="h-2 rounded-full bg-[#1e1f26] overflow-hidden">
                  <div
                    style={{ width: `${d.percent}%` }}
                    className="h-full bg-emerald-500 rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Geography */}
        <div className="p-6 rounded-xl border border-[#222328] bg-[#111113]">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Globe className="w-4 h-4" />
            </div>
            <h2 className="font-semibold text-white text-base">Geography</h2>
          </div>
          <div className="space-y-3.5">
            {countries.map((c) => (
              <div key={c.name} className="space-y-1">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-zinc-300">{c.name}</span>
                  <span className="text-zinc-400">{c.count.toLocaleString()} ({c.percent}%)</span>
                </div>
                <div className="h-2 rounded-full bg-[#1e1f26] overflow-hidden">
                  <div
                    style={{ width: `${c.percent}%` }}
                    className="h-full bg-purple-500 rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
