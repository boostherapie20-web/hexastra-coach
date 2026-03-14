create table if not exists public.user_memory (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique references auth.users(id) on delete cascade,
  main_goal text,
  life_context text,
  life_phase text,
  dominant_life_zone text,
  dominant_potential text,
  reading_level text,
  last_profile_reading_at timestamptz,
  last_year_reading_at timestamptz,
  last_month_reading_at timestamptz,
  updated_at timestamptz default now()
);

create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  title text,
  context_type text,
  mode_at_creation text,
  language text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.conversation_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid references public.conversations(id) on delete cascade,
  role text not null,
  content text not null,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

create table if not exists public.session_state (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid unique references public.conversations(id) on delete cascade,
  current_theme text,
  current_context_type text,
  menu_level text,
  last_selected_menu_key text,
  last_selected_submenu_key text,
  active_flow text,
  updated_at timestamptz default now()
);

alter table public.profiles add column if not exists language text default 'fr';
alter table public.profiles add column if not exists first_name text;
alter table public.profiles add column if not exists birth_date text;
alter table public.profiles add column if not exists birth_time text;
alter table public.profiles add column if not exists birth_location text;
alter table public.profiles add column if not exists practitioner_usage text;


alter table public.session_state add column if not exists current_domain_route text;
alter table public.session_state add column if not exists active_module text;
