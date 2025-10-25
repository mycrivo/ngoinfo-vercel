import Link from 'next/link';
import { Card } from '@/features/ui/Card';
import type { Opportunity } from '@/mocks/data/opportunities';

interface OpportunityCardProps {
  opportunity: Opportunity;
}

/**
 * Opportunity Card
 * 
 * Displays opportunity summary in list view.
 */

export default function OpportunityCard({ opportunity }: OpportunityCardProps) {
  const deadline = new Date(opportunity.deadline);
  const daysUntil = Math.ceil((deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  const isUrgent = daysUntil <= 30;

  const formatAmount = (min: number, max: number) => {
    const format = (n: number) => {
      if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
      if (n >= 1000) return `$${(n / 1000).toFixed(0)}K`;
      return `$${n}`;
    };
    return `${format(min)} - ${format(max)}`;
  };

  return (
    <Link href={`/opportunities/${opportunity.id}`}>
      <Card elevation="sm" padding="md" className="hover:shadow-md transition-shadow cursor-pointer">
        <div className="space-y-3">
          {/* Header */}
          <div>
            <h3 className="font-semibold mb-1">{opportunity.title}</h3>
            <p className="text-small text-secondary">{opportunity.donor}</p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {opportunity.sectors.slice(0, 3).map((sector) => (
              <span
                key={sector}
                className="px-2 py-1 rounded text-small"
                style={{
                  backgroundColor: 'var(--surface-subtle)',
                  color: 'var(--text-secondary)',
                }}
              >
                {sector}
              </span>
            ))}
            {opportunity.sectors.length > 3 && (
              <span className="text-small text-secondary">
                +{opportunity.sectors.length - 3} more
              </span>
            )}
          </div>

          {/* Meta */}
          <div className="grid grid-cols-2 gap-3 text-small pt-2 border-t" style={{ borderColor: 'var(--colour-border)' }}>
            <div>
              <p className="text-secondary">Amount</p>
              <p className="font-medium">{formatAmount(opportunity.amount_min, opportunity.amount_max)}</p>
            </div>
            <div>
              <p className="text-secondary">Deadline</p>
              <p
                className="font-medium"
                style={{ color: isUrgent ? 'var(--colour-warning)' : 'inherit' }}
              >
                {daysUntil} days
              </p>
            </div>
            <div className="col-span-2">
              <p className="text-secondary">Region</p>
              <p className="font-medium">{opportunity.region}</p>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}

