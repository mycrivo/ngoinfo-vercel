import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-md mx-auto text-center space-y-6 py-12">
      <div className="space-y-2">
        <h1 className="text-6xl font-bold text-gray-300">404</h1>
        <h2 className="text-2xl font-semibold">Page Not Found</h2>
        <p className="text-gray-600">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link 
          href="/" 
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Go Home
        </Link>
        <Link 
          href="/dashboard" 
          className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          Dashboard
        </Link>
      </div>
    </div>
  );
}

