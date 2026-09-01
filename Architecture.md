# GovSetu â€” Architecture Document

## System Architecture

```
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚                    CLIENT LAYER                      â”‚
â”‚  Next.js 14 App Router (React 18 + TypeScript)      â”‚
â”‚  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â” â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â” â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â” â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â” â”‚
â”‚  â”‚ Gov Port â”‚ â”‚Startup   â”‚ â”‚Evaluator â”‚ â”‚ Repo   â”‚ â”‚
â”‚  â”‚ /gov     â”‚ â”‚/startup  â”‚ â”‚/evaluatorâ”‚ â”‚/repos  â”‚ â”‚
â”‚  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜ â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜ â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜ â””â”€â”€â”€â”€â”€â”€â”€â”€â”˜ â”‚
â”‚                                                      â”‚
â”‚  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”   â”‚
â”‚  â”‚         React Context + localStorage Store   â”‚   â”‚
â”‚  â”‚  Challenges | Startups | Proposals |          â”‚   â”‚
â”‚  â”‚  Evaluations | Pilots | Procurement | Logs    â”‚   â”‚
â”‚  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜   â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                           â”‚ HTTP/REST
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â–¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚                   API LAYER                          â”‚
â”‚  Next.js API Routes (/api/v1/*)                     â”‚
â”‚  GET/POST /challenges  GET/POST /evaluations        â”‚
â”‚  GET       /startups   GET       /pilots            â”‚
â”‚  GET       /procurement                             â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

## Component Architecture

```
components/
â”œâ”€â”€ navbar.tsx          # Role switcher + navigation
â”œâ”€â”€ challenge-card.tsx  # Challenge listing + AI match score
â”œâ”€â”€ pilot-tracker.tsx   # Milestone timeline + payment release
â”œâ”€â”€ evaluation-modal.tsx # Blind scoring modal
â”œâ”€â”€ challenge-builder.tsx # 5-step government form
â”œâ”€â”€ dpiit-checker.tsx   # GFR eligibility verification
â”œâ”€â”€ proposal-modal.tsx  # Startup proposal submission
â”œâ”€â”€ repository-card.tsx # Certified solution card
â””â”€â”€ ui/
    â””â”€â”€ index.tsx       # Button, Badge, Card, Input, Modal, etc.
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
    â†“ Creates Challenge (ChallengeBuilder)
    â†“ AI Assistant checks completeness
    â†“ Publishes to marketplace
    
Startup
    â†“ DPIIT Eligibility verified (DPIITChecker)
    â†“ AI match scores computed (domain overlap + TRL)
    â†“ Submits proposal (ProposalModal)
    
Evaluator
    â†“ Sees anonymized proposals (TanStack Table)
    â†“ Scores on 3 dimensions (EvaluationModal sliders)
    â†“ Score â‰¥ 80 â†’ auto-qualifies for Sandbox
    
Government Officer
    â†“ Monitors pilot milestones (PilotTracker)
    â†“ Clicks "Approve & Release Payment"
    â†“ Tranche disbursed + Changelog updated
    
System
    â†“ Pilot completes â†’ Solution certified
    â†“ Added to Innovation Repository
    â†“ Available for cross-department procurement
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

*GovSetu Architecture v1.0 Â· September 2024*
