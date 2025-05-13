// app/(customer)/customer/dashboard/page.tsx
import Link from "next/link";

export default function CustomerDashboardPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Customer Dashboard
      </h1>
      <p className="mb-8 text-lg text-gray-700">
        Welcome, Customer! Manage your adventures and preferences here.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          href="/customer/packages"
          className="block p-6 bg-white rounded-lg shadow-md hover:bg-gray-50 transition-all transform hover:scale-105"
        >
          <h2 className="text-xl font-semibold text-blue-600 mb-2">
            Browse Packages
          </h2>
          <p className="text-gray-600">Find your next exciting tour.</p>
        </Link>

        <Link
          href="/customer/my-bookings"
          className="block p-6 bg-white rounded-lg shadow-md hover:bg-gray-50 transition-all transform hover:scale-105"
        >
          <h2 className="text-xl font-semibold text-green-600 mb-2">
            My Bookings
          </h2>
          <p className="text-gray-600">
            View and manage your existing bookings.
          </p>
        </Link>

        {/* Placeholder for future features */}
        <div className="p-6 bg-gray-200 rounded-lg shadow-md cursor-not-allowed">
          <h2 className="text-xl font-semibold text-gray-500 mb-2">
            My Profile (Coming Soon)
          </h2>
          <p className="text-gray-500">Update your personal information.</p>
        </div>

        <div className="p-6 bg-gray-200 rounded-lg shadow-md cursor-not-allowed">
          <h2 className="text-xl font-semibold text-gray-500 mb-2">
            My Reviews (Coming Soon)
          </h2>
          <p className="text-gray-500">See all the reviews you've submitted.</p>
        </div>
      </div>
    </div>
  );
}
