"use client";

import React, { Component, ReactNode } from "react";
import { Button } from "@/features/ui/Button";
import { Card } from "@/features/ui/Card";
import { track } from "@/lib/telemetry";

/**
 * Error Boundary Components
 * 
 * Catches React errors and displays branded fallback UI.
 * Logs errors to telemetry for monitoring.
 * 
 * Two variants:
 * - Global: Full-page fallback for catastrophic errors
 * - Inline: Card-based fallback for component errors
 */

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: "global" | "inline";
  onReset?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static getDerivedStateFromError(_error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to telemetry
    track("error:boundary_caught", {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      fallback: this.props.fallback || "global",
    });

    this.setState({
      error,
      errorInfo,
    });

    // Also log to console in development
    if (process.env.NODE_ENV === "development") {
      console.error("[ErrorBoundary]", error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
    
    this.props.onReset?.();
    track("error:boundary_reset", { fallback: this.props.fallback || "global" });
  };

  render() {
    if (this.state.hasError) {
      const fallbackType = this.props.fallback || "global";
      
      if (fallbackType === "inline") {
        return <InlineErrorFallback error={this.state.error} onReset={this.handleReset} />;
      }
      
      return <GlobalErrorFallback error={this.state.error} onReset={this.handleReset} />;
    }

    return this.props.children;
  }
}

/**
 * Global Error Fallback - Full-page error state
 */
function GlobalErrorFallback({ error, onReset }: { error: Error | null; onReset: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{backgroundColor: 'var(--surface-subtle)'}}>
      <Card elevation="lg" padding="lg" className="max-w-lg w-full text-center">
        <div className="space-y-6">
          <div>
            <div className="text-6xl mb-4">⚠️</div>
            <h1 className="mb-3">Something Went Wrong</h1>
            <p className="text-secondary">
              We encountered an unexpected error. Please try refreshing the page or contact support if the problem persists.
            </p>
          </div>

          {process.env.NODE_ENV === "development" && error && (
            <div className="text-left p-4 rounded-lg text-small font-mono overflow-auto max-h-48" style={{backgroundColor: 'var(--neutral-100)', color: 'var(--colour-error)'}}>
              <p className="font-bold mb-2">Development Error Details:</p>
              <p>{error.message}</p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="secondary" onClick={onReset}>
              Try Again
            </Button>
            <Button variant="primary" onClick={() => window.location.href = "/"}>
              Go Home
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

/**
 * Inline Error Fallback - Component-level error card
 */
function InlineErrorFallback({ error, onReset }: { error: Error | null; onReset: () => void }) {
  return (
    <Card elevation="sm" padding="md" style={{borderColor: 'var(--colour-error)', borderWidth: '2px'}}>
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <svg className="w-6 h-6 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20" style={{color: 'var(--colour-error)'}}>
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <div className="flex-1">
            <h3 className="font-semibold mb-1" style={{color: 'var(--colour-error)'}}>
              Component Error
            </h3>
            <p className="text-small text-secondary">
              This component failed to render. {process.env.NODE_ENV === "development" && error ? error.message : "Please try again."}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={onReset}>
            Retry
          </Button>
        </div>
      </div>
    </Card>
  );
}

