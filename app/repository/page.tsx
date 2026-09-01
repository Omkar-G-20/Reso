"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { RepositoryCard } from "@/components/repository-card";
import { StatCard, SectionTitle, Modal, Badge, Alert, Card } from "@/components/ui";
import { Button } from "@/components/ui";
import { formatCurrency } from "@/lib/utils";
import type { ProcurementItem } from "@/types";
import {
  Archive,
  TrendingUp,
  BadgeCheck,
  Share2,
  Search,
  Star,
  BarChart3,
  Building2,
  DollarSign,
  CheckCircle2,
} from "lucide-react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function RepositoryPage() {
  const { state } = useStore();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<ProcurementItem | null>(null);

  const filtered = state.procurements.filter(
    (p) =>
      !search ||
      p.solutionTitle.toLowerCase().includes(search.toLowerCase()) ||
      p.startupName.toLowerCase().includes(search.toLowerCase()) ||
      p.domains.some((d) => d.toLowerCase().includes(search.toLowerCase()))
  );

  const totalProcurementValue = state.procurements.reduce((s, p) => s + p.procurementValue, 0);
  const avgKpiAchievement = state.procurements.length > 0
    ? Math.round(state.procurements.reduce((s, p) => s + p.kpiAchievement, 0) / state.procurements.length)
    : 0;

  // Radar chart data for selected item
  const getRadarData = (item: ProcurementItem) => [
    { metric: "KPI Achievement", value: item.kpiAchievement, fullMark: 100 },
    { metric: "Pilot Score", value: item.pilotSuccessScore, fullMark: 100 },
    { metric: "Replication Potential", value: Math.min(item.replicableFor.length * 20, 100), fullMark: 100 },
    { metric: "Cost Efficiency", value: 82, fullMark: 100 },
    { metric: "Scalability", value: 88, fullMark: 100 },
  ];

  const barData = state.pilots.map((p) => ({
    name: p.startupName.split(" ")[0],
    progress: p.overallProgress,
    disbursed: Math.round(p.disbursedAmount / 100000),
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 rounded-xl bg-emerald-600">
              <Archive size={18} className="text-white" />
            </div>
            <h1 className="font-heading font-bold text-2xl text-gov-navy">Innovation Repository & Scaling Hub</h1>
          </div>
          <p className="text-gov-muted text-sm ml-11">
            Piloted solutions certified for cross-departmental procurement and national scaling.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Certified Solutions"
          value={state.procurements.length}
          icon={<BadgeCheck size={20} />}
          color="green"
        />
        <StatCard
          label="Total Procurement Value"
          value={formatCurrency(totalProcurementValue)}
          icon={<DollarSign size={20} />}
          color="blue"
        />
        <StatCard
          label="Avg KPI Achievement"
          value={`${avgKpiAchievement}%`}
          icon={<TrendingUp size={20} />}
          color="amber"
        />
        <StatCard
          label="Departments Reachable"
          value={state.procurements.reduce((s, p) => s + p.replicableFor.length, 0)}
          icon={<Share2 size={20} />}
          color="purple"
        />
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Pilot Progress Bar Chart */}
        <Card className="p-5">
          <h3 className="font-heading font-semibold text-gov-navy mb-4 flex items-center gap-2">
            <BarChart3 size={16} className="text-gov-blue" />
            Sandbox Pilot Progress Overview
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={barData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#6B7280" }} />
              <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} unit="%" />
              <Tooltip
                formatter={(v, name) => [
                  `${v}${name === "progress" ? "%" : "L"}`,
                  name === "progress" ? "Progress" : "Disbursed (â‚¹L)",
                ]}
                contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #E5E7EB" }}
              />
              <Bar dataKey="progress" fill="#2563EB" radius={[4, 4, 0, 0]} name="progress" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Radar chart for first procurement */}
        {state.procurements.length > 0 && (
          <Card className="p-5">
            <h3 className="font-heading font-semibold text-gov-navy mb-4 flex items-center gap-2">
              <Star size={16} className="text-gov-warning" />
              Solution Performance Radar
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <RadarChart data={getRadarData(state.procurements[0])}>
                <PolarGrid stroke="#E5E7EB" />
                <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10, fill: "#6B7280" }} />
                <Radar
                  name="Score"
                  dataKey="value"
                  stroke="#10B981"
                  fill="#10B981"
                  fillOpacity={0.2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </Card>
        )}
      </div>

      {/* Solutions Grid */}
      <div>
        <SectionTitle
          title="Certified Solutions"
          subtitle={`${filtered.length} solutions ready for procurement`}
          action={
            <div className="flex items-center gap-2 bg-white border border-gov-border rounded-lg px-3 py-2">
              <Search size={14} className="text-gov-muted" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search solutions..."
                className="outline-none text-sm w-40"
              />
            </div>
          }
        />

        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gov-muted">
            <Archive size={40} className="mx-auto mb-3 opacity-30" />
            <p>No certified solutions yet. Solutions appear here after successful sandbox pilots.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
            {filtered.map((item) => (
              <RepositoryCard key={item.id} item={item} onView={setSelected} />
            ))}
          </div>
        )}
      </div>

      {/* Solution Detail Modal */}
      {selected && (
        <Modal
          open={!!selected}
          onClose={() => setSelected(null)}
          title={selected.solutionTitle}
          size="xl"
        >
          <div className="p-6 space-y-5">
            {/* Top info */}
            <div className="flex items-start gap-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <Badge variant="success">Procurement Ready</Badge>
                  <Badge variant="blue">{selected.department}</Badge>
                </div>
                <p className="text-sm text-gov-muted leading-relaxed">{selected.description}</p>
              </div>
            </div>

            {/* Performance metrics */}
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                <div className="text-xs text-gov-muted mb-1">KPI Achievement</div>
                <div className="font-heading font-bold text-2xl text-gov-success">{selected.kpiAchievement}%</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-100">
                <div className="text-xs text-gov-muted mb-1">Pilot Score</div>
                <div className="font-heading font-bold text-2xl text-gov-blue">{selected.pilotSuccessScore}/100</div>
              </div>
              <div className="text-center p-4 bg-amber-50 rounded-xl border border-amber-100">
                <div className="text-xs text-gov-muted mb-1">Procurement Value</div>
                <div className="font-heading font-bold text-xl text-gov-warning">{formatCurrency(selected.procurementValue)}</div>
              </div>
            </div>

            {/* Radar Chart */}
            <Card className="p-4">
              <h4 className="font-heading font-semibold text-gov-navy text-sm mb-3">Performance Radar</h4>
              <ResponsiveContainer width="100%" height={220}>
                <RadarChart data={getRadarData(selected)}>
                  <PolarGrid stroke="#E5E7EB" />
                  <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11, fill: "#6B7280" }} />
                  <Radar name="Score" dataKey="value" stroke="#10B981" fill="#10B981" fillOpacity={0.25} />
                </RadarChart>
              </ResponsiveContainer>
            </Card>

            {/* Replication */}
            <div>
              <h4 className="font-heading font-semibold text-gov-navy text-sm mb-2 flex items-center gap-1">
                <Share2 size={14} className="text-gov-blue" />
                Cross-Department Replication
              </h4>
              <div className="flex flex-wrap gap-2">
                {selected.replicableFor.map((dept) => (
                  <div key={dept} className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 border border-purple-100 rounded-lg">
                    <Building2 size={12} className="text-purple-600" />
                    <span className="text-xs text-purple-700 font-medium">{dept}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {selected.tags.map((tag) => (
                <span key={tag} className="flex items-center gap-1 text-xs bg-blue-50 text-gov-blue px-2.5 py-1 rounded-full">
                  <CheckCircle2 size={10} />
                  {tag}
                </span>
              ))}
            </div>

            <Alert variant="success" icon={<BadgeCheck size={14} />}>
              This solution has been certified by GovSetu and is available for direct procurement under
              the Government e-Marketplace (GeM) portal. Contact the startup for procurement discussions.
            </Alert>
          </div>
        </Modal>
      )}
    </div>
  );
}
