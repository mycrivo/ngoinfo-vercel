# Day 1 Backend Integration - Setup Guide

## Overview

This document guides you through migrating from the localStorage-based prototype to a production-ready backend with Supabase and Stripe.

## Current Status

✅ **Completed:**
- All library files (Supabase clients, auth, quota, Stripe, storage)
- API routes (proposals/generate, proposals/download, stripe/webhook)
- Auth callback handler
- Server Components (AuthGate, PlanBadge, QuotaMeter)
- Updated landing page with auth integration
- Database schema SQL script

⏳ **Requires User Action:**
1. Install npm packages
2. Set up Supabase project
3. Configure environment variables
4. Run database migrations
5. Set up Stripe products
6. Test the integration

## Step 1: Install Dependencies

```bash
npm install @supabase/ssr @supabase/supabase-js stripe date-fns lucide-react
```

## Step 2: Supabase Setup

1. **Create Project:**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Note your project URL and keys

2. **Run Database Schema:**
   - Open Supabase SQL Editor
   - Copy/paste contents of `DATABASE_SCHEMA.sql`
   - Execute the script
   - Verify tables were created

3. **Enable Auth Providers:**
   - Go to Authentication > Providers
   - Enable Email provider (password-based)
   - Optionally enable OAuth providers (Google, GitHub, etc.)
   - Configure redirect URLs:
     - Development: `http://localhost:3000/auth/callback`
     - Production: `https://yourdomain.com/auth/callback`

4. **Create Storage Bucket:**
   - The schema creates an `exports` bucket automatically
   - Verify it exists in Storage section

## Step 3: Environment Variables

Copy `.env.example` to `.env.local` and fill in:

```bash
# Supabase (from your project settings)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Stripe (test mode for development)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# OpenAI (stub for now)
OPENAI_API_KEY=sk-xxx-placeholder

# Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Step 4: Stripe Setup

1. **Create Products:**
   - Go to [Stripe Dashboard](https://dashboard.stripe.com/test/products)
   - Create 3 products matching your plans:
     - Starter: $19/month
     - Growth: $39/month
     - Impact+: $79/month
   - Copy the Price IDs

2. **Update Environment Variables:**
   ```bash
   STRIPE_PRICE_ID_STARTER=price_xxx
   STRIPE_PRICE_ID_GROWTH=price_xxx
   STRIPE_PRICE_ID_IMPACT=price_xxx
   ```

3. **Set Up Webhook:**
   - Install Stripe CLI: `brew install stripe/stripe-cli/stripe`
   - Login: `stripe login`
   - Forward webhook: `stripe listen --forward-to localhost:3000/api/stripe/webhook`
   - Copy the webhook signing secret to `.env.local`

## Step 5: Update Dashboard Page

**IMPORTANT:** Replace `src/app/dashboard/page.tsx` with the database-backed version.

The current dashboard uses localStorage. Here's the new server-component version:

```typescript
/**
 * Dashboard Page (Database-backed)
 * 
 * Protected page showing user's plan, quota, and proposals.
 */

import { requireSession } from '@/lib/auth'
import { getUserPlanState, checkQuota, ensureTrial } from '@/lib/quotaDb'
import { createClient } from '@/lib/supabaseServer'
import { PlanBadge } from '@/components/PlanBadge'
import { QuotaMeter } from '@/components/QuotaMeter'
import { Banner } from '@/features/ui/Banner'
import { Card } from '@/features/ui/Card'
import { Button } from '@/features/ui/Button'
import Link from 'next/link'

export default async function DashboardPage() {
  const session = await requireSession()
  const userId = session.user.id
  
  await ensureTrial(userId)
  
  const planState = await getUserPlanState(userId)
  const quota = await checkQuota(userId)
  
  const supabase = await createClient()
  const { data: profile } = await supabase
    .from('ngo_profiles')
    .select('id')
    .eq('user_id', userId)
    .single()

  const needsOnboarding = !profile

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welcome back, {session.user.email}
          </p>
        </div>
        <PlanBadge userId={userId} />
      </div>

      {needsOnboarding && (
        <Banner variant="info" dismissible={false}>
          <strong>Complete your profile</strong> to get better proposal recommendations.{' '}
          <Link href="/profile/wizard" className="underline font-medium">
            Start onboarding →
          </Link>
        </Banner>
      )}

      {quota.is_trial && !quota.trial_active && (
        <Banner variant="error" dismissible={false}>
          <strong>Your trial has expired.</strong> Upgrade to continue.{' '}
          <Link href="/pricing" className="underline font-medium">
            View Plans →
          </Link>
        </Banner>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card elevation="md">
            <h2 className="text-xl font-semibold mb-4">Monthly Quota</h2>
            <QuotaMeter userId={userId} />
          </Card>
        </div>

        <div className="space-y-6">
          <Card elevation="md">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Button
                variant="primary"
                disabled={!quota.can_generate}
                fullWidth
              >
                <Link href="/grantpilot">Generate Proposal</Link>
              </Button>

              <Button variant="secondary" fullWidth>
                <Link href="/opportunities">Browse Opportunities</Link>
              </Button>

              <Button variant="ghost" fullWidth>
                <Link href="/pricing">Manage Plan</Link>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
```

Save this to `src/app/dashboard/page.tsx` (replacing the existing file).

## Step 6: Testing

### Manual Test Flow

1. **Start Development Server:**
   ```bash
   npm run dev
   ```

2. **Test Auth Flow:**
   - Go to `http://localhost:3000`
   - Click "Sign Up / Login"
   - Create account with Supabase
   - Verify redirect to `/dashboard`

3. **Test Trial Initialization:**
   - Check database: `user_plan_state` row should be created
   - Plan should be `trial`
   - `trial_expires_at` should be 2 days from now

4. **Test Quota Display:**
   - Dashboard should show "1 / 1 used" quota
   - Plan badge should show "Trial (Active)"

5. **Test Proposal Generation:**
   ```bash
   curl -X POST http://localhost:3000/api/proposals/generate \
     -H "Content-Type: application/json" \
     -H "Cookie: sb-access-token=YOUR_TOKEN" \
     -d '{"title":"Test Proposal","organization_name":"Test NGO"}'
   ```
   - Should create proposal in database
   - Quota should increment to 1/1
   - Next attempt should return `402` with `requiresPayment: true`

6. **Test Stripe Webhook:**
   ```bash
   stripe trigger checkout.session.completed
   ```
   - Should log event in server console
   - Should return `200 OK`

## Step 7: Deploy to Production

1. **Update Environment Variables in Vercel:**
   - Add all Supabase keys
   - Add all Stripe keys (use live keys for production)
   - Set `NEXT_PUBLIC_SITE_URL` to your domain

2. **Configure Supabase Redirect URLs:**
   - Add production URL to allowed redirect URLs
   - Update Stripe webhook endpoint URL

3. **Deploy:**
   ```bash
   git add .
   git commit -m "feat: integrate Supabase Auth/DB and Stripe"
   git push origin main
   ```

4. **Verify Production:**
   - Test signup flow
   - Test trial initialization
   - Monitor Supabase logs
   - Monitor Stripe webhook events

## Troubleshooting

### "Missing Supabase URL" Error
- Verify `.env.local` exists and has correct values
- Restart dev server after env changes

### "Auth callback failed"
- Check redirect URLs in Supabase dashboard
- Verify `NEXT_PUBLIC_SITE_URL` is correct

### "Stripe webhook signature verification failed"
- Use Stripe CLI for local testing
- Copy webhook secret from CLI output
- For production, use webhook secret from Stripe dashboard

### "RLS policy violation"
- Verify RLS policies are created (check `DATABASE_SCHEMA.sql`)
- Ensure user is authenticated when making requests
- Check that `auth.uid()` matches `user_id` in queries

## Next Steps (Day 2+)

- [ ] Implement real OpenAI integration for proposal generation
- [ ] Create DOCX export functionality
- [ ] Build NGO profile wizard
- [ ] Integrate opportunities API
- [ ] Add email notifications (trial expiring, payment confirmed)
- [ ] Implement Stripe Customer Portal
- [ ] Add usage analytics dashboard

## Architecture Decisions

See `docs/DECISIONS_ADR.md` for:
- ADR-000: Migration to Supabase Auth/DB and Stripe
- RLS pattern and security considerations
- Quota enforcement strategy
- Webhook handling approach

## Support

If you encounter issues:
1. Check server logs (`npm run dev` output)
2. Check Supabase logs (Dashboard > Logs)
3. Check Stripe webhooks (Dashboard > Developers > Webhooks)
4. Review `docs/RUNBOOKS.md` for common scenarios

---

**Day 1 Status:** ✅ Code complete - Ready for setup and testing

