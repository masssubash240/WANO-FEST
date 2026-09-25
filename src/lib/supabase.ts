import { createClient } from '@supabase/supabase-js';

// 1. Wano Fest Supabase Project
const WANO_SUPABASE_URL =
  (import.meta.env.VITE_WANO_SUPABASE_URL as string) ||
  (import.meta.env.VITE_SUPABASE_URL as string) ||
  'https://ajntopxhnbposllktkgv.supabase.co';
const WANO_SUPABASE_ANON_KEY =
  (import.meta.env.VITE_WANO_SUPABASE_ANON_KEY as string) ||
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string) ||
  'sb_publishable_wNX8LCY3iAye8gCKx4C3mQ__JrbdYRr';

// 2. Pitch Perfect Supabase Project
const PITCH_SUPABASE_URL =
  (import.meta.env.VITE_PITCH_SUPABASE_URL as string) ||
  'https://jonddiwnixoajiylqznx.supabase.co';
const PITCH_SUPABASE_ANON_KEY =
  (import.meta.env.VITE_PITCH_SUPABASE_ANON_KEY as string) ||
  'sb_publishable_6gNaBjAP8o1Ble91QjTQtg_XOvE3us0';

export const supabase = createClient(WANO_SUPABASE_URL, WANO_SUPABASE_ANON_KEY);
export const pitchSupabase = createClient(PITCH_SUPABASE_URL, PITCH_SUPABASE_ANON_KEY);


// ─── Supabase SQL to run in your Supabase Dashboard → SQL Editor ─────────────
//
// 1. Allow guest/public registrations without requiring an account:
// ALTER TABLE public.registrations ALTER COLUMN user_id DROP NOT NULL;
//
// 2. Enable RLS and allow public/anon & authenticated registrations:
// ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;
// ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
//
// DROP POLICY IF EXISTS "Allow anon insert to registrations" ON public.registrations;
// DROP POLICY IF EXISTS "Allow authenticated insert to registrations" ON public.registrations;
// DROP POLICY IF EXISTS "Allow public select on registrations" ON public.registrations;
//
// CREATE POLICY "Allow anon insert to registrations" 
// ON public.registrations FOR INSERT TO anon WITH CHECK (true);
//
// CREATE POLICY "Allow authenticated insert to registrations" 
// ON public.registrations FOR INSERT TO authenticated WITH CHECK (true);
//
// CREATE POLICY "Allow public select on registrations" 
// ON public.registrations FOR SELECT TO anon, authenticated USING (true);
//
// DROP POLICY IF EXISTS "Allow anon insert to team_members" ON public.team_members;
// DROP POLICY IF EXISTS "Allow authenticated insert to team_members" ON public.team_members;
// DROP POLICY IF EXISTS "Allow public select on team_members" ON public.team_members;
//
// CREATE POLICY "Allow anon insert to team_members" 
// ON public.team_members FOR INSERT TO anon WITH CHECK (true);
//
// CREATE POLICY "Allow authenticated insert to team_members" 
// ON public.team_members FOR INSERT TO authenticated WITH CHECK (true);
//
// CREATE POLICY "Allow public select on team_members" 
// ON public.team_members FOR SELECT TO anon, authenticated USING (true);
//
// 2. Add missing events to events table:
// INSERT INTO public.events (event_name, slug, event_type, description, is_active)
// VALUES 
//   ('Pitch Perfect ''26', 'pitch-perfect-26', 'technical', 'Think Big • Pitch Bold • ₹20K Cash Challenge', true),
//   ('Quiz (Will of D — Anime & Tech)', 'quiz-will-of-d', 'non-technical', 'Anime & Tech Quiz Competition', true),
//   ('E-Sports Arena (Gaming Championship)', 'e-sports-arena', 'non-technical', 'PUBG, Free Fire, Chess and Carrom Pool Tournament', true)
// ON CONFLICT (slug) DO NOTHING;
// ─────────────────────────────────────────────────────────────────────────────
