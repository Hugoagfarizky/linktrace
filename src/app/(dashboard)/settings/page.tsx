"use client";

import { useState } from "react";
import { Settings, Layers, ShieldCheck, User } from "lucide-react";

export default function SettingsPage() {
  const [workspaceName, setWorkspaceName] = useState("Personal Workspace");
  const [slug, setSlug] = useState("personal-workspace");
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Settings</h1>
        <p className="text-sm text-zinc-400 mt-1">
          Manage your workspace preferences, defaults, and account information.
        </p>
      </div>

      <div className="space-y-6">
        {/* Workspace Card */}
        <div className="p-6 rounded-xl border border-[#222328] bg-[#111113] space-y-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-semibold text-white text-base">Workspace Settings</h2>
              <p className="text-xs text-zinc-400">Settings apply to all links and campaigns in this workspace.</p>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                Workspace Name
              </label>
              <input
                type="text"
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
                className="w-full bg-[#18191f] border border-[#282930] rounded-lg px-3.5 py-2 text-sm text-zinc-200 focus:outline-none focus:border-blue-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                Workspace Slug
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full bg-[#18191f] border border-[#282930] rounded-lg px-3.5 py-2 text-sm text-zinc-200 focus:outline-none focus:border-blue-500 transition font-mono"
              />
            </div>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-xs text-emerald-400">{saved ? "✓ Settings saved successfully" : ""}</span>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>

        {/* Privacy & Compliance Card */}
        <div className="p-6 rounded-xl border border-[#222328] bg-[#111113] space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-semibold text-white text-base">Privacy & Attribution Policy</h2>
              <p className="text-xs text-zinc-400">LinkTrace privacy-conscious data collection rules.</p>
            </div>
          </div>

          <div className="text-xs text-zinc-400 space-y-2 leading-relaxed">
            <p>
              • <strong>No Raw IP Storage:</strong> Visitor IP addresses are immediately hashed with a daily salt and never permanently persisted in raw form.
            </p>
            <p>
              • <strong>Aggregated Estimation:</strong> Unique visitor statistics are calculated via non-invasive estimations rather than invasive cross-site cookies.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
