/**
 * Proposal Download API
 * 
 * GET /api/proposals/download?id=<proposalId>
 * - Requires authentication
 * - Verifies ownership
 * - Returns signed URL for proposal export
 */

import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { createProposalExportUrl } from '@/lib/storage'
import { createClient } from '@/lib/supabaseServer'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Auth check
    const session = await getSession()
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const userId = session.user.id

    // Get proposal ID from query params
    const { searchParams } = new URL(request.url)
    const proposalId = searchParams.get('id')

    if (!proposalId) {
      return NextResponse.json(
        { error: 'Missing proposal ID' },
        { status: 400 }
      )
    }

    // Verify ownership
    const supabase = await createClient()
    
    const { data: proposal, error } = await supabase
      .from('proposals')
      .select('id, user_id, title')
      .eq('id', proposalId)
      .single()

    if (error || !proposal) {
      console.error('[proposals/download] Proposal not found:', proposalId)
      return NextResponse.json(
        { error: 'Proposal not found' },
        { status: 404 }
      )
    }

    if (proposal.user_id !== userId) {
      console.error('[proposals/download] Ownership mismatch:', {
        proposalId,
        userId,
        ownerId: proposal.user_id,
      })
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    // TODO: Generate actual DOCX file and upload to storage
    // For now, return a placeholder signed URL
    
    console.info('[proposals/download] Creating signed URL for proposal:', {
      userId,
      proposalId,
      title: proposal.title,
    })

    // Stub: In production, this would point to an actual file
    // For now, return a mock URL
    const mockUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/api/proposals/stub-export/${proposalId}`

    return NextResponse.json(
      {
        url: mockUrl,
        expires_in: 300, // 5 minutes
        proposal_id: proposalId,
        title: proposal.title,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[proposals/download] Exception:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

