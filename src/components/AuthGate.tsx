/**
 * Auth Gate Component
 * 
 * Server Component that requires authentication.
 * Redirects to home if user is not logged in.
 * 
 * Usage:
 * <AuthGate>
 *   <ProtectedContent />
 * </AuthGate>
 */

import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'

interface AuthGateProps {
  children: React.ReactNode
  redirectTo?: string
}

export async function AuthGate({
  children,
  redirectTo = '/',
}: AuthGateProps) {
  const session = await getSession()

  if (!session) {
    console.info('[AuthGate] No session found, redirecting to:', redirectTo)
    redirect(redirectTo)
  }

  return <>{children}</>
}

