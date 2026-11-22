"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import {
  Plus,
  Search,
  Copy,
  Check,
  ExternalLink,
  Calendar,
  Filter,
  MoreVertical,
  Trash2,
  Edit2,
  Power,
  AlertCircle,
  Loader2,
  X,
  Link2,
} from "lucide-react";

interface LinkItem {
  id: string;
  shortCode: string;
  destinationUrl: string;
  title: string | null;
  description: string | null;
  isActive: boolean;
  expiresAt: string | null;
  campaignId: string | null;
  campaignName: string | null;
  clicksCount: number;
  createdAt: string;
}

interface CampaignOption {
  id: string;
  name: string;
}

export default function LinksPage() {
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [campaigns, setCampaigns] = useState<CampaignOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Create modal state & ref
  const createDialogRef = useRef<HTMLDialogElement>(null);
  const [createForm, setCreateForm] = useState({
    destinationUrl: "",
    shortCode: "",
    title: "",
    description: "",
    campaignId: "",
    expiresAt: "",
  });
  const [createError, setCreateError] = useState<string | null>(null);
  const [createSubmitting, setCreateSubmitting] = useState(false);

  // Edit modal state & ref
  const editDialogRef = useRef<HTMLDialogElement>(null);
  const [editingLink, setEditingLink] = useState<LinkItem | null>(null);
  const [editForm, setEditForm] = useState({
    destinationUrl: "",
    title: "",
    description: "",
    campaignId: "",
    isActive: true,
  });
  const [editError, setEditError] = useState<string | null>(null);
  const [editSubmitting, setEditSubmitting] = useState(false);

  // Delete confirm modal ref
  const deleteDialogRef = useRef<HTMLDialogElement>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadLinks = async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (statusFilter !== "all") params.set("status", statusFilter);

      const res = await fetch(`/api/links?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setLinks(data.links || []);
      }
    } catch (e) {
      console.error("Failed to load links:", e);
    } finally {
      setLoading(false);
    }
  };

  const loadCampaigns = async () => {
    try {
      const res = await fetch("/api/campaigns");
      if (res.ok) {
        const data = await res.json();
        setCampaigns(data.campaigns || []);
      }
    } catch (e) {
      console.error("Failed to load campaigns:", e);
    }
  };

  useEffect(() => {
    loadLinks();
    loadCampaigns();
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadLinks();
  };

  // Open native <dialog> modals
  const openCreateDialog = () => {
    setCreateError(null);
    setCreateForm({
      destinationUrl: "",
      shortCode: "",
      title: "",
      description: "",
      campaignId: "",
      expiresAt: "",
    });
    createDialogRef.current?.showModal();
  };

  const closeCreateDialog = () => {
    createDialogRef.current?.close();
  };

  const openEditDialog = (link: LinkItem) => {
    setEditingLink(link);
    setEditError(null);
    setEditForm({
      destinationUrl: link.destinationUrl,
      title: link.title || "",
      description: link.description || "",
      campaignId: link.campaignId || "",
      isActive: link.isActive,
    });
    editDialogRef.current?.showModal();
  };

  const closeEditDialog = () => {
    editDialogRef.current?.close();
  };

  const openDeleteDialog = (id: string) => {
    setDeletingId(id);
    deleteDialogRef.current?.showModal();
  };

  const closeDeleteDialog = () => {
    deleteDialogRef.current?.close();
    setDeletingId(null);
  };

  // Create link
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError(null);
    setCreateSubmitting(true);

    try {
      const res = await fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destinationUrl: createForm.destinationUrl,
          shortCode: createForm.shortCode || undefined,
          title: createForm.title || undefined,
          description: createForm.description || undefined,
          campaignId: createForm.campaignId || null,
          expiresAt: createForm.expiresAt ? new Date(createForm.expiresAt).toISOString() : null,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setCreateError(data.error || "Failed to create link");
        setCreateSubmitting(false);
        return;
      }

      closeCreateDialog();
      loadLinks();
    } catch {
      setCreateError("An unexpected error occurred");
    } finally {
      setCreateSubmitting(false);
    }
  };

  // Update link
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLink) return;

    setEditError(null);
    setEditSubmitting(true);

    try {
      const res = await fetch(`/api/links/${editingLink.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destinationUrl: editForm.destinationUrl,
          title: editForm.title || undefined,
          description: editForm.description || undefined,
          campaignId: editForm.campaignId || null,
          isActive: editForm.isActive,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setEditError(data.error || "Failed to update link");
        setEditSubmitting(false);
        return;
      }

      closeEditDialog();
      loadLinks();
    } catch {
      setEditError("Failed to update link");
    } finally {
      setEditSubmitting(false);
    }
  };

  // Toggle active status directly
  const handleToggleActive = async (link: LinkItem) => {
    try {
      const res = await fetch(`/api/links/${link.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !link.isActive }),
      });
      if (res.ok) {
        setLinks(links.map((l) => (l.id === link.id ? { ...l, isActive: !l.isActive } : l)));
      }
    } catch (e) {
      console.error("Failed to toggle status:", e);
    }
  };

  // Delete link
  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      const res = await fetch(`/api/links/${deletingId}`, { method: "DELETE" });
      if (res.ok) {
        setLinks(links.filter((l) => l.id !== deletingId));
        closeDeleteDialog();
      }
    } catch (e) {
      console.error("Failed to delete link:", e);
    }
  };

  const handleCopy = (code: string) => {
    const fullUrl = `${window.location.origin}/${code}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

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
          onClick={openCreateDialog}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium shadow-md shadow-blue-500/20 transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create Short Link</span>
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <form onSubmit={handleSearchSubmit} className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by title, alias, or destination URL..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#111113] border border-[#222328] rounded-lg pl-10 pr-4 py-2 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition"
          />
        </form>

        <div className="flex items-center gap-2">
          {(["all", "active", "disabled"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize border transition ${
                statusFilter === s
                  ? "bg-blue-600/20 text-blue-400 border-blue-500/40"
                  : "bg-[#111113] border-[#222328] text-zinc-400 hover:text-zinc-200"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Links List */}
      <div className="rounded-xl border border-[#222328] bg-[#111113] overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-sm text-zinc-400 flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
            <span>Loading workspace links...</span>
          </div>
        ) : links.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mx-auto">
              <Link2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-white">No tracking links yet</h3>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto">
              Get started by creating your first short URL with real-time attribution and analytics.
            </p>
            <button
              onClick={openCreateDialog}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-medium transition shadow-md shadow-blue-500/20"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Your First Link</span>
            </button>
          </div>
        ) : (
          <div className="divide-y divide-[#1e1f26]">
            {links.map((link) => (
              <div
                key={link.id}
                className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[#15161c]/50 transition"
              >
                <div className="space-y-1.5 min-w-0 flex-1">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-white text-base truncate">
                      {link.title || link.destinationUrl}
                    </span>
                    <button
                      onClick={() => handleToggleActive(link)}
                      title="Click to toggle status"
                      className={`px-2 py-0.5 rounded-full text-[11px] font-medium border transition cursor-pointer ${
                        link.isActive
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20"
                          : "bg-zinc-700/20 text-zinc-400 border-zinc-700/30 hover:bg-zinc-700/30"
                      }`}
                    >
                      {link.isActive ? "Active" : "Disabled"}
                    </button>
                    {link.campaignName && (
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        {link.campaignName}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono">
                    <span className="text-blue-400 font-medium">/{link.shortCode}</span>
                    <span className="text-zinc-600">→</span>
                    <span className="text-zinc-400 truncate max-w-md">{link.destinationUrl}</span>
                  </div>
                  <div className="flex items-center gap-4 text-[12px] text-zinc-500 pt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(link.createdAt).toLocaleDateString()}
                    </span>
                    <span>•</span>
                    <span className="text-zinc-300 font-medium">
                      {link.clicksCount.toLocaleString()} total clicks
                    </span>
                    {link.expiresAt && (
                      <>
                        <span>•</span>
                        <span className="text-amber-400/90 text-xs">
                          Expires {new Date(link.expiresAt).toLocaleDateString()}
                        </span>
                      </>
                    )}
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
                    href={link.destinationUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 bg-[#17181f] border border-[#222328] hover:border-zinc-700 text-zinc-400 hover:text-white rounded-lg text-xs transition"
                    title="Open destination URL"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>

                  <button
                    onClick={() => openEditDialog(link)}
                    className="p-1.5 bg-[#17181f] border border-[#222328] hover:border-zinc-700 text-zinc-400 hover:text-white rounded-lg text-xs transition"
                    title="Edit link details"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => openDeleteDialog(link.id)}
                    className="p-1.5 bg-[#17181f] border border-[#222328] hover:border-red-900/40 text-zinc-400 hover:text-red-400 rounded-lg text-xs transition"
                    title="Delete link"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modern Native <dialog> Modal: Create Link */}
      <dialog
        ref={createDialogRef}
        aria-labelledby="create-dialog-title"
        className="rounded-2xl border border-[#282930] bg-[#111113] text-zinc-200 p-6 max-w-lg w-full shadow-2xl backdrop:bg-black/75"
      >
        <div className="flex items-center justify-between pb-4 border-b border-[#1e1f26]">
          <h2 id="create-dialog-title" className="text-lg font-bold text-white">
            Create Short Link
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
          <div className="flex items-center gap-2 p-3 my-4 rounded-xl border border-red-500/20 bg-red-950/20 text-red-400 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{createError}</span>
          </div>
        )}

        <form onSubmit={handleCreate} className="space-y-4 pt-4">
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">
              Destination URL *
            </label>
            <input
              type="url"
              required
              placeholder="https://example.com/promo/landing"
              value={createForm.destinationUrl}
              onChange={(e) => setCreateForm({ ...createForm, destinationUrl: e.target.value })}
              className="w-full bg-[#18191f] border border-[#282930] rounded-xl px-3.5 py-2 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">
              Custom Alias (Optional)
            </label>
            <div className="flex items-center rounded-xl border border-[#282930] bg-[#18191f] overflow-hidden focus-within:border-blue-500">
              <span className="px-3 text-xs text-zinc-500 bg-[#141419] py-2 border-r border-[#282930]">
                linktrace.dev/
              </span>
              <input
                type="text"
                placeholder="my-alias (auto-generated if empty)"
                value={createForm.shortCode}
                onChange={(e) => setCreateForm({ ...createForm, shortCode: e.target.value })}
                className="flex-1 bg-transparent px-3 py-2 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">
              Title (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Black Friday Bio Link"
              value={createForm.title}
              onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
              className="w-full bg-[#18191f] border border-[#282930] rounded-xl px-3.5 py-2 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Assign to Campaign
              </label>
              <select
                value={createForm.campaignId}
                onChange={(e) => setCreateForm({ ...createForm, campaignId: e.target.value })}
                className="w-full bg-[#18191f] border border-[#282930] rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-blue-500 transition"
              >
                <option value="">No Campaign</option>
                {campaigns.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Expiration Date (Optional)
              </label>
              <input
                type="date"
                value={createForm.expiresAt}
                onChange={(e) => setCreateForm({ ...createForm, expiresAt: e.target.value })}
                className="w-full bg-[#18191f] border border-[#282930] rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-blue-500 transition"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#1e1f26]">
            <button
              type="button"
              onClick={closeCreateDialog}
              className="px-4 py-2 rounded-xl text-sm text-zinc-400 hover:text-white transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createSubmitting}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl text-sm font-semibold shadow-lg shadow-blue-500/25 transition"
            >
              {createSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>Create Link</span>
            </button>
          </div>
        </form>
      </dialog>

      {/* Modern Native <dialog> Modal: Edit Link */}
      <dialog
        ref={editDialogRef}
        aria-labelledby="edit-dialog-title"
        className="rounded-2xl border border-[#282930] bg-[#111113] text-zinc-200 p-6 max-w-lg w-full shadow-2xl backdrop:bg-black/75"
      >
        <div className="flex items-center justify-between pb-4 border-b border-[#1e1f26]">
          <h2 id="edit-dialog-title" className="text-lg font-bold text-white">
            Edit Link Details
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
          <div className="flex items-center gap-2 p-3 my-4 rounded-xl border border-red-500/20 bg-red-950/20 text-red-400 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{editError}</span>
          </div>
        )}

        <form onSubmit={handleUpdate} className="space-y-4 pt-4">
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">
              Destination URL *
            </label>
            <input
              type="url"
              required
              value={editForm.destinationUrl}
              onChange={(e) => setEditForm({ ...editForm, destinationUrl: e.target.value })}
              className="w-full bg-[#18191f] border border-[#282930] rounded-xl px-3.5 py-2 text-sm text-zinc-200 focus:outline-none focus:border-blue-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">
              Title
            </label>
            <input
              type="text"
              value={editForm.title}
              onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
              className="w-full bg-[#18191f] border border-[#282930] rounded-xl px-3.5 py-2 text-sm text-zinc-200 focus:outline-none focus:border-blue-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">
              Campaign
            </label>
            <select
              value={editForm.campaignId}
              onChange={(e) => setEditForm({ ...editForm, campaignId: e.target.value })}
              className="w-full bg-[#18191f] border border-[#282930] rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-blue-500 transition"
            >
              <option value="">No Campaign</option>
              {campaigns.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3 pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-zinc-300">
              <input
                type="checkbox"
                checked={editForm.isActive}
                onChange={(e) => setEditForm({ ...editForm, isActive: e.target.checked })}
                className="rounded bg-[#18191f] border-[#282930] text-blue-600 focus:ring-0"
              />
              <span>Link is Active (redirects enabled)</span>
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#1e1f26]">
            <button
              type="button"
              onClick={closeEditDialog}
              className="px-4 py-2 rounded-xl text-sm text-zinc-400 hover:text-white transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={editSubmitting}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl text-sm font-semibold shadow-lg shadow-blue-500/25 transition"
            >
              {editSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </dialog>

      {/* Modern Native <dialog> Modal: Confirm Delete */}
      <dialog
        ref={deleteDialogRef}
        aria-labelledby="delete-dialog-title"
        className="rounded-2xl border border-[#282930] bg-[#111113] text-zinc-200 p-6 max-w-sm w-full shadow-2xl backdrop:bg-black/75"
      >
        <h2 id="delete-dialog-title" className="text-base font-bold text-white mb-2">
          Delete Short Link?
        </h2>
        <p className="text-xs text-zinc-400 leading-relaxed mb-5">
          Are you sure you want to delete this link? All recorded click analytics and attribution data for this link will be permanently removed.
        </p>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={closeDeleteDialog}
            className="px-4 py-2 rounded-xl text-xs font-medium text-zinc-400 hover:text-white transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-red-600/20 transition"
          >
            Delete Link
          </button>
        </div>
      </dialog>
    </div>
  );
}
