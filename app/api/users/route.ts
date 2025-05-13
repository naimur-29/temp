// app/api/users/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/lib/mongodb";
import UserModel from "@/app/models/User";

// GET all users or filter by status/role
export async function GET(request: NextRequest) {
  await dbConnect();
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status");
    const role = searchParams.get("role");

    const query: any = {};
    if (status) query.status = status;
    if (role) query.role = role;

    const users = await UserModel.find(query);
    return NextResponse.json(users, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { message: "Error fetching users", error: error.message },
      { status: 500 },
    );
  }
}

// POST: Create a new user (e.g., basic registration, or admin creating users)
export async function POST(request: NextRequest) {
  await dbConnect();
  try {
    const body = await request.json();
    const { name, email, role } = body; // Explicitly destructure expected fields

    if (!name || !email) {
      return NextResponse.json(
        { message: "Name and email are required" },
        { status: 400 },
      );
    }
    // Basic email format validation (can be more robust)
    if (!/\S+@\S+\.\S+/.test(email)) {
      return NextResponse.json(
        { message: "Invalid email format" },
        { status: 400 },
      );
    }

    // Default role to customer if not provided, default status to pending
    const newUser = new UserModel({
      name,
      email,
      role: role || "customer",
      status: body.status || "pending", // Allow status override if needed, else pending
    });
    await newUser.save();
    return NextResponse.json(newUser, { status: 201 });
  } catch (error: any) {
    console.error("Error creating user:", error);
    if (error.code === 11000) {
      // Duplicate key error (email)
      return NextResponse.json(
        { message: "Email already exists.", errorDetail: error.message },
        { status: 409 },
      );
    }
    if (error.name === "ValidationError") {
      return NextResponse.json(
        { message: "Validation Error creating user", errors: error.errors },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { message: "Error creating user", error: error.message },
      { status: 500 },
    );
  }
}
