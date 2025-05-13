// app/components/PackageCard.tsx
import { IPackage } from "@/app/models/Package";
import Link from "next/link";
import { IUser } from "../models/User"; // Assuming IUser is defined in models/User

interface PackageCardProps {
  pkg: IPackage;
  showAdminActions?: boolean;
  onApprove?: (packageId: string) => void;
  onReject?: (packageId: string) => void;
  showOrganizerActions?: boolean;
  onEdit?: (packageId: string) => void;
  onDelete?: (packageId: string) => void;
  customerView?: boolean; // For customer booking link
}

const PackageCard: React.FC<PackageCardProps> = ({
  pkg,
  showAdminActions,
  onApprove,
  onReject,
  showOrganizerActions,
  onEdit,
  onDelete,
  customerView,
}) => {
  const organizer = pkg.organizerId as IUser; // Assume populated

  return (
    <div
      key={pkg._id.toString()}
      className="bg-white p-4 md:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow flex flex-col justify-between"
    >
      <div>
        {pkg.imageUrl && (
          <img
            src={pkg.imageUrl}
            alt={pkg.name}
            className="w-full h-40 md:h-48 object-cover rounded mb-3"
            onError={(e) => (e.currentTarget.style.display = "none")} // Hide if image fails to load
          />
        )}
        <h2 className="text-xl font-semibold mb-2 text-blue-700">{pkg.name}</h2>
        <p className="text-gray-600 mb-1 text-sm line-clamp-3">
          {pkg.description}
        </p>
        <p className="text-gray-700 mb-1 text-sm">
          <strong>Destination:</strong> {pkg.destination}
        </p>
        <p className="text-gray-700 mb-1 text-sm">
          <strong>Duration:</strong> {pkg.duration} days
        </p>
        <p className="text-gray-800 font-bold mb-2 text-lg">
          ${pkg.price.toFixed(2)}
        </p>
        <p className="text-sm mb-1">
          Status:{" "}
          <span
            className={`font-semibold ${pkg.status === "pending"
                ? "text-yellow-600"
                : pkg.status === "approved"
                  ? "text-green-600"
                  : pkg.status === "rejected"
                    ? "text-red-600"
                    : pkg.status === "archived"
                      ? "text-gray-500"
                      : "text-gray-600"
              }`}
          >
            {pkg.status.charAt(0).toUpperCase() + pkg.status.slice(1)}
          </span>
        </p>
        {organizer && organizer.name && (
          <p className="text-xs text-gray-500 mb-3">
            Organizer: {organizer.name}
          </p>
        )}
      </div>

      <div className="mt-auto pt-3">
        {showAdminActions &&
          pkg.status === "pending" &&
          onApprove &&
          onReject && (
            <div className="flex space-x-2">
              <button
                onClick={() => onApprove(pkg._id.toString())}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-3 rounded text-sm w-full"
              >
                Approve
              </button>
              <button
                onClick={() => onReject(pkg._id.toString())}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-3 rounded text-sm w-full"
              >
                Reject
              </button>
            </div>
          )}
        {showOrganizerActions && onEdit && onDelete && (
          <div className="flex space-x-2 mt-2">
            <button
              onClick={() => onEdit(pkg._id.toString())}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-3 rounded text-sm w-1/2"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(pkg._id.toString())}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-3 rounded text-sm w-1/2"
            >
              Delete
            </button>
          </div>
        )}
        {customerView && pkg.status === "approved" && (
          <Link
            href={`/customer/book-package/${pkg._id.toString()}`}
            className="block w-full text-center bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded text-sm mt-2"
          >
            Book Now
          </Link>
        )}
      </div>
    </div>
  );
};

export default PackageCard;
