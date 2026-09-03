"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
  User,
  Edit3,
  Save,
  X,
  CheckCircle2,
  Plus,
} from "lucide-react";

import Link from "next/link";

type Tab = "overview" | "challenges" | "eligibility" | "proposals" | "profile";

export default function StartupPage() {
  const router = useRouter();
  const { state, updateStartupProfile } = useStore();
  const [tab, setTab] = useState<Tab>("overview");
  const [search, setSearch] = useState("");
  const [domainFilter, setDomainFilter] = useState("all");
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [proposalModalOpen, setProposalModalOpen] = useState(false);

  // Strict RBAC Auto-Redirect: If logged in as government or evaluator, immediately send to their portal
  useEffect(() => {
    if (state.authUser && state.authUser.role !== "startup") {
      const target = state.authUser.role === "government" ? "/government" : "/evaluator";
      router.replace(target);
    }
  }, [state.authUser, router]);

  // RBAC Guard: Non-startups cannot access Startup Hub
  if (state.authUser && state.authUser.role !== "startup") {
    return (
      <div className="max-w-xl mx-auto py-16 px-4 text-center">
        <div className="p-8 bg-white rounded-2xl border border-slate-200 shadow-xl space-y-4">
          <div className="w-16 h-16 rounded-full bg-purple-50 border-4 border-purple-200 flex items-center justify-center mx-auto text-purple-600">
            <Shield size={32} />
          </div>
          <h2 className="font-heading font-bold text-xl text-gov-navy">Redirecting to Your Workspace...</h2>
          <p className="text-sm text-gov-muted leading-relaxed">
            Startup Hub is restricted to registered Startup Founders. Redirecting you to your workspace.
          </p>
        </div>
      </div>
    );
  }

  // Profile editing state
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileDraft, setProfileDraft] = useState<{description: string; website: string; contactEmail: string; teamSize: number}>({
    description: "",
    website: "",
    contactEmail: "",
    teamSize: 0,
  });
  const [domainInput, setDomainInput] = useState("");
  const [profileSaved, setProfileSaved] = useState(false);

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
    // Deterministic score based on challenge.id to eliminate SSR hydration mismatch
    const hash = challenge.id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const semanticScore = 28 + (hash % 11);
    return [
      { factor: "Semantic AI Similarity", score: semanticScore, maxScore: 40, explanation: `NLP semantic keyword alignment with ${challenge.department} problem brief` },
      { factor: "Domain Competency", score: domainScore, maxScore: 30, explanation: `${domainOverlap} of ${challenge.domains.length} required technology domains verified` },
      { factor: "TRL Deployment Readiness", score: trlScore, maxScore: 30, explanation: `TRL ${myStartup.trlLevel} readiness meets sandbox threshold` },
    ];
  };

  const tabs = [
    { id: "overview", label: "My Dashboard", icon: <BarChart3 size={15} /> },
    { id: "challenges", label: "Discover Challenges", icon: <Sparkles size={15} /> },
    { id: "eligibility", label: "DPIIT Eligibility", icon: <Shield size={15} /> },
    { id: "proposals", label: "My Proposals", icon: <ListChecks size={15} /> },
    { id: "profile", label: "My Profile", icon: <User size={15} /> },
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
            Welcome back, <strong>{myStartup.name}</strong> &nbsp;&middot;&nbsp; {myStartup.dpiitNumber}
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
                          Submitted: {new Date(proposal.submittedAt).toLocaleDateString("en-IN")} {" · "}
                          TRL {proposal.trlLevel} {" · "} ₹{(proposal.estimatedCost / 100000).toFixed(0)}L
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

      {/* My Profile Tab */}
      {tab === "profile" && (
        <div className="space-y-5 animate-fade-in max-w-2xl">
          <SectionTitle
            title="My Company Profile"
            subtitle="Edit your company details — changes sync across all portals in real-time"
            action={
              !editingProfile ? (
                <Button variant="outline" size="sm" onClick={() => {
                  setProfileDraft({
                    description: myStartup.description,
                    website: myStartup.website ?? "",
                    contactEmail: myStartup.contactEmail,
                    teamSize: myStartup.teamSize,
                  });
                  setDomainInput(myStartup.domains.join(", "));
                  setEditingProfile(true);
                  setProfileSaved(false);
                }}>
                  <Edit3 size={13} /> Edit Profile
                </Button>
              ) : null
            }
          />

          {profileSaved && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-semibold">
              <CheckCircle2 size={16} /> Profile saved and synced across all portals!
            </div>
          )}

          <Card className="p-6">
            {!editingProfile ? (
              // Read-only view
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl gov-gradient flex items-center justify-center text-white font-heading font-bold text-2xl flex-shrink-0">
                    {myStartup.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-gov-navy text-lg">{myStartup.name}</h3>
                    <p className="text-xs text-gov-muted">{myStartup.dpiitNumber} · Founded {myStartup.foundedYear}</p>
                    <Badge variant="success" size="sm" className="mt-1">DPIIT Verified</Badge>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div><p className="text-xs text-gov-muted mb-1">Description</p><p className="text-gov-text">{myStartup.description}</p></div>
                  <div><p className="text-xs text-gov-muted mb-1">Team Size</p><p className="font-semibold text-gov-navy">{myStartup.teamSize} employees</p></div>
                  <div><p className="text-xs text-gov-muted mb-1">Contact Email</p><p className="text-gov-blue">{myStartup.contactEmail}</p></div>
                  <div><p className="text-xs text-gov-muted mb-1">Website</p><p className="text-gov-blue">{myStartup.website ?? "—"}</p></div>
                  <div className="col-span-2">
                    <p className="text-xs text-gov-muted mb-2">Technology Domains</p>
                    <div className="flex flex-wrap gap-1.5">
                      {myStartup.domains.map((d) => (
                        <span key={d} className="text-xs bg-blue-50 text-gov-blue px-2.5 py-0.5 rounded-full font-medium border border-blue-100">{d}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // Edit view
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-gov-text block mb-1.5">Company Description</label>
                  <textarea
                    rows={3}
                    value={profileDraft.description}
                    onChange={(e) => setProfileDraft((p) => ({ ...p, description: e.target.value }))}
                    className="gov-input resize-y"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-gov-text block mb-1.5">Contact Email</label>
                    <input type="email" value={profileDraft.contactEmail} onChange={(e) => setProfileDraft((p) => ({ ...p, contactEmail: e.target.value }))} className="gov-input" />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gov-text block mb-1.5">Website URL</label>
                    <input type="url" value={profileDraft.website} onChange={(e) => setProfileDraft((p) => ({ ...p, website: e.target.value }))} placeholder="https://yourstartup.in" className="gov-input" />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gov-text block mb-1.5">Team Size</label>
                    <input type="number" min={1} value={profileDraft.teamSize || ""} onChange={(e) => setProfileDraft((p) => ({ ...p, teamSize: Number(e.target.value) }))} className="gov-input" />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gov-text block mb-1.5">Technology Domains (comma-separated)</label>
                    <input value={domainInput} onChange={(e) => setDomainInput(e.target.value)} placeholder="AI/ML, IoT, Blockchain" className="gov-input" />
                  </div>
                </div>
                <div className="flex gap-3 pt-2 border-t border-gov-border">
                  <Button variant="outline" onClick={() => { setEditingProfile(false); setProfileSaved(false); }} className="flex-1">
                    <X size={14} /> Cancel
                  </Button>
                  <Button variant="success" onClick={() => {
                    const domains = domainInput.split(",").map((d) => d.trim()).filter(Boolean);
                    updateStartupProfile(myStartup.id, { ...profileDraft, domains });
                    setEditingProfile(false);
                    setProfileSaved(true);
                  }} className="flex-1">
                    <Save size={14} /> Save & Sync Changes
                  </Button>
                </div>
              </div>
            )}
          </Card>
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
