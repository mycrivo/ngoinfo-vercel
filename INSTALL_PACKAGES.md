# Required Package Installation

Run this command to install all required dependencies for Day 1 backend integration:

```bash
npm install @supabase/ssr @supabase/supabase-js stripe date-fns lucide-react
```

## Package Purposes

- `@supabase/ssr` - Supabase Auth helpers for Next.js App Router
- `@supabase/supabase-js` - Supabase JavaScript client
- `stripe` - Stripe Node.js library for webhooks and API
- `date-fns` - Date utilities for trial expiry calculations
- `lucide-react` - Icon library for UI components

## After Installation

1. Copy `.env.example` to `.env.local`
2. Fill in your Supabase and Stripe credentials
3. Run `npm run dev` to start development server

