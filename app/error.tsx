"use client";

import { useEffect } from "react";
import { supportId } from "@/lib/telemetry";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const errorId = supportId();

  useEffect(() => {
    // Log error to console in dev, would send to monitoring in production
    console.error(`[error] ${errorId}:`, error);
  }, [error, errorId]);

  return (
    <div className="max-w-md mx-auto text-center space-y-6 py-12">
      <div className="space-y-2">
        <h1 className="text-6xl font-bold text-red-300">500</h1>
        <h2 className="text-2xl font-semibold">Something Went Wrong</h2>
        <p className="text-gray-600">
          We encountered an unexpected error. Our team has been notified.
        </p>
        <p className="text-xs text-gray-500 font-mono">
          Support ID: {errorId}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onClick={reset}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
        <a
          href="/"
          className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          Go Home
        </a>
      </div>
    </div>
  );
}

