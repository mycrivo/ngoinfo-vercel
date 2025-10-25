import { z } from "zod";

/**
 * Environment Variable Schema
 * Validates all required and optional environment variables at runtime.
 * See .env.example for descriptions and ADR-005 for ownership matrix.
 */

// Client-side variables (NEXT_PUBLIC_* are exposed to browser)
const clientSchema = z.object({
  NEXT_PUBLIC_API_BASE_URL: z.string().url().optional().default("https://reqagent-dev.railway.app"),
  NEXT_PUBLIC_API_TIMEOUT_MS: z.string().transform(Number).pipe(z.number().positive()).optional().default("15000"),
  NEXT_PUBLIC_SITE_URL: z.string().url().optional().default("http://localhost:3000"),
  NEXT_PUBLIC_VERCEL_ANALYTICS_ID: z.string().optional(),
  
  // Stripe - Publishable key (safe to expose)
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().optional(),
});

// Server-side variables (never exposed to browser)
const serverSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  
  // Auth (future)
  AUTH_SECRET: z.string().optional(),
  NEXTAUTH_URL: z.string().url().optional(),
  OAUTH_CLIENT_ID: z.string().optional(),
  OAUTH_CLIENT_SECRET: z.string().optional(),
  
  // Observability
  SENTRY_DSN: z.string().url().optional(),
  SENTRY_ENVIRONMENT: z.string().optional(),
  
  // Stripe - Server-side keys (NEVER expose to client)
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  
  // Feature flags (server-side evaluation)
  USE_MSW: z.string().transform(val => val === "true").default("false"),
  ENABLE_BRANDING_PREVIEW: z.string().transform(val => val === "true").default("false"),
  DEBUG_ENABLED: z.string().transform(val => val === "true").default("false"),
  TELEMETRY_ENABLED: z.string().transform(val => val === "true").default("true"),
  
  // Build flags
  SKIP_TYPE_CHECK: z.string().transform(val => val === "true").default("false"),
  SKIP_LINT: z.string().transform(val => val === "true").default("false"),
  VERBOSE_LOGGING: z.string().transform(val => val === "true").default("false"),
});

/**
 * Validate and parse environment variables
 * Warns instead of throwing to prevent build failures
 */
function validateEnv() {
  try {
    const isServer = typeof window === "undefined";
    const isDev = process.env.NODE_ENV !== "production";

    // Client-side validation
    const clientEnv = {
      NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
      NEXT_PUBLIC_API_TIMEOUT_MS: process.env.NEXT_PUBLIC_API_TIMEOUT_MS,
      NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
      NEXT_PUBLIC_VERCEL_ANALYTICS_ID: process.env.NEXT_PUBLIC_VERCEL_ANALYTICS_ID,
      NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    };

    const clientResult = clientSchema.safeParse(clientEnv);

    if (!clientResult.success) {
      const errors = clientResult.error.format();
      const message = `[env] Invalid client environment variables: ${JSON.stringify(errors, null, 2)}`;
      console.warn(message);
    }

    // Server-side validation (only on server)
    if (isServer) {
      const serverEnv = {
        NODE_ENV: process.env.NODE_ENV,
        AUTH_SECRET: process.env.AUTH_SECRET,
        NEXTAUTH_URL: process.env.NEXTAUTH_URL,
        OAUTH_CLIENT_ID: process.env.OAUTH_CLIENT_ID,
        OAUTH_CLIENT_SECRET: process.env.OAUTH_CLIENT_SECRET,
        SENTRY_DSN: process.env.SENTRY_DSN,
        SENTRY_ENVIRONMENT: process.env.SENTRY_ENVIRONMENT,
        USE_MSW: process.env.USE_MSW,
        ENABLE_BRANDING_PREVIEW: process.env.ENABLE_BRANDING_PREVIEW,
        DEBUG_ENABLED: process.env.DEBUG_ENABLED,
        TELEMETRY_ENABLED: process.env.TELEMETRY_ENABLED,
        SKIP_TYPE_CHECK: process.env.SKIP_TYPE_CHECK,
        SKIP_LINT: process.env.SKIP_LINT,
        VERBOSE_LOGGING: process.env.VERBOSE_LOGGING,
      };

      const serverResult = serverSchema.safeParse(serverEnv);

      if (!serverResult.success) {
        const errors = serverResult.error.format();
        const message = `[env] Invalid server environment variables: ${JSON.stringify(errors, null, 2)}`;
        console.warn(message);
      }

      return {
        client: clientResult.success ? clientResult.data : clientSchema.parse({}),
        server: serverResult.success ? serverResult.data : serverSchema.parse({}),
      };
    }

    return {
      client: clientResult.success ? clientResult.data : clientSchema.parse({}),
      server: null, // Not available on client
    };
  } catch (error) {
    console.warn('[env] Environment validation failed, using defaults:', error);
    return {
      client: clientSchema.parse({}),
      server: typeof window === "undefined" ? serverSchema.parse({}) : null,
    };
  }
}

// Validate once at module load
const validated = validateEnv();

/**
 * Typed environment configuration
 * Usage: import { env } from "@lib/env"
 * 
 * Client: env.NEXT_PUBLIC_API_BASE_URL
 * Server: env.USE_MSW, env.DEBUG_ENABLED, etc.
 */
export const env = {
  // Client vars (safe to use anywhere)
  NEXT_PUBLIC_API_BASE_URL: validated.client.NEXT_PUBLIC_API_BASE_URL,
  NEXT_PUBLIC_API_TIMEOUT_MS: validated.client.NEXT_PUBLIC_API_TIMEOUT_MS,
  NEXT_PUBLIC_SITE_URL: validated.client.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_VERCEL_ANALYTICS_ID: validated.client.NEXT_PUBLIC_VERCEL_ANALYTICS_ID,
  
  // Server vars (only use in Server Components, API routes, middleware)
  ...(validated.server || {}),
};

export type Env = typeof env;

