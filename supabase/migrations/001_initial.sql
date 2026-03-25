-- Enable UUID generation
create extension if not exists "pgcrypto";

-- EMPLOYERS
create table employers (
  id uuid primary key default gen_random_uuid(),
  company_name text not null,
  logo_url text,
  magichire_client_id text unique not null,
  magichire_account_id text,
  api_key text unique not null,
  webhook_secret text,
  created_at timestamptz default now()
);

-- JOBS
create table jobs (
  id uuid primary key default gen_random_uuid(),
  employer_id uuid references employers(id) not null,
  magichire_job_id text unique not null,
  magichire_job_ad_id text,
  title text not null,
  url_slug text not null,
  company_name text not null,
  company_logo_url text,
  location text,
  description text,
  referral_fee numeric not null,
  fee_currency text not null default 'USD',
  payout_trigger text not null default 'at_hire',
  status text not null default 'active',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- REFERRERS
create table referrers (
  id uuid primary key,
  email text unique not null,
  full_name text not null,
  phone text not null,
  current_employer text not null,
  is_admin boolean not null default false,
  created_at timestamptz default now()
);

-- REFERRALS
create table referrals (
  id uuid primary key default gen_random_uuid(),
  job_id uuid references jobs(id) not null,
  referrer_id uuid references referrers(id) not null,
  referee_name text not null,
  referee_email text not null,
  referee_phone text,
  relationship_duration text not null,
  relationship_context text not null,
  why_referring text not null,
  status text not null default 'submitted',
  magichire_candidate_id text,
  magichire_application_id text,
  magichire_task_id text,
  magichire_push_status text not null default 'pending',
  magichire_push_error text,
  is_flagged boolean not null default false,
  created_at timestamptz default now()
);

-- AUTO-UPDATE updated_at on jobs
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger jobs_updated_at
  before update on jobs
  for each row execute function update_updated_at();

-- INDEXES
create index idx_jobs_status on jobs(status) where status = 'active';
create index idx_jobs_magichire_id on jobs(magichire_job_id);
create index idx_referrals_referrer on referrals(referrer_id);
create index idx_referrals_job on referrals(job_id);
create index idx_referrals_push_status on referrals(magichire_push_status)
  where magichire_push_status in ('pending', 'failed_candidate', 'failed_application');

-- ROW LEVEL SECURITY
alter table employers enable row level security;
alter table jobs enable row level security;
alter table referrers enable row level security;
alter table referrals enable row level security;

-- jobs: public read for active jobs only
create policy "Public can view active jobs"
  on jobs for select
  to anon, authenticated
  using (status = 'active');

-- referrers: users manage their own row only
create policy "Referrers can read own profile"
  on referrers for select
  to authenticated
  using (auth.uid() = id);

create policy "Referrers can insert own profile"
  on referrers for insert
  to authenticated
  with check (auth.uid() = id);

create policy "Referrers can update own profile"
  on referrers for update
  to authenticated
  using (auth.uid() = id);

-- referrals: users manage their own referrals only
create policy "Referrers can read own referrals"
  on referrals for select
  to authenticated
  using (auth.uid() = referrer_id);

create policy "Referrers can insert own referrals"
  on referrals for insert
  to authenticated
  with check (auth.uid() = referrer_id);

-- employers: no public access (service role only)
-- No policies needed — RLS enabled with no policies = no access
