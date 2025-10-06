"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/features/ui/Card';
import { Button } from '@/features/ui/Button';
import { Input } from '@/features/ui/Input';
import { Banner } from '@/features/ui/Banner';
import { useProfile } from './useProfile';
import { COUNTRIES, SECTORS, GEOGRAPHIES, STAFF_RANGES, BUDGET_RANGES } from './types';

/**
 * Profile Wizard
 * 
 * Multi-step form for NGO profile setup.
 * Steps: Basics → Focus → Capacity → Projects
 */

export default function ProfileWizard() {
  const router = useRouter();
  const { profile, saveProfile, completeProfile } = useProfile();
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!profile) {
    return <div>Loading...</div>;
  }

  const totalSteps = 4;

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!profile.org_name) newErrors.org_name = 'Organization name is required';
      if (!profile.country) newErrors.country = 'Country is required';
      if (!profile.year_established) newErrors.year_established = 'Year is required';
    }

    if (step === 2) {
      if (profile.sectors.length === 0) newErrors.sectors = 'Select at least one sector';
      if (!profile.geography) newErrors.geography = 'Geography is required';
    }

    if (step === 3) {
      if (!profile.staff_count) newErrors.staff_count = 'Staff count is required';
      if (!profile.annual_budget) newErrors.annual_budget = 'Budget range is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateStep(currentStep)) return;
    
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete wizard
      completeProfile();
      router.push('/profile');
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setErrors({});
    }
  };

  const handleSaveExit = () => {
    saveProfile(profile);
    router.push('/dashboard');
  };

  const toggleSector = (sector: string) => {
    const sectors = profile.sectors.includes(sector)
      ? profile.sectors.filter(s => s !== sector)
      : [...profile.sectors, sector];
    saveProfile({ sectors });
  };

  const addProject = () => {
    const newProject = {
      id: `proj-${Date.now()}`,
      title: '',
      donor: '',
      summary: '',
    };
    saveProfile({ projects: [...profile.projects, newProject] });
  };

  const updateProject = (id: string, field: string, value: string) => {
    const projects = profile.projects.map(p =>
      p.id === id ? { ...p, [field]: value } : p
    );
    saveProfile({ projects });
  };

  const removeProject = (id: string) => {
    saveProfile({ projects: profile.projects.filter(p => p.id !== id) });
  };

  return (
    <div className="max-w-3xl mx-auto py-8 space-y-6">
      {/* Progress */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold">Profile Setup</h1>
          <span className="text-small text-secondary">
            Step {currentStep} of {totalSteps}
          </span>
        </div>
        <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--neutral-200)' }}>
          <div
            className="h-full transition-all duration-300"
            style={{
              width: `${(currentStep / totalSteps) * 100}%`,
              backgroundColor: 'var(--colour-primary)',
            }}
          />
        </div>
      </div>

      <Card elevation="md" padding="lg">
        <div className="space-y-6">
          {/* Step 1: Basics */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <h2>Basic Information</h2>
              <p className="text-secondary">Tell us about your organization</p>

              <Input
                id="org_name"
                label="Organization Name *"
                value={profile.org_name}
                onChange={(e) => saveProfile({ org_name: e.target.value })}
                error={!!errors.org_name}
                errorMessage={errors.org_name}
                fullWidth
              />

              <Input
                id="country"
                variant="select"
                label="Country *"
                value={profile.country}
                onChange={(e) => saveProfile({ country: e.target.value })}
                options={[{ value: '', label: 'Select country' }, ...COUNTRIES.map(c => ({ value: c, label: c }))]}
                error={!!errors.country}
                errorMessage={errors.country}
                fullWidth
              />

              <Input
                id="website"
                label="Website"
                type="url"
                placeholder="https://yourorg.org"
                value={profile.website}
                onChange={(e) => saveProfile({ website: e.target.value })}
                helperText="Optional: Your organization's website"
                fullWidth
              />

              <Input
                id="year_established"
                label="Year Established *"
                type="number"
                value={profile.year_established?.toString() || ''}
                onChange={(e) => saveProfile({ year_established: parseInt(e.target.value) || null })}
                error={!!errors.year_established}
                errorMessage={errors.year_established}
                helperText="e.g., 2010"
                fullWidth
              />
            </div>
          )}

          {/* Step 2: Focus */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <h2>Focus Areas</h2>
              <p className="text-secondary">What sectors do you work in?</p>

              <div>
                <label className="block text-small font-medium mb-2">Sectors * (select all that apply)</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {SECTORS.map((sector) => (
                    <button
                      key={sector}
                      type="button"
                      onClick={() => toggleSector(sector)}
                      className={`p-3 rounded-lg border text-small transition-colors ${
                        profile.sectors.includes(sector)
                          ? 'border-2'
                          : 'border'
                      }`}
                      style={{
                        borderColor: profile.sectors.includes(sector)
                          ? 'var(--colour-primary)'
                          : 'var(--colour-border)',
                        backgroundColor: profile.sectors.includes(sector)
                          ? 'var(--surface-subtle)'
                          : 'transparent',
                      }}
                    >
                      {sector}
                    </button>
                  ))}
                </div>
                {errors.sectors && (
                  <p className="text-small mt-1" style={{ color: 'var(--colour-error)' }}>
                    {errors.sectors}
                  </p>
                )}
              </div>

              <Input
                id="geography"
                variant="select"
                label="Geographic Focus *"
                value={profile.geography}
                onChange={(e) => saveProfile({ geography: e.target.value })}
                options={[
                  { value: '', label: 'Select geography' },
                  ...GEOGRAPHIES.map(g => ({ value: g, label: g })),
                ]}
                error={!!errors.geography}
                errorMessage={errors.geography}
                fullWidth
              />
            </div>
          )}

          {/* Step 3: Capacity */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h2>Organizational Capacity</h2>
              <p className="text-secondary">Help us understand your organization's size</p>

              <Input
                id="staff_count"
                variant="select"
                label="Staff Count *"
                value={profile.staff_count}
                onChange={(e) => saveProfile({ staff_count: e.target.value })}
                options={[
                  { value: '', label: 'Select range' },
                  ...STAFF_RANGES,
                ]}
                error={!!errors.staff_count}
                errorMessage={errors.staff_count}
                fullWidth
              />

              <Input
                id="annual_budget"
                variant="select"
                label="Annual Budget *"
                value={profile.annual_budget}
                onChange={(e) => saveProfile({ annual_budget: e.target.value })}
                options={[
                  { value: '', label: 'Select range' },
                  ...BUDGET_RANGES,
                ]}
                error={!!errors.annual_budget}
                errorMessage={errors.annual_budget}
                fullWidth
              />
            </div>
          )}

          {/* Step 4: Projects */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2>Past Projects</h2>
                  <p className="text-secondary">Add 2-3 recent projects (optional)</p>
                </div>
                <Button variant="secondary" size="sm" onClick={addProject}>
                  + Add Project
                </Button>
              </div>

              {profile.projects.length === 0 ? (
                <Banner variant="info">
                  <p className="text-small">Adding past projects helps us generate better proposals. You can skip this step for now.</p>
                </Banner>
              ) : (
                <div className="space-y-4">
                  {profile.projects.map((project, idx) => (
                    <Card key={project.id} elevation="sm" padding="md">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold">Project {idx + 1}</h3>
                          <button
                            onClick={() => removeProject(project.id)}
                            className="text-small"
                            style={{ color: 'var(--colour-error)' }}
                          >
                            Remove
                          </button>
                        </div>

                        <Input
                          id={`project-title-${project.id}`}
                          label="Project Title"
                          value={project.title}
                          onChange={(e) => updateProject(project.id, 'title', e.target.value)}
                          fullWidth
                        />

                        <Input
                          id={`project-donor-${project.id}`}
                          label="Donor/Funder"
                          value={project.donor}
                          onChange={(e) => updateProject(project.id, 'donor', e.target.value)}
                          fullWidth
                        />

                        <Input
                          id={`project-summary-${project.id}`}
                          variant="textarea"
                          label="Brief Summary"
                          value={project.summary}
                          onChange={(e) => updateProject(project.id, 'summary', e.target.value)}
                          rows={3}
                          fullWidth
                        />
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between pt-6 border-t" style={{ borderColor: 'var(--colour-border)' }}>
            <div>
              {currentStep > 1 && (
                <Button variant="secondary" onClick={handleBack}>
                  ← Back
                </Button>
              )}
            </div>

            <div className="flex gap-2">
              <Button variant="secondary" onClick={handleSaveExit}>
                Save & Exit
              </Button>
              <Button variant="primary" onClick={handleNext}>
                {currentStep === totalSteps ? 'Complete' : 'Next →'}
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

