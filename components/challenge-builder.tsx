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
  Wand2,
  ShieldCheck,
  Cpu,
} from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";

// Schema
const challengeSchema = z.object({
  title: z.string().min(10, "Title must be at least 10 characters"),
  department: z.string().min(3, "Department name required"),
  description: z.string().min(50, "Description must be at least 50 characters"),
  problemStatement: z.string().min(80, "Problem statement must be at least 80 characters"),
  budget: z.number().min(100000, "Minimum budget ₹1L"),
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
  { id: 5, label: "AI Review & Brief", icon: <Sparkles size={16} /> },
];

interface ChallengeBuilderProps {
  onSuccess?: (challenge: Challenge) => void;
}

export function ChallengeBuilder({ onSuccess }: ChallengeBuilderProps) {
  const { addChallenge, publishChallenge, log } = useStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [aiChecking, setAiChecking] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [aiBrief, setAiBrief] = useState<string | null>(null);
  const [aiDone, setAiDone] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [createdChallenge, setCreatedChallenge] = useState<Challenge | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
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

  // AI Auto-Refine & Fix Problem Mistakes
  const handleAutoRefineProblem = () => {
    const title = watchedValues.title || "AI-Enabled Urban Infrastructure Monitoring";
    const dept = watchedValues.department || "Ministry of Urban Development";
    
    const refinedBrief = `[PROBLEM BRIEF & AI ANALYSIS]:
1. CORE ISSUE: Current manual inspection workflows in ${dept} suffer from high latency (> 14 days), subjective evaluation biases, and lack of real-time telemetry integration.
2. OBJECTIVE: Deploy a TRL 6-7 automated computer vision and IoT analytics solution to achieve real-time monitoring and predictive maintenance across targeted infrastructure nodes.
3. TECHNICAL & REGULATORY CONSTRAINTS:
   - Data Security: Strict data isolation & CERT-In audit compliance required.
   - Interoperability: RESTful API integration with existing state GIS & Bhu-Naksha portals.
   - GFR Compliance: GFR Rule 161 startup waiver eligibility applied.
4. TARGET OUTCOMES: Reduce inspection cost by ≥ 35% and improve anomaly detection accuracy to ≥ 92%.`;

    setValue("problemStatement", refinedBrief, { shouldValidate: true });
    if (!watchedValues.targetKPIs) {
      setValue("targetKPIs", "Anomaly detection accuracy ≥ 92%\nResponse latency < 24 hours\nOperational cost reduction ≥ 35%", { shouldValidate: true });
    }
    if (!watchedValues.domains) {
      setValue("domains", "AI/ML, Computer Vision, IoT Telemetry, GIS Integration", { shouldValidate: true });
    }
  };

  // AI Review Simulation
  const runAICheck = async () => {
    setAiChecking(true);
    setAiSuggestions([]);
    await new Promise((r) => setTimeout(r, 800));

    const suggestions: string[] = [];
    if (!watchedValues.problemStatement.toLowerCase().includes("cert-in") && !watchedValues.problemStatement.toLowerCase().includes("data")) {
      suggestions.push("💡 AI Recommendation: Specify CERT-In cybersecurity & data isolation requirements.");
    }
    if (!watchedValues.targetKPIs.toLowerCase().includes("%")) {
      suggestions.push("📈 AI Recommendation: Include measurable percentage KPI targets (e.g., '≥ 90% accuracy').");
    }
    if ((watchedValues.budget || 0) < 5_000_000) {
      suggestions.push("💰 AI Recommendation: Budget appears low for full sandbox trial pilot (Typical range: ₹50L–₹5Cr).");
    }

    suggestions.push("✅ Problem statement structured with clear departmental scope.");
    suggestions.push("✅ GFR Rule 161 compliance tags attached for DPIIT startup waivers.");
    suggestions.push("✅ High alignment with Indian Government innovation procurement guidelines.");

    const brief = `AI Problem Brief Generated for ${watchedValues.department}:\n"${watchedValues.title}"\n- Scope: High priority technology procurement\n- Target TRL: Level 6–7 (Sandbox Pilot Ready)\n- Compliance: GFR Rule 161 Waiver Approved`;

    setAiSuggestions(suggestions);
    setAiBrief(brief);
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
      actor: "Government Officer Portal",
      role: "government",
      action: "CHALLENGE_CREATED_AND_PUBLISHED",
      entityType: "challenge",
      entityId: challenge.id,
      details: `Challenge "${data.title}" created and published by ${data.department}. Budget: ₹${(data.budget / 100000).toFixed(0)}L.`,
    });
    if (onSuccess) onSuccess(challenge);
  };

  if (submitted && createdChallenge) {
    return (
      <div className="p-8 text-center space-y-5 animate-fade-in">
        <div className="mx-auto w-16 h-16 rounded-full bg-emerald-50 border-4 border-gov-success flex items-center justify-center shadow-md">
          <CheckCircle2 size={28} className="text-gov-success" />
        </div>
        <div>
          <h3 className="font-heading font-bold text-xl text-gov-navy">Challenge Successfully Published!</h3>
          <p className="text-sm text-gov-muted mt-1">
            "{createdChallenge.title}" is live for DPIIT startup applications under GFR Rule 161.
          </p>
        </div>
        <Alert variant="success">
          Your challenge problem statement and AI Brief have been posted to the marketplace. Verified DPIIT startups can submit sandbox trial proposals immediately.
        </Alert>
        <Button variant="outline" onClick={() => { setSubmitted(false); setCurrentStep(1); }}>
          Post Another Government Challenge
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
              <label className="text-sm font-semibold text-gov-navy block mb-1.5">Challenge Title *</label>
              <input {...register("title")} placeholder="e.g. AI-Powered Pothole Detection & Road Quality Monitoring" className="gov-input" />
              {errors.title && <p className="text-xs text-gov-danger mt-1">{errors.title.message}</p>}
            </div>
            <div>
              <label className="text-sm font-semibold text-gov-navy block mb-1.5">Department / Ministry *</label>
              <select {...register("department")} className="gov-input appearance-none bg-white">
                {departments.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
              {errors.department && <p className="text-xs text-gov-danger mt-1">{errors.department.message}</p>}
            </div>
            <div>
              <label className="text-sm font-semibold text-gov-navy block mb-1.5">Brief Overview *</label>
              <textarea {...register("description")} rows={3} placeholder="Describe the technology procurement requirement..." className="gov-input resize-y" />
              {errors.description && <p className="text-xs text-gov-danger mt-1">{errors.description.message}</p>}
            </div>
          </div>
        )}

        {/* Step 2: Problem Statement + AI Auto-Refine */}
        {currentStep === 2 && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between p-3 rounded-xl bg-blue-50 border border-blue-200">
              <div className="flex items-center gap-2">
                <Sparkles size={18} className="text-gov-blue" />
                <span className="text-xs font-semibold text-gov-navy">AI Problem Assistant: Need help structuring your problem statement?</span>
              </div>
              <Button type="button" variant="primary" size="sm" onClick={handleAutoRefineProblem}>
                <Wand2 size={12} />
                AI Auto-Refine & Fix
              </Button>
            </div>

            <div>
              <label className="text-sm font-semibold text-gov-navy block mb-1.5">Detailed Problem Statement *</label>
              <textarea
                {...register("problemStatement")}
                rows={7}
                placeholder="Describe current situation, technical constraints, data availability, and expected outcome..."
                className="gov-input font-sans text-sm resize-y"
              />
              {errors.problemStatement && <p className="text-xs text-gov-danger mt-1">{errors.problemStatement.message}</p>}
              <p className="text-xs text-gov-muted mt-1">Min. 80 characters. Current: {watchedValues.problemStatement?.length ?? 0}</p>
            </div>
          </div>
        )}

        {/* Step 3: Budget & Timeline */}
        {currentStep === 3 && (
          <div className="space-y-4 animate-fade-in">
            <div>
              <label className="text-sm font-semibold text-gov-navy block mb-1.5">Total Sandbox Pilot Budget (₹) *</label>
              <input
                type="number"
                {...register("budget", { valueAsNumber: true })}
                placeholder="e.g. 5000000 (for ₹50 Lakhs)"
                className="gov-input font-mono"
              />
              {errors.budget && <p className="text-xs text-gov-danger mt-1">{errors.budget.message}</p>}
              {watchedValues.budget > 0 && (
                <p className="text-xs font-semibold text-gov-success mt-1">
                  Formatted: {formatCurrency(watchedValues.budget)}
                </p>
              )}
            </div>
            <div>
              <label className="text-sm font-semibold text-gov-navy block mb-1.5">Pilot Duration *</label>
              <input {...register("timeline")} placeholder="e.g. 6 months sandbox trial" className="gov-input" />
              {errors.timeline && <p className="text-xs text-gov-danger mt-1">{errors.timeline.message}</p>}
            </div>
            <div>
              <label className="text-sm font-semibold text-gov-navy block mb-1.5">Proposal Submission Deadline *</label>
              <input type="date" {...register("deadline")} className="gov-input" />
              {errors.deadline && <p className="text-xs text-gov-danger mt-1">{errors.deadline.message}</p>}
            </div>
          </div>
        )}

        {/* Step 4: KPIs & Domains */}
        {currentStep === 4 && (
          <div className="space-y-4 animate-fade-in">
            <div>
              <label className="text-sm font-semibold text-gov-navy block mb-1.5">
                <Target size={13} className="inline mr-1 text-gov-blue" />
                Measurable Target KPIs (one per line) *
              </label>
              <textarea
                {...register("targetKPIs")}
                rows={4}
                placeholder="Anomaly detection accuracy ≥ 92%&#10;Response latency < 24 hours&#10;Cost reduction ≥ 30%"
                className="gov-input resize-y font-mono text-sm"
              />
              {errors.targetKPIs && <p className="text-xs text-gov-danger mt-1">{errors.targetKPIs.message}</p>}
            </div>
            <div>
              <label className="text-sm font-semibold text-gov-navy block mb-1.5">
                <Tag size={13} className="inline mr-1 text-gov-blue" />
                Solution Technology Domains (comma-separated) *
              </label>
              <input
                {...register("domains")}
                placeholder="AI/ML, Computer Vision, IoT, GIS Integration"
                className="gov-input"
              />
              {errors.domains && <p className="text-xs text-gov-danger mt-1">{errors.domains.message}</p>}
            </div>
          </div>
        )}

        {/* Step 5: AI Review & Brief */}
        {currentStep === 5 && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-blue-50 border border-blue-200">
              <div className="p-2 rounded-lg bg-white shadow-sm">
                <Sparkles size={20} className="text-gov-blue" />
              </div>
              <div>
                <p className="font-semibold text-gov-navy text-sm">AI Problem Analysis & Brief Generator</p>
                <p className="text-xs text-gov-muted">Validating problem clarity, TRL readiness, and GFR Rule 161 compliance...</p>
              </div>
              {aiChecking && <Loader2 size={16} className="ml-auto animate-spin text-gov-blue" />}
            </div>

            {aiChecking && (
              <div className="space-y-2">
                {["Analyzing problem statement structure...", "Extracting target TRL & KPI benchmarks...", "Applying GFR Rule 161 compliance check..."].map((msg, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-gov-muted">
                    <Loader2 size={11} className="animate-spin text-gov-blue" />
                    {msg}
                  </div>
                ))}
              </div>
            )}

            {aiDone && aiBrief && (
              <div className="p-4 rounded-xl bg-slate-900 text-white space-y-2 font-mono text-xs shadow-md">
                <div className="flex items-center gap-2 text-amber-400 font-bold border-b border-slate-700 pb-2">
                  <ShieldCheck size={16} /> OFFICIAL AI PROBLEM BRIEF GENERATED
                </div>
                <pre className="whitespace-pre-wrap leading-relaxed text-slate-200 font-sans">{aiBrief}</pre>
              </div>
            )}

            {aiDone && aiSuggestions.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-semibold text-gov-navy">AI Validation Checks:</p>
                {aiSuggestions.map((s, i) => (
                  <div key={i} className="p-3 rounded-lg text-xs bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-emerald-600 flex-shrink-0" />
                    <span>{s}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="border-t border-gov-border pt-4">
              <Button type="submit" variant="success" className="w-full" size="lg" disabled={!aiDone}>
                <CheckCircle2 size={16} />
                Publish Challenge & AI Brief to Marketplace
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
              Next Step
              <ChevronRight size={14} />
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}
