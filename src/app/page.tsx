/**
 * Landing Page (Public)
 * 
 * Simple entry point with auth CTAs.
 * Redirects to dashboard if already logged in.
 */

import Link from "next/link"
import { getSession } from "@/lib/auth"
import { Card } from "@/features/ui/Card"
import { Button } from "@/features/ui/Button"

export default async function HomePage() {
  const session = await getSession()

  // If already logged in, show dashboard link
  if (session) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 text-center py-12">
        <h1 className="text-4xl font-bold">Welcome Back!</h1>
        <p className="text-lg text-gray-600">
          You're already signed in as {session.user.email}
        </p>
        <div className="flex gap-4 justify-center">
          <Button variant="primary">
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
          <Button variant="ghost">
            <Link href="/logout">Sign Out</Link>
          </Button>
        </div>
      </div>
    )
  }

  // Public landing page
  return (
    <div className="max-w-4xl mx-auto space-y-12 py-12">
      {/* Hero Section */}
      <section className="text-center space-y-6">
        <h1 className="text-5xl md:text-6xl font-bold">NGOInfo</h1>
        <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
          AI-powered grant proposal generation for African NGOs.
          Maximize your funding success with expert-reviewed proposals.
        </p>
        
        <div className="flex gap-4 justify-center pt-4">
          <Button variant="primary" size="lg">
            <Link href="/login">Sign Up / Login</Link>
          </Button>
          <Button variant="secondary" size="lg">
            <Link href="/pricing">View Pricing</Link>
          </Button>
        </div>
      </section>

      {/* Value Props */}
      <section className="grid md:grid-cols-3 gap-6">
        <Card elevation="md">
          <div className="text-center space-y-3">
            <div className="text-4xl">✨</div>
            <h3 className="text-lg font-semibold">AI-Powered Generation</h3>
            <p className="text-sm text-gray-600">
              Generate professional grant proposals in minutes, not days
            </p>
          </div>
        </Card>

        <Card elevation="md">
          <div className="text-center space-y-3">
            <div className="text-4xl">👥</div>
            <h3 className="text-lg font-semibold">Expert Review</h3>
            <p className="text-sm text-gray-600">
              Optional manual review from grant writing experts
            </p>
          </div>
        </Card>

        <Card elevation="md">
          <div className="text-center space-y-3">
            <div className="text-4xl">🎯</div>
            <h3 className="text-lg font-semibold">Opportunity Matching</h3>
            <p className="text-sm text-gray-600">
              Discover funding opportunities tailored to your mission
            </p>
          </div>
        </Card>
      </section>

      {/* Trial CTA */}
      <section className="text-center space-y-4 py-8">
        <h2 className="text-3xl font-bold">Start Your Free Trial</h2>
        <p className="text-lg text-gray-600">
          2 days free • 1 proposal generation • No credit card required
        </p>
        <Button variant="primary" size="lg">
          <Link href="/login">Get Started Now</Link>
        </Button>
      </section>
    </div>
  )
}

