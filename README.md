# GovSetu Platform — README

## 🏛️ Getting Started

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

## 📌 Platform Portals

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

## 🎭 Role Switcher

Use the **role switcher** in the top-right navbar to switch between:
- 🏛️ **Government Officer** — Create challenges, approve payments
- 🚀 **Startup Founder** — Discover challenges, submit proposals
- ⚖️ **Evaluator** — Conduct blind evaluations
- 🛡️ **Admin** — Full access

---

## 🔑 Key Features to Demo

1. **Government Portal** → Create a new challenge (5-step AI-assisted builder)
2. **Startup Hub** → Check DPIIT eligibility, view AI match scores (91%), submit proposal
3. **Evaluator Portal** → Click "Evaluate" on any pending proposal, use sliders to score
4. **Pilot Tracker** → Click any active pilot card, then "Approve & Release Payment"
5. **Repository** → View HealthPredict's certified solution with Radar/Bar charts
6. **Changelog** → Real-time audit trail of all actions

---

## 🏗️ Architecture

- **Framework**: Next.js 14 (App Router) + TypeScript
- **State**: React Context + localStorage persistence
- **UI**: Tailwind CSS + Radix UI + Lucide Icons
- **Forms**: React Hook Form + Zod validation
- **Tables**: TanStack Table v8 (blind evaluation matrix)
- **Charts**: Recharts (KPI dashboards, pilot analytics)

---

*GovSetu · AI-Enabled Government–Startup Innovation Procurement Platform*
*Compliant with GFR Rule 161 · CERT-In · DISHA · RTI Act 2005*
