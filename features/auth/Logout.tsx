"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/features/ui/Card";
import { Button } from "@/features/ui/Button";
import { useMockSession } from "./hooks/useMockSession";
import { track } from "@/lib/telemetry";

/**
 * Logout Component
 * 
 * Confirms logout and clears mock session.
 * Redirects to home page after logout.
 */

export default function Logout() {
  const router = useRouter();
  const { logout } = useMockSession();

  const handleLogout = () => {
    track("auth:logout", {});
    logout();
    
    // Redirect to home after short delay
    setTimeout(() => {
      router.push("/");
    }, 500);
  };

  useEffect(() => {
    track("auth:logout_page_view", {});
  }, []);

  return (
    <Card elevation="md" padding="lg" className="w-full max-w-md mx-auto">
      <div className="space-y-6 text-center">
        <div className="space-y-2">
          <h2>Sign Out</h2>
          <p className="text-secondary">
            Are you sure you want to sign out?
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            variant="secondary"
            size="md"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={handleLogout}
          >
            Sign Out
          </Button>
        </div>
      </div>
    </Card>
  );
}

