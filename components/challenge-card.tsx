import type { Challenge } from "@/types";
import { Badge, Button, ProgressBar } from "@/components/ui";
import { formatCurrency, formatDate, getStatusVariant } from "@/lib/utils";
import {
  Building2,
  Calendar,
  DollarSign,
  Users,
  Target,
  ChevronRight,
  Clock,
  Sparkles,
} from "lucide-react";

interface ChallengeCardProps {
  challenge: Challenge;
  onApply?: (challenge: Challenge) => void;
  onView?: (challenge: Challenge) => void;
  showMatchScore?: boolean;
  matchScore?: number;
  matchFactors?: { factor: string; score: number; maxScore: number; explanation: string }[];
}

const statusLabels: Record<string, string> = {
  draft: "Draft",
  published: "Published",
  applications_open: "Applications Open",
  evaluation: "Under Evaluation",
  sandbox: "In Sandbox",
  procurement: "Procurement",
  closed: "Closed",
};

export function ChallengeCard({
  challenge,
  onApply,
  onView,
  showMatchScore = false,
  matchScore,
  matchFactors,
}: ChallengeCardProps) {
  const statusVariant = getStatusVariant(challenge.status);

  return (
    <div className="gov-card p-6 flex flex-col gap-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <Badge variant={statusVariant as Parameters<typeof Badge>[0]["variant"]}>
              {statusLabels[challenge.status] ?? challenge.status}
            </Badge>
            {showMatchScore && matchScore !== undefined && (
              <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200">
                <Sparkles size={11} className="text-gov-success" />
                <span className="text-xs font-bold text-gov-success">{matchScore}% Match</span>
              </div>
            )}
          </div>
          <h3 className="font-heading font-bold text-gov-navy text-base leading-snug line-clamp-2">
            {challenge.title}
          </h3>
        </div>
        {challenge.status === "applications_open" && onApply && (
          <Button size="sm" variant="primary" onClick={() => onApply(challenge)}>
            Apply
          </Button>
        )}
      </div>

      {/* Department & Meta */}
      <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-gov-muted">
        <span className="flex items-center gap-1">
          <Building2 size={12} className="text-gov-blue" />
          {challenge.department}
        </span>
        <span className="flex items-center gap-1">
          <DollarSign size={12} className="text-gov-success" />
          {formatCurrency(challenge.budget)}
        </span>
        <span className="flex items-center gap-1">
          <Clock size={12} className="text-gov-warning" />
          {challenge.timeline}
        </span>
        <span className="flex items-center gap-1">
          <Users size={12} className="text-gov-blue" />
          {challenge.applicationsCount} applications
        </span>
        <span className="flex items-center gap-1">
          <Calendar size={12} />
          Deadline: {formatDate(challenge.deadline)}
        </span>
      </div>

      {/* Description */}
      <p className="text-sm text-gov-muted line-clamp-2 leading-relaxed">
        {challenge.description}
      </p>

      {/* KPIs */}
      {challenge.targetKPIs.length > 0 && (
        <div className="space-y-1">
          <div className="flex items-center gap-1 text-xs font-semibold text-gov-text uppercase tracking-wide">
            <Target size={11} className="text-gov-navy" />
            Target KPIs
          </div>
          <div className="flex flex-wrap gap-1.5">
            {challenge.targetKPIs.slice(0, 2).map((kpi, i) => (
              <span key={i} className="text-xs bg-blue-50 text-gov-blue px-2 py-0.5 rounded-md">
                {kpi}
              </span>
            ))}
            {challenge.targetKPIs.length > 2 && (
              <span className="text-xs bg-gray-100 text-gov-muted px-2 py-0.5 rounded-md">
                +{challenge.targetKPIs.length - 2} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Domains */}
      <div className="flex flex-wrap gap-1.5">
        {challenge.domains.map((domain) => (
          <span key={domain} className="text-xs bg-gray-100 text-gov-muted px-2.5 py-0.5 rounded-full font-medium">
            {domain}
          </span>
        ))}
      </div>

      {/* AI Match Factors */}
      {showMatchScore && matchFactors && matchFactors.length > 0 && (
        <div className="pt-3 border-t border-gov-border space-y-2">
          <p className="text-xs font-semibold text-gov-text uppercase tracking-wide flex items-center gap-1">
            <Sparkles size={11} className="text-gov-success" />
            AI Match Breakdown
          </p>
          {matchFactors.map((f, i) => (
            <div key={i}>
              <ProgressBar
                value={f.score}
                max={f.maxScore}
                label={f.factor}
                color="blue"
              />
              <p className="text-xs text-gov-muted mt-0.5">{f.explanation}</p>
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-1">
        <span className="text-xs text-gov-muted">
          {challenge.publishedAt ? `Published ${formatDate(challenge.publishedAt)}` : "Not yet published"}
        </span>
        {onView && (
          <button
            onClick={() => onView(challenge)}
            className="flex items-center gap-1 text-xs font-semibold text-gov-blue hover:underline"
          >
            View Details
            <ChevronRight size={12} />
          </button>
        )}
      </div>
    </div>
  );
}
