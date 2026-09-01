# GovSetu Platform â€” Changelog

> **IMMUTABLE AUDIT LOG** â€” This file documents all architectural decisions, design system implementations, and platform events.

---

## [v1.0.0] â€” 2024-09-01 â€” Initial Platform Architecture

### System Initialization
- **PLATFORM_INITIALIZED**: GovSetu v1.0.0 scaffolded using Next.js 14 (App Router) + TypeScript
- **DESIGN_SYSTEM_IMPLEMENTED**: Government Design System tokens configured
  - Primary: Deep Navy Blue `#1E3A8A` + Royal Blue `#2563EB`
  - Background: Off-White/Light Gray `#F3F4F6`
  - Success: Emerald Green `#10B981`
  - Warning: Amber/Orange `#F59E0B`
  - Text: Dark Charcoal `#1F2937`
- **FONTS_CONFIGURED**: Poppins (headings) + Inter (body) loaded via Google Fonts
- **TECH_STACK_LOCKED**: Next.js 14 Â· React 18 Â· TypeScript 5 Â· Tailwind CSS 3 Â· Radix UI Â· Lucide React Â· React Hook Form + Zod Â· TanStack Table v8 Â· Recharts

### Architecture Decisions
- **STORE_DESIGN**: localStorage-backed React Context chosen over Redux for simplicity; supports full offline state persistence
- **MOCK_API**: Next.js API routes at `/api/v1/*` provide REST endpoints; in-memory store used client-side
- **ROUTING**: Next.js App Router with file-based routes for each portal
- **AUTH_SIMULATION**: Role-based access simulated via global role switcher in Navbar

---

## [v1.0.0] â€” 2024-09-01 â€” Feature Implementation

### Government Portal
- **CHALLENGE_BUILDER_CREATED**: 5-step multi-form with AI-assisted requirement checking
- **AI_ASSISTANT_IMPLEMENTED**: Real-time simulated AI checks for KPI measurability, budget alignment, compliance keywords
- **PILOT_TRACKER_BUILT**: Milestone timeline with payment release functionality
- **PAYMENT_FLOW**: "Approve & Release Payment" updates milestone status â†’ triggers changelog entry â†’ persists to localStorage

### Startup Portal
- **DPIIT_CHECKER_IMPLEMENTED**: Automated 4-step verification simulation for GFR Rule 161 waivers
- **AI_MATCHING_BUILT**: Domain overlap + TRL-based match score calculation (0â€“99%)
- **PROPOSAL_MODAL_CREATED**: TRL radio selector + methodology + cost estimation form
- **MATCH_FACTORS_DISPLAY**: Semantic Similarity / Domain Compatibility / Readiness Level breakdown

### Evaluator Portal
- **BLIND_EVALUATION_IMPLEMENTED**: Identity anonymization (Applicant A-001 format)
- **TANSTACK_TABLE_INTEGRATED**: Sortable, filterable proposals table
- **SCORING_MATRIX_BUILT**: Slider-based scoring for 3 weighted criteria (40+30+30=100)
- **THRESHOLD_AUTOMATION**: Score â‰¥ 80 â†’ auto-qualifies for Sandbox Pilot Design
- **EVALUATION_HISTORY**: Completed evaluations displayed with score breakdown

### Innovation Repository
- **REPOSITORY_BUILT**: Grid of procurement-ready certified solutions
- **RECHARTS_INTEGRATED**: Bar chart (pilot progress) + Radar chart (performance metrics)
- **DETAIL_MODAL**: Full solution details with replication potential

### Audit Changelog
- **CHANGELOG_PAGE_BUILT**: Timeline view with entity/role/action filters
- **IMMUTABILITY_NOTICE**: RTI compliance disclaimer displayed

---

## Seed Data Loaded

| Entity | Count | Details |
|--------|-------|---------|
| Challenges | 5 | Across 5 ministries, various statuses |
| Startups | 5 | DPIIT-verified, various domains |
| Proposals | 4 | Submitted, evaluated, approved |
| Evaluations | 3 | Scores: 88, 84, 80 (all qualified) |
| Pilots | 2 | Active with milestone payment history |
| Procurement | 1 | HealthPredict Analytics â€” â‚¹8.5 Cr |
| Changelog | 9 | Historical audit entries |

---

## Interactive Session Events (Auto-Appended)

> Note: Live platform actions (challenge publications, payment releases, evaluations) are appended to the in-memory changelog and displayed at `/changelog`. This file captures architectural decisions; runtime events are stored in localStorage.

---

*GovSetu Platform Â· Government of India Initiative Â· DPIIT Â· Startup India*
*Compliance: GFR Rule 161 Â· CERT-In Guidelines Â· DISHA Data Standards Â· RTI Act 2005*
