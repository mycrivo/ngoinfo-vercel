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


