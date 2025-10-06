# API Contracts (Frontend View)

## GrantPilot: Generate Proposal
- POST /copilot/generate
- Request (zod): { opportunityId: string; promptVersion: string; profile: ProfileInput }
- Response (zod): 
  { type: "success", proposal: ProposalDoc, sources: Source[], promptVersion: string }
  | { type: "needs_review", issues: string[], draft: Partial<ProposalDoc> }
  | { type: "error", code: string, message: string }

## ReqAgent: Funding Detail
- GET /reqagent/opportunities/:id
- Response: FundingOpportunity (strict)

> Keep schemas in `features/*/schemas`. Update here first, then code.


