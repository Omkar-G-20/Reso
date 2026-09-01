"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { ChallengeCard } from "@/components/challenge-card";
import { PilotTracker } from "@/components/pilot-tracker";
import { ChallengeBuilder } from "@/components/challenge-builder";
import { StatCard, SectionTitle, Card, Modal, Badge } from "@/components/ui";
import { Button } from "@/components/ui";
import { formatCurrency } from "@/lib/utils";
import {
  Building2,
  Plus,
  ListChecks,
  FlaskConical,
  BarChart3,
  ChevronRight,
  FileText,
} from "lucide-react";

type Tab = "overview" | "challenges" | "pilots" | "new-challenge";

export default function GovernmentPage() {
  const { state } = useStore();
  const [tab, setTab] = useState<Tab>("overview");
  const [selectedPilot, setSelectedPilot] = useState<string | null>(null);

  const challenges = state.challenges;
  const pilots = state.pilots;
  const openChallenges = challenges.filter((c) => c.status === "applications_open").length;
  const activePilots = pilots.filter((p) => p.status === "active").length;
  const totalBudget = challenges.reduce((s, c) => s + c.budget, 0);
  const disbursed = pilots.reduce((s, p) => s + p.disbursedAmount, 0);

  const tabs = [
    { id: "overview", label: "Overview", icon: <BarChart3 size={15} /> },
    { id: "challenges", label: "Challenges", icon: <ListChecks size={15} /> },
    { id: "pilots", label: "Sandbox Pilots", icon: <FlaskConical size={15} /> },
    { id: "new-challenge", label: "New Challenge", icon: <Plus size={15} /> },
  ] as const;

  const pilotData = selectedPilot ? pilots.find((p) => p.id === selectedPilot) : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 rounded-xl gov-gradient">
              <Building2 size={18} className="text-white" />
            </div>
            <h1 className="font-heading font-bold text-2xl text-gov-navy">Government Innovation Portal</h1>
          </div>
          <p className="text-gov-muted text-sm ml-11">
            Formulate challenges, track sandbox pilots, and approve milestone payments.
          </p>
        </div>
        <Button variant="primary" onClick={() => setTab("new-challenge")}>
          <Plus size={14} />
          New Challenge
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-8 w-fit">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id as Tab)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-150 ${
              tab === t.id ? "bg-white shadow text-gov-navy" : "text-gov-muted hover:text-gov-text"
            }`}
            id={`gov-tab-${t.id}`}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {tab === "overview" && (
        <div className="space-y-8 animate-fade-in">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Total Challenges" value={challenges.length} icon={<ListChecks size={20} />} color="blue" />
            <StatCard label="Open for Applications" value={openChallenges} icon={<FileText size={20} />} color="green" />
            <StatCard label="Active Pilots" value={activePilots} icon={<FlaskConical size={20} />} color="amber" />
            <StatCard label="Funds Disbursed" value={formatCurrency(disbursed)} icon={<Building2 size={20} />} color="purple" />
          </div>

          {/* Active Pilots Preview */}
          <div>
            <SectionTitle
              title="Active Sandbox Pilots"
              subtitle="Click to view milestone details and approve payments"
              action={
                <Button variant="ghost" size="sm" onClick={() => setTab("pilots")}>
                  View All <ChevronRight size={12} />
                </Button>
              }
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {pilots.filter((p) => p.status === "active").map((pilot) => (
                <Card
                  key={pilot.id}
                  hover
                  className="p-5 cursor-pointer"
                  onClick={() => { setSelectedPilot(pilot.id); }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <Badge variant={pilot.status === "active" ? "success" : "secondary"}>
                        {pilot.status}
                      </Badge>
                      <h3 className="font-heading font-semibold text-gov-navy text-sm mt-1">{pilot.challengeTitle}</h3>
                      <p className="text-xs text-gov-muted">{pilot.startupName}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gov-muted">Budget</div>
                      <div className="font-bold text-gov-navy text-sm">{formatCurrency(pilot.totalBudget)}</div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-gov-muted">
                      <span>Progress</span>
                      <span className="font-semibold">{pilot.overallProgress}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-gov-navy to-gov-blue rounded-full transition-all duration-700"
                        style={{ width: `${pilot.overallProgress}%` }}
                      />
                    </div>
                  </div>
                  <div className="mt-3 flex justify-between items-center text-xs text-gov-muted">
                    <span>Disbursed: <strong className="text-gov-success">{formatCurrency(pilot.disbursedAmount)}</strong></span>
                    <span className="text-gov-blue font-semibold flex items-center gap-1">
                      Manage <ChevronRight size={11} />
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Recent Challenges */}
          <div>
            <SectionTitle
              title="Recent Challenges"
              action={
                <Button variant="ghost" size="sm" onClick={() => setTab("challenges")}>
                  View All <ChevronRight size={12} />
                </Button>
              }
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {challenges.slice(0, 2).map((challenge) => (
                <ChallengeCard key={challenge.id} challenge={challenge} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Challenges Tab */}
      {tab === "challenges" && (
        <div className="space-y-5 animate-fade-in">
          <SectionTitle
            title={`All Challenges (${challenges.length})`}
            subtitle="Manage and monitor all government innovation challenges"
          />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {challenges.map((challenge) => (
              <ChallengeCard key={challenge.id} challenge={challenge} />
            ))}
          </div>
        </div>
      )}

      {/* Pilots Tab */}
      {tab === "pilots" && (
        <div className="space-y-5 animate-fade-in">
          <SectionTitle
            title={`Sandbox Pilots (${pilots.length})`}
            subtitle="Track milestones and approve payment tranches"
          />
          <div className="grid grid-cols-1 xl:grid-cols-1 gap-8">
            {pilots.map((pilot) => (
              <Card key={pilot.id} className="p-6">
                <PilotTracker pilot={pilot} />
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* New Challenge Tab */}
      {tab === "new-challenge" && (
        <div className="max-w-2xl animate-fade-in">
          <SectionTitle
            title="Create New Challenge"
            subtitle="Use our AI-assisted 5-step builder to formulate a well-structured government challenge"
          />
          <Card className="p-6">
            <ChallengeBuilder onSuccess={() => setTab("challenges")} />
          </Card>
        </div>
      )}

      {/* Pilot Detail Modal */}
      {pilotData && (
        <Modal
          open={!!selectedPilot}
          onClose={() => setSelectedPilot(null)}
          title={`Pilot: ${pilotData.startupName}`}
          size="xl"
        >
          <div className="p-6">
            <PilotTracker pilot={pilotData} />
          </div>
        </Modal>
      )}
    </div>
  );
}
