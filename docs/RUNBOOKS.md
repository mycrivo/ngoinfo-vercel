# Runbooks

## How to Add a New Environment Variable

Follow these steps when introducing a new environment variable:

**Step 1: Update `.env.example`**
- Add the variable with a placeholder value and descriptive comment
- Group by domain (API, Auth, Observability, Flags, etc.)
- Document scope (client vs server), owner, and rotation policy

Example:
```bash
# New API endpoint for document generation
# Owner: Backend team | Rotation: Quarterly
NEXT_PUBLIC_DOC_API_URL=https://docgen-dev.railway.app
```

**Step 2: Update `lib/env.ts` Schema**
- Add to `clientSchema` if `NEXT_PUBLIC_*` (browser-accessible)
- Add to `serverSchema` if server-only (never exposed to browser)
- Define Zod type with appropriate validation (`.url()`, `.min()`, `.optional()`, etc.)
- Add to exported `env` object

Example (server-only variable):
```typescript
const serverSchema = z.object({
  // ... existing vars
  DOC_API_KEY: z.string().min(20).optional(),
});

export const env = {
  // ... existing vars
  DOC_API_KEY: validated.server?.DOC_API_KEY,
};
```

**Step 3: Add to Vercel Environment Settings**
- Navigate to Vercel project → Settings → Environment Variables
- Select environment(s): Development / Preview / Production
- Mark as "Sensitive" if it contains credentials
- Click "Save"

**Step 4: Update ADR-005 Documentation**
- Add row to Variable Ownership & Rotation table in `docs/DECISIONS_ADR.md`
- Include: name, scope, required status, owner, rotation frequency, notes

**Step 5: Test Locally**
- Copy new variable to `.env.local`
- Restart dev server (`npm run dev`)
- Verify validation passes and variable is accessible
- Check TypeScript autocomplete works (`env.NEW_VAR_NAME`)

**Checklist:**
- [ ] Added to `.env.example` with comment
- [ ] Zod schema updated in `lib/env.ts`
- [ ] Exported in `env` object
- [ ] Added to Vercel environment settings
- [ ] Documented in ADR-005
- [ ] Tested locally with restart
- [ ] Team notified via PR description

---

## Secrets Rotation Policy

Regular rotation of sensitive credentials reduces security risk. Follow this schedule:

### Rotation Frequencies

| Credential Type | Frequency | Owner | Next Review Date |
|-----------------|-----------|-------|------------------|
| **API Keys** (OpenAI, third-party services) | Quarterly | Backend team | 2026-01-06 |
| **OAuth Secrets** (Client ID/Secret) | Quarterly | Backend team | 2026-01-06 |
| **Auth Session Secret** (`AUTH_SECRET`) | Quarterly | Frontend team | 2026-01-06 |
| **Database Credentials** | Annual | Infrastructure | 2026-10-06 |
| **CI/CD Tokens** (Vercel, Railway, GitHub) | Annual | Infrastructure | 2026-10-06 |
| **Observability Keys** (Sentry DSN) | Annual | Infrastructure | 2026-10-06 |

### Standard Rotation Process

**Pre-rotation (T-7 days):**
1. Notify team via Slack #engineering channel
2. Create calendar reminder for rotation window
3. Verify zero-downtime rotation strategy documented

**Rotation Day:**
1. Generate new credential in provider dashboard/console
2. Update **staging** environment first:
   - Vercel: Settings → Environment Variables → Edit → Update value
   - Railway: Service → Variables → Edit
3. Deploy staging and verify functionality (run smoke tests)
4. Update **production** environment
5. Trigger rolling restart (automatic in Vercel/Railway on env change)
6. Monitor logs for auth errors or service degradation (15 minutes)
7. Revoke old credential in provider dashboard

**Post-rotation:**
1. Update "Next Review Date" in this runbook
2. Document any issues in #engineering Slack thread
3. If rollback needed: revert to old credential, investigate, reschedule

### Emergency Rotation (Compromised Credential)

**Immediate Actions (within 1 hour):**
1. **Revoke** compromised credential in provider dashboard (stops active misuse)
2. **Rotate** to new credential using process above
3. **Audit** access logs for suspicious activity
4. **Notify** security team and stakeholders via incident channel

**Follow-up (within 24 hours):**
1. Root cause analysis: How was credential exposed?
2. Review other credentials from same source (rotate if necessary)
3. Update access controls and secrets storage policies
4. Post-incident report with timeline and remediation

**Contact:**
- Security incidents: security@ngoinfo.org
- On-call engineer: Check PagerDuty rotation

---

## Debugging Missing Env Vars in Cursor/Vercel

### Problem: "Missing environment variable" Error

**Symptom:**
```
[env] Invalid client environment variables: {
  NEXT_PUBLIC_API_BASE_URL: { _errors: ['Required'] }
}
Error: [env] Invalid client environment variables...
```

**Local Development (Cursor/VS Code):**

1. **Check `.env.local` exists:**
   ```bash
   ls -la .env.local
   # If missing: cp .env.example .env.local
   ```

2. **Verify variable is defined:**
   ```bash
   cat .env.local | grep NEXT_PUBLIC_API_BASE_URL
   # Should show: NEXT_PUBLIC_API_BASE_URL=https://...
   ```

3. **Restart dev server:**
   - Stop server (Ctrl+C)
   - Run `npm run dev` again
   - Environment variables are loaded at startup, not hot-reloaded

4. **Check for typos:**
   - Variable names are case-sensitive
   - `NEXT_PUBLIC_*` prefix required for client-side vars
   - No spaces around `=` sign: `VAR=value` not `VAR = value`

5. **Verify syntax in `.env.local`:**
   - No quotes needed: `URL=https://example.com` (not `URL="https://..."`)
   - Comments start with `#`
   - Each variable on new line

**Vercel Deployment:**

1. **Navigate to Vercel Dashboard:**
   - Go to project → Settings → Environment Variables

2. **Check variable is set for correct environment:**
   - Development: Affects `vercel dev` and preview branches
   - Preview: Affects all preview deployments
   - Production: Affects production deployments only

3. **Redeploy after adding variable:**
   - Settings → Deployments → Latest → "Redeploy"
   - Or push new commit to trigger rebuild

4. **Inspect build logs:**
   - Deployments → Click deployment → "Building" tab
   - Look for `[env]` validation errors
   - Errors appear during `next build` phase

5. **Verify sensitive variables are marked:**
   - Sensitive variables hidden from logs (shows `***`)
   - If exposed in logs, mark as "Sensitive" in settings

**Railway Backend (if backend error affects frontend):**

1. Check Railway service logs:
   ```
   railway logs --service reqagent-dev
   ```

2. Verify backend env vars are set:
   - Railway Dashboard → Service → Variables tab

3. Confirm frontend is pointing to correct backend URL:
   - Check `NEXT_PUBLIC_API_BASE_URL` matches Railway deployment URL

### Problem: Variable Exists But Validation Fails

**Symptom:**
```
[env] Invalid client environment variables: {
  NEXT_PUBLIC_API_BASE_URL: { _errors: ['Invalid url'] }
}
```

**Solution:**

1. **Check Zod schema in `lib/env.ts`:**
   - URLs must include protocol: `https://example.com` not `example.com`
   - Numbers should be strings in `.env`: `TIMEOUT=15000` not bare number
   - Booleans as strings: `FLAG=true` not bare boolean

2. **Common validation fixes:**
   - URL missing protocol → add `https://`
   - Number too small → check `.min()` constraint in schema
   - Required but optional in schema → add `.optional()` or provide value

3. **Test schema locally:**
   ```typescript
   import { z } from "zod";
   const schema = z.string().url();
   schema.parse("http://localhost:3000"); // ✅ passes
   schema.parse("localhost:3000");        // ❌ fails
   ```

### Problem: Feature Flag Not Working

**Symptom:**
- Flag is set in `.env.local` but feature not enabled
- No console log showing flags initialized

**Solution:**

1. **Restart server (flags cached at startup):**
   ```bash
   # Stop server, then:
   npm run dev
   ```

2. **Check console for flag initialization log:**
   ```
   [flags] Feature flags initialized: {
     USE_MSW: false,
     ENABLE_BRANDING_PREVIEW: true,
     ...
   }
   ```

3. **Verify flag is accessed server-side:**
   - Client Components can't read server-only flags
   - Move logic to Server Component or pass as prop

4. **Check boolean string format:**
   ```bash
   # ✅ Correct:
   USE_MSW=true
   
   # ❌ Wrong:
   USE_MSW="true"  # Quotes cause string comparison issues
   USE_MSW=1       # Must be string "true" or "false"
   ```

5. **Inspect `lib/flags.ts` logic:**
   - Flags derived from `env` object
   - Check transform: `.transform(val => val === "true")`

### Quick Reference: Environment Variable Checklist

**Before asking for help, verify:**
- [ ] `.env.local` file exists in project root
- [ ] Variable is spelled correctly (case-sensitive, check `.env.example`)
- [ ] Dev server restarted after changing env vars
- [ ] No syntax errors in `.env.local` (no quotes, spaces, etc.)
- [ ] For `NEXT_PUBLIC_*` vars: accessible in browser console via `process.env`
- [ ] For Vercel deploys: variable set in correct environment (dev/preview/prod)
- [ ] For Zod errors: value matches expected type (URL, number, boolean string)

**Still stuck?**
1. Check `lib/env.ts` schema for variable definition
2. Review ADR-005 in `docs/DECISIONS_ADR.md` for variable documentation
3. Search Vercel logs for `[env]` prefix to see validation details
4. Ask in #engineering Slack with error message and deployment URL

---

## Auth Down
1) Check Vercel logs for 5xx on /api/auth/*
2) Verify cookie domains & SameSite
3) Roll back last deploy
4) Post incident note with Support IDs

## Copilot Slow
1) Compare recent latency in telemetry
2) Throttle concurrency on server route; add queue notice
3) Capture minimal repro payload; attach to issue

## Schema Mismatch
1) Update zod schemas to current backend
2) Re-run typecheck to fix call sites


