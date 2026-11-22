"use client";

import { useState } from "react";
import { Plus, Search, Copy, Check, ExternalLink, Calendar, Filter } from "lucide-react";

interface LinkData {
  id: string;
  title: string;
  shortCode: string;
  destination: string;
  clicks: number;
  isActive: boolean;
  campaign: string | null;
  createdAt: string;
}

export default function LinksPage() {
  const [links, setLinks] = useState<LinkData[]>([
    {
      id: "1",
      title: "Black Friday Promo - Instagram Bio",
      shortCode: "bf-sale",
      destination: "https://example.com/promo/black-friday?utm_source=ig",
      clicks: 4210,
      isActive: true,
      campaign: "Black Friday 2026",
      createdAt: "2026-11-20",
    },
    {
      id: "2",
      title: "YouTube Channel Banner Link",
      shortCode: "yt-hub",
      destination: "https://youtube.com/@linktrace-demo",
      clicks: 3120,
      isActive: true,
      campaign: "Social Channels",
      createdAt: "2026-11-18",
    },
    {
      id: "3",
      title: "Product Documentation v1.0",
      shortCode: "docs-v1",
      destination: "https://docs.linktrace.dev/guide",
      clicks: 2450,
      isActive: true,
      campaign: null,
      createdAt: "2026-11-15",
    },
    {
      id: "4",
      title: "Old Webinar Replay (Expired)",
      shortCode: "webinar-oct",
      destination: "https://example.com/webinar/replay",
      clicks: 530,
      isActive: false,
      campaign: "Webinars",
      createdAt: "2026-10-10",
    },
  ]);

  const [search, setSearch] = useState("");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [form, setForm] = useState({
    destinationUrl: "",
    shortCode: "",
    title: "",
    campaign: "",
  });

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/${code}`);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.destinationUrl) return;

    const newShortCode =
      form.shortCode.trim() ||
      Math.random().toString(36).substring(2, 8);

    const newLink: LinkData = {
      id: Date.now().toString(),
      title: form.title || form.destinationUrl,
      shortCode: newShortCode,
      destination: form.destinationUrl,
      clicks: 0,
      isActive: true,
      campaign: form.campaign || null,
      createdAt: new Date().toISOString().split("T")[0],
    };

    setLinks([newLink, ...links]);
    setForm({ destinationUrl: "", shortCode: "", title: "", campaign: "" });
    setShowCreateModal(false);
  };

  const filteredLinks = links.filter(
    (l) =>
      l.title.toLowerCase().includes(search.toLowerCase()) ||
      l.shortCode.toLowerCase().includes(search.toLowerCase()) ||
      l.destination.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Link Management</h1>
          <p className="text-sm text-zinc-400 mt-1">
            Create, configure custom aliases, and organize your tracking links.
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium shadow-md shadow-blue-500/20 transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create Short Link</span>
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by title, short alias, or destination..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#111113] border border-[#222328] rounded-lg pl-10 pr-4 py-2 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition"
          />
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3.5 py-2 bg-[#111113] border border-[#222328] rounded-lg text-sm text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 transition">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* Links List */}
      <div className="rounded-xl border border-[#222328] bg-[#111113] overflow-hidden">
        <div className="divide-y divide-[#1e1f26]">
          {filteredLinks.length === 0 ? (
            <div className="p-8 text-center text-sm text-zinc-400">
              No links found matching your search.
            </div>
          ) : (
            filteredLinks.map((link) => (
              <div
                key={link.id}
                className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[#15161c]/50 transition"
              >
                <div className="space-y-1.5 min-w-0 flex-1">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-white text-base truncate">{link.title}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[11px] font-medium border ${
                        link.isActive
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : "bg-zinc-700/20 text-zinc-400 border-zinc-700/30"
                      }`}
                    >
                      {link.isActive ? "Active" : "Disabled"}
                    </span>
                    {link.campaign && (
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        {link.campaign}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono">
                    <span className="text-blue-400 font-medium hover:underline cursor-pointer">
                      /{link.shortCode}
                    </span>
                    <span className="text-zinc-600">→</span>
                    <span className="text-zinc-400 truncate max-w-md">{link.destination}</span>
                  </div>
                  <div className="flex items-center gap-4 text-[12px] text-zinc-500 pt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> Created {link.createdAt}
                    </span>
                    <span>•</span>
                    <span className="text-zinc-300 font-medium">
                      {link.clicks.toLocaleString()} total clicks
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start md:self-auto">
                  <button
                    onClick={() => handleCopy(link.shortCode)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#17181f] border border-[#222328] hover:border-zinc-700 text-zinc-300 hover:text-white rounded-lg text-xs font-medium transition"
                  >
                    {copiedCode === link.shortCode ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Link</span>
                      </>
                    )}
                  </button>
                  <a
                    href={link.destination}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 bg-[#17181f] border border-[#222328] hover:border-zinc-700 text-zinc-400 hover:text-white rounded-lg text-xs transition"
                    title="Open destination directly"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Create Link Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-[#111113] border border-[#222328] rounded-xl max-w-md w-full p-6 space-y-5 shadow-2xl">
            <h2 className="text-lg font-bold text-white">Create New Short Link</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Destination URL *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://example.com/target-page"
                  value={form.destinationUrl}
                  onChange={(e) => setForm({ ...form, destinationUrl: e.target.value })}
                  className="w-full bg-[#18191f] border border-[#282930] rounded-lg px-3.5 py-2 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Link Title (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g., Summer Campaign Landing"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full bg-[#18191f] border border-[#282930] rounded-lg px-3.5 py-2 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Custom Short Alias (Optional)
                </label>
                <div className="flex items-center rounded-lg border border-[#282930] bg-[#18191f] overflow-hidden focus-within:border-blue-500">
                  <span className="px-3 text-xs text-zinc-500 bg-[#141419] py-2 border-r border-[#282930]">
                    linktrace.dev/
                  </span>
                  <input
                    type="text"
                    placeholder="my-alias"
                    value={form.shortCode}
                    onChange={(e) => setForm({ ...form, shortCode: e.target.value })}
                    className="flex-1 bg-transparent px-3 py-2 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Campaign Name (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g., Black Friday 2026"
                  value={form.campaign}
                  onChange={(e) => setForm({ ...form, campaign: e.target.value })}
                  className="w-full bg-[#18191f] border border-[#282930] rounded-lg px-3.5 py-2 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-lg text-sm text-zinc-400 hover:text-white transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition shadow-md shadow-blue-500/20"
                >
                  Create Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
