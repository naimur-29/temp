// app/(customer)/customer/packages/page.tsx
"use client";

import { useEffect, useState } from "react";
import { IPackage } from "@/app/models/Package";
import PackageCard from "@/app/components/PackageCard";

export default function CustomerPackagesPage() {
  const [packages, setPackages] = useState<IPackage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApprovedPackages = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/packages?status=approved`); // Fetch only approved packages
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
    fetchApprovedPackages();
  }, []);

  if (isLoading)
    return <p className="text-center py-10">Loading available packages...</p>;
  if (error)
    return <p className="text-center text-red-500 py-10">Error: {error}</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
        Explore Our Tour Packages
      </h1>
      {packages.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">
          No tour packages available at the moment. Please check back later!
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {packages.map((pkg) => (
            <PackageCard
              key={pkg._id.toString()}
              pkg={pkg}
              customerView={true} // Enable "Book Now" link
            />
          ))}
        </div>
      )}
    </div>
  );
}
