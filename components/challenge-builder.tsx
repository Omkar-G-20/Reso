"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { Challenge, ChallengeFormData } from "@/types";
import { Button, Alert, Card } from "@/components/ui";
import { useStore } from "@/lib/store";
import {
  FileText,
  Building2,
  DollarSign,
  Clock,
  Target,
  Tag,
  Calendar,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";

// â”€â”€ Schema â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const challengeSchema = z.object({
  title: z.string().min(10, "Title must be at least 10 characters"),
  department: z.string().min(3, "Department name required"),
  description: z.string().min(50, "Description must be at least 50 characters"),
  problemStatement: z.string().min(100, "Problem statement must be at least 100 characters"),
  budget: z.number().min(100000, "Minimum budget â‚¹1L"),
  timeline: z.string().min(3, "Timeline required (e.g. '6 months')"),
  targetKPIs: z.string().min(10, "At least one KPI required"),
  domains: z.string().min(3, "At least one domain required"),
  deadline: z.string().min(1, "Deadline required"),
});

const departments = [
  "Ministry of Road Transport & Highways",
  "Department of Administrative Reforms & Public Grievances",
  "Ministry of Rural Development",
  "Ministry of Power",
  "Ministry of Health & Family Welfare",
  "Ministry of Agriculture & Farmers Welfare",
  "Ministry of Education",
  "Ministry of Finance",
  "Department for Promotion of Industry & Internal Trade",
  "Ministry of Electronics & IT",
  "Ministry of Railways",
  "Ministry of Defence",
  "Ministry of Urban Development",
  "Ministry of Water Resources",
  "Ministry of Science & Technology",
];

const steps = [
  { id: 1, label: "Basic Info", icon: <FileText size={16} /> },
  { id: 2, label: "Problem Statement", icon: <AlertTriangle size={16} /> },
  { id: 3, label: "Budget & Timeline", icon: <DollarSign size={16} /> },
  { id: 4, label: "KPIs & Domains", icon: <Target size={16} /> },
  { id: 5, label: "AI Review", icon: <Sparkles size={16} /> },
];

interface ChallengeBuilderProps {
  onSuccess?: (challenge: Challenge) => void;
}

export function ChallengeBuilder({ onSuccess }: ChallengeBuilderProps) {
  const { addChallenge, publishChallenge, log } = useStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [aiChecking, setAiChecking] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [aiDone, setAiDone] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [createdChallenge, setCreatedChallenge] = useState<Challenge | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors },
  } = useForm<ChallengeFormData>({
    resolver: zodResolver(challengeSchema),
    defaultValues: {
      title: "",
      department: departments[0],
      description: "",
      problemStatement: "",
      budget: 0,
      timeline: "",
      targetKPIs: "",
      domains: "",
      deadline: "",
    },
  });

  const watchedValues = watch();

  // â”€â”€ AI Suggestion simulation â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const runAICheck = async () => {
    setAiChecking(true);
    setAiSuggestions([]);
    await new Promise((r) => setTimeout(r, 800));

    const suggestions: string[] = [];
    if (!watchedValues.problemStatement.toLowerCase().includes("data")) {
      suggestions.push("ðŸ“Š Consider specifying data privacy and security requirements (CERT-In, DISHA compliance).");
    }
    if (!watchedValues.targetKPIs.toLowerCase().includes("%")) {
      suggestions.push("ðŸ“ˆ KPIs should include measurable percentage targets (e.g. 'â‰¥ 90% accuracy').");
    }
    if ((watchedValues.budget || 0) < 5_000_000) {
      suggestions.push("ðŸ’° Budget appears low. Consider typical government sandbox pilot costs (â‚¹50Lâ€“â‚¹5Cr range).");
    }
    if (!watchedValues.timeline.toLowerCase().includes("month")) {
      suggestions.push("â±ï¸ Specify timeline in months for clarity (e.g. '12 months' or '6 months + 3 month extension').");
    }
    if (!watchedValues.description.toLowerCase().includes("api")) {
      suggestions.push("ðŸ”— Mention integration requirements with existing government APIs or portals.");
    }
    if (suggestions.length === 0) {
      suggestions.push("âœ… All requirements look well-structured and complete!");
      suggestions.push("âœ… Problem statement is comprehensive with clear scope.");
      suggestions.push("âœ… Budget and timeline are aligned with industry standards.");
    }

    setAiSuggestions(suggestions);
    setAiChecking(false);
    setAiDone(true);
  };

  useEffect(() => {
    if (currentStep === 5) {
      runAICheck();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep]);

  const nextStep = async () => {
    let valid = false;
    if (currentStep === 1) valid = await trigger(["title", "department", "description"]);
    else if (currentStep === 2) valid = await trigger(["problemStatement"]);
    else if (currentStep === 3) valid = await trigger(["budget", "timeline", "deadline"]);
    else if (currentStep === 4) valid = await trigger(["targetKPIs", "domains"]);
    else valid = true;

    if (valid) setCurrentStep((s) => Math.min(s + 1, 5));
  };

  const onSubmit = (data: ChallengeFormData) => {
    const challenge = addChallenge({
      title: data.title,
      department: data.department,
      description: data.description,
      problemStatement: data.problemStatement,
      budget: data.budget,
      timeline: data.timeline,
      targetKPIs: data.targetKPIs.split("\n").filter(Boolean),
      domains: data.domains.split(",").map((d) => d.trim()).filter(Boolean),
      deadline: data.deadline,
      status: "draft",
      createdBy: "gov_user_portal",
      aiSuggestions: aiSuggestions,
    });

    publishChallenge(challenge.id);
    setCreatedChallenge(challenge);
    setSubmitted(true);
    log({
      actor: "Government Portal",
      role: "government",
      action: "CHALLENGE_CREATED_AND_PUBLISHED",
      entityType: "challenge",
      entityId: challenge.id,
      details: `Challenge "${data.title}" created and published by ${data.department}.`,
    });
    if (onSuccess) onSuccess(challenge);
  };

  if (submitted && createdChallenge) {
    return (
      <div className="p-8 text-center space-y-5 animate-fade-in">
        <div className="mx-auto w-16 h-16 rounded-full bg-emerald-50 border-4 border-gov-success flex items-center justify-center">
          <CheckCircle2 size={28} className="text-gov-success" />
        </div>
        <div>
          <h3 className="font-heading font-bold text-xl text-gov-navy">Challenge Published!</h3>
          <p className="text-sm text-gov-muted mt-1">
            "{createdChallenge.title}" is now live for startup applications.
          </p>
        </div>
        <Alert variant="success">
          Your challenge has been published to the GovSetu marketplace. Eligible DPIIT-registered startups
          will be notified and can submit proposals immediately.
        </Alert>
        <Button variant="outline" onClick={() => { setSubmitted(false); setCurrentStep(1); }}>
          Create Another Challenge
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Step Progress */}
      <div className="flex items-center justify-between">
        {steps.map((step, i) => (
          <div key={step.id} className="flex items-center">
            <div
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200",
                currentStep === step.id
                  ? "bg-gov-gradient text-white shadow-md"
                  : currentStep > step.id
                  ? "bg-emerald-100 text-gov-success"
                  : "bg-gray-100 text-gov-muted"
              )}
            >
              {currentStep > step.id ? <CheckCircle2 size={13} /> : step.icon}
              <span className="hidden sm:inline">{step.label}</span>
            </div>
            {i < steps.length - 1 && (
              <div className={cn("h-0.5 w-4 mx-1", currentStep > step.id ? "bg-gov-success" : "bg-gray-200")} />
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Step 1: Basic Info */}
        {currentStep === 1 && (
          <div className="space-y-4 animate-fade-in">
            <div>
              <label className="text-sm font-semibold text-gov-text block mb-1.5">Challenge Title *</label>
              <input {...register("title")} placeholder="e.g. AI-Powered Pothole Detection System" className="gov-input" />
              {errors.title && <p className="text-xs text-gov-danger mt-1">{errors.title.message}</p>}
            </div>
            <div>
              <label className="text-sm font-semibold text-gov-text block mb-1.5">Department *</label>
              <select {...register("department")} className="gov-input appearance-none bg-white">
                {departments.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
              {errors.department && <p className="text-xs text-gov-danger mt-1">{errors.department.message}</p>}
            </div>
            <div>
              <label className="text-sm font-semibold text-gov-text block mb-1.5">Brief Description *</label>
              <textarea {...register("description")} rows={3} placeholder="Briefly describe the solution you're looking for..." className="gov-input resize-y" />
              {errors.description && <p className="text-xs text-gov-danger mt-1">{errors.description.message}</p>}
            </div>
          </div>
        )}

        {/* Step 2: Problem Statement */}
        {currentStep === 2 && (
          <div className="space-y-4 animate-fade-in">
            <Alert variant="info" icon={<AlertTriangle size={14} />}>
              A clear problem statement helps startups understand the exact pain point and scope of your challenge.
            </Alert>
            <div>
              <label className="text-sm font-semibold text-gov-text block mb-1.5">Detailed Problem Statement *</label>
              <textarea
                {...register("problemStatement")}
                rows={7}
                placeholder="Describe the problem in detail:&#10;â€¢ What is the current situation?&#10;â€¢ What are the pain points and costs?&#10;â€¢ What data/infrastructure is available?&#10;â€¢ What constraints must the solution respect?"
                className="gov-input resize-y"
              />
              {errors.problemStatement && <p className="text-xs text-gov-danger mt-1">{errors.problemStatement.message}</p>}
              <p className="text-xs text-gov-muted mt-1">Min. 100 characters. Current: {watchedValues.problemStatement?.length ?? 0}</p>
            </div>
          </div>
        )}

        {/* Step 3: Budget & Timeline */}
        {currentStep === 3 && (
          <div className="space-y-4 animate-fade-in">
            <div>
              <label className="text-sm font-semibold text-gov-text block mb-1.5">Total Budget (â‚¹) *</label>
              <input
                type="number"
                {...register("budget", { valueAsNumber: true })}
                placeholder="e.g. 50000000 (for â‚¹5 Cr)"
                className="gov-input"
              />
              {errors.budget && <p className="text-xs text-gov-danger mt-1">{errors.budget.message}</p>}
              {watchedValues.budget > 0 && (
                <p className="text-xs text-gov-muted mt-1">
                  = â‚¹{(watchedValues.budget / 10_000_000).toFixed(2)} Cr
                </p>
              )}
            </div>
            <div>
              <label className="text-sm font-semibold text-gov-text block mb-1.5">Expected Timeline *</label>
              <input {...register("timeline")} placeholder="e.g. 12 months" className="gov-input" />
              {errors.timeline && <p className="text-xs text-gov-danger mt-1">{errors.timeline.message}</p>}
            </div>
            <div>
              <label className="text-sm font-semibold text-gov-text block mb-1.5">Application Deadline *</label>
              <input type="date" {...register("deadline")} className="gov-input" />
              {errors.deadline && <p className="text-xs text-gov-danger mt-1">{errors.deadline.message}</p>}
            </div>
          </div>
        )}

        {/* Step 4: KPIs & Domains */}
        {currentStep === 4 && (
          <div className="space-y-4 animate-fade-in">
            <div>
              <label className="text-sm font-semibold text-gov-text block mb-1.5">
                <Target size={13} className="inline mr-1 text-gov-blue" />
                Target KPIs (one per line) *
              </label>
              <textarea
                {...register("targetKPIs")}
                rows={5}
                placeholder="Detection accuracy â‰¥ 92%&#10;Coverage of 50,000 km in Phase 1&#10;Response time < 24 hours&#10;Cost reduction â‰¥ 30%"
                className="gov-input resize-y font-mono text-sm"
              />
              {errors.targetKPIs && <p className="text-xs text-gov-danger mt-1">{errors.targetKPIs.message}</p>}
            </div>
            <div>
              <label className="text-sm font-semibold text-gov-text block mb-1.5">
                <Tag size={13} className="inline mr-1 text-gov-blue" />
                Solution Domains (comma-separated) *
              </label>
              <input
                {...register("domains")}
                placeholder="AI/ML, Computer Vision, IoT, GIS"
                className="gov-input"
              />
              {errors.domains && <p className="text-xs text-gov-danger mt-1">{errors.domains.message}</p>}
            </div>
          </div>
        )}

        {/* Step 5: AI Review */}
        {currentStep === 5 && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-blue-50 border border-blue-200">
              <div className="p-2 rounded-lg bg-white shadow-sm">
                <Sparkles size={20} className="text-gov-blue" />
              </div>
              <div>
                <p className="font-semibold text-gov-navy text-sm">AI Challenge Assistant</p>
                <p className="text-xs text-gov-muted">Analyzing your challenge for completeness and quality...</p>
              </div>
              {aiChecking && <Loader2 size={16} className="ml-auto animate-spin text-gov-blue" />}
            </div>

            {aiChecking && (
              <div className="space-y-2">
                {["Checking problem clarity...", "Validating KPI measurability...", "Reviewing budget alignment...", "Checking compliance requirements..."].map((msg, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-gov-muted animate-pulse-slow" style={{ animationDelay: `${i * 0.3}s` }}>
                    <Loader2 size={11} className="animate-spin" />
                    {msg}
                  </div>
                ))}
              </div>
            )}

            {aiDone && aiSuggestions.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-semibold text-gov-navy">AI Recommendations:</p>
                {aiSuggestions.map((s, i) => (
                  <div
                    key={i}
                    className={cn(
                      "p-3 rounded-lg text-sm border animate-fade-in",
                      s.startsWith("âœ…")
                        ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                        : "bg-amber-50 border-amber-200 text-amber-700"
                    )}
                    style={{ animationDelay: `${i * 0.1}s` }}
                  >
                    {s}
                  </div>
                ))}
              </div>
            )}

            {aiDone && (
              <Alert variant="success" icon={<CheckCircle2 size={14} />}>
                Challenge review complete. You can now publish it to the GovSetu marketplace.
              </Alert>
            )}

            <div className="border-t border-gov-border pt-4">
              <Button type="submit" variant="success" className="w-full" size="lg" disabled={!aiDone}>
                <CheckCircle2 size={16} />
                Publish Challenge
              </Button>
            </div>
          </div>
        )}

        {/* Navigation */}
        {currentStep < 5 && (
          <div className="flex justify-between mt-6 pt-4 border-t border-gov-border">
            <Button
              type="button"
              variant="outline"
              onClick={() => setCurrentStep((s) => Math.max(s - 1, 1))}
              disabled={currentStep === 1}
            >
              <ChevronLeft size={14} />
              Back
            </Button>
            <Button type="button" variant="primary" onClick={nextStep}>
              Next
              <ChevronRight size={14} />
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}
