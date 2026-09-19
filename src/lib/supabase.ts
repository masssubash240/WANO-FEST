import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL as string) || 'https://ajntopxhnbposllktkgv.supabase.co';
const SUPABASE_ANON_KEY = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || 'sb_publishable_wNX8LCY3iAye8gCKx4C3mQ__JrbdYRr';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ─── Supabase SQL to run in your Supabase Dashboard → SQL Editor ─────────────
//
// CREATE TABLE IF NOT EXISTS public.registrations (
//   id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
//   created_at timestamptz DEFAULT now(),
//   registration_id text,
//   team_name text,
//   event_type text,
//   event_name text,
//   college text,
//   department text,
//   leader_name text,
//   leader_email text,
//   leader_phone text,
//   leader_department text,
//   leader_year text,
//   member1_name text, member1_email text, member1_phone text, member1_department text, member1_year text,
//   member2_name text, member2_email text, member2_phone text, member2_department text, member2_year text,
//   member3_name text, member3_email text, member3_phone text, member3_department text, member3_year text,
//   member4_name text, member4_email text, member4_phone text, member4_department text, member4_year text,
//   project_title text,
//   description text,
//   transaction_id text,
//   payment_screenshot_name text,
//   user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
//   submitted_at timestamptz DEFAULT now()
// );
//
// ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;
// CREATE POLICY "Authenticated users can insert" ON public.registrations FOR INSERT TO authenticated WITH CHECK (true);
// CREATE POLICY "Users can view own" ON public.registrations FOR SELECT USING (auth.uid() = user_id);
// CREATE POLICY "Anon can insert" ON public.registrations FOR INSERT TO anon WITH CHECK (true);
// ─────────────────────────────────────────────────────────────────────────────
