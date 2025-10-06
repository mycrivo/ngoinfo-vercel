import { http } from "@lib/http";

export type FundingOpportunity = {
  id: string;
  title: string;
  donor: string;
  deadline?: string;
  url: string;
};

export async function getFundingOpportunity(id: string, opts?: { timeoutMs?: number }) {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "";
  // In real usage, point to Railway ReqAgent base via server-only config
  return http<FundingOpportunity>(`${base}/api/mock/reqagent/opportunities/${id}`, {
    timeoutMs: opts?.timeoutMs
  });
}


