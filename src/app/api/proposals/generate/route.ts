/**
 * Proposal Generation API
 * 
 * POST /api/proposals/generate
 * - Requires authentication
 * - Checks quota/trial status
 * - Creates stub proposal (TODO: integrate OpenAI)
 * - Increments usage
 */

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getSession } from '@/lib/auth'
import { checkQuota, ensureTrial, incrementUsage } from '@/lib/quotaDb'
import { createClient } from '@/lib/supabaseServer'

export const dynamic = 'force-dynamic'

const GenerateRequestSchema = z.object({
  opportunity_id: z.string().optional(),
  title: z.string().min(1),
  organization_name: z.string().min(1),
})

export async function POST(request: NextRequest) {
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

    // Ensure trial is initialized
    await ensureTrial(userId)

    // Check quota
    const quotaStatus = await checkQuota(userId)
    
    console.info('[proposals/generate] Quota status:', {
      userId,
      ...quotaStatus,
    })

    if (!quotaStatus.can_generate) {
      return NextResponse.json(
        {
          error: 'Quota exceeded',
          requiresPayment: true,
          quota: quotaStatus,
        },
        { status: 402 }
      )
    }

    // Validate request body
    const body = await request.json()
    const validation = GenerateRequestSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: validation.error.format() },
        { status: 400 }
      )
    }

    const { opportunity_id, title, organization_name } = validation.data

    // TODO: Call OpenAI API to generate proposal
    // For now, create a stub proposal
    const supabase = await createClient()

    const proposalContent = {
      title,
      organization_name,
      executive_summary: 'This is a placeholder proposal generated for demonstration purposes.',
      problem_statement: 'Stub content - real OpenAI integration coming soon.',
      objectives: ['Objective 1', 'Objective 2', 'Objective 3'],
      methodology: 'Stub methodology',
      budget: { total: 0, items: [] },
      timeline: [],
    }

    const { data: proposal, error } = await supabase
      .from('proposals')
      .insert({
        user_id: userId,
        opportunity_id: opportunity_id || null,
        title,
        content: proposalContent,
        status: 'draft',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error('[proposals/generate] Error creating proposal:', error)
      return NextResponse.json(
        { error: 'Failed to create proposal' },
        { status: 500 }
      )
    }

    // Increment usage
    await incrementUsage(userId, proposal.id, 'generate')

    console.info('[proposals/generate] Proposal created:', {
      userId,
      proposalId: proposal.id,
      title,
    })

    return NextResponse.json(
      {
        proposal: {
          id: proposal.id,
          title: proposal.title,
          status: proposal.status,
          created_at: proposal.created_at,
        },
        quota: await checkQuota(userId), // Return updated quota
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('[proposals/generate] Exception:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

