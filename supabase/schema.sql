-- Anokhya 3.0 — database schema
-- Run this whole file in the Supabase SQL editor. It is safe to re-run.
--
-- Design:
--   * `events`        one row per event: team size, capacity, open/closed.
--   * `registrations` one row per team (leader columns + `members` jsonb).
--   * All writes go through `register_team()`, which runs in a single
--     transaction, locks the event row, and enforces capacity + duplicates
--     so two people can never grab the last slot at the same time.
--   * Only the server (service_role key) can touch these tables/functions.
--     The anon/authenticated roles get nothing.

-- ---------------------------------------------------------------------------
-- events
-- ---------------------------------------------------------------------------
create table if not exists public.events (
  slug text primary key,
  name text not null,
  team_min int not null check (team_min >= 1),
  team_max int not null check (team_max >= team_min),
  -- Max number of TEAMS that can register. NULL = unlimited.
  capacity int check (capacity is null or capacity > 0),
  -- Flip to false in the dashboard to close registrations for one event.
  registration_open boolean not null default true
);

alter table public.events enable row level security;

-- Keep in sync with src/data/events.ts. Re-running updates names, team sizes
-- and capacity, but never touches `registration_open`.
insert into public.events (slug, name, team_min, team_max, capacity) values
  ('picture-to-prompt', 'Picture to Prompt', 2, 2, 15),
  ('bgmi', 'BGMI', 4, 4, 16),
  ('treasure-hunt', 'Treasure Hunt', 4, 5, null),
  ('radiant-clash', 'Radiant Clash — Valorant Showdown', 5, 5, 32)
on conflict (slug) do update set
  name = excluded.name,
  team_min = excluded.team_min,
  team_max = excluded.team_max,
  capacity = excluded.capacity;

-- ---------------------------------------------------------------------------
-- registrations
-- ---------------------------------------------------------------------------
create table if not exists public.registrations (
  id uuid primary key default gen_random_uuid(),
  event_slug text not null,
  team_name text,
  leader_name text not null,
  leader_email text not null,
  leader_phone text not null,
  leader_usn text not null,
  leader_department text not null,
  leader_year_sem text not null,
  -- Additional team members (excludes the leader). Empty array for solo events.
  members jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  unique (event_slug, leader_email)
);

-- Tables created by earlier copies of this file.
alter table public.registrations add column if not exists leader_department text;
alter table public.registrations add column if not exists leader_year_sem text;

do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'registrations'
      and column_name = 'leader_college'
  ) then
    alter table public.registrations alter column leader_college drop not null;
  end if;
end $$;

-- The old hard-coded slug list is replaced by a foreign key to `events`.
-- NOT VALID = enforced for new rows only, so any old test rows don't block this.
alter table public.registrations drop constraint if exists registrations_event_slug_check;
alter table public.registrations drop constraint if exists registrations_event_slug_fkey;
alter table public.registrations
  add constraint registrations_event_slug_fkey
  foreign key (event_slug) references public.events (slug) not valid;

create index if not exists registrations_event_slug_idx on public.registrations (event_slug);

alter table public.registrations enable row level security;

-- Lock everything down: the public (anon key) can no longer insert directly.
drop policy if exists "public can register" on public.registrations;
revoke all on table public.registrations from anon, authenticated;
revoke all on table public.events from anon, authenticated;

-- ---------------------------------------------------------------------------
-- register_team(): the one way to create a registration
-- ---------------------------------------------------------------------------
-- Returns jsonb:
--   {"status":"ok","id":"...","slots_left":n|null}
--   {"status":"full" | "closed" | "unknown_event" | "invalid_team_size"}
--   {"status":"duplicate","field":"email"|"usn","value":"..."}
create or replace function public.register_team(
  p_event_slug text,
  p_team_name text,
  p_leader jsonb,
  p_members jsonb
) returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_event public.events%rowtype;
  v_taken int;
  v_size int;
  v_emails text[];
  v_usns text[];
  v_conflict text;
  v_id uuid;
begin
  p_members := coalesce(p_members, '[]'::jsonb);

  -- Row lock: concurrent registrations for the same event queue up here, so
  -- the capacity and duplicate checks below can't race each other.
  select * into v_event from public.events where slug = p_event_slug for update;
  if not found then
    return jsonb_build_object('status', 'unknown_event');
  end if;

  if not v_event.registration_open then
    return jsonb_build_object('status', 'closed');
  end if;

  v_size := 1 + jsonb_array_length(p_members);
  if v_size < v_event.team_min or v_size > v_event.team_max then
    return jsonb_build_object('status', 'invalid_team_size');
  end if;

  select count(*) into v_taken from public.registrations where event_slug = p_event_slug;
  if v_event.capacity is not null and v_taken >= v_event.capacity then
    return jsonb_build_object('status', 'full');
  end if;

  -- Everyone in this submission, normalised.
  v_emails := array[lower(trim(p_leader->>'email'))]
    || array(select lower(trim(m->>'email')) from jsonb_array_elements(p_members) m);
  v_usns := array[upper(trim(p_leader->>'usn'))]
    || array(select upper(trim(m->>'usn')) from jsonb_array_elements(p_members) m);

  -- Is anyone already registered for this event, as a leader OR as a member?
  select e into v_conflict
  from (
    select lower(r.leader_email) as e
      from public.registrations r where r.event_slug = p_event_slug
    union all
    select lower(m->>'email')
      from public.registrations r, jsonb_array_elements(r.members) m
      where r.event_slug = p_event_slug
  ) x
  where e = any (v_emails)
  limit 1;
  if found then
    return jsonb_build_object('status', 'duplicate', 'field', 'email', 'value', v_conflict);
  end if;

  select u into v_conflict
  from (
    select upper(r.leader_usn) as u
      from public.registrations r where r.event_slug = p_event_slug
    union all
    select upper(m->>'usn')
      from public.registrations r, jsonb_array_elements(r.members) m
      where r.event_slug = p_event_slug
  ) x
  where u = any (v_usns)
  limit 1;
  if found then
    return jsonb_build_object('status', 'duplicate', 'field', 'usn', 'value', v_conflict);
  end if;

  insert into public.registrations (
    event_slug, team_name, leader_name, leader_email, leader_phone,
    leader_usn, leader_department, leader_year_sem, members
  ) values (
    p_event_slug,
    nullif(trim(p_team_name), ''),
    trim(p_leader->>'name'),
    lower(trim(p_leader->>'email')),
    trim(p_leader->>'phone'),
    upper(trim(p_leader->>'usn')),
    trim(p_leader->>'department'),
    trim(p_leader->>'yearSem'),
    p_members
  ) returning id into v_id;

  return jsonb_build_object(
    'status', 'ok',
    'id', v_id,
    'slots_left', case when v_event.capacity is null then null
                       else v_event.capacity - v_taken - 1 end
  );
exception
  when unique_violation then
    return jsonb_build_object(
      'status', 'duplicate', 'field', 'email',
      'value', lower(trim(p_leader->>'email'))
    );
end;
$$;

-- ---------------------------------------------------------------------------
-- event_slots(): live availability per event (used by /api/events/slots)
-- ---------------------------------------------------------------------------
create or replace function public.event_slots()
returns table (slug text, capacity int, registered int, registration_open boolean)
language sql
stable
security definer
set search_path = public
as $$
  select e.slug,
         e.capacity,
         (select count(*)::int from public.registrations r where r.event_slug = e.slug),
         e.registration_open
  from public.events e
  order by e.slug;
$$;

revoke all on function public.register_team(text, text, jsonb, jsonb) from public, anon, authenticated;
revoke all on function public.event_slots() from public, anon, authenticated;
grant execute on function public.register_team(text, text, jsonb, jsonb) to service_role;
grant execute on function public.event_slots() to service_role;
