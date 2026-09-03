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

export type EvaluationType = "high-tech" | "medium-tech" | "low-tech" | "tech";

// Auth
export interface AuthUser {
  id: string;
  name: string;
  role: UserRole;
  orgId: string;
  loginTime: string;
}

// Challenge
export interface Challenge {
  id: string;
  title: string;
  department: string;
  description: string;
  problemStatement: string;
  budget: number;
  timeline: string;
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
  // Extended fields
  govSector?: "central" | "state" | "local" | "psu";
  state?: string;
  problemBackground?: string;
  desiredOutcome?: string;
  existingApproach?: string;
  technicalRequirements?: string;
  functionalRequirements?: string;
  constraints?: string;
  targetBeneficiaries?: string;
  minPilotDuration?: number;
  maxPilotDuration?: number;
}

// Startup
export interface Startup {
  id: string;
  name: string;
  displayName?: string;
  dpiitNumber: string;
  foundedYear: number;
  domains: string[];
  trlLevel: number;
  teamSize: number;
  annualTurnover: number;
  hasGovernmentExperience: boolean;
  description: string;
  contactEmail: string;
  website?: string;
  eligibilityStatus: "verified" | "pending" | "rejected";
  waivers: WaiverType[];
  createdAt: string;
}

// Proposal
export interface Proposal {
  id: string;
  challengeId: string;
  startupId: string;
  startupName: string;
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

// Evaluation — 7-parameter dual-track
export interface Evaluation {
  id: string;
  proposalId: string;
  evaluatorId: string;
  challengeId: string;
  evaluationType: EvaluationType;
  // 7 parameters (raw 0–10 score each, weighted to 100 total)
  kpiAchievement: number;
  operationalEfficiency: number;
  scalabilityReplicability: number;
  costRealismROI: number;
  innovationNovelty: number;
  technologyReliability: number;
  sustainabilityGovernance: number;
  totalScore: number;
  comments: string;
  status: EvaluationStatus;
  qualifiedForSandbox: boolean;
  evaluatedAt: string;
  createdAt: string;
  // Legacy fields for backward compat display
  technicalFeasibility?: number;
  cybersecurityDataIsolation?: number;
  costRealism?: number;
}

// Pilot
export interface PilotMilestone {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  completedDate: string | null;
  trancheAmount: number;
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
  overallProgress: number;
  status: "active" | "completed" | "paused";
  sandboxEnvironment: string;
  createdAt: string;
}

// Procurement
export interface ProcurementItem {
  id: string;
  pilotId: string;
  challengeId: string;
  startupId: string;
  startupName: string;
  solutionTitle: string;
  department: string;
  domains: string[];
  pilotSuccessScore: number;
  kpiAchievement: number;
  procurementValue: number;
  replicableFor: string[];
  description: string;
  certifiedAt: string;
  tags: string[];
}

// Changelog
export interface ChangelogEntry {
  id: string;
  timestamp: string;
  actor: string;
  role: UserRole;
  action: string;
  entityType: "challenge" | "proposal" | "evaluation" | "pilot" | "procurement" | "system" | "user";
  entityId: string;
  details: string;
  metadata?: Record<string, unknown>;
}

// Store State
export interface AppState {
  currentRole: UserRole;
  authUser: AuthUser | null;
  challenges: Challenge[];
  startups: Startup[];
  proposals: Proposal[];
  evaluations: Evaluation[];
  pilots: Pilot[];
  procurements: ProcurementItem[];
  changelog: ChangelogEntry[];
}

// Form Types
export interface ChallengeFormData {
  title: string;
  department: string;
  govSector: string;
  state: string;
  description: string;
  problemStatement: string;
  problemBackground: string;
  desiredOutcome: string;
  existingApproach: string;
  technicalRequirements: string;
  functionalRequirements: string;
  constraints: string;
  targetBeneficiaries: string;
  budget: number;
  minPilotDuration: number;
  maxPilotDuration: number;
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
  evaluationType: EvaluationType;
  kpiAchievement: number;
  operationalEfficiency: number;
  scalabilityReplicability: number;
  costRealismROI: number;
  innovationNovelty: number;
  technologyReliability: number;
  sustainabilityGovernance: number;
  comments: string;
}
