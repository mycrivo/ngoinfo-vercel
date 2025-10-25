/**
 * Quota Meter Component
 * 
 * Displays quota usage with progress bar.
 * Color-coded based on usage percentage.
 */

import { checkQuota } from '@/lib/quotaDb'

interface QuotaMeterProps {
  userId: string
}

export async function QuotaMeter({ userId }: QuotaMeterProps) {
  const quota = await checkQuota(userId)

  const usagePercent = quota.monthly_quota > 0
    ? Math.round((quota.quota_used / quota.monthly_quota) * 100)
    : 0

  // Color coding
  let barColor = 'bg-blue-500' // < 80%
  let textColor = 'text-blue-700'
  
  if (usagePercent >= 100) {
    barColor = 'bg-red-500'
    textColor = 'text-red-700'
  } else if (usagePercent >= 80) {
    barColor = 'bg-yellow-500'
    textColor = 'text-yellow-700'
  }

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-sm">
        <span className="font-medium">Proposal Quota</span>
        <span className={`font-semibold ${textColor}`}>
          {quota.quota_used} / {quota.monthly_quota} used
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div
          className={`h-full ${barColor} transition-all duration-300`}
          style={{ width: `${Math.min(usagePercent, 100)}%` }}
        />
      </div>

      <div className="flex justify-between items-center text-xs text-gray-600">
        <span>
          {quota.quota_remaining} remaining this month
        </span>
        {quota.is_trial && quota.trial_active && quota.trial_hours_remaining !== null && (
          <span className="font-medium text-blue-600">
            Trial: {quota.trial_hours_remaining}h left
          </span>
        )}
        {quota.is_trial && !quota.trial_active && (
          <span className="font-medium text-red-600">
            Trial Expired
          </span>
        )}
      </div>
    </div>
  )
}

