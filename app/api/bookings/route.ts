// app/api/bookings/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/lib/mongodb";
import BookingModel from "@/app/models/Booking";
import PackageModel from "@/app/models/Package";
import UserModel from "@/app/models/User";
import mongoose from "mongoose";

// GET all bookings (optionally filter by userId or packageId)
export async function GET(request: NextRequest) {
  await dbConnect();
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("userId");
    const packageId = searchParams.get("packageId");

    const query: any = {};
    if (userId) {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return NextResponse.json(
          { message: "Invalid User ID for filtering bookings" },
          { status: 400 },
        );
      }
      query.userId = userId;
    }
    if (packageId) {
      if (!mongoose.Types.ObjectId.isValid(packageId)) {
        return NextResponse.json(
          { message: "Invalid Package ID for filtering bookings" },
          { status: 400 },
        );
      }
      query.packageId = packageId;
    }

    const bookings = await BookingModel.find(query)
      .populate("packageId", "name destination price")
      .populate("userId", "name email");
    return NextResponse.json(bookings, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { message: "Error fetching bookings", error: error.message },
      { status: 500 },
    );
  }
}

// POST: Create a new booking
export async function POST(request: NextRequest) {
  await dbConnect();
  try {
    const body = await request.json();
    const { packageId, userId, numberOfTravelers } = body;

    if (!packageId || !userId || !numberOfTravelers) {
      return NextResponse.json(
        {
          message: "Package ID, User ID, and Number of Travelers are required",
        },
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

    const tourPackage = await PackageModel.findById(packageId);
    if (!tourPackage) {
      return NextResponse.json(
        { message: "Package not found" },
        { status: 404 },
      );
    }
    if (tourPackage.status !== "approved") {
      return NextResponse.json(
        {
          message:
            "This package is not currently available for booking (not approved).",
        },
        { status: 400 },
      );
    }

    const customer = await UserModel.findById(userId);
    if (
      !customer ||
      customer.role !== "customer" ||
      customer.status !== "approved"
    ) {
      return NextResponse.json(
        { message: "Invalid or unapproved customer account for booking." },
        { status: 400 },
      );
    }

    const totalPrice = tourPackage.price * Number(numberOfTravelers);

    const newBooking = new BookingModel({
      packageId,
      userId,
      numberOfTravelers: Number(numberOfTravelers),
      totalPrice,
      paymentStatus: "pending", // Default payment status
    });

    await newBooking.save();
    return NextResponse.json(newBooking, { status: 201 });
  } catch (error: any) {
    console.error("Error creating booking:", error);
    return NextResponse.json(
      { message: "Error creating booking", error: error.message },
      { status: 500 },
    );
  }
}
