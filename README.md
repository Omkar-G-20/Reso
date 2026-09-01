# GovSetu Platform â€” README

## ðŸ›ï¸ Getting Started

### Prerequisites
- Node.js 18+ 
- npm 9+

### Quick Start

```bash
# 1. Navigate to the project directory
cd govsetu-platform

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

### Access the Platform
Open **http://localhost:3000** in your browser.

---

## ðŸ“Œ Platform Portals

| URL | Portal | Role |
|-----|--------|------|
| `/` | Landing Page | All |
| `/government` | Government Innovation Portal | Government Officers |
| `/startup` | Startup Discovery Hub | Startups |
| `/evaluator` | Evaluator & Scoring Portal | Evaluators |
| `/repository` | Innovation Repository | All |
| `/changelog` | Audit Log | All |

### REST API Endpoints
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/challenges` | GET, POST | Challenge CRUD |
| `/api/v1/startups` | GET | Startup listing |
| `/api/v1/evaluations` | GET, POST | Evaluation data |
| `/api/v1/pilots` | GET | Pilot tracking |
| `/api/v1/procurement` | GET | Procurement repository |

---

## ðŸŽ­ Role Switcher

Use the **role switcher** in the top-right navbar to switch between:
- ðŸ›ï¸ **Government Officer** â€” Create challenges, approve payments
- ðŸš€ **Startup Founder** â€” Discover challenges, submit proposals
- âš–ï¸ **Evaluator** â€” Conduct blind evaluations
- ðŸ›¡ï¸ **Admin** â€” Full access

---

## ðŸ”‘ Key Features to Demo

1. **Government Portal** â†’ Create a new challenge (5-step AI-assisted builder)
2. **Startup Hub** â†’ Check DPIIT eligibility, view AI match scores (91%), submit proposal
3. **Evaluator Portal** â†’ Click "Evaluate" on any pending proposal, use sliders to score
4. **Pilot Tracker** â†’ Click any active pilot card, then "Approve & Release Payment"
5. **Repository** â†’ View HealthPredict's certified solution with Radar/Bar charts
6. **Changelog** â†’ Real-time audit trail of all actions

---

## ðŸ—ï¸ Architecture

- **Framework**: Next.js 14 (App Router) + TypeScript
- **State**: React Context + localStorage persistence
- **UI**: Tailwind CSS + Radix UI + Lucide Icons
- **Forms**: React Hook Form + Zod validation
- **Tables**: TanStack Table v8 (blind evaluation matrix)
- **Charts**: Recharts (KPI dashboards, pilot analytics)

---

*GovSetu Â· AI-Enabled Governmentâ€“Startup Innovation Procurement Platform*
*Compliant with GFR Rule 161 Â· CERT-In Â· DISHA Â· RTI Act 2005*
