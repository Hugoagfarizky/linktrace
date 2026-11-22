"use client";

import { useState } from "react";
import { Copy, Check, Link2, Sparkles, SlidersHorizontal } from "lucide-react";
import { buildUtmUrl } from "@/lib/validations/utm";

export default function UtmBuilderPage() {
  const [form, setForm] = useState({
    url: "https://example.com/landing",
    source: "newsletter",
    medium: "email",
    campaign: "product_launch",
    term: "",
    content: "header_cta",
  });

  const [copied, setCopied] = useState(false);

  const generatedUrl = form.url && form.source && form.medium && form.campaign
    ? buildUtmUrl(form)
    : "";

  const handleCopy = () => {
    if (!generatedUrl) return;
    navigator.clipboard.writeText(generatedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">UTM Builder</h1>
        <p className="text-sm text-zinc-400 mt-1">
          Generate standard campaign tracking parameters to measure your marketing channels accurately.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Form Inputs */}
        <div className="space-y-4 p-6 rounded-xl border border-[#222328] bg-[#111113]">
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-blue-400" />
            Parameter Inputs
          </h2>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">
              Website URL *
            </label>
            <input
              type="url"
              value={form.url}
              onChange={(e) => setForm({ ...form, url: e.target.value })}
              placeholder="https://example.com"
              className="w-full bg-[#18191f] border border-[#282930] rounded-lg px-3.5 py-2 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">
              Campaign Source * <span className="text-zinc-500">(e.g., google, newsletter)</span>
            </label>
            <input
              type="text"
              value={form.source}
              onChange={(e) => setForm({ ...form, source: e.target.value })}
              className="w-full bg-[#18191f] border border-[#282930] rounded-lg px-3.5 py-2 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">
              Campaign Medium * <span className="text-zinc-500">(e.g., cpc, email, banner)</span>
            </label>
            <input
              type="text"
              value={form.medium}
              onChange={(e) => setForm({ ...form, medium: e.target.value })}
              className="w-full bg-[#18191f] border border-[#282930] rounded-lg px-3.5 py-2 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">
              Campaign Name * <span className="text-zinc-500">(e.g., summer_sale_2026)</span>
            </label>
            <input
              type="text"
              value={form.campaign}
              onChange={(e) => setForm({ ...form, campaign: e.target.value })}
              className="w-full bg-[#18191f] border border-[#282930] rounded-lg px-3.5 py-2 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Term (Optional)
              </label>
              <input
                type="text"
                value={form.term}
                onChange={(e) => setForm({ ...form, term: e.target.value })}
                placeholder="keywords"
                className="w-full bg-[#18191f] border border-[#282930] rounded-lg px-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Content (Optional)
              </label>
              <input
                type="text"
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                placeholder="sidebar_cta"
                className="w-full bg-[#18191f] border border-[#282930] rounded-lg px-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition"
              />
            </div>
          </div>
        </div>

        {/* Live Preview */}
        <div className="space-y-4 p-6 rounded-xl border border-[#222328] bg-[#111113] flex flex-col justify-between">
          <div>
            <h2 className="text-base font-semibold text-white flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              Generated Campaign URL
            </h2>
            <p className="text-xs text-zinc-400 mb-4">
              Use this tagged URL in your ad, post, or email campaign.
            </p>

            <div className="p-4 rounded-lg bg-[#18191f] border border-[#282930] text-xs font-mono text-zinc-200 break-all leading-relaxed">
              {generatedUrl || "Fill in the required fields to preview your URL..."}
            </div>
          </div>

          <div className="pt-4 flex flex-col gap-2.5">
            <button
              onClick={handleCopy}
              disabled={!generatedUrl}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white rounded-lg text-sm font-medium transition shadow-md shadow-blue-500/20"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy UTM URL</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
