"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import { useStore } from "@/lib/store";
import { EvaluationModal } from "@/components/evaluation-modal";
import { EvaluationDossierModal } from "@/components/evaluation-dossier-modal";
import { StatCard, SectionTitle, Card, Badge, Alert, Button } from "@/components/ui";
import { anonymizeName, formatCurrency } from "@/lib/utils";
import type { Proposal, Evaluation } from "@/types";
import {
  Scale,
  CheckCircle2,
  Clock,
  Shield,
  BarChart3,
  ArrowUpDown,
  Play,
  Eye,
  FileText,
  Award,
} from "lucide-react";
import Link from "next/link";
import { SolutionPerformanceRadar, SandboxPilotProgressOverview } from "@/components/charts";

export default function EvaluatorPage() {
  const router = useRouter();
  const { state } = useStore();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [dossierOpen, setDossierOpen] = useState(false);
  const [selectedEvaluation, setSelectedEvaluation] = useState<Evaluation | null>(null);
  const [tab, setTab] = useState<"pending" | "completed">("pending");

  // Strict RBAC Auto-Redirect: If logged in as government or startup, immediately send to their portal
  useEffect(() => {
    if (state.authUser && state.authUser.role !== "evaluator") {
      const target = state.authUser.role === "government" ? "/government" : "/startup";
      router.replace(target);
    }
  }, [state.authUser, router]);

  // RBAC Guard: Non-evaluator roles cannot access Evaluator Scoring Portal
  if (state.authUser && state.authUser.role !== "evaluator") {
    return (
      <div className="max-w-xl mx-auto py-16 px-4 text-center">
        <div className="p-8 bg-white rounded-2xl border border-slate-200 shadow-xl space-y-4">
          <div className="w-16 h-16 rounded-full bg-amber-50 border-4 border-amber-200 flex items-center justify-center mx-auto text-amber-600">
            <Shield size={32} />
          </div>
          <h2 className="font-heading font-bold text-xl text-gov-navy">Redirecting to Your Workspace...</h2>
          <p className="text-sm text-gov-muted leading-relaxed">
            Evaluator Scoring Portal is strictly restricted to Empanelled Evaluators. Redirecting you to your workspace.
          </p>
        </div>
      </div>
    );
  }

  // Get proposals pending evaluation
  const allProposals = state.proposals || [];
  const evaluatedIds = useMemo(
    () => new Set((state.evaluations || []).map((e) => e.proposalId)),
    [state.evaluations]
  );

  const pendingProposals = useMemo(
    () => allProposals.filter((p) => !evaluatedIds.has(p.id) && p.status !== "draft"),
    [allProposals, evaluatedIds]
  );

  const completedEvaluations = useMemo(
    () => state.evaluations || [],
    [state.evaluations]
  );

  // Stats
  const totalEvaluated = completedEvaluations.length;
  const qualified = completedEvaluations.filter((e) => e.qualifiedForSandbox).length;
  const avgScore =
    totalEvaluated > 0
      ? Math.round(completedEvaluations.reduce((s, e) => s + e.totalScore, 0) / totalEvaluated)
      : 0;

  // Average Dimension Scores — new 7-param system
  const avgKpi = totalEvaluated > 0
    ? Math.round(completedEvaluations.reduce((s, e) => s + (e.kpiAchievement ?? 0), 0) / totalEvaluated)
    : 0;
  const avgOps = totalEvaluated > 0
    ? Math.round(completedEvaluations.reduce((s, e) => s + (e.operationalEfficiency ?? 0), 0) / totalEvaluated)
    : 0;
  const avgScale = totalEvaluated > 0
    ? Math.round(completedEvaluations.reduce((s, e) => s + (e.scalabilityReplicability ?? 0), 0) / totalEvaluated)
    : 0;
  const avgCostRoi = totalEvaluated > 0
    ? Math.round(completedEvaluations.reduce((s, e) => s + (e.costRealismROI ?? 0), 0) / totalEvaluated)
    : 0;
  const avgInnovation = totalEvaluated > 0
    ? Math.round(completedEvaluations.reduce((s, e) => s + (e.innovationNovelty ?? 0), 0) / totalEvaluated)
    : 0;
  const avgTechRel = totalEvaluated > 0
    ? Math.round(completedEvaluations.reduce((s, e) => s + (e.technologyReliability ?? 0), 0) / totalEvaluated)
    : 0;
  const avgSustain = totalEvaluated > 0
    ? Math.round(completedEvaluations.reduce((s, e) => s + (e.sustainabilityGovernance ?? 0), 0) / totalEvaluated)
    : 0;
  // Legacy compat
  const avgTech = avgTechRel;
  const avgSec = avgSustain;
  const avgCost = avgCostRoi;

  // Proposals Table Columns
  const columns = useMemo<ColumnDef<Proposal>[]>(
    () => [
      {
        accessorKey: "id",
        header: "Applicant ID",
        cell: ({ row }) => (
          <span className="font-mono text-xs text-gov-blue font-bold">
            {anonymizeName(row.original.startupName, allProposals.indexOf(row.original))}
          </span>
        ),
      },
      {
        accessorKey: "challengeId",
        header: "Challenge",
        cell: ({ row }) => {
          const challenge = state.challenges.find((c) => c.id === row.original.challengeId);
          return (
            <div className="max-w-48">
              <p className="text-xs font-semibold text-gov-navy truncate">{challenge?.title ?? row.original.challengeId}</p>
              <p className="text-xs text-gov-muted truncate">{challenge?.department}</p>
            </div>
          );
        },
      },
      {
        accessorKey: "trlLevel",
        header: ({ column }) => (
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="flex items-center gap-1 text-xs font-semibold"
          >
            TRL <ArrowUpDown size={11} />
          </button>
        ),
        cell: ({ getValue }) => (
          <Badge variant="secondary" size="sm">TRL {getValue() as number}</Badge>
        ),
      },
      {
        accessorKey: "estimatedCost",
        header: ({ column }) => (
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="flex items-center gap-1 text-xs font-semibold"
          >
            Est. Cost <ArrowUpDown size={11} />
          </button>
        ),
        cell: ({ getValue }) => (
          <span className="text-xs font-semibold text-gov-success">
            {formatCurrency(getValue() as number)}
          </span>
        ),
      },
      {
        accessorKey: "submittedAt",
        header: "Submitted",
        cell: ({ getValue }) => (
          <span className="text-xs text-gov-muted">
            {new Date(getValue() as string).toLocaleDateString("en-IN")}
          </span>
        ),
      },
      {
        id: "actions",
        header: "Action",
        cell: ({ row }) => {
          const idx = allProposals.indexOf(row.original);
          return (
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setSelectedProposal(row.original);
                setSelectedIndex(idx);
                setModalOpen(true);
              }}
            >
              <Play size={12} />
              Evaluate
            </Button>
          );
        },
      },
    ],
    [allProposals, state.challenges]
  );

  const table = useReactTable({
    data: pendingProposals,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 rounded-xl bg-amber-500 shadow-sm">
              <Scale size={20} className="text-white" />
            </div>
            <h1 className="font-heading font-bold text-2xl text-gov-navy">Evaluator & Scoring Portal</h1>
          </div>
          <p className="text-gov-muted text-sm ml-11">
            Conduct blind 100-point candidate evaluations. Proposals scoring ≥ 80/100 auto-qualify for Sandbox Trial Pilot.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => {
            const p = pendingProposals[0] || allProposals[0];
            if (p) {
              setSelectedProposal(p);
              setSelectedIndex(allProposals.indexOf(p));
              setModalOpen(true);
            }
          }}
          className="shadow-md"
        >
          <Play size={14} />
          Start Blind Evaluation
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Pending Evaluation" value={pendingProposals.length} icon={<Clock size={20} />} color="amber" />
        <StatCard label="Evaluated" value={totalEvaluated} icon={<CheckCircle2 size={20} />} color="green" />
        <StatCard label="Qualified (≥80 PTS)" value={qualified} icon={<Shield size={20} />} color="blue" />
        <StatCard label="Average Score" value={`${avgScore}/100`} icon={<BarChart3 size={20} />} color="purple" />
      </div>

      {/* 7-Dimension Score Analysis Panel */}
      {totalEvaluated > 0 && (
        <Card className="p-5 mb-8 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white shadow-xl">
          <div className="flex items-center justify-between mb-4 border-b border-slate-700 pb-3">
            <div>
              <h3 className="font-heading font-bold text-base text-white flex items-center gap-2">
                <BarChart3 size={18} className="text-amber-400" />
                7-Dimension Evaluation Analytics
              </h3>
              <p className="text-xs text-slate-300">
                Aggregated average scores across all 7 evaluation parameters (0–10 scale each)
              </p>
            </div>
            <Badge variant="outline" size="sm" className="border-slate-500 text-slate-300">
              {totalEvaluated} Candidates Evaluated
            </Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { label: "KPI Achievement", value: avgKpi, color: "bg-blue-500", textColor: "text-blue-400", max: 10 },
              { label: "Operational Efficiency", value: avgOps, color: "bg-purple-500", textColor: "text-purple-400", max: 10 },
              { label: "Scalability & Replicability", value: avgScale, color: "bg-indigo-500", textColor: "text-indigo-400", max: 10 },
              { label: "Cost Realism & ROI", value: avgCostRoi, color: "bg-emerald-500", textColor: "text-emerald-400", max: 10 },
              { label: "Innovation & Novelty", value: avgInnovation, color: "bg-amber-500", textColor: "text-amber-400", max: 10 },
              { label: "Tech Reliability", value: avgTechRel, color: "bg-rose-500", textColor: "text-rose-400", max: 10 },
              { label: "Sustainability & Governance", value: avgSustain, color: "bg-teal-500", textColor: "text-teal-400", max: 10 },
              { label: "Avg Total Score", value: avgScore, color: "bg-gradient-to-r from-amber-500 to-orange-500", textColor: "text-amber-300", max: 100 },
            ].map((dim) => (
              <div key={dim.label} className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 space-y-2">
                <div className="flex justify-between items-start text-xs">
                  <span className={`font-semibold ${dim.textColor} leading-tight`}>{dim.label}</span>
                  <span className="text-white font-bold text-sm flex-shrink-0 ml-1">
                    {dim.value}<span className="text-slate-400 text-[10px">/{dim.max}</span>
                  </span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                  <div
                    className={`${dim.color} h-full rounded-full transition-all duration-700`}
                    style={{ width: `${(dim.value / dim.max) * 100}%` }}
                  />
                </div>
                <p className="text-[10px] text-slate-500">{Math.round((dim.value / dim.max) * 100)}% of max</p>
              </div>
            ))}
          </div>

          {/* Visual Performance Charts (Radar & Pilot Velocity) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 mt-4 border-t border-slate-700">
            <SolutionPerformanceRadar
              kpi={avgKpi * 10}
              pilotScore={avgScore}
              replication={avgScale * 10}
              costEfficiency={avgCostRoi * 10}
              scalability={avgTechRel * 10}
              title="Cohort Solution Performance Radar"
            />
            <SandboxPilotProgressOverview
              pilots={state.pilots.slice(0, 2).map((p) => ({
                name: p.startupName.split(" ")[0],
                progress: p.overallProgress || 50,
              }))}
            />
          </div>
        </Card>
      )}

      {/* Blind evaluation notice */}
      <Alert variant="info" icon={<Shield size={14} />} className="mb-6">
        <strong>Blind Evaluation Mode Active:</strong> Startup identities are anonymized with unique IDs (e.g., Applicant A-001) to ensure unbiased 100-point scoring.
      </Alert>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-6 w-fit">
        {(["pending", "completed"] as const).map((t) => (
          <button
            key={t}
            id={`eval-tab-${t}`}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-150 capitalize ${
              tab === t ? "bg-white shadow text-gov-navy" : "text-gov-muted hover:text-gov-text"
            }`}
          >
            {t === "pending" ? `Pending (${pendingProposals.length})` : `Completed (${totalEvaluated})`}
          </button>
        ))}
      </div>

      {/* Pending — TanStack Table */}
      {tab === "pending" && (
        <div className="space-y-4 animate-fade-in">
          <SectionTitle
            title="Proposals Awaiting Evaluation"
            subtitle="Click 'Evaluate' to open the blind scoring matrix modal"
          />

          {/* Search */}
          <div className="flex items-center gap-2 bg-white border border-gov-border rounded-lg px-3 py-2 w-fit">
            <Eye size={14} className="text-gov-muted" />
            <input
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="Filter proposals..."
              className="outline-none text-sm w-48"
            />
          </div>

          <div className="bg-white rounded-xl border border-gov-border shadow-gov overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gov-border">
                    {table.getHeaderGroups().map((hg) =>
                      hg.headers.map((header) => (
                        <th
                          key={header.id}
                          className="px-4 py-3 text-left text-xs font-bold text-gov-muted uppercase tracking-wider"
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </th>
                      ))
                    )}
                  </tr>
                </thead>
                <tbody>
                  {table.getRowModel().rows.map((row, i) => (
                    <tr
                      key={row.id}
                      className={`border-b border-gov-border hover:bg-blue-50/30 transition-colors ${i % 2 === 0 ? "bg-white" : "bg-gray-50/30"}`}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="px-4 py-3">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))}
                  {table.getRowModel().rows.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center py-10 text-gov-muted">
                        <CheckCircle2 size={32} className="mx-auto mb-2 text-gov-success opacity-50" />
                        <p className="font-semibold text-sm text-gov-navy">All candidate proposals have been scored!</p>
                        <p className="text-xs text-gov-muted max-w-sm mx-auto mt-1 mb-3">
                          You can review completed dossiers in the &quot;Completed&quot; tab or evaluate any candidate again.
                        </p>
                        {allProposals.length > 0 && (
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => {
                              setSelectedProposal(allProposals[0]);
                              setSelectedIndex(0);
                              setModalOpen(true);
                            }}
                          >
                            <Play size={12} />
                            Open Evaluation Matrix ({anonymizeName(allProposals[0].startupName, 0)})
                          </Button>
                        )}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Completed Section — Fixed, High-Performance View */}
      {tab === "completed" && (
        <div className="space-y-4 animate-fade-in">
          <SectionTitle
            title="Completed Candidate Evaluations & Dossiers"
            subtitle="View full evaluation dossiers, score graphs, and GFR qualification status"
          />

          {completedEvaluations.length === 0 ? (
            <Card className="p-10 text-center text-gov-muted">
              <Clock size={32} className="mx-auto mb-2 text-amber-500 opacity-50" />
              <p className="font-semibold text-sm">No completed evaluations yet.</p>
              <p className="text-xs mt-1">Switch to the "Pending" tab to start scoring candidate proposals.</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {completedEvaluations.map((evaluation, i) => {
                const proposal = state.proposals.find((p) => p.id === evaluation.proposalId) ?? null;
                const challenge = state.challenges.find((c) => c.id === evaluation.challengeId) ?? null;
                const pIndex = proposal ? allProposals.indexOf(proposal) : i;
                const anonName = proposal ? anonymizeName(proposal.startupName, pIndex) : `Applicant ${i + 1}`;

                return (
                  <Card key={evaluation.id} className="p-5 hover:border-gov-blue transition-all">
                    <div className="flex items-start gap-4">
                      {/* Score Badge */}
                      <div
                        className={`w-16 h-16 rounded-xl flex flex-col items-center justify-center border-2 flex-shrink-0 shadow-sm ${
                          evaluation.totalScore >= 80
                            ? "border-gov-success bg-emerald-50 text-gov-success"
                            : "border-gov-danger bg-red-50 text-gov-danger"
                        }`}
                      >
                        <span className="font-heading font-bold text-xl leading-none">
                          {evaluation.totalScore}
                        </span>
                        <span className="text-[10px] text-gov-muted">/100 PTS</span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="font-mono text-xs font-bold text-gov-blue">{anonName}</span>
                          <Badge variant={evaluation.qualifiedForSandbox ? "success" : "danger"} size="sm">
                            {evaluation.qualifiedForSandbox ? "✓ Qualified (≥80)" : "✗ Rejected (<80)"}
                          </Badge>
                          {evaluation.evaluationType && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-semibold">
                              {evaluation.evaluationType === "tech" ? "Tech-Intensive" : "Low-Tech"}
                            </span>
                          )}
                          <span className="text-xs text-gov-muted ml-auto font-mono">
                            {evaluation.evaluatedAt ? new Date(evaluation.evaluatedAt).toLocaleDateString("en-IN") : "Recent"}
                          </span>
                        </div>

                        <p className="text-xs text-gov-navy font-semibold mb-2 truncate">
                          {challenge?.title ?? evaluation.challengeId}
                        </p>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs bg-gray-50 p-2.5 rounded-xl border border-gov-border mb-3">
                          <div>
                            <span className="text-gov-muted text-[11px] block">KPI Metric</span>
                            <strong className="text-gov-navy font-bold">{evaluation.kpiAchievement ?? Math.round((evaluation.technicalFeasibility ?? 30) / 4)}/10</strong>
                          </div>
                          <div>
                            <span className="text-gov-muted text-[11px] block">Efficiency</span>
                            <strong className="text-gov-navy font-bold">{evaluation.operationalEfficiency ?? 8}/10</strong>
                          </div>
                          <div>
                            <span className="text-gov-muted text-[11px] block">Tech Robustness</span>
                            <strong className="text-gov-navy font-bold">{evaluation.technologyReliability ?? Math.round((evaluation.technicalFeasibility ?? 32) / 4)}/10</strong>
                          </div>
                          <div>
                            <span className="text-gov-muted text-[11px] block">Cost & ROI</span>
                            <strong className="text-gov-navy font-bold">{evaluation.costRealismROI ?? Math.round((evaluation.costRealism ?? 24) / 3)}/10</strong>
                          </div>
                        </div>

                        <p className="text-xs text-gov-muted line-clamp-2 mb-3">{evaluation.comments || "Blind evaluation completed under GFR Rule 161."}</p>

                        <div className="flex flex-wrap gap-2 pt-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedEvaluation(evaluation);
                              setSelectedProposal(proposal);
                              setSelectedIndex(pIndex);
                              setDossierOpen(true);
                            }}
                          >
                            <FileText size={12} />
                            Open Full Candidate Dossier
                          </Button>
                          {proposal && (
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => {
                                setSelectedProposal(proposal);
                                setSelectedIndex(pIndex);
                                setModalOpen(true);
                              }}
                            >
                              <Scale size={12} />
                              Re-Score Candidate
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Evaluation Modal (For Pending) */}
      <EvaluationModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setSelectedProposal(null); }}
        proposal={selectedProposal}
        proposalIndex={selectedIndex}
        evaluatorId="eval_portal_001"
      />

      {/* Evaluation Dossier Modal (For Completed) */}
      {selectedEvaluation && (
        <EvaluationDossierModal
          open={dossierOpen}
          onClose={() => { setDossierOpen(false); setSelectedEvaluation(null); }}
          evaluation={selectedEvaluation}
          proposal={selectedProposal}
          challenge={state.challenges.find((c) => c.id === selectedEvaluation.challengeId) ?? null}
          proposalIndex={selectedIndex}
        />
      )}
    </div>
  );
}
