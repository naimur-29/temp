// app/(organizer)/organizer/packages/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IPackage } from "@/app/models/Package";
import { IUser } from "@/app/models/User";
import PackageCard from "@/app/components/PackageCard";

export default function OrganizerPackagesPage() {
  const [packages, setPackages] = useState<IPackage[]>([]);
  const [organizers, setOrganizers] = useState<IUser[]>([]);
  const [selectedOrganizerId, setSelectedOrganizerId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Fetch approved organizers for the dropdown
  useEffect(() => {
    const fetchOrganizers = async () => {
      try {
        const res = await fetch("/api/users?role=organizer&status=approved");
        if (!res.ok) throw new Error("Failed to fetch organizers");
        const data = await res.json();
        setOrganizers(data);
        if (data.length > 0) {
          // Try to get from localStorage or default to first
          const storedOrgId = localStorage.getItem("selectedOrganizerId");
          if (
            storedOrgId &&
            data.find((o: IUser) => o._id.toString() === storedOrgId)
          ) {
            setSelectedOrganizerId(storedOrgId);
          } else {
            setSelectedOrganizerId(data[0]._id.toString());
          }
        }
      } catch (err: any) {
        setError(err.message);
      }
    };
    fetchOrganizers();
  }, []);

  // Fetch packages for the selected organizer
  useEffect(() => {
    if (!selectedOrganizerId) {
      setPackages([]); // Clear packages if no organizer is selected
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    const fetchPackages = async () => {
      try {
        const res = await fetch(
          `/api/packages?organizerId=${selectedOrganizerId}`,
        );
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Failed to fetch packages");
        }
        const data = await res.json();
        setPackages(data);
      } catch (err: any) {
        setError(err.message);
        setPackages([]); // Clear packages on error
      } finally {
        setIsLoading(false);
      }
    };
    fetchPackages();
  }, [selectedOrganizerId]);

  const handleOrganizerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const orgId = e.target.value;
    setSelectedOrganizerId(orgId);
    if (orgId) {
      localStorage.setItem("selectedOrganizerId", orgId); // Persist selection
    } else {
      localStorage.removeItem("selectedOrganizerId");
    }
  };

  const handleEdit = (packageId: string) => {
    router.push(`/organizer/packages/${packageId}/edit`);
  };

  const handleDelete = async (packageId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this package? This cannot be undone.",
      )
    ) {
      return;
    }
    setError(null);
    try {
      const res = await fetch(`/api/packages/${packageId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to delete package");
      }
      // Refresh packages list
      setPackages((prev) => prev.filter((p) => p._id.toString() !== packageId));
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">My Tour Packages</h1>
        <Link
          href="/organizer/packages/new"
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
        >
          + Add New Package
        </Link>
      </div>

      {error && (
        <p className="text-red-500 bg-red-100 p-3 rounded mb-4">
          Error: {error}
        </p>
      )}

      <div className="mb-6">
        <label
          htmlFor="organizerSelect"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Viewing Packages for Organizer:
        </label>
        <select
          id="organizerSelect"
          value={selectedOrganizerId}
          onChange={handleOrganizerChange}
          className="mt-1 block w-full md:w-1/2 lg:w-1/3 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="">-- Select an Organizer --</option>
          {organizers.map((org) => (
            <option key={org._id.toString()} value={org._id.toString()}>
              {org.name} ({org.email})
            </option>
          ))}
        </select>
        {organizers.length === 0 && !isLoading && (
          <p className="text-sm text-gray-500 mt-1">
            No approved organizers found. An admin needs to approve organizer
            accounts.
          </p>
        )}
      </div>

      {isLoading && (
        <p className="text-center text-gray-600">Loading packages...</p>
      )}
      {!isLoading && !selectedOrganizerId && organizers.length > 0 && (
        <p className="text-center text-gray-500">
          Please select an organizer to view their packages.
        </p>
      )}
      {!isLoading && selectedOrganizerId && packages.length === 0 && (
        <p className="text-center text-gray-500">
          No packages found for this organizer.{" "}
          <Link
            href="/organizer/packages/new"
            className="text-blue-500 hover:underline"
          >
            Create one now!
          </Link>
        </p>
      )}

      {!isLoading && packages.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <PackageCard
              key={pkg._id.toString()}
              pkg={pkg}
              showOrganizerActions={true}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
