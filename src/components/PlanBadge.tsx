/**
 * Plan Badge Component
 * 
 * Displays user's current plan with badge styling.
 * Shows trial status if applicable.
 */

import { getUserPlanState, isTrialActive } from '@/lib/quotaDb'
import { PLANS } from '@/lib/plans'

interface PlanBadgeProps {
  userId: string
}

export async function PlanBadge({ userId }: PlanBadgeProps) {
  const planState = await getUserPlanState(userId)

  if (!planState) {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md border border-gray-300">
        <span className="text-sm font-medium text-gray-600">No Plan</span>
      </div>
    )
  }

  const plan = PLANS.find(p => p.id === planState.plan_id)
  const isTrial = planState.plan_id === 'trial'
  const trialActive = isTrialActive(planState)

  const badgeStyles = isTrial
    ? 'border-blue-500 bg-blue-50 text-blue-700'
    : plan?.is_featured
    ? 'border-green-500 bg-green-50 text-green-700'
    : 'border-gray-400 bg-gray-50 text-gray-700'

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-md border-2 ${badgeStyles}`}>
      <span className="text-sm font-semibold">
        {plan?.name || planState.plan_id}
      </span>
      {isTrial && trialActive && (
        <span className="text-xs font-normal">(Active)</span>
      )}
      {isTrial && !trialActive && (
        <span className="text-xs font-normal text-red-600">(Expired)</span>
      )}
    </div>
  )
}

