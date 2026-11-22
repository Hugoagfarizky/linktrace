"use client";

import { useEffect, useState } from "react";
import {
  Globe,
  Smartphone,
  Laptop,
  Calendar,
  Share2,
  Compass,
  Loader2,
  BarChart3,
} from "lucide-react";
import { TrafficChart } from "@/components/analytics/traffic-chart";

interface BreakdownItem {
  name: string;
  count: number;
  percent: number;
}

interface AnalyticsPayload {
  summary: {
    totalClicks: number;
    uniqueVisitors: number;
    range: string;
  };
  timeSeries: Array<{ date: string; clicks: number; visitors: number }>;
  referrers: BreakdownItem[];
  devices: BreakdownItem[];
  browsers: BreakdownItem[];
  countries: BreakdownItem[];
}

export default function AnalyticsPage() {
  const [range, setRange] = useState("30d");
  const [data, setData] = useState<AnalyticsPayload | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/analytics?range=${range}`);
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (e) {
        console.error("Failed to load analytics:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [range]);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Analytics Overview</h1>
          <p className="text-sm text-zinc-400 mt-1">
            Privacy-conscious visitor attribution and traffic source breakdowns.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#14151a] p-1 rounded-xl border border-[#222328] self-start sm:self-auto">
          <Calendar className="w-4 h-4 text-zinc-400 ml-2" />
          {(["7d", "30d", "90d"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
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

      {/* Main Timeline Chart Card */}
      <div className="p-6 rounded-2xl border border-[#222328] bg-[#111113]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Traffic Volume Over Time</h2>
              <p className="text-xs text-zinc-400">Total clicks vs. estimated unique visitors</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold text-white">
              {data?.summary.totalClicks.toLocaleString() ?? "0"}{" "}
              <span className="text-xs font-normal text-zinc-400">clicks</span>
            </div>
            <div className="text-xs text-emerald-400">
              {data?.summary.uniqueVisitors.toLocaleString() ?? "0"} estimated unique visitors
            </div>
          </div>
        </div>

        {loading ? (
          <div className="h-64 flex items-center justify-center text-xs text-zinc-500 gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
            <span>Loading chart...</span>
          </div>
        ) : (
          <TrafficChart data={data?.timeSeries || []} />
        )}
      </div>

      {/* Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Referrers */}
        <div className="p-6 rounded-2xl border border-[#222328] bg-[#111113] flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-5">
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <Share2 className="w-4 h-4" />
              </div>
              <h2 className="font-semibold text-white text-base">Top Referrers</h2>
            </div>

            {loading ? (
              <div className="py-8 text-center text-xs text-zinc-500">Loading...</div>
            ) : !data?.referrers || data.referrers.length === 0 ? (
              <div className="py-8 text-center text-xs text-zinc-500">No referrer data yet.</div>
            ) : (
              <div className="space-y-3.5">
                {data.referrers.map((s) => (
                  <div key={s.name} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-zinc-300 truncate max-w-[140px]">{s.name}</span>
                      <span className="text-zinc-400">
                        {s.count.toLocaleString()} ({s.percent}%)
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-[#1e1f26] overflow-hidden">
                      <div
                        style={{ width: `${s.percent}%` }}
                        className="h-full bg-blue-500 rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Devices */}
        <div className="p-6 rounded-2xl border border-[#222328] bg-[#111113] flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-5">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Smartphone className="w-4 h-4" />
              </div>
              <h2 className="font-semibold text-white text-base">Device Types</h2>
            </div>

            {loading ? (
              <div className="py-8 text-center text-xs text-zinc-500">Loading...</div>
            ) : !data?.devices || data.devices.length === 0 ? (
              <div className="py-8 text-center text-xs text-zinc-500">No device data yet.</div>
            ) : (
              <div className="space-y-3.5">
                {data.devices.map((d) => (
                  <div key={d.name} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-zinc-300">{d.name}</span>
                      <span className="text-zinc-400">
                        {d.count.toLocaleString()} ({d.percent}%)
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-[#1e1f26] overflow-hidden">
                      <div
                        style={{ width: `${d.percent}%` }}
                        className="h-full bg-emerald-500 rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Browsers */}
        <div className="p-6 rounded-2xl border border-[#222328] bg-[#111113] flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-5">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Compass className="w-4 h-4" />
              </div>
              <h2 className="font-semibold text-white text-base">Top Browsers</h2>
            </div>

            {loading ? (
              <div className="py-8 text-center text-xs text-zinc-500">Loading...</div>
            ) : !data?.browsers || data.browsers.length === 0 ? (
              <div className="py-8 text-center text-xs text-zinc-500">No browser data yet.</div>
            ) : (
              <div className="space-y-3.5">
                {data.browsers.map((b) => (
                  <div key={b.name} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-zinc-300">{b.name}</span>
                      <span className="text-zinc-400">
                        {b.count.toLocaleString()} ({b.percent}%)
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-[#1e1f26] overflow-hidden">
                      <div
                        style={{ width: `${b.percent}%` }}
                        className="h-full bg-amber-500 rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Countries */}
        <div className="p-6 rounded-2xl border border-[#222328] bg-[#111113] flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-5">
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <Globe className="w-4 h-4" />
              </div>
              <h2 className="font-semibold text-white text-base">Geography</h2>
            </div>

            {loading ? (
              <div className="py-8 text-center text-xs text-zinc-500">Loading...</div>
            ) : !data?.countries || data.countries.length === 0 ? (
              <div className="py-8 text-center text-xs text-zinc-500">No country data yet.</div>
            ) : (
              <div className="space-y-3.5">
                {data.countries.map((c) => (
                  <div key={c.name} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-zinc-300">{c.name}</span>
                      <span className="text-zinc-400">
                        {c.count.toLocaleString()} ({c.percent}%)
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-[#1e1f26] overflow-hidden">
                      <div
                        style={{ width: `${c.percent}%` }}
                        className="h-full bg-purple-500 rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
