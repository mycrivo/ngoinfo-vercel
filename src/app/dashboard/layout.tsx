import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Dashboard - NGOInfo",
  description: "Manage your grant proposals and funding opportunities",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}

