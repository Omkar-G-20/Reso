"use client";

import React, { createContext, useContext, useEffect, useReducer, useCallback, useRef, useState } from "react";
import type {
  AppState,
  UserRole,
  AuthUser,
  Challenge,
  Startup,
  Proposal,
  Evaluation,
  EvaluationType,
  Pilot,
  ProcurementItem,
  ChangelogEntry,
  PilotMilestoneStatus,
} from "@/types";
import {
  seedChallenges,
  seedStartups,
  seedProposals,
  seedEvaluations,
  seedPilots,
  seedProcurements,
  seedChangelog,
} from "@/lib/mock-data";
import { generateId } from "@/lib/utils";

// ── Storage & Channel Keys ──────────────────────────────────────────────────
const STORAGE_KEY = "govsetu_state_v4";
const BROADCAST_CHANNEL = "govsetu_sync_v4";

// ── Initial State ───────────────────────────────────────────────────────────
const initialState: AppState = {
  currentRole: "government",
  authUser: null,
  challenges: seedChallenges,
  startups: seedStartups,
  proposals: seedProposals,
  evaluations: seedEvaluations,
  pilots: seedPilots,
  procurements: seedProcurements,
  changelog: seedChangelog,
};

// ── Actions ─────────────────────────────────────────────────────────────────
type Action =
  | { type: "SET_ROLE"; role: UserRole }
  | { type: "LOGIN"; user: AuthUser }
  | { type: "LOGOUT" }
  | { type: "ADD_CHALLENGE"; challenge: Challenge }
  | { type: "UPDATE_CHALLENGE"; id: string; updates: Partial<Challenge> }
  | { type: "PUBLISH_CHALLENGE"; id: string }
  | { type: "ADD_PROPOSAL"; proposal: Proposal }
  | { type: "ADD_EVALUATION"; evaluation: Evaluation }
  | { type: "UPDATE_MILESTONE_STATUS"; pilotId: string; milestoneId: string; status: PilotMilestoneStatus }
  | { type: "RELEASE_PAYMENT"; pilotId: string; milestoneId: string }
  | { type: "ADD_PILOT"; pilot: Pilot }
  | { type: "UPDATE_STARTUP"; id: string; updates: Partial<Startup> }
  | { type: "ADD_CHANGELOG"; entry: ChangelogEntry }
  | { type: "HYDRATE"; state: AppState };

// ── Reducer ──────────────────────────────────────────────────────────────────
function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "HYDRATE":
      return {
        ...initialState,
        ...action.state,
        challenges: action.state.challenges?.length ? action.state.challenges : initialState.challenges,
        startups: action.state.startups?.length ? action.state.startups : initialState.startups,
        proposals: action.state.proposals?.length ? action.state.proposals : initialState.proposals,
        evaluations: action.state.evaluations?.length ? action.state.evaluations : initialState.evaluations,
        pilots: action.state.pilots?.length ? action.state.pilots : initialState.pilots,
        procurements: action.state.procurements?.length ? action.state.procurements : initialState.procurements,
        changelog: action.state.changelog?.length ? action.state.changelog : initialState.changelog,
      };

    case "SET_ROLE":
      return { ...state, currentRole: action.role };

    case "LOGIN":
      return { ...state, authUser: action.user, currentRole: action.user.role };

    case "LOGOUT":
      return { ...state, authUser: null };

    case "ADD_CHALLENGE":
      return { ...state, challenges: [action.challenge, ...state.challenges] };

    case "UPDATE_CHALLENGE":
      return {
        ...state,
        challenges: state.challenges.map((c) =>
          c.id === action.id ? { ...c, ...action.updates, updatedAt: new Date().toISOString() } : c
        ),
      };

    case "PUBLISH_CHALLENGE":
      return {
        ...state,
        challenges: state.challenges.map((c) =>
          c.id === action.id
            ? { ...c, status: "applications_open", publishedAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
            : c
        ),
      };

    case "ADD_PROPOSAL":
      return { ...state, proposals: [action.proposal, ...state.proposals] };

    case "ADD_PILOT":
      return {
        ...state,
        pilots: [action.pilot, ...state.pilots.filter((p) => p.proposalId !== action.pilot.proposalId)],
      };

    case "ADD_EVALUATION": {
      const exists = state.evaluations.some((e) => e.proposalId === action.evaluation.proposalId);
      const evaluations = exists
        ? state.evaluations.map((e) => (e.proposalId === action.evaluation.proposalId ? action.evaluation : e))
        : [action.evaluation, ...state.evaluations];
      
      const proposals = state.proposals.map((p) =>
        p.id === action.evaluation.proposalId
          ? { ...p, status: (action.evaluation.qualifiedForSandbox ? "approved" : "rejected") as Proposal["status"] }
          : p
      );
      return { ...state, evaluations, proposals };
    }

    case "UPDATE_STARTUP":
      return {
        ...state,
        startups: state.startups.map((s) =>
          s.id === action.id ? { ...s, ...action.updates } : s
        ),
      };

    case "UPDATE_MILESTONE_STATUS": {
      const pilots = state.pilots.map((p) => {
        if (p.id !== action.pilotId) return p;
        const milestones = p.milestones.map((m) =>
          m.id === action.milestoneId ? { ...m, status: action.status } : m
        );
        const disbursed = milestones.filter((m) => m.status === "payment_released").reduce((sum, m) => sum + m.trancheAmount, 0);
        const completed = milestones.filter((m) => m.status === "completed" || m.status === "payment_released").length;
        return { ...p, milestones, disbursedAmount: disbursed, overallProgress: Math.round((completed / milestones.length) * 100) };
      });
      return { ...state, pilots };
    }

    case "RELEASE_PAYMENT": {
      const now = new Date().toISOString();
      const pilots = state.pilots.map((p) => {
        if (p.id !== action.pilotId) return p;
        const milestones = p.milestones.map((m) =>
          m.id === action.milestoneId
            ? { ...m, status: "payment_released" as PilotMilestoneStatus, completedDate: now }
            : m
        );
        const disbursed = milestones.filter((m) => m.status === "payment_released").reduce((sum, m) => sum + m.trancheAmount, 0);
        const completedCount = milestones.filter((m) => m.status === "completed" || m.status === "payment_released").length;
        return { ...p, milestones, disbursedAmount: disbursed, overallProgress: Math.round((completedCount / milestones.length) * 100) };
      });
      return { ...state, pilots };
    }

    case "ADD_CHANGELOG":
      return { ...state, changelog: [action.entry, ...state.changelog] };

    default:
      return state;
  }
}

// ── Evaluation Weights (3 Tracks: High-Tech, Medium-Tech, Low-Tech) ─────────
export const EVAL_WEIGHTS = {
  "high-tech": {
    kpiAchievement: 0.25,
    technologyReliability: 0.20,
    operationalEfficiency: 0.10,
    costRealismROI: 0.10,
    scalabilityReplicability: 0.15,
    innovationNovelty: 0.15,
    sustainabilityGovernance: 0.05,
  },
  "medium-tech": {
    kpiAchievement: 0.25,
    technologyReliability: 0.10,
    operationalEfficiency: 0.20,
    costRealismROI: 0.15,
    scalabilityReplicability: 0.15,
    innovationNovelty: 0.10,
    sustainabilityGovernance: 0.05,
  },
  "low-tech": {
    kpiAchievement: 0.25,
    technologyReliability: 0.05,
    operationalEfficiency: 0.25,
    costRealismROI: 0.20,
    scalabilityReplicability: 0.15,
    innovationNovelty: 0.05,
    sustainabilityGovernance: 0.05,
  },
  // Legacy compat alias
  tech: {
    kpiAchievement: 0.25,
    technologyReliability: 0.20,
    operationalEfficiency: 0.10,
    costRealismROI: 0.10,
    scalabilityReplicability: 0.15,
    innovationNovelty: 0.15,
    sustainabilityGovernance: 0.05,
  },
} as const;

export function computeEvalScore(type: EvaluationType, scores: Record<string, number>): number {
  const w = EVAL_WEIGHTS[type];
  return Math.round(
    (scores.kpiAchievement ?? 0) * w.kpiAchievement * 10 +
    (scores.operationalEfficiency ?? 0) * w.operationalEfficiency * 10 +
    (scores.scalabilityReplicability ?? 0) * w.scalabilityReplicability * 10 +
    (scores.costRealismROI ?? 0) * w.costRealismROI * 10 +
    (scores.innovationNovelty ?? 0) * w.innovationNovelty * 10 +
    (scores.technologyReliability ?? 0) * w.technologyReliability * 10 +
    (scores.sustainabilityGovernance ?? 0) * w.sustainabilityGovernance * 10
  );
}

// ── Context Value ────────────────────────────────────────────────────────────
interface StoreContextValue {
  state: AppState;
  setRole: (role: UserRole) => void;
  login: (user: AuthUser) => void;
  logout: () => void;
  addChallenge: (data: Omit<Challenge, "id" | "createdAt" | "updatedAt" | "applicationsCount" | "publishedAt">) => Challenge;
  publishChallenge: (id: string) => void;
  submitProposal: (data: Omit<Proposal, "id" | "submittedAt" | "updatedAt">) => Proposal;
  submitEvaluation: (data: Omit<Evaluation, "id" | "createdAt" | "evaluatedAt" | "qualifiedForSandbox" | "totalScore">) => Evaluation;
  releaseMilestonePayment: (pilotId: string, milestoneId: string, milestoneTitle: string, amount: number) => void;
  updateStartupProfile: (id: string, updates: Partial<Startup>) => void;
  log: (entry: Omit<ChangelogEntry, "id" | "timestamp">) => void;
}

const StoreContext = createContext<StoreContextValue | null>(null);

// ── Provider ─────────────────────────────────────────────────────────────────
export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [hasHydrated, setHasHydrated] = useState(false);
  const isRemoteUpdate = useRef(false);
  const channelRef = useRef<BroadcastChannel | null>(null);

  // Initialize BroadcastChannel & hydrate from localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as AppState;
        dispatch({ type: "HYDRATE", state: parsed });
      }
    } catch { /* ignore */ }

    setHasHydrated(true);

    try {
      const channel = new BroadcastChannel(BROADCAST_CHANNEL);
      channelRef.current = channel;

      channel.onmessage = (event: MessageEvent<AppState>) => {
        if (event.data && typeof event.data === "object") {
          isRemoteUpdate.current = true;
          dispatch({ type: "HYDRATE", state: event.data });
        }
      };
    } catch {
      // Fallback
    }

    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          isRemoteUpdate.current = true;
          dispatch({ type: "HYDRATE", state: JSON.parse(e.newValue) as AppState });
        } catch { /* ignore */ }
      }
    };
    window.addEventListener("storage", handleStorage);

    return () => {
      channelRef.current?.close();
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  // Persist to localStorage and broadcast whenever state changes (after initial mount)
  useEffect(() => {
    if (!hasHydrated) return;

    if (isRemoteUpdate.current) {
      isRemoteUpdate.current = false;
      return; // Do not re-broadcast an update that came from another tab!
    }

    try {
      const serialized = JSON.stringify(state);
      localStorage.setItem(STORAGE_KEY, serialized);
      channelRef.current?.postMessage(state);
    } catch { /* ignore */ }
  }, [state, hasHydrated]);

  // ── Actions ────────────────────────────────────────────────────────────────
  const setRole = useCallback((role: UserRole) => {
    dispatch({ type: "SET_ROLE", role });
  }, []);

  const login = useCallback((user: AuthUser) => {
    dispatch({ type: "LOGIN", user });
    // Synchronously ensure localStorage has the user immediately
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const base = stored ? JSON.parse(stored) : initialState;
      const updated = { ...base, authUser: user, currentRole: user.role };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      channelRef.current?.postMessage(updated);
    } catch { /* ignore */ }
  }, []);

  const logout = useCallback(() => {
    dispatch({ type: "LOGOUT" });
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const base = stored ? JSON.parse(stored) : initialState;
      const updated = { ...base, authUser: null };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      channelRef.current?.postMessage(updated);
    } catch { /* ignore */ }
  }, []);

  const log = useCallback((entry: Omit<ChangelogEntry, "id" | "timestamp">) => {
    dispatch({
      type: "ADD_CHANGELOG",
      entry: { ...entry, id: generateId("log"), timestamp: new Date().toISOString() },
    });
  }, []);

  const addChallenge = useCallback(
    (data: Omit<Challenge, "id" | "createdAt" | "updatedAt" | "applicationsCount" | "publishedAt">): Challenge => {
      const challenge: Challenge = {
        ...data,
        id: generateId("ch"),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        applicationsCount: 0,
        publishedAt: null,
      };
      dispatch({ type: "ADD_CHALLENGE", challenge });
      return challenge;
    },
    []
  );

  const publishChallenge = useCallback(
    (id: string) => {
      dispatch({ type: "PUBLISH_CHALLENGE", id });
      const challenge = state.challenges.find((c) => c.id === id);
      if (challenge) {
        log({
          actor: state.authUser?.name ?? "Government Officer",
          role: "government",
          action: "CHALLENGE_PUBLISHED",
          entityType: "challenge",
          entityId: id,
          details: `Challenge "${challenge.title}" published by ${challenge.department}. Budget: ₹${(challenge.budget / 100000).toFixed(0)}L.`,
        });
      }
    },
    [state.challenges, state.authUser, log]
  );

  const submitProposal = useCallback(
    (data: Omit<Proposal, "id" | "submittedAt" | "updatedAt">): Proposal => {
      const proposal: Proposal = {
        ...data,
        id: generateId("pr"),
        submittedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      dispatch({ type: "ADD_PROPOSAL", proposal });
      log({
        actor: data.startupName,
        role: "startup",
        action: "PROPOSAL_SUBMITTED",
        entityType: "proposal",
        entityId: proposal.id,
        details: `Proposal by ${data.startupName} for challenge ${data.challengeId}. TRL: ${data.trlLevel}. Cost: ₹${(data.estimatedCost / 100000).toFixed(0)}L.`,
      });
      return proposal;
    },
    [log]
  );

  const submitEvaluation = useCallback(
    (data: Omit<Evaluation, "id" | "createdAt" | "evaluatedAt" | "qualifiedForSandbox" | "totalScore">): Evaluation => {
      const total = computeEvalScore(data.evaluationType, {
        kpiAchievement: data.kpiAchievement,
        operationalEfficiency: data.operationalEfficiency,
        scalabilityReplicability: data.scalabilityReplicability,
        costRealismROI: data.costRealismROI,
        innovationNovelty: data.innovationNovelty,
        technologyReliability: data.technologyReliability,
        sustainabilityGovernance: data.sustainabilityGovernance,
      });
      const evaluation: Evaluation = {
        ...data,
        id: generateId("ev"),
        totalScore: total,
        qualifiedForSandbox: total >= 80,
        evaluatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        status: "completed",
      };
      dispatch({ type: "ADD_EVALUATION", evaluation });

      // Automatically queue startup into Sandbox Pilot for Government payment approval
      if (evaluation.qualifiedForSandbox) {
        const proposal = state.proposals.find((p) => p.id === data.proposalId);
        const challenge = proposal ? state.challenges.find((c) => c.id === proposal.challengeId) : null;
        if (proposal && challenge) {
          const estCost = proposal.estimatedCost || 15000000;
          const newPilot: Pilot = {
            id: generateId("pilot"),
            challengeId: challenge.id,
            proposalId: proposal.id,
            startupId: proposal.startupId,
            startupName: proposal.startupName,
            challengeTitle: challenge.title,
            department: challenge.department,
            startDate: new Date().toISOString(),
            endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
            totalBudget: estCost,
            disbursedAmount: 0,
            overallProgress: 0,
            status: "active",
            sandboxEnvironment: "CERT-In Approved National Sandbox VPC",
            createdAt: new Date().toISOString(),
            milestones: [
              {
                id: generateId("ms"),
                title: "Phase 1: Architecture Validation & CERT-In Isolation Setup",
                description: "Initial sandbox setup and security clearance. Ready for government official tranche approval.",
                dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                completedDate: null,
                trancheAmount: Math.round(estCost * 0.3),
                status: "in_progress",
                kpiMetrics: [
                  { name: "Sandbox VPC Deployed & Tested", target: 1, achieved: 1, unit: "env" },
                  { name: "Initial Benchmark Accuracy", target: 85, achieved: 88, unit: "%" },
                ],
              },
              {
                id: generateId("ms"),
                title: "Phase 2: Field Trial & User Acceptance (UAT)",
                description: "Live deployment on test corridor/departmental sample data.",
                dueDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
                completedDate: null,
                trancheAmount: Math.round(estCost * 0.4),
                status: "pending",
                kpiMetrics: [
                  { name: "Trial Data Points Processed", target: 10000, achieved: 0, unit: "records" },
                  { name: "Operational Efficiency Gain", target: 20, achieved: 0, unit: "%" },
                ],
              },
              {
                id: generateId("ms"),
                title: "Phase 3: Final Security Audit & GeM Catalog Readiness",
                description: "Final certification and procurement dossier compilation.",
                dueDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
                completedDate: null,
                trancheAmount: Math.round(estCost * 0.3),
                status: "pending",
                kpiMetrics: [
                  { name: "Final SLA Compliance", target: 99.5, achieved: 0, unit: "%" },
                ],
              },
            ],
          };
          dispatch({ type: "ADD_PILOT", pilot: newPilot });
          log({
            actor: "GovSetu Auto-Procurement Engine",
            role: "admin",
            action: "PILOT_INITIATED",
            entityType: "pilot",
            entityId: newPilot.id,
            details: `Startup ${proposal.startupName} qualified with ${total}/100 and automatically sent to Sandbox Pilot Tracking for Government payment approval.`,
          });
        }
      }

      log({
        actor: state.authUser?.name ?? "Evaluator Portal",
        role: "evaluator",
        action: "EVALUATION_COMPLETED",
        entityType: "evaluation",
        entityId: evaluation.id,
        details: `Blind evaluation (${data.evaluationType}) completed. Score: ${total}/100. Qualified: ${evaluation.qualifiedForSandbox ? "YES" : "NO"}.`,
      });
      return evaluation;
    },
    [state.authUser, state.proposals, state.challenges, log]
  );

  const releaseMilestonePayment = useCallback(
    (pilotId: string, milestoneId: string, milestoneTitle: string, amount: number) => {
      dispatch({ type: "RELEASE_PAYMENT", pilotId, milestoneId });
      log({
        actor: state.authUser?.name ?? "Government Officer",
        role: "government",
        action: "MILESTONE_PAYMENT_RELEASED",
        entityType: "pilot",
        entityId: pilotId,
        details: `Payment of ₹${(amount / 100000).toFixed(0)}L released for milestone "${milestoneTitle}" in pilot ${pilotId}.`,
      });
    },
    [state.authUser, log]
  );

  const updateStartupProfile = useCallback(
    (id: string, updates: Partial<Startup>) => {
      dispatch({ type: "UPDATE_STARTUP", id, updates });
      log({
        actor: state.authUser?.name ?? "Startup Portal",
        role: "startup",
        action: "PROFILE_UPDATED",
        entityType: "system",
        entityId: id,
        details: `Startup profile updated for ID ${id}.`,
      });
    },
    [state.authUser, log]
  );

  return (
    <StoreContext.Provider
      value={{
        state,
        setRole,
        login,
        logout,
        addChallenge,
        publishChallenge,
        submitProposal,
        submitEvaluation,
        releaseMilestonePayment,
        updateStartupProfile,
        log,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
