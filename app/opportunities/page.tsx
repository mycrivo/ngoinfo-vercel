"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card } from '@/features/ui/Card';
import { Input } from '@/features/ui/Input';
import { Button } from '@/features/ui/Button';
import OpportunityCard from '@/features/opportunities/OpportunityCard';
import { filterOpportunities, MOCK_OPPORTUNITIES } from '@/mocks/data/opportunities';
import type { Opportunity } from '@/mocks/data/opportunities';

/**
 * Opportunities List Page
 * 
 * Searchable, filterable list with URL-synced state.
 */

const REGIONS = ['all', 'East Africa', 'West Africa', 'Southern Africa', 'Sub-Saharan Africa', 'Global'];
const SECTORS = ['all', 'Health', 'Education', 'Agriculture', 'Environment', 'Water', 'Gender Equality'];

export default function OpportunitiesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [opportunities, setOpportunities] = useState<Opportunity[]>(MOCK_OPPORTUNITIES);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [region, setRegion] = useState(searchParams.get('region') || 'all');
  const [sector, setSector] = useState(searchParams.get('sector') || 'all');
  const [deadline, setDeadline] = useState(searchParams.get('deadline') || '');

  useEffect(() => {
    // Update URL with current filters
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (region && region !== 'all') params.set('region', region);
    if (sector && sector !== 'all') params.set('sector', sector);
    if (deadline) params.set('deadline', deadline);

    const queryString = params.toString();
    const newUrl = queryString ? `?${queryString}` : '/opportunities';
    router.replace(newUrl, { scroll: false });

    // Filter opportunities
    const filtered = filterOpportunities({
      search,
      region: region === 'all' ? undefined : region,
      sector: sector === 'all' ? undefined : sector,
      deadline: deadline || undefined,
    });
    setOpportunities(filtered);
  }, [search, region, sector, deadline, router]);

  const clearFilters = () => {
    setSearch('');
    setRegion('all');
    setSector('all');
    setDeadline('');
  };

  const hasFilters = search || region !== 'all' || sector !== 'all' || deadline;

  return (
    <div className="max-w-7xl mx-auto py-8">
      <div className="grid lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <Card elevation="md" padding="md">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold">Filters</h2>
                {hasFilters && (
                  <Button variant="link" size="sm" onClick={clearFilters}>
                    Clear
                  </Button>
                )}
              </div>

              <Input
                id="search"
                label="Search"
                placeholder="Title, donor, tags..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                fullWidth
              />

              <Input
                id="region"
                variant="select"
                label="Region"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                options={REGIONS.map(r => ({ value: r, label: r === 'all' ? 'All Regions' : r }))}
                fullWidth
              />

              <Input
                id="sector"
                variant="select"
                label="Sector"
                value={sector}
                onChange={(e) => setSector(e.target.value)}
                options={SECTORS.map(s => ({ value: s, label: s === 'all' ? 'All Sectors' : s }))}
                fullWidth
              />

              <Input
                id="deadline"
                variant="select"
                label="Deadline"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                options={[
                  { value: '', label: 'Any time' },
                  { value: 'next_30', label: 'Next 30 days' },
                  { value: 'next_60', label: 'Next 60 days' },
                  { value: 'next_90', label: 'Next 90 days' },
                ]}
                fullWidth
              />
            </div>
          </Card>
        </div>

        {/* Results */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between">
            <h1>Funding Opportunities</h1>
            <span className="text-secondary">
              {opportunities.length} {opportunities.length === 1 ? 'opportunity' : 'opportunities'}
            </span>
          </div>

          {opportunities.length === 0 ? (
            <Card elevation="md" padding="lg">
              <div className="text-center py-12">
                <p className="text-secondary mb-4">No opportunities match your filters.</p>
                <Button variant="secondary" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </div>
            </Card>
          ) : (
            <div className="space-y-3">
              {opportunities.map((opp) => (
                <OpportunityCard key={opp.id} opportunity={opp} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

