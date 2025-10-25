import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Funding Opportunities - NGOInfo",
  description: "Discover grant opportunities for your NGO",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}

