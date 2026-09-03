"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import type { UserRole } from "@/types";
import {
  Building2,
  Rocket,
  Scale,
  Shield,
  Check,
  Lock,
  UserCheck,
  Sparkles,
} from "lucide-react";
import { Modal, Button, Badge } from "@/components/ui";

interface RoleLoginModalProps {
  open: boolean;
  onClose: () => void;
}

const roleCards: {
  role: UserRole;
  title: string;
  badge: string;
  color: string;
  border: string;
  iconBg: string;
  icon: React.ReactNode;
  description: string;
  features: string[];
}[] = [
  {
    role: "government",
    title: "Government Portal",
    badge: "Ministry / Dept Officer",
    color: "text-blue-700 bg-blue-50",
    border: "hover:border-blue-500",
    iconBg: "bg-blue-600 text-white",
    icon: <Building2 size={24} />,
    description: "Post innovation challenges, run AI requirement analysis, approve sandbox milestones & release payments.",
    features: [
      "AI Problem Analyzer & Auto-Refine",
      "Challenge Lifecycle Management",
      "Milestone Disbursal & GFR Compliance",
    ],
  },
  {
    role: "startup",
    title: "Startup Hub",
    badge: "DPIIT Verified Startup",
    color: "text-purple-700 bg-purple-50",
    border: "hover:border-purple-500",
    iconBg: "bg-purple-600 text-white",
    icon: <Rocket size={24} />,
    description: "Discover government challenges with AI matching score, verify GFR Rule 161 waivers & submit proposals.",
    features: [
      "AI Match Score & Domain Fit (91%)",
      "GFR Rule 161 Waiver Certificate",
      "Structured Proposal Submission",
    ],
  },
  {
    role: "evaluator",
    title: "Evaluator Portal",
    badge: "Independent Tech Expert",
    color: "text-amber-700 bg-amber-50",
    border: "hover:border-amber-500",
    iconBg: "bg-amber-600 text-white",
    icon: <Scale size={24} />,
    description: "Conduct blind 100-point candidate evaluations, generate analysis graphs & official evaluation dossiers.",
    features: [
      "Anonymized Blind Evaluation Matrix",
      "Score Dimension Analysis & Graphs",
      "Official Candidate Evaluation Dossier",
    ],
  },
];

export function RoleLoginModal({ open, onClose }: RoleLoginModalProps) {
  const { state, setRole, log } = useStore();
  const [selectedRole, setSelectedRole] = useState<UserRole>(state.currentRole);

  const handleLogin = (role: UserRole) => {
    setSelectedRole(role);
    setRole(role);
    log({
      actor: `${role.toUpperCase()} User`,
      role: role,
      action: "USER_LOGGED_IN",
      entityType: "user",
      entityId: `user_${role}_001`,
      details: `User logged into ${role} portal mode.`,
    });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Select Portal Login Mode">
      <div className="space-y-4 py-2">
        <p className="text-xs text-gov-muted">
          GovSetu enforces strict role-based task partitioning. Select a portal login to switch your active workspace permissions:
        </p>

        <div className="grid grid-cols-1 gap-3">
          {roleCards.map((c) => {
            const isCurrent = state.currentRole === c.role;
            return (
              <div
                key={c.role}
                onClick={() => handleLogin(c.role)}
                className={`group relative p-4 rounded-xl border-2 transition-all cursor-pointer ${
                  isCurrent
                    ? "border-gov-blue bg-blue-50/40 shadow-md"
                    : `border-gray-200 bg-white ${c.border} hover:shadow-md`
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-3 rounded-xl ${c.iconBg} shadow-sm group-hover:scale-105 transition-transform`}>
                    {c.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h4 className="font-heading font-bold text-base text-gov-navy flex items-center gap-2">
                        {c.title}
                        {isCurrent && (
                          <span className="flex items-center gap-1 text-xs text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full font-semibold">
                            <UserCheck size={12} /> Active Login
                          </span>
                        )}
                      </h4>
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${c.color}`}>
                        {c.badge}
                      </span>
                    </div>
                    <p className="text-xs text-gov-muted mb-2 leading-relaxed">{c.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {c.features.map((f, i) => (
                        <span key={i} className="text-[10px] text-gov-text bg-gray-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                          <Check size={10} className="text-gov-blue" />
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-2 flex justify-end">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}
