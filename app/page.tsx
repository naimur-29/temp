// app/page.tsx
import Link from "next/link";

export default function HomePage() {
  const backgroundImageUrl =
    "https://images.pexels.com/photos/2147993/pexels-photo-2147993.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";

  return (
    <div className="relative min-h-[calc(100vh-4rem-3.5rem)] flex flex-col items-center justify-center text-center py-10 px-4 sm:px-6 lg:px-8">
      {/* Background Image Container */}
      <div
        className="absolute inset-0 z-[-1] bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${backgroundImageUrl})`,
        }}
      >
        {/* Overlay for better text readability (optional) */}
        <div className="absolute inset-0 bg-black opacity-50"></div>
      </div>

      {/* Content Section - ensure this is above the background */}
      <div className="relative z-10 bg-white/70 backdrop-blur-sm p-8 md:p-12 rounded-xl shadow-2xl max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-blue-700">
          Welcome to TourApp!
        </h1>
        <p className="text-lg md:text-xl text-gray-800 mb-10 ">
          Your one-stop destination to find, book, and manage amazing tour
          packages. Explore adventures curated by organizers and overseen by our
          admin team.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Card styling adjusted for better contrast on potentially varied backgrounds */}
          <div className="bg-blue-50 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow border border-blue-200">
            <h2 className="text-2xl font-semibold mb-3 text-indigo-700">
              For Customers
            </h2>
            <p className="text-gray-700 mb-4">
              Browse exciting packages, book your dream vacation, manage your
              bookings, and share your experiences by leaving reviews.
            </p>
            <Link
              href="/customer/packages"
              className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded transition-colors shadow hover:shadow-md"
            >
              Explore Packages
            </Link>
          </div>

          <div className="bg-green-50 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow border border-green-200">
            <h2 className="text-2xl font-semibold mb-3 text-green-700">
              For Organizers
            </h2>
            <p className="text-gray-700 mb-4">
              Showcase your unique tour offerings. Add, edit, and manage your
              packages to reach a wider audience of adventure seekers.
            </p>
            <Link
              href="/organizer/dashboard"
              className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded transition-colors shadow hover:shadow-md"
            >
              Go to Dashboard
            </Link>
          </div>

          <div className="bg-purple-50 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow border border-purple-200">
            <h2 className="text-2xl font-semibold mb-3 text-purple-700">
              For Admins
            </h2>
            <p className="text-gray-700 mb-4">
              Oversee the platform by managing user accounts and tour packages.
              Ensure quality and a smooth experience for everyone.
            </p>
            <Link
              href="/admin/dashboard"
              className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded transition-colors shadow hover:shadow-md"
            >
              Admin Panel
            </Link>
          </div>
        </div>
      </div>

      {/* Seeder link moved outside the main blurred content box for clarity, or could be inside */}
      <div className="relative z-10 mt-12 bg-gray-800/80 backdrop-blur-sm p-4 rounded-lg">
        <p className="text-gray-200">
          To get started, you might want to seed some initial users and
          packages.
        </p>
        <Link
          href="/api/dev/seed-all"
          className="mt-2 inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded transition-colors shadow hover:shadow-md"
          target="_blank"
          rel="noopener noreferrer"
        >
          Seed All Data (Dev Only)
        </Link>
        <p className="text-xs text-gray-400 mt-1">
          (Opens in new tab. You only need to do this once.)
        </p>
      </div>
    </div>
  );
}
