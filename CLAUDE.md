@AGENTS.md

# Referio — Architecture Rules

## What This Project Is

Referio (referio.io) is a referral marketplace for high-value recruitment roles.
Employers post jobs via MagicHire API. Referrers browse jobs and submit referrals.
Referrals are pushed to MagicHire as job applications with source="referio".

## Stack

- Next.js 14 App Router, TypeScript strict mode
- Supabase (auth + database + RLS)
- Tailwind CSS only — no component libraries
- Resend for email
- Vercel for deployment

## Non-Negotiable Rules

### SEO

- All public pages (/ /jobs /jobs/[slug]) are server-rendered (SSG + ISR)
- Zero client-side data fetching on public pages
- Every public page exports generateMetadata()
- /jobs/[slug] includes JSON-LD JobPosting schema
- sitemap.xml and robots.txt exist as Next.js route handlers

### Data Access

- All Supabase queries on public pages: server-side only, never client
- Browser Supabase client: only in /dashboard and /admin (auth-gated pages)
- All MagicHire API calls: only via /lib/magichire/ — never inline
- All email sends: only via /lib/email/resend.ts — never inline
- All API key validation: only via /lib/api/auth.ts — never inline

### API Design

- All inbound API routes live under /api/v1/
- Every response uses this envelope:
  { "success": boolean, "data": {} | null, "error": { "code": string, "message": string } | null }
- Named error codes always, not just HTTP status codes

### Security

- SUPABASE_SERVICE_ROLE_KEY: server-side only, never in client code
- MAGICHIRE_API_KEY: server-side only, never in client code
- REFERIO_MASTER_KEY: server-side only, never in client code

### MagicHire Push

- Always two-step: POST /candidates first, then POST /applications
- Idempotency-Key required on both: "referio-cand-{referral_id}" and "referio-app-{referral_id}"
- Push NEVER blocks the user — save referral to DB first, push after
- One retry after 5 seconds on failure, then stop
- Store all push errors in referrals.magichire_push_error

### Visual Design

- No gradients — flat solid colours only throughout the entire application

### Code Quality

- No `any` types — strict TypeScript throughout
- Components over 150 lines must be split
- No business logic in components — logic lives in /lib/
- Slug format: {magichire_job_id}-{url-safe-title}
  e.g. job_abc123-senior-engineer-london

## Project Structure

```
/app
  /api/v1/employers/route.ts
  /api/v1/jobs/route.ts
  /api/v1/referrals/submit/route.ts
  /api/v1/webhooks/magichire/route.ts
  /api/v1/admin/jobs/[id]/route.ts
  /api/v1/admin/referrals/[id]/route.ts
  /(public)/page.tsx
  /(public)/jobs/page.tsx
  /(public)/jobs/[slug]/page.tsx
  /(auth)/dashboard/page.tsx
  /(auth)/auth/callback/route.ts
  /(admin)/admin/page.tsx
  sitemap.ts
  robots.ts
/components
  /ui/
  /jobs/
  /referral/
  /admin/
  /layout/
/lib
  /supabase/client.ts
  /supabase/server.ts
  /magichire/push.ts
  /magichire/webhook.ts
  /api/auth.ts
  /email/resend.ts
  /utils/slug.ts
  /utils/fee.ts
  /utils/sanitize.ts
/types/index.ts
```
