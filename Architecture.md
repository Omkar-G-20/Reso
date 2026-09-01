# GovSetu — Architecture Document

## System Architecture

```
┌─────────────────────────────────────────────────────┐
│                    CLIENT LAYER                      │
│  Next.js 14 App Router (React 18 + TypeScript)      │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────┐ │
│  │ Gov Port │ │Startup   │ │Evaluator │ │ Repo   │ │
│  │ /gov     │ │/startup  │ │/evaluator│ │/repos  │ │
│  └──────────┘ └──────────┘ └──────────┘ └────────┘ │
│                                                      │
│  ┌──────────────────────────────────────────────┐   │
│  │         React Context + localStorage Store   │   │
│  │  Challenges | Startups | Proposals |          │   │
│  │  Evaluations | Pilots | Procurement | Logs    │   │
│  └──────────────────────────────────────────────┘   │
└──────────────────────────┬──────────────────────────┘
                           │ HTTP/REST
┌──────────────────────────▼──────────────────────────┐
│                   API LAYER                          │
│  Next.js API Routes (/api/v1/*)                     │
│  GET/POST /challenges  GET/POST /evaluations        │
│  GET       /startups   GET       /pilots            │
│  GET       /procurement                             │
└─────────────────────────────────────────────────────┘
```

## Component Architecture

```
components/
├── navbar.tsx          # Role switcher + navigation
├── challenge-card.tsx  # Challenge listing + AI match score
├── pilot-tracker.tsx   # Milestone timeline + payment release
├── evaluation-modal.tsx # Blind scoring modal
├── challenge-builder.tsx # 5-step government form
├── dpiit-checker.tsx   # GFR eligibility verification
├── proposal-modal.tsx  # Startup proposal submission
├── repository-card.tsx # Certified solution card
└── ui/
    └── index.tsx       # Button, Badge, Card, Input, Modal, etc.
```

## State Management

```typescript
AppState {
  currentRole: UserRole        // Drives role-based UI
  challenges: Challenge[]      // Government challenges
  startups: Startup[]          // DPIIT-verified startups
  proposals: Proposal[]        // Submitted proposals
  evaluations: Evaluation[]    // Blind evaluation scores
  pilots: Pilot[]              // Active sandbox pilots
  procurements: ProcurementItem[] // Certified solutions
  changelog: ChangelogEntry[]  // Immutable audit trail
}
```

## Data Flow

```
Government Officer
    ↓ Creates Challenge (ChallengeBuilder)
    ↓ AI Assistant checks completeness
    ↓ Publishes to marketplace
    
Startup
    ↓ DPIIT Eligibility verified (DPIITChecker)
    ↓ AI match scores computed (domain overlap + TRL)
    ↓ Submits proposal (ProposalModal)
    
Evaluator
    ↓ Sees anonymized proposals (TanStack Table)
    ↓ Scores on 3 dimensions (EvaluationModal sliders)
    ↓ Score ≥ 80 → auto-qualifies for Sandbox
    
Government Officer
    ↓ Monitors pilot milestones (PilotTracker)
    ↓ Clicks "Approve & Release Payment"
    ↓ Tranche disbursed + Changelog updated
    
System
    ↓ Pilot completes → Solution certified
    ↓ Added to Innovation Repository
    ↓ Available for cross-department procurement
```

## Design Patterns

| Pattern | Usage |
|---------|-------|
| Context + Reducer | Global state management |
| localStorage | State persistence across sessions |
| Optimistic Updates | Immediate UI feedback on actions |
| Compound Components | Card, CardHeader, CardBody, CardFooter |
| Render Props | Table cells in TanStack Table |
| Controlled Components | All form inputs via React Hook Form |

---

*GovSetu Architecture v1.0 · September 2024*
