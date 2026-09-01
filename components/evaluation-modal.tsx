"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { Proposal } from "@/types";
import { Modal, Button, Alert, ProgressBar, Badge } from "@/components/ui";
import { useStore } from "@/lib/store";
import { formatCurrency, anonymizeName } from "@/lib/utils";
import {
  Shield,
  DollarSign,
  Cpu,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Scale,
  Info,
} from "lucide-react";

// â”€â”€ Evaluation Schema â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const evaluationSchema = z.object({
  technicalFeasibility: z
    .number()
    .min(0, "Minimum 0")
    .max(40, "Maximum 40 points"),
  cybersecurityDataIsolation: z
    .number()
    .min(0, "Minimum 0")
    .max(30, "Maximum 30 points"),
  costRealism: z
    .number()
    .min(0, "Minimum 0")
    .max(30, "Maximum 30 points"),
  comments: z
    .string()
    .min(50, "Please provide at least 50 characters of justification"),
});

type EvaluationFormData = z.infer<typeof evaluationSchema>;

interface EvaluationModalProps {
  open: boolean;
  onClose: () => void;
  proposal: Proposal | null;
  proposalIndex: number;
  evaluatorId: string;
}

const ScoreSlider = ({
  label,
  max,
  value,
  onChange,
  description,
  error,
  icon,
  color,
}: {
  label: string;
  max: number;
  value: number;
  onChange: (v: number) => void;
  description: string;
  error?: string;
  icon: React.ReactNode;
  color: string;
}) => {
  const pct = (value / max) * 100;
  const scoreColor = pct >= 80 ? "text-gov-success" : pct >= 60 ? "text-gov-warning" : "text-gov-danger";

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={color}>{icon}</span>
          <label className="text-sm font-semibold text-gov-text">{label}</label>
          <span className="text-xs text-gov-muted">/ {max} pts</span>
        </div>
        <span className={`font-heading font-bold text-xl ${scoreColor}`}>{value}</span>
      </div>
      <div className="flex items-center gap-3">
        <input
          type="range"
          min={0}
          max={max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="flex-1 h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-gov-blue"
        />
      </div>
      <ProgressBar value={value} max={max} color={pct >= 75 ? "green" : pct >= 50 ? "blue" : "amber"} showPercent={false} />
      <p className="text-xs text-gov-muted">{description}</p>
      {error && <p className="text-xs text-gov-danger font-medium">{error}</p>}
    </div>
  );
};

export function EvaluationModal({
  open,
  onClose,
  proposal,
  proposalIndex,
  evaluatorId,
}: EvaluationModalProps) {
  const { submitEvaluation } = useStore();
  const [submitted, setSubmitted] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [qualified, setQualified] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<EvaluationFormData>({
    resolver: zodResolver(evaluationSchema),
    defaultValues: {
      technicalFeasibility: 0,
      cybersecurityDataIsolation: 0,
      costRealism: 0,
      comments: "",
    },
  });

  const tf = watch("technicalFeasibility") || 0;
  const cd = watch("cybersecurityDataIsolation") || 0;
  const cr = watch("costRealism") || 0;
  const total = tf + cd + cr;

  const onSubmit = (data: EvaluationFormData) => {
    if (!proposal) return;
    const evaluation = submitEvaluation({
      proposalId: proposal.id,
      evaluatorId,
      challengeId: proposal.challengeId,
      technicalFeasibility: data.technicalFeasibility,
      cybersecurityDataIsolation: data.cybersecurityDataIsolation,
      costRealism: data.costRealism,
      comments: data.comments,
      status: "completed",
    });
    setFinalScore(evaluation.totalScore);
    setQualified(evaluation.qualifiedForSandbox);
    setSubmitted(true);
  };

  const handleClose = () => {
    setSubmitted(false);
    onClose();
  };

  if (!proposal) return null;

  const anonymousName = anonymizeName(proposal.startupName, proposalIndex);

  return (
    <Modal open={open} onClose={handleClose} title="Blind Proposal Evaluation" size="lg">
      {!submitted ? (
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Blind Anonymization Notice */}
          <Alert variant="info" icon={<Shield size={14} />}>
            <strong>Blind Evaluation Mode Active.</strong> Startup identity has been anonymized.
            You are evaluating <strong>{anonymousName}</strong>. Personal details are hidden to prevent bias.
          </Alert>

          {/* Proposal Summary */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-3 border border-gov-border">
            <div className="flex items-center justify-between">
              <h4 className="font-heading font-semibold text-gov-navy text-sm">Proposal Summary</h4>
              <Badge variant="secondary">{anonymousName}</Badge>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-gov-muted">TRL Level:</span>
                <span className="ml-2 font-semibold text-gov-text">TRL {proposal.trlLevel}</span>
              </div>
              <div>
                <span className="text-gov-muted">Estimated Cost:</span>
                <span className="ml-2 font-semibold text-gov-text">{formatCurrency(proposal.estimatedCost)}</span>
              </div>
              <div>
                <span className="text-gov-muted">Sandbox Timeline:</span>
                <span className="ml-2 font-semibold text-gov-text">{proposal.sandboxTimeline}</span>
              </div>
            </div>
            <div>
              <p className="text-xs text-gov-muted mb-1 font-semibold">Methodology:</p>
              <p className="text-xs text-gov-text leading-relaxed line-clamp-3">{proposal.methodology}</p>
            </div>
          </div>

          {/* Scoring Criteria */}
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h4 className="font-heading font-semibold text-gov-navy text-sm flex items-center gap-2">
                <Scale size={15} className="text-gov-blue" />
                Scoring Criteria (100 Points Total)
              </h4>
              <div className={`font-heading font-bold text-2xl ${total >= 80 ? "text-gov-success" : total >= 60 ? "text-gov-warning" : "text-gov-danger"}`}>
                {total} / 100
              </div>
            </div>

            {total >= 80 && (
              <Alert variant="success" icon={<CheckCircle2 size={14} />}>
                Score â‰¥ 80 â†’ <strong>Qualifies for Sandbox Pilot Design</strong> (GFR Rule 161 threshold met)
              </Alert>
            )}
            {total > 0 && total < 80 && (
              <Alert variant="warning" icon={<AlertTriangle size={14} />}>
                Score needs to reach <strong>80/100</strong> to qualify for Sandbox. Current: {total}/100
              </Alert>
            )}

            <ScoreSlider
              label="Technical Feasibility"
              max={40}
              value={tf}
              onChange={(v) => setValue("technicalFeasibility", v)}
              description="Assess the technical soundness, innovation level, architecture design, and proof of concept quality."
              error={errors.technicalFeasibility?.message}
              icon={<Cpu size={14} />}
              color="text-gov-blue"
            />

            <ScoreSlider
              label="Cybersecurity & Data Isolation"
              max={30}
              value={cd}
              onChange={(v) => setValue("cybersecurityDataIsolation", v)}
              description="Evaluate compliance with CERT-In guidelines, data sovereignty, sandboxing approach, and security architecture."
              error={errors.cybersecurityDataIsolation?.message}
              icon={<Shield size={14} />}
              color="text-purple-600"
            />

            <ScoreSlider
              label="Cost Realism"
              max={30}
              value={cr}
              onChange={(v) => setValue("costRealism", v)}
              description="Rate whether cost estimates are reasonable, well-justified, and align with market rates for similar solutions."
              error={errors.costRealism?.message}
              icon={<DollarSign size={14} />}
              color="text-gov-success"
            />
          </div>

          {/* Comments */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gov-text flex items-center gap-1">
              <Info size={13} className="text-gov-blue" />
              Evaluation Comments (min. 50 characters)
            </label>
            <textarea
              {...register("comments")}
              rows={4}
              placeholder="Provide detailed justification for your scores, highlighting strengths, weaknesses, and recommendations..."
              className="gov-input resize-y"
            />
            {errors.comments && (
              <p className="text-xs text-gov-danger font-medium">{errors.comments.message}</p>
            )}
          </div>

          <div className="flex gap-3 justify-end pt-2 border-t border-gov-border">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              <Scale size={14} />
              Submit Evaluation
            </Button>
          </div>
        </form>
      ) : (
        <div className="p-8 text-center space-y-5 animate-fade-in">
          <div
            className={`mx-auto w-20 h-20 rounded-full flex flex-col items-center justify-center border-4 ${
              qualified ? "border-gov-success bg-emerald-50" : "border-gov-danger bg-red-50"
            }`}
          >
            {qualified ? (
              <CheckCircle2 size={32} className="text-gov-success" />
            ) : (
              <XCircle size={32} className="text-gov-danger" />
            )}
          </div>

          <div>
            <div className="font-heading font-bold text-3xl text-gov-navy mb-1">{finalScore} / 100</div>
            <div className={`text-sm font-semibold ${qualified ? "text-gov-success" : "text-gov-danger"}`}>
              {qualified ? "âœ“ Qualified for Sandbox Pilot Design" : "âœ— Does Not Meet 80-Point Threshold"}
            </div>
          </div>

          <Alert
            variant={qualified ? "success" : "danger"}
            icon={qualified ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
          >
            {qualified
              ? "This proposal has been automatically queued for Sandbox Pilot Design phase. The government department will be notified."
              : "This proposal scored below the 80-point qualification threshold. The startup will be notified with evaluation feedback."}
          </Alert>

          <Button onClick={handleClose} variant="primary" className="w-full">
            Close Evaluation
          </Button>
        </div>
      )}
    </Modal>
  );
}
