import "./globals.css";
import Header from "@ui/layout/Header";
import Footer from "@ui/layout/Footer";

export const metadata = {
  title: "NGOInfo",
  description: "Grant proposal generation and funding opportunities",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-6 md:py-8">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}

