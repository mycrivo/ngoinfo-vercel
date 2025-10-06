export default function DashboardPage() {
  if (process.env.NODE_ENV !== "production") {
    console.log("[route] /dashboard rendered");
  }

  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-600 mt-1">Protected area placeholder</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="border rounded-lg p-6 space-y-2">
          <h2 className="text-sm font-medium text-gray-600">Active Proposals</h2>
          <p className="text-3xl font-bold">—</p>
          <p className="text-xs text-gray-500">No data available</p>
        </div>

        <div className="border rounded-lg p-6 space-y-2">
          <h2 className="text-sm font-medium text-gray-600">Opportunities</h2>
          <p className="text-3xl font-bold">—</p>
          <p className="text-xs text-gray-500">No data available</p>
        </div>

        <div className="border rounded-lg p-6 space-y-2">
          <h2 className="text-sm font-medium text-gray-600">Success Rate</h2>
          <p className="text-3xl font-bold">—</p>
          <p className="text-xs text-gray-500">No data available</p>
        </div>
      </div>

      <div className="border rounded-lg p-6 space-y-4">
        <h2 className="text-xl font-semibold">Recent Activity</h2>
        <div className="text-center py-12 text-gray-500">
          <p>No recent activity to display.</p>
          <p className="text-sm mt-2">Data fetching will be implemented in a future release.</p>
        </div>
      </div>
    </div>
  );
}

