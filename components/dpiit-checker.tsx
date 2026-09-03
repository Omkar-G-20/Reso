"use client";

import { useState } from "react";
import type { Startup } from "@/types";
import { Badge, Button, Alert, Card } from "@/components/ui";
import {
  Shield,
  CheckCircle2,
  XCircle,
  Loader2,
  BadgeCheck,
  Info,
  Building2,
  TrendingUp,
  Users,
} from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";

interface DPIITCheckerProps {
  startup: Startup;
}

const waiverDescriptions = {
  prior_experience:
    "Prior Experience Waiver (GFR Rule 161(iv)(a)) — Exempted from requiring 3+ years of government project experience. Eligible as a DPIIT-registered startup.",
  turnover:
    "Turnover Waiver (GFR Rule 161(iv)(b)) — Exempted from minimum annual turnover requirements (typically ₹1 Cr). Startup's early-stage status recognized.",
  none: "",
};

export function DPIITChecker({ startup }: DPIITCheckerProps) {
  const [checking, setChecking] = useState(false);
  const [checked, setChecked] = useState(false);
  const [result, setResult] = useState<typeof startup.eligibilityStatus | null>(null);

  const runCheck = async () => {
    setChecking(true);
    setChecked(false);
    await new Promise((r) => setTimeout(r, 1500));
    setResult(startup.eligibilityStatus);
    setChecking(false);
    setChecked(true);
  };

  const isVerified = result === "verified";

  return (
    <Card className="overflow-hidden">
      {/* Header */}
      <div className="gov-gradient p-4 text-white">
        <div className="flex items-center gap-2 mb-1">
          <Shield size={18} />
          <span className="font-heading font-bold">DPIIT Eligibility Verification</span>
        </div>
        <p className="text-xs text-blue-100">
          Automated verification under GFR Rule 161 — prior experience & turnover waivers
        </p>
      </div>

      <div className="p-5 space-y-4">
        {/* Startup Details */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-gov-muted mb-0.5 flex items-center gap-1">
              <Building2 size={11} />
              DPIIT Number
            </div>
            <div className="font-bold text-gov-navy font-mono">{startup.dpiitNumber}</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-gov-muted mb-0.5 flex items-center gap-1">
              <TrendingUp size={11} />
              Annual Turnover
            </div>
            <div className="font-bold text-gov-navy">₹{startup.annualTurnover}L</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-gov-muted mb-0.5 flex items-center gap-1">
              <Users size={11} />
              Team Size
            </div>
            <div className="font-bold text-gov-navy">{startup.teamSize} members</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-gov-muted mb-0.5">Founded</div>
            <div className="font-bold text-gov-navy">{startup.foundedYear}</div>
          </div>
        </div>

        {/* Check button */}
        {!checked && (
          <Button
            variant="primary"
            onClick={runCheck}
            loading={checking}
            className="w-full"
          >
            {checking ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Verifying with DPIIT Registry...
              </>
            ) : (
              <>
                <Shield size={14} />
                Run Eligibility Check
              </>
            )}
          </Button>
        )}

        {/* Checking animation */}
        {checking && (
          <div className="space-y-2 pt-1">
            {[
              "Querying DPIIT Registration Database...",
              "Checking Recognition Status...",
              "Evaluating GFR Rule 161 Waiver Eligibility...",
              "Verifying Turnover Threshold...",
            ].map((step, i) => (
              <div
                key={i}
                className="flex items-center gap-2 text-xs text-gov-muted"
              >
                <Loader2 size={11} className="animate-spin text-gov-blue flex-shrink-0" />
                {step}
              </div>
            ))}
          </div>
        )}

        {/* Results */}
        {checked && result && (
          <div className="space-y-3 animate-fade-in">
            {/* Overall status */}
            <div
              className={cn(
                "flex items-center gap-3 p-3 rounded-xl border",
                isVerified ? "bg-emerald-50 border-emerald-200" : "bg-red-50 border-red-200"
              )}
            >
              <div className={cn("p-2 rounded-lg", isVerified ? "bg-emerald-100" : "bg-red-100")}>
                {isVerified ? (
                  <BadgeCheck size={20} className="text-gov-success" />
                ) : (
                  <XCircle size={20} className="text-gov-danger" />
                )}
              </div>
              <div className="flex-1">
                <div className={cn("font-semibold text-sm", isVerified ? "text-emerald-700" : "text-red-700")}>
                  {isVerified ? "✓ DPIIT Verified — Eligible to Apply" : "✗ Verification Failed"}
                </div>
                <div className="text-xs text-gov-muted mt-0.5">
                  {startup.name} · {startup.dpiitNumber}
                </div>
              </div>
              <Badge variant={isVerified ? "success" : "danger"}>
                {isVerified ? "Eligible" : "Rejected"}
              </Badge>
            </div>

            {/* Waivers */}
            {isVerified && startup.waivers.filter((w) => w !== "none").length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-gov-text uppercase tracking-wide flex items-center gap-1">
                  <Info size={11} className="text-gov-blue" />
                  Applicable Waivers
                </p>
                {startup.waivers
                  .filter((w) => w !== "none")
                  .map((waiver) => (
                    <div key={waiver} className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg border border-blue-100">
                      <CheckCircle2 size={14} className="text-gov-blue mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-gov-text leading-relaxed">
                        {waiverDescriptions[waiver]}
                      </p>
                    </div>
                  ))}
              </div>
            )}

            {isVerified && startup.waivers.filter((w) => w !== "none").length === 0 && (
              <Alert variant="info" icon={<Info size={14} />}>
                <strong>No waivers required.</strong> This startup meets all standard GFR eligibility criteria.
              </Alert>
            )}

            {!isVerified && (
              <Alert variant="danger" icon={<XCircle size={14} />}>
                DPIIT registration could not be verified. Please ensure your DPIIT certificate is valid.
              </Alert>
            )}

            {isVerified && (
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => setChecked(false)}
              >
                Re-verify
              </Button>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
