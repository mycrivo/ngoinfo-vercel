"use client";

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card } from '@/features/ui/Card';
import { Button } from '@/features/ui/Button';
import { Banner } from '@/features/ui/Banner';
import UpgradeModal from '@/components/UpgradeModal';
import { getOpportunityById } from '@/mocks/data/opportunities';
import { getQuotaStatus, getTrialStatus } from '@/lib/quota';

/**
 * Opportunity Detail Page
 * 
 * Full details of a funding opportunity with "Write with GrantPilot" CTA.
 * CTA is gated by quota and trial status.
 */

export const metadata = {
  title: "Opportunity Details - NGOInfo",
  description: "View funding opportunity details",
};

export default function OpportunityDetailPage() {
  const params = useParams();
  const router = useRouter();
  const opportunity = getOpportunityById(params.id as string);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeReason, setUpgradeReason] = useState<'trial_expired' | 'quota_exceeded'>('quota_exceeded');
  const [canGenerate, setCanGenerate] = useState(false);

  useEffect(() => {
    const quota = getQuotaStatus();
    const trial = getTrialStatus();

    if (!trial.active && trial.started_at) {
      // Trial expired
      setCanGenerate(false);
      setUpgradeReason('trial_expired');
    } else if (quota.quota_remaining === 0) {
      // Quota exhausted
      setCanGenerate(false);
      setUpgradeReason('quota_exceeded');
    } else {
      // Can generate
      setCanGenerate(true);
    }
  }, []);

  if (!opportunity) {
    return (
      <div className="max-w-4xl mx-auto py-12">
        <Banner variant="error">
          <p>Opportunity not found.</p>
        </Banner>
        <Button variant="secondary" onClick={() => router.push('/opportunities')} className="mt-4">
          ← Back to Opportunities
        </Button>
      </div>
    );
  }

  const deadline = new Date(opportunity.deadline);
  const daysUntil = Math.ceil((deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    // TODO: Show toast notification in V5C
    alert('Link copied to clipboard!');
  };

  const handleGrantPilot = () => {
    if (!canGenerate) {
      setShowUpgradeModal(true);
      return;
    }
    router.push(`/grantpilot?oppId=${opportunity.id}`);
  };

  return (
    <>
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        reason={upgradeReason}
      />

      <div className="max-w-4xl mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <Button variant="link" size="sm" onClick={() => router.back()}>
          ← Back
        </Button>
        <h1>{opportunity.title}</h1>
        <p className="text-body-l text-secondary">{opportunity.donor}</p>
      </div>

      {/* Key Info Banner */}
      <Card elevation="md" padding="md" style={{ backgroundColor: 'var(--surface-subtle)' }}>
        <div className="grid md:grid-cols-3 gap-4 text-small">
          <div>
            <p className="text-secondary">Grant Amount</p>
            <p className="font-semibold text-body">
              ${opportunity.amount_min.toLocaleString()} - ${opportunity.amount_max.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-secondary">Deadline</p>
            <p className="font-semibold text-body">
              {deadline.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              <span className="text-secondary ml-2">({daysUntil} days)</span>
            </p>
          </div>
          <div>
            <p className="text-secondary">Region</p>
            <p className="font-semibold text-body">{opportunity.region}</p>
          </div>
        </div>
      </Card>

      {/* Primary CTA */}
      <div className="flex gap-3">
        <Button
          variant="primary"
          size="lg"
          onClick={handleGrantPilot}
          disabled={!canGenerate}
          fullWidth
        >
          ✨ Write with GrantPilot
          {!canGenerate && ' (Upgrade Required)'}
        </Button>
        <Button variant="secondary" size="lg" onClick={handleShare}>
          Share
        </Button>
      </div>

      {!canGenerate && (
        <Banner variant="warning">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span>
              {upgradeReason === 'trial_expired'
                ? 'Your trial has expired. Subscribe to generate proposals.'
                : 'You\'ve used all your proposals. Upgrade to continue.'}
            </span>
            <Button variant="secondary" size="sm" onClick={() => router.push('/pricing')}>
              View Plans
            </Button>
          </div>
        </Banner>
      )}

      {/* Overview */}
      <Card elevation="md" padding="lg">
        <h2 className="mb-4">Overview</h2>
        <p className="leading-relaxed">{opportunity.summary}</p>

        <div className="mt-6">
          <h3 className="font-semibold mb-2">Focus Areas</h3>
          <div className="flex flex-wrap gap-2">
            {opportunity.sectors.map((sector) => (
              <span
                key={sector}
                className="px-3 py-1 rounded-full text-small font-medium"
                style={{
                  backgroundColor: 'var(--surface-subtle)',
                  color: 'var(--colour-primary)',
                }}
              >
                {sector}
              </span>
            ))}
          </div>
        </div>
      </Card>

      {/* Eligibility */}
      <Card elevation="md" padding="lg">
        <h2 className="mb-4">Eligibility Requirements</h2>
        <p className="leading-relaxed">{opportunity.eligibility}</p>
      </Card>

      {/* Budget */}
      <Card elevation="md" padding="lg">
        <h2 className="mb-4">Budget & Funding</h2>
        <p className="leading-relaxed">{opportunity.budget_notes}</p>
      </Card>

      {/* Official Link (disabled in mock) */}
      <Card elevation="md" padding="lg">
        <h2 className="mb-4">Official Information</h2>
        <p className="text-secondary text-small mb-3">
          For complete details, visit the funder's official page.
        </p>
        <Button variant="secondary" disabled>
          Visit Official Page (Mock)
        </Button>
      </Card>

      {/* Bottom CTA */}
      <Card elevation="lg" padding="lg" style={{ backgroundColor: 'var(--surface-subtle)' }}>
        <div className="text-center space-y-4">
          <h2>Ready to apply?</h2>
          <p className="text-secondary">
            Let GrantPilot help you craft a compelling proposal for this opportunity.
          </p>
          <Button variant="primary" size="lg" onClick={handleGrantPilot}>
            ✨ Write with GrantPilot
          </Button>
        </div>
      </Card>
      </div>
    </>
  );
}

export async function generateStaticParams() {
  // Return empty array for fully dynamic route
  return [];
}

