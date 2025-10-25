import { z } from "zod";

export const ProfileInput = z.object({
  orgName: z.string().min(2),
  country: z.string().min(2),
  sectors: z.array(z.string()).min(1),
});

export const GenerateRequest = z.object({
  opportunityId: z.string().min(3),
  promptVersion: z.string().default("v1"),
  profile: ProfileInput
});

export const Source = z.object({
  label: z.string(),
  url: z.string().url()
});

export const ProposalDoc = z.object({
  title: z.string(),
  sections: z.array(z.object({ heading: z.string(), body: z.string() }))
});

export const GenerateResponse = z.discriminatedUnion("type", [
  z.object({ type: z.literal("success"), proposal: ProposalDoc, sources: z.array(Source), promptVersion: z.string() }),
  z.object({ type: z.literal("needs_review"), issues: z.array(z.string()), draft: z.any() }),
  z.object({ type: z.literal("error"), code: z.string(), message: z.string() })
]);

export type TGenerateRequest = z.infer<typeof GenerateRequest>;
export type TGenerateResponse = z.infer<typeof GenerateResponse>;








