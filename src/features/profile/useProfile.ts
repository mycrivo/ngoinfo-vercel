"use client";

import { useState, useEffect } from 'react';
import { ProfileData, INITIAL_PROFILE } from './types';
import { track } from '@/lib/telemetry';

const PROFILE_KEY = 'ngo_profile';

/**
 * Profile Hook
 * 
 * Manages profile data with localStorage persistence.
 * Will integrate with backend API in production.
 */
export function useProfile() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load profile from localStorage
    const stored = localStorage.getItem(PROFILE_KEY);
    if (stored) {
      try {
        setProfile(JSON.parse(stored));
      } catch (err) {
        console.error('[useProfile] Failed to parse stored profile', err);
        setProfile(INITIAL_PROFILE);
      }
    } else {
      setProfile(INITIAL_PROFILE);
    }
    setIsLoading(false);
  }, []);

  const saveProfile = (data: Partial<ProfileData>) => {
    const updated: ProfileData = {
      ...(profile || INITIAL_PROFILE),
      ...data,
      updated_at: new Date().toISOString(),
    };

    setProfile(updated);
    localStorage.setItem(PROFILE_KEY, JSON.stringify(updated));
    
    track('profile:updated', {
      fields: Object.keys(data),
      completed: !!updated.completed_at,
    });
  };

  const completeProfile = () => {
    if (!profile) return;
    
    const completed: ProfileData = {
      ...profile,
      completed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setProfile(completed);
    localStorage.setItem(PROFILE_KEY, JSON.stringify(completed));
    
    track('profile:completed', {
      org_name: completed.org_name,
      sectors: completed.sectors,
      staff_count: completed.staff_count,
    });
  };

  const resetProfile = () => {
    setProfile(INITIAL_PROFILE);
    localStorage.removeItem(PROFILE_KEY);
    track('profile:reset', {});
  };

  return {
    profile,
    isLoading,
    saveProfile,
    completeProfile,
    resetProfile,
    isComplete: !!profile?.completed_at,
  };
}

