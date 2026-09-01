"use client";

import { useState, useMemo } from "react";
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
import { StatCard, SectionTitle, Card, Badge, Alert } from "@/components/ui";
import { Button } from "@/components/ui";
import { anonymizeName, formatCurrency } from "@/lib/utils";
import type { Proposal } from "@/types";
import {
  Scale,
  CheckCircle2,
  Clock,
  Shield,
  BarChart3,
  ArrowUpDown,
  Play,
  Eye,
} from "lucide-react";

export default function EvaluatorPage() {
  const { state } = useStore();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [tab, setTab] = useState<"pending" | "completed">("pending");

  // Get proposals pending evaluation
  const allProposals = state.proposals;
  const evaluatedIds = new Set(state.evaluations.map((e) => e.proposalId));
  
  const pendingProposals = allProposals.filter(
    (p) => !evaluatedIds.has(p.id) && p.status !== "draft"
  );
  const completedEvaluations = state.evaluations;

  // Stats
  const totalEvaluated = completedEvaluations.length;
  const qualified = completedEvaluations.filter((e) => e.qualifiedForSandbox).length;
  const avgScore = totalEvaluated > 0
    ? Math.round(completedEvaluations.reduce((s, e) => s + e.totalScore, 0) / totalEvaluated)
    : 0;

  // â”€â”€ Proposals Table Columns â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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
            <div className="p-2 rounded-xl bg-amber-500">
              <Scale size={18} className="text-white" />
            </div>
            <h1 className="font-heading font-bold text-2xl text-gov-navy">Evaluator & Scoring Portal</h1>
          </div>
          <p className="text-gov-muted text-sm ml-11">
            Conduct blind evaluations. Proposals scoring â‰¥ 80/100 auto-qualify for Sandbox Pilot.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Pending Evaluation" value={pendingProposals.length} icon={<Clock size={20} />} color="amber" />
        <StatCard label="Evaluated" value={totalEvaluated} icon={<CheckCircle2 size={20} />} color="green" />
        <StatCard label="Qualified (â‰¥80)" value={qualified} icon={<Shield size={20} />} color="blue" />
        <StatCard label="Average Score" value={`${avgScore}/100`} icon={<BarChart3 size={20} />} color="purple" />
      </div>

      {/* Blind evaluation notice */}
      <Alert variant="info" icon={<Shield size={14} />} className="mb-6">
        <strong>Blind Evaluation Mode:</strong> All startup identities are anonymized. You will see applicant codes
        (e.g. Applicant A-001) instead of company names to prevent bias.
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

      {/* Pending â€” TanStack Table */}
      {tab === "pending" && (
        <div className="space-y-4 animate-fade-in">
          <SectionTitle
            title="Proposals Awaiting Evaluation"
            subtitle="Click 'Evaluate' to open the blind scoring modal"
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
                        <CheckCircle2 size={32} className="mx-auto mb-2 text-gov-success opacity-40" />
                        All proposals have been evaluated!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Completed Evaluations */}
      {tab === "completed" && (
        <div className="space-y-4 animate-fade-in">
          <SectionTitle
            title="Completed Evaluations"
            subtitle="Full history of evaluation scores and outcomes"
          />
          <div className="space-y-3">
            {completedEvaluations.map((evaluation, i) => {
              const proposal = state.proposals.find((p) => p.id === evaluation.proposalId);
              const challenge = state.challenges.find((c) => c.id === evaluation.challengeId);
              const anonName = proposal ? anonymizeName(proposal.startupName, i) : `Applicant ${i}`;
              return (
                <Card key={evaluation.id} className="p-5">
                  <div className="flex items-start gap-4">
                    {/* Score circle */}
                    <div
                      className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center border-2 flex-shrink-0 ${
                        evaluation.totalScore >= 80
                          ? "border-gov-success bg-emerald-50"
                          : "border-gov-danger bg-red-50"
                      }`}
                    >
                      <span className={`font-heading font-bold text-lg leading-none ${evaluation.totalScore >= 80 ? "text-gov-success" : "text-gov-danger"}`}>
                        {evaluation.totalScore}
                      </span>
                      <span className="text-xs text-gov-muted">/100</span>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-mono text-xs font-bold text-gov-blue">{anonName}</span>
                        <Badge variant={evaluation.qualifiedForSandbox ? "success" : "danger"} size="sm">
                          {evaluation.qualifiedForSandbox ? "âœ“ Qualified" : "âœ— Rejected"}
                        </Badge>
                      </div>
                      <p className="text-xs text-gov-navy font-semibold mb-1">{challenge?.title}</p>
                      <div className="flex gap-4 text-xs text-gov-muted mb-2">
                        <span>Technical: <strong className="text-gov-text">{evaluation.technicalFeasibility}/40</strong></span>
                        <span>Security: <strong className="text-gov-text">{evaluation.cybersecurityDataIsolation}/30</strong></span>
                        <span>Cost: <strong className="text-gov-text">{evaluation.costRealism}/30</strong></span>
                      </div>
                      <p className="text-xs text-gov-muted line-clamp-2">{evaluation.comments}</p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Evaluation Modal */}
      <EvaluationModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setSelectedProposal(null); }}
        proposal={selectedProposal}
        proposalIndex={selectedIndex}
        evaluatorId="eval_portal_001"
      />
    </div>
  );
}
