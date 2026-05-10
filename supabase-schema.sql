-- ============================================================
--  Dr. Sarah Khan — Supabase Database Schema
--  Run this SQL in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- 1. APPOINTMENTS TABLE
-- ─────────────────────
create table if not exists public.appointments (
  id               text primary key,
  reference_number text not null unique,
  type             text not null,
  date             text not null,
  time_slot        text not null,
  patient_name     text not null,
  patient_age      text not null,
  patient_gender   text not null,
  phone            text not null,
  email            text,
  patient_type     text not null,
  reason           text,
  has_reports      boolean default false,
  status           text not null default 'confirmed',
  fee              integer not null,
  created_at       timestamptz default now()
);

-- 2. ADMIN SETTINGS TABLE
-- ────────────────────────
create table if not exists public.admin_settings (
  id               integer primary key default 1,
  blocked_dates    text[] default '{}',
  partial_dates    text[] default '{}',
  blocked_time_slots jsonb default '{}',
  clinic_open      boolean default true,
  last_updated     timestamptz default now(),
  constraint single_row check (id = 1)
);

-- Insert default settings row (only once)
insert into public.admin_settings (id)
values (1)
on conflict (id) do nothing;

-- ============================================================
--  ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Enable RLS
alter table public.appointments   enable row level security;
alter table public.admin_settings enable row level security;

-- APPOINTMENTS policies
-- Anyone can INSERT (book an appointment)
create policy "Anyone can book appointment"
  on public.appointments for insert
  to anon, authenticated
  with check (true);

-- Anyone can read appointments (needed for "My Appointments" per-user view)
create policy "Anyone can read appointments"
  on public.appointments for select
  to anon, authenticated
  using (true);

-- Anyone can update appointment status (cancel)
create policy "Anyone can update appointment"
  on public.appointments for update
  to anon, authenticated
  using (true);

-- ADMIN SETTINGS policies
-- Anyone can read settings (public calendar availability)
create policy "Anyone can read settings"
  on public.admin_settings for select
  to anon, authenticated
  using (true);

-- Anyone can update settings (admin panel password-protected at app level)
create policy "Anyone can update settings"
  on public.admin_settings for update
  to anon, authenticated
  using (true);

-- ============================================================
--  INDEXES for performance
-- ============================================================
create index if not exists idx_appointments_date     on public.appointments (date);
create index if not exists idx_appointments_status   on public.appointments (status);
create index if not exists idx_appointments_phone    on public.appointments (phone);
create index if not exists idx_appointments_created  on public.appointments (created_at desc);

-- ============================================================
--  DONE ✓
--  Now copy your Project URL and anon key into .env file
-- ============================================================

-- ============================================================
--  SITE SETTINGS TABLE (Website content editable from admin)
-- ============================================================
create table if not exists public.site_settings (
  id         integer primary key default 1,
  content    jsonb not null default '{}',
  updated_at timestamptz default now(),
  constraint single_row check (id = 1)
);

insert into public.site_settings (id, content)
values (1, '{}')
on conflict (id) do nothing;

-- RLS
alter table public.site_settings enable row level security;

create policy "Anyone can read site settings"
  on public.site_settings for select
  to anon, authenticated
  using (true);

create policy "Anyone can update site settings"
  on public.site_settings for update
  to anon, authenticated
  using (true);
