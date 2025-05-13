// app/models/Package.ts
import mongoose, { Document, Schema, Model, Types } from "mongoose";
import { IUser } from "./User"; // Import IUser for populated organizer type

export interface IPackage extends Document {
  _id: mongoose.Types.ObjectId; // Explicitly add _id
  name: string;
  description: string;
  destination: string;
  duration: number;
  price: number;
  organizerId: Types.ObjectId | IUser; // Can be ObjectId or populated IUser
  status: "pending" | "approved" | "rejected" | "archived";
  imageUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const PackageSchema: Schema<IPackage> = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    destination: { type: String, required: true },
    duration: { type: Number, required: true },
    price: { type: Number, required: true },
    organizerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "archived"],
      default: "pending",
    },
    imageUrl: { type: String },
  },
  { timestamps: true },
);

const PackageModel: Model<IPackage> =
  mongoose.models.Package || mongoose.model<IPackage>("Package", PackageSchema);

export default PackageModel;
