"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import {
  Building2,
  Rocket,
  Scale,
  Archive,
  ScrollText,
  Shield,
  LogIn,
  LogOut,
  User,
  Wifi,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { AuthModal } from "@/components/auth-modal";

const portalsList = [
  { href: "/government", label: "Gov Portal", role: "government", icon: Building2, color: "text-blue-600 bg-blue-50 border-blue-200" },
  { href: "/startup", label: "Startup Hub", role: "startup", icon: Rocket, color: "text-purple-600 bg-purple-50 border-purple-200" },
  { href: "/evaluator", label: "Evaluator Portal", role: "evaluator", icon: Scale, color: "text-amber-600 bg-amber-50 border-amber-200" },
  { href: "/repository", label: "Repository", role: "all", icon: Archive, color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
  { href: "/changelog", label: "Audit Log", role: "all", icon: ScrollText, color: "text-slate-600 bg-slate-50 border-slate-200" },
];

const roleBadgeConfig: Record<string, { label: string; badge: string; color: string; bg: string }> = {
  government: { label: "Government Official", badge: "Gov Officer", color: "text-blue-700 border-blue-300", bg: "bg-blue-50" },
  startup: { label: "Startup Founder", badge: "Startup Hub", color: "text-purple-700 border-purple-300", bg: "bg-purple-50" },
  evaluator: { label: "Empanelled Evaluator", badge: "Evaluator", color: "text-amber-700 border-amber-300", bg: "bg-amber-50" },
  admin: { label: "Platform Admin", badge: "Admin", color: "text-red-700 border-red-300", bg: "bg-red-50" },
};

function SyncIndicator() {
  const [synced, setSynced] = useState(true);

  useEffect(() => {
    const bc = typeof BroadcastChannel !== "undefined" ? new BroadcastChannel("govsetu_sync_v4") : null;
    let timer: ReturnType<typeof setTimeout>;

    if (bc) {
      bc.onmessage = () => {
        setSynced(false);
        clearTimeout(timer);
        timer = setTimeout(() => setSynced(true), 600);
      };
    }
    return () => {
      bc?.close();
      clearTimeout(timer);
    };
  }, []);

  return (
    <div
      className={cn(
        "hidden sm:flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border transition-all duration-300",
        synced
          ? "text-emerald-700 bg-emerald-50 border-emerald-200"
          : "text-amber-700 bg-amber-50 border-amber-200 animate-pulse"
      )}
      title="Real-time peer-to-peer sync status across tabs"
    >
      <Wifi size={10} />
      {synced ? "Live Sync" : "Syncing..."}
    </div>
  );
}

export function Navbar() {
  const { state, logout, setRole } = useStore();
  const pathname = usePathname();
  const router = useRouter();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [selectedAuthPortal, setSelectedAuthPortal] = useState<"government" | "startup" | "evaluator" | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const authUser = state.authUser;
  const currentRole = state.currentRole;
  const badgeInfo = authUser
    ? (roleBadgeConfig[authUser.role] ?? roleBadgeConfig.government)
    : (roleBadgeConfig[currentRole] ?? roleBadgeConfig.government);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    router.push("/");
  };

  const openLoginFor = (portalType: "government" | "startup" | "evaluator") => {
    setSelectedAuthPortal(portalType);
    setAuthModalOpen(true);
  };

  // Strict RBAC: Only the logged-in user's role portal is visible.
  // Other role portals are completely hidden.
  const allowedPortals = portalsList.filter((item) => {
    if (!authUser) return true;
    if (authUser.role === "government") {
      return item.role === "government" || item.role === "all";
    }
    if (authUser.role === "startup") {
      return item.role === "startup" || item.role === "all";
    }
    if (authUser.role === "evaluator") {
      return item.role === "evaluator" || item.role === "all";
    }
    return true;
  });

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-gov-border bg-white/95 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-3">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-[#1E3A8A] shadow-md group-hover:scale-105 transition-transform text-white">
                <Shield size={18} />
              </div>
              <div>
                <div className="font-heading font-bold text-gov-navy text-lg leading-tight tracking-tight">
                  GovSetu
                </div>
                <div className="text-[9px] text-gov-muted leading-tight tracking-wider uppercase font-semibold">
                  Innovation Platform
                </div>
              </div>
            </Link>

            {/* Main Portal Links (Strictly Role-Gated) */}
            <nav className="hidden lg:flex items-center gap-1.5 flex-1 justify-center">
              {allowedPortals.map((item) => {
                const Icon = item.icon;
                const isActive = pathname.startsWith(item.href);
                const isUserRole = authUser && authUser.role === item.role;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => {
                      if (item.role !== "all") {
                        setRole(item.role as "government" | "startup" | "evaluator");
                      }
                    }}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 relative",
                      isActive
                        ? "bg-slate-900 text-white shadow-sm"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    )}
                  >
                    <Icon size={14} className={isActive ? "text-white" : item.color.split(" ")[0]} />
                    {item.label}
                    {isUserRole && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 absolute -top-0.5 right-1" title="Your Logged-in Portal" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right side — Status and User controls */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <SyncIndicator />

              {authUser ? (
                /* Logged in state */
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-all shadow-sm text-left"
                  >
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#1E3A8A] to-[#2563EB] text-white flex items-center justify-center font-bold text-xs">
                      {authUser.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="hidden sm:block">
                      <div className="text-xs font-bold text-gov-navy leading-tight flex items-center gap-1">
                        {authUser.name}
                        <ChevronDown size={11} className="text-slate-400" />
                      </div>
                      <span className={cn("text-[9px] font-semibold px-1.5 py-0.2 rounded border", badgeInfo.bg, badgeInfo.color)}>
                        {badgeInfo.badge} · {authUser.orgId}
                      </span>
                    </div>
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-60 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50 animate-fade-in divide-y divide-slate-100">
                      <div className="px-4 py-2.5">
                        <p className="font-bold text-xs text-gov-navy">{authUser.name}</p>
                        <p className="text-[10px] text-slate-500 font-mono mt-0.5">{authUser.orgId}</p>
                        <span className={cn("inline-block text-[10px] px-2 py-0.5 rounded-full border font-semibold mt-1.5", badgeInfo.bg, badgeInfo.color)}>
                          {badgeInfo.label}
                        </span>
                      </div>

                      {/* Role-Gated Portal Links inside Menu */}
                      <div className="py-1">
                        <p className="px-4 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          My Portal Workspace
                        </p>
                        {authUser.role === "government" && (
                          <Link
                            href="/government"
                            onClick={() => { setRole("government"); setUserMenuOpen(false); }}
                            className="flex items-center gap-2 px-4 py-1.5 text-xs text-slate-700 hover:bg-slate-50 font-medium"
                          >
                            <Building2 size={13} className="text-blue-600" /> Government Portal Workspace
                          </Link>
                        )}
                        {authUser.role === "startup" && (
                          <Link
                            href="/startup"
                            onClick={() => { setRole("startup"); setUserMenuOpen(false); }}
                            className="flex items-center gap-2 px-4 py-1.5 text-xs text-slate-700 hover:bg-slate-50 font-medium"
                          >
                            <Rocket size={13} className="text-purple-600" /> My Startup Hub Workspace
                          </Link>
                        )}
                        {authUser.role === "evaluator" && (
                          <Link
                            href="/evaluator"
                            onClick={() => { setRole("evaluator"); setUserMenuOpen(false); }}
                            className="flex items-center gap-2 px-4 py-1.5 text-xs text-slate-700 hover:bg-slate-50 font-medium"
                          >
                            <Scale size={13} className="text-amber-600" /> My Evaluator Scoring Workspace
                          </Link>
                        )}
                      </div>

                      <div className="pt-1">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-2 w-full px-4 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors font-semibold"
                        >
                          <LogOut size={13} /> Logout ({badgeInfo.badge})
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Not logged in: Direct access options */
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => { setSelectedAuthPortal(null); setAuthModalOpen(true); }}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#1E3A8A] text-white text-xs font-semibold hover:bg-blue-900 transition-all shadow-sm"
                  >
                    <LogIn size={13} />
                    <span>Login / Register</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile quick portal bar */}
        <div className="lg:hidden border-t border-slate-100 bg-slate-50 px-3 py-1.5 overflow-x-auto flex gap-1.5">
          {portalsList.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => {
                  if (item.role !== "all") {
                    setRole(item.role as "government" | "startup" | "evaluator");
                  }
                }}
                className={cn(
                  "flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-colors",
                  isActive ? "bg-[#1E3A8A] text-white" : "text-slate-600 bg-white border border-slate-200"
                )}
              >
                <Icon size={12} />
                {item.label}
              </Link>
            );
          })}
        </div>
      </header>

      {/* Auth Modal with selected portal support */}
      <AuthModal
        open={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultPortal={selectedAuthPortal}
      />
    </>
  );
}
