"use client";

import { useEffect, useState } from "react";
import { ChevronDown, Plus, Layers, User, LogOut, Check } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface WorkspaceInfo {
  id: string;
  name: string;
  slug: string;
}

interface UserInfo {
  id: string;
  name: string | null;
  email: string;
}

export function Header() {
  const router = useRouter();
  const [user, setUser] = useState<UserInfo | null>(null);
  const [activeWorkspace, setActiveWorkspace] = useState<WorkspaceInfo | null>(null);
  const [workspaces, setWorkspaces] = useState<WorkspaceInfo[]>([]);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newWsName, setNewWsName] = useState("");
  const [newWsSlug, setNewWsSlug] = useState("");

  const loadUserData = async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setActiveWorkspace(data.activeWorkspace);
        setWorkspaces(data.workspaces || []);
      }
    } catch (e) {
      console.error("Failed to fetch user state:", e);
    }
  };

  useEffect(() => {
    loadUserData();
  }, []);

  const handleSwitchWorkspace = async (wsId: string) => {
    try {
      const res = await fetch("/api/workspaces/active", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workspaceId: wsId }),
      });
      if (res.ok) {
        const data = await res.json();
        setActiveWorkspace(data.activeWorkspace);
        setOpenDropdown(false);
        router.refresh();
      }
    } catch (e) {
      console.error("Failed to switch workspace:", e);
    }
  };

  const handleCreateWorkspace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWsName || !newWsSlug) return;

    try {
      const res = await fetch("/api/workspaces", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newWsName, slug: newWsSlug }),
      });
      if (res.ok) {
        await loadUserData();
        setShowCreateModal(false);
        setNewWsName("");
        setNewWsSlug("");
      }
    } catch (e) {
      console.error("Failed to create workspace:", e);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  return (
    <header className="h-16 border-b border-[#222328] bg-[#0c0d10]/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-40">
      {/* Workspace Selector Dropdown */}
      <div className="relative">
        <button
          onClick={() => setOpenDropdown(!openDropdown)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#222328] bg-[#14151a] text-sm text-zinc-200 hover:border-zinc-700 transition"
        >
          <Layers className="w-4 h-4 text-blue-400" />
          <span className="font-medium text-xs md:text-sm">
            {activeWorkspace ? activeWorkspace.name : "Personal Workspace"}
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
        </button>

        {openDropdown && (
          <div className="absolute left-0 mt-2 w-64 rounded-xl border border-[#222328] bg-[#111113] shadow-2xl p-2 z-50">
            <div className="px-3 py-1.5 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
              Workspaces
            </div>
            <div className="space-y-1">
              {workspaces.map((ws) => (
                <button
                  key={ws.id}
                  onClick={() => handleSwitchWorkspace(ws.id)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-zinc-300 hover:bg-[#1a1b22] hover:text-white transition text-left"
                >
                  <span className="truncate">{ws.name}</span>
                  {activeWorkspace?.id === ws.id && (
                    <Check className="w-3.5 h-3.5 text-blue-400" />
                  )}
                </button>
              ))}
            </div>
            <div className="pt-2 mt-2 border-t border-[#1e1f26]">
              <button
                onClick={() => {
                  setOpenDropdown(false);
                  setShowCreateModal(true);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-blue-400 hover:bg-blue-950/20 transition text-left"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create Workspace</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-3">
        <Link
          href="/links"
          className="flex items-center gap-2 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs md:text-sm font-medium shadow-md shadow-blue-500/20 transition"
        >
          <Plus className="w-4 h-4" />
          <span>New Link</span>
        </Link>

        {/* User Profile & Logout */}
        <div className="flex items-center gap-2 pl-2 border-l border-[#222328]">
          <div className="flex items-center gap-2 text-xs text-zinc-300 font-medium">
            <div className="w-8 h-8 rounded-full border border-[#222328] bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold">
              {user?.name ? user.name[0].toUpperCase() : <User className="w-4 h-4" />}
            </div>
            <span className="hidden sm:inline text-zinc-200">{user?.name || "User"}</span>
          </div>

          <button
            onClick={handleLogout}
            title="Sign out"
            className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-950/20 rounded-lg transition"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Create Workspace Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-[#111113] border border-[#222328] rounded-xl max-w-sm w-full p-6 space-y-4 shadow-2xl">
            <h2 className="text-base font-bold text-white">Create New Workspace</h2>
            <form onSubmit={handleCreateWorkspace} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Workspace Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Acme Marketing"
                  value={newWsName}
                  onChange={(e) => {
                    setNewWsName(e.target.value);
                    if (!newWsSlug) {
                      setNewWsSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, "-"));
                    }
                  }}
                  className="w-full bg-[#18191f] border border-[#282930] rounded-lg px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Workspace Slug
                </label>
                <input
                  type="text"
                  required
                  placeholder="acme-marketing"
                  value={newWsSlug}
                  onChange={(e) => setNewWsSlug(e.target.value)}
                  className="w-full bg-[#18191f] border border-[#282930] rounded-lg px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-3 py-1.5 rounded-lg text-xs text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-medium"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
}
