import { createClient } from "@supabase/supabase-js";

// Lazy singleton — throws a clear error if env vars are missing
let _client: ReturnType<typeof createClient> | null = null;

export function getSupabase(): any {
  if (_client) return _client;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "[Supabase] Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.\n" +
        "Add them to your .env.local file:\n" +
        "  SUPABASE_URL=https://<project>.supabase.co\n" +
        "  SUPABASE_SERVICE_ROLE_KEY=eyJ..."
    );
  }

  _client = createClient(url, key, {
    auth: { persistSession: false },
  });

  return _client;
}
