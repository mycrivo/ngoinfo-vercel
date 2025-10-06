import { http } from "@lib/http";
import { GenerateRequest, type TGenerateRequest, type TGenerateResponse } from "../schemas/grantpilot";

export async function generateProposal(req: TGenerateRequest, opts?: { timeoutMs?: number }) {
  const parsed = GenerateRequest.parse(req);
  // In prod, call Railway Copilot API from a server route; keep client thin.
  return http<TGenerateResponse>(`/api/mock/copilot/generate`, {
    method: "POST",
    body: JSON.stringify(parsed),
    headers: { "Content-Type": "application/json" },
    timeoutMs: opts?.timeoutMs
  });
}


