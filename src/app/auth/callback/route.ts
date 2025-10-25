/**
 * Supabase Auth Callback Handler
 * 
 * Handles the OAuth redirect from Supabase after authentication.
 * Sets the session cookie and redirects to dashboard.
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabaseServer'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') ?? '/dashboard'

  if (code) {
    try {
      const supabase = await createClient()
      
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        console.error('[auth/callback] Error exchanging code for session:', error)
        return NextResponse.redirect(new URL('/?error=auth_error', requestUrl.origin))
      }

      console.info('[auth/callback] Session established, redirecting to:', next)
      return NextResponse.redirect(new URL(next, requestUrl.origin))
    } catch (error) {
      console.error('[auth/callback] Exception in callback:', error)
      return NextResponse.redirect(new URL('/?error=auth_error', requestUrl.origin))
    }
  }

  // No code provided - redirect to home
  console.warn('[auth/callback] No code provided in callback')
  return NextResponse.redirect(new URL('/', requestUrl.origin))
}

