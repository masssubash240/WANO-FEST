-- ============================================================================
--  SSREC — Pitch Perfect Supabase setup
--  Project: jonddiwnixoajiylqznx  (https://jonddiwnixoajiylqznx.supabase.co)
-- ============================================================================
--  WHY THIS IS NEEDED
--  ---------------------------------------------------------------------------
--  The website writes Pitch Perfect registrations with the PUBLIC (anon)
--  publishable key. Two database-side problems prevented rows from ever being
--  stored in the Pitch project (the UI still said "Registration Confirmed"):
--
--   1. ROW LEVEL SECURITY — `pitch_registrations`, `pitch_team_members` and
--      `registrations` have RLS enabled but no INSERT policy for `anon`, so
--      PostgREST rejected every insert with:
--          42501  new row violates row-level security policy
--
--   2. SCHEMA MISMATCH — the live `pitch_registrations` table only had:
--          id, team_name, team_size, college_name, leader_full_name,
--          leader_email, leader_mobile, project_title, participation_category,
--          transaction_id, payment_screenshot_url, payment_status,
--          created_at, updated_at
--      and `pitch_team_members` only had:
--          id, registration_id, member_number, full_name, email, mobile,
--          created_at
--      (there is no `department`, `leader_name`, `leader_year`,
--       `project_description`, `event_id` column, and no `events` table.)
--
--  HOW TO RUN
--  ---------------------------------------------------------------------------
--  Supabase Dashboard → project `jonddiwnixoajiylqznx` → SQL Editor →
--  New query → paste this whole file → Run.
--  Safe to re-run: every statement is idempotent.
-- ============================================================================

-- ─── 1. Tables (created only if they do not exist yet) ──────────────────────
CREATE TABLE IF NOT EXISTS public.pitch_registrations (
  id                     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_name              TEXT,
  team_size              INT DEFAULT 1,
  college_name           TEXT,
  leader_full_name       TEXT,
  leader_email           TEXT,
  leader_mobile          TEXT,
  project_title          TEXT,
  participation_category TEXT,
  transaction_id         TEXT,
  payment_screenshot_url TEXT,
  payment_status         TEXT DEFAULT 'PENDING',
  created_at             TIMESTAMPTZ DEFAULT NOW(),
  updated_at             TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.pitch_team_members (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id UUID REFERENCES public.pitch_registrations(id) ON DELETE CASCADE,
  member_number   INT,
  full_name       TEXT,
  email           TEXT,
  mobile          TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ─── 2. Optional extra columns the app also sends ───────────────────────────
--  The front-end tolerates missing columns (it retries without them), but
--  adding them keeps the full registration payload (team members' department,
--  year, payment status history, ...) available for reporting.
ALTER TABLE public.pitch_registrations
  ADD COLUMN IF NOT EXISTS registration_id      TEXT,
  ADD COLUMN IF NOT EXISTS event_type           TEXT DEFAULT 'technical',
  ADD COLUMN IF NOT EXISTS department           TEXT,
  ADD COLUMN IF NOT EXISTS leader_name          TEXT,
  ADD COLUMN IF NOT EXISTS leader_phone         TEXT,
  ADD COLUMN IF NOT EXISTS leader_department    TEXT,
  ADD COLUMN IF NOT EXISTS leader_year          TEXT,
  ADD COLUMN IF NOT EXISTS project_description  TEXT,
  ADD COLUMN IF NOT EXISTS user_id              UUID;

ALTER TABLE public.pitch_team_members
  ADD COLUMN IF NOT EXISTS department TEXT,
  ADD COLUMN IF NOT EXISTS year       TEXT,
  ADD COLUMN IF NOT EXISTS phone      TEXT;

-- Unique registration ids (added only when the column has no duplicates yet).
CREATE UNIQUE INDEX IF NOT EXISTS pitch_registrations_registration_id_key
  ON public.pitch_registrations (registration_id);

-- ─── 3. Row Level Security policies (this is the actual blocker) ─────────────
--  Registrations are submitted by the public site with the anon publishable key,
--  so anon + authenticated both need INSERT (and SELECT for the admin views).
ALTER TABLE public.pitch_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pitch_team_members  ENABLE ROW LEVEL SECURITY;

-- pitch_registrations --------------------------------------------------------
DROP POLICY IF EXISTS "pitch_registrations public insert" ON public.pitch_registrations;
DROP POLICY IF EXISTS "pitch_registrations public select" ON public.pitch_registrations;
DROP POLICY IF EXISTS "pitch_registrations public update" ON public.pitch_registrations;

CREATE POLICY "pitch_registrations public insert"
  ON public.pitch_registrations FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "pitch_registrations public select"
  ON public.pitch_registrations FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "pitch_registrations public update"
  ON public.pitch_registrations FOR UPDATE TO anon, authenticated
  USING (true) WITH CHECK (true);

-- pitch_team_members ---------------------------------------------------------
DROP POLICY IF EXISTS "pitch_team_members public insert" ON public.pitch_team_members;
DROP POLICY IF EXISTS "pitch_team_members public select" ON public.pitch_team_members;
DROP POLICY IF EXISTS "pitch_team_members public update" ON public.pitch_team_members;

CREATE POLICY "pitch_team_members public insert"
  ON public.pitch_team_members FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "pitch_team_members public select"
  ON public.pitch_team_members FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "pitch_team_members public update"
  ON public.pitch_team_members FOR UPDATE TO anon, authenticated
  USING (true) WITH CHECK (true);

-- registrations (legacy table in this project — keeps already-deployed builds working)
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "registrations public insert" ON public.registrations;
DROP POLICY IF EXISTS "registrations public select" ON public.registrations;
DROP POLICY IF EXISTS "registrations public update" ON public.registrations;

CREATE POLICY "registrations public insert"
  ON public.registrations FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "registrations public select"
  ON public.registrations FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "registrations public update"
  ON public.registrations FOR UPDATE TO anon, authenticated
  USING (true) WITH CHECK (true);

-- NOTE: this project has no `team_members` and no `events` table. The app writes
-- team members to `pitch_team_members`, and Pitch registrations intentionally do
-- not carry an `event_id` (there is no `events` table to reference).

-- ─── 4. Verify ──────────────────────────────────────────────────────────────
-- 4a. Policies in place (expect 3 rows per table):
--   SELECT tablename, policyname, cmd, roles
--     FROM pg_policies
--    WHERE tablename IN ('pitch_registrations', 'pitch_team_members')
--    ORDER BY tablename, cmd;
--
-- 4b. Submit one test registration from the /#pitch-perfect page, then run:
--   SELECT registration_id, team_name, team_size, leader_full_name, leader_mobile,
--          participation_category, payment_status, created_at
--     FROM public.pitch_registrations
--    ORDER BY created_at DESC LIMIT 5;
--
--   SELECT member_number, full_name, email, mobile
--     FROM public.pitch_team_members
--    ORDER BY created_at DESC LIMIT 5;
--
-- 4c. If the browser console shows
--       "Supabase: column \"xxx\" is not present in pitch_registrations"
--     the app is still saving correctly — it simply retries without the optional
--     column listed in section 2 of this file.
