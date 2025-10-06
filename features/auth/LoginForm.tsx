"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/features/ui/Button";
import { Input } from "@/features/ui/Input";
import { Card } from "@/features/ui/Card";
import { Banner } from "@/features/ui/Banner";
import { useMockSession } from "./hooks/useMockSession";
import { track } from "@/lib/telemetry";

/**
 * Login Form Component
 * 
 * Branded login UI using NGOInfo design system.
 * Mock authentication - will integrate real auth in V11.
 */

export default function LoginForm() {
  const router = useRouter();
  const { login } = useMockSession();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate inputs
    if (!email || !password) {
      setError("Email and password are required");
      track("auth:login_failed", { reason: "empty_fields" });
      return;
    }

    setIsLoading(true);
    track("auth:login_attempt", { email });

    try {
      const result = await login(email, password);

      if (result.success) {
        track("auth:login_success", { email });
        
        // Redirect to dashboard after short delay
        setTimeout(() => {
          router.push("/dashboard");
        }, 1000);
      } else {
        setError(result.error || "Login failed");
        track("auth:login_failed", { reason: "invalid_credentials", email });
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      track("auth:login_error", { error: String(err) });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card elevation="md" padding="lg" className="w-full max-w-md">
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2>Sign In</h2>
          <p className="text-secondary">
            Access your NGOInfo account
          </p>
        </div>

        {error && (
          <Banner variant="error" dismissible onDismiss={() => setError(null)}>
            <strong>Error:</strong> {error}
          </Banner>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            id="email"
            type="email"
            label="Email"
            placeholder="you@example.org"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            fullWidth
            required
          />

          <Input
            id="password"
            type="password"
            label="Password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            fullWidth
            required
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <div className="text-center">
          <p className="text-small text-secondary">
            Mock authentication • Real auth in V11
          </p>
        </div>
      </div>
    </Card>
  );
}

