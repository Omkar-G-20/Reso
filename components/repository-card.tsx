"use client";

import type { ProcurementItem } from "@/types";
import { Badge, Button } from "@/components/ui";
import { formatCurrency } from "@/lib/utils";
import {
  Building2,
  TrendingUp,
  Share2,
  BadgeCheck,
  Star,
  Tag,
  ChevronRight,
} from "lucide-react";

interface RepositoryCardProps {
  item: ProcurementItem;
  onView?: (item: ProcurementItem) => void;
}

export function RepositoryCard({ item, onView }: RepositoryCardProps) {
  const successColor =
    item.pilotSuccessScore >= 90
      ? "text-gov-success"
      : item.pilotSuccessScore >= 75
      ? "text-gov-warning"
      : "text-gov-danger";

  return (
    <div className="gov-card p-6 space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-100 flex-shrink-0">
          <BadgeCheck size={20} className="text-gov-blue" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <Badge variant="success" size="sm">Procurement Ready</Badge>
            <span className="flex items-center gap-1 text-xs text-gov-warning font-semibold">
              <Star size={11} fill="currentColor" />
              {item.pilotSuccessScore}% Pilot Score
            </span>
          </div>
          <h3 className="font-heading font-bold text-gov-navy text-sm leading-snug">
            {item.solutionTitle}
          </h3>
          <p className="text-xs text-gov-muted mt-0.5 flex items-center gap-1">
            <Building2 size={11} />
            {item.startupName} Â· {item.department}
          </p>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-gov-muted leading-relaxed line-clamp-3">{item.description}</p>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2">
        <div className="text-center p-2 rounded-lg bg-emerald-50 border border-emerald-100">
          <div className="text-xs text-gov-muted">KPI Achievement</div>
          <div className="font-bold text-gov-success text-sm">{item.kpiAchievement}%</div>
        </div>
        <div className="text-center p-2 rounded-lg bg-blue-50 border border-blue-100">
          <div className="text-xs text-gov-muted">Procurement Value</div>
          <div className="font-bold text-gov-blue text-sm">{formatCurrency(item.procurementValue)}</div>
        </div>
        <div className="text-center p-2 rounded-lg bg-amber-50 border border-amber-100">
          <div className="text-xs text-gov-muted">Replicable For</div>
          <div className="font-bold text-gov-warning text-sm">{item.replicableFor.length} Depts</div>
        </div>
      </div>

      {/* Domains */}
      <div className="flex flex-wrap gap-1.5">
        {item.domains.map((domain) => (
          <span key={domain} className="text-xs bg-gray-100 text-gov-muted px-2.5 py-0.5 rounded-full font-medium">
            {domain}
          </span>
        ))}
      </div>

      {/* Tags */}
      {item.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {item.tags.map((tag) => (
            <span key={tag} className="flex items-center gap-1 text-xs bg-blue-50 text-gov-blue px-2 py-0.5 rounded-md">
              <Tag size={9} />
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Scaling info */}
      <div className="pt-3 border-t border-gov-border">
        <div className="flex items-center gap-1 text-xs font-semibold text-gov-text mb-2">
          <Share2 size={11} className="text-gov-blue" />
          Cross-Department Replication Potential
        </div>
        <div className="flex flex-wrap gap-1">
          {item.replicableFor.slice(0, 3).map((dept) => (
            <span key={dept} className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded-md">
              {dept}
            </span>
          ))}
          {item.replicableFor.length > 3 && (
            <span className="text-xs bg-gray-100 text-gov-muted px-2 py-0.5 rounded-md">
              +{item.replicableFor.length - 3} more
            </span>
          )}
        </div>
      </div>

      {/* Footer */}
      {onView && (
        <Button variant="outline" size="sm" className="w-full" onClick={() => onView(item)}>
          <TrendingUp size={13} />
          View Full Details
          <ChevronRight size={13} />
        </Button>
      )}
    </div>
  );
}
