import { supabase, pitchSupabase } from '../lib/supabase';

// ─── Supabase table names ────────────────────────────────────────────────────
// Pitch Perfect project (jonddiwnixoajiylqznx) → pitch_registrations + pitch_team_members
// Wano Fest project  (ajntopxhnbposllktkgv) → registrations     + team_members
export const PITCH_REGISTRATIONS_TABLE = 'pitch_registrations';
export const PITCH_TEAM_MEMBERS_TABLE = 'pitch_team_members';
export const WANO_REGISTRATIONS_TABLE = 'registrations';
export const WANO_TEAM_MEMBERS_TABLE = 'team_members';

// Both clients are created by the same factory, so one type covers both projects.
type SupabaseLikeClient = typeof supabase;

// PostgREST error message emitted when a column is not present in the table.
const MISSING_COLUMN_RX = /could not find the '([^']+)' column/i;
// Postgres SQLSTATE for a row-level-security policy rejection.
const RLS_ERROR_CODE = '42501';

const isRlsError = (error: { code?: string; message?: string } | null): boolean =>
  !!error && (error.code === RLS_ERROR_CODE || /row-level security/i.test(error.message || ''));

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
  'ipl auction': '776b7a2f-3d22-49ae-8b5f-aa50e563caa2',
  'ipl-auction': '776b7a2f-3d22-49ae-8b5f-aa50e563caa2',
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
  /** Total team size (leader included). Used by the Pitch project's `team_size` column. */
  teamSize?: number;
  /** Pitch participation category, e.g. "IDEA PITCH" / "PROJECT PITCH". */
  participationCategory?: string;
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
 * Inserts a single row, automatically retrying without any column that the remote
 * PostgREST schema cache does not know (error code PGRST204).
 *
 * This keeps registrations saving even when the live table schema differs from the
 * code — e.g. the Pitch Perfect project's `pitch_registrations` table has no
 * `department`, `leader_name` or `leader_year` columns unless the optional
 * migration in `sql/pitch-supabase-setup.sql` has been applied.
 */
async function insertRowAdaptive(
  client: SupabaseLikeClient,
  table: string,
  payload: Record<string, unknown>
): Promise<{ data: { id?: string } | null; error: { message: string; code?: string } | null }> {
  const working: Record<string, unknown> = { ...payload };
  let lastError: { message: string; code?: string } | null = null;

  for (let attempt = 0; attempt < 12; attempt += 1) {
    const { data, error } = await client.from(table).insert([working]).select('id').single();
    if (!error) return { data, error: null };

    lastError = error;
    const missing = (error.message || '').match(MISSING_COLUMN_RX)?.[1];
    if (!missing || !(missing in working)) return { data: null, error };

    console.warn(`⚠️ Supabase: column "${missing}" is not present in ${table} — retrying without it.`);
    delete working[missing];
  }

  return { data: null, error: lastError };
}

/**
 * Inserts several rows at once with the same PGRST204 self-healing behaviour as
 * `insertRowAdaptive` (unknown columns are stripped from every row).
 */
async function insertRowsAdaptive(
  client: SupabaseLikeClient,
  table: string,
  rows: Array<Record<string, unknown>>
): Promise<{ error: { message: string; code?: string } | null }> {
  let working = rows.map((row) => ({ ...row }));
  let lastError: { message: string; code?: string } | null = null;

  for (let attempt = 0; attempt < 12; attempt += 1) {
    const { error } = await client.from(table).insert(working);
    if (!error) return { error: null };

    lastError = error;
    const missing = (error.message || '').match(MISSING_COLUMN_RX)?.[1];
    if (!missing || !(missing in working[0])) return { error };

    console.warn(`⚠️ Supabase: column "${missing}" is not present in ${table} — retrying without it.`);
    working = working.map((row) => {
      const next = { ...row };
      delete next[missing];
      return next;
    });
  }

  return { error: lastError };
}

/** Hint shown when Supabase rejects a write because of row-level-security policies. */
export const RLS_SETUP_HINT =
  'Supabase row-level security blocked the insert. Run sql/pitch-supabase-setup.sql in the ' +
  'Pitch Perfect Supabase SQL Editor (Project → SQL Editor) to allow public registrations.';

/**
 * Saves a registration to Supabase and returns a result object describing the outcome.
 *
 * Automatically targets the right project/table pair:
 *   • Pitch Perfect → `pitch_registrations` + `pitch_team_members`
 *   • Wano Fest     → `registrations`       + `team_members`
 *
 * Columns that do not exist in the live table are dropped automatically (PostgREST
 * PGRST204), so the function keeps storing rows even if the optional migrations in
 * `sql/pitch-supabase-setup.sql` have not been applied. Row-level-security failures
 * are reported back through `RegistrationResult.error` so the UI can surface them
 * instead of silently reporting success.
 */
export async function saveRegistrationToSupabase(
  input: RegistrationInput
): Promise<RegistrationResult> {
  try {
    const isPitch = (input.eventName || '').toLowerCase().includes('pitch');
    const targetClient = isPitch ? pitchSupabase : supabase;

    // `event_id` only applies to the Wano Fest project (it owns the `events` table).
    const eventId = isPitch ? null : await getEventUuid(input.eventName, input.eventType);

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
      const pitchPayload: Record<string, unknown> = {
        team_name: input.teamName.trim() || 'Team',
        team_size: input.teamSize ?? (input.members?.length ?? 0) + 1,
        college_name: input.collegeName.trim() || 'SSREC',
        leader_full_name: input.leaderName.trim() || 'Leader',
        leader_email: input.leaderEmail.trim() || '',
        leader_mobile: input.leaderPhone.trim() || '',
        project_title: input.projectTitle?.trim() || 'General Entry',
        participation_category: input.participationCategory?.trim() || input.eventType || 'IDEA PITCH',
        transaction_id: input.transactionId.trim() || (input.isSkippingPayment ? 'PAY-AT-VENUE' : 'NONE'),
        payment_screenshot_url: input.screenshotName || (input.isSkippingPayment ? 'PAY-AT-VENUE' : 'NONE'),
        payment_status: 'PENDING',
        // Optional rich columns — removed automatically if sql/pitch-supabase-setup.sql
        // has not been applied to this project yet.
        registration_id: input.registrationId,
        event_type: input.eventType || 'technical',
        department: input.department.trim() || 'Not Specified',
        leader_name: input.leaderName.trim() || 'Leader',
        leader_phone: input.leaderPhone.trim() || '',
        leader_department: input.leaderDepartment?.trim() || input.department.trim() || 'General',
        leader_year: input.leaderYear || '3rd Year',
        project_description: input.projectDescription?.trim() || 'No description provided.',
        ...(resolvedUserId ? { user_id: resolvedUserId } : {}),
      };
      // NOTE: `event_id` is intentionally omitted for Pitch — this project has no
      // `events` table, so a Wano-project UUID could never satisfy a foreign key.
      const pitchRes = await insertRowAdaptive(
        pitchSupabase,
        PITCH_REGISTRATIONS_TABLE,
        pitchPayload
      );
      regData = pitchRes.data;
      regError = pitchRes.error;
    } else {
      const res = await insertRowAdaptive(targetClient, WANO_REGISTRATIONS_TABLE, insertPayload);
      regData = res.data;
      regError = res.error;
    }

    if (regError) {
      const hint = isRlsError(regError) ? ` ${RLS_SETUP_HINT}` : '';
      console.warn('⚠️ Supabase registration note:', regError.message);
      return {
        success: false,
        registrationId: input.registrationId,
        error: `${regError.message}${hint}`,
      };
    }

    const createdId = regData?.id;

    // 2. Insert team members into the project's own members table
    //    Pitch → `pitch_team_members` (columns: registration_id, member_number,
    //    full_name, email, mobile) · Wano → `team_members` (full_name, email, phone…)
    if (createdId && input.members && input.members.length > 0) {
      const validMembers = input.members.filter((m) => m.name && m.name.trim().length > 0);
      if (validMembers.length > 0) {
        const membersTable = isPitch ? PITCH_TEAM_MEMBERS_TABLE : WANO_TEAM_MEMBERS_TABLE;
        const memberRows = validMembers.map((m, idx) => {
          const base: Record<string, unknown> = {
            registration_id: createdId,
            member_number: idx + 1,
            full_name: m.name.trim(),
            email: m.email?.trim() || null,
          };
          if (isPitch) {
            // The Pitch project stores the contact number in `mobile`.
            base.mobile = m.phone?.trim() || null;
          } else {
            base.phone = m.phone?.trim() || null;
          }
          // Optional columns — stripped automatically when they do not exist.
          base.department = m.department?.trim() || input.department || null;
          base.year = m.year || null;
          return base;
        });

        const { error: tmError } = await insertRowsAdaptive(targetClient, membersTable, memberRows);
        if (tmError) {
          console.warn(`⚠️ Supabase ${membersTable} note:`, tmError.message);
        } else {
          console.log(`✅ Saved ${validMembers.length} member(s) to ${membersTable}`);
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
