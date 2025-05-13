// app/models/Review.ts
import mongoose, { Document, Schema, Model, Types } from "mongoose";

export interface IReview extends Document {
  _id: mongoose.Types.ObjectId;
  packageId: Types.ObjectId; // Ref to Package model
  userId: Types.ObjectId; // Ref to User model (customer)
  rating: number; // 1-5
  comment?: string;
  reviewDate: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const ReviewSchema: Schema<IReview> = new Schema(
  {
    packageId: { type: Schema.Types.ObjectId, ref: "Package", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String },
    reviewDate: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

const ReviewModel: Model<IReview> =
  mongoose.models.Review || mongoose.model<IReview>("Review", ReviewSchema);

export default ReviewModel;
