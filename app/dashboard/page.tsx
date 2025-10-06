"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/features/ui/Card";
import { Button } from "@/features/ui/Button";
import { Banner } from "@/features/ui/Banner";
import { getQuotaStatus, getTrialStatus, type TrialStatus, type QuotaStatus } from "@/lib/quota";
import { getPlanById } from "@/lib/plans";

/**
 * Dashboard Page
 * 
 * Shows plan status, quota progress, and upgrade CTAs.
 * Displays trial countdown when active.
 */

export default function DashboardPage() {
  const router = useRouter();
  const [quota, setQuota] = useState<QuotaStatus | null>(null);
  const [trial, setTrial] = useState<TrialStatus | null>(null);

  useEffect(() => {
    // Load quota and trial status
    setQuota(getQuotaStatus());
    setTrial(getTrialStatus());

    // Refresh every minute for trial countdown
    const interval = setInterval(() => {
      setQuota(getQuotaStatus());
      setTrial(getTrialStatus());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  if (!quota || !trial) {
    return <div>Loading...</div>;
  }

  const plan = quota.plan_id ? getPlanById(quota.plan_id) : null;
  const quotaPercentage = quota.proposals_limit > 0 
    ? (quota.proposals_used / quota.proposals_limit) * 100 
    : 0;

  return (
    <div className="space-y-6">
      {/* Trial/Plan Banner */}
      {trial.active ? (
        <Banner variant="info">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <strong>Free Trial Active</strong> — {trial.hours_remaining}h remaining · {quota.quota_remaining} of {quota.proposals_limit} proposals left
            </div>
            <Button variant="secondary" size="sm" onClick={() => router.push("/pricing")}>
              Upgrade Now
            </Button>
          </div>
        </Banner>
      ) : quota.quota_remaining === 0 ? (
        <Banner variant="warning">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <strong>Quota Exceeded</strong> — You've used all {quota.proposals_limit} proposals this month
            </div>
            <Button variant="primary" size="sm" onClick={() => router.push("/pricing")}>
              Upgrade Plan
            </Button>
          </div>
        </Banner>
      ) : !trial.active && trial.started_at ? (
        <Banner variant="error">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <strong>Trial Expired</strong> — Subscribe to continue generating proposals
            </div>
            <Button variant="primary" size="sm" onClick={() => router.push("/pricing")}>
              View Plans
            </Button>
          </div>
        </Banner>
      ) : null}

      {/* Header with Plan Badge */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1>Dashboard</h1>
          <p className="text-secondary mt-1">
            Manage your grant proposals and funding opportunities
          </p>
        </div>
        
        {plan && (
          <div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium"
            style={{ 
              backgroundColor: 'var(--surface-subtle)', 
              borderColor: 'var(--colour-primary)',
              borderWidth: '1px',
              borderStyle: 'solid'
            }}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" style={{ color: 'var(--colour-primary)' }}>
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span>{plan.name} Plan</span>
            {trial.active && <span className="text-small">(Trial)</span>}
          </div>
        )}
      </div>

      {/* Quota Progress */}
      <Card elevation="md" padding="md">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Proposal Quota</h3>
            <span className="text-small text-secondary">
              {quota.proposals_used} / {quota.proposals_limit} used
            </span>
          </div>
          
          {/* Progress Bar */}
          <div className="relative w-full h-3 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--neutral-200)' }}>
            <div 
              className="absolute top-0 left-0 h-full transition-all duration-300"
              style={{ 
                width: `${quotaPercentage}%`,
                backgroundColor: quotaPercentage >= 100 
                  ? 'var(--colour-error)' 
                  : quotaPercentage >= 80 
                    ? 'var(--colour-warning)' 
                    : 'var(--colour-primary)'
              }}
            />
          </div>

          <div className="flex items-center justify-between text-small">
            <span className="text-secondary">
              {quota.quota_remaining} proposals remaining this month
            </span>
            {quota.quota_remaining === 0 && (
              <Button variant="link" size="sm" onClick={() => router.push("/pricing")}>
                Upgrade →
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card elevation="sm" padding="md">
          <div className="space-y-2">
            <h3 className="text-small font-medium text-secondary">Active Proposals</h3>
            <p className="text-3xl font-bold" style={{ color: 'var(--colour-primary)' }}>0</p>
            <p className="text-small text-secondary">Start generating proposals</p>
          </div>
        </Card>

        <Card elevation="sm" padding="md">
          <div className="space-y-2">
            <h3 className="text-small font-medium text-secondary">Funding Opportunities</h3>
            <p className="text-3xl font-bold" style={{ color: 'var(--colour-secondary)' }}>—</p>
            <p className="text-small text-secondary">Coming in V5</p>
          </div>
        </Card>

        <Card elevation="sm" padding="md">
          <div className="space-y-2">
            <h3 className="text-small font-medium text-secondary">Success Rate</h3>
            <p className="text-3xl font-bold" style={{ color: 'var(--colour-success)' }}>—</p>
            <p className="text-small text-secondary">Track your wins</p>
          </div>
        </Card>
      </div>

      {/* Sidebar Placeholders */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card elevation="sm" padding="md" className="md:col-span-2">
          <h3 className="font-semibold mb-4">Recent Activity</h3>
          <div className="text-center py-12 text-secondary">
            <p>No activity yet</p>
            <p className="text-small mt-2">Generate your first proposal to see it here</p>
          </div>
        </Card>

        <Card elevation="sm" padding="md">
          <h3 className="font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Button variant="primary" fullWidth disabled>
              🎯 GrantPilot (Coming Soon)
            </Button>
            <Button variant="secondary" fullWidth disabled>
              👤 Profile (Coming Soon)
            </Button>
            <Button variant="secondary" fullWidth disabled>
              ⚙️ Settings (Coming Soon)
            </Button>
            <Button variant="secondary" fullWidth onClick={() => router.push("/pricing")}>
              💳 Manage Plan
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
