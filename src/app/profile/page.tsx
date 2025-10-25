"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/features/ui/Card';
import { Button } from '@/features/ui/Button';
import { Banner } from '@/features/ui/Banner';
import { useProfile } from '@/features/profile/useProfile';

/**
 * Profile Summary Page
 * 
 * Read-only view of NGO profile with edit button.
 */

export default function ProfilePage() {
  const router = useRouter();
  const { profile, isLoading, isComplete } = useProfile();

  useEffect(() => {
    // Redirect to wizard if profile not complete
    if (!isLoading && !isComplete) {
      router.push('/profile/wizard');
    }
  }, [isLoading, isComplete, router]);

  if (isLoading) {
    return <div className="text-center py-12">Loading profile...</div>;
  }

  if (!profile || !isComplete) {
    return null; // Will redirect
  }

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1>{profile.org_name}</h1>
          <p className="text-secondary mt-1">Organization Profile</p>
        </div>
        <Button variant="secondary" onClick={() => router.push('/profile/wizard')}>
          Edit Profile
        </Button>
      </div>

      {!profile.completed_at && (
        <Banner variant="warning">
          <p>Your profile is incomplete. Complete it to unlock all features.</p>
        </Banner>
      )}

      {/* Basics */}
      <Card elevation="md" padding="lg">
        <h2 className="mb-4">Basic Information</h2>
        <div className="grid md:grid-cols-2 gap-4 text-small">
          <div>
            <p className="text-secondary">Country</p>
            <p className="font-medium">{profile.country}</p>
          </div>
          <div>
            <p className="text-secondary">Year Established</p>
            <p className="font-medium">{profile.year_established}</p>
          </div>
          {profile.website && (
            <div className="md:col-span-2">
              <p className="text-secondary">Website</p>
              <a
                href={profile.website}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium underline"
                style={{ color: 'var(--colour-primary)' }}
              >
                {profile.website}
              </a>
            </div>
          )}
        </div>
      </Card>

      {/* Focus */}
      <Card elevation="md" padding="lg">
        <h2 className="mb-4">Focus Areas</h2>
        <div className="space-y-4">
          <div>
            <p className="text-small text-secondary mb-2">Sectors</p>
            <div className="flex flex-wrap gap-2">
              {profile.sectors.map((sector) => (
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
          <div>
            <p className="text-small text-secondary">Geographic Focus</p>
            <p className="font-medium">{profile.geography}</p>
          </div>
        </div>
      </Card>

      {/* Capacity */}
      <Card elevation="md" padding="lg">
        <h2 className="mb-4">Organizational Capacity</h2>
        <div className="grid md:grid-cols-2 gap-4 text-small">
          <div>
            <p className="text-secondary">Staff Count</p>
            <p className="font-medium">{profile.staff_count} staff</p>
          </div>
          <div>
            <p className="text-secondary">Annual Budget</p>
            <p className="font-medium">{profile.annual_budget}</p>
          </div>
        </div>
      </Card>

      {/* Projects */}
      {profile.projects.length > 0 && (
        <Card elevation="md" padding="lg">
          <h2 className="mb-4">Past Projects</h2>
          <div className="space-y-4">
            {profile.projects.map((project) => (
              <div
                key={project.id}
                className="p-4 rounded-lg"
                style={{ backgroundColor: 'var(--surface-subtle)' }}
              >
                <h3 className="font-semibold mb-1">{project.title}</h3>
                <p className="text-small text-secondary mb-2">Funded by: {project.donor}</p>
                <p className="text-small">{project.summary}</p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

