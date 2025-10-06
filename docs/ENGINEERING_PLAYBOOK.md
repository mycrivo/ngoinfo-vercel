# Engineering Playbook (NGOInfo Frontend)

## Definition of Done
- Strict TS, no `any`
- Input/output validated with zod
- Errors user-friendly + Support ID surfaced; sensitive details logged server-side only
- No client-side secrets
- a11y checked for interactive components
- Unit tests for schemas/services; Playwright covers auth → generate → finalise
- Bundle size sanity: avoid new heavy deps; use dynamic imports/client-only sparingly
- Docs updated (API_CONTRACTS/ADR if contracts changed)

## Security
- httpOnly, Secure, SameSite=Strict cookies for sessions
- CSP, X-Frame-Options=DENY, Referrer-Policy=strict-origin-when-cross-origin
- CORS allow-list (Railway API + WP only)
- Rate limiting at middleware for auth/AI endpoints
- Redact stack traces from users; log with request_id

## Performance
- Prefer Server Components; ISR for marketing
- Edge caching for read-only lists; SWR for client hydration
- next/image + lazy; prefetch critical routes

## Observability
- lib/telemetry for Sentry + Web Vitals
- Structure logs with {request_id, user_id?, prompt_version, api_version}

## Flags & Rollouts
- Edge Config / env gates for risky features; 0/10/50/100 rollout

## Runbooks
- See RUNBOOKS.md for quick actions (Auth down, Copilot slow, ReqAgent schema mismatch)


