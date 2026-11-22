"use client";

import { useState } from "react";
import { Plus, Megaphone, Link2, BarChart2, Calendar } from "lucide-react";

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState([
    {
      id: "1",
      name: "Black Friday 2026",
      description: "Q4 promotional discount links across social and newsletter channels.",
      linksCount: 8,
      clicksCount: 5420,
      createdAt: "2026-11-01",
    },
    {
      id: "2",
      name: "Social Channels",
      description: "Always-on bio links, YouTube banner, and Twitter profiles.",
      linksCount: 6,
      clicksCount: 6890,
      createdAt: "2026-10-15",
    },
    {
      id: "3",
      name: "Product Launch v1.0",
      description: "Beta release and launch outreach links for early testers.",
      linksCount: 4,
      clicksCount: 2510,
      createdAt: "2026-11-10",
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    setCampaigns([
      {
        id: Date.now().toString(),
        name,
        description,
        linksCount: 0,
        clicksCount: 0,
        createdAt: new Date().toISOString().split("T")[0],
      },
      ...campaigns,
    ]);
    setName("");
    setDescription("");
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Campaigns</h1>
          <p className="text-sm text-zinc-400 mt-1">
            Group links into campaigns to compare multi-channel traffic and conversion performance.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium shadow-md shadow-blue-500/20 transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Campaign</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {campaigns.map((camp) => (
          <div
            key={camp.id}
            className="p-6 rounded-xl border border-[#222328] bg-[#111113] hover:border-zinc-700/60 transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  <Megaphone className="w-4 h-4" />
                </div>
                <h3 className="font-semibold text-white text-base truncate">{camp.name}</h3>
              </div>
              <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                {camp.description || "No description provided."}
              </p>
            </div>

            <div className="pt-6 border-t border-[#1e1f26] mt-6 grid grid-cols-2 gap-4">
              <div>
                <div className="text-[11px] text-zinc-500 flex items-center gap-1 mb-0.5">
                  <Link2 className="w-3.5 h-3.5" /> Links
                </div>
                <div className="text-lg font-bold text-white">{camp.linksCount}</div>
              </div>
              <div>
                <div className="text-[11px] text-zinc-500 flex items-center gap-1 mb-0.5">
                  <BarChart2 className="w-3.5 h-3.5" /> Clicks
                </div>
                <div className="text-lg font-bold text-white">
                  {camp.clicksCount.toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-[#111113] border border-[#222328] rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h2 className="text-lg font-bold text-white">Create New Campaign</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Campaign Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Product Launch Q1"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#18191f] border border-[#282930] rounded-lg px-3.5 py-2 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Description (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="What is the objective of this campaign?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[#18191f] border border-[#282930] rounded-lg px-3.5 py-2 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg text-sm text-zinc-400 hover:text-white transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition shadow-md shadow-blue-500/20"
                >
                  Create Campaign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
