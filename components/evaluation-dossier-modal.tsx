"use client";

import type { Evaluation, Proposal, Challenge } from "@/types";
import { Modal, Badge, Button } from "@/components/ui";
import { anonymizeName, formatCurrency } from "@/lib/utils";
import {
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Printer,
  Scale,
  Building2,
  Lock,
  DollarSign,
  Award,
  Cpu,
  Target,
  TrendingUp,
  Globe,
  Zap,
  Leaf,
  BarChart3,
} from "lucide-react";
import { SolutionPerformanceRadar, SandboxPilotProgressOverview } from "@/components/charts";

interface EvaluationDossierModalProps {
  open: boolean;
  onClose: () => void;
  evaluation: Evaluation | null;
  proposal: Proposal | null;
  challenge: Challenge | null;
  proposalIndex: number;
}

export function EvaluationDossierModal({
  open,
  onClose,
  evaluation,
  proposal,
  challenge,
  proposalIndex,
}: EvaluationDossierModalProps) {
  if (!evaluation || !proposal) return null;

  const applicantCode = anonymizeName(proposal.startupName, proposalIndex);
  const isQualified = evaluation.qualifiedForSandbox ?? (evaluation.totalScore >= 80);

  // 7 Dimensions with safe fallbacks
  const kpiScore = evaluation.kpiAchievement ?? Math.round((evaluation.technicalFeasibility ?? 30) / 4);
  const opsScore = evaluation.operationalEfficiency ?? 8;
  const scaleScore = evaluation.scalabilityReplicability ?? 8;
  const costRoiScore = evaluation.costRealismROI ?? Math.round((evaluation.costRealism ?? 25) / 3);
  const innovScore = evaluation.innovationNovelty ?? 8;
  const techRelScore = evaluation.technologyReliability ?? Math.round((evaluation.technicalFeasibility ?? 35) / 4);
  const sustainScore = evaluation.sustainabilityGovernance ?? Math.round((evaluation.cybersecurityDataIsolation ?? 26) / 3);

  const dimensions = [
    { label: "KPI Achievement", score: kpiScore, max: 10, icon: Target, color: "bg-blue-600", textColor: "text-blue-600" },
    { label: "Operational Efficiency", score: opsScore, max: 10, icon: TrendingUp, color: "bg-purple-600", textColor: "text-purple-600" },
    { label: "Scalability & Replicability", score: scaleScore, max: 10, icon: Globe, color: "bg-indigo-600", textColor: "text-indigo-600" },
    { label: "Cost Realism & ROI", score: costRoiScore, max: 10, icon: DollarSign, color: "bg-emerald-600", textColor: "text-emerald-600" },
    { label: "Innovation & Novelty", score: innovScore, max: 10, icon: Zap, color: "bg-amber-500", textColor: "text-amber-500" },
    { label: "Technology Reliability", score: techRelScore, max: 10, icon: Cpu, color: "bg-rose-600", textColor: "text-rose-600" },
    { label: "Sustainability & Governance", score: sustainScore, max: 10, icon: Leaf, color: "bg-teal-600", textColor: "text-teal-600" },
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal open={open} onClose={onClose} title="Official Evaluation Dossier" size="xl">
      <div className="space-y-6 py-2 printable-dossier max-h-[75vh] overflow-y-auto pr-1">
        {/* Header Badge */}
        <div className="flex items-center justify-between p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white shadow-xl">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-slate-950 uppercase tracking-wider">
                CONFIDENTIAL EVALUATION DOSSIER
              </span>
              <span className="text-xs text-slate-400 font-mono">Dossier #{evaluation.id}</span>
              {evaluation.evaluationType && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  {evaluation.evaluationType === "tech" ? "Tech-Intensive Track" : "Low-Tech Track"}
                </span>
              )}
            </div>
            <h3 className="font-heading font-bold text-xl text-white">{applicantCode}</h3>
            <p className="text-xs text-slate-300 flex items-center gap-1 mt-1">
              <Building2 size={12} className="text-blue-400" />
              Challenge: {challenge?.title ?? evaluation.challengeId}
            </p>
          </div>

          <div className="text-right flex-shrink-0">
            <div
              className={`inline-flex flex-col items-center justify-center px-5 py-2.5 rounded-2xl border-2 ${
                isQualified
                  ? "border-emerald-400 bg-emerald-950/80 text-emerald-300 shadow-lg shadow-emerald-950/50"
                  : "border-red-400 bg-red-950/80 text-red-300 shadow-lg shadow-red-950/50"
              }`}
            >
              <span className="text-3xl font-bold font-heading leading-none">{evaluation.totalScore}</span>
              <span className="text-[10px] text-slate-300 mt-0.5">/ 100 PTS</span>
            </div>
          </div>
        </div>

        {/* Qualification Status Alert */}
        <div
          className={`p-4 rounded-xl border flex items-start gap-3.5 ${
            isQualified ? "bg-emerald-50 border-emerald-200 text-emerald-900" : "bg-red-50 border-red-200 text-red-900"
          }`}
        >
          {isQualified ? (
            <Award size={24} className="text-emerald-600 flex-shrink-0 mt-0.5" />
          ) : (
            <XCircle size={24} className="text-red-600 flex-shrink-0 mt-0.5" />
          )}
          <div className="text-xs space-y-1">
            <p className="font-bold text-sm">
              {isQualified ? "AUTOMATICALLY QUALIFIED FOR SANDBOX PILOT (≥ 80 PTS)" : "DID NOT MEET QUALIFICATION THRESHOLD (< 80 PTS)"}
            </p>
            <p className="text-xs leading-relaxed">
              {isQualified
                ? "This candidate has passed the blind evaluation threshold under GFR Rule 161 guidelines. Sandbox pilot deployment and milestone tranche disbursement are fully unlocked."
                : "Candidate score falls below the required 80-point threshold for sandbox trial pilot deployment."}
            </p>
          </div>
        </div>

        {/* 7-Dimension Score Matrix & Graphs */}
        <div className="space-y-3 bg-gray-50 p-4 rounded-2xl border border-gov-border">
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-heading font-bold text-sm text-gov-navy flex items-center gap-2">
              <BarChart3 size={16} className="text-gov-blue" />
              7-Dimension Score Matrix & Performance Analytics
            </h4>
            <span className="text-[11px] text-gov-muted font-mono">Scored on 0–10 Scale</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {dimensions.map((dim) => {
              const Icon = dim.icon;
              const pct = Math.round((dim.score / dim.max) * 100);
              return (
                <div key={dim.label} className="bg-white p-3 rounded-xl border border-gov-border space-y-1.5 shadow-sm">
                  <div className="flex justify-between items-center text-xs">
                    <span className="flex items-center gap-1.5 font-semibold text-gov-navy">
                      <Icon size={13} className={dim.textColor} />
                      {dim.label}
                    </span>
                    <span className="font-bold text-gov-navy">
                      {dim.score} <span className="text-gov-muted text-[10px]">/ 10</span> ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`${dim.color} h-full rounded-full transition-all duration-500`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Graphical Performance Dossier (Radar & Pilot Velocity) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SolutionPerformanceRadar
            kpi={kpiScore * 10}
            pilotScore={evaluation.totalScore}
            replication={scaleScore * 10}
            costEfficiency={costRoiScore * 10}
            scalability={techRelScore * 10}
            title="Solution Performance Radar (5-Axis)"
          />
          <SandboxPilotProgressOverview
            pilots={[
              { name: applicantCode, progress: isQualified ? 30 : 0 },
              { name: "ChainGuard", progress: 75 },
              { name: "HealthPredict", progress: 85 },
            ]}
          />
        </div>

        {/* Detailed Application Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-white border border-gov-border rounded-xl">
            <span className="text-gov-muted block mb-0.5">Estimated Pilot Cost</span>
            <span className="font-bold text-sm text-gov-navy">{formatCurrency(proposal.estimatedCost)}</span>
          </div>
          <div className="p-3 bg-white border border-gov-border rounded-xl">
            <span className="text-gov-muted block mb-0.5">Technology Readiness</span>
            <span className="font-bold text-sm text-gov-blue">TRL Level {proposal.trlLevel}</span>
          </div>
          <div className="p-3 bg-white border border-gov-border rounded-xl">
            <span className="text-gov-muted block mb-0.5">Evaluated Date</span>
            <span className="font-bold text-sm text-gov-navy">
              {evaluation.evaluatedAt ? new Date(evaluation.evaluatedAt).toLocaleDateString("en-IN") : "Recent"}
            </span>
          </div>
          <div className="p-3 bg-white border border-gov-border rounded-xl">
            <span className="text-gov-muted block mb-0.5">Evaluator Reference</span>
            <span className="font-mono font-bold text-sm text-amber-700">{evaluation.evaluatorId}</span>
          </div>
        </div>

        {/* Methodology Snapshot */}
        {proposal.methodology && (
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gov-navy block">Proposed Technical Methodology:</label>
            <div className="p-3 bg-gray-50 border border-gov-border rounded-xl text-xs text-gov-text leading-relaxed">
              {proposal.methodology}
            </div>
          </div>
        )}

        {/* Evaluator Written Findings */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-gov-navy block">Evaluator Official Observations & Audit Comments:</label>
          <div className="p-3.5 bg-white border border-gov-border rounded-xl text-xs text-gov-text leading-relaxed shadow-sm">
            {evaluation.comments || "No additional comments provided."}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-gov-border flex items-center justify-between">
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer size={14} />
            Print Official Dossier
          </Button>
          <Button variant="primary" size="sm" onClick={onClose}>
            Close Dossier
          </Button>
        </div>
      </div>
    </Modal>
  );
}
