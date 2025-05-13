// app/(admin)/admin/manage-users/page.tsx
"use client";

import { useEffect, useState } from "react";
import { IUser } from "@/app/models/User";
import UserCard from "@/app/components/UserCard"; // Import UserCard

export default function ManageUsersPage() {
  const [users, setUsers] = useState<IUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("pending"); // Default to pending

  const fetchUsers = async (status?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/users${status ? `?status=${status}` : ""}`);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to fetch users");
      }
      const data = await res.json();
      setUsers(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(filterStatus);
  }, [filterStatus]);

  const handleApprove = async (userId: string) => {
    setError(null);
    try {
      const res = await fetch(`/api/users/${userId}/approve`, {
        method: "PATCH",
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to approve user");
      }
      fetchUsers(filterStatus); // Refresh list
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleReject = async (userId: string) => {
    setError(null);
    try {
      const res = await fetch(`/api/users/${userId}/reject`, {
        method: "PATCH",
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to reject user");
      }
      fetchUsers(filterStatus); // Refresh list
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Manage Users</h1>
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
          All Users
        </button>
      </div>

      {isLoading && (
        <p className="text-center text-gray-600">Loading users...</p>
      )}
      {!isLoading && users.length === 0 && (
        <p className="text-center text-gray-500">
          No users found for this filter.
        </p>
      )}

      {!isLoading && users.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user) => (
            <UserCard
              key={user._id.toString()}
              user={user}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          ))}
        </div>
      )}
    </div>
  );
}
