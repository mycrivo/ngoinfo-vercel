import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "GrantPilot - NGOInfo",
  description: "AI-powered grant proposal generation",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}

