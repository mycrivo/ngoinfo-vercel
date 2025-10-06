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


