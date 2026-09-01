"use client";

import { useState } from "react";
import type { Pilot, PilotMilestone } from "@/types";
import { Badge, Button, Card, ProgressBar, Alert } from "@/components/ui";
import { formatCurrency, formatDate, getStatusVariant } from "@/lib/utils";
import { useStore } from "@/lib/store";
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  Banknote,
  Building2,
  Calendar,
  TrendingUp,
  Loader2,
  DollarSign,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PilotTrackerProps {
  pilot: Pilot;
}

const milestoneStatusConfig = {
  pending: { icon: <Clock size={16} />, color: "text-gov-muted", bg: "bg-gray-100", label: "Pending" },
  in_progress: { icon: <Loader2 size={16} className="animate-spin" />, color: "text-gov-blue", bg: "bg-blue-100", label: "In Progress" },
  completed: { icon: <CheckCircle2 size={16} />, color: "text-gov-success", bg: "bg-emerald-100", label: "Completed" },
  payment_released: { icon: <Banknote size={16} />, color: "text-gov-success", bg: "bg-emerald-100", label: "Payment Released" },
};

function KPIRow({ name, target, achieved, unit }: { name: string; target: number; achieved: number | null; unit: string }) {
  const pct = achieved !== null ? Math.min(Math.round((achieved / target) * 100), 100) : 0;
  const exceeded = achieved !== null && achieved >= target;
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center text-xs">
        <span className="text-gov-muted font-medium">{name}</span>
        <span className={cn("font-bold", exceeded ? "text-gov-success" : achieved !== null ? "text-gov-warning" : "text-gov-muted")}>
          {achieved !== null ? `${achieved.toLocaleString()} / ${target.toLocaleString()} ${unit}` : `Target: ${target.toLocaleString()} ${unit}`}
        </span>
      </div>
      <ProgressBar value={achieved ?? 0} max={target} color={exceeded ? "green" : "amber"} showPercent={false} />
    </div>
  );
}

function MilestoneCard({ milestone, pilotId, index }: { milestone: PilotMilestone; pilotId: string; index: number }) {
  const { releaseMilestonePayment } = useStore();
  const [releasing, setReleasing] = useState(false);
  const [released, setReleased] = useState(false);
  const config = milestoneStatusConfig[milestone.status];

  const canRelease =
    (milestone.status === "completed" || milestone.status === "in_progress") &&
    milestone.status !== "payment_released";

  const handleRelease = async () => {
    setReleasing(true);
    await new Promise((r) => setTimeout(r, 1500));
    releaseMilestonePayment(pilotId, milestone.id, milestone.title, milestone.trancheAmount);
    setReleased(true);
    setReleasing(false);
  };

  return (
    <div className={cn("relative pl-10 pb-8 last:pb-0", "animate-fade-in")} style={{ animationDelay: `${index * 0.1}s` }}>
      {/* Timeline line */}
      {index > 0 && (
        <div className="absolute left-4 -top-4 bottom-4 w-0.5 bg-gov-border" />
      )}

      {/* Timeline dot */}
      <div
        className={cn(
          "absolute left-0 top-1 flex items-center justify-center w-8 h-8 rounded-full border-2",
          milestone.status === "payment_released" || milestone.status === "completed"
            ? "border-gov-success bg-emerald-50"
            : milestone.status === "in_progress"
            ? "border-gov-blue bg-blue-50"
            : "border-gov-border bg-white"
        )}
      >
        <span className={config.color}>{config.icon}</span>
      </div>

      <Card className="ml-2">
        <div className="p-4 space-y-3">
          {/* Milestone header */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <Badge
                  variant={getStatusVariant(milestone.status) as Parameters<typeof Badge>[0]["variant"]}
                  size="sm"
                >
                  {config.label}
                </Badge>
                <span className="text-xs text-gov-muted">
                  <Calendar size={10} className="inline mr-1" />
                  Due: {formatDate(milestone.dueDate)}
                </span>
                {milestone.completedDate && (
                  <span className="text-xs text-gov-success font-medium">
                    <CheckCircle2 size={10} className="inline mr-1" />
                    Completed: {formatDate(milestone.completedDate)}
                  </span>
                )}
              </div>
              <h4 className="font-heading font-semibold text-gov-navy text-sm">{milestone.title}</h4>
              <p className="text-xs text-gov-muted mt-0.5">{milestone.description}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-xs text-gov-muted mb-0.5">Tranche</div>
              <div className="font-heading font-bold text-gov-success text-sm">
                {formatCurrency(milestone.trancheAmount)}
              </div>
            </div>
          </div>

          {/* KPI Metrics */}
          {milestone.kpiMetrics.length > 0 && (
            <div className="pt-2 border-t border-gov-border space-y-2">
              <p className="text-xs font-semibold text-gov-text uppercase tracking-wide flex items-center gap-1">
                <TrendingUp size={11} className="text-gov-blue" />
                KPI Metrics
              </p>
              {milestone.kpiMetrics.map((kpi, i) => (
                <KPIRow key={i} {...kpi} />
              ))}
            </div>
          )}

          {/* Release Payment Button */}
          {canRelease && !released && (
            <div className="pt-2">
              <Button
                variant="success"
                size="sm"
                loading={releasing}
                onClick={handleRelease}
                className="w-full"
              >
                <Banknote size={14} />
                Approve & Release Payment ({formatCurrency(milestone.trancheAmount)})
              </Button>
            </div>
          )}

          {(milestone.status === "payment_released" || released) && (
            <Alert variant="success" icon={<Banknote size={14} />}>
              <strong>Payment Released!</strong> â‚¹{(milestone.trancheAmount / 100000).toFixed(0)}L tranche disbursed successfully.
            </Alert>
          )}
        </div>
      </Card>
    </div>
  );
}

export function PilotTracker({ pilot }: PilotTrackerProps) {
  return (
    <div className="space-y-6">
      {/* Pilot Header */}
      <div className="gov-gradient rounded-xl p-5 text-white">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="blue" size="sm">
                {pilot.status.charAt(0).toUpperCase() + pilot.status.slice(1)}
              </Badge>
              <span className="text-blue-200 text-xs">{pilot.sandboxEnvironment}</span>
            </div>
            <h3 className="font-heading font-bold text-lg leading-snug">{pilot.challengeTitle}</h3>
            <div className="flex items-center gap-3 mt-2 text-blue-100 text-xs">
              <span className="flex items-center gap-1">
                <Building2 size={11} />
                {pilot.startupName}
              </span>
              <span className="flex items-center gap-1">
                <Calendar size={11} />
                {formatDate(pilot.startDate)} â€“ {formatDate(pilot.endDate)}
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-blue-200 text-xs mb-0.5">Total Budget</div>
            <div className="font-heading font-bold text-xl">{formatCurrency(pilot.totalBudget)}</div>
          </div>
        </div>

        {/* Progress */}
        <div className="mt-4 space-y-1.5">
          <div className="flex justify-between text-xs text-blue-100">
            <span>Overall Progress</span>
            <span className="font-bold text-white">{pilot.overallProgress}%</span>
          </div>
          <div className="h-2.5 bg-blue-800/40 rounded-full overflow-hidden">
            <div
              className="h-full bg-white/80 rounded-full transition-all duration-700"
              style={{ width: `${pilot.overallProgress}%` }}
            />
          </div>
        </div>

        {/* Budget disbursement */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-blue-700/40 text-xs">
          <span className="text-blue-200 flex items-center gap-1">
            <DollarSign size={11} />
            Disbursed: <strong className="text-white ml-1">{formatCurrency(pilot.disbursedAmount)}</strong>
          </span>
          <span className="text-blue-200">
            Remaining: <strong className="text-white">{formatCurrency(pilot.totalBudget - pilot.disbursedAmount)}</strong>
          </span>
          <span className="text-blue-200">
            {Math.round((pilot.disbursedAmount / pilot.totalBudget) * 100)}% disbursed
          </span>
        </div>
      </div>

      {/* Milestones Timeline */}
      <div>
        <h4 className="font-heading font-semibold text-gov-navy mb-4 flex items-center gap-2">
          <AlertCircle size={16} className="text-gov-blue" />
          Milestone Timeline
        </h4>
        <div className="space-y-0">
          {pilot.milestones.map((milestone, i) => (
            <MilestoneCard key={milestone.id} milestone={milestone} pilotId={pilot.id} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
