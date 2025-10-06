export default function LoginPage() {
  if (process.env.NODE_ENV !== "production") {
    console.log("[route] /login rendered");
  }

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Sign In</h1>
        <p className="text-gray-600">Access your NGOInfo account</p>
      </div>

      <div className="border rounded-lg p-8 space-y-4 bg-white">
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="you@example.org"
            className="w-full px-3 py-2 border rounded-md"
            disabled
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-medium">
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            className="w-full px-3 py-2 border rounded-md"
            disabled
          />
        </div>

        <button
          type="button"
          className="w-full px-4 py-2 bg-gray-300 text-gray-500 rounded-md cursor-not-allowed"
          disabled
        >
          Sign In (Coming Soon)
        </button>

        <p className="text-xs text-center text-gray-500">
          Authentication will be implemented in a future release.
        </p>
      </div>
    </div>
  );
}

