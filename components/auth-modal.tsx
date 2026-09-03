"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import type { AuthUser, UserRole } from "@/types";
import { generateId } from "@/lib/utils";
import {
  Building2,
  Rocket,
  Scale,
  Shield,
  Eye,
  EyeOff,
  CheckCircle2,
  X,
  LogIn,
  UserPlus,
  ArrowLeft,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  defaultPortal?: "government" | "startup" | "evaluator" | null;
}

type AuthTab = "login" | "register";
type PortalType = "government" | "startup" | "evaluator" | null;

const portals = [
  {
    id: "government" as const,
    label: "Government Official",
    path: "/government",
    icon: Building2,
    color: "from-blue-600 to-blue-800",
    border: "border-blue-200 hover:border-blue-500",
    bg: "bg-blue-50",
    textColor: "text-blue-700",
    badge: "Central / State Govt",
    demoName: "Ramesh Iyer, Director",
    demoId: "GOV2024NIC01",
    description: "Post challenges, manage sandbox pilots & approve payments",
    loginFields: [
      { name: "employeeId", label: "Employee / NIC ID", placeholder: "e.g. GOV2024XXXXXX", type: "text", defaultValue: "GOV2024NIC01" },
      { name: "ministryCode", label: "Ministry Access Code", placeholder: "6-digit ministry code", type: "password", defaultValue: "123456" },
    ],
    registerFields: [
      { name: "name", label: "Full Name", placeholder: "Your name", type: "text" },
      { name: "designation", label: "Designation", placeholder: "e.g. Deputy Secretary", type: "text" },
      { name: "employeeId", label: "Employee / NIC ID", placeholder: "e.g. GOV2024XXXXXX", type: "text" },
      { name: "ministry", label: "Ministry / Department", placeholder: "Ministry of XYZ", type: "text" },
      { name: "ministryCode", label: "Create Access Code", placeholder: "6-digit code", type: "password" },
    ],
  },
  {
    id: "startup" as const,
    label: "Startup Founder",
    path: "/startup",
    icon: Rocket,
    color: "from-purple-600 to-purple-800",
    border: "border-purple-200 hover:border-purple-500",
    bg: "bg-purple-50",
    textColor: "text-purple-700",
    badge: "DPIIT Registered",
    demoName: "Aarav Sharma, Founder",
    demoId: "DIPP102938",
    description: "Discover challenges, verify DPIIT eligibility & submit proposals",
    loginFields: [
      { name: "dpiitNumber", label: "DPIIT Registration Number", placeholder: "e.g. DIPP102938", type: "text", defaultValue: "DIPP102938" },
      { name: "password", label: "Password", placeholder: "Your account password", type: "password", defaultValue: "password123" },
    ],
    registerFields: [
      { name: "name", label: "Founder Name", placeholder: "Your name", type: "text" },
      { name: "companyName", label: "Startup / Company Name", placeholder: "e.g. TechVenture Pvt. Ltd.", type: "text" },
      { name: "dpiitNumber", label: "DPIIT Registration Number", placeholder: "e.g. DIPP12345", type: "text" },
      { name: "email", label: "Work Email", placeholder: "you@startup.in", type: "email" },
      { name: "password", label: "Create Password", placeholder: "Min 8 characters", type: "password" },
    ],
  },
  {
    id: "evaluator" as const,
    label: "Evaluator",
    path: "/evaluator",
    icon: Scale,
    color: "from-amber-500 to-amber-700",
    border: "border-amber-200 hover:border-amber-500",
    bg: "bg-amber-50",
    textColor: "text-amber-700",
    badge: "Empanelled Expert",
    demoName: "Dr. Priya Nair",
    demoId: "EVAL-2024-ND01",
    description: "Conduct blind 7-dimension evaluations & generate official dossiers",
    loginFields: [
      { name: "evaluatorId", label: "Evaluator ID", placeholder: "e.g. EVAL-2024-XXXXX", type: "text", defaultValue: "EVAL-2024-ND01" },
      { name: "empanelmentCode", label: "Empanelment Code", placeholder: "Provided by DPIIT", type: "password", defaultValue: "eval123" },
    ],
    registerFields: [
      { name: "name", label: "Full Name", placeholder: "Your name", type: "text" },
      { name: "expertise", label: "Area of Expertise", placeholder: "e.g. AI/ML, Cybersecurity", type: "text" },
      { name: "evaluatorId", label: "Evaluator ID", placeholder: "e.g. EVAL-2024-XXXXX", type: "text" },
      { name: "empanelmentCode", label: "Empanelment Code", placeholder: "Provided by DPIIT", type: "password" },
      { name: "email", label: "Email Address", placeholder: "you@domain.com", type: "email" },
    ],
  },
];

export function AuthModal({ open, onClose, defaultPortal = null }: AuthModalProps) {
  const router = useRouter();
  const { login } = useStore();
  const [tab, setTab] = useState<AuthTab>("login");
  const [selectedPortal, setSelectedPortal] = useState<PortalType>(defaultPortal);
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (defaultPortal) {
      setSelectedPortal(defaultPortal);
      // Pre-fill demo defaults for convenience
      const p = portals.find((item) => item.id === defaultPortal);
      if (p) {
        const defaults: Record<string, string> = {};
        p.loginFields.forEach((f) => {
          if (f.defaultValue) defaults[f.name] = f.defaultValue;
        });
        setFormValues(defaults);
      }
    }
  }, [defaultPortal, open]);

  if (!open) return null;

  const portal = portals.find((p) => p.id === selectedPortal);

  const handleFieldChange = (name: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleQuickLogin = (portalItem: typeof portals[0]) => {
    const authUser: AuthUser = {
      id: generateId("usr"),
      name: portalItem.demoName,
      role: portalItem.id as UserRole,
      orgId: portalItem.demoId,
      loginTime: new Date().toISOString(),
    };

    login(authUser);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      onClose();
      router.push(portalItem.path);
    }, 800);
  };

  const handleSubmit = async () => {
    if (!portal) return;
    setLoading(true);
    setError("");

    await new Promise((r) => setTimeout(r, 600));

    const fields = tab === "login" ? portal.loginFields : portal.registerFields;
    const missing = fields.find((f) => !formValues[f.name]?.trim());
    if (missing) {
      setError(`Please fill in: ${missing.label}`);
      setLoading(false);
      return;
    }

    if (portal.id === "startup" && !formValues.dpiitNumber?.toUpperCase().startsWith("DIPP")) {
      setError("Invalid DPIIT Number format. Must start with DIPP.");
      setLoading(false);
      return;
    }

    const nameField = formValues.name || portal.demoName;
    const orgId = formValues.employeeId || formValues.dpiitNumber || formValues.evaluatorId || portal.demoId;

    const authUser: AuthUser = {
      id: generateId("usr"),
      name: nameField,
      role: portal.id as UserRole,
      orgId,
      loginTime: new Date().toISOString(),
    };

    login(authUser);
    setSuccess(true);
    setLoading(false);

    setTimeout(() => {
      setSuccess(false);
      setSelectedPortal(null);
      setFormValues({});
      setTab("login");
      onClose();
      router.push(portal.path);
    }, 800);
  };

  const reset = () => {
    setSelectedPortal(null);
    setFormValues({});
    setError("");
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl animate-fade-in overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-[#1E3A8A] p-5 text-white">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Shield size={20} className="text-blue-300" />
              <span className="font-heading font-bold text-lg">GovSetu Portal Authentication</span>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
              <X size={18} />
            </button>
          </div>

          {/* Login / Register tabs */}
          <div className="flex gap-1 bg-white/10 p-1 rounded-xl w-fit">
            {(["login", "register"] as AuthTab[]).map((t) => (
              <button
                key={t}
                onClick={() => { setTab(t); reset(); }}
                className={cn(
                  "px-4 py-1.5 rounded-lg text-sm font-semibold capitalize transition-all",
                  tab === t ? "bg-white text-[#1E3A8A]" : "text-white/80 hover:text-white"
                )}
              >
                {t === "login" ? (
                  <span className="flex items-center gap-1.5"><LogIn size={13} /> Login</span>
                ) : (
                  <span className="flex items-center gap-1.5"><UserPlus size={13} /> Create Account</span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="p-5 max-h-[75vh] overflow-y-auto">
          {success ? (
            <div className="py-8 text-center space-y-3 animate-fade-in">
              <div className="mx-auto w-16 h-16 rounded-full bg-emerald-50 border-4 border-gov-success flex items-center justify-center">
                <CheckCircle2 size={32} className="text-gov-success" />
              </div>
              <h3 className="font-heading font-bold text-gov-navy text-lg">
                {tab === "login" ? "Login Successful!" : "Account Created!"}
              </h3>
              <p className="text-sm text-gov-muted">Redirecting to your portal workspace...</p>
            </div>
          ) : !selectedPortal ? (
            /* Portal Selector */
            <div className="space-y-4">
              <div>
                <p className="font-heading font-semibold text-gov-navy text-base mb-0.5">
                  {tab === "login" ? "Select Portal to Login" : "Create Account As"}
                </p>
                <p className="text-xs text-gov-muted">Choose your role to open the respective portal workspace</p>
              </div>

              <div className="space-y-3">
                {portals.map((p) => {
                  const Icon = p.icon;
                  return (
                    <div
                      key={p.id}
                      className={cn(
                        "rounded-xl border-2 transition-all duration-200 p-4 hover:shadow-md",
                        p.border
                      )}
                    >
                      <div className="flex items-center gap-3.5 mb-2.5">
                        <div className={cn("p-2.5 rounded-xl bg-gradient-to-br text-white flex-shrink-0", p.color)}>
                          <Icon size={20} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="font-heading font-bold text-gov-navy text-sm">{p.label}</span>
                            <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full", p.bg, p.textColor)}>
                              {p.badge}
                            </span>
                          </div>
                          <p className="text-xs text-gov-muted line-clamp-1">{p.description}</p>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedPortal(p.id);
                            const defaults: Record<string, string> = {};
                            p.loginFields.forEach((f) => {
                              if (f.defaultValue) defaults[f.name] = f.defaultValue;
                            });
                            setFormValues(defaults);
                          }}
                          className="flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold border border-slate-300 text-gov-navy hover:bg-slate-50 transition-colors"
                        >
                          Enter Credentials
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuickLogin(p)}
                          className={cn(
                            "flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold text-white bg-gradient-to-r hover:opacity-90 transition-opacity flex items-center justify-center gap-1",
                            p.color
                          )}
                        >
                          <Zap size={12} /> 1-Click Demo Login
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Portal Form */
            <div className="space-y-4">
              <button onClick={reset} className="flex items-center gap-1.5 text-xs text-gov-muted hover:text-gov-navy transition-colors font-medium">
                <ArrowLeft size={13} /> Back to all portals
              </button>

              {portal && (
                <div className={cn("flex items-center justify-between p-3 rounded-xl border", portal.bg, portal.border.split(" ")[0])}>
                  <div className="flex items-center gap-2.5">
                    <div className={cn("p-2 rounded-lg bg-gradient-to-br text-white", portal.color)}>
                      <portal.icon size={16} />
                    </div>
                    <div>
                      <p className="font-semibold text-xs text-gov-navy">{portal.label} {tab === "login" ? "Login" : "Registration"}</p>
                      <p className="text-[11px] text-gov-muted">{portal.description}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleQuickLogin(portal)}
                    className="text-[11px] font-bold text-gov-blue hover:underline flex items-center gap-1 flex-shrink-0 ml-2"
                  >
                    <Zap size={11} /> Auto-fill Demo
                  </button>
                </div>
              )}

              {portal && (tab === "login" ? portal.loginFields : portal.registerFields).map((field) => (
                <div key={field.name}>
                  <label className="text-xs font-semibold text-gov-text block mb-1">{field.label}</label>
                  <div className="relative">
                    <input
                      type={field.type === "password" && showPass ? "text" : field.type}
                      placeholder={field.placeholder}
                      value={formValues[field.name] || ""}
                      onChange={(e) => handleFieldChange(field.name, e.target.value)}
                      className="gov-input w-full pr-10 text-sm py-2"
                    />
                    {field.type === "password" && (
                      <button
                        type="button"
                        onClick={() => setShowPass(!showPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gov-muted hover:text-gov-navy"
                      >
                        {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {error && (
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                  <Shield size={13} />
                  {error}
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={loading}
                className={cn(
                  "w-full py-3 px-4 rounded-xl font-semibold text-sm text-white shadow-md transition-all flex items-center justify-center gap-2",
                  portal ? `bg-gradient-to-r ${portal.color}` : "bg-gov-navy"
                )}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Signing in...
                  </>
                ) : (
                  <>
                    {tab === "login" ? <LogIn size={15} /> : <UserPlus size={15} />}
                    {tab === "login" ? `Sign in to ${portal?.label}` : "Create Account & Enter Portal"}
                  </>
                )}
              </button>

              {portal && (
                <button
                  type="button"
                  onClick={() => handleQuickLogin(portal)}
                  className="w-full py-2 rounded-xl text-xs font-semibold text-slate-600 border border-slate-200 hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5"
                >
                  <Zap size={12} className="text-amber-500" />
                  Quick Login as Demo {portal.label}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
