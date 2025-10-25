import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-md mx-auto text-center space-y-6 py-12">
      <div className="space-y-2">
        <h1 className="text-6xl font-bold" style={{ color: 'var(--text-secondary)' }}>404</h1>
        <h2 className="text-2xl font-semibold">Page Not Found</h2>
        <p style={{ color: 'var(--text-secondary)' }}>
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link 
          href="/" 
          className="px-6 py-2 rounded-md transition-colors"
          style={{ backgroundColor: 'var(--btn-primary-bg)', color: 'var(--text-inverse)' }}
        >
          Go Home
        </Link>
        <Link 
          href="/dashboard" 
          className="px-6 py-2 border rounded-md transition-colors"
          style={{ borderColor: 'var(--border-default)' }}
        >
          Dashboard
        </Link>
      </div>
    </div>
  );
}

