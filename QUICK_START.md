# Quick Start Checklist

## ⚡ 5-Minute Setup (If you have Supabase/Stripe ready)

- [ ] 1. Install packages: `npm install @supabase/ssr @supabase/supabase-js stripe date-fns lucide-react`
- [ ] 2. Copy `.env.example` to `.env.local` and fill in credentials
- [ ] 3. Run `DATABASE_SCHEMA.sql` in Supabase SQL Editor
- [ ] 4. Replace `src/app/dashboard/page.tsx` with code from `DAY1_BACKEND_SETUP.md` Step 5
- [ ] 5. Run `npm run dev` and test signup flow

## 📋 Full Setup (First Time)

### Prerequisites
- [ ] Node.js >= 20.0.0
- [ ] Supabase account (free tier OK)
- [ ] Stripe account (test mode OK)

### Steps
1. **Install Dependencies** (2 min)
   ```bash
   npm install @supabase/ssr @supabase/supabase-js stripe date-fns lucide-react
   ```

2. **Setup Supabase** (5 min)
   - Create project at supabase.com
   - Run `DATABASE_SCHEMA.sql` in SQL Editor
   - Enable Email auth provider
   - Add redirect URL: `http://localhost:3000/auth/callback`
   - Copy URL + keys

3. **Setup Stripe** (5 min)
   - Create 3 products in Dashboard (Starter $19, Growth $39, Impact+ $79)
   - Copy Price IDs
   - Install Stripe CLI: `brew install stripe/stripe-cli/stripe`
   - Login: `stripe login`
   - Forward webhooks: `stripe listen --forward-to localhost:3000/api/stripe/webhook`
   - Copy webhook secret

4. **Configure Environment** (2 min)
   - Copy `.env.example` to `.env.local`
   - Fill in all Supabase and Stripe values

5. **Update Dashboard** (1 min)
   - Open `DAY1_BACKEND_SETUP.md`
   - Copy dashboard code from Step 5
   - Replace `src/app/dashboard/page.tsx` with it

6. **Test** (5 min)
   ```bash
   npm run dev
   ```
   - Go to `http://localhost:3000`
   - Click "Sign Up / Login"
   - Create account
   - Verify redirect to dashboard
   - Check database: `user_plan_state` row created

## ✅ Acceptance Criteria (Day 1 Complete)

- [ ] Sign up → redirected to /dashboard
- [ ] Dashboard shows "Trial (Active)" badge
- [ ] Quota meter shows "0 / 1 used"
- [ ] Trial countdown shows ~48 hours remaining
- [ ] POST to `/api/proposals/generate` creates proposal
- [ ] Quota updates to "1 / 1 used"
- [ ] Second POST returns `402` with `requiresPayment: true`
- [ ] Stripe webhook test returns `200 OK`

## 🚀 Ready to Deploy?

- [ ] Add all env vars to Vercel dashboard
- [ ] Update Supabase redirect URL to production domain
- [ ] Create Stripe webhook for production endpoint
- [ ] Set Stripe keys to **live mode** (when ready for real payments)
- [ ] Push to GitHub: `git push origin main`

## 📚 Documentation

- **Setup Guide:** `DAY1_BACKEND_SETUP.md` (detailed walkthrough)
- **Implementation Summary:** `IMPLEMENTATION_SUMMARY.md` (what was built)
- **Database Schema:** `DATABASE_SCHEMA.sql` (run in Supabase)
- **Architecture:** `docs/DECISIONS_ADR.md` (why we made these choices)

## 🆘 Troubleshooting

**"npm: command not found"**
→ Install Node.js from nodejs.org

**"Missing Supabase URL"**
→ Check `.env.local` exists and has correct values
→ Restart dev server: `npm run dev`

**"Auth callback failed"**
→ Verify redirect URL in Supabase dashboard matches exactly
→ Check `NEXT_PUBLIC_SITE_URL` in `.env.local`

**"Stripe webhook signature failed"**
→ Use Stripe CLI for local testing
→ Copy the webhook secret from CLI output

**"PGRST116: No rows found"**
→ Normal on first login - trial is being initialized
→ Refresh page to see updated quota

---

**Time Estimate:** 20 minutes first-time setup, 5 minutes if you have Supabase/Stripe ready

