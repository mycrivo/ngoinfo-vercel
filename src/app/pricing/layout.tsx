import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Pricing - NGOInfo",
  description: "Choose your plan and start your free trial",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}

