/**
 * Supabase Server Client
 * 
 * CRITICAL: Uses service role key - bypasses RLS.
 * NEVER import this file in client components.
 * Use only in:
 * - Server Components
 * - API Route Handlers
 * - Server Actions
 */

import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error('[supabase] Missing required server environment variables')
}

/**
 * Create a Supabase client for Server Components
 * Uses cookies for session management
 */
export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(supabaseUrl, supabaseServiceRoleKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value, ...options })
        } catch (error) {
          // Handle cookie errors in middleware/edge runtime
          console.error('[supabase] Failed to set cookie:', error)
        }
      },
      remove(name: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value: '', ...options })
        } catch (error) {
          console.error('[supabase] Failed to remove cookie:', error)
        }
      },
    },
  })
}

/**
 * Create an admin Supabase client with service role key
 * Bypasses RLS - use with extreme caution
 */
export function createAdminClient() {
  return createServerClient(supabaseUrl, supabaseServiceRoleKey, {
    cookies: {},
  })
}

