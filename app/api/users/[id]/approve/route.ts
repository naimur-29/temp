// app/api/users/[id]/approve/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/lib/mongodb";
import UserModel from "@/app/models/User";
import mongoose from "mongoose";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  await dbConnect();
  const { id } = params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ message: "Invalid user ID" }, { status: 400 });
  }

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      id,
      { status: "approved" },
      { new: true },
    );

    if (!updatedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error: any) {
    console.error("Error approving user:", error);
    return NextResponse.json(
      { message: "Error approving user", error: error.message },
      { status: 500 },
    );
  }
}
