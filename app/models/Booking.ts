// app/models/Booking.ts
import mongoose, { Document, Schema, Model, Types } from "mongoose";

export interface IBooking extends Document {
  _id: mongoose.Types.ObjectId;
  packageId: Types.ObjectId; // Ref to Package model
  userId: Types.ObjectId; // Ref to User model (customer)
  bookingDate: Date;
  numberOfTravelers: number;
  totalPrice: number;
  paymentStatus: "pending" | "paid" | "failed";
  createdAt?: Date;
  updatedAt?: Date;
}

const BookingSchema: Schema<IBooking> = new Schema(
  {
    packageId: { type: Schema.Types.ObjectId, ref: "Package", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    bookingDate: { type: Date, default: Date.now },
    numberOfTravelers: { type: Number, default: 1, min: 1 },
    totalPrice: { type: Number, required: true },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
  },
  { timestamps: true },
);

const BookingModel: Model<IBooking> =
  mongoose.models.Booking || mongoose.model<IBooking>("Booking", BookingSchema);

export default BookingModel;
