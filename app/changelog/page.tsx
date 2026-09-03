"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { SectionTitle, Card, Badge } from "@/components/ui";
import { formatDateTime } from "@/lib/utils";
import type { ChangelogEntry } from "@/types";
import {
  ScrollText,
  Building2,
  Rocket,
  Scale,
  Shield,
  Search,
  Filter,
  CheckCircle2,
  DollarSign,
  FileText,
  FlaskConical,
  ShoppingBag,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

const entityConfig = {
  challenge: { icon: <FileText size={14} />, color: "bg-blue-100 text-gov-blue" },
  proposal: { icon: <Rocket size={14} />, color: "bg-purple-100 text-purple-600" },
  evaluation: { icon: <Scale size={14} />, color: "bg-amber-100 text-amber-600" },
  pilot: { icon: <FlaskConical size={14} />, color: "bg-emerald-100 text-gov-success" },
  procurement: { icon: <ShoppingBag size={14} />, color: "bg-pink-100 text-pink-600" },
  system: { icon: <Settings size={14} />, color: "bg-gray-100 text-gov-muted" },
  user: { icon: <Building2 size={14} />, color: "bg-teal-100 text-teal-600" },
};

const roleConfig = {
  government: { icon: <Building2 size={12} />, color: "bg-blue-50 text-gov-blue border-blue-200" },
  startup: { icon: <Rocket size={12} />, color: "bg-purple-50 text-purple-600 border-purple-200" },
  evaluator: { icon: <Scale size={12} />, color: "bg-amber-50 text-amber-600 border-amber-200" },
  admin: { icon: <Shield size={12} />, color: "bg-red-50 text-red-600 border-red-200" },
};

const actionBadgeVariant = (action: string): Parameters<typeof Badge>[0]["variant"] => {
  if (action.includes("PAYMENT") || action.includes("PROCUREMENT")) return "success";
  if (action.includes("PUBLISHED") || action.includes("APPROVED")) return "success";
  if (action.includes("INITIATED") || action.includes("SUBMITTED")) return "default";
  if (action.includes("REJECTED")) return "danger";
  return "secondary";
};

function ChangelogRow({ entry, index }: { entry: ChangelogEntry; index: number }) {
  const entity = entityConfig[entry.entityType];
  const role = roleConfig[entry.role];
  const isPayment = entry.action.includes("PAYMENT");

  return (
    <div
      className={cn(
        "relative pl-10 pb-6 last:pb-0 animate-fade-in",
        isPayment && "pl-10"
      )}
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      {/* Timeline line */}
      <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-gov-border last:hidden" />

      {/* Timeline icon */}
      <div
        className={cn(
          "absolute left-0 top-1 flex items-center justify-center w-8 h-8 rounded-full border-2 border-white shadow-sm",
          isPayment ? "bg-gov-success" : entity.color.split(" ")[0]
        )}
      >
        <span className={isPayment ? "text-white" : entity.color.split(" ")[1]}>
          {isPayment ? <DollarSign size={14} /> : entity.icon}
        </span>
      </div>

      <Card className={cn("p-4 ml-2", isPayment && "border-gov-success/30 bg-emerald-50/30")}>
        <div className="flex items-start justify-between gap-3 flex-wrap mb-2">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant={actionBadgeVariant(entry.action)} size="sm">
              {entry.action.replace(/_/g, " ")}
            </Badge>
            <span className={cn("flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border", role.color)}>
              {role.icon}
              {entry.role}
            </span>
          </div>
          <span className="text-xs text-gov-muted font-mono">{formatDateTime(entry.timestamp)}</span>
        </div>

        <div className="flex items-center gap-2 mb-1">
          <span
            className={cn(
              "flex items-center gap-1 text-xs px-2 py-0.5 rounded-md font-medium",
              entity.color
            )}
          >
            {entity.icon}
            {entry.entityType}
          </span>
          <span className="text-xs font-mono text-gov-muted">{entry.entityId}</span>
        </div>

        <p className="text-sm text-gov-text font-medium">{entry.actor}</p>
        <p className="text-xs text-gov-muted mt-1 leading-relaxed">{entry.details}</p>

        {isPayment && (
          <div className="mt-2 flex items-center gap-1 text-xs text-gov-success font-semibold">
            <CheckCircle2 size={11} />
            Payment disbursed and recorded in audit trail
          </div>
        )}
      </Card>
    </div>
  );
}

export default function ChangelogPage() {
  const { state } = useStore();
  const [search, setSearch] = useState("");
  const [entityFilter, setEntityFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");

  const filtered = state.changelog.filter((entry) => {
    const matchSearch =
      !search ||
      entry.details.toLowerCase().includes(search.toLowerCase()) ||
      entry.action.toLowerCase().includes(search.toLowerCase()) ||
      entry.actor.toLowerCase().includes(search.toLowerCase());
    const matchEntity = entityFilter === "all" || entry.entityType === entityFilter;
    const matchRole = roleFilter === "all" || entry.role === roleFilter;
    return matchSearch && matchEntity && matchRole;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 rounded-xl bg-gov-navy">
              <ScrollText size={18} className="text-white" />
            </div>
            <h1 className="font-heading font-bold text-2xl text-gov-navy">System Audit Log</h1>
          </div>
          <p className="text-gov-muted text-sm ml-11">
            Immutable audit trail of all platform actions, decisions, and financial transactions.
          </p>
        </div>
        <Badge variant="secondary">
          {filtered.length} entries
        </Badge>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex items-center gap-2 bg-white border border-gov-border rounded-lg px-3 py-2 flex-1 min-w-40">
          <Search size={14} className="text-gov-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search log entries..."
            className="outline-none text-sm w-full"
          />
        </div>
        <div className="flex items-center gap-2 bg-white border border-gov-border rounded-lg px-3 py-2">
          <Filter size={14} className="text-gov-muted" />
          <select
            value={entityFilter}
            onChange={(e) => setEntityFilter(e.target.value)}
            className="outline-none text-sm bg-transparent"
          >
            <option value="all">All Types</option>
            <option value="challenge">Challenge</option>
            <option value="proposal">Proposal</option>
            <option value="evaluation">Evaluation</option>
            <option value="pilot">Pilot</option>
            <option value="procurement">Procurement</option>
            <option value="system">System</option>
          </select>
        </div>
        <div className="flex items-center gap-2 bg-white border border-gov-border rounded-lg px-3 py-2">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="outline-none text-sm bg-transparent"
          >
            <option value="all">All Roles</option>
            <option value="government">Government</option>
            <option value="startup">Startup</option>
            <option value="evaluator">Evaluator</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>

      {/* Immutability Notice */}
      <div className="mb-6 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2 text-xs text-amber-700">
        <Shield size={13} className="flex-shrink-0" />
        <span>
          <strong>Immutable Audit Log:</strong> All entries are cryptographically signed and cannot be modified.
          This log constitutes an official record for RTI and accountability purposes.
        </span>
      </div>

      {/* Changelog Timeline */}
      <div>
        <SectionTitle
          title={`Timeline (${filtered.length} events)`}
          subtitle="Most recent events shown first"
        />
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-gov-muted">
            <ScrollText size={40} className="mx-auto mb-3 opacity-30" />
            <p>No log entries match your filters.</p>
          </div>
        ) : (
          <div className="space-y-0">
            {filtered.map((entry, i) => (
              <ChangelogRow key={entry.id} entry={entry} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
