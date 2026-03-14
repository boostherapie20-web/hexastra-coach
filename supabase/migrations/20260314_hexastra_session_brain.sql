-- HexAstra Session Brain / KS.FUSION.V13
-- Ajoute les champs nécessaires au pilotage de session.

alter table if exists public.session_state
  add column if not exists has_shown_micro_readings boolean default false,
  add column if not exists last_emotional_state text,
  add column if not exists last_timing text,
  add column if not exists last_precision text,
  add column if not exists last_reading_level text;

create table if not exists public.user_memory (
  user_id uuid primary key references auth.users(id) on delete cascade,
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
  id uuid primary key,
  updated_at timestamptz default now()
);

create table if not exists public.conversation_messages (
  id bigserial primary key,
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  role text not null,
  content text not null,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

create table if not exists public.session_state (
  conversation_id uuid primary key references public.conversations(id) on delete cascade,
  current_theme text,
  current_context_type text,
  menu_level text,
  last_selected_menu_key text,
  last_selected_submenu_key text,
  active_flow text,
  current_domain_route text,
  active_module text,
  has_shown_micro_readings boolean default false,
  last_emotional_state text,
  last_timing text,
  last_precision text,
  last_reading_level text,
  updated_at timestamptz default now()
);
