"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStore } from "@/lib/store";
import type { UserRole } from "@/types";
import {
  Building2,
  Rocket,
  Scale,
  Archive,
  ScrollText,
  ChevronDown,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const roles: { value: UserRole; label: string; icon: React.ReactNode; color: string }[] = [
  { value: "government", label: "Government Officer", icon: <Building2 size={14} />, color: "bg-blue-100 text-blue-800" },
  { value: "startup", label: "Startup Founder", icon: <Rocket size={14} />, color: "bg-purple-100 text-purple-800" },
  { value: "evaluator", label: "Evaluator", icon: <Scale size={14} />, color: "bg-amber-100 text-amber-800" },
  { value: "admin", label: "Admin", icon: <Shield size={14} />, color: "bg-red-100 text-red-800" },
];

const navLinks = [
  { href: "/government", label: "Gov Portal", icon: <Building2 size={16} />, roles: ["government", "admin"] },
  { href: "/startup", label: "Startup Hub", icon: <Rocket size={16} />, roles: ["startup", "admin"] },
  { href: "/evaluator", label: "Evaluator", icon: <Scale size={16} />, roles: ["evaluator", "admin"] },
  { href: "/repository", label: "Repository", icon: <Archive size={16} />, roles: ["government", "startup", "evaluator", "admin"] },
  { href: "/changelog", label: "Audit Log", icon: <ScrollText size={16} />, roles: ["government", "startup", "evaluator", "admin"] },
];

export function Navbar() {
  const { state, setRole } = useStore();
  const pathname = usePathname();
  const [roleOpen, setRoleOpen] = useState(false);

  const currentRole = roles.find((r) => r.value === state.currentRole) ?? roles[0];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gov-border bg-white/95 backdrop-blur-sm shadow-gov">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl gov-gradient shadow-md group-hover:scale-105 transition-transform">
              <span className="text-white font-heading font-bold text-lg">G</span>
            </div>
            <div className="hidden sm:block">
              <div className="font-heading font-bold text-gov-navy text-lg leading-tight">GovSetu</div>
              <div className="text-[10px] text-gov-muted leading-tight tracking-wide uppercase">Innovation Platform</div>
            </div>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150",
                    isActive
                      ? "bg-blue-50 text-gov-blue font-semibold"
                      : "text-gov-muted hover:bg-gray-50 hover:text-gov-navy"
                  )}
                >
                  {link.icon}
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setRoleOpen(!roleOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gov-border bg-white hover:bg-gray-50 transition-all duration-150 text-sm font-medium"
              id="role-switcher-btn"
            >
              <span className={cn("flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold", currentRole.color)}>
                {currentRole.icon}
                {currentRole.label}
              </span>
              <ChevronDown
                size={14}
                className={cn("text-gov-muted transition-transform duration-200", roleOpen && "rotate-180")}
              />
            </button>

            {roleOpen && (
              <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-gov-border rounded-xl shadow-gov-lg py-1 z-50 animate-fade-in">
                <div className="px-3 py-2 text-xs font-semibold text-gov-muted uppercase tracking-wider border-b border-gov-border mb-1">
                  Switch Role
                </div>
                {roles.map((role) => (
                  <button
                    key={role.value}
                    onClick={() => {
                      setRole(role.value);
                      setRoleOpen(false);
                    }}
                    className={cn(
                      "flex items-center gap-2.5 w-full px-3 py-2.5 text-sm transition-colors",
                      state.currentRole === role.value
                        ? "bg-blue-50 text-gov-blue font-semibold"
                        : "text-gov-text hover:bg-gray-50"
                    )}
                  >
                    <span className={cn("flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold", role.color)}>
                      {role.icon}
                    </span>
                    {role.label}
                    {state.currentRole === role.value && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-gov-blue" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <div className="md:hidden border-t border-gov-border bg-white">
        <div className="flex overflow-x-auto px-4 py-2 gap-1">
          {navLinks.map((link) => {
            const isActive = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 whitespace-nowrap",
                  isActive
                    ? "bg-blue-50 text-gov-blue font-semibold"
                    : "text-gov-muted hover:bg-gray-50 hover:text-gov-navy"
                )}
              >
                {link.icon}
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}
