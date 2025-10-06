"use client";

import { useState, useEffect } from "react";

/**
 * Mock Session Hook
 * 
 * Manages fake authentication state using localStorage.
 * Will be replaced with real auth provider (NextAuth/Clerk) in V11.
 * 
 * Session flag: gp_session=true in localStorage
 */

const SESSION_KEY = "gp_session";

export interface MockSession {
  isAuthenticated: boolean;
  email?: string;
}

export function useMockSession() {
  const [session, setSession] = useState<MockSession>({ isAuthenticated: false });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    const sessionData = localStorage.getItem(SESSION_KEY);
    if (sessionData === "true") {
      const email = localStorage.getItem("gp_session_email");
      setSession({ isAuthenticated: true, email: email || undefined });
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Validate inputs
    if (!email || !password) {
      return { success: false, error: "Email and password are required" };
    }

    // Simulate 20% failure rate
    if (Math.random() < 0.2) {
      return { success: false, error: "Invalid credentials. Please try again." };
    }

    // Success - set session
    localStorage.setItem(SESSION_KEY, "true");
    localStorage.setItem("gp_session_email", email);
    setSession({ isAuthenticated: true, email });

    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem("gp_session_email");
    setSession({ isAuthenticated: false });
  };

  return {
    session,
    isLoading,
    login,
    logout,
  };
}

