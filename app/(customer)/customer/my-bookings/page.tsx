// app/(customer)/customer/my-bookings/page.tsx
"use client";

import { useEffect, useState } from "react";
import { IBooking } from "@/app/models/Booking";
import { IUser } from "@/app/models/User"; // For customer selection
import { IPackage } from "@/app/models/Package"; // For populated package type

interface PopulatedBooking extends IBooking {
  packageId: IPackage; // Assume packageId is populated
  userId: IUser; // Assume userId is populated
}

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<PopulatedBooking[]>([]);
  const [customers, setCustomers] = useState<IUser[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentMessage, setPaymentMessage] = useState<string | null>(null);

  // Fetch approved customers for the dropdown (simulating user selection)
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await fetch("/api/users?role=customer&status=approved");
        if (!res.ok) throw new Error("Failed to fetch customers");
        const data = await res.json();
        setCustomers(data);
        if (data.length > 0) {
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
        setError(err.message); // Show error if customers can't be fetched
      }
    };
    fetchCustomers();
  }, []);

  // Fetch bookings for the selected customer
  useEffect(() => {
    if (!selectedCustomerId) {
      setBookings([]);
      setIsLoading(false);
      return;
    }

    const fetchBookings = async () => {
      setIsLoading(true);
      setError(null);
      setPaymentMessage(null);
      try {
        const res = await fetch(`/api/bookings?userId=${selectedCustomerId}`);
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Failed to fetch bookings");
        }
        const data = await res.json();
        setBookings(data);
      } catch (err: any) {
        setError(err.message);
        setBookings([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBookings();
  }, [selectedCustomerId]);

  const handleCustomerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const custId = e.target.value;
    setSelectedCustomerId(custId);
    if (custId) {
      localStorage.setItem("selectedCustomerId", custId);
    } else {
      localStorage.removeItem("selectedCustomerId");
    }
  };

  const handleMockPayment = async (bookingId: string) => {
    setPaymentMessage(null);
    setError(null);
    try {
      const res = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Payment failed");
      }
      setPaymentMessage(data.message);
      // Refresh bookings to show updated status
      if (selectedCustomerId) {
        const refreshRes = await fetch(
          `/api/bookings?userId=${selectedCustomerId}`,
        );
        const refreshedData = await refreshRes.json();
        setBookings(refreshedData);
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">My Bookings</h1>

      {error && (
        <p className="text-red-500 bg-red-100 p-3 rounded mb-4">
          Error: {error}
        </p>
      )}
      {paymentMessage && (
        <p className="text-green-500 bg-green-100 p-3 rounded mb-4">
          {paymentMessage}
        </p>
      )}

      <div className="mb-6">
        <label
          htmlFor="customerSelectMyBookings"
          className="block text-sm font-medium text-gray-700"
        >
          Viewing Bookings for Customer:
        </label>
        <select
          id="customerSelectMyBookings"
          value={selectedCustomerId}
          onChange={handleCustomerChange}
          className="mt-1 block w-full md:w-1/2 lg:w-1/3 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="">-- Select a Customer --</option>
          {customers.map((cust) => (
            <option key={cust._id.toString()} value={cust._id.toString()}>
              {cust.name} ({cust.email})
            </option>
          ))}
        </select>
        {customers.length === 0 && !isLoading && (
          <p className="text-sm text-gray-500 mt-1">
            No approved customers found.
          </p>
        )}
      </div>

      {isLoading && (
        <p className="text-center text-gray-600">Loading your bookings...</p>
      )}
      {!isLoading && !selectedCustomerId && customers.length > 0 && (
        <p className="text-center text-gray-500">
          Please select a customer to view their bookings.
        </p>
      )}
      {!isLoading && selectedCustomerId && bookings.length === 0 && (
        <p className="text-center text-gray-500">
          You have no bookings yet.{" "}
          <Link
            href="/customer/packages"
            className="text-blue-500 hover:underline"
          >
            Explore packages!
          </Link>
        </p>
      )}

      {!isLoading && bookings.length > 0 && (
        <div className="space-y-6">
          {bookings.map((booking) => (
            <div
              key={booking._id.toString()}
              className="bg-white p-6 rounded-lg shadow-md"
            >
              <h2 className="text-xl font-semibold text-blue-700 mb-2">
                {booking.packageId?.name || "Package Name Unavailable"}
              </h2>
              <p className="text-gray-600">
                Destination: {booking.packageId?.destination || "N/A"}
              </p>
              <p className="text-gray-600">
                Booking Date:{" "}
                {new Date(booking.bookingDate).toLocaleDateString()}
              </p>
              <p className="text-gray-600">
                Travelers: {booking.numberOfTravelers}
              </p>
              <p className="text-gray-700 font-semibold">
                Total Price: ${booking.totalPrice.toFixed(2)}
              </p>
              <p className="mt-1">
                Payment Status:
                <span
                  className={`ml-2 font-semibold ${booking.paymentStatus === "paid"
                      ? "text-green-600"
                      : booking.paymentStatus === "pending"
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                >
                  {booking.paymentStatus.charAt(0).toUpperCase() +
                    booking.paymentStatus.slice(1)}
                </span>
              </p>
              {booking.paymentStatus === "pending" && (
                <button
                  onClick={() => handleMockPayment(booking._id.toString())}
                  className="mt-3 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded text-sm"
                >
                  Make Payment (Mock)
                </button>
              )}
              {/* Placeholder for Review Button */}
              {booking.paymentStatus === "paid" && (
                <Link
                  href={`/customer/review-package/${booking.packageId?._id?.toString()}?bookingId=${booking._id.toString()}`}
                  className="mt-3 ml-2 inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded text-sm"
                >
                  Leave a Review
                </Link>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
