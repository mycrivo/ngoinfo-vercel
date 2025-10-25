import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Opportunity Details - NGOInfo",
  description: "View funding opportunity details",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}

