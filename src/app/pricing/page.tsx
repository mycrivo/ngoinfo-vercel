"use client";

import { useRouter } from "next/navigation";
import { Card } from "@/features/ui/Card";
import { Button } from "@/features/ui/Button";
import { PLANS } from "@/lib/plans";
import { startTrial } from "@/lib/quota";

/**
 * Pricing Page
 * 
 * Displays branded plan tiers with 2-day free trial CTA.
 * No credit card required for trial.
 */

export default function PricingPage() {
  const router = useRouter();

  const handleStartTrial = () => {
    startTrial();
    router.push("/dashboard");
  };

  return (
    <div className="max-w-7xl mx-auto py-12 space-y-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1>Choose Your Plan</h1>
        <p className="text-body-l text-secondary max-w-2xl mx-auto">
          Start with a 2-day free trial. Generate your first proposal with AI assistance. 
          No credit card required.
        </p>
      </div>

      {/* Plan Cards */}
      <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
        {PLANS.map((plan) => {
          const isFeatured = plan.is_featured;

          return (
            <Card
              key={plan.id}
              elevation={isFeatured ? "lg" : "md"}
              padding="lg"
              className={`relative ${isFeatured ? 'border-2' : ''}`}
              style={isFeatured ? { borderColor: 'var(--colour-primary)' } : undefined}
            >
              {/* Featured Badge */}
              {isFeatured && (
                <div 
                  className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-4 py-1 rounded-full text-small font-semibold"
                  style={{ 
                    backgroundColor: 'var(--colour-primary)', 
                    color: 'var(--text-inverse)' 
                  }}
                >
                  Most Popular
                </div>
              )}

              <div className="space-y-6">
                {/* Plan Header */}
                <div className="text-center space-y-2">
                  <h3>{plan.name}</h3>
                  <p className="text-small text-secondary">{plan.tagline}</p>
                  <div className="pt-4">
                    <span className="text-4xl font-bold" style={{ color: 'var(--colour-primary)' }}>
                      ${plan.price}
                    </span>
                    <span className="text-secondary">/month</span>
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-small">
                      <svg 
                        className="w-5 h-5 flex-shrink-0 mt-0.5" 
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                        style={{ color: 'var(--colour-success)' }}
                      >
                        <path 
                          fillRule="evenodd" 
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
                          clipRule="evenodd" 
                        />
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Button
                  variant={isFeatured ? "primary" : "secondary"}
                  size="lg"
                  fullWidth
                  onClick={handleStartTrial}
                >
                  Start 2-Day Free Trial
                </Button>

                {/* Manual Review Badge */}
                {plan.manual_review_included && (
                  <div className="text-center pt-2">
                    <span 
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-small font-medium"
                      style={{ 
                        backgroundColor: 'var(--banner-success-bg)', 
                        color: 'var(--banner-success-fg)' 
                      }}
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                        <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Expert Review Included
                    </span>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Trial Details */}
      <Card elevation="sm" padding="md" style={{ backgroundColor: 'var(--surface-subtle)' }}>
        <div className="text-center space-y-2">
          <h3 className="text-body-l font-semibold">How the Trial Works</h3>
          <div className="grid md:grid-cols-3 gap-6 mt-4 text-small">
            <div className="space-y-2">
              <div className="text-3xl">🎯</div>
              <p className="font-medium">Generate 1 Free Proposal</p>
              <p className="text-secondary">Experience AI-powered grant writing with full proposal preview</p>
            </div>
            <div className="space-y-2">
              <div className="text-3xl">⏱️</div>
              <p className="font-medium">2 Days to Explore</p>
              <p className="text-secondary">No credit card required. Cancel anytime during trial.</p>
            </div>
            <div className="space-y-2">
              <div className="text-3xl">📥</div>
              <p className="font-medium">Download After Upgrade</p>
              <p className="text-secondary">View full proposals during trial, download upon subscription</p>
            </div>
          </div>
        </div>
      </Card>

      {/* FAQ */}
      <div className="text-center text-small text-secondary space-y-2">
        <p>
          Questions? Email us at <a href="mailto:support@ngoinfo.com" className="underline" style={{ color: 'var(--colour-primary)' }}>support@ngoinfo.com</a>
        </p>
        <p>All plans include secure payment via Stripe. Cancel anytime.</p>
      </div>
    </div>
  );
}

