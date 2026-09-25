import { supabase, pitchSupabase } from '../lib/supabase';

// Map of symposium event titles to their respective UUIDs in the Supabase `events` table
export const SUPABASE_EVENT_MAP: Record<string, string> = {
  // Technical Events
  'pitch perfect': 'a253377d-9ce0-4c81-bf89-426011ec747c',
  'capture the flag': '6a55cef0-d253-4b38-bded-ff6f8c01904d',
  'coding challenge': '87e8098f-6982-444f-b0ab-f469ddde4c6b',
  'ai prompt': '0a82da74-88b8-44f0-b548-23a49f9b3868',
  'ui/ux challenge': '567603eb-c666-486f-9a23-38711b932485',
  'project expo': 'c99a5091-431b-441f-be41-cbeb7b4386de',
  'paper presentation': 'b06d973d-cc64-4e61-9b27-6543b8edb689',

  // Non-Technical Events
  'quiz': 'aec83b6f-847b-4270-9ea3-14563cf13d58',
  'treasure hunt': '23371ba2-991b-4c54-9346-803844a51a0a',
  'dance': '517fd861-66f9-47e9-a683-180cae6a6932',
  'singing': '4d8a6863-0cff-4154-a050-88218ae06f01',
  'photography': 'b67c9eaf-f766-4f69-9f34-847fbed33105',
  'videography': 'e0e85e80-5cca-433f-9aab-9148922b34d4',
  'short film': '2fb71c45-3711-48b2-b97e-95969643f1b4',
  'e-sports': '776b7a2f-3d22-49ae-8b5f-aa50e563caa2',
  'esports': '776b7a2f-3d22-49ae-8b5f-aa50e563caa2',
};

export interface RegistrationInput {
  registrationId: string;
  eventName: string;
  eventType: string;
  teamName: string;
  collegeName: string;
  department: string;
  leaderName: string;
  leaderEmail: string;
  leaderPhone: string;
  leaderDepartment?: string;
  leaderYear?: string;
  projectTitle?: string;
  projectDescription?: string;
  transactionId: string;
  screenshotName?: string;
  isSkippingPayment?: boolean;
  userId?: string | null;
  members?: Array<{
    name: string;
    email?: string;
    phone?: string;
    department?: string;
    year?: string;
  }>;
}

export interface RegistrationResult {
  success: boolean;
  registrationId: string;
  supabaseId?: string;
  error?: string;
}

/**
 * Resolves the Supabase `event_id` UUID matching the event name.
 */
export async function getEventUuid(eventName: string, eventType: string = 'technical'): Promise<string | null> {
  const norm = (eventName || '').toLowerCase().trim();
  const isPitch = norm.includes('pitch');
  const targetClient = isPitch ? pitchSupabase : supabase;

  // 1. Dynamic lookup from Supabase `events` table first (to ensure FK validity)
  try {
    const { data: dbEvents } = await targetClient.from('events').select('id, event_name, slug');
    if (dbEvents && dbEvents.length > 0) {
      const match = dbEvents.find(
        (e) =>
          norm.includes(e.event_name.toLowerCase()) ||
          e.event_name.toLowerCase().includes(norm) ||
          norm.includes(e.slug)
      );
      if (match) return match.id;
      // If we have events in DB and direct match fails, check static map against db events
      for (const [key, uuid] of Object.entries(SUPABASE_EVENT_MAP)) {
        if (norm.includes(key) || key.includes(norm)) {
          const exists = dbEvents.some((e) => e.id === uuid);
          if (exists) return uuid;
        }
      }
      return dbEvents[0].id;
    }
  } catch {
    // ignore query failure
  }

  // 2. Direct match in static map if DB was unreachable
  for (const [key, uuid] of Object.entries(SUPABASE_EVENT_MAP)) {
    if (norm.includes(key) || key.includes(norm)) {
      return uuid;
    }
  }

  return null;
}

/**
 * Saves registration to Supabase (`registrations` + `team_members` tables).
 * Automatically chooses the appropriate Supabase project (Pitch Perfect vs Wano Fest).
 */
export async function saveRegistrationToSupabase(
  input: RegistrationInput
): Promise<RegistrationResult> {
  try {
    const isPitch = (input.eventName || '').toLowerCase().includes('pitch');
    const targetClient = isPitch ? pitchSupabase : supabase;

    const eventId = await getEventUuid(input.eventName, input.eventType);

    const { data: { session } } = await targetClient.auth.getSession();
    const resolvedUserId = input.userId ?? session?.user?.id ?? null;

    // Build insert payload
    const insertPayload: Record<string, unknown> = {
      registration_id: input.registrationId,
      event_id: eventId,
      event_type: input.eventType || 'technical',
      team_name: input.teamName.trim() || 'Team',
      college_name: input.collegeName.trim() || 'SSREC',
      department: input.department.trim() || 'Not Specified',
      leader_name: input.leaderName.trim() || 'Leader',
      leader_email: input.leaderEmail.trim() || '',
      leader_phone: input.leaderPhone.trim() || '',
      leader_department: input.leaderDepartment?.trim() || input.department.trim() || 'General',
      leader_year: input.leaderYear || '3rd Year',
      project_title: input.projectTitle?.trim() || 'General Entry',
      project_description: input.projectDescription?.trim() || 'No description provided.',
      transaction_id: input.transactionId.trim() || (input.isSkippingPayment ? 'PAY-AT-VENUE' : 'NONE'),
      payment_screenshot_url: input.screenshotName || (input.isSkippingPayment ? 'PAY-AT-VENUE' : 'NONE'),
      payment_status: 'PENDING',
    };

    if (resolvedUserId) {
      insertPayload.user_id = resolvedUserId;
    }

    // 1. Insert into registrations or pitch_registrations table
    let regData: any = null;
    let regError: any = null;

    if (isPitch) {
      const pitchPayload = {
        team_name: input.teamName.trim() || 'Team',
        college_name: input.collegeName.trim() || 'SSREC',
        leader_email: input.leaderEmail.trim() || '',
        project_title: input.projectTitle?.trim() || 'General Entry',
        transaction_id: input.transactionId.trim() || 'NONE',
        payment_status: 'PENDING',
      };
      const pitchRes = await targetClient
        .from('pitch_registrations')
        .insert([pitchPayload])
        .select('id')
        .single();
      regData = pitchRes.data;
      regError = pitchRes.error;
    } else {
      const res = await targetClient
        .from('registrations')
        .insert([insertPayload])
        .select('id')
        .single();
      regData = res.data;
      regError = res.error;
    }

    if (regError) {
      console.warn('⚠️ Supabase registration note:', regError.message);
      return {
        success: false,
        registrationId: input.registrationId,
        error: regError.message,
      };
    }

    const createdId = regData?.id;

    // 2. Insert team members into team_members table
    if (createdId && input.members && input.members.length > 0) {
      const validMembers = input.members.filter((m) => m.name && m.name.trim().length > 0);
      if (validMembers.length > 0) {
        const { error: tmError } = await supabase.from('team_members').insert(
          validMembers.map((m, idx) => ({
            registration_id: createdId,
            member_number: idx + 1,
            full_name: m.name.trim(),
            email: m.email?.trim() || null,
            phone: m.phone?.trim() || null,
            department: m.department?.trim() || input.department || null,
            year: m.year || null,
          }))
        );
        if (tmError) {
          console.warn('⚠️ Supabase team_members note:', tmError.message);
        } else {
          console.log(`✅ Saved ${validMembers.length} member(s) to team_members`);
        }
      }
    }

    console.log('✅ Supabase registration completed successfully:', input.registrationId);
    return {
      success: true,
      registrationId: input.registrationId,
      supabaseId: createdId,
    };
  } catch (err: any) {
    console.warn('⚠️ Supabase save exception:', err);
    return {
      success: false,
      registrationId: input.registrationId,
      error: err?.message || 'Unknown error',
    };
  }
}

/**
 * Saves a backup copy in browser localStorage so registration data is never lost.
 */
export function saveLocalBackup(input: RegistrationInput): void {
  try {
    const KEY = 'ssrec_registered_events_backup';
    const existing = JSON.parse(localStorage.getItem(KEY) || '[]');
    existing.push({
      ...input,
      savedAt: new Date().toISOString(),
    });
    localStorage.setItem(KEY, JSON.stringify(existing.slice(-100)));
  } catch {
    // Storage quota or private mode fallback
  }
}
