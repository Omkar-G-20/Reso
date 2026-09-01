"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
} from "lucide-react";

const proposalSchema = z.object({
  trlLevel: z.number().min(1).max(9),
  methodology: z.string().min(50, "Please describe your methodology (min 50 chars)"),
  sandboxTimeline: z.string().min(10, "Sandbox timeline details required"),
  technicalApproach: z.string().min(50, "Technical approach details required (min 50 chars)"),
  estimatedCost: z.number().min(100000, "Minimum estimated cost â‚¹1L"),
});

type ProposalFormData = z.infer<typeof proposalSchema>;

interface ProposalModalProps {
  open: boolean;
  onClose: () => void;
  challenge: Challenge | null;
  startup: Startup;
}

export function ProposalModal({ open, onClose, challenge, startup }: ProposalModalProps) {
  const { submitProposal } = useStore();
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ProposalFormData>({
    resolver: zodResolver(proposalSchema),
    defaultValues: {
      trlLevel: startup.trlLevel,
      methodology: "",
      sandboxTimeline: "",
      technicalApproach: "",
      estimatedCost: 0,
    },
  });

  const watchedCost = watch("estimatedCost") || 0;

  const onSubmit = (data: ProposalFormData) => {
    if (!challenge) return;
    submitProposal({
      challengeId: challenge.id,
      startupId: startup.id,
      startupName: startup.name,
      trlLevel: data.trlLevel,
      methodology: data.methodology,
      sandboxTimeline: data.sandboxTimeline,
      technicalApproach: data.technicalApproach,
      estimatedCost: data.estimatedCost,
      status: "submitted",
      matchScore: startup.domains.some((d) => challenge.domains.includes(d))
        ? Math.round(70 + Math.random() * 25)
        : Math.round(50 + Math.random() * 20),
    });
    setSubmitted(true);
  };

  const handleClose = () => {
    setSubmitted(false);
    onClose();
  };

  if (!challenge) return null;

  return (
    <Modal open={open} onClose={handleClose} title="Submit Proposal" size="lg">
      {!submitted ? (
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
          {/* Challenge context */}
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
            <p className="text-xs font-semibold text-gov-blue uppercase tracking-wide mb-1">Applying to Challenge</p>
            <p className="font-heading font-bold text-gov-navy text-sm">{challenge.title}</p>
            <p className="text-xs text-gov-muted mt-0.5">{challenge.department}</p>
            <div className="flex gap-4 mt-2 text-xs text-gov-muted">
              <span className="flex items-center gap-1">
                <DollarSign size={11} />
                Budget: {formatCurrency(challenge.budget)}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={11} />
                Timeline: {challenge.timeline}
              </span>
            </div>
          </div>

          {/* TRL Level */}
          <div>
            <label className="text-sm font-semibold text-gov-text block mb-2 flex items-center gap-1">
              <Cpu size={13} className="text-gov-blue" />
              Technology Readiness Level (TRL) *
            </label>
            <div className="grid grid-cols-9 gap-1">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((level) => (
                <label key={level} className="cursor-pointer">
                  <input
                    type="radio"
                    value={level}
                    {...register("trlLevel", { valueAsNumber: true })}
                    className="sr-only peer"
                  />
                  <div className="peer-checked:bg-gov-gradient peer-checked:text-white text-center py-1.5 rounded-lg text-xs font-bold border border-gov-border hover:border-gov-blue transition-all cursor-pointer">
                    {level}
                  </div>
                </label>
              ))}
            </div>
            <p className="text-xs text-gov-muted mt-1">1 = Basic Research â†’ 9 = Full Deployment</p>
          </div>

          {/* Methodology */}
          <div>
            <label className="text-sm font-semibold text-gov-text block mb-1.5 flex items-center gap-1">
              <BookOpen size={13} className="text-gov-blue" />
              Proposed Methodology *
            </label>
            <textarea
              {...register("methodology")}
              rows={4}
              placeholder="Describe your approach, technology stack, and how you'll solve the problem..."
              className="gov-input resize-y"
            />
            {errors.methodology && <p className="text-xs text-gov-danger mt-1">{errors.methodology.message}</p>}
          </div>

          {/* Technical Approach */}
          <div>
            <label className="text-sm font-semibold text-gov-text block mb-1.5 flex items-center gap-1">
              <Cpu size={13} className="text-gov-blue" />
              Technical Architecture & Approach *
            </label>
            <textarea
              {...register("technicalApproach")}
              rows={3}
              placeholder="APIs, models, infrastructure, security measures..."
              className="gov-input resize-y"
            />
            {errors.technicalApproach && <p className="text-xs text-gov-danger mt-1">{errors.technicalApproach.message}</p>}
          </div>

          {/* Sandbox Timeline */}
          <div>
            <label className="text-sm font-semibold text-gov-text block mb-1.5 flex items-center gap-1">
              <Clock size={13} className="text-gov-blue" />
              Proposed Sandbox Timeline *
            </label>
            <input
              {...register("sandboxTimeline")}
              placeholder="e.g. 3-month pilot on NH-48 corridor covering 500 km segment"
              className="gov-input"
            />
            {errors.sandboxTimeline && <p className="text-xs text-gov-danger mt-1">{errors.sandboxTimeline.message}</p>}
          </div>

          {/* Estimated Cost */}
          <div>
            <label className="text-sm font-semibold text-gov-text block mb-1.5 flex items-center gap-1">
              <DollarSign size={13} className="text-gov-blue" />
              Estimated Cost (â‚¹) *
            </label>
            <input
              type="number"
              {...register("estimatedCost", { valueAsNumber: true })}
              placeholder="e.g. 18000000 (â‚¹1.8 Cr)"
              className="gov-input"
            />
            {watchedCost > 0 && (
              <p className="text-xs text-gov-muted mt-1">= {formatCurrency(watchedCost)}</p>
            )}
            {errors.estimatedCost && <p className="text-xs text-gov-danger mt-1">{errors.estimatedCost.message}</p>}
          </div>

          <div className="flex gap-3 justify-end pt-2 border-t border-gov-border">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              <Rocket size={14} />
              Submit Proposal
            </Button>
          </div>
        </form>
      ) : (
        <div className="p-8 text-center space-y-5 animate-fade-in">
          <div className="mx-auto w-16 h-16 rounded-full bg-emerald-50 border-4 border-gov-success flex items-center justify-center">
            <CheckCircle2 size={28} className="text-gov-success" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-xl text-gov-navy">Proposal Submitted!</h3>
            <p className="text-sm text-gov-muted mt-1">
              Your proposal for "{challenge.title}" has been received.
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
