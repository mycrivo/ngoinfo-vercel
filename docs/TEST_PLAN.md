# Test Plan (Critical Paths)

1) Auth → Onboard → GrantPilot generate → Review → Finalise
2) Profile edit with missing fields → Review banner visible
3) Funding detail (success/partial/error payloads)
4) Network timeout surfaces retry UI
5) a11y: forms and editor keyboard paths

## V2 - Guards & UI Kit Validation

### Edge Middleware Guards (Manual Checks)

**Auth Guard (Stub) - /dashboard and /admin paths:**

1. **Without Session Cookie (Default State):**
   ```bash
   # Navigate to: http://localhost:3000/dashboard
   # Expected: Page loads normally (no redirect in dev)
   # Console: "[guard:auth] /dashboard - no session cookie found"
   # Console: "[guard:auth] blocking disabled in dev (NODE_ENV=development)"
   ```

2. **With Session Cookie (Simulated Auth):**
   ```bash
   # In browser DevTools > Application > Cookies
   # Add cookie: dev-session-token = "test-user-123"
   # Navigate to: http://localhost:3000/dashboard
   # Expected: No auth guard logs (authenticated)
   ```

3. **Admin Routes:**
   ```bash
   # Navigate to: http://localhost:3000/admin/settings
   # Expected: Same behavior as dashboard (log-only in dev)
   ```

4. **Guards Enabled (Force Production Behavior):**
   ```bash
   # In .env.local, add: GUARDS_ENABLED=true
   # Restart server
   # Navigate to: http://localhost:3000/dashboard (without cookie)
   # Expected: Redirect to /login?from=/dashboard
   ```

**Rate Limit Guard (Stub):**

1. **Normal Traffic:**
   ```bash
   # Navigate between pages normally
   # Expected: X-RateLimit-Limit and X-RateLimit-Remaining headers present
   # Check DevTools > Network > Response Headers
   ```

2. **Excessive Requests (Trigger Limit):**
   ```bash
   # Rapidly refresh /dashboard 35+ times within 1 minute
   # Expected (dev): Console log "[guard:ratelimit] would-throttle"
   # Expected (dev): Page still loads (no 429)
   # Expected (GUARDS_ENABLED=true): 429 Too Many Requests response
   ```

### UI Kit Components (Sandbox)

**Access Sandbox:**
```bash
# Navigate to: http://localhost:3000/sandbox/ui
# Expected: All components render without errors
```

**Button Component:**
1. ✓ Variants render: primary (blue), secondary (outlined), link (underlined)
2. ✓ Sizes render: sm (36px), md (44px), lg (48px) min-height
3. ✓ Hover states visible (color darkens)
4. ✓ Active states visible (click and hold)
5. ✓ Disabled state: opacity 50%, cursor not-allowed
6. ✓ Console logs on click: `[telemetry:button] variant=primary action=click`

**Input Component:**
1. ✓ Text, email, password variants render
2. ✓ Focus ring appears on tab/click (blue outline)
3. ✓ Error state: red border + error message displayed
4. ✓ Helper text displays below input
5. ✓ Disabled state: grayed out, not editable
6. ✓ Select dropdown works with options
7. ✓ Textarea expands to 4 rows

**Card Component:**
1. ✓ Basic card renders with border and padding
2. ✓ Header section separated by border
3. ✓ Footer section separated by border
4. ✓ Elevation variants: none, sm, md, lg (shadow increases)
5. ✓ Padding variants work correctly

**Banner Component:**
1. ✓ Variants render with correct colors:
   - Info: blue background
   - Success: green background
   - Warning: yellow background
   - Error: red background
2. ✓ Icons display for each variant
3. ✓ Dismissible banner: × button appears and removes banner on click
4. ✓ Role="alert" for error/warning (check in DevTools)

### Telemetry Logging

**Route Change Tracking:**
```bash
# Navigate: / → /login → /dashboard → /
# Expected console logs:
# [telemetry:nav] from=/ to=/login timestamp=2025-10-06T...
# [telemetry:nav] from=/login to=/dashboard timestamp=2025-10-06T...
# [telemetry:nav] from=/dashboard to=/ timestamp=2025-10-06T...
```

**Button Click Tracking:**
```bash
# Click any button in /sandbox/ui
# Expected console log:
# [telemetry:button] variant=primary action=click timestamp=1728246789123
```

### Accessibility Checks

**Keyboard Navigation:**
1. Tab through inputs → focus ring visible
2. Tab to buttons → focus ring visible
3. Enter/Space on button → triggers click
4. Tab to banner dismiss → focus ring visible
5. Escape key on dismissible banner → (future enhancement)

**Screen Reader (NVDA/VoiceOver):**
1. Button labels announced correctly
2. Input labels associated (for/id attribute)
3. Error messages announced when input invalid
4. Banner role="alert" triggers announcement
5. Card semantic structure clear

**Color Contrast (DevTools > Accessibility):**
1. Text contrast ratio ≥ 4.5:1 (WCAG AA)
2. Placeholder text readable
3. Disabled states distinguishable
4. Error messages high contrast

### Responsive Behavior

**Mobile (375px width):**
```bash
# DevTools > Toggle device toolbar > iPhone SE
# Navigate to /sandbox/ui
# Expected:
# - Buttons stack vertically on small screens
# - Cards stack in single column
# - Inputs full-width on mobile
# - Min 44px tap targets maintained
```

**Tablet (768px width):**
```bash
# DevTools > iPad
# Expected:
# - 2-column grid for cards
# - Inputs side-by-side
```

### Placeholder CSS Variables Validation

**Check Styles in DevTools:**
```bash
# Inspect any button > Computed styles
# Search for: --placeholder-primary-bg
# Expected: Fallback color used (#3b82f6 blue)
# Note: Real brand tokens will replace in 2A
```

### Error States

**Missing Import (Type Check):**
```bash
# Run: npm run typecheck
# Expected: No errors (all components properly typed)
```

**Linter Validation:**
```bash
# Run: npm run lint
# Expected: No errors in features/ui/* files
```

### Performance

**Bundle Size Check:**
```bash
# Run: npm run build
# Check output for features/ui bundle size
# Expected: < 15KB for all UI components combined (gzipped)
```

**Runtime Performance:**
```bash
# DevTools > Performance > Record
# Navigate to /sandbox/ui
# Expected: No layout shifts, < 100ms interaction latency
```

### Regression Prevention

**Ensure No Breaking Changes:**
1. ✓ Existing routes (/, /login, /dashboard, /health) still work
2. ✓ Header/Footer render correctly
3. ✓ No console errors on any page
4. ✓ Security headers still present (check Network tab)
5. ✓ Error pages (404, 500) still render

### Definition of Done Checklist

- [ ] Guards log decisions in dev, don't block
- [ ] /sandbox/ui renders all component variants
- [ ] No raw hex colors in components (only CSS variables)
- [ ] Telemetry logs route changes and button clicks
- [ ] All accessibility features working (keyboard, screen reader, contrast)
- [ ] Responsive layouts tested (mobile/tablet/desktop)
- [ ] TypeScript types validated (no `any`)
- [ ] Linter passes (no warnings)
- [ ] No runtime errors in console

## 2A - Branding System QA

### Visual QA - /sandbox/branding

**Access Sandbox:**
```bash
http://localhost:3000/sandbox/branding
```

**Color Tokens:**
1. ✓ Core palette displays correctly (Primary #2338F6, Secondary #795CFB, Accent #FFC857, Dark #180466)
2. ✓ Functional colors visible (Success, Warning, Error)
3. ✓ No hardcoded hex values in component code (all use CSS variables)

**Typography (Poppins):**
1. ✓ H1-H3 headings render with correct sizes and weights
2. ✓ Body text legible at all viewport sizes (14px→16px→18px)
3. ✓ Text on both default and subtle surfaces maintains AA contrast
4. ✓ Tabular numerals and ligatures enabled

**Buttons:**
1. ✓ Primary variant: correct colors, hover darkens ~10%, active scales to 0.98
2. ✓ Secondary variant: outline→fill on hover, correct transition
3. ✓ Link variant: underline on hover only, correct color
4. ✓ Disabled states: 60% opacity, not-allowed cursor
5. ✓ Focus rings: 2px width, offset visible on Tab navigation
6. ✓ Min tap target: 44px height on md size (WCAG 2.5.5)

**Inputs:**
1. ✓ Border color changes on focus (primary blue ring)
2. ✓ Error state: red border + error message in red
3. ✓ Placeholder text readable (neutral-300 color)
4. ✓ Select dropdown: custom arrow, correct padding
5. ✓ Textarea: minimum 4 rows, vertical resize
6. ✓ Disabled state: grayed out, 60% opacity

**Cards:**
1. ✓ Elevation variants: none/sm/md/lg shadows increase correctly
2. ✓ Header/footer borders match card border color
3. ✓ Padding variants (sm/md/lg) space content correctly
4. ✓ Background uses --card-bg token

**Banners:**
1. ✓ Info: light blue background, primary blue text
2. ✓ Success: light green background, success green text
3. ✓ Warning: light yellow background, warning brown text
4. ✓ Error: light red background, error red text
5. ✓ Icons display correctly for each variant
6. ✓ Dismissible: × button removes banner smoothly
7. ✓ Role="alert" for error/warning (check DevTools)

### Accessibility Checks

**Contrast (WCAG AA):**
```bash
# Use DevTools > Lighthouse > Accessibility
# Or browser extension: axe DevTools

✓ Primary button text on primary bg: ≥4.5:1
✓ Secondary button text: ≥4.5:1
✓ Body text on default surface: ≥4.5:1
✓ Body text on subtle surface: ≥4.5:1
✓ Banner text on all variant backgrounds: ≥4.5:1
✓ Error/helper text: ≥4.5:1
```

**Focus Visible:**
1. Tab through buttons → 2px blue outline visible
2. Tab through inputs → blue ring appears
3. Tab to banner dismiss button → outline visible
4. Never suppressed (outline: none only with :focus-visible)

**Reduced Motion:**
```bash
# DevTools > Rendering > Emulate CSS prefers-reduced-motion: reduce
# Or OS setting: Settings > Accessibility > Reduce motion

✓ Button active scale disabled (transform: none)
✓ All transitions set to 0.01ms
✓ No jarring animations
```

### Responsive Behavior

**Mobile (375px):**
```bash
# DevTools > iPhone SE

✓ Typography scales down to 14px floor
✓ Color palette grid stacks to 2 columns
✓ Buttons maintain 44px tap target
✓ Cards stack in single column
```

**Tablet (768px):**
```bash
# DevTools > iPad

✓ 2-column grids for inputs and cards
✓ Typography at 16px base
```

**Desktop (≥1200px):**
```bash
✓ Typography scales to 18px base
✓ H1 increases to 56px
✓ Container max-width 1280px
✓ 24px gutters
```

### Token Validation

**No Hardcoded Hex in Components:**
```bash
# Search codebase for # followed by 6 hex digits in component files
grep -r "#[0-9a-fA-F]{6}" features/ui/

# Expected: No matches in .tsx files (only in CSS variables)
```

**Semantic Token Usage:**
- ✓ Buttons use --btn-* tokens
- ✓ Inputs use --input-* tokens
- ✓ Banners use --banner-* tokens
- ✓ Cards use --card-* tokens
- ✓ All components reference tokens, not core palette

### Dark Mode Seam (Prepared, No Visual Change)

```bash
# Manually in browser DevTools console:
document.documentElement.setAttribute('data-theme', 'dark')

# Expected: No visual change (dark tokens not defined yet)
# Verify: data-theme attribute applied successfully
```

### Performance

**Bundle Size:**
```bash
npm run build

# Check output for styles/tokens.css
# Expected: < 10KB for all token definitions
```

**Lighthouse:**
```bash
# DevTools > Lighthouse > Performance + Accessibility

✓ Accessibility score: ≥95
✓ No layout shifts (CLS = 0)
✓ Font loading: Poppins preconnect + display=swap
```

### Browser Compatibility

Test in:
- ✓ Chrome/Edge (Chromium)
- ✓ Firefox
- ✓ Safari (if available)

Check:
- CSS variables supported
- color-mix() function (fallback in older browsers)
- Focus-visible pseudo-class

### Definition of Done Checklist

- [ ] All components use semantic tokens (no hardcoded hex)
- [ ] /sandbox/branding renders without errors
- [ ] WCAG AA contrast verified for all text/bg combinations
- [ ] Focus rings visible (2px, offset) on all interactive elements
- [ ] Buttons meet 44px tap target minimum
- [ ] Typography scales responsively (14→16→18px)
- [ ] Hover/active states work correctly
- [ ] Reduced motion respected
- [ ] Dark mode seam prepared (data-theme attribute)
- [ ] No linter errors

## V3 - Auth UX + Error & Telemetry Framework

### Mock Authentication Flow

**Login Page (`/login`):**
```bash
1. Navigate to http://localhost:3000/login
2. ✓ Branded login form displays (Card, Inputs, Button from UI kit)
3. ✓ Form uses NGOInfo design tokens (primary blue, etc.)
4. ✓ Empty submission → inline Banner error: "Email and password are required"
5. ✓ Valid submission → 80% success → redirect to /dashboard after 1s
6. ✓ 20% random failure → Banner error: "Invalid credentials"
7. ✓ Loading state → button shows "Signing in..." and is disabled
```

**Session Persistence:**
```bash
1. After successful login → check localStorage
   # gp_session = "true"
   # gp_session_email = user@example.com
2. Refresh /dashboard → still logged in (session persists)
3. Navigate away and back → session retained
```

**Logout Page (`/logout`):**
```bash
1. Navigate to http://localhost:3000/logout
2. ✓ Branded confirmation screen displays
3. ✓ Two buttons: "Cancel" (secondary) and "Sign Out" (primary)
4. Click "Sign Out":
   - localStorage cleared (gp_session removed)
   - Redirects to / after 500ms delay
5. Click "Cancel" → returns to previous page
```

### Error Boundaries

**Global Error Boundary:**
```bash
# Trigger global error by temporarily throwing in a component:
# In app/page.tsx, add: throw new Error("Test global error");

1. Error thrown → Global ErrorBoundary catches
2. ✓ Full-page fallback renders:
   - ⚠️ icon displayed
   - "Something Went Wrong" heading
   - User-friendly message
   - "Try Again" and "Go Home" buttons
3. ✓ Development: Error details shown in card
4. ✓ Production: Error details hidden
5. Console: [track] error:boundary_caught logged
```

**Inline Error Boundary (Component-Level):**
```bash
# Future: Wrap specific components with:
# <ErrorBoundary fallback="inline">...</ErrorBoundary>

1. Component error → Inline boundary catches
2. ✓ Card with red border (2px) renders
3. ✓ "Component Error" message with icon
4. ✓ "Retry" button to reset error state
5. Other parts of page remain functional
```

**Error Boundary Reset:**
```bash
1. Error fallback displays
2. Click "Try Again" button
3. ✓ Error state clears
4. ✓ Component re-renders
5. Console: [track] error:boundary_reset logged
```

### Telemetry Tracking

**Console Logs (Development):**
```bash
1. Navigate between pages:
   # Console: [track] nav:route_change { from: "/", to: "/login" }

2. Attempt login:
   # Console: [track] auth:login_attempt { email: "user@example.com" }

3. Success:
   # Console: [track] auth:login_success { email: "user@example.com" }

4. Failure:
   # Console: [track] auth:login_failed { reason: "invalid_credentials" }

5. Logout:
   # Console: [track] auth:logout {}

6. Error caught:
   # Console: [track] error:boundary_caught { error, stack, componentStack }
```

**Telemetry Flag Control:**
```bash
# Disable telemetry
localStorage.setItem('telemetry_enabled', 'false')
# Reload page → no [track] logs

# Re-enable telemetry
localStorage.removeItem('telemetry_enabled')
# Reload page → [track] logs appear
```

**Debug Helpers (Dev Console):**
```bash
# In browser DevTools console:

# Get all tracked events
getTelemetryEvents()
# Returns: array of last 50 events

# Clear event history
clearTelemetryEvents()
# Removes telemetry_events from localStorage

# Check session ID
sessionStorage.getItem('telemetry_session_id')
# Returns: session_<timestamp>_<random>
```

**Event Structure:**
```typescript
{
  name: "auth:login_success",
  timestamp: "2025-10-06T20:45:30.123Z",
  payload: { email: "user@example.com" },
  session_id: "session_1728246330_abc123"
}
```

### Branded UI Consistency

**Login Form:**
- ✓ Uses Card with elevation="md", padding="lg"
- ✓ Input fields use --input-border-focus (primary blue ring)
- ✓ Primary button uses --btn-primary-bg
- ✓ Error Banner uses --banner-error-bg/fg
- ✓ Typography: Poppins font, semantic text colors
- ✓ No raw hex values in component code

**Logout Confirmation:**
- ✓ Card centered with max-w-md
- ✓ Buttons use correct variants (primary/secondary)
- ✓ Text colors use --text-primary, --text-secondary

**Error Fallbacks:**
- ✓ Global: Uses --surface-subtle background, Card elevation="lg"
- ✓ Inline: Uses --colour-error for border and icon
- ✓ Buttons inherit brand styling

### Integration Tests

**Full Auth Flow:**
```bash
1. Start at / (home page)
2. Click "Login" → Navigate to /login
3. Submit credentials → Success (80% chance)
4. Redirect to /dashboard
5. Click "Logout" → Navigate to /logout
6. Confirm logout → Clear session → Redirect to /
7. Try to access /dashboard → Not redirected (mock auth doesn't protect routes yet)
```

**Error Recovery:**
```bash
1. Trigger error → Fallback renders
2. Click "Try Again" → Error clears
3. Continue using app normally
4. Check console → All errors logged
```

**Telemetry Completeness:**
```bash
# After full auth flow, check:
getTelemetryEvents()

# Should include:
- auth:login_attempt
- auth:login_success (or auth:login_failed)
- nav:route_change (multiple)
- auth:logout
- All with timestamps and session_id
```

### Accessibility

**Login Form:**
- ✓ Email/password inputs have labels (for/id association)
- ✓ Error messages have role="alert"
- ✓ Tab order: Email → Password → Submit
- ✓ Enter key submits form
- ✓ Focus rings visible on all inputs

**Error Boundaries:**
- ✓ "Try Again" button keyboard accessible
- ✓ Focus trapped in error fallback (future enhancement)
- ✓ Error messages readable (AA contrast)

### Browser Compatibility

**localStorage/sessionStorage:**
- ✓ Works in Chrome/Firefox/Safari/Edge
- ✓ Fallback if storage unavailable (graceful degradation)

**Error Boundaries:**
- ✓ React 18+ error boundary API
- ✓ Catches client-side errors only (not server errors)

### Definition of Done Checklist

- [ ] /login shows branded form with validation
- [ ] Login success → redirects to /dashboard
- [ ] 20% login failure shows error Banner
- [ ] /logout clears session and redirects to /
- [ ] Global ErrorBoundary catches and logs errors
- [ ] Console shows [track] telemetry events
- [ ] TELEMETRY_ENABLED=false suppresses logs
- [ ] All UI uses NGOInfo brand tokens
- [ ] No hardcoded hex values in auth components
- [ ] Session persists across page reloads
- [ ] Error fallback UI is branded and accessible

## V4 - Monetisation Shell + Dashboard Skeleton

### Pricing Page (`/pricing`)

**Visual QA:**
```bash
1. Navigate to http://localhost:3000/pricing
2. ✓ 3 plan cards displayed in grid (mobile: stacks vertically)
3. ✓ Growth plan has "Most Popular" badge at top
4. ✓ Growth plan has 2px primary blue border
5. ✓ Growth plan elevation larger (shadow more prominent)
6. ✓ Pricing: Starter $19, Growth $39, Impact+ $79
7. ✓ Features list with green checkmarks (✓)
8. ✓ Manual review badge on Growth & Impact+ (green background)
9. ✓ All buttons: "Start 2-Day Free Trial"
10. ✓ Trial info card below plans (3 columns: 🎯 ⏱️ 📥)
11. ✓ No hardcoded hex values (all use semantic tokens)
```

**Brand Consistency:**
- ✓ Uses Card, Button components from UI kit
- ✓ Typography: Poppins font, semantic sizes
- ✓ Colors: --colour-primary for prices/borders, --colour-success for checkmarks
- ✓ Spacing: 8pt system, proper gutters

**Trial Activation:**
```bash
1. Click "Start 2-Day Free Trial" on any plan
2. ✓ Redirects to /dashboard
3. Check localStorage:
   # ngo_trial = { active: true, started_at, expires_at, proposals_used: 0, proposals_limit: 1 }
   # ngo_plan = "growth" (or selected plan)
4. Console: [track] monetisation:trial_started
```

### Dashboard with Trial/Quota

**Trial Banner (Active):**
```bash
1. After starting trial, on /dashboard:
2. ✓ Info banner at top: "Free Trial Active"
3. ✓ Shows hours remaining: "47h remaining" (updates every minute)
4. ✓ Shows quota: "1 of 1 proposals left"
5. ✓ "Upgrade Now" button (secondary) → links to /pricing
```

**Plan Badge:**
```bash
1. ✓ Top-right corner of dashboard
2. ✓ Star icon + "Growth Plan (Trial)"
3. ✓ Primary border (1px) + subtle background
4. ✓ Uses semantic tokens for colors
```

**Quota Progress Card:**
```bash
1. ✓ Card below banner: "Proposal Quota"
2. ✓ Shows "0 / 1 used"
3. ✓ Progress bar: 
   - 0% used → Primary blue
   - After 1 proposal → 100% → Red
4. ✓ Text: "1 proposals remaining this month"
5. ✓ When quota = 0 → "Upgrade →" link appears
```

**Stats Grid:**
```bash
1. ✓ 3 cards: Active Proposals (0), Funding Opportunities (—), Success Rate (—)
2. ✓ Uses semantic colors (primary, secondary, success)
3. ✓ Placeholder text: "Coming in V5", "Track your wins"
```

**Quick Actions Sidebar:**
```bash
1. ✓ 4 buttons in card:
   - 🎯 GrantPilot (disabled, "Coming Soon")
   - 👤 Profile (disabled)
   - ⚙️ Settings (disabled)
   - 💳 Manage Plan (enabled) → /pricing
2. ✓ Disabled buttons have 60% opacity
```

### Quota Consumption Flow

**Simulate Proposal Generation:**
```bash
# In browser DevTools console:
import { consumeProposal } from '@/lib/quota';
consumeProposal();

1. ✓ Returns true (success)
2. Console: [track] monetisation:proposal_consumed
3. localStorage: ngo_trial.proposals_used = 1
4. Dashboard refreshes (every minute or manual):
   - Quota card: "1 / 1 used"
   - Progress bar: 100%, red color
   - Banner still shows "0 of 1 proposals left"
```

**Quota Exceeded:**
```bash
# Try to consume again:
consumeProposal();

1. ✓ Returns false (blocked)
2. Console: [track] monetisation:quota_exceeded
3. Dashboard:
   - Warning banner: "Quota Exceeded — You've used all 1 proposals this month"
   - "Upgrade Plan" button (primary) → /pricing
```

### Trial Expiry Flow

**Simulate Expiry:**
```bash
# In browser DevTools console:
import { simulateTrialExpiry } from '@/lib/quota';
simulateTrialExpiry();

1. ✓ localStorage: ngo_trial.expires_at = (1 second ago)
2. ✓ ngo_trial.active = false
3. Console: [track] monetisation:trial_expiry_simulated
4. Reload dashboard:
   - Error banner: "Trial Expired — Subscribe to continue generating proposals"
   - "View Plans" button (primary) → /pricing
```

**Natural Expiry (48 Hours):**
```bash
# Wait 48 hours OR manually set expires_at to past date
1. Dashboard auto-detects expiry (checks every minute)
2. ✓ Trial banner disappears
3. ✓ Expired banner appears
4. ✓ Quota card shows 0 limit
5. Console: [track] monetisation:trial_expired
```

### Stripe Placeholders

**Checkout Flow (Mock):**
```bash
# In browser DevTools console:
import { checkout } from '@/lib/stripe';
await checkout('growth');

1. Console logs:
   [Stripe Placeholder] checkout() called { planId: 'growth' }
   [Stripe Placeholder] Checkout session would be created here
   [Stripe Placeholder] User would be redirected to Stripe checkout
2. Console: [track] monetisation:checkout_initiated
3. Returns: { success: false, error: "Stripe integration not yet implemented..." }
```

**Billing Portal (Mock):**
```bash
import { manageBilling } from '@/lib/stripe';
await manageBilling();

1. Console logs:
   [Stripe Placeholder] manageBilling() called
   [Stripe Placeholder] Customer portal session would be created here
2. Console: [track] monetisation:billing_portal_opened
3. Returns: { success: false, error: "Billing portal not yet implemented..." }
```

### Telemetry Events

**Full Trial Flow Events:**
```bash
# Start trial → Use quota → Expire
getTelemetryEvents()

Should include:
- monetisation:trial_started { plan, trial_days, trial_proposals }
- monetisation:proposal_consumed { is_trial: true, proposals_used, proposals_limit }
- monetisation:quota_exceeded { plan_id, proposals_used, proposals_limit }
- monetisation:trial_expired { proposals_used, proposals_limit }
- monetisation:checkout_initiated { plan_id } (if tested)
```

### Responsive Behavior

**Mobile (375px):**
```bash
# DevTools > iPhone SE
1. ✓ Pricing cards stack vertically (1 column)
2. ✓ Trial banner buttons wrap to new line
3. ✓ Dashboard stats grid: 1 column on mobile, 3 on desktop
4. ✓ Quota progress bar maintains readability
5. ✓ Plan badge moves below header on very small screens
```

**Tablet (768px):**
```bash
# DevTools > iPad
1. ✓ Pricing cards: 2 columns (3rd wraps)
2. ✓ Dashboard: 2-column layout for activity/sidebar
```

**Desktop (≥1200px):**
```bash
1. ✓ Pricing cards: 3 columns, equal width
2. ✓ Dashboard: Proper spacing, max-width 1280px
3. ✓ All hover states work correctly
```

### Edge Cases & Error Handling

**Multiple Trial Starts:**
```bash
1. Start trial (localStorage: ngo_trial created)
2. Visit /pricing again → Click "Start Trial"
3. ✓ Does NOT create new trial
4. ✓ Uses existing trial (same expires_at)
5. ✓ Redirects to dashboard
```

**LocalStorage Cleared:**
```bash
1. Clear all localStorage
2. Visit /dashboard
3. ✓ Shows "Loading..." briefly
4. ✓ Then shows no trial/plan state
5. ✓ Quota card shows 0/0
6. ✓ No error banners (graceful degradation)
```

**Quota Consumption Edge Cases:**
```bash
# Consume when already at limit:
1. consumeProposal() when proposals_used === proposals_limit
2. ✓ Returns false
3. ✓ Does NOT increment proposals_used
4. ✓ Logs quota_exceeded event

# Consume when trial expired:
1. simulateTrialExpiry()
2. consumeProposal()
3. ✓ Returns false (trial inactive, quota = 0)
```

### Browser DevTools Helpers

**Debug Functions:**
```bash
# Check quota status
import { getQuotaStatus } from '@/lib/quota';
getQuotaStatus()
# Returns: { plan_id, proposals_used, proposals_limit, quota_remaining, is_trial, can_generate }

# Check trial status
import { getTrialStatus } from '@/lib/quota';
getTrialStatus()
# Returns: { active, started_at, expires_at, hours_remaining, proposals_used, proposals_limit }

# Reset trial (for testing)
import { resetTrial } from '@/lib/quota';
resetTrial()
# Clears: ngo_trial, ngo_plan, ngo_quota
```

### Accessibility

**Pricing Page:**
- ✓ Plan cards keyboard navigable (Tab order: Starter → Growth → Impact+)
- ✓ "Start Trial" buttons have 44×44px tap target
- ✓ Focus rings visible on all interactive elements
- ✓ Checkmark icons have aria-hidden (decorative)
- ✓ Feature lists use proper semantic HTML (`<ul>`, `<li>`)

**Dashboard:**
- ✓ Banner dismiss buttons keyboard accessible
- ✓ Progress bar has aria-label describing current state
- ✓ Quota percentage readable (color + text, not color alone)
- ✓ Disabled buttons have aria-disabled attribute

### Definition of Done Checklist

- [ ] /pricing shows 3 branded plan cards
- [ ] Growth plan has "Most Popular" badge and primary border
- [ ] "Start Trial" creates trial and redirects to /dashboard
- [ ] Dashboard shows trial countdown (hours remaining)
- [ ] Quota progress bar displays correctly (0% → 100%)
- [ ] consumeProposal() reduces quota and updates UI
- [ ] Quota = 0 shows "Upgrade" CTA
- [ ] simulateTrialExpiry() shows expired banner
- [ ] Stripe placeholders log to console
- [ ] All telemetry events tracked
- [ ] No hardcoded hex values (all semantic tokens)
- [ ] Responsive on mobile/tablet/desktop
- [ ] localStorage persists trial/quota state
- [ ] No linter errors


