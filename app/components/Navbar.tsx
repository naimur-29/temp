// app/components/Navbar.tsx
"use client"; // Needed if you plan to add any client-side interactivity later (e.g., mobile menu toggle)

import Link from "next/link";
import { usePathname } from "next/navigation"; // To highlight active link

const Navbar = () => {
  const pathname = usePathname(); // Get current path

  // Helper function to determine if a link is active
  const isActive = (path: string) => pathname === path;
  const isPartiallyActive = (path: string) =>
    pathname.startsWith(path) && path !== "/";

  // In a real app, user role would come from auth context or localStorage.
  // For simplicity, we'll just show all links, but style active ones.

  const navLinkClasses =
    "px-3 py-2 rounded-md text-sm font-medium transition-colors";
  const activeLinkClasses = "bg-blue-700 text-white";
  const inactiveLinkClasses =
    "text-blue-100 hover:bg-blue-500 hover:text-white";

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo / App Name */}
          <div className="flex-shrink-0">
            <Link
              href="/"
              className={`text-xl font-bold ${isActive("/") ? "text-white" : "text-blue-100 hover:text-white"}`}
            >
              TourApp
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {/* Common Links */}
              <Link
                href="/customer/packages"
                className={`${navLinkClasses} ${isPartiallyActive("/customer/packages") || isActive("/customer/book-package") ? activeLinkClasses : inactiveLinkClasses}`}
              >
                Packages
              </Link>

              {/* Customer Links */}
              <div className="relative group">
                <button
                  className={`${navLinkClasses} ${isPartiallyActive("/customer") && !isPartiallyActive("/customer/packages") ? activeLinkClasses : inactiveLinkClasses} flex items-center`}
                >
                  Customer
                  <svg
                    className="ml-1 h-4 w-4 text-blue-200 group-hover:text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-in-out z-50">
                  <div
                    className="py-1"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="options-menu"
                  >
                    <Link
                      href="/customer/my-bookings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      role="menuitem"
                    >
                      My Bookings
                    </Link>
                    {/* Add more customer links here if needed */}
                  </div>
                </div>
              </div>

              {/* Organizer Links */}
              <div className="relative group">
                <button
                  className={`${navLinkClasses} ${isPartiallyActive("/organizer") ? activeLinkClasses : inactiveLinkClasses} flex items-center`}
                >
                  Organizer
                  <svg
                    className="ml-1 h-4 w-4 text-blue-200 group-hover:text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-in-out z-50">
                  <div className="py-1" role="menu" aria-orientation="vertical">
                    <Link
                      href="/organizer/dashboard"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      role="menuitem"
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/organizer/packages"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      role="menuitem"
                    >
                      My Packages
                    </Link>
                    <Link
                      href="/organizer/packages/new"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      role="menuitem"
                    >
                      Add Package
                    </Link>
                  </div>
                </div>
              </div>

              {/* Admin Links */}
              <div className="relative group">
                <button
                  className={`${navLinkClasses} ${isPartiallyActive("/admin") ? activeLinkClasses : inactiveLinkClasses} flex items-center`}
                >
                  Admin
                  <svg
                    className="ml-1 h-4 w-4 text-blue-200 group-hover:text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-in-out z-50">
                  <div className="py-1" role="menu" aria-orientation="vertical">
                    <Link
                      href="/admin/dashboard"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      role="menuitem"
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/admin/manage-users"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      role="menuitem"
                    >
                      Manage Users
                    </Link>
                    <Link
                      href="/admin/manage-packages"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      role="menuitem"
                    >
                      Manage Packages
                    </Link>
                  </div>
                </div>
              </div>

              {/* Simplified "User Registration" / Seeder */}
              <Link
                href="/api/dev/seed-all"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Seed Users (Dev)
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button (placeholder, no functionality yet) */}
          <div className="-mr-2 flex md:hidden">
            <button
              type="button"
              className="bg-blue-600 inline-flex items-center justify-center p-2 rounded-md text-blue-200 hover:text-white hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-600 focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {/* Icon for menu open/close (Heroicons) */}
              <svg
                className="block h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu (placeholder, hidden by default) */}
      <div className="md:hidden hidden" id="mobile-menu">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {/* Add mobile versions of links here */}
          <Link
            href="/customer/packages"
            className="text-blue-100 hover:bg-blue-500 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
          >
            Packages
          </Link>
          <Link
            href="/customer/my-bookings"
            className="text-blue-100 hover:bg-blue-500 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
          >
            My Bookings
          </Link>
          <Link
            href="/organizer/dashboard"
            className="text-blue-100 hover:bg-blue-500 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
          >
            Organizer Dashboard
          </Link>
          <Link
            href="/admin/dashboard"
            className="text-blue-100 hover:bg-blue-500 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
          >
            Admin Dashboard
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
