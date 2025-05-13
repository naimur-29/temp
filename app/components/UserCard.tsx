// app/components/UserCard.tsx
import { IUser } from "@/app/models/User";

interface UserCardProps {
  user: IUser;
  onApprove?: (userId: string) => void;
  onReject?: (userId: string) => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, onApprove, onReject }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <h3 className="text-lg font-semibold text-gray-800">{user.name}</h3>
      <p className="text-sm text-gray-600">{user.email}</p>
      <p className="text-sm text-gray-500">
        Role:{" "}
        <span className="font-medium">
          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
        </span>
      </p>
      <p className="text-sm">
        Status:{" "}
        <span
          className={`font-semibold ${user.status === "pending"
              ? "text-yellow-600"
              : user.status === "approved"
                ? "text-green-600"
                : user.status === "rejected"
                  ? "text-red-600"
                  : "text-gray-600"
            }`}
        >
          {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
        </span>
      </p>
      {user.status === "pending" && onApprove && onReject && (
        <div className="mt-3 flex space-x-2">
          <button
            onClick={() => onApprove(user._id.toString())}
            className="bg-green-500 hover:bg-green-600 text-white text-xs font-bold py-1 px-3 rounded"
          >
            Approve
          </button>
          <button
            onClick={() => onReject(user._id.toString())}
            className="bg-red-500 hover:bg-red-600 text-white text-xs font-bold py-1 px-3 rounded"
          >
            Reject
          </button>
        </div>
      )}
    </div>
  );
};

export default UserCard;
