/**
 * Telemetry & Error Tracking (V3)
 * 
 * Structured logging for UI events and errors.
 * Respects TELEMETRY_ENABLED flag from environment.
 * 
 * Future: Forward events to analytics service (Datadog, Sentry, etc.)
 */

export function logEvent(event: string, meta?: Record<string, unknown>) {
  if (process.env.NODE_ENV !== "production") {
    // Minimal local log; do not log PII
    console.error(`[telemetry] ${event}`, meta ?? {});
  }
}

export function supportId(): string {
  return Math.random().toString(36).slice(2, 10);
}

/**
 * Track UI Events
 * 
 * Centralized event tracking with structured payloads.
 * Guards behind TELEMETRY_ENABLED flag.
 * 
 * Usage:
 *   track("auth:login_attempt", { email: "user@example.com" })
 *   track("error:boundary_caught", { error: err.message })
 * 
 * Event naming convention: category:action
 * - auth:login_attempt, auth:login_success, auth:logout
 * - error:boundary_caught, error:api_failed
 * - nav:route_change
 * - ui:banner_dismissed, ui:button_clicked
 */
export function track(eventName: string, payload?: Record<string, unknown>) {
  // Check if telemetry is enabled
  const telemetryEnabled = typeof window !== "undefined" 
    ? window.localStorage?.getItem("telemetry_enabled") !== "false"
    : process.env.TELEMETRY_ENABLED !== "false";

  if (!telemetryEnabled) {
    return;
  }

  const timestamp = new Date().toISOString();
  const event = {
    name: eventName,
    timestamp,
    payload: payload || {},
    session_id: getSessionId(),
  };

  // Log to console (will be replaced with network call in production)
  if (process.env.NODE_ENV === "development") {
    console.log(`[track] ${eventName}`, event);
  } else {
    // Production: Send to analytics endpoint
    // TODO: Implement in Observability cluster
    // sendToAnalytics(event);
  }

  // Optional: Store in localStorage for debugging
  if (process.env.NODE_ENV === "development") {
    const recentEvents = getRecentEvents();
    recentEvents.push(event);
    // Keep only last 50 events
    if (recentEvents.length > 50) {
      recentEvents.shift();
    }
    if (typeof window !== "undefined") {
      window.localStorage?.setItem("telemetry_events", JSON.stringify(recentEvents));
    }
  }
}

/**
 * Get or create session ID for tracking
 */
function getSessionId(): string {
  if (typeof window === "undefined") {
    return "server";
  }

  let sessionId = window.sessionStorage?.getItem("telemetry_session_id");
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    window.sessionStorage?.setItem("telemetry_session_id", sessionId);
  }
  return sessionId;
}

/**
 * Get recent events from localStorage (dev only)
 */
function getRecentEvents(): Array<Record<string, unknown>> {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const stored = window.localStorage?.getItem("telemetry_events");
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

/**
 * Clear telemetry events (useful for debugging)
 */
export function clearTelemetryEvents() {
  if (typeof window !== "undefined") {
    window.localStorage?.removeItem("telemetry_events");
  }
}

/**
 * Get all tracked events (dev only)
 */
export function getTelemetryEvents(): Array<Record<string, unknown>> {
  return getRecentEvents();
}
