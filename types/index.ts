// ============================================================
// GovSetu Platform — Core Type Definitions
// ============================================================

export type UserRole = "government" | "startup" | "evaluator" | "admin";

export type ChallengeStatus =
  | "draft"
  | "published"
  | "applications_open"
  | "evaluation"
  | "sandbox"
  | "procurement"
  | "closed";

export type PilotMilestoneStatus = "pending" | "in_progress" | "completed" | "payment_released";

export type EvaluationStatus = "pending" | "in_progress" | "completed" | "qualified" | "rejected";

export type ProposalStatus = "draft" | "submitted" | "under_review" | "evaluated" | "approved" | "rejected";

export type WaiverType = "prior_experience" | "turnover" | "none";

// ── Challenge ────────────────────────────────────────────────

export interface Challenge {
  id: string;
  title: string;
  department: string;
  description: string;
  problemStatement: string;
  budget: number;
  timeline: string; // e.g. "6 months"
  targetKPIs: string[];
  domains: string[];
  status: ChallengeStatus;
  publishedAt: string | null;
  deadline: string;
  applicationsCount: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  aiSuggestions?: string[];
}

// ── Startup ──────────────────────────────────────────────────

export interface Startup {
  id: string;
  name: string;
  dpiitNumber: string;
  foundedYear: number;
  domains: string[];
  trlLevel: number; // 1–9
  teamSize: number;
  annualTurnover: number; // INR Lakhs
  hasGovernmentExperience: boolean;
  description: string;
  contactEmail: string;
  website?: string;
  eligibilityStatus: "verified" | "pending" | "rejected";
  waivers: WaiverType[];
  createdAt: string;
}

// ── Proposal ─────────────────────────────────────────────────

export interface Proposal {
  id: string;
  challengeId: string;
  startupId: string;
  startupName: string; // anonymized in evaluation view
  trlLevel: number;
  methodology: string;
  sandboxTimeline: string;
  technicalApproach: string;
  estimatedCost: number;
  status: ProposalStatus;
  matchScore?: number;
  matchFactors?: MatchFactor[];
  submittedAt: string;
  updatedAt: string;
}

export interface MatchFactor {
  factor: string;
  score: number;
  maxScore: number;
  explanation: string;
}

// ── Evaluation ───────────────────────────────────────────────

export interface Evaluation {
  id: string;
  proposalId: string;
  evaluatorId: string;
  challengeId: string;
  technicalFeasibility: number; // 0–40
  cybersecurityDataIsolation: number; // 0–30
  costRealism: number; // 0–30
  totalScore: number; // 0–100
  comments: string;
  status: EvaluationStatus;
  qualifiedForSandbox: boolean;
  evaluatedAt: string;
  createdAt: string;
}

// ── Pilot ────────────────────────────────────────────────────

export interface PilotMilestone {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  completedDate: string | null;
  trancheAmount: number; // INR
  status: PilotMilestoneStatus;
  kpiMetrics: KPIMetric[];
}

export interface KPIMetric {
  name: string;
  target: number;
  achieved: number | null;
  unit: string;
}

export interface Pilot {
  id: string;
  challengeId: string;
  proposalId: string;
  startupId: string;
  startupName: string;
  challengeTitle: string;
  department: string;
  startDate: string;
  endDate: string;
  totalBudget: number;
  disbursedAmount: number;
  milestones: PilotMilestone[];
  overallProgress: number; // 0–100
  status: "active" | "completed" | "paused";
  sandboxEnvironment: string;
  createdAt: string;
}

// ── Procurement ──────────────────────────────────────────────

export interface ProcurementItem {
  id: string;
  pilotId: string;
  challengeId: string;
  startupId: string;
  startupName: string;
  solutionTitle: string;
  department: string;
  domains: string[];
  pilotSuccessScore: number; // 0–100
  kpiAchievement: number; // percentage
  procurementValue: number; // INR
  replicableFor: string[]; // list of departments
  description: string;
  certifiedAt: string;
  tags: string[];
}

// ── Changelog ────────────────────────────────────────────────

export interface ChangelogEntry {
  id: string;
  timestamp: string;
  actor: string;
  role: UserRole;
  action: string;
  entityType: "challenge" | "proposal" | "evaluation" | "pilot" | "procurement" | "system";
  entityId: string;
  details: string;
  metadata?: Record<string, unknown>;
}

// ── Store State ───────────────────────────────────────────────

export interface AppState {
  currentRole: UserRole;
  challenges: Challenge[];
  startups: Startup[];
  proposals: Proposal[];
  evaluations: Evaluation[];
  pilots: Pilot[];
  procurements: ProcurementItem[];
  changelog: ChangelogEntry[];
}

// ── Form Types ────────────────────────────────────────────────

export interface ChallengeFormData {
  title: string;
  department: string;
  description: string;
  problemStatement: string;
  budget: number;
  timeline: string;
  targetKPIs: string;
  domains: string;
  deadline: string;
}

export interface ProposalFormData {
  trlLevel: number;
  methodology: string;
  sandboxTimeline: string;
  technicalApproach: string;
  estimatedCost: number;
}

export interface EvaluationFormData {
  technicalFeasibility: number;
  cybersecurityDataIsolation: number;
  costRealism: number;
  comments: string;
}
