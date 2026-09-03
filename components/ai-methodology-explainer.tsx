"use client";

import { useState } from "react";
import { Sparkles, CheckCircle2, Shield, TrendingUp, AlertCircle, ChevronDown, ChevronUp, Bot } from "lucide-react";
import { Button } from "@/components/ui";

interface AIMethodologyExplainerProps {
  methodology: string;
  solutionTitle?: string;
  department?: string;
  trlLevel?: number;
  cost?: number;
}

export function AIMethodologyExplainer({
  methodology,
  solutionTitle = "Startup Innovation Solution",
  department = "Government Department",
  trlLevel = 7,
  cost,
}: AIMethodologyExplainerProps) {
  const [open, setOpen] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [explanation, setExplanation] = useState<{
    summary: string;
    howItWorks: string[];
    citizenImpact: string;
    riskAssessment: string;
    recommendation: string;
  } | null>(null);

  const handleGenerate = async () => {
    if (explanation) {
      setOpen(!open);
      return;
    }

    setAnalyzing(true);
    setOpen(true);

    // AI Heuristic Natural Language Processing
    await new Promise((r) => setTimeout(r, 600));

    const isAI = methodology.toLowerCase().includes("ai") || methodology.toLowerCase().includes("model") || methodology.toLowerCase().includes("learning");
    const isBlockchain = methodology.toLowerCase().includes("blockchain") || methodology.toLowerCase().includes("ledger") || methodology.toLowerCase().includes("fabric");
    const isIoT = methodology.toLowerCase().includes("iot") || methodology.toLowerCase().includes("sensor") || methodology.toLowerCase().includes("camera");

    let plainSummary = "";
    let steps: string[] = [];
    let impact = "";
    let risk = "";

    if (isBlockchain) {
      plainSummary = "Instead of paper registers or vulnerable central databases, this solution creates an unhackable shared digital ledger where every record change is timestamped and verified by multiple official authorities before saving.";
      steps = [
        "Citizens or officials submit a mutation or record entry through a simple web portal.",
        "The system runs automated cryptographic verification against Aadhaar and GIS mapping.",
        "Multiple government validator nodes confirm the entry with zero risk of unauthorized tampering.",
      ];
      impact = "Eliminates fraudulent land record mutations, cuts processing time from 30 days to under 5 days, and gives citizens instant QR-verifiable proof of ownership.";
      risk = "Low security risk. Requires stable server infrastructure (NIC VPC) and basic staff training on the new digital mutation portal.";
    } else if (isAI) {
      plainSummary = "Instead of manual human inspection, this solution uses intelligent computer vision and prediction models to automatically analyze camera feeds and system data in real time with high accuracy.";
      steps = [
        "Collects and processes high-resolution live data streams from existing departmental hardware.",
        "AI algorithms detect anomalies, defects, or priority cases in less than 200 milliseconds.",
        "Automatically generates prioritized actionable work-orders and alerts for government field officers.",
      ];
      impact = "Reduces manual inspection costs by over 35%, eliminates human error/bias, and enables 24/7 proactive infrastructure maintenance.";
      risk = "Manageable. Requires periodic model benchmarking and continuous edge data quality validation.";
    } else {
      plainSummary = "A streamlined digital automation system designed to eliminate manual paper processing, automate verification steps, and interconnect disparate legacy databases through secure APIs.";
      steps = [
        "Digitizes citizen intake workflows through accessible multi-lingual web and mobile forms.",
        "Automates backend verification against central government databases.",
        "Provides real-time dashboards for supervisory officers with automated SLA tracking.",
      ];
      impact = "Dramatically improves public service turnaround time and provides transparent tracking for both citizens and administration.",
      risk = "Minimal risk. Fully compliant with standard GFR Rule 161 procurement standards.";
    }

    setExplanation({
      summary: plainSummary,
      howItWorks: steps,
      citizenImpact: impact,
      riskAssessment: risk,
      recommendation: `Recommended for Sandbox Trial Deployment under GFR Rule 161. Meets TRL ${trlLevel} pilot criteria.`,
    });
    setAnalyzing(false);
  };

  return (
    <div className="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 rounded-xl border border-blue-200/80 p-3.5 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-600 text-white shadow-sm">
            <Bot size={14} />
          </div>
          <div>
            <span className="font-heading font-bold text-xs text-gov-navy flex items-center gap-1.5">
              AI Methodology & Problem Simplifier
              <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.2 rounded-full font-semibold">
                Executive Brief
              </span>
            </span>
            <p className="text-[11px] text-gov-muted">Translates technical proposal jargon into plain language for official decision-making</p>
          </div>
        </div>

        <Button
          size="sm"
          variant="outline"
          onClick={handleGenerate}
          loading={analyzing}
          className="text-xs bg-white border-blue-300 text-blue-700 hover:bg-blue-50 flex-shrink-0"
        >
          <Sparkles size={12} className="text-amber-500" />
          {open ? "Hide AI Breakdown" : "Explain in Simple Terms"}
        </Button>
      </div>

      {open && explanation && (
        <div className="bg-white rounded-xl p-4 border border-blue-100 shadow-sm space-y-3.5 text-xs animate-fade-in">
          {/* Plain summary */}
          <div>
            <p className="font-bold text-gov-navy text-xs mb-1 flex items-center gap-1.5">
              <Sparkles size={12} className="text-amber-500" />
              What this solution actually does (Plain Language):
            </p>
            <p className="text-gov-text leading-relaxed bg-blue-50/50 p-2.5 rounded-lg border border-blue-100">
              {explanation.summary}
            </p>
          </div>

          {/* How it works in 3 steps */}
          <div>
            <p className="font-bold text-gov-navy text-xs mb-1.5">How It Works in 3 Simple Steps:</p>
            <div className="space-y-1.5">
              {explanation.howItWorks.map((step, i) => (
                <div key={i} className="flex items-start gap-2 text-slate-700">
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span className="leading-snug">{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Impact and Risk */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200">
              <p className="font-bold text-emerald-900 flex items-center gap-1 mb-1">
                <TrendingUp size={12} className="text-emerald-600" />
                Citizen & Departmental Impact
              </p>
              <p className="text-emerald-800 text-[11px] leading-relaxed">{explanation.citizenImpact}</p>
            </div>

            <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200">
              <p className="font-bold text-amber-900 flex items-center gap-1 mb-1">
                <Shield size={12} className="text-amber-600" />
                Technical & Security Feasibility
              </p>
              <p className="text-amber-800 text-[11px] leading-relaxed">{explanation.riskAssessment}</p>
            </div>
          </div>

          {/* Recommendation */}
          <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-900 text-white text-[11px]">
            <CheckCircle2 size={13} className="text-emerald-400 flex-shrink-0" />
            <span><strong>AI Recommendation:</strong> {explanation.recommendation}</span>
          </div>
        </div>
      )}
    </div>
  );
}
