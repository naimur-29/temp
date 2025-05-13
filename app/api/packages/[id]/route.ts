// app/api/packages/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/lib/mongodb";
import PackageModel from "@/app/models/Package";
import UserModel from "@/app/models/User";
import mongoose from "mongoose";

// GET a single package by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  await dbConnect();
  const { id } = params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json(
      { message: "Invalid package ID" },
      { status: 400 },
    );
  }

  try {
    const pkg = await PackageModel.findById(id).populate(
      "organizerId",
      "name email",
    );
    if (!pkg) {
      return NextResponse.json(
        { message: "Package not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(pkg, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching package:", error);
    return NextResponse.json(
      { message: "Error fetching package", error: error.message },
      { status: 500 },
    );
  }
}

// PUT (Update) a package by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  await dbConnect();
  const { id } = params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json(
      { message: "Invalid package ID" },
      { status: 400 },
    );
  }

  try {
    const body = await request.json();
    // Add validation for body fields as needed
    const {
      name,
      description,
      destination,
      duration,
      price,
      imageUrl,
      status,
      organizerId,
    } = body;

    // Ensure organizerId is valid if provided and refers to an approved organizer
    if (organizerId) {
      if (!mongoose.Types.ObjectId.isValid(organizerId)) {
        return NextResponse.json(
          { message: "Invalid Organizer ID format" },
          { status: 400 },
        );
      }
      const organizer = await UserModel.findById(organizerId);
      if (
        !organizer ||
        organizer.role !== "organizer" ||
        organizer.status !== "approved"
      ) {
        return NextResponse.json(
          { message: "Invalid or unapproved organizer for package update" },
          { status: 400 },
        );
      }
    }

    const updatedPackage = await PackageModel.findByIdAndUpdate(
      id,
      body, // Pass the whole body for update, ensure only allowed fields are in body
      { new: true, runValidators: true },
    );

    if (!updatedPackage) {
      return NextResponse.json(
        { message: "Package not found for update" },
        { status: 404 },
      );
    }
    return NextResponse.json(updatedPackage, { status: 200 });
  } catch (error: any) {
    console.error("Error updating package:", error);
    if (error.name === "ValidationError") {
      return NextResponse.json(
        { message: "Validation Error", errors: error.errors },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { message: "Error updating package", error: error.message },
      { status: 500 },
    );
  }
}

// DELETE a package by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  await dbConnect();
  const { id } = params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json(
      { message: "Invalid package ID" },
      { status: 400 },
    );
  }

  try {
    const deletedPackage = await PackageModel.findByIdAndDelete(id);
    if (!deletedPackage) {
      return NextResponse.json(
        { message: "Package not found for deletion" },
        { status: 404 },
      );
    }
    // Consider also deleting related bookings or reviews, or marking package as 'archived'
    return NextResponse.json(
      { message: "Package deleted successfully" },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Error deleting package:", error);
    return NextResponse.json(
      { message: "Error deleting package", error: error.message },
      { status: 500 },
    );
  }
}
