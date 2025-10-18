import { env } from "@/lib/env";

/**
 * Feature Flags Configuration
 * Centralized toggle logic for experimental features and environment-specific behavior.
 * Derives flags from environment variables with per-env overrides.
 * 
 * Usage:
 *   import { flags } from "@lib/flags"
 *   if (flags.USE_MSW) { // ... }
 * 
 * See ADR-005 for flag ownership and lifecycle.
 */

type FeatureFlags = {
  /**
   * Mock Service Worker - Enable API mocking in development
   * Owner: Frontend team
   * Default: false (enable manually in .env.local for local dev)
   */
  USE_MSW: boolean;

  /**
   * Branding Preview - Enable experimental branding/design system features
   * Owner: Frontend team
   * Default: false (enable in staging for QA)
   */
  ENABLE_BRANDING_PREVIEW: boolean;

  /**
   * Debug Mode - Enable verbose logging and debug panels
   * Owner: Frontend team
   * Default: false in prod, can be true in dev
   */
  DEBUG_ENABLED: boolean;

  /**
   * Telemetry - Enable analytics and monitoring
   * Owner: Infrastructure team
   * Default: true (opt-out via env var)
   */
  TELEMETRY_ENABLED: boolean;

  /**
   * Verbose Logging - Enable detailed console logs
   * Owner: Frontend team
   * Default: false
   */
  VERBOSE_LOGGING: boolean;

  /**
   * Is Development - Convenience flag for NODE_ENV === 'development'
   */
  IS_DEV: boolean;

  /**
   * Is Production - Convenience flag for NODE_ENV === 'production'
   */
  IS_PROD: boolean;

  /**
   * Is Server - Runtime check for server-side code
   */
  IS_SERVER: boolean;
};

/**
 * Compute feature flags from environment variables
 * Server-side only (client will receive serialized values via props if needed)
 */
function computeFlags(): FeatureFlags {
  const isServer = typeof window === "undefined";
  const nodeEnv = env.NODE_ENV || "development";
  const isDev = nodeEnv === "development";
  const isProd = nodeEnv === "production";

  return {
    // Feature toggles from env
    USE_MSW: env.USE_MSW === true,
    ENABLE_BRANDING_PREVIEW: env.ENABLE_BRANDING_PREVIEW === true,
    DEBUG_ENABLED: env.DEBUG_ENABLED === true,
    TELEMETRY_ENABLED: env.TELEMETRY_ENABLED !== false, // Default true, opt-out
    VERBOSE_LOGGING: env.VERBOSE_LOGGING === true,

    // Environment helpers
    IS_DEV: isDev,
    IS_PROD: isProd,
    IS_SERVER: isServer,
  };
}

// Compute flags once at module load
export const flags = computeFlags();

/**
 * Log flags on server startup (development only)
 */
if (flags.IS_SERVER && flags.IS_DEV) {
  console.log("[flags] Feature flags initialized:", {
    USE_MSW: flags.USE_MSW,
    ENABLE_BRANDING_PREVIEW: flags.ENABLE_BRANDING_PREVIEW,
    DEBUG_ENABLED: flags.DEBUG_ENABLED,
    TELEMETRY_ENABLED: flags.TELEMETRY_ENABLED,
    VERBOSE_LOGGING: flags.VERBOSE_LOGGING,
    NODE_ENV: env.NODE_ENV,
  });
}

/**
 * Helper: Check if a flag is enabled
 * Useful for runtime checks with additional logic
 */
export function isFlagEnabled(flag: keyof FeatureFlags): boolean {
  return flags[flag] === true;
}

/**
 * Helper: Get all enabled flags as array of names
 * Useful for debugging and telemetry
 */
export function getEnabledFlags(): string[] {
  return Object.entries(flags)
    .filter(([_, value]) => value === true)
    .map(([key]) => key);
}

