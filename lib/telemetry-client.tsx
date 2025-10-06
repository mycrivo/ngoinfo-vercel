"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Route Change Telemetry Logger (Stub for V2)
 * 
 * Client component that tracks navigation between pages.
 * Logs route changes to console in development.
 * 
 * Future: Send to analytics service (Vercel Analytics, Google Analytics, etc.)
 * 
 * Mount in app shell layout.
 */

let previousPathname: string | null = null;

export default function RouteChangeTelemetry() {
  const pathname = usePathname();

  useEffect(() => {
    if (previousPathname && previousPathname !== pathname) {
      const timestamp = new Date().toISOString();
      console.log(`[telemetry:nav] from=${previousPathname} to=${pathname} timestamp=${timestamp}`);
      
      // Future: Send to analytics
      // analytics.track('page_view', { from: previousPathname, to: pathname });
    }
    
    previousPathname = pathname;
  }, [pathname]);

  // This component renders nothing
  return null;
}

