import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b bg-white">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-lg font-semibold">
              NGOInfo
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-sm hover:underline">
                Home
              </Link>
              <Link href="/dashboard" className="text-sm hover:underline">
                Dashboard
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm hover:underline">
              Login
            </Link>
          </div>
        </nav>
        {/* Mobile nav */}
        <div className="flex md:hidden items-center gap-4 mt-3 pt-3 border-t">
          <Link href="/" className="text-sm hover:underline">
            Home
          </Link>
          <Link href="/dashboard" className="text-sm hover:underline">
            Dashboard
          </Link>
        </div>
      </div>
    </header>
  );
}

