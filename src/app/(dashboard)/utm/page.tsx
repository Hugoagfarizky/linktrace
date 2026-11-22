"use client";

import { useEffect, useRef, useState } from "react";
import {
  Copy,
  Check,
  Link2,
  Sparkles,
  SlidersHorizontal,
  ArrowRight,
  ExternalLink,
  Loader2,
  X,
  AlertCircle,
} from "lucide-react";
import { buildUtmUrl } from "@/lib/validations/utm";

interface CampaignOption {
  id: string;
  name: string;
}

export default function UtmBuilderPage() {
  const [form, setForm] = useState({
    url: "https://example.com/landing",
    source: "newsletter",
    medium: "email",
    campaign: "product_launch",
    term: "",
    content: "header_cta",
  });

  const [campaigns, setCampaigns] = useState<CampaignOption[]>([]);
  const [copied, setCopied] = useState(false);

  // Shorten dialog
  const shortenDialogRef = useRef<HTMLDialogElement>(null);
  const [customAlias, setCustomAlias] = useState("");
  const [linkTitle, setLinkTitle] = useState("");
  const [shortening, setShortening] = useState(false);
  const [shortenError, setShortenError] = useState<string | null>(null);
  const [createdShortUrl, setCreatedShortUrl] = useState<string | null>(null);
  const [copiedShort, setCopiedShort] = useState(false);

  useEffect(() => {
    fetch("/api/campaigns")
      .then((r) => r.json())
      .then((d) => setCampaigns(d.campaigns || []))
      .catch(() => {});
  }, []);

  const generatedUrl =
    form.url && form.source && form.medium && form.campaign
      ? buildUtmUrl(form)
      : "";

  const handleCopy = () => {
    if (!generatedUrl) return;
    navigator.clipboard.writeText(generatedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleQuickSource = (src: string) => {
    setForm({ ...form, source: src });
  };

  const handleQuickMedium = (med: string) => {
    setForm({ ...form, medium: med });
  };

  const openShortenDialog = () => {
    setCreatedShortUrl(null);
    setShortenError(null);
    setLinkTitle(`${form.campaign} (${form.source}/${form.medium})`);
    setCustomAlias("");
    shortenDialogRef.current?.showModal();
  };

  const closeShortenDialog = () => {
    shortenDialogRef.current?.close();
  };

  const handleCreateShortLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!generatedUrl) return;

    setShortening(true);
    setShortenError(null);

    // Find if campaign name matches an existing workspace campaign
    const matchedCamp = campaigns.find(
      (c) => c.name.toLowerCase() === form.campaign.toLowerCase()
    );

    try {
      const res = await fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destinationUrl: generatedUrl,
          title: linkTitle || undefined,
          shortCode: customAlias || undefined,
          campaignId: matchedCamp?.id || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setShortenError(data.error || "Failed to create short link");
        setShortening(false);
        return;
      }

      const fullShortUrl = `${window.location.origin}/${data.link.shortCode}`;
      setCreatedShortUrl(fullShortUrl);
    } catch {
      setShortenError("Failed to create short link. Please try again.");
    } finally {
      setShortening(false);
    }
  };

  const handleCopyShort = () => {
    if (!createdShortUrl) return;
    navigator.clipboard.writeText(createdShortUrl);
    setCopiedShort(true);
    setTimeout(() => setCopiedShort(false), 2000);
  };

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">UTM Builder</h1>
        <p className="text-sm text-zinc-400 mt-1">
          Generate standard campaign tracking parameters and seamlessly convert them into trackable short links.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Form Inputs */}
        <div className="space-y-4 p-6 rounded-2xl border border-[#222328] bg-[#111113]">
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-blue-400" />
            UTM Parameters
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
              className="w-full bg-[#18191f] border border-[#282930] rounded-xl px-3.5 py-2 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-medium text-zinc-300">
                Campaign Source * <span className="text-zinc-500">(utm_source)</span>
              </label>
            </div>
            <input
              type="text"
              value={form.source}
              onChange={(e) => setForm({ ...form, source: e.target.value })}
              className="w-full bg-[#18191f] border border-[#282930] rounded-xl px-3.5 py-2 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition mb-2"
            />
            <div className="flex flex-wrap gap-1.5">
              {["newsletter", "instagram", "twitter", "google", "linkedin", "youtube"].map((src) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => handleQuickSource(src)}
                  className="px-2 py-0.5 rounded-md border border-[#282930] bg-[#141419] text-[11px] text-zinc-400 hover:text-white hover:border-zinc-700 transition"
                >
                  +{src}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-medium text-zinc-300">
                Campaign Medium * <span className="text-zinc-500">(utm_medium)</span>
              </label>
            </div>
            <input
              type="text"
              value={form.medium}
              onChange={(e) => setForm({ ...form, medium: e.target.value })}
              className="w-full bg-[#18191f] border border-[#282930] rounded-xl px-3.5 py-2 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition mb-2"
            />
            <div className="flex flex-wrap gap-1.5">
              {["email", "social", "cpc", "bio", "banner", "referral"].map((med) => (
                <button
                  key={med}
                  type="button"
                  onClick={() => handleQuickMedium(med)}
                  className="px-2 py-0.5 rounded-md border border-[#282930] bg-[#141419] text-[11px] text-zinc-400 hover:text-white hover:border-zinc-700 transition"
                >
                  +{med}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-medium text-zinc-300">
                Campaign Name * <span className="text-zinc-500">(utm_campaign)</span>
              </label>
            </div>
            <input
              type="text"
              value={form.campaign}
              onChange={(e) => setForm({ ...form, campaign: e.target.value })}
              className="w-full bg-[#18191f] border border-[#282930] rounded-xl px-3.5 py-2 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition mb-1.5"
            />
            {campaigns.length > 0 && (
              <div className="text-[11px] text-zinc-400 flex items-center gap-1.5 flex-wrap">
                <span className="text-zinc-500">Workspace campaigns:</span>
                {campaigns.slice(0, 3).map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setForm({ ...form, campaign: c.name.toLowerCase().replace(/\s+/g, "_") })}
                    className="text-blue-400 hover:underline"
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            )}
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
                className="w-full bg-[#18191f] border border-[#282930] rounded-xl px-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition"
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
                className="w-full bg-[#18191f] border border-[#282930] rounded-xl px-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition"
              />
            </div>
          </div>
        </div>

        {/* Live Preview & Shorten Pipeline Card */}
        <div className="space-y-4 p-6 rounded-2xl border border-[#222328] bg-[#111113] flex flex-col justify-between">
          <div>
            <h2 className="text-base font-semibold text-white flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              Generated Campaign URL
            </h2>
            <p className="text-xs text-zinc-400 mb-4">
              Real-time preview of the destination URL with complete UTM tags attached.
            </p>

            <div className="p-4 rounded-xl bg-[#18191f] border border-[#282930] text-xs font-mono text-zinc-200 break-all leading-relaxed">
              {generatedUrl || "Fill in the required fields to preview your URL..."}
            </div>
          </div>

          <div className="pt-4 flex flex-col gap-3">
            <button
              onClick={handleCopy}
              disabled={!generatedUrl}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#18191f] hover:bg-[#20212a] border border-[#282930] disabled:opacity-40 text-zinc-200 hover:text-white rounded-xl text-xs font-medium transition"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Copied UTM URL!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Full UTM URL</span>
                </>
              )}
            </button>

            <button
              onClick={openShortenDialog}
              disabled={!generatedUrl}
              className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white rounded-xl text-xs font-semibold shadow-lg shadow-blue-500/25 transition"
            >
              <Link2 className="w-4 h-4" />
              <span>Convert to Trackable Short Link</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modern Native <dialog>: One-Click Shorten Pipeline */}
      <dialog
        ref={shortenDialogRef}
        aria-labelledby="shorten-dialog-title"
        className="rounded-2xl border border-[#282930] bg-[#111113] text-zinc-200 p-6 max-w-md w-full shadow-2xl backdrop:bg-black/75"
      >
        <div className="flex items-center justify-between pb-3 border-b border-[#1e1f26]">
          <h2 id="shorten-dialog-title" className="text-base font-bold text-white">
            Shorten UTM Link
          </h2>
          <button
            type="button"
            onClick={closeShortenDialog}
            aria-label="Close dialog"
            className="text-zinc-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {shortenError && (
          <div className="flex items-center gap-2 text-xs text-red-400 bg-red-950/20 border border-red-500/20 p-2.5 rounded-xl mt-3">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{shortenError}</span>
          </div>
        )}

        {createdShortUrl ? (
          <div className="py-6 space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <Check className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-white">Short Link Created!</h3>
            <div className="p-3 bg-[#18191f] border border-[#282930] rounded-xl text-xs font-mono text-blue-400 break-all">
              {createdShortUrl}
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleCopyShort}
                className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-blue-500/25 transition"
              >
                {copiedShort ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedShort ? "Copied!" : "Copy Short URL"}</span>
              </button>
              <button
                type="button"
                onClick={closeShortenDialog}
                className="px-4 py-2 rounded-xl text-xs text-zinc-400 hover:text-white"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleCreateShortLink} className="space-y-4 pt-4">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Link Title
              </label>
              <input
                type="text"
                value={linkTitle}
                onChange={(e) => setLinkTitle(e.target.value)}
                className="w-full bg-[#18191f] border border-[#282930] rounded-xl px-3.5 py-2 text-sm text-zinc-200 focus:outline-none focus:border-blue-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Custom Short Alias (Optional)
              </label>
              <div className="flex items-center rounded-xl border border-[#282930] bg-[#18191f] overflow-hidden focus-within:border-blue-500">
                <span className="px-3 text-xs text-zinc-500 bg-[#141419] py-2 border-r border-[#282930]">
                  linktrace.dev/
                </span>
                <input
                  type="text"
                  placeholder="custom-name (random if blank)"
                  value={customAlias}
                  onChange={(e) => setCustomAlias(e.target.value)}
                  className="flex-1 bg-transparent px-3 py-2 text-xs text-zinc-200 focus:outline-none font-mono"
                />
              </div>
            </div>

            <div className="text-[11px] text-zinc-500 bg-[#14151a] p-3 rounded-xl border border-[#222328]">
              Target Destination:
              <span className="block text-zinc-300 font-mono truncate mt-0.5">{generatedUrl}</span>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#1e1f26]">
              <button
                type="button"
                onClick={closeShortenDialog}
                className="px-4 py-2 rounded-xl text-xs text-zinc-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={shortening}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-lg shadow-blue-500/25 transition"
              >
                {shortening && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Create Short Link</span>
              </button>
            </div>
          </form>
        )}
      </dialog>
    </div>
  );
}
