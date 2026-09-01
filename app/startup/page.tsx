"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { ChallengeCard } from "@/components/challenge-card";
import { DPIITChecker } from "@/components/dpiit-checker";
import { ProposalModal } from "@/components/proposal-modal";
import { StatCard, SectionTitle, Card, Badge, Alert } from "@/components/ui";
import { Button } from "@/components/ui";
import type { Challenge } from "@/types";
import {
  Rocket,
  Search,
  Shield,
  BarChart3,
  ListChecks,
  Sparkles,
  Filter,
  Info,
} from "lucide-react";

type Tab = "overview" | "challenges" | "eligibility" | "proposals";

export default function StartupPage() {
  const { state } = useStore();
  const [tab, setTab] = useState<Tab>("overview");
  const [search, setSearch] = useState("");
  const [domainFilter, setDomainFilter] = useState("all");
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [proposalModalOpen, setProposalModalOpen] = useState(false);

  // Use first startup as the logged-in startup
  const myStartup = state.startups[0];
  const myProposals = state.proposals.filter((p) => p.startupId === myStartup.id);

  const openChallenges = state.challenges.filter((c) => c.status === "applications_open");

  // Get all unique domains
  const allDomains = Array.from(new Set(state.challenges.flatMap((c) => c.domains)));

  // Filter challenges
  const filteredChallenges = openChallenges.filter((c) => {
    const matchesSearch =
      !search ||
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.department.toLowerCase().includes(search.toLowerCase());
    const matchesDomain = domainFilter === "all" || c.domains.includes(domainFilter);
    return matchesSearch && matchesDomain;
  });

  // Get match score for each challenge
  const getMatchScore = (challengeId: string) => {
    const proposal = state.proposals.find(
      (p) => p.challengeId === challengeId && p.startupId === myStartup.id
    );
    if (proposal?.matchScore) return proposal.matchScore;
    // Simulate match score based on domain overlap
    const challenge = state.challenges.find((c) => c.id === challengeId);
    if (!challenge) return 0;
    const overlap = challenge.domains.filter((d) => myStartup.domains.includes(d)).length;
    const base = Math.round(60 + (overlap / Math.max(challenge.domains.length, 1)) * 35);
    return Math.min(base, 99);
  };

  const getMatchFactors = (challenge: Challenge) => {
    const domainOverlap = challenge.domains.filter((d) => myStartup.domains.includes(d)).length;
    const domainScore = Math.round((domainOverlap / Math.max(challenge.domains.length, 1)) * 30);
    const trlScore = Math.round((myStartup.trlLevel / 9) * 30);
    const semanticScore = Math.round(20 + Math.random() * 20);
    return [
      { factor: "Semantic Similarity", score: semanticScore, maxScore: 40, explanation: "Problem domain and technical keywords alignment" },
      { factor: "Domain Compatibility", score: domainScore, maxScore: 30, explanation: `${domainOverlap}/${challenge.domains.length} domains match your expertise` },
      { factor: "Readiness Level", score: trlScore, maxScore: 30, explanation: `TRL ${myStartup.trlLevel} readiness assessment` },
    ];
  };

  const tabs = [
    { id: "overview", label: "My Dashboard", icon: <BarChart3 size={15} /> },
    { id: "challenges", label: "Discover Challenges", icon: <Sparkles size={15} /> },
    { id: "eligibility", label: "DPIIT Eligibility", icon: <Shield size={15} /> },
    { id: "proposals", label: "My Proposals", icon: <ListChecks size={15} /> },
  ] as const;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 rounded-xl bg-purple-600">
              <Rocket size={18} className="text-white" />
            </div>
            <h1 className="font-heading font-bold text-2xl text-gov-navy">Startup Discovery Hub</h1>
          </div>
          <p className="text-gov-muted text-sm ml-11">
            Welcome back, <strong>{myStartup.name}</strong> Â· {myStartup.dpiitNumber}
          </p>
        </div>
        <Badge variant={myStartup.eligibilityStatus === "verified" ? "success" : "warning"}>
          <Shield size={12} className="mr-1" />
          DPIIT {myStartup.eligibilityStatus}
        </Badge>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-8 w-fit overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id as Tab)}
            id={`startup-tab-${t.id}`}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-150 whitespace-nowrap ${
              tab === t.id ? "bg-white shadow text-gov-navy" : "text-gov-muted hover:text-gov-text"
            }`}
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
            <StatCard label="Active Challenges" value={openChallenges.length} icon={<Sparkles size={20} />} color="blue" />
            <StatCard label="My Proposals" value={myProposals.length} icon={<ListChecks size={20} />} color="purple" />
            <StatCard label="TRL Level" value={`TRL ${myStartup.trlLevel}`} icon={<BarChart3 size={20} />} color="amber" />
            <StatCard label="DPIIT Status" value="Verified" icon={<Shield size={20} />} color="green" />
          </div>

          {/* Startup Profile Card */}
          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-xl gov-gradient flex items-center justify-center text-white font-heading font-bold text-xl flex-shrink-0">
                {myStartup.name.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h3 className="font-heading font-bold text-gov-navy">{myStartup.name}</h3>
                  <Badge variant="success" size="sm">DPIIT Verified</Badge>
                  {myStartup.waivers.filter((w) => w !== "none").map((w) => (
                    <Badge key={w} variant="warning" size="sm">
                      {w === "prior_experience" ? "Exp. Waiver" : "Turnover Waiver"}
                    </Badge>
                  ))}
                </div>
                <p className="text-xs text-gov-muted mb-3">{myStartup.description}</p>
                <div className="flex flex-wrap gap-1.5">
                  {myStartup.domains.map((d) => (
                    <span key={d} className="text-xs bg-blue-50 text-gov-blue px-2.5 py-0.5 rounded-full font-medium">{d}</span>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Best Matching Challenges */}
          <div>
            <SectionTitle
              title="Top AI-Matched Challenges"
              subtitle="Based on your domain expertise and TRL level"
              action={
                <Button variant="ghost" size="sm" onClick={() => setTab("challenges")}>
                  View All
                </Button>
              }
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {openChallenges.slice(0, 2).map((challenge) => (
                <ChallengeCard
                  key={challenge.id}
                  challenge={challenge}
                  showMatchScore
                  matchScore={getMatchScore(challenge.id)}
                  matchFactors={getMatchFactors(challenge)}
                  onApply={(c) => {
                    setSelectedChallenge(c);
                    setProposalModalOpen(true);
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Challenges Discovery Tab */}
      {tab === "challenges" && (
        <div className="space-y-5 animate-fade-in">
          <SectionTitle
            title="Discover Matching Challenges"
            subtitle={`${filteredChallenges.length} open challenges matching your profile`}
          />

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 bg-white border border-gov-border rounded-lg px-3 py-2 flex-1 min-w-48">
              <Search size={15} className="text-gov-muted flex-shrink-0" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search challenges..."
                className="outline-none text-sm w-full"
              />
            </div>
            <div className="flex items-center gap-2 bg-white border border-gov-border rounded-lg px-3 py-2">
              <Filter size={14} className="text-gov-muted" />
              <select
                value={domainFilter}
                onChange={(e) => setDomainFilter(e.target.value)}
                className="outline-none text-sm bg-transparent"
              >
                <option value="all">All Domains</option>
                {allDomains.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {filteredChallenges.map((challenge) => (
              <ChallengeCard
                key={challenge.id}
                challenge={challenge}
                showMatchScore
                matchScore={getMatchScore(challenge.id)}
                matchFactors={getMatchFactors(challenge)}
                onApply={(c) => {
                  setSelectedChallenge(c);
                  setProposalModalOpen(true);
                }}
              />
            ))}
            {filteredChallenges.length === 0 && (
              <div className="col-span-2 text-center py-12 text-gov-muted">
                <Sparkles size={40} className="mx-auto mb-3 opacity-30" />
                <p>No challenges match your current filters.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* DPIIT Eligibility Tab */}
      {tab === "eligibility" && (
        <div className="space-y-5 animate-fade-in max-w-lg">
          <SectionTitle
            title="DPIIT Eligibility Verification"
            subtitle="Automated check for GFR Rule 161 waivers"
          />
          <Alert variant="info" icon={<Info size={14} />}>
            As a DPIIT-recognized startup, you may qualify for prior-experience and turnover waivers
            under GFR Rule 161, making you eligible to participate in government procurement challenges.
          </Alert>
          <DPIITChecker startup={myStartup} />
        </div>
      )}

      {/* Proposals Tab */}
      {tab === "proposals" && (
        <div className="space-y-5 animate-fade-in">
          <SectionTitle
            title={`My Proposals (${myProposals.length})`}
            subtitle="Track status of your submitted proposals"
          />
          {myProposals.length === 0 ? (
            <Card className="p-12 text-center">
              <Rocket size={40} className="mx-auto mb-3 text-gov-muted opacity-40" />
              <p className="text-gov-muted">No proposals submitted yet.</p>
              <Button variant="primary" className="mt-4" onClick={() => setTab("challenges")}>
                Discover Challenges
              </Button>
            </Card>
          ) : (
            <div className="space-y-4">
              {myProposals.map((proposal) => {
                const challenge = state.challenges.find((c) => c.id === proposal.challengeId);
                return (
                  <Card key={proposal.id} className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant={
                            proposal.status === "approved" ? "success" :
                            proposal.status === "rejected" ? "danger" :
                            proposal.status === "evaluated" ? "blue" : "warning"
                          }>
                            {proposal.status.replace(/_/g, " ")}
                          </Badge>
                          {proposal.matchScore && (
                            <span className="text-xs text-gov-success font-semibold flex items-center gap-1">
                              <Sparkles size={11} />
                              {proposal.matchScore}% Match
                            </span>
                          )}
                        </div>
                        <h3 className="font-heading font-semibold text-gov-navy text-sm">
                          {challenge?.title ?? proposal.challengeId}
                        </h3>
                        <p className="text-xs text-gov-muted mt-0.5">
                          Submitted: {new Date(proposal.submittedAt).toLocaleDateString("en-IN")} Â·
                          TRL {proposal.trlLevel} Â· â‚¹{(proposal.estimatedCost / 100000).toFixed(0)}L
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-gov-muted mt-3 line-clamp-2">{proposal.methodology}</p>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Proposal Modal */}
      <ProposalModal
        open={proposalModalOpen}
        onClose={() => { setProposalModalOpen(false); setSelectedChallenge(null); }}
        challenge={selectedChallenge}
        startup={myStartup}
      />
    </div>
  );
}
