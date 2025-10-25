export const dynamic = "force-static";

export default function HealthPage() {
  if (process.env.NODE_ENV !== "production") {
    console.log("[route] /health rendered");
  }

  return (
    <div className="max-w-md mx-auto text-center space-y-4 py-12">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100">
        <svg 
          className="w-8 h-8 text-green-600" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M5 13l4 4L19 7" 
          />
        </svg>
      </div>
      <h1 className="text-2xl font-bold">System Status</h1>
      <p className="text-4xl font-bold text-green-600">OK</p>
      <p className="text-sm text-gray-600">All systems operational</p>
    </div>
  );
}

