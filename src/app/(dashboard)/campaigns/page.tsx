"use client";

import { useEffect, useRef, useState } from "react";
import {
  Plus,
  Megaphone,
  Link2,
  BarChart2,
  Edit2,
  Trash2,
  ExternalLink,
  Copy,
  Check,
  X,
  Loader2,
  Calendar,
  Layers,
} from "lucide-react";

interface CampaignItem {
  id: string;
  name: string;
  description: string | null;
  linksCount: number;
  clicksCount: number;
  createdAt: string;
}

interface CampaignDetail extends CampaignItem {
  links: Array<{
    id: string;
    shortCode: string;
    destinationUrl: string;
    title: string | null;
    isActive: boolean;
    clicksCount: number;
    createdAt: string;
  }>;
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<CampaignItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Selected campaign for detail modal / view
  const [selectedCampaign, setSelectedCampaign] = useState<CampaignDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const detailDialogRef = useRef<HTMLDialogElement>(null);

  // Create modal
  const createDialogRef = useRef<HTMLDialogElement>(null);
  const [createName, setCreateName] = useState("");
  const [createDescription, setCreateDescription] = useState("");
  const [createError, setCreateError] = useState<string | null>(null);
  const [createSubmitting, setCreateSubmitting] = useState(false);

  // Edit modal
  const editDialogRef = useRef<HTMLDialogElement>(null);
  const [editingCampaign, setEditingCampaign] = useState<CampaignItem | null>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editError, setEditError] = useState<string | null>(null);
  const [editSubmitting, setEditSubmitting] = useState(false);

  // Delete modal
  const deleteDialogRef = useRef<HTMLDialogElement>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadCampaigns = async () => {
    try {
      const res = await fetch("/api/campaigns");
      if (res.ok) {
        const data = await res.json();
        setCampaigns(data.campaigns || []);
      }
    } catch (e) {
      console.error("Failed to load campaigns:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCampaigns();
  }, []);

  const openCreateDialog = () => {
    setCreateError(null);
    setCreateName("");
    setCreateDescription("");
    createDialogRef.current?.showModal();
  };

  const closeCreateDialog = () => {
    createDialogRef.current?.close();
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createName) return;

    setCreateError(null);
    setCreateSubmitting(true);

    try {
      const res = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: createName, description: createDescription || undefined }),
      });

      const data = await res.json();
      if (!res.ok) {
        setCreateError(data.error || "Failed to create campaign");
        setCreateSubmitting(false);
        return;
      }

      closeCreateDialog();
      loadCampaigns();
    } catch {
      setCreateError("An unexpected error occurred");
    } finally {
      setCreateSubmitting(false);
    }
  };

  const openEditDialog = (c: CampaignItem) => {
    setEditingCampaign(c);
    setEditName(c.name);
    setEditDescription(c.description || "");
    setEditError(null);
    editDialogRef.current?.showModal();
  };

  const closeEditDialog = () => {
    editDialogRef.current?.close();
    setEditingCampaign(null);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCampaign || !editName) return;

    setEditError(null);
    setEditSubmitting(true);

    try {
      const res = await fetch(`/api/campaigns/${editingCampaign.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName, description: editDescription || undefined }),
      });

      const data = await res.json();
      if (!res.ok) {
        setEditError(data.error || "Failed to update campaign");
        setEditSubmitting(false);
        return;
      }

      closeEditDialog();
      loadCampaigns();
    } catch {
      setEditError("Failed to update campaign");
    } finally {
      setEditSubmitting(false);
    }
  };

  const openDeleteDialog = (id: string) => {
    setDeletingId(id);
    deleteDialogRef.current?.showModal();
  };

  const closeDeleteDialog = () => {
    deleteDialogRef.current?.close();
    setDeletingId(null);
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      const res = await fetch(`/api/campaigns/${deletingId}`, { method: "DELETE" });
      if (res.ok) {
        setCampaigns(campaigns.filter((c) => c.id !== deletingId));
        closeDeleteDialog();
      }
    } catch (e) {
      console.error("Failed to delete campaign:", e);
    }
  };

  const viewCampaignDetail = async (c: CampaignItem) => {
    setLoadingDetail(true);
    detailDialogRef.current?.showModal();
    try {
      const res = await fetch(`/api/campaigns/${c.id}`);
      if (res.ok) {
        const json = await res.json();
        setSelectedCampaign(json.campaign);
      }
    } catch (e) {
      console.error("Failed to load campaign detail:", e);
    } finally {
      setLoadingDetail(false);
    }
  };

  const closeDetailDialog = () => {
    detailDialogRef.current?.close();
    setSelectedCampaign(null);
  };

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/${code}`);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Campaign Management</h1>
          <p className="text-sm text-zinc-400 mt-1">
            Organize multi-channel initiatives and measure aggregate campaign click performance.
          </p>
        </div>
        <button
          onClick={openCreateDialog}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-medium shadow-md shadow-blue-500/20 transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Campaign</span>
        </button>
      </div>

      {/* Campaigns Grid */}
      {loading ? (
        <div className="p-12 text-center text-sm text-zinc-400 flex items-center justify-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
          <span>Loading workspace campaigns...</span>
        </div>
      ) : campaigns.length === 0 ? (
        <div className="p-12 text-center space-y-3 rounded-2xl border border-[#222328] bg-[#111113]">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mx-auto">
            <Megaphone className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-white">No campaigns created yet</h3>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            Create a campaign to group marketing links across social, email, or advertising channels.
          </p>
          <button
            onClick={openCreateDialog}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-medium transition shadow-md shadow-blue-500/20"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Your First Campaign</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {campaigns.map((camp) => (
            <div
              key={camp.id}
              className="p-6 rounded-2xl border border-[#222328] bg-[#111113] hover:border-zinc-700/60 transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      <Megaphone className="w-4 h-4" />
                    </div>
                    <h3 className="font-semibold text-white text-base truncate">{camp.name}</h3>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditDialog(camp)}
                      className="p-1 text-zinc-400 hover:text-white transition"
                      title="Edit campaign"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => openDeleteDialog(camp.id)}
                      className="p-1 text-zinc-400 hover:text-red-400 transition"
                      title="Delete campaign"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                  {camp.description || "No description provided."}
                </p>
              </div>

              <div className="pt-5 border-t border-[#1e1f26] mt-6">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-[11px] text-zinc-500 flex items-center gap-1 mb-0.5">
                      <Link2 className="w-3.5 h-3.5" /> Links
                    </div>
                    <div className="text-lg font-bold text-white">{camp.linksCount}</div>
                  </div>
                  <div>
                    <div className="text-[11px] text-zinc-500 flex items-center gap-1 mb-0.5">
                      <BarChart2 className="w-3.5 h-3.5" /> Total Clicks
                    </div>
                    <div className="text-lg font-bold text-white">
                      {camp.clicksCount.toLocaleString()}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => viewCampaignDetail(camp)}
                  className="w-full py-2 bg-[#18191f] hover:bg-[#20212a] border border-[#282930] text-zinc-300 hover:text-white rounded-xl text-xs font-medium transition text-center"
                >
                  View Campaign Links ({camp.linksCount})
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modern Native <dialog>: Campaign Detail & Links list */}
      <dialog
        ref={detailDialogRef}
        aria-labelledby="detail-dialog-title"
        className="rounded-2xl border border-[#282930] bg-[#111113] text-zinc-200 p-6 max-w-2xl w-full shadow-2xl backdrop:bg-black/75"
      >
        <div className="flex items-center justify-between pb-4 border-b border-[#1e1f26]">
          <div>
            <h2 id="detail-dialog-title" className="text-lg font-bold text-white">
              {selectedCampaign?.name || "Campaign Details"}
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              {selectedCampaign?.description || "Associated campaign links"}
            </p>
          </div>
          <button
            type="button"
            onClick={closeDetailDialog}
            aria-label="Close dialog"
            className="text-zinc-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="pt-4 space-y-4 max-h-96 overflow-y-auto">
          {loadingDetail ? (
            <div className="py-12 text-center text-xs text-zinc-500 flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
              <span>Loading links...</span>
            </div>
          ) : !selectedCampaign?.links || selectedCampaign.links.length === 0 ? (
            <div className="py-12 text-center text-xs text-zinc-500">
              No links are currently assigned to this campaign. You can assign links from the Links page.
            </div>
          ) : (
            <div className="divide-y divide-[#1e1f26]">
              {selectedCampaign.links.map((link) => (
                <div key={link.id} className="py-3 flex items-center justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-xs text-zinc-200 truncate">
                      {link.title || link.destinationUrl}
                    </div>
                    <div className="text-[11px] text-blue-400 font-mono">/{link.shortCode}</div>
                  </div>
                  <div className="text-right text-xs">
                    <span className="font-semibold text-white">{link.clicksCount}</span>{" "}
                    <span className="text-zinc-500">clicks</span>
                  </div>
                  <button
                    onClick={() => handleCopy(link.shortCode)}
                    className="p-1.5 rounded-lg border border-[#222328] bg-[#17181f] text-zinc-400 hover:text-white"
                    title="Copy short link"
                  >
                    {copiedCode === link.shortCode ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </dialog>

      {/* Modern Native <dialog>: Create Campaign */}
      <dialog
        ref={createDialogRef}
        aria-labelledby="create-camp-title"
        className="rounded-2xl border border-[#282930] bg-[#111113] text-zinc-200 p-6 max-w-md w-full shadow-2xl backdrop:bg-black/75"
      >
        <div className="flex items-center justify-between pb-3 border-b border-[#1e1f26]">
          <h2 id="create-camp-title" className="text-base font-bold text-white">
            Create Campaign
          </h2>
          <button
            type="button"
            onClick={closeCreateDialog}
            aria-label="Close dialog"
            className="text-zinc-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {createError && (
          <div className="text-xs text-red-400 bg-red-950/20 border border-red-500/20 p-2.5 rounded-xl mt-3">
            {createError}
          </div>
        )}

        <form onSubmit={handleCreate} className="space-y-4 pt-4">
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">
              Campaign Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Black Friday 2026"
              value={createName}
              onChange={(e) => setCreateName(e.target.value)}
              className="w-full bg-[#18191f] border border-[#282930] rounded-xl px-3.5 py-2 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">
              Description (Optional)
            </label>
            <textarea
              rows={3}
              placeholder="Objective or target audience for this campaign"
              value={createDescription}
              onChange={(e) => setCreateDescription(e.target.value)}
              className="w-full bg-[#18191f] border border-[#282930] rounded-xl px-3.5 py-2 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#1e1f26]">
            <button
              type="button"
              onClick={closeCreateDialog}
              className="px-4 py-2 rounded-xl text-xs text-zinc-400 hover:text-white transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createSubmitting}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-lg shadow-blue-500/25 transition"
            >
              {createSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>Create Campaign</span>
            </button>
          </div>
        </form>
      </dialog>

      {/* Modern Native <dialog>: Edit Campaign */}
      <dialog
        ref={editDialogRef}
        aria-labelledby="edit-camp-title"
        className="rounded-2xl border border-[#282930] bg-[#111113] text-zinc-200 p-6 max-w-md w-full shadow-2xl backdrop:bg-black/75"
      >
        <div className="flex items-center justify-between pb-3 border-b border-[#1e1f26]">
          <h2 id="edit-camp-title" className="text-base font-bold text-white">
            Edit Campaign
          </h2>
          <button
            type="button"
            onClick={closeEditDialog}
            aria-label="Close dialog"
            className="text-zinc-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {editError && (
          <div className="text-xs text-red-400 bg-red-950/20 border border-red-500/20 p-2.5 rounded-xl mt-3">
            {editError}
          </div>
        )}

        <form onSubmit={handleUpdate} className="space-y-4 pt-4">
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">
              Campaign Name *
            </label>
            <input
              type="text"
              required
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full bg-[#18191f] border border-[#282930] rounded-xl px-3.5 py-2 text-sm text-zinc-200 focus:outline-none focus:border-blue-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">
              Description (Optional)
            </label>
            <textarea
              rows={3}
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              className="w-full bg-[#18191f] border border-[#282930] rounded-xl px-3.5 py-2 text-sm text-zinc-200 focus:outline-none focus:border-blue-500 transition"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#1e1f26]">
            <button
              type="button"
              onClick={closeEditDialog}
              className="px-4 py-2 rounded-xl text-xs text-zinc-400 hover:text-white transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={editSubmitting}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-lg shadow-blue-500/25 transition"
            >
              {editSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </dialog>

      {/* Modern Native <dialog>: Confirm Delete Campaign */}
      <dialog
        ref={deleteDialogRef}
        aria-labelledby="del-camp-title"
        className="rounded-2xl border border-[#282930] bg-[#111113] text-zinc-200 p-6 max-w-sm w-full shadow-2xl backdrop:bg-black/75"
      >
        <h2 id="del-camp-title" className="text-base font-bold text-white mb-2">
          Delete Campaign?
        </h2>
        <p className="text-xs text-zinc-400 leading-relaxed mb-5">
          Associated links will not be deleted, but they will be detached from this campaign.
        </p>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={closeDeleteDialog}
            className="px-4 py-2 rounded-xl text-xs font-medium text-zinc-400 hover:text-white"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-red-600/20"
          >
            Delete Campaign
          </button>
        </div>
      </dialog>
    </div>
  );
}
