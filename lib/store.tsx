"use client";

import React, { createContext, useContext, useEffect, useReducer, useCallback } from "react";
import type {
  AppState,
  UserRole,
  Challenge,
  Startup,
  Proposal,
  Evaluation,
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

// â”€â”€ Storage Key â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const STORAGE_KEY = "govsetu_state_v1";

// â”€â”€ Initial State â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const initialState: AppState = {
  currentRole: "government",
  challenges: seedChallenges,
  startups: seedStartups,
  proposals: seedProposals,
  evaluations: seedEvaluations,
  pilots: seedPilots,
  procurements: seedProcurements,
  changelog: seedChangelog,
};

// â”€â”€ Actions â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
type Action =
  | { type: "SET_ROLE"; role: UserRole }
  | { type: "ADD_CHALLENGE"; challenge: Challenge }
  | { type: "UPDATE_CHALLENGE"; id: string; updates: Partial<Challenge> }
  | { type: "PUBLISH_CHALLENGE"; id: string }
  | { type: "ADD_PROPOSAL"; proposal: Proposal }
  | { type: "ADD_EVALUATION"; evaluation: Evaluation }
  | { type: "UPDATE_MILESTONE_STATUS"; pilotId: string; milestoneId: string; status: PilotMilestoneStatus }
  | { type: "RELEASE_PAYMENT"; pilotId: string; milestoneId: string }
  | { type: "ADD_CHANGELOG"; entry: ChangelogEntry }
  | { type: "HYDRATE"; state: AppState };

// â”€â”€ Reducer â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "HYDRATE":
      return action.state;

    case "SET_ROLE":
      return { ...state, currentRole: action.role };

    case "ADD_CHALLENGE":
      return { ...state, challenges: [...state.challenges, action.challenge] };

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
      return { ...state, proposals: [...state.proposals, action.proposal] };

    case "ADD_EVALUATION":
      return { ...state, evaluations: [...state.evaluations, action.evaluation] };

    case "UPDATE_MILESTONE_STATUS": {
      const pilots = state.pilots.map((p) => {
        if (p.id !== action.pilotId) return p;
        const milestones = p.milestones.map((m) =>
          m.id === action.milestoneId ? { ...m, status: action.status } : m
        );
        const disbursed = milestones
          .filter((m) => m.status === "payment_released")
          .reduce((sum, m) => sum + m.trancheAmount, 0);
        const completed = milestones.filter(
          (m) => m.status === "completed" || m.status === "payment_released"
        ).length;
        const progress = Math.round((completed / milestones.length) * 100);
        return { ...p, milestones, disbursedAmount: disbursed, overallProgress: progress };
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
        const disbursed = milestones
          .filter((m) => m.status === "payment_released")
          .reduce((sum, m) => sum + m.trancheAmount, 0);
        const completedCount = milestones.filter(
          (m) => m.status === "completed" || m.status === "payment_released"
        ).length;
        const progress = Math.round((completedCount / milestones.length) * 100);
        return { ...p, milestones, disbursedAmount: disbursed, overallProgress: progress };
      });
      return { ...state, pilots };
    }

    case "ADD_CHANGELOG":
      return {
        ...state,
        changelog: [action.entry, ...state.changelog],
      };

    default:
      return state;
  }
}

// â”€â”€ Context â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
interface StoreContextValue {
  state: AppState;
  setRole: (role: UserRole) => void;
  addChallenge: (data: Omit<Challenge, "id" | "createdAt" | "updatedAt" | "applicationsCount" | "publishedAt">) => Challenge;
  publishChallenge: (id: string) => void;
  submitProposal: (data: Omit<Proposal, "id" | "submittedAt" | "updatedAt">) => Proposal;
  submitEvaluation: (data: Omit<Evaluation, "id" | "createdAt" | "evaluatedAt" | "qualifiedForSandbox" | "totalScore">) => Evaluation;
  releaseMilestonePayment: (pilotId: string, milestoneId: string, milestoneTitle: string, amount: number) => void;
  log: (entry: Omit<ChangelogEntry, "id" | "timestamp">) => void;
}

const StoreContext = createContext<StoreContextValue | null>(null);

// â”€â”€ Provider â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Hydrate from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as AppState;
        dispatch({ type: "HYDRATE", state: parsed });
      }
    } catch {
      // ignore â€“ use defaults
    }
  }, []);

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore quota errors
    }
  }, [state]);

  const setRole = useCallback((role: UserRole) => {
    dispatch({ type: "SET_ROLE", role });
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
          actor: "Government Portal User",
          role: "government",
          action: "CHALLENGE_PUBLISHED",
          entityType: "challenge",
          entityId: id,
          details: `Challenge "${challenge.title}" published by ${challenge.department}. Budget: ${challenge.budget}.`,
        });
      }
    },
    [state.challenges, log]
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
        details: `Proposal submitted by ${data.startupName} for challenge ${data.challengeId}. TRL: ${data.trlLevel}. Cost: â‚¹${(data.estimatedCost / 100000).toFixed(0)}L.`,
      });
      return proposal;
    },
    [log]
  );

  const submitEvaluation = useCallback(
    (data: Omit<Evaluation, "id" | "createdAt" | "evaluatedAt" | "qualifiedForSandbox" | "totalScore">): Evaluation => {
      const total = data.technicalFeasibility + data.cybersecurityDataIsolation + data.costRealism;
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
      log({
        actor: "Evaluator Portal",
        role: "evaluator",
        action: "EVALUATION_COMPLETED",
        entityType: "evaluation",
        entityId: evaluation.id,
        details: `Blind evaluation completed. Score: ${total}/100. Qualified for Sandbox: ${evaluation.qualifiedForSandbox ? "YES" : "NO"}.`,
      });
      return evaluation;
    },
    [log]
  );

  const releaseMilestonePayment = useCallback(
    (pilotId: string, milestoneId: string, milestoneTitle: string, amount: number) => {
      dispatch({ type: "RELEASE_PAYMENT", pilotId, milestoneId });
      log({
        actor: "Government Officer",
        role: "government",
        action: "MILESTONE_PAYMENT_RELEASED",
        entityType: "pilot",
        entityId: pilotId,
        details: `Payment of â‚¹${(amount / 100000).toFixed(0)}L released for milestone "${milestoneTitle}" in pilot ${pilotId}.`,
      });
    },
    [log]
  );

  return (
    <StoreContext.Provider
      value={{
        state,
        setRole,
        addChallenge,
        publishChallenge,
        submitProposal,
        submitEvaluation,
        releaseMilestonePayment,
        log,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

// â”€â”€ Hook â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
