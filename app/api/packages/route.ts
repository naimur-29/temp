// app/api/packages/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/lib/mongodb";
import PackageModel from "@/app/models/Package";
import UserModel from "@/app/models/User"; // To verify organizerId
import mongoose from "mongoose"; // For ObjectId validation

// GET all packages or filter by status/organizerId
export async function GET(request: NextRequest) {
  await dbConnect();
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status");
    const organizerId = searchParams.get("organizerId");

    const query: any = {};
    if (status) query.status = status;
    if (organizerId) {
      if (!mongoose.Types.ObjectId.isValid(organizerId)) {
        return NextResponse.json(
          { message: "Invalid Organizer ID format for filtering" },
          { status: 400 },
        );
      }
      query.organizerId = organizerId;
    }

    const packages = await PackageModel.find(query).populate(
      "organizerId",
      "name email",
    );
    return NextResponse.json(packages, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching packages:", error);
    return NextResponse.json(
      { message: "Error fetching packages", error: error.message },
      { status: 500 },
    );
  }
}

// POST: Create a new package (by an organizer)
export async function POST(request: NextRequest) {
  await dbConnect();
  try {
    const body = await request.json();
    const {
      name,
      description,
      destination,
      duration,
      price,
      organizerId,
      imageUrl,
    } = body;

    if (
      !name ||
      !description ||
      !destination ||
      !duration ||
      !price ||
      !organizerId
    ) {
      return NextResponse.json(
        { message: "Missing required package fields or organizerId" },
        { status: 400 },
      );
    }
    if (!mongoose.Types.ObjectId.isValid(organizerId)) {
      return NextResponse.json(
        { message: "Invalid Organizer ID format" },
        { status: 400 },
      );
    }

    const organizer = await UserModel.findById(organizerId);
    if (!organizer || organizer.role !== "organizer") {
      return NextResponse.json(
        { message: "Invalid organizer ID or user is not an organizer role" },
        { status: 400 },
      );
    }
    if (organizer.status !== "approved") {
      return NextResponse.json(
        {
          message:
            "Organizer account is not approved yet. Cannot create package.",
        },
        { status: 403 },
      );
    }

    const newPackage = new PackageModel({
      name,
      description,
      destination,
      duration: Number(duration),
      price: Number(price),
      organizerId,
      imageUrl,
      status: "pending", // New packages require admin approval
    });
    await newPackage.save();
    return NextResponse.json(newPackage, { status: 201 });
  } catch (error: any) {
    console.error("Error creating package:", error);
    if (error.name === "ValidationError") {
      return NextResponse.json(
        { message: "Validation Error creating package", errors: error.errors },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { message: "Error creating package", error: error.message },
      { status: 500 },
    );
  }
}
