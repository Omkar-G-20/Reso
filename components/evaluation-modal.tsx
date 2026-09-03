"use client";

import { useState } from "react";
import type { Proposal, EvaluationType } from "@/types";
import { Modal, Button, Alert, Badge } from "@/components/ui";
import { useStore, EVAL_WEIGHTS, computeEvalScore } from "@/lib/store";
import { formatCurrency, anonymizeName } from "@/lib/utils";
import { cn } from "@/lib/utils";
import {
  Shield,
  DollarSign,
  Cpu,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Scale,
  Info,
  TrendingUp,
  Globe,
  Zap,
  Leaf,
  Target,
  ChevronRight,
  BarChart3,
  FlaskConical,
} from "lucide-react";
import { SolutionPerformanceRadar, SandboxPilotProgressOverview } from "@/components/charts";

interface EvaluationModalProps {
  open: boolean;
  onClose: () => void;
  proposal: Proposal | null;
  proposalIndex: number;
  evaluatorId: string;
}

// Parameter definitions
const PARAMS = [
  { key: "kpiAchievement", label: "KPI & Target Metric Achievement", icon: Target, color: "text-blue-600", description: "Degree to which the solution meets or exceeds stated KPIs, performance benchmarks and output targets." },
  { key: "operationalEfficiency", label: "Operational Efficiency", icon: TrendingUp, color: "text-purple-600", description: "Demonstrated reduction in time, cost, or manpower vs current approach; process streamlining." },
  { key: "scalabilityReplicability", label: "Scalability & Replicability", icon: Globe, color: "text-indigo-600", description: "Potential to scale across states/districts and replicate in similar departments nationally." },
  { key: "costRealismROI", label: "Cost Realism & ROI", icon: DollarSign, color: "text-emerald-600", description: "Market-aligned cost estimates, well-justified budget breakdown, and projected return on investment." },
  { key: "innovationNovelty", label: "Innovation & Approach Novelty", icon: Zap, color: "text-amber-500", description: "Uniqueness of solution, departure from conventional approaches, and intellectual property potential." },
  { key: "technologyReliability", label: "Technology Reliability", icon: Cpu, color: "text-rose-600", description: "Technical soundness, architecture robustness, uptime guarantees, and proof-of-concept maturity (TRL)." },
  { key: "sustainabilityGovernance", label: "Sustainability & Data Governance", icon: Leaf, color: "text-teal-600", description: "CERT-In compliance, data isolation standards, long-term maintainability, and DISHA data governance." },
] as const;

type ParamKey = typeof PARAMS[number]["key"];

function ScoreSlider({
  paramKey,
  label,
  icon: Icon,
  color,
  description,
  weight,
  value,
  onChange,
}: {
  paramKey: string;
  label: string;
  icon: React.ElementType;
  color: string;
  description: string;
  weight: number;
  value: number;
  onChange: (v: number) => void;
}) {
  const pct = (value / 10) * 100;
  const weightedPts = Math.round(value * weight * 10);

  return (
    <div className="bg-gray-50 rounded-xl p-3.5 border border-gov-border space-y-2.5">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className={cn("p-1.5 rounded-lg bg-white shadow-sm", color.replace("text-", "text-"))}>
            <Icon size={14} className={color} />
          </span>
          <div>
            <p className="font-semibold text-xs text-gov-navy">{label}</p>
            <p className="text-[10px] text-gov-muted">Weight: {Math.round(weight * 100)}%</p>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <span className={cn("font-heading font-bold text-xl leading-none", pct >= 70 ? "text-gov-success" : pct >= 40 ? "text-amber-600" : "text-gov-danger")}>
            {value}
          </span>
          <span className="text-xs text-gov-muted">/10</span>
          <div className="text-[10px] text-gov-muted">{weightedPts} pts</div>
        </div>
      </div>

      <input
        type="range"
        min={0}
        max={10}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 rounded-full appearance-none cursor-pointer accent-gov-blue"
      />

      <div className="flex justify-between text-[9px] text-gov-muted">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
          <span key={n} className={value === n ? "font-bold text-gov-blue" : ""}>{n}</span>
        ))}
      </div>

      <p className="text-[10px] text-gov-muted leading-relaxed">{description}</p>
    </div>
  );
}

export function EvaluationModal({
  open,
  onClose,
  proposal,
  proposalIndex,
  evaluatorId,
}: EvaluationModalProps) {
  const { submitEvaluation } = useStore();
  const [step, setStep] = useState<"type-select" | "scoring" | "done">("type-select");
  const [evalType, setEvalType] = useState<EvaluationType>("tech");
  const [scores, setScores] = useState<Record<ParamKey, number>>({
    kpiAchievement: 0,
    operationalEfficiency: 0,
    scalabilityReplicability: 0,
    costRealismROI: 0,
    innovationNovelty: 0,
    technologyReliability: 0,
    sustainabilityGovernance: 0,
  });
  const [comments, setComments] = useState("");
  const [commentError, setCommentError] = useState("");
  const [finalScore, setFinalScore] = useState(0);
  const [qualified, setQualified] = useState(false);

  const weights = EVAL_WEIGHTS[evalType];
  const liveTotal = computeEvalScore(evalType, scores);

  const setScore = (key: ParamKey, v: number) => {
    setScores((prev) => ({ ...prev, [key]: v }));
  };

  const handleSubmit = () => {
    if (comments.trim().length < 50) {
      setCommentError("Please provide at least 50 characters of justification.");
      return;
    }
    if (!proposal) return;
    setCommentError("");

    const evaluation = submitEvaluation({
      proposalId: proposal.id,
      evaluatorId,
      challengeId: proposal.challengeId,
      evaluationType: evalType,
      ...scores,
      comments,
      status: "completed",
    });
    setFinalScore(evaluation.totalScore);
    setQualified(evaluation.qualifiedForSandbox);
    setStep("done");
  };

  const handleClose = () => {
    setStep("type-select");
    setScores({ kpiAchievement: 0, operationalEfficiency: 0, scalabilityReplicability: 0, costRealismROI: 0, innovationNovelty: 0, technologyReliability: 0, sustainabilityGovernance: 0 });
    setComments("");
    setCommentError("");
    onClose();
  };

  if (!proposal) return null;
  const anonymousName = anonymizeName(proposal.startupName, proposalIndex);

  return (
    <Modal open={open} onClose={handleClose} title="Blind 7-Dimension Evaluation" size="xl">

      {/* Step 1 — Evaluation Type Selection */}
      {step === "type-select" && (
        <div className="p-6 space-y-5 animate-fade-in">
          <Alert variant="info" icon={<Shield size={14} />}>
            <strong>Blind Evaluation Mode Active.</strong> You are evaluating{" "}
            <strong>{anonymousName}</strong>. Identity is fully anonymized to prevent bias.
          </Alert>

          {/* Proposal summary */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gov-border text-xs space-y-2">
            <p className="font-semibold text-gov-navy">Proposal Summary</p>
            <div className="grid grid-cols-2 gap-2 text-gov-muted">
              <span>TRL Level: <strong className="text-gov-navy">TRL {proposal.trlLevel}</strong></span>
              <span>Cost: <strong className="text-gov-navy">{formatCurrency(proposal.estimatedCost)}</strong></span>
              <span className="col-span-2">Timeline: <strong className="text-gov-navy">{proposal.sandboxTimeline}</strong></span>
            </div>
            <p className="text-gov-text leading-relaxed line-clamp-3">{proposal.methodology}</p>
          </div>

          <div>
            <p className="font-semibold text-gov-navy text-sm mb-3">
              Step 1: Select Evaluation Track
            </p>
            <p className="text-xs text-gov-muted mb-4">
              Choose the track that best matches the nature of the solution. This determines how the 7 parameters are weighted.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {([
                {
                  type: "high-tech" as const,
                  label: "High-Tech",
                  badge: "AI, IoT, DeepTech",
                  color: "border-blue-500 bg-blue-50/70",
                  desc: "Solutions with deep technical architecture, hardware, edge devices, or AI/ML inference pipelines.",
                  weights: "KPI 25% · Tech Rel 20% · Scale 15% · Innov 15% · Ops 10% · Cost 10% · Gov 5%",
                },
                {
                  type: "medium-tech" as const,
                  label: "Medium-Tech",
                  badge: "Web, Mobile, Workflow",
                  color: "border-indigo-500 bg-indigo-50/70",
                  desc: "Digital workflow portals, cross-departmental dashboards, mobile apps, and citizen grievance systems.",
                  weights: "KPI 25% · Ops 20% · Scale 15% · Cost 15% · Tech 10% · Innov 10% · Gov 5%",
                },
                {
                  type: "low-tech" as const,
                  label: "Low-Tech / Process-Driven",
                  badge: "Minimal or No Tech",
                  color: "border-purple-500 bg-purple-50/70",
                  desc: "Process re-engineering, last-mile logistical workflows, operational restructuring, and capacity building.",
                  weights: "KPI 25% · Ops 25% · Cost 20% · Scale 15% · Tech 5% · Innov 5% · Gov 5%",
                },
              ] as const).map((opt) => (
                <button
                  key={opt.type}
                  onClick={() => setEvalType(opt.type)}
                  className={cn(
                    "text-left p-3.5 rounded-xl border-2 transition-all duration-200 flex flex-col justify-between",
                    evalType === opt.type ? opt.color + " shadow-md" : "border-gray-200 hover:border-gray-300 bg-white"
                  )}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-heading font-bold text-gov-navy text-xs">{opt.label}</span>
                      {evalType === opt.type && <CheckCircle2 size={13} className="text-gov-success" />}
                    </div>
                    <span className="text-[10px] font-semibold bg-white border border-slate-200 rounded-full px-2 py-0.5 text-slate-700 mb-2 inline-block">{opt.badge}</span>
                    <p className="text-[11px] text-gov-muted mb-2 leading-relaxed">{opt.desc}</p>
                  </div>
                  <p className="text-[9px] font-mono text-gov-blue bg-white/80 p-1.5 rounded border border-slate-100">{opt.weights}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 justify-end border-t border-gov-border pt-4">
            <Button variant="outline" onClick={handleClose}>Cancel</Button>
            <Button variant="primary" onClick={() => setStep("scoring")}>
              Proceed to Scoring <ChevronRight size={14} />
            </Button>
          </div>
        </div>
      )}

      {/* Step 2 — Scoring */}
      {step === "scoring" && (
        <div className="p-6 space-y-5 animate-fade-in">
          {/* Header with live score */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900 text-white">
            <div>
              <p className="font-semibold text-sm">{anonymousName} · {evalType === "tech" ? "Tech-Intensive" : "Low-Tech"} Track</p>
              <p className="text-xs text-slate-400">Score 0–10 for each of the 7 dimensions</p>
            </div>
            <div className="text-right">
              <div className={cn("font-heading font-bold text-4xl", liveTotal >= 80 ? "text-emerald-400" : liveTotal >= 60 ? "text-amber-400" : "text-red-400")}>
                {liveTotal}
              </div>
              <div className="text-xs text-slate-400">/ 100 pts</div>
            </div>
          </div>

          {liveTotal >= 80 && (
            <Alert variant="success" icon={<CheckCircle2 size={14} />}>
              Score ≥ 80 — <strong>Qualifies for Sandbox Pilot</strong> (GFR Rule 161 threshold met)
            </Alert>
          )}
          {liveTotal > 0 && liveTotal < 80 && (
            <Alert variant="warning" icon={<AlertTriangle size={14} />}>
              Need <strong>{80 - liveTotal} more points</strong> to qualify for Sandbox. Current: {liveTotal}/100
            </Alert>
          )}

          {/* 7 Parameter Sliders */}
          <div className="space-y-3 max-h-[45vh] overflow-y-auto pr-1">
            {PARAMS.map((p) => (
              <ScoreSlider
                key={p.key}
                paramKey={p.key}
                label={p.label}
                icon={p.icon}
                color={p.color}
                description={p.description}
                weight={weights[p.key as keyof typeof weights]}
                value={scores[p.key as ParamKey]}
                onChange={(v) => setScore(p.key as ParamKey, v)}
              />
            ))}
          </div>

          {/* Comments */}
          <div>
            <label className="text-sm font-semibold text-gov-text flex items-center gap-1 mb-1.5">
              <Info size={13} className="text-gov-blue" />
              Evaluation Justification (min. 50 characters)
            </label>
            <textarea
              value={comments}
              onChange={(e) => { setComments(e.target.value); setCommentError(""); }}
              rows={3}
              placeholder="Provide detailed justification for your scores, strengths, weaknesses, and recommendation..."
              className="gov-input resize-y"
            />
            <p className="text-[11px] text-gov-muted mt-1">{comments.length} / 50 min chars</p>
            {commentError && <p className="text-xs text-gov-danger font-medium mt-1">{commentError}</p>}
          </div>

          <div className="flex gap-3 justify-between border-t border-gov-border pt-4">
            <Button variant="outline" onClick={() => setStep("type-select")}>
              ← Back
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              <Scale size={14} />
              Submit Evaluation
            </Button>
          </div>
        </div>
      )}

      {/* Step 3 — Result */}
      {step === "done" && (
        <div className="p-8 text-center space-y-5 animate-fade-in">
          <div className={cn("mx-auto w-24 h-24 rounded-full flex flex-col items-center justify-center border-4 shadow-md", qualified ? "border-gov-success bg-emerald-50" : "border-gov-danger bg-red-50")}>
            {qualified ? (
              <CheckCircle2 size={36} className="text-gov-success" />
            ) : (
              <XCircle size={36} className="text-gov-danger" />
            )}
          </div>

          <div>
            <div className="font-heading font-bold text-4xl text-gov-navy mb-1">{finalScore} / 100</div>
            <Badge variant={qualified ? "success" : "danger"} size="sm">
              {qualified ? "✓ Qualified for Sandbox Pilot" : "✗ Below 80-Point Threshold"}
            </Badge>
          </div>

          {/* Visual 7-Dimension Score Graph Matrix */}
          <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 text-left space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <p className="font-heading font-bold text-sm text-white flex items-center gap-2">
                  <BarChart3 size={16} className="text-amber-400" />
                  7-Dimension Evaluation Graph Matrix
                </p>
                <p className="text-[11px] text-slate-400">
                  Track: {evalType === "tech" ? "Tech-Intensive Solution" : "Low-Tech / Process-Driven"}
                </p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Aggregate Score</span>
                <p className={cn("text-xl font-bold font-heading leading-none mt-0.5", qualified ? "text-emerald-400" : "text-red-400")}>
                  {finalScore}/100
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {PARAMS.map((p) => {
                const val = scores[p.key as ParamKey];
                const pct = (val / 10) * 100;
                const w = weights[p.key as keyof typeof weights];
                const pts = Math.round(val * w * 10);
                const Icon = p.icon;

                return (
                  <div key={p.key} className="space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="flex items-center gap-1.5 text-slate-200 font-medium">
                        <Icon size={13} className={p.color} />
                        {p.label}
                        <span className="text-[10px] text-slate-400 font-mono">({Math.round(w * 100)}% wt)</span>
                      </span>
                      <span className="font-bold text-white font-mono">
                        {val}/10 <span className="text-slate-400 text-[10px]">({pts} pts)</span>
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all duration-700",
                          pct >= 70
                            ? "bg-gradient-to-r from-emerald-500 to-teal-400"
                            : pct >= 50
                            ? "bg-gradient-to-r from-blue-500 to-indigo-400"
                            : "bg-gradient-to-r from-amber-500 to-red-400"
                        )}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Visual Performance Charts (Radar & Sandbox Pilot Progress) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            <SolutionPerformanceRadar
              kpi={Math.round((scores.kpiAchievement || 8) * 10)}
              pilotScore={finalScore}
              replication={Math.round((scores.scalabilityReplicability || 8) * 10)}
              costEfficiency={Math.round((scores.costRealismROI || 7) * 10)}
              scalability={Math.round((scores.technologyReliability || 8) * 10)}
              title="Solution Performance Radar"
            />
            <SandboxPilotProgressOverview
              pilots={[
                { name: anonymousName, progress: qualified ? 25 : 0 },
                { name: "ChainGuard", progress: 75 },
                { name: "HealthPredict", progress: 85 },
              ]}
            />
          </div>

          <Alert variant={qualified ? "success" : "danger"} icon={qualified ? <CheckCircle2 size={14} /> : <XCircle size={14} />}>
            {qualified ? (
              <div className="space-y-1">
                <p className="font-bold text-xs text-emerald-900">
                  AUTOMATICALLY QUEUED TO SANDBOX PILOT TRACKER
                </p>
                <p className="text-xs text-emerald-800">
                  This candidate passed the GFR Rule 161 threshold ({finalScore}/100 ≥ 80 pts). A Sandbox Pilot has been automatically registered and dispatched to the Government Portal for Phase 1 milestone payment approval.
                </p>
              </div>
            ) : (
              <div className="text-xs">
                This proposal scored below the 80-point threshold ({finalScore}/100). Detailed audit observations have been recorded for applicant feedback.
              </div>
            )}
          </Alert>

          <Button onClick={handleClose} variant="primary" className="w-full">
            Close Evaluation
          </Button>
        </div>
      )}
    </Modal>
  );
}
