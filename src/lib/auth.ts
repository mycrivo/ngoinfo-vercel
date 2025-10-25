/**
 * Authentication Helpers
 * 
 * Server-side auth utilities for session management and protection.
 */

import { redirect } from 'next/navigation'
import { createClient } from './supabaseServer'

export interface Session {
  user: {
    id: string
    email: string | undefined
    user_metadata?: Record<string, unknown>
  }
  access_token: string
  refresh_token: string
  expires_at?: number
}

/**
 * Get the current user session (server-side)
 * Returns null if not authenticated
 */
export async function getSession(): Promise<Session | null> {
  try {
    const supabase = await createClient()
    const { data: { session }, error } = await supabase.auth.getSession()

    if (error) {
      console.error('[auth] Error getting session:', error)
      return null
    }

    if (!session) {
      return null
    }

    return {
      user: {
        id: session.user.id,
        email: session.user.email,
        user_metadata: session.user.user_metadata,
      },
      access_token: session.access_token,
      refresh_token: session.refresh_token,
      expires_at: session.expires_at,
    }
  } catch (error) {
    console.error('[auth] Exception in getSession:', error)
    return null
  }
}

/**
 * Require authentication - redirect to home if not logged in
 * Use in Server Components that need auth
 */
export async function requireSession(): Promise<Session> {
  const session = await getSession()
  
  if (!session) {
    console.info('[auth] Unauthenticated access attempt, redirecting to home')
    redirect('/')
  }

  return session
}

/**
 * Check if user is authenticated (doesn't redirect)
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession()
  return session !== null
}

/**
 * Get user ID from session (convenience helper)
 */
export async function getUserId(): Promise<string | null> {
  const session = await getSession()
  return session?.user.id ?? null
}

