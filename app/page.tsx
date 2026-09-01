"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";
import { StatCard } from "@/components/ui";
import { formatCurrency } from "@/lib/utils";
import {
  Building2,
  Rocket,
  Scale,
  Archive,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Shield,
  TrendingUp,
  Zap,
  Globe,
} from "lucide-react";

export default function HomePage() {
  const { state } = useStore();

  const activeChallengies = state.challenges.filter((c) => c.status === "applications_open").length;
  const totalStartups = state.startups.length;
  const completedPilots = state.pilots.filter((p) => p.status === "completed").length;
  const procurementValue = state.procurements.reduce((s, p) => s + p.procurementValue, 0);

  const features = [
    {
      icon: <Building2 size={24} className="text-gov-blue" />,
      title: "Government Innovation Portal",
      description: "Define challenges, set KPIs, and manage sandbox pilots with AI-assisted requirement structuring.",
      href: "/government",
      color: "bg-blue-50 border-blue-200",
      badge: "For Govt Officers",
    },
    {
      icon: <Rocket size={24} className="text-purple-600" />,
      title: "Startup Discovery Hub",
      description: "Find matching government challenges, verify DPIIT eligibility, and submit structured proposals.",
      href: "/startup",
      color: "bg-purple-50 border-purple-200",
      badge: "For Startups",
    },
    {
      icon: <Scale size={24} className="text-amber-600" />,
      title: "Evaluator Portal",
      description: "Conduct blind evaluations with structured scoring matrices. Auto-qualify proposals at 80+ points.",
      href: "/evaluator",
      color: "bg-amber-50 border-amber-200",
      badge: "For Evaluators",
    },
    {
      icon: <Archive size={24} className="text-emerald-600" />,
      title: "Innovation Repository",
      description: "Discover piloted solutions certified for cross-departmental procurement and scaling.",
      href: "/repository",
      color: "bg-emerald-50 border-emerald-200",
      badge: "All Roles",
    },
  ];

  const processSteps = [
    { step: "01", title: "Challenge Formulation", desc: "Government defines problem with AI-assisted structuring", icon: <Sparkles size={18} /> },
    { step: "02", title: "Startup Discovery", desc: "AI matches startups based on domain & readiness scores", icon: <Zap size={18} /> },
    { step: "03", title: "Blind Evaluation", desc: "Anonymous proposals scored across 3 weighted dimensions", icon: <Shield size={18} /> },
    { step: "04", title: "Sandbox Pilot", desc: "Selected startups run controlled government pilots", icon: <Globe size={18} /> },
    { step: "05", title: "Procurement & Scale", desc: "Successful pilots certified for national procurement", icon: <TrendingUp size={18} /> },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="gov-gradient text-white overflow-hidden relative">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-64 h-64 bg-blue-300 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-semibold text-blue-100">
                ðŸ‡®ðŸ‡³ Government of India Initiative
              </span>
              <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-semibold text-blue-100">
                DPIIT Â· Startup India
              </span>
            </div>
            <h1 className="font-heading font-bold text-4xl sm:text-5xl leading-tight text-white mb-4">
              GovSetu
              <span className="block text-blue-200 text-2xl sm:text-3xl font-semibold mt-1">
                AI-Enabled Governmentâ€“Startup Innovation Platform
              </span>
            </h1>
            <p className="text-blue-100 text-lg leading-relaxed mb-8 max-w-2xl">
              Bridging India's governance challenges with startup innovation through structured AI-driven
              procurement, sandbox pilots, and transparent evaluation under GFR Rule 161.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/government"
                className="btn-primary inline-flex items-center gap-2"
              >
                <Building2 size={16} />
                Government Portal
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/startup"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm border-2 border-white/40 text-white hover:bg-white/10 transition-colors"
              >
                <Rocket size={16} />
                Startup Hub
              </Link>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12">
            {[
              { label: "Active Challenges", value: activeChallengies, suffix: "" },
              { label: "Verified Startups", value: totalStartups, suffix: "+" },
              { label: "Completed Pilots", value: completedPilots, suffix: "" },
              { label: "Procurement Value", value: formatCurrency(procurementValue), suffix: "" },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 text-center">
                <div className="font-heading font-bold text-2xl text-white">{stat.value}{stat.suffix}</div>
                <div className="text-xs text-blue-200 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <h2 className="font-heading font-bold text-3xl text-gov-navy mb-2">Platform Portals</h2>
          <p className="text-gov-muted text-base max-w-xl mx-auto">
            Role-specific experiences for every stakeholder in the innovation procurement lifecycle.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f, i) => (
            <Link
              key={f.href}
              href={f.href}
              className={`block p-6 rounded-2xl border-2 hover:shadow-gov-lg hover:-translate-y-1 transition-all duration-200 animate-fade-in bg-white ${f.color}`}
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="p-3 rounded-xl bg-white inline-block shadow-sm mb-4">
                {f.icon}
              </div>
              <div className="text-xs font-semibold text-gov-muted uppercase tracking-wider mb-1">{f.badge}</div>
              <h3 className="font-heading font-bold text-gov-navy text-base mb-2">{f.title}</h3>
              <p className="text-sm text-gov-muted leading-relaxed mb-4">{f.description}</p>
              <span className="flex items-center gap-1 text-xs font-semibold text-gov-blue">
                Explore <ArrowRight size={12} />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Process Steps */}
      <section className="bg-white border-y border-gov-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-10">
            <h2 className="font-heading font-bold text-3xl text-gov-navy mb-2">How It Works</h2>
            <p className="text-gov-muted text-base">End-to-end innovation procurement in 5 transparent stages</p>
          </div>
          <div className="relative">
            <div className="hidden lg:block absolute top-8 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-gov-navy via-gov-blue to-gov-success" />
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-6">
              {processSteps.map((step, i) => (
                <div
                  key={step.step}
                  className="text-center relative animate-fade-in"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <div className="mx-auto w-16 h-16 rounded-full gov-gradient flex items-center justify-center mb-4 text-white shadow-gov-md relative z-10">
                    {step.icon}
                  </div>
                  <div className="text-xs font-bold text-gov-blue mb-1">STEP {step.step}</div>
                  <h3 className="font-heading font-bold text-gov-navy text-sm mb-1">{step.title}</h3>
                  <p className="text-xs text-gov-muted">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Live Stats */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-8">
          <h2 className="font-heading font-bold text-2xl text-gov-navy">Platform Metrics</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Active Challenges"
            value={activeChallengies}
            icon={<Building2 size={20} />}
            color="blue"
          />
          <StatCard
            label="Verified Startups"
            value={totalStartups}
            icon={<Rocket size={20} />}
            color="purple"
          />
          <StatCard
            label="Pilots Running"
            value={state.pilots.filter((p) => p.status === "active").length}
            icon={<Scale size={20} />}
            color="amber"
          />
          <StatCard
            label="Solutions Certified"
            value={state.procurements.length}
            icon={<CheckCircle2 size={20} />}
            color="green"
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gov-navy text-white py-8 mt-4">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center">
              <span className="font-heading font-bold">G</span>
            </div>
            <span className="font-heading font-bold">GovSetu Platform</span>
          </div>
          <p className="text-blue-300 text-xs">
            Â© 2024 Government of India Â· AI-Enabled Innovation Procurement Platform Â· Built under DPIIT Startup India Initiative
          </p>
          <p className="text-blue-400 text-xs mt-1">Compliant with GFR Rule 161, CERT-In Guidelines, DISHA Data Standards</p>
        </div>
      </footer>
    </div>
  );
}
