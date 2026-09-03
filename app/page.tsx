"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";
import { AuthModal } from "@/components/auth-modal";
import {
  Building2,
  Rocket,
  Scale,
  Archive,
  ArrowRight,
  CheckCircle2,
  Search,
  FlaskConical,
  TrendingUp,
  Shield,
  LogIn,
  UserPlus,
  ChevronRight,
  Activity,
  Sparkles,
  Globe,
  Zap,
  Star,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function HomePage() {
  const { state } = useStore();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authDefaultTab, setAuthDefaultTab] = useState<"login" | "register">("login");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const [authPortal, setAuthPortal] = useState<"government" | "startup" | "evaluator" | null>(null);

  const activeChallenges = state.challenges.filter((c) => c.status === "applications_open");
  const totalStartups = state.startups.length;
  const completedPilots = state.pilots.filter((p) => p.status === "completed").length;
  const procurementValue = state.procurements.reduce((s, p) => s + p.procurementValue, 0);

  const statusBadge = (status: string) => {
    if (status === "applications_open") return { label: "Accepting Proposals", color: "bg-amber-100 text-amber-800 border-amber-200" };
    if (status === "evaluation") return { label: "Under Evaluation", color: "bg-blue-100 text-blue-800 border-blue-200" };
    if (status === "sandbox") return { label: "Active Pilot", color: "bg-emerald-100 text-emerald-800 border-emerald-200" };
    return { label: status, color: "bg-gray-100 text-gray-700 border-gray-200" };
  };

  const openAuth = (tab: "login" | "register", portal?: "government" | "startup" | "evaluator") => {
    setAuthDefaultTab(tab);
    setAuthPortal(portal ?? null);
    setAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* ── Hero Section ── */}
      <section className="pt-16 min-h-screen flex items-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 relative overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-32 right-10 w-[500px] h-[500px] bg-blue-100/40 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-[300px] h-[300px] bg-indigo-100/30 rounded-full blur-3xl" />
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(#1E3A8A 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative">
          <div className="max-w-3xl">
            {/* Badge */}
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 border border-blue-200 text-blue-700 text-xs font-semibold">
                <Globe size={11} /> Government of India Initiative
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-700 text-xs font-semibold">
                <CheckCircle2 size={11} /> DPIIT · Startup India · GFR Rule 161
              </span>
            </div>

            {/* Heading */}
            <h1 className="font-heading font-bold text-[#1E3A8A] leading-tight mb-6" style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}>
              Bridging Government Innovation{" "}
              <span className="text-[#2563EB]">&</span>{" "}
              Startup Solutions
            </h1>

            {/* Subtext */}
            <p className="text-[#1F2937] text-lg leading-relaxed mb-8 max-w-2xl font-[Inter,sans-serif]">
              A transparent pathway to discover, pilot, and procure emerging technologies.
              Connecting India's government bodies with DPIIT-verified startups through structured AI-driven evaluation.
            </p>

            {/* CTA Buttons — Strictly Role Based */}
            <div className="flex flex-wrap gap-3 mb-12">
              {state.authUser ? (
                /* Logged in: Show ONLY the user's relevant role action */
                state.authUser.role === "government" ? (
                  <Link
                    href="/government"
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#2563EB] text-white font-semibold text-sm hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 transition-all shadow-md"
                  >
                    <Building2 size={16} />
                    Enter Government Portal Workspace
                    <ArrowRight size={14} />
                  </Link>
                ) : state.authUser.role === "startup" ? (
                  <Link
                    href="/startup"
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#2563EB] text-white font-semibold text-sm hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 transition-all shadow-md"
                  >
                    <Rocket size={16} />
                    Enter My Startup Hub
                    <ArrowRight size={14} />
                  </Link>
                ) : (
                  <Link
                    href="/evaluator"
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#2563EB] text-white font-semibold text-sm hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 transition-all shadow-md"
                  >
                    <Scale size={16} />
                    Enter My Evaluator Scoring Workspace
                    <ArrowRight size={14} />
                  </Link>
                )
              ) : (
                /* Guest: Show Post a Challenge (Gov) & Explore (Startup) */
                <>
                  <button
                    onClick={() => openAuth("register", "government")}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#2563EB] text-white font-semibold text-sm hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 transition-all shadow-md"
                  >
                    <Building2 size={16} />
                    Post a Challenge
                    <ArrowRight size={14} />
                  </button>
                  <button
                    onClick={() => openAuth("register", "startup")}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-[#1E3A8A] text-[#1E3A8A] font-semibold text-sm hover:bg-[#1E3A8A] hover:text-white transition-all"
                  >
                    <Rocket size={16} />
                    Explore Opportunities
                  </button>
                </>
              )}
            </div>

            {/* Live Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Active Challenges", value: activeChallenges.length, icon: <Activity size={14} /> },
                { label: "Verified Startups", value: `${totalStartups}+`, icon: <Rocket size={14} /> },
                { label: "Completed Pilots", value: completedPilots, icon: <FlaskConical size={14} /> },
                { label: "Procurement Value", value: formatCurrency(procurementValue), icon: <TrendingUp size={14} /> },
              ].map((stat) => (
                <div key={stat.label} className="bg-white rounded-xl border border-slate-200 p-3 shadow-sm">
                  <div className="flex items-center gap-1.5 text-[#2563EB] mb-1 text-xs font-medium">{stat.icon}{stat.label}</div>
                  <div className="font-heading font-bold text-[#1E3A8A] text-lg">{stat.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Floating card decorations */}
          <div className="hidden lg:block absolute right-0 top-24 w-80 space-y-3">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-4 animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center"><Building2 size={16} className="text-blue-600" /></div>
                <div>
                  <p className="font-semibold text-xs text-[#1E3A8A]">AI Pothole Detection</p>
                  <p className="text-[10px] text-gray-500">Ministry of Road Transport</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-semibold border border-amber-200">Accepting Proposals</span>
                <span className="text-[10px] text-gray-500 font-mono">₹5 Cr</span>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-4 animate-fade-in ml-8" style={{ animationDelay: "0.5s" }}>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={14} className="text-amber-500" />
                <span className="text-xs font-semibold text-[#1E3A8A]">AI Match Score: 91%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="h-2 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full" style={{ width: "91%" }} />
              </div>
              <p className="text-[10px] text-gray-500 mt-1">Your startup is highly aligned with this challenge</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-4 animate-fade-in" style={{ animationDelay: "0.7s" }}>
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle2 size={14} className="text-emerald-500" />
                <span className="text-xs font-semibold text-emerald-700">Score: 87/100 · Qualified</span>
              </div>
              <p className="text-[10px] text-gray-500">Blind evaluation completed · Sandbox Pilot approved</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Value Proposition — 3-Column ── */}
      <section id="about" className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="font-heading font-bold text-[#1E3A8A] text-3xl sm:text-4xl mb-3">
              The Complete Innovation Pipeline
            </h2>
            <p className="text-[#1F2937] text-base max-w-xl mx-auto">
              From problem definition to national procurement — GovSetu manages every stage transparently.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <Search size={28} className="text-[#2563EB]" />,
                bg: "bg-blue-50",
                border: "border-blue-100",
                title: "Discover & Match",
                desc: "AI-driven matching between departmental problems and startup capabilities. 7-dimension evaluation scoring with dual-track parameters.",
                features: ["AI Match Score up to 99%", "DPIIT GFR Rule 161 Waivers", "Domain & TRL Compatibility"],
              },
              {
                icon: <FlaskConical size={28} className="text-purple-600" />,
                bg: "bg-purple-50",
                border: "border-purple-100",
                title: "Pilot & Validate",
                desc: "Secure sandbox testing environment with milestone-based KPIs, payment tranche control, and real-time progress tracking.",
                features: ["Milestone-based Payments", "KPI Achievement Tracking", "CERT-In Secure Sandboxes"],
              },
              {
                icon: <CheckCircle2 size={28} className="text-[#10B981]" />,
                bg: "bg-emerald-50",
                border: "border-emerald-100",
                title: "Procure & Scale",
                desc: "Fast-tracked GeM integration for successful pilots. Cross-departmental replication with certified innovation repository.",
                features: ["GeM Portal Integration", "Cross-dept. Replication", "National Scale Certification"],
              },
            ].map((col) => (
              <div key={col.title} className={cn("rounded-2xl border p-7 hover:shadow-lg transition-all duration-300 group", col.bg, col.border)}>
                <div className="mb-4">{col.icon}</div>
                <h3 className="font-heading font-bold text-[#1E3A8A] text-xl mb-2 group-hover:text-[#2563EB] transition-colors">{col.title}</h3>
                <p className="text-[#1F2937] text-sm leading-relaxed mb-4">{col.desc}</p>
                <ul className="space-y-1.5">
                  {col.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-xs text-[#1F2937] font-medium">
                      <CheckCircle2 size={12} className="text-[#10B981] flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Active Challenges Board ── */}
      <section id="challenges" className="bg-[#F3F4F6] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="font-heading font-bold text-[#1E3A8A] text-3xl mb-1">Live Government Challenges</h2>
              <p className="text-[#1F2937] text-sm">{activeChallenges.length} opportunities open for startup proposals right now</p>
            </div>
            <Link href="/startup" className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-[#2563EB] hover:underline">
              View All <ChevronRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {state.challenges.slice(0, 6).map((challenge) => {
              const badge = statusBadge(challenge.status);
              return (
                <div key={challenge.id} className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span className={cn("text-[11px] font-semibold px-2.5 py-0.5 rounded-full border", badge.color)}>
                      {badge.label}
                    </span>
                    <span className="text-[11px] text-gray-500 font-mono font-semibold">{formatCurrency(challenge.budget)}</span>
                  </div>
                  <h3 className="font-heading font-semibold text-[#1E3A8A] text-sm mb-1 group-hover:text-[#2563EB] transition-colors line-clamp-2">
                    {challenge.title}
                  </h3>
                  <p className="text-[11px] text-gray-500 mb-3 flex items-center gap-1">
                    <Building2 size={10} /> {challenge.department}
                  </p>
                  <p className="text-xs text-[#1F2937] line-clamp-2 mb-4">{challenge.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {challenge.domains.slice(0, 3).map((d) => (
                      <span key={d} className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-100 font-medium">{d}</span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-8">
            <button
              onClick={() => openAuth("login")}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1E3A8A] text-white font-semibold text-sm hover:bg-blue-800 transition-all shadow-md"
            >
              <LogIn size={15} />
              Login to Apply for Challenges
            </button>
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how-it-works" className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="font-heading font-bold text-[#1E3A8A] text-3xl sm:text-4xl mb-3">How It Works</h2>
            <p className="text-[#1F2937] text-base">End-to-end procurement in 5 transparent, auditable stages</p>
          </div>

          <div className="relative">
            <div className="hidden lg:block absolute top-8 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-[#1E3A8A] via-[#2563EB] to-[#10B981]" />
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-8">
              {[
                { step: "01", title: "Challenge Formulation", desc: "Government posts AI-structured problem with KPIs and constraints", icon: <Sparkles size={20} />, color: "from-blue-600 to-blue-800" },
                { step: "02", title: "Startup Discovery", desc: "AI matches startups by domain, TRL, and DPIIT eligibility", icon: <Search size={20} />, color: "from-purple-600 to-purple-800" },
                { step: "03", title: "Blind Evaluation", desc: "7-dimension anonymous scoring by empanelled experts", icon: <Scale size={20} />, color: "from-amber-500 to-amber-700" },
                { step: "04", title: "Sandbox Pilot", desc: "Controlled government trial with milestone payment control", icon: <FlaskConical size={20} />, color: "from-indigo-600 to-indigo-800" },
                { step: "05", title: "Procure & Scale", desc: "Successful pilots certified for national procurement", icon: <TrendingUp size={20} />, color: "from-emerald-600 to-emerald-800" },
              ].map((step, i) => (
                <div key={step.step} className="text-center relative" style={{ animationDelay: `${i * 0.1}s` }}>
                  <div className={cn("mx-auto w-16 h-16 rounded-full bg-gradient-to-br flex items-center justify-center mb-4 text-white shadow-lg relative z-10", step.color)}>
                    {step.icon}
                  </div>
                  <div className="text-xs font-bold text-[#2563EB] mb-1">STEP {step.step}</div>
                  <h3 className="font-heading font-bold text-[#1E3A8A] text-sm mb-2">{step.title}</h3>
                  <p className="text-xs text-[#1F2937] leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Portal Cards ── */}
      <section className="bg-[#F3F4F6] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading font-bold text-[#1E3A8A] text-3xl mb-2">
              {state.authUser ? "Your Assigned Workspace" : "3 Dedicated Portals"}
            </h2>
            <p className="text-[#1F2937] text-sm">
              {state.authUser
                ? "Role-based access is active: only your authorized role section is accessible."
                : "Each role has its own tailored workspace with real-time cross-portal sync"}
            </p>
          </div>
          <div className={cn("grid gap-5", state.authUser ? "max-w-xl mx-auto grid-cols-1" : "grid-cols-1 md:grid-cols-3")}>
            {[
              { role: "government" as const, icon: Building2, color: "from-blue-700 to-blue-900", label: "Government Official", badge: "Gov Officer", href: "/government", features: ["Post Challenges", "AI Problem Refiner", "Approve Milestone Payments", "Sandbox Pilot Tracking"] },
              { role: "startup" as const, icon: Rocket, color: "from-purple-600 to-purple-800", label: "Startup Founder", badge: "DPIIT Verified", href: "/startup", features: ["AI-Matched Challenges (up to 99%)", "DPIIT Eligibility Check", "Submit Proposals", "Track Evaluation Status"] },
              { role: "evaluator" as const, icon: Scale, color: "from-amber-500 to-amber-700", label: "Evaluator", badge: "Empanelled Expert", href: "/evaluator", features: ["Blind 7-Dimension Scoring", "Dual-Track Evaluation", "Official Dossier PDF", "Score Analytics & Graphs"] },
            ]
              .filter((portal) => {
                if (!state.authUser) return true;
                return portal.role === state.authUser.role;
              })
              .map((portal) => {
                const Icon = portal.icon;
                return (
                  <div key={portal.label} className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                    <div className={cn("p-6 bg-gradient-to-br text-white", portal.color)}>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
                          <Icon size={20} />
                        </div>
                        <div>
                          <p className="font-heading font-bold">{portal.label}</p>
                          <p className="text-xs text-white/70">{portal.badge}</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-5">
                      <ul className="space-y-2 mb-5">
                        {portal.features.map((f) => (
                          <li key={f} className="flex items-center gap-2 text-xs text-[#1F2937]">
                            <Zap size={11} className="text-[#2563EB] flex-shrink-0" />
                            {f}
                          </li>
                        ))}
                      </ul>
                      {state.authUser ? (
                        <Link
                          href={portal.href}
                          className="w-full py-2.5 rounded-xl bg-[#1E3A8A] text-white text-sm font-semibold hover:bg-blue-900 transition-all flex items-center justify-center gap-2 shadow-sm"
                        >
                          Enter {portal.label.split(" ")[0]} Workspace <ArrowRight size={14} />
                        </Link>
                      ) : (
                        <button
                          onClick={() => openAuth("login", portal.role)}
                          className="w-full py-2.5 rounded-xl border-2 border-[#1E3A8A] text-[#1E3A8A] text-sm font-semibold hover:bg-[#1E3A8A] hover:text-white transition-all flex items-center justify-center gap-2"
                        >
                          <LogIn size={14} />
                          Login to {portal.label.split(" ")[0]} Portal
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="bg-[#1E3A8A] py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Star size={16} className="text-amber-400" />
            <span className="text-blue-200 text-xs font-semibold tracking-wider uppercase">Get Started Today</span>
            <Star size={16} className="text-amber-400" />
          </div>
          <h2 className="font-heading font-bold text-white text-3xl sm:text-4xl mb-4">
            Ready to Transform Government Procurement?
          </h2>
          <p className="text-blue-200 text-base mb-8 max-w-xl mx-auto">
            Join India's fastest-growing government-startup innovation platform. Powered by AI, governed by GFR Rule 161.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => openAuth("register")}
              className="flex items-center gap-2 px-7 py-3.5 rounded-xl bg-white text-[#1E3A8A] font-bold text-sm hover:shadow-xl hover:-translate-y-0.5 transition-all"
            >
              <UserPlus size={16} />
              Create Free Account
              <ArrowRight size={14} />
            </button>
            <button
              onClick={() => openAuth("login")}
              className="flex items-center gap-2 px-7 py-3.5 rounded-xl border-2 border-white/30 text-white font-semibold text-sm hover:bg-white/10 transition-all"
            >
              <LogIn size={16} />
              Login to Your Portal
            </button>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-[#0F2057] text-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-3">
                <Shield size={16} className="text-blue-300" />
                <span className="font-heading font-bold text-white">GovSetu</span>
              </div>
              <p className="text-blue-300 text-xs leading-relaxed">AI-Enabled Government–Startup Innovation Procurement Platform.</p>
            </div>
            {[
              { title: "Portals", links: ["Government Portal", "Startup Hub", "Evaluator Portal", "Repository"] },
              { title: "Compliance", links: ["GFR Rule 161", "CERT-In Guidelines", "DISHA Data Standards", "Startup India"] },
              { title: "Platform", links: ["About GovSetu", "Audit Log", "API Documentation", "Privacy Policy"] },
            ].map((col) => (
              <div key={col.title}>
                <p className="font-semibold text-blue-200 text-xs uppercase tracking-wider mb-3">{col.title}</p>
                <ul className="space-y-1.5">
                  {col.links.map((l) => (
                    <li key={l}><a href="#" className="text-blue-400 text-xs hover:text-white transition-colors">{l}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-blue-900 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-blue-400 text-xs">
              © 2024 Government of India · Built under DPIIT Startup India Initiative
            </p>
            <div className="flex items-center gap-2">
              <Clock size={11} className="text-emerald-400" />
              <span className="text-emerald-400 text-xs font-semibold">Real-time cross-portal sync enabled</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        open={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultPortal={authPortal}
      />
    </div>
  );
}
