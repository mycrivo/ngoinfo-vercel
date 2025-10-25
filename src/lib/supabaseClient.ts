/**
 * Supabase Browser Client
 * 
 * Uses public anon key - safe for client-side use.
 * All database access is protected by Row-Level Security (RLS).
 */

import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('[supabase] Missing required environment variables: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)

