// app/(admin)/admin/dashboard/page.tsx
import Link from "next/link";

export default function AdminDashboardPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Admin Dashboard</h1>
      <p className="mb-4 text-lg text-gray-700">Welcome, Admin!</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="/admin/manage-users"
          className="block p-6 bg-white rounded-lg shadow-md hover:bg-gray-50"
        >
          <h2 className="text-xl font-semibold text-blue-600">Manage Users</h2>
          <p className="text-gray-600">
            Approve, reject, or view user accounts.
          </p>
        </Link>
        <Link
          href="/admin/manage-packages"
          className="block p-6 bg-white rounded-lg shadow-md hover:bg-gray-50"
        >
          <h2 className="text-xl font-semibold text-green-600">
            Manage Packages
          </h2>
          <p className="text-gray-600">
            Approve, reject, or view tour packages.
          </p>
        </Link>
      </div>
    </div>
  );
}
