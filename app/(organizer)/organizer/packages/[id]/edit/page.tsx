// app/(organizer)/organizer/packages/[id]/edit/page.tsx
"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { IPackage } from "@/app/models/Package";
import { IUser } from "@/app/models/User";

export default function EditPackagePage() {
  const router = useRouter();
  const params = useParams();
  const packageId = params.id as string;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [destination, setDestination] = useState("");
  const [duration, setDuration] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [currentOrganizerId, setCurrentOrganizerId] = useState(""); // Store the original organizer
  const [status, setStatus] = useState<IPackage["status"]>("pending");

  const [organizers, setOrganizers] = useState<IUser[]>([]); // For potentially changing organizer (admin feature?)

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!packageId) return;

    // Fetch existing package data
    const fetchPackageData = async () => {
      setIsFetching(true);
      setError(null);
      try {
        const res = await fetch(`/api/packages/${packageId}`);
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.message || "Failed to fetch package data");
        }
        const pkg: IPackage = await res.json();
        setName(pkg.name);
        setDescription(pkg.description);
        setDestination(pkg.destination);
        setDuration(pkg.duration.toString());
        setPrice(pkg.price.toString());
        setImageUrl(pkg.imageUrl || "");
        setStatus(pkg.status);
        setCurrentOrganizerId(
          (pkg.organizerId as IUser)._id?.toString() ||
          pkg.organizerId.toString(),
        );
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsFetching(false);
      }
    };
    fetchPackageData();

    // Fetch approved organizers (e.g. if admin can change it, or for display)
    const fetchOrganizers = async () => {
      try {
        const res = await fetch("/api/users?role=organizer&status=approved");
        if (!res.ok) throw new Error("Failed to fetch organizers");
        const data = await res.json();
        setOrganizers(data);
      } catch (err: any) {
        console.warn("Could not fetch organizers for selection:", err.message);
      }
    };
    fetchOrganizers();
  }, [packageId]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch(`/api/packages/${packageId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          destination,
          duration: parseInt(duration),
          price: parseFloat(price),
          imageUrl,
          organizerId: currentOrganizerId, // Keep original organizer for this simple case
          status, // Organizer might not be able to change status directly, admin does.
          // For now, let's allow it to be sent, but API can restrict.
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update package");
      }

      setSuccessMessage("Package updated successfully!");
      // router.push('/organizer/packages'); // Optionally redirect
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching)
    return <p className="text-center py-10">Loading package details...</p>;
  if (error && !name)
    return <p className="text-center text-red-500 py-10">Error: {error}</p>; // Show critical error if initial fetch failed

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Edit Tour Package
      </h1>
      {error && (
        <p className="text-red-500 bg-red-100 p-3 rounded mb-4">{error}</p>
      )}
      {successMessage && (
        <p className="text-green-500 bg-green-100 p-3 rounded mb-4">
          {successMessage}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Package Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label
            htmlFor="destination"
            className="block text-sm font-medium text-gray-700"
          >
            Destination <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="destination"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="duration"
              className="block text-sm font-medium text-gray-700"
            >
              Duration (days) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="duration"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              required
              min="1"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700"
            >
              Price (USD) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              min="0"
              step="0.01"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        </div>
        <div>
          <label
            htmlFor="imageUrl"
            className="block text-sm font-medium text-gray-700"
          >
            Image URL (Optional)
          </label>
          <input
            type="url"
            id="imageUrl"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="https://example.com/image.jpg"
          />
        </div>
        {/* Organizers typically cannot change package status directly; admins do. Can be shown as read-only. */}
        <div>
          <label
            htmlFor="status"
            className="block text-sm font-medium text-gray-700"
          >
            Current Status
          </label>
          <input
            type="text"
            id="status"
            value={status.charAt(0).toUpperCase() + status.slice(1)}
            readOnly
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 sm:text-sm"
          />
        </div>

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
          >
            {isLoading ? "Updating..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
