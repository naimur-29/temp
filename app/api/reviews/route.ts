// app/api/reviews/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/lib/mongodb";
import ReviewModel from "@/app/models/Review";
import BookingModel from "@/app/models/Booking"; // To check if user booked the package
import mongoose from "mongoose";

// GET reviews (e.g., for a specific package)
export async function GET(request: NextRequest) {
  await dbConnect();
  const searchParams = request.nextUrl.searchParams;
  const packageId = searchParams.get("packageId");

  if (!packageId || !mongoose.Types.ObjectId.isValid(packageId)) {
    return NextResponse.json(
      { message: "Valid Package ID is required to fetch reviews" },
      { status: 400 },
    );
  }

  try {
    const reviews = await ReviewModel.find({ packageId }).populate(
      "userId",
      "name",
    );
    return NextResponse.json(reviews, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { message: "Error fetching reviews", error: error.message },
      { status: 500 },
    );
  }
}

// POST: Create a new review
export async function POST(request: NextRequest) {
  await dbConnect();
  try {
    const body = await request.json();
    const { packageId, userId, rating, comment } = body;

    if (!packageId || !userId || !rating) {
      return NextResponse.json(
        { message: "Package ID, User ID, and Rating are required" },
        { status: 400 },
      );
    }
    if (
      !mongoose.Types.ObjectId.isValid(packageId) ||
      !mongoose.Types.ObjectId.isValid(userId)
    ) {
      return NextResponse.json(
        { message: "Invalid Package ID or User ID format" },
        { status: 400 },
      );
    }
    if (Number(rating) < 1 || Number(rating) > 5) {
      return NextResponse.json(
        { message: "Rating must be between 1 and 5" },
        { status: 400 },
      );
    }

    // Optional: Check if the user actually booked and paid for this package
    // const existingBooking = await BookingModel.findOne({ userId, packageId, paymentStatus: 'paid' });
    // if (!existingBooking) {
    //   return NextResponse.json({ message: 'You can only review packages you have booked and paid for.' }, { status: 403 });
    // }

    // Optional: Check if user already reviewed this package
    // const existingReview = await ReviewModel.findOne({ userId, packageId });
    // if (existingReview) {
    //     return NextResponse.json({ message: 'You have already reviewed this package.' }, { status: 409 });
    // }

    const newReview = new ReviewModel({
      packageId,
      userId,
      rating: Number(rating),
      comment,
    });

    await newReview.save();
    return NextResponse.json(newReview, { status: 201 });
  } catch (error: any) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      { message: "Error creating review", error: error.message },
      { status: 500 },
    );
  }
}
