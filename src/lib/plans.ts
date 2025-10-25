/**
 * NGOInfo Plan Configuration
 * 
 * Defines pricing tiers, quotas, and trial settings.
 * Will integrate with Stripe in Live Billing cluster.
 */

export type PlanId = 'starter' | 'growth' | 'impact_plus';

export interface Plan {
  id: PlanId;
  name: string;
  price: number; // USD per month
  proposals_per_month: number;
  manual_review_included: boolean;
  trial_days: number;
  trial_proposals: number;
  stripe_price_id: string;
  tagline: string;
  is_featured?: boolean;
  features: string[];
}

export const PLANS: Plan[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: 19,
    proposals_per_month: 2,
    manual_review_included: false,
    trial_days: 2,
    trial_proposals: 1,
    stripe_price_id: 'price_starter_placeholder',
    tagline: 'Perfect for small NGOs getting started',
    features: [
      '2 grant proposals per month',
      'AI-powered proposal generation',
      'Basic funding opportunities',
      'Email support',
    ],
  },
  {
    id: 'growth',
    name: 'Growth',
    price: 39,
    proposals_per_month: 5,
    manual_review_included: true,
    trial_days: 2,
    trial_proposals: 1,
    stripe_price_id: 'price_growth_placeholder',
    tagline: 'For growing organizations scaling impact',
    is_featured: true,
    features: [
      '5 grant proposals per month',
      'AI-powered proposal generation',
      'Manual expert review included',
      'Advanced funding opportunities',
      'Priority email support',
      'Proposal templates library',
    ],
  },
  {
    id: 'impact_plus',
    name: 'Impact+',
    price: 79,
    proposals_per_month: 7,
    manual_review_included: true,
    trial_days: 2,
    trial_proposals: 1,
    stripe_price_id: 'price_impact_plus_placeholder',
    tagline: 'Enterprise solution for maximum funding success',
    features: [
      '7 grant proposals per month',
      'AI-powered proposal generation',
      'Manual expert review included',
      'Premium funding opportunities',
      'Dedicated account manager',
      'Custom proposal templates',
      'API access (coming soon)',
      'White-label reports',
    ],
  },
];

/**
 * Get plan by ID
 */
export function getPlanById(planId: PlanId): Plan | undefined {
  return PLANS.find(plan => plan.id === planId);
}

/**
 * Get featured plan (default for trial)
 */
export function getFeaturedPlan(): Plan {
  return PLANS.find(plan => plan.is_featured) || PLANS[1]!;
}

/**
 * Check if plan includes manual review
 */
export function hasManualReview(planId: PlanId): boolean {
  return getPlanById(planId)?.manual_review_included || false;
}

