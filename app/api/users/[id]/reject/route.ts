// app/api/users/[id]/reject/route.ts
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
      { status: "rejected" },
      { new: true },
    );

    if (!updatedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error: any) {
    console.error("Error rejecting user:", error);
    return NextResponse.json(
      { message: "Error rejecting user", error: error.message },
      { status: 500 },
    );
  }
}
