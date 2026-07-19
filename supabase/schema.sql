-- ProspectIQ — schema MVP
-- Pensé multi-tenant dès le départ : chaque ligne est rattachée à un user_id
-- (toi aujourd'hui, un client payant demain) et protégée par des policies RLS.

create extension if not exists "uuid-ossp";

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  created_at timestamptz not null default now()
);

create table if not exists searches (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  niche text not null,
  city text not null,
  status text not null default 'pending', -- pending | running | done | failed
  result_count int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists prospects (
  id uuid primary key default uuid_generate_v4(),
  search_id uuid not null references searches(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  category text,
  address text,
  phone text,
  website text,
  maps_url text,
  rating numeric,
  review_count int,
  raw jsonb, -- champs bruts du scraper, pour ne rien perdre
  created_at timestamptz not null default now()
);

create table if not exists audits (
  id uuid primary key default uuid_generate_v4(),
  prospect_id uuid not null references prospects(id) on delete cascade,
  has_https boolean,
  is_responsive boolean,
  load_time_ms int,
  has_seo_title boolean,
  has_meta_description boolean,
  last_social_post_days_ago int,
  raw jsonb, -- rapport Lighthouse complet
  created_at timestamptz not null default now()
);

create table if not exists scores (
  id uuid primary key default uuid_generate_v4(),
  prospect_id uuid not null references prospects(id) on delete cascade,
  total int not null,
  reasons jsonb not null,
  created_at timestamptz not null default now()
);

-- Row Level Security : chaque utilisateur ne voit que ses propres données.
alter table profiles enable row level security;
alter table searches enable row level security;
alter table prospects enable row level security;
alter table audits enable row level security;
alter table scores enable row level security;

create policy "own profile" on profiles
  for all using (auth.uid() = id);

create policy "own searches" on searches
  for all using (auth.uid() = user_id);

create policy "own prospects" on prospects
  for all using (auth.uid() = user_id);

create policy "own audits" on audits
  for all using (
    exists (
      select 1 from prospects
      where prospects.id = audits.prospect_id
      and prospects.user_id = auth.uid()
    )
  );

create policy "own scores" on scores
  for all using (
    exists (
      select 1 from prospects
      where prospects.id = scores.prospect_id
      and prospects.user_id = auth.uid()
    )
  );

-- Le worker de scraping écrit avec la service_role key, qui bypass RLS —
-- aucune policy supplémentaire n'est nécessaire pour lui.
