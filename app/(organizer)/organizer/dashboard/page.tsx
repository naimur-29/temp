// app/(organizer)/organizer/dashboard/page.tsx
import Link from "next/link";

export default function OrganizerDashboardPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Organizer Dashboard
      </h1>
      <p className="mb-4 text-lg text-gray-700">Welcome, Organizer!</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="/organizer/packages"
          className="block p-6 bg-white rounded-lg shadow-md hover:bg-gray-50"
        >
          <h2 className="text-xl font-semibold text-purple-600">My Packages</h2>
          <p className="text-gray-600">
            View, edit, or delete your tour packages.
          </p>
        </Link>
        <Link
          href="/organizer/packages/new"
          className="block p-6 bg-white rounded-lg shadow-md hover:bg-gray-50"
        >
          <h2 className="text-xl font-semibold text-teal-600">
            Add New Package
          </h2>
          <p className="text-gray-600">
            Create and submit a new tour package for approval.
          </p>
        </Link>
      </div>
    </div>
  );
}
