// app/models/User.ts
import mongoose, { Document, Schema, Model } from "mongoose";

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId; // Explicitly add _id for clarity
  name: string;
  email: string;
  role: "customer" | "organizer" | "admin";
  status: "pending" | "approved" | "rejected";
  createdAt?: Date;
  updatedAt?: Date;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: {
      type: String,
      enum: ["customer", "organizer", "admin"],
      default: "customer",
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true },
);

const UserModel: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default UserModel;
