// app/(customer)/customer/book-package/[id]/page.tsx
"use client";

import { useEffect, useState, FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import { IPackage } from "@/app/models/Package";
import { IUser } from "@/app/models/User"; // For customer selection

export default function BookPackagePage() {
  const params = useParams();
  const router = useRouter();
  const packageId = params.id as string;

  const [pkg, setPkg] = useState<IPackage | null>(null);
  const [customers, setCustomers] = useState<IUser[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("");
  const [numberOfTravelers, setNumberOfTravelers] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isBooking, setIsBooking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    // Fetch package details
    if (packageId) {
      const fetchPackage = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const res = await fetch(`/api/packages/${packageId}`);
          if (!res.ok) {
            const errData = await res.json();
            throw new Error(
              errData.message || "Failed to fetch package details",
            );
          }
          const data: IPackage = await res.json();
          if (data.status !== "approved") {
            throw new Error("This package is not available for booking.");
          }
          setPkg(data);
        } catch (err: any) {
          setError(err.message);
          setPkg(null);
        } finally {
          setIsLoading(false);
        }
      };
      fetchPackage();
    }

    // Fetch approved customers for the dropdown (simulating user selection)
    const fetchCustomers = async () => {
      try {
        const res = await fetch("/api/users?role=customer&status=approved");
        if (!res.ok) throw new Error("Failed to fetch customers");
        const data = await res.json();
        setCustomers(data);
        if (data.length > 0) {
          // Try to get from localStorage or default to first
          const storedCustId = localStorage.getItem("selectedCustomerId");
          if (
            storedCustId &&
            data.find((c: IUser) => c._id.toString() === storedCustId)
          ) {
            setSelectedCustomerId(storedCustId);
          } else {
            setSelectedCustomerId(data[0]._id.toString());
          }
        }
      } catch (err: any) {
        console.warn("Could not fetch customers for selection:", err.message);
      }
    };
    fetchCustomers();
  }, [packageId]);

  const handleCustomerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const custId = e.target.value;
    setSelectedCustomerId(custId);
    if (custId) {
      localStorage.setItem("selectedCustomerId", custId);
    } else {
      localStorage.removeItem("selectedCustomerId");
    }
  };

  const handleBooking = async (e: FormEvent) => {
    e.preventDefault();
    if (!pkg || !selectedCustomerId) {
      setError("Package details or customer selection missing.");
      return;
    }
    setIsBooking(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          packageId: pkg._id,
          userId: selectedCustomerId,
          numberOfTravelers: Number(numberOfTravelers),
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to create booking");
      }
      setSuccessMessage(
        `Booking successful! Your booking ID is ${data._id}. Total: $${data.totalPrice.toFixed(2)}`,
      );
      // router.push('/customer/my-bookings'); // Redirect or show success
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsBooking(false);
    }
  };

  if (isLoading) return <p className="text-center py-10">Loading package...</p>;
  if (error && !pkg)
    return <p className="text-center text-red-500 py-10">Error: {error}</p>;
  if (!pkg)
    return (
      <p className="text-center py-10">Package not found or not available.</p>
    );

  return (
    <div className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-xl mt-10">
      <h1 className="text-3xl font-bold mb-2 text-gray-800">
        Book: {pkg.name}
      </h1>
      <p className="text-lg text-gray-600 mb-1">
        Destination: {pkg.destination}
      </p>
      <p className="text-2xl font-semibold text-indigo-600 mb-6">
        Price: ${pkg.price.toFixed(2)} per person
      </p>

      {error && (
        <p className="text-red-500 bg-red-100 p-3 rounded mb-4">{error}</p>
      )}
      {successMessage && (
        <p className="text-green-500 bg-green-100 p-3 rounded mb-4">
          {successMessage}
        </p>
      )}

      {!successMessage && (
        <form onSubmit={handleBooking} className="space-y-6">
          <div>
            <label
              htmlFor="customerSelect"
              className="block text-sm font-medium text-gray-700"
            >
              Book As (Select Customer): <span className="text-red-500">*</span>
            </label>
            <select
              id="customerSelect"
              value={selectedCustomerId}
              onChange={handleCustomerChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">-- Select a Customer --</option>
              {customers.map((cust) => (
                <option key={cust._id.toString()} value={cust._id.toString()}>
                  {cust.name} ({cust.email})
                </option>
              ))}
            </select>
            {customers.length === 0 && (
              <p className="text-xs text-gray-500 mt-1">
                No approved customers found to book as.
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="travelers"
              className="block text-sm font-medium text-gray-700"
            >
              Number of Travelers: <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="travelers"
              value={numberOfTravelers}
              onChange={(e) =>
                setNumberOfTravelers(Math.max(1, parseInt(e.target.value)))
              }
              min="1"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div className="text-xl font-medium text-gray-700">
            Total Price:{" "}
            <span className="text-indigo-700 font-bold">
              ${(pkg.price * numberOfTravelers).toFixed(2)}
            </span>
          </div>

          <button
            type="submit"
            disabled={
              isBooking || !selectedCustomerId || customers.length === 0
            }
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
          >
            {isBooking ? "Processing Booking..." : "Confirm Booking"}
          </button>
        </form>
      )}
      {successMessage && (
        <button
          onClick={() => router.push("/customer/my-bookings")}
          className="mt-4 w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          View My Bookings
        </button>
      )}
    </div>
  );
}
