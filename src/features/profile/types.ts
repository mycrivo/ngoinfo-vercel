/**
 * Profile Types
 * 
 * NGO profile data structure for wizard and storage.
 */

export interface ProfileData {
  // Step 1: Basics
  org_name: string;
  country: string;
  website: string;
  year_established: number | null;
  
  // Step 2: Focus
  sectors: string[];
  geography: string;
  
  // Step 3: Capacity
  staff_count: string; // range: '1-5', '6-20', '21-50', '50+'
  annual_budget: string; // range: '<50K', '50K-250K', '250K-1M', '1M+'
  
  // Step 4: Projects (optional)
  projects: Array<{
    id: string;
    title: string;
    donor: string;
    summary: string;
  }>;
  
  // Metadata
  completed_at: string | null;
  updated_at: string;
}

export const INITIAL_PROFILE: ProfileData = {
  org_name: '',
  country: '',
  website: '',
  year_established: null,
  sectors: [],
  geography: '',
  staff_count: '',
  annual_budget: '',
  projects: [],
  completed_at: null,
  updated_at: new Date().toISOString(),
};

// Field options
export const COUNTRIES = [
  'Kenya', 'Tanzania', 'Uganda', 'Nigeria', 'Ghana', 'South Africa',
  'Ethiopia', 'Rwanda', 'Malawi', 'Zambia', 'Zimbabwe', 'Other',
];

export const SECTORS = [
  'Health', 'Education', 'Agriculture', 'Environment', 'Water & Sanitation',
  'Gender Equality', 'Youth Development', 'Economic Development',
  'Humanitarian', 'Climate Change', 'Governance', 'Human Rights',
];

export const GEOGRAPHIES = [
  'East Africa', 'West Africa', 'Southern Africa', 'Central Africa',
  'North Africa', 'Multi-regional', 'National', 'Sub-national',
];

export const STAFF_RANGES = [
  { value: '1-5', label: '1-5 staff' },
  { value: '6-20', label: '6-20 staff' },
  { value: '21-50', label: '21-50 staff' },
  { value: '50+', label: '50+ staff' },
];

export const BUDGET_RANGES = [
  { value: '<50K', label: 'Under $50,000' },
  { value: '50K-250K', label: '$50,000 - $250,000' },
  { value: '250K-1M', label: '$250,000 - $1M' },
  { value: '1M+', label: 'Over $1M' },
];

