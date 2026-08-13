import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { env, hasSupabaseConfig } from './env.js';

let client: SupabaseClient | null = null;

/** Lazily-created Supabase client using the service-role key. Server-only — never import from src/. */
export function getSupabaseClient(): SupabaseClient {
  if (!hasSupabaseConfig()) {
    throw new Error(
      'Supabase is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY before submitting or reading diagnostic results.'
    );
  }
  if (!client) {
    client = createClient(env.SUPABASE_URL!, env.SUPABASE_SERVICE_ROLE_KEY!, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return client;
}
