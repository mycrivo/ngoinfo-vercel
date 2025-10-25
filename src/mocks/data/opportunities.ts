/**
 * Mock Opportunities Data
 * 
 * Sample funding opportunities for testing.
 * Will be replaced with live API in production.
 */

export interface Opportunity {
  id: string;
  title: string;
  donor: string;
  country: string;
  region: string;
  deadline: string; // ISO date
  amount_min: number;
  amount_max: number;
  sectors: string[];
  summary: string;
  eligibility: string;
  budget_notes: string;
  official_url: string;
  created_at: string;
}

export const MOCK_OPPORTUNITIES: Opportunity[] = [
  {
    id: 'opp-001',
    title: 'Community Health Initiative Grant',
    donor: 'Gates Foundation',
    country: 'Kenya',
    region: 'East Africa',
    deadline: '2025-12-15T23:59:59Z',
    amount_min: 50000,
    amount_max: 150000,
    sectors: ['Health', 'Community Development'],
    summary: 'Supporting community-led health programs focusing on maternal and child health in rural areas.',
    eligibility: 'NGOs registered in East Africa with at least 2 years of health program experience.',
    budget_notes: 'Grants range from $50K to $150K. Up to 15% overhead allowed.',
    official_url: 'https://gatesfoundation.org/grants/health-initiative',
    created_at: '2025-09-01T10:00:00Z',
  },
  {
    id: 'opp-002',
    title: 'Climate Adaptation for Smallholder Farmers',
    donor: 'Green Climate Fund',
    country: 'Multi-country',
    region: 'Sub-Saharan Africa',
    deadline: '2025-11-30T23:59:59Z',
    amount_min: 100000,
    amount_max: 500000,
    sectors: ['Environment', 'Agriculture', 'Climate Change'],
    summary: 'Large-scale climate adaptation projects helping smallholder farmers build resilience.',
    eligibility: 'NGOs with proven track record in climate adaptation and agriculture programs.',
    budget_notes: 'Grants from $100K to $500K for 2-3 year projects.',
    official_url: 'https://greenclimate.fund/opportunities',
    created_at: '2025-08-15T14:30:00Z',
  },
  {
    id: 'opp-003',
    title: 'Girls Education Accelerator',
    donor: 'Malala Fund',
    country: 'Nigeria',
    region: 'West Africa',
    deadline: '2025-10-31T23:59:59Z',
    amount_min: 25000,
    amount_max: 75000,
    sectors: ['Education', 'Gender Equality'],
    summary: 'Empowering girls through secondary education in underserved communities.',
    eligibility: 'Local NGOs focused on girls education with community partnerships.',
    budget_notes: 'Grants $25K-$75K for 12-18 month programs. No overhead restrictions.',
    official_url: 'https://malala.org/grants',
    created_at: '2025-09-10T09:00:00Z',
  },
  {
    id: 'opp-004',
    title: 'Water & Sanitation Infrastructure',
    donor: 'World Bank',
    country: 'Tanzania',
    region: 'East Africa',
    deadline: '2026-01-31T23:59:59Z',
    amount_min: 200000,
    amount_max: 1000000,
    sectors: ['Water', 'Infrastructure', 'Public Health'],
    summary: 'Large-scale WASH infrastructure projects in rural and peri-urban areas.',
    eligibility: 'Established NGOs with engineering capacity and government partnerships.',
    budget_notes: 'Major grants $200K-$1M. Requires 10% local co-financing.',
    official_url: 'https://worldbank.org/water-grants',
    created_at: '2025-08-01T08:00:00Z',
  },
  {
    id: 'opp-005',
    title: 'Youth Employment & Skills Training',
    donor: 'Mastercard Foundation',
    country: 'Uganda',
    region: 'East Africa',
    deadline: '2025-11-15T23:59:59Z',
    amount_min: 75000,
    amount_max: 200000,
    sectors: ['Education', 'Economic Development', 'Youth'],
    summary: 'Vocational training and job placement programs for unemployed youth aged 18-35.',
    eligibility: 'NGOs with established training facilities and employer networks.',
    budget_notes: 'Grants $75K-$200K for 18-24 month programs.',
    official_url: 'https://mastercardfdn.org/youth-employment',
    created_at: '2025-09-05T11:00:00Z',
  },
  {
    id: 'opp-006',
    title: 'Refugee Integration Program',
    donor: 'UNHCR',
    country: 'Multi-country',
    region: 'Global',
    deadline: '2025-12-31T23:59:59Z',
    amount_min: 50000,
    amount_max: 300000,
    sectors: ['Humanitarian', 'Migration', 'Social Services'],
    summary: 'Supporting refugee integration through education, housing, and livelihood programs.',
    eligibility: 'NGOs working in refugee-hosting communities with proven integration models.',
    budget_notes: 'Flexible funding $50K-$300K based on program scope.',
    official_url: 'https://unhcr.org/integration-grants',
    created_at: '2025-08-20T13:00:00Z',
  },
];

/**
 * Get opportunity by ID
 */
export function getOpportunityById(id: string): Opportunity | undefined {
  return MOCK_OPPORTUNITIES.find(opp => opp.id === id);
}

/**
 * Filter opportunities
 */
export function filterOpportunities(params: {
  region?: string;
  sector?: string;
  search?: string;
  deadline?: string; // 'next_30' | 'next_60' | 'next_90'
}): Opportunity[] {
  let filtered = [...MOCK_OPPORTUNITIES];

  if (params.region && params.region !== 'all') {
    const region = params.region;
    filtered = filtered.filter(opp => opp.region === region);
  }

  if (params.sector && params.sector !== 'all') {
    const sector = params.sector;
    filtered = filtered.filter(opp => opp.sectors.includes(sector));
  }

  if (params.search) {
    const query = params.search.toLowerCase();
    filtered = filtered.filter(opp =>
      opp.title.toLowerCase().includes(query) ||
      opp.donor.toLowerCase().includes(query) ||
      opp.sectors.some(s => s.toLowerCase().includes(query))
    );
  }

  if (params.deadline) {
    const deadline = params.deadline;
    const now = new Date();
    const days = deadline === 'next_30' ? 30 : deadline === 'next_60' ? 60 : 90;
    const cutoff = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
    filtered = filtered.filter(opp => new Date(opp.deadline) <= cutoff);
  }

  return filtered;
}

