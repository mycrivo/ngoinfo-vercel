# ADR Log

## ADR-001: Server-first Architecture
We default to Server Components to reduce JS shipped to the client and improve security.

## ADR-002: Zod Validation
All inbound/outbound data is validated with zod to minimize hallucinations and runtime shape drift.

## ADR-003: Feature-First Layout
Features co-locate UI + services + schemas for easier iteration and debugging.

## ADR-004: App Shell & Security Headers (Bootstrap)

**Date:** 2025-10-06  
**Status:** Accepted  
**Context:** Initial bootstrap of application shell, base routes, and security posture.

### Motivation
We need a foundational application structure that:
1. Provides consistent navigation and layout across all pages
2. Implements security best practices from day one
3. Supports future auth integration without breaking changes
4. Delivers accessible, mobile-first user experiences

### Decisions

#### App Shell Structure
- **Root Layout** (`app/layout.tsx`): Global HTML shell with Header, Footer, and responsive container
- **Header Component**: Primary navigation with mobile-responsive menu (Home, Dashboard, Login links)
- **Footer Component**: Copyright, legal links, and health status link
- **Container Strategy**: `max-w-*` constraints per page; mobile-first responsive spacing (px-4, py-6, md:py-8)

#### Base Routes (Server Components)
All routes are Server Components by default (RSC):
- `/` - Landing page with feature overview and CTA
- `/login` - Authentication stub (disabled form, no logic)
- `/dashboard` - Protected area placeholder with metric cards
- `/health` - Static "OK" status page (force-static export)

#### Error Surfaces
- **404 (not-found.tsx)**: Custom page with navigation back to Home/Dashboard
- **500 (error.tsx)**: Client Component with error boundary, Support ID generation via `lib/telemetry`, and reset action

#### Security Headers (next.config.ts)
Applied to all routes via `/:path*` pattern:

| Header | Value | Rationale |
|--------|-------|-----------|
| **Content-Security-Policy** | `default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; ...` | Defense-in-depth against XSS. `unsafe-eval` required for Next.js dev mode; `unsafe-inline` for Next.js runtime styles. Will tighten in production with nonces. |
| **Strict-Transport-Security** | `max-age=63072000; includeSubDomains; preload` | Force HTTPS for 2 years; protect all subdomains. |
| **X-Content-Type-Options** | `nosniff` | Prevent MIME-sniffing attacks. |
| **X-Frame-Options** | `DENY` | Prevent clickjacking; redundant with CSP `frame-ancestors` but adds legacy browser support. |
| **Referrer-Policy** | `strict-origin-when-cross-origin` | Limit referrer leakage while preserving analytics on same-origin. |
| **Permissions-Policy** | `geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), gyroscope=()` | Deny unnecessary browser APIs to reduce attack surface. |

### Trade-offs

**Pros:**
- Security headers enforced from first deployment
- Consistent UX across all pages
- Server Components minimize client JS bundle
- Accessible navigation with semantic HTML
- Error handling with user-friendly messages + internal tracking

**Cons:**
- CSP `unsafe-inline` and `unsafe-eval` are not ideal but required for Next.js 15 dev experience
- HSTS `preload` requires commitment to HTTPS (acceptable for this project)
- Placeholder UI may require refactoring when branding is finalized (Cluster 2A)

### Testing Approach
**Manual verification:**
1. Navigate between all routes (/, /login, /dashboard, /health) - verify layout consistency
2. Visit `/definitely-not-here` - confirm custom 404 renders
3. Temporarily throw error in a page - confirm custom 500 with Support ID
4. Inspect headers in DevTools Network tab - verify all 6 security headers present
5. Test mobile responsive behavior (Header nav collapses, Footer stacks)

**Automated (future):**
- Playwright E2E: navigation flows
- Lighthouse CI: accessibility + security headers audit

### Alternatives Considered
- **Middleware for headers**: Next.js recommends `next.config.ts` for static headers; middleware reserved for dynamic logic (auth, rate limiting)
- **Stricter CSP**: Nonce-based CSP is ideal but requires SSR integration; deferred to production hardening phase
- **Separate error layouts**: Keeping errors minimal; will add custom layouts if needed per feature

### Migration Path
When auth is implemented:
1. Update `/login` page with real form + server action
2. Add auth middleware to protect `/dashboard`
3. Update Header to show user avatar + logout button
4. Remove placeholder content from dashboard

### References
- [Next.js Security Headers](https://nextjs.org/docs/app/api-reference/next-config-js/headers)
- [OWASP Secure Headers Project](https://owasp.org/www-project-secure-headers/)
- [MDN CSP Guide](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)

## ADR-005: Environment Matrix & Secrets Ownership

**Date:** 2025-10-06  
**Status:** Accepted  
**Context:** Define environment variable strategy for Vercel (frontend) and Railway (backend) deployments.

### Motivation
We need a systematic approach to:
1. Manage secrets and configuration across dev/staging/prod environments
2. Validate required variables at runtime to prevent deployment failures
3. Establish clear ownership and rotation policies for sensitive credentials
4. Enable feature flags for gradual rollouts and A/B testing
5. Prevent accidental exposure of server-only secrets to the browser

### Environment Matrix

We deploy across three environments with corresponding Vercel and Railway services:

| Environment | Vercel Project | Railway Service | Purpose |
|-------------|----------------|-----------------|---------|
| **Development** | `ngoinfo-web-dev` | `reqagent-dev` | Feature branches, local dev |
| **Staging** | `ngoinfo-web-staging` | `reqagent-staging` | QA, integration tests, previews |
| **Production** | `ngoinfo-web-prod` | `reqagent-prod` | Live user traffic |

### Variable Ownership & Rotation

| Variable | Scope | Required | Owner | Rotation | Notes |
|----------|-------|----------|-------|----------|-------|
| **API Configuration** |
| `NEXT_PUBLIC_API_BASE_URL` | client | Yes | Frontend | Per deployment | Points to Railway backend |
| `NEXT_PUBLIC_API_TIMEOUT_MS` | client | No | Frontend | As needed | Default: 15000ms |
| `NEXT_PUBLIC_SITE_URL` | client | Yes | Frontend | Per deployment | Canonical site URL |
| **Authentication (Future)** |
| `AUTH_SECRET` | server | Yes* | Backend | Quarterly | Min 32 chars, NextAuth session encryption |
| `NEXTAUTH_URL` | server | Yes* | Frontend | Per deployment | Auth callback URL |
| `OAUTH_CLIENT_ID` | server | Yes* | Backend | Quarterly | OAuth provider credentials |
| `OAUTH_CLIENT_SECRET` | server | Yes* | Backend | Quarterly | Never expose to client |
| **Observability** |
| `SENTRY_DSN` | server | No | Infrastructure | Annual | Error tracking endpoint |
| `SENTRY_ENVIRONMENT` | server | No | Infrastructure | Per deployment | dev/staging/prod |
| `NEXT_PUBLIC_VERCEL_ANALYTICS_ID` | client | No | Infrastructure | Auto-injected | Vercel Analytics (prod only) |
| **Feature Flags** |
| `USE_MSW` | server | No | Frontend | As needed | Enable Mock Service Worker (dev only) |
| `ENABLE_BRANDING_PREVIEW` | server | No | Frontend | As needed | Preview design system changes |
| `DEBUG_ENABLED` | server | No | Frontend | As needed | Verbose logging (non-prod) |
| `TELEMETRY_ENABLED` | server | No | Infrastructure | As needed | Opt-out flag, default: true |
| **Backend-Only (Not Used by Frontend)** |
| `OPENAI_API_KEY` | server | Yes | Backend | Quarterly | Used only in Railway Copilot service |
| `WP_REST_API_URL` | server | No | Backend | As needed | WordPress integration endpoint |
| `WP_API_TOKEN` | server | No | Backend | Monthly | WordPress API authentication |

_* Required when auth is implemented_

### Decisions

#### 1. Runtime Validation with Zod (`lib/env.ts`)
- All environment variables validated at module load using Zod schemas
- Missing critical variables throw errors in dev, log warnings in prod
- Typed config object exported for IDE autocomplete and type safety
- Client vs. server variables separated to prevent accidental exposure

#### 2. Feature Flags System (`lib/flags.ts`)
- Centralized boolean flags derived from environment variables
- Per-environment overrides via Vercel environment settings
- Flags logged on server startup in development mode
- Helper functions: `isFlagEnabled()`, `getEnabledFlags()`

#### 3. `.env.example` as Source of Truth
- Comprehensive documentation with inline comments
- Grouped by domain (API, Auth, Observability, Flags, External Services)
- No real secrets—only placeholders and examples
- Committed to version control; `.env.local` gitignored

#### 4. Secret Scope Enforcement
- `NEXT_PUBLIC_*` variables are exposed to browser (use sparingly)
- Server-only variables accessed only in Server Components, API routes, middleware
- Build-time validation prevents client access to server secrets

### Implementation Details

**Validation Flow:**
1. `lib/env.ts` imports at module load
2. Zod schemas parse `process.env`
3. In dev: throw on missing required vars with descriptive error
4. In prod: log warning, use defaults where possible
5. Export typed `env` object for consumption

**Flag Evaluation:**
1. `lib/flags.ts` reads from `env` object
2. Compute boolean flags based on string values
3. Log enabled flags in dev mode
4. Export typed `flags` object

**Local Development:**
1. Copy `.env.example` → `.env.local`
2. Fill in required variables (API URLs, feature flags)
3. Run `npm run dev` — validation errors shown immediately
4. Override per-developer with local `.env.local` changes

### Trade-offs

**Pros:**
- Type-safe environment access with IDE autocomplete
- Early failure on misconfiguration (fail fast in dev)
- Clear ownership and rotation schedule reduces security risk
- Feature flags enable gradual rollouts without code changes
- Centralized flag logic simplifies A/B testing

**Cons:**
- Additional Zod validation overhead at startup (negligible, <10ms)
- Developers must manually sync `.env.local` with `.env.example` updates
- No automatic secret rotation (manual process documented in RUNBOOKS)
- Feature flag state not persisted (requires env var changes + redeploy)

### Testing Approach

**Local Validation:**
1. Delete a required var from `.env.local`
2. Run `npm run dev` → expect error: "Missing NEXT_PUBLIC_API_BASE_URL"
3. Add dummy value → app boots successfully
4. Check console → flags logged: `USE_MSW: false, DEBUG_ENABLED: false, ...`

**Staging Verification:**
1. Deploy to staging with missing `SENTRY_DSN` (optional) → warning logged, continues
2. Deploy with invalid `NEXT_PUBLIC_API_BASE_URL` (non-URL) → build fails with Zod error
3. Enable `ENABLE_BRANDING_PREVIEW=true` → feature renders correctly

**Production Hardening:**
1. All required variables set via Vercel environment settings
2. Sensitive vars (AUTH_SECRET, OAUTH_CLIENT_SECRET) marked as "Sensitive" in Vercel UI
3. Rotation calendar triggers quarterly reviews for credentials

### Alternatives Considered

**Option A: No Runtime Validation (Just `process.env`)**
- Rejected: Silent failures in production when vars are missing
- No type safety, prone to typos (`process.env.NEXT_PUBIC_API_URL`)

**Option B: Third-party Config Library (envalid, t3-env)**
- Rejected: Adds dependency for minimal benefit; Zod already in use
- Custom implementation gives full control and consistency with API schemas

**Option C: Feature Flags via Database/Edge Config**
- Deferred: Requires backend integration and adds latency
- Current env-based approach sufficient for V1; revisit for dynamic flags in V2

### Secrets Rotation Policy

| Credential Type | Frequency | Process | Owner |
|-----------------|-----------|---------|-------|
| API Keys (OpenAI, third-party) | Quarterly | Generate new key → update Railway env → verify staging → update prod | Backend team |
| OAuth Secrets | Quarterly | Rotate in provider dashboard → update Vercel env → redeploy | Backend team |
| Auth Session Secret | Quarterly | Generate 32-char string → update Vercel env → rolling restart | Frontend team |
| Database Credentials | Annual | Coordinated with infra team, zero-downtime rotation | Infrastructure team |
| Vercel/Railway Tokens | Annual | Regenerate in platform settings → update CI/CD | Infrastructure team |

**Emergency Rotation (Compromise):**
1. Revoke compromised credential immediately in source (OAuth provider, API dashboard)
2. Generate new credential
3. Update staging env → verify
4. Update prod env → redeploy with zero downtime
5. Post-incident review within 48 hours

### Migration Path

**Phase 1 (Current - V1):**
- ✅ `.env.example` with all variables documented
- ✅ `lib/env.ts` runtime validation
- ✅ `lib/flags.ts` feature flag system
- ✅ RUNBOOKS updated with "How to add env var"

**Phase 2 (V2 - Auth Integration):**
- Uncomment auth variables in `.env.example`
- Add `AUTH_SECRET` to Vercel production environment
- Update `lib/env.ts` to require auth vars when `NODE_ENV === 'production'`
- Document auth credential rotation in RUNBOOKS

**Phase 3 (V3 - Dynamic Flags):**
- Evaluate Vercel Edge Config for runtime feature flags
- Migrate static flags to dynamic toggles via admin UI
- Maintain env-based flags as fallback/defaults

### Debugging Checklist

**"Missing environment variable" error:**
1. Check `.env.local` exists and has the variable
2. Restart dev server (env changes require restart)
3. Verify variable name matches `.env.example` exactly (case-sensitive)
4. For `NEXT_PUBLIC_*` vars, ensure no typos in client code

**"Invalid environment variable" error:**
1. Check Zod schema in `lib/env.ts` for expected type (URL, number, etc.)
2. Verify value format (e.g., URLs must include protocol: `https://`)
3. For booleans, use string `"true"` or `"false"` (not bare boolean)

**Feature flag not working:**
1. Check flag is enabled in `.env.local`: `USE_MSW=true`
2. Restart server (flags computed at module load)
3. Verify flag is accessed server-side (not in Client Component)
4. Check console for `[flags] Feature flags initialized` log

### References
- [Next.js Environment Variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)
- [Zod Documentation](https://zod.dev/)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Railway Environment Variables](https://docs.railway.app/develop/variables)
- [OWASP Secrets Management](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)

## ADR-006: Auth UX, Error Boundaries, and Telemetry Framework

**Date:** 2025-10-06  
**Status:** Accepted  
**Context:** Establish auth UX scaffolding, error handling, and telemetry infrastructure before backend integration.

### Motivation
We need to:
1. Create a consistent, branded login/logout experience
2. Handle runtime errors gracefully with user-friendly fallbacks
3. Establish structured telemetry for monitoring UI events and errors
4. Maintain mock-based flows until real auth integration in V11

### Decisions

#### 1. Mock Authentication (features/auth/)

**Login Flow:**
- Branded form using Card, Input, Button primitives from UI kit
- Mock session stored in localStorage (`gp_session=true`)
- 20% simulated failure rate for testing error states
- Validation: Empty field checks with inline Banner errors
- Success: 1-second delay → redirect to /dashboard

**Logout Flow:**
- Confirmation screen with branded Card
- Clears localStorage session
- Redirects to home page

**Mock Session Hook (`useMockSession.ts`):**
```typescript
- login(email, password) → simulates API delay + random failure
- logout() → clears session
- session state → { isAuthenticated, email }
```

**Future Integration (V11):**
- Replace localStorage with NextAuth/Clerk session
- Connect to Railway backend auth endpoints
- Add JWT token management
- Implement refresh token flow

#### 2. Error Boundaries

**Global Error Boundary:**
- Wraps entire app shell in `app/layout.tsx`
- Full-page fallback for catastrophic errors
- Branded UI: Card with error icon, message, "Try Again" and "Go Home" buttons
- Development mode: Shows error details
- Logs to telemetry with `track("error:boundary_caught")`

**Inline Error Boundary:**
- Component-level error catching
- Renders Card with error border (2px red)
- Shows "Component Error" message with "Retry" button
- Used for isolated component failures

**Error Tracking:**
- All errors captured and sent to `track()` function
- Includes error message, stack trace, component stack
- Support ID generation for user-facing errors

#### 3. Telemetry Layer (`lib/telemetry.ts`)

**`track(eventName, payload)` Function:**
- Structured event logging with category:action naming
- Event categories: `auth:*`, `error:*`, `nav:*`, `ui:*`
- Respects `TELEMETRY_ENABLED` flag (localStorage + env)
- Session ID tracking via sessionStorage
- Stores last 50 events in localStorage (dev only)

**Event Examples:**
```typescript
track("auth:login_attempt", { email })
track("auth:login_success", { email })
track("auth:logout", {})
track("error:boundary_caught", { error, stack })
track("ui:banner_dismissed", { variant })
```

**Implementation:**
- Console logging in development
- Placeholder for network endpoint in production
- Guards: Disabled if `TELEMETRY_ENABLED=false`
- Debug helpers: `getTelemetryEvents()`, `clearTelemetryEvents()`

**Future Integration:**
- Forward events to Datadog/Sentry/internal collector
- Add user context (when authenticated)
- Performance metrics (Web Vitals)
- Error correlation with backend logs

### Trade-offs

**Pros:**
- Branded, consistent auth UX ready for real auth drop-in
- Graceful error handling improves user experience
- Structured telemetry foundation for observability
- Mock flows allow frontend iteration without backend
- All UI uses semantic tokens (no hardcoded values)

**Cons:**
- Mock auth doesn't reflect real security constraints
- localStorage session not secure (will fix in V11)
- Telemetry limited to console logs (no backend yet)
- Error boundaries don't catch server-side errors (Next.js error.tsx needed)

### Implementation Details

**File Structure:**
```
features/auth/
  ├── LoginForm.tsx          # Branded login UI
  ├── Logout.tsx             # Logout confirmation
  └── hooks/
      └── useMockSession.ts  # Mock session management

components/
  └── ErrorBoundary.tsx      # Global + inline boundaries

lib/
  └── telemetry.ts           # Extended with track()

app/
  ├── login/page.tsx         # Login route
  └── logout/page.tsx        # Logout route
```

**Error Boundary Integration:**
```typescript
// app/layout.tsx
<ErrorBoundary fallback="global">
  <RouteChangeTelemetry />
  <Header />
  <main>{children}</main>
  <Footer />
</ErrorBoundary>
```

**Telemetry Integration:**
```typescript
// LoginForm.tsx
track("auth:login_attempt", { email });
// ... on success
track("auth:login_success", { email });

// ErrorBoundary.tsx
track("error:boundary_caught", {
  error: error.message,
  stack: error.stack,
  componentStack: errorInfo.componentStack
});
```

### Testing Approach

**Login Flow:**
1. Navigate to /login → see branded form
2. Submit empty fields → inline Banner error
3. Submit valid credentials → 80% success → redirect to /dashboard
4. 20% failure → Banner error displayed
5. Check console for telemetry logs

**Logout Flow:**
1. Navigate to /logout → see confirmation
2. Click "Sign Out" → session cleared → redirect to /
3. Check localStorage (gp_session removed)

**Error Boundaries:**
1. Throw error in component → Global boundary catches → fallback renders
2. Inline boundary (future) → component error → card fallback
3. Console shows `track("error:boundary_caught")` log

**Telemetry:**
1. Check console for `[track]` logs
2. localStorage: `telemetry_enabled=false` → no logs
3. Dev tools: `getTelemetryEvents()` → array of events
4. Session ID persists across page loads (sessionStorage)

### Alternatives Considered

**Option A: Real Auth from Start**
- Rejected: Backend not ready; would block frontend progress
- Mock flows allow parallel development

**Option B: No Error Boundaries**
- Rejected: Poor UX when errors occur
- Error boundaries provide graceful degradation

**Option C: Third-party Telemetry (Analytics.js, Segment)**
- Deferred: Adds external dependency and cost
- Custom implementation gives full control; integrate later

**Option D: Zustand/Redux for Session**
- Rejected: Overkill for simple mock session
- Hook-based approach sufficient; real auth will use provider

### Migration Path

**Phase 1 (Current - V3):**
- ✅ Mock auth with localStorage
- ✅ Error boundaries with telemetry
- ✅ Structured event tracking (console)

**Phase 2 (V11 - Real Auth):**
- Replace `useMockSession` with NextAuth provider
- Add protected route middleware (check real session)
- JWT token storage (httpOnly cookies)
- Backend auth endpoint integration

**Phase 3 (Future - Observability):**
- Forward telemetry to monitoring service
- Error correlation with backend logs
- Performance monitoring (Web Vitals)
- User session replay (optional)

### Security Considerations

**Current (Mock):**
- ⚠️ localStorage session is NOT secure
- ⚠️ No actual authentication/authorization
- ⚠️ Anyone can set `gp_session=true`
- ✅ No sensitive data stored
- ✅ UI-only validation

**Future (Real Auth):**
- ✅ HttpOnly, Secure cookies
- ✅ CSRF protection
- ✅ Session expiry and refresh
- ✅ Backend token validation
- ✅ Rate limiting on auth endpoints

### References
- [React Error Boundaries](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)
- [Next.js Error Handling](https://nextjs.org/docs/app/building-your-application/routing/error-handling)
- [Web Analytics Best Practices](https://web.dev/vitals/)
- [NextAuth.js](https://next-auth.js.org/) (for future integration)

## ADR-007: Monetisation Shell & Trial Framework

**Date:** 2025-10-06  
**Status:** Accepted  
**Context:** Establish pricing tiers, trial logic, and Stripe integration foundation before live billing.

### Motivation
We need to:
1. Define clear pricing tiers aligned with NGO market segments
2. Offer a risk-free trial experience (no credit card required)
3. Track proposal quotas and enforce limits
4. Prepare Stripe integration infrastructure for Live Billing cluster
5. Build dashboard UI that communicates plan value and drives upgrades

### Decisions

#### 1. Pricing Tiers (lib/plans.ts)

**Three Plans:**

| Plan | Price | Proposals/Mo | Manual Review | Target |
|------|-------|--------------|---------------|--------|
| **Starter** | $19 | 2 | ❌ | Small NGOs, getting started |
| **Growth** | $39 | 5 | ✅ | Growing orgs, scaling impact (Featured) |
| **Impact+** | $79 | 7 | ✅ | Enterprise, maximum success |

**Plan Configuration:**
```typescript
interface Plan {
  id: 'starter' | 'growth' | 'impact_plus';
  name: string;
  price: number; // USD per month
  proposals_per_month: number;
  manual_review_included: boolean;
  trial_days: 2;
  trial_proposals: 1;
  stripe_price_id: string; // placeholder for now
  tagline: string;
  is_featured?: boolean;
  features: string[];
}
```

**Rationale:**
- **Starter ($19):** Entry-level for budget-conscious NGOs
- **Growth ($39):** Sweet spot with expert review; marked "Most Popular"
- **Impact+ ($79):** Premium for organizations needing max proposals + white-glove service
- All plans include 2-day trial with 1 free proposal
- Manual review differentiator for higher tiers drives perceived value

#### 2. Trial Logic (lib/quota.ts)

**2-Day Free Trial:**
- **Duration:** 48 hours from activation
- **Quota:** 1 proposal generation
- **No Credit Card:** Frictionless signup
- **Countdown:** Displayed in dashboard (hours remaining)
- **Storage:** localStorage (will migrate to backend in Live Billing)

**Quota Tracking:**
```typescript
interface TrialStatus {
  active: boolean;
  started_at: string | null;
  expires_at: string | null;
  hours_remaining: number;
  proposals_used: number;
  proposals_limit: number;
}

interface QuotaStatus {
  plan_id: PlanId | null;
  proposals_used: number;
  proposals_limit: number;
  quota_remaining: number;
  is_trial: boolean;
  can_generate: boolean;
}
```

**Functions:**
- `startTrial()` → Activates trial, sets expiry
- `getTrialStatus()` → Returns current trial state
- `getQuotaStatus()` → Returns proposal quota
- `consumeProposal()` → Decrements quota, enforces limits
- `upgradePlan(planId)` → Mock upgrade (clears trial, sets plan)
- `simulateTrialExpiry()` → Testing helper

**Enforcement:**
- Trial expires automatically after 48 hours
- Quota prevents generation when `proposals_used >= proposals_limit`
- Dashboard shows upgrade CTAs when quota exhausted or trial expired

#### 3. Pricing Page (/pricing)

**Branded UI:**
- 3-column grid (mobile stacks)
- Featured badge on Growth plan
- Card elevation: Growth `lg`, others `md`
- Primary border (2px) on featured plan
- Check icons (✓) for feature lists
- Manual review badge for Growth/Impact+

**Trial CTA:**
- Button: "Start 2-Day Free Trial"
- onClick → `startTrial()` → redirect to /dashboard
- No payment collection at this stage

**Information:**
- Trial details card explaining process
- FAQ footer with support email
- Note: "Download after upgrade" (view-only during trial)

#### 4. Dashboard Shell (app/dashboard/page.tsx)

**Trial/Plan Banner:**
- **Active Trial:** Info banner with countdown, quota, "Upgrade Now" button
- **Quota Exceeded:** Warning banner, "Upgrade Plan" CTA
- **Trial Expired:** Error banner, "View Plans" CTA

**Plan Badge:**
- Top-right corner
- Shows current plan name + "(Trial)" if active
- Star icon + primary border

**Quota Progress:**
- Card with visual progress bar
- Color-coded: 
  - < 80%: Primary blue
  - 80-100%: Warning yellow
  - 100%: Error red
- Shows "X / Y used" and "Z remaining"

**Quick Actions Sidebar:**
- GrantPilot (disabled, "Coming Soon")
- Profile (disabled)
- Settings (disabled)
- **Manage Plan** → Active, links to /pricing

**Stats Grid:**
- Active Proposals: Placeholder (0)
- Funding Opportunities: "Coming in V5"
- Success Rate: Placeholder

#### 5. Stripe Integration (lib/stripe.ts)

**Placeholder Functions:**
```typescript
checkout(planId) → Creates checkout session (mock)
manageBilling() → Opens customer portal (mock)
getSubscriptionStatus() → Returns subscription state (mock)
handleCheckoutSuccess(sessionId) → Webhook handler (mock)
handleSubscriptionCanceled(subscriptionId) → Webhook handler (mock)
```

**Environment Variables (lib/env.ts):**
```bash
# Client-side (safe to expose)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_placeholder

# Server-side (NEVER expose)
STRIPE_SECRET_KEY=sk_test_placeholder
STRIPE_WEBHOOK_SECRET=whsec_placeholder
```

**Current Behavior:**
- All functions log to console
- Return error: "Not yet implemented"
- Track telemetry events (`monetisation:checkout_initiated`, etc.)
- No actual Stripe API calls

**Future Integration (Live Billing):**
1. Create Stripe account, get real keys
2. Implement `/api/stripe/create-checkout-session` endpoint
3. Load Stripe.js client library
4. Handle webhooks: `checkout.session.completed`, `customer.subscription.*`
5. Update database with subscription status
6. Send confirmation emails

### Trade-offs

**Pros:**
- Frictionless trial experience (no payment upfront)
- Clear value ladder across 3 tiers
- Mock quota enforcement tests UX before backend
- Stripe placeholders allow frontend iteration
- Dashboard clearly communicates plan value + upgrade path

**Cons:**
- localStorage quota not secure (easily bypassed in dev tools)
- Trial/quota not synced with backend (will fix in Live Billing)
- No actual payment collection yet
- Quota resets don't follow calendar month (placeholder logic)

### Implementation Details

**File Structure:**
```
lib/
  ├── plans.ts          # Plan configuration
  ├── quota.ts          # Trial & quota logic
  └── stripe.ts         # Placeholder integration

app/
  ├── pricing/page.tsx  # Pricing page
  └── dashboard/page.tsx # Dashboard with quota UI
```

**Telemetry Events:**
```typescript
monetisation:trial_started
monetisation:trial_expired
monetisation:proposal_consumed
monetisation:quota_exceeded
monetisation:plan_upgraded
monetisation:checkout_initiated
monetisation:billing_portal_opened
```

### Testing Approach

**Manual Tests:**
1. Visit /pricing → See 3 plans, Growth featured
2. Click "Start Trial" → Redirects to /dashboard
3. Check localStorage: `ngo_trial`, `ngo_plan`, `ngo_quota`
4. Dashboard shows trial countdown + quota progress
5. Simulate proposal generation → `consumeProposal()`
6. Quota reaches 0 → "Upgrade" CTA appears
7. Simulate expiry → `simulateTrialExpiry()`
8. Trial expired banner appears
9. Console logs Stripe placeholder calls

**Edge Cases:**
- Multiple trial starts (should use existing trial, not create new)
- Trial expiry exactly at 48 hours
- Quota consumption when limit reached (blocked)
- Dashboard refresh maintains trial/quota state

### Alternatives Considered

**Option A: 7-Day Trial with More Proposals**
- Rejected: Longer trial delays conversion; 2 days creates urgency
- 1 proposal sufficient to demonstrate value

**Option B: Credit Card Required for Trial**
- Rejected: Adds friction; NGOs sensitive to upfront payment
- No-CC trial increases conversion rate

**Option C: Freemium Forever (Limited Features)**
- Rejected: Doesn't align with revenue model
- Premium content (expert review) requires paid tiers

**Option D: Real Stripe Integration Now**
- Deferred: Backend not ready for payment processing
- Mock allows frontend iteration independently

### Migration Path

**Phase 1 (Current - V4):**
- ✅ Plan configuration + pricing page
- ✅ Mock trial logic (localStorage)
- ✅ Dashboard quota UI
- ✅ Stripe placeholders

**Phase 2 (Live Billing Cluster):**
- Implement Stripe API endpoints (`/api/stripe/*`)
- Database schema for subscriptions
- Webhook handlers for lifecycle events
- Migrate trial/quota tracking to backend
- Email notifications (trial expiring, payment received)
- Customer portal for self-service billing

**Phase 3 (Future Enhancements):**
- Annual billing (discounted)
- Add-ons (extra proposals, priority support)
- Enterprise custom pricing
- Referral credits
- Non-profit discount program

### Security & Compliance

**Current (Mock):**
- ⚠️ Quota bypass possible (localStorage manipulation)
- ⚠️ No payment data handled (Stripe not integrated)
- ✅ No sensitive data stored client-side

**Future (Live Billing):**
- ✅ PCI compliance via Stripe (no card data touches our servers)
- ✅ Webhook signature verification
- ✅ Server-side quota enforcement
- ✅ Secure session management (httpOnly cookies)
- ✅ Audit logging for billing events
- ✅ GDPR compliance for EU customers (Stripe handles)

### Pricing Rationale

**Market Research:**
- Starter ($19): Competitive with basic grant tools
- Growth ($39): Matches mid-tier SaaS (incl. expert review adds value)
- Impact+ ($79): Premium positioning, justified by volume + white-glove

**Value Metrics:**
- Average grant: $10K-$50K
- If 1 proposal succeeds → 200-500x ROI on subscription
- Manual review (Growth+) increases success rate ~30%

**Trial Conversion:**
- Goal: 15-20% trial → paid conversion
- 2-day urgency + 1 proposal demonstrates value
- Upgrade path: Dashboard banners + email reminders (future)

### References
- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Checkout](https://stripe.com/docs/payments/checkout)
- [Stripe Webhooks](https://stripe.com/docs/webhooks)
- [SaaS Pricing Best Practices](https://www.priceintelligently.com/blog/saas-pricing-models)




## ADR-008: Profiles & Opportunities (UI-first with MSW)

**Date:** 2025-10-06  
**Status:** Accepted  
**Context:** V5 clusterprofile wizard, opportunities discovery, and GrantPilot handoff (all UI-first with mock data).

### Motivation
Before integrating with live backend APIs, we need:
1. **Profile capture**: Multi-step wizard to collect NGO details for better proposal generation
2. **Opportunities discovery**: Searchable, filterable list of funding opportunities
3. **Handoff to GrantPilot**: Smooth transition from opportunity discovery to proposal generation
4. **Quota gating**: Respect trial and plan limits before allowing proposal generation

### Decision
**V5A: Profile Wizard**
- Multi-step form (Basics  Focus  Capacity  Projects)
- localStorage persistence (will upgrade to backend in integration phase)
- Profile summary page with edit capability
- Validation at each step

**V5B: Opportunities**
- List view with filters (Region, Sector, Deadline, Search)
- URL-synced filter state (survives page reload)
- Detail view with full opportunity information
- Mock data (6 sample opportunities, expandable)
- Share and save functionality (mocked)

**V5C: Gating & Integration**
- GrantPilot stub page (full implementation in V6)
- Quota-gated CTA on opportunity detail
- Upgrade modal when trial expired or quota exhausted
- Banner warnings for gated actions

### Technical Approach
**Mock Data Strategy**
- mocks/data/opportunities.ts: Static mock opportunities
- Future: MSW handlers can intercept /api/opportunities if needed
- localStorage for profile persistence (simple, client-side only)

**URL State Management**
- useSearchParams() and outer.replace() for filter sync
- Enables shareable links and back-button support

**Quota Integration**
- Reuse V4 trial/quota logic (lib/quota.ts)
- Check getQuotaStatus() and getTrialStatus() before allowing GrantPilot access
- Show upgrade modal if gated

### Trade-offs
**Pros:**
- Rapid UI iteration without backend dependencies
- Clear separation of concerns (UI vs API)
- Easy to test filter/search logic
- Profile wizard provides immediate value

**Cons:**
- localStorage profiles won't sync across devices (acceptable for MVP)
- Mock opportunities don't reflect real-time data
- No server-side validation yet

### Migration Path
**Phase 1 (Current - V5):** UI-first with mocks
**Phase 2 (V6+):** Integrate real APIs
1. Replace mocks/data/opportunities.ts with services/opportunities.ts calling backend
2. Add profile API service (services/profile.ts) with Zod schema
3. Move quota validation to backend
4. Add real-time opportunity updates

### Acceptance Criteria
- [x] Profile wizard: 4 steps, validation, localStorage persistence
- [x] Profile summary: read-only view with edit button
- [x] Opportunities list: filters + URL sync + search
- [x] Opportunity detail: full info + share + save (mock)
- [x] GrantPilot CTA: gated by trial/quota
- [x] Upgrade modal: shows when access denied

### Testing Approach
- Manual QA checklist in TEST_PLAN.md (V5 section)
- Profile persistence: fill wizard, reload, verify data
- Filter state: apply filters, refresh page, verify URL params
- Quota gating: set quota_remaining=0, verify CTA disabled

### Security Considerations
- No PII logged in telemetry
- Profile data stored locally only (encrypted in future)
- No API keys or secrets in mock data
- Opportunity links disabled (no external redirects yet)

---
