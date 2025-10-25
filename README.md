# NGOInfo Frontend

AI-powered grant proposal generation platform for African NGOs.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Auth & Database**: Supabase
- **Payments**: Stripe
- **AI**: OpenAI GPT-4
- **Styling**: Tailwind CSS
- **Language**: TypeScript (strict mode)

## Prerequisites

- Node.js >= 20.0.0
- npm or yarn
- Supabase account
- Stripe account (test mode OK)
- OpenAI API key

## Setup

1. **Clone and install dependencies**:
```bash
git clone <repo-url>
cd ngoinfo-frontend-vercel
npm install
```

2. **Configure environment variables**:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:
- Supabase: URL, anon key, service role key
- Stripe: publishable key, secret key, webhook secret
- OpenAI: API key
- Site URL: your deployment URL

3. **Set up Supabase**:
- Run the SQL migrations in `supabase/migrations/` (if provided)
- Configure RLS policies as per documentation
- Enable Auth providers (Email, OAuth)

4. **Configure Stripe**:
- Create products and prices
- Update plan mappings in `src/lib/plans.ts`
- Set up webhook endpoint pointing to `/api/stripe/webhook`
- Copy webhook signing secret to `.env.local`

## Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Build

```bash
npm run build
npm start
```

## Testing

```bash
npm test
```

## Project Structure

```
src/
├── app/
│   ├── (public)/           # Public marketing pages
│   ├── auth/               # Auth callbacks
│   ├── dashboard/          # Protected dashboard
│   ├── api/                # API routes
│   │   ├── proposals/      # Proposal generation & download
│   │   └── stripe/         # Stripe webhooks
├── lib/                    # Core utilities
│   ├── supabaseClient.ts   # Browser Supabase client
│   ├── supabaseServer.ts   # Server Supabase client
│   ├── auth.ts             # Auth helpers
│   ├── stripe.ts           # Stripe integration
│   ├── quota.ts            # Quota management
│   ├── plans.ts            # Plan definitions
│   └── storage.ts          # File storage
├── components/             # Reusable components
└── features/               # Feature-specific code
```

## Key Features

- **Authentication**: Supabase Auth with email and OAuth
- **Trial System**: 2-day free trial with 1 proposal generation
- **Quota Management**: Usage tracking and limits per plan
- **Proposal Generation**: AI-powered grant proposal creation (stub)
- **Stripe Integration**: Subscription management and webhooks
- **Row-Level Security**: Supabase RLS ensures data isolation

## Security

- All privileged API keys are server-only
- Client uses Supabase anon key with RLS enforcement
- Stripe webhooks verify signatures
- Server actions and route handlers for sensitive operations

## Deployment

Deploy to Vercel:

```bash
vercel
```

Configure environment variables in Vercel dashboard.

## License

Proprietary - All rights reserved

