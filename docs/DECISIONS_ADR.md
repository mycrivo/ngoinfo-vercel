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


