# Runbooks

## Auth Down
1) Check Vercel logs for 5xx on /api/auth/*
2) Verify cookie domains & SameSite
3) Roll back last deploy
4) Post incident note with Support IDs

## Copilot Slow
1) Compare recent latency in telemetry
2) Throttle concurrency on server route; add queue notice
3) Capture minimal repro payload; attach to issue

## Schema Mismatch
1) Update zod schemas to current backend
2) Re-run typecheck to fix call sites


