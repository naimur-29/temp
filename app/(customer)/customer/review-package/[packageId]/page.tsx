// app/(customer)/customer/review-package/[packageId]/page.tsx
"use client";

import { useState, FormEvent, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { IUser } from "@/app/models/User"; // For customer selection

export default function ReviewPackagePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const packageId = params.packageId as string;
  const bookingId = searchParams.get("bookingId"); // Optional: to link review to specific booking

  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState("");
  const [customers, setCustomers] = useState<IUser[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Fetch approved customers for "acting as"
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
        setError("Could not load customer list: " + err.message);
      }
    };
    fetchCustomers();
  }, []);

  const handleCustomerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const custId = e.target.value;
    setSelectedCustomerId(custId);
    if (custId) {
      localStorage.setItem("selectedCustomerId", custId);
    } else {
      localStorage.removeItem("selectedCustomerId");
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setError("Please select a rating.");
      return;
    }
    if (!selectedCustomerId) {
      setError("Please select which customer is leaving the review.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          packageId,
          userId: selectedCustomerId,
          rating,
          comment,
          // bookingId, // Optionally send bookingId if your API/model uses it
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to submit review");
      }
      setSuccessMessage("Thank you for your review!");
      // Optionally redirect: router.push(`/customer/packages/${packageId}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded-lg shadow-md mt-10">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Leave a Review</h1>
      {error && (
        <p className="text-red-500 bg-red-100 p-3 rounded mb-4">{error}</p>
      )}
      {successMessage && (
        <p className="text-green-500 bg-green-100 p-3 rounded mb-4">
          {successMessage}
        </p>
      )}

      {!successMessage && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="customerSelectReview"
              className="block text-sm font-medium text-gray-700"
            >
              Reviewing As (Select Customer):{" "}
              <span className="text-red-500">*</span>
            </label>
            <select
              id="customerSelectReview"
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
                No approved customers found.
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Rating <span className="text-red-500">*</span>
            </label>
            <div className="flex space-x-1 mt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className={`p-2 rounded ${rating >= star ? "text-yellow-400" : "text-gray-300"} hover:text-yellow-400 focus:outline-none`}
                >
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                </button>
              ))}
            </div>
          </div>
          <div>
            <label
              htmlFor="comment"
              className="block text-sm font-medium text-gray-700"
            >
              Comment (Optional)
            </label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Share your experience..."
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !selectedCustomerId || rating === 0}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
          >
            {isLoading ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      )}
    </div>
  );
}
