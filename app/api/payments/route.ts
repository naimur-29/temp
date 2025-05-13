// app/api/payments/route.ts (Mock Payment Endpoint)
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/lib/mongodb";
import BookingModel from "@/app/models/Booking";
import mongoose from "mongoose";

// POST to simulate a payment for a booking
export async function POST(request: NextRequest) {
  await dbConnect();
  try {
    const body = await request.json();
    const { bookingId } = body;

    if (!bookingId) {
      return NextResponse.json(
        { message: "Booking ID is required for payment" },
        { status: 400 },
      );
    }
    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      return NextResponse.json(
        { message: "Invalid Booking ID format" },
        { status: 400 },
      );
    }

    const booking = await BookingModel.findById(bookingId);
    if (!booking) {
      return NextResponse.json(
        { message: "Booking not found" },
        { status: 404 },
      );
    }

    if (booking.paymentStatus === "paid") {
      return NextResponse.json(
        { message: "This booking is already paid" },
        { status: 400 },
      );
    }

    // Simulate payment success
    booking.paymentStatus = "paid";
    await booking.save();

    return NextResponse.json(
      { message: "Payment successful", booking },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Error processing payment:", error);
    return NextResponse.json(
      { message: "Error processing payment", error: error.message },
      { status: 500 },
    );
  }
}
