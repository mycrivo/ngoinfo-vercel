"use client";
import { type TGenerateResponse } from "../schemas/grantpilot";
import Banner from "@ui/feedback/Banner";

export default function ResultPanel({ data }: { data: TGenerateResponse }) {
  if (data.type === "success") {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">{data.proposal.title}</h2>
        {data.proposal.sections.map((s, i) => (
          <section key={i} className="space-y-1">
            <h3 className="font-medium">{s.heading}</h3>
            <p>{s.body}</p>
          </section>
        ))}
      </div>
    );
  }
  if (data.type === "needs_review") {
    return (
      <Banner>
        <strong>Needs Review:</strong> {data.issues.join(", ")}
      </Banner>
    );
  }
  return <Banner>Error: {data.message}</Banner>;
}


