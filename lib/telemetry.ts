export function logEvent(event: string, meta?: Record<string, unknown>) {
  if (process.env.NODE_ENV !== "production") {
    // Minimal local log; do not log PII
    console.error(`[telemetry] ${event}`, meta ?? {});
  }
}
export function supportId(): string {
  return Math.random().toString(36).slice(2, 10);
}


