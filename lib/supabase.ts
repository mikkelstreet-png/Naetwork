import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://not-configured.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'not-configured'
  );
}
