import "./globals.css";
import "@/styles/tokens.css";
import Header from "@/ui/layout/Header";
import Footer from "@/ui/layout/Footer";
import RouteChangeTelemetry from "@/lib/telemetry-client";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export const metadata = {
  title: "NGOInfo",
  description: "Grant proposal generation and funding opportunities",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <ErrorBoundary fallback="global">
          <RouteChangeTelemetry />
          <Header />
          <main className="flex-1 container mx-auto px-4 py-6 md:py-8">
            {children}
          </main>
          <Footer />
        </ErrorBoundary>
      </body>
    </html>
  );
}

