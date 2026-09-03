"use client";

import { useState } from "react";
import type { Challenge, Startup } from "@/types";
import { Modal, Button, Alert } from "@/components/ui";
import { useStore } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";
import {
  Rocket,
  CheckCircle2,
  Cpu,
  Clock,
  DollarSign,
  BookOpen,
  Eye,
  ArrowLeft,
  AlertTriangle,
} from "lucide-react";

const proposalFields = [
  { name: "methodology", label: "Proposed Methodology", desc: "Describe your approach, technology stack, and how you'll solve the problem (min 50 chars)", icon: BookOpen, rows: 4 },
  { name: "technicalApproach", label: "Technical Architecture & Approach", desc: "APIs, models, infrastructure, security measures (min 50 chars)", icon: Cpu, rows: 3 },
  { name: "sandboxTimeline", label: "Proposed Sandbox Timeline", desc: "e.g. 3-month pilot on NH-48 corridor covering 500 km segment (min 10 chars)", icon: Clock, rows: 2 },
];

interface ProposalModalProps {
  open: boolean;
  onClose: () => void;
  challenge: Challenge | null;
  startup: Startup;
}

export function ProposalModal({ open, onClose, challenge, startup }: ProposalModalProps) {
  const { submitProposal } = useStore();
  const [step, setStep] = useState<"form" | "review" | "submitted">("form");

  const [trlLevel, setTrlLevel] = useState(startup.trlLevel);
  const [methodology, setMethodology] = useState("");
  const [technicalApproach, setTechnicalApproach] = useState("");
  const [sandboxTimeline, setSandboxTimeline] = useState("");
  const [estimatedCost, setEstimatedCost] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (methodology.trim().length < 50) errs.methodology = "Please describe your methodology (min 50 chars)";
    if (technicalApproach.trim().length < 50) errs.technicalApproach = "Technical approach details required (min 50 chars)";
    if (sandboxTimeline.trim().length < 10) errs.sandboxTimeline = "Sandbox timeline details required (min 10 chars)";
    if (estimatedCost < 100000) errs.estimatedCost = "Minimum estimated cost ₹1L (1,00,000)";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleReview = () => {
    if (validate()) setStep("review");
  };

  const handleConfirmSubmit = () => {
    if (!challenge) return;
    submitProposal({
      challengeId: challenge.id,
      startupId: startup.id,
      startupName: startup.name,
      trlLevel,
      methodology,
      sandboxTimeline,
      technicalApproach,
      estimatedCost,
      status: "submitted",
      matchScore: startup.domains.some((d) => challenge.domains.includes(d))
        ? Math.round(70 + Math.random() * 25)
        : Math.round(50 + Math.random() * 20),
    });
    setStep("submitted");
  };

  const handleClose = () => {
    setStep("form");
    setMethodology("");
    setTechnicalApproach("");
    setSandboxTimeline("");
    setEstimatedCost(0);
    setErrors({});
    onClose();
  };

  if (!challenge) return null;

  return (
    <Modal open={open} onClose={handleClose} title="Submit Proposal" size="lg">

      {/* ── Form Step ── */}
      {step === "form" && (
        <div className="p-6 space-y-5">
          {/* Challenge context */}
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
            <p className="text-xs font-semibold text-gov-blue uppercase tracking-wide mb-1">Applying to Challenge</p>
            <p className="font-heading font-bold text-gov-navy text-sm">{challenge.title}</p>
            <p className="text-xs text-gov-muted mt-0.5">{challenge.department}</p>
            <div className="flex gap-4 mt-2 text-xs text-gov-muted">
              <span className="flex items-center gap-1"><DollarSign size={11} />Budget: {formatCurrency(challenge.budget)}</span>
              <span className="flex items-center gap-1"><Clock size={11} />Timeline: {challenge.timeline}</span>
            </div>
          </div>

          {/* TRL Level */}
          <div>
            <label className="text-sm font-semibold text-gov-text block mb-2 flex items-center gap-1">
              <Cpu size={13} className="text-gov-blue" />Technology Readiness Level (TRL) *
            </label>
            <div className="grid grid-cols-9 gap-1">
              {[1,2,3,4,5,6,7,8,9].map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setTrlLevel(level)}
                  className={`py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${trlLevel === level ? "bg-gradient-to-br from-gov-navy to-gov-blue text-white border-transparent" : "text-gov-text border-gov-border hover:border-gov-blue"}`}
                >
                  {level}
                </button>
              ))}
            </div>
            <p className="text-xs text-gov-muted mt-1">1 = Basic Research → 9 = Full Deployment</p>
          </div>

          {/* Text fields */}
          {proposalFields.map((f) => {
            const Icon = f.icon;
            const val = f.name === "methodology" ? methodology : f.name === "technicalApproach" ? technicalApproach : sandboxTimeline;
            const setter = f.name === "methodology" ? setMethodology : f.name === "technicalApproach" ? setTechnicalApproach : setSandboxTimeline;
            return (
              <div key={f.name}>
                <label className="text-sm font-semibold text-gov-text block mb-1.5 flex items-center gap-1">
                  <Icon size={13} className="text-gov-blue" />{f.label} *
                </label>
                <textarea
                  rows={f.rows}
                  value={val}
                  onChange={(e) => { setter(e.target.value); setErrors((prev) => ({ ...prev, [f.name]: "" })); }}
                  placeholder={f.desc}
                  className="gov-input resize-y"
                />
                {errors[f.name] && <p className="text-xs text-gov-danger mt-1">{errors[f.name]}</p>}
              </div>
            );
          })}

          {/* Estimated Cost */}
          <div>
            <label className="text-sm font-semibold text-gov-text block mb-1.5 flex items-center gap-1">
              <DollarSign size={13} className="text-gov-blue" />Estimated Cost (₹) *
            </label>
            <input
              type="number"
              value={estimatedCost || ""}
              onChange={(e) => { setEstimatedCost(Number(e.target.value)); setErrors((prev) => ({ ...prev, estimatedCost: "" })); }}
              placeholder="e.g. 18000000 (₹1.8 Cr)"
              className="gov-input"
            />
            {estimatedCost > 0 && <p className="text-xs text-gov-muted mt-1">= {formatCurrency(estimatedCost)}</p>}
            {errors.estimatedCost && <p className="text-xs text-gov-danger mt-1">{errors.estimatedCost}</p>}
          </div>

          <div className="flex gap-3 justify-end pt-2 border-t border-gov-border">
            <Button type="button" variant="outline" onClick={handleClose}>Cancel</Button>
            <Button type="button" variant="primary" onClick={handleReview}>
              <Eye size={14} />
              Review Proposal
            </Button>
          </div>
        </div>
      )}

      {/* ── Review Step ── */}
      {step === "review" && (
        <div className="p-6 space-y-5 animate-fade-in">
          <Alert variant="warning" icon={<AlertTriangle size={14} />}>
            <strong>Review your proposal carefully</strong> before submitting. Once submitted, it cannot be edited.
          </Alert>

          <div className="bg-gray-50 rounded-xl border border-gov-border divide-y divide-gov-border text-sm">
            <div className="p-4">
              <p className="text-xs text-gov-muted font-semibold uppercase tracking-wide mb-1">Challenge</p>
              <p className="font-semibold text-gov-navy">{challenge.title}</p>
              <p className="text-xs text-gov-muted">{challenge.department}</p>
            </div>
            <div className="grid grid-cols-2 divide-x divide-gov-border">
              <div className="p-4">
                <p className="text-xs text-gov-muted mb-1">TRL Level</p>
                <p className="font-bold text-gov-navy">TRL {trlLevel}</p>
              </div>
              <div className="p-4">
                <p className="text-xs text-gov-muted mb-1">Estimated Cost</p>
                <p className="font-bold text-gov-success">{formatCurrency(estimatedCost)}</p>
              </div>
            </div>
            <div className="p-4 space-y-3">
              {[
                { label: "Proposed Methodology", value: methodology },
                { label: "Technical Architecture", value: technicalApproach },
                { label: "Sandbox Timeline", value: sandboxTimeline },
              ].map((item) => (
                <div key={item.label}>
                  <p className="text-xs text-gov-muted font-semibold mb-1">{item.label}</p>
                  <p className="text-xs text-gov-text leading-relaxed">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 justify-between border-t border-gov-border pt-4">
            <Button type="button" variant="outline" onClick={() => setStep("form")}>
              <ArrowLeft size={14} /> Edit Proposal
            </Button>
            <Button type="button" variant="success" onClick={handleConfirmSubmit}>
              <Rocket size={14} />
              Confirm & Submit Proposal
            </Button>
          </div>
        </div>
      )}

      {/* ── Success Step ── */}
      {step === "submitted" && (
        <div className="p-8 text-center space-y-5 animate-fade-in">
          <div className="mx-auto w-16 h-16 rounded-full bg-emerald-50 border-4 border-gov-success flex items-center justify-center">
            <CheckCircle2 size={28} className="text-gov-success" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-xl text-gov-navy">Proposal Submitted!</h3>
            <p className="text-sm text-gov-muted mt-1">
              Your proposal for &quot;{challenge.title}&quot; has been received.
            </p>
          </div>
          <Alert variant="success">
            Your proposal is now under blind review by empanelled evaluators. You will be notified
            within 15 working days with the evaluation outcome.
          </Alert>
          <Button onClick={handleClose} variant="primary" className="w-full">
            Back to Challenges
          </Button>
        </div>
      )}
    </Modal>
  );
}
