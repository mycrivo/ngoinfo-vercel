"use client";

import { useRouter } from 'next/navigation';
import { Card } from '@/features/ui/Card';
import { Button } from '@/features/ui/Button';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  reason: 'trial_expired' | 'quota_exceeded';
}

/**
 * Upgrade Modal
 * 
 * Prompts user to upgrade when quota exhausted or trial expired.
 */

export default function UpgradeModal({ isOpen, onClose, reason }: UpgradeModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  const messages = {
    trial_expired: {
      title: 'Trial Expired',
      body: 'Your 2-day free trial has ended. Subscribe to continue generating proposals.',
    },
    quota_exceeded: {
      title: 'Quota Exceeded',
      body: 'You\'ve used all your proposals for this period. Upgrade to generate more.',
    },
  };

  const message = messages[reason];

  const handleUpgrade = () => {
    router.push('/pricing');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'var(--colour-overlay)' }}
      onClick={onClose}
    >
      <Card
        elevation="lg"
        padding="lg"
        className="max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="space-y-6">
          <div className="text-center">
            <div className="text-5xl mb-4">🔒</div>
            <h2>{message.title}</h2>
            <p className="text-secondary mt-2">{message.body}</p>
          </div>

          <div className="space-y-3">
            <Button variant="primary" size="lg" fullWidth onClick={handleUpgrade}>
              View Plans
            </Button>
            <Button variant="secondary" size="md" fullWidth onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

