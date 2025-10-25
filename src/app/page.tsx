import Link from "next/link";

export default function HomePage() {
  if (process.env.NODE_ENV !== "production") {
    console.log("[route] / rendered");
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <section className="text-center space-y-4 py-12">
        <h1 className="text-4xl md:text-5xl font-bold">
          Welcome to NGOInfo
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
          AI-powered grant proposal generation and funding opportunity discovery for non-profit organizations.
        </p>
      </section>

      <section className="grid md:grid-cols-2 gap-6">
        <div className="border rounded-lg p-6 space-y-3">
          <h2 className="text-xl font-semibold">GrantPilot</h2>
          <p className="text-gray-600">
            Generate tailored grant proposals using AI-powered insights and best practices.
          </p>
          <Link 
            href="/dashboard" 
            className="inline-block text-sm font-medium text-blue-600 hover:underline"
          >
            Get Started →
          </Link>
        </div>

        <div className="border rounded-lg p-6 space-y-3">
          <h2 className="text-xl font-semibold">Funding Opportunities</h2>
          <p className="text-gray-600">
            Discover relevant funding opportunities matched to your organization's mission.
          </p>
          <Link 
            href="/dashboard" 
            className="inline-block text-sm font-medium text-blue-600 hover:underline"
          >
            Explore →
          </Link>
        </div>
      </section>

      <section className="text-center py-8">
        <Link 
          href="/login" 
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Sign In to Continue
        </Link>
      </section>
    </div>
  );
}

