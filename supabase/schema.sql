-- Run once in the Supabase project's SQL Editor (Dashboard → SQL Editor → New query).
-- Creates the shared `teams` table that every device reads/writes and
-- subscribes to for realtime updates. RLS is wide open (no auth) by design —
-- this is a lightweight tool for one event, not a multi-tenant app.

create extension if not exists pgcrypto;

create table teams (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  completed boolean[] not null default array_fill(false, array[9]),
  photos text[] not null default array_fill(null::text, array[9]),
  memos text[] not null default array_fill(null::text, array[9]),
  created_at timestamptz not null default now()
);

alter table teams enable row level security;

create policy "public read"   on teams for select using (true);
create policy "public insert" on teams for insert with check (true);
create policy "public update" on teams for update using (true);
create policy "public delete" on teams for delete using (true);

alter publication supabase_realtime add table teams;
