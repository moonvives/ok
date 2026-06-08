-- Optional Lovable/Supabase schema for a private hosted version.
-- Use only if Sara wants login/cloud sync. Otherwise keep localStorage.

create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null unique,
  name text not null default 'Sara Ruth',
  height_cm numeric not null default 164,
  age int not null default 23,
  sex text not null default 'Feminino',
  target_weight_kg numeric not null default 54,
  created_at timestamptz not null default now()
);

create table if not exists weight_logs (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null,
  logged_on date not null,
  weight_kg numeric not null,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists daily_metrics (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null,
  logged_on date not null,
  sleep_hours numeric,
  resting_heart_rate numeric,
  hrv_ms numeric,
  steps int,
  active_minutes int,
  calories_consumed int,
  protein_g numeric,
  stress_level numeric,
  menstrual_phase text,
  created_at timestamptz not null default now()
);

create table if not exists daily_checks (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null,
  checked_on date not null,
  key text not null,
  completed boolean not null default false,
  created_at timestamptz not null default now(),
  unique(owner_user_id, checked_on, key)
);

alter table profiles enable row level security;
alter table weight_logs enable row level security;
alter table daily_metrics enable row level security;
alter table daily_checks enable row level security;

create policy "private profiles" on profiles for all using (auth.uid() = owner_user_id) with check (auth.uid() = owner_user_id);
create policy "private weight logs" on weight_logs for all using (auth.uid() = owner_user_id) with check (auth.uid() = owner_user_id);
create policy "private daily metrics" on daily_metrics for all using (auth.uid() = owner_user_id) with check (auth.uid() = owner_user_id);
create policy "private daily checks" on daily_checks for all using (auth.uid() = owner_user_id) with check (auth.uid() = owner_user_id);
