import { NextResponse, type NextRequest } from "next/server";

// Simple rate limit example (IP-based, non-persistent). Replace with durable store in prod.
const WINDOW_MS = 15_000;
const MAX_REQ = 30;
const hits = new Map<string, { count: number; ts: number }>();

export function middleware(req: NextRequest) {
  const ip = req.ip ?? req.headers.get("x-forwarded-for") ?? "unknown";
  const entry = hits.get(ip) ?? { count: 0, ts: Date.now() };
  const now = Date.now();

  if (now - entry.ts > WINDOW_MS) {
    entry.count = 0;
    entry.ts = now;
  }
  entry.count += 1;
  hits.set(ip, entry);

  if (entry.count > MAX_REQ) {
    return new NextResponse("Too Many Requests", { status: 429 });
  }
  return NextResponse.next();
}


