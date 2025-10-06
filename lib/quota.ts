/**
 * Quota & Trial Logic (Mock)
 * 
 * Manages 2-day free trial and proposal quotas.
 * Uses localStorage for now - will integrate with backend in Live Billing.
 */

import { getPlanById, getFeaturedPlan, type PlanId } from './plans';
import { track } from './telemetry';

const TRIAL_KEY = 'ngo_trial';
const QUOTA_KEY = 'ngo_quota';
const PLAN_KEY = 'ngo_plan';

export interface TrialStatus {
  active: boolean;
  started_at: string | null;
  expires_at: string | null;
  hours_remaining: number;
  proposals_used: number;
  proposals_limit: number;
}

export interface QuotaStatus {
  plan_id: PlanId | null;
  proposals_used: number;
  proposals_limit: number;
  quota_remaining: number;
  is_trial: boolean;
  can_generate: boolean;
}

/**
 * Start free trial
 */
export function startTrial(): void {
  const now = new Date();
  const featuredPlan = getFeaturedPlan();
  const expiresAt = new Date(now.getTime() + featuredPlan.trial_days * 24 * 60 * 60 * 1000);

  const trialData = {
    active: true,
    started_at: now.toISOString(),
    expires_at: expiresAt.toISOString(),
    proposals_used: 0,
    proposals_limit: featuredPlan.trial_proposals,
  };

  localStorage.setItem(TRIAL_KEY, JSON.stringify(trialData));
  localStorage.setItem(PLAN_KEY, featuredPlan.id);
  
  track('monetisation:trial_started', {
    plan: featuredPlan.id,
    trial_days: featuredPlan.trial_days,
    trial_proposals: featuredPlan.trial_proposals,
  });
}

/**
 * Get current trial status
 */
export function getTrialStatus(): TrialStatus {
  const stored = localStorage.getItem(TRIAL_KEY);
  
  if (!stored) {
    return {
      active: false,
      started_at: null,
      expires_at: null,
      hours_remaining: 0,
      proposals_used: 0,
      proposals_limit: 0,
    };
  }

  const trial = JSON.parse(stored);
  const now = new Date();
  const expiresAt = new Date(trial.expires_at);
  const hoursRemaining = Math.max(0, Math.floor((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60)));
  
  // Check if trial expired
  if (now >= expiresAt) {
    trial.active = false;
    localStorage.setItem(TRIAL_KEY, JSON.stringify(trial));
    track('monetisation:trial_expired', {
      proposals_used: trial.proposals_used,
      proposals_limit: trial.proposals_limit,
    });
  }

  return {
    active: trial.active && now < expiresAt,
    started_at: trial.started_at,
    expires_at: trial.expires_at,
    hours_remaining: hoursRemaining,
    proposals_used: trial.proposals_used || 0,
    proposals_limit: trial.proposals_limit || 0,
  };
}

/**
 * Get current quota status
 */
export function getQuotaStatus(): QuotaStatus {
  const trial = getTrialStatus();
  const planId = localStorage.getItem(PLAN_KEY) as PlanId | null;

  if (trial.active) {
    // Trial mode
    return {
      plan_id: planId,
      proposals_used: trial.proposals_used,
      proposals_limit: trial.proposals_limit,
      quota_remaining: Math.max(0, trial.proposals_limit - trial.proposals_used),
      is_trial: true,
      can_generate: trial.proposals_used < trial.proposals_limit,
    };
  }

  // Paid plan (mock - will come from backend)
  const plan = planId ? getPlanById(planId) : null;
  const quotaData = localStorage.getItem(QUOTA_KEY);
  const quota = quotaData ? JSON.parse(quotaData) : { proposals_used: 0 };

  const proposalsLimit = plan?.proposals_per_month || 0;
  const proposalsUsed = quota.proposals_used || 0;

  return {
    plan_id: planId,
    proposals_used: proposalsUsed,
    proposals_limit: proposalsLimit,
    quota_remaining: Math.max(0, proposalsLimit - proposalsUsed),
    is_trial: false,
    can_generate: proposalsUsed < proposalsLimit,
  };
}

/**
 * Consume one proposal quota
 */
export function consumeProposal(): boolean {
  const status = getQuotaStatus();

  if (!status.can_generate) {
    track('monetisation:quota_exceeded', {
      plan_id: status.plan_id,
      proposals_used: status.proposals_used,
      proposals_limit: status.proposals_limit,
    });
    return false;
  }

  if (status.is_trial) {
    // Update trial usage
    const trial = getTrialStatus();
    const trialData = {
      ...trial,
      proposals_used: trial.proposals_used + 1,
    };
    localStorage.setItem(TRIAL_KEY, JSON.stringify(trialData));
    
    track('monetisation:proposal_consumed', {
      is_trial: true,
      proposals_used: trialData.proposals_used,
      proposals_limit: trial.proposals_limit,
    });
  } else {
    // Update paid plan usage
    const quotaData = localStorage.getItem(QUOTA_KEY);
    const quota = quotaData ? JSON.parse(quotaData) : { proposals_used: 0 };
    quota.proposals_used = (quota.proposals_used || 0) + 1;
    localStorage.setItem(QUOTA_KEY, JSON.stringify(quota));
    
    track('monetisation:proposal_consumed', {
      is_trial: false,
      plan_id: status.plan_id,
      proposals_used: quota.proposals_used,
      proposals_limit: status.proposals_limit,
    });
  }

  return true;
}

/**
 * Upgrade to paid plan (mock)
 */
export function upgradePlan(planId: PlanId): void {
  // Clear trial
  localStorage.removeItem(TRIAL_KEY);
  
  // Set new plan
  localStorage.setItem(PLAN_KEY, planId);
  
  // Reset quota
  localStorage.setItem(QUOTA_KEY, JSON.stringify({ proposals_used: 0 }));
  
  track('monetisation:plan_upgraded', {
    plan_id: planId,
  });
}

/**
 * Reset trial (for testing)
 */
export function resetTrial(): void {
  localStorage.removeItem(TRIAL_KEY);
  localStorage.removeItem(QUOTA_KEY);
  localStorage.removeItem(PLAN_KEY);
  
  track('monetisation:trial_reset', {});
}

/**
 * Simulate trial expiry (for testing)
 */
export function simulateTrialExpiry(): void {
  const stored = localStorage.getItem(TRIAL_KEY);
  if (stored) {
    const trial = JSON.parse(stored);
    const now = new Date();
    trial.expires_at = new Date(now.getTime() - 1000).toISOString(); // 1 second ago
    trial.active = false;
    localStorage.setItem(TRIAL_KEY, JSON.stringify(trial));
    
    track('monetisation:trial_expiry_simulated', {});
  }
}

