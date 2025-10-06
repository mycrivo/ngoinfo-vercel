import "../globals.css";
import Banner from "@ui/feedback/Banner";

export default function AppShell({ children }: { children: React.ReactNode }) {
  // Example of a global, server-first layout
  const profileComplete = true; // replace with real check
  return (
    <html lang="en">
      <body>
        {!profileComplete && (
          <div className="p-3">
            <Banner>Your profile seems incomplete. <a href="/profile">Complete it</a>.</Banner>
          </div>
        )}
        <main className="p-4">{children}</main>
      </body>
    </html>
  );
}


