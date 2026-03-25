# Referio

Referral marketplace for high-value recruitment roles. Employers post jobs via MagicHire API. Professionals refer great people and earn fees.

## Stack

- Next.js 14 App Router (TypeScript)
- Supabase (auth + database)
- Tailwind CSS
- Resend
- Vercel

## Local Setup

1. Clone the repo
2. `npm install`
3. Copy `.env.example` to `.env.local` and fill in all values
4. Run the migration: paste `supabase/migrations/001_initial.sql` into
   Supabase SQL editor and run
5. In Supabase dashboard: set brett@referio.io as admin.
   After signing in once via magic link, run in SQL editor:
   ```sql
   update referrers set is_admin = true where email = 'brett@referio.io';
   ```
6. `npm run dev`

## Creating the First Employer (MagicHire connection)

```bash
curl -X POST http://localhost:3000/api/v1/employers \
  -H "Authorization: Bearer YOUR_REFERIO_MASTER_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "magichire_client_id": "acc_your_magichire_id",
    "company_name": "Acme Corp",
    "logo_url": "https://example.com/logo.png"
  }'
```

Save the `api_key` from the response — it is shown once only.

## Posting a Job via API

```bash
curl -X POST http://localhost:3000/api/v1/jobs \
  -H "Authorization: Bearer ref_live_YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "magichire_job_id": "job_abc123",
    "title": "Senior Software Engineer",
    "location": "London, UK",
    "description": "<p>We are looking for...</p>",
    "referral_fee": 10000,
    "fee_currency": "GBP",
    "payout_trigger": "at_hire"
  }'
```

## Deployment

Deploy to Vercel. Set all env vars from `.env.example` in Vercel dashboard.
`NEXT_PUBLIC_SITE_URL` must be set to `https://referio.io` in production.
