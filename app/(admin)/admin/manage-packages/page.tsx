// app/(admin)/admin/manage-packages/page.tsx
"use client";

import { useEffect, useState } from "react";
import { IPackage } from "@/app/models/Package";
import PackageCard from "@/app/components/PackageCard"; // Import PackageCard

export default function ManagePackagesPage() {
  const [packages, setPackages] = useState<IPackage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("pending");

  const fetchPackages = async (status?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // API populates organizerId with name and email
      const res = await fetch(
        `/api/packages${status ? `?status=${status}` : ""}`,
      );
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to fetch packages");
      }
      const data = await res.json();
      setPackages(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages(filterStatus);
  }, [filterStatus]);

  const handleApprove = async (packageId: string) => {
    setError(null);
    try {
      const res = await fetch(`/api/packages/${packageId}/approve`, {
        method: "PATCH",
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to approve package");
      }
      fetchPackages(filterStatus);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleReject = async (packageId: string) => {
    setError(null);
    try {
      const res = await fetch(`/api/packages/${packageId}/reject`, {
        method: "PATCH",
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to reject package");
      }
      fetchPackages(filterStatus);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Manage Tour Packages
      </h1>
      {error && (
        <p className="text-red-500 bg-red-100 p-3 rounded mb-4">
          Error: {error}
        </p>
      )}
      <div className="mb-4 flex space-x-2">
        <button
          onClick={() => setFilterStatus("pending")}
          className={`font-bold py-2 px-4 rounded ${filterStatus === "pending" ? "bg-yellow-500 text-white" : "bg-gray-200 hover:bg-gray-300"}`}
        >
          Pending
        </button>
        <button
          onClick={() => setFilterStatus("approved")}
          className={`font-bold py-2 px-4 rounded ${filterStatus === "approved" ? "bg-green-500 text-white" : "bg-gray-200 hover:bg-gray-300"}`}
        >
          Approved
        </button>
        <button
          onClick={() => setFilterStatus("rejected")}
          className={`font-bold py-2 px-4 rounded ${filterStatus === "rejected" ? "bg-red-500 text-white" : "bg-gray-200 hover:bg-gray-300"}`}
        >
          Rejected
        </button>
        <button
          onClick={() => setFilterStatus("")}
          className={`font-bold py-2 px-4 rounded ${filterStatus === "" ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300"}`}
        >
          All
        </button>
      </div>

      {isLoading && (
        <p className="text-center text-gray-600">Loading packages...</p>
      )}
      {!isLoading && packages.length === 0 && (
        <p className="text-center text-gray-500">
          No packages found for this filter.
        </p>
      )}

      {!isLoading && packages.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <PackageCard
              key={pkg._id.toString()}
              pkg={pkg}
              showAdminActions={true}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          ))}
        </div>
      )}
    </div>
  );
}
