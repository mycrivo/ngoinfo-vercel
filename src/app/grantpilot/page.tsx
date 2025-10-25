"use client";

import { useSearchParams } from 'next/navigation';
import { Card } from '@/features/ui/Card';
import { Banner } from '@/features/ui/Banner';
import { getOpportunityById } from '@/mocks/data/opportunities';

/**
 * GrantPilot Stub Page
 * 
 * Placeholder for proposal generation flow.
 * Full implementation in V6.
 */

export default function GrantPilotPage() {
  const searchParams = useSearchParams();
  const oppId = searchParams.get('oppId');
  const opportunity = oppId ? getOpportunityById(oppId) : null;

  return (
    <div className="max-w-4xl mx-auto py-12 space-y-6">
      <Banner variant="info">
        <strong>GrantPilot Coming Soon</strong> — Full proposal editor will be implemented in V6.
      </Banner>

      <Card elevation="lg" padding="lg">
        <div className="text-center space-y-4">
          <div className="text-6xl mb-4">🎯</div>
          <h1>GrantPilot</h1>
          <p className="text-body-l text-secondary">
            AI-powered grant proposal generation
          </p>

          {opportunity && (
            <Card elevation="sm" padding="md" style={{ backgroundColor: 'var(--surface-subtle)' }}>
              <p className="text-small text-secondary mb-2">Selected Opportunity:</p>
              <p className="font-semibold">{opportunity.title}</p>
              <p className="text-small text-secondary mt-1">{opportunity.donor}</p>
            </Card>
          )}

          <div className="pt-6 space-y-2 text-small text-secondary">
            <p>✨ AI-assisted proposal writing</p>
            <p>📝 Section-by-section guidance</p>
            <p>💾 Auto-save drafts</p>
            <p>📥 Export to Word/PDF</p>
          </div>
        </div>
      </Card>
    </div>
  );
}

