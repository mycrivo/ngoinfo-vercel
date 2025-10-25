/**
 * Quota Management (Database-backed)
 * 
 * Server-side quota enforcement with Supabase.
 * Replaces localStorage-based quota from V1-V5.
 */

import { addDays, differenceInHours, isPast } from 'date-fns'
import { createClient } from './supabaseServer'
import { PLANS, type PlanId } from './plans'

export interface UserPlanState {
  user_id: string
  plan_id: PlanId
  quota_used: number
  monthly_quota: number
  trial_expires_at: string | null
  subscription_status: 'trial' | 'active' | 'cancelled' | 'past_due' | null
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  created_at: string
  updated_at: string
}

export interface QuotaStatus {
  plan_id: PlanId
  quota_used: number
  quota_remaining: number
  monthly_quota: number
  can_generate: boolean
  is_trial: boolean
  trial_active: boolean
  trial_hours_remaining: number | null
}

/**
 * Get user's plan state from database
 */
export async function getUserPlanState(userId: string): Promise<UserPlanState | null> {
  try {
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('user_plan_state')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        // No row found - user needs trial initialization
        return null
      }
      console.error('[quota] Error fetching user plan state:', error)
      return null
    }

    return data as UserPlanState
  } catch (error) {
    console.error('[quota] Exception in getUserPlanState:', error)
    return null
  }
}

/**
 * Check if user's trial is still active
 */
export function isTrialActive(planState: UserPlanState | null): boolean {
  if (!planState || planState.plan_id !== 'trial') {
    return false
  }

  if (!planState.trial_expires_at) {
    return false
  }

  return !isPast(new Date(planState.trial_expires_at))
}

/**
 * Get trial hours remaining
 */
export function getTrialHoursRemaining(planState: UserPlanState | null): number | null {
  if (!planState || !planState.trial_expires_at) {
    return null
  }

  const now = new Date()
  const expiresAt = new Date(planState.trial_expires_at)
  
  if (isPast(expiresAt)) {
    return 0
  }

  return differenceInHours(expiresAt, now)
}

/**
 * Check user's quota status
 */
export async function checkQuota(userId: string): Promise<QuotaStatus> {
  const planState = await getUserPlanState(userId)

  if (!planState) {
    // User has no plan state - needs trial initialization
    return {
      plan_id: 'trial',
      quota_used: 0,
      quota_remaining: 1,
      monthly_quota: 1,
      can_generate: false, // Must initialize trial first
      is_trial: true,
      trial_active: false,
      trial_hours_remaining: null,
    }
  }

  const plan = PLANS.find(p => p.id === planState.plan_id)
  const monthlyQuota = plan?.proposals_per_month ?? 0
  const quotaRemaining = Math.max(0, monthlyQuota - planState.quota_used)
  
  const isTrial = planState.plan_id === 'trial'
  const trialActive = isTrialActive(planState)
  const trialHoursRemaining = getTrialHoursRemaining(planState)

  // Can generate if:
  // 1. Has remaining quota AND
  // 2. (Is on trial and trial is active) OR (Is on paid plan and subscription is active)
  const canGenerate = quotaRemaining > 0 && (
    (isTrial && trialActive) ||
    (!isTrial && planState.subscription_status === 'active')
  )

  return {
    plan_id: planState.plan_id,
    quota_used: planState.quota_used,
    quota_remaining: quotaRemaining,
    monthly_quota: monthlyQuota,
    can_generate: canGenerate,
    is_trial: isTrial,
    trial_active: trialActive,
    trial_hours_remaining: trialHoursRemaining,
  }
}

/**
 * Ensure user has trial initialized
 * Called on first access after signup
 */
export async function ensureTrial(userId: string): Promise<UserPlanState> {
  try {
    const supabase = await createClient()

    // Check if user already has plan state
    const existing = await getUserPlanState(userId)
    if (existing) {
      console.info('[quota] User already has plan state:', existing.plan_id)
      return existing
    }

    // Create trial plan state
    const trialPlan = PLANS.find(p => p.id === 'trial')!
    const now = new Date()
    const expiresAt = addDays(now, trialPlan.trial_days ?? 2)

    const { data, error } = await supabase
      .from('user_plan_state')
      .insert({
        user_id: userId,
        plan_id: 'trial',
        quota_used: 0,
        monthly_quota: trialPlan.proposals_per_month,
        trial_expires_at: expiresAt.toISOString(),
        subscription_status: 'trial',
        created_at: now.toISOString(),
        updated_at: now.toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error('[quota] Error creating trial:', error)
      throw new Error('Failed to initialize trial')
    }

    console.info('[quota] Trial initialized for user:', userId)
    return data as UserPlanState
  } catch (error) {
    console.error('[quota] Exception in ensureTrial:', error)
    throw error
  }
}

/**
 * Increment usage after proposal generation
 */
export async function incrementUsage(
  userId: string,
  proposalId: string,
  action: 'generate' | 'regenerate'
): Promise<void> {
  try {
    const supabase = await createClient()

    // Increment quota_used
    const { error: updateError } = await supabase
      .from('user_plan_state')
      .update({
        quota_used: supabase.raw('quota_used + 1'),
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId)

    if (updateError) {
      console.error('[quota] Error incrementing usage:', updateError)
      throw new Error('Failed to increment usage')
    }

    // Log usage
    const { error: logError } = await supabase
      .from('usage_logs')
      .insert({
        user_id: userId,
        proposal_id: proposalId,
        action,
        created_at: new Date().toISOString(),
      })

    if (logError) {
      console.error('[quota] Error logging usage:', logError)
      // Non-fatal - continue
    }

    console.info('[quota] Usage incremented:', { userId, proposalId, action })
  } catch (error) {
    console.error('[quota] Exception in incrementUsage:', error)
    throw error
  }
}

/**
 * Upgrade user to paid plan (called after successful Stripe checkout)
 */
export async function upgradePlan(
  userId: string,
  planId: PlanId,
  stripeCustomerId: string,
  stripeSubscriptionId: string
): Promise<void> {
  try {
    const supabase = await createClient()
    const plan = PLANS.find(p => p.id === planId)!

    const { error } = await supabase
      .from('user_plan_state')
      .update({
        plan_id: planId,
        monthly_quota: plan.proposals_per_month,
        quota_used: 0, // Reset quota on upgrade
        subscription_status: 'active',
        stripe_customer_id: stripeCustomerId,
        stripe_subscription_id: stripeSubscriptionId,
        trial_expires_at: null, // Clear trial
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId)

    if (error) {
      console.error('[quota] Error upgrading plan:', error)
      throw new Error('Failed to upgrade plan')
    }

    console.info('[quota] Plan upgraded:', { userId, planId })
  } catch (error) {
    console.error('[quota] Exception in upgradePlan:', error)
    throw error
  }
}

/**
 * Cancel subscription (called from Stripe webhook)
 */
export async function cancelSubscription(userId: string): Promise<void> {
  try {
    const supabase = await createClient()

    const { error } = await supabase
      .from('user_plan_state')
      .update({
        subscription_status: 'cancelled',
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId)

    if (error) {
      console.error('[quota] Error cancelling subscription:', error)
      throw new Error('Failed to cancel subscription')
    }

    console.info('[quota] Subscription cancelled:', userId)
  } catch (error) {
    console.error('[quota] Exception in cancelSubscription:', error)
    throw error
  }
}

